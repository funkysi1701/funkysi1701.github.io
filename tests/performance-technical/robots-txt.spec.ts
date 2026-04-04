// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { Response } from '@playwright/test';

test.describe('Performance and Technical', () => {
  test('robots.txt validation', async ({ page }) => {
    let content!: string;
    let hasDisallow!: boolean;
    let response!: Response | null;

    await test.step('Navigate to https://www.funkysi1701.com/robots.txt', async () => {
      // 1. Navigate to https://www.funkysi1701.com/robots.txt
      response = await page.goto('/robots.txt');

      if (!response) {
        throw new Error('No response received');
      }
    });

    await test.step('Verify robots.txt file loads', async () => {
      // 2. Verify robots.txt file loads
      expect(response.status()).toBe(200);

      content = await response.text();
    });

    await test.step('Check that file is properly formatted', async () => {
      // 3. Check that file is properly formatted
      expect(content).toContain('User-agent:');
    });

    await test.step('Verify sitemap location is specified', async () => {
      // 4. Verify sitemap location is specified
      expect(content.toLowerCase()).toContain('sitemap:');
    });

    await test.step('Check for any disallow rules', async () => {
      // 5. Check for any disallow rules
      hasDisallow = content.toLowerCase().includes('disallow:');
    });

    await test.step('Verify allow rules if any', async () => {
      // 6. Verify allow rules if any
      const hasAllow = content.toLowerCase().includes('allow:');

      console.log('robots.txt content:', content);
      console.log('Has Disallow rules:', hasDisallow);
      console.log('Has Allow rules:', hasAllow);

      // Verify sitemap URL is present
      expect(content).toMatch(/sitemap:.*\.xml/i);
    });

  });
});
