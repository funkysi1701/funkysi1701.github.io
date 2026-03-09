// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Blog Posts and Content', () => {
  test('Blog tag filtering', async ({ page }) => {
    // eslint-disable-next-line prefer-const
    let tag: any;
    // eslint-disable-next-line prefer-const
    let tagLinks: any;

    await test.step('Navigate to a blog post with tags', async () => {
      // 1. Navigate to a blog post with tags
      await page.goto('https://www.funkysi1701.com/posts/2026/01/31/ndc-london-2026');
    });

    await test.step('Click on a tag', async () => {
      // 2. Click on a tag
      tag = page.locator('a[href*="/tags/"]').first();
      await tag.click();
    });

    await test.step('Verify tag page loads showing all posts with that tag', async () => {
      // 3. Verify tag page loads showing all posts with that tag
      await expect(page).toHaveURL(/\/tags\//);
    });

    await test.step('Check that posts are relevant to the tag', async () => {
      // 4. Check that posts are relevant to the tag
      const posts = page.locator('article, .post, [class*="post"]');
      const postCount = await posts.count();
      expect(postCount).toBeGreaterThan(0);
    });

    await test.step('Navigate to https://www.funkysi1701.com/tags/', async () => {
      // 5. Navigate to https://www.funkysi1701.com/tags/
      await page.goto('https://www.funkysi1701.com/tags/');
    });

    await test.step('Verify tag cloud or list is displayed', async () => {
      // 6. Verify tag cloud or list is displayed
      await expect(page).toHaveURL(/\/tags\//);
      tagLinks = page.locator('a[href*="/tags/"]');
      const tagCount = await tagLinks.count();
      expect(tagCount).toBeGreaterThan(0);
    });

    await test.step('Click on another tag from the list', async () => {
      // 7. Click on another tag from the list
      const secondTag = tagLinks.nth(1);
      await secondTag.click();
    });

    await test.step('Verify filtering works correctly', async () => {
      // 8. Verify filtering works correctly
      await expect(page).toHaveURL(/\/tags\//);
      const filteredPosts = page.locator('article, .post, [class*="post"]');
      const filteredCount = await filteredPosts.count();
      expect(filteredCount).toBeGreaterThan(0);
    });

  });
});
