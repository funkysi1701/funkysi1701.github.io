## ADDED Requirements

### Requirement: About certification badges expose Credly hrefs without off-site navigation

The About page Playwright scenario SHALL verify that both certification badge anchors are visible and that their `href` attributes point at the expected Credly public badge URLs. The scenario MUST NOT navigate to credly.com (no click-driven same-tab or new-tab navigation) and MUST NOT require `target="_blank"` on those anchors.

#### Scenario: Azure Fundamentals badge href

- **WHEN** the About page is loaded in Playwright
- **THEN** an anchor matching Credly badge id `adacf718` is visible
- **AND** that anchor's `href` matches `/credly\.com/` and includes `adacf718`

#### Scenario: AWS Cloud Practitioner badge href

- **WHEN** the About page is loaded in Playwright
- **THEN** an anchor matching Credly badge id `3aab54c8` is visible
- **AND** that anchor's `href` matches `/credly\.com/` and includes `3aab54c8`

#### Scenario: No third-party Credly navigation in the About links step

- **WHEN** the About page certification link step runs
- **THEN** Playwright remains on the About page URL
- **AND** the step completes without waiting for a popup page or navigating to credly.com
