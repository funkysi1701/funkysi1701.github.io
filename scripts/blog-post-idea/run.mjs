#!/usr/bin/env node
/**
 * Review existing blog posts, ask an LLM for one new post idea informed by
 * current developer trends, then create a GitHub issue (deduped by fingerprint
 * and topical similarity to recent posts / content suggestions).
 *
 * Env: same LLM knobs as funkysi1701/repo-automation issue-schedule
 *   ISSUE_PLANNER_API_KEY, ISSUE_PLANNER_BASE_URL, ISSUE_PLANNER_MODEL
 *   GH_TOKEN / GITHUB_TOKEN, DRY_RUN
 */

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const CONTENT_LABEL = "enhancement";
const FINGERPRINT_PREFIX = "blog-post-idea";
const FINGERPRINT_RE = /<!--\s*blog-post-idea:\s*([^\s>]+)\s*-->/i;
const TITLE_PREFIX = "[Content Suggestion]: ";
const ISSUE_SEARCH_LIMIT = 50;
/** Recent posts get title + tags; older posts are title+year only. */
const RECENT_DETAIL_COUNT = 40;
const TOP_TAGS_COUNT = 25;
/** Soft cap so GitHub Models gpt-4.1-mini (~8k token request limit) is not exceeded. */
const MAX_CATALOG_CHARS = 12_000;
/** Do not re-suggest topics covered by posts or closed ideas within this window. */
const RECENT_SIMILARITY_DAYS = 90;
/** Jaccard token overlap above this → treat as near-duplicate. */
const SIMILARITY_THRESHOLD = 0.35;
const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "for",
  "from",
  "how",
  "i",
  "in",
  "into",
  "is",
  "it",
  "my",
  "of",
  "on",
  "or",
  "our",
  "the",
  "to",
  "with",
  "your",
  "you",
  "vs",
  "via",
  "using",
  "use",
  "what",
  "when",
  "why",
  "who",
  "that",
  "this",
  "these",
  "those",
  "about",
  "over",
  "under",
  "after",
  "before",
  "between",
  "through",
  "into",
  "out",
  "up",
  "down",
  "by",
  "be",
  "are",
  "was",
  "were",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "can",
  "may",
  "might",
  "must",
  "new",
  "guide",
  "tips",
  "lessons",
  "learned",
  "part",
  "post",
  "blog",
  "boosting",
  "boost",
  "improve",
  "improving",
  "developer",
  "developers",
  "development",
  "tools",
  "tool",
]);

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..", "..");
const postsRoot = join(repoRoot, "content", "posts");

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
      temperature: 0.5,
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

function walkMarkdownFiles(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    const abs = join(dir, ent.name);
    if (ent.isDirectory()) {
      walkMarkdownFiles(abs, out);
    } else if (ent.isFile() && ent.name.endsWith(".md")) {
      out.push(abs);
    }
  }
  return out;
}

function parseTomlScalar(value) {
  const v = value.trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1);
  }
  if (v === "true") return true;
  if (v === "false") return false;
  return v;
}

function parseTomlStringArray(raw) {
  const inner = raw.trim().replace(/^\[/, "").replace(/\]$/, "");
  if (!inner.trim()) return [];
  const matches = [...inner.matchAll(/"([^"]*)"|'([^']*)'/g)];
  return matches.map((m) => m[1] ?? m[2]).filter(Boolean);
}

function parseFrontMatter(text) {
  const m = text.match(/^\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+/);
  if (!m) return null;
  const block = m[1];
  const get = (key) => {
    const line = block.match(new RegExp(`^${key}\\s*=\\s*(.+)$`, "m"));
    return line ? parseTomlScalar(line[1]) : undefined;
  };
  const tagsLine = block.match(/^tags\s*=\s*(\[[\s\S]*?\])/m);
  const catsLine = block.match(/^categories\s*=\s*(\[[\s\S]*?\])/m);
  const keywordsLine = block.match(/^keywords\s*=\s*(\[[\s\S]*?\])/m);
  return {
    title: get("title"),
    date: get("date"),
    description: get("description"),
    draft: get("draft") === true,
    tags: tagsLine ? parseTomlStringArray(tagsLine[1]) : [],
    categories: catsLine ? parseTomlStringArray(catsLine[1]) : [],
    keywords: keywordsLine ? parseTomlStringArray(keywordsLine[1]) : [],
  };
}

