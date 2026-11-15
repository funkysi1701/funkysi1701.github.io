#!/usr/bin/env node
import {
  loadEditsState,
  readStdinJson,
  repoRelative,
  saveEditsState,
  toPosix,
} from "./lib.mjs";

const SECRET_PATTERNS = [
  { id: "github-pat", re: /\b(ghp|gho|ghu|ghs)_[A-Za-z0-9]{20,}\b/ },
  { id: "openai-ish", re: /\bsk-[A-Za-z0-9]{20,}\b/ },
  {
    id: "connection-string-secret",
    re: /(SharedAccessSignature|Password|ClientSecret)\s*=\s*[^\s;"']{8,}/i,
  },
  {
    id: "cloudflare-token-literal",
    re: /CLOUDFLARE_API_TOKEN\s*[:=]\s*["'][^"']{8,}["']/,
  },
  {
    id: "swa-deploy-token-literal",
    re: /AZURE_STATIC_WEB_APPS_API_TOKEN[A-Z0-9_]*\s*[:=]\s*["'][^"']{8,}["']/,
  },
];

const input = await readStdinJson();
const rel = repoRelative(input.file_path || "", process.cwd());
const state = loadEditsState();

if (rel && !state.files.includes(rel)) {
  state.files.push(rel);
}

const blobs = (input.edits || [])
  .map((e) => String(e?.new_string ?? ""))
  .join("\n");

const skipScan = toPosix(rel).includes(".cursor/hooks/");

if (!skipScan && blobs) {
  for (const { id, re } of SECRET_PATTERNS) {
    if (re.test(blobs)) {
      const hit = `${rel}:${id}`;
      if (!state.securityHits.includes(hit)) state.securityHits.push(hit);
    }
  }
}

saveEditsState(state);
process.stdout.write("{}");
