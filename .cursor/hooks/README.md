# funkysi1701.com Cursor hooks

Optional agent guards wired from [`.cursor/hooks.json`](../hooks.json). Requires **Python 3.11+** (post meta) and **Node.js** (shell/stop/session) on PATH. Cursor reloads hooks on save; use **Settings → Hooks** / Hooks output if debugging.

| Event | Script | Behaviour |
|-------|--------|-----------|
| `sessionStart` | `session-start.mjs` | Clears edit state; injects a short workflow reminder |
| `afterFileEdit` / `postToolUse` | `validate-post-meta.py` | If the edited file is under `content/posts/**/*.md`, runs meta title/description checks for that file |
| `afterFileEdit` | `after-file-edit.mjs` | Records edited paths; scans new text for secret-like patterns |
| `beforeShellExecution` | `before-shell-guard.mjs` | Asks before force-push, `reset --hard`, `git clean -f`, recursive deletes of core paths |
| `stop` | `agent-stop-checklist.mjs` | One follow-up (`loop_limit: 1`) if docs/security/tech-debt gaps look relevant |

Session state lives in `.cursor/hooks/state/` (gitignored).

## Disable

Remove or comment out entries in `hooks.json` (JSON has no comments — delete the array item). To silence only the stop follow-up, remove the `stop` block. Meta validation alone is still useful for post SEO gates.

## Tech-debt hotspots

Stop reminders for hotspot edits read [`.github/tech-debt-hotspots.txt`](../../.github/tech-debt-hotspots.txt). Docs reminders follow [`docs/AI_CONTEXT.md`](../../docs/AI_CONTEXT.md).
