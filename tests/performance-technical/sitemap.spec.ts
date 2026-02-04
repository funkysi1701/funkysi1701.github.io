// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Performance and Technical', () => {
  test('Sitemap validation', async ({ page }) => {
    // 1. Navigate to https://www.funkysi1701.com/sitemap.xml
    const response = await page.goto('https://www.funkysi1701.com/sitemap.xml');
    
    if (!response) {
      throw new Error('No response received');
    }

    // 2. Verify sitemap loads successfully
    expect(response.status()).toBe(200);

    const content = await response.text();

    // 3. Check that XML is well-formed
    expect(content).toContain('<?xml');
    expect(content).toContain('<urlset');
    expect(content).toContain('</urlset>');

    // 4. Verify sitemap includes all major pages
    expect(content).toContain('<url>');
    expect(content).toContain('<loc>');

    // 5. Check for blog posts in sitemap
    const urlMatches = content.match(/<url>/g);
    const urlCount = urlMatches ? urlMatches.length : 0;
    expect(urlCount).toBeGreaterThan(50); // Should have many blog posts

    // 6. Verify URLs are absolute (not relative)
    expect(content).toContain('https://www.funkysi1701.com/');
    expect(content).not.toMatch(/<loc>\/[^h]/); // URLs should start with http

    // 7. Check lastmod dates are present
    const hasLastmod = content.includes('<lastmod>');
    console.log('Has lastmod dates:', hasLastmod);

    // 8. Verify priority values if used
    const hasPriority = content.includes('<priority>');
    console.log('Has priority values:', hasPriority);

    console.log(`Sitemap contains ${urlCount} URLs`);

    // Verify no broken structure
    expect(content).not.toContain('<<');
    expect(content).not.toContain('>>');
  });
});
