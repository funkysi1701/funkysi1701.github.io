// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('About and Static Pages', () => {
  test('Privacy Policy and Terms pages', async ({ page }) => {
    // 1. Navigate to https://www.funkysi1701.com/privacy-policy/
    await page.goto('https://www.funkysi1701.com/privacy-policy/');

    // 2. Verify page loads and contains privacy policy content
    await expect(page).toHaveURL(/\/privacy-policy\//);
    await expect(page.locator('text=/privacy|policy|data|information/i').first()).toBeVisible();

    // Verify no Lorem Ipsum placeholder text exists
    const loremIpsum = page.locator('text=/lorem ipsum/i');
    await expect(loremIpsum).toHaveCount(0);

    // 3. Navigate to https://www.funkysi1701.com/terms/
    await page.goto('https://www.funkysi1701.com/terms/');

    // 4. Verify page loads and contains terms content
    await expect(page).toHaveURL(/\/terms\//);
    await expect(page.locator('text=/terms|conditions|agreement/i').first()).toBeVisible();

    // 5. Check that both pages have professional formatting
    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);

    // 6. Verify no Lorem Ipsum placeholder text exists
    const loremIpsum2 = page.locator('text=/lorem ipsum/i');
    await expect(loremIpsum2).toHaveCount(0);
  });
});
