// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Performance and Technical', () => {
  test('robots.txt validation', async ({ page }) => {
    // 1. Navigate to https://www.funkysi1701.com/robots.txt
    const response = await page.goto('https://www.funkysi1701.com/robots.txt');
    
    if (!response) {
      throw new Error('No response received');
    }

    // 2. Verify robots.txt file loads
    expect(response.status()).toBe(200);

    const content = await response.text();

    // 3. Check that file is properly formatted
    expect(content).toContain('User-agent:');

    // 4. Verify sitemap location is specified
    expect(content.toLowerCase()).toContain('sitemap:');

    // 5. Check for any disallow rules
    const hasDisallow = content.toLowerCase().includes('disallow:');
    
    // 6. Verify allow rules if any
    const hasAllow = content.toLowerCase().includes('allow:');

    console.log('robots.txt content:', content);
    console.log('Has Disallow rules:', hasDisallow);
    console.log('Has Allow rules:', hasAllow);

    // Verify sitemap URL is present
    expect(content).toMatch(/sitemap:.*\.xml/i);
  });
});
