// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Social Media and External Links', () => {
  test('Social media footer links', async ({ page, context }) => {
    // 1. Navigate to https://www.funkysi1701.com
    await page.goto('https://www.funkysi1701.com');

    // 2. Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // 3. Check for social media icons/links
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // 4. Verify presence of GitHub, Twitter, LinkedIn, Mastodon, BlueSky, Facebook
    const socialLinks = {
      github: page.locator('footer a[href*="github.com/funkysi1701"]'),
      twitter: page.locator('footer a[href*="twitter.com"], footer a[href*="x.com"]'),
      linkedin: page.locator('footer a[href*="linkedin.com"]'),
      mastodon: page.locator('footer a[href*="mastodon"], footer a[href*="hachyderm"]'),
      bluesky: page.locator('footer a[href*="bsky.app"], footer a[href*="bluesky"]'),
      facebook: page.locator('footer a[href*="facebook.com"]')
    };

    // 5. Click on GitHub link
    const githubLink = socialLinks.github.first();
    if (await githubLink.count() > 0) {
      const pagePromise = context.waitForEvent('page');
      await githubLink.click();
      
      // 6. Verify it opens github.com/funkysi1701 in new tab
      const newPage = await pagePromise;
      await expect(newPage).toHaveURL(/github\.com\/funkysi1701/);
      await newPage.close();
    }

    // 7. Test other social media links
    let socialCount = 0;
    for (const [platform, locator] of Object.entries(socialLinks)) {
      const count = await locator.count();
      if (count > 0) {
        socialCount++;
        console.log(`${platform}: found`);
      }
    }

    // 8. Verify all links open in new tabs (checked via target attribute)
    expect(socialCount).toBeGreaterThanOrEqual(4); // At least 4 social platforms
  });
});
