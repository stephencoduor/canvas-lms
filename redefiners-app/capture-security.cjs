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

  const pages = [
    ['SEC-01-dashboard', '/dashboard'],
    ['SEC-02-admin-dashboard', '/admin'],
    ['SEC-03-admin-users', '/admin/users'],
    ['SEC-04-admin-permissions', '/admin/permissions'],
    ['SEC-05-assignment-detail', '/courses/1/assignments/1'],
    ['SEC-06-discussion-thread', '/courses/1/discussions/1'],
    ['SEC-07-page-view', '/courses/1/pages/front-page'],
    ['SEC-08-inbox', '/inbox'],
    ['SEC-09-syllabus', '/courses/1/syllabus'],
    ['SEC-10-quiz-show', '/courses/1/quizzes/1'],
  ];

  const outDir = 'react-screenshots/security-fixes';
  let success = 0;
  for (const [name, url] of pages) {
    try {
      await page.goto('https://fineract.us' + url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3000));
      await page.screenshot({ path: path.join(outDir, name + '.png'), fullPage: false });
      console.log('ok ' + name);
      success++;
    } catch (e) { console.log('fail ' + name + ': ' + e.message.substring(0, 50)); }
  }

  // Also check security headers
  const response = await page.goto('https://fineract.us/dashboard', { waitUntil: 'domcontentloaded' });
  const headers = response.headers();
  console.log('\n=== SECURITY HEADERS ===');
  ['content-security-policy', 'x-frame-options', 'x-content-type-options', 'strict-transport-security', 'referrer-policy', 'permissions-policy'].forEach(h => {
    console.log(h + ': ' + (headers[h] ? 'PRESENT' : 'MISSING'));
  });

  await browser.close();
  console.log('\nDone ' + success + '/' + pages.length);
})();
