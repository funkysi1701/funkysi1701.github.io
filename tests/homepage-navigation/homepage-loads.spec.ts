// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Homepage and Navigation', () => {
  test('Homepage loads successfully', async ({ page }) => {
    // 1. Navigate to https://www.funkysi1701.com
    await page.goto('https://www.funkysi1701.com');

    // 2. Verify the page loads without errors
    await expect(page).toHaveURL('https://www.funkysi1701.com/');
    
    // 3. Check that the page title contains 'Simon Foster' or 'Funky Si'
    await expect(page).toHaveTitle(/Simon Foster|Funky Si/i);

    // 4. Verify the main navigation menu is visible
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();

    // 5. Confirm blog posts are displayed on the homepage
    const posts = page.locator('article, .post, [class*="post"]').first();
    await expect(posts).toBeVisible();
    
    // Verify at least 5 blog posts are visible
    const postCount = await page.locator('article, .post, [class*="post"]').count();
    expect(postCount).toBeGreaterThanOrEqual(5);
  });
});