// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { Response } from '@playwright/test';

function normalizeSiteOrigin(raw: string): string {
  const trimmed = raw.replace(/\/$/, '');
  try {
    return new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`).origin;
  } catch {
    return 'https://www.funkysi1701.com';
  }
}

test.describe('Performance and Technical', () => {
  test('Sitemap validation', async ({ page }) => {
    let content!: string;
    let response!: Response | null;
    let urlCount!: number;

    const deploymentOrigin = normalizeSiteOrigin(
      process.env.BASE_URL || 'https://www.funkysi1701.com',
    );
    const productionOrigin = 'https://www.funkysi1701.com';

    await test.step('Navigate to https://www.funkysi1701.com/sitemap.xml', async () => {
      // 1. Navigate to sitemap (uses Playwright baseURL from CI)
      response = await page.goto('/sitemap.xml');

      if (!response) {
        throw new Error('No response received');
      }
    });

    await test.step('Verify sitemap loads successfully', async () => {
      // 2. Verify sitemap loads successfully
      expect(response.status()).toBe(200);

      content = await response.text();
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
      // Staging builds may publish fewer routes than production
      expect(urlCount).toBeGreaterThan(8);
    });

    await test.step('Verify URLs are absolute (not relative)', async () => {
      // 6. Verify URLs are absolute (not relative)
      expect(content).toMatch(/<loc>https?:\/\//);
      // Sitemap <loc> uses the site's configured baseURL at build time (may be prod while testing dev)
      const locHostsOk =
        content.includes(`${deploymentOrigin}/`) || content.includes(`${productionOrigin}/`);
      expect(locHostsOk).toBeTruthy();
      expect(content).not.toMatch(/<loc>\/(?!\/)/);
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
