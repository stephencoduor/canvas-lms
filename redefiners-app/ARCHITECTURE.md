# ReDefiners React SPA — Architecture Document

## Overview

The ReDefiners React SPA is a custom Canvas LMS frontend built with Vite, React 18, TypeScript, Tailwind CSS v4, shadcn/ui, React Router 7, and TanStack Query v5. It serves as a complete replacement for the Canvas default UI, communicating with the Canvas Rails backend exclusively through REST APIs.

**Live:** https://fineract.us/app/
**Repository:** `stephencoduor/redefiners` (branch: `feature/react-frontend`)

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Build | Vite | 8.x |
| Framework | React | 18.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Components | shadcn/ui | Latest |
| Routing | React Router | 7.x |
| Data Fetching | TanStack Query | 5.x |
| Icons | Lucide React | Latest |
| Backend | Canvas LMS (Rails 8) | API only |
| Auth | Session Cookies | Same-origin |

---

## Directory Structure

```
redefiners-app/
├── vite.config.ts              # Vite config (base: /app/, proxy to Canvas)
├── tailwind.config.ts          # (managed by shadcn/Tailwind v4)
├── components.json             # shadcn/ui configuration
├── tsconfig.json               # TypeScript config (path alias @/)
├── capture-react.cjs           # Puppeteer screenshot tool
├── ARCHITECTURE.md             # This file
├── REMAINING_PAGES.md          # Unmigrated Canvas features
├── WORKFLOW.md                 # Development pipeline
│
├── public/
│   ├── Images/                 # Static assets (logo, illustrations)
│   ├── favicon.svg
│   └── icons.svg
│
├── dist/                       # Production build output
│
├── react-screenshots/          # Verification screenshots (per batch)
│
└── src/
    ├── main.tsx                # React root (StrictMode + App)
    ├── App.tsx                 # Providers (QueryClient + Auth + Router)
    ├── index.css               # Tailwind imports + design tokens + gradients
    ├── vite-env.d.ts
    │
    ├── types/
    │   └── canvas.ts           # 30+ Canvas API TypeScript interfaces
    │
    ├── lib/
    │   ├── utils.ts            # cn() helper (clsx + tailwind-merge)
    │   ├── constants.ts        # SIDEBAR_WIDTH, TOPBAR_HEIGHT, PUBLIC_PAGES
    │   └── navigation.ts       # NavItem/NavSection types + menu configs
    │
    ├── services/
    │   ├── api-client.ts       # Core fetch wrapper (credentials: same-origin)
    │   └── modules/            # 24 Canvas API modules
    │       ├── users.ts        # getSelf, getProfile, getTodo, etc.
    │       ├── courses.ts      # listCourses, getCourse, getTabs, etc.
    │       ├── assignments.ts  # list, get, groups, submit, rubric, peer reviews
    │       ├── modules.ts      # list, items, markDone, itemSequence
    │       ├── grades.ts       # enrollments, assignmentGroupsWithGrades
    │       ├── discussions.ts  # list, get, fullThread, postEntry, postReply
    │       ├── announcements.ts
    │       ├── pages.ts        # list, frontPage, get
    │       ├── files.ts        # rootFolder, listFiles, listFolders, quota
    │       ├── quizzes.ts      # listQuizzes, getQuiz
    │       ├── conversations.ts # list, get, create, addMessage
    │       ├── people.ts       # listPeople
    │       ├── groups.ts       # listGroups, getGroup
    │       ├── conferences.ts  # listConferences
    │       ├── admin.ts        # accounts, users, reports, terms, devKeys, etc.
    │       ├── notifications.ts # activityStream, channels, preferences
    │       ├── eportfolio.ts   # listPortfolios, getPortfolio
    │       ├── rubrics.ts      # listRubrics, getRubric
    │       ├── outcomes.ts     # outcomeGroups, results, rollups
    │       ├── calendar.ts     # calendarEvents, calendarAssignments
    │       ├── planner.ts      # plannerItems, overrides
    │       ├── collaborations.ts
    │       ├── contentMigrations.ts
    │       └── search.ts       # recipients, courses
    │
    ├── contexts/
    │   └── AuthContext.tsx      # User session management (login/logout/checkAuth)
    │
    ├── hooks/                  # 24 TanStack Query hooks
    │   ├── useAuth.ts          # Convenience wrapper for AuthContext
    │   ├── useCurrentUser.ts   # GET /api/v1/users/self/profile (5min stale)
    │   ├── useCourses.ts       # GET /api/v1/courses (10min stale)
    │   ├── useAssignments.ts   # useAssignments, useAssignment, useAssignmentGroups
    │   ├── useModules.ts       # useModules (5min stale)
    │   ├── useGrades.ts        # enrollments + assignment groups
    │   ├── useDiscussions.ts
    │   ├── useAnnouncements.ts
    │   ├── usePages.ts         # usePages, usePage (10min stale)
    │   ├── useFiles.ts         # files + folders queries
    │   ├── useQuizzes.ts
    │   ├── useConversations.ts # useConversations, useConversation
    │   ├── usePeople.ts
    │   ├── useGroups.ts
    │   ├── useConferences.ts
    │   ├── useAdmin.ts         # 8 hooks (accounts, users, reports, terms, etc.)
    │   ├── useNotifications.ts
    │   ├── useEPortfolio.ts
    │   ├── useRubrics.ts
    │   ├── useOutcomes.ts
    │   ├── useCalendar.ts
    │   ├── usePlanner.ts
    │   ├── useCollaborations.ts
    │   ├── useContentMigrations.ts
    │   └── useSearch.ts
    │
    ├── routes/
    │   ├── index.tsx           # createBrowserRouter (basename: /app, 49 routes)
    │   ├── ProtectedRoute.tsx  # Auth guard → redirect to /login
    │   └── PublicRoute.tsx     # Redirect to /dashboard if authenticated
    │
    ├── components/
    │   ├── ui/                 # 13 shadcn/ui components
    │   │   ├── button.tsx, input.tsx, card.tsx, avatar.tsx
    │   │   ├── badge.tsx, skeleton.tsx, sonner.tsx
    │   │   ├── dropdown-menu.tsx, dialog.tsx, sheet.tsx
    │   │   ├── tooltip.tsx, separator.tsx, scroll-area.tsx
    │   │
    │   ├── layout/             # App shell components
    │   │   ├── AppLayout.tsx   # Sidebar + TopBar + <Outlet />
    │   │   ├── Sidebar.tsx     # Context-aware nav (global/course/admin)
    │   │   ├── SidebarItem.tsx # Nav link with active state
    │   │   ├── SidebarSubmenu.tsx # Collapsible sub-menu
    │   │   ├── MobileSidebar.tsx  # Sheet drawer for <1024px
    │   │   ├── TopBar.tsx      # Search + notifications + avatar
    │   │   ├── NotificationDropdown.tsx
    │   │   └── UserMenu.tsx    # Avatar dropdown (profile, settings, logout)
    │   │
    │   ├── common/             # Reusable UI patterns
    │   │   ├── EmptyState.tsx  # Icon + heading + description + CTA
    │   │   ├── StatusPill.tsx  # Colored badge (submitted/graded/missing/etc.)
    │   │   ├── LoadingSkeleton.tsx # Skeleton variants (card/row/text/avatar)
    │   │   └── ErrorBoundary.tsx   # React error boundary
    │   │
    │   └── shared/             # Domain-specific components
    │       ├── CourseCard.tsx   # Course card with image, code, teachers
    │       ├── TodoItem.tsx    # Todo item with type icon + due date
    │       ├── AssignmentRow.tsx # Assignment with due date + status pill
    │       └── ModuleItem.tsx  # Module item with type icon + completion
    │
    └── pages/                  # 50 page components
        ├── LoginPage.tsx       # Split panel (gradient + form)
        ├── DashboardPage.tsx   # Welcome, courses, todo
        ├── NotFound.tsx        # 404
        ├── admin/              # 6 admin pages
        ├── analytics/          # 2 analytics pages
        ├── assignments/        # 2 pages (list + detail)
        ├── calendar/           # CalendarPage
        ├── conferences/        # ConferencesPage
        ├── courses/            # 5 pages (list, home, syllabus, announcements, all)
        ├── discussions/        # 2 pages (list + thread)
        ├── eportfolio/         # EPortfolioPage
        ├── files/              # FilesPage
        ├── gradebook/          # 2 pages (gradebook + speed grader)
        ├── grades/             # GradesPage
        ├── groups/             # GroupsPage
        ├── inbox/              # InboxPage (split pane)
        ├── modules/            # ModulesPage
        ├── outcomes/           # OutcomesPage
        ├── pages/              # 2 pages (list + view)
        ├── people/             # PeoplePage (with role filter)
        ├── planner/            # PlannerPage
        ├── profile/            # ProfilePage
        ├── quizzes/            # QuizzesPage
        ├── rubrics/            # RubricsPage
        ├── services/           # 6 service pages
        ├── settings/           # 2 settings pages
        └── utility/            # 4 utility pages
```

