// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Edge Cases and Error Handling', () => {
  test('Concurrent user sessions', async ({ browser }) => {
    // eslint-disable-next-line prefer-const
    let context1: any;
    // eslint-disable-next-line prefer-const
    let context2: any;
    // eslint-disable-next-line prefer-const
    let page1: any;
    // eslint-disable-next-line prefer-const
    let page2: any;

    await test.step('Open site in regular browser window', async () => {
      // 1. Open site in regular browser window
      context1 = await browser.newContext();
      page1 = await context1.newPage();
      await page1.goto('https://www.funkysi1701.com');
    });

    await test.step('Open site in incognito/private window', async () => {
      // 2. Open site in incognito/private window
      context2 = await browser.newContext();
      page2 = await context2.newPage();
      await page2.goto('https://www.funkysi1701.com');
    });

    await test.step('Navigate to different pages in each window', async () => {
      // 3. Navigate to different pages in each window
      await page1.goto('https://www.funkysi1701.com/about/');
      await page2.goto('https://www.funkysi1701.com/projects/');
    });

    await test.step('Verify both sessions work independently', async () => {
      // 4. Verify both sessions work independently
      await expect(page1).toHaveURL(/\/about\//);
      await expect(page2).toHaveURL(/\/projects\//);
    });

    await test.step('Test comment functionality in both (if logged in)', async () => {
      // 5. Test comment functionality in both (if logged in)
      // This would require authentication - skipping for basic test
    });

    await test.step('Check for any session conflicts', async () => {
      // 6. Check for any session conflicts
      await expect(page1.locator('nav').first()).toBeVisible();
      await expect(page2.locator('nav').first()).toBeVisible();

      // Navigate to same page in both contexts
      await page1.goto('https://www.funkysi1701.com/posts/2026/01/31/ndc-london-2026');
      await page2.goto('https://www.funkysi1701.com/posts/2026/01/31/ndc-london-2026');

      // Both should load independently
      await expect(page1.locator('h1')).toBeVisible();
      await expect(page2.locator('h1')).toBeVisible();

      await context1.close();
      await context2.close();
    });

  });
});
