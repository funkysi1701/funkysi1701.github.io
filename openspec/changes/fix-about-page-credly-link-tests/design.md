## Context

About page E2E coverage in `tests/about-static-pages/about-page.spec.ts` already checks load, profile image, bio, badge visibility, and specializations. Certification badge "click and verify Credly opens in a new tab" steps are commented with a FIXME (#3601). Source links in `content/about.md` are plain `<a href="https://www.credly.com/badges/…">` without `target="_blank"`. Contact page tests already assert `href` (and `target` where the markup has it) instead of navigating to third parties — that pattern is the model here, except About credly links must not assert `target="_blank"` unless content changes.

## Goals / Non-Goals

**Goals:**

- Prove both Credly badge anchors exist and point at the correct public badge URLs.
- Remove FIXME and dead commented navigation code.
- Keep the scenario deterministic offline / without Credly availability.
- Keep `specs/funkysi1701-test-plan.md` aligned with the implemented steps.

**Non-Goals:**

- Changing About Markdown (e.g. adding `target="_blank"` / `rel`).
- Mocking Credly HTTP responses or proxying third parties.
- Restoring same-tab or new-tab click navigation in this test.
- Broad refactors of other external-link specs (footer/projects may still navigate).

## Decisions

1. **Assert `href` via Playwright `toHaveAttribute`, do not click**  
   - **Why:** Matches contact-page pattern for durable CI; avoids Credly bot blocking, DNS, and new-tab assumptions.  
   - **Alternatives:** Re-enable `waitForEvent('page')` (fails because no `target="_blank"`); same-tab `goto` via click (depends on Credly); route intercept after click (more machinery for little gain).

2. **Match badge UUIDs already in content and the commented selectors**  
   - Azure: `adacf718`  
   - AWS: `3aab54c8`  
   - **Why:** Stable identifiers already present in markup and prior test intent; regex on `href` with UUID substring is enough without brittle full-URL equality.

3. **Do not assert `target="_blank"`**  
   - **Why:** Content has no such attribute; asserting it would be a failing test against intentional product state, or force a content change outside #3601.  
   - **Alternative:** Add `target="_blank" rel="noopener noreferrer"` in `about.md` in a follow-up if product wants new-tab behaviour (then contact-style target assert becomes valid).

4. **Update scenario plan steps 6–9 to attribute checks**  
   - **Why:** Spec header `// spec: specs/funkysi1701-test-plan.md` requires traceability; leaving "opens in new tab" would diverge from the test.

## Risks / Trade-offs

- **[Risk] Href-only does not prove the link is clickable / navigation works** → **Mitigation:** Visibility + `href` is the accepted trade-off already used on contact; monthly link crawler (`link.yml`) still exercises live URLs from production.
- **[Risk] Badge UUID change breaks the test when certifications renew** → **Mitigation:** Intentional — test documents canonical badge IDs; update content and regex together when Credly badges rotate.
- **[Trade-off] Spec scenario softens from "click Credly" to "assert Credly href"** → Acceptable for flakiness acceptance criteria in #3601.
