const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--ignore-certificate-errors'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    await page.goto('https://fineract.us/login/canvas', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('#pseudonym_session_unique_id', { timeout: 15000 });
    await page.type('#pseudonym_session_unique_id', 'admin@redefiners.org');
    await page.type('#pseudonym_session_password', 'ReDefiners2024!');
    await page.click('[type="submit"]');
    await new Promise(r => setTimeout(r, 5000));
    console.log('Logged in');
  } catch (e) { console.log('Login skip:', e.message.substring(0, 50)); }

  const pages = [
    ['PERF-01-login-fast', '/login'],
    ['PERF-02-dashboard-fast', '/dashboard'],
    ['PERF-03-courses-fast', '/courses'],
    ['PERF-04-course-home', '/courses/1'],
    ['PERF-05-assignments', '/courses/1/assignments'],
    ['PERF-06-inbox', '/inbox'],
    ['PERF-07-admin', '/admin'],
    ['PERF-08-calendar', '/calendar'],
    ['PERF-09-analytics', '/analytics'],
    ['PERF-10-profile', '/profile'],
  ];

  const dir = 'react-screenshots/performance';
  let ok = 0;
  for (const [name, url] of pages) {
    try {
      const start = Date.now();
      await page.goto('https://fineract.us' + url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 2500));
      const elapsed = Date.now() - start;
      await page.screenshot({ path: path.join(dir, name + '.png'), fullPage: false });
      console.log('ok ' + name + ' (' + elapsed + 'ms)');
      ok++;
    } catch (e) { console.log('fail ' + name + ': ' + e.message.substring(0, 50)); }
  }

  await browser.close();
  console.log('Done ' + ok + '/' + pages.length);
})();
