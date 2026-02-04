// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Homepage and Navigation', () => {
  test('Responsive design on mobile viewport', async ({ page }) => {
    // 1. Set viewport to mobile size (375x667)
    await page.setViewportSize({ width: 375, height: 667 });

    // 2. Navigate to https://www.funkysi1701.com
    await page.goto('https://www.funkysi1701.com');

    // 3. Check if navigation menu collapses to hamburger menu
    const hamburger = page.getByRole('button', { name: 'Toggle navigation' });
    
    // 4. Click hamburger menu to expand
    await expect(hamburger).toBeVisible();
    await hamburger.click();
    await page.waitForTimeout(500); // Wait for animation

    // 5. Verify all navigation items are accessible
    await expect(page.getByRole('link', { name: 'About' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Projects' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact' }).first()).toBeVisible();

    // 6. Test navigation on About page
    await page.getByRole('link', { name: 'About' }).first().click();
    await expect(page).toHaveURL(/\/about\//);

    // Test navigation on Projects page
    const hamburger2 = page.getByRole('button', { name: 'Toggle navigation' }).first();
    await hamburger2.click();
    await page.waitForTimeout(800);
    await page.getByRole('link', { name: 'Projects', exact: true }).first().click();
    await expect(page).toHaveURL(/\/projects\//);

    // Test navigation on Contact page
    const hamburger3 = page.getByRole('button', { name: 'Toggle navigation' }).first();
    await hamburger3.click();
    await page.waitForTimeout(800);
    await page.getByRole('link', { name: 'Contact' }).first().click();
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