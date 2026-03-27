const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
  TableOfContents, TabStopType, TabStopPosition
} = require("docx");

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };
const TEAL = "0F4D61";
const DARK = "163B32";
const ACCENT = "2DB88A";
const ORANGE = "FF6B35";
const LIGHT_BG = "E8F5F0";
const WHITE = "FFFFFF";
const PAGE_W = 12240;
const PAGE_H = 15840;
const CONTENT_W = 9360;

function heading(text, level) {
  return new Paragraph({ heading: level, children: [new TextRun({ text, bold: true })] });
}
function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    ...opts,
    children: [new TextRun({ text, size: 22, ...opts.run })]
  });
}
function boldPara(label, value) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: label, bold: true, size: 22 }),
      new TextRun({ text: value, size: 22 })
    ]
  });
}
function bullet(text, ref = "bullets", level = 0) {
  return new Paragraph({
    numbering: { reference: ref, level },
    children: [new TextRun({ text, size: 22 })]
  });
}
function numberedItem(text, ref = "numbers", level = 0) {
  return new Paragraph({
    numbering: { reference: ref, level },
    children: [new TextRun({ text, size: 22 })]
  });
}
function spacer() {
  return new Paragraph({ spacing: { after: 200 }, children: [] });
}
function tableRow(cells, isHeader = false) {
  return new TableRow({
    tableHeader: isHeader,
    children: cells.map((c, i) => {
      const widths = cells._widths || null;
      return new TableCell({
        borders,
        margins: cellMargins,
        width: widths ? { size: widths[i], type: WidthType.DXA } : undefined,
        shading: isHeader ? { fill: DARK, type: ShadingType.CLEAR } : (c._shade ? { fill: c._shade, type: ShadingType.CLEAR } : undefined),
        children: [new Paragraph({
          children: [new TextRun({
            text: typeof c === "string" ? c : c.text,
            bold: isHeader,
            size: 20,
            color: isHeader ? WHITE : "333333",
            font: "Arial"
          })]
        })]
      });
    })
  });
}
function makeTable(headers, rows, colWidths) {
  const hCells = headers;
  hCells._widths = colWidths;
  const tRows = rows.map(r => { r._widths = colWidths; return tableRow(r); });
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [tableRow(hCells, true), ...tRows]
  });
}

