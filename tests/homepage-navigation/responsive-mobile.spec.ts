// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Homepage and Navigation', () => {
  test('Responsive design on mobile viewport', async ({ page }) => {
    // 1. Set viewport to mobile size (375x667)
    await page.setViewportSize({ width: 375, height: 667 });

    // 2. Navigate to https://www.funkysi1701.com
    await page.goto('https://www.funkysi1701.com');

    // 3. Check if navigation menu collapses to hamburger menu
    const hamburger = page.locator('button[class*="navbar-toggler"], button[class*="menu"], .hamburger, [aria-label*="menu" i]').first();
    
    // 4. Click hamburger menu to expand
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await page.waitForTimeout(500); // Wait for animation
    }

    // 5. Verify all navigation items are accessible
    await expect(page.getByRole('link', { name: 'About' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();

    // 6. Test navigation on About page
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/about\//);

    // Test navigation on Projects page
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await page.waitForTimeout(500);
    }
    await page.getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/\/projects\//);

    // Test navigation on Contact page
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await page.waitForTimeout(500);
    }
    await page.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/\/contact\//);

    // 7. Verify content is readable and not cut off
    const body = page.locator('body');
    const bodyBox = await body.boundingBox();
    expect(bodyBox?.width).toBeLessThanOrEqual(375);
    
    // Check no horizontal scrolling required
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(375);
  });
});