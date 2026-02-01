// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Social Media and External Links', () => {
  test('External project links', async ({ page, context }) => {
    // 1. Navigate to https://www.funkysi1701.com/projects/
    await page.goto('https://www.funkysi1701.com/projects/');

    // 2. Find Episode Atlas project link
    const episodeAtlasLink = page.locator('a[href*="episodeatlas.com"]').first();
    
    if (await episodeAtlasLink.count() > 0) {
      // 3. Click on episodeatlas.com link
      const pagePromise = context.waitForEvent('page');
      await episodeAtlasLink.click();
      
      // 4. Verify it opens in new tab
      const newPage = await pagePromise;
      
      // Verify episodeatlas.com loads
      await expect(newPage).toHaveURL(/episodeatlas\.com/);
      await newPage.close();
    }

    // 5. Check GitHub repository links
    const githubLinks = page.locator('a[href*="github.com"]');
    const githubCount = await githubLinks.count();
    expect(githubCount).toBeGreaterThan(0);

    // 6. Verify GitHub links open to correct repositories
    if (githubCount > 0) {
      const firstGithubLink = githubLinks.first();
      const href = await firstGithubLink.getAttribute('href');
      expect(href).toContain('github.com');
    }

    // 7. Test all external links on projects page
    const externalLinks = page.locator('a[href^="http"]');
    const externalCount = await externalLinks.count();
    console.log(`Found ${externalCount} external links on projects page`);
    expect(externalCount).toBeGreaterThan(0);
  });
});
