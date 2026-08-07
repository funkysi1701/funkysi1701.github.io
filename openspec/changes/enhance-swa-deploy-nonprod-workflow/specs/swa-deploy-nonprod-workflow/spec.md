## ADDED Requirements

### Requirement: Thin nonprod SWA orchestrator
The repository SHALL keep `.github/workflows/swa-deploy-nonprod.yml` as a thin orchestrator that wires branch gates and secrets into reusable deploy and check workflows, rather than inlining Hugo build and SWA upload steps.

#### Scenario: Develop push deploys both nonprod sites
- **WHEN** a push lands on `develop` (or `workflow_dispatch` from that ref)
- **THEN** the workflow deploys blog-dev via Hugo `development` (with `--buildFuture`) and blog-test via Hugo `staging` (without `--buildFuture`) through `reusable-hugo-swa-deploy.yml`

#### Scenario: Feature branch deploys blog-dev only
- **WHEN** a push lands on a `feature/**` branch
- **THEN** the workflow deploys blog-dev and MUST NOT run the blog-test deploy job

### Requirement: Parallel jobs where safe
Nonprod deploy orchestration SHALL run independent work in parallel so deploy time stays stable or improves without extra serial bottlenecks.

#### Scenario: Dev and test deploys are independent
- **WHEN** both `deploy-dev` and `deploy-test` are eligible
- **THEN** they MUST NOT wait on each other via `needs`

#### Scenario: Post-deploy checks run in parallel after blog-dev
- **WHEN** `deploy-dev` succeeds
- **THEN** Playwright (blog-dev) and SEO check (blog-dev) may start without waiting on each other
- **THEN** neither check SHALL start if `deploy-dev` did not succeed

### Requirement: Secrets and environments
Deploy tokens and third-party API credentials MUST be supplied as GitHub Actions secrets (and Environment-scoped where the reusable sets `environment`), never hard-coded in workflow YAML.

#### Scenario: Required secret wiring documented
- **WHEN** an operator reads the workflow header comment
- **THEN** they see the deploy token secret names for blog-dev and blog-test, plus SEO and optional Codecov secrets used by downstream jobs

### Requirement: Concurrency cancellation
The nonprod deploy workflow SHALL cancel superseded in-flight runs for the same ref so rapid pushes do not pile up deploys.

#### Scenario: Newer push cancels older run
- **WHEN** two pushes to the same branch trigger the workflow in succession
- **THEN** concurrency is keyed by `github.ref` with `cancel-in-progress: true`

### Requirement: Onboarding docs describe the design
Agent and human docs that mention nonprod SWA deploys SHALL describe the orchestrator pattern at a glance: branch gates, reusable build/upload, parallel post-deploy checks, and that Hugo deploy does not rely on npm caching.

#### Scenario: AGENTS CI map stays accurate
- **WHEN** an agent reads the Azure SWA deploy row in `AGENTS.md`
- **THEN** it can identify `swa-deploy-nonprod.yml` for blog-dev/blog-test and that blog-dev uses `--buildFuture`

### Requirement: No intentional deploy regressions
Closing the enhancement work SHALL NOT change Hugo environments, `--buildFuture` eligibility, deploy targets, or the requirement that full Playwright/SEO run against blog-dev after a successful blog-dev deploy.

#### Scenario: Behaviour contract unchanged
- **WHEN** workflow YAML is reviewed after this change
- **THEN** job inputs for `hugo_environment`, `wait_sitemap_url`, and Playwright `base_url` match the pre-change nonprod contract unless a separate intentional change says otherwise
