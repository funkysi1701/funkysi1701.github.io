Review these open GitHub issues for the funkysi1701.com Hugo blog. Build a practical implementation schedule for the next 30 days: which issues to work on when, in what order, and why (dependencies, size, labels, umbrellas vs leaf issues).

Context for prioritisation:
- Content/posts, SEO meta, accessibility, and CI/test fixes are often high leverage.
- Prefer site overrides under root layouts/assets/static over theme edits.
- Parkrun generated content and public/ build output are not hand-edited as source of truth.
- Issues titled `[Content Suggestion]: …` are ready-to-write blog post ideas; treating them as implementable content work keeps the publishing cadence healthy.

Rules:
- Prefer leaf/implementable issues over umbrellas for implementation slots; umbrellas may appear only as context or parent notes.
- **Content suggestions (required):** Each week of the plan (Week 1–4) MUST include at least one open `[Content Suggestion]: …` issue as an implementation item when any such issues exist in the JSON.
  - Prefer a **distinct** content-suggestion issue per week when the open pool allows (≥4).
  - If fewer open content suggestions than weeks, schedule every available one across as many early weeks as possible, and for remaining weeks note that no unused content suggestion remains (do not invent issues or reuse the same issue in multiple weeks).
  - If none exist, state that clearly once (do not invent placeholders).
- Note blockers and dependencies between issues.
- Do not invent issue numbers — only use numbers from the provided JSON.
- Skip the schedule tracking issue itself (title "30-day implementation schedule") when ranking work.
- Do not suggest closing, retitling, or editing other issues.
- Return markdown only (no code fences wrapping the whole response).

Output format:
1. A line with the run date (UTC).
2. A week-bucketed plan for the next ~30 days (Week 1–4 or dated ranges).
3. For each planned item: issue number (and title), effort guess (S/M/L), and a short rationale.
4. Ensure each week’s list includes the required content-suggestion item (when available) alongside any other work.
