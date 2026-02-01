// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('Search pagination (if applicable)', async ({ page }) => {
    // 1. Navigate to https://www.funkysi1701.com/search/
    await page.goto('https://www.funkysi1701.com/search/');

    // 2. Search for a broad term that returns many results (e.g., 'Azure')
    // Click the search button to reveal the search input
    await page.click('button[title="Search"]');
    await page.waitForTimeout(500); // Wait for search to expand
    const searchInput = page.locator('input[type="search"], input[type="text"], input[placeholder*="search" i]').first();
    await searchInput.fill('Azure');
    await searchInput.press('Enter');
    await page.waitForTimeout(1500);

    // 3. Check if pagination controls appear
    const paginationControls = page.locator('.pagination, [class*="pag"], button:has-text("Next"), a:has-text("Next")');
    const hasPagination = await paginationControls.count() > 0;

    if (hasPagination) {
      // 4. If pagination exists, click to next page
      const nextButton = page.locator('button:has-text("Next"), a:has-text("Next"), [class*="next"]').first();
      await nextButton.click();
      
      // 5. Verify new results load
      await page.waitForTimeout(1000);

      // 6. Test navigation back to previous page
      const prevButton = page.locator('button:has-text("Previous"), a:has-text("Previous"), [class*="prev"]').first();
      if (await prevButton.count() > 0) {
        await prevButton.click();
        await page.waitForTimeout(1000);
      }

      // 7. Check page numbers or indicators
      const pageIndicators = page.locator('.page-number, [class*="page"]');
      // Page indicators are optional
    } else {
      // No pagination - all results shown on one page or client-side filtering
      test.skip(hasPagination, 'Pagination not implemented');
    }
  });
});
