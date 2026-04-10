#!/usr/bin/env python3
"""Validate Hugo TOML front matter: description length must be in [MIN, MAX] (inclusive)."""

from __future__ import annotations

import argparse
import os
import sys
import tomllib
from dataclasses import dataclass
from pathlib import Path


MIN_LEN = 110
MAX_LEN = 160
POSTS_GLOB = "content/posts/**/*.md"


@dataclass
class Failure:
    path: str
    reason: str
    length: int | None
    description_preview: str


def split_front_matter(text: str) -> tuple[str | None, str | None]:
    if not text.startswith("+++"):
        return None, "File does not start with TOML front matter (+++)"
    parts = text.split("+++", 2)
    if len(parts) < 3:
        return None, "Missing closing +++ for front matter"
    return parts[1], None


def load_description(front_matter: str) -> tuple[str | None, str | None]:
    try:
        data = tomllib.loads(front_matter)
    except tomllib.TOMLDecodeError as e:
        return None, f"Invalid TOML front matter: {e}"
    if "description" not in data:
        return None, "Front matter has no `description` key"
    desc = data["description"]
    if not isinstance(desc, str):
        return None, f"`description` must be a string, got {type(desc).__name__}"
    return desc, None


def check_posts(repo_root: Path) -> tuple[list[Failure], int, int]:
    """Returns (failures, total_post_files, posts_with_string_description)."""
    failures: list[Failure] = []
    total_post_files = 0
    with_string_description = 0
    for path in sorted(repo_root.glob(POSTS_GLOB)):
        if not path.is_file():
            continue
        total_post_files += 1
        rel = path.relative_to(repo_root).as_posix()
        text = path.read_text(encoding="utf-8")
        fm, err = split_front_matter(text)
        if err:
            failures.append(Failure(rel, err, None, ""))
            continue
        assert fm is not None
        desc, err = load_description(fm)
        if err:
            failures.append(Failure(rel, err, None, ""))
            continue
        assert desc is not None
        with_string_description += 1
        n = len(desc)
        if n < MIN_LEN:
            failures.append(
                Failure(
                    rel,
                    f"Too short (minimum {MIN_LEN} characters)",
                    n,
                    desc,
                )
            )
        elif n > MAX_LEN:
            failures.append(
                Failure(
                    rel,
                    f"Too long (maximum {MAX_LEN} characters)",
                    n,
                    desc,
                )
            )
    return failures, total_post_files, with_string_description


def render_report(
    failures: list[Failure],
    total_post_files: int,
    with_string_description: int,
    repo_root: Path,
) -> str:
    in_range = with_string_description - len(
        [f for f in failures if f.length is not None]
    )
    lines = [
        "## Meta description length check",
        "",
        f"Blog posts must set front matter `description` to **{MIN_LEN}–{MAX_LEN} characters** (inclusive).",
        "",
        "### Summary",
        "",
        f"- **Markdown files under `content/posts/`**: {total_post_files}",
        f"- **Posts with a string `description`**: {with_string_description}",
        f"- **Descriptions in range ({MIN_LEN}–{MAX_LEN})**: {in_range}",
        f"- **Failures**: {len(failures)}",
        "",
        "### How to fix",
        "",
        f"1. Open each file below and edit the `description = \"...\"` line in the `+++` TOML block.",
        f"2. Aim for **{MIN_LEN}–{MAX_LEN}** characters. Count includes spaces and punctuation.",
        "3. Re-run the workflow or execute locally: `python scripts/check_meta_descriptions.py --root .`",
        "4. To rebuild descriptions from each post’s title, tags/keywords, and body (then edit for tone): `python scripts/normalize_meta_descriptions.py --root .`",
        "",
        "### Failures",
        "",
        "| File | Chars | Issue |",
        "|------|------:|-------|",
    ]
    for f in failures:
        chars = str(f.length) if f.length is not None else "—"
        esc_reason = f.reason.replace("|", "\\|")
        lines.append(f"| `{f.path}` | {chars} | {esc_reason} |")
    lines.extend(["", "### Current descriptions (for copy-edit)", ""])
    for f in failures:
        if not f.description_preview:
            continue
        preview = f.description_preview.replace("\n", " ").strip()
        if len(preview) > 300:
            preview = preview[:297] + "..."
        lines.append(f"- **`{f.path}`** ({len(f.description_preview)} chars): {preview}")
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
            "_Run locally with: `python scripts/check_meta_descriptions.py` from the repo root._"
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
    args = parser.parse_args()
    repo_root = args.root.resolve()
    failures, total_post_files, with_string_description = check_posts(repo_root)
    report = render_report(
        failures, total_post_files, with_string_description, repo_root
    )
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(report, encoding="utf-8")
    if failures:
        print(report, file=sys.stderr)
        return 1
    ok = with_string_description - len(
        [f for f in failures if f.length is not None]
    )
    print(
        f"OK: {ok}/{total_post_files} posts have descriptions in {MIN_LEN}–{MAX_LEN} characters."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
