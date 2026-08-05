## Why

Traffic is concentrated on a few Lite Analytics landers (especially `/posts/2026/dotnet-5-to-10-features/` at ~16% with daily.dev, plus merge-two-projects, Nagios/Docker, stay-visible, auto-PRs, Grafana). Tag pages stay `noindex`, so second clicks depend on in-article bridges — Phase 1.3–1.4 of the analytics engagement plan ([#3466](https://github.com/funkysi1701/funkysi1701.github.io/issues/3466)).

## What Changes

- Expand **hand-picked sibling links** on the `.NET 5→10` post (`.NET` / Aspire / related evergreen internals), keeping external Microsoft docs as secondary.
- Add **light series/topic bridges** (short paragraphs or a shared shortcode) on other high-traffic .NET/DevOps landers named in the engagement set.
- Refresh [`content/start-here.md`](content/start-here.md) so the curated pillars list reflects current Lite winners and site pillars (not stale `.NET 7`-era favourites alone).
- Prefer **post permalinks** for discovery; do not rely on tag taxonomy pages as the primary bridge.

## Capabilities

### New Capabilities

- `lander-internal-bridges`: Hand-picked in-article topic bridges on top Lite landers, plus Start Here curated list refresh that points readers to posts (not tags) for discovery.

### Modified Capabilities

<!-- No existing openspec/specs/ capabilities in this repo yet. -->

## Impact

- **Content:** `content/posts/2026/dotnet-5-to-10-features.md` and other high-traffic landers (merge-two-projects, Nagios/Docker, stay-visible, automatic-pull-requests, Grafana); `content/start-here.md`.
- **Layouts (optional):** A small reusable shortcode under `layouts/shortcodes/` if bridges are standardized; otherwise inline Markdown only.
- **Tests:** Likely light Playwright or content assertions only if Start Here / lander link lists become contractually important; existing engagement footer (#3465) and home popular strip (#3464) stay untouched.
- **Out of scope:** Changing tag `noindex` policy, live analytics APIs, Zaraz (#3468), redesign of the template-level Related/Read next footer.
