// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('About and Static Pages', () => {
  test('Contact page functionality', async ({ page, context }) => {
    await test.step('Navigate to https://www.funkysi1701.com/contact/', async () => {
      // 1. Navigate to https://www.funkysi1701.com/contact/
      await page.goto('https://www.funkysi1701.com/contact/');
    });

    await test.step('Verify email address is displayed as mailto link', async () => {
      // 2. Verify email address is displayed as mailto link
      const emailLink = page.locator('a[href="mailto:funkysi1701@gmail.com"]').first();
      await expect(emailLink).toBeVisible();
    });

    await test.step('Check for social media links', async () => {
      // 3. Check for social media links
    });

    await test.step('Verify presence of GitHub, Twitter/X, BlueSky, Mastodon, LinkedIn, Facebook links', async () => {
      // 4. Verify presence of GitHub, Twitter/X, BlueSky, Mastodon, LinkedIn, Facebook links
      // Focus on profile links in the main content area, not share buttons
      await expect(page.locator('a[href*="github.com/funkysi1701"]').filter({ hasText: /@funkysi1701/ }).first()).toBeVisible();
      await expect(page.locator('a[href*="twitter.com/funkysi1701"], a[href*="x.com/funkysi1701"]').filter({ hasText: /@funkysi1701/ }).first()).toBeVisible();
      await expect(page.locator('a[href*="bsky.app"], a[href*="bluesky"]').filter({ hasText: /@funkysi1701/ }).first()).toBeVisible();
      await expect(page.locator('a[href*="mastodon"], a[href*="hachyderm.io"]').filter({ hasText: /@funkysi1701/ }).first()).toBeVisible();
      await expect(page.locator('a[href*="linkedin.com"]').filter({ hasText: /funkysi1701/ }).first()).toBeVisible();
      await expect(page.locator('a[href*="facebook.com/funkysi1701"]').filter({ hasText: /funkysi1701/ }).first()).toBeVisible();
    });

    await test.step('Click on GitHub link and verify it opens to github.com/funkysi1701', async () => {
      // 5. Click on GitHub link
      // 6. Verify it opens to github.com/funkysi1701
      // waitForEvent and its trigger must stay together to avoid missing the event
      const githubLink = page.locator('a[href*="github.com/funkysi1701"]').first();
      const [githubPage] = await Promise.all([
        context.waitForEvent('page'),
        githubLink.click(),
      ]);
      await expect(githubPage).toHaveURL(/github\.com\/funkysi1701/);
      await githubPage.close();
    });

    await test.step('Test LinkedIn link opens to correct profile', async () => {
      // 7. Test LinkedIn link opens to correct profile
      const linkedinLink = page.locator('a[href*="linkedin.com"]').first();
      const [linkedinPage] = await Promise.all([
        context.waitForEvent('page'),
        linkedinLink.click(),
      ]);
      await expect(linkedinPage).toHaveURL(/linkedin\.com/);
      await linkedinPage.close();
    });

    await test.step('Verify all social media links are functional (count check)', async () => {
      // 8. Verify all social media links are functional (count check)
      const socialLinks = await page.locator('a[href*="github.com"], a[href*="twitter.com"], a[href*="x.com"], a[href*="linkedin.com"], a[href*="facebook.com"], a[href*="mastodon"], a[href*="bsky.app"]').count();
      expect(socialLinks).toBeGreaterThanOrEqual(6);
    });

  });
});
