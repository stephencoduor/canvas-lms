const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--ignore-certificate-errors'] });
  const page = await browser.newPage();
  const client = await page.createCDPSession();
  await client.send('Network.setCacheDisabled', { cacheDisabled: true });
  await page.setViewport({ width: 1440, height: 900 });

  const variants = [
    ['LV-01-default-login', 'default'],
    ['LV-02-aurora', 'aurora'],
    ['LV-03-glass', 'glass'],
    ['LV-04-campus', 'campus'],
    ['LV-05-waves', 'waves'],
    ['LV-06-mosaic', 'mosaic'],
    ['LV-07-settings-picker', null],
  ];

  const outDir = 'react-screenshots/login-variants';
  let success = 0;

  for (const [name, variant] of variants) {
    try {
      if (name.includes('settings')) {
        // Login first to access settings
        await page.goto('https://fineract.us/login/canvas', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForSelector('#pseudonym_session_unique_id', { timeout: 15000 });
        await page.type('#pseudonym_session_unique_id', 'admin@redefiners.org');
        await page.type('#pseudonym_session_password', 'ReDefiners2024!');
        await page.click('[type="submit"]');
        await new Promise(r => setTimeout(r, 5000));
        await page.goto('https://fineract.us/settings', { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(r => setTimeout(r, 3000));
      } else {
        // Set the variant in localStorage then visit login
        await page.goto('https://fineract.us/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.evaluate((v) => localStorage.setItem('redefiners-login-variant', v), variant);
        await page.goto('https://fineract.us/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(r => setTimeout(r, 3000));
      }
      await page.screenshot({ path: path.join(outDir, name + '.png'), fullPage: false });
      console.log('ok ' + name);
      success++;
    } catch (e) {
      console.log('fail ' + name + ': ' + e.message.substring(0, 60));
    }
  }

  await browser.close();
  console.log('Done ' + success + '/' + variants.length);
})();
