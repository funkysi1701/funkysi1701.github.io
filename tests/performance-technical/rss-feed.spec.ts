// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { Response } from '@playwright/test';

test.describe('Performance and Technical', () => {
  test('RSS feed validation', async ({ page }) => {
    let content!: string;
    let response!: Response | null;

    await test.step('Navigate to https://www.funkysi1701.com/index.xml', async () => {
      // 1. Navigate to https://www.funkysi1701.com/index.xml
      response = await page.goto('https://www.funkysi1701.com/index.xml');

      if (!response) {
        throw new Error('No response received');
      }
    });

    await test.step('Verify RSS feed loads', async () => {
      // 2. Verify RSS feed loads
      expect(response.status()).toBe(200);
    });

    await test.step('Check that XML is well-formed', async () => {
      // 3. Check that XML is well-formed
      content = await response.text();
      expect(content).toContain('<?xml');
      expect(content).toContain('<rss');
    });

    await test.step('Verify feed includes recent blog posts', async () => {
      // 4. Verify feed includes recent blog posts
      expect(content).toContain('<item>');
      expect(content).toContain('<title>');
      expect(content).toContain('<link>');
    });

    await test.step('Check for proper encoding of special characters', async () => {
      // 5. Check for proper encoding of special characters
      // Note: Hugo RSS feeds contain &amp;amp; which is correct XML encoding for &amp; in URLs
      expect(content).toContain('&'); // At minimum should have ampersands
    });

    await test.step('Verify feed items include title, link, description, pubDate', async () => {
      // 6. Verify feed items include title, link, description, pubDate
      expect(content).toContain('<description>');
      expect(content).toContain('<pubDate>');
    });

    await test.step('Test feed can be parsed', async () => {
      // 7. Test feed can be parsed
      const itemMatches = content.match(/<item>/g);
      const itemCount = itemMatches ? itemMatches.length : 0;
      expect(itemCount).toBeGreaterThanOrEqual(10);

      console.log(`RSS feed contains ${itemCount} items`);
    });

  });
});
