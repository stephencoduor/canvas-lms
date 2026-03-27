const puppeteer = require('puppeteer');
const path = require('path');

async function loginAndCapture(browser, email, password, role, pages) {
  const page = await browser.newPage();
  const client = await page.createCDPSession();
  await client.send('Network.setCacheDisabled', { cacheDisabled: true });
  await page.setViewport({ width: 1440, height: 900 });

  // First logout any existing session
  try {
    await page.goto('https://fineract.us/logout', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));
  } catch {}

  // Login via Canvas
  try {
    await page.goto('https://fineract.us/login/canvas', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('#pseudonym_session_unique_id', { timeout: 10000 });
    // Clear fields first
    await page.click('#pseudonym_session_unique_id', { clickCount: 3 });
    await page.type('#pseudonym_session_unique_id', email);
    await page.click('#pseudonym_session_password', { clickCount: 3 });
    await page.type('#pseudonym_session_password', password);
    await page.click('[type="submit"]');
    await new Promise(r => setTimeout(r, 5000));
    console.log(`  Logged in as ${email}`);
  } catch (e) {
    console.log(`  Login FAILED for ${email}: ${e.message.substring(0, 50)}`);
    await page.close();
    return [];
  }

  const results = [];
  const outDir = 'react-screenshots/user-testing';

  for (const [name, url] of pages) {
    try {
      await page.goto('https://fineract.us' + url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3000));
      const filename = `${role}-${name}.png`;
      await page.screenshot({ path: path.join(outDir, filename), fullPage: false });
      console.log(`  ok ${filename}`);
      results.push({ name: filename, status: 'ok' });
    } catch (e) {
      console.log(`  fail ${role}-${name}: ${e.message.substring(0, 40)}`);
      results.push({ name: `${role}-${name}`, status: 'fail', error: e.message.substring(0, 40) });
    }
  }

  await page.close();
  return results;
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
  });

  const allResults = [];

  // ═══ 1. ADMIN USER ═══
  console.log('\n=== ADMIN: admin@redefiners.org ===');
  const adminPages = [
    ['01-dashboard', '/dashboard'],
    ['02-courses', '/courses'],
    ['03-admin-dashboard', '/admin'],
    ['04-admin-users', '/admin/users'],
    ['05-admin-reports', '/admin/reports'],
    ['06-admin-permissions', '/admin/permissions'],
    ['07-admin-terms', '/admin/terms'],
    ['08-settings', '/settings'],
    ['09-profile', '/profile'],
    ['10-inbox', '/inbox'],
    ['11-calendar', '/calendar'],
    ['12-notifications', '/notifications'],
  ];
  allResults.push(...await loginAndCapture(browser, 'admin@redefiners.org', 'ReDefiners2024!', 'admin', adminPages));

  // ═══ 2. TEACHER USER ═══
  console.log('\n=== TEACHER: mgarcia@redefiners.edu ===');
  const teacherPages = [
    ['01-dashboard', '/dashboard'],
    ['02-courses', '/courses'],
    ['03-course-home', '/courses/1/'],
    ['04-assignments', '/courses/1/assignments'],
    ['05-gradebook', '/courses/1/gradebook'],
    ['06-speed-grader', '/courses/1/speed-grader'],
    ['07-people', '/courses/1/people'],
    ['08-modules', '/courses/1/modules'],
    ['09-discussions', '/courses/1/discussions'],
    ['10-quizzes', '/courses/1/quizzes'],
    ['11-inbox', '/inbox'],
    ['12-profile', '/profile'],
  ];
  allResults.push(...await loginAndCapture(browser, 'mgarcia@redefiners.edu', 'ReDefTeacher2024!', 'teacher', teacherPages));

  // ═══ 3. STUDENT USER ═══
  console.log('\n=== STUDENT: aisha.johnson@redefiners.edu ===');
  const studentPages = [
    ['01-dashboard', '/dashboard'],
    ['02-courses', '/courses'],
    ['03-course-home', '/courses/1/'],
    ['04-assignments', '/courses/1/assignments'],
    ['05-grades', '/courses/1/grades'],
    ['06-modules', '/courses/1/modules'],
    ['07-discussions', '/courses/1/discussions'],
    ['08-quizzes', '/courses/1/quizzes'],
    ['09-pages', '/courses/1/pages'],
    ['10-files', '/courses/1/files'],
    ['11-inbox', '/inbox'],
    ['12-profile', '/profile'],
    ['13-planner', '/planner'],
    ['14-eportfolio', '/eportfolio'],
    ['15-calendar', '/calendar'],
  ];
  allResults.push(...await loginAndCapture(browser, 'aisha.johnson@redefiners.edu', 'ReDefStudent2024!', 'student', studentPages));

  await browser.close();

  // Summary
  const ok = allResults.filter(r => r.status === 'ok').length;
  const fail = allResults.filter(r => r.status === 'fail').length;
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total: ${allResults.length} | OK: ${ok} | FAIL: ${fail}`);
  if (fail > 0) {
    console.log('Failed:');
    allResults.filter(r => r.status === 'fail').forEach(r => console.log(`  - ${r.name}: ${r.error}`));
  }
})();
