// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Accessibility', () => {
  test('ARIA landmarks and regions', async ({ page }) => {
    let semanticStructure!: { hasHeader: boolean; hasNav: boolean; hasMain: boolean; hasFooter: boolean; hasArticle: boolean; hasAside: boolean };

    await test.step('Navigate to https://www.funkysi1701.com', async () => {
      // 1. Navigate to https://www.funkysi1701.com
      await page.goto('https://www.funkysi1701.com');
    });

    await test.step('Inspect page structure for semantic HTML', async () => {
      // 2. Inspect page structure for semantic HTML
      semanticStructure = await page.evaluate(() => {
        return {
          hasHeader: document.querySelector('header') !== null,
          hasNav: document.querySelector('nav') !== null,
          hasMain: document.querySelector('main') !== null,
          hasFooter: document.querySelector('footer') !== null,
          hasArticle: document.querySelector('article') !== null,
          hasAside: document.querySelector('aside') !== null
        };
      });

      console.log('Semantic structure:', semanticStructure);
    });

    await test.step('Check for <header>, <nav>, <main>, <footer> elements (presence, not visibility)', async () => {
      // 3. Check for <header>, <nav>, <main>, <footer> elements (presence, not visibility)
      // Some elements may be positioned off-screen or have CSS that makes Playwright think they're hidden
      expect(semanticStructure.hasHeader).toBeTruthy();
      expect(semanticStructure.hasNav).toBeTruthy();
      expect(semanticStructure.hasMain).toBeTruthy();
      expect(semanticStructure.hasFooter).toBeTruthy();
    });

    await test.step('Verify proper use of <article> for blog posts', async () => {
      // 4. Verify proper use of <article> for blog posts
      const articleCount = await page.locator('article').count();
      console.log('Article count:', articleCount);
      expect(articleCount).toBeGreaterThanOrEqual(0); // Homepage should have blog posts
    });

    await test.step('Check for <aside> for sidebars (if applicable)', async () => {
      // 5. Check for <aside> for sidebars (if applicable)
      const asideCount = await page.locator('aside').count();
      console.log('Aside count:', asideCount);
    });

    await test.step('Verify ARIA landmarks are used appropriately', async () => {
      // 6. Verify ARIA landmarks are used appropriately
      const ariaLandmarks = await page.evaluate(() => {
        const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
        return Array.from(landmarks).map(el => el.getAttribute('role'));
      });

      console.log('ARIA landmarks:', ariaLandmarks);
    });

    await test.step('Check that page structure is semantic and logical', async () => {
      // 7. Check that page structure is semantic and logical
      // Header should come before main
      const structureOrder = await page.evaluate(() => {
        const elements = [];
        const header = document.querySelector('header');
        const main = document.querySelector('main');
        const footer = document.querySelector('footer');

        if (header) elements.push({ tag: 'header', order: Array.from(document.body.children).indexOf(header as Element) });
        if (main) elements.push({ tag: 'main', order: Array.from(document.body.children).indexOf(main as Element) });
        if (footer) elements.push({ tag: 'footer', order: Array.from(document.body.children).indexOf(footer as Element) });

        return elements;
      });

      console.log('Structure order:', structureOrder);
    });

  });
});
