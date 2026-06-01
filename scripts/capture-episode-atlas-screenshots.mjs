/**
 * Captures screenshots for the Episode Atlas blog post.
 * Run: node scripts/capture-episode-atlas-screenshots.mjs
 */
import { chromium } from '@playwright/test';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdir } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'static', 'images', '2026', 'episode-atlas');

/** @type {{ name: string; url: string; extraMs?: number; after?: (page: import('@playwright/test').Page) => Promise<void> }[]} */
const shots = [
  { name: 'episode-atlas-home', url: 'https://www.episodeatlas.com/', extraMs: 3000 },
  { name: 'episode-atlas-collections', url: 'https://www.episodeatlas.com/collections', extraMs: 4000 },
  { name: 'episode-atlas-random', url: 'https://www.episodeatlas.com/random', extraMs: 4000 },
  {
    name: 'episode-atlas-episodes',
    url: 'https://www.episodeatlas.com/episodes',
    extraMs: 5000,
  },
  {
    name: 'episode-atlas-search',
    url: 'https://www.episodeatlas.com/episodes',
    extraMs: 5000,
    async after(page) {
      const search = page.locator('input').first();
      if ((await search.count()) > 0) {
        await search.fill('borg');
        await page.waitForTimeout(2000);
      }
    },
  },
];

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  for (const s of shots) {
    process.stdout.write(`Capturing ${s.name}…\n`);
    await page.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 90_000 });
    if (s.extraMs) {
      await page.waitForTimeout(s.extraMs);
    }
    if (s.after) {
      await s.after(page);
    }
    await page.screenshot({ path: join(outDir, `${s.name}.png`) });
  }

  await browser.close();
  process.stdout.write(`Done. Wrote ${shots.length} files to ${outDir}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
