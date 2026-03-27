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
    // Light mode pages
    ['PD-01-dashboard-light', '/dashboard'],
    ['PD-02-courses-light', '/courses'],
    ['PD-03-course-home-light', '/courses/1'],
    ['PD-04-inbox-light', '/inbox'],
    ['PD-05-admin-light', '/admin'],
  ];

  const outDir = 'react-screenshots/phase-d-features';
  let success = 0;

  // Capture light mode
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

  // Toggle dark mode
  try {
    await page.goto('https://fineract.us/dashboard', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    // Click the dark mode toggle (Sun/Moon icon in TopBar)
    await page.evaluate(() => {
      localStorage.setItem('redefiners-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await new Promise(r => setTimeout(r, 1000));

    const darkPages = [
      ['PD-06-dashboard-dark', '/dashboard'],
      ['PD-07-courses-dark', '/courses'],
      ['PD-08-course-home-dark', '/courses/1'],
      ['PD-09-inbox-dark', '/inbox'],
      ['PD-10-admin-dark', '/admin'],
    ];

    for (const [name, url] of darkPages) {
      try {
        await page.goto('https://fineract.us' + url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));
        await page.evaluate(() => {
          document.documentElement.classList.add('dark');
        });
        await new Promise(r => setTimeout(r, 500));
        await page.screenshot({ path: path.join(outDir, name + '.png'), fullPage: false });
        console.log('ok ' + name);
        success++;
      } catch (e) {
        console.log('fail ' + name + ': ' + e.message.substring(0, 50));
      }
    }

    // Reset to light
    await page.evaluate(() => {
      localStorage.setItem('redefiners-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
  } catch (e) {
    console.log('Dark mode toggle failed:', e.message.substring(0, 50));
  }

  // Mobile viewport for bottom nav
  await page.setViewport({ width: 375, height: 812 });
  const mobilePages = [
    ['PD-11-mobile-dashboard', '/dashboard'],
    ['PD-12-mobile-courses', '/courses'],
    ['PD-13-mobile-inbox', '/inbox'],
  ];

  for (const [name, url] of mobilePages) {
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
  console.log('Done ' + success + '/13');
})();
