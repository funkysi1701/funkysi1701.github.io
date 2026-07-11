# Weekly blog post idea

GitHub Actions workflow [`.github/workflows/blog-post-idea.yml`](../../.github/workflows/blog-post-idea.yml) runs this script every Wednesday at 09:00 UTC (and on `workflow_dispatch`). It catalogues published posts under `content/posts/` (compact text: top tags, recent posts with tags, older titles — capped for the GitHub Models ~8k token request limit), asks a chat model for one trend-aware post idea, and opens a GitHub issue titled **`[Content Suggestion]: …`**.

Same LLM auth pattern as [`scripts/issue-schedule/`](../issue-schedule/).

## Authentication (LLM)

**Default (no extra secret):** GitHub Models via `GITHUB_TOKEN` / `GH_TOKEN`.

| Name | Type | Required | Purpose |
|------|------|----------|---------|
| *(none)* | — | — | Workflow sets `permissions.models: read` and uses `GITHUB_TOKEN` |
| `ISSUE_PLANNER_API_KEY` | Repository **secret** | No | Override: Bearer token for any OpenAI-compatible API |
| `ISSUE_PLANNER_BASE_URL` | Repository **variable** | No | Override API base |
| `ISSUE_PLANNER_MODEL` | Repository **variable** | No | Model id (default `openai/gpt-4.1-mini` on GitHub Models) |

`schedule` triggers only run from the repository **default branch**. Merge the workflow there before relying on Wednesday cron. Use **Actions → Blog post idea → Run workflow** for a manual seed run (`dry_run` prints the issue without creating it).

## Local run

```bash
export GH_TOKEN=$(gh auth token)
export DRY_RUN=true
node scripts/blog-post-idea/run.mjs
```

Omit `DRY_RUN` to create the issue.

## Prompt

Instructions live in [`prompt.md`](prompt.md).
