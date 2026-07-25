## Context

Home already has a lean hero (`params.homeHero` + markup in `layouts/partials/list.html`) and a chronological post list. [#3463](https://github.com/funkysi1701/funkysi1701.github.io/issues/3463) shipped Start Here in nav and hero; [#3464](https://github.com/funkysi1701/funkysi1701.github.io/issues/3464) is the next gateway step from the analytics engagement plan.

Lite Analytics (last 30d at plan time) concentrates traffic on a few posts. Query-string rows such as `?ref=dailydev` must be combined when seeding. There is no live analytics feed in Hugo; curation is manual and static.

Constraints: site overrides under root `layouts/` / `assets/` / `data/` only; British English; keep the first home viewport lean (hero already owns brand + CTA — popular strip is a short second-click aid before the archive, not a dashboard).

## Goals / Non-Goals

**Goals:**

- Show 3–5 curated popular links on home only, above `.posts`.
- Source links from a single data/config file that editors can refresh without editing templates.
- Seed the first list from Lite top landers (combine `?ref=` variants).
- Match existing Bootstrap override styling (compact list / links; not a card grid).
- Cover the strip in homepage Playwright smoke expectations.

**Non-Goals:**

- Fetching Lite Analytics at build or runtime.
- Auto-rotating by traffic without a human edit.
- Replacing or redesigning Start Here (#3466 / #3467).
- Post footers or lander in-article bridges (#3465 / #3466).
- Embedding Lite.js in Hugo (#3468).

## Decisions

### 1. Curated list lives in `data/home_popular.toml`

**Choice:** A TOML data file with an ordered `[[items]]` list of `title` + `url` (site-relative paths). Templates read `hugo.Data.home_popular.items` (Hugo ≥0.156; `.Site.Data` is deprecated).

**Alternatives considered:**

- Hardcode links in the partial — rejected (fails acceptance criteria).
- `params.homePopular` in `config.toml` — workable, but noisier next to menus/hero; data file is easier to refresh when Lite rankings shift.
- Front matter on the home `_index` — home content is thin / theme-driven; data file is clearer.

### 2. Partial + hook in `list.html`

**Choice:** New `layouts/partials/home/popular.html`; call it from `layouts/partials/list.html` only when `.IsHome`, after the hero and before `<div class="posts">`.

**Rationale:** Matches how the hero is gated today; keeps markup out of the theme; easy to omit when the data list is empty (`with` / `len` guard).

### 3. Initial seed set (5 items)

Combine Lite top rows; prefer distinct evergreen posts over home itself:

| Order | Path | Why |
| ----- | ---- | --- |
| 1 | `/posts/2026/dotnet-5-to-10-features/` | Top lander (~16% incl. daily.dev `?ref=`) |
| 2 | `/posts/2025/merge-two-projects-into-one/` | Strong evergreen |
| 3 | `/posts/2026/stay-visible-as-a-developer-when-you-are-made-redundant/` | Named in issue seed examples |
| 4 | `/posts/2025/setting-up-grafana/` | Named in issue / plan long-tail |
| 5 | `/posts/2024/automatic-pull-requests/` | Plan long-tail (“auto-PRs”) |

Display titles may be short editorial labels (not necessarily full post titles) so the strip stays scannable.

**Alternatives considered:** Include Nagios/Docker or HTTP QUERY instead of auto-PRs — either is fine; auto-PRs keeps the set more “current workflow” oriented. Editors can swap via the data file later.

### 4. Markup and styling

**Choice:** `<section class="home-popular" aria-labelledby="…">` with a short heading (“Popular right now”), unordered list of text links. CSS in `assets/css/custom.css` using the same accent/spacing vocabulary as `.post-engagement` / `.home-hero` (border-bottom or light left accent; no cards).

**Rationale:** Acceptance criteria require Bootstrap-theme consistency and a strip, not a promo wall. Horizontal wrap on wide viewports / stacked list on narrow is acceptable if it stays one compact block.

### 5. Tests

**Choice:** Extend `homepage-loads.spec.ts` (+ test-plan scenario) to assert the popular section is visible on `/` and contains a known seeded href (e.g. `dotnet-5-to-10-features`). Keep under `@smoke` so PR Hugo smoke catches regressions.

## Risks / Trade-offs

- **[Stale curation]** Manual list drifts from Lite rankings → Mitigation: comment in the data file pointing at Lite; refresh opportunistically with #3467 evergreen pass.
- **[Broken links]** Typo in `url` → Mitigation: use known permalinks; smoke test hits one canonical path; monthly link crawl covers the rest.
- **[Viewport clutter]** Strip + hero + posts may feel busy → Mitigation: keep heading + 3–5 text links only; no images, stats, or cards.
- **[Empty/missing data]** Misnamed data file → Mitigation: partial no-ops when items are empty so home still builds.

## Migration Plan

1. Add `data/home_popular.toml` and partial; wire into `list.html`; add CSS.
2. Local `hugo server -D` / production `hugo --minify --environment production` to confirm home HTML.
3. Update Playwright + test plan; run smoke against local Hugo.
4. Ship via normal PR to `develop` → SWA blog-dev; no feature flag needed.
5. Rollback: revert the PR or empty the items list (strip disappears).

## Open Questions

None blocking. Optional later: cap display at `first 5` in the template even if the data file grows, so editors can keep a longer backlog without changing markup.
