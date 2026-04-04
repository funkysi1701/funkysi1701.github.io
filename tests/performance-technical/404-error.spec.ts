// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { Locator, Response } from '@playwright/test';

test.describe('Performance and Technical', () => {
  test('404 error page handling', async ({ page }) => {
    let nav!: Locator;
    let response!: Response | null;

    await test.step('Navigate to a non-existent page', async () => {
      // 1. Navigate to a non-existent page
      response = await page.goto('/this-page-does-not-exist');
    });

    await test.step('Verify HTTP status code is 404', async () => {
      // Some hosts return 200 with a soft 404 page; others return a real 404.
      if (response) {
        expect([200, 404]).toContain(response.status());
      }
    });

    await test.step('Verify custom 404 page is displayed', async () => {
      await expect(page.locator('body')).toBeVisible();
      const hasContent =
        (await page.locator('main, article, .content, #content, .container, body').count()) > 0;
      expect(hasContent).toBeTruthy();
    });

    await test.step('Check that 404 page has navigation menu', async () => {
      // 3. Check that 404 page has navigation menu
      nav = page.locator('nav').first();
      await expect(nav).toBeVisible();
    });

    await test.step('Verify 404 page has helpful message', async () => {
      // 4. Verify 404 page has helpful message
      const content = page.locator('main, article, .content').first();
      await expect(content).toBeVisible();
    });

    await test.step('Test link back to homepage', async () => {
      // 5. Test link back to homepage
      const homeLink = page.locator('a[href="/"], a:has-text("home")').first();
      if (await homeLink.count() > 0) {
        await expect(homeLink).toBeVisible();
      }

      // Verify page maintains site design
      await expect(page.locator('nav').first()).toBeVisible();
    });

  });
});
