# ReDefiners LMS: React SPA Migration Plan

## Executive Summary

Convert the ReDefiners frontend from 241 static HTML pages to a modern React SPA using **Vite + React + TypeScript + shadcn/ui + React Router + TanStack Query**.

The existing JS layer maps well to React:
- `CanvasAPI` sub-modules → custom hooks
- `ReDefinersRenderer` methods → React components
- `ReDefinersSidebar` → component with context-aware rendering
- `app.js` `pageInitializers` → React Router routes

241 HTML pages de-duplicate to ~80-90 unique React page components.

---

## Phase 1: Project Scaffolding

### 1.1 Setup
```bash
npx create-vite@latest ReDefiners-react --template react-ts
cd ReDefiners-react
npm install react-router-dom @tanstack/react-query date-fns
npx shadcn-ui@latest init
```

### 1.2 Dependencies

| Category | Package | Purpose |
|----------|---------|---------|
| Core | `react`, `react-dom`, `react-router-dom` v7 | SPA framework |
| Styling | `tailwindcss` v4, shadcn/ui | Design system |
| Data | `@tanstack/react-query` v5 | API caching/fetching |
| Icons | `lucide-react` (shadcn default) + Font Awesome (transition) | Icons |
| Dates | `date-fns` | Date formatting |
| Toast | `sonner` | Notifications |

### 1.3 Tailwind Configuration

Port existing design tokens from `tailwind-config.js`:
- **Remove `tw-` prefix** (no longer needed without Bootstrap conflicts)
- Port all custom colors (primary, surface, page, accent palettes)
- Port typography (Poppins + Inter), spacing, shadows, animations
- Map `tokens.css` CSS variables to Tailwind theme values
- Configure shadcn/ui CSS variables for teal/green palette

### 1.4 shadcn/ui Components to Install

`button`, `input`, `card`, `dialog`, `dropdown-menu`, `select`, `tabs`, `table`, `badge`, `avatar`, `skeleton`, `toast`, `tooltip`, `separator`, `scroll-area`, `sheet`, `breadcrumb`, `pagination`, `progress`, `alert`, `checkbox`, `form`, `label`, `textarea`

---

## Phase 2: Core Architecture

### 2.1 Directory Structure

```
src/
  components/
    ui/                  # shadcn/ui auto-generated
    layout/
      AppLayout.tsx      # Main layout (sidebar + topbar + content)
      Sidebar.tsx        # Context-aware sidebar navigation
      TopBar.tsx         # Search, notifications, user menu
      MobileSidebar.tsx  # Sheet-based mobile sidebar
    shared/
      CourseCard.tsx, AssignmentRow.tsx, StatusPill.tsx,
      EmptyState.tsx, ProgressBar.tsx, CalendarEvent.tsx, etc.
  contexts/
    AuthContext.tsx       # Port of auth.js
  hooks/
    useAuth.ts, useCourses.ts, useAssignments.ts,
    useModules.ts, useCalendar.ts, useConversations.ts, etc.
  services/
    canvasApi.ts         # Port of api.js (22 sub-modules)
  pages/
    auth/          # LoginPage, RegistrationPage, ForgotPasswordPage
    dashboard/     # DashboardPage
    courses/       # CoursesPage, CourseHomePage, CourseSettingsPage
    assignments/   # AssignmentsPage, AssignmentDetailPage, SubmissionPage
    quizzes/       # QuizzesPage, QuizTakePage, QuizResultsPage
    discussions/   # DiscussionsPage, DiscussionThreadPage
    modules/       # ModulesPage
    grades/        # GradesPage, GradebookPage, SpeedGraderPage
    calendar/      # CalendarPage
    inbox/         # InboxPage
    files/         # FilesPage
    pages-content/ # PagesPage, PageViewPage
    people/        # PeoplePage
    profile/       # ProfilePage
    admin/         # AdminDashboardPage, UserManagementPage, etc.
    services/      # TutoringPage, MentoringPage, CareerServicesPage
    analytics/     # StudentAnalyticsPage, EngagementMetricsPage
  router/
    routes.tsx           # Central route definitions
    ProtectedRoute.tsx   # Auth guard wrapper
  styles/
    tokens.css, globals.css
  lib/
    utils.ts             # cn(), date formatters, text utils
```

### 2.2 Route Structure

