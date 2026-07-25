## 1. Curation data

- [ ] 1.1 Add `data/home_popular.toml` with ordered `[[items]]` (`title`, `url`) seeded from Lite top pages: `.NET 5→10`, merge-two-projects, stay-visible, Grafana, automatic-pull-requests (5 items; exclude `/`)
- [ ] 1.2 Add a short comment in the data file noting Lite Analytics as the seed source and that `?ref=` variants map to the same URL

## 2. Layout and styles

- [ ] 2.1 Create `layouts/partials/home/popular.html` that reads `.Site.Data.home_popular.items`, renders a labelled section + link list when 1+ items exist, and no-ops when empty
- [ ] 2.2 Call the partial from `layouts/partials/list.html` on `.IsHome` only, after the home hero and before `.posts`
- [ ] 2.3 Add lean `.home-popular` styles in `assets/css/custom.css` consistent with `.home-hero` / `.post-engagement` (no cards)

## 3. Verification

- [ ] 3.1 Run `hugo --minify --environment production` and confirm home HTML includes the strip with 3–5 links; confirm `/posts/` does not
- [ ] 3.2 Extend `specs/funkysi1701-test-plan.md` homepage scenario for the popular strip
- [ ] 3.3 Extend `tests/homepage-navigation/homepage-loads.spec.ts` (`@smoke`) to assert the strip heading and a seeded href (e.g. `dotnet-5-to-10-features`)
- [ ] 3.4 Run homepage smoke against local Hugo (`BASE_URL=http://127.0.0.1:1313`) and fix any failures
