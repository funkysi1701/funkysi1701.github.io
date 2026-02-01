// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Blog Posts and Content', () => {
  test('Blog posts by year navigation', async ({ page }) => {
    // 1. Navigate to https://www.funkysi1701.com/2026/
    await page.goto('https://www.funkysi1701.com/2026/');

    // 2. Verify page shows posts from 2026
    await expect(page).toHaveURL(/\/2026\//);
    await expect(page.locator('text=/2026/i')).toBeVisible();

    // 3. Check that posts are listed chronologically
    const posts = page.locator('article, .post, [class*="post"]');
    const postCount = await posts.count();
    expect(postCount).toBeGreaterThan(0);

    // 4. Navigate to https://www.funkysi1701.com/2025/
    await page.goto('https://www.funkysi1701.com/2025/');

    // 5. Verify posts from 2025 are displayed
    await expect(page).toHaveURL(/\/2025\//);
    const posts2025 = page.locator('article, .post, [class*="post"]');
    const post2025Count = await posts2025.count();
    expect(post2025Count).toBeGreaterThan(0);

    // 6. Navigate to https://www.funkysi1701.com/2024/
    await page.goto('https://www.funkysi1701.com/2024/');

    // 7. Verify posts from 2024 are displayed
    await expect(page).toHaveURL(/\/2024\//);
    const posts2024 = page.locator('article, .post, [class*="post"]');
    const post2024Count = await posts2024.count();
    expect(post2024Count).toBeGreaterThan(0);

    // 8. Test navigation for older years
    await page.goto('https://www.funkysi1701.com/2023/');
    await expect(page).toHaveURL(/\/2023\//);
    
    await page.goto('https://www.funkysi1701.com/2022/');
    await expect(page).toHaveURL(/\/2022\//);
  });
});
