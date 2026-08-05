## ADDED Requirements

### Requirement: Dominant .NET lander exposes hand-picked sibling links

The post at `/posts/2026/dotnet-5-to-10-features/` MUST include a visible in-article bridge (for example an expanded **Further reading** or **Related on this blog** section) with hand-picked internal links covering at least .NET version/language follow-ons and Aspire-related evergreen posts. The bridge MUST use post permalinks (or Start Here), not tag taxonomy URLs, as primary destinations. External documentation links MAY remain but MUST NOT be the only outbound suggestions from that section.

#### Scenario: .NET lander offers internal siblings

- **WHEN** a visitor reads the `.NET 5→10` features post through to the further-reading / related bridge
- **THEN** the page includes at least three distinct internal post permalinks spanning .NET follow-ons and Aspire-related content

#### Scenario: Bridge avoids tag discovery

- **WHEN** the `.NET 5→10` related bridge is rendered
- **THEN** it does not rely on `/tags/...` URLs as the means of discovery for those siblings

### Requirement: Other high-traffic landers carry light topic bridges

Each of the following posts MUST include a light in-article topic bridge (short paragraph and/or compact list of roughly 2–4 internal links) to thematically related evergreen posts: merge-two-projects, Nagios/Docker monitoring, stay-visible (career visibility), automatic pull requests, and Grafana setup. Bridges MUST prefer post permalinks over tag pages. Stay-visible MAY weave links into an existing closing section instead of adding a new heading when that reads more naturally.

#### Scenario: DevOps lander bridges to a sibling

- **WHEN** a visitor finishes a named DevOps lander (for example Grafana or Nagios/Docker)
- **THEN** the page offers at least two internal post links on a related monitoring, containers, or automation topic

#### Scenario: Git / automation landers cross-link

- **WHEN** a visitor finishes merge-two-projects or automatic-pull-requests
- **THEN** the page links to at least one other Git/automation evergreen on the site

### Requirement: Start Here curated list reflects current pillars

The Start Here page (`content/start-here.md`, URL `/start-here/`) MUST present a curated multi-section list of recommended posts that includes the dominant `.NET 5→10` lander and other current Lite / pillar evergreen posts (Aspire-related, DevOps/automation, and visibility/career as appropriate). The curated sections MUST NOT lead primarily with obsolete stand-alone favourites (such as treating `.NET 7` as the sole .NET entry) when newer pillar posts exist.

#### Scenario: Start Here features .NET 5→10

- **WHEN** a visitor opens `/start-here/`
- **THEN** the curated recommendations include a link to `/posts/2026/dotnet-5-to-10-features/`

#### Scenario: Start Here includes Lite pillar variety

- **WHEN** a visitor opens `/start-here/`
- **THEN** the curated list includes at least one Aspire-related post and at least one DevOps/automation or career-visibility evergreen beyond the .NET version lander

### Requirement: Discovery does not depend on tag pages

In-article lander bridges and the Start Here primary curated recommendations MUST use internal post or key static-page permalinks for discovery. Tag taxonomy URLs MUST NOT be the primary mechanism those surfaces use to send readers to related content. Secondary archival navigation (for example All Posts) remains allowed.

#### Scenario: Start Here Explore More avoids tag-first discovery

- **WHEN** a visitor uses Start Here’s explore / next-step links after the curated list
- **THEN** those links do not rely on `/tags/...` destinations as the primary topic browse path (All Posts, Tools, About, Newsletter, or equivalent post/page links are acceptable)

#### Scenario: Lander bridges use post permalinks

- **WHEN** a named high-traffic lander’s topic bridge is rendered
- **THEN** its related destinations are post (or Start Here / projects / similar page) permalinks rather than tag index URLs
