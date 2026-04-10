#!/usr/bin/env python3
"""
Rewrite Hugo post `description` fields using only that post's title, tags, and body text.

Descriptions are trimmed or extended to MIN_LEN–MAX_LEN (inclusive) by combining real
sentences from the article—no generic blog boilerplate.
"""

from __future__ import annotations

import argparse
import re
import sys
import tomllib
from pathlib import Path

MIN_LEN = 110
MAX_LEN = 160
POSTS_GLOB = "content/posts/**/*.md"

DESCRIPTION_LINE = re.compile(
    r"^description\s*=\s*\"((?:[^\"\\]|\\.)*)\"\s*$", re.MULTILINE
)

FENCE = re.compile(r"```.*?```", re.DOTALL)
SHORTCODE = re.compile(r"\{\{<[^>]+>\}\}|\{\{%[^%]+%\}\}")
HTML_BLOCK = re.compile(r"<(?:script|blockquote|figure|iframe)[^>]*>.*?</(?:script|blockquote|figure|iframe)\b[^>]*>", re.DOTALL | re.IGNORECASE)
HTML_TAG = re.compile(r"<[^>]+>")
HTML_ENTITY = re.compile(r"&(?:[a-zA-Z]+|#\d+|#x[0-9a-fA-F]+);")
URL = re.compile(r"https?://\S+")
MD_IMAGE = re.compile(r"!\[([^\]]*)\]\([^)]*\)")
MD_LINK = re.compile(r"\[([^\]]+)\]\([^)]*\)")
MD_HEADER = re.compile(r"^#{1,6}\s+", re.MULTILINE)
BOLD = re.compile(r"\*\*([^*]+)\*\*")
ITALIC = re.compile(r"(?<!\*)\*([^*]+)\*(?!\*)")
INLINE_CODE = re.compile(r"`([^`]+)`")
TABLE_ROW = re.compile(r"^\|.*\|\s*$", re.MULTILINE)


def _is_markdown_table_separator_line(line_st: str) -> bool:
    inner = line_st.strip()
    if not (inner.startswith("|") and inner.endswith("|")):
        return False
    cells = [c.strip().replace(" ", "") for c in inner.strip("|").split("|")]
    if not cells:
        return False
    return all(cell and all(ch in "-:" for ch in cell) for cell in cells)


def split_front_matter(text: str) -> tuple[str | None, str | None, str | None]:
    if not text.startswith("+++"):
        return None, None, None
    parts = text.split("+++", 2)
    if len(parts) < 3:
        return None, None, None
    return parts[0], parts[1], parts[2]


