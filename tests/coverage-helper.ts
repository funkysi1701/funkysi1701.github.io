import { test as base, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Extend the test to include coverage collection
export const test = base.extend({
  context: async ({ context }, use) => {
    // Enable JavaScript coverage
    if (process.env.PLAYWRIGHT_COVERAGE) {
      await context.addInitScript(() => {
        (window as any).__coverage__ = (window as any).__coverage__ || {};
      });
    }
    await use(context);
  },

  page: async ({ page }, use, testInfo) => {
    // Start coverage before each test
    if (process.env.PLAYWRIGHT_COVERAGE) {
      await page.coverage.startJSCoverage();
    }

    await use(page);

    // Collect coverage after each test
    if (process.env.PLAYWRIGHT_COVERAGE) {
      const coverage = await page.coverage.stopJSCoverage();
      
      // Save coverage data
      const coverageDir = path.join(process.cwd(), 'coverage', 'tmp');
      if (!fs.existsSync(coverageDir)) {
        fs.mkdirSync(coverageDir, { recursive: true });
      }

      const coverageFile = path.join(
        coverageDir,
        `coverage-${testInfo.testId}-${Date.now()}.json`
      );

      fs.writeFileSync(coverageFile, JSON.stringify(coverage, null, 2));
    }
  },
});

export { expect } from '@playwright/test';