---

## Architecture Patterns

### 1. Data Flow

```
Canvas REST API (/api/v1/*)
        ↓
  api-client.ts (fetch + credentials: same-origin + pagination)
        ↓
  services/modules/*.ts (typed API functions)
        ↓
  hooks/use*.ts (TanStack Query with staleTime/caching)
        ↓
  Page Components (useQuery → loading/error/data states)
        ↓
  Shared Components (CourseCard, AssignmentRow, StatusPill, etc.)
```

### 2. Authentication

```
Browser → GET /api/v1/users/self/profile
  ├── 200 OK → AuthContext: isAuthenticated=true, user=data
  └── 401 → AuthContext: isAuthenticated=false → Navigate to /login

Login: POST /login/canvas (form-encoded: pseudonym_session[unique_id], pseudonym_session[password])
Logout: DELETE /logout → Navigate to /login

Key: credentials: 'same-origin' on ALL fetch calls (Canvas session cookies)
```

### 3. Routing

```
createBrowserRouter (basename: '/app')
├── PublicRoute (no auth)
│   ├── /login → LoginPage
│   ├── /accessibility → AccessibilityPage
│   └── /terms → TermsOfServicePage
├── ProtectedRoute → AppLayout (Sidebar + TopBar + Outlet)
│   ├── / → redirect to /dashboard
│   ├── /dashboard → DashboardPage
│   ├── /courses → CoursesPage
│   ├── /courses/:courseId → CourseHomePage
│   ├── /courses/:courseId/* → 28 course-scoped routes
│   ├── /inbox, /profile, /calendar, /planner, /settings, etc.
│   └── /admin/* → 6 admin routes
└── * → NotFoundPage
```

