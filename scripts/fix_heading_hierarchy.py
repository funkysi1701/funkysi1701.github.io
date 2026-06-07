#!/usr/bin/env python3
"""Promote in-content Markdown headings so they follow the theme post <h1> title."""

from __future__ import annotations

import argparse
import re
from pathlib import Path

HEADING_RE = re.compile(r"^(#{1,6})(\s+.*)$")


def split_front_matter(text: str) -> tuple[str, str, str]:
    if not text.startswith("+++"):
        return "", text, ""
    end = text.find("\n+++", 3)
    if end == -1:
        return "", text, ""
    end += len("\n+++")
    return text[: end + 1], text[end + 1 :], ""


def heading_level(line: str) -> int | None:
    match = HEADING_RE.match(line)
    if not match:
        return None
    return len(match.group(1))


def has_hierarchy_skip(levels: list[int]) -> bool:
    prev = 1  # theme renders post title as h1
    for level in levels:
        if level > prev + 1:
            return True
        prev = level
    return False


def set_heading_level(line: str, new_level: int) -> str:
    match = HEADING_RE.match(line)
    if not match:
        return line
    return "#" * new_level + match.group(2)


def normalize_heading_levels(levels: list[int]) -> list[int]:
    fixed: list[int] = []
    prev = 1  # theme renders post title as h1
    for level in levels:
        new_level = max(2, min(level, prev + 1))
        fixed.append(new_level)
        prev = new_level
    return fixed


def iter_body_lines(body: str):
    """Yield (line_index, line, in_code_fence) for body lines."""
    in_fence = False
    lines = body.splitlines(keepends=True)
    for idx, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith("```"):
            in_fence = not in_fence
        yield idx, line, in_fence


def fix_content(content: str) -> tuple[str, bool]:
    lines = content.splitlines(keepends=True)
    levels: list[tuple[int, int]] = []
    for idx, line, in_fence in iter_body_lines(content):
        if in_fence:
            continue
        level = heading_level(line.rstrip("\r\n"))
        if level is not None:
            levels.append((idx, level))

    if not levels:
        return content, False

    ordered_levels = [level for _, level in levels]
    if not has_hierarchy_skip(ordered_levels):
        return content, False

    fixed_levels = normalize_heading_levels(ordered_levels)
    changed = False
    new_lines = list(lines)
    for (idx, _), fixed_level in zip(levels, fixed_levels, strict=True):
        line = lines[idx]
        old = line.rstrip("\r\n")
        updated = set_heading_level(old, fixed_level)
        if updated != old:
            changed = True
            suffix = "\r\n" if line.endswith("\r\n") else ("\n" if line.endswith("\n") else "")
            new_lines[idx] = updated + suffix

    return "".join(new_lines), changed


def process_file(path: Path, dry_run: bool) -> bool:
    text = path.read_text(encoding="utf-8")
    front, body, _ = split_front_matter(text)
    fixed_body, changed = fix_content(body)
    if not changed:
        return False
    if not dry_run:
        path.write_text(front + fixed_body, encoding="utf-8", newline="\n")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("."))
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    posts_dir = args.root / "content" / "posts"
    changed_files: list[Path] = []
    for path in sorted(posts_dir.rglob("*.md")):
        if process_file(path, args.dry_run):
            changed_files.append(path)

    for path in changed_files:
        rel = path.relative_to(args.root)
        print(f"{'would fix' if args.dry_run else 'fixed'}: {rel}")
    print(f"Total: {len(changed_files)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
