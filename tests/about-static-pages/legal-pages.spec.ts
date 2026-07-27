// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('About and Static Pages', () => {
  test('Privacy Policy and Terms pages', async ({ page }) => {
    // Two navigations; ads/analytics can stall the default `load` wait past the 30s test timeout.
    test.setTimeout(60_000);

    await test.step('Navigate to https://www.funkysi1701.com/privacy-policy/', async () => {
      // 1. Navigate to https://www.funkysi1701.com/privacy-policy/
      await page.goto('/privacy-policy/', { waitUntil: 'domcontentloaded', timeout: 45_000 });
    });

    await test.step('Verify page loads and contains privacy policy content', async () => {
      // 2. Verify page loads and contains privacy policy content
      await expect(page).toHaveURL(/\/privacy-policy\//);
      const content = page.locator('article').first();
      await expect(content.getByText(/privacy|policy|data|information/i).first()).toBeVisible();

      // Verify no Lorem Ipsum placeholder text exists
      await expect(content.getByText(/lorem ipsum/i)).toHaveCount(0);
    });

    await test.step('Navigate to https://www.funkysi1701.com/terms/', async () => {
      // 3. Navigate to https://www.funkysi1701.com/terms/
      await page.goto('/terms/', { waitUntil: 'domcontentloaded', timeout: 45_000 });
    });

    await test.step('Verify page loads and contains terms content', async () => {
      // 4. Verify page loads and contains terms content
      await expect(page).toHaveURL(/\/terms\//);
      const content = page.locator('article').first();
      await expect(content.getByText(/terms|conditions|agreement/i).first()).toBeVisible();
    });

    await test.step('Check that both pages have professional formatting', async () => {
      // 5. Check that both pages have professional formatting
      const headings = page.locator('article h1, article h2, article h3');
      const headingCount = await headings.count();
      expect(headingCount).toBeGreaterThan(0);
    });

    await test.step('Verify no Lorem Ipsum placeholder text exists', async () => {
      // 6. Verify no Lorem Ipsum placeholder text exists
      const content = page.locator('article').first();
      await expect(content.getByText(/lorem ipsum/i)).toHaveCount(0);
    });

  });
});
