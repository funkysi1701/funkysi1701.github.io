// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Accessibility', () => {
  test('aria-prohibited-attr: navbar collapse div should not have self-referencing aria-labelledby', async ({ page }) => {
    let navbarAttributes!: { exists: boolean; hasAriaLabelledby: boolean; ariaLabelledbyValue: string | null };

    await test.step('Navigate to https://www.funkysi1701.com', async () => {
      await page.goto('https://www.funkysi1701.com');
    });

    await test.step('Check that element with id="navbarSupportedContent" exists', async () => {
      navbarAttributes = await page.evaluate(() => {
        const element = document.querySelector('#navbarSupportedContent');
        return {
          exists: element !== null,
          hasAriaLabelledby: element?.hasAttribute('aria-labelledby') ?? false,
          ariaLabelledbyValue: element?.getAttribute('aria-labelledby') ?? null
        };
      });
      console.log('Navbar attributes:', navbarAttributes);
    });

    await test.step('Verify navbar collapse div exists and does not have aria-labelledby attribute', async () => {
      expect(navbarAttributes.exists).toBeTruthy();
      expect(navbarAttributes.hasAriaLabelledby).toBeFalsy();
    });
  });
});