const ExcelJS = require("exceljs");

const TEAL = "0F4D61";
const DARK = "163B32";
const ACCENT = "2DB88A";
const HEADER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FF163B32" } };
const HEADER_FONT = { bold: true, color: { argb: "FFFFFFFF" }, size: 11, name: "Arial" };
const BODY_FONT = { size: 10, name: "Arial" };
const BORDER = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };

function styleSheet(ws, headerRow, colCount) {
  for (let c = 1; c <= colCount; c++) {
    const cell = ws.getRow(headerRow).getCell(c);
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
    cell.border = BORDER;
    cell.alignment = { vertical: "middle", wrapText: true };
  }
  ws.views = [{ state: "frozen", ySplit: headerRow }];
}
function styleRows(ws, startRow, endRow, colCount) {
  for (let r = startRow; r <= endRow; r++) {
    for (let c = 1; c <= colCount; c++) {
      const cell = ws.getRow(r).getCell(c);
      cell.font = BODY_FONT;
      cell.border = BORDER;
      cell.alignment = { vertical: "top", wrapText: true };
    }
    if (r % 2 === 0) {
      for (let c = 1; c <= colCount; c++) {
        ws.getRow(r).getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0FAF5" } };
      }
    }
  }
}

// ═══ SPREADSHEET 1: DATA DICTIONARY ═══
async function createDataDictionary() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "ReDefiners Dev Team";
  wb.created = new Date(2026, 2, 27);

  // Sheet 1: Core Entities
  const ws1 = wb.addWorksheet("Core Entities", { properties: { tabColor: { argb: "FF2DB88A" } } });
  ws1.columns = [
    { header: "Table", width: 18 }, { header: "Column", width: 22 }, { header: "Data Type", width: 18 },
    { header: "Nullable", width: 10 }, { header: "Key", width: 8 }, { header: "Default", width: 14 },
    { header: "Description", width: 45 }, { header: "API Field", width: 22 }
  ];
  const entities = [
    ["users","id","bigint","No","PK","auto","Unique user identifier","id"],
    ["users","name","varchar(255)","No","","","Full display name","name"],
    ["users","short_name","varchar(255)","Yes","","","Preferred short name","short_name"],
    ["users","sortable_name","varchar(255)","Yes","","","Last, First format","sortable_name"],
    ["users","email","varchar(255)","Yes","","","Primary email","email"],
    ["users","avatar_image_url","text","Yes","","","Profile image URL","avatar_url"],
    ["users","locale","varchar(10)","Yes","","en","Language preference","locale"],
    ["users","workflow_state","varchar(30)","No","","registered","registered/pre_registered/deleted","N/A"],
    ["users","created_at","timestamp","No","","now()","Account creation","created_at"],
    ["users","updated_at","timestamp","No","","now()","Last modified","N/A"],
    ["","","","","","","",""],
    ["courses","id","bigint","No","PK","auto","Unique course ID","id"],
    ["courses","name","varchar(255)","No","","","Course title","name"],
    ["courses","course_code","varchar(255)","Yes","","","Short code (BIO201)","course_code"],
    ["courses","account_id","bigint","No","FK","","Parent account","account_id"],
    ["courses","enrollment_term_id","bigint","Yes","FK","","Academic term","enrollment_term_id"],
    ["courses","start_at","timestamp","Yes","","","Course start","start_at"],
    ["courses","conclude_at","timestamp","Yes","","","Course end","end_at"],
    ["courses","workflow_state","varchar(30)","No","","created","available/completed/deleted","workflow_state"],
    ["courses","default_view","varchar(30)","Yes","","feed","Home page type","default_view"],
    ["courses","total_students","integer","Yes","","0","Enrolled count","total_students"],
    ["","","","","","","",""],
    ["enrollments","id","bigint","No","PK","auto","Enrollment ID","id"],
    ["enrollments","user_id","bigint","No","FK","","References users.id","user_id"],
    ["enrollments","course_id","bigint","No","FK","","References courses.id","course_id"],
    ["enrollments","type","varchar(50)","No","","","StudentEnrollment/TeacherEnrollment/TaEnrollment","type"],
    ["enrollments","workflow_state","varchar(30)","No","","invited","active/invited/completed","enrollment_state"],
    ["enrollments","computed_current_score","decimal","Yes","","","Current grade %","grades.current_score"],
    ["enrollments","computed_final_score","decimal","Yes","","","Final grade %","grades.final_score"],
    ["","","","","","","",""],
    ["assignments","id","bigint","No","PK","auto","Assignment ID","id"],
    ["assignments","course_id","bigint","No","FK","","Parent course","course_id"],
    ["assignments","title","varchar(255)","No","","","Assignment title","name"],
    ["assignments","description","text","Yes","","","HTML description","description"],
    ["assignments","due_at","timestamp","Yes","","","Due date","due_at"],
    ["assignments","points_possible","decimal","Yes","","","Max points","points_possible"],
    ["assignments","submission_types","varchar[]","No","","","Allowed types","submission_types"],
    ["assignments","grading_type","varchar(30)","No","","points","Grading method","grading_type"],
    ["assignments","workflow_state","varchar(30)","No","","unpublished","published/unpublished","published"],
    ["","","","","","","",""],
    ["submissions","id","bigint","No","PK","auto","Submission ID","id"],
    ["submissions","assignment_id","bigint","No","FK","","Parent assignment","assignment_id"],
    ["submissions","user_id","bigint","No","FK","","Submitting student","user_id"],
    ["submissions","body","text","Yes","","","Text entry content","body"],
    ["submissions","grade","varchar(30)","Yes","","","Assigned grade","grade"],
    ["submissions","score","decimal","Yes","","","Numeric score","score"],
    ["submissions","submitted_at","timestamp","Yes","","","When submitted","submitted_at"],
    ["submissions","graded_at","timestamp","Yes","","","When graded","graded_at"],
    ["submissions","workflow_state","varchar(30)","No","","unsubmitted","submitted/graded/pending","workflow_state"],
    ["","","","","","","",""],
    ["discussion_topics","id","bigint","No","PK","auto","Discussion ID","id"],
    ["discussion_topics","course_id","bigint","No","FK","","Parent course","N/A (context)"],
    ["discussion_topics","title","varchar(255)","No","","","Topic title","title"],
    ["discussion_topics","message","text","Yes","","","Topic body (HTML)","message"],
    ["discussion_topics","user_id","bigint","No","FK","","Author","author.id"],
    ["discussion_topics","posted_at","timestamp","Yes","","","Published date","posted_at"],
    ["discussion_topics","discussion_type","varchar(30)","Yes","","side_comment","side_comment/threaded","discussion_type"],
    ["","","","","","","",""],
    ["context_modules","id","bigint","No","PK","auto","Module ID","id"],
    ["context_modules","course_id","bigint","No","FK","","Parent course","N/A"],
    ["context_modules","name","varchar(255)","No","","","Module title","name"],
    ["context_modules","position","integer","Yes","","","Sort order","position"],
    ["context_modules","workflow_state","varchar(30)","No","","unpublished","active/unpublished","state"],
    ["context_modules","prerequisite_module_ids","integer[]","Yes","","","Required modules","prerequisite_module_ids"],
  ];
  entities.forEach(row => ws1.addRow(row));
  styleSheet(ws1, 1, 8);
  styleRows(ws1, 2, entities.length + 1, 8);

  // Sheet 2: API Endpoints
  const ws2 = wb.addWorksheet("API Endpoints", { properties: { tabColor: { argb: "FF0F4D61" } } });
  ws2.columns = [
    { header: "Module", width: 16 }, { header: "Method", width: 8 }, { header: "Endpoint", width: 48 },
    { header: "Description", width: 35 }, { header: "Auth", width: 12 }, { header: "Cache", width: 10 }
  ];
  const endpoints = [
    ["Users","GET","/api/v1/users/self/profile","Get current user profile","Session","5 min"],
    ["Users","GET","/api/v1/users/self/todo","Get to-do items","Session","1 min"],
    ["Users","GET","/api/v1/users/self/activity_stream","Get activity stream","Session","1 min"],
    ["Users","PUT","/api/v1/users/self","Update profile","Session+CSRF","None"],
    ["Courses","GET","/api/v1/courses","List enrolled courses","Session","5 min"],
    ["Courses","GET","/api/v1/courses/:id","Get course detail","Session","5 min"],
    ["Courses","GET","/api/v1/courses/:id/tabs","Get course tabs","Session","10 min"],
    ["Courses","GET","/api/v1/courses/:id/users","List course users","Session","5 min"],
    ["Assignments","GET","/api/v1/courses/:id/assignments","List assignments","Session","5 min"],
    ["Assignments","GET","/api/v1/courses/:id/assignments/:aid","Get assignment","Session","5 min"],
    ["Assignments","POST","/api/v1/courses/:id/assignments/:aid/submissions","Submit assignment","Session+CSRF","None"],
    ["Assignments","GET","/api/v1/courses/:id/assignment_groups","Get assignment groups","Session","5 min"],
    ["Modules","GET","/api/v1/courses/:id/modules","List modules","Session","5 min"],
    ["Modules","GET","/api/v1/courses/:id/modules/:mid/items","List module items","Session","5 min"],
    ["Discussions","GET","/api/v1/courses/:id/discussion_topics","List discussions","Session","5 min"],
    ["Discussions","GET","/api/v1/courses/:id/discussion_topics/:did/view","Get full thread","Session","1 min"],
    ["Discussions","POST","/api/v1/courses/:id/discussion_topics/:did/entries","Post entry","Session+CSRF","None"],
    ["Grades","GET","/api/v1/courses/:id/enrollments","Get enrollments with grades","Session","5 min"],
    ["Quizzes","GET","/api/v1/courses/:id/quizzes","List quizzes","Session","5 min"],
    ["Pages","GET","/api/v1/courses/:id/pages","List wiki pages","Session","5 min"],
    ["Pages","GET","/api/v1/courses/:id/pages/:url","Get page content","Session","5 min"],
    ["Files","GET","/api/v1/courses/:id/folders/root","Get root folder","Session","10 min"],
    ["Files","GET","/api/v1/folders/:fid/files","List files in folder","Session","5 min"],
    ["Calendar","GET","/api/v1/calendar_events","Get calendar events","Session","5 min"],
    ["Conversations","GET","/api/v1/conversations","List conversations","Session","1 min"],
    ["Conversations","POST","/api/v1/conversations","Create conversation","Session+CSRF","None"],
    ["Admin","GET","/api/v1/accounts/:id","Get account info","Session","10 min"],
    ["Admin","GET","/api/v1/accounts/:id/users","List account users","Session","5 min"],
    ["Admin","GET","/api/v1/accounts/:id/roles","List roles","Session","10 min"],
    ["Admin","GET","/api/v1/accounts/:id/reports","List reports","Session","10 min"],
  ];
  endpoints.forEach(row => ws2.addRow(row));
  styleSheet(ws2, 1, 6);
  styleRows(ws2, 2, endpoints.length + 1, 6);

  await wb.xlsx.writeFile("docs/DATA_DICTIONARY.xlsx");
  console.log("  [OK] DATA_DICTIONARY.xlsx");
}

