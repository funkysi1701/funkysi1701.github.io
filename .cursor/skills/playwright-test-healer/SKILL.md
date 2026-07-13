---
name: playwright-test-healer
description: Debug and fix failing Playwright E2E tests using a systematic run-debug-fix loop. Use when Playwright tests fail, flaky specs need healing, or the user asks to fix broken E2E tests. Mirrors .github/agents/playwright-test-healer.agent.md for Cursor.
---

# Playwright test healer

Systematically identify, diagnose, and fix broken Playwright tests. Repo conventions: [`.cursor/rules/playwright-tests.mdc`](../../rules/playwright-tests.mdc). Copilot twin: [`.github/agents/playwright-test-healer.agent.md`](../../../.github/agents/playwright-test-healer.agent.md).

## Prerequisites

```bash
npm ci
npx playwright install chromium   # if browsers are missing
```

- **`BASE_URL`:** defaults to `https://www.funkysi1701.com` when unset. For local Hugo: `http://localhost:1313`. Non-prod CI uses `https://blog-dev.funkysi1701.com`.
- Playwright MCP (optional): configured in [`.vscode/mcp.json`](../../../.vscode/mcp.json) as `playwright-test` (`npx playwright run-test-mcp-server`). Prefer MCP `test_run` / `test_debug` / browser tools when available; otherwise use CLI below.

## Workflow

1. **Initial run** — list failures:

   ```bash
   npm test
   ```

   Or a single file: `npx playwright test path/to/spec.ts`.

2. **Debug each failure** — re-run with headed/debug as needed (`npm run test:headed`, `npm run test:debug`). With MCP: `test_debug`, then inspect via snapshot / console / network tools.

3. **Root cause** — check in order:
   - Selectors that no longer match the live DOM
   - Timing / waiting (never use `networkidle` or other deprecated APIs)
   - Wrong `BASE_URL` or environment drift
   - Application or content changes that broke assertions

4. **Remediate** — edit the test only as needed:
   - Prefer resilient locators (roles, labels, stable text; regex for dynamic data)
   - Keep `// spec: specs/...` traceability comments
   - Prefer maintainable fixes over brittle hacks

5. **Verify** — re-run the failing test after each fix. Fix one failure at a time when several exist.

6. **Iterate** until the targeted tests pass. If the test is correct but the site behaviour is wrong and you have high confidence, mark `test.fixme()` and add a comment on the failing step describing actual vs expected behaviour.

## Principles

- Be systematic; document why each fix was made
- Do not ask clarifying questions mid-heal — choose the most reasonable fix
- Do not weaken assertions just to go green unless the assertion was wrong
- After `package.json` / lockfile changes, run `npm ci` before retesting
