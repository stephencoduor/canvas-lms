const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
  TableOfContents, TabStopType, TabStopPosition
} = require("docx");

// ═══════════════════════════════════════════
// SHARED UTILITIES
// ═══════════════════════════════════════════
const DARK = "163B32";
const TEAL = "0F4D61";
const ACCENT = "2DB88A";
const WHITE = "FFFFFF";
const PW = 12240, PH = 15840, CW = 9360;
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cm = { top: 80, bottom: 80, left: 120, right: 120 };

const styles = {
  default: { document: { run: { font: "Arial", size: 22 } } },
  paragraphStyles: [
    { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 36, bold: true, font: "Arial", color: DARK },
      paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 30, bold: true, font: "Arial", color: TEAL },
      paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
    { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 26, bold: true, font: "Arial", color: "333333" },
      paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
  ]
};
const numbering = {
  config: [
    { reference: "bullets", levels: [
      { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
      { level: 1, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
    ]},
    { reference: "numbers", levels: [
      { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
    ]},
  ]
};
const pageProps = { page: { size: { width: PW, height: PH }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } };

function h(t, l) { return new Paragraph({ heading: l, children: [new TextRun({ text: t, bold: true })] }); }
function p(t) { return new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: t, size: 22 })] }); }
function bp(l, v) { return new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: l, bold: true, size: 22 }), new TextRun({ text: v, size: 22 })] }); }
function b(t, ref="bullets") { return new Paragraph({ numbering: { reference: ref, level: 0 }, children: [new TextRun({ text: t, size: 22 })] }); }
function b2(t) { return new Paragraph({ numbering: { reference: "bullets", level: 1 }, children: [new TextRun({ text: t, size: 22 })] }); }
function n(t) { return new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: t, size: 22 })] }); }
function sp() { return new Paragraph({ spacing: { after: 200 }, children: [] }); }
function pb() { return new Paragraph({ children: [new PageBreak()] }); }
function code(t) { return new Paragraph({ spacing: { after: 40 }, shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, indent: { left: 360 }, children: [new TextRun({ text: t, size: 18, font: "Consolas" })] }); }

function tr(cells, isH, cw) {
  return new TableRow({ tableHeader: isH, children: cells.map((c, i) => new TableCell({
    borders, margins: cm,
    width: cw ? { size: cw[i], type: WidthType.DXA } : undefined,
    shading: isH ? { fill: DARK, type: ShadingType.CLEAR } : undefined,
    children: [new Paragraph({ children: [new TextRun({ text: String(c), bold: isH, size: 20, color: isH ? WHITE : "333333", font: "Arial" })] })]
  })) });
}
function tbl(hdr, rows, cw) {
  return new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: cw, rows: [tr(hdr, true, cw), ...rows.map(r => tr(r, false, cw))] });
}

function cover(title, subtitle, meta) {
  return {
    properties: pageProps,
    children: [
      sp(), sp(), sp(), sp(), sp(),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: title, size: 48, bold: true, color: DARK })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: subtitle, size: 36, color: TEAL })] }),
      sp(),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "Version 1.0  |  March 27, 2026", size: 24, color: "666666" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "ReDefiners Development Team", size: 24, color: "666666" })] }),
      sp(), sp(), sp(),
      tbl(["Field", "Value"], meta, [3500, 5860]),
      pb(),
    ]
  };
}
function hdrFtr(title) {
  return {
    headers: { default: new Header({ children: [new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: ACCENT, space: 4 } },
      children: [new TextRun({ text: title, size: 18, color: "999999", italics: true }), new TextRun({ text: "\tv1.0", size: 18, color: "999999" })],
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }]
    })] }) },
    footers: { default: new Footer({ children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Page ", size: 18, color: "999999" }), new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "999999" })]
    })] }) }
  };
}

async function save(doc, name) {
  const buf = await Packer.toBuffer(doc);
  const path = `docs/${name}`;
  fs.writeFileSync(path, buf);
  console.log(`  [OK] ${name} (${(buf.length/1024).toFixed(1)} KB)`);
}

// ═══════════════════════════════════════════
// DOCUMENT 1: BUSINESS REQUIREMENTS DOCUMENT
// ═══════════════════════════════════════════
async function doc01_BRD() {
  const doc = new Document({ styles, numbering, sections: [
    cover("BUSINESS REQUIREMENTS\nDOCUMENT", "ReDefiners Canvas LMS Frontend", [
      ["Document Type", "Business Requirements Document (BRD)"],
      ["Project", "ReDefiners Custom LMS Frontend"],
      ["Sponsor", "ReDefiners Education Foundation"],
      ["Status", "Approved"],
      ["Confidentiality", "Internal"],
    ]),
    { properties: pageProps, ...hdrFtr("ReDefiners BRD"), children: [
      h("Table of Contents", HeadingLevel.HEADING_1),
      new TableOfContents("TOC", { hyperlink: true, headingStyleRange: "1-3" }),
      pb(),

      h("1. Business Opportunity", HeadingLevel.HEADING_1),
      p("Educational institutions using Canvas LMS face a common challenge: the default Canvas UI, while functional, does not allow deep branding customization or modern UX patterns that today's students and educators expect. Institutions investing in Canvas often find the frontend experience generic and inconsistent with their brand identity."),
      p("ReDefiners Education Foundation identified this gap as an opportunity to create a premium, fully customizable frontend experience that operates on top of Canvas LMS infrastructure, preserving all backend functionality while delivering a superior user experience."),
      sp(),
      h("1.1 Market Context", HeadingLevel.HEADING_2),
      b("Global LMS market valued at $18.26B in 2025, projected to reach $47.47B by 2030"),
      b("Canvas LMS holds 34% market share in US higher education"),
      b("78% of institutions cite UI/UX as a key factor in LMS satisfaction surveys"),
      b("Growing demand for branded, mobile-first learning experiences"),
      b("Competitive pressure from modern platforms (Notion, Moodle 4.x, Brightspace)"),
      sp(),

      h("2. Business Objectives", HeadingLevel.HEADING_1),
      tbl(["ID", "Objective", "Success Metric", "Timeline"],
        [
          ["BO-01", "Deliver branded LMS frontend matching ReDefiners identity", "100% brand guideline compliance", "Q1 2026"],
          ["BO-02", "Improve user engagement through modern UI/UX", "30% increase in daily active users", "Q2 2026"],
          ["BO-03", "Reduce LMS support tickets related to navigation confusion", "40% reduction in UI-related tickets", "Q2 2026"],
          ["BO-04", "Enable theme customization without developer intervention", "3 themes switchable by end-users", "Q1 2026"],
          ["BO-05", "Achieve mobile-first responsive design", "95% feature parity on mobile", "Q1 2026"],
          ["BO-06", "Maintain zero downtime during frontend deployment", "99.5% uptime SLA", "Ongoing"],
          ["BO-07", "Reduce page load times vs default Canvas UI", "Sub-600ms FCP", "Q1 2026"],
          ["BO-08", "Support self-hosted deployment on commodity hardware", "Single VPS deployment", "Q1 2026"],
        ], [800, 4360, 2400, 1800]),
      pb(),

      h("3. Stakeholder Analysis", HeadingLevel.HEADING_1),
      tbl(["Stakeholder", "Role", "Interest", "Influence"],
        [
          ["ReDefiners Foundation", "Project Sponsor", "Brand identity, student engagement, ROI", "High"],
          ["IT Department", "Technical Owner", "Deployment, security, maintenance, uptime", "High"],
          ["Faculty / Instructors", "Primary Users", "Grading efficiency, content management, analytics", "High"],
          ["Students", "End Users", "Usability, speed, mobile access, aesthetics", "Medium"],
          ["Academic Administration", "Decision Makers", "Reporting, compliance, cost efficiency", "High"],
          ["Parents / Observers", "Secondary Users", "Grade visibility, student progress tracking", "Low"],
          ["Canvas (Instructure)", "Platform Vendor", "API stability, license compliance", "Medium"],
        ], [2000, 1800, 3560, 2000]),
      sp(),

      h("4. Business Requirements", HeadingLevel.HEADING_1),
      h("4.1 Brand & Identity", HeadingLevel.HEADING_2),
      tbl(["ID", "Requirement", "Priority", "Rationale"],
        [
          ["BR-01", "All UI elements must use ReDefiners color palette (teal/green/mint)", "Must", "Brand consistency across all touchpoints"],
          ["BR-02", "Logo and branding must appear on login, sidebar, and header", "Must", "Brand recognition and institutional identity"],
          ["BR-03", "Support minimum 3 switchable theme variants", "Should", "Accommodate different institutional preferences"],
          ["BR-04", "Provide dark mode for accessibility and user preference", "Should", "Modern UX expectation, reduces eye strain"],
          ["BR-05", "Login page must support multiple design variants", "Could", "A/B testing for conversion optimization"],
        ], [800, 4360, 1000, 3200]),
      sp(),
      h("4.2 User Experience", HeadingLevel.HEADING_2),
      tbl(["ID", "Requirement", "Priority", "Rationale"],
        [
          ["BR-06", "Page transitions must feel instant (< 300ms perceived)", "Must", "User retention and satisfaction"],
          ["BR-07", "Navigation must be context-aware (course vs global)", "Must", "Reduce cognitive load"],
          ["BR-08", "Mobile experience must be fully functional, not degraded", "Must", "60%+ of students access LMS via mobile"],
          ["BR-09", "Search must span courses, content, people, and pages", "Should", "Productivity improvement"],
          ["BR-10", "Notification center must aggregate all activity streams", "Should", "Single source of truth for updates"],
        ], [800, 4360, 1000, 3200]),
      sp(),
      h("4.3 Operations & Compliance", HeadingLevel.HEADING_2),
      tbl(["ID", "Requirement", "Priority", "Rationale"],
        [
          ["BR-11", "System must support self-hosted deployment", "Must", "Data sovereignty, cost control"],
          ["BR-12", "Deployment must be automated via CI/CD pipeline", "Must", "Operational efficiency, reduce human error"],
          ["BR-13", "Frontend updates must not require backend changes", "Must", "Decoupled release cycles"],
          ["BR-14", "System must comply with FERPA data handling requirements", "Must", "Legal compliance for educational data"],
          ["BR-15", "All user data must remain on Canvas backend servers", "Must", "No data duplication or leakage"],
          ["BR-16", "System must achieve WCAG 2.1 AA accessibility", "Should", "Legal compliance, inclusive design"],
          ["BR-17", "SSL/TLS encryption required for all communications", "Must", "Security baseline"],
        ], [800, 4360, 1000, 3200]),
      pb(),

      h("5. Business Process Flows", HeadingLevel.HEADING_1),
      h("5.1 Student Learning Flow", HeadingLevel.HEADING_2),
      n("Student logs in via ReDefiners-branded login page"),
      n("Dashboard displays personalized course cards, to-do items, calendar"),
      n("Student navigates to course via sidebar or card click"),
      n("Course page shows modules, assignments, discussions, grades"),
      n("Student completes assignments via submission interface"),
      n("Student checks grades and feedback via Gradebook"),
      n("Student participates in discussions and receives notifications"),
      sp(),
      h("5.2 Instructor Workflow", HeadingLevel.HEADING_2),
      n("Instructor logs in and views teaching dashboard"),
      n("Creates/edits course content (modules, pages, assignments)"),
      n("Manages assignments with rubrics and peer review settings"),
      n("Reviews submissions in SpeedGrader interface"),
      n("Enters grades in Gradebook, provides feedback"),
      n("Posts announcements and monitors discussion engagement"),
      n("Views course analytics for at-risk student identification"),
      sp(),
      h("5.3 Administrator Workflow", HeadingLevel.HEADING_2),
      n("Admin logs in with elevated permissions"),
      n("Manages users, roles, and enrollment provisioning"),
      n("Configures academic terms and enrollment periods"),
      n("Imports SIS data for bulk account creation"),
      n("Monitors system health and audit logs"),
      n("Customizes theme and branding settings"),
      n("Manages developer keys for external integrations"),
      pb(),

      h("6. Constraints & Assumptions", HeadingLevel.HEADING_1),
      h("6.1 Constraints", HeadingLevel.HEADING_2),
      b("Canvas LMS backend cannot be modified (API-only integration)"),
      b("Frontend must work with Canvas API v1 (REST, no GraphQL dependency)"),
      b("Deployment target is single Hostinger VPS (4 vCPU, 8 GB RAM)"),
      b("Budget limited to existing infrastructure costs (no additional SaaS)"),
      b("Development team is small (lean delivery approach)"),
      b("Must maintain backward compatibility with existing Canvas data"),
      sp(),
      h("6.2 Assumptions", HeadingLevel.HEADING_2),
      b("Canvas LMS API remains stable across minor version updates"),
      b("Session cookie authentication will continue to be supported"),
      b("Users have modern browsers (Chrome 100+, Firefox 100+, Safari 15+)"),
      b("VPS has sufficient bandwidth for concurrent user load (500+ users)"),
      b("SSL certificates via Let's Encrypt remain free and available"),
      b("Instructure will not block custom frontend API access patterns"),
      sp(),

      h("7. Success Criteria", HeadingLevel.HEADING_1),
      tbl(["Criterion", "Measure", "Target", "Current"],
        [
          ["User Satisfaction", "NPS survey score", "> 50", "Baseline TBD"],
          ["Page Load Speed", "First Contentful Paint", "< 600ms", "567ms (GOOD)"],
          ["Feature Coverage", "Canvas features implemented", "> 160 pages", "161 pages"],
          ["Uptime", "Monthly availability", "> 99.5%", "Monitoring active"],
          ["Support Tickets", "UI-related tickets/month", "< 10", "Baseline TBD"],
          ["Adoption Rate", "Daily active users", "> 80% of enrolled", "Tracking active"],
          ["Mobile Usage", "Mobile session share", "> 40%", "Responsive design live"],
          ["Accessibility", "WCAG 2.1 AA audit", "Zero critical violations", "Audit planned"],
        ], [2000, 2600, 2200, 2560]),
      sp(),

      h("8. Approval & Sign-Off", HeadingLevel.HEADING_1),
      tbl(["Role", "Name", "Signature", "Date"],
        [
          ["Project Sponsor", "ReDefiners Foundation", "", ""],
          ["IT Director", "IT Department Lead", "", ""],
          ["Academic Director", "Faculty Representative", "", ""],
          ["QA Lead", "Quality Assurance", "", ""],
        ], [2000, 2560, 2800, 2000]),
    ]}
  ]});
  await save(doc, "BUSINESS_REQUIREMENTS_DOCUMENT.docx");
}

