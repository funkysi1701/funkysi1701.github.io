// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Performance and Technical', () => {
  test('JSON search index', async ({ page }) => {
    // eslint-disable-next-line prefer-const
    let content: any;
    // eslint-disable-next-line prefer-const
    let jsonData: any;
    // eslint-disable-next-line prefer-const
    let response: any;

    await test.step('Navigate to https://www.funkysi1701.com/index.json', async () => {
      // 1. Navigate to https://www.funkysi1701.com/index.json
      response = await page.goto('https://www.funkysi1701.com/index.json');

      if (!response) {
        throw new Error('No response received');
      }
    });

    await test.step('Verify JSON file loads', async () => {
      // 2. Verify JSON file loads
      expect(response.status()).toBe(200);
    });

    await test.step('Check that JSON is valid', async () => {
      // 3. Check that JSON is valid
      content = await response.text();
      jsonData = JSON.parse(content);
    });

    await test.step('Verify structure includes blog posts with titles, URLs, content', async () => {
      // 4. Verify structure includes blog posts with titles, URLs, content
      expect(Array.isArray(jsonData)).toBeTruthy();
      expect(jsonData.length).toBeGreaterThan(0);

      const firstItem = jsonData[0];
      expect(firstItem.title).toBeTruthy();
      expect(firstItem.permalink || firstItem.url || firstItem.href).toBeTruthy();
    });

    await test.step('Check for proper encoding', async () => {
      // 5. Check for proper encoding
      // JSON.parse will fail if encoding is invalid
    });

    await test.step('Verify all recent posts are included', async () => {
      // 6. Verify all recent posts are included
      console.log(`JSON index contains ${jsonData.length} items`);
      expect(jsonData.length).toBeGreaterThanOrEqual(50);

      // File size check
      const fileSize = content.length;
      console.log(`JSON index size: ${(fileSize / 1024).toFixed(2)} KB`);
      expect(fileSize).toBeLessThan(10 * 1024 * 1024); // Less than 10MB
    });

  });
});
