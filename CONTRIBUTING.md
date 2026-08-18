# Contributing to funkysi1701.com

Thank you for contributing to this Hugo blog. Use this checklist before opening or reviewing a pull request. Setup, commands, and CI details live in [`README.md`](README.md); agents should also read [`AGENTS.md`](AGENTS.md).

## Pull request checklist

Copy into your PR description or verify locally before requesting review:

- [ ] **Post front matter:** new posts use `draft = false`. Production HTML `<title>` (`{title} - Funky Si's Blog`) 50–60 characters (front matter usually 32–42) and `description` 110–160 characters for `content/posts/**/*.md`. Run `npm run check:meta` after editing front matter. Review unpublished posts on **https://blog-dev.funkysi1701.com**, not via Hugo `draft = true`.
- [ ] **Parkrun generated block:** Did not hand-edit `content/parkrun.md` between `<!-- BEGIN PARKRUN_GENERATED -->` and `<!-- END PARKRUN_GENERATED -->`. Use `scripts/update_parkrun_results.py` instead; see [`README.md`](README.md#parkrun-results-contentparkrunmd).
- [ ] **Home popular data:** `data/home_popular.toml` remains 3–5 valid post links. Its URLs are refreshed weekly from Cloudflare Web Analytics by `scripts/home-popular/run.mjs`; editorial title changes are preserved.
- [ ] **Analytics injection:** Did not embed `lite.js` (or a second analytics snippet) in Hugo while Cloudflare Zaraz injects Lite — see [`README.md`](README.md#analytics-cloudflare-zaraz). Hugo `services.googleAnalytics.id` stays empty unless deliberately replacing Zaraz.
- [ ] **Secrets and build output:** Did not commit API keys, deploy tokens, or credentials. Did not commit `public/` (Hugo build output).
- [ ] **SWA config:** If you change `staticwebapp.config.json`, run `npm run check:swa-config` (schema + security-header checks; also `swa-config.yml` in CI). Do not add SPA `navigationFallback` → `/index.html` (soft-404s); keep `responseOverrides["404"]` → `/404.html`.
- [ ] **Templates and assets:** Hugo production build passes (`hugo --minify --environment production`, or Docker per `README.md`). GitHub Actions runs the same build on pull requests (`hugo-build.yml`). Prefer site overrides in root `layouts/`, `assets/`, and `static/` over editing the frozen `themes/hugo-theme-bootstrap/` fork (v0.65.1). Do not rebase onto upstream v1.
- [ ] **Test changes:** `npm ci && npm test` when you change tests or behaviour they cover. Every PR runs a **Playwright smoke** subset on GitHub Actions (`playwright-smoke.yml` — local Hugo + `@smoke`). Full Playwright E2E runs after SWA deploy to **`develop`** / **`feature/*`** (`swa-deploy-nonprod.yml`, blog-dev), on PRs into **`main`** against blog-dev, and on **`main`** pushes against production (`playwright.yml`). Optional local/CI tuning via `PLAYWRIGHT_*` env vars is documented in [`README.md`](README.md) (Testing) and the header of `playwright.config.ts` (CI defaults stay single-worker / two retries when unset).
- [ ] **New Playwright specs:** Include a `// spec: specs/funkysi1701-test-plan.md` comment (or the relevant scenario doc under `specs/`). Run `npm run check:spec-headers` to verify. Tag critical PR scenarios with `{ tag: '@smoke' }` when they belong in the smoke subset. See [`specs/funkysi1701-test-plan.md`](specs/funkysi1701-test-plan.md).

## Branch workflow

| Branch | Use |
|--------|-----|
| **`feature/*`** | Day-to-day work — open PRs into **`develop`**; GHA deploys to blog-dev for review (`https://blog-dev.funkysi1701.com`) |
| **`develop`** | Integration; GHA deploys to blog-dev / blog-test (SWA). blog-dev builds use `--buildFuture`; blog-test does not |
| **`main`** | Production; promotion via [`.github/workflows/auto-pr.yml`](.github/workflows/auto-pr.yml) (develop → main) |

There is no **`dev`** branch — use **`develop`**.

## Publishing and promotion

**Drafts are preview URLs, not Hugo flags.** Always create posts with `draft = false`. Review them on the private site **https://blog-dev.funkysi1701.com** (`feature/*` deploys there; `develop` also deploys blog-test). Going live means merging to **`main`** (`www.funkysi1701.com`). Do not set `draft = true` on new posts.

When publishing or refreshing posts (growth / engagement work):

- **daily.dev:** Treat as a first-class channel for new **.NET** and **DevOps** posts. Submit or promote on [daily.dev](https://app.daily.dev/) when the post goes live (Lite Analytics shows it as a major acquisition path for landers such as `.NET 5 to 10`).
- **Evergreen first:** Prefer a light refresh of a proven top lander (for example merge-two-projects, Grafana, automatic pull requests) before writing net-new on the same topic.
- **Optional cross-post:** LinkedIn or other channels for 2–3 pillar posts — always share the **canonical URL** (no `?ref=` query strings).
- **Referral URLs:** Do **not** branch templates or CTAs on `?ref=dailydev` (or similar). Hugo must serve the same HTML and engagement CTAs as the clean permalink; `layouts/partials/head/canonical.html` already uses `.Permalink`.

## AI-assisted contributions

- Start with [`AGENTS.md`](AGENTS.md) for commands, guardrails, and the CI map.
- Cursor: path-scoped rules in [`.cursor/rules/`](.cursor/rules/) (always-applied [`funkysi1701-blog-core.mdc`](.cursor/rules/funkysi1701-blog-core.mdc) plus content, tests, layouts, and parkrun rules). Copilot: [`.github/copilot-instructions.md`](.github/copilot-instructions.md).
- Playwright MCP: [`.cursor/mcp.json`](.cursor/mcp.json) for Cursor (`@playwright/mcp` browser tools + test server); [`.vscode/mcp.json`](.vscode/mcp.json) for VS Code / Copilot test agents.
- Prefer **minimal diffs** — solve the task without refactoring unrelated code or adding dependencies without clear need.

## Further reading

| Path | Purpose |
|------|---------|
| [`README.md`](README.md) | Local setup, testing, deployment |
| [`AGENTS.md`](AGENTS.md) | Tool-agnostic agent onboarding |
| [`.cursor/rules/`](.cursor/rules/) | Cursor rules by area |
| [`specs/funkysi1701-test-plan.md`](specs/funkysi1701-test-plan.md) | E2E scenario plan |
