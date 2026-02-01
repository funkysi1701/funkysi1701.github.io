// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Edge Cases and Error Handling', () => {
  test('JavaScript disabled fallback', async ({ browser }) => {
    // 1. Disable JavaScript in browser
    const context = await browser.newContext({
      javaScriptEnabled: false
    });
    const page = await context.newPage();

    // 2. Navigate to https://www.funkysi1701.com
    await page.goto('https://www.funkysi1701.com');

    // 3. Verify basic content is still visible
    await expect(page.locator('body')).toBeVisible();

    // 4. Check that navigation links work
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();

    // Get all navigation links
    const navLinks = await page.locator('nav a').all();
    expect(navLinks.length).toBeGreaterThan(0);

    // 5. Test blog post access
    await page.goto('https://www.funkysi1701.com/posts/2026/01/31/ndc-london-2026');

    // 6. Verify static content loads
    await expect(page.locator('h1')).toBeVisible();
    
    // 7. Check if graceful degradation exists
    // Hugo is a static site generator, so it should work without JS
    const content = page.locator('article, main, .content').first();
    await expect(content).toBeVisible();

    await context.close();
  });
});
