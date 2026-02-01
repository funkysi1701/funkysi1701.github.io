// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Performance and Technical', () => {
  test('404 error page handling', async ({ page }) => {
    // 1. Navigate to a non-existent page
    const response = await page.goto('https://www.funkysi1701.com/this-page-does-not-exist');
    
    // 6. Verify HTTP status code is 404
    // Note: Azure Static Web Apps returns 200 with custom 404 page
    if (response) {
      expect(response.status()).toBe(200);
    }

    // 2. Verify custom 404 page is displayed
    await expect(page.locator('text=/404|not found|page.*not.*found/i')).toBeVisible();

    // 3. Check that 404 page has navigation menu
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // 4. Verify 404 page has helpful message
    const content = page.locator('main, article, .content');
    await expect(content).toBeVisible();

    // 5. Test link back to homepage
    const homeLink = page.locator('a[href="/"], a:has-text("home")').first();
    if (await homeLink.count() > 0) {
      await expect(homeLink).toBeVisible();
    }

    // Verify page maintains site design
    await expect(page.locator('nav')).toBeVisible();
  });
});
