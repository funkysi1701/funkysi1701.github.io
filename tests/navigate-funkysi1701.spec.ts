// spec: specs/funkysi1701-test-plan.md

import { test, expect } from './fixtures';
import { SITE_TITLE_PATTERN } from './site-title';

test('navigate to funkysi1701.com', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL('/');
  await expect(page).toHaveTitle(SITE_TITLE_PATTERN);
});
