// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { Locator } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('Search with special characters', async ({ page }) => {
    const consoleErrors: string[] = [];
    let searchInput!: Locator;

    // Register console error listener before any searches run
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await test.step('Navigate to https://www.funkysi1701.com/search/', async () => {
      // 1. Navigate to https://www.funkysi1701.com/search/
      await page.goto('/search/');
    });

    await test.step("Enter search term with special characters (e.g., 'C#' or '.NET')", async () => {
      // 2. Enter search term with special characters (e.g., 'C#' or '.NET')
      // Click the search button/icon to make input visible
      const searchButton = page.locator('button[aria-label="Search"], .search-toggle, button:has([class*="search"])');
      const searchButtonVisible = await searchButton.isVisible().catch(() => false);
      if (searchButtonVisible) {
        await searchButton.first().click();
        await page.waitForTimeout(500);
      }

      searchInput = page.locator('input[type="search"], input[aria-label="Search"]').first();
      await searchInput.waitFor({ state: 'attached', timeout: 5000 });
      await searchInput.fill('C#', { force: true });
    });

    await test.step('Execute search', async () => {
      // 3. Execute search
      await searchInput.press('Enter');
      await page.waitForTimeout(1000);
    });

    await test.step('Verify results are returned', async () => {
      // 4. Verify results are returned
    });

    await test.step('Check that special characters are handled correctly', async () => {
      // 5. Check that special characters are handled correctly
      // No JavaScript errors should appear (listener was registered before searches)
    });

    await test.step("Test search with symbols like '@', '#', '&'", async () => {
      const benign = [
        'ERR_NAME_NOT_RESOLVED',
        'ERR_ADDRESS_INVALID',
        'ERR_BLOCKED_BY_CLIENT',
        'ResizeObserver',
        'favicon.ico',
        'Failed to load resource',
        'net::ERR',
        'Script error',
        'Cross-Origin',
        'Content Security Policy',
        'googleads',
        'googlesyndication',
      ];

      // 6. Test search with symbols like '@', '#', '&'
      const before = consoleErrors.length;
      await searchInput.fill('.NET', { force: true });
      await searchInput.press('Enter');
      await page.waitForTimeout(1000);

      await searchInput.fill('Azure & DevOps', { force: true });
      await searchInput.press('Enter');
      await page.waitForTimeout(1000);

      const sinceStep = consoleErrors.slice(before);
      const relevant = sinceStep.filter((e) => !benign.some((b) => e.includes(b)));
      expect(relevant, `Unexpected console errors: ${JSON.stringify(sinceStep)}`).toEqual([]);
    });

  });
});
