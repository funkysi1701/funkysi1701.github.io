## Why

[#3474](https://github.com/funkysi1701/funkysi1701.github.io/issues/3474) asked for faster/safer Azure SWA nonprod deploys (caching, secrets, parallelization, notifications). Most of that is already in place: reusable Hugo/Playwright/SEO workflows, parallel blog-dev/blog-test deploys on `develop`, concurrent post-deploy checks, concurrency cancellation, and pinned actions. Duplicate [#3514](https://github.com/funkysi1701/funkysi1701.github.io/issues/3514) (closed) covered clarity/comments. Remaining gap: document the supported design clearly, apply only cheap safe polish if review finds drift, verify behaviour contracts, and close #3474.

## What Changes

- Treat `swa-deploy-nonprod.yml` as a **thin orchestrator** (branch gates + secret wiring) with build/upload in `reusable-hugo-swa-deploy.yml` — not a monolithic pipeline to re-inline.
- Confirm best-practice coverage already shipped: parallel jobs, GitHub Environments + deploy tokens as secrets, concurrency group, header docs for required secrets.
- Sync onboarding docs (`AGENTS.md` / README or Copilot as needed) so the orchestrator vs reusable split, branch gates, and concurrency behaviour are explicit.
- Apply only low-risk YAML/doc polish if review finds inaccuracies — **no** default behaviour change to deploy targets, Hugo env flags, or post-deploy gates.
- Close [#3474](https://github.com/funkysi1701/funkysi1701.github.io/issues/3474) when documented and verified.

## Capabilities

### New Capabilities

- `swa-deploy-nonprod-workflow`: Nonprod SWA orchestration — branch gates, reusable deploy call, parallel post-deploy Playwright/SEO, secrets via GitHub Environments, concurrency cancellation, and documented operator surface.

### Modified Capabilities

<!-- No existing openspec/specs/ capabilities archived for this area yet; migrate-swa-only-deploy change specs are in-flight separately. -->

## Impact

- **Workflows:** `.github/workflows/swa-deploy-nonprod.yml` (comments/docs only unless a defect is found); read/validate `reusable-hugo-swa-deploy.yml`, `reusable-playwright.yml`, `reusable-seo-check.yml`.
- **Docs:** `AGENTS.md` and/or `README.md` / `.github/copilot-instructions.md` if the orchestrator pattern or concurrency is under-documented.
- **Out of scope:** Adding Slack/email notifications, raising runner parallelism inside Hugo Docker builds, npm caching on the Hugo deploy job (image-based build), changing blog-dev `--buildFuture` behaviour, or reworking production SWA workflow.
