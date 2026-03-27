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
    // Pages that previously had no data
    ['DS-01-dashboard-with-courses', '/dashboard'],
    ['DS-02-courses-enrolled', '/courses'],
    ['DS-03-quizzes-list', '/courses/1/quizzes'],
    ['DS-04-quiz-detail', '/courses/1/quizzes/1'],
    ['DS-05-rubrics-list', '/courses/1/rubrics'],
    ['DS-06-groups-list', '/courses/1/groups'],
    ['DS-07-inbox-messages', '/inbox'],
    ['DS-08-calendar-events', '/calendar'],
    ['DS-09-eportfolio', '/eportfolio'],
    ['DS-10-gradebook-data', '/courses/1/gradebook'],
    ['DS-11-people-roster', '/courses/1/people'],
    ['DS-12-pages-list', '/courses/1/pages'],
    ['DS-13-discussions-list', '/courses/1/discussions'],
    ['DS-14-modules-list', '/courses/1/modules'],
    ['DS-15-assignments-list', '/courses/1/assignments'],
  ];

  const outDir = 'react-screenshots/data-seeding';
  let success = 0;
  for (const [name, url] of pages) {
    try {
      await page.goto('https://fineract.us' + url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 4000));
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
