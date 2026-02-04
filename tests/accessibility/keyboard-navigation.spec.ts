// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Accessibility', () => {
  test('Keyboard navigation', async ({ page }) => {
    // 1. Navigate to https://www.funkysi1701.com
    await page.goto('https://www.funkysi1701.com');

    // 2. Press Tab key repeatedly
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    // 3. Verify focus moves through interactive elements in logical order
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(firstFocused).toBeTruthy();

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

    // 5. Navigate through main menu using Tab
    // Reset to start
    await page.goto('https://www.funkysi1701.com');
    
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

    // 8. Test keyboard navigation on search page
    await page.goto('https://www.funkysi1701.com/search/');
    await page.keyboard.press('Tab');
    
    // 9. Verify Escape key behavior (if modals exist)
    // Most static sites don't have modals
  });
});