### 4. Sidebar Context Switching

```
useLocation() + useParams()
├── Route matches /courses/:courseId/* → Course Nav
│   (Home, Announcements, Assignments, Quizzes, Discussions, Modules,
│    Grades, Pages, Files, People, Syllabus, Assessment, Collaborate)
├── Route matches /admin/* → Admin Nav (future)
└── All other routes → Global Nav
    (Dashboard, Courses, Planner, Communication, Learning, Community,
     Schedule, Insights, Account, Help Center, Admin)
```

### 5. Component Hierarchy

```
<App>
  <QueryClientProvider>
    <AuthProvider>
      <RouterProvider>
        <ProtectedRoute>
          <AppLayout>
            <Sidebar />          # Fixed left 240px, dark teal gradient
            <main>
              <TopBar />         # Sticky top, search + notifications
              <Outlet />         # Page component renders here
            </main>
          </AppLayout>
        </ProtectedRoute>
      </RouterProvider>
    </AuthProvider>
  </QueryClientProvider>
</App>
```

---

## Design System

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| primary-900 | `#0F2922` | Sidebar gradient end |
| primary-800 | `#163B32` | Sidebar gradient start, headings |
| primary-700 | `#1E4D42` | Hover states |
| accent-green | `#2DB88A` | Active states, success, CTAs |
| accent-orange | `#FF6B35` | Warnings, secondary CTAs |
| accent-blue | `#3B82F6` | Links, info |
| page | `#D4EFE6` | Content area background |
| surface | `#FFFFFF` | Cards, panels |

### Typography
- **Primary:** Inter (body text)
- **Secondary:** Poppins (headings, sidebar)
- **Sizes:** 11px (caption) to 56px (display)

### Layout
- **Sidebar:** 240px fixed left, `gradient-sidebar` class
- **TopBar:** 64px sticky top
- **Content:** `ml-[240px]` on desktop, full-width on mobile
- **Breakpoint:** 1024px (sidebar → Sheet drawer)

### Key CSS Classes
- `.gradient-sidebar` — Dark teal linear-gradient
- `.gradient-menu-active` — Green gradient for active nav item
- `.gradient-cta` — Orange gradient for CTA buttons

---

## API Client

### Core (`api-client.ts`)
```typescript
apiGet<T>(path, params?)    // GET with query params
apiPost<T>(path, body?)     // POST with JSON body
apiPut<T>(path, body?)      // PUT with JSON body
apiDelete<T>(path)          // DELETE
apiGetAll<T>(path, params?) // Paginated GET (follows Link headers)
```

- All requests use `credentials: 'same-origin'`
- Array params expand to `key[]=val1&key[]=val2`
- Link header pagination parsing
- Throws `ApiError` with `status`, `isUnauthorized`, `isNotFound`

### Caching Strategy (TanStack Query)
| Data Type | staleTime | Rationale |
|-----------|-----------|-----------|
| User profile | 5 min | Changes rarely |
| Course list | 10 min | Enrollments stable |
| Modules | 5 min | Content updates moderately |
| Pages | 10 min | Wiki content stable |
| Assignments | 5 min | Due dates matter |
| Conversations | 2 min | Messages change frequently |

---

## Deployment

### Build
```bash
npm run build  # tsc -b && vite build → dist/
```

### Deploy to Server
```bash
ssh root@148.230.111.247 'rm -rf /opt/canvas-lms/deploy/spa/app/*'
scp -r dist/* root@148.230.111.247:/opt/canvas-lms/deploy/spa/app/
ssh root@148.230.111.247 'docker exec canvas-lms-nginx-1 nginx -s reload'
```

### Nginx
- React SPA at `/app/` (root: `/usr/share/nginx/spa`, try_files → `/app/index.html`)
- Canvas API at `/api/*` (proxy to web:80)
- Static HTML at `/` (legacy, parallel deployment)

---

## Testing

### Screenshot Verification
```bash
node capture-react.cjs  # Puppeteer captures all pages
```

### Browser Testing
- Navigate to https://fineract.us/app/
- Login: admin@redefiners.org / ReDefiners2024!
- Verify sidebar, data loading, navigation

### Unit Tests (planned)
- Vitest + @testing-library/react + MSW
- AuthContext, API client, Sidebar, ProtectedRoute
