# ReDefiners - Complete Page Inventory

> Full Page Specification for Canvas LMS Custom Frontend
> Version: 1.0.0 | Last Updated: 2026-03-19

---

## Overview

This document lists every page needed for a complete Canvas LMS custom frontend, organized by status. Each entry includes the filename, the Canvas API endpoints required, the layout template to use, and the key components.

### Layout Templates

| Template | Code | Description |
|---|---|---|
| **A** | Sidebar + Full Main | Left nav + full-width content area |
| **B** | Sidebar + Main + Right | Left nav + center content + right sidebar |
| **C** | Sidebar + Split Pane | Left nav + list panel + detail panel |
| **D** | Full Width | No sidebars, maximized content (gradebook, quizzes) |
| **E** | Sidebar + Tabbed | Left nav + tabbed content sections |
| **F** | Auth | Login/registration layout (no sidebar) |

---

## Existing Pages (9 files - need enhancement)

### 1. login.html
| Attribute | Value |
|---|---|
| **Layout** | F (Auth) |
| **Status** | Exists - needs OAuth2 integration |
| **Canvas API** | `GET /login/oauth2/auth`, `POST /login/oauth2/token`, `DELETE /login/oauth2/token` |
| **Components** | Login form, OAuth redirect, institution branding, error alerts, SSO buttons |
| **Roles** | Pre-auth (all) |
| **Priority** | P0 |

### 2. dashboard.html
| Attribute | Value |
|---|---|
| **Layout** | B (Sidebar + Main + Right) |
| **Status** | Exists - needs dynamic data + view modes |
| **Canvas API** | `GET /api/v1/users/self`, `GET /api/v1/courses`, `GET /api/v1/users/self/todo`, `GET /api/v1/planner/items`, `GET /api/v1/calendar_events`, `GET /api/v1/dashboard/dashboard_cards`, `GET /api/v1/users/self/upcoming_events`, `PUT /api/v1/users/self/colors/course_:id`, `PUT /api/v1/users/:id/course_nicknames/:id`, `GET /api/v1/conversations?scope=unread` |
| **Components** | Course cards (with color/image), To-Do list, Coming Up, Recent Feedback, progress bars, view toggle (Card/List/Activity), planner items, notification badge |
| **Roles** | Student (full), Teacher (full), Observer (limited) |
| **Priority** | P0 |

### 3. courses.html
| Attribute | Value |
|---|---|
| **Layout** | A (Sidebar + Full Main) |
| **Status** | Exists - needs all courses view + favorites |
| **Canvas API** | `GET /api/v1/courses?include[]=term&include[]=teachers&include[]=total_scores`, `GET /api/v1/users/self/favorites/courses`, `POST /api/v1/users/self/favorites/courses/:id`, `DELETE /api/v1/users/self/favorites/courses/:id`, `GET /api/v1/search/all_courses` |
| **Components** | Course list/grid, tab filters (current/past/future/all), favorite star, enrollment role badge, term grouping, search bar, course images |
| **Roles** | Student (enrolled), Teacher (teaching + enrolled), Admin (all) |
| **Priority** | P0 |

### 4. class.html
| Attribute | Value |
|---|---|
| **Layout** | B (Sidebar + Main + Right) — with course sub-nav |
| **Status** | Exists - needs dynamic course data + Canvas nav |
| **Canvas API** | `GET /api/v1/courses/:id?include[]=syllabus_body&include[]=teachers&include[]=term`, `GET /api/v1/courses/:id/tabs`, `GET /api/v1/courses/:id/modules?include[]=items`, `GET /api/v1/courses/:id/assignments`, `GET /api/v1/announcements?context_codes[]=course_:id&latest_only=true`, `GET /api/v1/courses/:id/activity_stream` |
| **Components** | Course header (image, title, code, term), course sub-navigation (from tabs API), module preview, recent announcements, recent activity |
| **Roles** | All enrolled roles |
| **Priority** | P0 |