// ═══════════════════════════════════════════
// DOCUMENT 2: SOFTWARE REQUIREMENTS SPEC
// ═══════════════════════════════════════════
async function doc02_SRS() {
  const doc = new Document({ styles, numbering, sections: [
    cover("SOFTWARE REQUIREMENTS\nSPECIFICATION", "ReDefiners Canvas LMS Frontend", [
      ["Document Type", "SRS (IEEE 830 Format)"],
      ["System", "ReDefiners LMS React SPA"],
      ["Version", "1.0"],
      ["Standard", "IEEE 830-1998 Adapted"],
    ]),
    { properties: pageProps, ...hdrFtr("ReDefiners SRS"), children: [
      h("Table of Contents", HeadingLevel.HEADING_1),
      new TableOfContents("TOC", { hyperlink: true, headingStyleRange: "1-3" }), pb(),

      h("1. Introduction", HeadingLevel.HEADING_1),
      h("1.1 Purpose", HeadingLevel.HEADING_2),
      p("This Software Requirements Specification (SRS) describes the functional and non-functional requirements for the ReDefiners LMS Frontend, a custom React-based single-page application that serves as the user interface for Canvas LMS. This document follows the IEEE 830-1998 standard adapted for modern web applications."),
      h("1.2 Scope", HeadingLevel.HEADING_2),
      p("The ReDefiners LMS Frontend (hereinafter 'the System') is a web application that replaces the default Canvas LMS user interface. It communicates exclusively with the Canvas REST API and is deployed independently of the Canvas backend. The System covers all user-facing functionality including authentication, course management, content delivery, assessment, grading, communication, and administration."),
      h("1.3 Definitions & Acronyms", HeadingLevel.HEADING_2),
      tbl(["Term", "Definition"],
        [
          ["SPA", "Single-Page Application"],
          ["Canvas API", "Canvas LMS REST API v1"],
          ["CSRF", "Cross-Site Request Forgery"],
          ["XSS", "Cross-Site Scripting"],
          ["FCP", "First Contentful Paint"],
          ["CLS", "Cumulative Layout Shift"],
          ["TTFB", "Time to First Byte"],
          ["RBAC", "Role-Based Access Control"],
          ["LTI", "Learning Tools Interoperability"],
          ["SIS", "Student Information System"],
        ], [2000, 7360]),
      h("1.4 References", HeadingLevel.HEADING_2),
      b("Canvas LMS REST API Documentation (api.instructure.com)"),
      b("React 19 Documentation (react.dev)"),
      b("WCAG 2.1 Guidelines (w3.org/WAI/WCAG21)"),
      b("OWASP Top 10 Web Application Security Risks"),
      b("ReDefiners Brand Guidelines v3.0"),
      pb(),

      h("2. Overall Description", HeadingLevel.HEADING_1),
      h("2.1 Product Perspective", HeadingLevel.HEADING_2),
      p("The System is a replacement frontend for Canvas LMS. It operates as a decoupled layer, communicating with the Canvas backend via REST API calls proxied through Nginx. The System does not store user data independently; all persistent data resides in the Canvas PostgreSQL database."),
      sp(),
      h("2.2 Product Functions", HeadingLevel.HEADING_2),
      tbl(["Function Group", "Sub-Functions", "Page Count"],
        [
          ["Authentication", "Login (5 variants), logout, session management, role detection", "6"],
          ["Dashboard", "Course cards, to-do list, calendar preview, activity stream", "5"],
          ["Course Management", "CRUD, settings, copy, pacing, analytics, enrollment", "28"],
          ["Assignments", "CRUD, submissions, peer review, rubrics, SpeedGrader", "15"],
          ["Quizzes", "CRUD, taking interface, results, statistics, question banks", "10"],
          ["Discussions", "Topics, threads, replies, rich text, mark read", "14"],
          ["Content", "Modules, wiki pages, files, content library, video", "12"],
          ["Gradebook", "Grade entry, bulk edit, history, export, analytics", "7"],
          ["Calendar", "Events, planner, academic calendar, scheduling", "6"],
          ["Communication", "Inbox, chat, announcements, templates, feedback", "14"],
          ["Analytics", "Course, student, engagement, completion, global", "7"],
          ["Administration", "Users, roles, terms, SIS, keys, audit, themes", "40+"],
          ["Account", "Profile, settings, ePortfolio, notifications", "6"],
        ], [2200, 4960, 2200]),
      sp(),
      h("2.3 User Classes and Characteristics", HeadingLevel.HEADING_2),
      tbl(["User Class", "Technical Proficiency", "Frequency", "Permissions"],
        [
          ["Student", "Low-Medium", "Daily", "View courses, submit work, check grades"],
          ["Teacher", "Medium", "Daily", "Manage courses, grade, create content"],
          ["TA", "Medium", "Frequent", "Grade, moderate discussions"],
          ["Admin", "High", "Weekly", "Full system administration"],
          ["Observer", "Low", "Weekly", "View linked student grades"],
        ], [1600, 2400, 1600, 3760]),
      sp(),
      h("2.4 Operating Environment", HeadingLevel.HEADING_2),
      b("Client: Modern web browsers (Chrome 100+, Firefox 100+, Safari 15+, Edge 100+)"),
      b("Server: Docker containers on Ubuntu 22.04 LTS VPS"),
      b("Network: HTTPS (TLS 1.2/1.3), minimum 5 Mbps client bandwidth"),
      b("Display: Minimum 320px viewport width (mobile-first responsive)"),
      pb(),

      h("3. Specific Requirements", HeadingLevel.HEADING_1),
      h("3.1 External Interface Requirements", HeadingLevel.HEADING_2),
      h("3.1.1 User Interfaces", HeadingLevel.HEADING_3),
      b("Sidebar navigation (240px width, collapsible, context-aware)"),
      b("Top bar with search, notifications, theme picker, user menu (64px height)"),
      b("Main content area with responsive grid layout"),
      b("Bottom navigation bar on mobile devices (< 768px)"),
      b("Modal dialogs for confirmations and inline editing"),
      b("Toast notifications for success/error feedback (Sonner)"),
      sp(),
      h("3.1.2 Hardware Interfaces", HeadingLevel.HEADING_3),
      p("No direct hardware interfaces. The System runs in web browsers and communicates exclusively over HTTP/HTTPS."),
      sp(),
      h("3.1.3 Software Interfaces", HeadingLevel.HEADING_3),
      tbl(["Interface", "Protocol", "Data Format", "Authentication"],
        [
          ["Canvas REST API", "HTTPS", "JSON", "Session cookie + CSRF token"],
          ["Canvas File API", "HTTPS", "Multipart/Binary", "Session cookie"],
          ["Nginx Reverse Proxy", "HTTP (internal)", "Passthrough", "N/A"],
          ["Redis (indirect)", "TCP", "Key-Value", "Via Canvas backend"],
          ["PostgreSQL (indirect)", "TCP", "SQL", "Via Canvas backend"],
        ], [2200, 1600, 2200, 3360]),
      sp(),
      h("3.1.4 Communication Interfaces", HeadingLevel.HEADING_3),
      b("HTTPS on port 443 for all client-server communication"),
      b("HTTP on port 80 (redirect to HTTPS only)"),
      b("WebSocket support for future real-time features (ActionCable ready)"),
      pb(),

      h("3.2 Functional Requirements by Module", HeadingLevel.HEADING_2),
      h("3.2.1 Authentication Module", HeadingLevel.HEADING_3),
      tbl(["SRS-ID", "Requirement", "Input", "Output", "Priority"],
        [
          ["SRS-AUTH-01", "System shall authenticate users via Canvas login form", "Email + password", "Session cookie set", "P0"],
          ["SRS-AUTH-02", "System shall extract CSRF token from Canvas cookies", "Document cookies", "Decoded CSRF token", "P0"],
          ["SRS-AUTH-03", "System shall inject CSRF token in non-GET requests", "Request headers", "X-CSRF-Token header", "P0"],
          ["SRS-AUTH-04", "System shall detect user role from profile/permissions", "GET /api/v1/users/self", "admin|teacher|student", "P0"],
          ["SRS-AUTH-05", "System shall redirect unauthenticated users to /login", "Missing session", "302 to /login", "P0"],
          ["SRS-AUTH-06", "System shall invalidate session on logout", "DELETE /logout", "Cookie cleared, redirect", "P0"],
          ["SRS-AUTH-07", "System shall support 5 login page design variants", "Theme config", "Rendered variant", "P2"],
          ["SRS-AUTH-08", "System shall persist login variant choice in localStorage", "User selection", "Stored preference", "P2"],
        ], [1400, 3160, 1600, 1800, 1400]),
      sp(),
      h("3.2.2 Dashboard Module", HeadingLevel.HEADING_3),
      tbl(["SRS-ID", "Requirement", "Input", "Output", "Priority"],
        [
          ["SRS-DASH-01", "Display user's enrolled courses as interactive cards", "GET /api/v1/courses", "Course card grid", "P0"],
          ["SRS-DASH-02", "Show upcoming to-do items sorted by due date", "GET /api/v1/users/self/todo", "To-do list (5 items)", "P0"],
          ["SRS-DASH-03", "Display calendar preview with next 7 days", "GET /api/v1/calendar_events", "Mini calendar", "P1"],
          ["SRS-DASH-04", "Show recent activity stream", "GET /api/v1/users/self/activity_stream", "Activity feed", "P1"],
          ["SRS-DASH-05", "Support course card favoriting", "PUT /api/v1/users/self/favorites", "Star toggle", "P1"],
        ], [1400, 3160, 2000, 1800, 1000]),
      sp(),
      h("3.2.3 Course Management Module", HeadingLevel.HEADING_3),
      tbl(["SRS-ID", "Requirement", "Input", "Output", "Priority"],
        [
          ["SRS-CRS-01", "List all enrolled courses with filtering/sorting", "GET /api/v1/courses", "Course list/grid", "P0"],
          ["SRS-CRS-02", "Display course detail with tabbed interface", "GET /api/v1/courses/:id", "Course home page", "P0"],
          ["SRS-CRS-03", "Manage course settings (name, dates, features)", "PUT /api/v1/courses/:id", "Updated settings", "P1"],
          ["SRS-CRS-04", "Create new course with wizard interface", "POST /api/v1/accounts/:id/courses", "New course", "P1"],
          ["SRS-CRS-05", "Copy course content to new course", "POST /api/v1/courses/:id/content_migrations", "Migration job", "P2"],
          ["SRS-CRS-06", "Display course analytics (enrollment, submissions)", "GET /api/v1/courses/:id/analytics", "Charts/metrics", "P1"],
          ["SRS-CRS-07", "Manage course modules with ordering", "GET/PUT /api/v1/courses/:id/modules", "Module list", "P0"],
          ["SRS-CRS-08", "Manage people/enrollments within course", "GET /api/v1/courses/:id/enrollments", "People list", "P1"],
        ], [1400, 3160, 2400, 1400, 1000]),
      pb(),

      h("3.3 Non-Functional Requirements", HeadingLevel.HEADING_2),
      h("3.3.1 Performance Requirements", HeadingLevel.HEADING_3),
      tbl(["NFR-ID", "Requirement", "Metric", "Target"],
        [
          ["NFR-PERF-01", "Time to First Byte", "TTFB", "< 300ms"],
          ["NFR-PERF-02", "First Contentful Paint", "FCP", "< 1500ms"],
          ["NFR-PERF-03", "Cumulative Layout Shift", "CLS", "< 0.1"],
          ["NFR-PERF-04", "Initial JavaScript bundle", "Transfer size (gzip)", "< 100 KB"],
          ["NFR-PERF-05", "API response rendering", "Time to interactive", "< 500ms after data"],
          ["NFR-PERF-06", "Concurrent users", "Server capacity", "> 500 simultaneous"],
          ["NFR-PERF-07", "Image lazy loading", "Intersection Observer", "Below-fold images deferred"],
        ], [1400, 3160, 2400, 2400]),
      sp(),
      h("3.3.2 Security Requirements", HeadingLevel.HEADING_3),
      tbl(["NFR-ID", "Requirement", "Implementation"],
        [
          ["NFR-SEC-01", "All user-generated HTML must be sanitized before rendering", "DOMPurify on dangerouslySetInnerHTML"],
          ["NFR-SEC-02", "CSRF tokens required on all state-changing requests", "X-CSRF-Token header extraction"],
          ["NFR-SEC-03", "Content Security Policy must restrict script sources", "Nginx CSP header"],
          ["NFR-SEC-04", "HTTPS required for all communications", "TLS 1.2/1.3, HSTS preload"],
          ["NFR-SEC-05", "Admin routes must verify administrator role", "AdminRoute component guard"],
          ["NFR-SEC-06", "Session cookies must be HttpOnly and Secure", "Canvas backend configuration"],
          ["NFR-SEC-07", "File uploads must be validated and size-limited", "500MB max, type checking"],
          ["NFR-SEC-08", "API error messages must not expose stack traces", "Generic error responses"],
        ], [1400, 4360, 3600]),
      sp(),
      h("3.3.3 Reliability Requirements", HeadingLevel.HEADING_3),
      b("System availability: 99.5% uptime (maximum 3.65 hours downtime/month)"),
      b("Mean Time to Recovery (MTTR): < 30 minutes"),
      b("Graceful degradation: API errors show user-friendly messages, not blank screens"),
      b("Error boundaries prevent single component failure from crashing entire app"),
      b("Automatic retry on transient network failures (TanStack Query retry: 3)"),
      sp(),
      h("3.3.4 Maintainability Requirements", HeadingLevel.HEADING_3),
      b("TypeScript strict mode for compile-time type safety"),
      b("Component-based architecture for isolated feature development"),
      b("Code splitting ensures independent page deployability"),
      b("CSS custom properties enable theme changes without code modification"),
      b("Automated CI/CD pipeline reduces deployment risk"),
      sp(),

      h("4. Appendices", HeadingLevel.HEADING_1),
      h("4.1 Traceability Matrix", HeadingLevel.HEADING_2),
      p("Requirements trace from Business Requirements (BR-xx) to Software Requirements (SRS-xxx) to implementation files:"),
      tbl(["Business Req", "Software Req", "Implementation File"],
        [
          ["BR-01 (Brand palette)", "SRS-AUTH-07, SRS-DASH-01", "src/styles/themes.css"],
          ["BR-06 (Instant transitions)", "NFR-PERF-01 to 04", "vite.config.ts, routes/index.tsx"],
          ["BR-07 (Context nav)", "SRS-DASH-01", "src/lib/navigation.ts, Sidebar.tsx"],
          ["BR-11 (Self-hosted)", "NFR-PERF-06", "deploy/docker-compose.production.yml"],
          ["BR-14 (FERPA)", "NFR-SEC-01 to 08", "api-client.ts, nginx.conf"],
          ["BR-17 (SSL/TLS)", "NFR-SEC-04", "deploy/nginx/nginx.conf"],
        ], [2200, 3160, 4000]),
    ]}
  ]});
  await save(doc, "SOFTWARE_REQUIREMENTS_SPECIFICATION.docx");
}

