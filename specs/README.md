# Specs

This directory holds test plans for the Playwright suite under `tests/`. The main document is **`funkysi1701-test-plan.md`**; Playwright test spec files under `tests/` must link to it (or another scenario doc here) with a `// spec: specs/...` comment at the top of the file.

```bash
npm run check:spec-headers
```

CI runs the same check via [`.github/workflows/spec-headers.yml`](../.github/workflows/spec-headers.yml) and before Playwright in the reusable E2E workflow.

**Smoke subset:** Homepage load, 404, and sitemap scenarios are tagged `@smoke` and run on every PR via [`playwright-smoke.yml`](../.github/workflows/playwright-smoke.yml) (`npm run test:smoke`) against a local Hugo server.
