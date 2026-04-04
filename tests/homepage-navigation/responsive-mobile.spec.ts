// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { Locator } from '@playwright/test';

test.describe('Homepage and Navigation', () => {
  test('Responsive design on mobile viewport', async ({ page }) => {
    let hamburger!: Locator;

    await test.step('Set viewport to mobile size (375x667)', async () => {
      // 1. Set viewport to mobile size (375x667)
      await page.setViewportSize({ width: 375, height: 667 });
    });

    await test.step('Navigate to https://www.funkysi1701.com', async () => {
      // 2. Navigate to https://www.funkysi1701.com
      await page.goto('/');
    });

    await test.step('Check if navigation menu collapses to hamburger menu', async () => {
      // 3. Check if navigation menu collapses to hamburger menu
      hamburger = page.getByRole('button', { name: 'Toggle navigation' });
    });

    await test.step('Click hamburger menu to expand', async () => {
      // 4. Click hamburger menu to expand
      await expect(hamburger).toBeVisible();
      await hamburger.click();
      // Wait for Bootstrap collapse animation to complete before checking links
      await page.locator('#navbarSupportedContent.show').waitFor({ state: 'visible' });
    });

    await test.step('Verify all navigation items are accessible', async () => {
      // 5. Verify all navigation items are accessible
      await expect(page.getByRole('link', { name: 'About' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Projects' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Contact' }).first()).toBeVisible();
    });

    await test.step('Test navigation on About page', async () => {
      // 6. Test navigation on About page
      await page.getByRole('link', { name: 'About' }).first().click();
      await expect(page).toHaveURL(/\/about\//);

      // Test navigation on Projects page
      const hamburger2 = page.getByRole('button', { name: 'Toggle navigation' }).first();
      await hamburger2.click();
      // Wait for Bootstrap to expand the nav collapse before looking for links
      await page.locator('#navbarSupportedContent.show').waitFor({ state: 'visible' });
      const projectsLink = page.locator('#navbarSupportedContent').getByRole('link', { name: 'Projects', exact: true }).first();
      await projectsLink.click();
      await expect(page).toHaveURL(/\/projects\//);

      // Test navigation on Contact page
      const hamburger3 = page.getByRole('button', { name: 'Toggle navigation' }).first();
      await hamburger3.click();
      // Wait for Bootstrap to expand the nav collapse before looking for links
      await page.locator('#navbarSupportedContent.show').waitFor({ state: 'visible' });
      const contactLink = page.locator('#navbarSupportedContent').getByRole('link', { name: 'Contact' }).first();
      await contactLink.click();
      await expect(page).toHaveURL(/\/contact\//);
    });

    await test.step('Verify content is readable and not cut off', async () => {
      // 7. Verify content is readable and not cut off
      const body = page.locator('body');
      const bodyBox = await body.boundingBox();
      expect(bodyBox?.width).toBeLessThanOrEqual(375);

      // Check no horizontal scrolling required
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(375);
    });

  });
});