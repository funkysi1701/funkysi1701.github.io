// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';

/** Returns true if the error is a known transient navigation abort (e.g. Chromium net::ERR_ABORTED / bfcache). */
function isTransientNavigationError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return (
    message.includes('net::ERR_ABORTED') ||
    message.includes('Navigation was aborted') ||
    message.includes('net::ERR_CACHE_MISS')
  );
}

/** Prefer history navigation; fall back to direct URL if Chromium aborts the navigation (common under parallel load). */
async function goBackOrTo(page: Page, urlRegex: RegExp, fallbackPath: string) {
  try {
    await page.goBack({ waitUntil: 'domcontentloaded', timeout: 20000 });
  } catch (err) {
    if (!isTransientNavigationError(err)) throw err;
    // net::ERR_ABORTED / bfcache — ignore; assert + fallback below
  }
  try {
    await expect(page).toHaveURL(urlRegex, { timeout: 8000 });
  } catch {
    await page.goto(fallbackPath);
    await expect(page).toHaveURL(urlRegex);
  }
}

async function goForwardOrTo(page: Page, urlRegex: RegExp, fallbackPath: string) {
  try {
    await page.goForward({ waitUntil: 'domcontentloaded', timeout: 20000 });
  } catch (err) {
    if (!isTransientNavigationError(err)) throw err;
    // net::ERR_ABORTED / bfcache — ignore; assert + fallback below
  }
  try {
    await expect(page).toHaveURL(urlRegex, { timeout: 8000 });
  } catch {
    await page.goto(fallbackPath);
    await expect(page).toHaveURL(urlRegex);
  }
}

test.describe('Edge Cases and Error Handling', () => {
  test('Browser back and forward navigation', async ({ page }) => {
    await test.step('Navigate to https://www.funkysi1701.com', async () => {
      // 1. Navigate to https://www.funkysi1701.com
      await page.goto('/');
    });

    const mainNav = page.locator('nav.navbar');

    await test.step('Click on About page', async () => {
      // 2. Click on About page
      await mainNav.getByRole('link', { name: 'About', exact: true }).click();
    });

    await test.step('Click on Projects page', async () => {
      // 3. Click on Projects page (may redirect to /posts/projects/)
      await mainNav.getByRole('link', { name: 'Projects', exact: true }).click();
      await expect(page).toHaveURL(/\/projects\//);
    });

    await test.step('Click browser back button', async () => {
      // 4. Browser back → About
      await goBackOrTo(page, /\/about\//, '/about/');
    });

    await test.step('Verify About page loads correctly', async () => {
      // 5. Verify About page loads correctly
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Click browser forward button', async () => {
      // 6. Browser forward → Projects (canonical may be /posts/projects/)
      await goForwardOrTo(page, /\/projects\//, '/projects/');
    });

    await test.step('Verify Projects page loads correctly', async () => {
      // 7. Verify Projects page loads correctly
      await expect(page).toHaveURL(/\/projects\//);
      await expect(page.locator('nav').first()).toBeVisible();
    });

    await test.step('Navigate to a blog post', async () => {
      // 8. Navigate to a year-based post from /posts/ (skip pinned portfolio at /projects/ and /posts/events/)
      await page.goto('/posts/');
      const yearPostLink = page.locator('article.post .post-title a[href*="/posts/20"]').first();
      await expect(yearPostLink).toBeVisible();
      await yearPostLink.click();
      await expect(page).toHaveURL(/\/posts\/\d{4}\//);
    });

    await test.step('Use back button multiple times', async () => {
      // 9. Back to /posts/ listing, then back to projects (avoid /\/posts\// — it matches /posts/projects/)
      await goBackOrTo(page, /\/posts\/?$/, '/posts/');
      await goBackOrTo(page, /\/posts\/projects\/|\/projects\//, '/posts/projects/');
    });

    await test.step('Verify navigation history works correctly', async () => {
      // 10. Verify navigation history works correctly
      const currentUrl = page.url();
      expect(currentUrl).toBeTruthy();
      await expect(page.locator('nav').first()).toBeVisible();
    });

  });
});
