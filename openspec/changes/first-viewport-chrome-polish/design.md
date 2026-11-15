## Context

Site chrome is mostly hugo-theme-bootstrap v0.65.1 with root overrides. Home already has `params.homeHero` (headline / subheading / Start Here text link) and a Popular strip. Sidebar is assembled in `layouts/partials/sidebar/main.html` (profile, search, Episode Atlas, TOC, featured, recent, tags, social). Theme `sidebar/social.html` renders **two** Years sections (confirmed in theme source). Post meta (`layouts/partials/post/meta.html`) ranges **all** site taxonomies, so list cards show `year` and `month` badges (`2026`, `2026-09`) alongside topical tags.

Constraints: prefer root `layouts/` / `assets/` / `config/` only; British English; preserve WCAG AA contrast already fixed in `custom.css`; do not edit `public/` or the vendored theme unless an override is impossible (overrides are possible for social + meta).

## Goals / Non-Goals

**Goals:**

- First home viewport leads with personal brand (avatar + name), then role, then a clear Start Here button.
- Sidebar is shorter and non-duplicative: one Years list; no redundant featured+recent stack on every page.
- List/post taxonomy chips are topical only and capped so cards stay scannable.
- Top nav has four primary items plus one More dropdown; secondary pages keep the same permalinks.

**Non-Goals:**

- Full homepage redesign (popular strip / post-card chrome beyond tag capping).
- New logo/wordmark asset beyond using the existing author avatar.
- Font pairing or global colour-token refresh (follow-up).
- Changing Hugo taxonomies or permalinks for year/month.
- Removing Episode Atlas promo or the Popular strip.

## Decisions

### 1. Sidebar: keep profile + Episode Atlas + tags; drop featured; keep recent OR collapse discovery

**Choice:**

| Widget | Action |
| ------ | ------ |
| Profile | Keep |
| Search | Keep (primary find-in-site control) |
| Episode Atlas | Keep |
| TOC | Keep on posts only (theme already gates; leave behaviour) |
| Featured posts | **Remove** from `sidebar/main.html` (home Popular + pin already surface curated work) |
| Recent posts | **Keep** (cheap chronological discovery in sidebar) |
| Tags | Keep (existing chip override) |
| Social / Years | **Override** theme `social.html` in root layouts: one Years section + existing social/links content; delete the duplicate Years block |

**Alternatives considered:** Drop both featured and recent — too aggressive for archive browsing. Drop tags instead of featured — tags are the intentional discovery affordance already covered by Playwright.

### 2. Taxonomy badges: tags only, cap at three on lists

**Choice:** Override `layouts/partials/post/meta.html` so `.post-taxonomies` only iterates the `tags` taxonomy (not `year`, `month`, or `categories` unless a post has no tags — then show nothing extra). On list views, show at most **three** tag badges; if more exist, omit the rest (no “+N” required for v1). Single post pages MAY show all tags (still tags-only, uncapped) so the article remains fully labelled for readers who land directly.

**Implementation note:** Detect list vs single via `.IsPage` / caller context, or pass a `maxTags` dict from a thin `list-item` override. Prefer extending the existing meta partial with an optional `maxTags` parameter defaulting to unlimited on singles and `3` when called from list-item — if list-item stays in the theme, copy a minimal override that passes `maxTags`.

**Alternatives considered:** Hide taxonomies on lists entirely — loses skim value. Cap including categories — categories like `tech` are useful; year/month are the noise.

### 3. Hero: avatar + name as brand; role as lead; button CTA

**Choice:** Extend `params.homeHero` with optional `name` (default `params.author.name`) and reuse `params.author.avatar`. Markup in `list.html` home hero:

1. Avatar (img, descriptive alt e.g. “Simon Foster”)
2. Name as visually dominant brand line (not necessarily a second `h1` — keep a single `h1`; prefer name as `h1` and role as `.lead`, **or** keep role as `h1` only if SEO title strategy requires the job title — **prefer name as `h1`** and role as supporting text so brand wins the brand test)
3. Existing subheading / bio line can stay or merge with role — avoid triple-stacking identical “18+ years” copy (sidebar profile already repeats it). Use role once in hero; shorten or omit duplicate subheading if it duplicates `params.author.bio`.
4. CTA: `<a class="btn btn-primary …">` to `/start-here/`.

Document HTML `<title>` for home remains driven by existing title partial / site title — hero H1 change must not break meta title length CI (home title is not post front matter).

**Alternatives considered:** Keep job title as `h1` and add name as eyebrow — fails the brand-first test from the review. Add a separate logo file — unnecessary while avatar exists.

### 4. Nav: four primaries + More dropdown

**Choice:** Reorder `[Menus].main` in `config/_default/config.toml`:

| Weight | Name | Placement |
| ------ | ---- | --------- |
| 1 | About | Top-level |
| 2 | Start Here | Top-level |
| 3 | Projects | Top-level |
| 4 | Newsletter | Top-level |
| 5 | More | Parent dropdown |
| 5.x | Tools & Resources, Contact, Events, Search | Children of More |

Hugo Bootstrap theme already supports `.HasChildren` dropdowns in `layouts/partials/header/index.html`.

**Alternatives considered:** Footer-only secondary links — worse discoverability on mobile. Hide Search from nav because sidebar search exists — Search page is still a first-class destination; keep under More.

### 5. Tests

**Choice:**

- Update `main-navigation.spec.ts` / responsive mobile specs: assert the four primaries visible; assert More opens (or is visible) and contains Contact (and optionally Search / Events / Tools).
- Update `homepage-loads.spec.ts`: hero contains avatar + author name; CTA is still `/start-here/` (selector may change from plain link to `.btn`); sidebar must **not** require featured posts; keep Tags chip assertions; add assertion that Years heading appears at most once in the sidebar.
- List tag capping: optional focused assertion on a known post card that previously exposed month/year badges — assert those badge texts are absent from `.posts .post-taxonomies` on home.

## Risks / Trade-offs

- **[Nav test churn]** Specs hard-code eight top-level links → Mitigation: update Playwright + test plan in the same PR.
- **[SEO / a11y H1]** Changing home `h1` from job title to name → Mitigation: keep one `h1`; ensure navbar brand is not also wrapped in `h1` on home (already true when `homeHero` is set).
- **[Lost featured sidebar]** Some deep links disappear from chrome → Mitigation: home Popular + pins + recent remain; featured list can return later if analytics shows need.
- **[Meta partial shared]** Capping tags incorrectly on singles → Mitigation: parameterise max; uncapped on `.IsPage` singles.
- **[Dropdown a11y]** Theme dropdown relies on Bootstrap → Mitigation: reuse existing markup; run keyboard/smoke checks on mobile hamburger + More.

## Migration Plan

1. Land layout/config/CSS on a `feature/*` branch; review on blog-dev.
2. Update Playwright + test plan; run smoke + main-nav locally against Hugo.
3. Merge via normal develop → main path. No feature flags.
4. Rollback: revert the PR (config + partials + CSS + tests).

## Open Questions

None blocking. Optional follow-up: “+N more tags” affordance on list cards; homepage post-card chrome polish.
