# Canvas LMS REST API -- Comprehensive Endpoint Catalog

Base URL: `https://<your-canvas-domain>/api/v1/` (unless noted otherwise for New Quizzes)

All endpoints require OAuth2 Bearer token authentication. Responses are JSON. Lists are paginated via Link headers.

---

## 1. Users and Profiles

**Base path:** `/api/v1/users`, `/api/v1/accounts/:account_id/users`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/accounts/:account_id/users` | List users in account | search_term, enrollment_type, sort, order, include[] |
| POST | `/accounts/:account_id/users` | Create user | user[name], pseudonym[unique_id], pseudonym[password], pseudonym[sis_user_id], communication_channel[address] |
| POST | `/accounts/:account_id/self_registration` | Self-register user | user[name], pseudonym[unique_id] |
| GET | `/users/:id` | Get single user | include[] |
| PUT | `/users/:id` | Update user | user[name], user[short_name], user[avatar][token], user[pronouns], user[event] |
| GET | `/users/:user_id/profile` | Get user profile | include[] |
| GET | `/users/:user_id/avatars` | List avatars | -- |
| GET | `/users/self/activity_stream` | Activity stream | only_active_courses |
| GET | `/users/self/activity_stream/summary` | Activity stream summary | only_active_courses |
| DELETE | `/users/self/activity_stream/:id` | Hide stream item | -- |
| DELETE | `/users/self/activity_stream` | Hide all stream items | -- |
| GET | `/users/self/todo` | List todo items | include[] |
| GET | `/users/self/todo_item_count` | Todo count | include[] |
| GET | `/users/self/upcoming_events` | Upcoming events | -- |
| GET | `/users/:user_id/missing_submissions` | Missing submissions | observed_user_id, include[], filter[], course_ids[] |
| GET/PUT | `/users/:id/settings` | Get/update settings | manual_mark_as_read, collapse_global_nav |
| GET | `/users/:id/colors` | Custom colors | -- |
| GET/PUT | `/users/:id/colors/:asset_string` | Get/set color | hexcode |
| GET/PUT | `/users/:id/dashboard_positions` | Dashboard positions | dashboard_positions |
| DELETE | `/users/:id/sessions` | Terminate sessions | -- |
| PUT | `/users/:id/merge_into/:dest_user_id` | Merge users | -- |
| POST | `/users/:id/split` | Split merged user | -- |
| GET | `/users/:id/graded_submissions` | Graded submissions | include[] |
| GET | `/users/:user_id/page_views` | Page views | start_time, end_time |
| PUT/GET/DELETE | `/users/:user_id/custom_data(/*scope)` | Custom data store | ns, data |
| GET | `/users/:user_id/page_views/query` | Async page view query (beta) | start_date, end_date, results_format |

**Returns:** User objects, Profile objects, Activity stream items, PageView objects, Settings objects

---

## 2. Courses

**Base path:** `/api/v1/courses`, `/api/v1/accounts/:account_id/courses`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/courses` | List current user's courses | enrollment_type, enrollment_state, include[], state[] |
| GET | `/users/:user_id/courses` | List user's courses | include[], state[] |
| GET | `/courses/:id` | Get single course | include[] |
| GET | `/accounts/:account_id/courses/:id` | Get course via account | -- |
| POST | `/accounts/:account_id/courses` | Create course | course[name], course[course_code], course[start_at], course[end_at], course[license], course[is_public], enroll_me, offer |
| PUT | `/courses/:id` | Update course | course[name], course[start_at], course[end_at], course[syllabus_body], course[grading_standard_id], course[term_id] |
| DELETE | `/courses/:id` | Delete/conclude course | event (delete/conclude) |
| PUT | `/accounts/:account_id/courses` | Bulk update courses | course_ids[], event |
| POST | `/courses/:course_id/reset_content` | Reset course content | -- |
| GET | `/courses/:course_id/settings` | Get course settings | -- |
| PUT | `/courses/:course_id/settings` | Update course settings | allow_student_discussion_topics, hide_final_grades, etc. |
| GET | `/courses/:course_id/students` | List students (deprecated) | -- |
| GET | `/courses/:course_id/users` | List course users | search_term, sort, enrollment_type[], include[] |
| GET | `/courses/:course_id/search_users` | Search users | search_term, sort, enrollment_type[] |
| GET | `/courses/:course_id/recent_students` | Recent students | -- |
| GET | `/courses/:course_id/users/:id` | Get single course user | -- |
| GET | `/courses/:course_id/content_share_users` | Content share users | -- |
| POST | `/courses/:course_id/preview_html` | Preview HTML | html |
| GET | `/courses/:course_id/activity_stream` | Course activity stream | -- |
| GET | `/courses/:course_id/todo` | Course todo items | -- |
| GET | `/courses/:course_id/effective_due_dates` | Effective due dates | -- |
| GET | `/courses/:course_id/permissions` | Check permissions | permissions[] |
| GET | `/courses/:course_id/bulk_user_progress` | Bulk user progress | -- |
| GET | `/courses/:course_id/student_view_student` | Test student info | -- |
| POST | `/courses/:course_id/course_copy` | Copy course (deprecated) | source_course |
| GET | `/courses/:course_id/course_copy/:id` | Copy status (deprecated) | -- |
| POST | `/courses/:course_id/files` | Upload file to course | (file upload params) |

**Returns:** Course objects, User objects, Progress objects

---

## 3. Enrollments

**Base path:** `/api/v1/courses/:course_id/enrollments`, `/api/v1/sections/:section_id/enrollments`, `/api/v1/users/:user_id/enrollments`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/courses/:course_id/enrollments` | List enrollments | type[], role[], state[], include[], grading_period_id |
| GET | `/sections/:section_id/enrollments` | List section enrollments | (same as above) |
| GET | `/users/:user_id/enrollments` | List user enrollments | (same as above) |
| GET | `/accounts/:account_id/enrollments/:id` | Get enrollment by ID | -- |
| POST | `/courses/:course_id/enrollments` | Enroll user | enrollment[user_id] (req), enrollment[type] (req), enrollment[enrollment_state], enrollment[notify], enrollment[course_section_id] |
| POST | `/sections/:section_id/enrollments` | Enroll in section | (same as above) |
| POST | `/accounts/:account_id/bulk_enrollment` | Bulk enroll | user_ids[], course_ids[], enrollment_type |
| DELETE | `/courses/:course_id/enrollments/:id` | Conclude/delete enrollment | task (conclude, delete, inactivate, deactivate) |
| POST | `/courses/:course_id/enrollments/:id/accept` | Accept invitation | -- |
| POST | `/courses/:course_id/enrollments/:id/reject` | Reject invitation | -- |
| PUT | `/courses/:course_id/enrollments/:id/reactivate` | Reactivate enrollment | -- |
| PUT | `/courses/:course_id/users/:user_id/last_attended` | Set last attended date | date |
| GET | `/users/:user_id/temporary_enrollment_status` | Temp enrollment status (beta) | account_id |

**Returns:** Enrollment objects, Progress objects

---

## 4. Assignments

**Base path:** `/api/v1/courses/:course_id/assignments`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/courses/:course_id/assignments` | List assignments | include[], search_term, bucket, assignment_ids[], order_by, post_to_sis |
| GET | `/courses/:course_id/assignments/:id` | Get assignment | include[], override_assignment_dates, all_dates |
| POST | `/courses/:course_id/assignments` | Create assignment | assignment[name] (req), assignment[submission_types][], assignment[points_possible], assignment[due_at], assignment[description], assignment[published], assignment[grading_type], assignment[peer_reviews], assignment[moderated_grading], assignment[anonymous_grading] |
| PUT | `/courses/:course_id/assignments/:id` | Update assignment | (same as create, all optional) |
| DELETE | `/courses/:course_id/assignments/:id` | Delete assignment | -- |
| POST | `/courses/:course_id/assignments/:id/duplicate` | Duplicate assignment | result_type |
| PUT | `/courses/:course_id/assignments/bulk_update` | Bulk update dates | JSON array of id + all_dates |

### Assignment Overrides

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/courses/:course_id/assignments/:assignment_id/overrides` | List overrides | -- |
| GET | `/courses/:course_id/assignments/:assignment_id/overrides/:id` | Get override | -- |
| POST | `/courses/:course_id/assignments/:assignment_id/overrides` | Create override | student_ids[], title, group_id, course_section_id, due_at, unlock_at, lock_at |
| PUT | `/courses/:course_id/assignments/:assignment_id/overrides/:id` | Update override | (same as create) |
| DELETE | `/courses/:course_id/assignments/:assignment_id/overrides/:id` | Delete override | -- |
| GET | `/courses/:course_id/assignments/overrides` | Batch get overrides | assignment_overrides[][id], assignment_overrides[][assignment_id] |
| POST | `/courses/:course_id/assignments/overrides` | Batch create overrides | assignment_overrides[] |
| PUT | `/courses/:course_id/assignments/overrides` | Batch update overrides | assignment_overrides[] |

### Assignment Groups

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/courses/:course_id/assignment_groups` | List groups | include[], assignment_ids[], grading_period_id |
| POST | `/courses/:course_id/assignment_groups` | Create group | name, position, group_weight, rules |
| GET | `/courses/:course_id/assignment_groups/:id` | Get group | include[] |
| PUT | `/courses/:course_id/assignment_groups/:id` | Update group | name, position, group_weight, rules |
| DELETE | `/courses/:course_id/assignment_groups/:id` | Delete group | move_assignments_to |

### Submissions

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| POST | `/courses/:course_id/assignments/:assignment_id/submissions` | Submit assignment | submission[submission_type] (req), submission[body], submission[url], submission[file_ids][] |
| GET | `/courses/:course_id/assignments/:assignment_id/submissions` | List submissions | include[] (submission_history, comments, rubric_assessment, user) |
| GET | `/courses/:course_id/students/submissions` | Multi-assignment submissions | student_ids[], assignment_ids[], grouped, workflow_state |
| GET | `/courses/:course_id/assignments/:assignment_id/submissions/:user_id` | Get submission | include[] |
| GET | `/courses/:course_id/assignments/:assignment_id/anonymous_submissions/:anonymous_id` | Get by anonymous ID | include[] |
| PUT | `/courses/:course_id/assignments/:assignment_id/submissions/:user_id` | Grade/comment | comment[text_comment], submission[posted_grade], submission[excuse], rubric_assessment |
| POST | `/courses/:course_id/assignments/:assignment_id/submissions/:user_id/files` | Upload file | (file upload params) |
| POST | `/courses/:course_id/submissions/update_grades` | Bulk grade | grade_data[<student_id>][posted_grade] |
| GET | `/courses/:course_id/assignments/:assignment_id/submission_summary` | Submission summary | grouped |
| GET | `/courses/:course_id/assignments/:assignment_id/gradeable_students` | Gradeable students | sort, order |
| PUT | `/courses/:course_id/assignments/:assignment_id/submissions/:user_id/read` | Mark as read | -- |
| DELETE | `/courses/:course_id/assignments/:assignment_id/submissions/:user_id/read` | Mark as unread | -- |

**Returns:** Assignment objects, AssignmentOverride objects, AssignmentGroup objects, Submission objects, Progress objects

---

## 5. Quizzes

### Classic Quizzes

**Base path:** `/api/v1/courses/:course_id/quizzes`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/courses/:course_id/quizzes` | List quizzes | search_term |
| GET | `/courses/:course_id/quizzes/:id` | Get quiz | -- |
| POST | `/courses/:course_id/quizzes` | Create quiz | quiz[title] (req), quiz[description], quiz[quiz_type], quiz[time_limit], quiz[allowed_attempts], quiz[scoring_policy], quiz[shuffle_answers], quiz[access_code] |
| PUT | `/courses/:course_id/quizzes/:id` | Update quiz | (same as create) + quiz[notify_of_update] |
| DELETE | `/courses/:course_id/quizzes/:id` | Delete quiz | -- |
| POST | `/courses/:course_id/quizzes/:id/reorder` | Reorder items | order[][id], order[][type] |
| POST | `/courses/:course_id/quizzes/:id/validate_access_code` | Validate access code | access_code |

### Quiz Questions

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/courses/:course_id/quizzes/:quiz_id/questions` | List questions | quiz_submission_id, quiz_submission_attempt |
| GET | `/courses/:course_id/quizzes/:quiz_id/questions/:id` | Get question | -- |
| POST | `/courses/:course_id/quizzes/:quiz_id/questions` | Create question | question_name, question_text, question_type, points_possible, answers |
| PUT | `/courses/:course_id/quizzes/:quiz_id/questions/:id` | Update question | (same as create) |
| DELETE | `/courses/:course_id/quizzes/:quiz_id/questions/:id` | Delete question | -- |

### Quiz Submissions

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/courses/:course_id/quizzes/:quiz_id/submissions` | List submissions | include[] (submission, quiz, user) |
| GET | `/courses/:course_id/quizzes/:quiz_id/submission` | Current user's submission | include[] |
| GET | `/courses/:course_id/quizzes/:quiz_id/submissions/:id` | Get submission | include[] |
| POST | `/courses/:course_id/quizzes/:quiz_id/submissions` | Start quiz attempt | access_code, preview |
| PUT | `/courses/:course_id/quizzes/:quiz_id/submissions/:id` | Update scores | quiz_submissions[][attempt], quiz_submissions[][fudge_points], quiz_submissions[][questions] |
| POST | `/courses/:course_id/quizzes/:quiz_id/submissions/:id/complete` | Complete attempt | attempt (req), validation_token (req) |
| GET | `/courses/:course_id/quizzes/:quiz_id/submissions/:id/time` | Get timing data | -- |

### New Quizzes (separate API base)

**Base path:** `/api/quiz/v1/courses/:course_id/quizzes`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/quiz/v1/courses/:course_id/quizzes` | List new quizzes | -- |
| GET | `/quiz/v1/courses/:course_id/quizzes/:assignment_id` | Get new quiz | -- |
| POST | `/quiz/v1/courses/:course_id/quizzes` | Create new quiz | title, points_possible, due_at, grading_type, instructions, quiz_settings |
| PATCH | `/quiz/v1/courses/:course_id/quizzes/:assignment_id` | Update new quiz | (same as create) |
| DELETE | `/quiz/v1/courses/:course_id/quizzes/:assignment_id` | Delete new quiz | -- |

### New Quiz Items

**Base path:** `/api/quiz/v1/courses/:course_id/quizzes/:assignment_id/items`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `.../items` | List items | -- |
| GET | `.../items/:item_id` | Get item | -- |
| POST | `.../items` | Create item | item[position], item[points_possible], item[entry_type], item[entry] |
| PATCH | `.../items/:item_id` | Update item | (same as create) |
| DELETE | `.../items/:item_id` | Delete item | -- |
| GET | `.../items/media_upload_url` | Get upload URL | -- |

**Returns:** Quiz objects, QuizQuestion objects, QuizSubmission objects, NewQuiz objects, QuizItem objects

---

## 6. Discussion Topics

**Base path:** `/api/v1/courses/:course_id/discussion_topics`, `/api/v1/groups/:group_id/discussion_topics`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `.../discussion_topics` | List topics | include[], order_by, scope, only_announcements, filter_by, search_term |
| POST | `.../discussion_topics` | Create topic | title, message, discussion_type, published, delayed_post_at, allow_rating, require_initial_post, assignment, is_announcement, pinned, group_category_id, specific_sections |
| GET | `.../discussion_topics/:topic_id` | Get topic | include[] |
| PUT | `.../discussion_topics/:topic_id` | Update topic | (same as create) |
| DELETE | `.../discussion_topics/:topic_id` | Delete topic | -- |
| POST | `.../discussion_topics/reorder` | Reorder topics | order[] |
| POST | `.../discussion_topics/:topic_id/duplicate` | Duplicate topic | -- |
| GET | `.../discussion_topics/:topic_id/view` | Full topic view | -- |
| POST | `.../discussion_topics/:topic_id/entries` | Post entry | message, attachment |
| GET | `.../discussion_topics/:topic_id/entries` | List entries | -- |
| POST | `.../discussion_topics/:topic_id/entries/:entry_id/replies` | Post reply | message, attachment |
| GET | `.../discussion_topics/:topic_id/entries/:entry_id/replies` | List replies | -- |
| GET | `.../discussion_topics/:topic_id/entry_list` | Get specific entries | ids[] |
| PUT | `.../discussion_topics/:topic_id/entries/:entry_id` | Update entry | message |
| DELETE | `.../discussion_topics/:topic_id/entries/:entry_id` | Delete entry | -- |
| PUT | `.../discussion_topics/:topic_id/read` | Mark topic read | -- |
| DELETE | `.../discussion_topics/:topic_id/read` | Mark topic unread | -- |
| PUT | `.../discussion_topics/read_all` | Mark all read | -- |
| PUT | `.../discussion_topics/:topic_id/read_all` | Mark all entries read | forced_read_state |
| DELETE | `.../discussion_topics/:topic_id/read_all` | Mark all entries unread | -- |
| PUT | `.../discussion_topics/:topic_id/entries/:entry_id/read` | Mark entry read | forced_read_state |
| DELETE | `.../discussion_topics/:topic_id/entries/:entry_id/read` | Mark entry unread | -- |
| POST | `.../discussion_topics/:topic_id/entries/:entry_id/rating` | Rate entry | rating (0 or 1) |
| PUT | `.../discussion_topics/:topic_id/subscribed` | Subscribe | -- |
| DELETE | `.../discussion_topics/:topic_id/subscribed` | Unsubscribe | -- |
| POST | `.../discussion_topics/:topic_id/summaries` | Generate AI summary | userInput |
| GET | `.../discussion_topics/:topic_id/summaries` | Get summary metadata | -- |

**Returns:** DiscussionTopic objects, Entry objects, Reply objects

---

## 7. Modules and Module Items

**Base path:** `/api/v1/courses/:course_id/modules`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `.../modules` | List modules | include[] (items, content_details), search_term, student_id |
| GET | `.../modules/:id` | Get module | include[], student_id |
| POST | `.../modules` | Create module | module[name] (req), module[unlock_at], module[position], module[require_sequential_progress], module[prerequisite_module_ids][] |
| PUT | `.../modules/:id` | Update module | (same as create) + module[published] |
| DELETE | `.../modules/:id` | Delete module | -- |
| PUT | `.../modules/:id/relock` | Relock module | -- |
| GET | `.../modules/:module_id/items` | List module items | include[], search_term, student_id |
| GET | `.../modules/:module_id/items/:id` | Get item | include[], student_id |
| POST | `.../modules/:module_id/items` | Create item | module_item[title], module_item[type] (req), module_item[content_id], module_item[position], module_item[external_url], module_item[completion_requirement][type] |
| PUT | `.../modules/:module_id/items/:id` | Update item | module_item[title], module_item[position], module_item[published], module_item[module_id] |
| DELETE | `.../modules/:module_id/items/:id` | Delete item | -- |
| PUT | `.../modules/:module_id/items/:id/done` | Mark item done | -- |
| POST | `.../modules/:module_id/items/:id/mark_read` | Mark item read | -- |
| POST | `.../modules/:module_id/items/:id/select_mastery_path` | Select mastery path | assignment_set_id |
| GET | `/courses/:course_id/module_item_sequence` | Item sequence | asset_type, asset_id |
| GET | `.../modules/:id/assignment_overrides` | Module overrides | -- |
| PUT | `.../modules/:id/assignment_overrides` | Update module overrides | overrides[] |

**Returns:** Module objects, ModuleItem objects, ModuleItemSequence objects

---

## 8. Pages (Wiki Pages)

**Base path:** `/api/v1/courses/:course_id/pages`, `/api/v1/groups/:group_id/pages`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `.../front_page` | Get front page | -- |
| PUT | `.../front_page` | Update front page | title, body, editing_roles, published |
| GET | `.../pages` | List pages | sort, order, search_term, published, include[] |
| POST | `.../pages` | Create page | wiki_page[title] (req), wiki_page[body], wiki_page[editing_roles], wiki_page[published], wiki_page[front_page], wiki_page[publish_at] |
| GET | `.../pages/:url_or_id` | Get page | -- |
| PUT | `.../pages/:url_or_id` | Update page | (same as create) |
| DELETE | `.../pages/:url_or_id` | Delete page | -- |
| POST | `.../pages/:url_or_id/duplicate` | Duplicate page | -- |
| GET | `.../pages/:url_or_id/revisions` | List revisions | -- |
| GET | `.../pages/:url_or_id/revisions/latest` | Latest revision | summary |
| GET | `.../pages/:url_or_id/revisions/:revision_id` | Get revision | summary |
| POST | `.../pages/:url_or_id/revisions/:revision_id` | Revert to revision | revision_id |

**Returns:** Page objects, PageRevision objects

---

## 9. Files and Folders

**Base path:** `/api/v1/files`, `/api/v1/folders`, plus context-scoped paths

### Files

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/courses/:course_id/files` | List files | content_types[], search_term, include[], sort, order |
| GET | `/users/:user_id/files` | List user files | (same) |
| GET | `/groups/:group_id/files` | List group files | (same) |
| GET | `/folders/:id/files` | List folder files | (same) |
| GET | `/files/:id` | Get file | include[] (user, usage_rights) |
| GET | `/files/:id/public_url` | Get public URL | submission_id |
| PUT | `/files/:id` | Update file | name, parent_folder_id, on_duplicate, lock_at, unlock_at, locked, hidden |
| DELETE | `/files/:id` | Delete file | replace |
| GET | `/files/:id/icon_metadata` | Icon metadata | -- |
| POST | `/files/:id/reset_verifier` | Reset link verifier | -- |
| GET | `/courses/:course_id/files/quota` | Get quota | -- |
| GET | `/courses/:course_id/files/file_ref/:migration_id` | Translate file ref | -- |

### Folders

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/folders/:id/folders` | List subfolders | -- |
| GET | `/courses/:course_id/folders` | List all folders | -- |
| GET | `/courses/:course_id/folders/by_path/*full_path` | Resolve path | -- |
| GET | `/folders/:id` | Get folder | -- |
| POST | `/courses/:course_id/folders` | Create folder | name (req), parent_folder_id, hidden, locked |
| PUT | `/folders/:id` | Update folder | name, parent_folder_id, hidden, locked, position |
| DELETE | `/folders/:id` | Delete folder | force |
| POST | `/folders/:folder_id/files` | Upload to folder | (file upload params) |
| POST | `/folders/:dest_folder_id/copy_file` | Copy file | source_file_id (req), on_duplicate |
| POST | `/folders/:dest_folder_id/copy_folder` | Copy folder | source_folder_id (req) |
| GET | `/courses/:course_id/folders/media` | Media upload folder | -- |

### Usage Rights

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| PUT | `/courses/:course_id/usage_rights` | Set usage rights | file_ids[] (req), usage_rights[use_justification] (req), usage_rights[license] |
| DELETE | `/courses/:course_id/usage_rights` | Remove usage rights | file_ids[] |
| GET | `/courses/:course_id/content_licenses` | List licenses | -- |

**Returns:** File objects, Folder objects, UsageRights objects, License objects

---

## 10. Grades and Gradebook

### Custom Gradebook Columns

**Base path:** `/api/v1/courses/:course_id/custom_gradebook_columns`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `.../custom_gradebook_columns` | List columns | include_hidden |
| POST | `.../custom_gradebook_columns` | Create column | column[title] (req), column[position], column[hidden], column[read_only] |
| PUT | `.../custom_gradebook_columns/:id` | Update column | (same as create) |
| DELETE | `.../custom_gradebook_columns/:id` | Delete column | -- |
| POST | `.../custom_gradebook_columns/reorder` | Reorder columns | order[] |
| GET | `.../custom_gradebook_columns/:id/data` | List column data | include_hidden |
| PUT | `.../custom_gradebook_columns/:id/data/:user_id` | Update data | column_data[content] (req) |
| PUT | `/courses/:course_id/custom_gradebook_column_data` | Bulk update data | column_data[] |

### Grading Standards

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/courses/:course_id/grading_standards` | List standards | -- |
| GET | `/courses/:course_id/grading_standards/:id` | Get standard | -- |
| POST | `/courses/:course_id/grading_standards` | Create standard | title (req), grading_scheme_entry[][name], grading_scheme_entry[][value] |
| PUT | `/courses/:course_id/grading_standards/:id` | Update standard | (same as create) |
| DELETE | `/courses/:course_id/grading_standards/:id` | Delete standard | -- |

### Grading Periods

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/courses/:course_id/grading_periods` | List periods | -- |
| GET | `/courses/:course_id/grading_periods/:id` | Get period | -- |
| PUT | `/courses/:course_id/grading_periods/:id` | Update period | start_date, end_date, weight |
| DELETE | `/courses/:course_id/grading_periods/:id` | Delete period | -- |
| PATCH | `/courses/:course_id/grading_periods/batch_update` | Batch update | grading_periods[][title], grading_periods[][start_date], grading_periods[][end_date] |

### Gradebook History

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/courses/:course_id/gradebook_history/days` | List days | -- |
| GET | `/courses/:course_id/gradebook_history/:date` | Day details | -- |
| GET | `/courses/:course_id/gradebook_history/:date/graders/:grader_id/assignments/:assignment_id/submissions` | Submissions by grader | -- |
| GET | `/courses/:course_id/gradebook_history/feed` | Uncollated feed | assignment_id, user_id, ascending |

### Late Policy

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/courses/:id/late_policy` | Get late policy | -- |
| POST | `/courses/:id/late_policy` | Create late policy | late_policy[missing_submission_deduction], late_policy[late_submission_deduction], late_policy[late_submission_interval] |
| PATCH | `/courses/:id/late_policy` | Update late policy | (same as create) |

**Returns:** CustomColumn objects, ColumnDatum objects, GradingStandard objects, GradingPeriod objects, Day/Grader/SubmissionHistory objects, LatePolicy objects

---

## 11. Calendar Events

**Base path:** `/api/v1/calendar_events`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/calendar_events` | List events | type, start_date, end_date, context_codes[], undated, all_events, important_dates |
| GET | `/users/:user_id/calendar_events` | User's events | (same as above) |
| POST | `/calendar_events` | Create event | context_code (req), title, description, start_at, end_at, location_name, all_day, rrule, duplicate |
| GET | `/calendar_events/:id` | Get event | -- |
| PUT | `/calendar_events/:id` | Update event | (same as create) + which (for recurring) |
| DELETE | `/calendar_events/:id` | Delete event | cancel_reason, which |
| POST | `/calendar_events/:id/reservations` | Reserve time slot | participant_id, comments, cancel_existing |
| POST | `/calendar_events/save_enabled_account_calendars` | Save account calendars | enabled_account_calendars[] |
| POST | `/courses/:course_id/calendar_events/timetable` | Create timetable | timetables (weekday config) |
| GET | `/courses/:course_id/calendar_events/timetable` | Get timetable | -- |
| POST | `/courses/:course_id/calendar_events/timetable_events` | Create timetable events | events[] |

### Appointment Groups

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/appointment_groups` | List appointment groups | scope, context_codes[], include[] |
| POST | `/appointment_groups` | Create appointment group | context_codes[] (req), title (req), description, location_name, participants_per_appointment, new_appointments[][] |
| GET | `/appointment_groups/:id` | Get group | include[] |
| PUT | `/appointment_groups/:id` | Update group | (same as create) |
| DELETE | `/appointment_groups/:id` | Delete group | cancel_reason |
| GET | `/appointment_groups/:id/users` | List participants | registration_status |
| GET | `/appointment_groups/:id/groups` | List group participants | registration_status |
| GET | `/appointment_groups/next_appointment` | Next appointment | appointment_group_ids[] |

**Returns:** CalendarEvent objects, AppointmentGroup objects

---

## 12. Conversations / Inbox

**Base path:** `/api/v1/conversations`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/conversations` | List conversations | scope, filter[], filter_mode, include[] |
| POST | `/conversations` | Create conversation | recipients[] (req), subject, body (req), group_conversation, mode |
| GET | `/conversations/batches` | Batch status | -- |
| GET | `/conversations/:id` | Get conversation | scope, filter[], auto_mark_as_read |
| PUT | `/conversations/:id` | Update conversation | conversation[workflow_state], conversation[subscribed], conversation[starred] |
| PUT | `/conversations` | Batch update | conversation_ids[], event |
| DELETE | `/conversations/:id` | Delete conversation | -- |
| POST | `/conversations/:id/add_recipients` | Add recipients | recipients[] |
| POST | `/conversations/:id/add_message` | Add message | body, attachment_ids[], media_comment_id |
| POST | `/conversations/:id/remove_messages` | Remove messages | remove[] |
| POST | `/conversations/mark_all_as_read` | Mark all read | -- |
| GET | `/conversations/unread_count` | Unread count | -- |
| GET | `/conversations/find_recipients` | Find recipients (deprecated) | -- |

**Returns:** Conversation objects, ConversationParticipant objects

---

## 13. Announcements

**Base path:** `/api/v1/announcements`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/announcements` | List announcements | context_codes[] (req), start_date, end_date, active_only, latest_only, include[] |

Note: Announcements are created via the Discussion Topics API with `is_announcement=true`. All CRUD operations on individual announcements use the Discussion Topics endpoints.

**Returns:** DiscussionTopic objects (with context_code field)

---

## 14. Groups

**Base path:** `/api/v1/groups`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/users/self/groups` | Current user's groups | context_type, include[] |
| GET | `/accounts/:account_id/groups` | Account groups | only_own_groups, include[] |
| GET | `/courses/:course_id/groups` | Course groups | only_own_groups, include[] |
| GET | `/groups/:group_id` | Get group | include[] |
| POST | `/groups` | Create community group | name, description, is_public, join_level, storage_quota_mb |
| POST | `/group_categories/:group_category_id/groups` | Create in category | (same) |
| PUT | `/groups/:group_id` | Update group | name, description, is_public, join_level, members[] |
| DELETE | `/groups/:group_id` | Delete group | -- |
| POST | `/groups/:group_id/invite` | Send invitations | invitees[] |
| GET | `/groups/:group_id/users` | List members | search_term, include[], exclude_inactive |
| GET | `/groups/:group_id/memberships` | List memberships | filter_states[] |
| POST | `/groups/:group_id/memberships` | Add membership | user_id |
| PUT | `/groups/:group_id/memberships/:membership_id` | Update membership | workflow_state, moderator |
| DELETE | `/groups/:group_id/memberships/:membership_id` | Remove member | -- |
| GET | `/groups/:group_id/permissions` | Check permissions | permissions[] |

### Group Categories

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/accounts/:account_id/group_categories` | List categories | -- |
| GET | `/courses/:course_id/group_categories` | List course categories | -- |
| GET | `/group_categories/:id` | Get category | -- |
| POST | `/courses/:course_id/group_categories` | Create category | name, self_signup, auto_leader, group_limit, create_group_count |
| PUT | `/group_categories/:id` | Update category | (same as create) |
| DELETE | `/group_categories/:id` | Delete category | -- |
| GET | `/group_categories/:id/groups` | List groups in category | -- |
| GET | `/group_categories/:id/users` | List users in category | -- |
| POST | `/group_categories/:id/assign_unassigned_members` | Auto-assign members | -- |
| POST | `/group_categories/:id/import` | Import CSV | -- |
| GET | `/group_categories/:id/export` | Export CSV (beta) | -- |

**Returns:** Group objects, GroupMembership objects, GroupCategory objects

---

## 15. Rubrics

**Base path:** `/api/v1/courses/:course_id/rubrics`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/courses/:course_id/rubrics` | List rubrics | -- |
| GET | `/accounts/:account_id/rubrics` | List account rubrics | -- |
| GET | `/courses/:course_id/rubrics/:id` | Get rubric | include[] (assessments, associations), style |
| POST | `/courses/:course_id/rubrics` | Create rubric | rubric[title], rubric[criteria], rubric_association[association_type], rubric_association[association_id] |
| PUT | `/courses/:course_id/rubrics/:id` | Update rubric | (same as create) |
| DELETE | `/courses/:course_id/rubrics/:id` | Delete rubric | -- |
| GET | `/courses/:course_id/rubrics/:id/used_locations` | Usage locations | -- |
| POST | `/courses/:course_id/rubrics/upload` | Upload from CSV | attachment |
| GET | `/rubrics/upload_template` | Get CSV template | -- |
| GET | `/courses/:course_id/rubrics/upload/:id` | Upload status | -- |

### Rubric Assessments

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| POST | `/courses/:course_id/rubric_associations/:id/rubric_assessments` | Create assessment | user_id, assessment_type, rubric_assessment |
| PUT | `/courses/:course_id/rubric_associations/:id/rubric_assessments/:id` | Update assessment | (same) |
| DELETE | `/courses/:course_id/rubric_associations/:id/rubric_assessments/:id` | Delete assessment | -- |

### Rubric Associations

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| POST | `/courses/:course_id/rubric_associations` | Create association | rubric_id, association_id, association_type, use_for_grading |
| PUT | `/courses/:course_id/rubric_associations/:id` | Update association | (same) |
| DELETE | `/courses/:course_id/rubric_associations/:id` | Delete association | -- |

**Returns:** Rubric objects, RubricAssessment objects, RubricAssociation objects

---

## 16. Outcomes and Outcome Groups

### Outcomes

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/outcomes/:id` | Get outcome | add_defaults |
| PUT | `/outcomes/:id` | Update outcome | title, description, mastery_points, ratings[], calculation_method |
| GET | `/courses/:course_id/outcome_alignments` | Outcome alignments | student_id, assignment_id |

### Outcome Groups

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/global/root_outcome_group` | Root group (redirect) | -- |
| GET | `/courses/:course_id/root_outcome_group` | Course root group | -- |
| GET | `/courses/:course_id/outcome_groups` | All groups | -- |
| GET | `/courses/:course_id/outcome_group_links` | All outcome links | outcome_style, outcome_group_style |
| GET | `/courses/:course_id/outcome_groups/:id` | Get group | -- |
| PUT | `/courses/:course_id/outcome_groups/:id` | Update group | title, description, parent_outcome_group_id |
| DELETE | `/courses/:course_id/outcome_groups/:id` | Delete group | -- |
| GET | `/courses/:course_id/outcome_groups/:id/outcomes` | List linked outcomes | outcome_style |
| POST | `/courses/:course_id/outcome_groups/:id/outcomes` | Create/link outcome | title, mastery_points, ratings[], calculation_method |
| PUT | `/courses/:course_id/outcome_groups/:id/outcomes/:outcome_id` | Link existing outcome | outcome_id, move_from |
| DELETE | `/courses/:course_id/outcome_groups/:id/outcomes/:outcome_id` | Unlink outcome | -- |
| GET | `/courses/:course_id/outcome_groups/:id/subgroups` | List subgroups | -- |
| POST | `/courses/:course_id/outcome_groups/:id/subgroups` | Create subgroup | title (req), description |
| POST | `/courses/:course_id/outcome_groups/:id/import` | Import group | source_outcome_group_id, async |

### Outcome Results

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/courses/:course_id/outcome_results` | Get results | user_ids[], outcome_ids[], include[] |
| GET | `/courses/:course_id/outcome_rollups` | Get rollups | aggregate, aggregate_stat, user_ids[], outcome_ids[], sort_by, sort_order |
| GET | `/courses/:course_id/outcome_mastery_distribution` | Mastery distribution | outcome_ids[], student_ids[] |
| GET | `/courses/:course_id/outcomes/:outcome_id/contributing_scores` | Contributing scores | user_ids[] |

### Outcome Imports

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| POST | `/accounts/:account_id/outcome_imports` | Import outcomes | import_type, attachment |
| GET | `/accounts/:account_id/outcome_imports/:id` | Import status | -- |
| GET | `/accounts/:account_id/outcome_imports/:id/created_group_ids` | Created group IDs | -- |

**Returns:** Outcome objects, OutcomeGroup objects, OutcomeLink objects, OutcomeResult objects, OutcomeRollup objects

---

## 17. Sections

**Base path:** `/api/v1/courses/:course_id/sections`, `/api/v1/sections`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/courses/:course_id/sections` | List sections | include[] (students, enrollments, total_students), search_term |
| POST | `/courses/:course_id/sections` | Create section | course_section[name], course_section[sis_section_id], course_section[start_at], course_section[end_at] |
| GET | `/courses/:course_id/sections/:id` | Get section | include[] |
| GET | `/sections/:id` | Get section | include[] |
| PUT | `/sections/:id` | Update section | course_section[name], course_section[sis_section_id], course_section[start_at], course_section[end_at] |
| DELETE | `/sections/:id` | Delete section | -- |
| POST | `/sections/:id/crosslist/:new_course_id` | Cross-list section | -- |
| DELETE | `/sections/:id/crosslist` | De-cross-list section | -- |
| GET | `/sections/:id/users` | List section users | search_term, include[], enrollment_type |

**Returns:** Section objects, User objects

---

## 18. Tabs (Course Navigation)

**Base path:** `/api/v1/courses/:course_id/tabs`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/accounts/:account_id/tabs` | List account tabs | include[] |
| GET | `/courses/:course_id/tabs` | List course tabs | include[] (course_subject_tabs) |
| GET | `/groups/:group_id/tabs` | List group tabs | include[] |
| GET | `/users/:user_id/tabs` | List user tabs | include[] |
| PUT | `/courses/:course_id/tabs/:tab_id` | Update tab | position, hidden |

**Returns:** Tab objects (html_url, id, label, position, visibility, type)

---

## 19. External Tools (LTI)

**Base path:** `/api/v1/courses/:course_id/external_tools`, `/api/v1/accounts/:account_id/external_tools`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `.../external_tools` | List tools | search_term, selectable, include_parents, placement |
| GET | `.../external_tools/:id` | Get tool | -- |
| POST | `.../external_tools` | Create tool | name (req), privacy_level (req), consumer_key, shared_secret (or client_id for LTI 1.3), url, domain, config_type, config_xml |
| PUT | `.../external_tools/:id` | Update tool | (same as create) |
| DELETE | `.../external_tools/:id` | Delete tool | -- |
| GET | `.../external_tools/sessionless_launch` | Sessionless launch URL | id, url, assignment_id, launch_type |
| POST | `/accounts/:account_id/external_tools/rce_favorites/:id` | Add RCE favorite | -- |
| DELETE | `/accounts/:account_id/external_tools/rce_favorites/:id` | Remove RCE favorite | -- |
| POST | `/accounts/:account_id/external_tools/top_nav_favorites/:id` | Add top nav favorite | -- |
| DELETE | `/accounts/:account_id/external_tools/top_nav_favorites/:id` | Remove top nav favorite | -- |
| GET | `/external_tools/visible_course_nav_tools` | Visible nav tools | context_codes[] |
| GET | `/courses/:course_id/external_tools/visible_course_nav_tools` | Course nav tools | -- |

**Returns:** ContextExternalTool objects

---

## 20. Conferences

**Base path:** `/api/v1/conferences`, `/api/v1/courses/:course_id/conferences`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/courses/:course_id/conferences` | List course conferences | -- |
| GET | `/groups/:group_id/conferences` | List group conferences | -- |
| GET | `/conferences` | List all user conferences | state (live) |

**Returns:** Conference objects (id, type, description, participants, recordings, connection URLs)

---

## 21. Collaborations

**Base path:** `/api/v1/courses/:course_id/collaborations`, `/api/v1/groups/:group_id/collaborations`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/courses/:course_id/collaborations` | List collaborations | -- |
| GET | `/groups/:group_id/collaborations` | List group collaborations | -- |
| GET | `/collaborations/:id/members` | List members | include[] (collaborator_lti_id, avatar_image_url) |
| GET | `/courses/:course_id/potential_collaborators` | List potential members | -- |
| GET | `/groups/:group_id/potential_collaborators` | List potential members | -- |

**Returns:** Collaboration objects, Collaborator objects, User objects

---

## 22. Content Migrations

**Base path:** `/api/v1/courses/:course_id/content_migrations` (also accounts, groups, users contexts)

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `.../content_migrations` | List migrations | -- |
| GET | `.../content_migrations/:id` | Get migration | -- |
| POST | `.../content_migrations` | Create migration | migration_type (req), pre_attachment, settings[source_course_id], settings[file_url], date_shift_options, selective_import, select |
| PUT | `.../content_migrations/:id` | Update migration | (same as create) |
| GET | `.../content_migrations/migrators` | List migrators | -- |
| GET | `.../content_migrations/:id/selective_data` | Selective data | type |
| GET | `/courses/:course_id/content_migrations/:id/asset_id_mapping` | Asset ID mapping | -- |

### Migration Issues

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `.../content_migrations/:id/migration_issues` | List issues | -- |
| GET | `.../content_migrations/:id/migration_issues/:id` | Get issue | -- |
| PUT | `.../content_migrations/:id/migration_issues/:id` | Update issue | workflow_state (active/resolved) |

**Returns:** ContentMigration objects, MigrationIssue objects, Migrator objects

---

## 23. Notifications / Communication Channels

### Communication Channels

**Base path:** `/api/v1/users/:user_id/communication_channels`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/users/:user_id/communication_channels` | List channels | -- |
| POST | `/users/:user_id/communication_channels` | Create channel | communication_channel[address] (req), communication_channel[type] (req: email/sms/push), skip_confirmation |
| DELETE | `/users/:user_id/communication_channels/:id` | Delete channel | -- |
| DELETE | `/users/:user_id/communication_channels/:type/:address` | Delete by type/address | -- |
| DELETE | `/users/self/communication_channels/push` | Delete push endpoint | push_token |

### Notification Preferences

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/users/:user_id/communication_channels/:cc_id/notification_preferences` | List preferences | -- |
| GET | `/users/:user_id/communication_channels/:cc_id/notification_preference_categories` | List categories | -- |
| GET | `/users/:user_id/communication_channels/:cc_id/notification_preferences/:notification` | Get preference | -- |
| PUT | `/users/self/communication_channels/:cc_id/notification_preferences/:notification` | Update preference | notification_preferences[frequency] |
| PUT | `/users/self/communication_channels/:cc_id/notification_preference_categories/:category` | Update by category | notification_preferences[frequency] |
| PUT | `/users/self/communication_channels/:cc_id/notification_preferences` | Bulk update | notification_preferences[<X>][frequency] |

### Account Notifications

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/accounts/:account_id/account_notifications` | List notifications | include_past, include_all |
| GET | `/accounts/:account_id/account_notifications/:id` | Get notification | -- |
| POST | `/accounts/:account_id/account_notifications` | Create notification | account_notification[subject] (req), account_notification[message] (req), account_notification[start_at] (req), account_notification[end_at] (req), account_notification[icon] |
| PUT | `/accounts/:account_id/account_notifications/:id` | Update notification | (same as create, all optional) |
| DELETE | `/accounts/:account_id/account_notifications/:id` | Close/delete notification | remove |

**Returns:** CommunicationChannel objects, NotificationPreference objects, AccountNotification objects

---

## 24. Analytics

**Base path:** `/api/v1/accounts/:account_id/analytics`, `/api/v1/courses/:course_id/analytics`

### Department-Level (Account)

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/accounts/:id/analytics/terms/:term_id/activity` | Term participation | -- |
| GET | `/accounts/:id/analytics/current/activity` | Current term participation | -- |
| GET | `/accounts/:id/analytics/completed/activity` | Completed term participation | -- |
| GET | `/accounts/:id/analytics/terms/:term_id/grades` | Term grade distribution | -- |
| GET | `/accounts/:id/analytics/current/grades` | Current term grades | -- |
| GET | `/accounts/:id/analytics/completed/grades` | Completed term grades | -- |
| GET | `/accounts/:id/analytics/terms/:term_id/statistics` | Term statistics | -- |
| GET | `/accounts/:id/analytics/current/statistics` | Current statistics | -- |
| GET | `/accounts/:id/analytics/terms/:term_id/statistics_by_subaccount` | Stats by subaccount | -- |

### Course-Level

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/courses/:course_id/analytics/activity` | Course participation | -- |
| GET | `/courses/:course_id/analytics/assignments` | Assignment data | async |
| GET | `/courses/:course_id/analytics/student_summaries` | Student summaries | sort_column, student_id |

### Student-in-Course

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/courses/:course_id/analytics/users/:student_id/activity` | Student participation | -- |
| GET | `/courses/:course_id/analytics/users/:student_id/assignments` | Student assignments | -- |
| GET | `/courses/:course_id/analytics/users/:student_id/communication` | Student messaging | -- |

**Returns:** Activity data, grade distributions, statistics, student summaries, assignment data with breakdowns

---

## 25. Search

**Base path:** `/api/v1/search`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/search/recipients` | Find recipients | search, context, exclude[], type (user/context), user_id, permissions[] |
| GET | `/search/all_courses` | Search all courses | search, public_only, open_enrollment_only |
| GET | `/conversations/find_recipients` | Find recipients (deprecated) | (same as /search/recipients) |

**Returns:** Recipient objects (users/courses/groups), Course objects

---

## 26. Accounts

**Base path:** `/api/v1/accounts`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/accounts` | List accounts | include[] (lti_guid, registration_settings, services) |
| GET | `/accounts/:id` | Get account | -- |
| GET | `/manageable_accounts` | Manageable accounts | -- |
| GET | `/course_creation_accounts` | Course creation accounts | -- |
| GET | `/course_accounts` | Course accounts | -- |
| GET | `/accounts/:account_id/sub_accounts` | List sub-accounts | recursive, include[] |
| POST | `/accounts/:account_id/sub_accounts` | Create sub-account | account[name] (req), account[sis_account_id] |
| DELETE | `/accounts/:account_id/sub_accounts/:id` | Delete sub-account | -- |
| PUT | `/accounts/:id` | Update account | account[name], account[default_time_zone], account[settings] |
| GET | `/accounts/:account_id/settings` | Get settings | -- |
| GET | `/accounts/:account_id/permissions` | Check permissions | permissions[] |
| GET | `/accounts/:account_id/courses` | List courses | search_term, state[], enrollment_type, with_enrollments, published, completed, blueprint |
| DELETE | `/accounts/:account_id/users/:user_id` | Delete user | -- |
| PUT | `/accounts/:account_id/users/:user_id/restore` | Restore user | -- |
| GET | `/accounts/:account_id/terms_of_service` | Terms of service | -- |
| GET | `/accounts/:account_id/help_links` | Help links | -- |
| GET | `/settings/environment` | Environment settings | -- |

**Returns:** Account objects, Course objects, TermsOfService objects

---

## 27. Roles and Permissions

**Base path:** `/api/v1/accounts/:account_id/roles`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/accounts/:account_id/roles` | List roles | state[], show_inherited |
| GET | `/accounts/:account_id/roles/:id` | Get role | -- |
| POST | `/accounts/:account_id/roles` | Create role | label (req), base_role_type, permissions[<X>][explicit], permissions[<X>][enabled] |
| PUT | `/accounts/:account_id/roles/:id` | Update role | label, permissions[<X>][explicit], permissions[<X>][enabled] |
| DELETE | `/accounts/:account_id/roles/:id` | Deactivate role | -- |
| POST | `/accounts/:account_id/roles/:id/activate` | Activate role | -- |
| GET | `/accounts/:account_id/roles/permissions` | List assignable permissions | search_term |
| GET | `/permissions/:context_type/:permission/help` | Permission help text | -- |
| GET | `/permissions/groups` | Permission groups | -- |

**Returns:** Role objects, Permission objects

---

## 28. SIS Imports

**Base path:** `/api/v1/accounts/:account_id/sis_imports`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/accounts/:account_id/sis_imports` | List imports | created_since, created_before, workflow_state[] |
| GET | `/accounts/:account_id/sis_imports/importing` | Currently importing | -- |
| POST | `/accounts/:account_id/sis_imports` | Import SIS data | import_type, attachment, batch_mode, batch_mode_term_id, override_sis_stickiness, diffing_data_set_identifier, change_threshold |
| GET | `/accounts/:account_id/sis_imports/:id` | Import status | -- |
| PUT | `/accounts/:account_id/sis_imports/:id/restore_states` | Restore states | batch_mode, undelete_only |
| PUT | `/accounts/:account_id/sis_imports/:id/abort` | Abort import | -- |
| PUT | `/accounts/:account_id/sis_imports/abort_all_pending` | Abort all pending | -- |

**Returns:** SisImport objects, Progress objects

---

## 29. Authentication Providers

**Base path:** `/api/v1/accounts/:account_id/authentication_providers`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/accounts/:account_id/authentication_providers` | List providers | -- |
| GET | `/accounts/:account_id/authentication_providers/:id` | Get provider | -- |
| POST | `/accounts/:account_id/authentication_providers` | Create provider | auth_type (req: apple, canvas, cas, clever, facebook, github, google, ldap, linkedin, microsoft, openid_connect, saml), plus type-specific params |
| PUT | `/accounts/:account_id/authentication_providers/:id` | Update provider | (type-specific params) |
| DELETE | `/accounts/:account_id/authentication_providers/:id` | Delete provider | -- |
| PUT | `/accounts/:account_id/authentication_providers/:id/restore` | Restore provider | -- |
| GET | `/accounts/:account_id/sso_settings` | Get SSO settings | -- |
| PUT | `/accounts/:account_id/sso_settings` | Update SSO settings | -- |

**Returns:** AuthenticationProvider objects, SSOSettings objects

---

## 30. Planner (Student To-Do)

**Base path:** `/api/v1/planner`

### Planner Items

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/planner/items` | List planner items | start_date, end_date, context_codes[], observed_user_id, filter |
| GET | `/users/:user_id/planner/items` | User's planner items | (same) |

### Planner Notes

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/planner_notes` | List notes | start_date, end_date, context_codes[] |
| GET | `/planner_notes/:id` | Get note | -- |
| POST | `/planner_notes` | Create note | title, details, todo_date, course_id, linked_object_type, linked_object_id |
| PUT | `/planner_notes/:id` | Update note | title, details, todo_date, course_id |
| DELETE | `/planner_notes/:id` | Delete note | -- |

### Planner Overrides

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/planner/overrides` | List overrides | -- |
| GET | `/planner/overrides/:id` | Get override | -- |
| POST | `/planner/overrides` | Create override | plannable_type (req), plannable_id (req), marked_complete, dismissed |
| PUT | `/planner/overrides/:id` | Update override | marked_complete, dismissed |
| DELETE | `/planner/overrides/:id` | Delete override | -- |

**Returns:** PlannerItem objects, PlannerNote objects, PlannerOverride objects

---

## 31. Blueprint Courses

**Base path:** `/api/v1/courses/:course_id/blueprint_templates/:template_id`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `.../blueprint_templates/:template_id` | Get blueprint info | -- |
| GET | `.../blueprint_templates/:template_id/associated_courses` | List associated courses | -- |
| PUT | `.../blueprint_templates/:template_id/update_associations` | Update associations | course_ids_to_add[], course_ids_to_remove[] |
| POST | `.../blueprint_templates/:template_id/migrations` | Begin migration/sync | comment, send_notification, copy_settings, publish_after_initial_sync |
| PUT | `.../blueprint_templates/:template_id/restrict_item` | Set restrictions | content_type, content_id, restricted, restrictions |
| GET | `.../blueprint_templates/:template_id/unsynced_changes` | Unsynced changes | -- |
| GET | `.../blueprint_templates/:template_id/migrations` | List migrations | -- |
| GET | `.../blueprint_templates/:template_id/migrations/:id` | Get migration | -- |
| GET | `.../blueprint_templates/:template_id/migrations/:id/details` | Migration details | -- |
| GET | `/courses/:course_id/blueprint_subscriptions` | List subscriptions | -- |
| GET | `/courses/:course_id/blueprint_subscriptions/:sub_id/migrations` | List imports | -- |
| GET | `/courses/:course_id/blueprint_subscriptions/:sub_id/migrations/:id` | Get import | -- |
| GET | `/courses/:course_id/blueprint_subscriptions/:sub_id/migrations/:id/details` | Import details | -- |

**Returns:** BlueprintTemplate objects, BlueprintMigration objects, BlueprintSubscription objects, ChangeRecord objects

---

## 32. ePortfolios

**Base path:** `/api/v1/eportfolios`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/users/:user_id/eportfolios` | List ePortfolios | include[] (deleted) |
| GET | `/eportfolios/:id` | Get ePortfolio | -- |
| DELETE | `/eportfolios/:id` | Delete ePortfolio | -- |
| GET | `/eportfolios/:id/pages` | List pages | -- |
| PUT | `/eportfolios/:id/moderate` | Moderate (admin) | spam_status (marked_as_spam, marked_as_safe) |
| PUT | `/users/:user_id/eportfolios` | Moderate all (admin) | spam_status |
| PUT | `/eportfolios/:id/restore` | Restore ePortfolio | -- |

**Returns:** ePortfolio objects, ePortfolioPage objects

---

## 33. Favorites

**Base path:** `/api/v1/users/self/favorites`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/users/self/favorites/courses` | List favorite courses | exclude_blueprint_courses |
| GET | `/users/self/favorites/groups` | List favorite groups | -- |
| POST | `/users/self/favorites/courses/:id` | Add course favorite | -- |
| POST | `/users/self/favorites/groups/:id` | Add group favorite | -- |
| DELETE | `/users/self/favorites/courses/:id` | Remove course favorite | -- |
| DELETE | `/users/self/favorites/groups/:id` | Remove group favorite | -- |
| DELETE | `/users/self/favorites/courses` | Reset course favorites | -- |
| DELETE | `/users/self/favorites/groups` | Reset group favorites | -- |

**Returns:** Favorite objects, Course objects, Group objects

---

## 34. Feature Flags

**Base path:** `/api/v1/courses/:course_id/features` (also accounts, users)

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `.../:context/features` | List features | hide_inherited_enabled |
| GET | `.../:context/features/enabled` | List enabled features | -- |
| GET | `/features/environment` | Environment features | -- |
| GET | `.../:context/features/flags/:feature` | Get feature flag | -- |
| PUT | `.../:context/features/flags/:feature` | Set feature flag | state (off, allowed, on) |
| DELETE | `.../:context/features/flags/:feature` | Remove feature flag | -- |

**Returns:** Feature objects, FeatureFlag objects

---

## 35. Progress

**Base path:** `/api/v1/progress`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `/progress/:id` | Query progress | -- |
| POST | `/progress/:id/cancel` | Cancel job | message |
| GET | `/lti/courses/:course_id/progress/:id` | Query progress (LTI) | -- |

**Returns:** Progress objects (id, context_id, user_id, workflow_state, completion, results)

---

## 36. Content Exports

**Base path:** `/api/v1/courses/:course_id/content_exports` (also groups, users)

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `.../content_exports` | List exports | -- |
| GET | `.../content_exports/:id` | Get export | -- |
| POST | `.../content_exports` | Create export | export_type (req: common_cartridge, qti, zip), skip_notifications, select |

**Returns:** ContentExport objects (with attachment download URL upon completion)

---

## 37. Submission Comments

**Base path:** `/api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id/comments`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| PUT | `.../comments/:id` | Edit comment | comment |
| DELETE | `.../comments/:id` | Delete comment | -- |
| POST | `.../comments/files` | Upload comment file | (file upload params) |

Note: Creating submission comments is done via the Submissions API (PUT to grade/comment on submission).

**Returns:** SubmissionComment objects

---

## 38. Peer Reviews

**Base path:** `/api/v1/courses/:course_id/assignments/:assignment_id`

| Method | Endpoint | Purpose | Key Parameters |
|--------|----------|---------|----------------|
| GET | `.../peer_reviews` | List peer reviews (assignment) | include[] (submission_comments, user) |
| GET | `.../submissions/:submission_id/peer_reviews` | List peer reviews (submission) | include[] |
| POST | `.../submissions/:submission_id/peer_reviews` | Create peer review | user_id (req) |
| DELETE | `.../submissions/:submission_id/peer_reviews` | Delete peer review | user_id (req) |
| POST | `/courses/:course_id/assignments/:assignment_id/allocate` | Auto-allocate reviews | -- |

Section-scoped variants are also available at `/sections/:section_id/assignments/...`.

**Returns:** PeerReview objects

---

## Additional API Families (supplementary)

### Logins
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/accounts/:account_id/logins` | List logins |
| GET | `/users/:user_id/logins` | List user logins |
| POST | `/accounts/:account_id/logins` | Create login |
| PUT | `/accounts/:account_id/logins/:id` | Edit login |
| DELETE | `/users/:user_id/logins/:id` | Delete login |
| POST | `/users/reset_password` | Password recovery |

### Admins
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/accounts/:account_id/admins` | Add admin |
| DELETE | `/accounts/:account_id/admins/:user_id` | Remove admin |
| GET | `/accounts/:account_id/admins` | List admins |

### Bookmarks
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/users/self/bookmarks` | List bookmarks |
| POST | `/users/self/bookmarks` | Create bookmark |
| GET | `/users/self/bookmarks/:id` | Get bookmark |
| PUT | `/users/self/bookmarks/:id` | Update bookmark |
| DELETE | `/users/self/bookmarks/:id` | Delete bookmark |

### Content Shares
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/users/:user_id/content_shares` | Create share |
| GET | `/users/:user_id/content_shares` | List shares |
| GET | `/users/:user_id/content_shares/unread_count` | Unread count |
| GET | `/users/:user_id/content_shares/:id` | Get share |
| DELETE | `/users/:user_id/content_shares/:id` | Delete share |
| POST | `/users/:user_id/content_shares/:id/add_users` | Add users to share |
| PUT | `/users/:user_id/content_shares/:id` | Update share |

### User Observees
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/users/:user_id/observees` | List observees |
| POST | `/users/:user_id/observees` | Add observee |
| GET | `/users/:user_id/observees/:observee_id` | Get observee |
| PUT | `/users/:user_id/observees/:observee_id` | Update observee |
| DELETE | `/users/:user_id/observees/:observee_id` | Remove observee |

### Enrollment Terms
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/accounts/:account_id/terms` | List terms |
| GET | `/accounts/:account_id/terms/:id` | Get term |
| POST | `/accounts/:account_id/terms` | Create term |
| PUT | `/accounts/:account_id/terms/:id` | Update term |
| DELETE | `/accounts/:account_id/terms/:id` | Delete term |

### Course Pace
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/courses/:course_id/course_pacing` | Get course pace |
| POST | `/courses/:course_id/course_pacing` | Create pace |
| PUT | `/courses/:course_id/course_pacing/:id` | Update pace |
| DELETE | `/courses/:course_id/course_pacing/:id` | Delete pace |

---

## Authentication

All API requests require authentication via one of:
- **OAuth2 Bearer Token**: `Authorization: Bearer <token>` header
- **Access Tokens**: Generated in Canvas user settings
- **Developer Keys**: For OAuth2 flow (authorization code, client credentials)

## Pagination

List endpoints return paginated results with `Link` headers containing `next`, `prev`, `first`, `last` URLs. Use `per_page` parameter (max typically 100) and follow Link headers.

## Rate Limiting

Canvas enforces rate limits. Monitor `X-Rate-Limit-Remaining` and `X-Request-Cost` response headers.

---

*Catalog compiled from canvas.instructure.com/doc/api/ -- March 2026*
