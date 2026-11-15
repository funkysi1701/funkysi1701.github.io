// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('About and Static Pages', () => {
  test('Newsletter page content', async ({ page }) => {
    await test.step('Navigate to https://www.funkysi1701.com/newsletter/', async () => {
      // 1. Navigate to https://www.funkysi1701.com/newsletter/
      // Avoid waiting for `load` — ads/analytics keep connections open and stall CI.
      await page.goto('/newsletter/', { waitUntil: 'domcontentloaded', timeout: 45_000 });
    });

    await test.step('Verify page loads successfully', async () => {
      // 2. Verify page loads successfully
      await expect(page).toHaveURL(/\/newsletter\//);
    });

    const content = page.locator('article').first();

    await test.step('Check for newsletter description', async () => {
      // 3. Check for newsletter description
      await expect(content.getByText(/newsletter|subscribe/i).first()).toBeVisible();
    });

    await test.step('Look for subscription form or link', async () => {
      // 4. Assert the Mailchimp CTA — not heading permalinks that contain "subscribe"
      // or "newsletter" in the fragment (those anchors are hidden).
      const subscribeLink = content.locator('a[href*="list-manage.com/subscribe"]');
      await expect(subscribeLink).toBeVisible();
      await expect(subscribeLink).toContainText(/subscribe/i);
    });

    await test.step('Verify recent topics are mentioned', async () => {
      // 5. Verify recent topics are mentioned
      await expect(content.getByText(/Recent Topics|What I've been writing|Topics/i).first()).toBeVisible();
    });

    await test.step('Check for target audience description', async () => {
      // 6. Check for target audience description
      await expect(content.getByText(/Who Should Subscribe|developers|DevOps/i).first()).toBeVisible();
    });

    await test.step('Verify value proposition is clear', async () => {
      // 7. Verify value proposition is clear
      await expect(content.getByText(/monthly|practical|insights|tutorials/i).first()).toBeVisible();

      // Verify newsletter mentions .NET, DevOps, Azure
      await expect(content.getByText(/\.NET|Azure|DevOps|Cloud/i).first()).toBeVisible();
    });

  });
});
