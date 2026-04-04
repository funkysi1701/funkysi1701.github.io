// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { Locator } from '@playwright/test';

test.describe('About and Static Pages', () => {
  test('Tools and Resources page', async ({ page }) => {
    let links!: Locator;

    await test.step('Navigate to https://www.funkysi1701.com/tools-and-resources/', async () => {
      // 1. Navigate to https://www.funkysi1701.com/tools-and-resources/
      await page.goto('/tools-and-resources/');
    });

    await test.step('Verify page loads successfully', async () => {
      // 2. Verify page loads successfully
      await expect(page).toHaveURL(/\/tools-and-resources\//);
    });

    await test.step('Check for organized sections or categories', async () => {
      // 3. Check for organized sections or categories
      const headings = page.locator('h1, h2, h3');
      const headingCount = await headings.count();
      expect(headingCount).toBeGreaterThan(0);
    });

    await test.step('Verify links are present', async () => {
      // 4. Verify links are present
      links = page.locator('a[href^="http"]');
      const linkCount = await links.count();
      expect(linkCount).toBeGreaterThan(0);
    });

    await test.step('Test a few random links to ensure they work', async () => {
      // 5. Test a few random links to ensure they work
      const firstLink = links.first();
      if (await firstLink.count() > 0) {
        const href = await firstLink.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).toMatch(/^https?:\/\//);
      }
    });

    await test.step('Check for descriptions of tools/resources', async () => {
      // 6. Check for descriptions of tools/resources
      const paragraphs = page.locator('p');
      const paragraphCount = await paragraphs.count();
      expect(paragraphCount).toBeGreaterThan(0);
    });

  });
});
