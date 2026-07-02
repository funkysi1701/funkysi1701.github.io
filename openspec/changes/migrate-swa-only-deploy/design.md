## Context

The blog currently has **dual hosting**:

- **Production (canonical):** GitHub Actions → Hugo pre-build → Azure SWA → `www.funkysi1701.com` (`.github/workflows/azure-static-web-apps-victorious-pebble-0b8f90e03.yml`).
- **All environments via K8s:** Azure Pipelines → Docker (`hugo server` at runtime) → ECR → Helm → AKS namespaces:
  - `develop` → `blog-dev.funkysi1701.com` (`--environment development`)
  - `test` → `blog-test.funkysi1701.com` (`--environment staging`)
  - `main` → `blog.funkysi1701.com` (parallel prod host, not `www`)

CI is split: GHA validates Hugo builds and meta lengths; Azure Pipelines runs Helm deploy, Playwright against blog-dev, `repository_dispatch` for SEO, and nightly Pa11y. GHA-hosted runners cannot reliably reach blog-dev today (K8s ingress on private/home network), which forces the Azure self-hosted agent bridge.

The site owner previously operated **three SWA apps** (Dev / Test / Prod) with branch-gated GHA deploys (documented in `content/posts/2022/using-github-actions.md`). This change completes that model and retires K8s for the blog.

## Goals / Non-Goals

**Goals:**

- Single deploy model: **pre-built static Hugo** uploaded to SWA for prod, dev, and test.
- Consolidate **Playwright**, **Signal Diff SEO**, and **nightly Pa11y** on GitHub Actions.
- Preserve existing URLs: `www.funkysi1701.com`, `blog-dev.funkysi1701.com`, `blog-test.funkysi1701.com`.
- Preserve branch workflow: `feature/*` → dev; `develop` → dev + test; `main` → prod.
- Remove K8s/ECR/Helm blog pipeline and repo artefacts after validated cutover.

**Non-Goals:**

- Changing Hugo content, theme overrides, or `staticwebapp.config.json` header policy (unless required for SWA custom domains).
- Shutting down the AKS cluster — **the cluster hosts other workloads**; only blog Helm releases (`develop`, `test`, `main` namespaces) are removed.
- Migrating Playwright to test against `localhost:1313` (keep live-URL E2E pattern).
- Adding Content-Security-Policy or other security hardening beyond current SWA config.

## Decisions

### 1. Three separate SWA resources (prod, dev, test)

**Choice:** Three Azure Static Web Apps — prod exists; **dev and test must be created new** in Azure (2022 resources no longer exist). Each has its own deploy token secret in GitHub.

**Alternatives considered:**

| Option | Rejected because |
|--------|------------------|
| Single SWA + PR previews only | No stable `blog-dev` URL; breaks E2E and `config/development/` |
| Two SWAs (prod + non-prod) | Loses `blog-test` / staging isolation used on `develop` |
| Keep K8s for dev only | Perpetuates dual model and GHA reachability issues |

**Rationale:** Matches 2022 setup, existing Hugo config overlays, and Playwright `KNOWN_SITE_ORIGINS` in `tests/performance-technical/sitemap.spec.ts`.

**Secrets naming (proposed):**

- Prod: existing `AZURE_STATIC_WEB_APPS_API_TOKEN_VICTORIOUS_PEBBLE_0B8F90E03`
- Dev: `AZURE_STATIC_WEB_APPS_API_TOKEN_BLOG_DEV` (new)
- Test: `AZURE_STATIC_WEB_APPS_API_TOKEN_BLOG_TEST` (new)

### 2. Reusable Hugo build pattern per environment

**Choice:** Extract a shared build step (composite action or reusable workflow) used by all SWA deploy jobs:

```text
HUGO_VERSION from .env
docker run floryn90/hugo:${HUGO_VERSION}-ext-alpine \
  --minify --environment <production|development|staging> --noBuildLock
cp staticwebapp.config.json public/
Azure/static-web-apps-deploy (skip_app_build: true, app_location: public)
```

**Rationale:** Identical to production workflow today; replaces runtime `hugo server` in K8s with correct static output per environment.

### 3. Workflow layout

**Choice:**

| Workflow | Trigger | Jobs |
|----------|---------|------|
| Extend or split from existing prod SWA workflow | `push: main` | build production → deploy prod SWA → Signal Diff prod (existing) |
| New `swa-deploy-dev.yml` (or combined `swa-deploy.yml`) | `push: develop`, `push: feature/*` | build development → deploy dev SWA → wait sitemap → Playwright → SEO check |
| Same file, separate job | `push: develop` | build staging → deploy test SWA |
| New `pa11y-nightly.yml` | `schedule` (cron from current Azure schedule) | Pa11y full sitemap on `www` → `create-accessibility-issues.js` |
| New `playwright.yml` (reusable) | `workflow_call` | npm ci → playwright → page coverage → optional Codecov |

**Rationale:** Keeps prod path stable; chains post-deploy tests via `needs:` instead of `repository_dispatch`.

### 4. Retire Azure Pipelines blog steps entirely

**Choice:** Remove ECR/K8s/Helm/Playwright/dispatch from `azure-pipelines.yml`; delete `azure-pipelines-playwright.yml`.

**Alternatives considered:**

