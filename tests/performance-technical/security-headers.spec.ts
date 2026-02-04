// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Performance and Technical', () => {
  test('Security headers validation', async ({ page }) => {
    // 1. Navigate to https://www.funkysi1701.com
    const response = await page.goto('https://www.funkysi1701.com');
    
    if (!response) {
      throw new Error('No response received');
    }

    const headers = response.headers();

    // 4. Verify presence of Strict-Transport-Security header
    expect(headers['strict-transport-security']).toBeTruthy();
    console.log('HSTS:', headers['strict-transport-security']);

    // 5. Check for X-Frame-Options header
    const xFrameOptions = headers['x-frame-options'];
    if (xFrameOptions) {
      expect(xFrameOptions.toLowerCase()).toMatch(/sameorigin|deny/);
      console.log('X-Frame-Options:', xFrameOptions);
    }

    // 6. Verify X-Content-Type-Options header
    const xContentTypeOptions = headers['x-content-type-options'];
    if (xContentTypeOptions) {
      expect(xContentTypeOptions.toLowerCase()).toBe('nosniff');
      console.log('X-Content-Type-Options:', xContentTypeOptions);
    }

    // 7. Check for Referrer-Policy header
    const referrerPolicy = headers['referrer-policy'];
    if (referrerPolicy) {
      console.log('Referrer-Policy:', referrerPolicy);
    }

    // 8. Verify Content-Security-Policy if applicable
    const csp = headers['content-security-policy'];
    if (csp) {
      console.log('CSP:', csp);
    }

    console.log('All headers:', headers);
  });
});