### 5. classroom.html
| Attribute | Value |
|---|---|
| **Layout** | B (Sidebar + Main + Right) |
| **Status** | Exists - needs dynamic content |
| **Canvas API** | Same as class.html + content-specific endpoints |
| **Components** | Active class content, video player, lesson content |
| **Roles** | All enrolled roles |
| **Priority** | P1 |

### 6. calendar.html
| Attribute | Value |
|---|---|
| **Layout** | A (Sidebar + Full Main) |
| **Status** | Exists - needs Canvas events + additional views |
| **Canvas API** | `GET /api/v1/calendar_events?type=event&start_date=&end_date=`, `GET /api/v1/calendar_events?type=assignment&start_date=&end_date=`, `POST /api/v1/calendar_events`, `PUT /api/v1/calendar_events/:id`, `DELETE /api/v1/calendar_events/:id`, `GET /api/v1/appointment_groups`, `POST /api/v1/appointment_groups/:id/reservations` |
| **Components** | Month/week/agenda views, multi-calendar toggle (per course), assignment overlays, drag-drop reschedule, appointment scheduler, undated items panel, event create/edit modal, iCal export link |
| **Roles** | Student (view + personal events), Teacher (all + scheduler), Observer (observee events) |
| **Priority** | P0 |

### 7. announcement.html
| Attribute | Value |
|---|---|
| **Layout** | A (Sidebar + Full Main) |
| **Status** | Exists - needs dynamic data + detail view |
| **Canvas API** | `GET /api/v1/announcements?context_codes[]=course_:id`, `GET /api/v1/courses/:id/discussion_topics/:id` (announcement detail), `POST /api/v1/courses/:id/discussion_topics` (create with `is_announcement=true`), `GET /api/v1/courses/:id/discussion_topics/:id/entries` (replies) |
| **Components** | Announcement list, search, course filter, unread indicators, detail view with replies, create/edit form with RCE, section targeting, delayed posting |
| **Roles** | Student (view, reply if allowed), Teacher (full CRUD) |
| **Priority** | P1 |

### 8. inbox.html
| Attribute | Value |
|---|---|
| **Layout** | C (Sidebar + Split Pane) |
| **Status** | Exists - needs full messaging features |
| **Canvas API** | `GET /api/v1/conversations`, `GET /api/v1/conversations/:id`, `POST /api/v1/conversations`, `POST /api/v1/conversations/:id/add_message`, `PUT /api/v1/conversations/:id` (star, archive, mark read), `PUT /api/v1/conversations` (batch update), `DELETE /api/v1/conversations/:id`, `GET /api/v1/search/recipients`, `POST /api/v1/conversations/:id/add_message` (with attachment) |
| **Components** | Conversation list, thread view, compose modal, course/group filter, scope tabs (inbox/unread/starred/sent/archived/submission comments), bulk actions, address book, media comment recording, attachment upload, search, read/unread toggle |
| **Roles** | All authenticated users |
| **Priority** | P0 |

### 9. profile.html
| Attribute | Value |
|---|---|
| **Layout** | A (Sidebar + Full Main) |
| **Status** | Exists - needs editable fields + Canvas data |
| **Canvas API** | `GET /api/v1/users/self/profile`, `PUT /api/v1/users/self`, `GET /api/v1/users/self/enrollments`, `GET /api/v1/users/self/settings` |
| **Components** | Avatar (upload/change), editable name fields, pronouns, bio, personal links, enrolled courses list, timezone/language, name pronunciation |
| **Roles** | All authenticated (own profile only) |
| **Priority** | P1 |

---

## New Pages Required (30+ files)

### Course Content Pages

