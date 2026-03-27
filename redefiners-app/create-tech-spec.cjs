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
function codePara(text) {
  return new Paragraph({
    spacing: { after: 40 },
    shading: { fill: "F5F5F5", type: ShadingType.CLEAR },
    indent: { left: 360 },
    children: [new TextRun({ text, size: 18, font: "Consolas" })]
  });
}
function spacer() {
  return new Paragraph({ spacing: { after: 200 }, children: [] });
}
function tableRow(cells, isHeader = false, colWidths = null) {
  return new TableRow({
    tableHeader: isHeader,
    children: cells.map((c, i) => new TableCell({
      borders,
      margins: cellMargins,
      width: colWidths ? { size: colWidths[i], type: WidthType.DXA } : undefined,
      shading: isHeader ? { fill: DARK, type: ShadingType.CLEAR } : undefined,
      children: [new Paragraph({
        children: [new TextRun({
          text: typeof c === "string" ? c : c.text,
          bold: isHeader,
          size: 20,
          color: isHeader ? WHITE : "333333",
          font: "Arial"
        })]
      })]
    }))
  });
}
function makeTable(headers, rows, colWidths) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      tableRow(headers, true, colWidths),
      ...rows.map(r => tableRow(r, false, colWidths))
    ]
  });
}

async function createTechSpec() {
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
            new TextRun({ text: "TECHNICAL SPECIFICATION", size: 48, bold: true, color: DARK, font: "Arial" })
          ]}),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
            new TextRun({ text: "ReDefiners Canvas LMS Custom Frontend", size: 36, color: TEAL, font: "Arial" })
          ]}),
          spacer(),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [
            new TextRun({ text: "Version 1.0  |  March 27, 2026", size: 24, color: "666666" })
          ]}),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [
            new TextRun({ text: "Classification: Internal / Engineering", size: 24, color: "666666" })
          ]}),
          spacer(), spacer(), spacer(),
          makeTable(
            ["Field", "Value"],
            [
              ["Document Type", "Technical Specification"],
              ["System", "ReDefiners LMS Frontend (React SPA)"],
              ["Backend", "Canvas LMS (Rails 8 + Ruby 3.4)"],
              ["Deployment", "Docker Compose on Hostinger VPS"],
              ["Domain", "https://fineract.us"],
              ["Repository", "github.com/stephencoduor/canvas-lms"],
              ["Branch", "master (feature/react-frontend merged)"],
            ],
            [3500, 5860]
          ),
          new Paragraph({ children: [new PageBreak()] }),
        ]
      },
      // ===== MAIN CONTENT =====
      {
        properties: {
          page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
        },
        headers: {
          default: new Header({ children: [
            new Paragraph({
              border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: ACCENT, space: 4 } },
              children: [
                new TextRun({ text: "ReDefiners LMS Technical Specification", size: 18, color: "999999", italics: true }),
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

          // ===== 1. SYSTEM ARCHITECTURE =====
          heading("1. System Architecture Overview", HeadingLevel.HEADING_1),
          para("The ReDefiners LMS is a decoupled frontend architecture where a React Single-Page Application (SPA) communicates with the Canvas LMS backend exclusively through its REST API. The system is deployed as a multi-container Docker Compose stack with Nginx as the reverse proxy and SSL terminator."),
          spacer(),
          heading("1.1 Architecture Pattern", HeadingLevel.HEADING_2),
          boldPara("Pattern: ", "Decoupled SPA + API Backend (BFF-lite via Nginx)"),
          boldPara("Frontend: ", "React 19 SPA served as static assets by Nginx"),
          boldPara("Backend: ", "Canvas LMS Rails 8 application (Passenger/Nginx)"),
          boldPara("Communication: ", "REST API over HTTPS with session cookie authentication"),
          boldPara("Proxy: ", "Nginx reverse proxy handles routing: / -> SPA, /api/* -> Canvas"),
          spacer(),
          heading("1.2 Component Diagram", HeadingLevel.HEADING_2),
          codePara("Browser (React SPA)"),
          codePara("    |-- HTTPS --> Nginx (SSL Termination + Routing)"),
          codePara("    |                |-- /app/* --> Static SPA files (dist/)"),
          codePara("    |                |-- /api/* --> Canvas Web (port 3000)"),
          codePara("    |                |-- /login, /logout --> Canvas Auth"),
          codePara("    |                |-- /files/* --> Canvas File Proxy"),
          codePara("    |"),
          codePara("Canvas Web (Passenger + Rails 8)"),
          codePara("    |-- PostgreSQL 14 (Primary Database)"),
          codePara("    |-- Redis 7 (Cache + Sessions + ActionCable)"),
          codePara("    |-- Canvas Jobs (Delayed Job Workers x2)"),
          codePara("    |-- Certbot (SSL Auto-Renewal)"),
          spacer(),
          heading("1.3 Network Topology", HeadingLevel.HEADING_2),
          makeTable(
            ["Port", "Service", "Access", "Purpose"],
            [
              ["443", "Nginx", "Public", "HTTPS entry point, SSL termination"],
              ["80", "Nginx", "Public", "HTTP -> HTTPS redirect"],
              ["3000", "Canvas Web", "Internal", "Rails application server"],
              ["5432", "PostgreSQL", "Internal", "Primary database"],
              ["6379", "Redis", "Internal", "Cache, sessions, ActionCable"],
              ["22", "SSH", "Restricted", "Server administration"],
            ],
            [1200, 2200, 2000, 3960]
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 2. FRONTEND ARCHITECTURE =====
          heading("2. Frontend Architecture", HeadingLevel.HEADING_1),
          heading("2.1 Technology Stack", HeadingLevel.HEADING_2),
          makeTable(
            ["Category", "Technology", "Version", "Purpose"],
            [
              ["Framework", "React", "19.2.4", "UI component framework with concurrent features"],
              ["Language", "TypeScript", "5.9.3", "Static typing, interfaces, strict mode"],
              ["Build Tool", "Vite", "8.0.1", "Dev server, HMR, production bundling"],
              ["CSS", "Tailwind CSS", "4.2.2", "Utility-first styling with JIT compilation"],
              ["Components", "shadcn/ui", "4.1.0", "Accessible, customizable component primitives"],
              ["Routing", "React Router", "7.13.2", "Client-side routing with lazy loading"],
              ["Data Fetching", "TanStack Query", "5.95.2", "Server state, caching, background refetch"],
              ["Editor", "TinyMCE", "8.3.2", "Rich text editing for content creation"],
              ["Sanitization", "DOMPurify", "3.3.3", "XSS prevention on HTML rendering"],
              ["Icons", "Lucide React", "1.7.0", "Tree-shakeable SVG icon library"],
              ["Toasts", "Sonner", "2.0.7", "Notification toast system"],
              ["Variants", "CVA", "0.7.1", "Class variance authority for component variants"],
              ["Testing", "Vitest", "4.1.1", "Unit/integration testing with jsdom"],
              ["Testing UI", "Testing Library", "16.3.2", "DOM testing utilities for React"],
            ],
            [1600, 2200, 1200, 4360]
          ),
          spacer(),
          heading("2.2 Directory Structure", HeadingLevel.HEADING_2),
          codePara("redefiners-app/"),
          codePara("  src/"),
          codePara("    components/"),
          codePara("      ui/              # 13 shadcn/ui components (button, card, dialog...)"),
          codePara("      layout/           # AppLayout, Sidebar, TopBar, MobileSidebar, BottomNav"),
          codePara("      common/           # EmptyState, ErrorBoundary, LoadingSkeleton, StatusPill"),
          codePara("      shared/           # CourseCard, AssignmentRow, RichTextEditor, ThemePreview"),
          codePara("    contexts/"),
          codePara("      AuthContext.tsx    # Authentication state, login/logout, role detection"),
          codePara("      ThemeContext.tsx   # Theme switching, dark mode, localStorage persistence"),
          codePara("    hooks/              # 26 TanStack Query hooks for Canvas API"),
          codePara("    lib/"),
          codePara("      navigation.ts     # 96-item sidebar nav structure with 12 submenus"),
          codePara("      theme-registry.ts # Theme definitions and CSS variable mappings"),
          codePara("      utils.ts          # cn() helper, formatters"),
          codePara("    pages/              # 161 page components across 31 subdirectories"),
          codePara("      admin/            # 45 admin pages"),
          codePara("      courses/          # 18 course management pages"),
          codePara("      assignments/      # 5 assignment pages"),
          codePara("      quizzes/          # 6 quiz pages"),
          codePara("      discussions/      # 3 discussion pages"),
          codePara("      gradebook/        # 4 gradebook pages"),
          codePara("      analytics/        # 7 analytics pages"),
          codePara("      services/         # 15 service/communication pages"),
          codePara("      login-variants/   # 5 login design variants"),
          codePara("      ...               # 12 more feature directories"),
          codePara("    routes/"),
          codePara("      index.tsx         # 156 route definitions (1141 lines)"),
          codePara("      ProtectedRoute.tsx # Auth guard with redirect"),
          codePara("      AdminRoute.tsx    # Role-based admin guard"),
          codePara("    services/"),
          codePara("      api-client.ts     # HTTP client with CSRF, pagination, error handling"),
          codePara("      modules/          # 24 API service modules"),
          codePara("    styles/"),
          codePara("      themes.css        # CSS custom properties for 3 themes"),
          codePara("      index.css         # Global styles, Tailwind directives"),
          new Paragraph({ children: [new PageBreak()] }),

          heading("2.3 Routing Architecture", HeadingLevel.HEADING_2),
          para("All 156 routes use React Router v7 with lazy() for code splitting. Routes are organized into three protection levels:"),
          spacer(),
          makeTable(
            ["Route Type", "Wrapper", "Behavior", "Count"],
            [
              ["Public", "PublicRoute", "Accessible without auth; redirects authenticated users to /dashboard", "5"],
              ["Protected", "ProtectedRoute + AppLayout", "Requires authentication; shows sidebar + topbar layout", "145"],
              ["Admin", "AdminRoute", "Requires admin role; returns 403 for non-admins", "40+"],
            ],
            [1600, 2400, 3960, 1400]
          ),
          spacer(),
          heading("2.4 Code Splitting Strategy", HeadingLevel.HEADING_3),
          para("Vite build produces optimized vendor chunks to maximize caching:"),
          makeTable(
            ["Chunk", "Contents", "Size (gzip)", "Cache Strategy"],
            [
              ["vendor-react", "React, ReactDOM, scheduler", "~45 KB", "Long-term (version pinned)"],
              ["vendor-router", "React Router DOM", "~12 KB", "Long-term (version pinned)"],
              ["vendor-query", "TanStack Query + DevTools", "~8 KB", "Long-term (version pinned)"],
              ["vendor-sanitize", "DOMPurify", "~5 KB", "Long-term (version pinned)"],
              ["app (main)", "App shell, contexts, layout", "~15 KB", "Content-hashed"],
              ["page-[name]", "Individual page components", "~2-8 KB each", "Content-hashed, lazy loaded"],
            ],
            [2000, 3000, 1800, 2560]
          ),
          spacer(),
          para("Total initial bundle: ~85 KB gzipped. Individual pages loaded on-demand."),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 3. AUTHENTICATION SYSTEM =====
          heading("3. Authentication & Authorization", HeadingLevel.HEADING_1),
          heading("3.1 Authentication Flow", HeadingLevel.HEADING_2),
          para("The SPA uses Canvas native session cookie authentication. No custom auth server or JWT tokens are involved."),
          spacer(),
          boldPara("Login Flow:", ""),
          codePara("1. User visits /login -> LoginPage renders selected variant"),
          codePara("2. User submits credentials -> POST /login/canvas (form-encoded)"),
          codePara("3. Canvas validates and sets session cookie (HttpOnly, Secure)"),
          codePara("4. SPA calls GET /api/v1/users/self/profile to confirm auth"),
          codePara("5. AuthContext stores user object, computes role"),
          codePara("6. React Router redirects to /dashboard"),
          spacer(),
          boldPara("Logout Flow:", ""),
          codePara("1. User clicks Logout in UserMenu"),
          codePara("2. SPA calls DELETE /logout with CSRF token"),
          codePara("3. Canvas invalidates session cookie"),
          codePara("4. AuthContext clears user state"),
          codePara("5. React Router redirects to /login"),
          spacer(),
          heading("3.2 Role Detection Algorithm", HeadingLevel.HEADING_2),
          codePara("function computeRole(user: CanvasUser): Role {"),
          codePara("  // 1. Check admin permissions"),
          codePara("  if (user.permissions?.can_manage_account || user.permissions?.become_user)"),
          codePara("    return 'admin';"),
          codePara("  // 2. Check teacher enrollments"),
          codePara("  if (user.enrollments?.some(e => e.type === 'TeacherEnrollment'))"),
          codePara("    return 'teacher';"),
          codePara("  // 3. Default to student"),
          codePara("  return 'student';"),
          codePara("}"),
          spacer(),
          heading("3.3 CSRF Protection", HeadingLevel.HEADING_2),
          para("Canvas uses a CSRF token embedded in the session. The API client extracts this token and includes it in all non-GET requests:"),
          codePara("// Extraction from cookie"),
          codePara("const csrfToken = document.cookie"),
          codePara("  .split('; ')"),
          codePara("  .find(c => c.startsWith('_csrf_token='))"),
          codePara("  ?.split('=')[1];"),
          codePara(""),
          codePara("// Injection in requests"),
          codePara("headers['X-CSRF-Token'] = decodeURIComponent(csrfToken);"),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 4. API CLIENT =====
          heading("4. API Client Architecture", HeadingLevel.HEADING_1),
          heading("4.1 Core HTTP Client", HeadingLevel.HEADING_2),
          para("The API client (src/services/api-client.ts) provides typed HTTP methods with automatic error handling, pagination, and CSRF injection."),
          spacer(),
          makeTable(
            ["Method", "Signature", "Use Case"],
            [
              ["apiGet", "apiGet<T>(path, params?) -> Promise<T>", "Read operations, list/detail endpoints"],
              ["apiPost", "apiPost<T>(path, body?) -> Promise<T>", "Create operations, form submissions"],
              ["apiPut", "apiPut<T>(path, body?) -> Promise<T>", "Update operations"],
              ["apiDelete", "apiDelete<T>(path) -> Promise<T>", "Delete operations"],
              ["apiPatch", "apiPatch<T>(path, body?) -> Promise<T>", "Partial update operations"],
            ],
            [1600, 4160, 3600]
          ),
          spacer(),
          heading("4.2 Service Module Pattern", HeadingLevel.HEADING_2),
          para("Each API domain is encapsulated in a typed service module under src/services/modules/. All modules follow a consistent pattern:"),
          codePara("// Example: src/services/modules/assignments.ts"),
          codePara("import { apiGet, apiPost, apiPut } from '../api-client';"),
          codePara("import type { Assignment, Submission } from '../types';"),
          codePara(""),
          codePara("export const AssignmentsAPI = {"),
          codePara("  list: (courseId: string) =>"),
          codePara("    apiGet<Assignment[]>(`/courses/${courseId}/assignments`),"),
          codePara("  get: (courseId: string, id: string) =>"),
          codePara("    apiGet<Assignment>(`/courses/${courseId}/assignments/${id}`),"),
          codePara("  submit: (courseId: string, id: string, body: SubmitPayload) =>"),
          codePara("    apiPost<Submission>(`/courses/${courseId}/assignments/${id}/submissions`, body),"),
          codePara("};"),
          spacer(),
          heading("4.3 Service Module Inventory", HeadingLevel.HEADING_2),
          makeTable(
            ["Module", "File", "Endpoints", "Key Types"],
            [
              ["Users", "users.ts", "6", "CanvasUser, UserProfile, TodoItem"],
              ["Courses", "courses.ts", "6", "Course, CourseTab, Section"],
              ["Assignments", "assignments.ts", "9", "Assignment, Submission, AssignmentGroup"],
              ["Modules", "modules.ts", "4", "Module, ModuleItem, ModuleSequence"],
              ["Calendar", "calendar.ts", "2", "CalendarEvent"],
              ["Conversations", "conversations.ts", "4", "Conversation, Message"],
              ["Discussions", "discussions.ts", "5", "Discussion, DiscussionEntry"],
              ["Grades", "grades.ts", "2", "Enrollment, GradeInfo"],
              ["Quizzes", "quizzes.ts", "5", "Quiz, QuizSubmission, QuestionBank"],
              ["Pages", "pages.ts", "5", "WikiPage, PageRevision"],
              ["Files", "files.ts", "4", "File, Folder, FileQuota"],
              ["Groups", "groups.ts", "3", "Group, GroupMember"],
              ["Outcomes", "outcomes.ts", "4", "OutcomeGroup, OutcomeResult"],
              ["Rubrics", "rubrics.ts", "3", "Rubric, RubricAssessment"],
              ["People", "people.ts", "2", "Person, Enrollment"],
              ["Planner", "planner.ts", "2", "PlannerItem, PlannerOverride"],
              ["Search", "search.ts", "2", "SearchResult, Recipient"],
              ["Admin", "admin.ts", "12", "Account, Report, Term, DeveloperKey"],
              ["Notifications", "notifications.ts", "3", "ActivityItem, Channel"],
              ["Announcements", "announcements.ts", "2", "Announcement"],
              ["Conferences", "conferences.ts", "2", "Conference"],
              ["Collaborations", "collaborations.ts", "2", "Collaboration"],
              ["Content Migrations", "contentMigrations.ts", "3", "Migration, Migrator"],
              ["ePortfolio", "eportfolio.ts", "3", "Portfolio, PortfolioPage"],
            ],
            [2000, 2400, 1200, 3760]
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 5. COMPONENT ARCHITECTURE =====
          heading("5. Component Architecture", HeadingLevel.HEADING_1),
          heading("5.1 Component Hierarchy", HeadingLevel.HEADING_2),
          codePara("App"),
          codePara("  AuthProvider"),
          codePara("    ThemeProvider"),
          codePara("      QueryClientProvider"),
          codePara("        BrowserRouter"),
          codePara("          Routes"),
          codePara("            PublicRoute -> LoginPage (5 variants)"),
          codePara("            ProtectedRoute"),
          codePara("              AppLayout"),
          codePara("                Sidebar (desktop) / MobileSidebar (mobile)"),
          codePara("                  SidebarItem (x96)"),
          codePara("                  SidebarSubmenu (x12)"),
          codePara("                TopBar"),
          codePara("                  SearchInput"),
          codePara("                  NotificationBell"),
          codePara("                  ThemePicker"),
          codePara("                  UserMenu"),
          codePara("                BottomNav (mobile only)"),
          codePara("                <Outlet /> -> Page Components (x161)"),
          spacer(),
          heading("5.2 shadcn/ui Components", HeadingLevel.HEADING_2),
          makeTable(
            ["Component", "File", "Variants", "Usage"],
            [
              ["Button", "button.tsx", "default, destructive, outline, secondary, ghost, link", "CTAs, form actions, nav"],
              ["Card", "card.tsx", "with header, content, footer, description", "Course cards, stat cards"],
              ["Dialog", "dialog.tsx", "with overlay, title, description, close", "Confirmations, forms"],
              ["Input", "input.tsx", "default, with icon, with error state", "Form fields, search"],
              ["Badge", "badge.tsx", "default, secondary, destructive, outline", "Status indicators"],
              ["Avatar", "avatar.tsx", "with image, with fallback initials", "User profiles, comments"],
              ["Dropdown", "dropdown-menu.tsx", "with items, separators, sub-menus", "Action menus, context menus"],
              ["Tooltip", "tooltip.tsx", "with trigger, content, positioning", "Help text, abbreviations"],
              ["Sheet", "sheet.tsx", "left, right, top, bottom sides", "Mobile sidebar, filters"],
              ["Skeleton", "skeleton.tsx", "rectangular, circular variants", "Loading states"],
              ["Separator", "separator.tsx", "horizontal, vertical", "Visual dividers"],
              ["ScrollArea", "scroll-area.tsx", "with scrollbar, no scrollbar", "Long content areas"],
              ["Sonner", "sonner.tsx", "success, error, info, warning", "Toast notifications"],
            ],
            [1400, 2200, 3160, 2600]
          ),
          spacer(),
          heading("5.3 Layout Components", HeadingLevel.HEADING_2),
          makeTable(
            ["Component", "Responsibility", "Key Props/State"],
            [
              ["AppLayout", "Main shell: sidebar + topbar + content outlet", "Manages sidebar collapse state, mobile detection"],
              ["Sidebar", "Desktop navigation with context switching", "isCollapsed, activeSection (global/course/admin)"],
              ["MobileSidebar", "Sheet-based drawer nav for mobile", "isOpen toggle, same nav items as Sidebar"],
              ["TopBar", "Search, notifications, theme picker, user menu", "searchQuery, notificationCount, user object"],
              ["BottomNav", "Mobile bottom tab navigation", "activeTab, 5 primary nav items"],
              ["UserMenu", "Profile dropdown with logout", "user, onLogout callback"],
            ],
            [2000, 4160, 3200]
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 6. THEME SYSTEM =====
          heading("6. Theme System Architecture", HeadingLevel.HEADING_1),
          heading("6.1 CSS Custom Properties", HeadingLevel.HEADING_2),
          para("Themes are implemented entirely through CSS custom properties (variables), enabling runtime switching without page reload or re-render."),
          spacer(),
          makeTable(
            ["Variable Category", "Properties", "Purpose"],
            [
              ["Sidebar", "--sidebar-bg, --sidebar-text, --sidebar-active, --sidebar-hover", "Navigation panel colors"],
              ["Top Bar", "--topbar-bg, --topbar-border, --topbar-text", "Header bar styling"],
              ["Page", "--color-page, --color-surface, --color-surface-hover", "Content area backgrounds"],
              ["Cards", "--card-bg, --card-border, --card-shadow, --card-radius", "Card component styling"],
              ["Accents", "--color-accent-green, --color-accent-orange", "Action buttons, highlights"],
              ["Text", "--text-primary, --text-secondary, --text-muted", "Typography colors"],
              ["Primary", "--color-primary-900 through --color-primary-200", "Brand color scale (7 steps)"],
            ],
            [2200, 4560, 2600]
          ),
          spacer(),
          heading("6.2 Theme Definitions", HeadingLevel.HEADING_2),
          makeTable(
            ["Theme ID", "--sidebar-bg", "--color-accent-green", "--color-page", "--card-bg"],
            [
              ["dark-accent", "#163B32 gradient", "#2DB88A", "#D4EFE6", "#FFFFFF"],
              ["teal-classic", "#1A6B6B", "#2DB88A", "#E8F5F0", "#FFFFFF"],
              ["ocean-blue", "#1E3A5F", "#3B82F6", "#E8F0FE", "#FFFFFF"],
            ],
            [1800, 2200, 2000, 1800, 1560]
          ),
          spacer(),
          heading("6.3 Theme Context API", HeadingLevel.HEADING_2),
          codePara("interface ThemeContextType {"),
          codePara("  theme: string;           // Current theme ID"),
          codePara("  isDark: boolean;         // Dark mode state"),
          codePara("  setTheme: (id: string) => void;"),
          codePara("  toggleDark: () => void;"),
          codePara("  availableThemes: ThemeConfig[];"),
          codePara("}"),
          spacer(),
          para("Theme selection is persisted to localStorage under keys 'redefiners-theme' and 'redefiners-dark-mode'. On initialization, the provider reads stored values and applies the corresponding CSS variables to the document root element."),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 7. NAVIGATION SYSTEM =====
          heading("7. Navigation System", HeadingLevel.HEADING_1),
          heading("7.1 Navigation Structure", HeadingLevel.HEADING_2),
          para("The sidebar navigation contains 96 items organized into 5 top-level sections with 12 collapsible submenus. Navigation switches context based on the current route:"),
          spacer(),
          makeTable(
            ["Context", "Trigger", "Sections", "Items"],
            [
              ["Global", "Any non-course route", "Quick Access, Learn & Grow, Community, Account, Administration", "96"],
              ["Course", "/courses/:courseId/*", "Back to Dashboard, Course, Assessment, Collaborate", "22"],
              ["Admin", "/admin/*", "Full global nav with admin section expanded", "96"],
            ],
            [1400, 2600, 3360, 2000]
          ),
          spacer(),
          heading("7.2 Navigation Features", HeadingLevel.HEADING_2),
          bullet("Search across all navigation items with fuzzy matching"),
          bullet("Favorite/star system with localStorage persistence"),
          bullet("Recent pages tracking (last 5 visited routes)"),
          bullet("Active state detection via React Router useLocation()"),
          bullet("Collapsible submenus with animated expand/collapse"),
          bullet("Mobile-responsive: drawer on tablet, bottom nav on phone"),
          bullet("Admin-only sections hidden for non-admin users"),
          bullet("Course context auto-detection from URL parameters"),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 8. BACKEND INTEGRATION =====
          heading("8. Backend Infrastructure", HeadingLevel.HEADING_1),
          heading("8.1 Docker Compose Services", HeadingLevel.HEADING_2),
          makeTable(
            ["Service", "Image", "Resources", "Health Check", "Volumes"],
            [
              ["web", "Canvas (Passenger)", "3 GB RAM", "/health_check (30s)", "uploads, log, brandable"],
              ["jobs", "Canvas (DelayedJob)", "2 GB RAM", "Process check", "Same as web"],
              ["postgres", "PostgreSQL 14", "1 GB RAM", "pg_isready (10s)", "pg_data (persistent)"],
              ["redis", "Redis 7 Alpine", "512 MB RAM", "redis-cli ping (10s)", "redis_data"],
              ["nginx", "Nginx Alpine", "256 MB RAM", "Port check", "SPA dist, SSL certs"],
              ["certbot", "Certbot", "128 MB RAM", "12h renewal", "certbot_www, certbot_etc"],
            ],
            [1200, 1800, 1400, 1960, 3000]
          ),
          spacer(),
          heading("8.2 Nginx Routing Rules", HeadingLevel.HEADING_2),
          makeTable(
            ["Path Pattern", "Destination", "Cache", "Notes"],
            [
              ["/", "SPA index.html", "No cache", "Fallback for client-side routing"],
              ["/app/*", "Static dist/ files", "7d immutable", "Vite content-hashed assets"],
              ["/api/v1/*", "Canvas Web :3000", "No cache", "REST API proxy with CORS"],
              ["/login, /logout", "Canvas Web :3000", "No cache", "Session management"],
              ["/oauth2/*", "Canvas Web :3000", "No cache", "OAuth2 flows"],
              ["/files/*", "Canvas Web :3000", "No cache", "File serving proxy"],
              ["/graphql", "Canvas Web :3000", "No cache", "GraphQL endpoint"],
              ["/dist/*, /fonts/*", "Canvas Web :3000", "7d cache", "Canvas static assets"],
              ["/legacy/*", "ReDefiners HTML", "1d cache", "Static HTML theme pages"],
              ["/.well-known/acme*", "Certbot challenge", "No cache", "SSL certificate renewal"],
            ],
            [2200, 2600, 1600, 2960]
          ),
          spacer(),
          heading("8.3 Security Headers", HeadingLevel.HEADING_2),
          makeTable(
            ["Header", "Value", "Purpose"],
            [
              ["Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload", "Force HTTPS for 1 year"],
              ["X-Frame-Options", "SAMEORIGIN", "Prevent clickjacking"],
              ["X-Content-Type-Options", "nosniff", "Prevent MIME sniffing"],
              ["X-XSS-Protection", "1; mode=block", "Legacy XSS filter"],
              ["Referrer-Policy", "strict-origin-when-cross-origin", "Control referrer leakage"],
              ["Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()", "Disable dangerous APIs"],
              ["Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.tailwindcss.com; ...", "Control resource loading"],
            ],
            [2600, 4160, 2600]
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 9. DATABASE =====
          heading("9. Database Configuration", HeadingLevel.HEADING_1),
          heading("9.1 PostgreSQL Settings", HeadingLevel.HEADING_2),
          makeTable(
            ["Parameter", "Value", "Rationale"],
            [
              ["Version", "14", "Canvas LMS supported version"],
              ["max_connections", "200 (default)", "Adequate for single-VPS deployment"],
              ["shared_buffers", "256 MB", "25% of available RAM for DB caching"],
              ["effective_cache_size", "1 GB", "OS + PostgreSQL cache estimate"],
              ["max_locks_per_transaction", "640", "Required by Canvas migrations"],
              ["Connection Pool", "25", "Rails ActiveRecord connection pool size"],
              ["Timeout", "5000 ms", "Connection acquisition timeout"],
            ],
            [2600, 2400, 4360]
          ),
          spacer(),
          heading("9.2 Redis Configuration", HeadingLevel.HEADING_2),
          makeTable(
            ["Parameter", "Value", "Purpose"],
            [
              ["Version", "7 (Alpine)", "Lightweight Redis with minimal footprint"],
              ["URL", "redis://redis:6379", "Docker internal DNS resolution"],
              ["maxmemory", "256 MB", "LRU eviction when memory limit reached"],
              ["maxmemory-policy", "allkeys-lru", "Evict least recently used keys"],
              ["Connect Timeout", "0.5s", "Fast failure on connection issues"],
              ["Uses", "Cache + Sessions + ActionCable", "Multi-purpose data store"],
            ],
            [2600, 2400, 4360]
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 10. CI/CD =====
          heading("10. CI/CD Pipeline", HeadingLevel.HEADING_1),
          heading("10.1 Pipeline Stages", HeadingLevel.HEADING_2),
          codePara("Push to main/feature branch"),
          codePara("  |"),
          codePara("  v"),
          codePara("[Job 1: Build & Test] (ubuntu-latest, Node 20)"),
          codePara("  1. git checkout (depth=1)"),
          codePara("  2. npm ci (clean install)"),
          codePara("  3. npx tsc --noEmit (type checking)"),
          codePara("  4. npm run lint (ESLint)"),
          codePara("  5. npm test -- --run (Vitest)"),
          codePara("  6. npm run build (Vite production build)"),
          codePara("  7. Upload dist/ artifact (7-day retention)"),
          codePara("  |"),
          codePara("  v"),
          codePara("[Job 2: Deploy] (on push only, not PRs)"),
          codePara("  1. Download dist/ artifact"),
          codePara("  2. Setup SSH (secrets.SERVER_SSH_KEY)"),
          codePara("  3. ssh: rm -rf /opt/canvas-lms/deploy/spa/app/*"),
          codePara("  4. scp: dist/* -> server:/opt/canvas-lms/deploy/spa/app/"),
          codePara("  5. ssh: docker exec nginx nginx -s reload"),
          codePara("  6. curl -sk https://localhost/app/ (health check)"),
          codePara("  7. Summary logged to GitHub Actions"),
          spacer(),
          heading("10.2 Environment & Secrets", HeadingLevel.HEADING_2),
          makeTable(
            ["Secret/Variable", "Scope", "Purpose"],
            [
              ["SERVER_SSH_KEY", "Repository Secret", "SSH private key for VPS deployment"],
              ["SERVER_HOST", "Environment Variable", "148.230.111.247"],
              ["SERVER_USER", "Environment Variable", "root"],
              ["DEPLOY_PATH", "Environment Variable", "/opt/canvas-lms/deploy/spa/app"],
              ["NODE_VERSION", "Workflow Variable", "20"],
            ],
            [2600, 3000, 3760]
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 11. TESTING =====
          heading("11. Testing Strategy", HeadingLevel.HEADING_1),
          heading("11.1 Test Pyramid", HeadingLevel.HEADING_2),
          makeTable(
            ["Level", "Tool", "Scope", "Count"],
            [
              ["Unit Tests", "Vitest + jsdom", "API client, navigation utilities, role detection", "Expanding"],
              ["Component Tests", "Testing Library", "UI component rendering, user interactions", "Expanding"],
              ["Visual Regression", "Puppeteer Screenshots", "Full-page captures across all routes", "320 screenshots"],
              ["Performance", "Chrome DevTools Protocol", "Core Web Vitals, bundle analysis", "10-page audit"],
              ["Security", "Manual + DOMPurify audit", "XSS, CSRF, headers, auth bypass", "31 findings reviewed"],
              ["E2E (Planned)", "Playwright", "Full user flows across personas", "Planned"],
            ],
            [2000, 2400, 3360, 1600]
          ),
          spacer(),
          heading("11.2 Screenshot Verification Pipeline", HeadingLevel.HEADING_2),
          para("Automated Puppeteer scripts capture screenshots for visual verification of all pages. Screenshots are organized by batch:"),
          spacer(),
          makeTable(
            ["Directory", "Screenshots", "Coverage"],
            [
              ["batch-1 through batch-4", "Core pages (dashboard, courses, assignments, etc.)", "60+"],
              ["priority-1, priority-2, priority-3", "Feature modules by implementation priority", "40+"],
              ["login-variants", "5 login page designs", "5"],
              ["theme-system", "3 themes x multiple pages", "15+"],
              ["security-fixes", "Post-remediation verification", "20+"],
              ["crud-testing", "Create/Read/Update/Delete operations", "30+"],
              ["user-testing", "All 3 personas (admin, teacher, student)", "30+"],
              ["devtools-audit", "Chrome DevTools performance inspector", "10+"],
              ["data-seeding", "Seeded demo data verification", "15+"],
              ["performance-audit", "Core Web Vitals measurement results", "10+"],
            ],
            [2600, 4360, 2400]
          ),
          spacer(),
          heading("11.3 Performance Benchmarks", HeadingLevel.HEADING_2),
          makeTable(
            ["Metric", "Target", "Measured", "Rating"],
            [
              ["Time to First Byte (TTFB)", "< 300 ms", "176 ms", "GOOD"],
              ["First Contentful Paint (FCP)", "< 1500 ms", "567 ms", "GOOD"],
              ["Cumulative Layout Shift (CLS)", "< 0.1", "0.000", "GOOD"],
              ["Full Page Load", "< 3000 ms", "1687 ms", "GOOD"],
              ["Vendor Bundle (gzip)", "< 100 KB", "64.94 KB", "GOOD"],
              ["Route Chunks (avg)", "< 10 KB", "~4 KB", "GOOD"],
            ],
            [2600, 1800, 1800, 3160]
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 12. DESIGN TOKENS =====
          heading("12. Design System Tokens", HeadingLevel.HEADING_1),
          heading("12.1 Color Palette", HeadingLevel.HEADING_2),
          makeTable(
            ["Token", "Value", "Usage"],
            [
              ["--color-primary-900", "#0F2922", "Sidebar darkest, text on light"],
              ["--color-primary-800", "#163B32", "Sidebar gradient start"],
              ["--color-primary-700", "#1D4D42", "Sidebar hover states"],
              ["--color-accent-green", "#2DB88A", "Active items, success states"],
              ["--color-accent-orange", "#FF6B35", "CTAs, warnings, highlights"],
              ["--color-page", "#D4EFE6", "Page background"],
              ["--color-surface", "#FFFFFF", "Card backgrounds"],
              ["--text-primary", "#1E293B", "Primary text"],
              ["--text-secondary", "#64748B", "Secondary text"],
              ["--text-muted", "#94A3B8", "Muted/placeholder text"],
            ],
            [2600, 1800, 4960]
          ),
          spacer(),
          heading("12.2 Typography", HeadingLevel.HEADING_2),
          makeTable(
            ["Token", "Value", "Usage"],
            [
              ["Font Family (Body)", "Inter, system-ui, sans-serif", "All body text"],
              ["Font Family (Headings)", "Poppins, Inter, sans-serif", "H1-H4 headings"],
              ["Display", "3.5rem / 800 weight", "Hero titles"],
              ["H1", "2rem / 700 weight", "Page titles"],
              ["H2", "1.5rem / 600 weight", "Section headings"],
              ["Body", "0.875rem / 400 weight", "Standard body text (14px)"],
              ["Caption", "0.75rem / 400 weight", "Labels, metadata"],
            ],
            [2600, 3160, 3600]
          ),
          spacer(),
          heading("12.3 Spacing & Layout", HeadingLevel.HEADING_2),
          makeTable(
            ["Token", "Value", "Usage"],
            [
              ["Sidebar Width", "240px", "Fixed desktop sidebar"],
              ["Topbar Height", "64px", "Fixed top bar"],
              ["Content Padding", "0 32px", "Main content area"],
              ["Card Radius", "12px", "Card border radius"],
              ["--space-1", "4px", "Tight spacing"],
              ["--space-3", "12px", "Standard gap"],
              ["--space-5", "24px", "Section padding"],
              ["--space-7", "40px", "Large section gaps"],
            ],
            [2600, 1800, 4960]
          ),
          spacer(),
          heading("12.4 Elevation (Box Shadows)", HeadingLevel.HEADING_2),
          makeTable(
            ["Level", "Value", "Usage"],
            [
              ["--shadow-0", "none", "Flat elements"],
              ["--shadow-1", "0 1px 3px rgba(0,0,0,0.1)", "Subtle cards"],
              ["--shadow-2", "0 4px 6px -1px rgba(0,0,0,0.1)", "Elevated cards"],
              ["--shadow-3", "0 10px 15px -3px rgba(0,0,0,0.1)", "Dropdowns, popovers"],
              ["--shadow-4", "0 20px 25px -5px rgba(0,0,0,0.1)", "Modals, dialogs"],
            ],
            [2000, 4160, 3200]
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 13. SECURITY =====
          heading("13. Security Architecture", HeadingLevel.HEADING_1),
          heading("13.1 Security Controls", HeadingLevel.HEADING_2),
          makeTable(
            ["Control", "Implementation", "Layer"],
            [
              ["XSS Prevention", "DOMPurify sanitizes all user-generated HTML before rendering via dangerouslySetInnerHTML", "Application"],
              ["CSRF Protection", "Canvas session CSRF token extracted and injected in all non-GET API requests", "Application"],
              ["Content Security Policy", "Nginx CSP header restricts script/style/image sources to known domains", "Network"],
              ["Transport Security", "HTTPS-only with HSTS preload (max-age=31536000)", "Network"],
              ["Clickjacking Prevention", "X-Frame-Options: SAMEORIGIN header on all responses", "Network"],
              ["MIME Sniffing", "X-Content-Type-Options: nosniff prevents browser MIME type guessing", "Network"],
              ["API Permissions", "Permissions-Policy disables camera, microphone, geolocation, payment APIs", "Network"],
              ["Role-Based Access", "AdminRoute component checks admin permissions before rendering admin pages", "Application"],
              ["Session Management", "HttpOnly, Secure, SameSite cookies managed by Canvas backend", "Backend"],
              ["Input Validation", "TypeScript types + Canvas backend validation on all API inputs", "Full Stack"],
            ],
            [2200, 5160, 2000]
          ),
          spacer(),
          heading("13.2 Security Audit Summary", HeadingLevel.HEADING_2),
          makeTable(
            ["Severity", "Found", "Remediated", "Remaining"],
            [
              ["Critical", "5", "4", "1 (secrets rotation pending)"],
              ["High", "6", "5", "1 (upload limit review)"],
              ["Medium", "10", "8", "2"],
              ["Low", "10", "7", "3"],
              ["Total", "31", "24", "7"],
            ],
            [2000, 2200, 2560, 2600]
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ===== 14. GLOSSARY =====
          heading("14. Glossary", HeadingLevel.HEADING_1),
          makeTable(
            ["Term", "Definition"],
            [
              ["SPA", "Single-Page Application - a web app that loads a single HTML page and dynamically updates content"],
              ["Canvas LMS", "Learning Management System by Instructure, used as the backend API"],
              ["shadcn/ui", "A collection of re-usable React components built on Radix UI primitives"],
              ["TanStack Query", "Data fetching library that manages server state, caching, and background synchronization"],
              ["CSRF", "Cross-Site Request Forgery - an attack prevented by token validation on state changes"],
              ["XSS", "Cross-Site Scripting - an attack prevented by HTML sanitization with DOMPurify"],
              ["DXA", "Device Independent Pixels used in Word document measurements (1440 DXA = 1 inch)"],
              ["TTFB", "Time to First Byte - measures server response latency"],
              ["FCP", "First Contentful Paint - time until the first text/image is rendered"],
              ["CLS", "Cumulative Layout Shift - measures visual stability during page load"],
              ["HMR", "Hot Module Replacement - Vite feature for instant dev updates without full reload"],
              ["CVA", "Class Variance Authority - utility for managing component variant classes"],
              ["BFF", "Backend for Frontend - a proxy pattern where Nginx routes requests to appropriate backends"],
              ["LTI", "Learning Tools Interoperability - standard for integrating external tools with LMS"],
              ["SIS", "Student Information System - external system for student/enrollment data import"],
            ],
            [2000, 7360]
          ),
          spacer(),

          // ===== 15. REVISION HISTORY =====
          heading("15. Document Revision History", HeadingLevel.HEADING_1),
          makeTable(
            ["Version", "Date", "Author", "Changes"],
            [
              ["1.0", "March 27, 2026", "ReDefiners Engineering", "Initial technical specification covering full system architecture"],
            ],
            [1200, 2000, 2560, 3600]
          ),
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync("docs/TECHNICAL_SPECIFICATION.docx", buffer);
  console.log("Tech Spec created: docs/TECHNICAL_SPECIFICATION.docx (" + buffer.length + " bytes)");
}

createTechSpec().catch(e => { console.error(e); process.exit(1); });
