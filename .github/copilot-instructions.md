# Copilot Instructions for funkysi1701.com Blog

For a shorter, tool-agnostic onboarding guide, see **[`AGENTS.md`](../AGENTS.md)** at the repo root. PR checklist and merge readiness: **[`CONTRIBUTING.md`](../CONTRIBUTING.md)**. This file adds Copilot-specific detail. Cursor rules are path-scoped under **[`.cursor/rules/`](../.cursor/rules/)** — always-applied core in **`funkysi1701-blog-core.mdc`**, plus **`content-posts.mdc`**, **`playwright-tests.mdc`**, **`hugo-layouts.mdc`**, and **`parkrun-generated.mdc`**. Cursor project skills for recurring tasks live under **[`.cursor/skills/`](../.cursor/skills/)** (parkrun update, post meta fix, Playwright healer); see **`AGENTS.md`**.

## Project Overview

This is a personal blog/portfolio website powered by **Hugo** (static site generator), hosted on **Azure Static Web Apps** (prod, dev, and test) via GitHub Actions. The site features blog posts, projects, podcasts, and technical content, primarily focused on .NET, Azure, and DevOps topics.

**Key URL:** https://www.funkysi1701.com

## Build & Development Commands

### Local Development (Hugo)

```bash
# Start Hugo dev server with draft posts visible
hugo server -D
# Runs on http://localhost:1313

# Build static site for production
hugo
```

### Docker Development

```bash
# Run in Docker Compose (uses .env for HUGO_VERSION)
docker-compose up

# Or run Docker directly
docker run --rm -it -v .:/src -p 1313:1313 floryn90/hugo:${HUGO_VERSION} server -D --disableFastRender --environment development
```

### Deployment Pipeline

- **main:** Production — GitHub Actions → Azure SWA (`www.funkysi1701.com`; `azure-static-web-apps-victorious-pebble-0b8f90e03.yml`)
- **develop:** Non-prod — GitHub Actions → SWA dev + test (`swa-deploy-nonprod.yml`; blog-dev and blog-test)
- **feature/\*:** GitHub Actions → SWA dev only (`swa-deploy-nonprod.yml`)

Non-prod SWA deploy tokens: GitHub secrets `AZURE_STATIC_WEB_APPS_API_TOKEN_BLOG_DEV` and `AZURE_STATIC_WEB_APPS_API_TOKEN_BLOG_TEST`. Optional GitHub Environments: `Dev`, `Test`, `Prod`.

There is no separate git branch named `dev`; use **`develop`** for integration.

## Content Conventions

### Parkrun page (`content/parkrun.md`)

Official parkrun 5k results and the bar chart are produced by `scripts/update_parkrun_results.py` and written between HTML markers `<!-- BEGIN PARKRUN_GENERATED -->` and `<!-- END PARKRUN_GENERATED -->`. Do not hand-edit that block; run the script after `pip install -r scripts/requirements-parkrun.txt`. Other races, walks, and explanatory notes are edited manually in the same file (below the markers). Optional row exclusions: `data/parkrun_suppress.json`. Scheduled or manual **Update parkrun results** (`.github/workflows/parkrun-update.yml`) opens a **pull request into `develop`** when the scrape succeeds (it does not push to protected `develop` directly); merge the PR to apply the update. parkrun.org.uk often blocks GitHub-hosted runner IPs (HTTP 403/405); the workflow then succeeds with a skip notice—run `python scripts/update_parkrun_results.py` locally and commit, or use a self-hosted runner.

### Blog Post Structure

Blog posts use **TOML frontmatter** and are organized by year:

```
content/posts/YYYY/post-title.md
```

**Required frontmatter fields:**
- `title` – Post title
- `date` – Publication date (ISO 8601, e.g., "2026-01-31T15:46:00Z")
- `year` – Year as string (e.g., "2026")
- `month` – Year-month for grouping (e.g., "2026-01")
- `author` – Usually "funkysi1701"
- `authorTwitter` – Twitter handle without @
- `tags` – Array of tags
- `categories` – Array of categories (e.g., ["tech"])
- `description` – SEO description should be between 110 and 160 characters
- `draft` – Boolean (set to `false` to publish)

