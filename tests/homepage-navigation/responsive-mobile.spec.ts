// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { Locator, Page } from '@playwright/test';

function escapeForAnchoredTextRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Main menu page links live under #navbarSupportedContent.
 * Use real <a class="nav-link" href> nodes, not getByRole alone: when the Bootstrap collapse
 * is closed, descendants are display:none and are omitted from the a11y tree, so role queries
 * can match 0 elements until the panel is shown.
 */
function mainNavPageLink(navMenu: Locator, opts: { name: string | RegExp; exact?: boolean }) {
  if (typeof opts.name === 'string') {
    const hasText =
      opts.exact === true
        ? new RegExp(`^${escapeForAnchoredTextRegex(opts.name)}$`)
        : opts.name;
    return navMenu.locator('a.nav-link[href]').filter({ hasText });
  }
  return navMenu.locator('a.nav-link[href]').filter({ hasText: opts.name });
}

/** Bootstrap collapse can ignore the first toggler click; retry until the target link is visible. */
async function ensureMobileNavLinkVisible(page: Page, link: Locator) {
  if (await link.isVisible()) {
    return;
  }
  const toggler = page.locator('nav.navbar').getByRole('button', { name: 'Toggle navigation' });
  for (let attempt = 0; attempt < 4; attempt++) {
    if (await link.isVisible()) {
      return;
    }
    await toggler.click();
    try {
      await expect(link).toBeVisible({ timeout: 5000 });
      return;
    } catch {
      // Collapse may still be animating or the first click was a no-op — try toggler again.
    }
  }
  await expect(link).toBeVisible({ timeout: 15000 });
}

/** Main menu links live under #navbarSupportedContent (scope here, not the whole nav). */
async function clickVisibleMainNavLink(
  page: Page,
  opts: { name: string | RegExp; exact?: boolean },
) {
  const navMenu = page.locator('#navbarSupportedContent');
  const link = mainNavPageLink(navMenu, opts);
  await ensureMobileNavLinkVisible(page, link);
  await link.click();
}

test.describe('Homepage and Navigation', () => {
  test('Responsive design on mobile viewport', async ({ page }) => {
    let hamburger!: Locator;

    await test.step('Set viewport to mobile size (375x667)', async () => {
      // 1. Set viewport to mobile size (375x667)
      await page.setViewportSize({ width: 375, height: 667 });
    });

    await test.step('Navigate to https://www.funkysi1701.com', async () => {
      // 2. Navigate to https://www.funkysi1701.com
      await page.goto('/');
      await page.waitForLoadState('load');
    });

    const navMenu = page.locator('#navbarSupportedContent');

    await test.step('Check if navigation menu collapses to hamburger menu', async () => {
      // 3. Check if navigation menu collapses to hamburger menu (scope to main header — avoid duplicate controls)
      hamburger = page.locator('nav.navbar').getByRole('button', { name: 'Toggle navigation' });
    });

    await test.step('Click hamburger menu to expand', async () => {
      // 4. Click hamburger menu to expand (retry toggler — first click can be a no-op while collapse initializes)
      await expect(hamburger).toBeVisible();
      const aboutLink = mainNavPageLink(navMenu, { name: 'About', exact: true });
      await ensureMobileNavLinkVisible(page, aboutLink);
    });

    await test.step('Verify all navigation items are accessible', async () => {
      // 5. Verify all navigation items are accessible
      await expect(mainNavPageLink(navMenu, { name: 'About', exact: true })).toBeVisible();
      await expect(mainNavPageLink(navMenu, { name: 'Projects', exact: true })).toBeVisible();
      await expect(mainNavPageLink(navMenu, { name: 'Contact', exact: true })).toBeVisible();
    });

    await test.step('Test navigation on About page', async () => {
      // 6. Test navigation on About, Projects, and Contact (open menu only when links are hidden)
      await clickVisibleMainNavLink(page, { name: 'About', exact: true });
      await expect(page).toHaveURL(/\/about\//);
      await page.waitForLoadState('load');

      await clickVisibleMainNavLink(page, { name: 'Projects', exact: true });
      // Menu href is /projects/; Hugo alias serves the portfolio at /posts/projects/
      await expect(page).toHaveURL(/\/(?:posts\/)?projects\/?$/);
      await page.waitForLoadState('load');

      await clickVisibleMainNavLink(page, { name: 'Contact', exact: true });
      await expect(page).toHaveURL(/\/contact\//);
    });

    await test.step('Verify content is readable and not cut off', async () => {
      // 7. Verify content is readable and not cut off
      // Use innerWidth (not clientWidth): on Linux/classic scrollbars, clientWidth excludes the
      // vertical gutter while vw/100vw-based layout uses the full viewport width, so
      // scrollWidth > clientWidth can happen with zero broken layout. innerWidth matches vw.
      const { scrollWidth, innerWidth, bodyWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        bodyWidth: document.body.getBoundingClientRect().width,
      }));
      const slack = 2; // subpixel / rounding
      expect(bodyWidth).toBeLessThanOrEqual(innerWidth + slack);
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth + slack);
    });

  });
});
