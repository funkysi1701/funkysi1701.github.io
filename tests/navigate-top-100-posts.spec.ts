// spec: specs/funkysi1701-test-plan.md

import { test, expect } from './fixtures';
import type { APIRequestContext, APIResponse } from '@playwright/test';
import { SITE_TITLE_PATTERN } from './site-title';

/**
 * Hosts that routinely bot-block automated GETs (403/429) or are documentation
 * placeholders. Social share destinations are covered by presence tests elsewhere.
 */
const SKIP_LINK_HOSTS = [
  'facebook.com',
  'twitter.com',
  'x.com',
  'linkedin.com',
  'fandom.com',
  'example.com',
  'example.org',
  'example.net',
];

/** Transient SWA/CDN blips right after deploy — same URL often returns 200 on retry. */
const HTTP_ATTEMPTS = 3;
const HTTP_RETRY_DELAY_MS = 250;

function hostnameOf(link: string): string | null {
  try {
    return new URL(link).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return null;
  }
}

function shouldCheckLink(link: string, siteHost: string): boolean {
  const host = hostnameOf(link);
  if (!host) return false;
  if (SKIP_LINK_HOSTS.some((d) => host === d || host.endsWith(`.${d}`))) {
    return false;
  }
  // Same-site only (prod + preview hosts): external 403/429 is not a site regression.
  if (host === siteHost) return true;
  if (host === 'funkysi1701.com' || host.endsWith('.funkysi1701.com')) return true;
  return false;
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * GET with short retries on network errors or status ≥ 400.
 * Does not weaken the final assertion — only absorbs transient SWA/CDN failures.
 */
async function getWithRetries(
  request: APIRequestContext,
  url: string,
): Promise<{ ok: true; response: APIResponse } | { ok: false; status?: number; error?: string }> {
  let lastStatus: number | undefined;
  let lastError: string | undefined;

  for (let attempt = 1; attempt <= HTTP_ATTEMPTS; attempt++) {
    try {
      const response = await request.get(url);
      const status = response.status();
      if (status < 400) {
        return { ok: true, response };
      }
      lastStatus = status;
    } catch (err) {
      lastError = String(err);
    }
    if (attempt < HTTP_ATTEMPTS) {
      await delay(HTTP_RETRY_DELAY_MS * attempt);
    }
  }

  return { ok: false, status: lastStatus, error: lastError };
}

test('navigate to www.funkysi1701.com, check top 100 blog posts for broken links and images', async ({ page }) => {
  // Full crawl of homepage post list + same-origin link/image checks needs headroom.
  test.setTimeout(180_000);

  await page.goto('/');
  await expect(page).toHaveTitle(SITE_TITLE_PATTERN);

  const siteHost = hostnameOf(page.url()) ?? 'funkysi1701.com';

  // Collect from the chronological list only (exclude Popular strip / nav widgets).
  const blogPostUrls = await page.$$eval('.posts a[href*="/posts/"]', (as) => {
    const seen = new Set<string>();
    const urls: string[] = [];
    for (const a of as) {
      const href = (a as HTMLAnchorElement).href;
      if (!href || !/\/posts\/\d{4}\//.test(href) || seen.has(href)) continue;
      seen.add(href);
      urls.push(href);
      if (urls.length >= 100) break;
    }
    return urls;
  });

  expect(blogPostUrls.length, 'expected dated posts in the home list').toBeGreaterThan(0);

  for (const url of blogPostUrls) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(url);

    // Image check via HTTP — naturalWidth is unreliable for lazy/off-screen imgs.
    const imageSrcs = await page.$$eval('img[src]', (imgs) =>
      imgs.map((img) => (img as HTMLImageElement).src).filter((src) => /^https?:\/\//.test(src)),
    );
    for (const src of imageSrcs) {
      if (!shouldCheckLink(src, siteHost)) continue;
      const result = await getWithRetries(page.request, src);
      if (result.ok) {
        expect.soft(result.response.status(), `Broken image: ${src} on ${url}`).toBeLessThan(400);
      } else {
        const detail = result.error ?? `HTTP ${result.status}`;
        expect.soft(null, `Broken image: ${src} on ${url} (${detail})`).toBeTruthy();
      }
    }

    const links = await page.$$eval('a[href]', (as) => as.map((a) => a.href));
    const linkChecks = links
      .filter((link) => /^https?:\/\//.test(link) && shouldCheckLink(link, siteHost))
      .map(async (link) => {
        const result = await getWithRetries(page.request, link);
        if (result.ok) {
          expect.soft(result.response.status(), `Broken link: ${link} on ${url}`).toBeLessThan(400);
        } else {
          const detail = result.error ?? `HTTP ${result.status}`;
          expect.soft(null, `Broken link: ${link} on ${url} (${detail})`).toBeTruthy();
        }
      });
    await Promise.all(linkChecks);
  }
});
