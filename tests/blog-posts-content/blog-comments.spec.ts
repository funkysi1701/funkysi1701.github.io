// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

const POST_URL = 'https://www.funkysi1701.com/posts/2026/01/31/ndc-london-2026';
const GISCUS_REPO = 'funkysi1701/Blog-Comments';

test.describe('Comment Engine - Giscus Integration', () => {
  test('Comment section container and heading are present on a blog post', async ({ page }) => {
    await test.step('Navigate to a blog post', async () => {
      await page.goto(POST_URL);
      await expect(page).toHaveURL(/ndc-london-2026/);
    });

    await test.step('Verify the #post-comments card container exists in the DOM', async () => {
      const commentsCard = page.locator('#post-comments');
      await expect(commentsCard).toBeAttached();
    });

    await test.step('Verify the "Comments" heading is visible inside the card', async () => {
      const commentsHeading = page.locator('#post-comments h2');
      await expect(commentsHeading).toBeVisible();
      const headingText = await commentsHeading.textContent();
      expect(headingText?.trim().toLowerCase()).toContain('comment');
    });
  });

  test('Giscus script is injected with correct configuration attributes', async ({ page }) => {
    await test.step('Navigate to a blog post', async () => {
      await page.goto(POST_URL);
      await expect(page).toHaveURL(/ndc-london-2026/);
    });

    await test.step('Wait for the Giscus client script to be appended to the DOM', async () => {
      await page.waitForSelector('script[src*="giscus.app/client.js"]', { timeout: 10000 });
    });

    await test.step('Read Giscus script data-attributes and verify they match site config', async () => {
      const scriptAttrs = await page.evaluate(() => {
        const script = document.querySelector('script[src*="giscus.app/client.js"]');
        if (!script) return null;
        return {
          repo: script.getAttribute('data-repo'),
          repoId: script.getAttribute('data-repo-id'),
          category: script.getAttribute('data-category'),
          categoryId: script.getAttribute('data-category-id'),
          mapping: script.getAttribute('data-mapping'),
          reactionsEnabled: script.getAttribute('data-reactions-enabled'),
          emitMetadata: script.getAttribute('data-emit-metadata'),
          inputPosition: script.getAttribute('data-input-position'),
          lang: script.getAttribute('data-lang'),
        };
      });

      expect(scriptAttrs).not.toBeNull();
      expect(scriptAttrs!.repo).toBe(GISCUS_REPO);
      expect(scriptAttrs!.repoId).toBeTruthy();
      expect(scriptAttrs!.category).toBeTruthy();
      expect(scriptAttrs!.categoryId).toBeTruthy();
      expect(scriptAttrs!.mapping).toBe('title');
      expect(scriptAttrs!.reactionsEnabled).toBe('1');
      expect(scriptAttrs!.emitMetadata).toBe('0');
      expect(scriptAttrs!.inputPosition).toBe('bottom');
      expect(scriptAttrs!.lang).toBe('en');
    });
  });

  test('Giscus iframe loads and is visible after script execution', async ({ page }) => {
    await test.step('Navigate to a blog post', async () => {
      await page.goto(POST_URL);
      await expect(page).toHaveURL(/ndc-london-2026/);
    });

    await test.step('Scroll to the comments section to trigger lazy loading', async () => {
      await page.locator('#post-comments').scrollIntoViewIfNeeded();
    });

    await test.step('Wait for and verify the Giscus iframe appears', async () => {
      await page.waitForSelector('iframe[src*="giscus.app"]', { timeout: 15000 });
      const giscusIframe = page.locator('iframe[src*="giscus.app"]').first();
      await expect(giscusIframe).toBeVisible();
    });

    await test.step('Verify the iframe src points to the correct Giscus endpoint', async () => {
      const iframeSrc = await page.locator('iframe[src*="giscus.app"]').first().getAttribute('src');
      expect(iframeSrc).toContain('giscus.app');
    });
  });

  test('Comments panel link navigates to the comment section', async ({ page }) => {
    await test.step('Navigate to a blog post', async () => {
      await page.goto(POST_URL);
      await expect(page).toHaveURL(/ndc-london-2026/);
    });

    await test.step('Locate the comments icon link in the post action panel', async () => {
      const commentsLink = page.locator('a[href="#post-comments"]').first();
      if (await commentsLink.count() === 0) {
        test.skip();
        return;
      }
      await expect(commentsLink).toBeVisible();
    });

    await test.step('Click the comments link and verify the URL gains the #post-comments fragment', async () => {
      const commentsLink = page.locator('a[href="#post-comments"]').first();
      await commentsLink.click();
      expect(page.url()).toContain('#post-comments');
    });
  });

  test('Giscus theme matches the site color-scheme setting', async ({ page }) => {
    await test.step('Clear any stored theme preference and navigate to post (light mode)', async () => {
      await page.goto(POST_URL);
      await page.evaluate(() => localStorage.removeItem('hbs-mode'));
      await page.reload();
      await page.waitForSelector('script[src*="giscus.app/client.js"]', { timeout: 10000 });
    });

    await test.step('Verify the Giscus script uses the light theme by default', async () => {
      const theme = await page.evaluate(() => {
        const script = document.querySelector('script[src*="giscus.app/client.js"]');
        return script ? script.getAttribute('data-theme') : null;
      });
      expect(theme).toBe('light');
    });

    await test.step('Set dark mode preference and reload the page', async () => {
      await page.evaluate(() => localStorage.setItem('hbs-mode', 'dark'));
      await page.reload();
      await page.waitForSelector('script[src*="giscus.app/client.js"]', { timeout: 10000 });
    });

    await test.step('Verify the Giscus script switches to the dark theme', async () => {
      const theme = await page.evaluate(() => {
        const script = document.querySelector('script[src*="giscus.app/client.js"]');
        return script ? script.getAttribute('data-theme') : null;
      });
      expect(theme).toBe('dark');
    });
  });

  test('Comment section is absent on non-post pages', async ({ page }) => {
    await test.step('Verify the homepage has no #post-comments container', async () => {
      await page.goto('https://www.funkysi1701.com/');
      const commentsCard = page.locator('#post-comments');
      expect(await commentsCard.count()).toBe(0);
    });

    await test.step('Verify the about page has no #post-comments container', async () => {
      await page.goto('https://www.funkysi1701.com/about/');
      const commentsCard = page.locator('#post-comments');
      expect(await commentsCard.count()).toBe(0);
    });
  });
});
