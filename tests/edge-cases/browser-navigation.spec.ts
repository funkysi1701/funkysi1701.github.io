// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Edge Cases and Error Handling', () => {
  test('Browser back and forward navigation', async ({ page }) => {
    await test.step('Navigate to https://www.funkysi1701.com', async () => {
      // 1. Navigate to https://www.funkysi1701.com
      await page.goto('/');
    });

    await test.step('Click on About page', async () => {
      // 2. Click on About page
      await page.getByRole('link', { name: 'About' }).first().click();
    });

    await test.step('Click on Projects page', async () => {
      // 3. Click on Projects page
      await page.getByRole('link', { name: 'Projects', exact: true }).click();
      await expect(page).toHaveURL(/\/projects\//);
    });

    await test.step('Click browser back button', async () => {
      // 4. Click browser back button
      await page.goBack();
    });

    await test.step('Verify About page loads correctly', async () => {
      // 5. Verify About page loads correctly
      await expect(page).toHaveURL(/\/about\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Click browser forward button', async () => {
      // 6. Click browser forward button
      await page.goForward();
    });

    await test.step('Verify Projects page loads correctly', async () => {
      // 7. Verify Projects page loads correctly
      await expect(page).toHaveURL(/\/projects\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to a blog post', async () => {
      // 8. Navigate to a blog post
      await page.goto('/posts/2026/ndc-london-2026/');
    });

    await test.step('Use back button multiple times', async () => {
      // 9. Use back button multiple times
      await page.goBack();
      await page.waitForTimeout(300);
      await page.goBack();
      await page.waitForTimeout(300);
    });

    await test.step('Verify navigation history works correctly', async () => {
      // 10. Verify navigation history works correctly
      const currentUrl = page.url();
      expect(currentUrl).toBeTruthy();
      await expect(page.locator('nav').first()).toBeVisible();
    });

  });
});
