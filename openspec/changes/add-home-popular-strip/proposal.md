## Why

Home is ~10% of Lite Analytics pageviews but only offers a hero CTA plus a chronological archive, so visitors must scroll to find a second click. A short curated **Popular right now** strip above the post list turns home into a gateway to proven landers (especially `.NET 5→10` and other evergreen winners), which is Phase 1.2 of the analytics engagement plan ([#3464](https://github.com/funkysi1701/funkysi1701.github.io/issues/3464)).

## What Changes

- Add a home-only **Popular right now** strip (3–5 links) above the chronological post list in `layouts/partials/list.html`.
- Drive the links from a **data- or params-backed curated list** (not hardcoded URLs scattered through templates), seeded from Lite Analytics top pages with `?ref=` variants combined mentally.
- Style the strip to match existing Bootstrap theme overrides (lean, single-purpose; not a card-heavy promo wall).
- Extend homepage Playwright coverage so the strip heading and at least one seeded link are asserted.

## Capabilities

### New Capabilities

- `home-popular-strip`: Home-page curated popular links strip — placement above the post list, data-driven curation, seed set from Lite top pages, accessible markup, and smoke test expectations.

### Modified Capabilities

<!-- No existing openspec/specs/ capabilities in this repo yet. -->

## Impact

- **Layouts:** `layouts/partials/list.html` plus a new home popular partial under `layouts/partials/`.
- **Config / data:** New curated list under `data/` or `config/_default/` (prefer the existing home-params pattern over template hardcoding).
- **Assets:** Modest CSS in `assets/css/custom.css` aligned with `home-hero` / post-engagement styles.
- **Tests / specs:** `tests/homepage-navigation/homepage-loads.spec.ts` and `specs/funkysi1701-test-plan.md`.
- **Out of scope:** Live analytics API, Start Here content refresh (#3466/#3467), post footers (#3465), Zaraz changes (#3468).
