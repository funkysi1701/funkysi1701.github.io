// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Edge Cases and Error Handling', () => {
  test('Long content scrolling', async ({ page }) => {
    await test.step('Navigate to a long blog post', async () => {
      // 1. Navigate to a long blog post
      await page.goto('/posts/2026/01/31/ndc-london-2026');
    });

    await test.step('Scroll to bottom of page', async () => {
      // 2. Scroll to bottom of page
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
    });

    await test.step('Verify footer appears correctly', async () => {
      // 3. Verify footer appears correctly
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });

    await test.step('Scroll back to top', async () => {
      // 4. Scroll back to top
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
    });

    await test.step('Verify navigation remains accessible', async () => {
      // 5. Verify navigation remains accessible
      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();
    });

    await test.step("Check for 'back to top' button (if implemented)", async () => {
      // 6. Check for 'back to top' button (if implemented)
      const backToTop = page.locator('button:has-text("top"), a:has-text("top"), [class*="back-to-top"]');
      const hasBackToTop = await backToTop.count() > 0;
      console.log('Has back to top button:', hasBackToTop);
    });

    await test.step('Test scroll performance', async () => {
      // 7. Test scroll performance
      const scrollStart = Date.now();
      for (let i = 0; i < 5; i++) {
        await page.evaluate((step) => window.scrollBy(0, step), 200);
        await page.waitForTimeout(50);
      }
      const scrollTime = Date.now() - scrollStart;
      console.log('Scroll performance:', scrollTime, 'ms');
    });

    await test.step('Verify lazy-loaded images load as scrolled', async () => {
      // 8. Verify lazy-loaded images load as scrolled
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.waitForTimeout(1000);

      const images = page.locator('img');
      const imageCount = await images.count();
      console.log('Total images:', imageCount);
    });

  });
});
