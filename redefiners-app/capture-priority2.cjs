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
    ['P2-01-peer-reviews', '/app/courses/1/assignments/1/peer-reviews'],
    ['P2-02-appointment-group', '/app/calendar/appointments/new'],
    ['P2-03-blueprint-courses', '/app/admin/blueprint-courses'],
    ['P2-04-content-sharing', '/app/courses/1/content-sharing'],
    ['P2-05-content-exports', '/app/courses/1/exports'],
    ['P2-06-link-validator', '/app/courses/1/link-validator'],
    ['P2-07-course-statistics', '/app/courses/1/statistics'],
    ['P2-08-course-wizard', '/app/courses/new'],
    ['P2-09-grade-summary', '/app/courses/1/grades/summary'],
    ['P2-10-gradebook-history', '/app/courses/1/gradebook/history'],
    ['P2-11-gradebook-uploads', '/app/courses/1/gradebook/upload'],
    ['P2-12-question-banks', '/app/courses/1/question-banks'],
    ['P2-13-rubric-assessment', '/app/courses/1/rubrics/1/assess'],
    ['P2-14-sis-import', '/app/admin/sis-import'],
    ['P2-15-sub-accounts', '/app/admin/sub-accounts'],
    ['P2-16-user-grades', '/app/users/grades'],
    ['P2-17-user-logins', '/app/admin/users/1/logins'],
    ['P2-18-observees', '/app/settings/observees'],
    ['P2-19-user-outcomes', '/app/users/outcomes'],
    ['P2-20-course-notif-settings', '/app/courses/1/notification-settings'],
  ];

  const outDir = 'react-screenshots/priority-2';
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
