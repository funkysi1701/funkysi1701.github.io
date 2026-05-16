# Copilot Instructions for funkysi1701.com Blog

## Project Overview

This is a personal blog/portfolio website powered by **Hugo** (static site generator), hosted on Azure Static Web Apps with infrastructure managed through **Kubernetes + Helm**. The site features blog posts, projects, podcasts, and technical content, primarily focused on .NET, Azure, and DevOps topics.

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

- **main:** Production — Azure Pipelines → ECR → Kubernetes `main` namespace; GitHub Actions also builds Hugo and deploys Azure Static Web Apps
- **develop:** Non-prod — Azure Pipelines → ECR → Helm upgrades **both** Kubernetes namespaces `develop` and `test` (same image tag; URLs include blog-dev and blog-test)
- **feature/\*:** Azure Pipelines build and push image; Helm targets the `develop` namespace only (not `test`)

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
| `Helm/blog/` | Kubernetes Helm charts for multi-environment deployments |
| `.github/workflows/` | GitHub Actions (Azure Static Web Apps deploy, meta title/description checks, scheduled link check, develop→main auto-PR, etc.) |
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

- **Azure Static Web Apps** – Primary hosting (GitHub Actions CD)
- **Kubernetes + Helm** – Secondary infrastructure for multi-environment deployments
- **Amazon ECR** – Docker image registry (used by Azure Pipelines)
- **Azure Pipelines** – CI/CD orchestration (builds Docker images, pushes to ECR, deploys via Helm)

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

4. **Multi-environment deployment:** When modifying infrastructure or deployment, consider all three Kubernetes namespaces (develop, test, main) defined in `Helm/blog/`.

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

**Azure DevOps:** Pipeline **`azure-pipelines-playwright.yml`** runs `npx playwright test` on PRs and branch pushes. It chooses **`BASE_URL`** from the effective target branch: **`main`** or **`master`** → production; **`develop`** → **`https://blog-dev.funkysi1701.com`**; otherwise production. The pipeline runs **`scripts/generate-page-coverage.js`** and can upload **page coverage** to **Codecov** when **`CODECOV_TOKEN`** is set. **`codecov.yml`** configures Codecov **project/patch** status as **informational** (synthetic Markdown visit coverage is volatile); adjust there or in the Codecov UI if you want failing checks on coverage drops.

**GitHub Actions:** Workflows under **`.github/workflows/`** include **meta title** and **meta description** length validation for blog posts (`scripts/check_meta_titles.py`, `scripts/check_meta_descriptions.py`), plus other jobs (Azure SWA deploy, broken link schedule, develop→main auto-PR, etc.). Playwright is **not** currently duplicated there; treat **Azure Pipelines** as the primary full E2E gate unless a GitHub workflow is added later.

**Specs:** High-level scenarios are documented in **`specs/`** (see **`specs/funkysi1701-test-plan.md`**). Individual test files often start with a `// spec: specs/...` pointer for traceability.

For Hugo-only edits, **`hugo server -D`** or a production **`hugo`** build remains useful for quick feedback before or after running tests.

## Useful File References

- `.env` – Hugo version (affects all builds)
- `config/_default/config.toml` – Main site title, menu, author info
- `config/production/config.toml` – Production baseURL and analytics
- `playwright.config.ts` – Playwright defaults (`baseURL`, reporters, projects)
- `azure-pipelines.yml` – CI/CD pipeline (build, ECR push, Helm deploy)
- `azure-pipelines-playwright.yml` – Playwright test job and Codecov page coverage
- `codecov.yml` – Codecov behaviour (informational page-coverage gates)
- `scripts/check_meta_titles.py` / `scripts/check_meta_descriptions.py` – Post front matter length checks (used by GitHub Actions)
- `scripts/generate-page-coverage.js` – Page visit / coverage artifact for Codecov
- `.github/workflows/` – GitHub Actions (SWA deploy, meta checks, links, auto-PR, etc.)
- `specs/` – Test plans referenced from `tests/`
- `Helm/blog/` – Kubernetes deployment configuration

