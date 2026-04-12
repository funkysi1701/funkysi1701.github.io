/**
 * Captures above-the-fold screenshots of external projects for the Projects page.
 * Run: npm run screenshots:projects
 */
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'static', 'images', 'projects');

/** @type {{ slug: string; url: string; waitSelector?: string; extraMs?: number }[]} */
const targets = [
  {
    slug: 'blog',
    url: 'https://www.funkysi1701.com/',
    waitSelector: 'main, article, [role="main"]',
    extraMs: 1500,
  },
  {
    slug: 'episode-atlas',
    url: 'https://www.episodeatlas.com/',
    waitSelector: 'body',
    extraMs: 2500,
  },
  {
    slug: 'mandelbrot',
    url: 'https://mandelbrot.funkysi1701.com/',
    waitSelector: 'canvas, main, body',
    extraMs: 4000,
  },
  {
    slug: 'thorne-pentecostal-church',
    url: 'https://www.thornepentecostalchurch.co.uk/',
    waitSelector: 'body',
    extraMs: 2000,
  },
];

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  for (const t of targets) {
    const outPath = join(outDir, `${t.slug}.png`);
    process.stdout.write(`Capturing ${t.slug} → ${outPath}\n`);
    await page.goto(t.url, {
      waitUntil: 'domcontentloaded',
      timeout: 90_000,
    });
    if (t.waitSelector) {
      await page.waitForSelector(t.waitSelector, { timeout: 60_000 }).catch(() => {});
    }
    if (t.extraMs) {
      await new Promise((r) => setTimeout(r, t.extraMs));
    }
    await page.screenshot({
      path: outPath,
      type: 'png',
      fullPage: false,
    });
  }

  await browser.close();
  process.stdout.write('Done.\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
