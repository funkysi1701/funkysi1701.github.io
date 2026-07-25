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
| `CLOUDFLARE_ACCOUNT_TAG` | Repository **variable** | Yes | Account id (32 hex chars) — dashboard URL or account home |
| `CLOUDFLARE_SITE_TAG` | Repository **variable** | Yes | Web Analytics site tag — from the site's beacon snippet / analytics dashboard URL |
| `POPULAR_DAYS` | env (optional) | No | Lookback window, default 30 (max 90) |
| `POPULAR_COUNT` | env (optional) | No | Links to keep, 3–5, default 5 |
| `DRY_RUN` | env / dispatch input | No | `true` prints the TOML without writing or opening a PR |

## Local run

```bash
CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_TAG=... CLOUDFLARE_SITE_TAG=... \
DRY_RUN=true node scripts/home-popular/run.mjs
```

Drop `DRY_RUN` to write `data/home_popular.toml`, then commit as usual.

Run the offline unit tests with:

```bash
node --test scripts/home-popular/run.test.mjs
```

## Notes

- Cloudflare Web Analytics rankings will not match Lite Analytics exactly; this workflow makes Cloudflare the source of truth for the strip.
- `schedule` triggers only run from the repository **default branch**; merge the workflow there before relying on the Monday cron.
- The homepage smoke test asserts the strip renders 3–5 post links (not specific URLs), so automated refreshes do not break CI.
