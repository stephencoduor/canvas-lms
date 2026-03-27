/**
 * Screenshot Capture Script for ReDefiners Theme Pages
 *
 * Usage: node capture-screenshots.js
 * Requires: npm install puppeteer
 *
 * Takes full-page screenshots of all ReDefiners theme pages
 * and saves them to the screenshots/ directory.
 */

const puppeteer = require('puppeteer');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

const pages = [
  // Original pages
  { name: '01-login', path: '/login.html' },
  { name: '02-dashboard', path: '/dashboard.html' },
  { name: '03-courses', path: '/courses.html' },
  { name: '04-class', path: '/class.html' },
  { name: '05-classroom', path: '/classroom.html' },
  { name: '06-calendar', path: '/calendar.html' },
  { name: '07-announcement', path: '/announcement.html' },
  { name: '08-assignments', path: '/assignments.html' },
  { name: '09-grades', path: '/grades.html' },
  { name: '10-inbox', path: '/inbox.html' },
  { name: '11-modules', path: '/modules.html' },
  { name: '12-profile', path: '/profile.html' },
  // New pages
  { name: '13-discussions', path: '/discussions.html' },
  { name: '14-discussion-thread', path: '/discussion-thread.html' },
  { name: '15-quizzes', path: '/quizzes.html' },
  { name: '16-quiz-take', path: '/quiz-take.html' },
  { name: '17-quiz-results', path: '/quiz-results.html' },
  { name: '18-pages', path: '/pages.html' },
  { name: '19-page-view', path: '/page-view.html' },
  { name: '20-syllabus', path: '/syllabus.html' },
  { name: '21-files', path: '/files.html' },
  { name: '22-people', path: '/people.html' },
  { name: '23-groups', path: '/groups.html' },
  { name: '24-assignment-detail', path: '/assignment-detail.html' },
  { name: '25-submission', path: '/submission.html' },
  { name: '26-gradebook', path: '/gradebook.html' },
  { name: '27-speed-grader', path: '/speed-grader.html' },
  { name: '28-course-settings', path: '/course-settings.html' },
  { name: '29-analytics', path: '/analytics.html' },
  { name: '30-account-settings', path: '/account-settings.html' },
  { name: '31-notifications', path: '/notifications.html' },
  { name: '32-conferences', path: '/conferences.html' },
  { name: '33-collaborations', path: '/collaborations.html' },
  { name: '34-outcomes', path: '/outcomes.html' },
  { name: '35-rubrics', path: '/rubrics.html' },
  { name: '36-eportfolio', path: '/eportfolio.html' },
  { name: '37-styleguide', path: '/styleguide.html' },
];

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  for (const pg of pages) {
    const url = `${BASE_URL}${pg.path}`;
    console.log(`Capturing: ${pg.name} (${url})`);

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
      await page.waitForTimeout(1000); // Allow fonts/images to load

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${pg.name}.png`),
        fullPage: false, // Viewport screenshot (not full scroll)
        type: 'png',
      });

      console.log(`  ✓ Saved: screenshots/${pg.name}.png`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\nDone! ${pages.length} screenshots saved to screenshots/`);
})();