// ═══════════════════════════════════════════
// DOCUMENT 3: SYSTEM DESIGN DOCUMENT (HLD)
// ═══════════════════════════════════════════
async function doc03_HLD() {
  const doc = new Document({ styles, numbering, sections: [
    cover("SYSTEM DESIGN DOCUMENT", "High-Level Design (HLD)", [
      ["System", "ReDefiners LMS Frontend + Canvas Backend"],
      ["Architecture", "Decoupled SPA + REST API"],
      ["Deployment", "Docker Compose on VPS"],
    ]),
    { properties: pageProps, ...hdrFtr("ReDefiners HLD"), children: [
      h("Table of Contents", HeadingLevel.HEADING_1),
      new TableOfContents("TOC", { hyperlink: true, headingStyleRange: "1-3" }), pb(),

      h("1. Architecture Overview", HeadingLevel.HEADING_1),
      p("The ReDefiners LMS system follows a decoupled frontend architecture pattern. The React SPA serves as the presentation layer, communicating with the Canvas LMS backend through its REST API. Nginx acts as both the static file server for the SPA and the reverse proxy for API requests."),
      sp(),
      h("1.1 Architecture Diagram", HeadingLevel.HEADING_2),
      code("[Browser] --HTTPS--> [Nginx :443]"),
      code("                        |-- / --> [SPA dist/ files]"),
      code("                        |-- /api/* --> [Canvas Web :3000]"),
      code("                        |-- /login --> [Canvas Auth]"),
      code("                        |-- /files/* --> [Canvas Files]"),
      code("                        |"),
      code("[Canvas Web :3000]"),
      code("    |-- [PostgreSQL :5432] (Primary DB)"),
      code("    |-- [Redis :6379] (Cache + Sessions)"),
      code("    |-- [Canvas Jobs] (Background Workers x2)"),
      sp(),
      h("1.2 Architecture Decisions", HeadingLevel.HEADING_2),
      tbl(["Decision", "Choice", "Rationale", "Alternatives Considered"],
        [
          ["Frontend Framework", "React 19", "Concurrent features, ecosystem maturity, team expertise", "Vue 3, Svelte, Angular"],
          ["State Management", "TanStack Query + Context", "Server-state focus, built-in caching, devtools", "Redux, Zustand, Jotai"],
          ["Styling", "Tailwind CSS + shadcn/ui", "Utility-first, tree-shakeable, accessible components", "CSS Modules, Styled Components"],
          ["Routing", "React Router v7", "Mature, lazy loading, nested layouts", "TanStack Router, Next.js"],
          ["Build Tool", "Vite 8", "Fast HMR, optimized builds, ESM-native", "Webpack, Turbopack"],
          ["API Auth", "Session cookies (same-origin)", "No custom auth server, Canvas-native", "JWT, OAuth2 PKCE"],
          ["Deployment", "Docker Compose", "Simple multi-service orchestration", "Kubernetes, ECS"],
          ["Reverse Proxy", "Nginx", "Performance, SSL termination, static serving", "Caddy, Traefik"],
        ], [1800, 2200, 3160, 2200]),
      pb(),

      h("2. Component Design", HeadingLevel.HEADING_1),
      h("2.1 Frontend Components", HeadingLevel.HEADING_2),
      tbl(["Component", "Type", "Responsibility", "Dependencies"],
        [
          ["App Shell", "Root", "Provider wrapping, error boundaries", "React, Router"],
          ["AuthContext", "Context", "Auth state, login/logout, role compute", "Canvas API"],
          ["ThemeContext", "Context", "Theme switching, dark mode, CSS vars", "localStorage"],
          ["AppLayout", "Layout", "Sidebar + TopBar + content outlet", "AuthContext"],
          ["Sidebar", "Navigation", "96-item context-aware nav tree", "React Router"],
          ["TopBar", "Navigation", "Search, notifications, theme, user", "AuthContext"],
          ["API Client", "Service", "HTTP methods, CSRF, pagination", "fetch API"],
          ["Route Config", "Router", "156 lazy routes with guards", "React Router"],
          ["Page Components", "Views", "161 feature pages", "API, UI components"],
          ["UI Components", "Primitives", "13 shadcn/ui components", "Radix UI"],
        ], [1800, 1200, 3560, 2800]),
      sp(),
      h("2.2 Backend Components", HeadingLevel.HEADING_2),
      tbl(["Component", "Technology", "Responsibility"],
        [
          ["Canvas Web", "Rails 8 + Passenger", "API endpoints, authentication, business logic"],
          ["Canvas Jobs", "Delayed Job", "Background processing (emails, imports, grading)"],
          ["PostgreSQL", "PostgreSQL 14", "Primary data store (users, courses, grades)"],
          ["Redis", "Redis 7", "Session cache, API cache, ActionCable pub/sub"],
          ["Nginx", "Nginx Alpine", "SSL termination, SPA serving, API proxy"],
          ["Certbot", "Let's Encrypt", "Automated SSL certificate renewal"],
        ], [2000, 2600, 4760]),
      pb(),

      h("3. Data Flow Architecture", HeadingLevel.HEADING_1),
      h("3.1 Request Flow", HeadingLevel.HEADING_2),
      n("Client browser makes HTTPS request to fineract.us"),
      n("Nginx terminates SSL, inspects URL path"),
      n("Static assets (JS/CSS/images) served directly from dist/ with 7-day cache"),
      n("SPA routes (/) served index.html for client-side routing"),
      n("API requests (/api/*) proxied to Canvas Web container on port 3000"),
      n("Canvas processes request, queries PostgreSQL/Redis, returns JSON"),
      n("Nginx forwards JSON response to client"),
      n("React SPA renders response data in UI components"),
      sp(),
      h("3.2 Authentication Flow", HeadingLevel.HEADING_2),
      n("User submits credentials to Canvas /login endpoint"),
      n("Canvas validates against database, creates session in Redis"),
      n("Session cookie (HttpOnly, Secure) set on browser"),
      n("SPA reads CSRF token from cookie for subsequent requests"),
      n("All API calls include session cookie + CSRF token"),
      n("Canvas validates session on each API request"),
      n("On logout, Canvas destroys session, SPA clears state"),
      sp(),
      h("3.3 Data Caching Strategy", HeadingLevel.HEADING_2),
      tbl(["Layer", "Cache Type", "TTL", "Invalidation"],
        [
          ["Browser", "Vite content-hashed assets", "Permanent (hash changes)", "New build deploys"],
          ["Nginx", "Static file cache headers", "7 days (immutable)", "Content hash change"],
          ["TanStack Query", "In-memory query cache", "5 min (staleTime)", "Mutation invalidation"],
          ["Redis", "Server-side session/data", "LRU (256MB limit)", "Canvas manages"],
          ["PostgreSQL", "Query plan cache", "Per-connection", "Schema changes"],
        ], [1800, 2400, 2400, 2760]),
      pb(),

      h("4. Security Architecture", HeadingLevel.HEADING_1),
      h("4.1 Defense in Depth", HeadingLevel.HEADING_2),
      tbl(["Layer", "Control", "Technology"],
        [
          ["Network", "SSL/TLS encryption, HSTS", "Nginx + Let's Encrypt"],
          ["Network", "Security headers (CSP, X-Frame, X-XSS)", "Nginx configuration"],
          ["Transport", "CSRF token validation", "Canvas session + SPA extraction"],
          ["Application", "XSS prevention", "DOMPurify sanitization"],
          ["Application", "Role-based access control", "AdminRoute, ProtectedRoute"],
          ["Application", "Input validation", "TypeScript types + Canvas validation"],
          ["Data", "Encrypted at rest", "PostgreSQL encryption"],
          ["Data", "No client-side data storage", "All data on Canvas backend"],
          ["Infrastructure", "Container isolation", "Docker network isolation"],
          ["Infrastructure", "Resource limits", "Docker memory limits per service"],
        ], [1800, 3360, 4200]),
      sp(),

      h("5. Scalability Considerations", HeadingLevel.HEADING_1),
      tbl(["Dimension", "Current Design", "Scale-Up Path"],
        [
          ["Users", "500 concurrent (single VPS)", "Add Nginx load balancer + multiple web containers"],
          ["Database", "Single PostgreSQL instance", "Read replicas, PgBouncer connection pooling"],
          ["Caching", "256MB Redis", "Redis Cluster or increase memory"],
          ["Storage", "80GB SSD", "Attach block storage volumes or S3-compatible"],
          ["CDN", "None (direct serving)", "CloudFlare or AWS CloudFront for static assets"],
          ["Monitoring", "Basic health checks", "Prometheus + Grafana, Sentry for errors"],
        ], [1800, 3560, 4000]),
    ]}
  ]});
  await save(doc, "SYSTEM_DESIGN_DOCUMENT_HLD.docx");
}

