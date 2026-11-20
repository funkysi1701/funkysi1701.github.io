## Why

A look-and-feel review of www.funkysi1701.com found the site readable and accessible, but the **first viewport and chrome** still read as stock hugo-theme-bootstrap: a job-title hero, eight top-nav items, and a long sidebar (including a duplicated Years archive). That weakens personal brand for hiring managers and makes the home feed feel like a dashboard instead of one clear composition.

## What Changes

1. **Sidebar prune + list tag capping** — Keep profile, Episode Atlas, and one discovery block; remove redundant featured/recent pairing; override the theme social/Years markup so Years appears once; on post list cards and post meta, show topical tags only (not `year` / `month` taxonomies) and cap visible badges.
2. **Home hero identity** — Promote Simon / Funky Si (avatar + name) to hero level; keep the role line secondary; restyle the Start Here CTA as a primary button (still pointing at `/start-here/`).
3. **Main nav slim-down** — Keep About, Start Here, Projects, and Newsletter as top-level items; move Tools & Resources, Contact, Events, and Search under a single **More** dropdown (pages remain reachable; no URL changes).

## Capabilities

### New Capabilities

- `sidebar-chrome-prune`: Sidebar widget set, single Years archive, and taxonomy badge rules on list/post meta.
- `home-hero-identity`: Homepage hero brand identity (avatar, name, secondary role, button CTA).
- `main-nav-slim`: Reduced top-level main menu with a More dropdown for secondary destinations.

### Modified Capabilities

<!-- No archived openspec/specs/ capabilities yet; home-popular-strip behaviour is unchanged. -->

## Impact

- **Layouts:** `layouts/partials/list.html` (hero), `layouts/partials/sidebar/main.html`, new/override `layouts/partials/sidebar/social.html`, `layouts/partials/post/meta.html` (and/or list-item override if needed).
- **Config:** `config/_default/config.toml` — `[params.homeHero]` fields and `[Menus].main` structure.
- **Assets:** `assets/css/custom.css` — hero identity + CTA button styles; keep WCAG AA.
- **Tests / specs:** Homepage and main-nav Playwright scenarios; `specs/funkysi1701-test-plan.md` updates for hero, nav More menu, and sidebar expectations.
- **Non-goals:** Theme upgrade / rebase; homepage composition beyond hero (popular strip and post feed stay); Projects page emoji cleanup; custom fonts / colour token refresh; logo mark beyond existing avatar; SPA/SWA routing changes.
