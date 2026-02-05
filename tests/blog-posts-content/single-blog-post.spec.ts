// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Blog Posts and Content', () => {
  test('Individual blog post displays correctly', async ({ page }) => {
    // 1. Navigate to https://www.funkysi1701.com/posts/2026/ndc-london-2026
    await page.goto('https://www.funkysi1701.com/posts/2026/ndc-london-2026');

    // 2. Verify blog post loads successfully
    await expect(page).toHaveURL(/ndc-london-2026/);

    // 3. Check that post title is displayed
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    // Verify it contains some text
    const titleText = await h1.textContent();
    expect(titleText).toBeTruthy();
    expect(titleText.length).toBeGreaterThan(0);

    // 4. Verify post date is shown
    await expect(page.locator('text=/February 2, 2026|Feb 2, 2026|2 February 2026/i').first()).toBeVisible();

    // 5. Check for cover image display
    const coverImage = page.locator('img[src*="ndc"], img[alt*="NDC"]').first();
    if (await coverImage.count() > 0) {
      await expect(coverImage).toBeVisible();
    }

    // 6. Verify blog content is readable and formatted
    const content = page.locator('article, .content, main').first();
    await expect(content).toBeVisible();
    
    // Check for headings within content
    const h2Headings = page.locator('article h2, .content h2, main h2');
    const h2Count = await h2Headings.count();
    expect(h2Count).toBeGreaterThan(0);

    // 7. Check for tags at bottom or top of post
    const tags = page.locator('a[href*="/tags/"], .tag, .tags a');
    const tagCount = await tags.count();
    expect(tagCount).toBeGreaterThan(0);

    // 8. Verify author information is displayed
    await expect(page.locator('text=/funkysi1701|Simon Foster/i').first()).toBeVisible();

    // 9. Check for reading time estimate
    await expect(page.locator('text=/reading time|min read|\d+ min/i').first()).toBeVisible();
  });
});
