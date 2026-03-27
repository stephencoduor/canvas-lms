const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  TabStopPosition, TabStopType, convertInchesToTwip,
} = require("docx");
const fs = require("fs");
const path = require("path");

// ─── Helpers ───────────────────────────────────────────────────────────

function title(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text, bold: true, size: 56, font: "Calibri" })],
  });
}

function subtitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text, size: 32, font: "Calibri", color: "555555" })],
  });
}

function dateLine(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 600, after: 400 },
    children: [new TextRun({ text, size: 28, font: "Calibri", italics: true, color: "777777" })],
  });
}

function heading1(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } });
}

function heading2(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 100 } });
}

function storyParagraph(label, value) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 22, font: "Calibri" }),
      new TextRun({ text: value, size: 22, font: "Calibri" }),
    ],
  });
}

function bullet(text) {
  return new Paragraph({
    text,
    bullet: { level: 0 },
    spacing: { after: 40 },
    style: "ListParagraph",
  });
}

function spacer() {
  return new Paragraph({ text: "", spacing: { after: 120 } });
}

// Build one user story block
function storyBlock(id, storyText, acceptanceCriteria, priority) {
  const parts = [
    heading2(`${id}: ${storyText.split(",")[0].replace("As a ", "").trim()}`),
    storyParagraph("ID", id),
    storyParagraph("Story", storyText),
    storyParagraph("Priority", priority),
    storyParagraph("Status", "\u2705 Implemented"),
    new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Acceptance Criteria:", bold: true, size: 22, font: "Calibri" })] }),
  ];
  for (const ac of acceptanceCriteria) {
    parts.push(bullet(ac));
  }
  parts.push(spacer());
  return parts;
}

// ─── Summary table ─────────────────────────────────────────────────────

function headerCell(text) {
  return new TableCell({
    shading: { type: ShadingType.SOLID, color: "2E74B5" },
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 20, font: "Calibri" })] })],
    width: { size: 20, type: WidthType.PERCENTAGE },
  });
}

function cell(text) {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, size: 20, font: "Calibri" })] })],
  });
}

