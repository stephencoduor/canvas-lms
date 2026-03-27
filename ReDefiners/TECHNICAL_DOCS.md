# ReDefiners - Technical Documentation

> Custom Canvas LMS Frontend/UI Template
> Version: 2.0.0
> Last Updated: 2026-03-19

---

## Documentation Suite

This is the master technical document. It references the following companion documents:

| Document | Purpose |
|---|---|
| **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** | Complete design tokens, color system, typography, spacing, components, and accessibility guidelines |
| **[CANVAS_BRIDGE.md](CANVAS_BRIDGE.md)** | Full gap analysis: existing pages vs Canvas LMS, enhancement specs for each page, all 30+ missing pages specified with wireframes |
| **[PAGE_INVENTORY.md](PAGE_INVENTORY.md)** | Complete 39-page inventory with layout templates, Canvas API endpoints, components, roles, and priorities per page |
| **[CANVAS_API_CATALOG.md](CANVAS_API_CATALOG.md)** | Exhaustive Canvas REST API endpoint catalog (38+ families, 400+ endpoints) |
| **[RUNBOOK.md](RUNBOOK.md)** | Operational runbook: setup, deployment, monitoring, troubleshooting, incident response, maintenance |

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture](#2-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Page Inventory & Component Map](#4-page-inventory--component-map)
5. [Canvas LMS Integration Guide](#5-canvas-lms-integration-guide)
6. [API Contract & Data Mapping](#6-api-contract--data-mapping)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [State Management](#8-state-management)
9. [Styling & Design System](#9-styling--design-system)
10. [Responsive Behavior](#10-responsive-behavior)
11. [File & Asset Inventory](#11-file--asset-inventory)
12. [Gap Analysis: Current State vs Production](#12-gap-analysis-current-state-vs-production)
13. [Migration Path to Production](#13-migration-path-to-production)
14. [Spec-Kit Pipeline Integration](#14-spec-kit-pipeline-integration)

---

## 1. System Overview

### Purpose

ReDefiners is a static HTML/CSS/JS frontend template that provides a custom UI layer for Canvas LMS. It replaces the default Canvas interface with a branded, purpose-built experience targeting language learning programs. The template covers the core LMS workflows: login, dashboard, courses, classes, calendar, announcements, messaging, and user profiles.

### Current State

| Aspect | Status |
|---|---|
| Frontend UI | Complete (static HTML/CSS/JS) |
| Canvas API integration | Not implemented |
| Authentication flow | Mocked (static form) |
| Backend/proxy server | Not implemented |
| State management | Inline jQuery handlers |
| Build pipeline | None (static files) |
| Deployment config | None |

### Target State

A fully functional custom Canvas LMS frontend where:
- Users authenticate via Canvas OAuth2
- All data (courses, assignments, grades, messages) is fetched from Canvas REST/GraphQL API
- A server-side proxy handles CORS and token management
- The UI dynamically renders Canvas data into the existing template layout

---

## 2. Architecture

### Current Architecture (Static Template)

```
┌──────────────────────────────────┐
│         Browser (Client)         │
│                                  │
│  login.html ──► dashboard.html   │
│       ├── courses.html           │
│       ├── classroom.html         │
│       ├── class.html             │
│       ├── calendar.html          │
│       ├── announcement.html      │
│       ├── inbox.html             │
│       └── profile.html           │
│                                  │
│  styles.css  +  Images/          │
│  Bootstrap 5 + jQuery + FA7      │
└──────────────────────────────────┘
```

### Target Architecture (Canvas-Integrated)

```
┌───────────────┐      ┌───────────────────┐      ┌──────────────────┐
│    Browser     │◄────►│  Proxy Server     │◄────►│   Canvas LMS     │
│  (SPA/MPA)    │      │  (Node/Express)   │      │   Instance       │
│               │      │                   │      │                  │
│  React/Vue or │ HTTP │  - OAuth2 flow    │ HTTPS│  REST API        │
│  Enhanced HTML│◄────►│  - Token store    │◄────►│  /api/v1/*       │
│               │      │  - CORS proxy     │      │                  │
│  styles.css   │      │  - Rate limiting  │      │  GraphQL API     │
│  + components │      │  - Session mgmt   │      │  /api/graphql    │
└───────────────┘      └───────────────────┘      └──────────────────┘
                                                         │
                              ┌───────────────────┐      │
                              │  LTI 1.3 Launch   │◄─────┘
                              │  (Alternative)    │
                              └───────────────────┘
```

### Why a Proxy is Required

Canvas hosted instances do **not** return `Access-Control-Allow-Origin` headers. Browser-based API calls from a different origin will fail. A server-side proxy is mandatory for any custom frontend deployed on a separate domain.

---

## 3. Technology Stack

### Current Dependencies

| Library | Version | CDN | Purpose |
|---|---|---|---|
| Bootstrap | 5 (beta2/beta3) | jsdelivr/stackpath | Layout, grid, components |
| jQuery | 3.5.1 | code.jquery.com | DOM manipulation, events |
| Font Awesome | 7 | kit.fontawesome.com | Iconography |
| Google Fonts | Poppins 300 | fonts.googleapis.com | Typography |
| Materialize CSS | latest | cdnjs.cloudflare.com | Calendar, sidenav |
| Popper.js | 2 | cdn.jsdelivr.net | Bootstrap tooltips/popovers |

### Recommended Additions for Production

| Tool | Purpose |
|---|---|
| Node.js + Express | Backend proxy server |
| dotenv | Environment variable management |
| express-session / passport | Session and OAuth2 management |
| axios / node-fetch | Server-side HTTP client for Canvas API |
| Vite or Webpack | Asset bundling, code splitting |
| ESLint + Prettier | Code quality |
| Jest or Vitest | Testing |

---

## 4. Page Inventory & Component Map

### Pages

| File | Route Purpose | Canvas API Mapping | Key UI Elements |
|---|---|---|---|
| `login.html` | Authentication entry | OAuth2 redirect | Email/password form, Google SSO button, branding panel |
| `dashboard.html` | Main hub | `/api/v1/users/self`, `/api/v1/courses`, `/api/v1/calendar_events` | Welcome banner, progress bars, assignments, calendar widget, recent chats |
| `courses.html` | Course catalog | `/api/v1/courses` | Course carousel, instructor cards, progress visualization |
| `classroom.html` | Active class view | `/api/v1/courses/:id` | Class content, media |
| `class.html` | Class detail | `/api/v1/courses/:id`, `/api/v1/courses/:id/assignments` | Video carousel, course details, lessons |
| `calendar.html` | Schedule | `/api/v1/calendar_events` | Month view, event list, add event form |
| `announcement.html` | Notifications | `/api/v1/announcements` | Announcement table, pagination, action buttons |
| `inbox.html` | Messaging | `/api/v1/conversations` | Split-pane inbox, conversation thread, media gallery |
| `profile.html` | User profile | `/api/v1/users/self/profile` | User card, progress bars, notes, enrollment info |

### Shared Components (repeated across pages)

| Component | Location | Description |
|---|---|---|
| Left Sidebar | All pages (post-login) | Fixed navigation with logo, nav links (Dashboard, Courses, Calendar, Inbox, Announcements), settings, logout |
| Top Bar | All pages (post-login) | Search bar, notification bell, user avatar |
| Right Sidebar | dashboard.html, class.html | Calendar widget, recent chats |
| Mobile Menu | All pages (responsive) | Hamburger icon triggers slide-in sidebar |

### Navigation Flow

```
login.html
    │
    ▼
dashboard.html ◄──► courses.html ──► class.html
    │                                    │
    ├──► calendar.html                   ▼
    ├──► announcement.html          classroom.html
    ├──► inbox.html
    └──► profile.html
```

---

## 5. Canvas LMS Integration Guide

### Integration Strategy Options

| Strategy | Pros | Cons | Recommended For |
|---|---|---|---|
| **A. Standalone + API Proxy** | Full UI control, independent deployment | Requires proxy server, separate auth | This project (primary recommendation) |
| **B. LTI 1.3 Embedded Tool** | SSO via Canvas, grade passback | Runs in iframe, limited layout control | Supplementary tools within Canvas |
| **C. Canvas Theme Override** | No separate hosting | Fragile, breaks on Canvas updates | Branding-only changes |

### Recommended Path: Standalone + API Proxy

#### Step 1: Set Up Backend Proxy

```
project/
├── server/
│   ├── index.js          # Express server entry
│   ├── routes/
│   │   ├── auth.js       # OAuth2 flow handlers
│   │   └── proxy.js      # Canvas API proxy routes
│   ├── middleware/
│   │   ├── auth.js       # Session validation
│   │   └── rateLimit.js  # Rate limit forwarding
│   └── config.js         # Environment config
├── public/               # Static frontend files (current HTML/CSS/JS)
│   ├── login.html
│   ├── dashboard.html
│   ├── ...
│   ├── styles.css
│   └── Images/
├── .env                  # Environment variables
└── package.json
```

#### Step 2: Environment Configuration

```env
# .env
CANVAS_BASE_URL=https://your-institution.instructure.com
CANVAS_CLIENT_ID=10000000000001
CANVAS_CLIENT_SECRET=your_client_secret_here
CANVAS_REDIRECT_URI=https://your-app.com/auth/callback
SESSION_SECRET=random-secure-string
PORT=3000
NODE_ENV=production
```

#### Step 3: OAuth2 Flow

```
User clicks "Login"
    │
    ▼
Redirect to Canvas:
  GET {CANVAS_BASE_URL}/login/oauth2/auth
    ?client_id={CLIENT_ID}
    &response_type=code
    &redirect_uri={REDIRECT_URI}
    &state={csrf_token}
    │
    ▼
User authenticates on Canvas
    │
    ▼
Canvas redirects back:
  GET {REDIRECT_URI}?code={auth_code}&state={csrf_token}
    │
    ▼
Server exchanges code for token:
  POST {CANVAS_BASE_URL}/login/oauth2/token
    grant_type=authorization_code
    &client_id={CLIENT_ID}
    &client_secret={CLIENT_SECRET}
    &redirect_uri={REDIRECT_URI}
    &code={auth_code}
    │
    ▼
Server stores access_token + refresh_token in session
    │
    ▼
Redirect user to dashboard.html
```

#### Step 4: Proxy Pattern

All frontend API calls go through the proxy, which attaches the Bearer token:

```
Frontend:  GET /api/courses
    │
    ▼
Proxy:     GET {CANVAS_BASE_URL}/api/v1/courses
           Authorization: Bearer {stored_access_token}
    │
    ▼
Canvas API response → forwarded to frontend
```

---

## 6. API Contract & Data Mapping

### Dashboard (dashboard.html)

| UI Element | Canvas Endpoint | Method | Response Fields Used |
|---|---|---|---|
| Welcome message | `/api/v1/users/self` | GET | `name`, `short_name` |
| Course progress bars | `/api/v1/courses?include[]=total_scores` | GET | `enrollments[].grades` |
| Assignments list | `/api/v1/courses/:id/assignments?order_by=due_at` | GET | `name`, `due_at`, `submission_types` |
| Assignment submit | `/api/v1/courses/:id/assignments/:id/submissions` | POST | `submission_type`, `body` |
| Calendar widget | `/api/v1/calendar_events?start_date=&end_date=` | GET | `title`, `start_at`, `end_at` |
| Recent discussions | `/api/v1/courses/:id/discussion_topics?order_by=recent_activity` | GET | `title`, `message`, `author` |

### Courses (courses.html)

| UI Element | Canvas Endpoint | Method | Response Fields Used |
|---|---|---|---|
| Course carousel | `/api/v1/courses?include[]=term&include[]=teachers` | GET | `name`, `course_code`, `image_download_url`, `teachers[].name` |
| Course detail | `/api/v1/courses/:id?include[]=syllabus_body` | GET | `name`, `syllabus_body`, `start_at`, `end_at` |
| Lessons list | `/api/v1/courses/:id/modules?include[]=items` | GET | `name`, `items[].title`, `items[].type` |

### Calendar (calendar.html)

| UI Element | Canvas Endpoint | Method | Response Fields Used |
|---|---|---|---|
| Month events | `/api/v1/calendar_events?type=event&start_date=&end_date=` | GET | `title`, `start_at`, `end_at`, `description` |
| Assignment due dates | `/api/v1/calendar_events?type=assignment&start_date=&end_date=` | GET | `title`, `assignment.due_at` |
| Add event | `/api/v1/calendar_events` | POST | `calendar_event[title]`, `calendar_event[start_at]` |

### Announcements (announcement.html)

| UI Element | Canvas Endpoint | Method | Response Fields Used |
|---|---|---|---|
| Announcement table | `/api/v1/announcements?context_codes[]=course_:id` | GET | `title`, `message`, `posted_at`, `author.display_name` |

### Inbox (inbox.html)

| UI Element | Canvas Endpoint | Method | Response Fields Used |
|---|---|---|---|
| Conversation list | `/api/v1/conversations` | GET | `subject`, `last_message`, `participants[].name`, `last_message_at` |
| Conversation thread | `/api/v1/conversations/:id` | GET | `messages[].body`, `messages[].author_id`, `messages[].created_at` |
| Send message | `/api/v1/conversations/:id/add_message` | POST | `body`, `attachment_ids[]` |
| New conversation | `/api/v1/conversations` | POST | `recipients[]`, `subject`, `body` |

### Profile (profile.html)

| UI Element | Canvas Endpoint | Method | Response Fields Used |
|---|---|---|---|
| User info card | `/api/v1/users/self/profile` | GET | `name`, `primary_email`, `bio`, `avatar_url`, `locale` |
| Enrollments | `/api/v1/users/self/enrollments` | GET | `course_id`, `type`, `enrollment_state`, `created_at` |

### New Pages — Data Mapping (Tier 1-2)

> For existing pages data mapping, see above. For all pages with full endpoint details see `PAGE_INVENTORY.md`.

#### Assignments (assignments.html, assignment-detail.html)

| UI Element | Canvas Endpoint | Method | Response Fields Used |
|---|---|---|---|
| Assignment groups | `/api/v1/courses/:id/assignment_groups?include[]=assignments&include[]=submission` | GET | `name`, `group_weight`, `assignments[]` |
| Assignment list | `/api/v1/courses/:id/assignments?include[]=submission&order_by=position` | GET | `name`, `due_at`, `points_possible`, `submission_types[]`, `submission.workflow_state` |
| Assignment detail | `/api/v1/courses/:id/assignments/:id` | GET | `name`, `description`, `due_at`, `points_possible`, `rubric`, `allowed_extensions` |
| Submission view | `/api/v1/courses/:id/assignments/:id/submissions/self` | GET | `score`, `grade`, `submitted_at`, `workflow_state`, `rubric_assessment` |
| Submit work | `/api/v1/courses/:id/assignments/:id/submissions` | POST | `submission_type`, `body`, `url`, `file_ids[]` |
| Rubric display | `/api/v1/courses/:id/rubrics/:id` | GET | `criteria[]`, `ratings[]`, `points` |
| Peer reviews | `/api/v1/courses/:id/assignments/:id/peer_reviews` | GET | `user_id`, `assessor_id`, `workflow_state` |

#### Grades (grades.html)

| UI Element | Canvas Endpoint | Method | Response Fields Used |
|---|---|---|---|
| Grade summary | `/api/v1/courses/:id/assignment_groups?include[]=assignments&include[]=submission` | GET | `assignments[].submission.score`, `assignments[].points_possible` |
| Total grade | `/api/v1/courses/:id/enrollments?user_id=self` | GET | `grades.current_score`, `grades.final_score`, `grades.current_grade` |
| Score statistics | `/api/v1/courses/:id/assignments?include[]=score_statistics` | GET | `score_statistics.mean`, `score_statistics.min`, `score_statistics.max` |

#### Modules (modules.html)

| UI Element | Canvas Endpoint | Method | Response Fields Used |
|---|---|---|---|
| Module list | `/api/v1/courses/:id/modules?include[]=items&include[]=content_details` | GET | `name`, `position`, `state`, `items_count`, `items_url`, `items[].title`, `items[].type`, `items[].content_id` |
| Module completion | `items[].completion_requirement` | — | `type` (must_view/must_submit/must_contribute/min_score), `completed` |
| Mark done | `PUT /api/v1/courses/:id/modules/:mid/items/:id/done` | PUT | — |
| Item sequence | `/api/v1/courses/:id/module_item_sequence` | GET | `items[].prev`, `items[].current`, `items[].next` |

#### Discussions (discussions.html, discussion-thread.html)

| UI Element | Canvas Endpoint | Method | Response Fields Used |
|---|---|---|---|
| Topic list | `/api/v1/courses/:id/discussion_topics` | GET | `title`, `message`, `posted_at`, `pinned`, `locked`, `unread_count`, `discussion_subentry_count`, `author` |
| Full thread | `/api/v1/courses/:id/discussion_topics/:id/view` | GET | `participants[]`, `view[]` (nested reply tree) |
| Post reply | `/api/v1/courses/:id/discussion_topics/:id/entries` | POST | `message` |
| Rate entry | `PUT .../entries/:id/rating` | PUT | `rating` (0 or 1) |
| Mark all read | `PUT .../discussion_topics/:id/read_all` | PUT | — |

#### Quizzes (quizzes.html, quiz-take.html)

| UI Element | Canvas Endpoint | Method | Response Fields Used |
|---|---|---|---|
| Quiz list | `/api/v1/courses/:id/quizzes` | GET | `title`, `quiz_type`, `due_at`, `points_possible`, `question_count`, `time_limit`, `allowed_attempts` |
| Start quiz | `POST .../quizzes/:id/submissions` | POST | `quiz_submission_id`, `attempt`, `end_at` |
| Get questions | `GET .../quizzes/:id/submissions/:id/questions` | GET | `quiz_questions[]` (all question types) |
| Answer question | `PUT .../quizzes/:id/submissions/:id/questions` | PUT | `quiz_questions[].answer` |
| Submit quiz | `POST .../quizzes/:id/submissions/:id/complete` | POST | `attempt`, `validation_token` |

#### Pages (pages.html, page-view.html)

| UI Element | Canvas Endpoint | Method | Response Fields Used |
|---|---|---|---|
| Page list | `/api/v1/courses/:id/pages?sort=title` | GET | `title`, `url`, `updated_at`, `published`, `front_page` |
| Front page | `/api/v1/courses/:id/front_page` | GET | `title`, `body`, `updated_at` |
| Page content | `/api/v1/courses/:id/pages/:url` | GET | `title`, `body`, `updated_at`, `editing_roles` |
| Revisions | `/api/v1/courses/:id/pages/:url/revisions` | GET | `revision_id`, `updated_at`, `edited_by` |

#### Files (files.html)

| UI Element | Canvas Endpoint | Method | Response Fields Used |
|---|---|---|---|
| Folder contents | `/api/v1/courses/:id/folders/:id/files` | GET | `display_name`, `size`, `content-type`, `created_at`, `updated_at`, `url` |
| Subfolders | `/api/v1/courses/:id/folders/:id/folders` | GET | `name`, `files_count`, `folders_count` |
| Storage quota | `/api/v1/courses/:id/files/quota` | GET | `quota`, `quota_used` |
| Upload file | `POST /api/v1/courses/:id/files` | POST | Three-step: initiate → upload → confirm |

### Canvas GraphQL API (Alternative)

Canvas also offers a GraphQL API at `/api/graphql` which can be more efficient for complex data fetching (fewer round-trips). Key queries:

```graphql
# Fetch dashboard data in a single request
query DashboardData {
  allCourses {
    id
    name
    courseCode
    term { name }
    enrollments {
      grades { currentScore }
    }
    assignmentsConnection(filter: { states: ["upcoming"] }) {
      nodes { name dueAt pointsPossible }
    }
  }
  legacyNode(type: "User", id: "self") {
    ... on User {
      name
      avatarUrl
      email
    }
  }
}
```

**GraphQL vs REST decision**: Use REST for standard CRUD operations. Use GraphQL when a page needs data from multiple related resources (e.g., dashboard needing courses + assignments + grades + user in one call).

### Pagination Handling

All list endpoints use Canvas's `Link` header pagination:

```
Link: <https://canvas.example.com/api/v1/courses?page=2&per_page=10>; rel="next",
      <https://canvas.example.com/api/v1/courses?page=1&per_page=10>; rel="first"
```

Parse the `Link` header and follow `rel="next"` until exhausted. Never construct pagination URLs manually.

### Rate Limiting

| Header | Meaning |
|---|---|
| `X-Request-Cost` | Cost of this request |
| `X-Rate-Limit-Remaining` | Remaining budget |

If `X-Rate-Limit-Remaining` approaches 0, implement exponential backoff. A `403` response indicates throttling.

---

## 7. Authentication & Authorization

### Current State

- `login.html` contains a static form that links directly to `dashboard.html`
- No token management, session handling, or role-based access

### Target Implementation

| Component | Implementation |
|---|---|
| Login initiation | Redirect to Canvas OAuth2 `/login/oauth2/auth` |
| Token exchange | Server-side POST to `/login/oauth2/token` |
| Token storage | Server-side session store (Redis recommended) |
| Token refresh | Server-side cron or on-demand refresh when token expires (1hr TTL) |
| Session cookie | httpOnly, secure, sameSite=strict |
| Logout | DELETE `/login/oauth2/token` + clear session |
| Google SSO | Handled by Canvas if configured in institution settings |

### Developer Key Setup (Canvas Admin)

1. Navigate to **Admin > Developer Keys > + Developer Key**
2. Select **API Key** type
3. Configure:
   - **Key Name**: ReDefiners Custom Frontend
   - **Redirect URIs**: `https://your-app.com/auth/callback`
   - **Enforce Scopes**: Enable and select only required scopes
4. Save and note the `client_id` (numeric) and `client_secret`
5. Set key state to **ON**

### Required OAuth2 Scopes (Full 39-Page Coverage)

Scopes organized by Tier priority (see CANVAS_BRIDGE.md Section 6):

```
# ═══════════════════════════════════════════
# TIER 1 — Core (Login, Dashboard, Courses, Assignments, Grades, Modules, Calendar, Inbox)
# ═══════════════════════════════════════════

# Users & Auth
url:GET|/api/v1/users/:user_id/profile
url:GET|/api/v1/users/self/activity_stream
url:GET|/api/v1/users/self/activity_stream/summary
url:GET|/api/v1/users/self/todo
url:GET|/api/v1/users/self/upcoming_events
url:PUT|/api/v1/users/:id/settings
url:GET|/api/v1/users/:id/colors/:asset_string
url:PUT|/api/v1/users/:id/colors/:asset_string
url:GET|/api/v1/users/:id/dashboard_positions
url:PUT|/api/v1/users/:id/dashboard_positions

# Courses
url:GET|/api/v1/courses
url:GET|/api/v1/courses/:id
url:GET|/api/v1/courses/:course_id/tabs
url:GET|/api/v1/courses/:course_id/settings
url:GET|/api/v1/users/self/favorites/courses
url:POST|/api/v1/users/self/favorites/courses/:id
url:DELETE|/api/v1/users/self/favorites/courses/:id
url:GET|/api/v1/users/:id/course_nicknames
url:PUT|/api/v1/users/:id/course_nicknames/:id

# Assignments & Submissions
url:GET|/api/v1/courses/:course_id/assignments
url:GET|/api/v1/courses/:course_id/assignments/:id
url:GET|/api/v1/courses/:course_id/assignment_groups
url:POST|/api/v1/courses/:course_id/assignments/:id/submissions
url:GET|/api/v1/courses/:course_id/assignments/:id/submissions/:user_id
url:PUT|/api/v1/courses/:course_id/assignments/:id/submissions/:user_id

# Grades & Enrollments
url:GET|/api/v1/courses/:course_id/enrollments
url:GET|/api/v1/users/:user_id/enrollments

# Modules
url:GET|/api/v1/courses/:course_id/modules
url:GET|/api/v1/courses/:course_id/modules/:module_id/items
url:PUT|/api/v1/courses/:course_id/modules/:module_id/items/:id/done
url:GET|/api/v1/courses/:course_id/module_item_sequence

# Calendar
url:GET|/api/v1/calendar_events
url:POST|/api/v1/calendar_events
url:PUT|/api/v1/calendar_events/:id
url:DELETE|/api/v1/calendar_events/:id

# Conversations (Inbox)
url:GET|/api/v1/conversations
url:GET|/api/v1/conversations/:id
url:POST|/api/v1/conversations
url:PUT|/api/v1/conversations/:id
url:DELETE|/api/v1/conversations/:id
url:POST|/api/v1/conversations/:id/add_message
url:GET|/api/v1/search/recipients

# Planner
url:GET|/api/v1/planner/items
url:GET|/api/v1/planner/overrides
url:POST|/api/v1/planner/overrides
url:GET|/api/v1/planner_notes
url:POST|/api/v1/planner_notes

# ═══════════════════════════════════════════
# TIER 2 — Essential (Discussions, Announcements, Pages, Quizzes, Files, Profile, Syllabus)
# ═══════════════════════════════════════════

# Announcements
url:GET|/api/v1/announcements

# Discussion Topics
url:GET|/api/v1/courses/:course_id/discussion_topics
url:GET|/api/v1/courses/:course_id/discussion_topics/:topic_id
url:GET|/api/v1/courses/:course_id/discussion_topics/:topic_id/view
url:POST|/api/v1/courses/:course_id/discussion_topics
url:PUT|/api/v1/courses/:course_id/discussion_topics/:topic_id
url:POST|/api/v1/courses/:course_id/discussion_topics/:topic_id/entries
url:POST|/api/v1/courses/:course_id/discussion_topics/:topic_id/entries/:entry_id/replies
url:PUT|/api/v1/courses/:course_id/discussion_topics/:topic_id/read_all
url:PUT|/api/v1/courses/:course_id/discussion_topics/:topic_id/entries/:entry_id/rating

# Pages
url:GET|/api/v1/courses/:course_id/pages
url:GET|/api/v1/courses/:course_id/pages/:url
url:GET|/api/v1/courses/:course_id/front_page
url:GET|/api/v1/courses/:course_id/pages/:url/revisions
url:POST|/api/v1/courses/:course_id/pages
url:PUT|/api/v1/courses/:course_id/pages/:url

# Quizzes
url:GET|/api/v1/courses/:course_id/quizzes
url:GET|/api/v1/courses/:course_id/quizzes/:quiz_id
url:POST|/api/v1/courses/:course_id/quizzes/:quiz_id/submissions
url:GET|/api/v1/courses/:course_id/quizzes/:quiz_id/submissions/:id/questions
url:PUT|/api/v1/courses/:course_id/quizzes/:quiz_id/submissions/:id
url:POST|/api/v1/courses/:course_id/quizzes/:quiz_id/submissions/:id/complete

# Files
url:GET|/api/v1/courses/:course_id/files
url:GET|/api/v1/courses/:course_id/folders/:id
url:GET|/api/v1/courses/:course_id/folders/:id/files
url:GET|/api/v1/courses/:course_id/folders/:id/folders
url:POST|/api/v1/courses/:course_id/files
url:POST|/api/v1/courses/:course_id/folders
url:GET|/api/v1/files/:id
url:PUT|/api/v1/files/:id
url:DELETE|/api/v1/files/:id
url:GET|/api/v1/files/quota

# User profile
url:PUT|/api/v1/users/:id
url:GET|/api/v1/users/self/files
url:GET|/api/v1/users/self/folders/:id

# Rubrics
url:GET|/api/v1/courses/:course_id/rubrics
url:GET|/api/v1/courses/:course_id/rubrics/:id

# ═══════════════════════════════════════════
# TIER 3 — Extended (People, Outcomes, Groups, Conferences, Collaborations, ePortfolios, Settings)
# ═══════════════════════════════════════════

# People/Users in Course
url:GET|/api/v1/courses/:course_id/users
url:GET|/api/v1/courses/:course_id/sections

# Groups
url:GET|/api/v1/users/self/groups
url:GET|/api/v1/groups/:group_id
url:GET|/api/v1/groups/:group_id/users
url:GET|/api/v1/groups/:group_id/discussion_topics
url:GET|/api/v1/groups/:group_id/files
url:GET|/api/v1/groups/:group_id/pages
url:GET|/api/v1/courses/:course_id/group_categories
url:GET|/api/v1/group_categories/:group_category_id/groups

# Conferences
url:GET|/api/v1/courses/:course_id/conferences

# Collaborations
url:GET|/api/v1/courses/:course_id/collaborations

# Outcomes
url:GET|/api/v1/courses/:course_id/outcome_groups/:id/outcomes
url:GET|/api/v1/courses/:course_id/outcome_group_links
url:GET|/api/v1/outcomes/:id
url:GET|/api/v1/courses/:course_id/outcome_results

# ePortfolios
url:GET|/api/v1/users/self/eportfolios
url:GET|/api/v1/eportfolios/:id
url:GET|/api/v1/eportfolios/:id/pages

# Account/Settings
url:GET|/api/v1/users/self/communication_channels
url:GET|/api/v1/users/self/communication_channels/:id/notification_preferences
url:PUT|/api/v1/users/self/communication_channels/:id/notification_preferences/:notification

# Appointment Groups
url:GET|/api/v1/appointment_groups
url:POST|/api/v1/appointment_groups/:id/reservations

# Peer Reviews
url:GET|/api/v1/courses/:course_id/assignments/:id/peer_reviews

# ═══════════════════════════════════════════
# TIER 4 — Instructor-Only (Gradebook, SpeedGrader, Analytics, Course Settings, Migrations)
# ═══════════════════════════════════════════

# Gradebook
url:GET|/api/v1/courses/:course_id/students/submissions
url:POST|/api/v1/courses/:course_id/assignments/:id/submissions/update_grades
url:GET|/api/v1/courses/:course_id/custom_gradebook_columns
url:POST|/api/v1/courses/:course_id/assignments/:id/submissions/:user_id/comments

# Analytics
url:GET|/api/v1/courses/:course_id/analytics/activity
url:GET|/api/v1/courses/:course_id/analytics/assignments
url:GET|/api/v1/courses/:course_id/analytics/student_summaries
url:GET|/api/v1/courses/:course_id/analytics/users/:user_id/activity
url:GET|/api/v1/courses/:course_id/analytics/users/:user_id/assignments

# Course Settings (instructor)
url:PUT|/api/v1/courses/:id/settings
url:PUT|/api/v1/courses/:course_id/tabs/:id
url:GET|/api/v1/courses/:course_id/external_tools
url:GET|/api/v1/courses/:course_id/features

# Content Migrations
url:POST|/api/v1/courses/:course_id/content_migrations
url:GET|/api/v1/courses/:course_id/content_migrations/:id
url:GET|/api/v1/courses/:course_id/content_migrations/migrators
url:POST|/api/v1/courses/:course_id/content_exports

# Course Management
url:POST|/api/v1/courses/:course_id/enrollments
url:PUT|/api/v1/courses/:id
url:POST|/api/v1/courses/:course_id/rubrics
url:PUT|/api/v1/courses/:course_id/rubrics/:id
url:POST|/api/v1/courses/:course_id/assignments
url:PUT|/api/v1/courses/:course_id/assignments/:id
url:POST|/api/v1/courses/:course_id/discussion_topics
url:POST|/api/v1/courses/:course_id/quizzes
url:PUT|/api/v1/courses/:course_id/quizzes/:id
url:POST|/api/v1/courses/:course_id/modules
url:PUT|/api/v1/courses/:course_id/modules/:id
url:POST|/api/v1/courses/:course_id/modules/:module_id/items
```

**Scope Deployment Strategy**: Start with Tier 1 scopes only. Add tiers as pages are implemented. This follows the principle of least privilege and reduces OAuth consent screen complexity.

---

## 8. State Management

### Current Approach

All interactivity is handled by inline jQuery click handlers with direct DOM manipulation:

```javascript
// Assignment tab toggle (dashboard.html)
$(".assign-btn1").click(function(){
    $(".assign-inn1").addClass("active-inn");
    $(".assign-btn1 button").css({"background":"#0F4D61","color":"white"});
});

// Mobile sidebar toggle
$(".menu-icon").click(function(){
    $(".left-sidebar").animate({"margin-left": "0vw"}, 500);
});
```

### Recommended Migration

For production, introduce a lightweight data layer without full SPA rewrite:

```
Option A (Minimal): Vanilla JS modules + Fetch API
  - Extract API calls into /js/api.js
  - Extract DOM rendering into /js/render.js
  - Use localStorage for user session state
  - Keep existing HTML structure

Option B (Moderate): Alpine.js or HTMX
  - Add reactive data binding to existing HTML
  - Minimal learning curve, no build step required
  - Good fit for server-rendered MPA pattern

Option C (Full): React/Vue SPA
  - Complete rewrite with component architecture
  - Vuex/Redux for centralized state
  - Highest effort, highest maintainability
```

---

## 9. Styling & Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| Primary | `#0F4D61` | Headers, buttons, sidebar backgrounds |
| Primary Dark | `#00303F` | Hover states, active nav |
| Primary Light | `#668B91` | Muted text, secondary elements |
| Accent Cyan | `#00C9DB` | Progress bars, highlights |
| Accent Purple | `#7B2D8E` | Secondary indicators |
| Accent Orange | `#FF6B35` | Warnings, attention items |
| Background | `#F5F5F5` | Page background |
| Surface | `#FFFFFF` | Cards, panels |
| Text Primary | `#333333` | Body text |
| Text Secondary | `#666666` | Labels, captions |

### Typography

- **Font Family**: Poppins (Google Fonts), weight 300
- **Headings**: 18-24px, semi-bold
- **Body**: 14-16px, light/regular
- **Captions**: 12px, light

### Layout Patterns

| Pattern | CSS Approach | Dimensions |
|---|---|---|
| Sidebar (left) | `position: fixed; width: 228px` | Always visible desktop, drawer on mobile |
| Main content | `margin-left: 228px; border-radius: 30px 0 0 30px` | Fills remaining width |
| Right sidebar | `position: absolute; right: 0; width: ~300px` | Optional, dashboard/class only |
| Cards | `background: white; border-radius: 20px; box-shadow` | Flexible width |
| Progress bars | Custom WebKit pseudo-elements | Inline colored bars |

### CSS Architecture

Single file `styles.css` (1,273 lines). Key sections:

| Lines (approx) | Section |
|---|---|
| 1-50 | Global resets, body, fonts |
| 51-150 | Left sidebar navigation |
| 151-400 | Dashboard layout and widgets |
| 401-600 | Course/class pages |
| 601-750 | Calendar |
| 751-900 | Announcements table |
| 901-1050 | Inbox/messaging |
| 1051-1150 | Profile page |
| 1150-1273 | Media queries (responsive) |

---

## 10. Responsive Behavior

### Breakpoint

Single breakpoint at `max-width: 890px` triggers mobile layout.

### Mobile Adaptations

| Desktop | Mobile |
|---|---|
| Fixed left sidebar visible | Hidden, slide-in drawer via hamburger |
| Three-column layout | Single-column stack |
| Right sidebar visible | Hidden or stacked below main |
| Table rows | Card-style with `data-label` attributes |
| Horizontal carousels | Scrollable or stacked |

### Utility Classes

| Class | Behavior |
|---|---|
| `.res-hide` | `display: none` below 890px |
| `.res-show` | `display: block` below 890px (hidden on desktop) |

---

## 11. File & Asset Inventory

### HTML Pages (9 files)

```
login.html          - Authentication entry point
dashboard.html      - Main user hub
courses.html        - Course catalog and browsing
classroom.html      - Active classroom view
class.html          - Individual class detail
calendar.html       - Event and schedule management
announcement.html   - System announcements
inbox.html          - Messaging and conversations
profile.html        - User profile and settings
```

### Stylesheets (1 file)

```
styles.css          - All application styles (1,273 lines)
```

### Assets (Images/ directory, 56 files)

Includes logos, profile avatars, course thumbnails, icons, and media placeholders.

---

## 12. Gap Analysis: Current State vs Production

> **Companion Document**: See `CANVAS_BRIDGE.md` for full page-by-page gap analysis with wireframe specs for all 30 missing pages.

### Infrastructure Gaps

| Capability | Current | Required | Effort |
|---|---|---|---|
| Canvas OAuth2 login | Static form | Full OAuth2 flow | High |
| API data fetching | Hardcoded HTML | Dynamic Canvas API calls | High |
| Server-side proxy | None | Express/Node proxy | Medium |
| Token management | None | Server-side session + refresh | Medium |
| Error handling | None | API errors, network failures, 403s | Medium |
| Loading states | None | Skeleton screens, spinners | Low |
| Pagination | None | Link-header based pagination | Medium |
| Real-time messaging | None | Polling or WebSocket wrapper | Medium |
| File upload (assignments) | Static button | Canvas file upload API (3-step) | Medium |
| Search functionality | Static | Canvas search endpoints | Medium |
| Role-based views | None | Student/teacher/admin/observer conditional UI | Medium |
| Accessibility (WCAG) | Partial | Full WCAG 2.1 AA | Medium |
| Build pipeline | None | Vite/Webpack, minification, cache busting | Low |
| Testing | None | Unit + integration + E2E tests | High |
| CI/CD | None | GitHub Actions or similar | Medium |
| Environment management | None | .env files, secrets management | Low |

### Page Coverage Gaps

| Category | Existing | Missing | Coverage |
|---|---|---|---|
| Global/Shared (sidebar, topbar, breadcrumbs) | 2 of 4 | 2 (breadcrumbs, notification dropdown) | 50% |
| Authentication (login, OAuth, MFA) | 1 of 1 | 0 (needs enhancement) | 100% shell |
| Dashboard (card, list, activity views) | 1 of 3 | 2 (planner view, activity view) | 33% |
| Course Content (assignments, quizzes, discussions, modules, pages) | 0 of 12 | 12 | 0% |
| Assessment (grades, gradebook, speedgrader, rubrics, outcomes) | 0 of 5 | 5 | 0% |
| Resources (files, syllabus, people) | 0 of 3 | 3 | 0% |
| Communication (inbox, announcements, groups, conferences, collaborations) | 2 of 5 | 3 | 40% |
| User Account (profile, settings, notifications, files, eportfolios) | 1 of 5 | 4 | 20% |
| Instructor Tools (settings, analytics, migrations) | 0 of 3 | 3 | 0% |
| **TOTAL** | **9 of 39** | **30** | **23%** |

### Component Gaps

| Component | Status | Needed For |
|---|---|---|
| Rich Content Editor (RCE) | Missing | 7+ pages (announcements, assignments, discussions, pages, quizzes, syllabus, inbox) |
| Notification dropdown | Missing | All pages (top bar) |
| User menu dropdown | Missing | All pages (top bar) |
| Breadcrumb navigation | Missing | All inner pages |
| Status pills | Missing | Assignments, grades, gradebook, modules |
| Drag-and-drop upload zone | Missing | Assignment submit, files, inbox |
| Confirmation dialog / modal | Missing | All destructive actions |
| Toast notifications | Missing | All pages (feedback) |
| Empty states | Missing | All list pages |
| Loading skeletons | Missing | All pages (during fetch) |
| Student context card | Missing | People, gradebook (instructor) |
| Pagination component | Missing | All list pages |
| Date picker | Missing | Calendar, assignment create, quiz settings |
| Course card (dashboard) | Partial | Dashboard, courses |

---

## 13. Migration Path to Production

> **Companion Document**: See `CANVAS_BRIDGE.md` Section 6 for the 4-tier priority plan, and `PAGE_INVENTORY.md` for per-page implementation details.

### Phase 1: Foundation & Infrastructure (Weeks 1-2)

1. Initialize Node.js project with Express
2. Serve static files from `public/` directory
3. Implement `.env` configuration
4. Set up Canvas Developer Key (Tier 1 scopes only)
5. Implement OAuth2 login flow (login.html → Canvas → callback → dashboard)
6. Create API proxy middleware with rate limit awareness
7. Set up session management (express-session + Redis)
8. Extract shared sidebar/topbar into reusable HTML includes or components
9. Add breadcrumb component
10. Add notification dropdown + user menu dropdown to topbar

### Phase 2: Tier 1 Core Pages (Weeks 3-6)

1. Create JavaScript API service module (`/js/api.js`) + render module (`/js/render.js`)
2. **Dashboard (enhance)**: Dynamic course cards, To-Do sidebar, Coming Up, user profile data, notification badge
3. **Courses (enhance)**: All courses list with tabs, favorites, search, course images
4. **Assignments Index (new)**: Assignment groups, assignment rows, status pills
5. **Assignment Detail (new)**: Full description, rubric, submission area (text/file/URL tabs)
6. **Grades - Student (new)**: Assignment table, scores, What-If toggle, statistics
7. **Modules (new)**: Module list with items, completion checkboxes, prerequisites
8. **Calendar (enhance)**: Canvas events, week/agenda views, multi-calendar
9. **Inbox (enhance)**: Compose new, course filter, reply/forward, scope tabs

### Phase 3: Tier 2 Essential Pages (Weeks 7-10)

1. Add Tier 2 scopes to Developer Key
2. **Discussions Index + Thread (new)**: Pinned/open/closed sections, threaded replies, like/rate
3. **Announcements (enhance)**: Dynamic data, search, detail view with replies
4. **Pages Index + View (new)**: Wiki page list, front page, rendered HTML content
5. **Quizzes Index (new)**: Quiz list with type badges, availability
6. **Quiz Taking (new)**: Question display, timer, navigation, submission
7. **Files (new)**: Folder browser, upload zone, storage quota
8. **Profile (enhance)**: Editable fields, avatar upload, enrolled courses
9. **Syllabus (new)**: Description + auto-generated course summary table
10. Implement shared Rich Content Editor (RCE) component

### Phase 4: Tier 3 Extended Pages (Weeks 11-14)

1. Add Tier 3 scopes
2. **People/Roster (new)**: User list, role badges, search, student context cards
3. **Rubrics (new)**: Rubric list + builder
4. **Outcomes (new)**: Outcome tree + mastery tracking
5. **Account Settings (new)**: Tabbed settings (profile, integrations, security)
6. **Notification Preferences (new)**: Category × frequency matrix
7. **Groups (new)**: Group workspace with sub-nav
8. **Collaborations (new)**: Doc collaboration management
9. **Conferences (new)**: Video conference list + creation
10. **ePortfolios (new)**: Portfolio builder

### Phase 5: Tier 4 Instructor Tools (Weeks 15-18)

1. Add Tier 4 scopes
2. **Gradebook (new)**: Spreadsheet grid, editable cells, filters, bulk grading
3. **SpeedGrader (new)**: Submission viewer, annotation, rubric assessment panel
4. **Analytics (new)**: Charts (grade distribution, activity), student summary table
5. **Course Settings (new)**: Tabbed config (details, sections, navigation, apps, features)
6. **Content Import/Export (new)**: Import wizard, export downloads

### Phase 6: Polish & Production (Weeks 19-20)

1. Error handling and loading skeleton screens for all pages
2. Empty state designs for all list pages
3. Toast notification system
4. Full accessibility audit (WCAG 2.1 AA) and fixes
5. Performance optimization (lazy loading images, code splitting, critical CSS)
6. Build pipeline (Vite/Webpack)
7. Unit + integration + E2E test suite
8. CI/CD pipeline (GitHub Actions)
9. Production deployment + SSL + monitoring
10. Load testing with simulated Canvas API responses

---

## 14. Spec-Kit Pipeline Integration

This project uses the following Spec-Kit pipeline for development:

```
/speckit.constitution   → Establish project principles and constraints
        │
        ▼
/speckit.specify        → Define detailed functional specifications
        │
        ▼
/speckit.clarify        → Resolve ambiguities, confirm assumptions
        │
        ▼
/speckit.plan           → Create implementation plan
        │
        ▼
/speckit.tasks          → Break plan into executable tasks
        │
        ▼
/speckit.analyze        → Analyze dependencies, risks, blockers
        │
        ▼
/speckit.checklist      → Generate pre-implementation checklist
        │
        ▼
/speckit.implement      → Execute implementation
```

### Spec-Kit Artifact Mapping

| Pipeline Stage | Output Artifact | Location |
|---|---|---|
| constitution | Project principles doc | `spec-kit/constitution.md` |
| specify | Functional spec | `spec-kit/specification.md` |
| clarify | Clarifications log | `spec-kit/clarifications.md` |
| plan | Implementation plan | `spec-kit/plan.md` |
| tasks | Task breakdown | `spec-kit/tasks.md` |
| analyze | Risk/dependency analysis | `spec-kit/analysis.md` |
| checklist | Pre-flight checklist | `spec-kit/checklist.md` |
| implement | Working code | Source files |

### GitHub Integration

Repository: `https://github.com/stephencoduor/spec-kit-private.git`

Spec-Kit artifacts should be committed to the repo under a `spec-kit/` directory to maintain traceability between specifications and implementation.
