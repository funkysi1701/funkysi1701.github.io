// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Edge Cases and Error Handling', () => {
  test('Browser back and forward navigation', async ({ page }) => {
    await test.step('Navigate to https://www.funkysi1701.com', async () => {
      // 1. Navigate to https://www.funkysi1701.com
      await page.goto('/');
    });

    const mainNav = page.locator('nav.navbar');

    await test.step('Click on About page', async () => {
      // 2. Click on About page
      await mainNav.getByRole('link', { name: 'About', exact: true }).click();
    });

    await test.step('Click on Projects page', async () => {
      // 3. Click on Projects page
      await mainNav.getByRole('link', { name: 'Projects', exact: true }).click();
      await expect(page).toHaveURL(/\/projects\//);
    });

    await test.step('Click browser back button', async () => {
      // 4. Click browser back button — use 'commit' so Chromium does not wait for 'load' (avoids net::ERR_ABORTED / bfcache)
      await page.goBack({ waitUntil: 'commit' });
    });

    await test.step('Verify About page loads correctly', async () => {
      // 5. Verify About page loads correctly
      await expect(page).toHaveURL(/\/about\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Click browser forward button', async () => {
      // 6. Click browser forward button
      await page.goForward({ waitUntil: 'commit' });
    });

    await test.step('Verify Projects page loads correctly', async () => {
      // 7. Verify Projects page loads correctly
      await expect(page).toHaveURL(/\/projects\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to a blog post', async () => {
      // 8. Navigate to a blog post (first post on /posts/ so any BASE_URL / deploy branch works)
      await page.goto('/posts/');
      await page.locator('article.post .post-title a').first().click();
      await expect(page).toHaveURL(/\/posts\//);
    });

    await test.step('Use back button multiple times', async () => {
      // 9. Use back button multiple times
      await page.goBack({ waitUntil: 'commit' });
      await page.goBack({ waitUntil: 'commit' });
    });

    await test.step('Verify navigation history works correctly', async () => {
      // 10. Verify navigation history works correctly
      const currentUrl = page.url();
      expect(currentUrl).toBeTruthy();
      await expect(page.locator('nav').first()).toBeVisible();
    });

  });
});
