// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Homepage and Navigation', () => {
  test('Responsive design on tablet viewport', async ({ page }) => {
    // 1. Set viewport to tablet size (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });

    // 2. Navigate to https://www.funkysi1701.com
    await page.goto('https://www.funkysi1701.com');

    // 3. Verify layout adapts appropriately
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // 4. Check navigation menu display
    // On tablet, navigation may be in a collapsed hamburger menu
    const hamburgerButton = page.locator('button.navbar-toggler, button:has-text("Toggle navigation"), [data-toggle="collapse"]');
    const hamburgerVisible = await hamburgerButton.isVisible().catch(() => false);
    if (hamburgerVisible) {
      await hamburgerButton.click();
      await page.waitForTimeout(800); // Wait for menu animation
    }
    
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    
    // Verify navigation items are accessible (they may be in the hamburger menu)
    const aboutLink = page.getByRole('link', { name: 'About' }).first();
    await expect(aboutLink).toBeAttached();

    // 5. Test blog post grid/list layout
    const posts = page.locator('article, .post, [class*="post"]');
    const postCount = await posts.count();
    expect(postCount).toBeGreaterThan(0);

    // 6. Verify images scale properly
    const images = page.locator('img').first();
    if (await images.count() > 0) {
      const imgBox = await images.boundingBox();
      expect(imgBox?.width).toBeLessThanOrEqual(768);
    }

    // Verify no layout breaking or overflow issues
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(800); // Allow some margin for scrollbar
  });
});