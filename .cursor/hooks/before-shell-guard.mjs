#!/usr/bin/env node
import { readStdinJson, writeJson } from "./lib.mjs";

const input = await readStdinJson();
const command = String(input.command || "");

const rules = [
  {
    re: /\bgit\s+push\b[^|&;]*\s(--force|-f)\b/i,
    permission: "ask",
    user_message: "Force-push detected. Confirm only if this is intentional and not main/master/develop.",
    agent_message: "Hook paused a force-push. Prefer a normal push unless the user explicitly wants force.",
  },
  {
    re: /\bgit\s+reset\s+--hard\b/i,
    permission: "ask",
    user_message: "git reset --hard discards local work. Confirm before continuing.",
    agent_message: "Hook paused git reset --hard. Prefer non-destructive recovery unless the user asked for it.",
  },
  {
    re: /\bgit\s+clean\s+-[a-zA-Z]*f/i,
    permission: "ask",
    user_message: "git clean -f removes untracked files. Confirm before continuing.",
    agent_message: "Hook paused git clean -f.",
  },
  {
    re: /\bRemove-Item\b[^|&;]*\b-Recurse\b[^|&;]*\b(content\\|layouts\\|config\\|static\\|tests\\|scripts\\|themes\\|\.git\\|openspec\\)\b/i,
    permission: "ask",
    user_message: "Recursive delete under a core blog path. Confirm before continuing.",
    agent_message: "Hook paused a recursive Remove-Item under a core project path.",
  },
  {
    re: /\brm\s+(-[a-zA-Z]*f[a-zA-Z]*r|-[a-zA-Z]*r[a-zA-Z]*f)\b[^|&;]*\b(content|layouts|config|static|tests|scripts|themes|\.git|openspec)\b/i,
    permission: "ask",
    user_message: "Recursive rm under a core blog path. Confirm before continuing.",
    agent_message: "Hook paused a recursive rm under a core project path.",
  },
];

for (const rule of rules) {
  if (rule.re.test(command)) {
    writeJson({
      permission: rule.permission,
      user_message: rule.user_message,
      agent_message: rule.agent_message,
    });
    process.exit(0);
  }
}

writeJson({ permission: "allow" });
