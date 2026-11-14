import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const hooksDir = __dirname;
export const stateDir = path.join(__dirname, "state");
export const editsStatePath = path.join(stateDir, "session-edits.json");

export async function readStdinJson() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function writeJson(obj) {
  process.stdout.write(JSON.stringify(obj));
}

export function ensureStateDir() {
  fs.mkdirSync(stateDir, { recursive: true });
}

export function loadEditsState() {
  try {
    return JSON.parse(fs.readFileSync(editsStatePath, "utf8"));
  } catch {
    return { files: [], securityHits: [], startedAt: new Date().toISOString() };
  }
}

export function saveEditsState(state) {
  ensureStateDir();
  fs.writeFileSync(editsStatePath, JSON.stringify(state, null, 2), "utf8");
}

export function clearEditsState() {
  ensureStateDir();
  saveEditsState({ files: [], securityHits: [], startedAt: new Date().toISOString() });
}

export function toPosix(p) {
  return String(p || "").replace(/\\/g, "/");
}

export function repoRelative(filePath, cwd = process.cwd()) {
  const abs = path.resolve(filePath);
  const root = path.resolve(cwd);
  const rel = path.relative(root, abs);
  return toPosix(rel.startsWith("..") ? abs : rel);
}

export function loadTechDebtHotspots(cwd = process.cwd()) {
  const hotspotFile = path.join(cwd, ".github", "tech-debt-hotspots.txt");
  try {
    return fs
      .readFileSync(hotspotFile, "utf8")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"))
      .map(toPosix);
  } catch {
    return [];
  }
}
