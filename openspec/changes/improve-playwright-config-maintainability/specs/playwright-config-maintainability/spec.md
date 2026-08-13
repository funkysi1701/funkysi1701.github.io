## ADDED Requirements

### Requirement: Documented Playwright root configuration
The repository SHALL keep a root `playwright.config.ts` that documents how to run and tune E2E tests, including optional environment-variable overrides and CI-safe defaults.

#### Scenario: Header documents override surface
- **WHEN** a contributor opens `playwright.config.ts`
- **THEN** they see a concise description of `BASE_URL`, CI behaviour, and optional `PLAYWRIGHT_*` tuning variables (workers, retries, timeouts, max failures)

#### Scenario: Projects are explicit
- **WHEN** the config is loaded
- **THEN** it defines at least one named project (currently chromium / Desktop Chrome) so future browsers can be added without restructuring the file

### Requirement: Environment overrides without breaking CI defaults
The Playwright config SHALL honour optional environment overrides while preserving historical CI behaviour when those variables are unset.

#### Scenario: CI defaults when overrides unset
- **WHEN** `CI` is set and `PLAYWRIGHT_WORKERS` / `PLAYWRIGHT_RETRIES` are unset
- **THEN** the config uses one worker and two retries

#### Scenario: Local defaults when overrides unset
- **WHEN** `CI` is unset and `PLAYWRIGHT_WORKERS` / `PLAYWRIGHT_RETRIES` are unset
- **THEN** the config uses Playwright’s automatic worker count and zero retries

#### Scenario: Explicit override
- **WHEN** a valid `PLAYWRIGHT_WORKERS` (or retries / timeout) value is set
- **THEN** that value is used instead of the CI/local default

#### Scenario: Base URL
- **WHEN** `BASE_URL` is unset
- **THEN** tests target `https://www.funkysi1701.com`
- **WHEN** `BASE_URL` is set
- **THEN** that URL is used as `use.baseURL`

### Requirement: Onboarding docs stay aligned
Agent and human onboarding docs that describe running Playwright SHALL point at the same override surface documented in README Testing and the config header, so contributors do not discover knobs only by reading source.

#### Scenario: AGENTS.md mentions tunables
- **WHEN** an agent reads `AGENTS.md` for how to run E2E tests
- **THEN** it learns that optional `PLAYWRIGHT_*` overrides exist and where the full table lives (README Testing and/or `playwright.config.ts`)

### Requirement: No silent behaviour regressions
Closing the maintainability work SHALL NOT change how existing npm scripts or GitHub Actions invoke Playwright unless those workflows intentionally adopt new env vars.

#### Scenario: Scripts unchanged
- **WHEN** a contributor runs `npm test` or `npm run test:smoke` without new env vars
- **THEN** behaviour matches pre-change defaults (same grep/tag wiring, same reporter expectations in CI when `CI` is set)