async function createPRD() {
  const doc = new Document({
    styles: {
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
    },
    numbering: {
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
          { level: 1, format: LevelFormat.LOWER_LETTER, text: "%2)", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
        ]},
        { reference: "req", levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "FR-%1", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        ]},
        { reference: "nfr", levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "NFR-%1", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        ]},
      ]
    },
    sections: [
      // ===== COVER PAGE =====
      {
        properties: {
          page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
        },
        children: [
          spacer(), spacer(), spacer(), spacer(), spacer(),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [
            new TextRun({ text: "PRODUCT REQUIREMENTS DOCUMENT", size: 48, bold: true, color: DARK, font: "Arial" })
          ]}),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
            new TextRun({ text: "ReDefiners Custom Canvas LMS Frontend", size: 36, color: TEAL, font: "Arial" })
          ]}),
          spacer(),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [
            new TextRun({ text: "Version 1.0", size: 24, color: "666666" })
          ]}),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [
            new TextRun({ text: "March 27, 2026", size: 24, color: "666666" })
          ]}),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [
            new TextRun({ text: "Classification: Internal", size: 24, color: "666666" })
          ]}),
          spacer(), spacer(), spacer(),
          new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 2, color: ACCENT } }, spacing: { before: 200 }, children: [] }),
          makeTable(
            ["Field", "Value"],
            [
              ["Product Name", "ReDefiners LMS Frontend"],
              ["Platform", "Canvas LMS (Instructure)"],
              ["Target URL", "https://fineract.us"],
              ["Document Owner", "ReDefiners Development Team"],
              ["Status", "Released (v1.0)"],
              ["Last Updated", "March 27, 2026"],
            ],
            [3500, 5860]
          ),
          new Paragraph({ children: [new PageBreak()] }),
        ]
      },
      // ===== TOC + MAIN CONTENT =====
      {
        properties: {
          page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
        },
        headers: {
          default: new Header({ children: [
            new Paragraph({
              border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: ACCENT, space: 4 } },
              children: [
                new TextRun({ text: "ReDefiners LMS PRD", size: 18, color: "999999", italics: true }),
                new TextRun({ text: "\tv1.0", size: 18, color: "999999" })
              ],
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }]
            })
          ]})
        },
        footers: {
          default: new Footer({ children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Page ", size: 18, color: "999999" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "999999" }),
              ]
            })
          ]})
        },
        children: [
          heading("Table of Contents", HeadingLevel.HEADING_1),
          new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 1. EXECUTIVE SUMMARY =====
          heading("1. Executive Summary", HeadingLevel.HEADING_1),
          para("ReDefiners LMS is a custom-designed frontend replacement for the Instructure Canvas Learning Management System. It replaces the default Canvas UI with a modern, responsive, and highly branded single-page application built on React 19, TypeScript, Tailwind CSS v4, and shadcn/ui components."),
          para("The product serves educational institutions requiring a differentiated LMS experience that aligns with ReDefiners branding while maintaining full interoperability with the Canvas REST API for backend operations including course management, grading, discussions, quizzes, and administrative functions."),
          spacer(),
          heading("1.1 Product Vision", HeadingLevel.HEADING_2),
          para("To deliver a best-in-class learning management experience that combines the reliability and feature depth of Canvas LMS with a modern, intuitive, and visually distinctive user interface that drives higher engagement and adoption among students, educators, and administrators."),
          spacer(),
          heading("1.2 Key Objectives", HeadingLevel.HEADING_2),
          bullet("Replace all 243 Canvas frontend pages with custom-branded equivalents"),
          bullet("Achieve sub-600ms First Contentful Paint on initial page load"),
          bullet("Support 3 switchable themes with light/dark mode across all pages"),
          bullet("Provide role-based experiences for Students, Teachers, and Administrators"),
          bullet("Maintain 100% Canvas API compatibility for backend operations"),
          bullet("Enable self-hosted deployment on commodity VPS infrastructure"),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 2. PRODUCT SCOPE =====
          heading("2. Product Scope", HeadingLevel.HEADING_1),
          heading("2.1 In Scope", HeadingLevel.HEADING_2),
          makeTable(
            ["Area", "Description", "Pages"],
            [
              ["Dashboard & Navigation", "Personalized dashboard, global search, notifications, context-aware sidebar", "5"],
              ["Course Management", "Course listing, detail, settings, copy, pacing, analytics, wizard", "28"],
              ["Assignments & Grading", "CRUD, submissions, peer reviews, rubrics, SpeedGrader, Gradebook", "15"],
              ["Quizzes & Assessments", "Quiz CRUD, taking interface, results, statistics, question banks", "10"],
              ["Discussions & Communication", "Topics, threads, replies, inbox, chat, announcements, templates", "14"],
              ["Content Management", "Modules, pages (wiki), files, content library, video studio", "12"],
              ["Calendar & Scheduling", "Calendar, planner, academic calendar, events, room booking, attendance", "6"],
              ["Learning & Development", "Objectives, competencies, paths, certificates, goals, progress", "6"],
              ["Analytics & Reporting", "Global, learning, engagement, completion, student analytics hub", "7"],
              ["Community", "Study groups, workspaces, conferences, recordings, group assignments", "5"],
              ["Student Services", "Tutoring, mentoring, career, wellness, office hours, support", "7"],
              ["Administration", "Users, roles, permissions, terms, SIS, developer keys, audit, themes", "40+"],
              ["Account & Profile", "Profile, settings, ePortfolio, password, login history", "6"],
              ["Authentication", "5 login page variants, session management, logout", "6"],
            ],
            [2200, 5160, 2000]
          ),
          spacer(),
          heading("2.2 Out of Scope", HeadingLevel.HEADING_2),
          bullet("Canvas backend modifications (Ruby on Rails codebase)"),
          bullet("Mobile native applications (iOS/Android)"),
          bullet("LTI tool provider development"),
          bullet("Canvas Data 2 / data warehouse integration"),
          bullet("Multi-tenant SaaS deployment"),
          bullet("Custom GraphQL API layer"),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 3. USER PERSONAS =====
          heading("3. User Personas", HeadingLevel.HEADING_1),
          heading("3.1 Student (Primary User)", HeadingLevel.HEADING_2),
          boldPara("Description: ", "Undergraduate or graduate student enrolled in 3-6 courses per term. Accesses LMS daily for assignments, grades, discussions, and course content."),
          boldPara("Goals: ", "View upcoming deadlines, submit assignments, check grades, participate in discussions, access course materials, collaborate with peers."),
          boldPara("Pain Points: ", "Cluttered default Canvas UI, difficulty finding specific content, lack of visual appeal, slow page transitions."),
          boldPara("Test Account: ", "student1@redefiners.org / ReDefStudent2024!"),
          spacer(),
          heading("3.2 Teacher/Instructor", HeadingLevel.HEADING_2),
          boldPara("Description: ", "Faculty member managing 2-5 courses per term. Creates content, grades assignments, facilitates discussions, and monitors student progress."),
          boldPara("Goals: ", "Efficiently grade submissions, create engaging course content, monitor class analytics, communicate with students, manage rubrics and outcomes."),
          boldPara("Pain Points: ", "Complex grading workflows, limited analytics visibility, cumbersome content creation tools."),
          boldPara("Test Account: ", "garcia@redefiners.org / ReDefTeacher2024!"),
          spacer(),
          heading("3.3 Administrator", HeadingLevel.HEADING_2),
          boldPara("Description: ", "IT administrator or academic director managing institutional LMS deployment. Configures accounts, manages users, monitors system health."),
          boldPara("Goals: ", "User provisioning, role management, SIS integration, system monitoring, theme customization, audit compliance."),
          boldPara("Pain Points: ", "Limited admin dashboard, manual user management, poor audit trails, inflexible theming."),
          boldPara("Test Account: ", "admin@redefiners.org / ReDefiners2024!"),
          spacer(),
          heading("3.4 Observer (Parent/Guardian)", HeadingLevel.HEADING_2),
          boldPara("Description: ", "Parent or guardian linked to a student account. Views grades and course activity without participation rights."),
          boldPara("Goals: ", "Monitor academic progress, view upcoming deadlines, receive notifications about student activity."),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 4. FUNCTIONAL REQUIREMENTS =====
          heading("4. Functional Requirements", HeadingLevel.HEADING_1),
          heading("4.1 Authentication & Authorization", HeadingLevel.HEADING_2),
          makeTable(
            ["ID", "Requirement", "Priority", "Status"],
            [
              ["FR-001", "Login via Canvas session cookies (same-origin credentials)", "P0", "Done"],
              ["FR-002", "CSRF token extraction and injection on state-changing requests", "P0", "Done"],
              ["FR-003", "Role-based route protection (Student, Teacher, Admin)", "P0", "Done"],
              ["FR-004", "Automatic auth check on app initialization", "P1", "Done"],
              ["FR-005", "Proper logout with Canvas /logout endpoint call", "P0", "Done"],
              ["FR-006", "5 login page design variants with theme-aware styling", "P2", "Done"],
              ["FR-007", "Login variant selection persistence in localStorage", "P2", "Done"],
              ["FR-008", "Protected route redirect to login on session expiry", "P0", "Done"],
            ],
            [1200, 5160, 1000, 1000]
          ),
          spacer(),
          heading("4.2 Dashboard & Navigation", HeadingLevel.HEADING_2),
          makeTable(
            ["ID", "Requirement", "Priority", "Status"],
            [
              ["FR-009", "Personalized dashboard with course cards, to-do list, calendar preview", "P0", "Done"],
              ["FR-010", "Context-aware sidebar (global nav vs course-specific nav)", "P0", "Done"],
              ["FR-011", "Global search across courses, pages, and users", "P1", "Done"],
              ["FR-012", "Notification center with activity stream", "P1", "Done"],
              ["FR-013", "Favorite courses and recent pages tracking", "P1", "Done"],
              ["FR-014", "Mobile-responsive sidebar with drawer/bottom nav", "P1", "Done"],
              ["FR-015", "96-item navigation with 12 collapsible submenus", "P0", "Done"],
            ],
            [1200, 5160, 1000, 1000]
          ),
          spacer(),
          heading("4.3 Course Management", HeadingLevel.HEADING_2),
          makeTable(
            ["ID", "Requirement", "Priority", "Status"],
            [
              ["FR-016", "Course listing with card/list views and filtering", "P0", "Done"],
              ["FR-017", "Course detail page with tabs (Home, Modules, Grades, etc.)", "P0", "Done"],
              ["FR-018", "Course creation wizard with step-by-step flow", "P1", "Done"],
              ["FR-019", "Course settings management (name, dates, features)", "P1", "Done"],
              ["FR-020", "Course copy/import functionality", "P2", "Done"],
              ["FR-021", "Course pacing tool for self-paced courses", "P2", "Done"],
              ["FR-022", "Course analytics with enrollment and activity metrics", "P1", "Done"],
              ["FR-023", "Syllabus page with assignment schedule integration", "P1", "Done"],
              ["FR-024", "People/enrollment management within courses", "P1", "Done"],
              ["FR-025", "Section management for large courses", "P2", "Done"],
            ],
            [1200, 5160, 1000, 1000]
          ),
          spacer(),
          heading("4.4 Assignments & Grading", HeadingLevel.HEADING_2),
          makeTable(
            ["ID", "Requirement", "Priority", "Status"],
            [
              ["FR-026", "Assignment listing with due dates, points, status indicators", "P0", "Done"],
              ["FR-027", "Assignment detail view with description, rubric, submission area", "P0", "Done"],
              ["FR-028", "Assignment creation/edit form with rich text editor", "P0", "Done"],
              ["FR-029", "Assignment submission (text entry, file upload, URL)", "P0", "Done"],
              ["FR-030", "Peer review assignment and workflow", "P1", "Done"],
              ["FR-031", "Rubric creation, viewing, and assessment", "P1", "Done"],
              ["FR-032", "SpeedGrader for inline submission grading", "P0", "Done"],
              ["FR-033", "Gradebook with sortable columns and grade entry", "P0", "Done"],
              ["FR-034", "Gradebook history and audit trail", "P2", "Done"],
              ["FR-035", "Grade export and CSV upload", "P2", "Done"],
            ],
            [1200, 5160, 1000, 1000]
          ),
          new Paragraph({ children: [new PageBreak()] }),
          heading("4.5 Quizzes & Assessments", HeadingLevel.HEADING_2),
          makeTable(
            ["ID", "Requirement", "Priority", "Status"],
            [
              ["FR-036", "Quiz listing with type, availability, attempt info", "P0", "Done"],
              ["FR-037", "Quiz taking interface with question navigation", "P0", "Done"],
              ["FR-038", "Quiz results display with correct/incorrect feedback", "P0", "Done"],
              ["FR-039", "Quiz statistics for instructors (item analysis)", "P1", "Done"],
              ["FR-040", "Question bank management", "P2", "Done"],
              ["FR-041", "Quiz detail view with settings and preview", "P1", "Done"],
            ],
            [1200, 5160, 1000, 1000]
          ),
          spacer(),
          heading("4.6 Discussions & Communication", HeadingLevel.HEADING_2),
          makeTable(
            ["ID", "Requirement", "Priority", "Status"],
            [
              ["FR-042", "Discussion topic listing with reply counts", "P0", "Done"],
              ["FR-043", "Threaded discussion view with nested replies", "P0", "Done"],
              ["FR-044", "Discussion creation with rich text editor", "P0", "Done"],
              ["FR-045", "Private messaging inbox with conversation threads", "P0", "Done"],
              ["FR-046", "Real-time chat interface", "P2", "Done"],
              ["FR-047", "Announcement creation and editor", "P1", "Done"],
              ["FR-048", "Message templates for common communications", "P2", "Done"],
              ["FR-049", "Feedback collection forms", "P2", "Done"],
            ],
            [1200, 5160, 1000, 1000]
          ),
          spacer(),
          heading("4.7 Content Management", HeadingLevel.HEADING_2),
          makeTable(
            ["ID", "Requirement", "Priority", "Status"],
            [
              ["FR-050", "Course modules with sequential/prerequisite navigation", "P0", "Done"],
              ["FR-051", "Wiki pages with rich text editor and revision history", "P0", "Done"],
              ["FR-052", "File browser with folder hierarchy and upload", "P0", "Done"],
              ["FR-053", "Content library for shared resources", "P2", "Done"],
              ["FR-054", "Video studio for media management", "P2", "Done"],
              ["FR-055", "Interactive tools (H5P-style content)", "P2", "Done"],
              ["FR-056", "Content migration/import tools", "P2", "Done"],
              ["FR-057", "Commons for cross-institution content sharing", "P2", "Done"],
            ],
            [1200, 5160, 1000, 1000]
          ),
          spacer(),
          heading("4.8 Administration", HeadingLevel.HEADING_2),
          makeTable(
            ["ID", "Requirement", "Priority", "Status"],
            [
              ["FR-058", "Admin dashboard with system overview metrics", "P0", "Done"],
              ["FR-059", "User management (CRUD, roles, enrollment)", "P0", "Done"],
              ["FR-060", "Permission matrix configuration", "P0", "Done"],
              ["FR-061", "Academic term management", "P1", "Done"],
              ["FR-062", "SIS import with CSV/XML support", "P1", "Done"],
              ["FR-063", "Developer key management for API access", "P1", "Done"],
              ["FR-064", "Sub-account hierarchy management", "P1", "Done"],
              ["FR-065", "Audit log viewer with filtering", "P1", "Done"],
              ["FR-066", "Theme editor and brand configuration", "P1", "Done"],
              ["FR-067", "Feature flag management", "P2", "Done"],
              ["FR-068", "System health monitoring dashboard", "P2", "Done"],
              ["FR-069", "Data privacy and backup management", "P2", "Done"],
              ["FR-070", "Authentication provider configuration", "P2", "Done"],
              ["FR-071", "Rate limiting configuration", "P2", "Done"],
              ["FR-072", "Blueprint course management", "P2", "Done"],
            ],
            [1200, 5160, 1000, 1000]
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 5. NON-FUNCTIONAL REQUIREMENTS =====
          heading("5. Non-Functional Requirements", HeadingLevel.HEADING_1),
          heading("5.1 Performance", HeadingLevel.HEADING_2),
          makeTable(
            ["ID", "Requirement", "Target", "Measured"],
            [
              ["NFR-001", "Time to First Byte (TTFB)", "< 300ms", "176ms"],
              ["NFR-002", "First Contentful Paint (FCP)", "< 1500ms", "567ms"],
              ["NFR-003", "Cumulative Layout Shift (CLS)", "< 0.1", "0.000"],
              ["NFR-004", "Full page load time", "< 3000ms", "1687ms"],
              ["NFR-005", "Vendor bundle size (gzipped)", "< 100KB", "64.94KB"],
              ["NFR-006", "Route-level code splitting", "All routes lazy", "Done"],
              ["NFR-007", "Lighthouse Performance score", "> 90", "92"],
            ],
            [1200, 4360, 1800, 2000]
          ),
          spacer(),
          heading("5.2 Security", HeadingLevel.HEADING_2),
          makeTable(
            ["ID", "Requirement", "Priority", "Status"],
            [
              ["NFR-008", "XSS prevention via DOMPurify on all user-generated content", "P0", "Done"],
              ["NFR-009", "CSRF token injection on all state-changing API requests", "P0", "Done"],
              ["NFR-010", "Content Security Policy headers via Nginx", "P0", "Done"],
              ["NFR-011", "HTTPS-only with HSTS preload", "P0", "Done"],
              ["NFR-012", "X-Frame-Options: SAMEORIGIN to prevent clickjacking", "P0", "Done"],
              ["NFR-013", "X-Content-Type-Options: nosniff", "P0", "Done"],
              ["NFR-014", "Rate limiting on API proxy", "P1", "Done"],
              ["NFR-015", "Role-based access control on admin routes", "P0", "Done"],
              ["NFR-016", "Secure cookie handling (HttpOnly, Secure, SameSite)", "P0", "Done"],
            ],
            [1200, 5160, 1000, 1000]
          ),
          spacer(),
          heading("5.3 Accessibility", HeadingLevel.HEADING_2),
          bullet("WCAG 2.1 AA compliance target for all interactive components"),
          bullet("Keyboard navigation support across all pages"),
          bullet("Screen reader compatibility with ARIA labels"),
          bullet("Minimum 4.5:1 contrast ratio for normal text"),
          bullet("Focus indicators on all interactive elements"),
          bullet("Skip navigation links for screen reader users"),
          spacer(),
          heading("5.4 Browser Compatibility", HeadingLevel.HEADING_2),
          makeTable(
            ["Browser", "Minimum Version", "Support Level"],
            [
              ["Chrome / Edge", "100+", "Full"],
              ["Firefox", "100+", "Full"],
              ["Safari", "15+", "Full"],
              ["Mobile Chrome", "Latest", "Full"],
              ["Mobile Safari", "Latest", "Full"],
              ["Internet Explorer", "N/A", "Not Supported"],
            ],
            [3120, 3120, 3120]
          ),
          spacer(),
          heading("5.5 Scalability", HeadingLevel.HEADING_2),
          bullet("Support 500+ concurrent users per VPS instance"),
          bullet("PostgreSQL connection pooling (25 connections)"),
          bullet("Redis caching for session and API response data"),
          bullet("Nginx static asset serving with 7-day cache headers"),
          bullet("Docker containerization for horizontal scaling"),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 6. USER STORIES =====
          heading("6. User Stories by Persona", HeadingLevel.HEADING_1),
          heading("6.1 Student Stories", HeadingLevel.HEADING_2),
          makeTable(
            ["ID", "Story", "Acceptance Criteria"],
            [
              ["US-001", "As a student, I want to see my dashboard with upcoming deadlines so I can prioritize my work", "Dashboard shows course cards, to-do list sorted by due date, and calendar preview"],
              ["US-002", "As a student, I want to submit assignments with file uploads so my work is recorded", "File upload accepts common formats, shows upload progress, confirms submission"],
              ["US-003", "As a student, I want to check my grades across all courses in one view", "Grades page shows all enrolled courses with current grade, points, and letter grade"],
              ["US-004", "As a student, I want to participate in discussions to engage with course material", "Can create new threads, reply to existing, with rich text formatting"],
              ["US-005", "As a student, I want to take quizzes online and see my results immediately", "Quiz interface shows questions, tracks time, auto-submits, shows score on completion"],
              ["US-006", "As a student, I want to message my instructor privately for help", "Inbox shows conversations, can compose new message, attach files"],
              ["US-007", "As a student, I want a dark mode option to reduce eye strain during evening study", "Theme toggle persists across sessions, applies to all pages consistently"],
            ],
            [1000, 4360, 4000]
          ),
          spacer(),
          heading("6.2 Teacher Stories", HeadingLevel.HEADING_2),
          makeTable(
            ["ID", "Story", "Acceptance Criteria"],
            [
              ["US-008", "As a teacher, I want to grade assignments efficiently using SpeedGrader", "Sequential student navigation, inline rubric, comment box, grade entry"],
              ["US-009", "As a teacher, I want to create assignments with rubrics to set clear expectations", "Assignment form with due date, points, submission type, attached rubric"],
              ["US-010", "As a teacher, I want to view class analytics to identify struggling students", "Analytics shows engagement, submission rates, grade distribution per student"],
              ["US-011", "As a teacher, I want to manage course modules to organize content sequentially", "Drag-and-drop module ordering, prerequisite settings, completion tracking"],
              ["US-012", "As a teacher, I want to create announcements to communicate with the class", "Rich text editor, scheduling, send notification option"],
              ["US-013", "As a teacher, I want to create quizzes with various question types", "Multiple choice, true/false, essay, matching, fill-in-the-blank question types"],
              ["US-014", "As a teacher, I want to view the Gradebook to see all student grades at a glance", "Sortable grid with assignment columns, student rows, color-coded grades"],
            ],
            [1000, 4360, 4000]
          ),
          spacer(),
          heading("6.3 Administrator Stories", HeadingLevel.HEADING_2),
          makeTable(
            ["ID", "Story", "Acceptance Criteria"],
            [
              ["US-015", "As an admin, I want to manage user accounts to control access", "CRUD users, assign roles, manage enrollments, view login history"],
              ["US-016", "As an admin, I want to configure permissions to enforce security policies", "Permission matrix by role, granular feature toggles"],
              ["US-017", "As an admin, I want to import SIS data to bulk-provision accounts", "CSV upload, mapping preview, import status tracking, error reporting"],
              ["US-018", "As an admin, I want to manage academic terms and enrollment periods", "Term CRUD with start/end dates, default term selection"],
              ["US-019", "As an admin, I want to customize the LMS theme to match institutional branding", "Theme editor with live preview, color picker, logo upload"],
              ["US-020", "As an admin, I want to view audit logs to track system changes", "Filterable log with user, action, resource, timestamp columns"],
              ["US-021", "As an admin, I want to manage developer keys for API integrations", "Key CRUD, scope configuration, usage statistics"],
            ],
            [1000, 4360, 4000]
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 7. THEME SYSTEM =====
          heading("7. Theme System Requirements", HeadingLevel.HEADING_1),
          heading("7.1 Built-in Themes", HeadingLevel.HEADING_2),
          makeTable(
            ["Theme", "Sidebar Color", "Accent Color", "Background", "Mode Support"],
            [
              ["Modern Dark Accent (Default)", "#163B32 gradient", "#2DB88A mint", "#D4EFE6 light mint", "Light + Dark"],
              ["Teal Classic", "#1A6B6B teal", "#2DB88A mint", "#E8F5F0 light teal", "Light + Dark"],
              ["Ocean Blue", "#1E3A5F navy", "#3B82F6 blue", "#E8F0FE light blue", "Light + Dark"],
            ],
            [2200, 1800, 1800, 1760, 1800]
          ),
          spacer(),
          heading("7.2 Login Page Variants", HeadingLevel.HEADING_2),
          makeTable(
            ["Variant", "Design Style", "Description"],
            [
              ["LV-01: Classic", "Traditional form", "Standard centered login card with gradient background"],
              ["LV-02: Aurora (Default)", "Glassmorphism", "Frosted glass card with animated aurora background"],
              ["LV-03: Glassmorphism", "Transparent layers", "Multi-layer glass panels with blur effects"],
              ["LV-04: Minimal", "Clean whitespace", "Ultra-minimal form with typography focus"],
              ["LV-05: Landscape", "Split screen", "Photo background with overlaid login panel"],
            ],
            [2200, 2560, 4600]
          ),
          spacer(),
          heading("7.3 Theme Architecture", HeadingLevel.HEADING_2),
          bullet("CSS custom properties (variables) for runtime switching without page reload"),
          bullet("ThemeContext React context provider for app-wide theme state"),
          bullet("localStorage persistence of theme selection and dark mode preference"),
          bullet("Theme registry pattern supporting dynamic theme registration"),
          bullet("12 CSS variable categories: sidebar, topbar, card, surface, accent, text colors"),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 8. DATA REQUIREMENTS =====
          heading("8. Data Requirements", HeadingLevel.HEADING_1),
          heading("8.1 Demo Data (Seeded)", HeadingLevel.HEADING_2),
          makeTable(
            ["Entity", "Count", "Description"],
            [
              ["Users", "34", "1 admin + 5 teachers + 24 students + 4 TAs"],
              ["Courses", "11", "Spanish 101, Biology 201, English 101, Env Science, World History, Math, CS, Psychology, Art History, Music, Digital Media"],
              ["Assignments", "86", "Essays, quizzes, labs, projects, presentations across all courses"],
              ["Submissions", "1,014", "Graded submissions with realistic scores (55-100%)"],
              ["Discussions", "14", "Course-specific discussion threads with student replies"],
              ["Announcements", "12", "Course and institution-wide announcements"],
              ["Modules", "12+", "Sequential course content organization"],
              ["Calendar Events", "12+", "Academic calendar, office hours, exam schedules"],
              ["Wiki Pages", "50", "Course content pages with formatted text"],
              ["Quizzes", "30", "Multiple choice, essay, and mixed format quizzes"],
              ["Rubrics", "20", "Grading rubrics attached to assignments"],
              ["Groups", "26", "Student groups for collaborative assignments"],
              ["ePortfolios", "6", "Student portfolio collections"],
            ],
            [2000, 1200, 6160]
          ),
          spacer(),
          heading("8.2 Academic Term", HeadingLevel.HEADING_2),
          boldPara("Active Term: ", "Spring 2026 (January 15 - May 15, 2026)"),
          boldPara("Enrollment Status: ", "Active enrollments across all courses"),
          boldPara("Grade State: ", "Mix of graded, submitted, and pending assignments"),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 9. API INTEGRATION =====
          heading("9. API Integration Matrix", HeadingLevel.HEADING_1),
          para("The React SPA integrates with the Canvas REST API through 24 typed TypeScript service modules. All API calls use same-origin session cookies with CSRF token injection."),
          spacer(),
          makeTable(
            ["API Module", "Endpoints", "Methods", "Key Operations"],
            [
              ["Users", "6", "GET, PUT", "Profile, settings, todo, activity stream, colors"],
              ["Courses", "6", "GET", "List, detail, tabs, settings, users, sections"],
              ["Assignments", "9", "GET, POST, PUT", "CRUD, submissions, rubrics, peer reviews"],
              ["Modules", "4", "GET, PUT", "List, items, mark done, sequencing"],
              ["Calendar", "2", "GET", "Events, assignment dates"],
              ["Conversations", "4", "GET, POST, PUT", "List, detail, create, add message"],
              ["Discussions", "5", "GET, POST", "Topics, threads, entries, replies"],
              ["Grades", "2", "GET", "Enrollments, assignment group grades"],
              ["Quizzes", "5", "GET", "List, detail, submissions, statistics, banks"],
              ["Pages", "5", "GET, POST, PUT", "Wiki pages, front page, revisions"],
              ["Files", "4", "GET", "Folders, files, quota"],
              ["Groups", "3", "GET", "List, detail, members"],
              ["Outcomes", "4", "GET", "Groups, outcomes, results, rollups"],
              ["Rubrics", "3", "GET, POST", "List, detail, create"],
              ["People", "2", "GET", "List, profile"],
              ["Planner", "2", "GET", "Items, overrides"],
              ["Search", "2", "GET", "Recipients, courses"],
              ["Admin", "12", "GET", "Accounts, users, reports, terms, SIS, audit"],
              ["Notifications", "3", "GET", "Activity, channels, preferences"],
              ["Announcements", "2", "GET, POST", "List, create"],
              ["Conferences", "2", "GET", "List, detail"],
              ["Collaborations", "2", "GET", "List, members"],
              ["Content Migrations", "3", "GET, POST", "List, detail, create"],
              ["ePortfolio", "3", "GET", "List, detail, pages"],
            ],
            [2000, 1400, 2560, 3400]
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 10. DEPLOYMENT =====
          heading("10. Deployment & Infrastructure", HeadingLevel.HEADING_1),
          heading("10.1 Server Requirements", HeadingLevel.HEADING_2),
          makeTable(
            ["Component", "Specification"],
            [
              ["Server", "Hostinger VPS (148.230.111.247)"],
              ["OS", "Ubuntu 22.04 LTS"],
              ["CPU", "4 vCPU"],
              ["RAM", "8 GB minimum"],
              ["Storage", "80 GB SSD"],
              ["Domain", "fineract.us"],
              ["SSL", "Let's Encrypt (auto-renewal via Certbot)"],
            ],
            [3000, 6360]
          ),
          spacer(),
          heading("10.2 Docker Services", HeadingLevel.HEADING_2),
          makeTable(
            ["Service", "Image", "Memory", "Health Check"],
            [
              ["web", "Canvas LMS (Passenger/Nginx)", "3 GB", "/health_check every 30s"],
              ["jobs", "Canvas LMS (Delayed Job)", "2 GB", "Process running"],
              ["postgres", "PostgreSQL 14", "1 GB", "pg_isready every 10s"],
              ["redis", "Redis 7 Alpine", "512 MB", "redis-cli ping every 10s"],
              ["nginx", "Nginx Alpine", "256 MB", "Port 80/443 response"],
              ["certbot", "Certbot", "128 MB", "12-hour renewal cycle"],
            ],
            [1800, 3360, 1800, 2400]
          ),
          spacer(),
          heading("10.3 CI/CD Pipeline", HeadingLevel.HEADING_2),
          numberedItem("Developer pushes to feature/react-frontend or main branch"),
          numberedItem("GitHub Actions triggers: checkout, install, type-check, lint, test"),
          numberedItem("Vite builds production bundle with code splitting"),
          numberedItem("dist/ artifact uploaded to GitHub Actions"),
          numberedItem("SSH deployment to VPS: clear old build, upload new build"),
          numberedItem("Nginx reload to serve updated SPA"),
          numberedItem("Automated health check verification (curl + HTTP status)"),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 11. SUCCESS METRICS =====
          heading("11. Success Metrics & KPIs", HeadingLevel.HEADING_1),
          makeTable(
            ["Metric", "Target", "Measurement Method"],
            [
              ["Page Coverage", "161/243 pages (66%)", "Route count in React Router config"],
              ["Core Web Vitals", "All GOOD ratings", "Chrome DevTools Protocol audit"],
              ["Bundle Size", "< 100KB vendor chunk", "Vite build output analysis"],
              ["Test Coverage", "320 screenshots verified", "Puppeteer automated capture"],
              ["Theme Variants", "3 themes + 5 login designs", "Visual verification"],
              ["API Integration", "24 service modules", "TypeScript compilation"],
              ["Security Headers", "A+ rating target", "Mozilla Observatory scan"],
              ["User Satisfaction", "> 4.0/5.0 average", "User feedback surveys"],
              ["Uptime", "99.5% availability", "Health check monitoring"],
            ],
            [2400, 3360, 3600]
          ),
          spacer(),

          // ===== 12. RISKS =====
          heading("12. Risks & Mitigations", HeadingLevel.HEADING_1),
          makeTable(
            ["Risk", "Impact", "Likelihood", "Mitigation"],
            [
              ["Canvas API breaking changes", "High", "Medium", "Pin Canvas version, monitor release notes, integration tests"],
              ["Session cookie expiry during use", "Medium", "Medium", "Auto-detect 401 responses, redirect to login gracefully"],
              ["Large file upload failures", "Medium", "Low", "Chunked upload with progress indicators, retry logic"],
              ["Theme CSS conflicts", "Low", "Medium", "Scoped CSS variables, thorough cross-theme testing"],
              ["VPS resource exhaustion", "High", "Low", "Docker memory limits, Redis eviction policy, monitoring alerts"],
              ["XSS via user-generated content", "High", "Low", "DOMPurify sanitization on all HTML rendering"],
            ],
            [2400, 1200, 1560, 4200]
          ),
          spacer(),

          // ===== 13. APPENDIX =====
          heading("13. Appendix", HeadingLevel.HEADING_1),
          heading("13.1 Technology Stack Summary", HeadingLevel.HEADING_2),
          makeTable(
            ["Layer", "Technology", "Version"],
            [
              ["Frontend Framework", "React", "19.2.4"],
              ["Language", "TypeScript", "5.9.3"],
              ["Build Tool", "Vite", "8.0.1"],
              ["CSS Framework", "Tailwind CSS", "4.2.2"],
              ["Component Library", "shadcn/ui", "4.1.0"],
              ["Routing", "React Router", "7.13.2"],
              ["Data Fetching", "TanStack Query", "5.95.2"],
              ["Rich Text Editor", "TinyMCE", "8.3.2"],
              ["Sanitization", "DOMPurify", "3.3.3"],
              ["Icons", "Lucide React", "1.7.0"],
              ["Toasts", "Sonner", "2.0.7"],
              ["Testing", "Vitest + Testing Library", "4.1.1"],
              ["Backend", "Canvas LMS (Ruby on Rails)", "8.0"],
              ["Database", "PostgreSQL", "14"],
              ["Cache", "Redis", "7"],
              ["Proxy", "Nginx", "Alpine"],
              ["Containers", "Docker Compose", "v2"],
              ["CI/CD", "GitHub Actions", "Latest"],
            ],
            [3120, 3120, 3120]
          ),
          spacer(),
          heading("13.2 Document Revision History", HeadingLevel.HEADING_2),
          makeTable(
            ["Version", "Date", "Author", "Changes"],
            [
              ["1.0", "March 27, 2026", "ReDefiners Dev Team", "Initial PRD release with full feature coverage"],
            ],
            [1200, 2000, 2560, 3600]
          ),
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync("docs/PRODUCT_REQUIREMENTS_DOCUMENT.docx", buffer);
  console.log("PRD created: docs/PRODUCT_REQUIREMENTS_DOCUMENT.docx (" + buffer.length + " bytes)");
}

createPRD().catch(e => { console.error(e); process.exit(1); });
