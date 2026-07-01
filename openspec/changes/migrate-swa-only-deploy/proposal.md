## Why

Production already deploys via Azure Static Web Apps (SWA) from GitHub Actions, but non-production and a parallel production host still run on Kubernetes (Docker → ECR → Helm → `hugo server` at runtime). That split adds operational cost, duplicates hosting paths, and blocks consolidating CI on GitHub Actions because `blog-dev` is only reliably reachable from the self-hosted Azure Pipelines agent. Migrating all environments to pre-built static SWA deploys simplifies the stack and aligns with how Hugo blogs should be hosted.

## What Changes

- Add GitHub Actions workflows to deploy **Dev** and **Test** SWA environments (`blog-dev.funkysi1701.com`, `blog-test.funkysi1701.com`) with Hugo `--environment development` / `staging` pre-builds (same pattern as production).
- Extend production SWA workflow only as needed (shared build steps, environments, branch gates).
- Move **Playwright E2E**, **Signal Diff SEO check**, and **nightly Pa11y** from Azure Pipelines to GitHub Actions, triggered after SWA deploys (or on schedule for Pa11y).
- **BREAKING:** Remove Kubernetes/Helm deploy steps from `azure-pipelines.yml`; retire or delete `azure-pipelines-playwright.yml`.
- **BREAKING:** Decommission AKS blog workloads (namespaces `develop`, `test`, `main`), ECR image push, and related Azure DevOps secrets/connections after DNS cutover.
- Remove repo artefacts tied to K8s hosting: `Helm/blog/`, runtime `Dockerfile`, and K8s-specific pipeline steps.
- Update `AGENTS.md`, `README.md`, `CONTRIBUTING.md`, `.github/copilot-instructions.md`, and `.cursor/rules/funkysi1701-blog-core.mdc` to describe SWA-only deploy and GHA-centric CI.

## Capabilities

### New Capabilities

- `swa-multi-environment-deploy`: Branch-gated SWA deploys for prod, dev, and test with Hugo environment-specific pre-builds, `staticwebapp.config.json` copy, and custom-domain targets.
- `github-actions-ci-consolidation`: Playwright E2E, page coverage, Signal Diff SEO crawl, and nightly Pa11y run on GitHub Actions with post-deploy orchestration instead of Azure Pipelines + `repository_dispatch`.

### Modified Capabilities

<!-- No existing openspec/specs/ capabilities in this repo yet. -->

## Impact

- **GitHub Actions:** New or extended workflows under `.github/workflows/`; new secrets for dev/test SWA deploy tokens; `seo-check.yml` trigger changes; possible reusable workflow for Hugo build + SWA upload.
- **Azure Pipelines:** `azure-pipelines.yml` gutted or removed; `azure-pipelines-playwright.yml` removed.
- **Azure / AWS infra (manual):** **Create** new dev and test SWA resources; repoint DNS for `blog-dev` / `blog-test`; uninstall blog Helm releases only (AKS cluster retained for other workloads); remove blog ECR images; drop AWS/K8s DevOps connections only if unused by other pipelines.
- **Tests:** `BASE_URL` targets unchanged (`www`, `blog-dev`); `reporters/page-visit-tracker.ts` should include `blog-dev.funkysi1701.com`.
- **Config:** `config/development/`, `config/staging/`, `config/production/` remain the Hugo environment source of truth; no content changes required.
- **Removed paths:** `Helm/blog/`, `Dockerfile` (runtime server image).
