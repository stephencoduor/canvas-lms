# Remaining Canvas LMS Features — Migration Roadmap

## Status Summary

| Category | Migrated | Remaining | Coverage |
|----------|----------|-----------|----------|
| Core Pages | 50 | 0 | 100% |
| Canvas Feature Modules | 50 routes | 183 modules | ~21% |

Canvas has **233 feature modules** in `ui/features/`. Many are small components, modals, sub-features, or internal tools — not standalone pages. Of the ~80-90 that represent actual user-facing pages, we've covered **50** (the most important ones). Below is a categorized list of all remaining Canvas features with implementation priority.

---

## Already Migrated (50 Pages / 49 Routes)

### Authentication & Entry
- ✅ LoginPage (`/login`)
- ✅ DashboardPage (`/dashboard`)
- ✅ NotFoundPage (`/*`)

### Courses
- ✅ CoursesPage (`/courses`)
- ✅ AllCoursesPage (`/all-courses`)
- ✅ CourseHomePage (`/courses/:id`)
- ✅ CourseSettingsPage (`/courses/:id/settings`)
- ✅ CourseAnnouncementsPage (`/courses/:id/announcements`)
- ✅ SyllabusPage (`/courses/:id/syllabus`)

### Content
- ✅ AssignmentsPage, AssignmentDetailPage
- ✅ ModulesPage
- ✅ PagesListPage, PageViewPage
- ✅ FilesPage

### Assessment
- ✅ QuizzesPage
- ✅ GradesPage
- ✅ GradebookPage, SpeedGraderPage
- ✅ RubricsPage
- ✅ OutcomesPage

### Communication
- ✅ DiscussionsPage, DiscussionThreadPage
- ✅ InboxPage
- ✅ ConferencesPage
- ✅ CollaborationsPage
- ✅ PeoplePage
- ✅ GroupsPage
- ✅ AnnouncementsPage

### Admin
- ✅ AdminDashboardPage
- ✅ UserManagementPage
- ✅ ReportsPage
- ✅ PermissionsPage
- ✅ TermsPage
- ✅ DeveloperKeysPage

### Personal
- ✅ ProfilePage
- ✅ AccountSettingsPage
- ✅ CalendarPage
- ✅ PlannerPage
- ✅ EPortfolioPage
- ✅ NotificationsPage
- ✅ ChangePasswordPage

### Services
- ✅ SearchPage
- ✅ ContentMigrationsPage
- ✅ AnalyticsPage, StudentAnalyticsPage
- ✅ HelpCenterPage
- ✅ AccessibilityPage
- ✅ TermsOfServicePage

---

## Remaining Features by Priority

### Priority 1: High Impact (Should Implement Next)

These are user-facing features that students/teachers actively use.

| # | Canvas Feature | Proposed Route | Description | Effort |
|---|---------------|----------------|-------------|--------|
| 1 | `assignment_edit` | `/courses/:id/assignments/:id/edit` | Create/edit assignment form (title, description, points, due date, submission type, rubric attachment) | 6h |
| 2 | `wiki_page_edit` | `/courses/:id/pages/:url/edit` | Rich text editor for wiki pages (TinyMCE or Tiptap) | 6h |
| 3 | `discussion_topic_edit_v2` | `/courses/:id/discussions/new` | Create/edit discussion topic form | 4h |
| 4 | `submit_assignment` | `/courses/:id/assignments/:id/submit` | Assignment submission form (file upload, text entry, URL, media) | 6h |
| 5 | `take_quiz` | `/courses/:id/quizzes/:id/take` | Quiz-taking interface (question-by-question, timer, submit) | 8h |
| 6 | `quiz_show` | `/courses/:id/quizzes/:id` | Quiz detail page (description, settings, attempts, results link) | 4h |
| 7 | `quiz_statistics` | `/courses/:id/quizzes/:id/statistics` | Quiz analytics (question stats, discrimination index) | 4h |
| 8 | `quiz_submission` | `/courses/:id/quizzes/:id/results` | Quiz results review (answers, correct/incorrect, score) | 4h |
| 9 | `course_paces` | `/courses/:id/paces` | Course pacing tool (set dates per student/section) | 6h |
| 10 | `copy_course` | `/courses/:id/copy` | Course copy wizard (select content, destination) | 4h |
| **Subtotal** | | | | **52h** |

### Priority 2: Medium Impact (Nice to Have)

Features used by some users or in specific workflows.