function summaryTable(stories) {
  const rows = [
    new TableRow({ children: [headerCell("ID"), headerCell("Title"), headerCell("Priority"), headerCell("Status"), headerCell("Section")] }),
  ];
  for (const s of stories) {
    rows.push(new TableRow({ children: [cell(s.id), cell(s.title), cell(s.priority), cell("\u2705 Implemented"), cell(s.section)] }));
  }
  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

// ─── Story data ────────────────────────────────────────────────────────

const studentStories = [
  { id: "US-001", title: "Login", story: "As a student, I want to log in with my email and password, so that I can access my courses securely.", ac: ["Email/password form with validation", "Error messages for invalid credentials", "Redirect to dashboard on success", "Remember-me option"], priority: "High" },
  { id: "US-002", title: "Dashboard Courses", story: "As a student, I want to see my enrolled courses on the dashboard, so that I can quickly navigate to them.", ac: ["Show all enrolled courses", "Course cards with image, code, and term", "Click to navigate to course page", "Empty state when no enrollments"], priority: "High" },
  { id: "US-003", title: "View Assignments", story: "As a student, I want to view my assignments grouped by assignment group, so that I can track my work.", ac: ["Grouped by assignment group", "Display due dates and points possible", "Show submission status (submitted, graded, missing)", "Sort by due date"], priority: "High" },
  { id: "US-004", title: "Submit Assignments", story: "As a student, I want to submit assignments via text entry, file upload, or URL, so that I can complete my coursework.", ac: ["Text entry tab with rich text editor", "File upload tab with drag-and-drop", "URL submission tab", "Submission confirmation message"], priority: "High" },
  { id: "US-005", title: "Take Quizzes", story: "As a student, I want to take quizzes with a timer and multiple question types, so that I can complete assessments.", ac: ["Timer display for timed quizzes", "Multiple choice, true/false, and essay question types", "Question navigation sidebar", "Auto-submit on timer expiration"], priority: "High" },
  { id: "US-006", title: "View Grades", story: "As a student, I want to view my grades, so that I can track my academic progress.", ac: ["Overall course grade display", "Per-assignment scores", "Grade percentage and letter grade", "What-if grade calculations"], priority: "High" },
  { id: "US-007", title: "Discussions", story: "As a student, I want to participate in discussions, so that I can engage with course material and peers.", ac: ["View discussion topics list", "Post new replies", "Threaded view for conversations", "Mark as read/unread"], priority: "Medium" },
  { id: "US-008", title: "Modules", story: "As a student, I want to navigate course modules, so that I can follow the course structure.", ac: ["Module list with expand/collapse", "Completion tracking indicators", "Item checkboxes for progress", "Sequential module requirements"], priority: "High" },
  { id: "US-009", title: "Pages/Syllabus", story: "As a student, I want to view course pages and syllabus, so that I can read course content.", ac: ["HTML content rendering", "Breadcrumb navigation", "Front page display", "Page revision history"], priority: "Medium" },
  { id: "US-010", title: "Files", story: "As a student, I want to access course files, so that I can download course materials.", ac: ["Folder tree navigation", "File download functionality", "Storage quota display", "File preview for common formats"], priority: "Medium" },
  { id: "US-011", title: "Inbox", story: "As a student, I want to send and receive messages, so that I can communicate with teachers and peers.", ac: ["Split pane layout", "Conversation list with preview", "Compose new message form", "Reply and forward functionality"], priority: "Medium" },
  { id: "US-012", title: "Calendar", story: "As a student, I want to view a calendar of events, so that I can manage my schedule.", ac: ["Monthly grid view", "Event display with color coding", "Navigation between months", "Event detail popup"], priority: "Medium" },
  { id: "US-013", title: "Planner", story: "As a student, I want to use a planner to track upcoming items, so that I can stay organized.", ac: ["Items grouped by date", "Completion toggle for each item", "Filter by course", "Show overdue items"], priority: "Medium" },
  { id: "US-014", title: "Groups", story: "As a student, I want to view and join groups, so that I can collaborate with classmates.", ac: ["Group list for each course", "Member count display", "Join/leave group functionality", "Group discussion area"], priority: "Low" },
  { id: "US-015", title: "Profile", story: "As a student, I want to view and edit my profile, so that I can manage my identity.", ac: ["Avatar display and upload", "Name and email display", "Edit profile form", "Notification preferences"], priority: "Medium" },
  { id: "US-016", title: "ePortfolio", story: "As a student, I want to create and manage ePortfolios, so that I can showcase my work.", ac: ["Portfolio list view", "Categories and sections", "Public/private toggle", "Add portfolio entries"], priority: "Low" },
  { id: "US-017", title: "Quiz Results", story: "As a student, I want to review my quiz results, so that I can learn from my mistakes.", ac: ["Score display with percentage", "Answer review with correct/incorrect indicators", "Correct answer reveal (if allowed)", "Attempt history"], priority: "High" },
  { id: "US-018", title: "Mobile Responsive", story: "As a student, I want to use the app on my mobile device, so that I can access courses anywhere.", ac: ["Bottom navigation bar on mobile", "Responsive layout for all pages", "Touch-friendly controls", "Swipe gestures for navigation"], priority: "High" },
  { id: "US-019", title: "Dark Mode", story: "As a student, I want to toggle dark mode, so that I can reduce eye strain.", ac: ["Toggle switch in settings/header", "Persists preference in localStorage", "All components styled for dark theme", "System preference detection"], priority: "Medium" },
  { id: "US-020", title: "Notifications", story: "As a student, I want to receive notifications, so that I can stay updated on course activity.", ac: ["Polling for new notifications", "Browser alert support", "Unread badge count on bell icon", "Mark as read functionality"], priority: "Medium" },
];

const teacherStories = [
  { id: "US-021", title: "Assignment Editor", story: "As a teacher, I want to create and edit assignments with a rich text editor, so that I can build engaging coursework.", ac: ["TinyMCE rich text editor integration", "Assignment type selection", "Due date and points configuration", "Submission type settings"], priority: "High" },
  { id: "US-022", title: "Discussion Creator", story: "As a teacher, I want to create discussion topics, so that I can facilitate student engagement.", ac: ["Topic title and description editor", "Threaded/focused reply options", "Graded discussion settings", "Pin and close discussion controls"], priority: "Medium" },
  { id: "US-023", title: "Quiz Builder", story: "As a teacher, I want to build quizzes with various question types, so that I can assess students.", ac: ["Question bank management", "Multiple question types (MC, T/F, essay, matching)", "Quiz settings (time limit, attempts)", "Question groups with random selection"], priority: "High" },
  { id: "US-024", title: "SpeedGrader", story: "As a teacher, I want to grade submissions efficiently, so that I can provide timely feedback.", ac: ["Student submission viewer", "Grade input with rubric support", "Annotation tools for feedback", "Navigate between students"], priority: "High" },
  { id: "US-025", title: "Gradebook", story: "As a teacher, I want to manage grades in a gradebook, so that I can track student performance.", ac: ["Spreadsheet-style grade grid", "Assignment group weighting", "Grade override capability", "Export grades to CSV"], priority: "High" },
  { id: "US-026", title: "Module Management", story: "As a teacher, I want to create and organize modules, so that I can structure my course content.", ac: ["Add/edit/delete modules", "Drag-and-drop reordering", "Add items to modules", "Prerequisites and requirements"], priority: "High" },
  { id: "US-027", title: "Wiki Pages", story: "As a teacher, I want to create and edit wiki pages, so that I can share course information.", ac: ["Page editor with rich text", "Set front page", "Page history and revisions", "Student edit permissions"], priority: "Medium" },
  { id: "US-028", title: "Rubrics", story: "As a teacher, I want to create rubrics, so that I can standardize grading criteria.", ac: ["Rubric builder with criteria and ratings", "Point and free-form rubric types", "Associate rubric with assignments", "Rubric preview"], priority: "Medium" },
  { id: "US-029", title: "Analytics", story: "As a teacher, I want to view course analytics, so that I can monitor student engagement.", ac: ["Page view statistics", "Assignment submission rates", "Student participation metrics", "Grade distribution charts"], priority: "Medium" },
  { id: "US-030", title: "Announcements", story: "As a teacher, I want to post announcements, so that I can communicate important information.", ac: ["Announcement editor", "Schedule future announcements", "Allow comments toggle", "Notification to students"], priority: "Medium" },
  { id: "US-031", title: "People Management", story: "As a teacher, I want to manage course enrollments, so that I can control who is in my course.", ac: ["View enrolled users list", "Filter by role", "Add/remove users", "User activity details"], priority: "Medium" },
  { id: "US-032", title: "Group Management", story: "As a teacher, I want to manage student groups, so that I can facilitate collaboration.", ac: ["Create group sets", "Auto-assign students", "Manual group assignment", "Group size limits"], priority: "Low" },
  { id: "US-033", title: "Course Settings", story: "As a teacher, I want to configure course settings, so that I can customize the learning environment.", ac: ["Course name and details editor", "Feature toggles", "Navigation tab ordering", "Course format options"], priority: "Medium" },
  { id: "US-034", title: "Course Copy", story: "As a teacher, I want to copy a course, so that I can reuse content across terms.", ac: ["Select source course", "Choose content to copy", "Progress indicator", "Adjust dates option"], priority: "Low" },
  { id: "US-035", title: "Late Policy", story: "As a teacher, I want to set a late submission policy, so that I can automate grade deductions.", ac: ["Percentage deduction per day/hour", "Missing submission policy", "Grace period setting", "Apply to existing submissions"], priority: "Medium" },
  { id: "US-036", title: "Peer Reviews", story: "As a teacher, I want to assign peer reviews, so that students can learn from each other.", ac: ["Manual and automatic assignment", "Review count per student", "Anonymous review option", "Review due date"], priority: "Low" },
  { id: "US-037", title: "Activity Reports", story: "As a teacher, I want to view student activity reports, so that I can identify at-risk students.", ac: ["Last login timestamp", "Page views and participation", "Time-on-task estimates", "Export report data"], priority: "Medium" },
  { id: "US-038", title: "Navigation Config", story: "As a teacher, I want to customize course navigation, so that students see only relevant tabs.", ac: ["Drag-and-drop tab reordering", "Show/hide navigation items", "External tool links", "Save configuration"], priority: "Low" },
  { id: "US-039", title: "Outcomes", story: "As a teacher, I want to define learning outcomes, so that I can track competency mastery.", ac: ["Outcome creation and editing", "Mastery scale configuration", "Align to assignments", "Outcome results view"], priority: "Low" },
  { id: "US-040", title: "Conferences", story: "As a teacher, I want to create web conferences, so that I can hold virtual class sessions.", ac: ["Conference creation form", "BigBlueButton or Zoom integration", "Schedule and invite students", "Recording management"], priority: "Low" },
];

const adminStories = [
  { id: "US-041", title: "User Management", story: "As an admin, I want to manage user accounts, so that I can control platform access.", ac: ["User search and filter", "Create/edit/disable accounts", "Role assignment", "Login masquerading"], priority: "High" },
  { id: "US-042", title: "Statistics Dashboard", story: "As an admin, I want to view platform statistics, so that I can monitor usage.", ac: ["Active user counts", "Course statistics", "Storage usage", "Report generation"], priority: "Medium" },
  { id: "US-043", title: "Terms Management", story: "As an admin, I want to manage enrollment terms, so that I can organize academic periods.", ac: ["Create and edit terms", "Set start/end dates", "Default term selection", "Term-based course filtering"], priority: "Medium" },
  { id: "US-044", title: "Auth Providers", story: "As an admin, I want to configure authentication providers, so that users can log in via SSO.", ac: ["LDAP configuration", "SAML setup", "OAuth2 provider settings", "CAS integration"], priority: "Medium" },
  { id: "US-045", title: "Developer Keys", story: "As an admin, I want to manage developer keys, so that I can control API access.", ac: ["Create API keys", "LTI key management", "Scope configuration", "Enable/disable keys"], priority: "Medium" },
  { id: "US-046", title: "Permissions", story: "As an admin, I want to configure role permissions, so that I can control feature access.", ac: ["Permission matrix view", "Role-based access control", "Custom role creation", "Permission inheritance"], priority: "High" },
  { id: "US-047", title: "SIS Import", story: "As an admin, I want to import SIS data, so that I can sync with external systems.", ac: ["CSV file upload", "Import progress tracking", "Error reporting", "Import history"], priority: "Low" },
  { id: "US-048", title: "Sub-accounts", story: "As an admin, I want to manage sub-accounts, so that I can organize departments.", ac: ["Create sub-account hierarchy", "Account-level settings", "Move courses between accounts", "Account admin assignment"], priority: "Low" },
  { id: "US-049", title: "Theme Customization", story: "As an admin, I want to customize the platform theme, so that it matches our branding.", ac: ["Logo and color configuration", "Custom CSS upload", "Theme preview", "Apply to sub-accounts"], priority: "Medium" },
  { id: "US-050", title: "Audit Logs", story: "As an admin, I want to view audit logs, so that I can track platform changes.", ac: ["Event timeline view", "Filter by user, action, date", "Export audit data", "Grade change logs"], priority: "Medium" },
  { id: "US-051", title: "Feature Flags", story: "As an admin, I want to toggle feature flags, so that I can control feature rollout.", ac: ["Feature list with toggle switches", "Account-level and site-wide options", "Feature descriptions", "Lock feature state"], priority: "Low" },
  { id: "US-052", title: "Grading Standards", story: "As an admin, I want to define grading standards, so that courses use consistent scales.", ac: ["Grading scheme editor", "Letter grade mapping", "Default scheme selection", "Apply to accounts"], priority: "Low" },
  { id: "US-053", title: "Reports", story: "As an admin, I want to generate reports, so that I can analyze platform data.", ac: ["Report type selection", "Date range filters", "CSV/Excel export", "Scheduled report generation"], priority: "Medium" },
  { id: "US-054", title: "Rate Limiting", story: "As an admin, I want to configure rate limiting, so that I can protect the API.", ac: ["Request threshold settings", "Per-user and global limits", "Whitelist configuration", "Rate limit monitoring"], priority: "Low" },
  { id: "US-055", title: "Page Views", story: "As an admin, I want to track page views, so that I can understand platform usage.", ac: ["Page view analytics dashboard", "User-level page views", "Course-level analytics", "Date range filtering"], priority: "Low" },
];

const systemStories = [
  { id: "US-056", title: "Nginx SPA Serving", story: "As the system, I want Nginx to serve the SPA with proper fallback, so that client-side routing works.", ac: ["try_files directive for SPA fallback", "Serve index.html for all routes", "Proper MIME types for assets", "Gzip compression enabled"], priority: "High" },
  { id: "US-057", title: "API Proxy", story: "As the system, I want Nginx to proxy API requests to Canvas, so that the frontend can access the backend.", ac: ["Proxy /api/v1/ to Canvas container", "CORS headers configuration", "WebSocket proxy support", "Request timeout settings"], priority: "High" },
  { id: "US-058", title: "Asset Caching", story: "As the system, I want static assets to be cached, so that page loads are fast.", ac: ["Cache-Control headers for JS/CSS bundles", "Content-hash based filenames", "Long-term caching for immutable assets", "No-cache for index.html"], priority: "Medium" },
  { id: "US-059", title: "CI/CD Auto-deploy", story: "As the system, I want automated deployment, so that updates are delivered reliably.", ac: ["GitHub Actions workflow trigger", "Build and test pipeline", "Docker image build and push", "Zero-downtime deployment"], priority: "Medium" },
  { id: "US-060", title: "PWA Offline", story: "As the system, I want PWA capabilities, so that students can access cached content offline.", ac: ["Service worker registration", "Offline fallback page", "Cache-first strategy for assets", "Background sync for submissions"], priority: "Low" },
];

// ─── Build document ────────────────────────────────────────────────────

const allStories = [
  ...studentStories.map(s => ({ ...s, section: "Student" })),
  ...teacherStories.map(s => ({ ...s, section: "Teacher" })),
  ...adminStories.map(s => ({ ...s, section: "Admin" })),
  ...systemStories.map(s => ({ ...s, section: "System" })),
];

const children = [
  // Title page
  new Paragraph({ text: "", spacing: { after: 2000 } }),
  title("ReDefiners Canvas LMS"),
  title("User Stories"),
  spacer(),
  subtitle("Complete feature requirements for the custom Canvas LMS frontend"),
  dateLine("March 2026"),
  new Paragraph({ text: "", pageBreakBefore: true }),

  // Summary table
  heading1("User Story Summary"),
  summaryTable(allStories),
  new Paragraph({ text: "", pageBreakBefore: true }),

  // Section 1: Student
  heading1("Section 1: Student User Stories (US-001 to US-020)"),
  ...studentStories.flatMap(s => storyBlock(s.id, s.story, s.ac, s.priority)),
  new Paragraph({ text: "", pageBreakBefore: true }),

  // Section 2: Teacher
  heading1("Section 2: Teacher User Stories (US-021 to US-040)"),
  ...teacherStories.flatMap(s => storyBlock(s.id, s.story, s.ac, s.priority)),
  new Paragraph({ text: "", pageBreakBefore: true }),

  // Section 3: Admin
  heading1("Section 3: Admin User Stories (US-041 to US-055)"),
  ...adminStories.flatMap(s => storyBlock(s.id, s.story, s.ac, s.priority)),
  new Paragraph({ text: "", pageBreakBefore: true }),

  // Section 4: System
  heading1("Section 4: System User Stories (US-056 to US-060)"),
  ...systemStories.flatMap(s => storyBlock(s.id, s.story, s.ac, s.priority)),
];

const doc = new Document({
  creator: "ReDefiners",
  title: "ReDefiners Canvas LMS \u2014 User Stories",
  description: "Complete feature requirements for the custom Canvas LMS frontend",
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 22 } },
    },
  },
  sections: [{ children }],
});

(async () => {
  const buffer = await Packer.toBuffer(doc);
  const outPath = path.join(__dirname, "USER_STORIES.docx");
  fs.writeFileSync(outPath, buffer);
  console.log(`Written ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
})();
