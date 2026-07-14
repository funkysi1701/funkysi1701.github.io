
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

**GitHub Actions:** **`playwright-smoke.yml`** runs the `@smoke` subset on every pull request against a local Hugo production server (`BASE_URL=http://127.0.0.1:1313`). Full Playwright E2E: **`swa-deploy-nonprod.yml`** deploys to blog-dev (and blog-test on **`develop`**) then tests **`https://blog-dev.funkysi1701.com`**; **`playwright.yml`** runs on **`main`** pushes and PRs into **`main`** against production. After full-suite runs, **`scripts/generate-page-coverage.js`** can feed **Codecov** when `CODECOV_TOKEN` is configured. **`codecov.yml`** marks **page coverage** as **informational**.

**GitHub Actions** (`.github/workflows/`) runs a **Hugo production build** on pull requests (`hugo-build.yml`) and checks such as **meta title** (50–60 characters) and **meta description** (110–160 characters) for `content/posts/**/*.md`. Run the same checks locally after editing post front matter:

```sh
npm run check:meta              # titles + descriptions
npm run check:meta:titles       # titles only
npm run check:meta:descriptions # descriptions only
npm run check:meta:fix          # preview description rewrites (--dry-run)
```

To apply description fixes (write files), run `python scripts/normalize_meta_descriptions.py --root .` (without `--dry-run`). Requires Python 3.11+ on `PATH` (same as the GitHub Actions meta workflows).

**30-day issue schedule:** Mondays (and manual) **`issue-schedule.yml`** reviews open GitHub issues via GitHub Models and upserts a tracking issue titled **30-day implementation schedule**. See [`scripts/issue-schedule/README.md`](scripts/issue-schedule/README.md).

**Blog post idea:** Wednesdays (and manual) **`blog-post-idea.yml`** catalogues published posts, asks GitHub Models for one trend-aware idea, and opens a **`[Content Suggestion]`** issue. See [`scripts/blog-post-idea/README.md`](scripts/blog-post-idea/README.md).

**Tech debt scan:** Fridays (and manual) **`tech-debt-scan.yml`** gathers codebase signals (hotspots, large files, TODO/FIXME markers), asks GitHub Models which new issues are warranted, and opens **`tech-debt`** issues. See [`scripts/tech-debt-scan/README.md`](scripts/tech-debt-scan/README.md).

For Hugo changes, still verify with `hugo server -D` or a production build (`hugo --minify --environment production`) as needed.
When updating templates, prefer Hugo's canonical date values (`.Date` / `.PublishDate`) instead of gating rendering on `\.Params.date`; this avoids date regressions across Hugo upgrades.

### Parkrun results (`content/parkrun.md`)

Official parkrun 5k tables and the progress chart are **generated** by `scripts/update_parkrun_results.py`, which reads each course’s parkrunner page under [parkrun.org.uk](https://www.parkrun.org.uk/). Non-parkrun races and manual notes live **outside** the `<!-- BEGIN PARKRUN_GENERATED -->` … `<!-- END PARKRUN_GENERATED -->` block.

```sh
pip install -r scripts/requirements-parkrun.txt
python scripts/update_parkrun_results.py
```

Optional environment variables: `PARKRUN_ID` (default `11453050`), `PARKRUN_BASE` (default `https://www.parkrun.org.uk`), `PARKRUN_STRICT` (fail instead of skip when parkrun blocks the runner). To omit a scraped row that you disagree with (for example a DNF), add an entry to `data/parkrun_suppress.json`. You can refresh results manually from GitHub Actions via **Update parkrun results** (`.github/workflows/parkrun-update.yml`); it opens a pull request into **develop** when the scrape succeeds. parkrun.org.uk often returns HTTP 403/405 to GitHub-hosted IPs—the workflow then exits successfully with a skip notice; run the script locally and commit, or use a self-hosted runner.

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

