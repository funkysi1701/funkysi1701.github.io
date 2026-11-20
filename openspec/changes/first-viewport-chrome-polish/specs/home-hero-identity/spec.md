## ADDED Requirements

### Requirement: Home hero leads with personal brand

When `params.homeHero` is configured, the homepage hero MUST present the author’s identity as the primary visual signal: the configured author avatar and display name appear before or as the main heading. The professional role line MUST be secondary supporting copy, not the sole brand mark.

#### Scenario: Hero shows avatar and name

- **WHEN** a visitor opens the homepage with home hero enabled and an author avatar configured
- **THEN** the hero includes the author avatar image with descriptive alt text and the author display name as the primary heading (`h1`)

#### Scenario: Role remains visible but secondary

- **WHEN** a visitor opens the homepage hero
- **THEN** a professional role or experience line is visible as supporting text (not competing as a second `h1`)

### Requirement: Start Here CTA is a primary button

The home hero Start Here call to action MUST render as a primary button-styled control linking to `/start-here/` (same destination as today). It MUST remain keyboard-focusable and meet WCAG AA contrast for button text on the primary background in light and dark modes (reuse existing dark-mode `.btn-primary` fixes where applicable).

#### Scenario: Hero CTA navigates to Start Here

- **WHEN** a visitor activates the home hero Start Here control
- **THEN** they navigate to the Start Here page (`/start-here/`)

#### Scenario: Hero CTA uses button styling

- **WHEN** the homepage hero is rendered
- **THEN** the Start Here control has primary button styling (for example Bootstrap `btn btn-primary`) rather than an undecorated text link alone

### Requirement: Hero uses site overrides only

Home hero identity markup and styles MUST live under root `layouts/` and `assets/` (and `params.homeHero` / author params in config). Vendored theme files MUST NOT be the place new hero identity behaviour is introduced.

#### Scenario: Build succeeds with overrides

- **WHEN** a production Hugo build runs after this change
- **THEN** the homepage includes the identity hero without requiring edits under `themes/hugo-theme-bootstrap/` for the new behaviour
