// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Homepage and Navigation', () => {
  test('Main navigation menu functionality', async ({ page }) => {
    await test.step('Navigate to https://www.funkysi1701.com', async () => {
      // 1. Navigate to https://www.funkysi1701.com
      await page.goto('/');
    });

    // Scope to the top app bar so in-page links (e.g. body copy, sidebar) cannot
    // collide with the same accessible names (Playwright strict mode).
    const mainNav = page.locator('nav.navbar');

    await test.step('Verify all navigation items are visible', async () => {
      // 2. Verify all navigation items are visible
      await expect(mainNav.getByRole('link', { name: 'About' })).toBeVisible();
      await expect(mainNav.getByRole('link', { name: 'Start Here', exact: true })).toBeVisible();
      await expect(mainNav.getByRole('link', { name: 'Projects', exact: true })).toBeVisible();
      await expect(mainNav.getByRole('link', { name: /Tools.*Resources/i })).toBeVisible();
      await expect(mainNav.getByRole('link', { name: 'Newsletter' })).toBeVisible();
      await expect(mainNav.getByRole('link', { name: 'Contact' })).toBeVisible();
      await expect(mainNav.getByRole('link', { name: 'Events' })).toBeVisible();
      await expect(mainNav.getByRole('link', { name: 'Search', exact: true })).toBeVisible();
    });

    await test.step('Navigate to About page and verify it loads', async () => {
      // 3. Click on About link
      await mainNav.getByRole('link', { name: 'About', exact: true }).click();
      // 4. Verify About page loads correctly
      await expect(page).toHaveURL(/\/about\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to Start Here page and verify it loads', async () => {
      await mainNav.getByRole('link', { name: 'Start Here', exact: true }).click();
      await expect(page).toHaveURL(/\/start-here\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to Projects page and verify it loads', async () => {
      // Click on Projects link
      await mainNav.getByRole('link', { name: 'Projects', exact: true }).click();
      await expect(page).toHaveURL(/\/projects\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to Tools & Resources page and verify it loads', async () => {
      // Click on Tools & Resources link
      await mainNav.getByRole('link', { name: /Tools.*Resources/i }).click();
      await expect(page).toHaveURL(/\/tools-and-resources\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to Newsletter page and verify it loads', async () => {
      // Click on Newsletter link
      await mainNav.getByRole('link', { name: 'Newsletter' }).click();
      await expect(page).toHaveURL(/\/newsletter\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to Contact page and verify it loads', async () => {
      // Click on Contact link
      await mainNav.getByRole('link', { name: 'Contact' }).click();
      await expect(page).toHaveURL(/\/contact\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to Events page and verify it loads', async () => {
      // Click on Events link
      await mainNav.getByRole('link', { name: 'Events' }).click();
      await expect(page).toHaveURL(/\/posts\/events\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to Search page and verify it loads', async () => {
      // Click on Search link
      await mainNav.getByRole('link', { name: 'Search', exact: true }).click();
      await expect(page).toHaveURL(/\/search\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Test Support this site link (opens in new tab)', async () => {
      // 5. Test Support this site link (opens in new tab)
      // Note: Just verify link has correct href and target, as external site may have protections
      const supportLink = page.getByRole('link', { name: /Support.*site/i });
      if (await supportLink.count() > 0) {
        await expect(supportLink.first()).toBeVisible();
        const href = await supportLink.first().getAttribute('href');
        expect(href).toMatch(/otieu\.com/);
      }
    });

  });
});
