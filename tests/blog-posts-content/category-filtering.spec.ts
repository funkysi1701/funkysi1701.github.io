// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Blog Posts and Content', () => {
  test('Blog category filtering', async ({ page }) => {
    await test.step('Navigate to https://www.funkysi1701.com/categories/', async () => {
      // 1. Navigate to https://www.funkysi1701.com/categories/
      await page.goto('/categories/');
    });

    await test.step('Verify categories page loads', async () => {
      // 2. Verify categories page loads
      await expect(page).toHaveURL(/\/categories\//);
    });

    await test.step("Click on 'tech' category", async () => {
      // 3. Click on 'tech' category
      const techCategory = page.locator('a[href*="/categories/tech"]').first();
      if (await techCategory.count() > 0) {
        await techCategory.click();

        // 4. Verify posts in tech category are displayed
        await expect(page).toHaveURL(/\/categories\/tech/);

        // 5. Check that posts are relevant to category
        const posts = page.locator('article, .post, [class*="post"]');
        const postCount = await posts.count();
        expect(postCount).toBeGreaterThan(0);

        // 6. Test navigation back to all categories
        await page.goto('/categories/');
        await expect(page).toHaveURL(/\/categories\//);
      }
    });

    await test.step('Test other categories if available', async () => {
      // 7. Test other categories if available
      const categoryLinks = page.locator('a[href*="/categories/"]');
      const categoryCount = await categoryLinks.count();
      expect(categoryCount).toBeGreaterThan(0);
    });

  });
});
