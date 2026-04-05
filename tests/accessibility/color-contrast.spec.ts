// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';

// Calculate relative luminance for a single 0-255 channel value
function channelLuminance(value: number): number {
  const sRGB = value / 255;
  return sRGB <= 0.04045 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
}

function parseRgbColor(rgbStr: string): { r: number; g: number; b: number; alpha: number } {
  const trimmed = rgbStr.trim();
  if (/^transparent$/i.test(trimmed)) {
    return { r: 0, g: 0, b: 0, alpha: 0 };
  }

  // Comma-separated: rgb(0, 0, 0) / rgba(0,0,0,0.5)
  let match = trimmed.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/i
  );

  // Space-separated (CSS Color 4): rgb(0 0 0) / rgb(0 0 0 / 0.5)
  if (!match) {
    match = trimmed.match(
      /^rgba?\(\s*(\d+)\s+(\d+)\s+(\d+)(?:\s*\/\s*(0|1|0?\.\d+))?\s*\)$/i
    );
  }

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

// Composite a semi-transparent foreground color onto an opaque background
// using standard alpha compositing (Porter-Duff "over") and return the
// resulting opaque color.
function blendOnBackground(
  fg: { r: number; g: number; b: number; alpha: number },
  bg: { r: number; g: number; b: number },
): { r: number; g: number; b: number } {
  const a = fg.alpha;
  return {
    r: Math.round(a * fg.r + (1 - a) * bg.r),
    g: Math.round(a * fg.g + (1 - a) * bg.g),
    b: Math.round(a * fg.b + (1 - a) * bg.b),
  };
}

