// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('About and Static Pages', () => {
  test('Contact page functionality', async ({ page }) => {
    // External profile navigations (LinkedIn especially) are slow/flaky under
    // parallel workers; assert href + target instead of opening third-party tabs.
    test.setTimeout(60_000);

    const profileLinks = {
      github: page.locator('.post-content a[href*="github.com/funkysi1701"]').filter({ hasText: /@funkysi1701/ }),
      twitter: page.locator('.post-content a[href*="twitter.com/funkysi1701"], .post-content a[href*="x.com/funkysi1701"]').filter({ hasText: /@funkysi1701/ }),
      bluesky: page.locator('.post-content a[href*="bsky.app"], .post-content a[href*="bluesky"]').filter({ hasText: /@funkysi1701/ }),
      mastodon: page.locator('.post-content a[href*="mastodon"], .post-content a[href*="hachyderm.io"]').filter({ hasText: /@funkysi1701/ }),
      linkedin: page.locator('.post-content a[href*="linkedin.com"]').filter({ hasText: /funkysi1701/ }),
      facebook: page.locator('.post-content a[href*="facebook.com/funkysi1701"]').filter({ hasText: /funkysi1701/ }),
    };

    await test.step('Navigate to https://www.funkysi1701.com/contact/', async () => {
      // 1. Navigate to https://www.funkysi1701.com/contact/
      await page.goto('/contact/');
    });

    await test.step('Verify email address is displayed as mailto link', async () => {
      // 2. Verify email address is displayed as mailto link
      const emailLink = page.locator('a[href="mailto:funkysi1701@gmail.com"]').first();
      await expect(emailLink).toBeVisible();
    });

    await test.step('Check for social media links', async () => {
      // 3. Check for social media links
      await expect(page.locator('.post-content').getByRole('heading', { name: /social media/i })).toBeVisible();
    });

    await test.step('Verify presence of GitHub, Twitter/X, BlueSky, Mastodon, LinkedIn, Facebook links', async () => {
      // 4. Verify presence of GitHub, Twitter/X, BlueSky, Mastodon, LinkedIn, Facebook links
      // Focus on profile links in the main content area, not share buttons
      for (const link of Object.values(profileLinks)) {
        await expect(link.first()).toBeVisible();
      }
    });

    await test.step('Verify GitHub link points to github.com/funkysi1701 in a new tab', async () => {
      // 5–6. Verify GitHub profile href and new-tab behaviour (no third-party navigation)
      const githubLink = profileLinks.github.first();
      await expect(githubLink).toHaveAttribute('href', /github\.com\/funkysi1701/);
      await expect(githubLink).toHaveAttribute('target', '_blank');
    });

    await test.step('Verify LinkedIn link points to the correct profile in a new tab', async () => {
      // 7. Verify LinkedIn profile href and new-tab behaviour (no third-party navigation)
      const linkedinLink = profileLinks.linkedin.first();
      await expect(linkedinLink).toHaveAttribute('href', /linkedin\.com/);
      await expect(linkedinLink).toHaveAttribute('target', '_blank');
    });

    await test.step('Verify all social media links are functional (count check)', async () => {
      // 8. Verify all six profile platforms remain present (content-scoped; excludes footer/share)
      const counts = await Promise.all(
        Object.values(profileLinks).map((locator) => locator.count())
      );
      expect(counts.every((n) => n >= 1)).toBeTruthy();
      expect(counts.length).toBe(6);
    });

  });
});
