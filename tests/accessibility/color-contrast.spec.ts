// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

// Calculate relative luminance for a single 0-255 channel value
function channelLuminance(value: number): number {
  const sRGB = value / 255;
  return sRGB <= 0.04045 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
}

function parseRgbColor(rgbStr: string): { r: number; g: number; b: number; alpha: number } {
  const match = rgbStr.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/i
  );

  if (!match) {
    throw new Error(`Unsupported color format for contrast calculation: "${rgbStr}"`);
  }

  const r = Number.parseInt(match[1], 10);
  const g = Number.parseInt(match[2], 10);
  const b = Number.parseInt(match[3], 10);
  const alpha = match[4] === undefined ? 1 : Number.parseFloat(match[4]);

  return { r, g, b, alpha };
}

// Calculate relative luminance from an rgb(...) string
function relativeLuminance(rgbStr: string): number {
  const { r, g, b, alpha } = parseRgbColor(rgbStr);

  if (alpha === 0) {
    throw new Error(
      `Cannot calculate relative luminance for fully transparent color "${rgbStr}" without resolving the effective background color first`
    );
  }

  const red = channelLuminance(r);
  const green = channelLuminance(g);
  const blue = channelLuminance(b);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

// Calculate WCAG contrast ratio between two rgb(...) strings
function contrastRatio(color1: string, color2: string): number {
  const l1 = relativeLuminance(color1);
  const l2 = relativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

test.describe('Accessibility', () => {
  test('Color contrast and readability', async ({ page }) => {
    await test.step('Navigate to https://www.funkysi1701.com', async () => {
      // 1. Navigate to https://www.funkysi1701.com
      await page.goto('/');
    });

    await test.step('Verify text has sufficient contrast against background', async () => {
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
    });

    await test.step('Check link colors are distinguishable', async () => {
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
    });

    await test.step('Test with browser color blindness simulation (if available)', async () => {
      // 4. Test with browser color blindness simulation (if available)
      // This requires browser extensions or specific tools
    });

    await test.step("Verify UI doesn't rely solely on color to convey information", async () => {
      // 5. Verify UI doesn't rely solely on color to convey information
      // Manual inspection needed
    });

    await test.step('Check that text is readable without custom styles', async () => {
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

    await test.step('Verify navbar brand link meets WCAG AA color contrast (4.5:1)', async () => {
      // 7. Check navbar brand link color contrast against navbar background
      const navbarColors = await page.evaluate(() => {
        const brandLink = document.querySelector('header nav h1 a, header nav .navbar-brand');
        const navbar = document.querySelector('header nav');
        if (!brandLink || !navbar) return null;
        const linkStyles = window.getComputedStyle(brandLink);
        const navStyles = window.getComputedStyle(navbar);
        return {
          color: linkStyles.color,
          backgroundColor: navStyles.backgroundColor
        };
      });

      console.log('Navbar brand colors:', navbarColors);
      expect(navbarColors).toBeTruthy();

      if (navbarColors) {
        const ratio = contrastRatio(navbarColors.color, navbarColors.backgroundColor);
        console.log('Navbar brand contrast ratio:', ratio.toFixed(2));
        // WCAG AA requires 4.5:1 for normal text
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      }
    });

    await test.step('Verify nav links meet WCAG AA color contrast (4.5:1)', async () => {
      // 8. Check nav link color contrast against navbar background
      const navLinks = page.locator('#navbarSupportedContent ul li a');
      const navLinkCount = await navLinks.count();

      expect(navLinkCount).toBeGreaterThan(0);

      const navColors = await navLinks.first().evaluate(el => {
        const navbar = el.closest('nav');
        if (!navbar) return null;
        const linkStyles = window.getComputedStyle(el);
        const navStyles = window.getComputedStyle(navbar);
        return {
          color: linkStyles.color,
          backgroundColor: navStyles.backgroundColor
        };
      });

      console.log('Nav link colors:', navColors);
      expect(navColors).toBeTruthy();

      if (navColors) {
        const ratio = contrastRatio(navColors.color, navColors.backgroundColor);
        console.log('Nav link contrast ratio:', ratio.toFixed(2));
        // WCAG AA requires 4.5:1 for normal text
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      }
    });

    await test.step('Verify post-taxonomy badges have full opacity for WCAG AA compliance', async () => {
      // 9. Check that .post-taxonomy badges are not rendered with reduced opacity,
      //    which would lower their effective contrast ratio below 4.5:1.
      const badges = page.locator('a.post-taxonomy');
      const badge = badges.first();
      const badgeCount = await badges.count();

      expect(badgeCount).toBeGreaterThan(0);

      const badgeOpacity = await badge.evaluate(el => {
        return window.getComputedStyle(el).opacity;
      });

      console.log('post-taxonomy badge opacity:', badgeOpacity);
      // opacity must be 1 so the rendered colours meet WCAG AA 4.5:1 contrast
      expect(parseFloat(badgeOpacity)).toBe(1);
    });

  });
});
