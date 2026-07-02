import { chromium } from 'playwright';
const [src = '../thoughts/resume/resume-final.html', out = 'public/resume.pdf'] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(new URL(src, `file://${process.cwd()}/`).href);
await page.pdf({ path: out, format: 'Letter', margin: { top: '0.6in', bottom: '0.6in', left: '0.7in', right: '0.7in' }, printBackground: true });
await browser.close();
console.log(`Wrote ${out}`);
