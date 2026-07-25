#!/usr/bin/env node
/**
 * Refresh data/home_popular.toml from Cloudflare Web Analytics (RUM) top pages.
 *
 * Queries the GraphQL Analytics API (rumPageloadEventsAdaptiveGroups) for the
 * most-viewed paths over the lookback window, keeps post permalinks that exist
 * in content/, and rewrites the curated data file. Titles from any existing
 * data-file entry are preserved (editorial labels win over front matter).
 *
 * Env:
 *   CLOUDFLARE_API_TOKEN    (required) API token with Account Analytics Read
 *   CLOUDFLARE_ACCOUNT_TAG  (required) Cloudflare account id (32 hex chars)
 *   CLOUDFLARE_SITE_TAG     (required) Web Analytics site tag for the site
 *   POPULAR_DAYS            (optional) lookback days, default 30 (1-90)
 *   POPULAR_COUNT           (optional) links to keep, default 5 (3-5)
 *   DRY_RUN                 (optional) if "true", print TOML and skip write
 *
 * Exit codes: 0 = written or no change, 1 = error, 2 = skipped (too few posts)
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const DATA_FILE = join(REPO_ROOT, "data", "home_popular.toml");

const GRAPHQL_URL = "https://api.cloudflare.com/client/v4/graphql";
const POST_PATH_RE = /^\/posts\/(\d{4})\/([a-z0-9][a-z0-9-]*)\/$/;
const MIN_ITEMS = 3;

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function skip(message) {
  console.log(`SKIP: ${message}`);
  process.exit(2);
}

function requireEnv(name, pattern) {
  const value = process.env[name]?.trim();
  if (!value) fail(`${name} is not set`);
  if (pattern && !pattern.test(value)) fail(`${name} has unexpected format`);
  return value;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

export async function fetchTopPaths({ token, accountTag, siteTag, days }) {
  const now = new Date();
  const dateLeq = isoDate(now);
  const dateGeq = isoDate(new Date(now.getTime() - days * 24 * 60 * 60 * 1000));

  // Tags are validated hex/alphanumeric strings, safe to interpolate.
  const query = `{
    viewer {
      accounts(filter: { accountTag: "${accountTag}" }) {
        rumPageloadEventsAdaptiveGroups(
          filter: { siteTag: "${siteTag}", date_geq: "${dateGeq}", date_leq: "${dateLeq}" }
          limit: 100
          orderBy: [count_DESC]
        ) {
          count
          dimensions {
            requestPath
          }
        }
      }
    }
  }`;

  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const text = await res.text();
  if (!res.ok) fail(`Cloudflare API ${res.status}: ${text.slice(0, 1000)}`);

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    fail(`Cloudflare API returned non-JSON: ${text.slice(0, 500)}`);
  }
  if (data.errors?.length) {
    fail(`Cloudflare GraphQL errors: ${JSON.stringify(data.errors).slice(0, 1000)}`);
  }

  const groups =
    data?.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups;
  if (!Array.isArray(groups)) fail("Unexpected GraphQL response shape");
  console.log(`Fetched ${groups.length} path groups (${dateGeq}..${dateLeq})`);
  return groups;
}

/** Canonicalise a request path: decode, drop query/fragment artefacts, ensure trailing slash. */
export function canonicalPath(rawPath) {
  if (!rawPath || typeof rawPath !== "string") return null;
  let p = rawPath.split("?")[0].split("#")[0];
  try {
    p = decodeURIComponent(p);
  } catch {
    return null;
  }
  p = p.replace(/\/index\.html$/, "/");
  if (!p.startsWith("/")) return null;
  if (!p.endsWith("/")) p += "/";
  return p.toLowerCase();
}

function postContentFile(path) {
  const m = POST_PATH_RE.exec(path);
  if (!m) return null;
  return join(REPO_ROOT, "content", "posts", m[1], `${m[2]}.md`);
}

