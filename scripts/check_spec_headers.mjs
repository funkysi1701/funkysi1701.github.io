#!/usr/bin/env node
/**
 * Fail if any Playwright *.spec.ts file under tests/ lacks a // spec: header comment.
 * See specs/README.md and CONTRIBUTING.md.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const TESTS_DIR = join(ROOT, 'tests');
const SPEC_HEADER = /^\s*\/\/\s*spec:\s*\S+/m;

function collectSpecFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSpecFiles(path, out);
    } else if (entry.isFile() && entry.name.endsWith('.spec.ts')) {
      out.push(path);
    }
  }
  return out;
}

const files = collectSpecFiles(TESTS_DIR).sort();
const missing = [];

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  // Require the comment near the top of the file (before the first import/export).
  const headerRegion = text.slice(0, Math.min(text.length, 500));
  if (!SPEC_HEADER.test(headerRegion)) {
    missing.push(relative(ROOT, file).replaceAll('\\', '/'));
  }
}

if (missing.length === 0) {
  console.log(`OK: ${files.length} Playwright spec file(s) include a // spec: header.`);
  process.exit(0);
}

console.error('Missing // spec: header in:');
for (const path of missing) {
  console.error(`  - ${path}`);
}
console.error(
  '\nAdd e.g. `// spec: specs/funkysi1701-test-plan.md` at the top of each file. See specs/README.md.',
);
process.exit(1);
