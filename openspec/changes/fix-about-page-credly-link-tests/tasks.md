## 1. Update About page Playwright scenario

- [x] 1.1 In `tests/about-static-pages/about-page.spec.ts`, replace the FIXME and commented Credly click/`waitForEvent('page')` block with `toHaveAttribute('href', …)` asserts for Azure (`adacf718`) and AWS (`3aab54c8`) badge anchors
- [x] 1.2 Keep existing About steps (navigation, profile image, bio, badge visibility, specializations) and drop unused `context` if it is no longer referenced

## 2. Align scenario documentation

- [x] 2.1 Update `specs/funkysi1701-test-plan.md` scenario 2.1 steps/expected results so Credly coverage is href assertion (not click / new tab)

## 3. Verify

- [x] 3.1 Run the About page spec against a reachable `BASE_URL` (local Hugo or blog-dev/production default) and confirm it passes
- [x] 3.2 Confirm no remaining FIXME for Credly external links in `about-page.spec.ts`
