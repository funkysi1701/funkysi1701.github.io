import { test as base } from '@playwright/test';

// Extend base test to track page visits
export const test = base.extend({
  page: async ({ page }, use) => {
    // Log page navigations to stdout so the reporter can capture them
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) {
        console.log(`PAGE_VISIT: ${frame.url()}`);
      }
    });

    await use(page);
  },
});

export { expect } from '@playwright/test';
