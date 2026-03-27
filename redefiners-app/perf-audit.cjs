const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--ignore-certificate-errors', '--disable-gpu']
  });
  const page = await browser.newPage();
  const client = await page.createCDPSession();
  await client.send('Performance.enable');
  await page.setViewport({ width: 1440, height: 900 });

  // Login
  try {
    await page.goto('https://fineract.us/login/canvas', { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector('#pseudonym_session_unique_id', { timeout: 15000 });
    await page.type('#pseudonym_session_unique_id', 'admin@redefiners.org');
    await page.type('#pseudonym_session_password', 'ReDefiners2024!');
    await page.click('[type="submit"]');
    await new Promise(r => setTimeout(r, 5000));
    console.log('Logged in\n');
  } catch (e) {
    console.log('Login skip:', e.message.substring(0, 60));
  }

  const testPages = [
    { name: 'Login Page', url: '/login' },
    { name: 'Dashboard', url: '/dashboard' },
    { name: 'Courses List', url: '/courses' },
    { name: 'Course Home', url: '/courses/1' },
    { name: 'Assignments', url: '/courses/1/assignments' },
    { name: 'Inbox', url: '/inbox' },
    { name: 'Calendar', url: '/calendar' },
    { name: 'Admin Dashboard', url: '/admin' },
    { name: 'Profile', url: '/profile' },
    { name: 'Gradebook', url: '/courses/1/gradebook' },
  ];

  const results = [];
  const screenshotDir = 'react-screenshots/performance-audit';
  fs.mkdirSync(screenshotDir, { recursive: true });

  for (const testPage of testPages) {
    console.log('\n' + '='.repeat(60));
    console.log('Testing: ' + testPage.name + ' (' + testPage.url + ')');
    console.log('='.repeat(60));

    const navStart = Date.now();
    await page.goto('https://fineract.us' + testPage.url, { waitUntil: 'networkidle2', timeout: 60000 });
    const loadTime = Date.now() - navStart;
    await new Promise(r => setTimeout(r, 2000));

    // Get Web Vitals + resource breakdown
    const perfMetrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      const fcp = paint.find(p => p.name === 'first-contentful-paint');
      const lcp = performance.getEntriesByType('largest-contentful-paint');
      let cls = 0;
      performance.getEntriesByType('layout-shift').forEach(ls => { if (!ls.hadRecentInput) cls += ls.value; });

      const resources = performance.getEntriesByType('resource');
      const jsRes = resources.filter(r => r.initiatorType === 'script');
      const cssRes = resources.filter(r => r.initiatorType === 'link' || r.name.endsWith('.css'));
      const imgRes = resources.filter(r => r.initiatorType === 'img');
      const fetchRes = resources.filter(r => r.initiatorType === 'fetch' || r.initiatorType === 'xmlhttprequest');

      let maxDepth = 0;
      const walk = (node, depth) => {
        if (depth > maxDepth) maxDepth = depth;
        for (const child of node.children) walk(child, depth + 1);
      };
      walk(document.body, 0);

      return {
        ttfb: nav ? Math.round(nav.responseStart - nav.requestStart) : null,
        domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : null,
        domInteractive: nav ? Math.round(nav.domInteractive - nav.startTime) : null,
        loadComplete: nav ? Math.round(nav.loadEventEnd - nav.startTime) : null,
        fcp: fcp ? Math.round(fcp.startTime) : null,
        lcp: lcp.length > 0 ? Math.round(lcp[lcp.length - 1].startTime) : null,
        cls: Math.round(cls * 1000) / 1000,
        totalResources: resources.length,
        jsCount: jsRes.length, cssCount: cssRes.length,
        imgCount: imgRes.length, apiCalls: fetchRes.length,
        totalTransferKB: Math.round(resources.reduce((s, r) => s + (r.transferSize || 0), 0) / 1024),
        jsTransferKB: Math.round(jsRes.reduce((s, r) => s + (r.transferSize || 0), 0) / 1024),
        cssTransferKB: Math.round(cssRes.reduce((s, r) => s + (r.transferSize || 0), 0) / 1024),
        imgTransferKB: Math.round(imgRes.reduce((s, r) => s + (r.transferSize || 0), 0) / 1024),
        domNodes: document.querySelectorAll('*').length,
        domDepth: maxDepth,
        // Longest resources
        slowestResources: resources
          .sort((a, b) => b.duration - a.duration)
          .slice(0, 5)
          .map(r => ({ name: r.name.split('/').pop(), duration: Math.round(r.duration), size: Math.round(r.transferSize / 1024) })),
        // Failed fetches
        failedFetches: fetchRes.filter(r => r.responseStatus >= 400).map(r => ({
          url: r.name.substring(r.name.indexOf('/api')),
          status: r.responseStatus,
        })),
      };
    });

    // CDP Memory metrics
    const cdpMetrics = await client.send('Performance.getMetrics');
    const getM = (name) => { const m = cdpMetrics.metrics.find(m => m.name === name); return m ? m.value : 0; };
    const jsHeapUsed = Math.round(getM('JSHeapUsedSize') / 1024 / 1024 * 10) / 10;
    const jsHeapTotal = Math.round(getM('JSHeapTotalSize') / 1024 / 1024 * 10) / 10;

    // Screenshot
    const ssName = 'AUDIT-' + String(testPages.indexOf(testPage) + 1).padStart(2, '0') + '-' + testPage.name.replace(/\s+/g, '-').toLowerCase();
    await page.screenshot({ path: path.join(screenshotDir, ssName + '.png'), fullPage: false });

    const result = {
      page: testPage.name, url: testPage.url,
      timing: { loadTime, ttfb: perfMetrics.ttfb, fcp: perfMetrics.fcp, lcp: perfMetrics.lcp, cls: perfMetrics.cls, domInteractive: perfMetrics.domInteractive, domContentLoaded: perfMetrics.domContentLoaded },
      network: { totalRequests: perfMetrics.totalResources, js: perfMetrics.jsCount, css: perfMetrics.cssCount, img: perfMetrics.imgCount, api: perfMetrics.apiCalls, totalKB: perfMetrics.totalTransferKB, jsKB: perfMetrics.jsTransferKB, cssKB: perfMetrics.cssTransferKB, imgKB: perfMetrics.imgTransferKB },
      dom: { nodes: perfMetrics.domNodes, depth: perfMetrics.domDepth },
      memory: { heapUsedMB: jsHeapUsed, heapTotalMB: jsHeapTotal },
      slowest: perfMetrics.slowestResources,
      failedAPIs: perfMetrics.failedFetches,
      screenshot: ssName + '.png',
    };
    results.push(result);

    // Print
    const ok = (v, good, warn) => v <= good ? ' OK' : v <= warn ? ' WARN' : ' BAD';
    console.log('\nCore Web Vitals:');
    console.log('  TTFB:            ' + perfMetrics.ttfb + 'ms' + ok(perfMetrics.ttfb, 200, 500));
    console.log('  FCP:             ' + perfMetrics.fcp + 'ms' + ok(perfMetrics.fcp, 1800, 3000));
    console.log('  LCP:             ' + (perfMetrics.lcp || 'N/A') + 'ms' + (perfMetrics.lcp ? ok(perfMetrics.lcp, 2500, 4000) : ''));
    console.log('  CLS:             ' + perfMetrics.cls + ok(perfMetrics.cls, 0.1, 0.25));
    console.log('  DOM Interactive:  ' + perfMetrics.domInteractive + 'ms');
    console.log('  Full Load:       ' + loadTime + 'ms');

    console.log('\nNetwork:');
    console.log('  Total Requests:  ' + perfMetrics.totalResources);
    console.log('  JS:              ' + perfMetrics.jsCount + ' files (' + perfMetrics.jsTransferKB + 'KB)');
    console.log('  CSS:             ' + perfMetrics.cssCount + ' files (' + perfMetrics.cssTransferKB + 'KB)');
    console.log('  Images:          ' + perfMetrics.imgCount + ' files (' + perfMetrics.imgTransferKB + 'KB)');
    console.log('  API Calls:       ' + perfMetrics.apiCalls);
    console.log('  Total Transfer:  ' + perfMetrics.totalTransferKB + 'KB');

    console.log('\nDOM & Memory:');
    console.log('  DOM Nodes:       ' + perfMetrics.domNodes + ok(perfMetrics.domNodes, 800, 1500));
    console.log('  DOM Depth:       ' + perfMetrics.domDepth + ok(perfMetrics.domDepth, 15, 25));
    console.log('  JS Heap:         ' + jsHeapUsed + 'MB / ' + jsHeapTotal + 'MB');

    if (perfMetrics.slowestResources.length > 0) {
      console.log('\nSlowest Resources:');
      perfMetrics.slowestResources.forEach(r => console.log('  ' + r.duration + 'ms  ' + r.size + 'KB  ' + r.name));
    }

    if (perfMetrics.failedFetches.length > 0) {
      console.log('\nFailed API Calls:');
      perfMetrics.failedFetches.forEach(r => console.log('  ' + r.status + ' ' + r.url));
    }
  }

  // Save JSON report
  fs.writeFileSync(path.join(screenshotDir, 'performance-report.json'), JSON.stringify(results, null, 2));

  // Summary table
  console.log('\n\n' + '='.repeat(110));
  console.log('PERFORMANCE SUMMARY TABLE');
  console.log('='.repeat(110));
  console.log(
    'Page'.padEnd(18) + 'TTFB'.padEnd(8) + 'FCP'.padEnd(8) + 'LCP'.padEnd(8) +
    'CLS'.padEnd(6) + 'Load'.padEnd(8) + 'Reqs'.padEnd(6) + 'JS KB'.padEnd(8) +
    'Total KB'.padEnd(10) + 'DOM'.padEnd(6) + 'Heap MB'
  );
  console.log('-'.repeat(110));
  results.forEach(r => {
    console.log(
      r.page.substring(0, 17).padEnd(18) +
      ((r.timing.ttfb || '-') + '').padEnd(8) +
      ((r.timing.fcp || '-') + '').padEnd(8) +
      ((r.timing.lcp || '-') + '').padEnd(8) +
      (r.timing.cls + '').padEnd(6) +
      (r.timing.loadTime + '').padEnd(8) +
      (r.network.totalRequests + '').padEnd(6) +
      (r.network.jsKB + '').padEnd(8) +
      (r.network.totalKB + '').padEnd(10) +
      (r.dom.nodes + '').padEnd(6) +
      r.memory.heapUsedMB
    );
  });

  // Grade summary
  console.log('\n' + '='.repeat(110));
  console.log('WEB VITALS GRADES');
  console.log('='.repeat(110));
  const avgTTFB = Math.round(results.reduce((s, r) => s + (r.timing.ttfb || 0), 0) / results.length);
  const avgFCP = Math.round(results.reduce((s, r) => s + (r.timing.fcp || 0), 0) / results.length);
  const avgLCP = Math.round(results.filter(r => r.timing.lcp).reduce((s, r) => s + r.timing.lcp, 0) / results.filter(r => r.timing.lcp).length);
  const avgCLS = Math.round(results.reduce((s, r) => s + r.timing.cls, 0) / results.length * 1000) / 1000;
  console.log('Average TTFB: ' + avgTTFB + 'ms ' + (avgTTFB < 200 ? 'GOOD' : avgTTFB < 500 ? 'NEEDS IMPROVEMENT' : 'POOR'));
  console.log('Average FCP:  ' + avgFCP + 'ms ' + (avgFCP < 1800 ? 'GOOD' : avgFCP < 3000 ? 'NEEDS IMPROVEMENT' : 'POOR'));
  console.log('Average LCP:  ' + avgLCP + 'ms ' + (avgLCP < 2500 ? 'GOOD' : avgLCP < 4000 ? 'NEEDS IMPROVEMENT' : 'POOR'));
  console.log('Average CLS:  ' + avgCLS + ' ' + (avgCLS < 0.1 ? 'GOOD' : avgCLS < 0.25 ? 'NEEDS IMPROVEMENT' : 'POOR'));

  await browser.close();
  console.log('\nReport + screenshots saved to: ' + screenshotDir);
})();
