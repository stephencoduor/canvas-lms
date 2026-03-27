const puppeteer = require('puppeteer');
const path = require('path');

const outDir = 'react-screenshots/crud-testing';
const BASE = 'https://fineract.us';

async function shot(page, name) {
  await page.screenshot({ path: path.join(outDir, name + '.png'), fullPage: false });
  console.log('  screenshot: ' + name);
}

async function login(page, email, password) {
  try { await page.goto(BASE + '/logout', { waitUntil: 'domcontentloaded', timeout: 10000 }); } catch {}
  await new Promise(r => setTimeout(r, 1000));
  await page.goto(BASE + '/login/canvas', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#pseudonym_session_unique_id', { timeout: 10000 });
  await page.click('#pseudonym_session_unique_id', { clickCount: 3 });
  await page.type('#pseudonym_session_unique_id', email);
  await page.click('#pseudonym_session_password', { clickCount: 3 });
  await page.type('#pseudonym_session_password', password);
  await page.click('[type="submit"]');
  await new Promise(r => setTimeout(r, 5000));
}

async function api(page, method, endpoint, body) {
  return page.evaluate(async (m, e, b) => {
    const csrf = document.cookie.match(/_csrf_token=([^;]+)/)?.[1] || '';
    const opts = {
      method: m, credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-Token': decodeURIComponent(csrf) },
    };
    if (b) opts.body = JSON.stringify(b);
    const r = await fetch('/api/v1' + e, opts);
    const data = await r.json().catch(() => ({}));
    return { status: r.status, data };
  }, method, endpoint, body);
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--ignore-certificate-errors'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const results = [];
  function log(p, op, s, d) { const ok = s >= 200 && s < 300; results.push({p,op,s,ok,d}); console.log(`  ${ok?'PASS':'FAIL'} [${s}] ${op}: ${d||''}`); }

  // ADMIN
  console.log('\n=== ADMIN CRUD ===');
  await login(page, 'admin@redefiners.org', 'ReDefiners2024!');
  let r;

  r = await api(page, 'GET', '/accounts/1/users?per_page=5');
  log('admin','READ users',r.status,`${r.data?.length||0} users`);

  r = await api(page, 'GET', '/courses?per_page=5');
  log('admin','READ courses',r.status,`${r.data?.length||0} courses`);

  r = await api(page, 'POST', '/accounts/1/courses', {course:{name:'CRUD Test Course',course_code:'CRUD101'}});
  const cId = r.data?.id;
  log('admin','CREATE course',r.status,`ID:${cId}`);

  if (cId) { r = await api(page, 'PUT', `/courses/${cId}`, {course:{name:'CRUD Test (Updated)'}}); log('admin','UPDATE course',r.status,r.data?.name); }

  r = await api(page, 'POST', '/accounts/1/users', {user:{name:'CRUD Test User'},pseudonym:{unique_id:'crudtest@test.edu',password:'Test1234!'}});
  const uId = r.data?.id;
  log('admin','CREATE user',r.status,`ID:${uId}`);

  if (uId) { r = await api(page, 'GET', `/users/${uId}/profile`); log('admin','READ user',r.status,r.data?.name); }
  if (uId) { r = await api(page, 'PUT', `/users/${uId}`, {user:{name:'CRUD User Updated'}}); log('admin','UPDATE user',r.status,r.data?.name); }

  r = await api(page, 'POST', '/courses/1/discussion_topics', {title:'CRUD Announcement',message:'<p>Test</p>',is_announcement:true,published:true});
  log('admin','CREATE announcement',r.status,`ID:${r.data?.id}`);

  if (cId) { r = await api(page, 'DELETE', `/courses/${cId}`, {event:'delete'}); log('admin','DELETE course',r.status,'deleted'); }

  await page.goto(BASE+'/admin/users',{waitUntil:'domcontentloaded',timeout:30000});
  await new Promise(r=>setTimeout(r,3000));
  await shot(page,'admin-crud-users');

  // TEACHER
  console.log('\n=== TEACHER CRUD ===');
  await login(page, 'mgarcia@redefiners.edu', 'ReDefTeacher2024!');

  r = await api(page, 'GET', '/courses/1/assignments?per_page=5');
  log('teacher','READ assignments',r.status,`${r.data?.length||0}`);

  r = await api(page, 'POST', '/courses/1/assignments', {assignment:{name:'CRUD Assignment',points_possible:100,submission_types:['online_text_entry'],published:true}});
  const aId = r.data?.id;
  log('teacher','CREATE assignment',r.status,`ID:${aId}`);

  if (aId) { r = await api(page, 'PUT', `/courses/1/assignments/${aId}`, {assignment:{name:'CRUD Assignment Updated',points_possible:150}}); log('teacher','UPDATE assignment',r.status,r.data?.name); }

  r = await api(page, 'POST', '/courses/1/discussion_topics', {title:'CRUD Discussion',message:'<p>Test thread</p>',discussion_type:'threaded',published:true});
  const dId = r.data?.id;
  log('teacher','CREATE discussion',r.status,`ID:${dId}`);

  r = await api(page, 'POST', '/courses/1/pages', {wiki_page:{title:'CRUD Page',body:'<p>Test page content</p>',published:true}});
  log('teacher','CREATE wiki page',r.status,r.data?.title);

  r = await api(page, 'POST', '/courses/1/modules', {module:{name:'CRUD Module',position:99}});
  const mId = r.data?.id;
  log('teacher','CREATE module',r.status,`ID:${mId}`);

  if (mId) { r = await api(page, 'PUT', `/courses/1/modules/${mId}`, {module:{published:true}}); log('teacher','UPDATE module',r.status,'published'); }
  if (aId) { r = await api(page, 'DELETE', `/courses/1/assignments/${aId}`); log('teacher','DELETE assignment',r.status,'deleted'); }
  if (dId) { r = await api(page, 'DELETE', `/courses/1/discussion_topics/${dId}`); log('teacher','DELETE discussion',r.status,'deleted'); }

  await page.goto(BASE+'/courses/1/assignments',{waitUntil:'domcontentloaded',timeout:30000});
  await new Promise(r=>setTimeout(r,3000));
  await shot(page,'teacher-crud-assignments');

  // STUDENT
  console.log('\n=== STUDENT CRUD ===');
  await login(page, 'aisha.johnson@redefiners.edu', 'ReDefStudent2024!');

  r = await api(page, 'GET', '/courses?enrollment_state=active&per_page=5');
  log('student','READ courses',r.status,`${r.data?.length||0}`);

  r = await api(page, 'GET', '/courses/1/assignments?per_page=5');
  log('student','READ assignments',r.status,`${r.data?.length||0}`);

  r = await api(page, 'GET', '/courses/1/enrollments?user_id=self&include[]=grades');
  log('student','READ grades',r.status,`Score:${r.data?.[0]?.grades?.current_score||'N/A'}`);

  const discs = await api(page, 'GET', '/courses/1/discussion_topics?per_page=1');
  if (discs.data?.[0]?.id) {
    r = await api(page, 'POST', `/courses/1/discussion_topics/${discs.data[0].id}/entries`, {message:'<p>CRUD test reply</p>'});
    log('student','CREATE discussion reply',r.status,`Entry:${r.data?.id}`);
  }

  r = await api(page, 'POST', '/conversations', {recipients:['6'],subject:'CRUD Test Msg',body:'Test message',context_code:'course_1'});
  log('student','CREATE conversation',r.status,`Conv:${r.data?.[0]?.id||r.data?.id}`);

  r = await api(page, 'PUT', '/users/self', {user:{bio:'CRUD tested '+new Date().toISOString().split('T')[0]}});
  log('student','UPDATE profile',r.status,'bio updated');

  r = await api(page, 'GET', '/planner/items?per_page=5');
  log('student','READ planner',r.status,`${r.data?.length||0} items`);

  // RBAC: student should NOT create course
  r = await api(page, 'POST', '/accounts/1/courses', {course:{name:'Should Fail'}});
  log('student','RBAC: create course (expect 401/403)',r.status, r.status>=400?'BLOCKED':'SECURITY ISSUE');

  // RBAC: student should NOT list admin users
  r = await api(page, 'GET', '/accounts/1/users');
  log('student','RBAC: admin users (expect 401/403)',r.status, r.status>=400?'BLOCKED':'SECURITY ISSUE');

  await page.goto(BASE+'/dashboard',{waitUntil:'domcontentloaded',timeout:30000});
  await new Promise(r=>setTimeout(r,3000));
  await shot(page,'student-crud-dashboard');

  await browser.close();

  // SUMMARY
  console.log('\n' + '='.repeat(50));
  console.log('CRUD TEST SUMMARY');
  console.log('='.repeat(50));
  const ok = results.filter(r=>r.ok).length;
  const fail = results.filter(r=>!r.ok).length;
  const rbac = results.filter(r=>r.op.includes('RBAC'));
  console.log(`Total: ${results.length} | PASS: ${ok} | FAIL: ${fail}`);
  console.log(`RBAC tests: ${rbac.length} (${rbac.filter(r=>!r.ok).length} correctly blocked)`);
  console.log('');
  results.forEach(r => {
    const icon = r.ok ? 'PASS' : (r.op.includes('RBAC') ? 'RBAC' : 'FAIL');
    console.log(`[${icon}] ${r.p.padEnd(8)} ${r.op.padEnd(40)} ${r.s} ${r.d||''}`);
  });
})();
