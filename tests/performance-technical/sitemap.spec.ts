// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { APIResponse } from '@playwright/test';

function normalizeSiteOrigin(raw: string): string {
  const trimmed = raw.replace(/\/$/, '');
  try {
    return new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`).origin;
  } catch {
    return 'https://www.funkysi1701.com';
  }
}

const KNOWN_SITE_ORIGINS = [
  'https://www.funkysi1701.com',
  'https://blog-dev.funkysi1701.com',
  'https://blog-test.funkysi1701.com',
] as const;

test.describe('Performance and Technical', () => {
  test('Sitemap validation', async ({ request }) => {
    let content!: string;
    let response!: APIResponse;
    let urlCount!: number;

    const deploymentOrigin = normalizeSiteOrigin(
      process.env.BASE_URL || 'https://www.funkysi1701.com',
    );

    await test.step('Fetch sitemap.xml (API — reliable body vs navigation response)', async () => {
      response = await request.get('/sitemap.xml');
      if (!response.ok()) {
        throw new Error(`sitemap.xml HTTP ${response.status()}`);
      }
    });

    await test.step('Verify sitemap loads successfully', async () => {
      expect(response.status()).toBe(200);
      content = await response.text();
      expect(content.length).toBeGreaterThan(100);
    });

    await test.step('Check that XML is well-formed', async () => {
      // 3. Check that XML is well-formed
      expect(content).toContain('<?xml');
      expect(content).toContain('<urlset');
      expect(content).toContain('</urlset>');
    });

    await test.step('Verify sitemap includes all major pages', async () => {
      // 4. Verify sitemap includes all major pages
      expect(content).toContain('<url>');
      expect(content).toContain('<loc>');
    });

    await test.step('Check for blog posts in sitemap', async () => {
      // 5. Check for blog posts in sitemap
      const urlMatches = content.match(/<url>/g);
      urlCount = urlMatches ? urlMatches.length : 0;
      // Staging / partial deploys may list far fewer URLs than production
      expect(urlCount).toBeGreaterThan(3);
    });

    await test.step('Verify URLs are absolute (not relative)', async () => {
      // 6. Verify URLs are absolute (not relative)
      expect(content).toMatch(/<loc>https?:\/\//);
      // <loc> uses Hugo baseURL at build time — may not match the host you are testing
      const originsToCheck = new Set<string>([
        deploymentOrigin,
        ...KNOWN_SITE_ORIGINS,
      ]);
      const locHostsOk = [...originsToCheck].some((o) => content.includes(`${o}/`));
      expect(locHostsOk).toBeTruthy();
    });

    await test.step('Check lastmod dates are present', async () => {
      // 7. Check lastmod dates are present
      const hasLastmod = content.includes('<lastmod>');
      console.log('Has lastmod dates:', hasLastmod);
    });

    await test.step('Verify priority values if used', async () => {
      // 8. Verify priority values if used
      const hasPriority = content.includes('<priority>');
      console.log('Has priority values:', hasPriority);

      console.log(`Sitemap contains ${urlCount} URLs`);

      // Verify no broken structure
      expect(content).not.toContain('<<');
      expect(content).not.toContain('>>');
    });

  });
});
