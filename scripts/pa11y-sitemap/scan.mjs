/**
 * Fetch SITE_URL sitemap (including sitemap indexes), then run Pa11y on each page
 * URL that matches the site hostname. Prints a JSON array of issues (same shape as
 * `pa11y --reporter json`) to stdout, with `pageUrl` per issue and `pa11yTheme`
 * (`light` | `dark`) when the page was scanned in that colour mode.
 *
 * Env: SITE_URL (required), SITEMAP_URL (optional, default SITE_URL/sitemap.xml),
 * PA11Y_CONFIG (optional, default /tmp/pa11y.json), PA11Y_MAX_PAGES (optional cap).
 * PA11Y_RUNNERS (optional, comma-separated; unset in scan.mjs = axe+htmlcs; Azure pipeline defaults to axe).
 * PA11Y_WAIT_MS / PA11Y_TIMEOUT_MS (optional) — override JSON wait / timeout per page.
 * PA11Y_HARD_TIMEOUT_MS (optional) — AbortController-style hard cap per scan (default: timeout + 60s).
 * PA11Y_MAX_DURATION_MS (optional) — overall scan budget before writing partial results (default: 90m).
 * PA11Y_THEMES (optional) — comma-separated `light` and/or `dark` (default: both). Uses #modeSwitcher
 *   (hugo-theme-bootstrap) so each URL is scanned in each colour mode.
 *
 * pa11y-pipeline.json ignores axe rule frame-tested: cross-origin iframes (e.g. Giscus, Twitter)
 * cannot be scanned inside the frame; the rule only reports that limitation.
 */

import { readFileSync } from 'node:fs';
import pa11y from 'pa11y';
import puppeteer from 'puppeteer';

const siteUrlRaw = (process.env.SITE_URL || '').trim();
if (!siteUrlRaw) {
  console.error('SITE_URL is required');
  process.exit(1);
}

const siteUrl = siteUrlRaw.replace(/\/$/, '');
const baseOrigin = new URL(siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`).origin;
const hostname = new URL(baseOrigin).hostname;

const sitemapUrl = (process.env.SITEMAP_URL || `${siteUrl}/sitemap.xml`).trim();

const maxPagesEnv = process.env.PA11Y_MAX_PAGES;
const maxPages =
  maxPagesEnv !== undefined && maxPagesEnv !== ''
    ? Math.max(0, parseInt(maxPagesEnv, 10))
    : 0;

const configPath = process.env.PA11Y_CONFIG || '/tmp/pa11y.json';
let fileConfig = {};
try {
  fileConfig = JSON.parse(readFileSync(configPath, 'utf8'));
} catch (e) {
  console.error(`Could not read ${configPath}:`, e.message);
  process.exit(1);
}

const { chromeLaunchConfig = {}, ...restFileConfig } = fileConfig;

const runnersFromEnv = process.env.PA11Y_RUNNERS?.trim();
const runners = runnersFromEnv
  ? runnersFromEnv.split(',').map((r) => r.trim()).filter(Boolean)
  : ['axe', 'htmlcs'];

function intEnv(name, fallback) {
  const v = process.env[name];
  if (v === undefined || v === '') {
    return fallback;
  }
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

const waitMs = intEnv('PA11Y_WAIT_MS', restFileConfig.wait ?? 0);
const timeoutMs = intEnv('PA11Y_TIMEOUT_MS', restFileConfig.timeout ?? 60000);
/** Hard cap so a stuck Puppeteer/action wait cannot hold the runner until the GHA 6h cancel. */
const hardTimeoutMs = intEnv('PA11Y_HARD_TIMEOUT_MS', timeoutMs + 60_000);
/** Overall budget (default 90m). Healthy full scans are ~45m; leave headroom under GHA limits. */
const maxDurationMs = intEnv('PA11Y_MAX_DURATION_MS', 90 * 60_000);

const themesFromEnv = process.env.PA11Y_THEMES?.trim();
const themes = (() => {
  const raw = themesFromEnv
    ? themesFromEnv
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t === 'light' || t === 'dark')
    : ['light', 'dark'];
  return raw.length > 0 ? raw : ['light', 'dark'];
})();

/** Pa11y actions before axe/htmlcs: align with hugo-theme-bootstrap ModeSwitcher (mode.ts). */
function themeActions(theme) {
  const wait = 'wait for element #modeSwitcher to be visible';
  if (theme === 'dark') {
    return [wait, 'check field #modeSwitcher'];
  }
  return [wait, 'uncheck field #modeSwitcher'];
}

function withHardTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Hard timeout after ${ms}ms: ${label}`));
    }, ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function fetchText(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent':
        restFileConfig.userAgent ||
        'Mozilla/5.0 (compatible; Pa11ySitemap/1.0; +https://pa11y.org/)',
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  return res.text();
}

function extractLocs(xml) {
  const locs = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(xml))) {
    locs.push(m[1].trim());
  }
  return locs;
}

async function collectPageUrlsFromSitemap(url, seen = new Set()) {
  if (seen.has(url)) {
    return [];
  }
  seen.add(url);

  const xml = await fetchText(url);

  if (/<sitemapindex[\s>]/i.test(xml)) {
    const nested = extractLocs(xml);
    const out = [];
    for (const loc of nested) {
      out.push(...(await collectPageUrlsFromSitemap(loc, seen)));
    }
    return out;
  }

  if (/<urlset[\s>]/i.test(xml)) {
    return extractLocs(xml);
  }

  console.error(`Unrecognized sitemap XML at ${url}`);
  return [];
}

function sameHost(urlString) {
  try {
    return new URL(urlString).hostname === hostname;
  } catch {
    return false;
  }
}

