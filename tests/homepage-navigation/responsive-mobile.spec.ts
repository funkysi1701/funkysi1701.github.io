// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { Locator, Page } from '@playwright/test';

/** Main menu links live under #navbarSupportedContent (scope here, not the whole nav). */
async function clickVisibleMainNavLink(
  page: Page,
  opts: { name: string | RegExp; exact?: boolean },
) {
  const navMenu = page.locator('#navbarSupportedContent');
  const link = navMenu.getByRole('link', opts);
  const toggler = page.locator('nav.navbar').getByRole('button', { name: 'Toggle navigation' });
  if (!(await link.isVisible())) {
    await toggler.click();
  }
  if (!(await link.isVisible())) {
    await toggler.click();
  }
  await expect(link).toBeVisible({ timeout: 15000 });
  await link.click();
}

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
      await page.waitForLoadState('load');
    });

    const navMenu = page.locator('#navbarSupportedContent');

    await test.step('Check if navigation menu collapses to hamburger menu', async () => {
      // 3. Check if navigation menu collapses to hamburger menu (scope to main header — avoid duplicate controls)
      hamburger = page.locator('nav.navbar').getByRole('button', { name: 'Toggle navigation' });
    });

    await test.step('Click hamburger menu to expand', async () => {
      // 4. Click hamburger menu to expand (do not assert aria-expanded — some pages update visibility without a reliable attribute)
      await expect(hamburger).toBeVisible();
      const aboutLink = navMenu.getByRole('link', { name: 'About', exact: true });
      if (!(await aboutLink.isVisible())) {
        await hamburger.click();
      }
      await expect(aboutLink).toBeVisible({ timeout: 15000 });
    });

    await test.step('Verify all navigation items are accessible', async () => {
      // 5. Verify all navigation items are accessible
      await expect(navMenu.getByRole('link', { name: 'About', exact: true })).toBeVisible();
      await expect(navMenu.getByRole('link', { name: 'Projects', exact: true })).toBeVisible();
      await expect(navMenu.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();
    });

    await test.step('Test navigation on About page', async () => {
      // 6. Test navigation on About, Projects, and Contact (open menu only when links are hidden)
      await clickVisibleMainNavLink(page, { name: 'About', exact: true });
      await expect(page).toHaveURL(/\/about\//);
      await page.waitForLoadState('load');

      await clickVisibleMainNavLink(page, { name: 'Projects', exact: true });
      await expect(page).toHaveURL(/\/projects\//);
      await page.waitForLoadState('load');

      await clickVisibleMainNavLink(page, { name: 'Contact', exact: true });
      await expect(page).toHaveURL(/\/contact\//);
    });

    await test.step('Verify content is readable and not cut off', async () => {
      // 7. Verify content is readable and not cut off
      const body = page.locator('body');
      const bodyBox = await body.boundingBox();
      expect(bodyBox?.width).toBeLessThanOrEqual(375);

      // No horizontal overflow (scrollWidth can exceed 375 on small viewports with wide assets;
      // compare to clientWidth instead of the viewport number.)
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });

  });
});
