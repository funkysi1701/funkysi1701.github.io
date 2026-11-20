# Copilot Instructions for funkysi1701.com Blog

> **Keep this file short.** Always-loaded Copilot / agent surface should stay lean. Canonical entry: [`docs/AI_CONTEXT.md`](../docs/AI_CONTEXT.md) · commands and CI: [`AGENTS.md`](../AGENTS.md) · PR checklist: [`CONTRIBUTING.md`](../CONTRIBUTING.md). Cursor: [`.cursor/rules/`](../.cursor/rules/) · skills: [`.cursor/skills/`](../.cursor/skills/).

## Product and stack

Personal Hugo blog/portfolio on **Azure Static Web Apps** (prod, blog-dev, blog-test via GitHub Actions). **Site:** https://www.funkysi1701.com

Theme: **frozen fork** of hugo-theme-bootstrap v0.65.1 — prefer root `layouts/`, `assets/`, `static/` over editing `themes/hugo-theme-bootstrap/`. Do not rebase onto upstream v1.

## Layout

| Path | Role |
|------|------|
| `content/posts/YYYY/` | Blog posts (TOML front matter in `+++` fences) |
| `content/` | Pages (about, projects, parkrun, …) |
| `layouts/`, `assets/`, `static/` | Site overrides |
| `config/` | `_default` + development / staging / production |
| `tests/`, `specs/` | Playwright E2E + scenario plan |
| `scripts/`, `.github/workflows/` | Automation and CI |

## Branches and deploy

| Branch | Target |
|--------|--------|
| **`main`** | Production — `www.funkysi1701.com` |
| **`develop`** | blog-dev + blog-test |
| **`feature/*`** | blog-dev only |

No git branch named `dev`. blog-dev builds pass `--buildFuture`; staging/production do not.

## Non-negotiables

1. New posts: **`draft = false`**. Review on **https://blog-dev.funkysi1701.com** — not Hugo `draft = true`.
2. **British English** (`en-gb`).
3. SEO: production HTML `<title>` **50–60** (`{title} - Funky Si's Blog`); `description` **110–160**. After front-matter edits: `npm run check:meta`.
4. Do not edit **`public/`** or the parkrun block between `BEGIN`/`END PARKRUN_GENERATED` markers.
5. **No secrets** in `.env`, `config/`, or front matter.
6. **No SPA `navigationFallback` → `/index.html`** — `responseOverrides["404"]` → `/404.html`. After SWA config edits: `npm run check:swa-config`.
7. Do not embed **`lite.js`** while Cloudflare Zaraz injects it.
8. Keep **`AGENTS.md` / README / CONTRIBUTING / Cursor rules / this file** aligned when behaviour changes.

### Blog draft review checklist

When drafting or polishing posts:

- **Authorship:** Does this read like Simon wrote it, or like AI?
- **Developer takeaway:** What will fellow developers learn or do differently?
- **CTA:** Clear next step (comments, related post, newsletter, contact)?

## Build, test, run

```bash
hugo server -D                                          # http://localhost:1313
hugo --minify --environment production
npm ci
npm run check:meta
npm run check:swa-config
npm run check:spec-headers
npm test                                                # set BASE_URL for non-prod
npm run test:smoke                                      # needs local Hugo; set BASE_URL
```

Hugo version: `.env` → `HUGO_VERSION`. Full CI map: [`AGENTS.md`](../AGENTS.md).

Playwright: every `tests/**/*.spec.ts` needs a `// spec: specs/...` header. `BASE_URL` defaults to production if unset.

## Medium / large work

Prefer **OpenSpec** (`/opsx-propose` → apply → archive). Context: [`openspec/config.yaml`](../openspec/config.yaml). Skills: parkrun update, fix-post-meta, playwright-test-healer under [`.cursor/skills/`](../.cursor/skills/).

## When changing boundaries

Update docs per [`docs/AI_CONTEXT.md`](../docs/AI_CONTEXT.md#when-to-update-docs-ai-checklist). Parkrun scrape: [`.cursor/skills/update-parkrun`](../.cursor/skills/update-parkrun/SKILL.md).
