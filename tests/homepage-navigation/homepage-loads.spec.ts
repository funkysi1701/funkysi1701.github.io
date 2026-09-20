// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import { SITE_TITLE_PATTERN } from '../site-title';

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

    await test.step('Check that the page title includes the environment site title', async () => {
      // 3. Check that the page title includes the Hugo site title for this BASE_URL
      await expect(page).toHaveTitle(SITE_TITLE_PATTERN);
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

    await test.step('Confirm Popular right now strip is present', async () => {
      const popular = page.locator('.home-popular');
      await expect(popular).toBeVisible();
      await expect(popular.getByRole('heading', { name: 'Popular right now' })).toBeVisible();

      // Curation is auto-refreshed from Cloudflare top pages, so assert the
      // shape (3-5 post links) rather than specific URLs.
      const links = popular.locator('a.home-popular__link[href*="/posts/"]');
      const linkCount = await links.count();
      expect(linkCount).toBeGreaterThanOrEqual(3);
      expect(linkCount).toBeLessThanOrEqual(5);
      await expect(links.first()).toBeVisible();
    });

    await test.step('Confirm blog posts are displayed on the homepage', async () => {
      // 5. Confirm blog posts are displayed on the homepage
      const posts = page.locator('article, .post, [class*="post"]').first();
      await expect(posts).toBeVisible();

      // Verify at least 5 blog posts are visible
      const postCount = await page.locator('article, .post, [class*="post"]').count();
      expect(postCount).toBeGreaterThanOrEqual(5);
    });

    await test.step('Confirm sidebar Tags chips (top 20) and View all tags', async () => {
      const tagsCard = page.locator('.tags-taxonomies');
      await expect(tagsCard).toBeVisible();
      const chips = tagsCard.locator('.tag-chips a.post-taxonomy[href*="/tags/"]');
      const chipCount = await chips.count();
      expect(chipCount).toBeGreaterThan(0);
      expect(chipCount).toBeLessThanOrEqual(20);
      await expect(chips.first()).toBeVisible();
      const viewAll = tagsCard.locator('.tag-chips__all a');
      await expect(viewAll).toBeVisible();
      await expect(viewAll).toHaveAttribute('href', /\/tags\/?$/);
    });

  });
});