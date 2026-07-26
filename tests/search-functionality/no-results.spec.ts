// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';

async function waitForSearchStat(page: Page) {
  // Search loads index.json then updates #searchStat; spinner is visible while loading.
  await page.locator('#loadingSpinner').waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => {});
  await expect(page.locator('#searchStat')).not.toHaveText('', { timeout: 15_000 });
}

test.describe('Search Functionality', () => {
  test('Search with no results', async ({ page }) => {
    await test.step('Navigate with a nonsense query that previously produced fuzzy matches', async () => {
      // "xyzzy" has no exact occurrence in the search index, but the old
      // default Fuse threshold returned 129 weak matches for it.
      await page.goto('/search/?q=xyzzy');
      await waitForSearchStat(page);
    });

    await test.step("Verify 'no results' message appears", async () => {
      await expect(page.locator('#searchStat')).toContainText(/no results/i);
      await expect(page.locator('#searchResults .search-result')).toHaveCount(0);
    });

    await test.step('Verify search box remains functional for new search', async () => {
      const searchInput = page.locator('#searchForm input[name="q"]');
      await expect(searchInput).toHaveValue('xyzzy');
      await expect(searchInput).toBeEditable();
    });
  });

  test('Focused searches do not return most of the index', async ({ page }) => {
    await page.goto('/search/?q=parkrun');
    await waitForSearchStat(page);

    const stat = page.locator('#searchStat');
    await expect(stat).toContainText(/found \d+ results?/i);

    const text = await stat.textContent();
    const total = Number(text?.match(/\d+/)?.[0]);
    expect(total, 'a focused query should return a small relevant result set').toBeGreaterThan(0);
    expect(total, 'a focused query must not weakly match most posts').toBeLessThanOrEqual(20);

    await expect(page.locator('#searchResults .search-result').first()).toBeVisible();
  });
});