**Optional fields:**
- `cover` – Path to cover image (e.g., "/images/cover.jpg")
- `images` – Array of image paths used in post
- `aliases` – Array of alternate URL paths for SEO/redirects
- `featured` – Boolean (for homepage featuring)
- `showFullContent` – Boolean
- `readingTime` – Boolean
- `copyright` – Boolean

**Example:**
```toml
+++
title = "My Post Title"
date = "2026-01-31T15:46:00Z"
year = "2026"
month = "2026-01"
author = "funkysi1701"
authorTwitter = "funkysi1701"
cover = "/images/my-cover.jpg"
images = ["/images/my-cover.jpg"]
tags = ["Tag1", "Tag2"]
categories = ["tech"]
description = "A short description for SEO"
draft = true
aliases = [
    "/my-post-title",
    "/posts/my-post-title",
    "/posts/2026/01/31/my-post-title",
    "/2026/01/31/my-post-title"
]
+++

Post content in Markdown...
```

### Page Structure

Other pages (about, projects, etc.) are in `content/` root using Markdown format:
- `content/about.md`
- `content/projects.md`
- `content/contact.md`
- etc.

## High-Level Architecture

### Directory Organization

| Directory | Purpose |
|-----------|---------|
| `content/posts/` | Blog posts organized by year |
| `content/` | Pages (about, projects, contact, etc.) |
| `layouts/` | Hugo page templates and partials |
| `assets/` | CSS (SCSS/PostCSS) and JavaScript source |
| `static/images/` | Images, downloads, and media files |
| `themes/hugo-theme-bootstrap/` | Bootstrap-based theme |
| `config/` | Hugo configuration for dev/staging/production environments |
| `.github/workflows/` | GitHub Actions (SWA deploy prod/non-prod, Playwright, Pa11y, meta checks, SEO, links, auto-PR, etc.) |
| `tests/` | Playwright end-to-end tests (`@playwright/test`) |
| `specs/` | Test plans; e.g. `funkysi1701-test-plan.md` referenced from many specs via `// spec: ...` comments |

### Frontend Stack

- **Hugo** – Static site generation
- **Bootstrap 5.3.2** – CSS framework
- **FontAwesome 7** – Icon library
- **Algolia DocSearch** – Site search
- **Mermaid** – Diagram rendering
- **KaTeX** – Math/formula rendering
- **Workbox** – Service worker caching (PWA support)

### Backend/Infrastructure

- **Azure Static Web Apps** – Hosting for production, dev, and test (GitHub Actions CD)
- **GitHub Actions** – Hugo build, SWA deploy, Playwright E2E, Pa11y, meta validation, SEO crawl

### Environment Configuration

Hugo uses environment-specific configs in `config/`:
- `config/_default/config.toml` – Base configuration
- `config/development/config.toml` – Local dev overrides
- `config/staging/config.toml` – Staging overrides
- `config/production/config.toml` – Production overrides (includes CDN, analytics, monetization)

**Note:** Hugo version is centralized in `.env` file and used by Docker builds for consistency.

## Key Conventions

1. **Blog post URLs:** Follow year-based organization in both filesystem (`content/posts/2026/`) and URLs (`/2026/01/31/post-title`). The `aliases` field provides backward compatibility for old URL formats.

2. **Images location:** Store in `static/images/`, reference as `/images/filename.jpg` in content.

3. **Environment-specific settings:** Never hardcode configuration. Use `config/` structure:
   - Development: Local testing, no analytics
   - Staging: Testing environment
   - Production: Full analytics, CDN caching, Google AdSense

4. **Multi-environment deployment:** SWA deploys use Hugo `--environment` values `production`, `development`, and `staging` from `config/` overlays. Workflows: `azure-static-web-apps-victorious-pebble-0b8f90e03.yml` (prod), `swa-deploy-nonprod.yml` (dev/test).

5. **Docker version control:** Keep `.env` file updated with correct `HUGO_VERSION` to ensure consistency across local, pipeline, and container environments.

6. **Comments system:** Uses Giscus (GitHub discussions-backed), configured in base config. Comments are stored in the `Blog-Comments` repository.

## Testing

The repo uses **Playwright** for automated end-to-end tests.

