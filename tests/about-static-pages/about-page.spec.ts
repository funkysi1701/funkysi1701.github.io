// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('About and Static Pages', () => {
  test('About page content and links', async ({ page, context }) => {
    // 1. Navigate to https://www.funkysi1701.com/about/
    await page.goto('https://www.funkysi1701.com/about/');

    // 2. Verify page loads successfully
    await expect(page).toHaveURL(/\/about\//);

    // 3. Check for profile image display
    const profileImage = page.locator('img[alt*="Funky Si" i], img[alt*="Simon Foster" i], img[src*="1922276"]').first();
    await expect(profileImage).toBeVisible();

    // 4. Verify author bio is present
    await expect(page.locator('text=/Simon Foster|Funky Si/i').first()).toBeVisible();
    await expect(page.locator('text=/developer|DevOps|Azure|.NET/i').first()).toBeVisible();

    // 5. Check that certification badges are displayed
    const azureBadge = page.locator('img[alt*="Azure" i], a[href*="credly"]').first();
    const awsBadge = page.locator('img[alt*="AWS" i]').first();
    await expect(azureBadge).toBeVisible();
    await expect(awsBadge).toBeVisible();

    // 6. Click on Azure Fundamentals certification badge link
    const azureLink = page.locator('a[href*="credly"][href*="adacf718"]').first();
    const pagePromise1 = context.waitForEvent('page');
    await azureLink.click();
    
    // 7. Verify link opens to Credly in new tab
    const credlyPage1 = await pagePromise1;
    await expect(credlyPage1).toHaveURL(/credly\.com/);
    await credlyPage1.close();

    // 8. Go back and click on AWS Cloud Practitioner badge link
    const awsLink = page.locator('a[href*="credly"][href*="3aab54c8"]').first();
    const pagePromise2 = context.waitForEvent('page');
    await awsLink.click();
    
    // 9. Verify link opens to Credly in new tab
    const credlyPage2 = await pagePromise2;
    await expect(credlyPage2).toHaveURL(/credly\.com/);
    await credlyPage2.close();

    // Verify page describes specializations
    await expect(page.locator('text=/.NET|C#/i')).toBeVisible();
    await expect(page.locator('text=/Azure/i')).toBeVisible();
    await expect(page.locator('text=/DevOps/i')).toBeVisible();
  });
});
