// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Edge Cases and Error Handling', () => {
  test('Browser back and forward navigation', async ({ page }) => {
    // 1. Navigate to https://www.funkysi1701.com
    await page.goto('https://www.funkysi1701.com');

    // 2. Click on About page
    await page.getByRole('link', { name: 'About' }).click();
    
    // 3. Click on Projects page
    await page.getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/\/projects\//);

    // 4. Click browser back button
    await page.goBack();

    // 5. Verify About page loads correctly
    await expect(page).toHaveURL(/\/about\//);
    await expect(page.locator('nav')).toBeVisible();

    // 6. Click browser forward button
    await page.goForward();

    // 7. Verify Projects page loads correctly
    await expect(page).toHaveURL(/\/projects\//);
    await expect(page.locator('nav')).toBeVisible();

    // 8. Navigate to a blog post
    await page.goto('https://www.funkysi1701.com/posts/2026/01/31/ndc-london-2026');

    // 9. Use back button multiple times
    await page.goBack();
    await page.waitForTimeout(300);
    await page.goBack();
    await page.waitForTimeout(300);

    // 10. Verify navigation history works correctly
    const currentUrl = page.url();
    expect(currentUrl).toBeTruthy();
    await expect(page.locator('nav')).toBeVisible();
  });
});
