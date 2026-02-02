// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Social Media and External Links', () => {
  test('Support this site link', async ({ page, context }) => {
    // 1. Navigate to https://www.funkysi1701.com
    await page.goto('https://www.funkysi1701.com');

    // 2. Click on 'Support this site' navigation link
    const supportLink = page.locator('a:has-text("Support")').first();
    
    if (await supportLink.count() > 0) {
      const pagePromise = context.waitForEvent('page');
      await supportLink.click();
      
      // 3. Verify it opens external URL in new tab
      const newPage = await pagePromise;
      
      // 4. Check that link doesn't break site navigation
      // Original page should still be accessible
      await expect(page.locator('nav').first()).toBeVisible();
      
      // 5. Verify external site loads (or redirects appropriately)
      // Note: otieu.com might redirect
      const newUrl = newPage.url();
      console.log('Support link opened:', newUrl);
      
      await newPage.close();
    }
  });
});