// ═══ SPREADSHEET 2: RISK REGISTER ═══
async function createRiskRegister() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "ReDefiners Dev Team";
  const ws = wb.addWorksheet("Risk Register", { properties: { tabColor: { argb: "FFFF6B35" } } });
  ws.columns = [
    { header: "Risk ID", width: 10 }, { header: "Category", width: 14 }, { header: "Risk Description", width: 40 },
    { header: "Probability", width: 12 }, { header: "Impact", width: 10 }, { header: "Score", width: 8 },
    { header: "Mitigation Strategy", width: 40 }, { header: "Owner", width: 14 }, { header: "Status", width: 12 },
    { header: "Last Review", width: 14 }
  ];
  const risks = [
    ["RSK-001","Technical","Canvas API breaking changes in major version updates","Medium","High","12","Pin Canvas version, monitor release notes, maintain integration test suite","Dev Lead","Active","Mar 2026"],
    ["RSK-002","Technical","Session cookie expiry causes silent auth failures","Medium","Medium","9","Auto-detect 401 responses, redirect to login, show toast notification","Dev Lead","Mitigated","Mar 2026"],
    ["RSK-003","Security","XSS vulnerability in user-generated content","Low","High","8","DOMPurify sanitization on all HTML rendering, CSP headers","Dev Lead","Mitigated","Mar 2026"],
    ["RSK-004","Security","CSRF attack on state-changing API endpoints","Low","High","8","Canvas CSRF token extraction and injection on all non-GET requests","Dev Lead","Mitigated","Mar 2026"],
    ["RSK-005","Infrastructure","VPS resource exhaustion under peak load","Low","High","8","Docker memory limits, Redis LRU eviction, monitoring alerts","DevOps","Active","Mar 2026"],
    ["RSK-006","Infrastructure","SSL certificate renewal failure","Medium","Medium","9","Certbot auto-renewal every 12 hours, monitoring of cert expiry","DevOps","Active","Mar 2026"],
    ["RSK-007","Operational","Single point of failure (one VPS)","Medium","High","12","Document full recovery procedure, maintain offline backups, test quarterly","DevOps","Accepted","Mar 2026"],
    ["RSK-008","Operational","Database corruption or data loss","Low","Critical","10","Daily pg_dump backups, 4-week retention, tested restore procedure","DevOps","Active","Mar 2026"],
    ["RSK-009","Technical","Large file upload failures (> 100MB)","Medium","Low","6","Chunked upload with progress, retry logic, clear error messages","Dev Lead","Active","Mar 2026"],
    ["RSK-010","Technical","Theme CSS conflicts across browsers","Medium","Low","6","CSS custom properties, cross-browser testing, fallback values","Dev Lead","Mitigated","Mar 2026"],
    ["RSK-011","Business","Low user adoption of new UI","Medium","Medium","9","Phased rollout, training program, legacy access during transition","PM","Active","Mar 2026"],
    ["RSK-012","Business","Scope creep from feature requests","High","Medium","12","Strict batch delivery, documented PRD, change control process","PM","Active","Mar 2026"],
    ["RSK-013","Compliance","FERPA violation through data leakage","Very Low","Critical","5","No client-side data storage, audit logging, HTTPS only","Dev Lead","Mitigated","Mar 2026"],
    ["RSK-014","Technical","Dependency vulnerability (npm packages)","Medium","Medium","9","Weekly npm audit, Dependabot alerts, pin major versions","Dev Lead","Active","Mar 2026"],
    ["RSK-015","Infrastructure","DDoS attack on public-facing server","Low","High","8","Rate limiting via Nginx, CloudFlare CDN (recommended)","DevOps","Active","Mar 2026"],
    ["RSK-016","Operational","Knowledge loss if developer leaves","Medium","High","12","Comprehensive documentation (35+ docs), onboarding guide, CI/CD automation","PM","Mitigated","Mar 2026"],
    ["RSK-017","Technical","Browser compatibility issues","Low","Medium","6","Target Chrome/Firefox/Safari 100+, Vite modern build targets","Dev Lead","Active","Mar 2026"],
    ["RSK-018","Infrastructure","DNS propagation delays","Low","Medium","6","Low TTL on DNS records, direct IP access as fallback","DevOps","Active","Mar 2026"],
  ];
  risks.forEach(row => ws.addRow(row));
  styleSheet(ws, 1, 10);
  styleRows(ws, 2, risks.length + 1, 10);
  // Color-code the Score column
  for (let r = 2; r <= risks.length + 1; r++) {
    const score = parseInt(ws.getRow(r).getCell(6).value) || 0;
    const color = score >= 12 ? "FFFF4444" : score >= 8 ? "FFFF9933" : score >= 5 ? "FFFFCC00" : "FF2DB88A";
    ws.getRow(r).getCell(6).fill = { type: "pattern", pattern: "solid", fgColor: { argb: color } };
  }
  await wb.xlsx.writeFile("docs/RISK_REGISTER.xlsx");
  console.log("  [OK] RISK_REGISTER.xlsx");
}