function catalogPosts() {
  const files = walkMarkdownFiles(postsRoot);
  const posts = [];
  for (const abs of files) {
    const rel = relative(repoRoot, abs).replace(/\\/g, "/");
    // Skip section indexes and non-article pages under posts/
    if (rel.endsWith("/_index.md") || rel.endsWith("projects.md")) continue;
    if (rel.includes("/events/")) continue;

    let text;
    try {
      text = readFileSync(abs, "utf8");
    } catch {
      continue;
    }
    const fm = parseFrontMatter(text);
    if (!fm?.title || fm.draft) continue;

    posts.push({
      path: rel,
      title: fm.title,
      date: fm.date || null,
      description: fm.description || null,
      tags: fm.tags,
      categories: fm.categories,
      keywords: fm.keywords,
    });
  }

  posts.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  return posts;
}

function fingerprintFromTitle(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function yearOf(date) {
  if (!date) return "?";
  const m = String(date).match(/^(\d{4})/);
  return m ? m[1] : "?";
}

function monthOf(date) {
  if (!date) return "";
  const m = String(date).match(/^(\d{4}-\d{2})/);
  return m ? m[1] : yearOf(date);
}

/** Compact text catalogue — titles for coverage, detail only on recent posts. */
function buildCatalogForModel(posts) {
  const tagCounts = new Map();
  for (const p of posts) {
    for (const t of p.tags || []) {
      tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
    }
  }
  const topTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_TAGS_COUNT)
    .map(([name, count]) => `${name}(${count})`)
    .join(", ");

  const recent = posts.slice(0, RECENT_DETAIL_COUNT);
  const older = posts.slice(RECENT_DETAIL_COUNT);

  const lines = [
    `Total published posts: ${posts.length}`,
    `Top tags: ${topTags || "(none)"}`,
    "",
    `Recent posts (newest ${recent.length}, title + month + tags):`,
  ];

  for (const p of recent) {
    const tags = (p.tags || []).slice(0, 5).join(", ");
    lines.push(
      `- ${monthOf(p.date)} | ${p.title}${tags ? ` | ${tags}` : ""}`,
    );
  }

  if (older.length) {
    lines.push("", `Older post titles (${older.length}, year | title):`);
    let included = 0;
    for (const p of older) {
      const row = `- ${yearOf(p.date)} | ${p.title}`;
      const nextLen = lines.join("\n").length + row.length + 1;
      if (nextLen > MAX_CATALOG_CHARS) {
        break;
      }
      lines.push(row);
      included += 1;
    }
    const omitted = older.length - included;
    if (omitted > 0) {
      lines.push(`- …and ${omitted} older titles omitted for size`);
    }
  }

  let text = lines.join("\n");
  if (text.length > MAX_CATALOG_CHARS) {
    text = `${text.slice(0, MAX_CATALOG_CHARS - 20)}\n…(truncated)`;
  }
  return text;
}

function daysAgoIso(days) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString();
}

function isWithinDays(isoDate, days) {
  if (!isoDate) return false;
  const t = Date.parse(isoDate);
  if (Number.isNaN(t)) return false;
  return t >= Date.parse(daysAgoIso(days));
}

function mapContentIdea(i) {
  const fp = i.body?.match(FINGERPRINT_RE)?.[1] || null;
  const bareTitle = String(i.title || "")
    .replace(/^\[Content Suggestion\]:\s*/i, "")
    .trim();
  return {
    number: i.number,
    title: i.title,
    bareTitle,
    fingerprint: fp,
    state: i.state,
    createdAt: i.createdAt || null,
    closedAt: i.closedAt || null,
  };
}

function listContentIdeas() {
  try {
    const issues = ghJson([
      "issue",
      "list",
      "--state",
      "all",
      "--limit",
      String(ISSUE_SEARCH_LIMIT),
      "--json",
      "number,title,body,state,createdAt,closedAt",
      "--search",
      'in:title "Content Suggestion"',
    ]);
    const mapped = (issues || []).map(mapContentIdea);
    const openIdeas = mapped.filter((i) => i.state === "OPEN");
    const closedRecent = mapped.filter(
      (i) =>
        i.state === "CLOSED" &&
        (isWithinDays(i.closedAt, RECENT_SIMILARITY_DAYS) ||
          isWithinDays(i.createdAt, RECENT_SIMILARITY_DAYS)),
    );
    return { openIdeas, closedRecent };
  } catch (err) {
    console.warn(`WARN: could not list content ideas: ${err.message}`);
    return { openIdeas: [], closedRecent: [] };
  }
}

