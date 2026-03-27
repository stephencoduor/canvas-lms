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
    ['F404-01-chat', '/chat'],
    ['F404-02-feedback', '/feedback'],
    ['F404-03-message-templates', '/message-templates'],
    ['F404-04-announcements-editor', '/announcements/editor'],
    ['F404-05-mentoring', '/mentoring'],
    ['F404-06-tutoring', '/tutoring'],
    ['F404-07-certificates', '/certificates'],
    ['F404-08-career-services', '/career-services'],
    ['F404-09-study-groups', '/study-groups'],
    ['F404-10-attendance', '/attendance'],
    ['F404-11-wellness', '/wellness'],
    ['F404-12-goal-setting', '/goal-setting'],
    ['F404-13-office-hours', '/office-hours'],
    ['F404-14-room-booking', '/room-booking'],
    ['F404-15-academic-calendar', '/academic-calendar'],
    ['F404-16-video-studio', '/video-studio'],
    ['F404-17-content-library', '/content-library'],
    ['F404-18-resource-library', '/resource-library'],
    ['F404-19-interactive-tools', '/interactive-tools'],
    ['F404-20-learning-analytics', '/learning-analytics'],
    ['F404-21-analytics-hub', '/analytics-hub'],
    ['F404-22-engagement', '/engagement'],
    ['F404-23-competencies', '/competencies'],
    ['F404-24-learning-objectives', '/learning-objectives'],
    ['F404-25-progress-tracker', '/progress-tracker'],
    ['F404-26-admin-system-health', '/admin/system-health'],
    ['F404-27-admin-audit-log', '/admin/audit-log'],
    ['F404-28-admin-api-tokens', '/admin/api-tokens'],
    ['F404-29-admin-data-privacy', '/admin/data-privacy'],
    ['F404-30-admin-backup', '/admin/backup'],
  ];

  const outDir = 'react-screenshots/fix-404-pages';
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
