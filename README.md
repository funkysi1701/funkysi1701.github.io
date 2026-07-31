
# funkysi1701.com – Blog Powered by Hugo

This repository contains the source for [funkysi1701.com](https://www.funkysi1701.com?utm_source=gh), hosted on Azure Static Web Apps.

## 🚀 Getting Started


### Prerequisites

- [Hugo](https://gohugo.io/) must be installed.

### Local Development

Run locally with Hugo:

```sh
hugo server -D
```

#### Docker/Compose Setup

The Hugo version is set in the `.env` file as `HUGO_VERSION`. Update this file to change the version everywhere.

To run with Docker Compose:

```sh
docker-compose up
```

To run with Docker directly:

```sh
docker run --rm -it -v .:/src -p 1313:1313 floryn90/hugo:${HUGO_VERSION} server -D --disableFastRender --environment development
```

## 🤖 AI-assisted development

Agents and coding assistants should start with **[`AGENTS.md`](AGENTS.md)** — a concise, tool-agnostic onboarding guide (build commands, guardrails, CI map, branch model). Deeper context lives in [`.cursor/rules/`](.cursor/rules/) (Cursor — always-applied core plus path-scoped rules for content, tests, layouts, and parkrun) and [`.github/copilot-instructions.md`](.github/copilot-instructions.md) (Copilot).

**Cursor:** [`.cursorignore`](.cursorignore) excludes Hugo build output, `node_modules/`, the vendored theme, and test artefacts from agent indexing; site overrides live in root `layouts/`, `assets/`, and `static/`. Recurring maintenance workflows are packaged as project skills under [`.cursor/skills/`](.cursor/skills/) — notably [`update-parkrun`](.cursor/skills/update-parkrun/SKILL.md), [`fix-post-meta`](.cursor/skills/fix-post-meta/SKILL.md), and [`playwright-test-healer`](.cursor/skills/playwright-test-healer/SKILL.md) (see [`AGENTS.md`](AGENTS.md#cursor-context)).

## 🧪 Testing

End-to-end tests use **[Playwright](https://playwright.dev/)** (`@playwright/test`). Playwright tests (spec files) live under `tests/`; many files reference the high-level plan in **`specs/funkysi1701-test-plan.md`** (see `specs/README.md`).

```sh
npm ci
npx playwright install chromium
npm test                 # full suite
npm run test:smoke       # @smoke subset (homepage, 404, sitemap)
```

By default, `playwright.config.ts` uses **`BASE_URL`** of `https://www.funkysi1701.com` when unset. For local or staging targets, set the variable (PowerShell: `$env:BASE_URL="http://localhost:1313"; npm test`).

**Config knobs** (optional env vars; defaults match today’s CI-safe behaviour — 1 worker and 2 retries when `CI` is set):

| Variable | Purpose |
|----------|---------|
| `BASE_URL` | Site under test |
| `PLAYWRIGHT_WORKERS` | Parallel workers (CI default `1`; local = Playwright auto) |
| `PLAYWRIGHT_RETRIES` | Retries per failed test (CI default `2`; local `0`) |
| `PLAYWRIGHT_TIMEOUT` | Per-test timeout in ms (default `30000`) |
| `PLAYWRIGHT_EXPECT_TIMEOUT` | `expect()` timeout in ms (default `5000`) |
| `PLAYWRIGHT_NAVIGATION_TIMEOUT` | Navigation timeout in ms (optional) |
| `PLAYWRIGHT_ACTION_TIMEOUT` | Action timeout in ms (optional) |
| `PLAYWRIGHT_MAX_FAILURES` | Fail-fast after N failures (`0` = no limit) |

Example (faster local run against Hugo): `$env:BASE_URL="http://localhost:1313"; $env:PLAYWRIGHT_WORKERS="4"; npm test`.

**GitHub Actions:** **`playwright-smoke.yml`** runs the `@smoke` subset on every pull request against a local Hugo production server (`BASE_URL=http://127.0.0.1:1313`). Full Playwright E2E: **`swa-deploy-nonprod.yml`** deploys to blog-dev (and blog-test on **`develop`**) then tests **`https://blog-dev.funkysi1701.com`**; **`playwright.yml`** runs PRs into **`main`** against blog-dev and **`main`** pushes against production. After full-suite runs, **`scripts/generate-page-coverage.js`** can feed **Codecov** when `CODECOV_TOKEN` is configured. **`codecov.yml`** marks **page coverage** as **informational**.

**GitHub Actions** (`.github/workflows/`) runs a **Hugo production build** on pull requests (`hugo-build.yml`) and checks such as **meta title** (50–60 characters) and **meta description** (110–160 characters) for `content/posts/**/*.md`. Run the same checks locally after editing post front matter:

```sh
npm run check:meta              # titles + descriptions
npm run check:meta:titles       # titles only
npm run check:meta:descriptions # descriptions only
npm run check:meta:fix          # preview description rewrites (--dry-run)
```

**Azure Static Web Apps config:** After editing `staticwebapp.config.json` (routing, 404 rewrite, security headers), run `npm run check:swa-config`. CI runs the same check via `swa-config.yml` (SchemaStore schema plus required HSTS / frame / MIME / referrer / permissions / CSP headers). This is a multi-page Hugo site: do **not** add a `navigationFallback` to `/index.html` (that causes soft-404s). Missing pages use `responseOverrides["404"]` → `/404.html`. The CSP allowlists Hugo assets plus Giscus (`script`/`frame`/`style`/`font`/`connect` — client injects `giscus.app/default.css` into the parent page), Twitter/X widgets, Font Awesome, jQuery, Zaraz-injected Lite Analytics and Ahrefs Analytics, Cloudflare Insights, optional ads remnants, and common post embeds (YouTube, Stripe); tighten further only after checking browser CSP reports on blog-dev.

To apply description fixes (write files), run `python scripts/normalize_meta_descriptions.py --root .` (without `--dry-run`). Requires Python 3.11+ on `PATH` (same as the GitHub Actions meta workflows).

**30-day issue schedule:** Mondays (and manual) **`issue-schedule.yml`** reviews open GitHub issues via GitHub Models and upserts a tracking issue titled **30-day implementation schedule**, including at least one **`[Content Suggestion]`** per week when open. See [`scripts/issue-schedule/README.md`](scripts/issue-schedule/README.md).

**Blog post idea:** Wednesdays (and manual) **`blog-post-idea.yml`** catalogues published posts, asks GitHub Models for one trend-aware idea, and opens a **`[Content Suggestion]`** issue. See [`scripts/blog-post-idea/README.md`](scripts/blog-post-idea/README.md).

**Tech debt scan:** Fridays (and manual) **`tech-debt-scan.yml`** gathers codebase signals (hotspots, large files, TODO/FIXME markers), asks GitHub Models which new issues are warranted, and opens **`tech-debt`** issues. See [`scripts/tech-debt-scan/README.md`](scripts/tech-debt-scan/README.md).

**Home popular links:** Mondays (and manual) **`home-popular-update.yml`** queries Cloudflare Web Analytics for the site's top pages, rewrites [`data/home_popular.toml`](data/home_popular.toml) (drives the home **Popular right now** strip), and opens a pull request into **develop** when the list changes. See [`scripts/home-popular/README.md`](scripts/home-popular/README.md).

For Hugo changes, still verify with `hugo server -D` or a production build (`hugo --minify --environment production`) as needed.
When updating templates, prefer Hugo's canonical date values (`.Date` / `.PublishDate`) instead of gating rendering on `\.Params.date`; this avoids date regressions across Hugo upgrades.

### Parkrun results (`content/parkrun.md`)

Official parkrun 5k tables and the progress chart are **generated** by `scripts/update_parkrun_results.py`, which reads each course’s parkrunner page under [parkrun.org.uk](https://www.parkrun.org.uk/). Non-parkrun races and manual notes live **outside** the `<!-- BEGIN PARKRUN_GENERATED -->` … `<!-- END PARKRUN_GENERATED -->` block.

```sh
pip install -r scripts/requirements-parkrun.txt
python scripts/update_parkrun_results.py
```

Optional environment variables: `PARKRUN_ID` (default `11453050`), `PARKRUN_BASE` (default `https://www.parkrun.org.uk`), `PARKRUN_STRICT` (fail instead of skip when parkrun blocks the runner). To omit a scraped row that you disagree with (for example a DNF), add an entry to `data/parkrun_suppress.json`. You can refresh results manually from GitHub Actions via **Update parkrun results** (`.github/workflows/parkrun-update.yml`); it opens a pull request into **develop** when the scrape succeeds. parkrun.org.uk often returns HTTP 403/405 to GitHub-hosted IPs—the workflow then exits successfully with a skip notice; run the script locally and commit, or use a self-hosted runner.

## 🧩 Head partial structure

`layouts/partials/head.html` is a thin orchestrator (charset, viewport, and `<title>` stay in `layouts/_default/baseof.html`). Put new `<head>` / SEO concerns in a focused partial under `layouts/partials/head/` and call it from the orchestrator — do not grow `head.html` with inline markup.

| Partial | Responsibility |
|---------|----------------|
| `head/meta-tags.html` | Keywords, meta description (list pages via `head/list-page-description.html`), fediverse creator |
| `head/seo.html` | Social preview meta — Open Graph and Twitter cards (Hugo internal templates) |
| `head/canonical.html` | Canonical URL (paginator-aware on list pages) |
| `head/meta/robots.html` | Robots meta (paginated lists via `params.listPaginationMetaRobots`) — invoked through theme `head/meta` |
| `head/site-verification.html` | Search engine site-verification meta (home page only) |
| `head/search-index.html` | Search page `index.json` pointer (`data-name="search-index"`) |
| `head/structured-data.html` | JSON-LD — WebSite (home), BlogPosting (`head/schema-blog-posting.html`), CollectionPage (`head/schema-collection-page.html`) |
| `head/title.html` | Document `<title>` (called from `baseof.html`, not `head.html`) |
| Theme partials (`head/favicons`, `head/meta`, `head/feed`, `head/assets`) | Favicons, robots entrypoint, RSS links, CSS assets from `themes/hugo-theme-bootstrap/` |

Analytics does not live in the head: the theme's `body-end.html` injects the site overrides `layouts/partials/assets/google-analytics.html` and `layouts/partials/assets/google-adsense.html` at the end of `<body>`. Hugo `services.googleAnalytics.id` is empty and Gatekeeper/Ezoic are off — production visitor analytics are injected by **Cloudflare Zaraz** / Cloudflare Web Insights, not by Hugo templates. See **Analytics (Cloudflare Zaraz)** below.

### Analytics (Cloudflare Zaraz)

Inventory for `funkysi1701.com` (verified from live Zaraz `s.js` / page HTML, July 2026). Configure tools in the Cloudflare dashboard → Zaraz; do **not** also embed `lite.js` in Hugo while Zaraz injects it.

| Tool / trigger | How it loads | Decision | Role |
|----------------|--------------|----------|------|
| **Lite Analytics** | Zaraz custom HTML → `https://liteanalytics.com/lite.js` (`data-host=funkysi1701.com`) | **Keep** (intentional) | **Source of truth** for bounce rate and 2+ page depth engagement KPIs |
| **Ahrefs Analytics** | Zaraz → `https://analytics.ahrefs.com/analytics.js` | **Keep** | SEO / referral insights; not used for bounce/depth KPIs |
| **Cloudflare Web Insights** | Edge beacon (`static.cloudflareinsights.com`, `data-cf-beacon`) — not a Zaraz tool | **Keep** | RUM; drives weekly home Popular strip (`scripts/home-popular/`) |
| **Zaraz Pageview** | Built-in Zaraz trigger on load / SPA navigation | **Keep** | Fires configured Zaraz tools |
| **Google Analytics 4** (`G-N1YJNQEHR4`) + DoubleClick `g/collect` / `ga-audiences` | Zaraz GA4 tool (`google-analytics_v4_*`) | **Disable in Zaraz** | Unexpected — Hugo GA is off; DoubleClick collect is not needed for engagement KPIs |
| Hugo GA / Gatekeeper / Ezoic | Site templates + `config/` | **Off** | Leave off |

**Soft-track:** Lite pages/session ≈ 0.96 is a known quirk. Do **not** optimise that metric directly; use bounce rate and 2+ page depth instead.

**CSP:** `staticwebapp.config.json` allowlists `liteanalytics.com` and `analytics.ahrefs.com` for `script-src` / `connect-src` so Zaraz-injected tools are not blocked. Cloudflare Insights was already allowlisted.

**Dashboard follow-up (cannot be done from this repo):** In Cloudflare Zaraz for `funkysi1701.com`, disable the GA4 tool (and confirm DoubleClick/`ga-audiences` stops firing). Re-check the network tab after publish.

## 🚢 Deployment and branches

- **`main`:** Production ([funkysi1701.com](https://www.funkysi1701.com?utm_source=gh)). GitHub Actions builds Hugo and deploys **Azure Static Web Apps** (`.github/workflows/azure-static-web-apps-victorious-pebble-0b8f90e03.yml`).
- **`develop`:** Integration branch. GitHub Actions deploys to **SWA dev and test** (`swa-deploy-nonprod.yml` → blog-dev / blog-test). blog-dev Hugo builds include `--buildFuture` (future-dated posts preview there); blog-test and production do not. **`.github/workflows/auto-pr.yml`** can open or refresh a **develop → main** pull request when `develop` is pushed.
- **`feature/*`:** Feature branches; GitHub Actions deploys to **SWA dev** only (`swa-deploy-nonprod.yml`).

There is no separate branch named `dev`; use **`develop`** for integration work.

**Before first non-prod deploy:** create dev and test SWA resources in Azure, add GitHub secrets `AZURE_STATIC_WEB_APPS_API_TOKEN_BLOG_DEV` and `AZURE_STATIC_WEB_APPS_API_TOKEN_BLOG_TEST`, and configure GitHub Environments `Dev`, `Test`, and `Prod` (optional approval on `Prod`).

## 🛠 Built With

- [Hugo](https://gohugo.io/) – Static site generator

## 🤝 Contributing

Open to suggestions and improvements. See **[`CONTRIBUTING.md`](CONTRIBUTING.md)** for the PR checklist, branch workflow, and AI-assisted contribution notes.

## 👤 Author

- **Simon Foster** ([funkysi1701](https://github.com/funkysi1701))

See [contributors](https://github.com/funkysi1701/funkysi1701.github.io/contributors) for more.

## 🙏 Acknowledgments

Thanks to other bloggers and the open-source community.

---

[![Azure Static Web Apps CI/CD](https://github.com/funkysi1701/funkysi1701.github.io/actions/workflows/azure-static-web-apps-victorious-pebble-0b8f90e03.yml/badge.svg)](https://github.com/funkysi1701/funkysi1701.github.io/actions/workflows/azure-static-web-apps-victorious-pebble-0b8f90e03.yml)
[![pages-build-deployment](https://github.com/funkysi1701/funkysi1701.github.io/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/funkysi1701/funkysi1701.github.io/actions/workflows/pages/pages-build-deployment)

