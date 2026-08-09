// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('About and Static Pages', () => {
  test('About page content and links', async ({ page }) => {
    await test.step('Navigate to https://www.funkysi1701.com/about/', async () => {
      // 1. Navigate to https://www.funkysi1701.com/about/
      await page.goto('/about/');
    });

    await test.step('Verify page loads successfully', async () => {
      // 2. Verify page loads successfully
      await expect(page).toHaveURL(/\/about\//);
    });

    await test.step('Check for profile image display', async () => {
      // 3. Check for profile image display
      const profileImage = page.locator('img[alt*="Funky Si" i], img[alt*="Simon Foster" i], img[src*="1922276"]').first();
      await expect(profileImage).toBeVisible();
    });

    await test.step('Verify author bio is present', async () => {
      // 4. Verify author bio is present
      await expect(page.locator('text=/Simon Foster|Funky Si/i').first()).toBeVisible();
      await expect(page.locator('text=/developer|DevOps|Azure|.NET/i').first()).toBeVisible();
    });

    await test.step('Check that certification badges are displayed', async () => {
      // 5. Check that certification badges are displayed
      const azureBadge = page.locator('img[alt*="Azure" i], a[href*="credly"]').first();
      const awsBadge = page.locator('img[alt*="AWS" i]').first();
      await expect(azureBadge).toBeVisible();
      await expect(awsBadge).toBeVisible();
    });

    await test.step('Verify Azure and AWS certification badge hrefs point to Credly', async () => {
      // 6–7. Assert Credly public badge URLs (no third-party navigation)
      const azureLink = page.locator('a[href*="credly"][href*="adacf718"]').first();
      await expect(azureLink).toBeVisible();
      await expect(azureLink).toHaveAttribute('href', /credly\.com.*adacf718/);

      const awsLink = page.locator('a[href*="credly"][href*="3aab54c8"]').first();
      await expect(awsLink).toBeVisible();
      await expect(awsLink).toHaveAttribute('href', /credly\.com.*3aab54c8/);

      // Still on About after attribute checks
      await expect(page).toHaveURL(/\/about\//);

      // Verify page describes specializations
      await expect(page.locator('text=/.NET|C#/i').first()).toBeVisible();
      await expect(page.locator('text=/Azure/i').first()).toBeVisible();
      await expect(page.locator('text=/DevOps/i').first()).toBeVisible();
    });

  });
});