// ═══ SPREADSHEET 3: RACI MATRIX ═══
async function createRACIMatrix() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("RACI Matrix", { properties: { tabColor: { argb: "FF2DB88A" } } });
  ws.columns = [
    { header: "Activity", width: 35 }, { header: "Project Sponsor", width: 16 }, { header: "PM", width: 8 },
    { header: "Dev Lead", width: 10 }, { header: "Developer", width: 12 }, { header: "DevOps", width: 10 },
    { header: "QA", width: 8 }, { header: "IT Admin", width: 10 }, { header: "Faculty Rep", width: 12 }
  ];
  const raci = [
    ["Project Initiation & Charter","A","R","C","","","","I","I"],
    ["Requirements Gathering","A","R","C","","","","C","C"],
    ["Architecture Design","I","C","R","C","C","","I",""],
    ["UI/UX Design","A","C","R","R","","","I","C"],
    ["Frontend Development (React)","I","C","A","R","","","",""],
    ["Canvas API Integration","I","","A","R","","","",""],
    ["Theme System Implementation","I","C","A","R","","","","C"],
    ["Unit Testing","","","A","R","","C","",""],
    ["Visual Regression Testing","","I","C","R","","A","",""],
    ["Performance Testing","","I","R","C","C","A","",""],
    ["Security Audit","I","I","R","C","C","A","",""],
    ["Docker Deployment Setup","I","C","C","","R","I","A",""],
    ["CI/CD Pipeline","","C","C","C","R","I","A",""],
    ["SSL & Domain Setup","","","I","","R","","A",""],
    ["Demo Data Seeding","","I","A","R","","","","C"],
    ["Documentation","I","R","A","C","C","C","",""],
    ["User Training","I","R","C","","","","C","A"],
    ["UAT Coordination","A","R","C","C","","A","C","C"],
    ["Production Go-Live","A","R","C","C","R","","A","I"],
    ["Post-Launch Monitoring","I","I","C","C","R","","A",""],
    ["Incident Response","I","I","A","R","R","","C",""],
    ["Backup & Recovery","","I","C","","R","","A",""],
    ["Change Management","A","R","C","","","","C","C"],
  ];
  raci.forEach(row => ws.addRow(row));
  styleSheet(ws, 1, 9);
  styleRows(ws, 2, raci.length + 1, 9);
  // Color RACI cells
  const colors = { R: "FF2196F3", A: "FFFF9800", C: "FF4CAF50", I: "FF9E9E9E" };
  for (let r = 2; r <= raci.length + 1; r++) {
    for (let c = 2; c <= 9; c++) {
      const v = String(ws.getRow(r).getCell(c).value || "").trim();
      if (colors[v]) {
        ws.getRow(r).getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors[v] } };
        ws.getRow(r).getCell(c).font = { ...BODY_FONT, bold: true, color: { argb: "FFFFFFFF" } };
        ws.getRow(r).getCell(c).alignment = { horizontal: "center", vertical: "middle" };
      }
    }
  }
  // Legend
  ws.addRow([]);
  ws.addRow(["Legend: R = Responsible, A = Accountable, C = Consulted, I = Informed"]);
  await wb.xlsx.writeFile("docs/RACI_MATRIX.xlsx");
  console.log("  [OK] RACI_MATRIX.xlsx");
}

