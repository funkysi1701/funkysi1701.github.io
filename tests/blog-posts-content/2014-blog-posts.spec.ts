// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('2014 Blog Posts', () => {
  test('Destination Star Trek post displays correctly', async ({ page }) => {
    // Navigate to the Destination Star Trek post
    await page.goto('https://www.funkysi1701.com/posts/2014/destination-star-trek');

    // Verify blog post loads successfully
    await expect(page).toHaveURL(/destination-star-trek/);

    // Check that post title is displayed
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/Destination Star Trek/i);

    // Verify post date is shown (October 5, 2014)
    await expect(page.locator('text=/October 5, 2014|Oct 5, 2014|5 October 2014/i').first()).toBeVisible();

    // Verify blog content is readable
    const content = page.locator('article, .content, main').first();
    await expect(content).toBeVisible();

    // Check for tags
    const tags = page.locator('a[href*="/tags/"], .tag, .tags a');
    const tagCount = await tags.count();
    expect(tagCount).toBeGreaterThan(0);

    // Verify author information is displayed
    await expect(page.locator('text=/funkysi1701|Simon Foster/i').first()).toBeVisible();
  });

  test('I Love Nagios post displays correctly', async ({ page }) => {
    // Navigate to the I Love Nagios post
    await page.goto('https://www.funkysi1701.com/posts/2014/i-love-nagios');

    // Verify blog post loads successfully
    await expect(page).toHaveURL(/i-love-nagios/);

    // Check that post title is displayed
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/I love Nagios/i);

    // Verify post date is shown (September 24, 2014)
    await expect(page.locator('text=/September 24, 2014|Sep 24, 2014|24 September 2014/i').first()).toBeVisible();

    // Verify blog content is readable
    const content = page.locator('article, .content, main').first();
    await expect(content).toBeVisible();

    // Check for tags
    const tags = page.locator('a[href*="/tags/"], .tag, .tags a');
    const tagCount = await tags.count();
    expect(tagCount).toBeGreaterThan(0);

    // Verify author information is displayed
    await expect(page.locator('text=/funkysi1701|Simon Foster/i').first()).toBeVisible();
  });

  test('Looking Back at 2014 post displays correctly', async ({ page }) => {
    // Navigate to the Looking Back at 2014 post
    await page.goto('https://www.funkysi1701.com/posts/2014/looking-back-at-2014');

    // Verify blog post loads successfully
    await expect(page).toHaveURL(/looking-back-at-2014/);

    // Check that post title is displayed
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/2014/i);

    // Verify post date is shown (December 31, 2014)
    await expect(page.locator('text=/December 31, 2014|Dec 31, 2014|31 December 2014/i').first()).toBeVisible();

    // Verify blog content is readable
    const content = page.locator('article, .content, main').first();
    await expect(content).toBeVisible();

    // Check for tags
    const tags = page.locator('a[href*="/tags/"], .tag, .tags a');
    const tagCount = await tags.count();
    expect(tagCount).toBeGreaterThan(0);

    // Verify author information is displayed
    await expect(page.locator('text=/funkysi1701|Simon Foster/i').first()).toBeVisible();
  });

  test('What is the difference between Dev and Ops post displays correctly', async ({ page }) => {
    // Navigate to the What is the difference between Dev and Ops post
    await page.goto('https://www.funkysi1701.com/posts/2014/what-is-the-difference-between-dev-and-ops');

    // Verify blog post loads successfully
    await expect(page).toHaveURL(/what-is-the-difference-between-dev-and-ops/);

    // Check that post title is displayed
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/Dev.*Ops|difference/i);

    // Verify blog content is readable
    const content = page.locator('article, .content, main').first();
    await expect(content).toBeVisible();

    // Verify author information is displayed
    await expect(page.locator('text=/funkysi1701|Simon Foster/i').first()).toBeVisible();
  });

  test('Windows 9 or 10 post displays correctly', async ({ page }) => {
    // Navigate to the Windows 9 or 10 post
    await page.goto('https://www.funkysi1701.com/posts/2014/windows-9-or-do-i-mean-10');

    // Verify blog post loads successfully
    await expect(page).toHaveURL(/windows-9-or-do-i-mean-10|windows.*10/);

    // Check that post title is displayed
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/Windows/i);

    // Verify blog content is readable
    const content = page.locator('article, .content, main').first();
    await expect(content).toBeVisible();

    // Verify author information is displayed
    await expect(page.locator('text=/funkysi1701|Simon Foster/i').first()).toBeVisible();
  });
});