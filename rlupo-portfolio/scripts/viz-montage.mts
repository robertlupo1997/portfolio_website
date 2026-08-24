#!/usr/bin/env tsx
/**
 * Composites all 9 public/viz/*.png as 400x266 thumbnails into a
 * 1200x800 (3x3) contact sheet at /tmp/claude-1000/viz-montage.png.
 * Also prints per-file brightest-channel mean and stddev for the acceptance floor.
 */
import sharp from "sharp";
import { readdir } from "fs/promises";
import { join } from "path";

const VIZ_DIR = new URL("../public/viz", import.meta.url).pathname;
const OUT = "/tmp/claude-1000/viz-montage.png";
const THUMB_W = 400;
const THUMB_H = 266;
const COLS = 3;
const ROWS = 3;

const files = (await readdir(VIZ_DIR))
  .filter((f) => f.endsWith(".png"))
  .sort()
  .slice(0, 9);

if (files.length !== 9) {
  console.error(`Expected 9 PNGs, found ${files.length}`);
  process.exit(1);
}

// Compute per-file brightest-channel stats on the original (pre-thumb) image
for (const f of files) {
  const { info, data } = await sharp(join(VIZ_DIR, f))
    .raw()
    .toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  // Split into per-channel arrays, find the brightest channel per pixel
  const n = data.length / ch;
  const brightest = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let max = 0;
    for (let c = 0; c < ch; c++) {
      const v = data[i * ch + c];
      if (v > max) max = v;
    }
    brightest[i] = max;
  }
  const mean = brightest.reduce((a, v) => a + v, 0) / n;
  const variance = brightest.reduce((a, v) => a + (v - mean) ** 2, 0) / n;
  const stddev = Math.sqrt(variance);
  const pass = mean >= 15 && stddev >= 12 ? "PASS" : "FAIL";
  console.log(
    `${f.padEnd(26)} mean=${mean.toFixed(1).padStart(5)} stddev=${stddev.toFixed(1).padStart(5)}  ${pass}`
  );
}

const thumbs = await Promise.all(
  files.map((f) =>
    sharp(join(VIZ_DIR, f))
      .resize(THUMB_W, THUMB_H, { fit: "cover" })
      .png()
      .toBuffer()
  )
);

const composites = thumbs.map((input, i) => ({
  input,
  left: (i % COLS) * THUMB_W,
  top: Math.floor(i / COLS) * THUMB_H,
}));

await sharp({
  create: {
    width: THUMB_W * COLS,
    height: THUMB_H * ROWS,
    channels: 3,
    background: { r: 0, g: 0, b: 0 },
  },
})
  .composite(composites)
  .png()
  .toFile(OUT);

console.log(`\nMontage written to ${OUT}`);
console.log("Order (alphabetical):", files.join(", "));