// ═══ SPREADSHEET 4: VENDOR EVALUATION ═══
async function createVendorEval() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Vendor Evaluation", { properties: { tabColor: { argb: "FF0F4D61" } } });
  ws.columns = [
    { header: "Criteria", width: 28 }, { header: "Weight", width: 10 },
    { header: "Canvas LMS (Selected)", width: 22 }, { header: "Moodle 4.x", width: 18 },
    { header: "Blackboard Ultra", width: 18 }, { header: "Brightspace D2L", width: 18 },
    { header: "Open edX", width: 18 }
  ];
  const data = [
    ["API Completeness","15%","5 - Comprehensive REST API","4 - Good plugin API","3 - Limited API","4 - Good REST API","4 - Good REST API"],
    ["Market Share (Higher Ed)","10%","5 - 34% US market","4 - 25% global","3 - Declining","3 - Growing","2 - Niche"],
    ["Customization Flexibility","15%","5 - Themes + custom frontend","5 - Fully open source","2 - Limited theming","3 - Moderate theming","4 - Open source"],
    ["Hosting Options","10%","5 - Self-hosted + Cloud","5 - Self-hosted + Cloud","2 - Cloud only","3 - Cloud primary","5 - Self-hosted"],
    ["LTI Support","10%","5 - LTI 1.3 full","4 - LTI 1.3","4 - LTI 1.3","4 - LTI 1.3","3 - LTI basic"],
    ["Mobile Experience","10%","4 - Good responsive","3 - Basic responsive","4 - Mobile app","4 - Mobile app","3 - Basic responsive"],
    ["Analytics","10%","4 - Canvas Analytics","3 - Basic reporting","4 - Analytics suite","5 - Insights platform","3 - Basic"],
    ["Community & Support","10%","5 - Large community","5 - Massive community","3 - Vendor support only","4 - Good community","4 - Good community"],
    ["Total Cost (3 year)","10%","4 - Self-hosted (low)","5 - Free OSS","2 - Expensive license","3 - Moderate license","5 - Free OSS"],
    ["","","","","","",""],
    ["WEIGHTED SCORE","100%","4.7","4.2","2.9","3.7","3.6"],
    ["RANK","","1st (Selected)","2nd","5th","3rd","4th"],
  ];
  data.forEach(row => ws.addRow(row));
  styleSheet(ws, 1, 7);
  styleRows(ws, 2, data.length + 1, 7);
  await wb.xlsx.writeFile("docs/VENDOR_EVALUATION_MATRIX.xlsx");
  console.log("  [OK] VENDOR_EVALUATION_MATRIX.xlsx");
}

