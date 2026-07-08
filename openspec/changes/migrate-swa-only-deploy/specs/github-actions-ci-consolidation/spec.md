## ADDED Requirements

### Requirement: Playwright E2E runs on GitHub Actions after SWA deploy

Playwright end-to-end tests MUST run in GitHub Actions, not Azure Pipelines. After a dev SWA deploy on `develop` or `feature/*` pushes, the workflow MUST run `npx playwright test` with `BASE_URL=https://blog-dev.funkysi1701.com`. After production-relevant events on `main` (push and PRs targeting `main`), Playwright MUST run with `BASE_URL=https://www.funkysi1701.com`.

#### Scenario: Develop push E2E against blog-dev

- **WHEN** a commit is pushed to `develop` and the dev SWA deploy succeeds
- **THEN** GitHub Actions runs Playwright with `BASE_URL=https://blog-dev.funkysi1701.com`
- **THEN** the test run uses `npm ci` and the Playwright version pinned in `package-lock.json`

#### Scenario: Main PR E2E against production

- **WHEN** a pull request targets `main`
- **THEN** GitHub Actions runs Playwright with `BASE_URL=https://www.funkysi1701.com`

### Requirement: Page coverage uploads from GitHub Actions

When `CODECOV_TOKEN` is configured, post-Playwright workflows MUST run `scripts/generate-page-coverage.js` and upload `coverage/page-coverage.lcov` to Codecov. The page-visit reporter MUST count URLs on `blog-dev.funkysi1701.com` as well as production and localhost origins.

#### Scenario: Blog-dev visits tracked for coverage

- **WHEN** Playwright runs with `BASE_URL=https://blog-dev.funkysi1701.com`
- **THEN** page visits to `blog-dev.funkysi1701.com` are included in `test-results/page-visits/page-visits.json`

### Requirement: SEO Signal Diff runs after dev deploy on GitHub Actions

The SEO check workflow MUST trigger after a successful dev SWA deploy (via `workflow_call` or job `needs`), not via Azure Pipelines `repository_dispatch`. It MUST crawl `https://blog-dev.funkysi1701.com/sitemap.xml` using `funkysi1701/signal-diff-action` with the same secrets as today (`SIGNALDIFF_API_BASE_URL`, `SIGNALDIFF_CI_API_KEY`).

#### Scenario: SEO crawl after develop deploy

- **WHEN** a dev SWA deploy completes for a `develop` push
- **THEN** the SEO check workflow runs Signal Diff against `https://blog-dev.funkysi1701.com/sitemap.xml`
- **THEN** no `azure-pipeline-complete` repository_dispatch is required

### Requirement: Nightly Pa11y runs on GitHub Actions against production

A scheduled GitHub Actions workflow MUST run the full-sitemap Pa11y scan (axe + htmlcs, light and dark themes) against `https://www.funkysi1701.com` at least once per day. On completion, it MUST invoke `scripts/create-accessibility-issues.js` to open GitHub issues for new violations, matching current Azure Pipelines behaviour.

#### Scenario: Scheduled Pa11y on production SWA

- **WHEN** the nightly Pa11y schedule triggers
- **THEN** the workflow scans production at `https://www.funkysi1701.com` using the existing `scripts/pa11y-sitemap` tooling
- **THEN** new accessibility issues are filed via `create-accessibility-issues.js` when violations are found

### Requirement: Azure Pipelines blog deploy and E2E are retired

`azure-pipelines.yml` MUST NOT perform ECR build, Kubernetes login, Helm deploy, blog-dev wait loops, Playwright E2E, or `repository_dispatch` to GitHub for SEO. `azure-pipelines-playwright.yml` MUST be removed or disabled. Hugo production build validation MUST remain available via `hugo-build.yml` on PRs and branch pushes.

#### Scenario: No Azure Pipelines Playwright gate

- **WHEN** a contributor merges to `develop`
- **THEN** Playwright E2E is gated by GitHub Actions only
- **THEN** Azure Pipelines does not run Playwright for the blog
