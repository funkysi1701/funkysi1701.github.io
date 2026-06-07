# Agent onboarding — funkysi1701.com (Hugo blog)

Portable guide for AI agents (Cursor, Copilot, Claude Code, etc.). For full conventions, see [`.cursor/rules/funkysi1701-blog.mdc`](.cursor/rules/funkysi1701-blog.mdc) and [`.github/copilot-instructions.md`](.github/copilot-instructions.md).

**Site:** https://www.funkysi1701.com

## Quick start

| Task | Command |
|------|---------|
| Local dev server | `hugo server -D` → http://localhost:1313 |
| Production build | `hugo --minify --environment production` |
| Docker dev | `docker-compose up` (Hugo version from `.env`) |
| Install test deps | `npm ci` |
| E2E tests | `npm test` (set `BASE_URL` for non-production targets) |
| Playwright browser | `npx playwright install chromium` |
| Meta title check | `python scripts/check_meta_titles.py --root .` |
| Meta description check | `python scripts/check_meta_descriptions.py --root .` |
| Parkrun results update | `pip install -r scripts/requirements-parkrun.txt` then `python scripts/update_parkrun_results.py` |

After changing `package.json` or `package-lock.json`, run `npm ci` before `npm test` (matches Azure DevOps).

## What not to edit

- **`public/`** — Hugo build output; never commit as source of truth.
- **Parkrun generated block** in `content/parkrun.md` between `<!-- BEGIN PARKRUN_GENERATED -->` and `<!-- END PARKRUN_GENERATED -->` — produced by `scripts/update_parkrun_results.py`. Edit content below the markers by hand; optional row suppressions in `data/parkrun_suppress.json`.
- **Secrets** — no API keys, deploy tokens, or credentials in `.env`, `config/`, or front matter. Azure Static Web Apps deploy token lives only in GitHub Actions secrets.
- **Vendored theme** — prefer site overrides in root `layouts/`, `assets/`, and `static/` over editing `themes/hugo-theme-bootstrap/`.

## Source of truth

- **Content:** `content/` (posts under `content/posts/YYYY/`, pages at `content/` root).
- **Config:** `config/_default/` plus `config/development/`, `config/staging/`, `config/production/` when environment-specific.
- **Templates & assets:** `layouts/`, `assets/`, `static/`.
- **Routing / headers:** `staticwebapp.config.json` (copied into `public/` on deploy).

## Blog post guardrails

Posts (`content/posts/**/*.md`) use TOML front matter in `+++` fences. CI enforces:

- **`title`:** 50–60 characters (inclusive)
- **`description`:** 110–160 characters (inclusive)

British English (`locale = 'en-gb'`). One top-level Markdown heading per page where that matches site structure. Meaningful images need descriptive alt text.

## CI map

| Check | Where | Notes |
|-------|-------|-------|
| Playwright E2E | **Azure Pipelines** — `azure-pipelines-playwright.yml` | Primary full E2E gate; `BASE_URL` from branch (`main`/`master` → production, `develop` → blog-dev) |
| Page coverage / Codecov | Azure Pipelines | `scripts/generate-page-coverage.js`; informational per `codecov.yml` |
| Meta title / description length | **GitHub Actions** | `meta-title-length.yml`, `meta-description-length.yml` |
| Azure SWA deploy | GitHub Actions | `azure-static-web-apps-victorious-pebble-0b8f90e03.yml` (production path) |
| Broken links | GitHub Actions | `link.yml` — monthly + manual; crawls from production homepage |
| Parkrun scrape PR | GitHub Actions | `parkrun-update.yml` — PR to `develop` when scrape succeeds |
| develop → main PR | GitHub Actions | `auto-pr.yml` |
| SEO crawl (Signal Diff) | GitHub Actions | `seo-check.yml` — triggered after Azure pipeline or manually |
| Image build + Helm deploy | Azure Pipelines | `azure-pipelines.yml` — ECR push and Kubernetes deploy |

A green GitHub Actions run does **not** imply Playwright passed — check Azure Pipelines for E2E.

## Branches and deploy

| Branch | Target |
|--------|--------|
| **`main`** | Production — SWA (GHA) + Helm `main` namespace |
| **`develop`** | Integration — Helm `develop` and `test` namespaces (blog-dev / blog-test) |
| **`feature/*`** | Build and Helm to `develop` namespace only |

There is no `dev` branch; use **`develop`**. `.github/workflows/auto-pr.yml` can open or refresh a develop → main PR.

## Scope

Make the smallest change that satisfies the task. Do not refactor unrelated code or add dependencies without clear need.

## Further reading

| Path | Purpose |
|------|---------|
| [`.cursor/rules/funkysi1701-blog.mdc`](.cursor/rules/funkysi1701-blog.mdc) | Full Cursor rules (always applied in Cursor) |
| [`.github/copilot-instructions.md`](.github/copilot-instructions.md) | Copilot-specific project context |
| [`README.md`](README.md) | Human-oriented setup, testing, and deploy |
| [`specs/funkysi1701-test-plan.md`](specs/funkysi1701-test-plan.md) | E2E scenario plan (`// spec:` comments in `tests/`) |
| [`.vscode/mcp.json`](.vscode/mcp.json) | Playwright MCP server for agent-driven test runs |
