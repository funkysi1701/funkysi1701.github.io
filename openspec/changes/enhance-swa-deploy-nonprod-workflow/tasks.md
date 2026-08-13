## 1. Confirm current workflow meets acceptance

- [x] 1.1 Review `swa-deploy-nonprod.yml` job graph (branch gates, parallel deploys, Playwright ∥ SEO, concurrency, secret wiring) against the open specs
- [x] 1.2 Confirm `reusable-hugo-swa-deploy.yml` owns Hugo Docker build, `staticwebapp.config.json` copy, SWA upload, and sitemap wait — no npm-cache gap on that job
- [x] 1.3 Note overlap with closed [#3514](https://github.com/funkysi1701/funkysi1701.github.io/issues/3514) (clarity/header polish already shipped)

## 2. Doc sync and cheap polish

- [x] 2.1 Update `AGENTS.md` (and README / Copilot only if needed) so the nonprod orchestrator notes concurrency cancellation and that build/upload live in the reusable workflow
- [x] 2.2 Tighten the workflow header comment only if secrets/gates are inaccurate — do not change job behaviour
- [x] 2.3 Skip Slack/email notification wiring and skip adding `actions/cache` to the Hugo deploy job

## 3. Verify

- [x] 3.1 Run a static check if available (`actionlint` or equivalent); otherwise YAML/read-through sign-off against the specs
- [x] 3.2 Confirm production SWA workflow path is untouched

## 4. Close out issue

- [x] 4.1 Comment on and close [#3474](https://github.com/funkysi1701/funkysi1701.github.io/issues/3474), noting #3514 plus this document-and-verify pass
