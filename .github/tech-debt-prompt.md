Scan this funkysi1701.com Hugo blog codebase snapshot for **actionable tech debt** that deserves a new GitHub issue.

Context: Hugo site (`content/`, `layouts/`, `assets/`, `static/`), Playwright tests, GitHub Actions → Azure Static Web Apps, parkrun scrape script, meta/SEO checks. Prefer site overrides under root `layouts/`/`assets/`/`static/` — do not propose editing `themes/hugo-theme-bootstrap/` (frozen HBS v0.65.1 fork; do not rebase onto upstream v1) or committing `public/`.

You receive compact JSON with:
1. Open issues (for deduplication; `fp` = tech-debt fingerprint when present)
2. Codebase signals (hotspot sizes, large tracked files, TODO/FIXME/HACK markers, conventions)

Rules:
- Propose **at most** `maxNewIssues` new issues (see JSON). Prefer high-impact maintainability debt over nitpicks.
- Do **not** propose issues already covered by an open issue (same topic/title/area/fingerprint).
- Do **not** invent file paths — only cite paths present in the signals.
- Skip style nits, missing docs alone, content/editorial ideas, and speculative rewrites without evidence.
- Skip hand-editing the parkrun generated block; that is owned by `scripts/update_parkrun_results.py`.
- Skip re-flagging `layouts/partials/head.html` for being small/thin — it is an intentional orchestrator; only propose head/SEO debt when a concrete bug or missing signal is evident in the signals.
- Each issue must be implementable as a discrete engineering task (CI, layouts, scripts, tests, config).
- Prefer leaf issues over umbrellas.

Return **JSON only** (no markdown fences) with this shape:
{
  "issues": [
    {
      "fingerprint": "stable-kebab-id",
      "title": "Short imperative title",
      "body": "Markdown: problem, evidence (paths), suggested approach, acceptance criteria",
      "priority": "high" | "medium" | "low"
    }
  ],
  "notes": "Optional one-line summary of what you skipped and why"
}

If nothing warrants a new issue, return `"issues": []`.
