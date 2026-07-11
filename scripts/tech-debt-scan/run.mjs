#!/usr/bin/env node
/**
 * Scan the repo for tech-debt signals, ask an LLM which GitHub issues to open,
 * then create missing issues (deduped by fingerprint / title).
 *
 * Env: same LLM knobs as scripts/issue-schedule/run.mjs
 *   ISSUE_PLANNER_API_KEY, ISSUE_PLANNER_BASE_URL, ISSUE_PLANNER_MODEL
 *   GH_TOKEN / GITHUB_TOKEN, DRY_RUN
 *   TECH_DEBT_MAX_ISSUES (optional, default 5)
 */

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const TECH_DEBT_LABEL = "tech-debt";
const FINGERPRINT_RE = /<!--\s*tech-debt-scan:\s*([^\s>]+)\s*-->/i;
const MARKER_RE = /\b(TODO|FIXME|HACK|XXX|TECHDEBT|TECH.?DEBT)\b/i;
const MAX_MARKER_HITS = 30;
const MAX_LARGE_FILES = 20;
const ISSUE_LIMIT = 80;
const DEFAULT_MAX_ISSUES = 5;
/** Soft cap for LLM user payload (GitHub Models gpt-4.1-mini ~8k token request). */
const MAX_SIGNAL_JSON_CHARS = 10_000;

const HOTSPOTS = [
  "layouts/partials/head.html",
  "staticwebapp.config.json",
  "playwright.config.ts",
  "scripts/update_parkrun_results.py",
  "scripts/create-accessibility-issues.js",
  ".github/workflows/swa-deploy-nonprod.yml",
];

const LARGE_FILE_GLOBS = [
  "layouts/**/*.html",
  "assets/**/*.{scss,css,js}",
  "scripts/**/*.{js,mjs,py}",
  "tests/**/*.{ts,js}",
  ".github/workflows/*.yml",
  "staticwebapp.config.json",
];

const MARKER_GLOBS = [
  "layouts/**/*.html",
  "assets/**/*.{scss,css,js}",
  "scripts/**/*.{js,mjs,py}",
  "tests/**/*.{ts,js}",
  ".github/workflows/*.yml",
];

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..", "..");

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function ghJson(args) {
  const out = execFileSync("gh", args, {
    encoding: "utf8",
    env: process.env,
    maxBuffer: 20 * 1024 * 1024,
    cwd: repoRoot,
  });
  return JSON.parse(out || "null");
}

function gh(args, { input } = {}) {
  return execFileSync("gh", args, {
    encoding: "utf8",
    env: process.env,
    input,
    maxBuffer: 20 * 1024 * 1024,
    cwd: repoRoot,
  });
}

function loadPrompt() {
  return readFileSync(join(__dirname, "prompt.md"), "utf8").trim();
}

function resolveLlmConfig() {
  const customKey = process.env.ISSUE_PLANNER_API_KEY?.trim();
  const ghToken =
    process.env.GH_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim();

  if (customKey) {
    return {
      apiKey: customKey,
      baseUrl:
        process.env.ISSUE_PLANNER_BASE_URL?.trim() ||
        "https://api.openai.com/v1",
      model: process.env.ISSUE_PLANNER_MODEL?.trim() || "gpt-4.1-mini",
      provider: "custom",
    };
  }

  if (!ghToken) {
    fail(
      "Set ISSUE_PLANNER_API_KEY, or GH_TOKEN/GITHUB_TOKEN for GitHub Models",
    );
  }

  return {
    apiKey: ghToken,
    baseUrl:
      process.env.ISSUE_PLANNER_BASE_URL?.trim() ||
      "https://models.github.ai/inference",
    model: process.env.ISSUE_PLANNER_MODEL?.trim() || "openai/gpt-4.1-mini",
    provider: "github-models",
  };
}