function tokenize(text) {
  return new Set(
    String(text || "")
      .toLowerCase()
      .replace(/\.net/g, "dotnet")
      .replace(/c#/g, "csharp")
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length >= 2 && !STOPWORDS.has(t)),
  );
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const t of a) {
    if (b.has(t)) inter += 1;
  }
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

function extractTagsFromBody(body) {
  const text = String(body || "");
  const section = text.match(
    /##\s*Target tags\/categories\s*\n+([^\n#]+)/i,
  );
  if (!section) return [];
  return section[1]
    .split(/[,|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function ideaTokenSet(idea) {
  const tags = extractTagsFromBody(idea.body);
  return tokenize([idea.title, ...tags].join(" "));
}

function postTokenSet(post) {
  return tokenize(
    [
      post.title,
      ...(post.tags || []),
      ...(post.keywords || []),
      ...(post.categories || []),
    ].join(" "),
  );
}

function issueTokenSet(issue) {
  return tokenize(issue.bareTitle || issue.title || "");
}

function recentPosts(posts, days = RECENT_SIMILARITY_DAYS) {
  return posts.filter((p) => isWithinDays(p.date, days));
}

/**
 * Find the strongest topical near-duplicate among recent posts and closed ideas.
 * @returns {{ kind: string, label: string, score: number } | null}
 */
function findSimilarRecent(idea, posts, closedIdeas) {
  const ideaTokens = ideaTokenSet(idea);
  let best = null;

  for (const p of recentPosts(posts)) {
    const score = jaccard(ideaTokens, postTokenSet(p));
    if (score >= SIMILARITY_THRESHOLD && (!best || score > best.score)) {
      best = {
        kind: "post",
        label: `${monthOf(p.date)} | ${p.title}`,
        score,
      };
    }
  }

  for (const i of closedIdeas) {
    const score = jaccard(ideaTokens, issueTokenSet(i));
    if (score >= SIMILARITY_THRESHOLD && (!best || score > best.score)) {
      best = {
        kind: "closed-suggestion",
        label: `#${i.number} ${i.title}`,
        score,
      };
    }
  }

  return best;
}

function labelExists(name) {
  try {
    const labels = ghJson(["label", "list", "--json", "name", "--limit", "200"]);
    return (labels || []).some((l) => l.name === name);
  } catch {
    return false;
  }
}

function parseIdeaJson(raw) {
  let text = stripOuterFence(raw.trim());
  // Tolerate leading prose before JSON object
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) {
    text = text.slice(start, end + 1);
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    fail(`LLM returned invalid JSON: ${raw.slice(0, 500)}`);
  }
  const title = String(data.title || "").trim();
  const body = String(data.body || "").trim();
  const rationale = String(data.rationale || "").trim();
  if (!title || !body) {
    fail("LLM JSON missing title or body");
  }
  return { title, body, rationale };
}

function buildIssueBody({ body, rationale, fingerprint, runDate }) {
  const parts = [
    `<!-- ${FINGERPRINT_PREFIX}: ${fingerprint} -->`,
    `<!-- run-date: ${runDate} -->`,
    `<!-- generated-by: scripts/blog-post-idea/run.mjs -->`,
    "",
    body.trim(),
  ];
  if (rationale) {
    parts.push("", "### Why this idea", "", rationale.trim());
  }
  parts.push(
    "",
    "---",
    "_Suggested by the weekly blog-post-idea workflow. Edit or close if not useful._",
    "",
  );
  return parts.join("\n");
}

function createIssue({ title, body }) {
  const fullTitle = title.startsWith(TITLE_PREFIX)
    ? title
    : `${TITLE_PREFIX}${title}`;
  const createArgs = ["issue", "create", "--title", fullTitle, "--body-file", "-"];
  if (labelExists(CONTENT_LABEL)) {
    createArgs.push("--label", CONTENT_LABEL);
  }
  console.log(`Creating issue: ${fullTitle}`);
  const url = gh(createArgs, { input: body }).trim();
  console.log(`Created: ${url}`);
  return url;
}

function formatIdeaList(ideas) {
  if (!ideas.length) return "(none)";
  return ideas.map((i) => `#${i.number} ${i.title}`).join("\n");
}

function buildUserContent({ runDate, catalogText, openIdeas, closedRecent, retryNote }) {
  const parts = [
    `Run date (UTC): ${runDate}`,
    "",
    "Existing published posts:",
    catalogText,
    "",
    "Already-open content suggestion issues (avoid duplicates):",
    formatIdeaList(openIdeas),
    "",
    `Recently closed content suggestion issues (last ${RECENT_SIMILARITY_DAYS} days — avoid near-duplicates):`,
    formatIdeaList(closedRecent),
  ];
  if (retryNote) {
    parts.push("", retryNote);
  }
  return parts.join("\n");
}

function findOpenDuplicate(idea, openIdeas) {
  const fingerprint = fingerprintFromTitle(idea.title);
  return (
    openIdeas.find((i) => i.fingerprint === fingerprint) ||
    openIdeas.find((i) =>
      i.title.toLowerCase().includes(idea.title.toLowerCase().slice(0, 40)),
    ) ||
    null
  );
}

async function main() {
  const { apiKey, baseUrl, model, provider } = resolveLlmConfig();
  const dryRun = process.env.DRY_RUN === "true";

  console.log(`Provider: ${provider}`);
  console.log(`Model: ${model}`);
  console.log(`Base URL: ${baseUrl}`);

  const posts = catalogPosts();
  console.log(`Catalogued posts: ${posts.length}`);
  if (posts.length === 0) {
    fail("No published posts found under content/posts");
  }

  const catalogText = buildCatalogForModel(posts);
  console.log(`Catalog prompt chars: ${catalogText.length} (cap ${MAX_CATALOG_CHARS})`);

  const { openIdeas, closedRecent } = listContentIdeas();
  console.log(`Open content-suggestion issues: ${openIdeas.length}`);
  console.log(
    `Recently closed content-suggestion issues (${RECENT_SIMILARITY_DAYS}d): ${closedRecent.length}`,
  );

  const runDate = new Date().toISOString().slice(0, 10);
  const systemPrompt = loadPrompt();
  const llmOpts = { apiKey, baseUrl, model, systemPrompt, provider };

  let userContent = buildUserContent({
    runDate,
    catalogText,
    openIdeas,
    closedRecent,
  });

  let raw = await callLlm({ ...llmOpts, userContent });
  let idea = parseIdeaJson(raw);

  let similar = findSimilarRecent(idea, posts, closedRecent);
  if (similar) {
    console.log(
      `Idea too similar to ${similar.kind} (${similar.score.toFixed(2)}): ${similar.label}`,
    );
    console.log("Retrying once with explicit avoid list…");
    const retryNote = [
      "PREVIOUS SUGGESTION REJECTED — too similar to a recent published post or closed content suggestion.",
      `Rejected title: ${idea.title}`,
      `Too similar to: ${similar.label} (${similar.kind}, score ${similar.score.toFixed(2)})`,
      "Propose a clearly different topic (different tools/stack/angle). Do not complement or deepen that item.",
    ].join("\n");
    userContent = buildUserContent({
      runDate,
      catalogText,
      openIdeas,
      closedRecent,
      retryNote,
    });
    raw = await callLlm({ ...llmOpts, userContent });
    idea = parseIdeaJson(raw);
    similar = findSimilarRecent(idea, posts, closedRecent);
    if (similar) {
      console.log(
        `Skipping create; still too similar to ${similar.kind} (${similar.score.toFixed(2)}): ${similar.label}`,
      );
      return;
    }
  }

  const fingerprint = fingerprintFromTitle(idea.title);
  const already = findOpenDuplicate(idea, openIdeas);
  if (already) {
    console.log(
      `Skipping create; similar open issue #${already.number}: ${already.title}`,
    );
    return;
  }

  const issueBody = buildIssueBody({
    body: idea.body,
    rationale: idea.rationale,
    fingerprint,
    runDate,
  });

  if (dryRun) {
    console.log("--- DRY_RUN ---");
    console.log(`Title: ${TITLE_PREFIX}${idea.title}`);
    console.log(issueBody);
    console.log("--- end ---");
    return;
  }

  createIssue({ title: idea.title, body: issueBody });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
