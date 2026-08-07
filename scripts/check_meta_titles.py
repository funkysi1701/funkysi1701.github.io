#!/usr/bin/env python3
"""Validate Hugo post titles against the production HTML <title> length.

For non-home pages, `layouts/partials/head/title.html` builds:

    {front matter title} - {Site.Title}

Production `Site.Title` is `Funky Si's Blog` (`config/production/config.toml`
and `config/_default/config.toml`). The separator is a space-dash-space
(`titleSeparator` defaults to `-`).

The 50–60 character budget applies to that **full rendered** string, not the
front matter `title` alone. With the production suffix (` - Funky Si's Blog`,
18 characters), front matter titles should therefore be **32–42 characters**.

Preview environments append a longer site title (e.g. blog-dev:
`Funky Si's Blog (Dev)`); this checker always uses the production suffix,
which is the SEO budget that matters for www.funkysi1701.com.
"""

from __future__ import annotations

import argparse
import os
import sys
import tomllib
from dataclasses import dataclass
from pathlib import Path


# Keep in sync with config/production/config.toml `title` and
# layouts/partials/head/title.html (default separator "-").
PROD_SITE_TITLE = "Funky Si's Blog"
TITLE_SEPARATOR = " - "
TITLE_SUFFIX = f"{TITLE_SEPARATOR}{PROD_SITE_TITLE}"
SUFFIX_LEN = len(TITLE_SUFFIX)  # 18

MIN_RENDERED_LEN = 50
MAX_RENDERED_LEN = 60
MIN_FRONT_MATTER_LEN = MIN_RENDERED_LEN - SUFFIX_LEN  # 32
MAX_FRONT_MATTER_LEN = MAX_RENDERED_LEN - SUFFIX_LEN  # 42

# Back-compat aliases used in a few call sites / mental models.
MIN_LEN = MIN_RENDERED_LEN
MAX_LEN = MAX_RENDERED_LEN

POSTS_GLOB = "content/posts/**/*.md"


@dataclass
class Failure:
    path: str
    reason: str
    length: int | None  # rendered length when known
    title_preview: str
    front_matter_length: int | None = None


def rendered_title(page_title: str) -> str:
    """Return the production HTML <title> Hugo would emit for a post."""
    return f"{page_title}{TITLE_SUFFIX}"


def split_front_matter(text: str) -> tuple[str | None, str | None]:
    if not text.startswith("+++"):
        return None, "File does not start with TOML front matter (+++)"
    parts = text.split("+++", 2)
    if len(parts) < 3:
        return None, "Missing closing +++ for front matter"
    return parts[1], None


def load_title(front_matter: str) -> tuple[str | None, str | None]:
    try:
        data = tomllib.loads(front_matter)
    except tomllib.TOMLDecodeError as e:
        return None, f"Invalid TOML front matter: {e}"
    if "title" not in data:
        return None, "Front matter has no `title` key"
    title = data["title"]
    if not isinstance(title, str):
        return None, f"`title` must be a string, got {type(title).__name__}"
    return title, None


def resolve_post_paths(repo_root: Path, files: list[Path] | None) -> list[Path]:
    """Return post markdown paths to check (all posts, or an explicit subset)."""
    if not files:
        return sorted(p for p in repo_root.glob(POSTS_GLOB) if p.is_file())

    resolved: list[Path] = []
    for raw in files:
        path = raw if raw.is_absolute() else (repo_root / raw)
        path = path.resolve()
        try:
            rel = path.relative_to(repo_root).as_posix()
        except ValueError:
            raise SystemExit(f"File is outside repository root: {raw}") from None
        if not rel.startswith("content/posts/") or not rel.endswith(".md"):
            raise SystemExit(
                f"Not a post markdown path under content/posts/: {rel}"
            )
        if not path.is_file():
            raise SystemExit(f"File not found: {rel}")
        resolved.append(path)
    return sorted(set(resolved))


def check_posts(
    repo_root: Path, files: list[Path] | None = None
) -> tuple[list[Failure], int, int]:
    """Returns (failures, total_post_files, posts_with_string_title)."""
    failures: list[Failure] = []
    total_post_files = 0
    with_string_title = 0
    for path in resolve_post_paths(repo_root, files):
        total_post_files += 1
        rel = path.relative_to(repo_root).as_posix()
        text = path.read_text(encoding="utf-8")
        fm, err = split_front_matter(text)
        if err:
            failures.append(Failure(rel, err, None, ""))
            continue
        assert fm is not None
        title, err = load_title(fm)
        if err:
            failures.append(Failure(rel, err, None, ""))
            continue
        assert title is not None
        with_string_title += 1
        fm_len = len(title)
        rendered = rendered_title(title)
        n = len(rendered)
        if n < MIN_RENDERED_LEN:
            failures.append(
                Failure(
                    rel,
                    (
                        f"Rendered title too short (minimum {MIN_RENDERED_LEN} "
                        f"characters including `{TITLE_SUFFIX}`)"
                    ),
                    n,
                    title,
                    front_matter_length=fm_len,
                )
            )
        elif n > MAX_RENDERED_LEN:
            failures.append(
                Failure(
                    rel,
                    (
                        f"Rendered title too long (maximum {MAX_RENDERED_LEN} "
                        f"characters including `{TITLE_SUFFIX}`)"
                    ),
                    n,
                    title,
                    front_matter_length=fm_len,
                )
            )
    return failures, total_post_files, with_string_title


