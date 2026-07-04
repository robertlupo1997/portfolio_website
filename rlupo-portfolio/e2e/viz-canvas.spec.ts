import { test, expect } from '@playwright/test';

test.describe('VizCanvas integration', () => {
  test('canvas visible on desktop after navigation to project slide', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForSelector('.site-content--visible', { timeout: 8000 });
    await page.click('.carousel-btn >> text=NEXT');
    await page.waitForTimeout(800);
    await expect(page.locator('[data-testid="viz-canvas"] canvas')).toBeVisible();
  });

  test('no canvas on 375px — fallback img shown', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForSelector('.site-content--visible', { timeout: 8000 });
    await page.click('.carousel-btn >> text=NEXT');
    await page.waitForTimeout(800);
    await expect(page.locator('[data-testid="viz-canvas"] canvas')).not.toBeVisible();
    await expect(page.locator('.carousel-slide-image img').first()).toBeVisible();
  });

  test('no canvas under prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForSelector('.site-content--visible', { timeout: 8000 });
    await page.click('.carousel-btn >> text=NEXT');
    await page.waitForTimeout(800);
    await expect(page.locator('[data-testid="viz-canvas"] canvas')).not.toBeVisible();
  });

  test('hero round trip does not trigger fallback (stale contextlost listener)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1032 });
    await page.goto('/');
    await page.waitForSelector('.site-content--visible', { timeout: 8000 });
    await page.click('.carousel-btn >> text=NEXT'); // hero -> project 1 (canvas mounts)
    await page.waitForTimeout(900);
    await page.click('.carousel-btn >> text=PREV'); // back to hero (canvas disposes)
    await page.waitForTimeout(900);
    await page.click('.carousel-btn >> text=NEXT'); // project 1 again
    await page.waitForTimeout(900);
    // Disposal of the old canvas must NOT flip slides into fallback mode.
    await expect(page.locator('.carousel-slide-image--fallback')).toHaveCount(0);
    await expect(page.locator('[data-testid="viz-canvas"] canvas')).toBeVisible();
  });

  test('real context loss degrades to region-aligned fallback without crashing', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1032 });
    await page.goto('/');
    await page.waitForSelector('.site-content--visible', { timeout: 8000 });
    await page.click('.carousel-btn >> text=NEXT');
    await page.waitForTimeout(900);
    await page.waitForSelector('[data-testid="viz-canvas"] canvas');
    await page.evaluate(() => {
      const c = document.querySelector<HTMLCanvasElement>('[data-testid="viz-canvas"] canvas')!;
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    });
    await page.waitForTimeout(1200);
    // App must survive (no blank React-root unmount)…
    await expect(page.locator('header.header')).toBeVisible();
    // …fallback engages…
    const img = page.locator('.carousel-slide-image--fallback img').first();
    await expect(img).toBeVisible();
    // …and the fallback image occupies the viz region box (right 45%, full height),
    // so no black sliver paints over the content column.
    const box = (await img.boundingBox())!;
    expect(Math.abs(box.x - 1920 * 0.55)).toBeLessThanOrEqual(1.5);
    expect(Math.abs(box.width - 1920 * 0.45)).toBeLessThanOrEqual(1.5);
    expect(Math.abs(box.y - 0)).toBeLessThanOrEqual(1.5);
    expect(Math.abs(box.height - 1032)).toBeLessThanOrEqual(1.5);
  });

  test('arrows navigate correctly with VizCanvas mounted', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForSelector('.site-content--visible', { timeout: 8000 });
    await page.click('.carousel-btn >> text=NEXT');
    await page.waitForTimeout(800);
    await page.click('.carousel-btn >> text=NEXT');
    await page.waitForTimeout(800);
    await expect(page.locator('.carousel-counter')).toContainText('02');
  });
});
