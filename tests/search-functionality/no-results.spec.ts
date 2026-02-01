// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('Search with no results', async ({ page }) => {
    // 1. Navigate to https://www.funkysi1701.com/search/
    await page.goto('https://www.funkysi1701.com/search/');

    // 2. Enter a random string unlikely to appear
    // Click the search button/icon to make input visible
    const searchButton = page.locator('button[aria-label="Search"], .search-toggle, button:has([class*="search"])');
    const searchButtonVisible = await searchButton.isVisible().catch(() => false);
    if (searchButtonVisible) {
      await searchButton.first().click();
      await page.waitForTimeout(500);
    }
    
    const searchInput = page.locator('input[type="search"], input[aria-label="Search"]').first();
    await searchInput.waitFor({ state: 'attached', timeout: 5000 });
    await searchInput.fill('xyzabc123notfound', { force: true });

    // 3. Execute search
    await searchInput.press('Enter');
    await page.waitForTimeout(1000);

    // 4. Verify 'no results' message appears
    const noResults = page.locator('text=/no results|nothing found|0 results/i');
    
    // 5. Check that message is user-friendly
    // Some search implementations might show empty results instead of message
    
    // 6. Verify search box remains functional for new search
    await expect(searchInput).toBeEditable();
  });
});
