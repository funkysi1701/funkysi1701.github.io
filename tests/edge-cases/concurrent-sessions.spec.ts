// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Edge Cases and Error Handling', () => {
  test('Concurrent user sessions', async ({ browser }) => {
    // 1. Open site in regular browser window
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    await page1.goto('https://www.funkysi1701.com');

    // 2. Open site in incognito/private window
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await page2.goto('https://www.funkysi1701.com');

    // 3. Navigate to different pages in each window
    await page1.goto('https://www.funkysi1701.com/about/');
    await page2.goto('https://www.funkysi1701.com/projects/');

    // 4. Verify both sessions work independently
    await expect(page1).toHaveURL(/\/about\//);
    await expect(page2).toHaveURL(/\/projects\//);

    // 5. Test comment functionality in both (if logged in)
    // This would require authentication - skipping for basic test

    // 6. Check for any session conflicts
    await expect(page1.locator('nav')).toBeVisible();
    await expect(page2.locator('nav')).toBeVisible();

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
