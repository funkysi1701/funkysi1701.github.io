## ADDED Requirements

### Requirement: Home shows a curated Popular strip above the post list

The site SHALL render a **Popular right now** (or equivalent) strip on the homepage only, placed above the chronological post list and below any home hero. The strip MUST contain between 3 and 5 links inclusive when curation data is present. Non-home list pages MUST NOT show the strip.

#### Scenario: Homepage displays popular links

- **WHEN** a visitor opens the site homepage and curated popular items are configured
- **THEN** a popular strip appears above the post list with a clear heading and 3–5 internal links

#### Scenario: Non-home lists omit the strip

- **WHEN** a visitor opens a non-home list or section page (for example `/posts/`)
- **THEN** the popular strip is not rendered

#### Scenario: Empty curation hides the strip

- **WHEN** curated popular items are missing or empty
- **THEN** the homepage still builds and the popular strip is omitted without errors

### Requirement: Popular links are data-driven

Popular strip destinations and display titles MUST be defined in a single Hugo data or site-params source (not hardcoded URL lists inside layout markup). Editors MUST be able to change the curated set by editing that source alone.

#### Scenario: Update list without template edits

- **WHEN** an editor changes titles or URLs in the popular curation data file (or equivalent params)
- **THEN** the next Hugo build reflects those links in the home strip without requiring layout markup changes for the link list

### Requirement: Curation is refreshed automatically from Cloudflare Web Analytics

A scheduled GitHub Actions workflow SHALL query Cloudflare Web Analytics (RUM top pages) weekly, rewrite the popular curation data file with the top 3–5 eligible post permalinks, and open a pull request into `develop` when the list changes. The refresh MUST drop non-post paths and query-string variants, MUST only include posts whose content files exist, and MUST preserve editorial titles already present in the data file. When fewer than 3 eligible posts are found the workflow MUST skip without modifying the data file.

#### Scenario: Weekly refresh opens a PR

- **WHEN** the scheduled refresh runs and Cloudflare top pages produce a different top-post set than the current data file
- **THEN** a pull request into `develop` is opened updating only the popular curation data file

#### Scenario: Insufficient data skips safely

- **WHEN** Cloudflare top pages contain fewer than 3 eligible post permalinks
- **THEN** the workflow exits successfully with a skip notice and the data file is unchanged

### Requirement: Initial seed reflects Lite Analytics top pages

The initial curated set MUST be seeded from Lite Analytics top landing pages for the site, combining query-string variants such as `?ref=dailydev` into a single destination when ranking. The seed MUST include the dominant `.NET 5 to 10` post and other high-traffic evergreen posts named in the engagement plan (for example merge-two-projects, stay-visible, Grafana, and/or auto-PRs), totalling 3–5 distinct post URLs. The homepage itself MUST NOT appear as a popular strip item.

#### Scenario: Seed includes top landers

- **WHEN** the change ships with its initial curation
- **THEN** the popular strip includes `/posts/2026/dotnet-5-to-10-features/` and at least two other Lite-seeded post permalinks from the engagement plan set

### Requirement: Strip layout matches existing home overrides

The popular strip MUST use site overrides under root `layouts/` and `assets/` (not vendored theme edits). Markup and CSS MUST stay lean and consistent with existing Bootstrap theme overrides (text links in a compact section; not a card grid or KPI strip).

#### Scenario: Accessible compact section

- **WHEN** the popular strip is rendered
- **THEN** it is a single labelled section with a list of text links and no card-style promo tiles

### Requirement: Homepage smoke test covers the strip

Homepage Playwright coverage MUST assert that the popular strip is visible on `/` with between 3 and 5 post links. Assertions MUST NOT depend on specific post URLs, because the curated list is refreshed automatically. The assertion SHOULD remain part of the `@smoke` homepage scenario so PR Hugo smoke catches regressions.

#### Scenario: Smoke detects missing strip

- **WHEN** the homepage smoke test runs against a built site that includes the popular strip
- **THEN** the test fails if the popular heading is absent or the strip does not contain 3–5 post links