async function callLlm({ apiKey, baseUrl, model, systemPrompt, userContent, provider }) {
  const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
  if (provider === "github-models") {
    headers.Accept = "application/vnd.github+json";
    headers["X-GitHub-Api-Version"] = "2022-11-28";
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    fail(`LLM API ${res.status}: ${text.slice(0, 2000)}`);
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    fail(`LLM API returned non-JSON: ${text.slice(0, 500)}`);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content || !String(content).trim()) {
    fail("LLM returned empty content");
  }
  return String(content).trim();
}

function stripOuterFence(text) {
  const m = text.match(/^```(?:json|JSON)?\s*\n([\s\S]*?)\n```\s*$/);
  return m ? m[1].trim() : text;
}

function fileLineCount(absPath) {
  try {
    const text = readFileSync(absPath, "utf8");
    return text.split(/\r?\n/).length;
  } catch {
    return null;
  }
}

function gatherHotspots() {
  return HOTSPOTS.map((rel) => {
    const abs = join(repoRoot, rel);
    if (!existsSync(abs)) return { path: rel, missing: true };
    const st = statSync(abs);
    return {
      path: rel,
      bytes: st.size,
      lines: fileLineCount(abs),
    };
  });
}

function gatherLargeSourceFiles() {
  const result = spawnSync("git", ["ls-files", "--", ...LARGE_FILE_GLOBS], {
    encoding: "utf8",
    cwd: repoRoot,
    maxBuffer: 20 * 1024 * 1024,
  });
  if (result.status !== 0) {
    console.warn("WARN: git ls-files failed; skipping large-file scan");
    return [];
  }

  const files = (result.stdout || "")
    .split(/\r?\n/)
    .map((f) => f.trim())
    .filter(Boolean)
    .filter(
      (f) =>
        !f.includes("node_modules/") &&
        !f.includes("themes/") &&
        !f.includes("public/") &&
        !f.includes("scripts/tech-debt-scan/"),
    );

  const scored = [];
  for (const rel of files) {
    const abs = join(repoRoot, rel);
    try {
      const st = statSync(abs);
      // Hugo layouts / scripts: flag files over ~15KB
      if (st.size < 15_000) continue;
      scored.push({
        path: rel,
        bytes: st.size,
        lines: fileLineCount(abs),
      });
    } catch {
      // ignore
    }
  }

  scored.sort((a, b) => b.bytes - a.bytes);
  return scored.slice(0, MAX_LARGE_FILES);
}

function gatherMarkerHits() {
  const result = spawnSync(
    "git",
    [
      "grep",
      "-nI",
      "-E",
      String.raw`\b(TODO|FIXME|HACK|XXX|TECHDEBT|TECH.?DEBT)\b`,
      "--",
      ...MARKER_GLOBS,
    ],
    { encoding: "utf8", cwd: repoRoot, maxBuffer: 20 * 1024 * 1024 },
  );

  // git grep exits 1 when no matches
  if (result.status !== 0 && result.status !== 1) {
    console.warn("WARN: git grep failed; skipping marker scan");
    return [];
  }

  const lines = (result.stdout || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !l.includes("scripts/tech-debt-scan/"))
    .filter((l) => !l.includes("node_modules/"))
    .filter((l) => !l.includes("themes/"));

  const hits = [];
  for (const line of lines) {
    if (!MARKER_RE.test(line)) continue;
    const m = line.match(/^([^:]+):(\d+):(.*)$/);
    if (!m) continue;
    hits.push({
      path: m[1],
      line: Number(m[2]),
      text: m[3].trim().slice(0, 120),
    });
    if (hits.length >= MAX_MARKER_HITS) break;
  }
  return hits;
}

function normalizeOpenIssues(raw) {
  return (raw || [])
    .filter((i) => i && typeof i.number === "number")
    .map((i) => {
      const labels = (i.labels || []).map((l) =>
        typeof l === "string" ? l : l.name,
      );
      const fp = (i.body || "").match(FINGERPRINT_RE)?.[1] ?? null;
      return {
        number: i.number,
        title: i.title,
        labels,
        fingerprint: fp,
      };
    });
}

