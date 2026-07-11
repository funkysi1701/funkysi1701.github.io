# Agent onboarding — funkysi1701.com (Hugo blog)

Portable guide for AI agents (Cursor, Copilot, Claude Code, etc.). Cursor rules are path-scoped under [`.cursor/rules/`](.cursor/rules/); Copilot detail in [`.github/copilot-instructions.md`](.github/copilot-instructions.md).

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
| Meta validation (titles + descriptions) | `npm run check:meta` |
| Meta title check only | `npm run check:meta:titles` |
| Meta description check only | `npm run check:meta:descriptions` |
| Preview description fixes (dry-run) | `npm run check:meta:fix` — apply fixes with `python scripts/normalize_meta_descriptions.py --root .` |
| Parkrun results update | `pip install -r scripts/requirements-parkrun.txt` then `python scripts/update_parkrun_results.py` |
| 30-day issue schedule (dry-run) | `GH_TOKEN=$(gh auth token) DRY_RUN=true node scripts/issue-schedule/run.mjs` |
| Blog post idea (dry-run) | `GH_TOKEN=$(gh auth token) DRY_RUN=true node scripts/blog-post-idea/run.mjs` |

After changing `package.json` or `package-lock.json`, run `npm ci` before `npm test` (matches GitHub Actions).

## What not to edit

- **`public/`** — Hugo build output; never commit as source of truth.
- **Parkrun generated block** in `content/parkrun.md` between `<!-- BEGIN PARKRUN_GENERATED -->` and `<!-- END PARKRUN_GENERATED -->` — produced by `scripts/update_parkrun_results.py`. Edit content below the markers by hand; optional row suppressions in `data/parkrun_suppress.json`.
- **Secrets** — no API keys, deploy tokens, or credentials in `.env`, `config/`, or front matter. Azure Static Web Apps deploy token lives only in GitHub Actions secrets.
- **Vendored theme** — prefer site overrides in root `layouts/`, `assets/`, and `static/` over editing `themes/hugo-theme-bootstrap/`.

## Cursor context

**`.cursorignore`** keeps Cursor Agent indexing off generated and vendored paths (`public/`, `node_modules/`, `themes/hugo-theme-bootstrap/`, Playwright/coverage artefacts). It affects Cursor only — not git or Hugo. Theme work still belongs in root `layouts/`, `assets/`, and `static/`.

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

After bulk-editing post front matter, run **`npm run check:meta`** before opening a PR.

## CI map

| Check | Where | Notes |
|-------|-------|-------|
| Playwright E2E | **GitHub Actions** — `swa-deploy-nonprod.yml` (blog-dev after dev SWA deploy on **`develop`** / **`feature/*`**) and `playwright.yml` (**`main`** pushes + PRs into **`main`**) | `BASE_URL`: production for `main`, blog-dev for non-prod deploys |
| Page coverage / Codecov | GitHub Actions (Playwright workflows) | `scripts/generate-page-coverage.js`; informational per `codecov.yml` |
| Hugo production build | **GitHub Actions** | `hugo-build.yml` — PRs and pushes to `main`/`develop`; catches template/render errors before deploy |
| Meta title / description length | **GitHub Actions** | `meta-title-length.yml`, `meta-description-length.yml` |
| Azure SWA deploy | GitHub Actions | `azure-static-web-apps-victorious-pebble-0b8f90e03.yml` (prod), `swa-deploy-nonprod.yml` (dev/test) |
| Broken links | GitHub Actions | `link.yml` — monthly + manual; crawls from production homepage |
| Parkrun scrape PR | GitHub Actions | `parkrun-update.yml` — PR to `develop` when scrape succeeds |
| develop → main PR | GitHub Actions | `auto-pr.yml` |
| SEO crawl (Signal Diff) | GitHub Actions | `swa-deploy-nonprod.yml` (blog-dev after deploy) and production SWA workflow; manual `seo-check.yml` |
| Pa11y nightly | GitHub Actions | `pa11y-nightly.yml` — full sitemap on production |
| 30-day issue schedule | GitHub Actions | `issue-schedule.yml` — Mondays 09:00 UTC + manual; upserts tracking issue via GitHub Models |
| Blog post idea | GitHub Actions | `blog-post-idea.yml` — Wednesdays 09:00 UTC + manual; opens one `[Content Suggestion]` issue via GitHub Models |

## Branches and deploy

| Branch | Target |
|--------|--------|
| **`main`** | Production — GHA → Azure SWA (`www.funkysi1701.com`) |
| **`develop`** | Integration — GHA → SWA dev + test (`blog-dev`, `blog-test`) |
| **`feature/*`** | GHA → SWA dev only |

There is no `dev` branch; use **`develop`**. `.github/workflows/auto-pr.yml` can open or refresh a develop → main PR.

## Scope

Make the smallest change that satisfies the task. Do not refactor unrelated code or add dependencies without clear need.

## Further reading

| Path | Purpose |
|------|---------|
| [`.cursor/rules/funkysi1701-blog-core.mdc`](.cursor/rules/funkysi1701-blog-core.mdc) | Always-applied Cursor rules (source of truth, security, branches) |
| [`.cursor/rules/content-posts.mdc`](.cursor/rules/content-posts.mdc) | Content/posts — front matter, SEO lengths, alt text |
| [`.cursor/rules/playwright-tests.mdc`](.cursor/rules/playwright-tests.mdc) | Playwright — `BASE_URL`, `// spec:`, CI gates |
| [`.cursor/rules/hugo-layouts.mdc`](.cursor/rules/hugo-layouts.mdc) | Hugo templates — theme overrides, build verification |
| [`.cursor/rules/parkrun-generated.mdc`](.cursor/rules/parkrun-generated.mdc) | parkrun generated block and update script |
| [`.github/copilot-instructions.md`](.github/copilot-instructions.md) | Copilot-specific project context |
| [`scripts/issue-schedule/README.md`](scripts/issue-schedule/README.md) | Weekly 30-day issue schedule planner (GitHub Models) |
| [`scripts/blog-post-idea/README.md`](scripts/blog-post-idea/README.md) | Weekly blog post idea → content-suggestion issue (GitHub Models) |
| [`README.md`](README.md) | Human-oriented setup, testing, and deploy |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | PR checklist, branch workflow, merge readiness |
| [`specs/funkysi1701-test-plan.md`](specs/funkysi1701-test-plan.md) | E2E scenario plan (`// spec:` comments in `tests/`) |
| [`.vscode/mcp.json`](.vscode/mcp.json) | Playwright MCP server for agent-driven test runs |
