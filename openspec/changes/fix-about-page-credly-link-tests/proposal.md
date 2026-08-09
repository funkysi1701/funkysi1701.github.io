## Why

[#3601](https://github.com/funkysi1701/funkysi1701.github.io/issues/3601) flags a FIXME in `tests/about-static-pages/about-page.spec.ts`: certification badge steps comment out Credly navigation because external sites can block or flake in Playwright. The commented design also assumes `target="_blank"`, but `content/about.md` Credly anchors have no new-tab attribute — so restoring the click/`waitForEvent('page')` path would fail for the wrong reason. We need a reliable assertion of badge destinations that matches how contact-page social links already avoid third-party navigation.

## What Changes

- Replace the FIXME/commented Credly click steps with **href assertions** for both Azure Fundamentals (`adacf718…`) and AWS Cloud Practitioner (`3aab54c8…`) badge links.
- Keep existing About page visibility checks (profile, bio, badge images, specializations).
- Align `specs/funkysi1701-test-plan.md` scenario 2.1 so expected steps describe attribute checks, not Credly new-tab navigation.
- Do **not** change About page content or add `target="_blank"` in this change (content/UX is out of scope for the flakiness fix).

## Capabilities

### New Capabilities

- `about-page-credly-link-tests`: Reliable Playwright coverage that About certification badges point at the expected Credly public badge URLs without navigating off-site.

### Modified Capabilities

<!-- No existing openspec/specs/ capabilities in this repo yet. -->

## Impact

- **Tests:** `tests/about-static-pages/about-page.spec.ts`
- **Scenario docs:** `specs/funkysi1701-test-plan.md` (About page content and links)
- **Content:** none
- **CI:** Full Playwright suite / blog-dev gate only (not `@smoke`); should become deterministically green for this scenario
- **Closes:** [#3601](https://github.com/funkysi1701/funkysi1701.github.io/issues/3601)
