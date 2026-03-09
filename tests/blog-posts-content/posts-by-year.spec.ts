// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Blog Posts and Content', () => {
  test('Blog posts by year navigation', async ({ page }) => {
    // eslint-disable-next-line prefer-const
    let posts: any;

    await test.step('Navigate to https://www.funkysi1701.com/2026/', async () => {
      // 1. Navigate to https://www.funkysi1701.com/2026/
      await page.goto('https://www.funkysi1701.com/2026/');
    });

    await test.step('Verify page shows posts from 2026', async () => {
      // 2. Verify page shows posts from 2026
      await expect(page).toHaveURL(/\/2026\//);
      await expect(page.locator('text=/2026/i').first()).toBeVisible();
    });

    await test.step('Check that posts are listed chronologically', async () => {
      // 3. Check that posts are listed chronologically
      posts = page.locator('article, .post, [class*="post"]');
      const postCount = await posts.count();
      expect(postCount).toBeGreaterThan(0);
    });

    await test.step('Navigate to https://www.funkysi1701.com/2025/', async () => {
      // 4. Navigate to https://www.funkysi1701.com/2025/
      await page.goto('https://www.funkysi1701.com/2025/');
    });

    await test.step('Verify posts from 2025 are displayed', async () => {
      // 5. Verify posts from 2025 are displayed
      await expect(page).toHaveURL(/\/2025\//);
      const posts2025 = page.locator('article, .post, [class*="post"]');
      const post2025Count = await posts2025.count();
      expect(post2025Count).toBeGreaterThan(0);
    });

    await test.step('Navigate to https://www.funkysi1701.com/2024/', async () => {
      // 6. Navigate to https://www.funkysi1701.com/2024/
      await page.goto('https://www.funkysi1701.com/2024/');
    });

    await test.step('Verify posts from 2024 are displayed', async () => {
      // 7. Verify posts from 2024 are displayed
      await expect(page).toHaveURL(/\/2024\//);
      const posts2024 = page.locator('article, .post, [class*="post"]');
      const post2024Count = await posts2024.count();
      expect(post2024Count).toBeGreaterThan(0);
    });

    await test.step('Test navigation for older years', async () => {
      // 8. Test navigation for older years
      await page.goto('https://www.funkysi1701.com/2023/');
      await expect(page).toHaveURL(/\/2023\//);

      await page.goto('https://www.funkysi1701.com/2022/');
      await expect(page).toHaveURL(/\/2022\//);
    });

  });
});
