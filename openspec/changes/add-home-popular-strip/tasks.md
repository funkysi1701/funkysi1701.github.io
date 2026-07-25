## 1. Curation data

- [x] 1.1 Add `data/home_popular.toml` with ordered `[[items]]` (`title`, `url`) seeded from Lite top pages: `.NET 5→10`, merge-two-projects, stay-visible, Grafana, automatic-pull-requests (5 items; exclude `/`)
- [x] 1.2 Add a short comment in the data file noting Lite Analytics as the seed source and that `?ref=` variants map to the same URL

## 2. Layout and styles

- [x] 2.1 Create `layouts/partials/home/popular.html` that reads `hugo.Data.home_popular.items`, renders a labelled section + link list when 1+ items exist, and no-ops when empty
- [x] 2.2 Call the partial from `layouts/partials/list.html` on `.IsHome` only, after the home hero and before `.posts`
- [x] 2.3 Add lean `.home-popular` styles in `assets/css/custom.css` consistent with `.home-hero` / `.post-engagement` (no cards)

## 3. Verification

- [x] 3.1 Run `hugo --minify --environment production` and confirm home HTML includes the strip with 3–5 links; confirm `/posts/` does not
- [x] 3.2 Extend `specs/funkysi1701-test-plan.md` homepage scenario for the popular strip
- [x] 3.3 Extend `tests/homepage-navigation/homepage-loads.spec.ts` (`@smoke`) to assert the strip heading and a seeded href (e.g. `dotnet-5-to-10-features`)
- [x] 3.4 Run homepage smoke against local Hugo (`BASE_URL=http://127.0.0.1:1313`) and fix any failures

## 4. Automated Cloudflare refresh

- [x] 4.1 Add `scripts/home-popular/run.mjs` to query Cloudflare Web Analytics RUM top pages, normalise and validate post paths, preserve editorial titles, and safely rewrite `data/home_popular.toml`
- [x] 4.2 Add offline unit tests for Cloudflare query parsing, path canonicalisation, and TOML generation
- [x] 4.3 Add weekly/manual `home-popular-update.yml` workflow that opens a PR into `develop` only when the generated data changes
- [x] 4.4 Document Cloudflare secret/variable setup, local dry-run, schedule behaviour, and CI expectations
- [x] 4.5 Make homepage smoke assertions resilient to automated URL changes