#### 10. assignments.html — Assignments Index
| Attribute | Value |
|---|---|
| **Layout** | A |
| **Canvas API** | `GET /api/v1/courses/:id/assignment_groups?include[]=assignments&include[]=submission`, `GET /api/v1/courses/:id/assignments?include[]=submission&order_by=position` |
| **Components** | Assignment group sections (collapsible), assignment rows (icon, name, due date, points, status pill), search/filter, publish toggle (instructor), drag reorder (instructor), weight display |
| **Priority** | P0 |

#### 11. assignment-detail.html — Assignment Detail + Submission
| Attribute | Value |
|---|---|
| **Layout** | A |
| **Canvas API** | `GET /api/v1/courses/:id/assignments/:id`, `GET /api/v1/courses/:id/assignments/:id/submissions/self`, `POST /api/v1/courses/:id/assignments/:id/submissions`, `GET /api/v1/courses/:id/rubrics/:id`, `GET /api/v1/courses/:id/assignments/:id/peer_reviews` |
| **Components** | Breadcrumbs, assignment header (title, due, points), description (rendered HTML), rubric display, submission area (text/file/URL/media tabs), submission history, comments thread, peer review display |
| **Priority** | P0 |

#### 12. quizzes.html — Quizzes Index
| Attribute | Value |
|---|---|
| **Layout** | A |
| **Canvas API** | `GET /api/v1/courses/:id/quizzes` |
| **Components** | Quiz list, type badges, due dates, attempt info, time limits, availability status, publish toggle (instructor) |
| **Priority** | P1 |

#### 13. quiz-take.html — Quiz Taking Interface
| Attribute | Value |
|---|---|
| **Layout** | D (Full Width) |
| **Canvas API** | `POST /api/v1/courses/:id/quizzes/:id/submissions`, `GET /api/v1/courses/:id/quizzes/:id/submissions/:id/questions`, `PUT /api/v1/courses/:id/quizzes/:id/submissions/:id/questions/:id/flag`, `POST /api/v1/courses/:id/quizzes/:id/submissions/:id/complete` |
| **Components** | Timer bar, question navigation sidebar, question display (all types), flag toggle, answer inputs (radio/checkbox/text/dropdown/editor/file), previous/next nav, submit button + confirmation |
| **Priority** | P1 |

#### 14. quiz-results.html — Quiz Results
| Attribute | Value |
|---|---|
| **Layout** | A |
| **Canvas API** | `GET /api/v1/courses/:id/quizzes/:id/submissions/:id`, `GET /api/v1/courses/:id/quizzes/:id/statistics` |
| **Components** | Score display, question review (correct/incorrect indicators), attempt history, statistics (instructor), score distribution chart |
| **Priority** | P1 |

#### 15. discussions.html — Discussions Index
| Attribute | Value |
|---|---|
| **Layout** | A |
| **Canvas API** | `GET /api/v1/courses/:id/discussion_topics` |
| **Components** | Pinned section, open discussions, closed section, search, graded indicator, unread count, subscribe toggle, last reply info, create button (instructor) |
| **Priority** | P1 |

#### 16. discussion-thread.html — Discussion Thread
| Attribute | Value |
|---|---|
| **Layout** | A |
| **Canvas API** | `GET /api/v1/courses/:id/discussion_topics/:id`, `GET /api/v1/courses/:id/discussion_topics/:id/view`, `POST /api/v1/courses/:id/discussion_topics/:id/entries`, `POST /api/v1/courses/:id/discussion_topics/:id/entries/:id/replies`, `PUT /api/v1/courses/:id/discussion_topics/:id/entries/:id/rating`, `PUT /api/v1/courses/:id/discussion_topics/:id/read_all` |
| **Components** | Original post, threaded replies (nested), reply editor with RCE, like/rate buttons, subscribe toggle, unread indicators, edit/delete (own posts), mark all read |
| **Priority** | P1 |

