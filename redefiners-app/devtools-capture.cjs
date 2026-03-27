const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OVERLAY_SCRIPT = `
const overlay = document.createElement('div');
overlay.style.cssText = 'position:fixed;top:0;right:0;z-index:99999;background:rgba(0,0,0,0.92);color:#fff;padding:16px;font-family:monospace;font-size:11px;width:380px;max-height:100vh;overflow-y:auto;border-left:3px solid #2DB88A;';
const nav = performance.getEntriesByType('navigation')[0];
const resources = performance.getEntriesByType('resource');
const jsRes = resources.filter(r => r.name.endsWith('.js'));
const apiRes = resources.filter(r => r.name.includes('/api/'));
const grade = (v, good, warn) => v <= good ? '#2DB88A' : v <= warn ? '#F5C542' : '#EF4444';
const bar = (l, v, m, c) => '<div style="margin:4px 0"><div style="display:flex;justify-content:space-between"><span>'+l+'</span><span style="color:'+c+'">'+v+'</span></div><div style="background:#333;border-radius:3px;height:6px;margin-top:2px"><div style="background:'+c+';height:6px;border-radius:3px;width:'+Math.min(100,Math.round(parseInt(v)/m*100))+'%"></div></div></div>';
const t = Math.round(nav.responseStart-nav.requestStart);
const d = Math.round(nav.domInteractive);
const l = Math.round(nav.loadEventEnd);
const mem = Math.round(performance.memory.usedJSHeapSize/1024/1024);
const dom = document.querySelectorAll('*').length;
overlay.innerHTML = '<div style="font-size:14px;font-weight:bold;color:#2DB88A;margin-bottom:10px">Performance Inspector</div><div style="color:#999;margin-bottom:8px">'+location.pathname+'</div><div style="border-bottom:1px solid #444;padding-bottom:8px;margin-bottom:8px"><div style="font-weight:bold;color:#F5C542;margin-bottom:6px">Core Web Vitals</div>'+bar('TTFB',t+'ms',500,grade(t,200,500))+bar('DOM Interactive',d+'ms',1000,grade(d,300,600))+bar('Load Complete',l+'ms',5000,grade(l,2000,4000))+'</div><div style="border-bottom:1px solid #444;padding-bottom:8px;margin-bottom:8px"><div style="font-weight:bold;color:#F5C542;margin-bottom:6px">Network</div>'+bar('Total Requests',resources.length,100,grade(resources.length,50,80))+bar('JS Files',jsRes.length+' files',60,grade(jsRes.length,30,50))+bar('API Calls',apiRes.length,15,grade(apiRes.length,5,10))+'</div><div style="border-bottom:1px solid #444;padding-bottom:8px;margin-bottom:8px"><div style="font-weight:bold;color:#F5C542;margin-bottom:6px">DOM & Memory</div>'+bar('DOM Nodes',dom,1500,grade(dom,500,1000))+bar('JS Heap',mem+'MB',100,grade(mem,30,60))+'</div><div><div style="font-weight:bold;color:#F5C542;margin-bottom:6px">Slowest Resources</div>'+resources.sort((a,b)=>b.duration-a.duration).slice(0,5).map(r=>'<div style="display:flex;justify-content:space-between;margin:3px 0"><span style="color:#999">'+r.name.split('/').pop().split('?')[0].substring(0,30)+'</span><span style="color:'+grade(Math.round(r.duration),300,800)+'">'+Math.round(r.duration)+'ms</span></div>').join('')+'</div><div style="margin-top:8px"><div style="font-weight:bold;color:#F5C542;margin-bottom:6px">API Calls</div>'+apiRes.map(r=>'<div style="display:flex;justify-content:space-between;margin:3px 0"><span style="color:'+(r.responseStatus>=400?'#EF4444':'#2DB88A')+'">'+(r.responseStatus||'?')+'</span><span style="color:#999">'+r.name.split('/api')[1].split('?')[0].substring(0,35)+'</span><span style="color:'+grade(Math.round(r.duration),500,1000)+'">'+Math.round(r.duration)+'ms</span></div>').join('')+'</div>';
document.body.appendChild(overlay);
`;

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--ignore-certificate-errors'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Login
  try {
    await page.goto('https://fineract.us/login/canvas', { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector('#pseudonym_session_unique_id', { timeout: 15000 });
    await page.type('#pseudonym_session_unique_id', 'admin@redefiners.org');
    await page.type('#pseudonym_session_password', 'ReDefiners2024!');
    await page.click('[type="submit"]');
    await new Promise(r => setTimeout(r, 5000));
    console.log('Logged in');
  } catch (e) { console.log('Login skip'); }

  const pages = [
    ['DT-01-dashboard', '/dashboard'],
    ['DT-02-courses', '/courses'],
    ['DT-03-course-home', '/courses/1'],
    ['DT-04-assignments', '/courses/1/assignments'],
    ['DT-05-inbox', '/inbox'],
    ['DT-06-calendar', '/calendar'],
    ['DT-07-admin', '/admin'],
    ['DT-08-gradebook', '/courses/1/gradebook'],
    ['DT-09-profile', '/profile'],
    ['DT-10-discussions', '/courses/1/discussions'],
  ];

  const outDir = 'react-screenshots/devtools-audit';
  fs.mkdirSync(outDir, { recursive: true });

  for (const [name, url] of pages) {
    try {
      await page.goto('https://fineract.us' + url, { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise(r => setTimeout(r, 3000));
      await page.evaluate(OVERLAY_SCRIPT);
      await new Promise(r => setTimeout(r, 500));
      await page.screenshot({ path: path.join(outDir, name + '.png'), fullPage: false });
      console.log('ok ' + name);
    } catch (e) {
      console.log('fail ' + name + ': ' + e.message.substring(0, 50));
    }
  }

  await browser.close();
  console.log('Done! Screenshots in ' + outDir);
})();
