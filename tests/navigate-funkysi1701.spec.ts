import { test, expect } from '@playwright/test';

test('navigate to funkysi1701.com', async ({ page }) => {
  await page.goto('https://www.funkysi1701.com');
  await expect(page).toHaveURL('https://www.funkysi1701.com/');
  await expect(page).toHaveTitle(/Funky Si's Blog/);
});