#### 17. modules.html — Modules Index
| Attribute | Value |
|---|---|
| **Layout** | A (optionally B with right sidebar for progress) |
| **Canvas API** | `GET /api/v1/courses/:id/modules?include[]=items&include[]=content_details`, `PUT /api/v1/courses/:id/modules/:id/items/:id/done`, `GET /api/v1/courses/:id/module_item_sequence` |
| **Components** | Module list (collapsible), module items (typed icons), completion checkboxes, prerequisite lock indicators, requirement icons, progress bar per module, publish toggles (instructor), add item (instructor) |
| **Priority** | P0 |

#### 18. module-item.html — Module Item Viewer
| Attribute | Value |
|---|---|
| **Layout** | A with prev/next navigation bar |
| **Canvas API** | `GET /api/v1/courses/:id/module_item_sequence?asset_type=:type&asset_id=:id` |
| **Components** | Module breadcrumb, content viewer (embedded assignment/page/quiz/discussion), previous/next module item buttons, mark as done button, module requirements status |
| **Priority** | P1 |

#### 19. pages.html — Pages Index
| Attribute | Value |
|---|---|
| **Layout** | A |
| **Canvas API** | `GET /api/v1/courses/:id/pages?sort=title`, `GET /api/v1/courses/:id/front_page` |
| **Components** | Page list, search, sort (A-Z, date), front page indicator, publish status (instructor), last edited info, create button (instructor) |
| **Priority** | P1 |

#### 20. page-view.html — Page Content View
| Attribute | Value |
|---|---|
| **Layout** | A |
| **Canvas API** | `GET /api/v1/courses/:id/pages/:url`, `GET /api/v1/courses/:id/pages/:url/revisions` |
| **Components** | Breadcrumbs, page title, last edited info, rendered HTML content, edit button, revision history link |
| **Priority** | P1 |

#### 21. page-edit.html — Page Editor
| Attribute | Value |
|---|---|
| **Layout** | A |
| **Canvas API** | `PUT /api/v1/courses/:id/pages/:url`, `POST /api/v1/courses/:id/pages` |
| **Components** | Title input, RCE editor, publish toggle, edit permission selector (teachers only / teachers+students), to-do date picker, save/cancel buttons |
| **Priority** | P2 |

### Student Progress & Assessment

#### 22. grades.html — Student Grades View
| Attribute | Value |
|---|---|
| **Layout** | A |
| **Canvas API** | `GET /api/v1/courses/:id/assignment_groups?include[]=assignments&include[]=submission`, `GET /api/v1/courses/:id/enrollments?user_id=self`, `GET /api/v1/courses/:id/assignments?include[]=submission&include[]=score_statistics` |
| **Components** | Course selector, grading period filter, total grade (large display), assignment table (name, due, status, score, out of), What-If score toggle, scoring details (mean/high/low), assignment group subtotals, comments indicator |
| **Priority** | P0 |

#### 23. gradebook.html — Instructor Gradebook
| Attribute | Value |
|---|---|
| **Layout** | D (Full Width) |
| **Canvas API** | `GET /api/v1/courses/:id/enrollments?include[]=grades`, `GET /api/v1/courses/:id/assignments`, `GET /api/v1/courses/:id/students/submissions?student_ids[]=all`, `PUT /api/v1/courses/:id/assignments/:id/submissions/:id`, `GET /api/v1/courses/:id/custom_gradebook_columns`, `POST /api/v1/courses/:id/assignments/:id/submissions/update_grades` (bulk) |
| **Components** | Spreadsheet grid (frozen student column + scrollable assignment columns), editable grade cells, status indicators (late/missing/excused), filters (section/module/group/period), view toggles (default/individual/mastery), grade posting controls, import/export CSV, late policy settings, "Message Students Who" dialog |
| **Priority** | P2 (instructor-only) |

