const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--ignore-certificate-errors'] });
  const page = await browser.newPage();
  const client = await page.createCDPSession();
  await client.send('Network.setCacheDisabled', { cacheDisabled: true });
  await page.setViewport({ width: 1440, height: 900 });

  // Login
  try {
    await page.goto('https://fineract.us/login/canvas', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('#pseudonym_session_unique_id', { timeout: 15000 });
    await page.type('#pseudonym_session_unique_id', 'admin@redefiners.org');
    await page.type('#pseudonym_session_password', 'ReDefiners2024!');
    await page.click('[type="submit"]');
    await new Promise(r => setTimeout(r, 5000));
    console.log('Logged in');
  } catch (e) { console.log('Login skip:', e.message.substring(0, 50)); }

  const outDir = 'react-screenshots/logout-fix';

  // 1. Dashboard - check avatar in top right
  await page.goto('https://fineract.us/dashboard', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outDir, 'LF-01-dashboard-topbar.png'), fullPage: false });
  console.log('ok LF-01-dashboard-topbar');

  // 2. Click the avatar to open dropdown menu
  try {
    const avatar = await page.$('header button[class*="cursor-pointer"], header [class*="cursor-pointer"]');
    if (avatar) {
      const lastButtons = await page.$$('header button, header [class*="cursor-pointer"]');
      const lastBtn = lastButtons[lastButtons.length - 1];
      await lastBtn.click();
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(outDir, 'LF-02-user-menu-open.png'), fullPage: false });
      console.log('ok LF-02-user-menu-open');
    } else {
      console.log('fail LF-02: no avatar button found');
    }
  } catch (e) { console.log('fail LF-02:', e.message.substring(0, 50)); }

  // 3. Admin page - check avatar visibility
  await page.goto('https://fineract.us/admin', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(outDir, 'LF-03-admin-topbar.png'), fullPage: false });
  console.log('ok LF-03-admin-topbar');

  // 4. Courses page
  await page.goto('https://fineract.us/courses', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(outDir, 'LF-04-courses-topbar.png'), fullPage: false });
  console.log('ok LF-04-courses-topbar');

  await browser.close();
  console.log('Done 4/4');
})();
