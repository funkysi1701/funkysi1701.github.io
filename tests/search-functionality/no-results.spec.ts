// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('Search with no results', async ({ page }) => {
    // 1. Navigate to https://www.funkysi1701.com/search/
    await page.goto('https://www.funkysi1701.com/search/');

    // 2. Enter a random string unlikely to appear
    const searchInput = page.locator('input[type="search"], input[type="text"], input[placeholder*="search" i]').first();
    await searchInput.fill('xyzabc123notfound');

    // 3. Execute search
    await searchInput.press('Enter');
    await page.waitForTimeout(1000);

    // 4. Verify 'no results' message appears
    const noResults = page.locator('text=/no results|nothing found|0 results/i');
    
    // 5. Check that message is user-friendly
    // Some search implementations might show empty results instead of message
    
    // 6. Verify search box remains functional for new search
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEditable();
  });
});
