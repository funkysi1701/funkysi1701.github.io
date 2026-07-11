# Weekly tech-debt scan

GitHub Actions workflow [`.github/workflows/tech-debt-scan.yml`](../../.github/workflows/tech-debt-scan.yml) runs every **Friday at 09:00 UTC** (and on `workflow_dispatch`).

It gathers codebase signals (known hotspots, large layouts/scripts/tests/workflows, `TODO`/`FIXME`/`HACK` markers), asks an LLM which **new** issues are warranted, and creates them with the `tech-debt` label (plus a priority label). Fingerprints in the issue body prevent duplicates on later runs.

Same pattern as Episode Atlas (`EpisodeTracker` `scripts/tech-debt-scan/`), adapted for this Hugo blog.

## Auth

Same as the [30-day issue schedule](../issue-schedule/README.md): GitHub Models via `GITHUB_TOKEN` by default; optional `ISSUE_PLANNER_API_KEY` / `ISSUE_PLANNER_*` variables.

`schedule` triggers only run from the repository **default branch**.

## Local run

```bash
export GH_TOKEN=$(gh auth token)
export DRY_RUN=true
node scripts/tech-debt-scan/run.mjs
```

Omit `DRY_RUN` to create issues. Cap with `TECH_DEBT_MAX_ISSUES` (default 5).

## Prompt

See [`prompt.md`](prompt.md).
