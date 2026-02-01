// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Blog Posts and Content', () => {
  test.fixme('Events page functionality', async ({ page }) => {
    // FIXME: The site doesn't have an events category page at /events/
    // Events are referenced at /posts/events/ which lists upcoming events
    // This test needs to be rewritten to check the correct events page structure
    // 1. Navigate to https://www.funkysi1701.com/posts/events/
    await page.goto('https://www.funkysi1701.com/posts/events/');

    // 2. Verify Events page loads successfully
    await expect(page).toHaveURL(/\/posts\/events\//);

    // 3. Check for list of events
    const events = page.locator('article, .post, .event, [class*="post"]');
    const eventCount = await events.count();
    expect(eventCount).toBeGreaterThan(0);

    // 4. Verify event details are displayed (date, title, description)
    const headings = page.locator('h1, h2, h3');
    await expect(headings.first()).toBeVisible();

    // 5. Test any links to event details or external sites
    const links = page.locator('a[href^="http"]');
    const linkCount = await links.count();
    
    // 6. Check chronological ordering of events
    // Events should have dates visible
    const dates = page.locator('text=/20\d{2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i');
    const dateCount = await dates.count();
    expect(dateCount).toBeGreaterThan(0);
  });
});