#### 24. speedgrader.html — SpeedGrader
| Attribute | Value |
|---|---|
| **Layout** | D (Full Width, custom) |
| **Canvas API** | `GET /api/v1/courses/:id/assignments/:id/submissions?include[]=rubric_assessment`, `PUT /api/v1/courses/:id/assignments/:id/submissions/:id`, `POST /api/v1/courses/:id/assignments/:id/submissions/:id/comments`, `GET /api/v1/courses/:id/assignments/:id/rubric` |
| **Components** | Submission viewer (DocViewer for docs, inline for text, iframe for URL), annotation toolbar, rubric assessment panel, grade input, submission comments (text/audio/video), student selector dropdown, submission attempt selector, moderated grading panel |
| **Priority** | P3 (instructor-only, complex) |

#### 25. outcomes.html — Outcomes
| Attribute | Value |
|---|---|
| **Layout** | C (Split: tree + detail) |
| **Canvas API** | `GET /api/v1/courses/:id/outcome_groups/:id/outcomes`, `GET /api/v1/courses/:id/outcome_group_links`, `GET /api/v1/outcomes/:id`, `GET /api/v1/courses/:id/outcome_results` |
| **Components** | Outcome group tree (left), outcome detail (right: title, description, calculation method, mastery threshold, ratings), aligned items list, mastery status for student, import outcomes (instructor) |
| **Priority** | P3 |

#### 26. rubrics.html — Rubrics
| Attribute | Value |
|---|---|
| **Layout** | A |
| **Canvas API** | `GET /api/v1/courses/:id/rubrics`, `GET /api/v1/courses/:id/rubrics/:id`, `POST /api/v1/courses/:id/rubrics`, `PUT /api/v1/courses/:id/rubrics/:id` |
| **Components** | Rubric list, rubric builder (criteria rows, rating columns, points, descriptions), total points, use-for-grading toggle, free-form comments toggle, outcome-aligned criteria |
| **Priority** | P3 (instructor-only) |

### Course Resources

#### 27. files.html — File Browser
| Attribute | Value |
|---|---|
| **Layout** | A |
| **Canvas API** | `GET /api/v1/courses/:id/folders/:id/files`, `GET /api/v1/courses/:id/folders/:id/folders`, `GET /api/v1/courses/:id/files/quota`, `POST /api/v1/courses/:id/files` (upload), `POST /api/v1/courses/:id/folders`, `PUT /api/v1/files/:id`, `DELETE /api/v1/files/:id` |
| **Components** | Folder tree / breadcrumb path, file/folder table (name, date, size, published), upload dropzone, create folder button, storage quota bar, bulk actions (download, move, delete), drag-and-drop upload, publish toggle (instructor) |
| **Priority** | P2 |

#### 28. syllabus.html — Syllabus
| Attribute | Value |
|---|---|
| **Layout** | B (with right sidebar) |
| **Canvas API** | `GET /api/v1/courses/:id?include[]=syllabus_body`, `GET /api/v1/courses/:id/assignments?order_by=due_at` (for course summary) |
| **Components** | Syllabus description (rendered HTML), course summary table (auto-generated: date, assignment name, due), mini calendar (right sidebar), assignment group weights (right sidebar), edit button (instructor) |
| **Priority** | P2 |

#### 29. people.html — Course Roster
| Attribute | Value |
|---|---|
| **Layout** | A |
| **Canvas API** | `GET /api/v1/courses/:id/users?include[]=enrollments&include[]=avatar_url`, `GET /api/v1/courses/:id/sections`, `POST /api/v1/courses/:id/enrollments` (add people), `GET /api/v1/courses/:id/group_categories`, `GET /api/v1/group_categories/:id/groups` |
| **Components** | People table (avatar, name, login, section, role badge, last activity), search + role filter, tabs (Everyone / Groups), add people form (instructor), student context card (instructor popup), group sets and management (instructor) |
| **Priority** | P2 |

### Communication & Collaboration

