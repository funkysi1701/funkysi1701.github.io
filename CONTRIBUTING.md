# Contributing to funkysi1701.com

Thank you for contributing to this Hugo blog. Use this checklist before opening or reviewing a pull request. Setup, commands, and CI details live in [`README.md`](README.md); agents should also read [`AGENTS.md`](AGENTS.md).

## Pull request checklist

Copy into your PR description or verify locally before requesting review:

- [ ] **Post front matter:** `title` 50–60 characters and `description` 110–160 characters for `content/posts/**/*.md`. Run `npm run check:meta` after editing front matter.
- [ ] **Parkrun generated block:** Did not hand-edit `content/parkrun.md` between `<!-- BEGIN PARKRUN_GENERATED -->` and `<!-- END PARKRUN_GENERATED -->`. Use `scripts/update_parkrun_results.py` instead; see [`README.md`](README.md#parkrun-results-contentparkrunmd).
- [ ] **Secrets and build output:** Did not commit API keys, deploy tokens, or credentials. Did not commit `public/` (Hugo build output).
- [ ] **Templates and assets:** Local Hugo build passes (`hugo server -D` or `hugo --minify --environment production` as appropriate). Prefer site overrides in root `layouts/`, `assets/`, and `static/` over editing `themes/hugo-theme-bootstrap/`.
- [ ] **Test changes:** `npm ci && npm test` when you change tests or behaviour they cover. Full Playwright E2E runs on **Azure Pipelines** (`azure-pipelines-playwright.yml`) after merge to **`develop`** or **`main`**, and on PRs into **`main`** — not on PRs into **`develop`** (blog-dev is not updated until merge). A green GitHub Actions run does not imply E2E passed.
- [ ] **New Playwright specs:** Include a `// spec: specs/funkysi1701-test-plan.md` comment (or the relevant scenario doc under `specs/`). See [`specs/funkysi1701-test-plan.md`](specs/funkysi1701-test-plan.md).

## Branch workflow

| Branch | Use |
|--------|-----|
| **`feature/*`** | Day-to-day work — open PRs into **`develop`** |
| **`develop`** | Integration; Azure Pipelines deploys to blog-dev / blog-test |
| **`main`** | Production; promotion via [`.github/workflows/auto-pr.yml`](.github/workflows/auto-pr.yml) (develop → main) |

There is no **`dev`** branch — use **`develop`**.

## AI-assisted contributions

- Start with [`AGENTS.md`](AGENTS.md) for commands, guardrails, and the CI map.
- Cursor: path-scoped rules in [`.cursor/rules/`](.cursor/rules/) (always-applied [`funkysi1701-blog-core.mdc`](.cursor/rules/funkysi1701-blog-core.mdc) plus content, tests, layouts, and parkrun rules). Copilot: [`.github/copilot-instructions.md`](.github/copilot-instructions.md).
- Playwright MCP for agent-driven test runs: [`.vscode/mcp.json`](.vscode/mcp.json).
- Prefer **minimal diffs** — solve the task without refactoring unrelated code or adding dependencies without clear need.

## Further reading

| Path | Purpose |
|------|---------|
| [`README.md`](README.md) | Local setup, testing, deployment |
| [`AGENTS.md`](AGENTS.md) | Tool-agnostic agent onboarding |
| [`.cursor/rules/`](.cursor/rules/) | Cursor rules by area |
| [`specs/funkysi1701-test-plan.md`](specs/funkysi1701-test-plan.md) | E2E scenario plan |
