import { test, expect } from './fixtures';

test('navigate to funkysi1701.com', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL('/');
  await expect(page).toHaveTitle(/Funky Si's Blog/);
});
