// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Edge Cases and Error Handling', () => {
  test('Direct URL access to deep links', async ({ page }) => {
    // 1. Directly navigate to a blog post
    await page.goto('https://www.funkysi1701.com/posts/2026/01/31/ndc-london-2026');

    // 2. Verify page loads without errors
    await expect(page).toHaveURL(/ndc-london-2026/);
    await expect(page.locator('nav')).toBeVisible();

    // 3. Directly navigate to a tag page
    await page.goto('https://www.funkysi1701.com/tags/');

    // 4. Verify tag page loads correctly
    await expect(page).toHaveURL(/\/tags\//);
    await expect(page.locator('nav')).toBeVisible();

    // 5. Directly navigate to a year archive
    await page.goto('https://www.funkysi1701.com/2024/');

    // 6. Verify archive page loads correctly
    await expect(page).toHaveURL(/\/2024\//);
    await expect(page.locator('nav')).toBeVisible();

    // 7. Test various deep link patterns
    await page.goto('https://www.funkysi1701.com/about/');
    await expect(page).toHaveURL(/\/about\//);

    await page.goto('https://www.funkysi1701.com/projects/');
    await expect(page).toHaveURL(/\/projects\//);

    await page.goto('https://www.funkysi1701.com/search/');
    await expect(page).toHaveURL(/\/search\//);

    // 8. Verify all direct URL accesses work
    // All pages should have navigation
    await expect(page.locator('nav')).toBeVisible();
  });
});