// ═══ SPREADSHEET 5: COST-BENEFIT ANALYSIS ═══
async function createCBA() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Cost-Benefit Analysis", { properties: { tabColor: { argb: "FFFF6B35" } } });
  ws.columns = [
    { header: "Category", width: 30 }, { header: "Item", width: 35 },
    { header: "Year 1", width: 14 }, { header: "Year 2", width: 14 }, { header: "Year 3", width: 14 },
    { header: "3-Year Total", width: 14 }, { header: "Notes", width: 35 }
  ];
  const data = [
    ["COSTS","","","","","",""],
    ["Infrastructure","Hostinger VPS (4vCPU, 8GB)","$360","$360","$360","$1,080","$30/month"],
    ["Infrastructure","Domain (fineract.us)","$12","$12","$12","$36","Annual renewal"],
    ["Infrastructure","SSL Certificate","$0","$0","$0","$0","Let's Encrypt (free)"],
    ["Development","Initial build (6 months)","$0","$0","$0","$0","In-house development"],
    ["Development","Maintenance & updates","$0","$2,000","$2,000","$4,000","Estimated 10hr/month @ $25/hr"],
    ["Operations","Monitoring tools","$0","$120","$120","$240","UptimeRobot Pro"],
    ["Operations","Error tracking (Sentry)","$0","$312","$312","$624","Team plan $26/month"],
    ["Training","Training materials","$500","$0","$0","$500","One-time creation"],
    ["","TOTAL COSTS","$872","$2,804","$2,804","$6,480",""],
    ["","","","","","",""],
    ["BENEFITS","","","","","",""],
    ["Cost Avoidance","Canvas Cloud license avoided","$15,000","$15,000","$15,000","$45,000","Self-hosted vs Instructure Cloud"],
    ["Productivity","Reduced UI-related support tickets","$2,000","$3,000","$3,000","$8,000","40% reduction @ $50/ticket"],
    ["Productivity","Faster page loads (teacher grading)","$1,500","$2,000","$2,000","$5,500","15min saved/day x 200 days"],
    ["Engagement","Improved student retention","$5,000","$8,000","$10,000","$23,000","2% retention improvement"],
    ["Brand","Enhanced institutional image","$3,000","$3,000","$3,000","$9,000","Marketing value of custom UI"],
    ["","TOTAL BENEFITS","$26,500","$31,000","$33,000","$90,500",""],
    ["","","","","","",""],
    ["","NET BENEFIT","$25,628","$28,196","$30,196","$84,020",""],
    ["","ROI","2,940%","1,006%","1,077%","1,296%",""],
    ["","PAYBACK PERIOD","< 1 month","","","",""],
  ];
  data.forEach(row => ws.addRow(row));
  styleSheet(ws, 1, 7);
  styleRows(ws, 2, data.length + 1, 7);
  // Bold section headers
  [2, 12, 19, 20, 21].forEach(r => {
    for (let c = 1; c <= 7; c++) {
      ws.getRow(r).getCell(c).font = { ...BODY_FONT, bold: true };
    }
  });
  await wb.xlsx.writeFile("docs/COST_BENEFIT_ANALYSIS.xlsx");
  console.log("  [OK] COST_BENEFIT_ANALYSIS.xlsx");
}

