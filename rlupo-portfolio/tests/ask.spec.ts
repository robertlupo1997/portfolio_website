import { test, expect } from '@playwright/test';

const SSE_BODY = [
  'data: {"type":"searching","query":"rust"}\n\n',
  'data: {"type":"text","text":"Trey built FerroML [1]."}\n\n',
  'data: {"type":"citations","citations":[{"n":1,"id":"project-ferroml","title":"FerroML","slideIndex":2}]}\n\n',
  'data: {"type":"done"}\n\n',
].join('');

test.beforeEach(async ({ page }) => {
  await page.route('**/api/ask', (route) =>
    route.fulfill({ status: 200, contentType: 'text/event-stream', body: SSE_BODY }));
  await page.goto('/');
  // Preloader takes ~3.1s
  await page.waitForSelector('.site-content--visible', { timeout: 10_000 });
});

test('cmd-k opens panel, ask streams answer with citations', async ({ page }) => {
  await page.keyboard.press('ControlOrMeta+k');
  const panel = page.getByTestId('ask-panel');
  await expect(panel).toHaveClass(/ask-panel--open/);
  await page.locator('.ask-panel__input').fill('What has Trey built in Rust?');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('ask-answer')).toContainText('FerroML [1]');
  await expect(page.getByTestId('citation-1')).toBeVisible();
});

test('citation click closes panel and navigates the carousel', async ({ page }) => {
  await page.keyboard.press('ControlOrMeta+k');
  await page.locator('.ask-panel__input').fill('rust');
  await page.keyboard.press('Enter');
  await page.getByTestId('citation-1').click();
  await expect(page.getByTestId('ask-panel')).not.toHaveClass(/ask-panel--open/);
});

test('escape closes; /ask route opens the panel on load', async ({ page }) => {
  await page.keyboard.press('ControlOrMeta+k');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('ask-panel')).not.toHaveClass(/ask-panel--open/);
  await page.goto('/ask');
  await page.waitForSelector('.site-content--visible', { timeout: 10_000 });
  await expect(page.getByTestId('ask-panel')).toHaveClass(/ask-panel--open/);
});

test('close then reopen shows fresh idle state with starters visible', async ({ page }) => {
  // Open and ask a question (stream completes immediately via mock)
  await page.keyboard.press('ControlOrMeta+k');
  await page.locator('.ask-panel__input').fill('What has Trey built in Rust?');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('ask-answer')).toContainText('FerroML [1]');
  // Close
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('ask-panel')).not.toHaveClass(/ask-panel--open/);
  // Reopen — must show starters and empty input (idle state)
  await page.keyboard.press('ControlOrMeta+k');
  await expect(page.getByTestId('ask-panel')).toHaveClass(/ask-panel--open/);
  await expect(page.locator('.ask-panel__starters')).toBeVisible();
  await expect(page.locator('.ask-panel__input')).toHaveValue('');
});
