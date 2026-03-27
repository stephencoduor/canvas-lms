const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--ignore-certificate-errors'] });
  const page = await browser.newPage();
  const client = await page.createCDPSession();
  await client.send('Network.setCacheDisabled', { cacheDisabled: true });
  await page.setViewport({ width: 1440, height: 900 });
  try {
    await page.goto('https://fineract.us/login/canvas', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForSelector('#pseudonym_session_unique_id', { timeout: 20000 });
    await page.type('#pseudonym_session_unique_id', 'admin@redefiners.org');
    await page.type('#pseudonym_session_password', 'ReDefiners2024!');
    await page.click('[type="submit"]');
    await new Promise(r => setTimeout(r, 6000));
    console.log('Logged in');
  } catch (e) { console.log('Login skipped:', e.message.substring(0, 60)); }

  const pages = [
    ['FIX-01-dashboard-courses', '/dashboard'],
    ['FIX-02-courses-grid', '/courses'],
    ['FIX-03-inbox-conversations', '/inbox'],
    ['FIX-04-eportfolio', '/eportfolio'],
    ['FIX-05-quizzes', '/courses/1/quizzes'],
    ['FIX-06-rubrics', '/courses/1/rubrics'],
    ['FIX-07-groups', '/courses/1/groups'],
  ];
  const outDir = 'react-screenshots/data-fixes';
  let s = 0;
  for (const [n, u] of pages) {
    try {
      await page.goto('https://fineract.us' + u, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 4000));
      await page.screenshot({ path: path.join(outDir, n + '.png'), fullPage: false });
      console.log('ok ' + n); s++;
    } catch (e) { console.log('fail ' + n); }
  }
  await browser.close();
  console.log('Done ' + s + '/' + pages.length);
})();