def render_report(
    failures: list[Failure],
    total_post_files: int,
    with_string_title: int,
    repo_root: Path,
) -> str:
    in_range = with_string_title - len(
        [f for f in failures if f.length is not None]
    )
    lines = [
        "## Meta title length check",
        "",
        (
            f"Blog posts are checked against the **production HTML `<title>`**: "
            f"`{{front matter title}}{TITLE_SUFFIX}` "
            f"(see `layouts/partials/head/title.html`)."
        ),
        "",
        (
            f"That full string must be **{MIN_RENDERED_LEN}–{MAX_RENDERED_LEN} "
            f"characters** (inclusive). The suffix "
            f"`{TITLE_SUFFIX}` is **{SUFFIX_LEN}** characters, so front matter "
            f"`title` should usually be "
            f"**{MIN_FRONT_MATTER_LEN}–{MAX_FRONT_MATTER_LEN}** characters."
        ),
        "",
        "### Summary",
        "",
        f"- **Markdown files under `content/posts/`**: {total_post_files}",
        f"- **Posts with a string `title`**: {with_string_title}",
        (
            f"- **Rendered titles in range "
            f"({MIN_RENDERED_LEN}–{MAX_RENDERED_LEN})**: {in_range}"
        ),
        f"- **Failures**: {len(failures)}",
        "",
        "### How to fix",
        "",
        "1. Open each file below and edit the `title = \"...\"` line in the `+++` TOML block.",
        (
            f"2. Aim for a front matter title of "
            f"**{MIN_FRONT_MATTER_LEN}–{MAX_FRONT_MATTER_LEN}** characters so the "
            f"rendered production title "
            f"(`{{title}}{TITLE_SUFFIX}`) lands in "
            f"**{MIN_RENDERED_LEN}–{MAX_RENDERED_LEN}**. Count includes spaces "
            f"and punctuation."
        ),
        "3. Re-run the workflow or execute locally: `python scripts/check_meta_titles.py --root .`",
        "",
        "### Failures",
        "",
        "| File | FM chars | Rendered | Issue |",
        "|------|---------:|---------:|-------|",
    ]
    for f in failures:
        fm_chars = (
            str(f.front_matter_length)
            if f.front_matter_length is not None
            else "—"
        )
        rendered_chars = str(f.length) if f.length is not None else "—"
        esc_reason = f.reason.replace("|", "\\|")
        lines.append(
            f"| `{f.path}` | {fm_chars} | {rendered_chars} | {esc_reason} |"
        )
    lines.extend(["", "### Current titles (for copy-edit)", ""])
    for f in failures:
        if not f.title_preview:
            continue
        preview = f.title_preview.replace("\n", " ").strip()
        rendered = rendered_title(f.title_preview)
        lines.append(
            f"- **`{f.path}`** (front matter {len(f.title_preview)} → "
            f"rendered {len(rendered)}): {preview}"
        )
        lines.append(f"  - Rendered: `{rendered}`")
        lines.append("")
    server = os.environ.get("GITHUB_SERVER_URL", "").rstrip("/")
    repo = os.environ.get("GITHUB_REPOSITORY", "")
    run_id = os.environ.get("GITHUB_RUN_ID", "")
    run_url = (
        f"{server}/{repo}/actions/runs/{run_id}" if server and repo and run_id else ""
    )
    footer = ["", "---", ""]
    if run_url:
        footer.append(f"_Triggered by [GitHub Actions run]({run_url})._")
    else:
        footer.append(
            "_Run locally with: `python scripts/check_meta_titles.py` from the repo root._"
        )
    lines.extend(footer)
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root",
        type=Path,
        default=Path.cwd(),
        help="Repository root (default: current directory)",
    )
    parser.add_argument(
        "--report",
        type=Path,
        default=None,
        help="Write Markdown report to this path",
    )
    parser.add_argument(
        "--files",
        nargs="+",
        type=Path,
        default=None,
        help="Limit checks to these post paths (relative to --root or absolute)",
    )
    args = parser.parse_args()
    repo_root = args.root.resolve()
    failures, total_post_files, with_string_title = check_posts(
        repo_root, files=args.files
    )
    report = render_report(failures, total_post_files, with_string_title, repo_root)
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(report, encoding="utf-8")
    if failures:
        print(report, file=sys.stderr)
        return 1
    ok = with_string_title - len([f for f in failures if f.length is not None])
    print(
        f"OK: {ok}/{total_post_files} posts have rendered production titles "
        f"in {MIN_RENDERED_LEN}–{MAX_RENDERED_LEN} characters "
        f"(front matter typically {MIN_FRONT_MATTER_LEN}–{MAX_FRONT_MATTER_LEN} "
        f"+ `{TITLE_SUFFIX}`)."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
