const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/tmp/dashboard-screenshots';
fs.mkdirSync(OUT_DIR, { recursive: true });

const PAGES = [
  { name: 'dashboard',   url: 'http://localhost:5173/',          title: 'Dashboard — Signals & Analytics' },
  { name: 'market',      url: 'http://localhost:5173/market',    title: 'Markets' },
  { name: 'portfolio',   url: 'http://localhost:5173/portfolio', title: 'Portfolio' },
  { name: 'settings',    url: 'http://localhost:5173/settings',  title: 'Settings' },
  { name: 'old',         url: 'http://localhost:5174/',           title: 'Old Dashboard (Original)' },
];

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

  const results = [];

  for (const { name, url, title } of PAGES) {
    try {
      console.log(`Capturing ${name}...`);
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
      await new Promise(r => setTimeout(r, 2500)); // let charts render

      const file = path.join(OUT_DIR, `${name}.png`);
      await page.screenshot({ path: file, fullPage: false });
      results.push({ name, title, file, ok: true });
      console.log(`  ✓ ${file}`);
    } catch (e) {
      console.log(`  ✗ ${name}: ${e.message}`);
      results.push({ name, title, file: null, ok: false, error: e.message });
    }
  }

  await browser.close();
  console.log('\nScreenshots done:', results.filter(r => r.ok).length, '/', results.length);
  console.log(JSON.stringify(results, null, 2));
})();
