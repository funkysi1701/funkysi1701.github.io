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
| Playwright smoke | `npm run test:smoke` (needs a local Hugo server; set `BASE_URL`) |
| Playwright browser | `npx playwright install chromium` |
| Meta validation (titles + descriptions) | `npm run check:meta` |
| Meta title check only | `npm run check:meta:titles` |
| Meta description check only | `npm run check:meta:descriptions` |
| Preview description fixes (dry-run) | `npm run check:meta:fix` — apply fixes with `python scripts/normalize_meta_descriptions.py --root .` |
| Playwright `// spec:` headers | `npm run check:spec-headers` |
| SWA config validation | `npm run check:swa-config` |
| Parkrun results update | `pip install -r scripts/requirements-parkrun.txt` then `python scripts/update_parkrun_results.py` |
| 30-day issue schedule (dry-run) | Actions → **30-day issue schedule** → Run workflow (`dry_run`); impl in [repo-automation](https://github.com/funkysi1701/repo-automation) |
| Blog post idea (dry-run) | `GH_TOKEN=$(gh auth token) DRY_RUN=true node scripts/blog-post-idea/run.mjs` |
| Tech debt scan (dry-run) | Actions → **Tech debt scan** → Run workflow (`dry_run`); impl in [repo-automation](https://github.com/funkysi1701/repo-automation) |
| Home popular links refresh (dry-run) | `CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_TAG=... CLOUDFLARE_SITE_TAG=... DRY_RUN=true node scripts/home-popular/run.mjs` |

After changing `package.json` or `package-lock.json`, run `npm ci` before `npm test` (matches GitHub Actions).

## What not to edit

- **`public/`** — Hugo build output; never commit as source of truth.
- **Parkrun generated block** in `content/parkrun.md` between `<!-- BEGIN PARKRUN_GENERATED -->` and `<!-- END PARKRUN_GENERATED -->` — produced by `scripts/update_parkrun_results.py`. Edit content below the markers by hand; optional row suppressions in `data/parkrun_suppress.json`.
- **Secrets** — no API keys, deploy tokens, or credentials in `.env`, `config/`, or front matter. Azure Static Web Apps deploy token lives only in GitHub Actions secrets.
- **Vendored theme** — prefer site overrides in root `layouts/`, `assets/`, and `static/` over editing `themes/hugo-theme-bootstrap/`.
- **Duplicate Lite Analytics** — do not embed `lite.js` in Hugo while Cloudflare Zaraz injects it (double-count). See [`README.md`](README.md#analytics-cloudflare-zaraz).
- **Referral query strings** — do not branch on-page CTAs on `?ref=dailydev`; same HTML as the clean URL. Publishing/promotion checklist (daily.dev, evergreen-first): [`CONTRIBUTING.md`](CONTRIBUTING.md#publishing-and-promotion).

## Cursor context

**`.cursorignore`** keeps Cursor Agent indexing off generated and vendored paths (`public/`, `node_modules/`, `themes/hugo-theme-bootstrap/`, Playwright/coverage artefacts). It affects Cursor only — not git or Hugo. Theme work still belongs in root `layouts/`, `assets/`, and `static/`.

### Cursor hooks (post-edit meta validation)

Committed at [`.cursor/hooks.json`](.cursor/hooks.json). In a **trusted** workspace, Cursor loads these automatically (also for cloud agents). They are opt-in per machine: trust the folder, or disable under **Cursor Settings → Hooks** / remove the project hooks entry if you do not want them.

| Hook | Behaviour |
|------|-----------|
| `afterFileEdit` / `postToolUse` (`Write`\|`StrReplace`) | If the edited file is under `content/posts/**/*.md`, runs `scripts/check_meta_titles.py` and `check_meta_descriptions.py` for **that file only** via `--files` (timeout 30s). |

On failure, the hook prints a clear report and (for `postToolUse`) injects `additional_context` so the agent can fix `title` (production HTML `<title>` 50–60 = front matter usually 32–42 + ` - Funky Si's Blog`) / `description` (110–160). Non-post edits are skipped. Hugo layout smoke builds are **not** hooked yet (kept out to avoid slowing every edit).

Requires **Python 3.11+** on `PATH` (same as `npm run check:meta`). Manual equivalent: `python scripts/check_meta_titles.py --root . --files <path>` (and the descriptions script).

**Project skills** under [`.cursor/skills/`](.cursor/skills/) package recurring maintenance workflows (read the skill when the task matches; they link to path-scoped rules instead of duplicating them):

| Skill | Use when |
|-------|----------|
| [`update-parkrun`](.cursor/skills/update-parkrun/SKILL.md) | Refreshing parkrun results via the scraper |
| [`fix-post-meta`](.cursor/skills/fix-post-meta/SKILL.md) | Checking or normalizing post title/description lengths |
| [`playwright-test-healer`](.cursor/skills/playwright-test-healer/SKILL.md) | Debugging and fixing failing Playwright E2E tests |

OpenSpec skills (`openspec-*`) live in the same directory for change proposal/apply/archive flows.

## Source of truth

- **Content:** `content/` (posts under `content/posts/YYYY/`, pages at `content/` root).
- **Config:** `config/_default/` plus `config/development/`, `config/staging/`, `config/production/` when environment-specific.
- **Templates & assets:** `layouts/`, `assets/`, `static/`.
- **Routing / headers:** `staticwebapp.config.json` (copied into `public/` on deploy). Validate with `npm run check:swa-config` after edits (SchemaStore schema + required security headers including CSP). Do not use SPA `navigationFallback` → `/index.html`; missing routes must hit `responseOverrides["404"]` → `/404.html`.

## Blog post guardrails

Posts (`content/posts/**/*.md`) use TOML front matter in `+++` fences. CI enforces:

- **`title`:** production HTML `<title>` (`{front matter title} - Funky Si's Blog`) **50–60** characters (inclusive); front matter is usually **32–42**. Hugo appends the site title in `layouts/partials/head/title.html`.
- **`description`:** 110–160 characters (inclusive)

British English (`locale = 'en-gb'`). One top-level Markdown heading per page where that matches site structure. Meaningful images need descriptive alt text.

After bulk-editing post front matter, run **`npm run check:meta`** before opening a PR.

## CI map

| Check | Where | Notes |
|-------|-------|-------|
| Playwright smoke | **GitHub Actions** — `playwright-smoke.yml` on all PRs | Hugo production server in CI; `BASE_URL=http://127.0.0.1:1313`; `@smoke` subset (homepage, 404, sitemap, head SEO meta); under 10 minutes |
| Playwright E2E (full) | **GitHub Actions** — `swa-deploy-nonprod.yml` (blog-dev after dev SWA deploy on **`develop`** / **`feature/*`**) and `playwright.yml` (**`main`** pushes + PRs into **`main`**) | `BASE_URL`: blog-dev for non-prod deploys and for **PRs into `main`** (undeployed UI); production for **`main`** pushes / `workflow_dispatch` |
| Playwright `// spec:` headers | **GitHub Actions** — `spec-headers.yml` (paths under `tests/`); also before E2E in reusable Playwright | Local: `npm run check:spec-headers` |
| SWA config validation | **GitHub Actions** — `swa-config.yml` (paths under `staticwebapp.config.json` / validator) | Local: `npm run check:swa-config`; schema in `scripts/schemas/staticwebapp.config.schema.json` |
| Page coverage / Codecov | GitHub Actions (Playwright workflows) | `scripts/generate-page-coverage.js`; informational per `codecov.yml` |
| Hugo production build | **GitHub Actions** | `hugo-build.yml` — PRs and pushes to `main`/`develop`; catches template/render errors before deploy |
| Meta title / description length | **GitHub Actions** | `meta-title-length.yml` (rendered production `<title>` 50–60), `meta-description-length.yml` |
| Azure SWA deploy | GitHub Actions | `azure-static-web-apps-victorious-pebble-0b8f90e03.yml` (prod), `swa-deploy-nonprod.yml` (dev/test). **blog-dev** (`hugo_environment: development`) adds `--buildFuture` so future-dated posts preview; blog-test and production do not |
| Broken links | GitHub Actions | `link.yml` — monthly + manual; crawls from production homepage |
| Parkrun scrape PR | GitHub Actions | `parkrun-update.yml` — PR to `develop` when scrape succeeds |
| develop → main PR | GitHub Actions | `auto-pr.yml` |
| SEO crawl (Signal Diff) | GitHub Actions | `swa-deploy-nonprod.yml` (blog-dev after deploy) and production SWA workflow; manual `seo-check.yml` |
| Pa11y nightly | GitHub Actions | `pa11y-nightly.yml` — full sitemap on production |
| 30-day issue schedule | GitHub Actions | `issue-schedule.yml` — Mondays 09:00 UTC + manual; [repo-automation](https://github.com/funkysi1701/repo-automation) `@v1`; each week slots ≥1 `[Content Suggestion]` when open |
| Blog post idea | GitHub Actions | `blog-post-idea.yml` — Wednesdays 09:00 UTC + manual; opens one `[Content Suggestion]` issue via GitHub Models |
| Tech debt scan | GitHub Actions | `tech-debt-scan.yml` — Fridays 09:00 UTC + manual; [repo-automation](https://github.com/funkysi1701/repo-automation) `@v1` + [`.github/tech-debt-hotspots.txt`](.github/tech-debt-hotspots.txt) |
| Home popular refresh | GitHub Actions | `home-popular-update.yml` — Mondays 06:30 UTC + manual; Cloudflare Web Analytics top pages → `data/home_popular.toml` PR into `develop` |

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
| [`.cursor/hooks.json`](.cursor/hooks.json) | Cursor post-edit meta validation hooks (trusted workspace) |
| [`.cursor/skills/`](.cursor/skills/) | Cursor project skills (parkrun, meta, Playwright healer, OpenSpec) |
| [`.github/copilot-instructions.md`](.github/copilot-instructions.md) | Copilot-specific project context |
| [`.github/issue-schedule-prompt.md`](.github/issue-schedule-prompt.md) | Prompt for weekly 30-day issue schedule ([repo-automation](https://github.com/funkysi1701/repo-automation)) |
| [`scripts/blog-post-idea/README.md`](scripts/blog-post-idea/README.md) | Weekly blog post idea → content-suggestion issue (GitHub Models) |
| [`.github/tech-debt-prompt.md`](.github/tech-debt-prompt.md) | Prompt for weekly tech-debt scan ([repo-automation](https://github.com/funkysi1701/repo-automation)) |
| [`scripts/home-popular/README.md`](scripts/home-popular/README.md) | Weekly Cloudflare top-pages refresh of the home Popular strip data |
| [`README.md`](README.md) | Human-oriented setup, testing, deploy, and Zaraz analytics inventory |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | PR checklist, branch workflow, merge readiness |
| [`specs/funkysi1701-test-plan.md`](specs/funkysi1701-test-plan.md) | E2E scenario plan (`// spec:` comments in `tests/`) |
| [`.cursor/mcp.json`](.cursor/mcp.json) | Cursor MCP: `@playwright/mcp` (browser/console) + `playwright-test` (test runs) |
| [`.vscode/mcp.json`](.vscode/mcp.json) | VS Code / Copilot Playwright Test MCP (`run-test-mcp-server`) |
