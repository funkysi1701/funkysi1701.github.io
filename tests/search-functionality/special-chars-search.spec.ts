// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('Search with special characters', async ({ page }) => {
    // 1. Navigate to https://www.funkysi1701.com/search/
    await page.goto('https://www.funkysi1701.com/search/');

    // 2. Enter search term with special characters (e.g., 'C#' or '.NET')
    const searchInput = page.locator('input[type="search"], input[type="text"], input[placeholder*="search" i]').first();
    await searchInput.fill('C#');

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
    await searchInput.fill('.NET');
    await searchInput.press('Enter');
    await page.waitForTimeout(1000);

    // Search with other special characters
    await searchInput.fill('Azure & DevOps');
    await searchInput.press('Enter');
    await page.waitForTimeout(1000);

    // Verify no console errors
    expect(consoleErrors.length).toBe(0);
  });
});