function ensureLabel(name, color, description) {
  try {
    const labels = ghJson(["label", "list", "--json", "name", "--limit", "200"]);
    if ((labels || []).some((l) => l.name === name)) return true;
  } catch {
    // continue to create
  }
  try {
    gh([
      "label",
      "create",
      name,
      "--color",
      color,
      "--description",
      description,
    ]);
    console.log(`Created label: ${name}`);
    return true;
  } catch (err) {
    console.warn(`WARN: could not create label ${name}: ${err.message || err}`);
    return false;
  }
}

function priorityLabel(priority) {
  switch (String(priority || "").toLowerCase()) {
    case "high":
      return "priority-high";
    case "low":
      return "priority-low";
    default:
      return "priority-medium";
  }
}

function alreadyTracked(proposal, openIssues) {
  const fp = proposal.fingerprint?.trim().toLowerCase();
  if (fp && openIssues.some((i) => i.fingerprint?.toLowerCase() === fp)) {
    return true;
  }
  const title = proposal.title?.trim().toLowerCase();
  if (!title) return true;
  return openIssues.some((i) => {
    const t = (i.title || "").toLowerCase();
    return t === title || t.includes(title) || title.includes(t);
  });
}

function parseProposals(rawText, maxIssues) {
  let text = stripOuterFence(rawText);
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) {
    text = text.slice(start, end + 1);
  }
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    fail(`LLM did not return valid JSON: ${text.slice(0, 800)}`);
  }

  const issues = Array.isArray(parsed?.issues) ? parsed.issues : [];
  const cleaned = [];
  for (const item of issues) {
    if (!item || typeof item !== "object") continue;
    const title = String(item.title || "").trim();
    const body = String(item.body || "").trim();
    const fingerprint = String(item.fingerprint || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!title || !body || !fingerprint) continue;
    cleaned.push({
      title: title.slice(0, 200),
      body,
      fingerprint,
      priority: item.priority || "medium",
    });
    if (cleaned.length >= maxIssues) break;
  }

  return { issues: cleaned, notes: parsed?.notes || "" };
}

function createIssue(proposal) {
  const labels = [TECH_DEBT_LABEL, priorityLabel(proposal.priority)];
  const body = [
    `<!-- tech-debt-scan: ${proposal.fingerprint} -->`,
    `<!-- generated-by: scripts/tech-debt-scan/run.mjs -->`,
    "",
    proposal.body,
    "",
    "---",
    "_Opened by the weekly tech-debt scan._",
  ].join("\n");

  const args = ["issue", "create", "--title", proposal.title, "--body-file", "-"];
  for (const label of labels) {
    args.push("--label", label);
  }

  const url = gh(args, { input: body }).trim();
  return url;
}

function gatherSignals() {
  return {
    hotspots: gatherHotspots(),
    largeFiles: gatherLargeSourceFiles(),
    markers: gatherMarkerHits(),
    conventions: [
      "Prefer root layouts/, assets/, static/ overrides over editing themes/hugo-theme-bootstrap/.",
      "Do not hand-edit parkrun generated block in content/parkrun.md; use scripts/update_parkrun_results.py.",
      "public/ is build output — not source of truth.",
      "Keep CI/docs (AGENTS.md, CONTRIBUTING.md, README, copilot-instructions, .cursor/rules) aligned when workflows change.",
    ],
  };
}

