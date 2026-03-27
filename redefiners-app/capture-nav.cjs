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
    ['NAV-01-dashboard-sidebar', '/dashboard'],
    ['NAV-02-courses-sidebar', '/courses'],
    ['NAV-03-calendar-expanded', '/calendar'],
    ['NAV-04-inbox-expanded', '/inbox'],
    ['NAV-05-learn-grow-section', '/learning-objectives'],
    ['NAV-06-community-section', '/tutoring'],
    ['NAV-07-analytics-section', '/analytics'],
    ['NAV-08-admin-section', '/admin'],
    ['NAV-09-course-context', '/courses/1'],
    ['NAV-10-course-assignments', '/courses/1/assignments'],
    ['NAV-11-search-test', '/dashboard'],
    ['NAV-12-account-section', '/profile'],
  ];

  const dir = 'react-screenshots/nav-redesign';
  let ok = 0;
  for (const [name, url] of pages) {
    try {
      await page.goto('https://fineract.us' + url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3000));

      // For search test, type in the search box
      if (name.includes('search')) {
        const searchInput = await page.$('aside input[type="text"]');
        if (searchInput) {
          await searchInput.type('quiz');
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      await page.screenshot({ path: path.join(dir, name + '.png'), fullPage: false });
      console.log('ok ' + name);
      ok++;
    } catch (e) { console.log('fail ' + name + ': ' + e.message.substring(0, 50)); }
  }

  await browser.close();
  console.log('Done ' + ok + '/' + pages.length);
})();
