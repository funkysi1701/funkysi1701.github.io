// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Edge Cases and Error Handling', () => {
  test('JavaScript disabled fallback', async ({ browser }) => {
    // eslint-disable-next-line prefer-const
    let context: any;
    // eslint-disable-next-line prefer-const
    let page: any;

    await test.step('Disable JavaScript in browser', async () => {
      // 1. Disable JavaScript in browser
      context = await browser.newContext({
        javaScriptEnabled: false
      });
      page = await context.newPage();
    });

    await test.step('Navigate to https://www.funkysi1701.com', async () => {
      // 2. Navigate to https://www.funkysi1701.com
      await page.goto('https://www.funkysi1701.com');
    });

    await test.step('Verify basic content is still visible', async () => {
      // 3. Verify basic content is still visible
      await expect(page.locator('body')).toBeVisible();
    });

    await test.step('Check that navigation links work', async () => {
      // 4. Check that navigation links work
      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();

      // Get all navigation links
      const navLinks = await page.locator('nav a').all();
      expect(navLinks.length).toBeGreaterThan(0);
    });

    await test.step('Test blog post access', async () => {
      // 5. Test blog post access
      await page.goto('https://www.funkysi1701.com/posts/2026/01/31/ndc-london-2026');
    });

    await test.step('Verify static content loads', async () => {
      // 6. Verify static content loads
      await expect(page.locator('h1')).toBeVisible();
    });

    await test.step('Check if graceful degradation exists', async () => {
      // 7. Check if graceful degradation exists
      // Hugo is a static site generator, so it should work without JS
      const content = page.locator('article, main, .content').first();
      await expect(content).toBeVisible();

      await context.close();
    });

  });
});