#### 30. groups.html — Groups Workspace
| Attribute | Value |
|---|---|
| **Layout** | A (with group sub-nav) |
| **Canvas API** | `GET /api/v1/users/self/groups`, `GET /api/v1/groups/:id`, `GET /api/v1/groups/:id/users`, `GET /api/v1/groups/:id/discussion_topics`, `GET /api/v1/groups/:id/files`, `GET /api/v1/groups/:id/pages` |
| **Components** | Group list, group workspace with sub-nav (Home, Announcements, Pages, People, Discussions, Files, Conferences, Collaborations), group member list |
| **Priority** | P3 |

#### 31. conferences.html — Video Conferences
| Attribute | Value |
|---|---|
| **Layout** | A |
| **Canvas API** | `GET /api/v1/courses/:id/conferences`, `POST /api/v1/courses/:id/conferences` |
| **Components** | Active conference cards (title, participants, join button), concluded conference cards (title, date, recording link), create dialog (title, duration, description, invite users, recording toggle) |
| **Priority** | P3 |

#### 32. collaborations.html — Document Collaborations
| Attribute | Value |
|---|---|
| **Layout** | A |
| **Canvas API** | `GET /api/v1/courses/:id/collaborations`, `GET /api/v1/collaborations/:id/members` |
| **Components** | Collaboration list (doc icon, title, creator, date, collaborators, open button), create dialog (type: Google/Office365, title, description, add people), embedded document viewer |
| **Priority** | P3 |

### User Account

#### 33. account-settings.html — Account Settings
| Attribute | Value |
|---|---|
| **Layout** | E (Tabbed) |
| **Canvas API** | `GET /api/v1/users/self/settings`, `PUT /api/v1/users/self/settings`, `GET /api/v1/users/self/communication_channels`, `POST /api/v1/users/self/tokens`, `DELETE /api/v1/users/self/tokens/:id` |
| **Components** | Tabs (Profile, Integrations, Notifications, Security), name fields (full/display/sortable), email management, language/timezone selectors, API tokens list, registered services, MFA setup, feature options |
| **Priority** | P2 |

#### 34. notifications.html — Notification Preferences
| Attribute | Value |
|---|---|
| **Layout** | A |
| **Canvas API** | `GET /api/v1/users/self/communication_channels/:id/notification_preferences`, `PUT /api/v1/users/self/communication_channels/:id/notification_preferences/:notification` |
| **Components** | Preference matrix (category rows x frequency columns), radio buttons per cell, per-course override section, push notification toggle |
| **Priority** | P2 |

#### 35. user-files.html — Personal Files
| Attribute | Value |
|---|---|
| **Layout** | A |
| **Canvas API** | `GET /api/v1/users/self/files`, `GET /api/v1/users/self/folders/:id`, `POST /api/v1/users/self/files` (upload) |
| **Components** | Same as files.html but scoped to personal storage |
| **Priority** | P3 |

#### 36. eportfolio.html — ePortfolios
| Attribute | Value |
|---|---|
| **Layout** | A (with portfolio sub-nav) |
| **Canvas API** | `GET /api/v1/users/self/eportfolios`, `GET /api/v1/eportfolios/:id`, `GET /api/v1/eportfolios/:id/pages` |
| **Components** | Portfolio list, portfolio editor (section nav, page editor with RCE, add submission embed, add image/file), visibility toggle (public/private), shareable link, portfolio preview mode |
| **Priority** | P3 |

### Course Admin (Instructor)

#### 37. course-settings.html — Course Settings
| Attribute | Value |
|---|---|
| **Layout** | E (Tabbed) |
| **Canvas API** | `GET /api/v1/courses/:id/settings`, `PUT /api/v1/courses/:id/settings`, `GET /api/v1/courses/:id/tabs`, `PUT /api/v1/courses/:id/tabs/:id`, `GET /api/v1/courses/:id/sections`, `GET /api/v1/courses/:id/external_tools`, `GET /api/v1/courses/:id/features` |
| **Components** | Tabs (Details, Sections, Navigation, Apps, Features), course name/code/timezone/language, grading scheme, visibility, start/end dates, section management, draggable nav reorder, external tools list, feature flags, action sidebar (import/export/copy/reset/conclude/delete) |
| **Priority** | P3 |