| # | Canvas Feature | Proposed Route | Description | Effort |
|---|---------------|----------------|-------------|--------|
| 11 | `assignments_peer_reviews` | `/courses/:id/assignments/:id/peer-reviews` | Peer review management (assign reviewers, view status) | 4h |
| 12 | `calendar_appointment_group_edit` | `/calendar/appointments/new` | Create appointment groups (sign-up slots for office hours) | 4h |
| 13 | `context_modules_v2` | (enhance existing) | Enhanced module view with drag-and-drop reorder | 4h |
| 14 | `blueprint_course_master` | `/admin/blueprint-courses` | Blueprint course management (lock/sync content) | 4h |
| 15 | `content_shares` | `/courses/:id/content-sharing` | Share content between courses/users | 3h |
| 16 | `content_exports` | `/courses/:id/exports` | Export course content (ZIP, QTI, Common Cartridge) | 3h |
| 17 | `course_link_validator` | `/courses/:id/link-validator` | Scan course for broken links | 3h |
| 18 | `course_statistics` | `/courses/:id/statistics` | Course-level statistics (enrollments, activity) | 3h |
| 19 | `course_wizard` | `/courses/new` | Course creation wizard (name, code, dates, template) | 4h |
| 20 | `grade_summary` | `/courses/:id/grades/summary` | Grade summary with what-if scores | 3h |
| 21 | `gradebook_history` | `/courses/:id/gradebook/history` | Gradebook change log (who changed what grade when) | 3h |
| 22 | `gradebook_uploads` | `/courses/:id/gradebook/upload` | CSV grade upload | 3h |
| 23 | `question_banks` | `/courses/:id/question-banks` | Question bank management for quizzes | 4h |
| 24 | `rubric_assessment` | `/courses/:id/rubrics/:id/assess` | Rubric assessment interface (used in speed grader) | 4h |
| 25 | `sis_import` | `/admin/sis-import` | SIS data import (CSV upload, mapping) | 4h |
| 26 | `sub_accounts` | `/admin/sub-accounts` | Sub-account hierarchy management | 3h |
| 27 | `user_grades` | `/users/:id/grades` | User's grades across all courses | 3h |
| 28 | `user_logins` | `/admin/users/:id/logins` | Manage user login credentials | 2h |
| 29 | `user_observees` | `/settings/observees` | Parent/observer linked students | 2h |
| 30 | `user_outcome_results` | `/users/:id/outcomes` | User outcome mastery results | 3h |
| **Subtotal** | | | | **66h** |

### Priority 3: Low Impact (Edge Cases / Admin Tools)

Rarely used or very specialized features.

| # | Canvas Feature | Proposed Route | Description | Effort |
|---|---------------|----------------|-------------|--------|
| 31 | `acceptable_use_policy` | `/acceptable-use` | Acceptable use policy page | 1h |
| 32 | `account_admin_tools` | `/admin/tools` | Admin tools dashboard | 2h |
| 33 | `account_calendar_settings` | `/admin/calendar-settings` | Account-level calendar settings | 2h |
| 34 | `account_course_user_search` | `/admin/search` | Search across all courses/users | 3h |
| 35 | `account_grading_settings` | `/admin/grading-settings` | Default grading scheme config | 2h |
| 36 | `account_grading_standards` | `/admin/grading-standards` | Grading standards management | 2h |
| 37 | `account_manage` | `/admin/account` | Account management | 2h |
| 38 | `account_notification_settings` | `/admin/notifications` | Account notification defaults | 2h |
| 39 | `account_statistics` | `/admin/statistics` | Account-wide stats | 2h |
| 40 | `act_as_modal` | (modal) | "Act as" user impersonation | 2h |
| 41 | `admin_split` | `/admin/split` | Split user accounts | 1h |
| 42 | `authentication_providers` | `/admin/auth-providers` | SAML/LDAP/OAuth config | 4h |
| 43 | `brand_configs` | `/admin/themes` | Theme/brand customization | 3h |
| 44 | `choose_mastery_path` | (inline) | Mastery path selection in modules | 2h |
| 45 | `context_prior_users` | `/courses/:id/prior-users` | Previous course enrollments | 1h |
| 46 | `course_grading_standards` | `/courses/:id/grading-standards` | Course grading scheme | 2h |
| 47 | `course_notification_settings` | `/courses/:id/notification-settings` | Per-course notification prefs | 2h |
| 48 | `course_people_new` | `/courses/:id/people/add` | Add people to course form | 2h |
| 49 | `manage_groups` | `/courses/:id/groups/manage` | Create/edit group sets | 3h |
| 50 | `page_views` | `/admin/page-views` | User page view analytics | 2h |
| 51 | `plugins` | `/admin/plugins` | Plugin management | 2h |
| 52 | `profile_show` | `/users/:id` | Public user profile view | 2h |
| 53 | `rate_limiting_settings` | `/admin/rate-limiting` | API rate limit config | 1h |
| 54 | `registration` | `/register` | Self-registration form | 3h |
| 55 | `release_notes_edit` | `/admin/release-notes` | Release notes editor | 2h |
| 56 | `section` | `/courses/:id/sections` | Course section management | 2h |
| 57 | `teacher_activity_report` | `/courses/:id/teacher-report` | Teacher activity report | 2h |
| 58 | `terms_index` | `/admin/terms/manage` | Term CRUD management | 2h |
| 59 | `theme_editor` | `/admin/theme-editor` | Visual theme editor | 4h |
| 60 | `theme_preview` | `/admin/theme-preview` | Theme preview | 2h |
| **Subtotal** | | | | **66h** |

