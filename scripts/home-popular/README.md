# Home popular links refresh

GitHub Actions workflow [`.github/workflows/home-popular-update.yml`](../../.github/workflows/home-popular-update.yml) runs [`run.mjs`](run.mjs) every Monday at 06:30 UTC (and on `workflow_dispatch`). It queries Cloudflare Web Analytics (RUM) for the site's most-viewed paths, keeps post permalinks that exist under `content/posts/`, rewrites [`data/home_popular.toml`](../../data/home_popular.toml), and opens a pull request into **develop** when the list changes. The data file drives the home **Popular right now** strip (`layouts/partials/home/popular.html`, issue #3464).

## Behaviour

- Queries `rumPageloadEventsAdaptiveGroups` over the last `POPULAR_DAYS` days (default 30), ordered by pageviews.
- Canonicalises paths (drops query strings such as `?ref=dailydev`, adds trailing slashes) and merges duplicate rows.
- Keeps only `/posts/YYYY/slug/` paths with a matching `content/posts/YYYY/slug.md` file; home, tags, and other pages are ignored.
- Preserves titles from the current data file (editorial labels survive refreshes); new entries fall back to the post's front matter `title`.
- Writes the top `POPULAR_COUNT` posts (default 5). Exits with code 2 (workflow skips, no PR) when fewer than 3 eligible posts are found.

## Configuration

| Name | Where | Required | Notes |
|------|-------|----------|-------|
| `CLOUDFLARE_API_TOKEN` | Repository **secret** | Yes | API token with **Account Analytics: Read** |
| `CLOUDFLARE_ACCOUNT_TAG` | Repository **variable** (or secret) | Yes | Account id (32 hex chars) — dashboard URL or account home |
| `CLOUDFLARE_SITE_TAG` | Repository **variable** (or secret) | Yes | Web Analytics `site_tag` (not the beacon `token`) |
| `POPULAR_DAYS` | env (optional) | No | Lookback window, default 30 (max 90) |
| `POPULAR_COUNT` | env (optional) | No | Links to keep, 3–5, default 5 |
| `DRY_RUN` | env / dispatch input | No | `true` prints the TOML without writing or opening a PR |

The workflow reads the tags from **Variables** first, then falls back to **Secrets**. If you only added them under Secrets, that works; Variables are preferred because the ids are not sensitive.

**Common gotcha:** Settings → Secrets and variables → Actions has two tabs. Values under **Secrets** are not visible to `${{ vars.* }}`. Use the **Variables** tab (or rely on the secrets fallback after this workflow update is on the branch the job uses).

The job checks out **`develop`**, so for `workflow_dispatch` pick a branch that already contains the updated workflow (or merge to `develop` first).

For a **local** run, export the same names in your shell; GitHub settings are not used:

```bash
# PowerShell
$env:CLOUDFLARE_API_TOKEN = "..."
$env:CLOUDFLARE_ACCOUNT_TAG = "..."
$env:CLOUDFLARE_SITE_TAG = "..."
$env:DRY_RUN = "true"
node scripts/home-popular/run.mjs
```

Drop `DRY_RUN` to write `data/home_popular.toml`, then commit as usual.
Run the offline unit tests with:

```bash
node --test scripts/home-popular/run.test.mjs
```

## Notes

- Cloudflare Web Analytics rankings will not match Lite Analytics exactly; this workflow makes Cloudflare the source of truth for the strip. Lite remains the source of truth for bounce / 2+ page depth KPIs (see [README Analytics](../../README.md#analytics-cloudflare-zaraz)).
- `schedule` triggers only run from the repository **default branch**; merge the workflow there before relying on the Monday cron.
- The homepage smoke test asserts the strip renders 3–5 post links (not specific URLs), so automated refreshes do not break CI.
