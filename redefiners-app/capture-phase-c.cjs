const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--ignore-certificate-errors'] });
  const page = await browser.newPage();
  const client = await page.createCDPSession();
  await client.send('Network.setCacheDisabled', { cacheDisabled: true });
  await page.setViewport({ width: 1440, height: 900 });

  try {
    await page.goto('https://fineract.us/login/canvas', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('#pseudonym_session_unique_id', { timeout: 15000 });
    await page.type('#pseudonym_session_unique_id', 'admin@redefiners.org');
    await page.type('#pseudonym_session_password', 'ReDefiners2024!');
    await page.click('[type="submit"]');
    await new Promise(r => setTimeout(r, 5000));
    console.log('Logged in');
  } catch (e) {
    console.log('Login skipped:', e.message.substring(0, 60));
  }

  const pages = [
    ['PC-01-login', '/login'],
    ['PC-02-dashboard', '/dashboard'],
    ['PC-03-sidebar-global', '/courses'],
    ['PC-04-sidebar-course', '/courses/1'],
    ['PC-05-course-home', '/courses/1'],
    ['PC-06-assignments', '/courses/1/assignments'],
    ['PC-07-assignment-edit', '/courses/1/assignments/new'],
    ['PC-08-wiki-edit', '/courses/1/pages/new'],
    ['PC-09-discussion-edit', '/courses/1/discussions/new'],
    ['PC-10-modules', '/courses/1/modules'],
    ['PC-11-people', '/courses/1/people'],
    ['PC-12-calendar', '/calendar'],
    ['PC-13-admin', '/admin'],
    ['PC-14-profile', '/profile'],
    ['PC-15-inbox', '/inbox'],
  ];

  const outDir = 'react-screenshots/phase-c-ui-polish';
  let success = 0;
  for (const [name, url] of pages) {
    try {
      await page.goto('https://fineract.us' + url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3000));
      await page.screenshot({ path: path.join(outDir, name + '.png'), fullPage: false });
      console.log('ok ' + name);
      success++;
    } catch (e) {
      console.log('fail ' + name + ': ' + e.message.substring(0, 50));
    }
  }

  await browser.close();
  console.log('Done ' + success + '/' + pages.length);
})();