// ═══════════════════════════════════════════
// DOCUMENT 4: LOW-LEVEL DESIGN DOCUMENT
// ═══════════════════════════════════════════
async function doc04_LLD() {
  const doc = new Document({ styles, numbering, sections: [
    cover("LOW-LEVEL DESIGN\nDOCUMENT", "Component & Module Specifications", [
      ["System", "ReDefiners LMS React SPA"],
      ["Language", "TypeScript 5.9 + React 19"],
      ["Build", "Vite 8.0.1"],
    ]),
    { properties: pageProps, ...hdrFtr("ReDefiners LLD"), children: [
      h("Table of Contents", HeadingLevel.HEADING_1),
      new TableOfContents("TOC", { hyperlink: true, headingStyleRange: "1-3" }), pb(),

      h("1. Module Decomposition", HeadingLevel.HEADING_1),
      p("The React SPA is decomposed into the following modules, each with clearly defined interfaces, dependencies, and responsibilities."),
      sp(),
      tbl(["Module", "Directory", "Files", "Export Pattern"],
        [
          ["Authentication", "src/contexts/AuthContext.tsx", "1", "React Context + Provider"],
          ["Theme System", "src/contexts/ThemeContext.tsx", "1", "React Context + Provider"],
          ["API Client", "src/services/", "25", "Named exports per module"],
          ["Routing", "src/routes/", "4", "Route config array"],
          ["Navigation", "src/lib/navigation.ts", "1", "navSections array"],
          ["Layout", "src/components/layout/", "5", "React components"],
          ["UI Primitives", "src/components/ui/", "13", "React components (shadcn)"],
          ["Common", "src/components/common/", "4", "React components"],
          ["Pages", "src/pages/", "161", "Default exports (lazy)"],
          ["Styles", "src/styles/", "2", "CSS files"],
        ], [1800, 3200, 800, 3560]),
      pb(),

      h("2. AuthContext Specification", HeadingLevel.HEADING_1),
      h("2.1 Interface", HeadingLevel.HEADING_2),
      code("interface AuthContextType {"),
      code("  user: CanvasUser | null;"),
      code("  isAuthenticated: boolean;"),
      code("  isLoading: boolean;"),
      code("  role: 'admin' | 'teacher' | 'student';"),
      code("  login: (email: string, password: string) => Promise<void>;"),
      code("  logout: () => Promise<void>;"),
      code("  checkAuth: () => Promise<void>;"),
      code("}"),
      sp(),
      h("2.2 State Machine", HeadingLevel.HEADING_2),
      code("INITIAL --> [checkAuth()] --> LOADING"),
      code("LOADING --> [API success] --> AUTHENTICATED"),
      code("LOADING --> [API 401] --> UNAUTHENTICATED"),
      code("AUTHENTICATED --> [logout()] --> UNAUTHENTICATED"),
      code("UNAUTHENTICATED --> [login()] --> LOADING"),
      sp(),
      h("2.3 Role Detection Logic", HeadingLevel.HEADING_2),
      code("function computeRole(user: CanvasUser): Role {"),
      code("  if (user.permissions?.can_manage_account) return 'admin';"),
      code("  if (user.permissions?.become_user) return 'admin';"),
      code("  if (user.enrollments?.some(e =>"),
      code("    e.type === 'TeacherEnrollment')) return 'teacher';"),
      code("  return 'student';"),
      code("}"),
      pb(),

      h("3. API Client Specification", HeadingLevel.HEADING_1),
      h("3.1 Core HTTP Methods", HeadingLevel.HEADING_2),
      code("async function apiRequest<T>("),
      code("  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',"),
      code("  path: string,"),
      code("  body?: unknown,"),
      code("  params?: Record<string, string>"),
      code("): Promise<T> {"),
      code("  const url = new URL(`/api/v1${path}`, window.location.origin);"),
      code("  Object.entries(params || {}).forEach(([k,v]) =>"),
      code("    url.searchParams.set(k, v));"),
      code("  const headers: HeadersInit = {"),
      code("    'Accept': 'application/json',"),
      code("    'X-CSRF-Token': getCsrfToken(),"),
      code("  };"),
      code("  if (body) headers['Content-Type'] = 'application/json';"),
      code("  const res = await fetch(url.toString(), {"),
      code("    method, headers, credentials: 'same-origin',"),
      code("    body: body ? JSON.stringify(body) : undefined,"),
      code("  });"),
      code("  if (!res.ok) throw new ApiError(res.status, await res.text());"),
      code("  return res.json();"),
      code("}"),
      sp(),
      h("3.2 Pagination Handling", HeadingLevel.HEADING_2),
      code("async function apiGetAll<T>(path: string): Promise<T[]> {"),
      code("  let results: T[] = [];"),
      code("  let url: string | null = `/api/v1${path}?per_page=100`;"),
      code("  while (url) {"),
      code("    const res = await fetch(url, { credentials: 'same-origin' });"),
      code("    results = results.concat(await res.json());"),
      code("    const link = res.headers.get('Link');"),
      code("    url = parseLinkHeader(link)?.next || null;"),
      code("  }"),
      code("  return results;"),
      code("}"),
      sp(),
      h("3.3 Error Handling", HeadingLevel.HEADING_2),
      code("class ApiError extends Error {"),
      code("  constructor("),
      code("    public status: number,"),
      code("    public body: string"),
      code("  ) { super(`API Error ${status}`); }"),
      code("  get isUnauthorized() { return this.status === 401; }"),
      code("  get isForbidden() { return this.status === 403; }"),
      code("  get isNotFound() { return this.status === 404; }"),
      code("  get isRateLimited() { return this.status === 403; }"),
      code("}"),
      pb(),

      h("4. Theme System Specification", HeadingLevel.HEADING_1),
      h("4.1 CSS Variable Map", HeadingLevel.HEADING_2),
      tbl(["Variable", "Dark Accent", "Teal Classic", "Ocean Blue"],
        [
          ["--sidebar-bg", "linear-gradient(#163B32, #0F2922)", "#1A6B6B", "#1E3A5F"],
          ["--sidebar-text", "#B8D8CF", "#B8D8CF", "#B8C8E0"],
          ["--sidebar-active", "#2DB88A", "#2DB88A", "#3B82F6"],
          ["--topbar-bg", "#FFFFFF", "#FFFFFF", "#FFFFFF"],
          ["--color-page", "#D4EFE6", "#E8F5F0", "#E8F0FE"],
          ["--color-accent-green", "#2DB88A", "#2DB88A", "#3B82F6"],
          ["--card-bg", "#FFFFFF", "#FFFFFF", "#FFFFFF"],
          ["--text-primary", "#1E293B", "#1E293B", "#1E293B"],
        ], [2200, 2600, 2000, 2560]),
      sp(),
      h("4.2 Theme Application", HeadingLevel.HEADING_2),
      code("function applyTheme(themeId: string) {"),
      code("  const theme = THEME_REGISTRY[themeId];"),
      code("  const root = document.documentElement;"),
      code("  Object.entries(theme.variables).forEach(([key, value]) => {"),
      code("    root.style.setProperty(key, value);"),
      code("  });"),
      code("  localStorage.setItem('redefiners-theme', themeId);"),
      code("}"),
      pb(),

      h("5. Route Configuration", HeadingLevel.HEADING_1),
      h("5.1 Route Structure Pattern", HeadingLevel.HEADING_2),
      code("const routes: RouteObject[] = ["),
      code("  // Public routes"),
      code("  { path: '/login', element: <PublicRoute />, children: ["),
      code("    { index: true, lazy: () => import('./pages/LoginPage') },"),
      code("  ]},"),
      code("  // Protected routes"),
      code("  { element: <ProtectedRoute />, children: ["),
      code("    { element: <AppLayout />, children: ["),
      code("      { path: '/dashboard', lazy: () => import('./pages/Dashboard') },"),
      code("      // ... 145+ more routes"),
      code("    ]},"),
      code("  ]},"),
      code("  // Admin routes (nested inside protected)"),
      code("  { element: <AdminRoute />, children: ["),
      code("    { path: '/admin/*', lazy: () => import('./pages/admin/*') },"),
      code("  ]},"),
      code("];"),
      sp(),
      h("5.2 Route Categories", HeadingLevel.HEADING_2),
      tbl(["Category", "Path Pattern", "Guard", "Count"],
        [
          ["Public", "/login, /login/:variant", "PublicRoute", "5"],
          ["Dashboard", "/dashboard", "ProtectedRoute", "1"],
          ["Courses", "/courses/*", "ProtectedRoute", "18"],
          ["Assignments", "/courses/:id/assignments/*", "ProtectedRoute", "5"],
          ["Quizzes", "/courses/:id/quizzes/*", "ProtectedRoute", "6"],
          ["Discussions", "/courses/:id/discussions/*", "ProtectedRoute", "3"],
          ["Gradebook", "/courses/:id/gradebook/*", "ProtectedRoute", "4"],
          ["Calendar", "/calendar/*", "ProtectedRoute", "3"],
          ["Communication", "/inbox/*, /chat/*", "ProtectedRoute", "8"],
          ["Analytics", "/analytics/*", "ProtectedRoute", "7"],
          ["Admin", "/admin/*", "AdminRoute", "40+"],
          ["Account", "/profile/*, /settings/*", "ProtectedRoute", "6"],
        ], [1800, 3200, 1800, 2560]),
      sp(),

      h("6. Component Specifications", HeadingLevel.HEADING_1),
      h("6.1 Sidebar Component", HeadingLevel.HEADING_2),
      code("interface SidebarProps {"),
      code("  isCollapsed: boolean;"),
      code("  onToggle: () => void;"),
      code("}"),
      code("// Context detection:"),
      code("const location = useLocation();"),
      code("const courseMatch = location.pathname.match(/\\/courses\\/(\\d+)/);"),
      code("const context = courseMatch ? 'course' : 'global';"),
      code("// Renders: navSections[context] -> SidebarItem[]"),
      sp(),
      h("6.2 Navigation Data Structure", HeadingLevel.HEADING_2),
      code("interface NavSection {"),
      code("  title: string;"),
      code("  items: NavItem[];"),
      code("}"),
      code("interface NavItem {"),
      code("  label: string;"),
      code("  icon: LucideIcon;"),
      code("  href: string;"),
      code("  badge?: number;"),
      code("  children?: NavItem[];  // submenu"),
      code("  adminOnly?: boolean;"),
      code("}"),
      code("// Total: 96 items across 5 sections, 12 submenus"),
    ]}
  ]});
  await save(doc, "LOW_LEVEL_DESIGN_DOCUMENT.docx");
}

