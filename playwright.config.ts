import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
        ['github'],
        ['list'],
        ['html', { open: 'never' }],
        ['./reporters/page-visit-tracker.ts'],
      ]
    : [
        ['html'],
        ['./reporters/page-visit-tracker.ts'],
      ],
  use: {
    baseURL: 'https://www.funkysi1701.com',
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