#### 38. content-migration.html — Content Import/Export
| Attribute | Value |
|---|---|
| **Layout** | A |
| **Canvas API** | `POST /api/v1/courses/:id/content_migrations`, `GET /api/v1/courses/:id/content_migrations/:id`, `GET /api/v1/courses/:id/content_migrations/migrators`, `POST /api/v1/courses/:id/content_exports` |
| **Components** | Import wizard (source type selector, file upload, content selection checklist, date adjustment), import progress bar, export download links, migration history list |
| **Priority** | P3 |

#### 39. analytics.html — Course Analytics
| Attribute | Value |
|---|---|
| **Layout** | A |
| **Canvas API** | `GET /api/v1/courses/:id/analytics/activity`, `GET /api/v1/courses/:id/analytics/assignments`, `GET /api/v1/courses/:id/analytics/student_summaries`, `GET /api/v1/courses/:id/analytics/users/:id/activity`, `GET /api/v1/courses/:id/analytics/users/:id/assignments` |
| **Components** | Grade distribution bar chart, weekly activity line chart, student summary table (sortable), "Message Students Who" dialog, individual student drill-down, CSV export |
| **Priority** | P3 |

---

## Shared Components (used across multiple pages)

### Global Components

| Component | File (recommended) | Used On |
|---|---|---|
| Left Sidebar (global nav) | `components/sidebar.html` | All authenticated pages |
| Top Bar (search, notifications, avatar) | `components/topbar.html` | All authenticated pages |
| Notification Dropdown | `components/notification-dropdown.html` | All (via top bar) |
| User Menu Dropdown | `components/user-menu.html` | All (via top bar) |
| Breadcrumbs | `components/breadcrumbs.html` | All inner pages |
| Course Sub-Navigation | `components/course-nav.html` | All course-context pages |
| Mobile Hamburger Drawer | `components/mobile-drawer.html` | All (responsive) |
| Footer | `components/footer.html` | All (optional) |

### Content Components

| Component | Used On |
|---|---|
| Rich Content Editor (RCE) | Announcements, Assignments, Discussions, Pages, Quizzes, Syllabus, Inbox |
| Status Pill | Assignments, Grades, Gradebook, Modules |
| Progress Bar | Dashboard, Profile, Courses, Modules |
| Avatar | Dashboard, Inbox, People, Discussions, Profile |
| Course Card | Dashboard, Courses |
| Assignment Row | Assignments Index, Grades, Modules |
| File Upload Zone | Assignment Submit, Files, Inbox, Profile |
| Confirmation Dialog | Delete actions, Submit quiz, Post grades |
| Toast Notification | All pages (success/error feedback) |
| Pagination | Announcements, Assignments, Courses, Files, People, Inbox |
| Empty State | All list pages (no data placeholder) |
| Loading Skeleton | All pages (during API fetch) |
| Search Input (pill) | Announcements, Courses, Discussions, Files, Inbox, Pages, People |
| Calendar Widget | Dashboard (right sidebar), Syllabus |
| Date Picker | Assignment create/edit, Calendar event, Quiz settings |

---

## Page Count Summary

| Category | Count | Status |
|---|---|---|
| Existing pages (need enhancement) | 9 | Enhancement specs in CANVAS_BRIDGE.md |
| New course content pages | 12 | Specified above (items 10-21) |
| New assessment/progress pages | 5 | Specified above (items 22-26) |
| New resource pages | 3 | Specified above (items 27-29) |
| New communication pages | 3 | Specified above (items 30-32) |
| New account pages | 4 | Specified above (items 33-36) |
| New admin/instructor pages | 3 | Specified above (items 37-39) |
| **Total pages** | **39** | 9 existing + 30 new |
| Shared components | 16+ | Reusable across pages |
