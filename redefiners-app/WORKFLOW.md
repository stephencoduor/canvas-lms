# ReDefiners Canvas LMS — Development Workflow & Pipeline

## Overview

This document captures the end-to-end workflow used to build the ReDefiners custom Canvas LMS frontend, from static HTML prototypes through React SPA deployment.

---

## Pipeline Stages

```
1. DESIGN (ReDefiners HTML)
   └→ 2. ANALYZE (Canvas LMS API + Frontend)
       └→ 3. PLAN (SpecKit Pipeline)
           └→ 4. BUILD (React SPA in Batches)
               └→ 5. TEST (Screenshots + Browser Verification)
                   └→ 6. DEPLOY (Server + Nginx)
                       └→ 7. VERIFY (Live Site Testing)
                           └→ 8. COMMIT & PUSH (Git + PR)
```

---

## Stage 1: Design (Static HTML Prototypes)

**Repository:** `stephencoduor/redefiners`
**Branches:** `main` (teal theme), `theme/modern-dark-accent` (dark accent theme)

### What we built:
- 241 static HTML pages covering all Canvas LMS features
- Design system: Tailwind CSS (tw- prefix) + shadcn/ui (CSS-only) + Bootstrap 5
- Fonts: Poppins + Inter
- Palette: Dark teal sidebar (#0F2922), mint background (#D4EFE6), accent green (#2DB88A)
- 6 vanilla JS modules: api.js, app.js, render.js, sidebar.js, router.js, auth.js

### Key files:
- `ReDefiners/*.html` — 241 page designs
- `ReDefiners/css/tokens.css` — Design tokens (colors, spacing, typography)
- `ReDefiners/css/shadcn.css` — Component styles
- `ReDefiners/css/tailwind-config.js` — Tailwind configuration
- `ReDefiners/js/api.js` — Canvas API client (23 sub-modules, 150+ methods)
- `ReDefiners/js/sidebar.js` — Context-aware navigation (global/course/admin)

### Process:
1. Created initial 38 pages matching core Canvas features
2. Analyzed Canvas LMS feature modules (233 total)
3. Generated remaining pages to reach 241 total
4. Added dynamic sidebar injection for generated pages
5. Wired all pages with router.js, auth.js, sidebar.js, app.js
6. Deployed as static HTML at https://fineract.us via Nginx

---

## Stage 2: Analyze

### Canvas LMS Analysis:
- Mapped all 233 Canvas feature modules in `ui/features/`
- Documented all Canvas REST API endpoints (150+)
- Identified Canvas auth mechanism (session cookies, not Bearer tokens)
- Analyzed Canvas deployment (Rails 8 + Passenger + Docker)

### ReDefiners Analysis:
- Documented all 23 API sub-modules with methods and endpoints
- Mapped all 99 page initializer functions in app.js
- Documented sidebar menu structure (8 sections, 50+ sub-items)
- Cataloged render.js component methods (25 methods)
- Extracted complete design system specification

### Outputs:
- `CANVAS_API_DOCUMENTATION.md` — Full API reference
- `CANVAS_API_CATALOG.md` — Endpoint catalog
- `DESIGN_SYSTEM.md` — Design system specification
- `PAGE_INVENTORY.md` — Page spec with API endpoints
- `TECHNICAL_DOCS.md` — Technical documentation

---

## Stage 3: Plan (SpecKit Pipeline)

Using [github/spec-kit](https://github.com/github/spec-kit) pipeline:

```
/speckit.constitution  → Define immutable principles and constraints
/speckit.specify       → Generate specifications per batch
/speckit.clarify       → Resolve questions before implementation
/speckit.plan          → Create implementation plan with effort estimates
/speckit.tasks         → Break into atomic tasks with dependencies
/speckit.analyze       → Risk analysis and dependency graph
/speckit.checklist     → Pre/post implementation verification checklist
/speckit.implement     → Execute tasks in dependency order
```

### Constitution (immutable):
- Stack: Vite + React 18 + TypeScript + Tailwind v4 + shadcn/ui + React Router 7 + TanStack Query v5
- Auth: Canvas session cookies (`credentials: 'same-origin'`), no Bearer tokens
- Deploy: Nginx static SPA at `/app/` on fineract.us
- Constraint: Must preserve exact visual design from HTML mockups
- Constraint: Must not modify Canvas LMS backend code
- Constraint: Must coexist with static HTML during migration

### Plan file: `.claude/plans/validated-meandering-salamander.md`

---

## Stage 4: Build (React SPA in Batches)

**Project:** `D:\canvas-lms\redefiners-app\`
**Branch:** `feature/react-frontend`

### Batch Strategy:

| Batch | Pages | Focus | Effort |
|-------|-------|-------|--------|
| **1** | 3 | Core Shell: Scaffold, Auth, Router, Sidebar, TopBar, Login, Dashboard | ~12h |
| **2** | 10 | Course Content: Courses, Assignments, Modules, Grades, Pages, Files, Syllabus | ~8h |
| **3** | 8 | Communication: Discussions, Quizzes, Inbox, People, Groups, Conferences, Profile | ~6h |
| **4** | ~10 | Admin: Dashboard, User Management, Reports, Permissions | Pending |
| **5** | ~10 | Scheduling: Calendar, Planner, Events, Attendance | Pending |
| **6** | ~10 | Student Services: Tutoring, Mentoring, Certificates, Analytics | Pending |
| **7** | ~40 | Remaining routes to full coverage | Pending |

### Per-Batch Workflow:

```
1. Create API service modules (port from ReDefiners/js/api.js)
2. Create TanStack Query hooks (replace manual cache)
3. Create page components (port from ReDefiners HTML + app.js initializers)
4. Create shared components (port from render.js)
5. Update routes in src/routes/index.tsx
6. Build: npm run build (must pass tsc + vite)
7. Deploy to server
8. Test with screenshots (Puppeteer) + browser verification
9. Commit and push to feature/react-frontend
```

### Parallel Agent Strategy:
- Launch 2-3 agents in parallel for independent work
- Agent 1: API modules + types + hooks
- Agent 2: Page components + routes + shared components
- Verify build after agents complete, fix any TS errors

---

## Stage 5: Test

### Screenshot Capture (Puppeteer):
```bash
node capture-react.cjs
```
- Logs into Canvas via `/login/canvas` first
- Captures each page with 3-4 second wait for React render + API calls
- Saves to `react-screenshots/` directory
- Named: `B{batch}-{number}-{page}.png`

### Browser Verification (Claude in Chrome):
- Navigate to each page on fineract.us/app/
- Take screenshots via MCP tools
- Check console for errors
- Verify real Canvas API data loads

### Verification Checklist:
- [ ] Sidebar renders with dark teal gradient
- [ ] Active page highlighted with green gradient
- [ ] Context switches between global and course navigation
- [ ] Real data from Canvas API (not placeholder)
- [ ] Loading skeletons shown during fetch
- [ ] Empty states shown when no data
- [ ] Mobile responsive (sidebar drawer at <1024px)

---

## Stage 6: Deploy

### Server Details:
- **Host:** Hostinger VPS (148.230.111.247)
- **SSH:** `ssh -i ~/.ssh/hostinger-new root@148.230.111.247`
- **Domain:** fineract.us (SSL via Let's Encrypt)
- **Stack:** Docker Compose (web, jobs, postgres, redis, nginx, certbot)

### Deployment Commands:
```bash
# Build locally
cd redefiners-app
npm run build

# Deploy to server
ssh -i ~/.ssh/hostinger-new root@148.230.111.247 'rm -rf /opt/canvas-lms/deploy/spa/app/*'
scp -r -i ~/.ssh/hostinger-new dist/* root@148.230.111.247:/opt/canvas-lms/deploy/spa/app/
ssh -i ~/.ssh/hostinger-new root@148.230.111.247 'docker exec canvas-lms-nginx-1 nginx -s reload'
```

### Nginx Architecture:
```
/app/*          → React SPA (root: /usr/share/nginx/spa)
/               → Static HTML (root: /usr/share/nginx/redefiners)
/api/*          → Canvas Rails backend (proxy: web:80)
/login/*        → Canvas auth (proxy: web:80)
/health_check   → Canvas health (proxy: web:80)
```

### Docker Volumes:
- `./spa:/usr/share/nginx/spa:ro` — React SPA build
- `./redefiners:/usr/share/nginx/redefiners:ro` — Static HTML pages
- `./redis.yml:/usr/src/app/config/redis.yml:ro` — Fixed Redis config

---

## Stage 7: Verify (Live Site)

### URLs:
- **React SPA:** https://fineract.us/app/
- **Static HTML:** https://fineract.us/
- **Canvas Login:** https://fineract.us/login/canvas
- **Canvas API:** https://fineract.us/api/v1/

### Login Credentials:
- **Admin:** admin@redefiners.org / ReDefiners2024!

### Data Verification:
```bash
ssh -i ~/.ssh/hostinger-new root@148.230.111.247 'docker exec canvas-lms-web-1 bundle exec rails runner "
puts \"Users: #{User.count}\"
puts \"Courses: #{Course.where(workflow_state: :available).count}\"
puts \"Assignments: #{Assignment.count}\"
puts \"Submissions: #{Submission.where.not(score: nil).count}\"
" 2>&1 | grep -v warning'
```

### Current Data:
| Data | Count |
|---|---|
| Users | 34 (2 admin, 5 teachers, 24 students) |
| Courses | 10 |
| Assignments | 61 |
| Graded Submissions | 1,014 |
| Discussion Topics | 26 |
| Announcements | 12 |
| Modules | 10 (38 items) |
| Calendar Events | 12 |
| Wiki Pages | 50 |
| Conversations | 10 |

**Rule:** Existing seeded data must NOT be deleted without explicit permission. New data can be added using seed scripts (seed x5 pattern).

---

## Stage 8: Commit & Push

### Git Workflow:
```bash
cd redefiners-app
git add -A
git commit -m "Batch N: Description

Details of what was added...

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
git push origin HEAD:feature/react-frontend
```

### Branch Strategy:
- `feature/react-frontend` — React SPA development
- `theme/modern-dark-accent` — Static HTML (dark accent theme)
- `main` — Static HTML (teal theme)

### Commit Message Format:
```
Batch N: Short description

API Modules (N new):
- module.ts: functions

TanStack Query Hooks (N new):
- useHook descriptions

Page Components (N new):
- PageName: description

Routes: N new
Verified on fineract.us/app/: key findings

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
```

---

## Key Architecture Decisions

| Decision | Choice | Reason |
|---|---|---|
| Separate Vite project | `redefiners-app/` | Avoids Canvas rspack complexity |
| No `tw-` prefix | Dropped | No Bootstrap conflicts in React |
| Lucide icons | Replace Font Awesome | shadcn native, tree-shakes |
| Path routing | `/courses/:id/...` | Cleaner than `?course_id=` |
| TanStack Query | Replace `_cache` Map | Auto caching, refetch, devtools |
| Parallel deploy | `/app/` + existing `/` | Zero disruption during migration |
| Session cookies | `credentials: same-origin` | Canvas native auth, no tokens |
| basename: '/app' | React Router config | SPA served at /app/ subpath |

---

## Troubleshooting

### SSH Connection:
- Key: `~/.ssh/hostinger-new`
- Hostinger external firewall must allow port 22
- UFW inside VPS also needs port 22 open

### Canvas Web Container Unhealthy:
- Check: `docker logs canvas-lms-web-1 --tail 20`
- Common: redis.yml format (`url:` not `servers:`)
- Fix: Mount corrected redis.yml via Docker volume

### React App Blank Page:
- Check: Browser console for JS errors
- Common: basename mismatch in React Router
- Common: Asset paths need `import.meta.env.BASE_URL` prefix

### Sidebar Not Rendering:
- Check: AppLayout imports real Sidebar component (not stub)
- Check: `gradient-sidebar` CSS class defined in index.css
- Check: sidebar.js `_render()` finds `.menu-links` or `#sidebar-root`

---

## File Structure

```
D:\canvas-lms\
├── ReDefiners/              # Static HTML prototype (241 pages)
│   ├── *.html
│   ├── css/tokens.css, shadcn.css, tailwind-config.js
│   ├── js/api.js, app.js, render.js, sidebar.js, router.js, auth.js
│   ├── Images/
│   ├── screenshots/deployed/  # 80 static HTML screenshots
│   └── seed_demo.rb, seed_demo_extra.rb
├── redefiners-app/          # React SPA (Vite + TypeScript)
│   ├── src/
│   │   ├── components/ui/   # 13 shadcn/ui components
│   │   ├── components/layout/ # Sidebar, TopBar, AppLayout
│   │   ├── components/common/ # EmptyState, StatusPill, etc.
│   │   ├── components/shared/ # CourseCard, TodoItem, etc.
│   │   ├── contexts/         # AuthContext
│   │   ├── hooks/            # 14 TanStack Query hooks
│   │   ├── services/modules/ # 14 Canvas API modules
│   │   ├── pages/            # 21 page components
│   │   ├── routes/           # Router config + guards
│   │   ├── types/canvas.ts   # 25+ Canvas API types
│   │   └── lib/navigation.ts # Sidebar menu config
│   ├── react-screenshots/   # Verification screenshots
│   └── dist/                # Production build
├── deploy/
│   ├── docker-compose.production.yml
│   ├── nginx/nginx.conf
│   ├── .env.production
│   ├── redefiners/          # Static HTML (mounted to Nginx)
│   ├── spa/app/             # React SPA build (mounted to Nginx)
│   └── redis.yml            # Fixed Redis config
└── WORKFLOW.md              # This file
```