def escape_toml_double(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ").replace("\r", " ")


def _is_event_table_header_row(cells: list[str]) -> bool:
    cl = [c.strip().lower() for c in cells if c.strip()]
    return len(cl) >= 3 and "date" in cl and "location" in cl


def markdown_table_cells_plain(body: str) -> str:
    """Turn markdown pipe tables into plain text (for event listings, etc.)."""
    chunks: list[str] = []
    for line in body.splitlines():
        line_st = line.strip()
        if not (line_st.startswith("|") and line_st.endswith("|")):
            continue
        if _is_markdown_table_separator_line(line_st):
            continue
        inner = [c.strip() for c in line_st.strip("|").split("|") if c.strip()]
        if _is_event_table_header_row(inner):
            continue
        cells: list[str] = []
        for c in inner:
            c = MD_LINK.sub(r"\1", c)
            c = MD_IMAGE.sub(r"\1", c)
            c = HTML_TAG.sub(" ", c)
            c = " ".join(c.split())
            if c:
                cells.append(c)
        if cells:
            chunks.append(" ".join(cells))
    return " ".join(chunks)


def markdown_body_to_plain(body: str, max_chars: int = 14000) -> str:
    t = body[:max_chars]
    t = FENCE.sub(" ", t)
    t = SHORTCODE.sub(" ", t)
    t = HTML_BLOCK.sub(" ", t)
    t = HTML_TAG.sub(" ", t)
    t = HTML_ENTITY.sub(" ", t)
    t = URL.sub(" ", t)
    t = MD_IMAGE.sub(" ", t)
    t = MD_LINK.sub(r"\1", t)
    t = MD_HEADER.sub("", t)
    t = TABLE_ROW.sub(" ", t)
    t = BOLD.sub(r"\1", t)
    t = ITALIC.sub(r"\1", t)
    t = INLINE_CODE.sub(r"\1", t)
    t = re.sub(r"^>\s?", "", t, flags=re.MULTILINE)
    t = re.sub(r"^[-*+]\s+", "", t, flags=re.MULTILINE)
    t = re.sub(r"^\d+\.\s+", "", t, flags=re.MULTILINE)
    t = re.sub(r"[#*_`>|]+", " ", t)
    t = " ".join(t.split())
    t = t.strip()
    tbl = markdown_table_cells_plain(body[:max_chars])
    if tbl:
        t = f"{t} {tbl}".strip()
        t = " ".join(t.split())
    return t


def sentence_chunks(plain: str) -> list[str]:
    """Split into sentence-like segments; keep order."""
    if not plain:
        return []
    chunks: list[str] = []
    pos = 0
    n = len(plain)
    while pos < n:
        m = re.search(r"[.!?](?:\s+|$)", plain[pos:])
        if not m:
            tail = plain[pos:].strip()
            if tail:
                chunks.append(tail)
            break
        end = pos + m.end()
        piece = plain[pos:end].strip()
        if piece:
            chunks.append(piece)
        pos = end
    return [c for c in chunks if len(c) >= 2]


def grow_with_comma_clauses(text: str, plain: str, min_len: int) -> str:
    """If sentences are not enough, add clauses split on '; ' or '. '."""
    if len(text) >= min_len:
        return text
    extra = plain
    if text:
        extra = extra.replace(text, " ", 1).strip()
    for sep in ("; ", ". "):
        parts = [p.strip() for p in extra.split(sep) if len(p.strip()) > 15]
        for p in parts:
            if len(text) >= min_len:
                break
            if p not in text:
                text = f"{text} {p}".strip()
                if sep == "; " and not text.endswith((".", "!", "?")):
                    text = text.rstrip(";") + "."
    return text


def truncate_to_range(s: str) -> str:
    s = s.strip()
    s = " ".join(s.split())
    if len(s) <= MAX_LEN:
        return s
    window = s[: MAX_LEN + 1]
    dot = window.rfind(". ")
    if dot >= MIN_LEN - 1:
        return s[: dot + 1].strip()
    dot2 = window.rfind("? ")
    if dot2 >= MIN_LEN - 1:
        return s[: dot2 + 1].strip()
    dot3 = window.rfind("! ")
    if dot3 >= MIN_LEN - 1:
        return s[: dot3 + 1].strip()
    max_body = MAX_LEN - 1
    cut = s[:max_body]
    sp = cut.rfind(" ")
    if sp >= MIN_LEN:
        cut = cut[:sp]
    cut = cut.rstrip(" .,;:!—-")
    return cut + "…"


def description_from_content(title: str, tags: list[str], body: str) -> str:
    plain = markdown_body_to_plain(body)
    chunks = sentence_chunks(plain)

    parts: list[str] = []
    total = 0
    for c in chunks:
        if total >= MIN_LEN:
            break
        if c in " ".join(parts):
            continue
        parts.append(c)
        total = len(" ".join(parts))

    desc = " ".join(parts).strip()

    if len(desc) < MIN_LEN and title.strip():
        prefix = title.strip()
        if not desc.startswith(prefix[:20]):
            desc = f"{prefix}. {desc}".strip()
            desc = " ".join(desc.split())

    if len(desc) < MIN_LEN:
        desc = grow_with_comma_clauses(desc, plain, MIN_LEN)

    if len(desc) < MIN_LEN and tags:
        tag_str = ", ".join(t for t in tags if t)[:80]
        if tag_str:
            extra = f"Topics include {tag_str}."
            desc = f"{desc} {extra}".strip()
            desc = " ".join(desc.split())

    if len(desc) < MIN_LEN and plain:
        need = MIN_LEN - len(desc) - 1
        take = plain[len(desc) : len(desc) + need + 40]
        take = take[: need + 40]
        sp = take.rfind(" ", 0, need + 25)
        if sp > 10:
            take = take[:sp]
        desc = f"{desc} {take}".strip()
        desc = " ".join(desc.split())

    if len(desc) < MIN_LEN:
        desc = (desc + " " + plain[:200]).strip()
        desc = " ".join(desc.split())

    desc = truncate_to_range(desc)

    while len(desc) < MIN_LEN and plain:
        more = plain[len(desc) : len(desc) + (MIN_LEN - len(desc)) + 30]
        more = more.lstrip(".,; ")
        if not more or more in desc:
            break
        desc = f"{desc} {more}".strip()
        desc = truncate_to_range(desc)
        desc = " ".join(desc.split())

    return desc


def replace_fm_description(fm: str, new_desc: str) -> str | None:
    esc = escape_toml_double(new_desc)
    new_line = f'description = "{esc}"'

    def repl(_: re.Match[str]) -> str:
        return new_line

    updated, n = DESCRIPTION_LINE.subn(repl, fm, count=1)
    if n != 1:
        return None
    return updated


def process_file(path: Path, repo_root: Path, dry_run: bool) -> tuple[bool, str]:
    rel = path.relative_to(repo_root).as_posix()
    text = path.read_text(encoding="utf-8")
    pre, fm, body = split_front_matter(text)
    if fm is None:
        return False, f"{rel}: skip (no TOML front matter)"
    try:
        data = tomllib.loads(fm)
    except tomllib.TOMLDecodeError as e:
        return False, f"{rel}: skip (TOML error: {e})"

    title = data.get("title", "")
    if not isinstance(title, str):
        title = str(title)

    raw_tags = data.get("tags", [])
    tags: list[str] = []
    if isinstance(raw_tags, list):
        tags = [str(t) for t in raw_tags if t]
    raw_kw = data.get("keywords", [])
    if isinstance(raw_kw, list):
        tags.extend(str(k) for k in raw_kw if k)
    seen: set[str] = set()
    deduped: list[str] = []
    for x in tags:
        if x and x not in seen:
            seen.add(x)
            deduped.append(x)
    tags = deduped

    new_desc = description_from_content(title, tags, body)
    new_desc = " ".join(new_desc.split())

    if not (MIN_LEN <= len(new_desc) <= MAX_LEN):
        return False, f"{rel}: could not fit content to {MIN_LEN}–{MAX_LEN} (got {len(new_desc)})"

    old = data.get("description")
    old_s = old if isinstance(old, str) else ""

    new_fm = replace_fm_description(fm, new_desc)
    if new_fm is None:
        return False, f"{rel}: could not replace description line"

    if new_desc == old_s.strip():
        return False, f"{rel}: unchanged ({len(new_desc)} chars)"

    if not dry_run:
        path.write_text(pre + "+++" + new_fm + "+++" + body, encoding="utf-8", newline="\n")
    return True, f"{rel}: {len(old_s)} -> {len(new_desc)} chars"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path.cwd())
    ap.add_argument(
        "--dry-run",
        action="store_true",
        help="Print changes only; do not write files",
    )
    args = ap.parse_args()
    root = args.root.resolve()
    changed = 0
    failed: list[str] = []
    for path in sorted(root.glob(POSTS_GLOB)):
        if not path.is_file():
            continue
        ok, msg = process_file(path, root, args.dry_run)
        if ok:
            changed += 1
            print(msg)
        elif "unchanged" not in msg:
            failed.append(msg)
    if failed:
        print("\nErrors:", file=sys.stderr)
        for f in failed:
            print(f, file=sys.stderr)
        return 1
    print(
        f"\n{'Would update' if args.dry_run else 'Updated'} {changed} file(s).",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
