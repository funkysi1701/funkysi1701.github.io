// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Homepage and Navigation', () => {
  test('Homepage loads successfully', { tag: '@smoke' }, async ({ page }) => {
    await test.step('Navigate to https://www.funkysi1701.com', async () => {
      // 1. Navigate to https://www.funkysi1701.com
      await page.goto('/');
    });

    await test.step('Verify the page loads without errors', async () => {
      // 2. Verify the page loads without errors
      await expect(page).toHaveURL('/');
    });

    await test.step("Check that the page title contains 'Simon Foster' or 'Funky Si'", async () => {
      // 3. Check that the page title contains 'Simon Foster' or 'Funky Si'
      await expect(page).toHaveTitle(/Simon Foster|Funky Si/i);
    });

    await test.step('Verify the main navigation menu is visible', async () => {
      // 4. Verify the main navigation menu is visible
      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Start Here', exact: true })).toBeVisible();
    });

    await test.step('Confirm home hero Start Here next-step is present', async () => {
      const heroCta = page.locator('.home-hero .home-hero__cta a');
      await expect(heroCta).toBeVisible();
      await expect(heroCta).toHaveAttribute('href', /\/start-here\/?$/);
    });

    await test.step('Confirm blog posts are displayed on the homepage', async () => {
      // 5. Confirm blog posts are displayed on the homepage
      const posts = page.locator('article, .post, [class*="post"]').first();
      await expect(posts).toBeVisible();

      // Verify at least 5 blog posts are visible
      const postCount = await page.locator('article, .post, [class*="post"]').count();
      expect(postCount).toBeGreaterThanOrEqual(5);
    });

  });
});