## 1. Inventory and Azure setup

- [x] 1.1 Confirm `www.funkysi1701.com` is served by SWA (check response headers / `x-ms-request-id`)
- [ ] 1.2 Create new **dev** and **test** Azure Static Web Apps in Azure portal (2022 resources no longer exist; free tier)
- [ ] 1.3 Copy deploy tokens from new SWA resources into GitHub (see task 1.5)
- [ ] 1.4 Add custom domains `blog-dev.funkysi1701.com` and `blog-test.funkysi1701.com` to dev/test SWA (validation tokens ready; DNS change deferred to phase 4)
- [ ] 1.5 Add GitHub secrets `AZURE_STATIC_WEB_APPS_API_TOKEN_BLOG_DEV` and `AZURE_STATIC_WEB_APPS_API_TOKEN_BLOG_TEST`
- [x] 1.6 Document current DNS targets for `blog-dev` / `blog-test` before cutover

## 2. SWA deploy workflows (GitHub Actions)

- [x] 2.1 Create reusable workflow or composite pattern for Hugo pre-build + `staticwebapp.config.json` copy (parameter: `--environment`)
- [x] 2.2 Add dev SWA deploy workflow: trigger on `push` to `develop` and `feature/*`, build with `--environment development`
- [x] 2.3 Add test SWA deploy workflow: trigger on `push` to `develop` only, build with `--environment staging`
- [x] 2.4 Refactor production SWA workflow to use shared build pattern if not already aligned
- [x] 2.5 Configure GitHub Environments (`Dev`, `Test`, `Prod`) and branch protection rules per design
- [ ] 2.6 Verify deploy succeeds to SWA default hostnames before DNS cutover

## 3. CI consolidation (GitHub Actions)

- [x] 3.1 Create reusable `playwright.yml` workflow: `npm ci`, Playwright, `generate-page-coverage.js`, optional Codecov upload
- [x] 3.2 Chain Playwright after dev SWA deploy on `develop` / `feature/*` with `BASE_URL=https://blog-dev.funkysi1701.com` and sitemap wait loop
- [x] 3.3 Add Playwright on `main` push and PRs targeting `main` with `BASE_URL=https://www.funkysi1701.com`
- [x] 3.4 Update `reporters/page-visit-tracker.ts` to include `blog-dev.funkysi1701.com` in `allowedHosts`
- [x] 3.5 Refactor `seo-check.yml` to trigger via `workflow_call` / job `needs` after dev deploy; remove `repository_dispatch` dependency on Azure
- [x] 3.6 Create `pa11y-nightly.yml` scheduled workflow mirroring Azure nightly job (production URL, `create-accessibility-issues.js`)
- [x] 3.7 Align `@playwright/test` in `package.json` with GHA runner image version (`v1.59.1`)

## 4. Retire Azure Pipelines blog pipeline

- [x] 4.1 Remove ECR build/push, Kubernetes login, Helm lint/upgrade, blog-dev wait, Playwright, and `repository_dispatch` steps from `azure-pipelines.yml`
- [x] 4.2 Delete or disable `azure-pipelines-playwright.yml`
- [ ] 4.3 Disable Azure Pipelines triggers for blog branches or delete pipeline definition in Azure DevOps after GHA parity verified

## 5. DNS cutover and validation

- [ ] 5.1 Lower DNS TTL on `blog-dev` and `blog-test` records
- [ ] 5.2 Repoint `blog-dev.funkysi1701.com` DNS to dev SWA
- [ ] 5.3 Repoint `blog-test.funkysi1701.com` DNS to test SWA
- [ ] 5.4 Run full Playwright suite against `blog-dev` and spot-check `blog-test`
- [ ] 5.5 Run Signal Diff SEO crawl against `blog-dev` sitemap post-cutover
- [ ] 5.6 Compare sitemap URL counts: pre-cutover K8s vs post-cutover SWA (sanity check)

## 6. Decommission Kubernetes and repo artefacts

- [ ] 6.1 Uninstall Helm release `blog` in namespaces `develop`, `test`, and `main` only (AKS cluster stays — other workloads remain)
- [ ] 6.2 Remove blog ECR images; remove `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` from variable group only if no other pipeline uses ECR
- [ ] 6.3 Remove Kubernetes service connection from Azure DevOps only if no other pipeline uses it
- [ ] 6.4 Delete `Helm/blog/` from repository
- [ ] 6.5 Delete runtime `Dockerfile` (K8s Hugo server image); keep `docker-compose.yml` for local dev
- [ ] 6.6 Abandon `blog.funkysi1701.com` — remove ingress/DNS when uninstalling `main` namespace blog release (no redirect to `www`)

## 7. Documentation

- [x] 7.1 Update `AGENTS.md` CI map and branch/deploy table for SWA-only hosting
- [x] 7.2 Update `README.md` deploy and testing sections
- [x] 7.3 Update `CONTRIBUTING.md` E2E expectations (GHA gates, not Azure Pipelines)
- [x] 7.4 Update `.github/copilot-instructions.md` infrastructure section
- [x] 7.5 Update `.cursor/rules/funkysi1701-blog-core.mdc` branches and deploy section
