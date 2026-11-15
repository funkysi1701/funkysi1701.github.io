## ADDED Requirements

### Requirement: Primary main-nav items are limited

The top application bar main menu MUST expose exactly these top-level page links: **About**, **Start Here**, **Projects**, and **Newsletter**, plus a **More** parent item for secondary destinations. Other former top-level items MUST NOT appear as siblings of those four outside More.

#### Scenario: Desktop shows four primaries and More

- **WHEN** a visitor views the main navigation on a wide viewport
- **THEN** About, Start Here, Projects, Newsletter, and More are present as top-level nav items

#### Scenario: Former primaries are not top-level

- **WHEN** a visitor views the main navigation top-level list
- **THEN** Tools & Resources, Contact, Events, and Search are not top-level siblings of About / Start Here / Projects / Newsletter

### Requirement: More dropdown retains secondary destinations

The More menu MUST include children linking to Tools & Resources, Contact, Events, and Search using the same permalinks as today (`/tools-and-resources/`, `/contact/`, `/posts/events/`, `/search/`).

#### Scenario: More contains Contact and Search

- **WHEN** a visitor opens the More dropdown (desktop) or expands the collapsed nav and opens More (mobile)
- **THEN** links to Contact and Search are available under More and navigate to `/contact/` and `/search/` respectively

#### Scenario: Tools and Events remain reachable

- **WHEN** a visitor follows Tools & Resources or Events under More
- **THEN** they land on `/tools-and-resources/` or `/posts/events/` without a URL scheme change

### Requirement: Nav slim-down is config-driven

Menu structure MUST be defined in site config menus (for example `config/_default/config.toml` `[Menus].main`) so editors can reorder without theme forks. Header markup MAY stay on the existing dropdown-capable override.

#### Scenario: Menu edit without theme rebase

- **WHEN** an editor changes More children weights or labels in site menu config
- **THEN** the next Hugo build reflects those labels/order without editing vendored theme menu templates for structure alone
