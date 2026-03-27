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
    ['P3-01-acceptable-use', '/app/acceptable-use'],
    ['P3-02-admin-tools', '/app/admin/tools'],
    ['P3-03-calendar-settings', '/app/admin/calendar-settings'],
    ['P3-04-account-search', '/app/admin/search'],
    ['P3-05-grading-settings', '/app/admin/grading-settings'],
    ['P3-06-grading-standards', '/app/admin/grading-standards'],
    ['P3-07-account-manage', '/app/admin/account'],
    ['P3-08-account-notifications', '/app/admin/notifications'],
    ['P3-09-account-statistics', '/app/admin/statistics'],
    ['P3-10-act-as-user', '/app/admin/act-as'],
    ['P3-11-admin-split', '/app/admin/split'],
    ['P3-12-auth-providers', '/app/admin/auth-providers'],
    ['P3-13-brand-configs', '/app/admin/themes'],
    ['P3-14-plugins', '/app/admin/plugins'],
    ['P3-15-rate-limiting', '/app/admin/rate-limiting'],
    ['P3-16-release-notes', '/app/admin/release-notes'],
    ['P3-17-page-views', '/app/admin/page-views'],
    ['P3-18-theme-editor', '/app/admin/theme-editor'],
    ['P3-19-theme-preview', '/app/admin/theme-preview'],
    ['P3-20-terms-manage', '/app/admin/terms/manage'],
    ['P3-21-feature-flags', '/app/admin/feature-flags'],
    ['P3-22-prior-users', '/app/courses/1/prior-users'],
    ['P3-23-course-grading', '/app/courses/1/grading-standards'],
    ['P3-24-manage-groups', '/app/courses/1/groups/manage'],
    ['P3-25-add-people', '/app/courses/1/people/add'],
    ['P3-26-sections', '/app/courses/1/sections'],
    ['P3-27-teacher-report', '/app/courses/1/teacher-report'],
    ['P3-28-course-nav', '/app/courses/1/navigation'],
    ['P3-29-public-profile', '/app/users/1'],
    ['P3-30-registration', '/app/register'],
  ];

  const outDir = 'react-screenshots/priority-3';
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
