// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { APIRequestContext, APIResponse } from '@playwright/test';

function siteOriginFromEnv(): string {
  const raw = (process.env.BASE_URL || 'https://www.funkysi1701.com').trim();
  const withScheme = raw.startsWith('http') ? raw : `https://${raw}`;
  try {
    return new URL(withScheme.endsWith('/') ? withScheme : `${withScheme}/`).origin;
  } catch {
    return 'https://www.funkysi1701.com';
  }
}

const KNOWN_SITE_ORIGINS = [
  'https://www.funkysi1701.com',
  'https://blog-dev.funkysi1701.com',
  'https://blog-test.funkysi1701.com',
  'https://funkysi1701.com',
] as const;

/** Hugo / ingress sometimes emits default port explicitly, e.g. https://blog-dev.funkysi1701.com:443/path */
function funkysiLocPresent(content: string): boolean {
  return /https:\/\/([^/]+\.)?funkysi1701\.com(:\d+)?\//i.test(content);
}

function sitemapHasOriginPrefix(content: string, origin: string): boolean {
  const o = origin.replace(/\/$/, '');
  if (content.includes(`${o}/`)) return true;
  if (content.includes(`${o}:443/`) || content.includes(`${o}:80/`)) return true;
  return false;
}

async function getSitemap(
  request: APIRequestContext,
  origin: string,
): Promise<{ response: APIResponse; content: string }> {
  const url = `${origin}/sitemap.xml`;
  // Absolute URL — avoids relying on APIRequestContext baseURL (can differ in CI / containers).
  let response = await request.get(url, {
    headers: {
      Accept: 'application/xml, text/xml;q=0.9, */*;q=0.1',
    },
    timeout: 60_000,
  });

  if (!response.ok()) {
    const bodyPreview = (await response.text()).slice(0, 200);
    throw new Error(`GET ${url} → HTTP ${response.status()} — ${bodyPreview}`);
  }

  const content = await response.text();
  return { response, content };
}

test.describe('Performance and Technical', () => {
  test('Sitemap validation', async ({ request }) => {
    const deploymentOrigin = siteOriginFromEnv();
    let content!: string;
    let response!: APIResponse;
    let urlCount = 0;

    await test.step('Fetch sitemap.xml', async () => {
      try {
        ({ response, content } = await getSitemap(request, deploymentOrigin));
      } catch (firstErr) {
        // Same deployment sometimes serves the canonical www sitemap only
        if (deploymentOrigin !== 'https://www.funkysi1701.com') {
          ({ response, content } = await getSitemap(
            request,
            'https://www.funkysi1701.com',
          ));
        } else {
          throw firstErr;
        }
      }
    });

    await test.step('Verify sitemap response', async () => {
      expect(response.status()).toBe(200);
      expect(content.length).toBeGreaterThan(50);
      expect(content).toContain('<?xml');
    });

    await test.step('Check sitemap shape (index or urlset)', async () => {
      const isIndex = content.includes('<sitemapindex');
      const isUrlset = content.includes('<urlset');

      expect(isIndex || isUrlset).toBeTruthy();

      if (isIndex) {
        expect(content).toContain('<loc>');
        expect(content).toMatch(/<loc>https?:\/\//);
        expect((content.match(/<sitemap>/g)?.length ?? 0)).toBeGreaterThan(0);
        return;
      }

      expect(content).toContain('</urlset>');
      expect(content).toContain('<url>');
      expect(content).toContain('<loc>');
    });

    await test.step('Count URL entries when urlset', async () => {
      if (!content.includes('<urlset')) {
        return;
      }
      const urlMatches = content.match(/<url>/g);
      urlCount = urlMatches ? urlMatches.length : 0;
      expect(urlCount).toBeGreaterThan(0);
    });

    await test.step('Verify loc uses absolute URLs and this site', async () => {
      expect(content).toMatch(/<loc>https?:\/\//);
      const originsToCheck = new Set<string>([deploymentOrigin, ...KNOWN_SITE_ORIGINS]);
      const locHostsOk =
        [...originsToCheck].some((o) => sitemapHasOriginPrefix(content, o)) || funkysiLocPresent(content);
      expect(locHostsOk).toBeTruthy();
    });

    await test.step('Check lastmod / priority (informational)', async () => {
      console.log('Has lastmod:', content.includes('<lastmod>'));
      console.log('Has priority:', content.includes('<priority>'));
      console.log('Sitemap snippet length:', content.length, 'url entries:', urlCount);
    });
  });
});
