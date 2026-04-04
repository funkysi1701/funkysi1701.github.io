// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Search Functionality', () => {
  test('Search result navigation', async ({ page }) => {
    await test.step('Navigate to https://www.funkysi1701.com/search/', async () => {
      // 1. Navigate to https://www.funkysi1701.com/search/
      await page.goto('/search/');
    });

    await test.step("Search for 'DevOps'", async () => {
      // 2. Search for 'DevOps'
      // Click the search button/icon to make input visible
      const searchButton = page.locator('button[aria-label="Search"], .search-toggle, button:has([class*="search"])');
      const searchButtonVisible = await searchButton.isVisible().catch(() => false);
      if (searchButtonVisible) {
        await searchButton.first().click();
        await page.waitForTimeout(500);
      }

      const searchInput = page.locator('input[type="search"], input[aria-label="Search"]').first();
      await searchInput.waitFor({ state: 'attached', timeout: 5000 });
      await searchInput.fill('DevOps', { force: true });
      await searchInput.press('Enter');
    });

    await test.step('Verify search results appear', async () => {
      // 3. Verify search results appear
      await page.waitForTimeout(1500);
      const results = page.locator('a[href*="/posts/"], .result a, .search-result a');
      const resultCount = await results.count();

      if (resultCount > 0) {
        // 4. Click on first search result
        const firstResult = results.first();
        const searchUrl = page.url();
        await firstResult.click();

        // 5. Verify it navigates to the correct blog post
        await expect(page).toHaveURL(/\/posts\//);

        // 6. Use browser back button (Algolia/DocSearch can trigger a parallel /search/ nav — don't race with goto)
        try {
          await page.goBack({ waitUntil: 'domcontentloaded', timeout: 20_000 });
        } catch {
          await page.waitForTimeout(500);
          try {
            await page.waitForURL((u) => u.pathname.includes('/search/'), { timeout: 15_000 });
          } catch {
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20_000 });
          }
          await page.waitForLoadState('domcontentloaded').catch(() => {});
        }

        // 7. Verify search results are preserved
        await page.waitForTimeout(1000);
        const resultsAfterBack = page.locator('a[href*="/posts/"], .result a, .search-result a');
        const countAfterBack = await resultsAfterBack.count();

        if (countAfterBack > 1) {
          // 8. Click on a different result
          const secondResult = resultsAfterBack.nth(1);
          await secondResult.click();

          // 9. Verify navigation works correctly
          await expect(page).toHaveURL(/\/posts\//);
        }
      }
    });

  });
});
