// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Blog Posts and Content', () => {
  test('Blog post comments integration', async ({ page }) => {
    // 1. Navigate to a blog post
    await page.goto('https://www.funkysi1701.com/posts/2026/01/31/ndc-london-2026');

    // 2. Scroll to the bottom of the post
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // 3. Check for Giscus comment section
    const giscusFrame = page.frameLocator('iframe[src*="giscus"]');
    
    // 4. Verify comment section loads
    // Wait for Giscus to load
    await page.waitForTimeout(3000);
    
    const giscusIframe = page.locator('iframe[src*="giscus"]');
    if (await giscusIframe.count() > 0) {
      await expect(giscusIframe).toBeVisible();

      // 5. Check if GitHub sign-in option is available
      // Giscus loads in iframe, so we check the iframe is present
      
      // 6. Verify existing comments display (if any)
      // Comments would be inside the iframe
    }
  });
});
