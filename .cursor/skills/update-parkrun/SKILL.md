---
name: update-parkrun
description: Refresh parkrun results in content/parkrun.md via the scraper script. Use when updating parkrun results, scraping parkrun.org.uk, editing the parkrun page generated block, or applying parkrun suppressions.
---

# Update parkrun results

Run the scraper; never hand-edit the generated block. Full policy: [`.cursor/rules/parkrun-generated.mdc`](../../rules/parkrun-generated.mdc).

## Prerequisites

- Python 3 with pip
- Network access to parkrun.org.uk (GitHub-hosted runners are often blocked)

## Steps

1. Install deps (once per environment):

   ```bash
   pip install -r scripts/requirements-parkrun.txt
   ```

2. Run the updater from the repo root:

   ```bash
   python scripts/update_parkrun_results.py
   ```

3. Review the diff for `content/parkrun.md` — only the region between `<!-- BEGIN PARKRUN_GENERATED -->` and `<!-- END PARKRUN_GENERATED -->` should change from the script.

4. If a scraped row should be omitted (e.g. DNF), add it to `data/parkrun_suppress.json` and re-run the script. Do not delete rows by hand inside the generated block.

5. Manual notes, other races, and walks stay **below** the generated markers — edit those by hand only.

## Optional environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `PARKRUN_ID` | `11453050` | Parkrunner ID |
| `PARKRUN_BASE` | `https://www.parkrun.org.uk` | Base URL |
| `PARKRUN_STRICT` | unset | Fail instead of skip when parkrun blocks the client |

## CI alternative

Workflow **Update parkrun results** (`.github/workflows/parkrun-update.yml`) opens a PR to **`develop`** when the scrape succeeds. If the runner is blocked (403/405), run locally and commit instead.

## Validation

- Confirm markers still wrap only generated content.
- Spot-check a recent result against parkrun.org.uk.
- Do not commit secrets; the script needs no API keys.