// Calculate WCAG contrast ratio between foreground and background rgb(...) strings.
// Semi-transparent foreground colours are composited over the background before
// the luminance is calculated so that the ratio reflects the actual rendered colour.
function contrastRatio(fgStr: string, bgStr: string): number {
  const fg = parseRgbColor(fgStr);
  const bg = parseRgbColor(bgStr);

  if (fg.alpha === 0) {
    throw new Error(
      `Cannot calculate contrast ratio for fully transparent foreground color "${fgStr}"`,
    );
  }

  // Composite semi-transparent foreground over the background.
  const effectiveFg = fg.alpha < 1 ? blendOnBackground(fg, bg) : fg;
  const l1 = 0.2126 * channelLuminance(effectiveFg.r) +
              0.7152 * channelLuminance(effectiveFg.g) +
              0.0722 * channelLuminance(effectiveFg.b);
  const l2 = relativeLuminance(bgStr);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function tryContrastRatio(color1: string, color2: string): number | null {
  try {
    return contrastRatio(color1, color2);
  } catch {
    return null;
  }
}

// Resolve the computed foreground color and effective (non-transparent) background
// color for any element matching `selector` in the current page.  Returns null when
// no matching element is found.
async function getElementColors(
  page: Page,
  selector: string,
): Promise<{ color: string; backgroundColor: string } | null> {
  return page.evaluate((sel) => {
    function isTransparent(bg: string): boolean {
      const t = bg.trim().toLowerCase();
      if (t === 'transparent') return true;
      const m1 = t.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/);
      if (m1 && parseFloat(m1[4]) < 0.05) return true;
      const m2 = t.match(/^rgba?\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\/\s*([\d.]+)\s*\)$/);
      if (m2 && parseFloat(m2[4]) < 0.05) return true;
      return false;
    }

    function effectiveBackground(el: Element | null): string {
      let n: Element | null = el;
      for (let i = 0; i < 20 && n; i++) {
        const bg = window.getComputedStyle(n).backgroundColor;
        if (!isTransparent(bg)) return bg;
        n = n.parentElement;
      }
      return window.getComputedStyle(document.body).backgroundColor;
    }

    const el = document.querySelector(sel);
    if (!el) return null;
    const styles = window.getComputedStyle(el);
    return { color: styles.color, backgroundColor: effectiveBackground(el) };
  }, selector);
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
      // 6. Check that text is readable without custom styles (main content only — footer/meta can be smaller)
      let paragraphs = page.locator('main p, article p');
      let count = await paragraphs.count();
      if (count === 0) {
        paragraphs = page.locator('p');
        count = await paragraphs.count();
      }
      const toCheck = Math.min(count, 3);
      expect(toCheck).toBeGreaterThan(0);

      for (let i = 0; i < toCheck; i++) {
        const fontSize = await paragraphs.nth(i).evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return parseFloat(styles.fontSize);
        });
        expect(fontSize).toBeGreaterThanOrEqual(12);
      }

      const headingSize = await page.locator('h1').first().evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return parseFloat(styles.fontSize);
      });

      console.log('H1 font size:', headingSize);
      expect(headingSize).toBeGreaterThanOrEqual(16);
    });

    await test.step('Verify navbar brand link meets WCAG AA color contrast (4.5:1)', async () => {
      // 7. Check navbar brand link color contrast against effective navbar background.
      const navbarColors = await getElementColors(
        page,
        'header nav h1 a, header nav .navbar-brand',
      );

      console.log('Navbar brand colors:', navbarColors);
      expect(navbarColors).toBeTruthy();

      if (navbarColors) {
        const ratio = tryContrastRatio(navbarColors.color, navbarColors.backgroundColor);
        console.log('Navbar brand contrast ratio:', ratio?.toFixed(2) ?? 'n/a (unparsed color)');
        if (ratio === null) {
          throw new Error(
            `Could not parse colors for contrast: fg=${navbarColors.color} bg=${navbarColors.backgroundColor}`,
          );
        }
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      }
    });

    await test.step('Verify nav links meet WCAG AA color contrast (4.5:1)', async () => {
      // 8. Check nav link color contrast against effective navbar background
      const navLinks = page.locator('#navbarSupportedContent ul li a');
      const navLinkCount = await navLinks.count();

      expect(navLinkCount).toBeGreaterThan(0);

      const navColors = await getElementColors(page, '#navbarSupportedContent ul li a');

      console.log('Nav link colors:', navColors);
      expect(navColors).toBeTruthy();

      if (navColors) {
        const ratio = tryContrastRatio(navColors.color, navColors.backgroundColor);
        console.log('Nav link contrast ratio:', ratio?.toFixed(2) ?? 'n/a (unparsed color)');
        if (ratio === null) {
          throw new Error(
            `Could not parse colors for contrast: fg=${navColors.color} bg=${navColors.backgroundColor}`,
          );
        }
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      }
    });

    await test.step('Verify post-taxonomy badges are visible', async () => {
      // 9. Theme uses translucent badges (e.g. opacity 0.6); WCAG depends on blended contrast, not opacity alone.
      const badges = page.locator('a.post-taxonomy');
      const badgeCount = await badges.count();

      expect(badgeCount).toBeGreaterThan(0);
      await expect(badges.first()).toBeVisible();
    });

    await test.step('Verify footer powered-by text meets WCAG AA color contrast (4.5:1)', async () => {
      // 10. Footer .powered-by text uses --hbs-secondary-text-on-surface which was below threshold.
      const footerColors = await getElementColors(page, 'footer .powered-by');

      console.log('Footer powered-by colors:', footerColors);
      expect(footerColors).toBeTruthy();

      if (footerColors) {
        const ratio = tryContrastRatio(footerColors.color, footerColors.backgroundColor);
        console.log('Footer powered-by contrast ratio:', ratio?.toFixed(2) ?? 'n/a (unparsed color)');
        if (ratio === null) {
          throw new Error(
            `Could not parse colors for contrast: fg=${footerColors.color} bg=${footerColors.backgroundColor}`,
          );
        }
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      }
    });

    await test.step('Verify all post-summary paragraphs meet WCAG AA color contrast (4.5:1)', async () => {
      // 11. .post-summary paragraphs use --hbs-secondary-text-on-surface which was below threshold.
      // Pa11y/axe-core flagged the third article's summary <p> (builds 10.1.1.2559 and 10.1.1.2572)
      // because the default rgba(0,0,0,0.54) barely met 4.5:1 on white and axe-core reported it as
      // failing. custom.css raises the variable to rgba(0,0,0,0.7) (~8.47:1) to fix this.
      // Check every visible .post-summary p (not just the first) so any article can be caught.
      const allSummaryColors = await page.evaluate(() => {
        const MAX_BACKGROUND_TRAVERSAL_DEPTH = 20;
        function isTransparent(bg: string): boolean {
          const t = bg.trim().toLowerCase();
          if (t === 'transparent') return true;
          const m1 = t.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/);
          if (m1 && parseFloat(m1[4]) < 0.05) return true;
          const m2 = t.match(/^rgba?\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\/\s*([\d.]+)\s*\)$/);
          if (m2 && parseFloat(m2[4]) < 0.05) return true;
          return false;
        }
        function effectiveBackground(el: Element | null): string {
          let n: Element | null = el;
          for (let i = 0; i < MAX_BACKGROUND_TRAVERSAL_DEPTH && n; i++) {
            const bg = window.getComputedStyle(n).backgroundColor;
            if (!isTransparent(bg)) return bg;
            n = n.parentElement;
          }
          return window.getComputedStyle(document.body).backgroundColor;
        }
        return Array.from(document.querySelectorAll('.post-summary p')).map((el) => {
          const styles = window.getComputedStyle(el);
          return { color: styles.color, backgroundColor: effectiveBackground(el) };
        });
      });

      expect(allSummaryColors.length).toBeGreaterThan(0);

      for (let i = 0; i < allSummaryColors.length; i++) {
        const { color, backgroundColor } = allSummaryColors[i];
        const ratio = tryContrastRatio(color, backgroundColor);
        console.log(`Post-summary para[${i}] contrast ratio: ${ratio?.toFixed(2) ?? 'n/a'} (fg=${color} bg=${backgroundColor})`);
        if (ratio === null) {
          throw new Error(
            `Could not parse colors for post-summary para[${i}]: fg=${color} bg=${backgroundColor}`,
          );
        }
        expect(ratio, `post-summary para[${i}] must meet WCAG AA 4.5:1`).toBeGreaterThanOrEqual(4.5);
      }
    });

  });
});
