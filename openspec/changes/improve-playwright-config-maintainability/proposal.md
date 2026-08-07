## Why

[#3473](https://github.com/funkysi1701/funkysi1701.github.io/issues/3473) (and duplicate [#3513](https://github.com/funkysi1701/funkysi1701.github.io/issues/3513), already closed) asked for a Playwright config that is documented, env-tunable, and easy to extend without breaking CI. Most of that landed in commit `d2639a571` (`playwright.config.ts` helpers + README / Cursor / Copilot docs). Remaining gap: finish the acceptance loop — align onboarding docs that still omit the knobs, verify defaults are unchanged, and close #3473.

## What Changes

- Treat the current single-file config (header env table, `envInt` helpers, CI-safe defaults, chromium project) as the **supported shape** — no further module split unless a clear pain appears.
- Sync remaining agent/human docs (`AGENTS.md`, and CONTRIBUTING if it mentions Playwright runs) so optional `PLAYWRIGHT_*` overrides match README Testing.
- Verify local config load and smoke defaults (`BASE_URL`, workers/retries behaviour) so #3473 can close with evidence of no regressions.
- Close [#3473](https://github.com/funkysi1701/funkysi1701.github.io/issues/3473) when the above is done.

## Capabilities

### New Capabilities

- `playwright-config-maintainability`: Documented, env-overridable Playwright root config with stable CI defaults, project definition, and onboarding doc coverage.

### Modified Capabilities

<!-- No existing openspec/specs/ capabilities in this repo yet. -->

## Impact

- **Config:** `playwright.config.ts` (docs/comments only unless a defect is found during verify).
- **Docs:** `AGENTS.md`, possibly `CONTRIBUTING.md`; already-updated: `README.md`, `.cursor/rules/playwright-tests.mdc`, `.github/copilot-instructions.md`, `specs/README.md`.
- **Tests / CI:** No intentional behaviour change — workflows keep setting `BASE_URL` / `CI` as today; optional `PLAYWRIGHT_*` remain unset in Actions unless we add them later.
- **Out of scope:** Cross-browser projects, splitting config into multiple files, new fixtures, changing reporter layout, or parallelising CI workers by default.
