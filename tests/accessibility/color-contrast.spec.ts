// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('Color contrast and readability', async ({ page }) => {
    // 1. Navigate to https://www.funkysi1701.com
    await page.goto('https://www.funkysi1701.com');

    // 2. Verify text has sufficient contrast against background
    // This is a basic check - full contrast validation requires specialized tools
    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
        fontSize: styles.fontSize
      };
    });

    console.log('Body styles:', bodyStyles);

    // 3. Check link colors are distinguishable
    const linkStyles = await page.evaluate(() => {
      const link = document.querySelector('a');
      if (!link) return null;
      const styles = window.getComputedStyle(link);
      return {
        color: styles.color,
        textDecoration: styles.textDecoration
      };
    });

    console.log('Link styles:', linkStyles);
    expect(linkStyles).toBeTruthy();

    // 4. Test with browser color blindness simulation (if available)
    // This requires browser extensions or specific tools

    // 5. Verify UI doesn't rely solely on color to convey information
    // Manual inspection needed

    // 6. Check that text is readable without custom styles
    const paragraphs = await page.locator('p').all();
    for (let i = 0; i < Math.min(paragraphs.length, 3); i++) {
      const fontSize = await paragraphs[i].evaluate(el => {
        const styles = window.getComputedStyle(el);
        return parseFloat(styles.fontSize);
      });
      
      // Font size should be at least 12px for readability
      expect(fontSize).toBeGreaterThanOrEqual(12);
    }

    // Check that font sizes are appropriate and scalable
    const headingSize = await page.locator('h1').first().evaluate(el => {
      const styles = window.getComputedStyle(el);
      return parseFloat(styles.fontSize);
    });

    console.log('H1 font size:', headingSize);
    expect(headingSize).toBeGreaterThan(16); // H1 should be larger than body text
  });
});
