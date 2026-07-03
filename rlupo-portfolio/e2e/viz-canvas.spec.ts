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
