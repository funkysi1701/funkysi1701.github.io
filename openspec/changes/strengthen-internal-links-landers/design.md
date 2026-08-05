## Context

[#3464](https://github.com/funkysi1701/funkysi1701.github.io/issues/3464) ships a home Popular strip and [#3465](https://github.com/funkysi1701/funkysi1701.github.io/issues/3465) adds a template-level “Read next” footer from Hugo Related. Those help, but Related is algorithmic and tags stay `noindex` — so editors still need **hand-picked in-article bridges** on the top Lite landers ([#3466](https://github.com/funkysi1701/funkysi1701.github.io/issues/3466)).

Current state:

- `.NET 5→10` already has a **Further reading** section mixing Microsoft docs with a short “My earlier posts” line (dotnet7, dotnet9, Blazor/.NET 10, Aspire). That is a start, not a full sibling set.
- Other named landers (merge-two-projects, Nagios/Docker, stay-visible, automatic-pull-requests, Grafana) mostly end with newsletter CTAs and few or no topical internal links.
- [`content/start-here.md`](content/start-here.md) still leads with older favourites (e.g. `.NET 7`) and steers “Explore More” through **tag URLs** (`/tags/azure/`, `/tags/devops/`, `/tags/dotnet/`).

Constraints: British English; stable permalinks; do not branch CTAs on `?ref=dailydev`; keep bridges light so ~3m avg session duration is not hurt by wall-of-links clutter; prefer root content edits over theme changes.

## Goals / Non-Goals

**Goals:**

- Hand-picked sibling links on the `.NET 5→10` post covering .NET, Aspire, and related evergreen internals.
- Light topic bridges (2–4 links each) on other high-traffic .NET/DevOps landers from the engagement set.
- Refresh Start Here pillars so curated destinations match current Lite winners / site pillars.
- Discovery via **post (and key page) permalinks**, not tag taxonomies.

**Non-Goals:**

- Changing tag `noindex` or taxonomy templates.
- Replacing Hugo Related / the engagement footer (#3465).
- Auto-generating bridges from analytics.
- Redesigning Start Here layout/cover beyond list refresh and Explore More link-graph fix.
- Embedding Lite.js or Zaraz changes (#3468).

## Decisions

### 1. Inline Markdown bridges over a shared shortcode (default)

**Choice:** Add a short closing (or mid-body) section on each lander — e.g. heading **Related on this blog** or expand existing **Further reading** — with 2–4 hand-picked internal links in prose or a compact bullet list. Prefer **inline Markdown** in each post.

**Alternatives considered:**

- Shared Hugo shortcode (`layouts/shortcodes/related-links.html`) — useful if many posts share identical markup chrome, but each lander’s siblings differ; a shortcode adds indirection without much reuse. Revisit only if the same list shape lands on 6+ posts and styling needs shared HTML.
- Front-matter `related` arrays rendered by a partial — more structure, but heavier than the issue’s “light bridges” wording and duplicates Related footer concerns.

### 2. Expand `.NET 5→10` Further reading (primary lander)

**Choice:** Keep external Microsoft links; turn the internal line into a clearer sibling list (or split “Official docs” vs “On this blog”). Suggested internal set (adjust at apply time if a post is retired):

| Destination | Why |
| ----------- | --- |
| `/posts/2024/aspire/` | Named Aspire evergreen |
| `/posts/2025/adding-elasticsearch-with-aspire/` | Strong Lite / Aspire follow-on |
| `/posts/2025/whats-new-csharp/` | Language parallel to the version tour |
| `/posts/2025/blazor-and-dotnet10/` | Already linked; keep |
| `/posts/2024/dotnet9/` | Already linked; keep |
| Optional: `/start-here/` | Escape hatch to curated pillars |

Omit relying on tag pages. Keep total bullets scannable (roughly ≤6 internal + a few official).

### 3. Light bridges on other landers

**Choice:** One short section (or paragraph before the newsletter CTA) on each of:

| Lander | Suggested sibling themes |
| ------ | ------------------------ |
| `merge-two-projects-into-one` | Auto-PRs, GitHub Actions / Git history posts |
| `monitoring-with-nagios-docker` | Grafana; optionally older Nagios context |
| `stay-visible-as-a-developer-when-you-are-made-redundant` | Already has some links; add 1–2 career/community bridges if gaps remain (projects, Start Here) without duplicating the long conclusion |
| `automatic-pull-requests` | merge-two-projects, GitHub Actions posts |
| `setting-up-grafana` | Nagios/Docker; Aspire metrics mention already exists — link Aspire intro if natural |

Tone: one job per section — “if you came for X, also try Y” — not a second archive.

### 4. Start Here refresh

**Choice:** Rewrite the three pillar sections so listed posts include current Lite winners and pillars, for example:

- **Cloud & modern development:** Aspire, Elasticsearch + Aspire, Learning Kubernetes (keep or swap by traffic/editorial fit).
- **.NET & development:** `.NET 5→10` (lead), What’s new with C#, Blazor/.NET 10 or festive checker as secondary.
- **DevOps & automation / career:** merge-two-projects, Grafana or auto-PRs, stay-visible (career visibility fits “start here” better than hiding it).

**Explore More:** Keep All Posts, Tools & Resources, About, Newsletter. **Remove or demote tag links** as primary discovery so Start Here does not teach readers to use `noindex` taxonomies for navigation. Optional single “browse the archive” link is enough.

Update front-matter `description` if the teaser no longer matches (keep 110–160 if CI ever treats pages like posts; Start Here is a page — still keep a sensible meta description).

### 5. Verification

**Choice:** Manual / Hugo build check is enough for content-only edits. Optionally assert Start Here lists `/posts/2026/dotnet-5-to-10-features/` in an existing Playwright content spec **only if** one already covers `/start-here/` lightly — do not invent a heavy suite for soft curation.

Success metric (product): second pageviews from top 5 landers without hurting ~3m avg duration — measured in Lite after ship; not an automated CI gate.

## Risks / Trade-offs

- **[Overlinking hurts dwell time]** Too many CTAs at the end → Mitigation: 2–4 siblings per lander; no duplicate of the whole Related footer.
- **[Stale Start Here again]** Manual list drifts → Mitigation: align with Popular / Lite winners when refreshing; note in PR that #3467 evergreen pass can re-tune.
- **[Broken permalinks]** Typo in Markdown → Mitigation: use known paths from the content tree; monthly link crawl.
- **[Stay-visible already long]** Extra section feels bolted on → Mitigation: weave 1–2 links into Closing thoughts instead of a new heading if cleaner.
- **[Shortcode temptation]** Premature abstraction → Mitigation: Markdown first; shortcode only if apply finds copy-paste chrome.

## Migration Plan

1. Edit `.NET 5→10` Further reading first (highest traffic).
2. Add light bridges to the other named landers.
3. Refresh `start-here.md` pillars + Explore More.
4. Local `hugo server -D` smoke: open each lander and Start Here; confirm links resolve.
5. Ship via normal PR → `develop` → production; watch Lite second-pageview rate on top landers for 1–2 weeks.

Rollback: revert the content commits; no template/data schema dependency if shortcode is skipped.

## Open Questions

- Exact sibling picks among near-equivalents (e.g. Nagios vs Octopus Energy on Start Here DevOps) — resolve editorially at apply time using current Lite + pillar balance.
- Whether stay-visible needs a dedicated “Related” heading vs woven links only — prefer woven if the conclusion is already link-rich.
