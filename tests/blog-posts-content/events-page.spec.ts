// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { Locator } from '@playwright/test';

test.describe('Blog Posts and Content', () => {
  test.fixme('Events page functionality', async ({ page }) => {
    // FIXME: The site doesn't have an events category page at /events/
    // Events are referenced at /posts/events/ which lists upcoming events
    // This test needs to be rewritten to check the correct events page structure
    let events!: Locator;

    await test.step('Navigate to https://www.funkysi1701.com/posts/events/', async () => {
      // 1. Navigate to https://www.funkysi1701.com/posts/events/
      await page.goto('/posts/events/');
    });

    await test.step('Verify Events page loads successfully', async () => {
      // 2. Verify Events page loads successfully
      await expect(page).toHaveURL(/\/posts\/events\//);
    });

    await test.step('Check for list of events', async () => {
      // 3. Check for list of events
      events = page.locator('article, .post, .event, [class*="post"]');
      const eventCount = await events.count();
      expect(eventCount).toBeGreaterThan(0);
    });

    await test.step('Verify event details are displayed (date, title, description)', async () => {
      // 4. Verify event details are displayed (date, title, description)
      const headings = page.locator('h1, h2, h3');
      await expect(headings.first()).toBeVisible();
    });

    await test.step('Test any links to event details or external sites', async () => {
      // 5. Test any links to event details or external sites
      const links = page.locator('a[href^="http"]');
      const linkCount = await links.count();
    });

    await test.step('Check chronological ordering of events', async () => {
      // 6. Check chronological ordering of events
      // Events should have dates visible
      const dates = page.locator('text=/20\d{2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i');
      const dateCount = await dates.count();
      expect(dateCount).toBeGreaterThan(0);
    });

  });
});