// ═══════════════════════════════════════════
// DOCUMENT 5: API REFERENCE GUIDE
// ═══════════════════════════════════════════
async function doc05_API() {
  const doc = new Document({ styles, numbering, sections: [
    cover("API REFERENCE GUIDE", "Canvas REST API Integration", [
      ["API Version", "Canvas REST API v1"],
      ["Base URL", "https://fineract.us/api/v1"],
      ["Authentication", "Session Cookie + CSRF Token"],
    ]),
    { properties: pageProps, ...hdrFtr("API Reference"), children: [
      h("Table of Contents", HeadingLevel.HEADING_1),
      new TableOfContents("TOC", { hyperlink: true, headingStyleRange: "1-3" }), pb(),

      h("1. Authentication", HeadingLevel.HEADING_1),
      h("1.1 Session Cookie Auth", HeadingLevel.HEADING_2),
      p("All API requests use Canvas session cookies for authentication. The SPA operates on the same domain as Canvas, enabling same-origin credential sharing."),
      code("// All fetch calls include:"),
      code("fetch(url, { credentials: 'same-origin' })"),
      sp(),
      h("1.2 CSRF Token", HeadingLevel.HEADING_2),
      p("Non-GET requests require a CSRF token extracted from the _csrf_token cookie:"),
      code("const token = document.cookie"),
      code("  .split('; ')"),
      code("  .find(c => c.startsWith('_csrf_token='))"),
      code("  ?.split('=')[1];"),
      code("headers['X-CSRF-Token'] = decodeURIComponent(token);"),
      sp(),
      h("1.3 Error Codes", HeadingLevel.HEADING_2),
      tbl(["Code", "Meaning", "SPA Behavior"],
        [
          ["200", "Success", "Parse JSON, update UI"],
          ["201", "Created", "Parse JSON, show success toast"],
          ["204", "No Content", "Success, no body to parse"],
          ["400", "Bad Request", "Show validation error messages"],
          ["401", "Unauthorized", "Redirect to /login"],
          ["403", "Forbidden", "Show 403 page or rate limit message"],
          ["404", "Not Found", "Show 404 page"],
          ["422", "Unprocessable", "Show field-level validation errors"],
          ["429", "Rate Limited", "Retry with exponential backoff"],
          ["500", "Server Error", "Show generic error, log to console"],
        ], [1000, 2200, 6160]),
      pb(),

      h("2. Users API", HeadingLevel.HEADING_1),
      h("2.1 Get Current User", HeadingLevel.HEADING_2),
      code("GET /api/v1/users/self/profile"),
      p("Returns the authenticated user's profile."),
      code("Response: { id, name, short_name, avatar_url, email,"),
      code("           locale, permissions, enrollments }"),
      sp(),
      h("2.2 Get User Todo Items", HeadingLevel.HEADING_2),
      code("GET /api/v1/users/self/todo"),
      p("Returns upcoming assignments and grading tasks."),
      code("Response: [{ type, assignment: { id, name, due_at },"),
      code("            context_name, html_url }]"),
      sp(),
      h("2.3 Get Activity Stream", HeadingLevel.HEADING_2),
      code("GET /api/v1/users/self/activity_stream"),
      p("Returns recent activity across all courses."),
      sp(),
      h("2.4 Update Profile", HeadingLevel.HEADING_2),
      code("PUT /api/v1/users/self"),
      code("Body: { user: { name, short_name, bio, locale } }"),
      pb(),

      h("3. Courses API", HeadingLevel.HEADING_1),
      h("3.1 List Courses", HeadingLevel.HEADING_2),
      code("GET /api/v1/courses"),
      code("Params: ?enrollment_state=active&include[]=total_students"),
      code("        &include[]=term&include[]=teachers"),
      p("Returns all courses for the authenticated user."),
      sp(),
      h("3.2 Get Course Detail", HeadingLevel.HEADING_2),
      code("GET /api/v1/courses/:course_id"),
      code("Params: ?include[]=total_students&include[]=tabs"),
      sp(),
      h("3.3 Course Tabs", HeadingLevel.HEADING_2),
      code("GET /api/v1/courses/:course_id/tabs"),
      p("Returns enabled navigation tabs for a course."),
      sp(),
      h("3.4 Course Users", HeadingLevel.HEADING_2),
      code("GET /api/v1/courses/:course_id/users"),
      code("Params: ?enrollment_type[]=student&include[]=avatar_url"),
      pb(),

      h("4. Assignments API", HeadingLevel.HEADING_1),
      h("4.1 List Assignments", HeadingLevel.HEADING_2),
      code("GET /api/v1/courses/:course_id/assignments"),
      code("Params: ?include[]=submission&order_by=due_at"),
      sp(),
      h("4.2 Get Single Assignment", HeadingLevel.HEADING_2),
      code("GET /api/v1/courses/:course_id/assignments/:id"),
      code("Params: ?include[]=submission&include[]=rubric_assessment"),
      sp(),
      h("4.3 Submit Assignment", HeadingLevel.HEADING_2),
      code("POST /api/v1/courses/:course_id/assignments/:id/submissions"),
      code("Body: { submission: { submission_type, body | url | file_ids } }"),
      sp(),
      h("4.4 Assignment Groups", HeadingLevel.HEADING_2),
      code("GET /api/v1/courses/:course_id/assignment_groups"),
      code("Params: ?include[]=assignments&include[]=submission"),
      pb(),

      h("5. Modules API", HeadingLevel.HEADING_1),
      code("GET /api/v1/courses/:course_id/modules"),
      code("GET /api/v1/courses/:course_id/modules/:id/items"),
      code("PUT /api/v1/courses/:course_id/modules/items/:id/done"),
      sp(),

      h("6. Discussions API", HeadingLevel.HEADING_1),
      code("GET /api/v1/courses/:course_id/discussion_topics"),
      code("GET /api/v1/courses/:course_id/discussion_topics/:id/view"),
      code("POST /api/v1/courses/:course_id/discussion_topics/:id/entries"),
      code("POST /api/v1/courses/:course_id/discussion_topics/:id/entries/:eid/replies"),
      sp(),

      h("7. Grades & Enrollments API", HeadingLevel.HEADING_1),
      code("GET /api/v1/courses/:course_id/enrollments"),
      code("Params: ?include[]=current_points&include[]=total_scores"),
      code("Response: [{ grades: { current_score, final_score, current_grade } }]"),
      sp(),

      h("8. Calendar API", HeadingLevel.HEADING_1),
      code("GET /api/v1/calendar_events"),
      code("Params: ?type=event&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD"),
      code("        &context_codes[]=course_123"),
      sp(),

      h("9. Conversations API", HeadingLevel.HEADING_1),
      code("GET /api/v1/conversations"),
      code("POST /api/v1/conversations"),
      code("Body: { recipients: [user_ids], subject, body, group_conversation }"),
      code("POST /api/v1/conversations/:id/add_message"),
      code("Body: { body: 'message text' }"),
      sp(),

      h("10. Files API", HeadingLevel.HEADING_1),
      code("GET /api/v1/courses/:course_id/folders/root"),
      code("GET /api/v1/folders/:id/files"),
      code("GET /api/v1/folders/:id/folders"),
      code("// Upload: 3-step process"),
      code("POST /api/v1/courses/:id/files (get upload URL)"),
      code("POST upload_url (upload file data)"),
      code("GET confirmation_url (confirm upload)"),
      sp(),

      h("11. Admin API", HeadingLevel.HEADING_1),
      code("GET /api/v1/accounts/:id"),
      code("GET /api/v1/accounts/:id/sub_accounts"),
      code("GET /api/v1/accounts/:id/roles"),
      code("GET /api/v1/accounts/:id/users"),
      code("GET /api/v1/accounts/:id/reports"),
      code("GET /api/v1/accounts/:id/sis_imports"),
      code("GET /api/v1/accounts/:id/terms"),
      code("GET /api/v1/audit/authentication/accounts/:id"),
      code("GET /api/v1/audit/grade_change/accounts/:id"),
      sp(),

      h("12. Pagination", HeadingLevel.HEADING_1),
      p("Canvas API uses Link header pagination:"),
      code("Link: <https://fineract.us/api/v1/courses?page=2>; rel=\"next\","),
      code("      <https://fineract.us/api/v1/courses?page=5>; rel=\"last\""),
      p("The SPA parses these headers to enable infinite scroll or paginated navigation. Default page size is 10; use per_page=100 for bulk fetches."),
    ]}
  ]});
  await save(doc, "API_REFERENCE_GUIDE.docx");
}

