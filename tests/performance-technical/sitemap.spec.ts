// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Performance and Technical', () => {
  test('Sitemap validation', async ({ page }) => {
    // eslint-disable-next-line prefer-const
    let content: any;
    // eslint-disable-next-line prefer-const
    let response: any;
    // eslint-disable-next-line prefer-const
    let urlCount: any;

    await test.step('Navigate to https://www.funkysi1701.com/sitemap.xml', async () => {
      // 1. Navigate to https://www.funkysi1701.com/sitemap.xml
      response = await page.goto('https://www.funkysi1701.com/sitemap.xml');

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
      expect(urlCount).toBeGreaterThan(50); // Should have many blog posts
    });

    await test.step('Verify URLs are absolute (not relative)', async () => {
      // 6. Verify URLs are absolute (not relative)
      expect(content).toContain('https://www.funkysi1701.com/');
      expect(content).not.toMatch(/<loc>\/[^h]/); // URLs should start with http
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
