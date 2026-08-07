## 1. Confirm current config meets acceptance

- [x] 1.1 Re-read `playwright.config.ts` and confirm header docs, env helpers, CI defaults (workers=1, retries=2), and chromium project match the open specs
- [x] 1.2 Confirm README Testing, `.cursor/rules/playwright-tests.mdc`, `.github/copilot-instructions.md`, and `specs/README.md` already document the override table (no rewrite unless drift found)

## 2. Close remaining doc drift

- [x] 2.1 Update `AGENTS.md` quick-start / testing notes so optional `PLAYWRIGHT_*` overrides point at README Testing and the config header
- [x] 2.2 Add a brief pointer in `CONTRIBUTING.md` (Test changes checklist) to the same override surface if Playwright run docs are mentioned without knobs
- [x] 2.3 Only edit `playwright.config.ts` if verification finds a real defect or comment inaccuracy — do not split the file

## 3. Verify no regressions

- [x] 3.1 Run `npx playwright test --list` (or equivalent) to confirm the config loads
- [x] 3.2 Spot-check that `package.json` scripts for `test` / `test:smoke` are unchanged
- [x] 3.3 Optionally run `npm run test:smoke` with a local `BASE_URL` if a Hugo server is available

## 4. Close out issue

- [x] 4.1 Comment on and close [#3473](https://github.com/funkysi1701/funkysi1701.github.io/issues/3473), noting #3513 delivered the config change and this change finished doc sync + verification
