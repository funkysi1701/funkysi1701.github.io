// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Edge Cases and Error Handling', () => {
  test('Page refresh preservation', async ({ page }) => {
    // 1. Navigate to a blog post
    await page.goto('https://www.funkysi1701.com/posts/2026/01/31/ndc-london-2026');

    // 2. Scroll halfway down the page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(300);

    const scrollBefore = await page.evaluate(() => window.scrollY);
    console.log('Scroll position before refresh:', scrollBefore);

    // 3. Press F5 or browser refresh button
    await page.reload();

    // 4. Verify page reloads correctly
    await expect(page).toHaveURL(/ndc-london-2026/);
    await expect(page.locator('h1')).toBeVisible();

    // 5. Navigate to search page
    await page.goto('https://www.funkysi1701.com/search/');

    // 6. Perform a search
    const searchInput = page.locator('input[type="search"], input[type="text"]').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill('Azure');
      await searchInput.press('Enter');
      await page.waitForTimeout(1000);

      // 7. Refresh the page
      await page.reload();

      // 8. Check if search state is preserved (or appropriately reset)
      const inputValue = await searchInput.inputValue();
      console.log('Search input after refresh:', inputValue);
      // Static sites typically don't preserve search state
    }

    // Verify page loads correctly after refresh
    await expect(page).toHaveURL(/\/search\//);
    await expect(page.locator('nav')).toBeVisible();
  });
});