// ═══════════════════════════════════════════
// DOCUMENT 6: DATABASE SCHEMA DOCUMENT
// ═══════════════════════════════════════════
async function doc06_DB() {
  const doc = new Document({ styles, numbering, sections: [
    cover("DATABASE SCHEMA\nDOCUMENT", "Canvas LMS Data Model Reference", [
      ["Database", "PostgreSQL 14"],
      ["Schema", "Canvas LMS default (public)"],
      ["Tables", "400+ (Canvas core)"],
    ]),
    { properties: pageProps, ...hdrFtr("Database Schema"), children: [
      h("Table of Contents", HeadingLevel.HEADING_1),
      new TableOfContents("TOC", { hyperlink: true, headingStyleRange: "1-3" }), pb(),

      h("1. Overview", HeadingLevel.HEADING_1),
      p("Canvas LMS uses PostgreSQL 14 as its primary data store. The schema contains 400+ tables covering all LMS functionality. This document covers the key entities that the ReDefiners frontend interacts with through the Canvas API."),
      p("Note: The ReDefiners frontend does not access the database directly. All data access is through the Canvas REST API. This document serves as a reference for understanding the data model behind API responses."),
      sp(),
      h("1.1 Database Configuration", HeadingLevel.HEADING_2),
      tbl(["Parameter", "Value"],
        [
          ["Host", "postgres (Docker service name)"],
          ["Port", "5432"],
          ["Database", "canvas_production"],
          ["User", "canvas"],
          ["Connection Pool", "25 (ActiveRecord)"],
          ["Extensions", "pg_trgm (trigram full-text search)"],
          ["Encoding", "UTF-8"],
        ], [3000, 6360]),
      pb(),

      h("2. Core Entity Tables", HeadingLevel.HEADING_1),
      h("2.1 users", HeadingLevel.HEADING_2),
      tbl(["Column", "Type", "Nullable", "Description"],
        [
          ["id", "bigint (PK)", "No", "Unique user identifier"],
          ["name", "varchar(255)", "No", "Full display name"],
          ["short_name", "varchar(255)", "Yes", "Preferred short name"],
          ["sortable_name", "varchar(255)", "Yes", "Last, First format"],
          ["email", "varchar(255)", "Yes", "Primary email address"],
          ["avatar_image_url", "text", "Yes", "Profile image URL"],
          ["locale", "varchar(10)", "Yes", "Preferred language"],
          ["workflow_state", "varchar(30)", "No", "registered/pre_registered/deleted"],
          ["created_at", "timestamp", "No", "Account creation date"],
          ["updated_at", "timestamp", "No", "Last modification date"],
        ], [2000, 2000, 1200, 4160]),
      sp(),
      h("2.2 courses", HeadingLevel.HEADING_2),
      tbl(["Column", "Type", "Nullable", "Description"],
        [
          ["id", "bigint (PK)", "No", "Unique course identifier"],
          ["name", "varchar(255)", "No", "Course title"],
          ["course_code", "varchar(255)", "Yes", "Short course code (e.g. BIO201)"],
          ["account_id", "bigint (FK)", "No", "Parent account"],
          ["enrollment_term_id", "bigint (FK)", "Yes", "Academic term"],
          ["start_at", "timestamp", "Yes", "Course start date"],
          ["conclude_at", "timestamp", "Yes", "Course end date"],
          ["workflow_state", "varchar(30)", "No", "created/claimed/available/completed/deleted"],
          ["default_view", "varchar(30)", "Yes", "feed/wiki/modules/assignments/syllabus"],
          ["storage_quota", "bigint", "Yes", "File storage limit in bytes"],
        ], [2000, 2000, 1200, 4160]),
      sp(),
      h("2.3 enrollments", HeadingLevel.HEADING_2),
      tbl(["Column", "Type", "Nullable", "Description"],
        [
          ["id", "bigint (PK)", "No", "Enrollment ID"],
          ["user_id", "bigint (FK)", "No", "References users.id"],
          ["course_id", "bigint (FK)", "No", "References courses.id"],
          ["type", "varchar(50)", "No", "StudentEnrollment/TeacherEnrollment/TaEnrollment/ObserverEnrollment"],
          ["workflow_state", "varchar(30)", "No", "active/invited/completed/inactive/deleted"],
          ["computed_current_score", "decimal", "Yes", "Current grade percentage"],
          ["computed_final_score", "decimal", "Yes", "Final grade percentage"],
          ["role_id", "bigint (FK)", "Yes", "Custom role reference"],
        ], [2200, 1800, 1200, 4160]),
      pb(),
      h("2.4 assignments", HeadingLevel.HEADING_2),
      tbl(["Column", "Type", "Nullable", "Description"],
        [
          ["id", "bigint (PK)", "No", "Assignment ID"],
          ["course_id", "bigint (FK)", "No", "Parent course"],
          ["title", "varchar(255)", "No", "Assignment title"],
          ["description", "text", "Yes", "HTML description"],
          ["due_at", "timestamp", "Yes", "Due date/time"],
          ["points_possible", "decimal", "Yes", "Maximum points"],
          ["submission_types", "varchar[]", "No", "online_text_entry/online_upload/online_url"],
          ["assignment_group_id", "bigint (FK)", "No", "Grading group"],
          ["grading_type", "varchar(30)", "No", "points/percent/pass_fail/letter_grade/gpa_scale"],
          ["workflow_state", "varchar(30)", "No", "published/unpublished/deleted"],
        ], [2200, 1800, 1200, 4160]),
      sp(),
      h("2.5 submissions", HeadingLevel.HEADING_2),
      tbl(["Column", "Type", "Nullable", "Description"],
        [
          ["id", "bigint (PK)", "No", "Submission ID"],
          ["assignment_id", "bigint (FK)", "No", "Parent assignment"],
          ["user_id", "bigint (FK)", "No", "Submitting student"],
          ["body", "text", "Yes", "Text entry content"],
          ["url", "text", "Yes", "URL submission"],
          ["grade", "varchar(30)", "Yes", "Assigned grade (string)"],
          ["score", "decimal", "Yes", "Numeric score"],
          ["submitted_at", "timestamp", "Yes", "Submission timestamp"],
          ["graded_at", "timestamp", "Yes", "When graded"],
          ["workflow_state", "varchar(30)", "No", "submitted/graded/pending_review/unsubmitted"],
        ], [2200, 1800, 1200, 4160]),
      sp(),

      h("3. Relationship Diagram", HeadingLevel.HEADING_1),
      code("users ----< enrollments >---- courses"),
      code("  |                             |"),
      code("  |                             |----< assignments"),
      code("  |                             |         |"),
      code("  |----< submissions >----------|---------|"),
      code("  |                             |"),
      code("  |----< discussion_entries     |----< discussion_topics"),
      code("  |                             |----< context_modules"),
      code("  |----< conversations          |----< wiki_pages"),
      code("  |                             |----< quizzes"),
      code("  |----< eportfolios            |----< rubrics"),
      code("                                |----< assignment_groups"),
      sp(),

      h("4. Seeded Demo Data Summary", HeadingLevel.HEADING_1),
      tbl(["Table", "Record Count", "Key Data"],
        [
          ["users", "34", "1 admin, 5 teachers, 24 students, 4 TAs"],
          ["courses", "11", "Multi-discipline academic courses"],
          ["enrollments", "~200", "Students enrolled in 3-5 courses each"],
          ["assignments", "86", "Across all courses, varied types"],
          ["submissions", "1,014", "Graded with scores 55-100%"],
          ["discussion_topics", "14", "Course-specific topics"],
          ["announcements", "12", "Course and institutional"],
          ["context_modules", "12+", "Sequential course content"],
          ["calendar_events", "12+", "Academic and course events"],
          ["wiki_pages", "50", "Course content pages"],
          ["quizzes", "30", "Multiple format quizzes"],
          ["rubrics", "20", "Attached to assignments"],
          ["groups", "26", "Student collaboration groups"],
          ["enrollment_terms", "2", "Default + Spring 2026"],
        ], [2200, 1600, 5560]),
    ]}
  ]});
  await save(doc, "DATABASE_SCHEMA_DOCUMENT.docx");
}

// ═══════════════════════════════════════════
// DOCUMENT 7: DEPLOYMENT RUNBOOK
// ═══════════════════════════════════════════
async function doc07_Runbook() {
  const doc = new Document({ styles, numbering, sections: [
    cover("DEPLOYMENT RUNBOOK", "Operations & Procedures Guide", [
      ["Server", "148.230.111.247 (Hostinger VPS)"],
      ["Domain", "fineract.us"],
      ["Stack", "Docker Compose (6 services)"],
    ]),
    { properties: pageProps, ...hdrFtr("Deployment Runbook"), children: [
      h("Table of Contents", HeadingLevel.HEADING_1),
      new TableOfContents("TOC", { hyperlink: true, headingStyleRange: "1-3" }), pb(),

      h("1. Server Access", HeadingLevel.HEADING_1),
      code("ssh -i ~/.ssh/hostinger-new root@148.230.111.247"),
      code("# Deploy directory: /opt/canvas-lms"),
      code("# SPA directory: /opt/canvas-lms/deploy/spa/app/"),
      code("# Config directory: /opt/canvas-lms/deploy/config/"),
      code("# Docker Compose: /opt/canvas-lms/deploy/docker-compose.production.yml"),
      sp(),

      h("2. Service Management", HeadingLevel.HEADING_1),
      h("2.1 Start All Services", HeadingLevel.HEADING_2),
      code("cd /opt/canvas-lms/deploy"),
      code("docker compose -f docker-compose.production.yml up -d"),
      sp(),
      h("2.2 Stop All Services", HeadingLevel.HEADING_2),
      code("docker compose -f docker-compose.production.yml down"),
      sp(),
      h("2.3 Restart Specific Service", HeadingLevel.HEADING_2),
      code("docker compose -f docker-compose.production.yml restart web"),
      code("docker compose -f docker-compose.production.yml restart nginx"),
      code("docker compose -f docker-compose.production.yml restart jobs"),
      sp(),
      h("2.4 View Logs", HeadingLevel.HEADING_2),
      code("# All services"),
      code("docker compose -f docker-compose.production.yml logs -f"),
      code("# Specific service (last 100 lines)"),
      code("docker compose -f docker-compose.production.yml logs -f --tail=100 web"),
      code("docker compose -f docker-compose.production.yml logs -f --tail=100 nginx"),
      sp(),
      h("2.5 Check Service Health", HeadingLevel.HEADING_2),
      code("docker compose -f docker-compose.production.yml ps"),
      code("curl -sk https://localhost/health_check"),
      code("curl -sk https://fineract.us/api/v1/users/self"),
      pb(),

      h("3. Frontend Deployment", HeadingLevel.HEADING_1),
      h("3.1 Manual Deploy", HeadingLevel.HEADING_2),
      n("Build locally: cd redefiners-app && npm run build"),
      n("Upload build: scp -i ~/.ssh/hostinger-new -r dist/* root@148.230.111.247:/opt/canvas-lms/deploy/spa/app/"),
      n("Reload Nginx: ssh root@148.230.111.247 'docker exec nginx nginx -s reload'"),
      n("Verify: curl -sk https://fineract.us/app/"),
      sp(),
      h("3.2 CI/CD Deploy (Automated)", HeadingLevel.HEADING_2),
      n("Push to main or feature/react-frontend branch"),
      n("GitHub Actions runs build + test + deploy pipeline"),
      n("Artifacts uploaded, SSH deployment triggered"),
      n("Nginx reloaded automatically"),
      n("Health check verifies deployment"),
      pb(),

      h("4. Database Operations", HeadingLevel.HEADING_1),
      h("4.1 Connect to PostgreSQL", HeadingLevel.HEADING_2),
      code("docker exec -it deploy-postgres-1 psql -U canvas canvas_production"),
      sp(),
      h("4.2 Run Migrations", HeadingLevel.HEADING_2),
      code("docker exec -it deploy-web-1 bundle exec rake db:migrate"),
      sp(),
      h("4.3 Seed Demo Data", HeadingLevel.HEADING_2),
      code("docker exec -it deploy-web-1 bundle exec rails runner /tmp/seed_demo.rb"),
      sp(),
      h("4.4 Database Backup", HeadingLevel.HEADING_2),
      code("docker exec deploy-postgres-1 pg_dump -U canvas canvas_production > backup_$(date +%Y%m%d).sql"),
      sp(),
      h("4.5 Database Restore", HeadingLevel.HEADING_2),
      code("cat backup.sql | docker exec -i deploy-postgres-1 psql -U canvas canvas_production"),
      pb(),

      h("5. SSL Certificate Management", HeadingLevel.HEADING_1),
      code("# Check certificate expiry"),
      code("openssl s_client -connect fineract.us:443 2>/dev/null | openssl x509 -noout -dates"),
      code("# Manual renewal"),
      code("docker compose -f docker-compose.production.yml run certbot renew"),
      code("docker compose -f docker-compose.production.yml restart nginx"),
      sp(),

      h("6. Troubleshooting", HeadingLevel.HEADING_1),
      tbl(["Symptom", "Cause", "Resolution"],
        [
          ["502 Bad Gateway", "Canvas web container down", "docker compose restart web; check logs for Rails errors"],
          ["CSRF token invalid", "Stale session cookie", "Clear cookies, re-login"],
          ["Assets not loading", "Nginx cache stale", "docker exec nginx nginx -s reload"],
          ["Database connection error", "PostgreSQL container unhealthy", "docker compose restart postgres; wait for health check"],
          ["Redis connection error", "Redis OOM or crashed", "docker compose restart redis; check memory limits"],
          ["SSL cert expired", "Certbot renewal failed", "Run manual renewal, check DNS, restart nginx"],
          ["504 Gateway Timeout", "Canvas query slow", "Check PostgreSQL slow queries; increase proxy timeout"],
          ["Login redirect loop", "Session cookie domain mismatch", "Verify domain.yml matches actual domain"],
        ], [2000, 2600, 4760]),
      sp(),

      h("7. Emergency Procedures", HeadingLevel.HEADING_1),
      h("7.1 Full System Restart", HeadingLevel.HEADING_2),
      code("cd /opt/canvas-lms/deploy"),
      code("docker compose -f docker-compose.production.yml down"),
      code("docker compose -f docker-compose.production.yml up -d"),
      code("# Wait for health checks"),
      code("sleep 60"),
      code("curl -sk https://fineract.us/health_check"),
      sp(),
      h("7.2 Rollback Frontend", HeadingLevel.HEADING_2),
      code("# Restore from previous build"),
      code("cd /opt/canvas-lms/deploy/spa/"),
      code("rm -rf app/*"),
      code("cp -r app-backup/* app/"),
      code("docker exec nginx nginx -s reload"),
      sp(),
      h("7.3 Emergency Maintenance Page", HeadingLevel.HEADING_2),
      code("# Create maintenance page"),
      code("echo '<h1>Under Maintenance</h1>' > /opt/canvas-lms/deploy/spa/app/index.html"),
      code("docker exec nginx nginx -s reload"),
    ]}
  ]});
  await save(doc, "DEPLOYMENT_RUNBOOK.docx");
}