function compactForPrompt(signals, openIssues, maxIssues) {
  const compactOpen = openIssues.map((i) => ({
    n: i.number,
    t: i.title,
    fp: i.fingerprint || undefined,
    l: (i.labels || []).filter((x) =>
      /tech-debt|priority-|bug|enhancement|ai-tooling/i.test(x),
    ),
  }));

  let payload = {
    maxNewIssues: maxIssues,
    openIssues: compactOpen,
    signals,
  };
  let json = JSON.stringify(payload);
  if (json.length <= MAX_SIGNAL_JSON_CHARS) return json;

  // Drop marker text first, then trim open issues
  payload = {
    maxNewIssues: maxIssues,
    openIssues: compactOpen.slice(0, 40),
    signals: {
      ...signals,
      markers: (signals.markers || []).map((m) => ({
        path: m.path,
        line: m.line,
      })),
    },
  };
  json = JSON.stringify(payload);
  if (json.length <= MAX_SIGNAL_JSON_CHARS) return json;

  payload.openIssues = compactOpen.slice(0, 25);
  payload.signals.markers = payload.signals.markers.slice(0, 15);
  payload.signals.largeFiles = (signals.largeFiles || []).slice(0, 12);
  json = JSON.stringify(payload);
  if (json.length > MAX_SIGNAL_JSON_CHARS) {
    json = `${json.slice(0, MAX_SIGNAL_JSON_CHARS - 20)}…(truncated)`;
  }
  return json;
}

async function main() {
  const { apiKey, baseUrl, model, provider } = resolveLlmConfig();
  const dryRun = process.env.DRY_RUN === "true";
  const maxIssues = Math.max(
    1,
    Number(process.env.TECH_DEBT_MAX_ISSUES || DEFAULT_MAX_ISSUES) ||
      DEFAULT_MAX_ISSUES,
  );

  console.log(`Provider: ${provider}`);
  console.log(`Model: ${model}`);
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Repo root: ${relative(process.cwd(), repoRoot) || "."}`);

  const signals = gatherSignals();
  console.log(
    `Signals: hotspots=${signals.hotspots.length}, largeFiles=${signals.largeFiles.length}, markers=${signals.markers.length}`,
  );

  const rawIssues = ghJson([
    "issue",
    "list",
    "--state",
    "open",
    "--limit",
    String(ISSUE_LIMIT),
    "--json",
    "number,title,labels,body",
  ]);
  const openIssues = normalizeOpenIssues(rawIssues);
  console.log(`Open issues for dedup: ${openIssues.length}`);

  const runDate = new Date().toISOString().slice(0, 10);
  const systemPrompt = loadPrompt();
  const signalJson = compactForPrompt(signals, openIssues, maxIssues);
  console.log(`Prompt payload chars: ${signalJson.length}`);

  const userContent = [
    `Run date (UTC): ${runDate}`,
    "",
    "Open issues + codebase signals (compact JSON):",
    signalJson,
  ].join("\n");

  const llmRaw = await callLlm({
    apiKey,
    baseUrl,
    model,
    systemPrompt,
    userContent,
    provider,
  });

  const { issues: proposals, notes } = parseProposals(llmRaw, maxIssues);
  if (notes) console.log(`Model notes: ${notes}`);
  console.log(`Proposals: ${proposals.length}`);

  if (proposals.length === 0) {
    console.log("No new tech-debt issues proposed.");
    return;
  }

  if (!dryRun) {
    ensureLabel(
      TECH_DEBT_LABEL,
      "8B5CF6",
      "Structural or maintainability debt found by weekly scan",
    );
    ensureLabel("priority-high", "B60205", "High priority");
    ensureLabel("priority-medium", "FBCA04", "Medium priority");
    ensureLabel("priority-low", "0E8A16", "Low priority");
  }

  let created = 0;
  let skipped = 0;
  for (const proposal of proposals) {
    if (alreadyTracked(proposal, openIssues)) {
      console.log(`Skip (already tracked): ${proposal.title}`);
      skipped += 1;
      continue;
    }

    if (dryRun) {
      console.log("--- DRY_RUN proposal ---");
      console.log(JSON.stringify(proposal, null, 2));
      created += 1;
      continue;
    }

    const url = createIssue(proposal);
    console.log(`Created: ${url}`);
    openIssues.push({
      number: 0,
      title: proposal.title,
      labels: [TECH_DEBT_LABEL],
      fingerprint: proposal.fingerprint,
    });
    created += 1;
  }

  console.log(`Done. created_or_would_create=${created} skipped=${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
