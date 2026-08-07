## Context

[#3474](https://github.com/funkysi1701/funkysi1701.github.io/issues/3474) (enhance) and closed [#3514](https://github.com/funkysi1701/funkysi1701.github.io/issues/3514) (clarity) both target `swa-deploy-nonprod.yml`. The file is already a short orchestrator (~75 lines with header docs) that calls:

| Job | When | Reusable |
|-----|------|----------|
| `deploy-dev` | always (`develop` / `feature/**` / dispatch) | `reusable-hugo-swa-deploy.yml` (`development`, `--buildFuture`, Dev environment) |
| `deploy-test` | `develop` only | same reusable (`staging`, Test environment) |
| `playwright-dev` | after successful `deploy-dev` | `reusable-playwright.yml` |
| `seo-check-dev` | after successful `deploy-dev` | `reusable-seo-check.yml` |

Deploy jobs have no `needs` between them (parallel). Playwright and SEO both `needs: deploy-dev` and run in parallel. Concurrency group `swa-deploy-nonprod-${{ github.ref }}` cancels superseded runs. Hugo build uses Docker (`floryn90/hugo`) — dependency caching for npm is irrelevant on the deploy job itself (Playwright reusable owns Node install).

Constraints: least privilege secrets; keep `contents: read`; do not break blog-dev/blog-test gates; align Markdown docs when behaviour is part of the contract.

## Goals / Non-Goals

**Goals:**

- Document the orchestrator design as accepted practice for caching/parallelism/secrets.
- Close any onboarding doc gaps (branch gates, concurrency, where caching does/doesn't apply).
- Static-validate workflow YAML if tooling is available; no intentional runtime behaviour change.

**Non-Goals:**

- Failure/success chat notifications.
- Adding `actions/cache` to the Hugo Docker build step.
- Merging production and nonprod workflows.
- Changing which secrets or Environments are required.

## Decisions

### 1. Keep thin orchestrator + reusables (default)

**Choice:** Leave job graph in `swa-deploy-nonprod.yml`; keep build/upload in the reusable. Expand header comment only if missing secrets or gates.

**Alternatives considered:** Inlining all steps — undoes #3514 and hurts reuse with prod patterns.

### 2. Do not add npm/Docker layer caching on deploy

**Choice:** Document that Hugo runs in an ephemeral container image already version-pinned via `.env` `HUGO_VERSION`; caching buys little vs image pull/layer reuse on self-hosted runners. Playwright npm caching stays in the Playwright reusable if present.

**Alternatives considered:** `actions/cache` on `node_modules` in deploy — unused; Docker buildx cache for Hugo — image is pulled, not built.

### 3. Parallelism already present — document, don't invent jobs

**Choice:** Document that `deploy-dev` ∥ `deploy-test`, and Playwright ∥ SEO after blog-dev. Avoid forcing blog-test to wait on Playwright.

**Alternatives considered:** Fan-out matrix — overkill for two SWA targets.

### 4. Notifications out of scope

**Choice:** Rely on GitHub Actions UI / email notifications already tied to the repo; skip Slack webhooks for this low-priority issue.

### 5. Verification without forcing a deploy

**Choice:** Validate by reading job graph against specs, optional `actionlint` if installed, and confirming docs match. Do not require a live SWA deploy to close; note that the next `develop`/`feature/*` push exercises production path.

## Risks / Trade-offs

- **[Risk]** Tech-debt scan reopens “50 lines complex” heuristics → **Mitigation:** Close with pointer to orchestrator pattern + #3514.
- **[Risk]** Doc edits drift from workflows → **Mitigation:** Keep wording tightly tied to current YAML job names/branch gates.
- **[Trade-off]** No notifications means operators still watch Actions → Acceptable for priority-low.

## Migration Plan

1. Review YAML vs acceptance criteria; note already-met items.
2. Doc sync; optional comment polish.
3. Static validate if possible.
4. Close #3474 referencing #3514 + this verify/doc pass.
5. Rollback: revert doc-only commits.

## Open Questions

None blocking.
