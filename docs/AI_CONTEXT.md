# funkysi1701.com — AI context

> **Last reviewed:** 2026-11-14

Single entry point for AI coding assistants working in this repository. Read this first, then the tool-specific file for your environment.

## Product in one paragraph

**funkysi1701.com** is a personal Hugo blog and portfolio on **Azure Static Web Apps** (prod / blog-dev / blog-test via GitHub Actions). Content is Markdown under `content/`; site overrides live in root `layouts/`, `assets/`, and `static/`. The theme is a **frozen fork** of hugo-theme-bootstrap v0.65.1 — do not rebase onto upstream v1.

## Canonical documentation (do not duplicate)

| Topic | File |
|-------|------|
| Commands, CI map, guardrails | [`AGENTS.md`](../AGENTS.md) |
| Human setup, testing, Zaraz analytics | [`README.md`](../README.md) |
| PR checklist, branches, publishing | [`CONTRIBUTING.md`](../CONTRIBUTING.md) |
| E2E scenario plan | [`specs/funkysi1701-test-plan.md`](../specs/funkysi1701-test-plan.md) |

When you change workflows, branches, testing, or automation, update every affected Markdown file in the same change (`AGENTS.md`, `CONTRIBUTING.md`, `README.md`, `.github/copilot-instructions.md`, `.cursor/rules/`, and this file if the AI entry point changes).

## Tool-specific instructions

| Tool | File | Scope |
|------|------|-------|
| **Cursor (always on)** | [`.cursor/rules/funkysi1701-blog-core.mdc`](../.cursor/rules/funkysi1701-blog-core.mdc) | Thin entry point; links here and to `AGENTS.md` |
| **Cursor (scoped)** | [`.cursor/rules/`](../.cursor/rules/) | `azure-devops-stories.mdc` (Feature **2996**), `content-posts.mdc`, `playwright-tests.mdc`, `hugo-layouts.mdc`, `parkrun-generated.mdc` |
| **Cursor MCP** | [`.cursor/mcp.json`](../.cursor/mcp.json) | Playwright browser + test server |
| **Cursor Cloud / any agent** | [`AGENTS.md`](../AGENTS.md) | Build, test, what not to edit, CI map |
| **GitHub Copilot** | [`.github/copilot-instructions.md`](../.github/copilot-instructions.md) | Slim always-on edit guidance; detail → `AGENTS.md` |
| **OpenSpec (preferred for medium/large work)** | [`openspec/`](../openspec/) · [`.cursor/skills/openspec-*`](../.cursor/skills/) · `/opsx-propose` → `/opsx-apply` → `/opsx-archive` | Spec-driven changes under `openspec/changes/<name>/` |
| **Project skills (on-demand)** | [`.cursor/skills/`](../.cursor/skills/) | `update-parkrun`, `fix-post-meta`, `playwright-test-healer` (+ OpenSpec skills) |
| **Cursor hooks (optional)** | [`.cursor/hooks.json`](../.cursor/hooks.json) · [`.cursor/hooks/README.md`](../.cursor/hooks/README.md) | Post-edit meta validation; shell guard; stop checklist for docs / secrets / tech-debt |

**Precedence:** `AGENTS.md` + this file for *what/why*. Tool rules for *how to edit safely*. If tool rules conflict with `AGENTS.md`, fix the tool rule.

## Context layering

Stack context most durable → most task-specific:

1. **User rules** — Personal Cursor preferences (commits, communication).
2. **Project rules** — This file, [`AGENTS.md`](../AGENTS.md), and [`.cursor/rules/*.mdc`](../.cursor/rules/).
3. **Chat prompt** — The Azure Boards `AB#`, PR, or one-line task for *this* session. Product backlog: Feature **2996** (not GitHub Issues for intentional build work).

Keep tasks scoped. Prefer **`@` file references** (e.g. `@AGENTS.md`, `@content/posts/2026/...`) over pasting large blocks or copying instructions from other repos.

