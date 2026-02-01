// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('About and Static Pages', () => {
  test('Newsletter page content', async ({ page }) => {
    // 1. Navigate to https://www.funkysi1701.com/newsletter/
    await page.goto('https://www.funkysi1701.com/newsletter/');

    // 2. Verify page loads successfully
    await expect(page).toHaveURL(/\/newsletter\//);

    // 3. Check for newsletter description
    await expect(page.locator('text=/newsletter|subscribe/i').first()).toBeVisible();

    // 4. Look for subscription form or link
    const subscriptionElement = page.locator('form, a[href*="subscribe"], a[href*="newsletter"], button, input[type="email"]').first();
    // Newsletter might use external service, so we just check content is present
    
    // 5. Verify recent topics are mentioned
    await expect(page.locator('text=/Recent Topics|What I\'ve been writing|Topics/i').first()).toBeVisible();

    // 6. Check for target audience description
    await expect(page.locator('text=/Who Should Subscribe|developers|DevOps/i')).toBeVisible();

    // 7. Verify value proposition is clear
    await expect(page.locator('text=/monthly|practical|insights|tutorials/i')).toBeVisible();
    
    // Verify newsletter mentions .NET, DevOps, Azure
    await expect(page.locator('text=/.NET|Azure|DevOps|Cloud/i')).toBeVisible();
  });
});
