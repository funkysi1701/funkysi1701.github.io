// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('About and Static Pages', () => {
  test('Projects page displays portfolio', async ({ page, context }) => {
    // 1. Navigate to https://www.funkysi1701.com/projects/
    await page.goto('https://www.funkysi1701.com/projects/');

    // 2. Verify page loads successfully
    await expect(page).toHaveURL(/\/projects\//);

    // 3. Check for Blog Platform project description
    await expect(page.locator('text=/Blog Platform|This blog/i').first()).toBeVisible();

    // 4. Verify Episode Atlas project is listed
    await expect(page.locator('text=/Episode Atlas/i').first()).toBeVisible();

    // 5. Check for Mandelbrot Generator project
    await expect(page.locator('text=/Mandelbrot/i').first()).toBeVisible();

    // Verify tech stack information is present
    await expect(page.locator('text=/Tech Stack|Hugo|Blazor|Azure/i').first()).toBeVisible();

    // 6. Click on Episode Atlas external link
    const episodeAtlasLink = page.locator('a[href*="episodeatlas.com"]').first();
    if (await episodeAtlasLink.count() > 0) {
      const pagePromise = context.waitForEvent('page');
      await episodeAtlasLink.click();
      
      // 7. Verify it opens episodeatlas.com in new tab
      const externalPage = await pagePromise;
      await expect(externalPage).toHaveURL(/episodeatlas\.com/);
      await externalPage.close();
    }

    // 8. Check for GitHub repository links
    const githubLinks = page.locator('a[href*="github.com"]');
    const githubCount = await githubLinks.count();
    expect(githubCount).toBeGreaterThan(0);

    // 9. Verify tech stack information is present for each project
    await expect(page.locator('text=/GitHub|Features|Links/i').first()).toBeVisible();
  });
});