## Medium and large changes

**Prefer OpenSpec** for cross-cutting work (workflows, SWA config, layouts + tests, new automation):

1. `/opsx-propose` (or `openspec new change`) — proposal + design + specs + tasks under `openspec/changes/<name>/`
2. `/opsx-apply` — implement tasks
3. `/opsx-archive` / `/opsx-sync` when done

Project context for artifacts: [`openspec/config.yaml`](../openspec/config.yaml).

Small bug fixes, typos, single-file content tweaks, and test-only changes: point the agent at the issue or file; skip OpenSpec.

## Non-negotiable conventions

1. **`draft = false`** on new posts — review on **https://blog-dev.funkysi1701.com** (`feature/*` / `develop`), not Hugo `draft = true`. Production is `main`.
2. **British English** (`locale = 'en-gb'`).
3. **SEO lengths:** production HTML `<title>` 50–60 (`{title} - Funky Si's Blog`); `description` 110–160. Run `npm run check:meta` after front-matter edits.
4. **Do not edit `public/`** or the parkrun generated block between markers.
5. **Prefer root `layouts/` / `assets/` / `static/`** over editing `themes/hugo-theme-bootstrap/`.
6. **No secrets** in `.env`, `config/`, or front matter — SWA/Cloudflare tokens stay in GitHub Actions secrets.
7. **No SPA `navigationFallback` → `/index.html`** — use `responseOverrides["404"]` → `/404.html`. Validate with `npm run check:swa-config`.
8. **Do not embed `lite.js`** while Cloudflare Zaraz injects it.
9. **Keep docs in sync** when behaviour, CI, or branches change (same PR).

## Commands (quick reference)

```bash
hugo server -D
hugo --minify --environment production
npm ci
npm run check:meta
npm run check:swa-config
npm run check:spec-headers
npm test                    # set BASE_URL for non-production
npm run test:smoke          # needs local Hugo; set BASE_URL
```

Full table and CI map: [`AGENTS.md`](../AGENTS.md).

## When to update docs (AI checklist)

Before finishing a PR:

- Workflow / branch / deploy change → `AGENTS.md`, `README.md`, `CONTRIBUTING.md`, always-on Cursor rule, slim Copilot file
- Post front-matter / SEO rules → `content-posts.mdc`, meta scripts docs in `AGENTS.md`
- Layout / theme override patterns → `hugo-layouts.mdc`
- Playwright / `// spec:` / `BASE_URL` → `playwright-tests.mdc`, `specs/`
- Parkrun scrape behaviour → `parkrun-generated.mdc`, parkrun skill
- New AI convention or tool entry → this file + the tool-specific path above
- New OpenSpec project context → `openspec/config.yaml`

## Anti-patterns

| Anti-pattern | Why it hurts |
| --- | --- |
| Large drive-by refactors while fixing a bug | Hard to review; easy to regress |
| Pasting generic instructions from other repos | Misses Hugo/SWA/Zaraz/blog-dev constraints |
| Using Hugo `draft = true` to hide WIP | Wrong unpublished path; use blog-dev + `feature/*` |
| Editing the vendored theme for a one-off layout tweak | Breaks the frozen-fork contract; use root `layouts/` |
| Skipping `check:meta` / Playwright after content or layout edits | CI fails late; SEO regressions |
| Committing secrets or paste of deploy tokens into chat | Security incident |
| Adding SPA fallback to soft-404 the homepage | Breaks missing-route behaviour |

## Related documentation

| Topic | Location |
| --- | --- |
| Agent entry (commands / CI) | [`AGENTS.md`](../AGENTS.md) |
| Human README | [`README.md`](../README.md) |
| Contributing | [`CONTRIBUTING.md`](../CONTRIBUTING.md) |
| Hook details | [`.cursor/hooks/README.md`](../.cursor/hooks/README.md) |