### Not Applicable for React SPA (Components / Internal)

These Canvas feature modules are NOT standalone pages. They're components, modals, utilities, or internal tools that don't need dedicated routes.

| Canvas Feature | Reason |
|---------------|--------|
| `confetti` | Animation effect (import as utility) |
| `progress_pill` | Small UI component (already in StatusPill) |
| `pendo` | Analytics integration (script injection) |
| `select_content_dialog` | Modal dialog (embed in copy/import flows) |
| `context_module_progressions` | Data utility (already in ModulesPage) |
| `context_modules_publish_icon` | Icon component |
| `context_modules_publish_menu` | Dropdown component |
| `context_undelete_item` | Admin utility |
| `copy_warnings_modal` | Modal dialog |
| `nav_tourpoints` | Onboarding tooltip tour |
| `top_navigation_tools` | LTI nav integration |
| `widget_dashboard` | Dashboard widget (already in DashboardPage) |
| `slickgrid` | Data grid library (for gradebook) |
| `student_group_dialog` | Modal for group creation |
| `submission_download` | File download utility |
| `submissions_show_preview_*` | Submission preview sub-components (4 variants) |
| `context_media_object_inline` | Media embed component |
| `quiz_migration_alerts` | Alert banner |
| `quizzes_access_code` | Modal for quiz access code |
| `block_editor_iframe_content` | Block editor internal |
| `available_pronouns_list` | Dropdown data |
| `confirm_email` | Email confirmation flow |
| `registration_confirmation` | Confirmation page |
| `qr_mobile_login` | QR code login |
| `prerequisites_lookup` | Prerequisite checker |
| `past_global_alert` | Banner component |
| `past_global_announcements` | Banner component |
| `settings_sidebar` | Sidebar component |
| `current_groups` | Group list widget |
| `content_notices` | Notice banner |
| `youtube_migration` | Migration tool |
| `webzip_export` | Export utility |
| `users_admin_merge` | Admin merge tool |
| `user_name` | Name display component |
| `user_lists` | User list widget |
| `study_assist` | AI study assistant |
| `self_enrollment` | Self-enroll modal |
| `roster` | Roster component (in PeoplePage) |
| `public_javascripts_tests` | Test framework |
| `password_complexity_configuration` | Admin setting |
| `context_roster_user_services` | User service links |
| `context_roster_groups` | Roster group view |
| `ai_experiences_*` | AI features (4 modules) |
| `ams` | AMS integration |
| `canvas_career` | Career integration |
| `course_show_secondary` | Secondary course view |
| `course_list` | Course list widget |
| `announcements_on_home_page` | Home page widget |
| `assignment_grade_summary` | Grade summary widget |
| `analytics_hub` | Analytics hub widget |
| `blueprint_course_child` | Blueprint child indicator |
| `quiz_log_auditing` | Quiz audit log |
| `quiz_history` | Quiz attempt history |
| `rubrics_index` | Rubrics list (in RubricsPage) |
| `rubrics_show` | Rubric detail (in RubricsPage) |
| `syllabus_revisions` | Syllabus version history |
| `wiki_page_revisions` | Page version history |
| `wiki_page_index` | Page list (in PagesListPage) |
| `wiki_page_show` | Page view (in PageViewPage) |

**Total: ~70 modules that are components/utilities, not pages**

---

## Implementation Plan

### Phase 1: Content Editing (Priority 1, items 1-5) — ~30h
Add create/edit capabilities for the content types we already display:
- Assignment editor with rich text
- Wiki page editor
- Discussion topic creator
- Submission form with file upload
- Quiz-taking interface

### Phase 2: Quiz & Grading Enhancements (Priority 1, items 6-10) — ~22h
Complete the assessment workflow:
- Quiz detail/statistics/results pages
- Course pacing tool
- Course copy wizard

### Phase 3: Admin & Management (Priority 2, items 11-20) — ~34h
Add management and configuration pages:
- Peer review management
- Appointment scheduling
- Blueprint courses
- Content sharing/export
- Course creation wizard

### Phase 4: User & Account Management (Priority 2, items 21-30) — ~32h
Complete user management:
- Gradebook history/uploads
- Question banks
- SIS import
- User management sub-pages
- Observer/observee links

### Phase 5: Remaining Admin Tools (Priority 3) — ~66h
Low-priority admin and edge-case features.

---

## Total Effort Estimate

| Priority | Pages | Hours |
|----------|-------|-------|
| Already Done | 50 | ~40h |
| Priority 1 (High) | 10 | ~52h |
| Priority 2 (Medium) | 20 | ~66h |
| Priority 3 (Low) | 30 | ~66h |
| Not Applicable | ~70 | N/A |
| **Total** | **~110 pages** | **~224h** |

Current coverage: **50/~110 pages = 45%** of user-facing features
With Priority 1: **60/~110 = 55%**
With Priority 1+2: **80/~110 = 73%**
With all priorities: **110/~110 = 100%**
