// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';

test.describe('Edge Cases and Error Handling', () => {
  test('Multiple browser tabs', async ({ context, page }) => {
    let page2: Page | undefined;
    let page3: Page | undefined;

    try {
      await test.step('Open https://www.funkysi1701.com in first tab', async () => {
        // 1. Open https://www.funkysi1701.com in first tab
        await page.goto('/');
      });

      await test.step('Open homepage in second tab', async () => {
        // 2. Open homepage in second tab
        page2 = await context.newPage();
        await page2.goto('/');
      });

      await test.step('Navigate to different pages in each tab', async () => {
        // 3. Navigate to different pages in each tab
        await page.goto('/about/');
        await page2!.goto('/projects/');
      });

      await test.step('Switch between tabs', async () => {
        // 4. Switch between tabs
        await page.bringToFront();
        await expect(page).toHaveURL(/\/about\//);

        await page2!.bringToFront();
        await expect(page2!).toHaveURL(/\/projects\//);
      });

      await test.step('Verify content loads correctly in each tab', async () => {
        // 5. Verify content loads correctly in each tab
        await expect(page.locator('nav').first()).toBeVisible();
        await expect(page2!.locator('nav').first()).toBeVisible();
      });

      await test.step('Check for any state conflicts', async () => {
        // 6. Check for any state conflicts
        // Static site shouldn't have state conflicts
      });

      await test.step('Open external links which create new tabs', async () => {
        // 7. Open external links which create new tabs
        page3 = await context.newPage();
        await page3.goto('/contact/');
      });

      await test.step('Verify all tabs function independently', async () => {
        // 8. Verify all tabs function independently
        await expect(page).toHaveURL(/\/about\//);
        await expect(page2!).toHaveURL(/\/projects\//);
        await expect(page3!).toHaveURL(/\/contact\//);
      });
    } finally {
      await page2?.close();
      await page3?.close();
    }

  });
});
