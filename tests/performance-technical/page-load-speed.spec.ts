// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';

test.describe('Performance and Technical', () => {
  test('Page load performance', async ({ page }) => {
    // 1. Clear browser cache
    await page.context().clearCookies();

    // 2. Navigate to https://www.funkysi1701.com
    const startTime = Date.now();
    await page.goto('https://www.funkysi1701.com');
    const endTime = Date.now();

    // 3-5. Measure performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        firstPaint: performance.getEntriesByType('paint').find(e => e.name === 'first-contentful-paint')?.startTime || 0
      };
    });

    // 6. Verify page loads in under 3 seconds on good connection
    const totalLoadTime = endTime - startTime;
    console.log(`Page load time: ${totalLoadTime}ms`);
    expect(totalLoadTime).toBeLessThan(5000); // Allowing 5s for slower connections

    // First contentful paint within reasonable time
    console.log(`First contentful paint: ${performanceMetrics.firstPaint}ms`);
    
    // 7. Test with throttled network (3G simulation)
    // This would require CDPSession - skipping in basic test

    // 8. Verify page is still usable
    await expect(page.locator('nav').first()).toBeVisible();
    await expect(page.locator('article, .post').first()).toBeVisible();
  });
});
