import { defineConfig, devices, type ReporterDescription } from '@playwright/test';

/**
 * Playwright E2E config for funkysi1701.com.
 *
 * Defaults preserve existing CI behaviour (single worker, 2 retries, JUnit + list
 * + HTML reporters). Override via environment variables for local tuning or
 * scaling CI without editing this file.
 *
 * | Variable              | Default (local / CI)              | Purpose                          |
 * |-----------------------|-----------------------------------|----------------------------------|
 * | `BASE_URL`            | https://www.funkysi1701.com       | Target site under test           |
 * | `CI`                  | unset / set by Actions            | Enables CI-safe defaults         |
 * | `PLAYWRIGHT_WORKERS`  | auto / 1                          | Parallel worker processes        |
 * | `PLAYWRIGHT_RETRIES`  | 0 / 2                             | Retries per failed test          |
 * | `PLAYWRIGHT_TIMEOUT`  | 30000                             | Per-test timeout (ms)            |
 * | `PLAYWRIGHT_EXPECT_TIMEOUT` | 5000                        | expect() assertion timeout (ms)  |
 * | `PLAYWRIGHT_NAVIGATION_TIMEOUT` | (Playwright default)    | page.goto / navigation (ms)      |
 * | `PLAYWRIGHT_ACTION_TIMEOUT` | (unset = no limit)          | click / fill action timeout (ms) |
 * | `PLAYWRIGHT_MAX_FAILURES` | 0 (no limit)                  | Stop after N failures (fail-fast)|
 *
 * Smoke subset: `npm run test:smoke` (`--grep @smoke`). Full suite: `npm test`.
 * See README.md (Testing) and `.cursor/rules/playwright-tests.mdc`.
 */

const isCI = !!process.env.CI;

/** Parse a positive integer env var; return `fallback` when unset or invalid. */
function envInt(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/** Parse an optional positive integer; return `undefined` when unset/invalid. */
function envIntOptional(name: string): number | undefined {
  const raw = process.env[name]?.trim();
  if (!raw) return undefined;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

/** Worker count: env override, else 1 on CI, else Playwright auto. */
function resolveWorkers(): number | undefined {
  const raw = process.env.PLAYWRIGHT_WORKERS?.trim();
  if (raw) {
    const n = Number.parseInt(raw, 10);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return isCI ? 1 : undefined;
}

const workers = resolveWorkers();

const retries = envInt('PLAYWRIGHT_RETRIES', isCI ? 2 : 0);
const timeout = envInt('PLAYWRIGHT_TIMEOUT', 30_000);
const expectTimeout = envInt('PLAYWRIGHT_EXPECT_TIMEOUT', 5_000);
const navigationTimeout = envIntOptional('PLAYWRIGHT_NAVIGATION_TIMEOUT');
const actionTimeout = envIntOptional('PLAYWRIGHT_ACTION_TIMEOUT');
const maxFailures = envInt('PLAYWRIGHT_MAX_FAILURES', 0);

const baseURL =
  process.env.BASE_URL?.trim() || 'https://www.funkysi1701.com';

const reporters: ReporterDescription[] = isCI
  ? [
      ['junit', { outputFile: 'test-results/junit.xml' }],
      ['list'],
      ['html', { open: 'never' }],
      ['./reporters/page-visit-tracker.ts'],
    ]
  : [
      ['html'],
      ['./reporters/page-visit-tracker.ts'],
    ];

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results',
  fullyParallel: true,
  forbidOnly: isCI,
  retries,
  workers,
  timeout,
  expect: {
    timeout: expectTimeout,
  },
  // 0 = no limit (Playwright default). Set PLAYWRIGHT_MAX_FAILURES for fail-fast.
  maxFailures: maxFailures > 0 ? maxFailures : undefined,
  reporter: reporters,

  use: {
    baseURL,
    trace: isCI ? 'retain-on-failure' : 'on-first-retry',
    screenshot: 'only-on-failure',
    ...(navigationTimeout !== undefined
      ? { navigationTimeout }
      : {}),
    ...(actionTimeout !== undefined ? { actionTimeout } : {}),
  },

  // Extend with firefox / webkit projects when cross-browser coverage is needed.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
