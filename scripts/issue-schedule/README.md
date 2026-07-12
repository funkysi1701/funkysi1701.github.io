# 30-day issue schedule planner

GitHub Actions workflow [`.github/workflows/issue-schedule.yml`](../../.github/workflows/issue-schedule.yml) runs this script every Monday at 09:00 UTC (and on `workflow_dispatch`). It lists open issues, calls a chat model once, and creates or updates the issue titled **30-day implementation schedule**.

Same pattern as Episode Atlas (`EpisodeTracker` `scripts/issue-schedule/`).

## Authentication (LLM)

**Default (no extra secret):** GitHub Models via `GITHUB_TOKEN` / `GH_TOKEN`.

| Name | Type | Required | Purpose |
|------|------|----------|---------|
| *(none)* | — | — | Workflow sets `permissions.models: read` and uses `GITHUB_TOKEN` |
| `ISSUE_PLANNER_API_KEY` | Repository **secret** | No | Override: Bearer token for any OpenAI-compatible API |
| `ISSUE_PLANNER_BASE_URL` | Repository **variable** | No | Override API base (default GitHub Models or OpenAI depending on key) |
| `ISSUE_PLANNER_MODEL` | Repository **variable** | No | Model id (default `openai/gpt-4.1-mini` on GitHub Models) |

### Optional custom API key

```bash
gh secret set ISSUE_PLANNER_API_KEY --repo funkysi1701/funkysi1701.github.io
gh variable set ISSUE_PLANNER_MODEL --body "gpt-4.1-mini" --repo funkysi1701/funkysi1701.github.io
gh variable set ISSUE_PLANNER_BASE_URL --body "https://api.openai.com/v1" --repo funkysi1701/funkysi1701.github.io
```

`schedule` triggers only run from the repository **default branch**. Merge the workflow there before relying on Monday cron. Use **Actions → 30-day issue schedule → Run workflow** for a manual seed run (`dry_run` prints the body without writing an issue).

## Local run

GitHub Models needs a PAT (or `gh` token) with the `models` scope:

```bash
export GH_TOKEN=$(gh auth token)
export DRY_RUN=true
node scripts/issue-schedule/run.mjs
```

Omit `DRY_RUN` to create/update the tracking issue.

## Prompt

Instructions live in [`prompt.md`](prompt.md).
