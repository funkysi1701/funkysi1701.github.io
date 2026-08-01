// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

const POST_PATH = '/posts/2026/dotnet-5-to-10-features/';

test.describe('Blog Posts and Content', () => {
  test('Engagement CTA identical with daily.dev referral query', async ({ page }) => {
    await test.step('Load lander without query string', async () => {
      await page.goto(POST_PATH, { waitUntil: 'domcontentloaded' });
    });

    const newsletter = page.locator('.post-engagement__newsletter-link');
    await expect(newsletter).toBeVisible();
    const hrefClean = await newsletter.getAttribute('href');
    expect(hrefClean).toBeTruthy();

    await test.step('Load same lander with ?ref=dailydev', async () => {
      await page.goto(`${POST_PATH}?ref=dailydev`, { waitUntil: 'domcontentloaded' });
    });

    await test.step('Assert newsletter CTA href matches clean URL', async () => {
      const newsletterRef = page.locator('.post-engagement__newsletter-link');
      await expect(newsletterRef).toBeVisible();
      await expect(newsletterRef).toHaveAttribute('href', hrefClean!);
      await expect(page.locator('.post-engagement')).toBeVisible();
    });
  });
});
