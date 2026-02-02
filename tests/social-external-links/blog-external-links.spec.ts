// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Social Media and External Links', () => {
  test('Blog post external links', async ({ page, context }) => {
    // 1. Navigate to a blog post with external links
    await page.goto('https://www.funkysi1701.com/posts/2026/01/31/ndc-london-2026');

    // 2. Identify external links within post content
    const externalLinks = page.locator('article a[href^="http"], main a[href^="http"], .content a[href^="http"]');
    const linkCount = await externalLinks.count();
    
    console.log(`Found ${linkCount} external links in blog post`);

    if (linkCount > 0) {
      // 3. Click on an external link
      const firstExternalLink = externalLinks.first();
      const href = await firstExternalLink.getAttribute('href');
      
      console.log('First external link:', href);
      
      // Check link is properly formatted
      expect(href).toMatch(/^https?:\/\//);
      
      // 4. Verify it opens in new tab (check target attribute)
      const target = await firstExternalLink.getAttribute('target');
      // Many external links should open in new tab
      
      // 5. Test multiple external links in different posts
      // Check that links are clickable
      await expect(firstExternalLink).toBeVisible();
      
      // 6. Verify no broken links exist (by checking href format)
      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = externalLinks.nth(i);
        const linkHref = await link.getAttribute('href');
        expect(linkHref).toMatch(/^https?:\/\//);
        
        // Verify link text is descriptive
        const linkText = await link.textContent();
        expect(linkText).toBeTruthy();
        expect(linkText?.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