function sortUrlsHomeFirst(list) {
  const homeVariants = new Set([siteUrl, `${siteUrl}/`]);
  return [...list].sort((a, b) => {
    const ra = homeVariants.has(a) ? 0 : 1;
    const rb = homeVariants.has(b) ? 0 : 1;
    if (ra !== rb) {
      return ra - rb;
    }
    return a.localeCompare(b);
  });
}

async function main() {
  const startedAt = Date.now();
  console.error(`Fetching sitemap: ${sitemapUrl}`);
  let urls = await collectPageUrlsFromSitemap(sitemapUrl);
  urls = sortUrlsHomeFirst([...new Set(urls)].filter((u) => sameHost(u)));

  console.error(`Found ${urls.length} URL(s) for host ${hostname}`);
  console.error(
    `Pa11y runners: ${runners.join(', ')}; themes=${themes.join(',')}; wait=${waitMs}ms timeout=${timeoutMs}ms hardTimeout=${hardTimeoutMs}ms maxDuration=${maxDurationMs}ms`,
  );

  if (maxPages > 0 && urls.length > maxPages) {
    console.error(`PA11Y_MAX_PAGES=${maxPages}: scanning first ${maxPages} URLs only`);
    urls = urls.slice(0, maxPages);
  }

  if (urls.length === 0) {
    console.error('No URLs to scan after sitemap parse and host filter.');
    process.exit(1);
  }

  const launchOpts = {
    ...chromeLaunchConfig,
  };

  let browser = await puppeteer.launch(launchOpts);

  async function relaunchBrowser(reason) {
    console.error(`Relaunching Chromium (${reason})…`);
    try {
      await browser.close();
    } catch (closeErr) {
      console.error(`browser.close() after hang: ${closeErr?.message ?? closeErr}`);
    }
    browser = await puppeteer.launch(launchOpts);
  }

  const pa11yBase = {
    ...restFileConfig,
    wait: waitMs,
    timeout: timeoutMs,
    runners,
    log: {
      debug: () => {},
      error: (...args) => console.error(...args),
      info: (...args) => console.error(...args),
    },
  };

  const allIssues = [];
  let hangCount = 0;
  let scanErrorCount = 0;
  let truncated = false;

  const fileActions = Array.isArray(restFileConfig.actions) ? restFileConfig.actions : [];

  try {
    outer: for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      for (const theme of themes) {
        if (Date.now() - startedAt > maxDurationMs) {
          console.error(
            `Overall scan budget (${maxDurationMs}ms) exceeded after ${i}/${urls.length} URLs; writing partial results.`,
          );
          truncated = true;
          break outer;
        }

        const label = `[${i + 1}/${urls.length}] Pa11y [${theme}]: ${url}`;
        console.error(label);
        const actions = [...themeActions(theme), ...fileActions];
        let result;
        let themeApplied = true;
        try {
          try {
            result = await withHardTimeout(
              pa11y(url, {
                ...pa11yBase,
                browser,
                actions,
              }),
              hardTimeoutMs,
              label,
            );
          } catch (actionErr) {
            const msg = String(actionErr?.message ?? actionErr);
            const isHardTimeout = /Hard timeout after/i.test(msg);
            const looksLikeActionFailure = /action/i.test(msg) && !isHardTimeout;
            if (isHardTimeout) {
              hangCount += 1;
              console.error(`${label} — ${msg}; relaunching browser and skipping this theme.`);
              await relaunchBrowser(msg);
              continue;
            }
            if (!looksLikeActionFailure) {
              throw actionErr;
            }
            console.error(
              `[${theme}] Pa11y failed for ${url} (theme actions may be unsupported on this page): ${msg}`,
            );
            console.error(`[${theme}] Retrying without theme actions…`);
            themeApplied = false;
            result = await withHardTimeout(
              pa11y(url, {
                ...pa11yBase,
                browser,
                actions: [...fileActions],
              }),
              hardTimeoutMs,
              `${label} (no theme actions)`,
            );
          }
        } catch (scanErr) {
          const msg = String(scanErr?.message ?? scanErr);
          scanErrorCount += 1;
          if (/Hard timeout after/i.test(msg)) {
            hangCount += 1;
            console.error(`${label} — ${msg}; relaunching browser and skipping.`);
            await relaunchBrowser(msg);
          } else {
            console.error(`${label} — scan error: ${msg}`);
            // Recover from transient Chromium death; continue the rest of the sitemap.
            try {
              const pages = await browser.pages();
              if (pages.length === 0) {
                await relaunchBrowser('no open pages after error');
              }
            } catch {
              await relaunchBrowser('browser unresponsive after error');
            }
          }
          continue;
        }

        const issues = result.issues || [];
        for (const issue of issues) {
          const row = { ...issue, pageUrl: url };
          if (themeApplied) {
            row.pa11yTheme = theme;
          }
          allIssues.push(row);
        }
      }
    }
  } finally {
    try {
      await browser.close();
    } catch (closeErr) {
      console.error(`browser.close() at end: ${closeErr?.message ?? closeErr}`);
    }
  }

  const elapsedMs = Date.now() - startedAt;
  console.error(
    `Scan finished in ${elapsedMs}ms; issues=${allIssues.length}; hangs=${hangCount}; scanErrors=${scanErrorCount}; truncated=${truncated}`,
  );

  process.stdout.write(JSON.stringify(allIssues));

  if (hangCount > 0 || truncated || scanErrorCount > 0) {
    // Infra / incomplete run — not "accessibility errors found" (exit 2).
    process.exit(1);
  }

  const hasErrors = allIssues.some((i) => i.type === 'error');
  process.exit(hasErrors ? 2 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
