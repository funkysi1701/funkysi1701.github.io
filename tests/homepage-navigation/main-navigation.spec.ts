// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Homepage and Navigation', () => {
  test('Main navigation menu functionality', async ({ page, context }) => {
    // 1. Navigate to https://www.funkysi1701.com
    await page.goto('https://www.funkysi1701.com');

    // 2. Verify all navigation items are visible
    await expect(page.getByRole('link', { name: 'About' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Projects', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Tools.*Resources/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Newsletter' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Events' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Search', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Support.*site/i })).toBeVisible();

    // 3. Click on About link
    await page.getByRole('link', { name: 'About', exact: true }).first().click();
    
    // 4. Verify About page loads correctly
    await expect(page).toHaveURL(/\/about\//);
    await expect(page.locator('nav').first()).toBeVisible();

    // Click on Projects link
    await page.getByRole('link', { name: 'Projects', exact: true }).click();
    await expect(page).toHaveURL(/\/projects\//);
    await expect(page.locator('nav').first()).toBeVisible();

    // Click on Tools & Resources link
    await page.getByRole('link', { name: /Tools.*Resources/i }).click();
    await expect(page).toHaveURL(/\/tools-and-resources\//);
    await expect(page.locator('nav').first()).toBeVisible();

    // Click on Newsletter link
    await page.getByRole('link', { name: 'Newsletter' }).click();
    await expect(page).toHaveURL(/\/newsletter\//);
    await expect(page.locator('nav').first()).toBeVisible();

    // Click on Contact link
    await page.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/\/contact\//);
    await expect(page.locator('nav').first()).toBeVisible();

    // Click on Events link
    await page.getByRole('link', { name: 'Events' }).click();
    await expect(page).toHaveURL(/\/posts\/events\//);
    await expect(page.locator('nav').first()).toBeVisible();

    // Click on Search link
    await page.getByRole('link', { name: 'Search' }).click();
    await expect(page).toHaveURL(/\/search\//);
    await expect(page.locator('nav').first()).toBeVisible();

    // 5. Test Support this site link (opens in new tab)
    const pagePromise = context.waitForEvent('page');
    await page.getByRole('link', { name: /Support.*site/i }).click();
    const newPage = await pagePromise;
    await expect(newPage).toHaveURL(/otieu\.com/);
    await newPage.close();
  });
});