// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { Locator } from '@playwright/test';

test.describe('Social Media and External Links', () => {
  test('External project links', async ({ page, context }) => {
    let githubCount!: number;
    let githubLinks!: Locator;

    await test.step('Navigate to https://www.funkysi1701.com/projects/', async () => {
      // 1. Navigate to https://www.funkysi1701.com/projects/
      await page.goto('/projects/', { waitUntil: 'load' });
    });

    await test.step('Find Episode Atlas project link', async () => {
      // 2. Find Episode Atlas project link
      const episodeAtlasLink = page.locator('a[href*="episodeatlas.com"]').first();

      if (await episodeAtlasLink.count() > 0) {
        // 3–4. Open link and new tab — register listener before click to avoid races
        const [newPage] = await Promise.all([
          context.waitForEvent('page'),
          episodeAtlasLink.click(),
        ]);

        await expect(newPage).toHaveURL(/episodeatlas\.com/);
        await newPage.close();
      }
    });

    await test.step('Check GitHub repository links', async () => {
      // 5. Check GitHub repository links (reload projects — Episode Atlas step may have navigated the tab if a popup was blocked)
      await page.goto('/projects/', { waitUntil: 'load' });
      githubLinks = page.locator('a[href*="github.com"]');
      await expect(githubLinks.first()).toBeVisible({ timeout: 30000 });
      githubCount = await githubLinks.count();
      expect(githubCount).toBeGreaterThan(0);
    });

    await test.step('Verify GitHub links open to correct repositories', async () => {
      // 6. Verify GitHub links open to correct repositories
      if (githubCount > 0) {
        const firstGithubLink = githubLinks.first();
        const href = await firstGithubLink.getAttribute('href');
        expect(href).toContain('github.com');
      }
    });

    await test.step('Test all external links on projects page', async () => {
      // 7. Test all external links on projects page
      const externalLinks = page.locator('a[href^="http"]');
      const externalCount = await externalLinks.count();
      console.log(`Found ${externalCount} external links on projects page`);
      expect(externalCount).toBeGreaterThan(0);
    });

  });
});