**Local (and any environment without Azure DevOps):**

```bash
npm ci
npx playwright install chromium   # if browsers are not already present
npm test
```

`playwright.config.ts` sets `baseURL` from **`BASE_URL`**; if unset, it defaults to **`https://www.funkysi1701.com`**. Point `BASE_URL` at `http://localhost:1313` (or another host) when testing a local or preview build.

**GitHub Actions:** **`swa-deploy-nonprod.yml`** deploys to blog-dev (and blog-test on **`develop`**) then runs Playwright with **`BASE_URL=https://blog-dev.funkysi1701.com`**. **`playwright.yml`** runs on **`main`** pushes and PRs into **`main`** with production **`BASE_URL`**. Workflows run **`scripts/generate-page-coverage.js`** and upload to **Codecov** when **`CODECOV_TOKEN`** is set. **`codecov.yml`** configures Codecov **project/patch** status as **informational**.

**GitHub Actions (other):** **`hugo-build.yml`** (PR build validation), meta title/description checks, **`pa11y-nightly.yml`**, production SWA deploy, broken link schedule, develop→main auto-PR, parkrun update PRs, **`issue-schedule.yml`** (weekly 30-day issue planner → tracking issue), **`blog-post-idea.yml`** (weekly content suggestion issue), **`tech-debt-scan.yml`** (weekly tech-debt issues).

**Meta validation (post front matter):** After editing `title` or `description` in `content/posts/**/*.md`, run **`npm run check:meta`** (wraps the Python scripts used by GitHub Actions). Subcommands: **`check:meta:titles`**, **`check:meta:descriptions`**. To preview automated description rewrites: **`npm run check:meta:fix`** (dry-run only). Apply fixes with `python scripts/normalize_meta_descriptions.py --root .`. Requires Python 3.11+ on `PATH`.

**Specs:** High-level scenarios are documented in **`specs/`** (see **`specs/funkysi1701-test-plan.md`**). Individual test files often start with a `// spec: specs/...` pointer for traceability.

For Hugo-only edits, **`hugo server -D`** or a production **`hugo`** build remains useful for quick feedback before or after running tests.

## Useful File References

- `.cursor/rules/` – Cursor agent rules (`funkysi1701-blog-core.mdc` always applied; `content-posts.mdc`, `playwright-tests.mdc`, `hugo-layouts.mdc`, `parkrun-generated.mdc` path-scoped)
- `.cursor/skills/` – Cursor project skills (`update-parkrun`, `fix-post-meta`, `playwright-test-healer`, OpenSpec flows)
- `.env` – Hugo version (affects all builds)
- `config/_default/config.toml` – Main site title, menu, author info
- `config/production/config.toml` – Production baseURL and analytics
- `playwright.config.ts` – Playwright defaults (`baseURL`, reporters, projects)
- `swa-deploy-nonprod.yml` – SWA dev/test deploy + blog-dev Playwright + SEO
- `playwright.yml` – Production Playwright E2E (`main` pushes and PRs into `main`)
- `pa11y-nightly.yml` – Scheduled full-sitemap accessibility scan
- `issue-schedule.yml` – Weekly LLM planner: open issues → **30-day implementation schedule** tracking issue (`scripts/issue-schedule/`)
- `blog-post-idea.yml` – Weekly LLM: catalogue posts + trends → one `[Content Suggestion]` issue (`scripts/blog-post-idea/`)
- `tech-debt-scan.yml` – Weekly LLM: codebase signals → `tech-debt` issues (`scripts/tech-debt-scan/`)
- `codecov.yml` – Codecov behaviour (informational page-coverage gates)
- `npm run check:meta` – Local meta validation (titles + descriptions); see also `check:meta:titles`, `check:meta:descriptions`, `check:meta:fix`
- `scripts/check_meta_titles.py` / `scripts/check_meta_descriptions.py` – Post front matter length checks (used by GitHub Actions and npm scripts)
- `scripts/generate-page-coverage.js` – Page visit / coverage artifact for Codecov
- `.github/workflows/` – GitHub Actions (SWA deploy, Playwright, Pa11y, meta checks, links, auto-PR, etc.)
- `specs/` – Test plans referenced from `tests/`

