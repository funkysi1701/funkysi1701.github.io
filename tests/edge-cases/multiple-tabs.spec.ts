// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Edge Cases and Error Handling', () => {
  test('Multiple browser tabs', async ({ context, page }) => {
    // 1. Open https://www.funkysi1701.com in first tab
    await page.goto('https://www.funkysi1701.com');

    // 2. Open homepage in second tab
    const page2 = await context.newPage();
    await page2.goto('https://www.funkysi1701.com');

    // 3. Navigate to different pages in each tab
    await page.goto('https://www.funkysi1701.com/about/');
    await page2.goto('https://www.funkysi1701.com/projects/');

    // 4. Switch between tabs
    await page.bringToFront();
    await expect(page).toHaveURL(/\/about\//);

    await page2.bringToFront();
    await expect(page2).toHaveURL(/\/projects\//);

    // 5. Verify content loads correctly in each tab
    await expect(page.locator('nav').first()).toBeVisible();
    await expect(page2.locator('nav').first()).toBeVisible();

    // 6. Check for any state conflicts
    // Static site shouldn't have state conflicts

    // 7. Open external links which create new tabs
    const page3 = await context.newPage();
    await page3.goto('https://www.funkysi1701.com/contact/');

    // 8. Verify all tabs function independently
    await expect(page).toHaveURL(/\/about\//);
    await expect(page2).toHaveURL(/\/projects\//);
    await expect(page3).toHaveURL(/\/contact\//);

    await page2.close();
    await page3.close();
  });
});
