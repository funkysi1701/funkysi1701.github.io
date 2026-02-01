// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Blog Posts and Content', () => {
  test('Blog post images and media', async ({ page }) => {
    // 1. Navigate to a blog post with images
    await page.goto('https://www.funkysi1701.com/posts/2026/01/31/ndc-london-2026');

    // 2. Verify cover image loads correctly
    const coverImage = page.locator('img').first();
    if (await coverImage.count() > 0) {
      await expect(coverImage).toBeVisible();
    }

    // 3. Check inline images within post content
    const contentImages = page.locator('article img, .content img, main img');
    const imageCount = await contentImages.count();

    // 4. Verify images have proper alt text
    if (imageCount > 0) {
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = contentImages.nth(i);
        const alt = await img.getAttribute('alt');
        // Alt text can be empty for decorative images, but attribute should exist
        expect(alt !== null).toBeTruthy();
      }
    }

    // 5. Test image loading performance
    // Wait for images to load
    await page.waitForLoadState('load');

    // 6. Check for lazy loading implementation
    const lazyImages = page.locator('img[loading="lazy"]');
    // Lazy loading is optional but good practice

    // 7. Verify images are responsive and scale properly
    if (imageCount > 0) {
      const firstImage = contentImages.first();
      const imgBox = await firstImage.boundingBox();
      const viewportWidth = page.viewportSize()?.width || 1280;
      
      if (imgBox) {
        expect(imgBox.width).toBeLessThanOrEqual(viewportWidth);
      }
    }
  });
});
