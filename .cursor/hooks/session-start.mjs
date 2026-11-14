#!/usr/bin/env node
import { clearEditsState, readStdinJson, writeJson } from "./lib.mjs";

await readStdinJson();
clearEditsState();

writeJson({
  additional_context:
    "funkysi1701.com hooks are active: post meta validation on content/posts edits; shell guard on risky git; stop checklist for docs/security/tech-debt. Start with docs/AI_CONTEXT.md; prefer OpenSpec for medium/large work.",
});
