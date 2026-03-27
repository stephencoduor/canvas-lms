const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--ignore-certificate-errors', '--disable-web-security'] });
  const page = await browser.newPage();
  // Disable cache
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
    // Batch 1: Core pages (1-30)
    ['01-login', '/login.html'], ['02-dashboard', '/dashboard.html'], ['03-courses', '/courses.html'],
    ['04-calendar', '/calendar.html'], ['05-inbox', '/inbox.html'], ['06-profile', '/profile.html'],
    ['07-assignments', '/assignments.html'], ['08-modules', '/modules.html'], ['09-grades', '/grades.html'],
    ['10-files', '/files.html'], ['11-syllabus', '/syllabus.html'], ['12-quizzes', '/quizzes.html'],
    ['13-gradebook', '/gradebook.html'], ['14-rubrics', '/rubrics.html'], ['15-discussions', '/discussions.html'],
    ['16-people', '/people.html'], ['17-speed-grader', '/speed-grader.html'], ['18-announcements', '/announcement.html'],
    ['19-conferences', '/conferences.html'], ['20-groups', '/groups.html'], ['21-outcomes', '/outcomes.html'],
    ['22-pages', '/pages.html'], ['23-mentoring', '/mentoring.html'], ['24-system-health', '/system-health.html'],
    ['25-help-center', '/help-center.html'], ['26-score-analytics', '/score-analytics.html'],
    ['27-certificates', '/certificates.html'], ['28-tutoring', '/tutoring.html'],
    ['29-career-services', '/career-services.html'], ['30-student-dashboard', '/student-dashboard.html'],
    // Batch 2: Assessment, Admin, Communication (31-60)
    ['31-quiz-builder', '/quiz-builder.html'], ['32-grade-export', '/grade-export.html'],
    ['33-rubric-builder', '/rubric-builder.html'], ['34-assessment-bank', '/assessment-bank.html'],
    ['35-grading-schemes', '/grading-schemes.html'], ['36-moderated-grading', '/moderated-grading.html'],
    ['37-late-policy', '/late-policy.html'], ['38-standards-mastery', '/standards-mastery.html'],
    ['39-enrollment-mgmt', '/enrollment-management.html'], ['40-course-templates', '/course-templates.html'],
    ['41-institution-settings', '/institution-settings.html'], ['42-term-management', '/term-management.html'],
    ['43-audit-log', '/audit-log.html'], ['44-data-privacy', '/data-privacy.html'],
    ['45-backup-restore', '/backup-restore.html'], ['46-api-tokens', '/api-tokens.html'],
    ['47-notification-prefs', '/notification-preferences.html'], ['48-discussion-analytics', '/discussion-analytics.html'],
    ['49-conference-recording', '/conference-recording.html'], ['50-group-assignment', '/group-assignment.html'],
    ['51-message-templates', '/message-templates.html'], ['52-collaboration-spaces', '/collaboration-spaces.html'],
    ['53-study-groups', '/study-groups.html'], ['54-feedback-center', '/feedback-center.html'],
    ['55-chat-room', '/chat-room.html'], ['56-announcement-editor', '/announcement-editor.html'],
    ['57-learning-objectives', '/learning-objectives.html'], ['58-competency-tracking', '/competency-tracking.html'],
    ['59-wellness-check', '/wellness-check.html'], ['60-goal-setting', '/goal-setting.html'],
    // Batch 3: Content, Media, Scheduling (61-80)
    ['61-content-library', '/content-library.html'], ['62-video-studio', '/video-studio.html'],
    ['63-audio-recorder', '/audio-recorder.html'], ['64-image-editor', '/image-editor.html'],
    ['65-document-viewer', '/document-viewer.html'], ['66-scorm-player', '/scorm-player.html'],
    ['67-accessibility-checker', '/accessibility-checker.html'], ['68-interactive-tools', '/interactive-tools.html'],
    ['69-event-registration', '/event-registration.html'], ['70-room-booking', '/room-booking.html'],
    ['71-office-hours', '/office-hours.html'], ['72-academic-calendar', '/academic-calendar.html'],
    ['73-instructor-dashboard', '/instructor-dashboard.html'], ['74-parent-portal', '/parent-portal.html'],
    ['75-attendance', '/attendance.html'], ['76-resource-library', '/resource-library.html'],
    ['77-student-support', '/student-support.html'], ['78-account-settings', '/account-settings.html'],
    ['79-course-settings', '/course-settings.html'], ['80-notifications', '/notifications.html'],
  ];

  const outDir = process.argv[2] || 'screenshots/deployed';
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