// ═══════════════════════════════════════════
// DOCUMENT 8: USER MANUAL
// ═══════════════════════════════════════════
async function doc08_UserManual() {
  const doc = new Document({ styles, numbering, sections: [
    cover("USER MANUAL", "End-User Guide for ReDefiners LMS", [
      ["Audience", "Students, Teachers, Administrators"],
      ["URL", "https://fineract.us"],
      ["Version", "1.0"],
    ]),
    { properties: pageProps, ...hdrFtr("User Manual"), children: [
      h("Table of Contents", HeadingLevel.HEADING_1),
      new TableOfContents("TOC", { hyperlink: true, headingStyleRange: "1-3" }), pb(),

      h("1. Getting Started", HeadingLevel.HEADING_1),
      h("1.1 Accessing the LMS", HeadingLevel.HEADING_2),
      n("Open your web browser (Chrome, Firefox, Safari, or Edge recommended)"),
      n("Navigate to https://fineract.us"),
      n("You will see the login page with the ReDefiners branding"),
      n("Enter your email address and password"),
      n("Click 'Sign In' to access your dashboard"),
      sp(),
      h("1.2 First Login", HeadingLevel.HEADING_2),
      p("When you first log in, you will be taken to your personalized dashboard. The dashboard shows:"),
      b("Your enrolled courses as colorful cards"),
      b("Upcoming assignments and deadlines in the To-Do panel"),
      b("A calendar preview showing the next 7 days"),
      b("Recent notifications and activity stream"),
      sp(),
      h("1.3 Navigation", HeadingLevel.HEADING_2),
      p("The LMS has three main navigation areas:"),
      bp("Sidebar (left): ", "Contains links to all major sections organized into categories. Click on any item to navigate. Some items have expandable sub-menus."),
      bp("Top Bar (top): ", "Contains the search bar, notification bell, theme switcher, and your profile menu."),
      bp("Breadcrumbs (content area): ", "Shows your current location in the app and lets you navigate back to parent pages."),
      pb(),

      h("2. For Students", HeadingLevel.HEADING_1),
      h("2.1 Viewing Courses", HeadingLevel.HEADING_2),
      p("Click 'My Courses' in the sidebar to see all your enrolled courses. Each course card shows the course name, instructor, and your current grade. Click on a course card to enter the course."),
      sp(),
      h("2.2 Submitting Assignments", HeadingLevel.HEADING_2),
      n("Navigate to your course"),
      n("Click 'Assignments' in the course sidebar"),
      n("Click on the assignment you want to submit"),
      n("Read the assignment description and requirements"),
      n("Choose your submission type (text entry, file upload, or URL)"),
      n("Enter your response or upload your file"),
      n("Click 'Submit Assignment'"),
      n("You will see a confirmation message when submitted successfully"),
      sp(),
      h("2.3 Checking Grades", HeadingLevel.HEADING_2),
      p("Click 'Grades' in the sidebar to see your grades across all courses. You can also click into a specific course and select the 'Grades' tab to see detailed assignment scores, rubric feedback, and your overall course grade."),
      sp(),
      h("2.4 Participating in Discussions", HeadingLevel.HEADING_2),
      n("Navigate to your course and click 'Discussions'"),
      n("Click on a discussion topic to read the prompt"),
      n("Click 'Reply' to post your response"),
      n("Use the rich text editor to format your response"),
      n("Click 'Post Reply' to submit"),
      sp(),
      h("2.5 Using the Calendar", HeadingLevel.HEADING_2),
      p("The Calendar page shows all your assignment due dates, course events, and personal events in a monthly, weekly, or agenda view. You can add personal events by clicking on a date."),
      pb(),

      h("3. For Teachers", HeadingLevel.HEADING_1),
      h("3.1 Managing Course Content", HeadingLevel.HEADING_2),
      p("As a teacher, you can create and organize content in your courses:"),
      b("Modules: Create sequential content modules with prerequisites"),
      b("Pages: Create wiki-style content pages with the rich text editor"),
      b("Files: Upload and organize course materials in the file manager"),
      b("Assignments: Create assignments with rubrics, due dates, and submission types"),
      sp(),
      h("3.2 Grading with SpeedGrader", HeadingLevel.HEADING_2),
      n("Navigate to your course's Gradebook or Assignments page"),
      n("Click on an assignment, then click 'SpeedGrader'"),
      n("Review each student's submission"),
      n("Enter a grade in the grade field"),
      n("Use the rubric to assess specific criteria"),
      n("Add comments for feedback"),
      n("Click the arrow to move to the next student"),
      sp(),
      h("3.3 Using the Gradebook", HeadingLevel.HEADING_2),
      p("The Gradebook shows a spreadsheet-like view of all students and their grades. You can sort by student name or assignment, enter grades directly in cells, and export grades to CSV for external processing."),
      sp(),
      h("3.4 Course Analytics", HeadingLevel.HEADING_2),
      p("The Analytics page shows engagement metrics including page views, participation rates, submission statistics, and grade distributions. Use this to identify students who may need additional support."),
      pb(),

      h("4. For Administrators", HeadingLevel.HEADING_1),
      h("4.1 User Management", HeadingLevel.HEADING_2),
      p("Navigate to Admin > User Management to create, edit, and manage user accounts. You can assign roles, manage enrollments, and view login history for any user."),
      sp(),
      h("4.2 Course Management", HeadingLevel.HEADING_2),
      p("Navigate to Admin > Course & User Search to find and manage all courses in the system. You can change enrollment states, adjust settings, and manage instructors."),
      sp(),
      h("4.3 Theme Customization", HeadingLevel.HEADING_2),
      p("The system supports 3 built-in themes. Users can switch themes using the palette icon in the top bar. As an admin, you can set the default theme for the institution in Admin > Theme Editor."),
      sp(),

      h("5. Customization", HeadingLevel.HEADING_1),
      h("5.1 Switching Themes", HeadingLevel.HEADING_2),
      n("Click the palette icon in the top bar"),
      n("Choose from Modern Dark Accent, Teal Classic, or Ocean Blue"),
      n("Toggle dark mode with the moon/sun icon"),
      n("Your preference is saved and will persist across sessions"),
      sp(),
      h("5.2 Login Page Variants", HeadingLevel.HEADING_2),
      p("The login page supports 5 design variants: Classic, Aurora (default), Glassmorphism, Minimal, and Landscape. The variant can be changed in the login page settings."),
      sp(),

      h("6. Troubleshooting", HeadingLevel.HEADING_1),
      tbl(["Issue", "Solution"],
        [
          ["Cannot log in", "Verify your email and password. Contact your administrator if your account is locked."],
          ["Page not loading", "Try refreshing the page. Clear browser cache. Check internet connection."],
          ["Assignment won't submit", "Ensure you've selected a submission type and attached required files. Check file size limits."],
          ["Grades not showing", "Grades appear after the instructor has graded your submission. Check back later."],
          ["Dark mode looks wrong", "Try toggling dark mode off and on. If issues persist, switch to a different theme."],
          ["Search not finding results", "Try shorter or more specific keywords. Search works across courses, pages, and people."],
        ], [2600, 6760]),
    ]}
  ]});
  await save(doc, "USER_MANUAL.docx");
}

// ═══════════════════════════════════════════
// DOCUMENT 9: ADMIN OPERATIONS MANUAL
// ═══════════════════════════════════════════
async function doc09_AdminOps() {
  const doc = new Document({ styles, numbering, sections: [
    cover("ADMIN OPERATIONS\nMANUAL", "System Administration Guide", [
      ["Audience", "IT Administrators, DevOps"],
      ["System", "Canvas LMS + ReDefiners Frontend"],
      ["Infrastructure", "Docker Compose on Hostinger VPS"],
    ]),
    { properties: pageProps, ...hdrFtr("Admin Operations"), children: [
      h("Table of Contents", HeadingLevel.HEADING_1),
      new TableOfContents("TOC", { hyperlink: true, headingStyleRange: "1-3" }), pb(),

      h("1. System Overview", HeadingLevel.HEADING_1),
      tbl(["Component", "Technology", "Port", "Memory", "Data"],
        [
          ["Web App", "Canvas Rails 8", "3000 (internal)", "3 GB", "Application logic"],
          ["Job Workers", "Delayed Job x2", "N/A", "2 GB", "Background processing"],
          ["Database", "PostgreSQL 14", "5432 (internal)", "1 GB", "All persistent data"],
          ["Cache", "Redis 7", "6379 (internal)", "512 MB", "Sessions, cache"],
          ["Proxy", "Nginx Alpine", "80, 443", "256 MB", "SSL, routing"],
          ["SSL", "Certbot", "N/A", "128 MB", "Certificate renewal"],
        ], [1600, 2000, 1600, 1200, 2960]),
      pb(),

      h("2. Daily Operations", HeadingLevel.HEADING_1),
      h("2.1 Health Check Routine", HeadingLevel.HEADING_2),
      code("# 1. Check all containers are running"),
      code("docker compose -f docker-compose.production.yml ps"),
      code(""),
      code("# 2. Verify web application responds"),
      code("curl -sk -o /dev/null -w '%{http_code}' https://fineract.us/health_check"),
      code(""),
      code("# 3. Check disk usage"),
      code("df -h /"),
      code(""),
      code("# 4. Check Docker disk usage"),
      code("docker system df"),
      code(""),
      code("# 5. Review recent errors"),
      code("docker compose -f docker-compose.production.yml logs --tail=50 web | grep ERROR"),
      sp(),

      h("2.2 User Management Tasks", HeadingLevel.HEADING_2),
      p("Common admin tasks performed through the ReDefiners Admin interface:"),
      b("Create user accounts: Admin > User Management > Add User"),
      b("Reset passwords: Admin > User Management > [User] > Reset Password"),
      b("Assign roles: Admin > User Management > [User] > Edit Role"),
      b("Bulk import: Admin > SIS Import > Upload CSV"),
      b("View login history: Admin > Audit Log > Filter by user"),
      pb(),

      h("3. Weekly Maintenance", HeadingLevel.HEADING_1),
      h("3.1 Database Backup", HeadingLevel.HEADING_2),
      code("# Weekly backup script"),
      code("DATE=$(date +%Y%m%d_%H%M%S)"),
      code("docker exec deploy-postgres-1 pg_dump -U canvas canvas_production \\"),
      code("  | gzip > /opt/backups/canvas_${DATE}.sql.gz"),
      code(""),
      code("# Retain last 4 weekly backups"),
      code("ls -t /opt/backups/canvas_*.sql.gz | tail -n +5 | xargs rm -f"),
      sp(),

      h("3.2 Log Rotation", HeadingLevel.HEADING_2),
      code("# Docker logs auto-rotate (json-file driver default)"),
      code("# Canvas application logs"),
      code("docker exec deploy-web-1 find /usr/src/app/log -name '*.log' -mtime +7 -delete"),
      sp(),

      h("3.3 Docker Cleanup", HeadingLevel.HEADING_2),
      code("# Remove unused images and build cache"),
      code("docker system prune -f"),
      code("docker image prune -a -f --filter 'until=168h'"),
      pb(),

      h("4. User Account Credentials", HeadingLevel.HEADING_1),
      tbl(["Role", "Email", "Password", "Purpose"],
        [
          ["Admin", "admin@redefiners.org", "ReDefiners2024!", "Full system administration"],
          ["Teacher", "garcia@redefiners.org", "ReDefTeacher2024!", "Course management, grading"],
          ["Teacher", "chen@redefiners.org", "ReDefTeacher2024!", "Secondary instructor"],
          ["Teacher", "okafor@redefiners.org", "ReDefTeacher2024!", "Science department"],
          ["Student", "student1@redefiners.org", "ReDefStudent2024!", "Student experience testing"],
          ["Student", "student2@redefiners.org", "ReDefStudent2024!", "Multi-course enrollment"],
        ], [1200, 2800, 2200, 3160]),
      sp(),

      h("5. Monitoring & Alerting", HeadingLevel.HEADING_1),
      tbl(["What to Monitor", "Tool", "Alert Threshold"],
        [
          ["Container health", "docker compose ps", "Any service not 'healthy'"],
          ["Disk usage", "df -h", "> 80% capacity"],
          ["Memory usage", "docker stats", "> 90% per container"],
          ["SSL certificate", "openssl s_client", "< 14 days to expiry"],
          ["HTTP response time", "curl timing", "> 5 seconds TTFB"],
          ["Error rate", "Log analysis", "> 10 errors/hour"],
          ["PostgreSQL connections", "pg_stat_activity", "> 20 active connections"],
          ["Redis memory", "redis-cli info memory", "> 200MB used"],
        ], [2600, 2800, 3960]),
      sp(),

      h("6. Security Operations", HeadingLevel.HEADING_1),
      b("Review audit logs weekly for suspicious activity"),
      b("Update Docker images monthly for security patches"),
      b("Rotate database passwords quarterly"),
      b("Review and revoke unused developer keys"),
      b("Check SSL certificate auto-renewal status"),
      b("Monitor for unusual API usage patterns"),
      b("Verify CSP headers are properly configured"),
      b("Test backup restoration quarterly"),
    ]}
  ]});
  await save(doc, "ADMIN_OPERATIONS_MANUAL.docx");
}

