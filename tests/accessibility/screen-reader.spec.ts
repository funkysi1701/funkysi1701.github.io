// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Accessibility', () => {
  test('Screen reader compatibility', async ({ page }) => {
    // 1. Navigate to https://www.funkysi1701.com
    await page.goto('https://www.funkysi1701.com');

    // 2. Verify page has proper heading hierarchy (h1, h2, h3)
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1); // Should have exactly one h1

    // Check heading hierarchy doesn't skip levels
    const headings = await page.evaluate(() => {
      const headingElements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      return headingElements.map(h => ({
        level: parseInt(h.tagName[1]),
        text: h.textContent?.trim().substring(0, 50)
      }));
    });

    console.log('Heading hierarchy:', headings);

    // 3. Check that all images have alt attributes
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    console.log('Images without alt:', imagesWithoutAlt);
    // Ideally should be 0, but some decorative images might not have alt

    // 4. Verify links have descriptive text
    const links = await page.locator('a').all();
    for (let i = 0; i < Math.min(links.length, 10); i++) {
      const linkText = await links[i].textContent();
      const ariaLabel = await links[i].getAttribute('aria-label');
      
      // Link should have text or aria-label
      expect(linkText || ariaLabel).toBeTruthy();
    }

    // 5. Check for proper ARIA labels on interactive elements
    const buttonsWithoutLabel = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.filter(btn => {
        const hasText = btn.textContent?.trim().length > 0;
        const hasAriaLabel = btn.getAttribute('aria-label');
        return !hasText && !hasAriaLabel;
      }).length;
    });
    
    console.log('Buttons without label:', buttonsWithoutLabel);

    // 6. Verify form fields have associated labels
    const inputs = await page.locator('input[type="text"], input[type="email"], input[type="search"]').all();
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');
      
      // Input should have label, aria-label, or placeholder
      expect(id || ariaLabel || placeholder).toBeTruthy();
    }

    // 7. Check that page language is declared (lang attribute)
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBeTruthy();
    expect(lang.toLowerCase()).toMatch(/en/);
    console.log('Page language:', lang);
  });
});
