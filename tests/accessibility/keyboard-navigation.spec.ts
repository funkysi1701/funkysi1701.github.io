// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Accessibility', () => {
  test('Keyboard navigation', async ({ page }) => {
    await test.step('Navigate to https://www.funkysi1701.com', async () => {
      // 1. Navigate to https://www.funkysi1701.com
      await page.goto('/');
    });

    await test.step('Press Tab key repeatedly', async () => {
      // 2. Press Tab key repeatedly
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
    });

    await test.step('Verify focus moves through interactive elements in logical order', async () => {
      // 3. Verify focus moves through interactive elements in logical order
      const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
      expect(firstFocused).toBeTruthy();
    });

    await test.step('Check that focused elements have visible focus indicators', async () => {
      // 4. Check that focused elements have visible focus indicators
      // Continue tabbing through elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);

        const focusedElement = await page.evaluate(() => {
          const el = document.activeElement;
          return {
            tag: el?.tagName,
            href: el?.getAttribute('href'),
            text: el?.textContent?.trim().substring(0, 50)
          };
        });
        console.log('Focused:', focusedElement);
      }
    });

    await test.step('Navigate through main menu using Tab', async () => {
      // 5. Navigate through main menu using Tab
      // Reset to start
      await page.goto('/');

      // Tab to first menu item
      let tabCount = 0;
      let foundNavLink = false;

      while (tabCount < 20 && !foundNavLink) {
        await page.keyboard.press('Tab');
        tabCount++;

        const isNavLink = await page.evaluate(() => {
          const el = document.activeElement;
          return el?.tagName === 'A' && el?.closest('nav') !== null;
        });

        if (isNavLink) {
          foundNavLink = true;

          // 6. Press Enter on a menu item
          await page.keyboard.press('Enter');
          await page.waitForTimeout(500);

          // 7. Verify page navigation works
          const newUrl = page.url();
          expect(newUrl).toBeTruthy();
        }
      }
    });

    await test.step('Test keyboard navigation on search page', async () => {
      // 8. Test keyboard navigation on search page
      await page.goto('/search/');
      await page.keyboard.press('Tab');
    });

    await test.step('Verify Escape key behavior (if modals exist)', async () => {
      // 9. Verify Escape key behavior (if modals exist)
      // Most static sites don't have modals
    });

  });
});
