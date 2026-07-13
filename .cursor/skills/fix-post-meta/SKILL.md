---
name: fix-post-meta
description: Check and fix blog post title and description lengths for SEO CI. Use when meta titles or descriptions fail length checks, after bulk front-matter edits, or when running check:meta / normalize_meta_descriptions.
---

# Fix post meta (titles and descriptions)

Enforce CI length rules on `content/posts/**/*.md`. Front-matter policy: [`.cursor/rules/content-posts.mdc`](../../rules/content-posts.mdc).

## Limits

| Field | Length (inclusive) |
|-------|--------------------|
| `title` | 50–60 characters |
| `description` | 110–160 characters |

Posts use TOML front matter in `+++` fences. British English (`locale = 'en-gb'`).

## Prerequisites

- Python 3.11+ on `PATH` (same as GitHub Actions meta workflows)
- Run from the repo root

## Steps

1. **Validate** (titles + descriptions):

   ```bash
   npm run check:meta
   ```

   Or separately: `npm run check:meta:titles`, `npm run check:meta:descriptions`.

2. **Preview description rewrites** (dry-run, no writes):

   ```bash
   npm run check:meta:fix
   ```

3. **Apply description fixes** when the dry-run looks right:

   ```bash
   python scripts/normalize_meta_descriptions.py --root .
   ```

4. **Fix titles by hand** when `check:meta:titles` fails — the normalizer targets descriptions only. Keep meaning; stay within 50–60 characters.

5. **Re-validate** until clean:

   ```bash
   npm run check:meta
   ```

## Guardrails

- Prefer the smallest edit that satisfies length and meaning.
- Do not invent SEO spam or change permalinks/`slug` unless asked.
- After bulk front-matter edits, always run `npm run check:meta` before opening a PR.