function frontMatterTitle(file) {
  const source = readFileSync(file, "utf8");
  const fence = source.match(/^\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+/);
  const m = (fence?.[1] ?? "").match(/^title\s*=\s*"((?:[^"\\]|\\.)*)"\s*$/m);
  return m ? m[1].replace(/\\(["\\])/g, "$1") : null;
}

/** Parse url -> title from the existing data file to preserve editorial labels. */
function existingTitles() {
  const titles = new Map();
  if (!existsSync(DATA_FILE)) return titles;
  const source = readFileSync(DATA_FILE, "utf8");
  const itemRe =
    /\[\[items\]\][^[]*?title\s*=\s*"((?:[^"\\]|\\.)*)"[^[]*?url\s*=\s*"([^"]*)"/g;
  for (const m of source.matchAll(itemRe)) {
    titles.set(m[2], m[1].replace(/\\(["\\])/g, "$1"));
  }
  return titles;
}

function tomlString(value) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

export function buildToml(items, days) {
  const lines = [
    `# Curated home "Popular right now" links (issue #3464).`,
    `# Auto-refreshed from Cloudflare Web Analytics top pages (last ${days} days)`,
    `# by scripts/home-popular/run.mjs via .github/workflows/home-popular-update.yml.`,
    `# Titles are editorial labels: edits here survive the next automated refresh.`,
    "",
  ];
  for (const item of items) {
    lines.push("[[items]]");
    lines.push(`title = ${tomlString(item.title)}`);
    lines.push(`url = ${tomlString(item.url)}`);
    lines.push("");
  }
  return `${lines.join("\n").trimEnd()}\n`;
}

async function main() {
  const token = requireEnv("CLOUDFLARE_API_TOKEN");
  const accountTag = requireEnv("CLOUDFLARE_ACCOUNT_TAG", /^[0-9a-f]{32}$/i);
  const siteTag = requireEnv("CLOUDFLARE_SITE_TAG", /^[0-9a-z-]+$/i);
  const days = Math.min(
    90,
    Math.max(1, Number.parseInt(process.env.POPULAR_DAYS ?? "30", 10) || 30),
  );
  const count = Math.min(
    5,
    Math.max(MIN_ITEMS, Number.parseInt(process.env.POPULAR_COUNT ?? "5", 10) || 5),
  );
  const dryRun = process.env.DRY_RUN === "true";

  const groups = await fetchTopPaths({ token, accountTag, siteTag, days });

  // Merge pageview counts per canonical post path.
  const views = new Map();
  for (const group of groups) {
    const path = canonicalPath(group?.dimensions?.requestPath);
    if (!path || !POST_PATH_RE.test(path)) continue;
    views.set(path, (views.get(path) ?? 0) + (group.count ?? 0));
  }

  const ranked = [...views.entries()].sort((a, b) => b[1] - a[1]);
  const labels = existingTitles();
  const items = [];
  for (const [path, pageviews] of ranked) {
    if (items.length >= count) break;
    const file = postContentFile(path);
    if (!file || !existsSync(file)) {
      console.log(`Ignoring ${path} (no matching content file)`);
      continue;
    }
    const title = labels.get(path) ?? frontMatterTitle(file);
    if (!title) {
      console.log(`Ignoring ${path} (no resolvable title)`);
      continue;
    }
    items.push({ title, url: path, pageviews });
  }

  console.log("Top posts:");
  for (const item of items) {
    console.log(`  ${item.pageviews}\t${item.url}`);
  }

  if (items.length < MIN_ITEMS) {
    skip(
      `Only ${items.length} eligible post(s) in Cloudflare top pages; ` +
        `need at least ${MIN_ITEMS}. Leaving data/home_popular.toml unchanged.`,
    );
  }

  const toml = buildToml(items, days);

  if (dryRun) {
    console.log("--- DRY_RUN data/home_popular.toml ---");
    console.log(toml);
    console.log("--- end ---");
    return;
  }

  const current = existsSync(DATA_FILE) ? readFileSync(DATA_FILE, "utf8") : "";
  if (current === toml) {
    console.log("No changes to data/home_popular.toml");
    return;
  }
  writeFileSync(DATA_FILE, toml);
  console.log("Wrote data/home_popular.toml");
}

const isMain =
  process.argv[1] &&
  pathToFileURL(process.argv[1]).href === import.meta.url;

if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
