const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--ignore-certificate-errors'] });
  const page = await browser.newPage();
  const client = await page.createCDPSession();
  await client.send('Network.setCacheDisabled', { cacheDisabled: true });
  await page.setViewport({ width: 1440, height: 900 });

  // Login via Canvas first
  try {
    await page.goto('https://fineract.us/login/canvas', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('#pseudonym_session_unique_id', { timeout: 15000 });
    await page.type('#pseudonym_session_unique_id', 'admin@redefiners.org');
    await page.type('#pseudonym_session_password', 'ReDefiners2024!');
    await page.click('[type="submit"]');
    await new Promise(r => setTimeout(r, 5000));
    console.log('Logged in via Canvas');
  } catch (e) {
    console.log('Login skipped:', e.message.substring(0, 60));
  }

  const pages = [
    // Batch 1: Core Shell
    ['B1-01-login', '/app/login'],
    ['B1-02-dashboard', '/app/dashboard'],
    // Batch 2: Course pages
    ['B2-01-courses', '/app/courses'],
    ['B2-02-course-home', '/app/courses/1'],
    ['B2-03-assignments', '/app/courses/1/assignments'],
    ['B2-04-assignment-detail', '/app/courses/1/assignments/1'],
    ['B2-05-modules', '/app/courses/1/modules'],
    ['B2-06-grades', '/app/courses/1/grades'],
    ['B2-07-pages', '/app/courses/1/pages'],
    ['B2-08-files', '/app/courses/1/files'],
    ['B2-09-syllabus', '/app/courses/1/syllabus'],
    // Also test with different course
    ['B2-10-course2-home', '/app/courses/2'],
    ['B2-11-course2-assignments', '/app/courses/2/assignments'],
    // Batch 3: Communication & Assessment
    ['B3-01-discussions', '/app/courses/1/discussions'],
    ['B3-02-quizzes', '/app/courses/1/quizzes'],
    ['B3-03-people', '/app/courses/1/people'],
    ['B3-04-groups', '/app/courses/1/groups'],
    ['B3-05-conferences', '/app/courses/1/conferences'],
    ['B3-06-inbox', '/app/inbox'],
    ['B3-07-profile', '/app/profile'],
    // Batch 4: Admin, Settings, Calendar, Gradebook
    ['B4-01-admin-dashboard', '/app/admin'],
    ['B4-02-admin-users', '/app/admin/users'],
    ['B4-03-admin-reports', '/app/admin/reports'],
    ['B4-04-admin-terms', '/app/admin/terms'],
    ['B4-05-account-settings', '/app/settings'],
    ['B4-06-course-settings', '/app/courses/1/settings'],
    ['B4-07-calendar', '/app/calendar'],
    ['B4-08-planner', '/app/planner'],
    ['B4-09-eportfolio', '/app/eportfolio'],
    ['B4-10-outcomes', '/app/courses/1/outcomes'],
    ['B4-11-rubrics', '/app/courses/1/rubrics'],
    ['B4-12-gradebook', '/app/courses/1/gradebook'],
    ['B4-13-speed-grader', '/app/courses/1/speed-grader'],
    // Priority 1: Content Editors & Quiz Workflow
    ['P1-01-assignment-edit', '/app/courses/1/assignments/new'],
    ['P1-02-page-edit', '/app/courses/1/pages/new'],
    ['P1-03-discussion-new', '/app/courses/1/discussions/new'],
    ['P1-04-course-copy', '/app/courses/1/copy'],
    ['P1-05-course-paces', '/app/courses/1/paces'],
    // Test 404
    ['B1-03-404', '/app/nonexistent-page'],
  ];

  const outDir = 'react-screenshots';
  let success = 0;
  for (const [name, url] of pages) {
    try {
      await page.goto('https://fineract.us' + url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 4000)); // Wait for React to render + API calls
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
