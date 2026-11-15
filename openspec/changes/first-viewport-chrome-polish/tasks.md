## 1. Sidebar prune and Years override

- [x] 1.1 Remove the Featured Posts partial call from `layouts/partials/sidebar/main.html`; leave profile, search, Episode Atlas, TOC, recent, tags, and social
- [x] 1.2 Add root `layouts/partials/sidebar/social.html` override based on the theme social partial, keeping links/social content but rendering **one** Years section only
- [x] 1.3 Confirm locally that homepage sidebar has a single “Years” heading and no “Featured Posts” block

## 2. Taxonomy badge capping

- [x] 2.1 Update `layouts/partials/post/meta.html` so badge chips iterate `tags` only (omit `year` / `month` / other taxonomies from `.post-taxonomies`)
- [x] 2.2 Support an optional max tag count (default unlimited); pass `maxTags = 3` from the list-item path (add a minimal root `list-item` override if the theme partial cannot accept a dict without copying)
- [x] 2.3 Spot-check home list HTML: no `2026` / `YYYY-MM` chips; at most three tag badges per card; single post still lists all tags

## 3. Home hero identity

- [x] 3.1 Extend `[params.homeHero]` (and/or reuse `params.author`) so the hero can render avatar + display name; avoid duplicating the full bio three times in the first viewport
- [x] 3.2 Update `layouts/partials/list.html` home hero: avatar, name as sole `h1`, role as supporting line, Start Here as `btn btn-primary`
- [x] 3.3 Add/adjust `.home-hero` styles in `assets/css/custom.css` (avatar size, spacing, button); verify light/dark contrast for the CTA

## 4. Main nav slim-down

- [x] 4.1 Rework `[Menus].main` in `config/_default/config.toml`: top-level About, Start Here, Projects, Newsletter; More parent with Tools & Resources, Contact, Events, Search as children (preserve URLs)
- [x] 4.2 Verify desktop dropdown and mobile hamburger expose More children using the existing header override

## 5. Verification and docs

- [x] 5.1 Run `hugo --minify --environment production` and sanity-check home, a post, and nav HTML
- [x] 5.2 Update `specs/funkysi1701-test-plan.md` for hero identity, slim nav / More, sidebar prune, and list tag rules
- [x] 5.3 Update Playwright: `homepage-loads.spec.ts` (hero avatar/name, button CTA, no Featured Posts, ≤1 Years heading); `main-navigation.spec.ts` and mobile nav specs for four primaries + More children
- [x] 5.4 Run `npm run check:spec-headers` and homepage/main-nav smoke against local Hugo (`BASE_URL=http://127.0.0.1:1313`)
- [x] 5.5 If AGENTS.md / CONTRIBUTING / README mention the eight-item nav explicitly, align those lines; otherwise skip
