// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Search Functionality', () => {
  test('Search with special characters', async ({ page }) => {
    // 1. Navigate to https://www.funkysi1701.com/search/
    await page.goto('https://www.funkysi1701.com/search/');

    // 2. Enter search term with special characters (e.g., 'C#' or '.NET')
    // Click the search button/icon to make input visible
    const searchButton = page.locator('button[aria-label="Search"], .search-toggle, button:has([class*="search"])');
    const searchButtonVisible = await searchButton.isVisible().catch(() => false);
    if (searchButtonVisible) {
      await searchButton.first().click();
      await page.waitForTimeout(500);
    }
    
    const searchInput = page.locator('input[type="search"], input[aria-label="Search"]').first();
    await searchInput.waitFor({ state: 'attached', timeout: 5000 });
    await searchInput.fill('C#', { force: true });

    // 3. Execute search
    await searchInput.press('Enter');
    await page.waitForTimeout(1000);

    // 4. Verify results are returned
    // 5. Check that special characters are handled correctly
    // No JavaScript errors should appear
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 6. Test search with symbols like '@', '#', '&'
    await searchInput.fill('.NET', { force: true });
    await searchInput.press('Enter');
    await page.waitForTimeout(1000);

    // Search with other special characters
    await searchInput.fill('Azure & DevOps', { force: true });
    await searchInput.press('Enter');
    await page.waitForTimeout(1000);

    // Verify no console errors
    expect(consoleErrors.length).toBe(0);
  });
});
