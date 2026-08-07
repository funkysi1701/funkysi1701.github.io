## Context

[#3473](https://github.com/funkysi1701/funkysi1701.github.io/issues/3473) flagged `playwright.config.ts` as a maintainability risk when it was a ~33-line monolithic defaults file. Duplicate [#3513](https://github.com/funkysi1701/funkysi1701.github.io/issues/3513) already delivered the structural fix: env-overridable workers/retries/timeouts, a header documentation table, CI vs local defaults, and docs in README, Cursor rules, Copilot instructions, and `specs/README.md`.

Current state:

- Config is one file (~110 lines) with small helpers (`envInt`, `envIntOptional`, `resolveWorkers`) — readable without a multi-file layout.
- CI still relies on `CI` + `BASE_URL` from workflows; optional `PLAYWRIGHT_*` vars are unset in Actions (preserving historical behaviour).
- `AGENTS.md` quick-start mentions Playwright commands but not the scalability knobs.

Constraints: no breaking changes to existing tests or CI defaults; keep documented Markdown contract aligned (`AGENTS.md` / CONTRIBUTING when behaviour is documented elsewhere); prefer smallest change.

## Goals / Non-Goals

**Goals:**

- Codify the supported config shape: single documented root config + optional env overrides.
- Close remaining doc drift so agents and humans see the same override surface.
- Verify config loads and CI-safe defaults remain intact so #3473 can close.

**Non-Goals:**

- Splitting into `playwright.config.*.ts` or extracting helpers to `tests/config/` without a concrete reuse need.
- Adding firefox/webkit projects or changing reporter/output layout.
- Raising default CI workers above 1 or changing default retries.
- New shared fixtures beyond the existing `tests/fixtures.ts` page-visit helper.

## Decisions

### 1. Keep a single root config file (default)

**Choice:** Leave helpers and projects in `playwright.config.ts`. Document that this is intentional until a second consumer or second project matrix needs a shared module.

**Alternatives considered:**

- `playwright/env.ts` + thin config — clearer for large orgs; premature here (one consumer, ~50 lines of helpers).
- Environment-named config files (`playwright.ci.config.ts`) — duplicates defaults; env vars already cover local/CI tuning without file sprawl.

### 2. Doc sync as the main remaining deliverable

**Choice:** Add a short pointer in `AGENTS.md` (Testing / Playwright row or a bullet under quick start) to the README Testing env table and/or the header comment. Touch `CONTRIBUTING.md` only if it already describes how to run Playwright without mentioning overrides.

**Alternatives considered:**

- Duplicate the full env table in every doc — drifts; prefer one canonical table (README + config header) and short pointers elsewhere.

### 3. Verification without full suite by default

**Choice:** Confirm config parses (`npx playwright test --list` or equivalent) and that smoke script wiring is unchanged. Run `npm run test:smoke` only when a local Hugo server / suitable `BASE_URL` is available; do not require production hits for closeout.

**Alternatives considered:**

- Full `npm test` against production — heavy, rate-limits risk; out of scope for a docs/verify polish unless config logic changes.

## Risks / Trade-offs

- **[Risk]** Tech-debt scan may re-open similar issues based on file size heuristics → **Mitigation:** Well-documented header + closed issues with pointers; config intentionally stays one file under a few hundred lines.
- **[Risk]** Someone sets `PLAYWRIGHT_WORKERS` high in CI and flaky tests appear → **Mitigation:** Document that CI defaults remain 1 worker; overrides are opt-in.
- **[Trade-off]** Not extracting helpers means slightly less unit-testable parsers → Acceptable; helpers are tiny and covered by smoke/list runs.

## Migration Plan

1. Align onboarding docs with existing README / config header.
2. Run list/smoke verification.
3. Close #3473 with a note that #3513 delivered the config change and this change completes doc sync + verify.
4. Rollback: revert doc-only commits if needed; no deploy impact.

## Open Questions

None blocking — apply can proceed with doc sync + verify.