// ═══ SPREADSHEET 6: FEATURE ROADMAP ═══
async function createRoadmap() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Feature Roadmap", { properties: { tabColor: { argb: "FF2DB88A" } } });
  ws.columns = [
    { header: "Feature", width: 35 }, { header: "Priority", width: 10 }, { header: "Status", width: 14 },
    { header: "Q4 2025", width: 12 }, { header: "Q1 2026", width: 12 }, { header: "Q2 2026", width: 12 },
    { header: "Q3 2026", width: 12 }, { header: "Q4 2026", width: 12 }, { header: "Owner", width: 14 },
    { header: "Dependencies", width: 25 }
  ];
  const features = [
    ["Static HTML Theme (243 pages)","P0","Done","BUILD","","","","","Dev","None"],
    ["React SPA Scaffold","P0","Done","BUILD","","","","","Dev","HTML Theme"],
    ["Core Pages (Dashboard, Courses, Assignments)","P0","Done","","BUILD","","","","Dev","SPA Scaffold"],
    ["Canvas API Integration (24 modules)","P0","Done","","BUILD","","","","Dev","SPA Scaffold"],
    ["Authentication & CSRF","P0","Done","","BUILD","","","","Dev","API Client"],
    ["Theme System (3 themes + dark mode)","P1","Done","","BUILD","","","","Dev","Core Pages"],
    ["Login Page Variants (5 designs)","P2","Done","","BUILD","","","","Dev","Auth"],
    ["Admin Pages (45 components)","P1","Done","","BUILD","","","","Dev","Auth + RBAC"],
    ["Docker Deployment","P0","Done","","BUILD","","","","DevOps","All code"],
    ["CI/CD Pipeline","P1","Done","","BUILD","","","","DevOps","Deployment"],
    ["Security Audit & Fixes","P0","Done","","BUILD","","","","Dev","All code"],
    ["Performance Optimization","P1","Done","","BUILD","","","","Dev","Deployment"],
    ["Demo Data Seeding","P1","Done","","BUILD","","","","Dev","Deployment"],
    ["Documentation Suite (35 docs)","P1","Done","","BUILD","","","","Dev/PM","All"],
    ["","","","","","","","","",""],
    ["WCAG 2.1 AA Compliance (Phase 1)","P1","Planned","","","BUILD","","","Dev","Accessibility Report"],
    ["Playwright E2E Tests","P1","Planned","","","BUILD","","","QA","Test Plan"],
    ["CDN Integration (CloudFlare)","P2","Planned","","","BUILD","","","DevOps","DNS Access"],
    ["Service Worker / PWA","P2","Planned","","","BUILD","","","Dev","Performance"],
    ["Sentry Error Monitoring","P1","Planned","","","BUILD","","","DevOps","Deployment"],
    ["Real-time Notifications (WebSocket)","P2","Planned","","","","BUILD","","Dev","ActionCable"],
    ["Student Mobile App (React Native)","P3","Planned","","","","BUILD","BUILD","Dev","API Client"],
    ["Multi-language Support (i18n)","P2","Planned","","","","BUILD","","Dev","All Pages"],
    ["Advanced Analytics Dashboard","P2","Planned","","","","BUILD","","Dev","Analytics API"],
    ["LTI 1.3 Tool Configuration UI","P3","Planned","","","","","BUILD","Dev","Canvas LTI"],
    ["Content Import/Export Wizard","P2","Planned","","","","BUILD","","Dev","Migrations API"],
    ["Staging Environment","P1","Planned","","","BUILD","","","DevOps","VPS Budget"],
    ["Automated Backup Cron","P1","Planned","","","BUILD","","","DevOps","DR Plan"],
  ];
  features.forEach(row => ws.addRow(row));
  styleSheet(ws, 1, 10);
  styleRows(ws, 2, features.length + 1, 10);
  // Color BUILD cells
  for (let r = 2; r <= features.length + 1; r++) {
    for (let c = 4; c <= 8; c++) {
      const v = String(ws.getRow(r).getCell(c).value || "").trim();
      if (v === "BUILD") {
        ws.getRow(r).getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2DB88A" } };
        ws.getRow(r).getCell(c).font = { ...BODY_FONT, bold: true, color: { argb: "FFFFFFFF" } };
        ws.getRow(r).getCell(c).alignment = { horizontal: "center" };
      }
    }
    const status = String(ws.getRow(r).getCell(3).value || "");
    if (status === "Done") {
      ws.getRow(r).getCell(3).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2DB88A" } };
      ws.getRow(r).getCell(3).font = { ...BODY_FONT, bold: true, color: { argb: "FFFFFFFF" } };
    } else if (status === "Planned") {
      ws.getRow(r).getCell(3).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFCC00" } };
    }
  }
  await wb.xlsx.writeFile("docs/FEATURE_ROADMAP.xlsx");
  console.log("  [OK] FEATURE_ROADMAP.xlsx");
}

async function main() {
  console.log("Generating Excel spreadsheets...\n");
  await createDataDictionary();
  await createRiskRegister();
  await createRACIMatrix();
  await createVendorEval();
  await createCBA();
  await createRoadmap();
  console.log("\nAll 6 spreadsheets generated.");
}
main().catch(e => { console.error(e); process.exit(1); });