```
/                              → redirect to /dashboard
/login                         → LoginPage
/dashboard                     → DashboardPage
/courses                       → CoursesPage
/courses/:courseId              → CourseHomePage
/courses/:courseId/assignments  → AssignmentsPage
/courses/:courseId/assignments/:id → AssignmentDetailPage
/courses/:courseId/quizzes      → QuizzesPage
/courses/:courseId/discussions   → DiscussionsPage
/courses/:courseId/modules      → ModulesPage
/courses/:courseId/grades       → GradesPage
/courses/:courseId/gradebook    → GradebookPage
/courses/:courseId/pages        → PagesPage
/courses/:courseId/files        → FilesPage
/courses/:courseId/people       → PeoplePage
/courses/:courseId/syllabus     → SyllabusPage
/calendar                      → CalendarPage
/inbox                         → InboxPage
/profile                       → ProfilePage
/admin/*                       → Admin routes
/mentoring                     → MentoringPage
/tutoring                      → TutoringPage
/certificates                  → CertificatesPage
... (80-90 total routes)
```

### 2.3 Layout Routes

```tsx
<Route element={<ProtectedRoute />}>
  <Route element={<AppLayout variant="global" />}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/courses" element={<CoursesPage />} />
    <Route path="/calendar" element={<CalendarPage />} />
    <Route path="/inbox" element={<InboxPage />} />
  </Route>
  <Route path="/courses/:courseId" element={<AppLayout variant="course" />}>
    <Route index element={<CourseHomePage />} />
    <Route path="assignments" element={<AssignmentsPage />} />
    <Route path="grades" element={<GradesPage />} />
    ...
  </Route>
</Route>
<Route element={<AuthLayout />}>
  <Route path="/login" element={<LoginPage />} />
</Route>
```

---

## Phase 3: Component Migration (render.js → React)

| render.js method | React Component | shadcn/ui |
|---|---|---|
| `courseCard()` | `<CourseCard />` | Card, Button |
| `assignmentRow()` | `<AssignmentRow />` | Badge |
| `statusPill()` | `<StatusPill />` | Badge variant |
| `emptyState()` | `<EmptyState />` | custom |
| `progressBar()` | `<ProgressBar />` | Progress |
| `moduleList()` | `<ModuleList />` | Collapsible, Checkbox |
| `gradesTable()` | `<GradesTable />` | Table |
| `toast()` | `sonner` | Built-in |
| `skeleton()` | `<Skeleton />` | Skeleton |

---

## Phase 4: Migration Batches

### Batch 1 - Core Shell (Week 1-2)
- AppLayout, Sidebar, TopBar
- AuthContext, ProtectedRoute
- canvasApi.ts service (full port)
- React Router setup
- LoginPage, DashboardPage

### Batch 2 - Course Core (Week 2-3)
- CoursesPage, CourseHomePage
- AssignmentsPage, AssignmentDetailPage
- ModulesPage, GradesPage

### Batch 3 - Course Content (Week 3-4)
- DiscussionsPage, QuizzesPage
- PagesPage, FilesPage, SyllabusPage
- AnnouncementsPage

### Batch 4 - Communication (Week 4-5)
- InboxPage (split-pane layout)
- PeoplePage, GroupsPage
- ConferencesPage, ProfilePage

### Batch 5 - Assessment (Week 5-6)
- GradebookPage, SpeedGraderPage
- RubricsPage, OutcomesPage

### Batch 6 - Admin (Week 6-7)
- AdminDashboardPage, UserManagementPage
- ReportsPage, PermissionsPage

### Batch 7 - Remaining (Week 7-8)
- CalendarPage, PlannerPage
- All student services pages
- All analytics pages
- Remaining utility pages

---

## Phase 5: Build & Deployment

### Vite Config
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/login': 'http://localhost:3000',
    },
  },
  build: { outDir: 'dist', sourcemap: true },
});
```

### Nginx Update
```nginx
location / {
    root /usr/share/nginx/redefiners;
    index index.html;
    try_files $uri $uri/ /index.html;
}
```

### Parallel Deployment
During migration, both old HTML and new React can coexist:
- `/app/*` → React SPA
- Everything else → old static HTML
- Once complete, swap `/` to React SPA

---

## Key Technical Decisions

| Decision | Choice | Reason |
|---|---|---|
| Framework | Vite + React + TypeScript | Fast builds, type safety |
| Styling | Tailwind + shadcn/ui | Matches existing design, real component library |
| Data fetching | TanStack Query | Replaces manual cache in api.js |
| State management | React Query + Context | No Redux needed |
| Icons | Font Awesome → Lucide (gradual) | Better tree-shaking |
| Rich text editor | TinyMCE React | Canvas HTML compatibility |
| Calendar | @fullcalendar/react | Full-featured calendar widget |
| Data grid | @tanstack/react-table | For gradebook/speed-grader |

---

## Branch

All React work goes on: `feature/react-frontend`