// ═══════════════════════════════════════════
// DOCUMENT 10: TEST PLAN
// ═══════════════════════════════════════════
async function doc10_TestPlan() {
  const doc = new Document({ styles, numbering, sections: [
    cover("TEST PLAN &\nTEST CASES", "Quality Assurance Documentation", [
      ["System Under Test", "ReDefiners LMS Frontend"],
      ["Test Types", "Unit, Integration, Visual, Performance, Security"],
      ["Tools", "Vitest, Puppeteer, Chrome DevTools Protocol"],
    ]),
    { properties: pageProps, ...hdrFtr("Test Plan"), children: [
      h("Table of Contents", HeadingLevel.HEADING_1),
      new TableOfContents("TOC", { hyperlink: true, headingStyleRange: "1-3" }), pb(),

      h("1. Test Strategy", HeadingLevel.HEADING_1),
      h("1.1 Testing Pyramid", HeadingLevel.HEADING_2),
      tbl(["Level", "Tool", "Scope", "Frequency", "Count"],
        [
          ["Unit", "Vitest + jsdom", "Functions, utilities, state logic", "Every commit", "Expanding"],
          ["Component", "Testing Library", "UI component rendering", "Every PR", "Expanding"],
          ["Visual Regression", "Puppeteer", "Full-page screenshots", "Per batch", "320 captured"],
          ["Integration", "Puppeteer + Canvas API", "End-to-end user flows", "Per release", "Per persona"],
          ["Performance", "Chrome DevTools Protocol", "Core Web Vitals", "Weekly", "10-page audit"],
          ["Security", "Manual + automated", "OWASP Top 10 checks", "Monthly", "31 findings"],
          ["Accessibility", "axe-core (planned)", "WCAG 2.1 AA", "Planned", "Planned"],
        ], [1400, 2200, 2560, 1400, 1800]),
      pb(),

      h("2. Test Cases - Authentication", HeadingLevel.HEADING_1),
      tbl(["TC-ID", "Description", "Steps", "Expected Result", "Status"],
        [
          ["TC-AUTH-01", "Valid login", "Enter valid email/password, click Sign In", "Redirect to dashboard, user avatar visible", "Pass"],
          ["TC-AUTH-02", "Invalid login", "Enter wrong password, click Sign In", "Error message displayed, stay on login", "Pass"],
          ["TC-AUTH-03", "Logout", "Click user menu > Logout", "Session cleared, redirect to /login", "Pass"],
          ["TC-AUTH-04", "Session expiry", "Wait for session timeout, click any link", "Redirect to /login", "Pass"],
          ["TC-AUTH-05", "Admin role detection", "Login as admin@redefiners.org", "Admin sidebar sections visible", "Pass"],
          ["TC-AUTH-06", "Student role detection", "Login as student1@redefiners.org", "Admin sections hidden", "Pass"],
          ["TC-AUTH-07", "CSRF token present", "Inspect request headers on form submit", "X-CSRF-Token header present", "Pass"],
          ["TC-AUTH-08", "Login variant switch", "Click variant selector, choose LV-03", "Glassmorphism design renders", "Pass"],
        ], [1200, 1800, 2600, 2560, 1200]),
      sp(),

      h("3. Test Cases - Dashboard", HeadingLevel.HEADING_1),
      tbl(["TC-ID", "Description", "Expected Result", "Status"],
        [
          ["TC-DASH-01", "Course cards render", "All enrolled courses shown as cards", "Pass"],
          ["TC-DASH-02", "To-do list populated", "Upcoming assignments listed with due dates", "Pass"],
          ["TC-DASH-03", "Calendar preview shows events", "Next 7 days with assignment markers", "Pass"],
          ["TC-DASH-04", "Empty state for no courses", "Friendly message when no enrollments", "Pass"],
          ["TC-DASH-05", "Course card click navigation", "Clicking card navigates to course detail", "Pass"],
        ], [1200, 2800, 3760, 1600]),
      sp(),

      h("4. Test Cases - Assignments", HeadingLevel.HEADING_1),
      tbl(["TC-ID", "Description", "Expected Result", "Status"],
        [
          ["TC-ASN-01", "Assignment list renders", "All assignments with due dates and points", "Pass"],
          ["TC-ASN-02", "Assignment detail view", "Description, rubric, submission area visible", "Pass"],
          ["TC-ASN-03", "Text submission", "Enter text, submit, confirmation toast", "Pass"],
          ["TC-ASN-04", "File upload submission", "Upload file, progress shown, confirmed", "Pass"],
          ["TC-ASN-05", "Overdue indicator", "Past-due assignments show red indicator", "Pass"],
          ["TC-ASN-06", "Grade display", "Graded assignments show score/rubric feedback", "Pass"],
        ], [1200, 2800, 3760, 1600]),
      sp(),

      h("5. Test Cases - Theme System", HeadingLevel.HEADING_1),
      tbl(["TC-ID", "Description", "Expected Result", "Status"],
        [
          ["TC-THM-01", "Theme switch - Modern Dark", "Sidebar green, accent mint", "Pass"],
          ["TC-THM-02", "Theme switch - Teal Classic", "Sidebar teal, accent mint", "Pass"],
          ["TC-THM-03", "Theme switch - Ocean Blue", "Sidebar navy, accent blue", "Pass"],
          ["TC-THM-04", "Dark mode toggle", "All surfaces switch to dark palette", "Pass"],
          ["TC-THM-05", "Theme persistence", "Reload page, same theme applied", "Pass"],
          ["TC-THM-06", "Cross-page consistency", "Navigate between pages, theme maintained", "Pass"],
        ], [1200, 2800, 3760, 1600]),
      sp(),

      h("6. Performance Test Results", HeadingLevel.HEADING_1),
      tbl(["Metric", "Target", "Measured", "Pass/Fail"],
        [
          ["TTFB", "< 300ms", "176ms", "Pass"],
          ["FCP", "< 1500ms", "567ms", "Pass"],
          ["CLS", "< 0.1", "0.000", "Pass"],
          ["Full Load", "< 3000ms", "1687ms", "Pass"],
          ["Vendor Bundle", "< 100KB (gzip)", "64.94KB", "Pass"],
          ["DOM Nodes", "< 1500", "~800", "Pass"],
        ], [2000, 2200, 2200, 2960]),
      sp(),

      h("7. Screenshot Verification Log", HeadingLevel.HEADING_1),
      tbl(["Batch", "Pages", "Screenshots", "Issues Found", "Status"],
        [
          ["batch-1 (Core)", "Dashboard, Courses, Login", "15", "0", "Verified"],
          ["batch-2 (Content)", "Assignments, Quizzes, Modules", "18", "2 (fixed)", "Verified"],
          ["batch-3 (Comm)", "Discussions, Inbox, Announcements", "12", "1 (fixed)", "Verified"],
          ["batch-4 (Admin)", "Users, Roles, Settings", "20", "0", "Verified"],
          ["priority-1", "Calendar, Grades, Analytics", "15", "0", "Verified"],
          ["priority-2", "ePortfolio, Groups, Services", "12", "3 (fixed)", "Verified"],
          ["priority-3", "Remaining pages", "18", "0", "Verified"],
          ["login-variants", "5 login designs", "5", "5 (redesigned)", "Verified"],
          ["theme-system", "3 themes x pages", "15", "0", "Verified"],
          ["security-fixes", "Post-remediation", "20", "0", "Verified"],
          ["crud-testing", "CRUD operations", "30", "0", "Verified"],
          ["user-testing", "All personas", "30", "0", "Verified"],
          ["devtools-audit", "Performance inspection", "10", "0", "Verified"],
          ["Total", "", "320", "11 (all fixed)", "All Verified"],
        ], [1800, 2800, 1400, 1600, 1760]),
    ]}
  ]});
  await save(doc, "TEST_PLAN_AND_CASES.docx");
}

// ═══════════════════════════════════════════
// MAIN: Run all generators sequentially
// ═══════════════════════════════════════════
async function main() {
  console.log("Generating all documents...\n");
  const start = Date.now();

  console.log("[1/10] Business Requirements Document");
  await doc01_BRD();

  console.log("[2/10] Software Requirements Specification");
  await doc02_SRS();

  console.log("[3/10] System Design Document (HLD)");
  await doc03_HLD();

  console.log("[4/10] Low-Level Design Document");
  await doc04_LLD();

  console.log("[5/10] API Reference Guide");
  await doc05_API();

  console.log("[6/10] Database Schema Document");
  await doc06_DB();

  console.log("[7/10] Deployment Runbook");
  await doc07_Runbook();

  console.log("[8/10] User Manual");
  await doc08_UserManual();

  console.log("[9/10] Admin Operations Manual");
  await doc09_AdminOps();

  console.log("[10/10] Test Plan & Test Cases");
  await doc10_TestPlan();

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\nAll 10 documents generated in ${elapsed}s`);
}

main().catch(e => { console.error(e); process.exit(1); });
