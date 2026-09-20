"""Merge duplicate blog tags in post front matter (ADO US 2997).

Rewrites `tags = [...]` in content/posts/**/*.md using a canonical map.
Deduplicates after merge. Preserves relative order of first occurrence.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POSTS = ROOT / "content" / "posts"

# Variant -> canonical (story 2997 + clear case/spacing siblings from inventory)
MERGES: dict[str, str] = {
    # Story table
    "StarTrek": "Star Trek",
    "Github": "GitHub",
    "github": "GitHub",
    "Powershell": "PowerShell",
    "podcast": "Podcast",
    "c-sharp": "C-Sharp",
    "microsoft": "Microsoft",
    "source control": "Source Control",
    "Javascript": "JavaScript",
    "JQuery": "jQuery",
    "career": "Career",
    "security": "Security",
    "website": "Website",
    "conference": "Conference",
    "ai": "AI",
    "technology": "Technology",
    "OpenSource": "Open Source",
    "open source": "Open Source",
    "UserGroups": "User Groups",
    "Nuget": "NuGet",
    # Cloud pass
    "cloud": "Cloud",
    "Clouds": "Cloud",
    # Extra case/spacing groups from inventory
    "architecture": "Architecture",
    "automation": "Automation",
    "BadDesign": "Bad Design",
    "community": "Community",
    "design patterns": "Design Patterns",
    "Leeds-Sharp": "LeedsSharp",
    "machine learning": "Machine Learning",
    "PatrickStewart": "Patrick Stewart",
    "productivity": "Productivity",
    "software development": "Software Development",
    "software-development": "Software Development",
    "tools": "Tools",
    "trekmate": "Trekmate",
    "Cert Manager": "cert-manager",
}

TAGS_RE = re.compile(
    r"^(tags\s*=\s*)\[(.*?)\]",
    re.MULTILINE | re.DOTALL,
)


def canonicalize(tags: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for t in tags:
        canon = MERGES.get(t, t)
        if canon not in seen:
            seen.add(canon)
            out.append(canon)
    return out


def format_tags(tags: list[str], original_inner: str) -> str:
    """Match compact vs spaced style from the original list."""
    compact = "\n" not in original_inner and ", " not in original_inner and original_inner.strip()
    if compact and "," in original_inner and ", " not in original_inner:
        # e.g. ["StarTrek","Patrick Stewart"]
        inner = ",".join(f'"{t}"' for t in tags)
    else:
        inner = ", ".join(f'"{t}"' for t in tags)
    # Preserve trailing space before ] if original had it: [ "a" ]
    trailing = " " if original_inner.endswith(" ") or original_inner.endswith("\n") else ""
    leading = " " if original_inner.startswith(" ") else ""
    if "\n" in original_inner:
        # Keep single-line for simplicity (posts use single-line tags)
        return f"{leading}{inner}{trailing}"
    return f"{leading}{inner}{trailing}"


def process_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("+++"):
        return False
    end = text.find("+++", 3)
    if end < 0:
        return False
    fm = text[3:end]
    m = TAGS_RE.search(fm)
    if not m:
        return False
    inner = m.group(2)
    tags = re.findall(r'"([^"]+)"', inner)
    if not tags:
        return False
    new_tags = canonicalize(tags)
    if new_tags == tags:
        return False
    new_inner = format_tags(new_tags, inner)
    new_fm = fm[: m.start()] + m.group(1) + "[" + new_inner + "]" + fm[m.end() :]
    new_text = "+++" + new_fm + "+++" + text[end + 3 :]
    # Preserve existing line endings (CRLF vs LF)
    newline = "\r\n" if "\r\n" in text else "\n"
    path.write_text(new_text, encoding="utf-8", newline=newline)
    return True


def main() -> None:
    changed = []
    for md in sorted(POSTS.rglob("*.md")):
        if process_file(md):
            changed.append(md.relative_to(ROOT).as_posix())
    print(f"Updated {len(changed)} files")
    for p in changed:
        print(f"  {p}")


if __name__ == "__main__":
    main()
