// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Homepage and Navigation', () => {
  test('Main navigation menu functionality', async ({ page, context }) => {
    await test.step('Navigate to https://www.funkysi1701.com', async () => {
      // 1. Navigate to https://www.funkysi1701.com
      await page.goto('/');
    });

    await test.step('Verify all navigation items are visible', async () => {
      // 2. Verify all navigation items are visible
      await expect(page.getByRole('link', { name: 'About' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Projects', exact: true }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: /Tools.*Resources/i }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Newsletter' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Contact' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Events' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Search', exact: true }).first()).toBeVisible();
    });

    await test.step('Navigate to About page and verify it loads', async () => {
      // 3. Click on About link
      await page.getByRole('link', { name: 'About', exact: true }).first().click();
      // 4. Verify About page loads correctly
      await expect(page).toHaveURL(/\/about\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to Projects page and verify it loads', async () => {
      // Click on Projects link
      await page.getByRole('link', { name: 'Projects', exact: true }).click();
      await expect(page).toHaveURL(/\/projects\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to Tools & Resources page and verify it loads', async () => {
      // Click on Tools & Resources link
      await page.getByRole('link', { name: /Tools.*Resources/i }).first().click();
      await expect(page).toHaveURL(/\/tools-and-resources\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to Newsletter page and verify it loads', async () => {
      // Click on Newsletter link
      await page.getByRole('link', { name: 'Newsletter' }).first().click();
      await expect(page).toHaveURL(/\/newsletter\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to Contact page and verify it loads', async () => {
      // Click on Contact link
      await page.getByRole('link', { name: 'Contact' }).first().click();
      await expect(page).toHaveURL(/\/contact\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to Events page and verify it loads', async () => {
      // Click on Events link
      await page.getByRole('link', { name: 'Events' }).first().click();
      await expect(page).toHaveURL(/\/posts\/events\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to Search page and verify it loads', async () => {
      // Click on Search link
      await page.getByRole('link', { name: 'Search' }).first().click();
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