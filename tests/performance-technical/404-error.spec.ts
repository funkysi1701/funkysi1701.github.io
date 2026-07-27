// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { Locator, Response } from '@playwright/test';

test.describe('Performance and Technical', () => {
  test('404 error page handling', { tag: '@smoke' }, async ({ page }) => {
    let nav!: Locator;
    let response!: Response | null;

    await test.step('Navigate to a non-existent page', async () => {
      response = await page.goto('/this-page-does-not-exist');
    });

    await test.step('Verify HTTP status code is 404', async () => {
      expect(response, 'navigation should return a response').toBeTruthy();
      expect(response!.status(), 'missing pages must not soft-404 as HTTP 200').toBe(404);
    });

    await test.step('Verify custom 404 page is displayed', async () => {
      await expect(page.locator('body')).toBeVisible();
      // Must be the real 404 page, not the homepage SPA fallback.
      await expect(page.locator('h1')).toContainText(/not found|404/i);
      await expect(page).not.toHaveTitle(/Senior \.NET/i);
    });

    await test.step('Check that 404 page has navigation menu', async () => {
      nav = page.locator('nav').first();
      await expect(nav).toBeVisible();
    });

    await test.step('Verify 404 page has helpful message', async () => {
      const content = page.locator('main, article, .content').first();
      await expect(content).toBeVisible();
      await expect(content).toContainText(/not found|oops|exist/i);
    });

    await test.step('Test link back to homepage', async () => {
      const homeLink = page.locator('a[href="/"], a:has-text("home")').first();
      if ((await homeLink.count()) > 0) {
        await expect(homeLink).toBeVisible();
      }

      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Missing static assets must not soft-404 as HTML', async () => {
      const asset = await page.request.get('/img/this-asset-does-not-exist-xyz.png');
      expect(asset.status(), 'missing assets must return 404, not homepage HTML').toBe(404);
      const body = await asset.text();
      // SWA may serve /404.html for missing assets (HTML is fine) — but it must be the
      // 404 page, not the homepage. Site meta still mentions "Senior .NET", so match on <title>.
      expect(body, 'missing assets must not soft-404 as the homepage').not.toMatch(
        /<title>\s*Senior \.NET/i,
      );
      expect(body).toMatch(/404 Page not found|Oops!\s*Page not found/i);
    });
  });
});
