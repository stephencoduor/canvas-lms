# Canvas LMS Bridge Document

> Comprehensive Gap Analysis: ReDefiners Template vs Full Canvas LMS UI
> Version: 1.0.0 | Last Updated: 2026-03-19

---

## Table of Contents

1. [Coverage Matrix](#1-coverage-matrix)
2. [Existing Pages - Enhancement Map](#2-existing-pages---enhancement-map)
3. [Missing Pages - Full Specification](#3-missing-pages---full-specification)
4. [Missing Components - Specification](#4-missing-components---specification)
5. [API Endpoint Mapping Per Page](#5-api-endpoint-mapping-per-page)
6. [Implementation Priority](#6-implementation-priority)
7. [Role-Based View Matrix](#7-role-based-view-matrix)

---

## 1. Coverage Matrix

### Legend
- **Exists** = Template page exists and covers the feature
- **Partial** = Template page exists but is missing Canvas features
- **Missing** = No template page exists; needs to be created

### Global / Shared

| Canvas Feature | Status | Template File | Gap |
|---|---|---|---|
| Global left nav (Dashboard, Courses, Calendar, Inbox, etc.) | **Partial** | All pages | Missing: Groups, History, Help, Account tray |
| Top bar (search, notifications, user menu) | **Partial** | All pages | Missing: notification dropdown, user menu dropdown |
| Breadcrumb navigation | **Missing** | — | Needs implementation on all inner pages |
| Mobile responsive nav | **Exists** | All pages | Hamburger menu + slide drawer works |
| Footer | **Missing** | — | Canvas has minimal footer; optional |

### Core Pages

| Canvas Page | Status | Template File | Key Gaps |
|---|---|---|---|
| Login / Auth | **Partial** | login.html | Missing: OAuth2 flow, forgot password form, MFA, institution selector |
| Dashboard - Card View | **Partial** | dashboard.html | Missing: course color picker, nickname editing, To-Do sidebar, Coming Up, Recent Feedback |
| Dashboard - List View (Planner) | **Missing** | — | Full planner with personal to-dos, date grouping, checkable items |
| Dashboard - Recent Activity | **Missing** | — | Activity stream with announcements, grades, submissions |
| Courses Index | **Partial** | courses.html | Missing: past/future/all courses tabs, star favorites, enrollment terms, course search |
| Course Home | **Partial** | class.html | Missing: 5 layout options, front page, module sidebar |
| Announcements Index | **Partial** | announcement.html | Missing: search, section filter, delay post indicator |
| Announcement Detail | **Missing** | — | Full content view with replies |
| Announcement Create/Edit | **Missing** | — | RCE editor, section targeting, scheduling |
| Assignments Index | **Missing** | — | Grouped by assignment group, weight display, drag reorder |
| Assignment Detail | **Missing** | — | Full description, rubric, due dates, submission type info |
| Assignment Submit | **Missing** | — | Text entry, file upload, URL, media recording, annotation |
| Assignment Submission View | **Missing** | — | View submission, comments, grade, rubric results |
| Quizzes Index | **Missing** | — | Practice/graded/survey quiz list |
| Quiz Taking | **Missing** | — | Question types, timer, navigation, submission |
| Quiz Results | **Missing** | — | Score, question review, statistics |
| Discussions Index | **Missing** | — | Pinned/unpinned/closed, search, graded indicator |
| Discussion Thread | **Missing** | — | Threaded replies, like/rate, subscribe, mark read |
| Discussion Create/Edit | **Missing** | — | RCE, graded/ungraded, group, anonymous options |
| Grades (Student View) | **Missing** | — | Assignment list, scores, What-If, distribution |
| Gradebook (Instructor) | **Missing** | — | Spreadsheet grid, filters, grade posting, late policy |
| SpeedGrader | **Missing** | — | DocViewer, annotations, rubric panel, comments |
| Modules Index | **Missing** | — | Module list, items, requirements, prerequisites |
| Module Item View | **Missing** | — | Next/previous navigation, completion status |
| Pages Index | **Missing** | — | Wiki page list, search, sort |
| Page View | **Missing** | — | Content display, revision history |
| Page Edit | **Missing** | — | RCE, permissions, to-do date |
| Files | **Missing** | — | Folder tree, upload, quota, permissions |
| Syllabus | **Missing** | — | Description + auto-generated course summary |
| People / Roster | **Missing** | — | User list, roles, activity, context cards |
| Groups | **Missing** | — | Group sets, membership, group workspace |
| Outcomes | **Missing** | — | Outcome trees, mastery scales, alignment |
| Rubrics | **Missing** | — | Rubric builder, criteria, ratings |
| Collaborations | **Missing** | — | Google/Office 365 doc creation + management |
| Conferences | **Missing** | — | Video conference creation, recording list |
| Calendar | **Partial** | calendar.html | Missing: week/agenda views, appointment scheduler, drag-drop, multi-calendar overlay, undated sidebar |
| Inbox | **Partial** | inbox.html | Missing: compose new, course filter, bulk actions, media comments, address book, forwarding, starred/archived filters |
| Profile | **Partial** | profile.html | Missing: editable fields, avatar upload, pronunciation, pronouns, links |
| Account Settings | **Missing** | — | Name, email, language, timezone, integrations, MFA |
| Notification Preferences | **Missing** | — | Per-category delivery preferences, per-course overrides |
| User Files | **Missing** | — | Personal file storage browser |
| ePortfolios | **Missing** | — | Portfolio builder, sections, pages, sharing |
| Course Settings | **Missing** | — | Details, sections, navigation, apps, features |
| Content Import/Export | **Missing** | — | Import wizard, export download |
| Rich Content Editor | **Missing** | — | Full RCE toolbar for all content creation |
| Analytics (Course) | **Missing** | — | Grade distribution, activity, student table |
| Admin Dashboard | **Missing** | — | Account management, SIS, themes, permissions |

---

## 2. Existing Pages - Enhancement Map

### 2.1 login.html

**Current**: Static form with email/password, Google SSO button, branding panel.

| Enhancement | Priority | Canvas API | Details |
|---|---|---|---|
| OAuth2 redirect flow | P0 | `GET /login/oauth2/auth` | Replace form submit with Canvas OAuth redirect |
| Institution selector | P1 | — | Dropdown for multi-institution deployments |
| Forgot password link | P1 | `GET /login/forgot_password` | Link to Canvas password reset |
| MFA support | P2 | OAuth2 flow handles this | Canvas enforces MFA if enabled |
| Error messages | P1 | — | Display auth errors ("invalid credentials", "account locked") |
| Remember me | P2 | Session config | Longer session TTL |
| SSO buttons (SAML/CAS) | P2 | Auth provider config | Show based on institution settings |

### 2.2 dashboard.html

**Current**: Welcome banner, 3 progress bars, assignments section with tabs, discussions, practice, previous classes carousel, calendar widget, recent chats.

| Enhancement | Priority | Canvas API | Details |
|---|---|---|---|
| Dynamic course cards | P0 | `GET /api/v1/courses` | Replace static content with API data |
| To-Do sidebar | P0 | `GET /api/v1/users/self/todo` | Canvas-style to-do list with due dates |
| Coming Up section | P1 | `GET /api/v1/users/self/upcoming_events` | Upcoming assignments/events |
| Recent Feedback | P1 | `GET /api/v1/courses/:id/assignments` (filter graded) | Recently graded submissions |
| Dashboard view toggle (Card/List/Activity) | P1 | `PUT /api/v1/users/self/dashboard_positions` | Three dashboard modes |
| Course color/nickname editing | P2 | `PUT /api/v1/users/self/colors/course_:id`, `PUT /api/v1/users/:id/course_nicknames/:id` | Personalize course cards |
| Notification badge count | P1 | `GET /api/v1/conversations?scope=unread` | Unread message count on bell icon |
| User avatar from Canvas | P0 | `GET /api/v1/users/self/profile` | Dynamic avatar + name |
| Planner items | P1 | `GET /api/v1/planner/items` | Student planner integration |
| Personal to-do creation | P2 | `POST /api/v1/planner_notes` | Add custom to-do items |

### 2.3 courses.html

**Current**: Course carousel with cards, instructor display, progress bars.

| Enhancement | Priority | Canvas API | Details |
|---|---|---|---|
| All courses list with tabs | P0 | `GET /api/v1/courses?enrollment_state=active` | Current/past/future tabs |
| Course search | P1 | `GET /api/v1/search/all_courses` | Search by name/code |
| Favorite courses | P1 | `GET /api/v1/users/self/favorites/courses`, `POST/DELETE` | Star/unstar |
| Course images | P1 | `GET /api/v1/courses/:id` → `image_download_url` | Dynamic course thumbnails |
| Enrollment role display | P1 | `GET /api/v1/courses?include[]=enrollments` | Show student/teacher/TA role |
| Term grouping | P2 | `GET /api/v1/courses?include[]=term` | Group by academic term |
| Course code display | P1 | `courses[].course_code` | Show course codes |

### 2.4 calendar.html

**Current**: Month view with event list, add event form, date highlighting.

| Enhancement | Priority | Canvas API | Details |
|---|---|---|---|
| Canvas events integration | P0 | `GET /api/v1/calendar_events?start_date=&end_date=` | Real calendar data |
| Week view | P1 | — | Additional view mode |
| Agenda/list view | P1 | — | Chronological list mode |
| Assignment due dates overlay | P0 | `GET /api/v1/calendar_events?type=assignment` | Show assignments on calendar |
| Multi-calendar toggle | P1 | Color per course | Toggle visibility per course |
| Drag-and-drop rescheduling | P2 | `PUT /api/v1/calendar_events/:id` | Move events between dates |
| Appointment scheduler | P2 | `GET /api/v1/appointment_groups`, `POST .../reservations` | Student booking |
| Undated items sidebar | P2 | `GET /api/v1/courses/:id/assignments?bucket=undated` | Drag undated to calendar |
| iCal feed link | P2 | `GET /api/v1/calendar_events` (iCal format) | Export subscription |
| Event create with course context | P1 | `POST /api/v1/calendar_events` | Assign to specific course |

### 2.5 announcement.html

**Current**: Table display with message type, date, action buttons, pagination.

| Enhancement | Priority | Canvas API | Details |
|---|---|---|---|
| Dynamic data from Canvas | P0 | `GET /api/v1/announcements?context_codes[]=course_:id` | Real announcements |
| Search announcements | P1 | `?search_term=` parameter | Filter by keyword |
| Announcement detail view | P1 | Full content display | Click row to expand |
| Reply to announcements | P2 | Discussion entries API | If replies enabled |
| Section filter | P2 | `?context_codes[]` | Filter by course/section |
| Unread indicator | P1 | Discussion read state API | Visual unread badge |
| Date sorting | P1 | `?latest_only=true` | Sort by posted date |
| Delayed post indicator | P2 | `delayed_post_at` field | Show scheduled posts |

### 2.6 inbox.html

**Current**: Split-pane with message list, conversation thread, media gallery, profile sidebar.

| Enhancement | Priority | Canvas API | Details |
|---|---|---|---|
| Dynamic conversations | P0 | `GET /api/v1/conversations` | Real message data |
| Compose new message | P0 | `POST /api/v1/conversations` | New conversation creation |
| Course/group filter | P1 | `?filter[]=course_:id` | Filter by context |
| Reply/forward | P0 | `POST /api/v1/conversations/:id/add_message` | Thread replies |
| Unread/Starred/Archived tabs | P1 | `?scope=unread`, `?scope=starred`, `?scope=archived` | Filter views |
| Bulk actions | P2 | `PUT /api/v1/conversations` (batch) | Archive, delete, star multiple |
| Address book | P1 | `GET /api/v1/search/recipients` | Browse users by course/role |
| Media comments | P2 | Audio/video attachment | Record and send media |
| Attachment upload | P1 | File upload API | Attach files to messages |
| Search conversations | P1 | `?filter[]` | Search by user/subject |
| Mark read/unread | P1 | `PUT /api/v1/conversations/:id` | Toggle read state |
| Submission comments tab | P2 | `?scope=submission_comments` | View assignment comments |

### 2.7 profile.html

**Current**: User card, parent/caregiver info, progress bars, about section, notes.

| Enhancement | Priority | Canvas API | Details |
|---|---|---|---|
| Dynamic profile data | P0 | `GET /api/v1/users/self/profile` | Real user data |
| Edit profile | P1 | `PUT /api/v1/users/self` | Update name, bio, links |
| Avatar upload | P1 | `PUT /api/v1/users/self` (avatar) | Upload profile picture |
| Pronouns display | P2 | `profile.pronouns` | Show pronouns |
| Name pronunciation | P2 | `profile.pronunciation` | Audio pronunciation |
| Personal links | P2 | `profile.links[]` | Social/web links |
| Enrolled courses list | P1 | `GET /api/v1/users/self/enrollments` | Course list on profile |
| Timezone/Language | P2 | `GET /api/v1/users/self/settings` | Display user locale |

### 2.8 class.html / classroom.html

**Current**: Course detail with video carousel, instructor info, lessons.

| Enhancement | Priority | Canvas API | Details |
|---|---|---|---|
| Dynamic course data | P0 | `GET /api/v1/courses/:id?include[]=syllabus_body&include[]=teachers` | Real course info |
| Course navigation (Canvas-style) | P0 | `GET /api/v1/courses/:id/tabs` | Dynamic nav from Canvas |
| Modules display | P0 | `GET /api/v1/courses/:id/modules?include[]=items` | Module list with items |
| Assignment list | P0 | `GET /api/v1/courses/:id/assignments` | Course assignments |
| Recent announcements | P1 | `GET /api/v1/announcements?context_codes[]=course_:id` | Course announcements |
| Course progress | P1 | `GET /api/v1/courses/:id/progress` | Completion percentage |
| File listing | P2 | `GET /api/v1/courses/:id/files` | Course files |
| People/roster | P2 | `GET /api/v1/courses/:id/users` | Course members |

---

## 3. Missing Pages - Full Specification

### 3.1 Assignments Index (assignments.html)

**Purpose**: List all assignments grouped by assignment group with weights.

```
Layout: Standard page template (sidebar + full-width main)

Sections:
├── Page header: "Assignments" + [+ Assignment] button (instructor)
├── Search / filter bar
├── Assignment groups (collapsible)
│   ├── Group name + weight percentage
│   ├── Assignment row
│   │   ├── Icon (assignment type)
│   │   ├── Name (link to detail)
│   │   ├── Due date
│   │   ├── Points possible
│   │   ├── Status pill (submitted/missing/late/graded)
│   │   └── [Publish toggle] (instructor)
│   └── ... more assignments
└── ... more groups
```

**Canvas API**:
- `GET /api/v1/courses/:id/assignments?include[]=submission&order_by=position`
- `GET /api/v1/courses/:id/assignment_groups?include[]=assignments`

**Components needed**: Assignment row, status pill, group header, publish toggle.

---

### 3.2 Assignment Detail (assignment-detail.html)

**Purpose**: Full assignment view with description, submission interface.

```
Layout: Standard page template

Sections:
├── Breadcrumb: Course > Assignments > Assignment Name
├── Assignment title (h1)
├── Metadata bar: Due date | Points | Submission type
├── Description (rendered HTML from RCE)
├── Rubric (if attached)
│   ├── Criteria rows
│   │   ├── Criterion description
│   │   ├── Rating columns with points
│   │   └── Total points
│   └── Free-form comments area
├── Submission area
│   ├── [Text Entry tab] → RCE editor
│   ├── [File Upload tab] → Drag-drop zone + file picker
│   ├── [URL tab] → URL input field
│   ├── [Media tab] → Record audio/video
│   └── [Submit Assignment] button
├── Submission history (if resubmission allowed)
│   ├── Attempt #, date, grade
│   └── View submission link
└── Comments thread
    ├── Instructor comments
    ├── Peer review comments
    └── [Add comment] input
```

**Canvas API**:
- `GET /api/v1/courses/:id/assignments/:id`
- `GET /api/v1/courses/:id/assignments/:id/submissions/self`
- `POST /api/v1/courses/:id/assignments/:id/submissions`
- `GET /api/v1/courses/:id/assignments/:id/rubric`

---

### 3.3 Quizzes Index (quizzes.html)

**Purpose**: List all quizzes with type, availability, and attempt info.

```
Layout: Standard page template

Sections:
├── Page header: "Quizzes" + [+ Quiz] (instructor)
├── Quiz type tabs: All | Practice | Graded | Surveys
├── Quiz list
│   ├── Quiz row
│   │   ├── Quiz icon (by type)
│   │   ├── Name (link to detail/start)
│   │   ├── Type badge (Practice/Graded/Survey)
│   │   ├── Due date
│   │   ├── Points possible
│   │   ├── Questions count
│   │   ├── Time limit
│   │   ├── Attempts (allowed/used)
│   │   └── Status (available/locked/completed)
│   └── ... more quizzes
└── [Publish toggle] per quiz (instructor)
```

**Canvas API**:
- `GET /api/v1/courses/:id/quizzes`
- New Quizzes: `GET /api/quiz/v1/courses/:id/quizzes`

---

### 3.4 Quiz Taking (quiz-take.html)

**Purpose**: Interactive quiz-taking interface.

```
Layout: Full-width (no right sidebar)

Sections:
├── Quiz header: Title + Timer (if timed)
├── Question navigation sidebar (numbered buttons)
├── Question display area
│   ├── Question number + points
│   ├── Question text (HTML)
│   ├── Answer area (varies by type):
│   │   ├── Multiple Choice: radio buttons
│   │   ├── True/False: radio buttons
│   │   ├── Multiple Answer: checkboxes
│   │   ├── Fill in Blank: text input
│   │   ├── Matching: dropdown pairs
│   │   ├── Essay: RCE editor
│   │   ├── File Upload: file picker
│   │   ├── Numerical: number input
│   │   └── Formula: computed field
│   └── [Flag question] toggle
├── Navigation: [Previous] [Next]
└── [Submit Quiz] button + confirmation dialog
```

---

### 3.5 Discussions Index (discussions.html)

**Purpose**: List all discussion topics with categories.

```
Layout: Standard page template

Sections:
├── Page header: "Discussions" + [+ Discussion] (instructor)
├── Search bar
├── Pinned Discussions section
│   └── Discussion row (pinned icon, title, last reply date, reply count, unread count)
├── Discussions section
│   └── Discussion row (same format)
├── Closed for Comments section
│   └── Discussion row (locked icon)
└── [Subscribe] toggle per discussion
```

**Canvas API**:
- `GET /api/v1/courses/:id/discussion_topics`
- `GET /api/v1/courses/:id/discussion_topics/:id`

---

### 3.6 Discussion Thread (discussion-thread.html)

**Purpose**: Full threaded discussion view.

```
Layout: Standard page template

Sections:
├── Breadcrumb: Course > Discussions > Topic Title
├── Original post
│   ├── Author avatar + name + date
│   ├── Post content (HTML)
│   └── Action bar: [Reply] [Like] [Subscribe] [Edit] [Delete]
├── Reply thread (recursive nesting)
│   ├── Reply
│   │   ├── Author avatar + name + date
│   │   ├── Reply content
│   │   ├── [Reply] [Like] [Edit]
│   │   └── Nested replies (indented)
│   └── ... more replies
├── Reply editor
│   ├── RCE editor
│   ├── [Attach file]
│   └── [Post Reply] button
└── Unread indicator (blue dot on unread replies)
```

---

### 3.7 Grades - Student View (grades.html)

**Purpose**: Student grade summary with What-If scores.

```
Layout: Standard page template

Sections:
├── Page header: "Grades" + Course selector dropdown
├── Grading period filter (if applicable)
├── Total grade display (large, top-right)
├── Assignment grades table
│   ├── Columns: Name | Due Date | Status | Score | Out of
│   ├── Assignment row
│   │   ├── Assignment name (link)
│   │   ├── Due date
│   │   ├── Status pill (submitted/graded/missing/late/excused)
│   │   ├── Score (editable for What-If)
│   │   ├── Points possible
│   │   └── Comments icon (if comments exist)
│   └── Assignment group subtotal row
├── [Show What-If Scores] toggle
├── Scoring details per assignment (if 5+ submissions):
│   └── Mean | High | Low bars
└── Course total row (with/without ungraded)
```

**Canvas API**:
- `GET /api/v1/courses/:id/assignments?include[]=submission&include[]=score_statistics`
- `GET /api/v1/courses/:id/assignment_groups?include[]=assignments&include[]=submission`
- `GET /api/v1/courses/:id/enrollments?user_id=self` (for total grade)

---

### 3.8 Gradebook - Instructor (gradebook.html)

**Purpose**: Spreadsheet-style grade management.

```
Layout: Full-width (no sidebars)

Sections:
├── Toolbar
│   ├── View toggle: [Default] [Individual] [Learning Mastery]
│   ├── Filters: Section | Module | Assignment Group | Grading Period | Student Group
│   ├── [Actions] menu: Import, Export, Gradebook History
│   └── [Settings] (late policy, grade posting)
├── Gradebook grid
│   ├── Column headers: Student Name | Assignment1 | Assignment2 | ... | Total
│   ├── Student rows
│   │   ├── Student name (link to context card)
│   │   ├── Grade cells (editable)
│   │   │   ├── Score display
│   │   │   ├── Status icon (late/missing/excused)
│   │   │   └── Cell editor on click
│   │   └── Total column (calculated)
│   └── ... more students
├── [Post Grades] / [Hide Grades] per assignment column
└── Status bar: showing filters applied, student count
```

---

### 3.9 Modules (modules.html)

**Purpose**: Content organized in sequential learning modules.

```
Layout: Standard page template (with optional right sidebar)

Sections:
├── Page header: "Modules" + [+ Module] (instructor)
├── Module list (ordered, collapsible)
│   ├── Module header
│   │   ├── Module name
│   │   ├── Prerequisites indicator (locked/unlocked)
│   │   ├── Completion requirements text
│   │   ├── [Publish all] toggle (instructor)
│   │   └── Collapse/expand chevron
│   ├── Module items
│   │   ├── Item icon (assignment/quiz/page/file/discussion/url/tool/header)
│   │   ├── Item name (link to content)
│   │   ├── Due date (if applicable)
│   │   ├── Points (if applicable)
│   │   ├── Completion checkbox (student)
│   │   ├── Requirement icon (view/submit/score)
│   │   └── [Publish] toggle (instructor)
│   └── [+ Add item] button (instructor)
└── ... more modules
```

**Canvas API**:
- `GET /api/v1/courses/:id/modules?include[]=items&include[]=content_details`
- `PUT /api/v1/courses/:id/modules/:id/items/:id/done` (mark complete)
- `GET /api/v1/courses/:id/module_item_sequence`

---

### 3.10 Pages Index (pages.html) + Page View (page-view.html)

**Purpose**: Wiki-style content pages.

```
Pages Index:
├── Header: "Pages" + [+ Page] (instructor)
├── Search bar
├── Sort: A-Z | Date created | Date updated
├── Page list
│   ├── Page title (link)
│   ├── Last edited date + by whom
│   ├── [Published] indicator
│   └── [Front Page] star
└── ... pages

Page View:
├── Breadcrumb: Course > Pages > Page Title
├── Page title (h1)
├── Last edited: date + author
├── Page content (rendered HTML)
├── [Edit] button (if permitted)
└── [View revision history] link
```

---

### 3.11 Files (files.html)

**Purpose**: File browser with folder hierarchy.

```
Layout: Standard page template

Sections:
├── Header: "Files" + [Upload] button + [+ Folder] button
├── Breadcrumb path: All Files > Folder > Subfolder
├── Toolbar: [Upload] [Create folder] [Manage usage rights]
├── Storage quota bar (used / total)
├── File/Folder table
│   ├── Columns: Name | Date Created | Date Modified | Size | Published
│   ├── Folder row (icon, name, click to enter)
│   ├── File row (icon by type, name, click to preview)
│   │   ├── Hover actions: Download | Rename | Move | Delete
│   │   └── Restrict access options
│   └── ... more items
├── Drag-and-drop upload zone
└── Bulk action bar (when items selected)
```

---

### 3.12 People / Roster (people.html)

**Purpose**: Course member list and group management.

```
Layout: Standard page template

Sections:
├── Header: "People" + [+ People] button (instructor)
├── Tabs: [Everyone] [Groups]
├── Search bar + role filter dropdown
├── People table
│   ├── Columns: Name | Login ID | Section | Role | Last Activity | Total Activity
│   ├── User row
│   │   ├── Avatar + Name (clickable for context card)
│   │   ├── Login/email
│   │   ├── Section name
│   │   ├── Role badge (Student/Teacher/TA/Observer)
│   │   ├── Last activity date
│   │   └── Total activity time
│   └── ... more users
├── Groups tab
│   ├── Group set headers
│   ├── Group list with member count
│   └── [Create group set] / [Manage] buttons (instructor)
└── Pagination
```

---

### 3.13 Syllabus (syllabus.html)

**Purpose**: Course syllabus with auto-generated summary.

```
Layout: Standard page template with right sidebar

Sections:
├── Header: "Syllabus" + [Edit] button (instructor)
├── Syllabus description (RCE content)
├── Course Summary table (auto-generated)
│   ├── Columns: Date | Details | Due
│   ├── Row per dated assignment/event
│   │   ├── Date
│   │   ├── Assignment name + icon
│   │   └── Due date/time
│   └── Sorted chronologically
├── Right sidebar
│   ├── Mini calendar
│   └── Assignment group weights (if weighted)
```

---

### 3.14 Outcomes (outcomes.html)

**Purpose**: Learning outcome management and mastery tracking.

```
Layout: Standard page template

Sections:
├── Header: "Outcomes" + [+ Outcome] + [+ Group] (instructor)
├── Outcome group tree (left panel)
│   ├── Expandable group folders
│   └── Individual outcome items
├── Outcome detail (right panel)
│   ├── Outcome title
│   ├── Description
│   ├── Calculation method (Decaying Average/n Mastery/Latest/Highest/Average)
│   ├── Mastery points threshold
│   ├── Ratings scale (Exceeds/Meets/Near/Below)
│   └── Aligned items (assignments, rubric criteria)
└── [Import] button for account-level outcomes
```

---

### 3.15 Rubrics (rubrics.html)

**Purpose**: Rubric creation and management.

```
Layout: Standard page template

Sections:
├── Header: "Rubrics" + [+ Rubric]
├── Rubric list
│   ├── Rubric name (link to detail)
│   ├── Points possible
│   ├── Criteria count
│   └── Usage count (assignments linked)
├── Rubric builder (create/edit)
│   ├── Rubric title
│   ├── Criteria rows
│   │   ├── Criterion description
│   │   ├── Rating columns (Excellent/Good/Fair/Poor)
│   │   │   ├── Description
│   │   │   └── Points
│   │   └── [+ Add Criterion]
│   ├── Total points (calculated)
│   ├── [Use for Grading] checkbox
│   └── [Free Form Comments] checkbox
└── [Save Rubric] / [Cancel]
```

---

### 3.16 Account Settings (account-settings.html)

**Purpose**: User account configuration.

```
Layout: Standard page template

Sections:
├── Header: "Settings"
├── Profile section
│   ├── Full name, Display name, Sortable name
│   ├── Email addresses (add/remove)
│   ├── Language preference
│   ├── Time zone
│   └── [Update Settings] button
├── Approved Integrations
│   ├── List of API access tokens
│   └── [+ New Access Token] button
├── Registered Services
│   ├── Google Drive
│   ├── Microsoft Office 365
│   └── Other services
├── Multi-Factor Authentication
│   ├── Status (enabled/disabled)
│   └── [Set Up MFA] / [Reconfigure]
└── Other Settings
    ├── Feature options (user-level flags)
    └── Miscellaneous preferences
```

---

### 3.17 Notification Preferences (notifications.html)

**Purpose**: Configure how and when to receive notifications.

```
Layout: Standard page template

Sections:
├── Header: "Notification Preferences"
├── Global defaults table
│   ├── Columns: Category | Immediately | Daily | Weekly | Off
│   ├── Categories:
│   │   ├── Course Activities (Due date, grading, availability)
│   │   ├── Discussions (new topic, reply)
│   │   ├── Conversations (new message)
│   │   ├── Scheduling (calendar event, appointment)
│   │   ├── Groups (membership, file)
│   │   ├── Conferences (recording ready)
│   │   ├── Alerts (admin notifications)
│   │   └── Membership Updates
│   └── Radio button per cell
├── Per-course overrides
│   ├── Course list with override dropdowns
│   └── [Mute/Unmute] course toggle
└── Push notification settings (for mobile)
```

---

### 3.18 Groups (groups.html)

**Purpose**: Group workspace (mini-course).

```
Layout: Standard page template with group nav

Group workspace pages:
├── Home (group front page)
├── Announcements (group announcements)
├── Pages (collaborative wiki)
├── People (member list)
├── Discussions (group discussions)
├── Files (shared group files)
├── Conferences (group video calls)
└── Collaborations (Google/Office docs)
```

---

### 3.19 Conferences (conferences.html)

**Purpose**: Video conference management.

```
Layout: Standard page template

Sections:
├── Header: "Conferences" + [+ Conference]
├── Active conferences
│   ├── Conference card
│   │   ├── Title
│   │   ├── Duration
│   │   ├── Participants
│   │   ├── [Join] button
│   │   └── Status indicator (in progress/ended)
│   └── ... more active
├── Concluded conferences
│   ├── Conference card
│   │   ├── Title + date
│   │   ├── Duration
│   │   └── [View Recording] button
│   └── ... more concluded
└── Create conference dialog
    ├── Title input
    ├── Duration dropdown
    ├── Description textarea
    ├── Invite users (multi-select)
    ├── [Enable recording] checkbox
    └── [Create] button
```

---

### 3.20 Collaborations (collaborations.html)

**Purpose**: Google/Office 365 document collaboration.

```
Layout: Standard page template

Sections:
├── Header: "Collaborations" + [+ Collaboration]
├── Active collaborations list
│   ├── Collaboration card
│   │   ├── Document icon (Docs/Sheets/Slides/Word/Excel/PPT)
│   │   ├── Title
│   │   ├── Created by + date
│   │   ├── Collaborators list
│   │   └── [Open] button
│   └── ... more collaborations
└── Create dialog
    ├── Type selector (Google Docs / Office 365)
    ├── Title input
    ├── Description
    ├── Add people (multi-select or by group)
    └── [Create] button
```

---

### 3.21 ePortfolios (eportfolio.html)

**Purpose**: Student portfolio builder and showcase.

```
Layout: Standard page template with portfolio nav

Sections:
├── Portfolio list (if multiple)
│   ├── Portfolio card (title, sections count, visibility)
│   └── [+ Create Portfolio] button
├── Portfolio editor
│   ├── Section navigation (left panel)
│   │   ├── Section names (draggable reorder)
│   │   └── [+ Section] button
│   ├── Page editor (main panel)
│   │   ├── Rich text content (RCE)
│   │   ├── [Add Course Submission] embed
│   │   ├── [Add Image/File]
│   │   └── Page list within section
│   └── Settings
│       ├── Portfolio name
│       ├── Visibility (public/private)
│       └── Share link
└── Portfolio preview mode
```

---

### 3.22 Course Settings (course-settings.html) [Instructor Only]

**Purpose**: Configure course details, navigation, and tools.

```
Layout: Tabbed page template

Tabs:
├── Course Details
│   ├── Name, Code, Time Zone, Language
│   ├── Grading scheme selector
│   ├── License (Creative Commons options)
│   ├── Visibility (public/institution/course)
│   ├── Start/End dates
│   ├── Format (on-campus/online/blended)
│   └── [Update Course Details] button
├── Sections
│   ├── Section list with student counts
│   ├── [+ Section] button
│   └── Cross-list management
├── Navigation
│   ├── Draggable nav items (enabled)
│   ├── Disabled nav items (hidden from students)
│   └── Drag between enabled/disabled
├── Apps (External Tools)
│   ├── Installed tools list
│   ├── [View App Configurations]
│   └── [+ App] button
├── Feature Options
│   └── Toggle switches for feature flags
└── Actions sidebar
    ├── [Import Content]
    ├── [Export Content]
    ├── [Copy Course]
    ├── [Reset Course]
    ├── [Conclude Course]
    └── [Delete Course]
```

---

### 3.23 Analytics (analytics.html) [Instructor Only]

**Purpose**: Course performance analytics dashboard.

```
Layout: Full-width with charts

Sections:
├── Header: "Analytics" + Section filter
├── Course Grade Distribution
│   └── Bar chart (A/B/C/D/F distribution)
├── Weekly Online Activity
│   └── Line chart (page views + participations over weeks)
├── Student Summary Table
│   ├── Columns: Name | Grade | Page Views | Participations | Last Activity
│   ├── Sortable columns
│   ├── [Message Students Who...] button
│   │   └── Criteria: missing, scored less/more than, not yet graded
│   └── Click row → individual student view
├── Individual Student View
│   ├── Assignment breakdown (status + score per assignment)
│   ├── Page views timeline
│   └── Communication history
└── [Export CSV] button
```

---

## 4. Missing Components - Specification

### 4.1 Rich Content Editor (RCE)

Required for: Announcements, Assignments, Discussions, Pages, Quizzes, Syllabus, Messages.

**Recommendation**: Integrate TinyMCE 5+ (Canvas uses TinyMCE internally) or use Quill.js for a lightweight alternative.

```
Toolbar:
├── Text: Bold, Italic, Underline, Strikethrough, Superscript, Subscript
├── Font: Size selector, Color picker, Highlight
├── Paragraph: Heading levels (H2-H4), Ordered/Unordered list, Blockquote, Alignment, Direction
├── Insert: Link, Image, Media, Document, Table, Equation, Embed code
├── Tools: Clear formatting, Find/Replace, Word count, Fullscreen, HTML source
└── Accessibility: Checker, Alt text prompts
```

### 4.2 Notification Dropdown

For the bell icon in the top bar.

```
Width:       350px
Max-height:  400px (scrollable)
Position:    absolute, top-right
Shadow:      elevation-5
Radius:      radius-xl

Item:
├── Icon (type: announcement, grade, message, due date)
├── Title text (14px, truncated)
├── Course name (12px, muted)
├── Timestamp (12px, muted)
└── Unread indicator (blue dot)
```

### 4.3 User Menu Dropdown

For the avatar in the top bar.

```
Items:
├── Profile
├── Settings
├── Notifications
├── Files
├── ePortfolios (if enabled)
├── ─────────
└── Logout
```

### 4.4 Student Context Card (Instructor Only)

Pop-up card when clicking a student name.

```
Width:       350px
Shadow:      elevation-5
Radius:      radius-xl

Content:
├── Avatar + Name + Email
├── Section
├── Last activity date
├── Current grade
├── Missing assignments count
├── [Message] button
└── [View Analytics] link
```

### 4.5 Course Card (Dashboard)

```
Width:       ~250px
Height:      ~175px
Radius:      radius-lg
Overflow:    hidden

Structure:
├── Course image or color header (60% height)
│   ├── Course name overlay (white text)
│   └── [More options] icon (top-right)
├── Course info (40% height)
│   ├── Course nickname
│   ├── Term name
│   └── [To-Do count] badge
└── Color bar (bottom, 4px, course color)
```

### 4.6 Status Pills

Used across assignments, submissions, grades.

| Status | Background | Text Color | Text |
|---|---|---|---|
| Submitted | `#38AA51` | white | Submitted |
| Graded | `#2989CA` | white | Graded |
| Missing | `#F45252` | white | Missing |
| Late | `#F49E21` | white | Late |
| Excused | `#668B91` | white | Excused |
| Not Submitted | `#CCD6D9` | `#00303F` | Not Submitted |
| Published | `#38AA51` | white | Published |
| Unpublished | `#668B91` | white | Unpublished |

```css
.status-pill {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
}
```

### 4.7 Drag-and-Drop Upload Zone

For files and assignment submissions.

```
Border:      2px dashed #CCD6D9
Radius:      radius-xl
Padding:     40px
Text-align:  center
Background:  #F6F9FA (neutral-50)

Hover/active:
  Border:    2px dashed #2989CA
  Background: #DFEDF7

Content:
├── Upload icon (48px, muted)
├── "Drag files here or click to browse" text
└── "Accepted types: .pdf, .doc, .docx, ..." (caption)
```

### 4.8 Confirmation Dialog / Modal

```
Overlay:     rgba(0, 48, 63, 0.5)
Width:       480px
Radius:      radius-xl
Shadow:      elevation-5
Padding:     30px

Structure:
├── Title (heading-3)
├── Description text (body)
├── Button row (flex, justify: end, gap: 10px)
│   ├── [Cancel] secondary button
│   └── [Confirm] primary button
```

### 4.9 Toast / Snackbar Notification

```
Position:    fixed, bottom: 20px, right: 20px
Width:       350px
Radius:      radius-md
Shadow:      elevation-4
Padding:     15px 20px
Z-index:     1000

Variants:
├── Success: left-border 4px solid #38AA51, icon: checkmark
├── Error: left-border 4px solid #F45252, icon: X
├── Warning: left-border 4px solid #F49E21, icon: !
├── Info: left-border 4px solid #2989CA, icon: i

Auto-dismiss: 5 seconds
Animation: slide-in from right, fade-out
```

---

## 5. API Endpoint Mapping Per Page

Complete mapping available in `CANVAS_API_CATALOG.md`.

### Quick Reference: Most-Used Endpoints

| Endpoint | Pages Using It |
|---|---|
| `GET /api/v1/users/self` | dashboard, profile, all (top bar) |
| `GET /api/v1/courses` | dashboard, courses |
| `GET /api/v1/courses/:id` | class, classroom, all course-context pages |
| `GET /api/v1/courses/:id/assignments` | assignments, grades, modules, dashboard |
| `GET /api/v1/courses/:id/assignments/:id/submissions` | assignment-detail, speedgrader |
| `GET /api/v1/calendar_events` | calendar, dashboard |
| `GET /api/v1/conversations` | inbox |
| `GET /api/v1/announcements` | announcement, dashboard |
| `GET /api/v1/courses/:id/discussion_topics` | discussions, dashboard |
| `GET /api/v1/courses/:id/modules` | modules, class |
| `GET /api/v1/courses/:id/pages` | pages |
| `GET /api/v1/courses/:id/users` | people |
| `GET /api/v1/courses/:id/tabs` | all course pages (nav) |
| `GET /api/v1/users/self/todo` | dashboard |
| `GET /api/v1/planner/items` | dashboard (list view) |

---

## 6. Implementation Priority

### Tier 1 - Core (Weeks 1-4)

| Page | Reason |
|---|---|
| OAuth2 login flow | Prerequisite for everything |
| Dashboard (enhanced) | Primary landing page |
| Courses (enhanced) | Second-most visited |
| Assignments Index | Core LMS workflow |
| Assignment Detail + Submit | Core LMS workflow |
| Grades (Student View) | Core LMS workflow |
| Modules | Primary content navigation |
| Calendar (enhanced) | Core scheduling |
| Inbox (enhanced) | Core communication |

### Tier 2 - Essential (Weeks 5-8)

| Page | Reason |
|---|---|
| Discussions Index + Thread | Social learning |
| Announcements (enhanced) | Communication |
| Pages Index + View | Content delivery |
| Quizzes Index | Assessment |
| Quiz Taking | Assessment |
| Files | Resource access |
| Profile (enhanced) | User management |
| Syllabus | Course information |

### Tier 3 - Extended (Weeks 9-12)

| Page | Reason |
|---|---|
| People / Roster | Course social |
| Rubrics | Assessment transparency |
| Outcomes | Standards-based learning |
| Account Settings | User preferences |
| Notification Preferences | Communication control |
| Groups | Collaborative learning |
| Collaborations | Document collaboration |
| Conferences | Video communication |
| ePortfolios | Showcase work |

### Tier 4 - Instructor Tools (Weeks 13-16)

| Page | Reason |
|---|---|
| Gradebook (Instructor) | Grade management |
| SpeedGrader | Grading workflow |
| Analytics | Performance tracking |
| Course Settings | Course administration |
| Content Import/Export | Course management |

---

## 7. Role-Based View Matrix

| Page | Student | Teacher | TA | Observer | Admin |
|---|---|---|---|---|---|
| Dashboard | Full | Full | Full | Limited (observee data) | Full |
| Courses | Enrolled only | Teaching + enrolled | TA courses | Observee courses | All |
| Assignments | View + submit | View + create + grade | View + grade | View only | Full |
| Grades | Own grades | Gradebook | Grade (per permission) | Observee grades | Full |
| SpeedGrader | — | Full | Per permission | — | Full |
| Discussions | View + reply | Full CRUD | Per permission | View only | Full |
| Pages | View (+ edit if allowed) | Full CRUD | Per permission | View only | Full |
| Modules | View + progress | Full CRUD | Per permission | View only | Full |
| People | View roster | Full + manage | View | View | Full |
| Files | View published | Full CRUD | Per permission | View | Full |
| Calendar | View + personal events | All events + scheduler | View | Observee events | Full |
| Inbox | Full | Full | Full | Limited | Full |
| Settings | — | Full | — | — | Full |
| Analytics | — | Full | Per permission | — | Full |
| Profile | Own only | Own only | Own only | Own only | Any user |

### Conditional UI Elements

| Element | Condition |
|---|---|
| [+ Assignment] button | Role = Teacher or TA with create permission |
| [Publish] toggle | Role = Teacher or TA |
| [Edit] button (pages) | Teacher, or Student if page allows student editing |
| Grade cell (editable) | Role = Teacher or TA with grade permission |
| [Delete] option | Role = Teacher (own content) or Admin |
| [Student View] button | Role = Teacher |
| Admin navigation | Role = Admin |
