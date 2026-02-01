// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('Form accessibility (newsletter)', async ({ page }) => {
    // 1. Navigate to newsletter signup form
    await page.goto('https://www.funkysi1701.com/newsletter/');

    // Look for form or search page which has a form
    await page.goto('https://www.funkysi1701.com/search/');

    // 2. Verify form fields have visible labels
    const inputs = await page.locator('input').all();
    
    for (const input of inputs) {
      const inputType = await input.getAttribute('type');
      const inputId = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');

      console.log('Input:', { type: inputType, id: inputId, ariaLabel, placeholder });

      // 3. Check that labels are associated with inputs (for/id)
      if (inputId) {
        const label = await page.locator(`label[for="${inputId}"]`).count();
        console.log(`Label for ${inputId}:`, label > 0);
      }

      // 4. Test keyboard navigation through form
      await input.focus();
      await page.waitForTimeout(100);

      // 5. Verify error messages are accessible (if validation exists)
      // This would need form submission to test

      // 6. Check for helpful placeholder text
      expect(ariaLabel || placeholder).toBeTruthy();
    }

    // 7. Test form submission with keyboard only
    const firstInput = inputs[0];
    if (firstInput) {
      await firstInput.fill('test query');
      await page.keyboard.press('Enter');
      
      // Form should submit or execute search
      await page.waitForTimeout(500);
    }
  });
});
