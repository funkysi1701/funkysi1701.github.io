// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Edge Cases and Error Handling', () => {
  test('Direct URL access to deep links', async ({ page }) => {
    await test.step('Directly navigate to a blog post', async () => {
      // 1. Directly navigate to a blog post
      await page.goto('/posts/2026/01/31/ndc-london-2026');
    });

    await test.step('Verify page loads without errors', async () => {
      // 2. Verify page loads without errors
      await expect(page).toHaveURL(/ndc-london-2026/);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Directly navigate to a tag page', async () => {
      // 3. Directly navigate to a tag page
      await page.goto('/tags/');
    });

    await test.step('Verify tag page loads correctly', async () => {
      // 4. Verify tag page loads correctly
      await expect(page).toHaveURL(/\/tags\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Directly navigate to a year archive', async () => {
      // 5. Directly navigate to a year archive
      await page.goto('/2024/');
    });

    await test.step('Verify archive page loads correctly', async () => {
      // 6. Verify archive page loads correctly
      await expect(page).toHaveURL(/\/2024\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Test various deep link patterns', async () => {
      // 7. Test various deep link patterns
      await page.goto('/about/');
      await expect(page).toHaveURL(/\/about\//);

      await page.goto('/projects/');
      await expect(page).toHaveURL(/\/projects\//);

      await page.goto('/search/');
      await expect(page).toHaveURL(/\/search\//);
    });

    await test.step('Verify all direct URL accesses work', async () => {
      // 8. Verify all direct URL accesses work
      // All pages should have navigation
      await expect(page.locator('nav').first()).toBeVisible();
    });

  });
});
