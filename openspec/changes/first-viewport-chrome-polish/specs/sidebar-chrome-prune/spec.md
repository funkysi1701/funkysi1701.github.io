## ADDED Requirements

### Requirement: Sidebar omits redundant featured posts

The site sidebar MUST NOT render the Featured Posts widget. Profile, search, Episode Atlas (when enabled), recent posts, tags, and social/archive widgets MAY remain. TOC behaviour on posts MUST remain available where the theme already shows it.

#### Scenario: Home sidebar has no Featured Posts heading

- **WHEN** a visitor opens the homepage
- **THEN** the sidebar does not contain a “Featured Posts” heading or featured-posts list

#### Scenario: Recent posts and tags remain for discovery

- **WHEN** a visitor opens the homepage
- **THEN** the sidebar still exposes Recent Posts and the Tags chips section

### Requirement: Years archive appears once

The sidebar MUST render at most one Years archive section. Duplicate Years blocks from the vendored theme social partial MUST be removed via a root `layouts/` override (not by editing committed theme behaviour as the long-term source of truth beyond the override).

#### Scenario: Single Years heading

- **WHEN** a visitor opens any page that includes the sidebar social/archive block
- **THEN** exactly one sidebar heading labelled “Years” is present (or the Years block is omitted entirely if the year taxonomy is empty)

### Requirement: List cards show capped topical tags only

On homepage and other post list cards, taxonomy badges in post meta MUST include only the `tags` taxonomy and MUST show at most three badges. Year and month taxonomy terms MUST NOT appear as list-card badges.

#### Scenario: Home list hides year and month badges

- **WHEN** a visitor views the homepage post list
- **THEN** post cards do not show year or month taxonomy badges (for example `2026` or `2026-09` as `.post-taxonomy` chips)

#### Scenario: Home list caps tag chips

- **WHEN** a post on the homepage has more than three tags
- **THEN** at most three tag badges are rendered on that list card

### Requirement: Single posts keep full tag labels

On a single post page, all `tags` terms for that post SHOULD be shown in post meta. Year and month taxonomies MUST still be omitted from badge chips (date remains in the post date element).

#### Scenario: Article meta lists tags without year chips

- **WHEN** a visitor opens a post that has several tags plus year/month terms
- **THEN** post meta shows the topical tag badges and does not show separate year/month badge chips
