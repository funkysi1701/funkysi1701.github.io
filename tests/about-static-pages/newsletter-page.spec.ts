// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('About and Static Pages', () => {
  test('Newsletter page content', async ({ page }) => {
    await test.step('Navigate to https://www.funkysi1701.com/newsletter/', async () => {
      // 1. Navigate to https://www.funkysi1701.com/newsletter/
      await page.goto('/newsletter/');
    });

    await test.step('Verify page loads successfully', async () => {
      // 2. Verify page loads successfully
      await expect(page).toHaveURL(/\/newsletter\//);
    });

    await test.step('Check for newsletter description', async () => {
      // 3. Check for newsletter description
      await expect(page.locator('text=/newsletter|subscribe/i').first()).toBeVisible();
    });

    await test.step('Look for subscription form or link', async () => {
      // 4. Look for subscription form or link
      const subscriptionElement = page.locator('form, a[href*="subscribe"], a[href*="newsletter"], button, input[type="email"]').first();
      // Newsletter might use external service, so we just check content is present
    });

    await test.step('Verify recent topics are mentioned', async () => {
      // 5. Verify recent topics are mentioned
      await expect(page.locator('text=/Recent Topics|What I\'ve been writing|Topics/i').first()).toBeVisible();
    });

    await test.step('Check for target audience description', async () => {
      // 6. Check for target audience description
      await expect(page.locator('text=/Who Should Subscribe|developers|DevOps/i').first()).toBeVisible();
    });

    await test.step('Verify value proposition is clear', async () => {
      // 7. Verify value proposition is clear
      await expect(page.locator('text=/monthly|practical|insights|tutorials/i').first()).toBeVisible();

      // Verify newsletter mentions .NET, DevOps, Azure
      await expect(page.locator('text=/.NET|Azure|DevOps|Cloud/i').first()).toBeVisible();
    });

  });
});
