const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--ignore-certificate-errors'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('  CONSOLE ERROR:', msg.text().substring(0, 100));
  });
  page.on('pageerror', err => console.log('  PAGE ERROR:', err.message.substring(0, 100)));

  const outDir = 'react-screenshots/login-variants';

  const variants = [
    ['LV-01-default-login', 'default'],
    ['LV-02-aurora', 'aurora'],
    ['LV-03-glass', 'glass'],
    ['LV-04-campus', 'campus'],
    ['LV-05-waves', 'waves'],
    ['LV-06-mosaic', 'mosaic'],
  ];

  let success = 0;
  for (const [name, variant] of variants) {
    try {
      // Go to login page first to set localStorage
      await page.goto('https://fineract.us/login', { waitUntil: 'networkidle2', timeout: 30000 });
      await page.evaluate((v) => localStorage.setItem('redefiners-login-variant', v), variant);
      
      // Reload to apply
      await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 5000)); // Wait for React + CSS animations
      
      // Check what rendered
      const bodyHTML = await page.evaluate(() => document.body.innerHTML.substring(0, 200));
      console.log(`  ${name}: body preview = ${bodyHTML.substring(0, 80)}...`);
      
      await page.screenshot({ path: path.join(outDir, name + '.png'), fullPage: false });
      console.log('ok ' + name);
      success++;
    } catch (e) {
      console.log('fail ' + name + ': ' + e.message.substring(0, 80));
    }
  }

  await browser.close();
  console.log('Done ' + success + '/' + variants.length);
})();
