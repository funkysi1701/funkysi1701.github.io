#!/usr/bin/env python3
"""Cursor hook: after editing a post, validate meta title/description lengths.

Reads hook JSON from stdin. For `content/posts/**/*.md` only, runs the repo
meta checkers scoped to the touched file. On failure, prints a clear message
and (for postToolUse) returns `additional_context` so the agent can fix it.

Non-post edits are a no-op (exit 0, empty stdout).
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path


POSTS_PREFIX = "content/posts/"
TITLE_SCRIPT = "scripts/check_meta_titles.py"
DESC_SCRIPT = "scripts/check_meta_descriptions.py"


def repo_root_from_payload(payload: dict) -> Path:
    roots = payload.get("workspace_roots") or []
    if roots:
        return Path(roots[0]).resolve()
    # hooks.json commands run with cwd = project root
    return Path.cwd().resolve()


def extract_file_path(payload: dict) -> str | None:
    event = payload.get("hook_event_name") or ""
    if event == "afterFileEdit" or "file_path" in payload:
        path = payload.get("file_path")
        return path if isinstance(path, str) and path else None

    tool_input = payload.get("tool_input")
    if isinstance(tool_input, str):
        try:
            tool_input = json.loads(tool_input)
        except json.JSONDecodeError:
            return None
    if isinstance(tool_input, dict):
        for key in ("path", "file_path", "target_notebook"):
            value = tool_input.get(key)
            if isinstance(value, str) and value:
                return value
    return None


def to_repo_relative(repo_root: Path, file_path: str) -> str | None:
    path = Path(file_path)
    if not path.is_absolute():
        path = (repo_root / path).resolve()
    else:
        path = path.resolve()
    try:
        return path.relative_to(repo_root).as_posix()
    except ValueError:
        return None


def is_post_markdown(rel: str) -> bool:
    return rel.startswith(POSTS_PREFIX) and rel.endswith(".md")


def run_checker(repo_root: Path, script: str, rel: str) -> tuple[int, str]:
    proc = subprocess.run(
        [sys.executable, script, "--root", str(repo_root), "--files", rel],
        cwd=repo_root,
        capture_output=True,
        text=True,
    )
    out = (proc.stderr or "").strip() or (proc.stdout or "").strip()
    return proc.returncode, out


def emit_feedback(payload: dict, message: str) -> None:
    print(message, file=sys.stderr)
    event = payload.get("hook_event_name") or ""
    tool_name = payload.get("tool_name") or ""
    # postToolUse can inject context into the agent conversation
    if event == "postToolUse" or tool_name:
        json.dump({"additional_context": message}, sys.stdout)
        sys.stdout.write("\n")


def main() -> int:
    raw = sys.stdin.read()
    if not raw.strip():
        return 0
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError:
        # Do not block the agent on malformed hook input
        print("validate-post-meta: ignoring invalid JSON on stdin", file=sys.stderr)
        return 0

    repo_root = repo_root_from_payload(payload)
    file_path = extract_file_path(payload)
    if not file_path:
        return 0

    rel = to_repo_relative(repo_root, file_path)
    if not rel or not is_post_markdown(rel):
        return 0

    if sys.version_info < (3, 11):
        emit_feedback(
            payload,
            "Post meta validation hook requires Python 3.11+ on PATH "
            f"(found {sys.version.split()[0]} via {sys.executable}). "
            "Install 3.11+ or run `npm run check:meta` manually.",
        )
        return 0

    failures: list[str] = []
    for script, label in (
        (TITLE_SCRIPT, "title"),
        (DESC_SCRIPT, "description"),
    ):
        code, output = run_checker(repo_root, script, rel)
        if code != 0:
            failures.append(f"### Meta {label} check failed for `{rel}`\n\n{output}")

    if not failures:
        return 0

    message = (
        "Post front matter meta validation failed after edit. "
        "Fix `title` (50–60 chars) and/or `description` (110–160 chars), "
        "then re-save. Run `npm run check:meta` or see `.cursor/skills/fix-post-meta`.\n\n"
        + "\n\n".join(failures)
    )
    emit_feedback(payload, message)

    # Exit 0 so a failing meta check does not crash the hook runner;
    # feedback is via stderr / additional_context.
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
