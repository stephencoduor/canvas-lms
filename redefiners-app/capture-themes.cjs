const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--ignore-certificate-errors'] });
  const page = await browser.newPage();
  const client = await page.createCDPSession();
  await client.send('Network.setCacheDisabled', { cacheDisabled: true });
  await page.setViewport({ width: 1440, height: 900 });

  try {
    await page.goto('https://fineract.us/login/canvas', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForSelector('#pseudonym_session_unique_id', { timeout: 20000 });
    await page.type('#pseudonym_session_unique_id', 'admin@redefiners.org');
    await page.type('#pseudonym_session_password', 'ReDefiners2024!');
    await page.click('[type="submit"]');
    await new Promise(r => setTimeout(r, 6000));
    console.log('Logged in');
  } catch (e) { console.log('Login skipped:', e.message.substring(0, 60)); }

  const outDir = 'react-screenshots/theme-system';

  // Theme 1: Dark Accent (default)
  const darkPages = [
    ['TH-01-dark-accent-dashboard', '/dashboard'],
    ['TH-02-dark-accent-courses', '/courses/1'],
    ['TH-03-dark-accent-settings', '/settings'],
  ];
  for (const [name, url] of darkPages) {
    try {
      await page.goto('https://fineract.us' + url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 4000));
      await page.screenshot({ path: path.join(outDir, name + '.png'), fullPage: false });
      console.log('ok ' + name);
    } catch (e) { console.log('fail ' + name); }
  }

  // Switch to Teal Classic
  await page.goto('https://fineract.us/dashboard', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  await page.evaluate(() => {
    localStorage.setItem('redefiners-theme-id', 'teal-classic');
    document.documentElement.setAttribute('data-theme', 'teal-classic');
    // Load theme CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/themes/teal-classic.css';
    document.head.appendChild(link);
  });
  await new Promise(r => setTimeout(r, 1500));

  const tealPages = [
    ['TH-04-teal-classic-dashboard', '/dashboard'],
    ['TH-05-teal-classic-courses', '/courses/1'],
  ];
  for (const [name, url] of tealPages) {
    try {
      await page.goto('https://fineract.us' + url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3000));
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'teal-classic');
      });
      await new Promise(r => setTimeout(r, 500));
      await page.screenshot({ path: path.join(outDir, name + '.png'), fullPage: false });
      console.log('ok ' + name);
    } catch (e) { console.log('fail ' + name); }
  }

  // Switch to Ocean Blue
  await page.evaluate(() => {
    localStorage.setItem('redefiners-theme-id', 'ocean-blue');
    document.documentElement.setAttribute('data-theme', 'ocean-blue');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/themes/ocean-blue.css';
    document.head.appendChild(link);
  });
  await new Promise(r => setTimeout(r, 1500));

  const bluPages = [
    ['TH-06-ocean-blue-dashboard', '/dashboard'],
    ['TH-07-ocean-blue-courses', '/courses/1'],
  ];
  for (const [name, url] of bluPages) {
    try {
      await page.goto('https://fineract.us' + url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3000));
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'ocean-blue');
      });
      await new Promise(r => setTimeout(r, 500));
      await page.screenshot({ path: path.join(outDir, name + '.png'), fullPage: false });
      console.log('ok ' + name);
    } catch (e) { console.log('fail ' + name); }
  }

  // Theme picker in admin
  await page.evaluate(() => {
    localStorage.setItem('redefiners-theme-id', 'dark-accent');
    document.documentElement.setAttribute('data-theme', 'dark-accent');
  });
  try {
    await page.goto('https://fineract.us/admin/themes', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));
    await page.screenshot({ path: path.join(outDir, 'TH-08-admin-themes.png'), fullPage: false });
    console.log('ok TH-08-admin-themes');
  } catch (e) { console.log('fail TH-08-admin-themes'); }

  await browser.close();
  console.log('Done');
})();