| Option | Rejected because |
|--------|------------------|
| Keep Azure Pipelines for Playwright only | Duplicates CI; SWA public endpoints should fix GHA reachability |
| Keep nightly Pa11y on Azure | Requires K8s `kubectl rollout` coupling; unnecessary on SWA |

**Note:** If the self-hosted `Docker` pool is only used for this blog pipeline, it can be decommissioned separately.

### 5. DNS cutover after parallel validation

**Choice:** Deploy to SWA dev/test **before** changing DNS. Validate via SWA default hostname or hosts-file override, then repoint `blog-dev` / `blog-test` CNAMEs from K8s ingress to SWA.

**Rollback:** Revert DNS to K8s ingress; keep Helm releases scaled down but not deleted until soak period ends.

### 6. Abandon `blog.funkysi1701.com` (K8s prod host)

**Choice:** Do not create a fourth SWA and **do not configure a redirect**. `blog.funkysi1701.com` is no longer needed; canonical production remains `www.funkysi1701.com` via SWA. Uninstall the `blog` Helm release in the `main` namespace and let the hostname lapse (remove ingress/DNS when convenient).

### 7. GitHub Environments (optional gates)

**Choice:** Use GitHub Environments (`Prod`, `Test`, `Dev`) as documented in 2022 post — Prod may keep optional approval on `main`; Test on `develop`; Dev on `feature/*` and `develop`.

**Rationale:** Already familiar to the owner; not required for technical correctness.

### 8. Repo cleanup scope

**Remove after cutover:**

- `Helm/blog/`
- `Dockerfile` (runtime Hugo server image for K8s)
- K8s-related steps in `azure-pipelines.yml` (or whole file)
- `azure-pipelines-playwright.yml`

**Keep:**

- `docker-compose.yml` (local `hugo server` dev)
- Hugo Docker one-liner in GHA workflows
- `hugo-build.yml` (PR build validation)

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Pre-built static site differs from runtime `hugo server` (drafts, future posts, live reload) | Compare sitemap URL counts and spot-check key pages on SWA vs K8s before DNS cutover |
| `staticwebapp.config.json` headers only on SWA paths | Copy config into `public/` on every environment deploy (already done for prod) |
| Three deploy jobs on each `develop` push | Acceptable on free tier; jobs can run in parallel |
| GHA minutes increase | Offset by removing Azure Pipelines agent time and ECR/K8s ops |
| Stale bookmarks to `blog.funkysi1701.com` after abandonment | Accepted — host not needed; canonical URL is `www` |
| Premature K8s teardown | DNS rollback plan; keep Helm releases 1–2 weeks after cutover |
| SWA custom domain SSL propagation delay | Lower DNS TTL before cutover; reuse wait-for-sitemap loop |

## Migration Plan

### Phase 0 — Inventory (no traffic change)

1. Confirm `www` is SWA-served (response headers).
2. Document current DNS targets for `blog-dev` / `blog-test`.
3. **Create** new dev and test SWA resources in Azure portal (free tier).

### Phase 1 — SWA non-prod + GHA workflows (parallel to K8s)

1. Create dev and test SWA resources; add GitHub deploy-token secrets.
2. Implement dev/test deploy workflows; verify on `*.azurestaticapps.net` URLs.
3. Implement GHA Playwright + SEO workflows (trigger manually first).

### Phase 2 — Validate on SWA URLs

1. Run full Playwright suite against SWA dev URL (temporary `BASE_URL` or hosts override).
2. Run Pa11y against production SWA.
3. Compare sitemaps: K8s blog-dev vs SWA blog-dev.

### Phase 3 — DNS cutover

1. Lower TTL on dev/test DNS.
2. Point `blog-dev` and `blog-test` to SWA.
3. Run Playwright + SEO on canonical URLs.
4. Monitor 48h.

### Phase 4 — Decommission K8s path

1. Remove Helm deploy triggers from Azure Pipelines.
2. Uninstall `blog` Helm releases only (`develop`, `test`, `main` namespaces); **leave the AKS cluster running** for other workloads.
3. Remove blog ECR images; remove AWS keys from variable group **only if** no other pipeline on this project uses ECR.
4. Delete repo artefacts (`Helm/`, `Dockerfile`, playwright pipeline).
5. Update all tracked Markdown docs.

### Rollback

Revert DNS to K8s ingress and re-run Helm upgrade with last known good image tag. GHA workflows can be disabled via workflow dispatch-only until stable.

## Resolved decisions

| Question | Decision |
|----------|----------|
| Dev/test SWA resources | **Create new** — 2022 apps no longer exist |
| AKS cluster | **Keep cluster** — used for other workloads; remove blog Helm releases only |
| `blog.funkysi1701.com` | **Abandon** — not needed; no redirect; `www` is canonical |
| Pre-cutover DNS (`blog-dev`, `blog-test`) | **192.168.2.7** (K8s ingress) — repoint to SWA in phase 5 |

## Open Questions

1. **Prod deploy approval:** keep GitHub Environment approval gate on `main`?
2. **Azure Pipelines:** delete `azure-pipelines.yml` entirely or retain an empty/disabled stub for the nightly schedule migration window?
3. **ECR / Kubernetes service connection:** still required by other Azure Pipelines on this project after blog steps are removed?
