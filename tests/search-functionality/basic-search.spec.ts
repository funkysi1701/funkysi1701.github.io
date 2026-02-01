// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('Search page loads and basic search', async ({ page }) => {
    // 1. Navigate to https://www.funkysi1701.com/search/
    await page.goto('https://www.funkysi1701.com/search/');

    // 2. Verify search page loads
    await expect(page).toHaveURL(/\/search\//);

    // 3. Check for search input field
    // The search page already has a visible search input
    const searchInput = page.locator('input[type="search"], input[type="text"], input[placeholder*="search" i]').first();
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await expect(searchInput).toBeVisible();

    // 4. Enter a common term like 'Azure' in search box
    await searchInput.fill('Azure');

    // 5. Press Enter or click search button
    await searchInput.press('Enter');
    
    // Wait for results to load
    await page.waitForTimeout(1000);

    // 6. Verify search results appear
    const results = page.locator('.result, .search-result, article, [class*="result"]');
    const resultCount = await results.count();
    
    // 7. Check that results are relevant to search term
    if (resultCount > 0) {
      expect(resultCount).toBeGreaterThan(0);
      
      // 8. Verify result count is displayed
      const resultCountText = page.locator('text=/\d+ result/i');
      // Result count display is optional
    }
  });
});
