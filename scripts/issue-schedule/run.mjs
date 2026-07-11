#!/usr/bin/env node
/**
 * Fetch open GitHub issues, ask an OpenAI-compatible chat model for a 30-day
 * implementation schedule, then create or update the tracking issue.
 *
 * Env:
 *   ISSUE_PLANNER_API_KEY   (optional) Bearer token; if unset, uses GH_TOKEN / GITHUB_TOKEN
 *                           against GitHub Models (models.github.ai)
 *   ISSUE_PLANNER_BASE_URL  (optional) default depends on auth (see below)
 *   ISSUE_PLANNER_MODEL     (optional) default openai/gpt-4.1-mini (GitHub Models)
 *                           or gpt-4.1-mini when using a custom OpenAI-compatible key
 *   GH_TOKEN / GITHUB_TOKEN (required for gh; also used for GitHub Models)
 *   DRY_RUN                 (optional) if "true", print body and skip upsert
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TRACKING_TITLE = "30-day implementation schedule";
const META_LABEL = "meta-umbrella";
const BODY_TRUNCATE = 120;
const ISSUE_LIMIT = 100;

const __dirname = dirname(fileURLToPath(import.meta.url));

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function ghJson(args) {
  const out = execFileSync("gh", args, {
    encoding: "utf8",
    env: process.env,
    maxBuffer: 20 * 1024 * 1024,
  });
  return JSON.parse(out || "null");
}

function gh(args, { input } = {}) {
  return execFileSync("gh", args, {
    encoding: "utf8",
    env: process.env,
    input,
    maxBuffer: 20 * 1024 * 1024,
  });
}

function truncate(text, max) {
  if (!text) return "";
  const t = String(text).trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

function normalizeIssues(raw) {
  return raw
    .filter((i) => i && typeof i.number === "number")
    .map((i) => {
      const labels = (i.labels || []).map((l) =>
        typeof l === "string" ? l : l.name,
      );
      const row = {
        number: i.number,
        title: i.title,
        labels,
        updatedAt: i.updatedAt,
      };
      if (i.milestone?.title) row.milestone = i.milestone.title;
      const assignees = (i.assignees || [])
        .map((a) => a.login || a)
        .filter(Boolean);
      if (assignees.length) row.assignees = assignees;
      // Skip bodies for umbrellas; keep a short snippet for leaf issues.
      if (!labels.includes(META_LABEL)) {
        const snippet = truncate(i.body, BODY_TRUNCATE);
        if (snippet) row.body = snippet;
      }
      return row;
    });
}

function loadPrompt() {
  return readFileSync(join(__dirname, "prompt.md"), "utf8").trim();
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
      temperature: 0.3,
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

function stripOuterFence(markdown) {
  const m = markdown.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```\s*$/i);
  return m ? m[1].trim() : markdown;
}

function labelExists(name) {
  try {
    const labels = ghJson(["label", "list", "--json", "name", "--limit", "200"]);
    return (labels || []).some((l) => l.name === name);
  } catch {
    return false;
  }
}

function upsertTrackingIssue(body) {
  const open = ghJson([
    "issue",
    "list",
    "--state",
    "open",
    "--limit",
    "50",
    "--json",
    "number,title",
    "--search",
    `in:title "${TRACKING_TITLE}"`,
  ]);
  const existing =
    (open || []).find((i) => i.title === TRACKING_TITLE) ??
    null;

  if (existing) {
    console.log(`Updating issue #${existing.number}`);
    gh(["issue", "edit", String(existing.number), "--body-file", "-"], {
      input: body,
    });
    console.log(`Updated: #${existing.number}`);
    return existing.number;
  }

  const createArgs = [
    "issue",
    "create",
    "--title",
    TRACKING_TITLE,
    "--body-file",
    "-",
  ];
  if (labelExists(META_LABEL)) {
    createArgs.push("--label", META_LABEL);
  }
  console.log("Creating tracking issue");
  const url = gh(createArgs, { input: body }).trim();
  console.log(`Created: ${url}`);
  return url;
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

async function main() {
  const { apiKey, baseUrl, model, provider } = resolveLlmConfig();
  const dryRun = process.env.DRY_RUN === "true";

  console.log(`Provider: ${provider}`);
  console.log(`Model: ${model}`);
  console.log(`Base URL: ${baseUrl}`);

  const raw = ghJson([
    "issue",
    "list",
    "--state",
    "open",
    "--limit",
    String(ISSUE_LIMIT),
    "--json",
    "number,title,labels,body,createdAt,updatedAt,milestone,assignees",
  ]);

  const issues = normalizeIssues(raw || []);
  const forModel = issues.filter((i) => i.title !== TRACKING_TITLE);

  console.log(`Open issues fetched: ${issues.length} (sending ${forModel.length} to model)`);

  if (forModel.length === 0) {
    fail("No open issues to schedule");
  }

  const runDate = new Date().toISOString().slice(0, 10);
  const systemPrompt = loadPrompt();
  const userContent = [
    `Run date (UTC): ${runDate}`,
    "",
    "Open issues JSON (compact):",
    JSON.stringify(forModel),
  ].join("\n");

  let schedule = await callLlm({
    apiKey,
    baseUrl,
    model,
    systemPrompt,
    userContent,
    provider,
  });
  schedule = stripOuterFence(schedule);

  if (!schedule.includes("#") && !/\d+/.test(schedule)) {
    fail("LLM output does not look like a schedule (no issue references)");
  }

  const header = [
    `<!-- generated-by: scripts/issue-schedule/run.mjs -->`,
    `<!-- run-date: ${runDate} -->`,
    "",
  ].join("\n");
  const body = `${header}${schedule}\n`;

  if (dryRun) {
    console.log("--- DRY_RUN body ---");
    console.log(body);
    console.log("--- end ---");
    return;
  }

  upsertTrackingIssue(body);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
