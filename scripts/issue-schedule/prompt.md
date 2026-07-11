Review these open GitHub issues for the funkysi1701.com Hugo blog. Build a practical implementation schedule for the next 30 days: which issues to work on when, in what order, and why (dependencies, size, labels, umbrellas vs leaf issues).

Context for prioritisation:
- Content/posts, SEO meta, accessibility, and CI/test fixes are often high leverage.
- Prefer site overrides under root layouts/assets/static over theme edits.
- Parkrun generated content and public/ build output are not hand-edited as source of truth.

Rules:
- Prefer leaf/implementable issues over umbrellas for implementation slots; umbrellas may appear only as context or parent notes.
- Note blockers and dependencies between issues.
- Do not invent issue numbers — only use numbers from the provided JSON.
- Skip the schedule tracking issue itself (title "30-day implementation schedule") when ranking work.
- Do not suggest closing, retitling, or editing other issues.
- Return markdown only (no code fences wrapping the whole response).

Output format:
1. A line with the run date (UTC).
2. A week-bucketed plan for the next ~30 days (Week 1–4 or dated ranges).
3. For each planned item: issue number (and title), effort guess (S/M/L), and a short rationale.
