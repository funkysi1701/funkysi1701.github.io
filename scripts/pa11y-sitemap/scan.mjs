/**
 * Fetch SITE_URL sitemap (including sitemap indexes), then run Pa11y on each page
 * URL that matches the site hostname. Prints a JSON array of issues (same shape as
 * `pa11y --reporter json`) to stdout, with pageUrl added per issue.
 *
 * Env: SITE_URL (required), SITEMAP_URL (optional, default SITE_URL/sitemap.xml),
 * PA11Y_CONFIG (optional, default /tmp/pa11y.json), PA11Y_MAX_PAGES (optional cap).
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
  console.error(`Fetching sitemap: ${sitemapUrl}`);
  let urls = await collectPageUrlsFromSitemap(sitemapUrl);
  urls = sortUrlsHomeFirst([...new Set(urls)].filter((u) => sameHost(u)));

  console.error(`Found ${urls.length} URL(s) for host ${hostname}`);

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

  const browser = await puppeteer.launch(launchOpts);

  const pa11yBase = {
    ...restFileConfig,
    runners: ['axe', 'htmlcs'],
    log: {
      debug: () => {},
      error: (...args) => console.error(...args),
      info: (...args) => console.error(...args),
    },
  };

  const allIssues = [];

  try {
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.error(`[${i + 1}/${urls.length}] Pa11y: ${url}`);
      const result = await pa11y(url, {
        ...pa11yBase,
        browser,
      });
      const issues = result.issues || [];
      for (const issue of issues) {
        allIssues.push({ ...issue, pageUrl: url });
      }
    }
  } finally {
    await browser.close();
  }

  process.stdout.write(JSON.stringify(allIssues));

  const hasErrors = allIssues.some((i) => i.type === 'error');
  process.exit(hasErrors ? 2 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
