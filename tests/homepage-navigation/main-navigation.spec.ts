// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { Locator } from '@playwright/test';

async function openMoreMenu(mainNav: Locator) {
  const more = mainNav.locator('#navbarDropdownMore');
  const menu = mainNav.locator('ul.dropdown-menu[aria-labelledby="navbarDropdownMore"]');
  await more.click();
  // Bootstrap may leave the menu in the a11y tree before/without a durable .show class
  // on some builds; wait for expanded state or visible menu either way.
  await expect
    .poll(async () => {
      const expanded = (await more.getAttribute('aria-expanded')) === 'true';
      const visible = await menu.isVisible().catch(() => false);
      return expanded || visible;
    }, { timeout: 10000 })
    .toBe(true);
  return menu;
}

/** Open the More dropdown and click a child destination link. */
async function clickMoreChild(mainNav: Locator, name: string | RegExp) {
  const menu = await openMoreMenu(mainNav);
  const link =
    typeof name === 'string'
      ? menu.getByRole('link', { name, exact: true })
      : menu.getByRole('link', { name });
  await link.click({ force: true });
}

test.describe('Homepage and Navigation', () => {
  test('Main navigation menu functionality', async ({ page }) => {
    await test.step('Navigate to https://www.funkysi1701.com', async () => {
      // 1. Navigate to https://www.funkysi1701.com
      await page.goto('/');
    });

    // Scope to the top app bar so in-page links (e.g. body copy, sidebar) cannot
    // collide with the same accessible names (Playwright strict mode).
    const mainNav = page.locator('nav.navbar');

    await test.step('Verify primary nav items and More dropdown', async () => {
      // 2. Verify primary items + More; secondary destinations live under More
      await expect(mainNav.getByRole('link', { name: 'About', exact: true })).toBeVisible();
      await expect(mainNav.getByRole('link', { name: 'Start Here', exact: true })).toBeVisible();
      await expect(mainNav.getByRole('link', { name: 'Projects', exact: true })).toBeVisible();
      await expect(mainNav.getByRole('link', { name: 'Newsletter', exact: true })).toBeVisible();
      await expect(mainNav.locator('#navbarDropdownMore')).toBeVisible();

      // Former top-level items must not be top-level nav-link siblings.
      await expect(
        mainNav.locator('ul.navbar-nav > li.nav-item > a.nav-link', { hasText: 'Contact' }),
      ).toHaveCount(0);
      await expect(
        mainNav.locator('ul.navbar-nav > li.nav-item > a.nav-link', { hasText: 'Search' }),
      ).toHaveCount(0);

      const moreMenu = await openMoreMenu(mainNav);
      await expect(moreMenu.getByRole('link', { name: /Tools.*Resources/i })).toBeAttached();
      await expect(moreMenu.getByRole('link', { name: 'Contact', exact: true })).toBeAttached();
      await expect(moreMenu.getByRole('link', { name: 'Events', exact: true })).toBeAttached();
      await expect(moreMenu.getByRole('link', { name: 'Search', exact: true })).toBeAttached();
      // Close dropdown before walking primary links
      await page.keyboard.press('Escape');
    });

    await test.step('Navigate to About page and verify it loads', async () => {
      await mainNav.getByRole('link', { name: 'About', exact: true }).click();
      await expect(page).toHaveURL(/\/about\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to Start Here page and verify it loads', async () => {
      await mainNav.getByRole('link', { name: 'Start Here', exact: true }).click();
      await expect(page).toHaveURL(/\/start-here\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to Projects page and verify it loads', async () => {
      await mainNav.getByRole('link', { name: 'Projects', exact: true }).click();
      await expect(page).toHaveURL(/\/projects\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to Newsletter page and verify it loads', async () => {
      await mainNav.getByRole('link', { name: 'Newsletter', exact: true }).click();
      await expect(page).toHaveURL(/\/newsletter\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to Tools & Resources via More', async () => {
      await clickMoreChild(mainNav, /Tools.*Resources/i);
      await expect(page).toHaveURL(/\/tools-and-resources\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to Contact via More', async () => {
      await clickMoreChild(mainNav, 'Contact');
      await expect(page).toHaveURL(/\/contact\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to Events via More', async () => {
      await clickMoreChild(mainNav, 'Events');
      await expect(page).toHaveURL(/\/posts\/events\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to Search via More', async () => {
      await clickMoreChild(mainNav, 'Search');
      await expect(page).toHaveURL(/\/search\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });
  });
});
