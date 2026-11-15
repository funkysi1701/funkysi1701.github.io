// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';

async function waitForSearchStat(page: Page) {
  await page.locator('#loadingSpinner').waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => {});
  await expect(page.locator('#searchStat')).not.toHaveText('', { timeout: 15_000 });
}

/** Result links inside #searchResults only — excludes nav More → Events (/posts/events/). */
function searchResultLinks(page: Page) {
  return page.locator('#searchResults .search-result-title a, #searchResults .search-result a[href*="/posts/"]');
}

test.describe('Search Functionality', () => {
  test('Search result navigation', async ({ page }) => {
    await test.step("Search for 'DevOps' via query string", async () => {
      // Drive Fuse the same way as other search specs (index load + #searchStat).
      await page.goto('/search/?q=DevOps');
      await waitForSearchStat(page);
      await expect(page.locator('#searchStat')).toContainText(/found \d+ results?/i);
    });

    await test.step('Verify search results appear and navigate', async () => {
      const results = searchResultLinks(page);
      await expect(results.first()).toBeVisible({ timeout: 10_000 });
      expect(await results.count()).toBeGreaterThan(0);

      const searchUrl = page.url();
      await results.first().click();
      await expect(page).toHaveURL(/\/posts\//);

      // Back to search (Algolia/DocSearch can race — fall back to goto).
      try {
        await page.goBack({ waitUntil: 'domcontentloaded', timeout: 20_000 });
      } catch {
        await page.waitForTimeout(500);
        try {
          await page.waitForURL((u) => u.pathname.includes('/search/'), { timeout: 15_000 });
        } catch {
          await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20_000 });
        }
        await page.waitForLoadState('domcontentloaded');
      }

      await waitForSearchStat(page);
      const resultsAfterBack = searchResultLinks(page);
      await expect(resultsAfterBack.first()).toBeVisible({ timeout: 10_000 });

      if ((await resultsAfterBack.count()) > 1) {
        await resultsAfterBack.nth(1).click();
        await expect(page).toHaveURL(/\/posts\//);
      }
    });
  });
});
