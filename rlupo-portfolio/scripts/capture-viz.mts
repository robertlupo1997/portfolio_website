// scripts/capture-viz.mts
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const PROJECT_IDS = [
  'nspb-api', 'ferroml', 'ask-my-work',
  'revenue-forecast', 'kkbox', 'ironclad',
  'ferroml-plugin', 'gsd-ml',
];
const BASE_URL = 'http://localhost:3000';
const OUT_DIR = join(process.cwd(), 'public', 'viz');

async function preflight() {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (e) {
    console.error(`ERROR: Dev server not running on ${BASE_URL}`);
    console.error('Start it with: npm run dev');
    console.error((e as Error).message);
    process.exit(1);
  }
}

async function main() {
  await preflight();
  mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1200, height: 800 });

    for (const id of PROJECT_IDS) {
      process.stdout.write(`Capturing ${id} ... `);
      await page.goto(`${BASE_URL}/?viz-capture=${id}`, { waitUntil: 'networkidle', timeout: 20000 });
      // Wait for the WebGL canvas to mount
      await page.waitForSelector('[data-testid="viz-canvas"] canvas', { timeout: 12000 });
      // Wait for ComposerMount (3 frames + 100ms setTimeout) plus animation settle
      // NOTE: animation is driven by wall-clock performance.now(), so pixel output is
      // not fully deterministic across runs — residual nondeterminism is expected and accepted.
      await page.waitForTimeout(900);
      const outPath = join(OUT_DIR, `${id}.png`);
      const buf = await page.screenshot({ clip: { x: 0, y: 0, width: 1200, height: 800 } });
      await sharp(buf).png({ palette: true, quality: 80, effort: 7 }).toFile(outPath);
      console.log(`saved → ${outPath}`);
    }
  } finally {
    await browser.close();
  }
  console.log('All captures complete.');
}

main().catch(e => { console.error(e); process.exit(1); });
