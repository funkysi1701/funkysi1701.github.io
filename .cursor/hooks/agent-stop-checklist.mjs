#!/usr/bin/env node
import {
  clearEditsState,
  loadEditsState,
  loadTechDebtHotspots,
  readStdinJson,
  toPosix,
  writeJson,
} from "./lib.mjs";

const input = await readStdinJson();
const status = input.status || "completed";
const loopCount = Number(input.loop_count ?? 0);

if (status !== "completed" || loopCount > 0) {
  writeJson({});
  process.exit(0);
}

const state = loadEditsState();
const files = (state.files || []).map(toPosix);
const securityHits = state.securityHits || [];

if (files.length === 0 && securityHits.length === 0) {
  writeJson({});
  process.exit(0);
}

const hotspots = loadTechDebtHotspots(process.cwd());
const touchedHotspots = files.filter((f) =>
  hotspots.some((h) => f === h || f.endsWith("/" + h) || f.includes(h)),
);

const touchedCodeThatNeedsDocs = files.some(
  (f) =>
    f.startsWith("layouts/") ||
    f.startsWith("config/") ||
    f.startsWith(".github/workflows/") ||
    f.startsWith("scripts/") ||
    f === "staticwebapp.config.json" ||
    f === "package.json" ||
    f === "playwright.config.ts" ||
    f.startsWith("themes/"),
);

const touchedDocs = files.some(
  (f) =>
    f.startsWith("docs/") ||
    f === "AGENTS.md" ||
    f === "README.md" ||
    f === "CONTRIBUTING.md" ||
    f.startsWith(".github/copilot-instructions") ||
    f.startsWith(".cursor/rules/") ||
    f.startsWith("openspec/") ||
    f.startsWith("specs/"),
);

const lines = [];

if (securityHits.length > 0) {
  lines.push(
    "Security: possible secret/credential patterns were written in this session (" +
      securityHits.slice(0, 5).join(", ") +
      "). Remove them from the working tree, rotate if real, and keep secrets in GitHub Actions secrets / env only.",
  );
}

if (touchedCodeThatNeedsDocs && !touchedDocs) {
  lines.push(
    "Docs: layouts, config, workflows, scripts, SWA config, package.json, Playwright config, or theme paths changed without a docs/OpenSpec/rules update. Check docs/AI_CONTEXT.md — keep AGENTS.md, README, CONTRIBUTING, Cursor rules, and slim Copilot instructions aligned.",
  );
}

if (touchedHotspots.length > 0) {
  lines.push(
    "Tech debt: edited hotspot file(s) from .github/tech-debt-hotspots.txt (" +
      touchedHotspots.slice(0, 5).join(", ") +
      "). Prefer focused fixes; avoid growing hotspots. Consider a tech-debt issue if this expanded the hotspot.",
  );
}

if (lines.length === 0) {
  clearEditsState();
  writeJson({});
  process.exit(0);
}

const followup =
  "Hook checklist before you finish:\n" +
  lines.map((l, i) => `${i + 1}. ${l}`).join("\n") +
  "\nAddress any real gaps briefly (or state N/A with reason), then stop. Do not start unrelated work.";

clearEditsState();
writeJson({ followup_message: followup });
