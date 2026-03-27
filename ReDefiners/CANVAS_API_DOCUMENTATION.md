# Canvas LMS REST API Documentation

Complete reference for the Canvas REST API endpoints consumed by the ReDefiners frontend.

---

## Overview

### Base URL

```
https://<canvas-domain>/api/v1
```

All endpoints in this document are relative to `/api/v1` unless otherwise noted. The ReDefiners frontend routes requests through a proxy server at `/api/v1/...` which handles OAuth2 token injection and CORS.

### Authentication

Canvas uses **OAuth2 Bearer Token** authentication. Include the token in every request:

```
Authorization: Bearer <access_token>
```

The ReDefiners proxy handles this automatically. Tokens are obtained through Canvas Developer Key OAuth2 flow.

### Response Format

All responses are JSON. Successful responses return HTTP 200 (GET/PUT), 201 (POST), or 200 (DELETE). Error responses return a JSON body:

```json
{
  "errors": [
    { "message": "The specified resource does not exist" }
  ],
  "status": "not_found"
}
```

Common HTTP status codes:
- **200** - Success
- **201** - Created
- **400** - Bad Request (invalid parameters)
- **401** - Unauthorized (invalid or expired token)
- **403** - Forbidden (insufficient permissions) or rate limited
- **404** - Not Found
- **422** - Unprocessable Entity (validation errors)
- **500** - Internal Server Error

### Pagination

List endpoints return paginated results. Pagination is controlled via query parameters and communicated through `Link` response headers.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `per_page` | integer | 10 | Number of items per page (max 100) |
| `page` | integer | 1 | Page number to return |

**Link Header Format:**
```
Link: <https://canvas.example.com/api/v1/courses?page=2&per_page=10>; rel="next",
      <https://canvas.example.com/api/v1/courses?page=1&per_page=10>; rel="first",
      <https://canvas.example.com/api/v1/courses?page=5&per_page=10>; rel="last"
```

Possible `rel` values: `current`, `next`, `prev`, `first`, `last`.

The ReDefiners `api.getAll()` method automatically follows `next` links to fetch all pages.

### Rate Limiting

Canvas enforces rate limiting on API requests. The remaining quota is returned in the response header:

```
X-Canvas-Rate-Remaining: 97.5
```

When the value approaches 0, requests will receive HTTP 403 with a rate-limit error message. The ReDefiners client warns when remaining drops below 10 and falls back to cached data when possible.

Best practices:
- Use `per_page=50` or higher to reduce total requests
- Cache responses where appropriate (the ReDefiners client uses TTL-based caching)
- Use `include[]` parameters to embed related data instead of making separate requests

### Common Query Parameters

These parameters are available on most list endpoints:

| Parameter | Type | Description |
|-----------|------|-------------|
| `per_page` | integer | Items per page (1-100) |
| `page` | integer | Page number |
| `include[]` | string (repeated) | Include related data in response |
| `sort` | string | Field to sort by |
| `order` | string | Sort direction: `asc` or `desc` |
| `search_term` | string | Filter results by search text |

---

## 1. Users & Profiles

### GET /api/v1/users/self

Returns the current authenticated user object.

**Parameters:** None

**Example Request:**
```
GET /api/v1/users/self
```

**Example Response:**
```json
{
  "id": 12345,
  "name": "Jane Student",
  "sortable_name": "Student, Jane",
  "short_name": "Jane",
  "login_id": "jane@example.com",
  "email": "jane@example.com",
  "locale": "en",
  "avatar_url": "https://canvas.example.com/images/messages/avatar-50.png",
  "effective_locale": "en",
  "permissions": {
    "can_update_name": true,
    "can_update_avatar": true
  }
}
```

---

### GET /api/v1/users/self/profile

Returns the full profile for the current user.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `include[]` | string | optional | Additional data to include |

**Example Request:**
```
GET /api/v1/users/self/profile
```

**Example Response:**
```json
{
  "id": 12345,
  "name": "Jane Student",
  "short_name": "Jane",
  "sortable_name": "Student, Jane",
  "title": null,
  "bio": "Computer Science major",
  "primary_email": "jane@example.com",
  "login_id": "jane@example.com",
  "avatar_url": "https://canvas.example.com/images/avatar.png",
  "calendar": {
    "ics": "https://canvas.example.com/feeds/calendars/user_abc123.ics"
  },
  "time_zone": "America/New_York",
  "locale": "en",
  "pronouns": "She/Her",
  "lti_user_id": "abc-def-123"
}
```

---

### PUT /api/v1/users/self

Updates the current user's information.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user[name]` | string | optional | Full name |
| `user[short_name]` | string | optional | Display name |
| `user[sortable_name]` | string | optional | Sortable name (Last, First) |
| `user[time_zone]` | string | optional | IANA timezone (e.g., "America/New_York") |
| `user[locale]` | string | optional | Language locale code |
| `user[pronouns]` | string | optional | Pronouns |
| `user[avatar][token]` | string | optional | Avatar token from avatar upload |
| `user[title]` | string | optional | Title or role |
| `user[bio]` | string | optional | Biography text |
| `user[event]` | string | optional | User lifecycle event (e.g., "suspend") |

**Example Request:**
```
PUT /api/v1/users/self
Content-Type: application/json

{
  "user": {
    "short_name": "Jane S.",
    "bio": "Updated bio text",
    "pronouns": "She/Her"
  }
}
```

**Example Response:** Returns the updated User object (same shape as GET /users/self).

---

### GET /api/v1/users/self/settings

Returns user-level settings.

**Parameters:** None

**Example Response:**
```json
{
  "manual_mark_as_read": false,
  "release_notes_badge_disabled": false,
  "collapse_global_nav": false,
  "hide_dashcard_color_overlays": false,
  "comment_library_suggestions_enabled": true,
  "elementary_dashboard_disabled": false
}
```

---

### PUT /api/v1/users/self/settings

Updates user-level settings.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `manual_mark_as_read` | boolean | optional | Disable auto-marking conversations as read |
| `collapse_global_nav` | boolean | optional | Collapse the global navigation sidebar |
| `hide_dashcard_color_overlays` | boolean | optional | Hide color overlays on dashboard cards |
| `comment_library_suggestions_enabled` | boolean | optional | Enable comment library suggestions |
| `elementary_dashboard_disabled` | boolean | optional | Disable K-5 elementary dashboard |

**Example Request:**
```
PUT /api/v1/users/self/settings
Content-Type: application/json

{
  "manual_mark_as_read": true,
  "collapse_global_nav": false
}
```

---

### GET /api/v1/users/self/activity_stream

Returns a list of recent activity stream items for the current user.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `only_active_courses` | boolean | optional | Only include items from active courses |

**Example Response:**
```json
[
  {
    "id": 67890,
    "title": "Assignment 1 is due soon",
    "message": "Don't forget to submit...",
    "type": "Message",
    "created_at": "2026-03-20T10:00:00Z",
    "updated_at": "2026-03-20T10:00:00Z",
    "context_type": "Course",
    "course_id": 100,
    "read_state": false
  }
]
```

---

### GET /api/v1/users/self/todo

Returns a list of the current user's TODO items (ungraded submissions, upcoming assignments needing action).

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `include[]` | string | optional | Values: `ungraded_quizzes` |
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "type": "submitting",
    "assignment": {
      "id": 5001,
      "name": "Essay Assignment",
      "due_at": "2026-03-25T23:59:00Z",
      "course_id": 100,
      "points_possible": 50.0
    },
    "context_type": "Course",
    "course_id": 100,
    "html_url": "https://canvas.example.com/courses/100/assignments/5001"
  }
]
```

---

### GET /api/v1/users/self/todo_item_count

Returns just the count of TODO items.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `include[]` | string | optional | Values: `ungraded_quizzes` |

**Example Response:**
```json
{
  "needs_grading_count": 3,
  "assignments_needing_submitting": 2
}
```

---

### GET /api/v1/users/self/upcoming_events

Returns a list of upcoming calendar events and assignments for the current user.

**Parameters:** None

**Example Response:**
```json
[
  {
    "id": "assignment_5001",
    "title": "Essay Assignment",
    "type": "event",
    "start_at": "2026-03-25T23:59:00Z",
    "html_url": "https://canvas.example.com/courses/100/assignments/5001",
    "context_code": "course_100"
  }
]
```

---

### GET /api/v1/users/self/missing_submissions

Returns assignments the current user has not submitted that are past due.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `observed_user_id` | integer | optional | For observer role: the observed student's ID |
| `include[]` | string | optional | Values: `planner_overrides`, `course` |
| `filter[]` | string | optional | Values: `submittable`, `current_grading_period` |
| `course_ids[]` | integer | optional | Restrict to specific courses |

**Example Response:**
```json
[
  {
    "id": 5002,
    "name": "Lab Report",
    "course_id": 100,
    "due_at": "2026-03-15T23:59:00Z",
    "points_possible": 30.0,
    "html_url": "https://canvas.example.com/courses/100/assignments/5002",
    "submission_types": ["online_upload"]
  }
]
```

---

### GET /api/v1/users/self/colors

Returns all custom colors set by the user for courses, groups, and other asset types.

**Parameters:** None

**Example Response:**
```json
{
  "custom_colors": {
    "course_100": "#1A8B9D",
    "course_200": "#D43B44",
    "group_50": "#4CAF50"
  }
}
```

---

### PUT /api/v1/users/self/colors/:asset_string

Sets a custom color for an asset (course, group, etc.).

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `asset_string` | string | required | Format: `course_123`, `group_456` |

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `hexcode` | string | required | Hex color code (e.g., "#1A8B9D" or "1A8B9D") |

**Example Request:**
```
PUT /api/v1/users/self/colors/course_100
Content-Type: application/json

{
  "hexcode": "#4CAF50"
}
```

**Example Response:**
```json
{
  "hexcode": "#4CAF50"
}
```

---

### GET /api/v1/users/self/favorites/courses

Returns the user's favorite (starred) courses.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `include[]` | string | optional | Same as courses list: `term`, `teachers`, `total_scores`, `enrollments` |

**Example Response:**
```json
[
  {
    "id": 100,
    "name": "Introduction to CS",
    "course_code": "CS101",
    "enrollment_term_id": 5
  }
]
```

---

### POST /api/v1/users/self/favorites/courses/:id

Adds a course to the user's favorites.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | required | Course ID |

**Example Request:**
```
POST /api/v1/users/self/favorites/courses/100
```

**Example Response:**
```json
{
  "context_id": 100,
  "context_type": "Course"
}
```

---

### DELETE /api/v1/users/self/favorites/courses/:id

Removes a course from the user's favorites.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | required | Course ID |

**Example Request:**
```
DELETE /api/v1/users/self/favorites/courses/100
```

**Example Response:**
```json
{
  "context_id": 100,
  "context_type": "Course"
}
```

---

## 2. Courses

### GET /api/v1/courses

Returns the current user's active courses.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `enrollment_type` | string | optional | Filter by role: `teacher`, `student`, `ta`, `observer`, `designer` |
| `enrollment_state` | string | optional | Filter by state: `active`, `invited_or_pending`, `completed` |
| `include[]` | string | optional | Values: `needs_grading_count`, `syllabus_body`, `public_description`, `total_scores`, `current_grading_period_scores`, `grading_periods`, `term`, `account`, `course_progress`, `sections`, `storage_quota_used_mb`, `total_students`, `passback_status`, `favorites`, `teachers`, `observed_users`, `tabs`, `course_image`, `banner_image`, `concluded`, `enrollments` |
| `state[]` | string | optional | Filter by state: `unpublished`, `available`, `completed`, `deleted` |
| `per_page` | integer | optional | Items per page (default 10, max 100) |

**Notes:** The ReDefiners client uses `include: ['term', 'teachers', 'total_scores', 'enrollments']` by default.

**Example Request:**
```
GET /api/v1/courses?include[]=term&include[]=teachers&include[]=total_scores&per_page=50
```

**Example Response:**
```json
[
  {
    "id": 100,
    "name": "Introduction to Computer Science",
    "course_code": "CS101",
    "account_id": 1,
    "uuid": "abc123-def456",
    "start_at": "2026-01-15T00:00:00Z",
    "end_at": "2026-05-15T00:00:00Z",
    "enrollment_term_id": 5,
    "workflow_state": "available",
    "default_view": "modules",
    "time_zone": "America/New_York",
    "enrollments": [
      {
        "type": "student",
        "enrollment_state": "active",
        "computed_current_score": 92.5,
        "computed_final_score": 88.0,
        "computed_current_grade": "A-",
        "computed_final_grade": "B+"
      }
    ],
    "term": {
      "id": 5,
      "name": "Spring 2026",
      "start_at": "2026-01-10T00:00:00Z",
      "end_at": "2026-05-20T00:00:00Z"
    },
    "teachers": [
      {
        "id": 999,
        "display_name": "Dr. Smith",
        "avatar_image_url": "https://canvas.example.com/images/avatar.png"
      }
    ]
  }
]
```

---

### GET /api/v1/courses/:id

Returns a single course by ID.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | required | Course ID |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `include[]` | string | optional | Same values as list endpoint, plus `syllabus_body`, `permissions`, `all_courses`, `course_image` |

**Notes:** The ReDefiners client uses `include: ['syllabus_body', 'teachers', 'term']` by default.

**Example Response:** Same shape as single item from courses list.

---

### POST /api/v1/accounts/:account_id/courses

Creates a new course within an account. Requires account-level permissions.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `account_id` | integer | required | Account ID |

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `course[name]` | string | required | Course name |
| `course[course_code]` | string | optional | Short code (e.g., "CS101") |
| `course[start_at]` | datetime | optional | Course start date (ISO 8601) |
| `course[end_at]` | datetime | optional | Course end date (ISO 8601) |
| `course[license]` | string | optional | License type: `private`, `cc_by`, `cc_by_sa`, `cc_by_nc`, etc. |
| `course[is_public]` | boolean | optional | Whether the course is publicly visible |
| `course[is_public_to_auth_users]` | boolean | optional | Visible to logged-in users |
| `course[public_syllabus]` | boolean | optional | Public syllabus |
| `course[public_description]` | string | optional | Public course description |
| `course[allow_student_wiki_edits]` | boolean | optional | Allow students to edit wiki pages |
| `course[allow_wiki_comments]` | boolean | optional | Allow comments on wiki pages |
| `course[allow_student_forum_attachments]` | boolean | optional | Allow file attachments in forum posts |
| `course[open_enrollment]` | boolean | optional | Allow self-enrollment |
| `course[self_enrollment]` | boolean | optional | Enable self-enrollment with code |
| `course[term_id]` | integer | optional | Enrollment term ID |
| `course[sis_course_id]` | string | optional | SIS course identifier |
| `course[syllabus_body]` | string | optional | Syllabus HTML content |
| `course[grading_standard_id]` | integer | optional | Grading standard to use |
| `course[default_view]` | string | optional | Landing page: `feed`, `wiki`, `modules`, `assignments`, `syllabus` |
| `enroll_me` | boolean | optional | Enroll the creating user as teacher |
| `offer` | boolean | optional | Immediately publish the course |

**Example Request:**
```
POST /api/v1/accounts/1/courses
Content-Type: application/json

{
  "course": {
    "name": "Advanced Algorithms",
    "course_code": "CS401",
    "start_at": "2026-08-25T00:00:00Z",
    "default_view": "modules"
  },
  "enroll_me": true,
  "offer": false
}
```

---

### PUT /api/v1/courses/:id

Updates an existing course. Accepts same body parameters as POST (all optional).

**Example Request:**
```
PUT /api/v1/courses/100
Content-Type: application/json

{
  "course": {
    "syllabus_body": "<h1>Updated Syllabus</h1><p>Welcome to the course.</p>",
    "default_view": "modules"
  }
}
```

---

### DELETE /api/v1/courses/:id

Deletes or concludes a course.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `event` | string | required | Action: `delete` or `conclude` |

**Example Request:**
```
DELETE /api/v1/courses/100?event=conclude
```

**Notes:** Concluding a course makes it read-only. Deleting removes it (may require admin permissions).

---

### GET /api/v1/courses/:id/settings

Returns course-level settings.

**Example Response:**
```json
{
  "allow_student_discussion_topics": true,
  "allow_student_forum_attachments": true,
  "allow_student_discussion_editing": true,
  "allow_student_organized_groups": true,
  "allow_student_discussion_reporting": true,
  "allow_student_anonymous_discussion_topics": false,
  "filter_speed_grader_by_student_group": false,
  "hide_final_grades": false,
  "hide_distribution_graphs": false,
  "hide_sections_on_course_users_page": false,
  "lock_all_announcements": false,
  "usage_rights_required": false,
  "restrict_student_past_view": false,
  "restrict_student_future_view": false,
  "show_announcements_on_home_page": true,
  "home_page_announcement_limit": 3
}
```

---

### PUT /api/v1/courses/:id/settings

Updates course-level settings. Accepts the same keys as the GET response, all optional.

**Example Request:**
```
PUT /api/v1/courses/100/settings
Content-Type: application/json

{
  "hide_final_grades": true,
  "lock_all_announcements": true
}
```

---

### GET /api/v1/courses/:id/users

Lists users enrolled in a course.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search_term` | string | optional | Search by name or email (min 3 characters) |
| `sort` | string | optional | Sort by: `username`, `last_login`, `email`, `sis_id` |
| `enrollment_type[]` | string | optional | Filter: `teacher`, `student`, `student_view`, `ta`, `observer`, `designer` |
| `enrollment_state[]` | string | optional | Filter: `active`, `invited`, `rejected`, `completed`, `inactive` |
| `include[]` | string | optional | Values: `enrollments`, `locked`, `avatar_url`, `test_student`, `bio`, `custom_links`, `current_grading_period_scores`, `uuid`, `email` |
| `per_page` | integer | optional | Items per page |

**Notes:** The ReDefiners client uses `include: ['enrollments', 'avatar_url']` by default.

**Example Response:**
```json
[
  {
    "id": 12345,
    "name": "Jane Student",
    "sortable_name": "Student, Jane",
    "short_name": "Jane",
    "login_id": "jane@example.com",
    "avatar_url": "https://canvas.example.com/images/avatar.png",
    "enrollments": [
      {
        "enrollment_state": "active",
        "type": "StudentEnrollment",
        "course_section_id": 10
      }
    ]
  }
]
```

---

### GET /api/v1/courses/:id/tabs

Returns the list of navigation tabs for a course.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `include[]` | string | optional | Values: `external` |

**Example Response:**
```json
[
  {
    "id": "home",
    "html_url": "/courses/100",
    "full_url": "https://canvas.example.com/courses/100",
    "position": 1,
    "visibility": "public",
    "label": "Home",
    "type": "internal"
  },
  {
    "id": "modules",
    "html_url": "/courses/100/modules",
    "position": 2,
    "visibility": "public",
    "label": "Modules",
    "type": "internal"
  }
]
```

---

## 3. Enrollments

### GET /api/v1/courses/:course_id/enrollments

Lists enrollments in a course.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type[]` | string | optional | Filter by type: `StudentEnrollment`, `TeacherEnrollment`, `TaEnrollment`, `ObserverEnrollment`, `DesignerEnrollment` |
| `role[]` | string | optional | Filter by custom role name |
| `state[]` | string | optional | Filter: `active`, `invited`, `creation_pending`, `deleted`, `rejected`, `completed`, `inactive`, `current_and_invited`, `current_and_future`, `current_and_concluded` |
| `include[]` | string | optional | Values: `avatar_url`, `group_ids`, `locked`, `observed_users`, `can_be_removed`, `uuid`, `current_points`, `grades` |
| `user_id` | string | optional | Filter by user ID (use `"self"` for current user) |
| `grading_period_id` | integer | optional | Return grades for specific grading period |
| `per_page` | integer | optional | Items per page |

**Notes:** The ReDefiners `grades.enrollments()` method uses `user_id: 'self'` with `include: ['grades']`.

**Example Request:**
```
GET /api/v1/courses/100/enrollments?user_id=self&include[]=grades
```

**Example Response:**
```json
[
  {
    "id": 50001,
    "course_id": 100,
    "course_section_id": 10,
    "enrollment_state": "active",
    "type": "StudentEnrollment",
    "user_id": 12345,
    "role": "StudentEnrollment",
    "role_id": 3,
    "created_at": "2026-01-15T10:00:00Z",
    "updated_at": "2026-03-20T10:00:00Z",
    "start_at": null,
    "end_at": null,
    "last_activity_at": "2026-03-24T08:30:00Z",
    "last_attended_at": null,
    "total_activity_time": 54000,
    "grades": {
      "html_url": "https://canvas.example.com/courses/100/grades/12345",
      "current_grade": "A-",
      "current_score": 92.5,
      "final_grade": "B+",
      "final_score": 88.0,
      "unposted_current_grade": "A-",
      "unposted_current_score": 92.5,
      "unposted_final_grade": "B+",
      "unposted_final_score": 88.0
    },
    "user": {
      "id": 12345,
      "name": "Jane Student",
      "sortable_name": "Student, Jane",
      "short_name": "Jane"
    }
  }
]
```

---

### GET /api/v1/users/:user_id/enrollments

Lists all enrollments for a specific user across courses.

**Parameters:** Same as course enrollments endpoint.

**Example Request:**
```
GET /api/v1/users/self/enrollments?state[]=active&include[]=grades
```

---

### POST /api/v1/courses/:course_id/enrollments

Enrolls a user in a course. Requires appropriate permissions.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `enrollment[user_id]` | integer | required | User ID to enroll |
| `enrollment[type]` | string | required | Enrollment type: `StudentEnrollment`, `TeacherEnrollment`, `TaEnrollment`, `ObserverEnrollment`, `DesignerEnrollment` |
| `enrollment[enrollment_state]` | string | optional | Initial state: `active`, `invited` (default: `invited`) |
| `enrollment[course_section_id]` | integer | optional | Section to enroll into |
| `enrollment[limit_privileges_to_course_section]` | boolean | optional | Limit to section |
| `enrollment[notify]` | boolean | optional | Send enrollment notification email |
| `enrollment[self_enrollment_code]` | string | optional | Self-enrollment code |
| `enrollment[self_enrolled]` | boolean | optional | Mark as self-enrolled |
| `enrollment[associated_user_id]` | integer | optional | For observers: the student to observe |

**Example Request:**
```
POST /api/v1/courses/100/enrollments
Content-Type: application/json

{
  "enrollment": {
    "user_id": 12345,
    "type": "StudentEnrollment",
    "enrollment_state": "active",
    "notify": true
  }
}
```

---

### DELETE /api/v1/courses/:course_id/enrollments/:id

Concludes, deletes, or deactivates an enrollment.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `task` | string | required | Action: `conclude`, `delete`, `inactivate`, `deactivate` |

**Example Request:**
```
DELETE /api/v1/courses/100/enrollments/50001?task=conclude
```

---

## 4. Assignments

### GET /api/v1/courses/:course_id/assignments

Lists assignments in a course.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `include[]` | string | optional | Values: `submission`, `assignment_visibility`, `all_dates`, `overrides`, `observed_users`, `can_edit`, `score_statistics` |
| `search_term` | string | optional | Search by assignment name |
| `override_assignment_dates` | boolean | optional | Apply override dates for current user (default: true) |
| `needs_grading_count_by_section` | boolean | optional | Include section-level grading counts |
| `bucket` | string | optional | Filter: `past`, `overdue`, `undated`, `ungraded`, `unsubmitted`, `upcoming`, `future` |
| `assignment_ids[]` | integer | optional | Fetch specific assignments |
| `order_by` | string | optional | Sort by: `position`, `name`, `due_at` |
| `post_to_sis` | boolean | optional | Filter by SIS sync status |
| `per_page` | integer | optional | Items per page |

**Notes:** The ReDefiners client uses `include: ['submission', 'score_statistics']` and `order_by: 'position'`.

**Example Request:**
```
GET /api/v1/courses/100/assignments?include[]=submission&include[]=score_statistics&order_by=position&per_page=50
```

**Example Response:**
```json
[
  {
    "id": 5001,
    "name": "Essay Assignment",
    "description": "<p>Write a 500-word essay...</p>",
    "created_at": "2026-01-20T10:00:00Z",
    "updated_at": "2026-03-15T10:00:00Z",
    "due_at": "2026-03-25T23:59:00Z",
    "lock_at": null,
    "unlock_at": null,
    "course_id": 100,
    "assignment_group_id": 200,
    "position": 1,
    "points_possible": 50.0,
    "grading_type": "points",
    "submission_types": ["online_text_entry", "online_upload"],
    "allowed_extensions": ["pdf", "docx"],
    "max_name_length": 255,
    "peer_reviews": false,
    "automatic_peer_reviews": false,
    "has_submitted_submissions": true,
    "published": true,
    "unpublishable": false,
    "only_visible_to_overrides": false,
    "locked_for_user": false,
    "submissions_download_url": "https://canvas.example.com/courses/100/assignments/5001/submissions?zip=1",
    "allowed_attempts": -1,
    "html_url": "https://canvas.example.com/courses/100/assignments/5001",
    "submission": {
      "id": 70001,
      "assignment_id": 5001,
      "grade": "45",
      "score": 45.0,
      "submitted_at": "2026-03-24T10:00:00Z",
      "workflow_state": "graded",
      "grade_matches_current_submission": true,
      "late": false,
      "missing": false,
      "excused": false,
      "attempt": 1
    },
    "score_statistics": {
      "min": 30.0,
      "max": 50.0,
      "mean": 42.5,
      "upper_q": 47.0,
      "median": 43.0,
      "lower_q": 38.0
    }
  }
]
```

---

### GET /api/v1/courses/:course_id/assignments/:id

Returns a single assignment.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `include[]` | string | optional | Values: `submission`, `assignment_visibility`, `overrides`, `observed_users`, `can_edit`, `score_statistics`, `rubric_assessment` |
| `override_assignment_dates` | boolean | optional | Apply date overrides (default: true) |
| `all_dates` | boolean | optional | Include all override date sets |

**Notes:** The ReDefiners client uses `include: ['submission', 'rubric_assessment']`.

---

### POST /api/v1/courses/:course_id/assignments

Creates a new assignment.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `assignment[name]` | string | required | Assignment name |
| `assignment[position]` | integer | optional | Position in assignment list |
| `assignment[submission_types][]` | string | optional | Values: `online_quiz`, `none`, `on_paper`, `discussion_topic`, `external_tool`, `online_upload`, `online_text_entry`, `online_url`, `media_recording`, `student_annotation` |
| `assignment[allowed_extensions][]` | string | optional | Allowed file extensions for uploads |
| `assignment[turnitin_enabled]` | boolean | optional | Enable Turnitin |
| `assignment[vericite_enabled]` | boolean | optional | Enable VeriCite |
| `assignment[turnitin_settings]` | object | optional | Turnitin settings |
| `assignment[peer_reviews]` | boolean | optional | Enable peer reviews |
| `assignment[automatic_peer_reviews]` | boolean | optional | Auto-assign peer reviews |
| `assignment[notify_of_update]` | boolean | optional | Notify students of the update |
| `assignment[group_category_id]` | integer | optional | Group set for group assignment |
| `assignment[grade_group_students_individually]` | boolean | optional | Grade each student individually in groups |
| `assignment[points_possible]` | number | optional | Maximum points |
| `assignment[grading_type]` | string | optional | Values: `pass_fail`, `percent`, `letter_grade`, `gpa_scale`, `points`, `not_graded` |
| `assignment[due_at]` | datetime | optional | Due date (ISO 8601) |
| `assignment[lock_at]` | datetime | optional | Lock date |
| `assignment[unlock_at]` | datetime | optional | Unlock date |
| `assignment[description]` | string | optional | Assignment description (HTML) |
| `assignment[assignment_group_id]` | integer | optional | Assignment group ID |
| `assignment[assignment_overrides][]` | object | optional | Date overrides |
| `assignment[only_visible_to_overrides]` | boolean | optional | Only visible to override targets |
| `assignment[published]` | boolean | optional | Whether to publish immediately |
| `assignment[moderated_grading]` | boolean | optional | Enable moderated grading |
| `assignment[grader_count]` | integer | optional | Number of graders for moderated grading |
| `assignment[anonymous_grading]` | boolean | optional | Enable anonymous grading |
| `assignment[allowed_attempts]` | integer | optional | Max submission attempts (-1 for unlimited) |
| `assignment[annotatable_attachment_id]` | integer | optional | For student_annotation type |

**Example Request:**
```
POST /api/v1/courses/100/assignments
Content-Type: application/json

{
  "assignment": {
    "name": "Research Paper",
    "submission_types": ["online_upload"],
    "allowed_extensions": ["pdf", "docx"],
    "points_possible": 100,
    "due_at": "2026-04-15T23:59:00Z",
    "description": "<p>Write a research paper on...</p>",
    "published": true,
    "grading_type": "points"
  }
}
```

---

### PUT /api/v1/courses/:course_id/assignments/:id

Updates an existing assignment. Accepts the same body parameters as POST (all optional).

---

### DELETE /api/v1/courses/:course_id/assignments/:id

Deletes an assignment. Returns the deleted assignment object.

---

### GET /api/v1/courses/:course_id/assignment_groups

Lists assignment groups for a course.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `include[]` | string | optional | Values: `assignments`, `discussion_topic`, `assignment_visibility`, `submission`, `score_statistics`, `observed_users` |
| `assignment_ids[]` | integer | optional | Restrict included assignments |
| `exclude_assignment_submission_types[]` | string | optional | Exclude by submission type |
| `override_assignment_dates` | boolean | optional | Apply date overrides |
| `grading_period_id` | integer | optional | Filter by grading period |
| `scope_assignments_to_student` | boolean | optional | Only show assignments visible to current student |

**Notes:** The ReDefiners client uses `include: ['assignments', 'submission']` for grade calculation.

**Example Response:**
```json
[
  {
    "id": 200,
    "name": "Assignments",
    "position": 1,
    "group_weight": 60.0,
    "rules": {
      "drop_lowest": 1,
      "drop_highest": 0,
      "never_drop": [5001]
    },
    "assignments": [
      {
        "id": 5001,
        "name": "Essay Assignment",
        "points_possible": 50.0,
        "submission": {
          "score": 45.0,
          "grade": "45"
        }
      }
    ]
  }
]
```

---

### POST /api/v1/courses/:course_id/assignment_groups

Creates a new assignment group.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | required | Group name |
| `position` | integer | optional | Position in the list |
| `group_weight` | number | optional | Weight for weighted grading (0-100) |
| `rules` | object | optional | Drop rules: `{ drop_lowest: N, drop_highest: N, never_drop: [ids] }` |

---

## 5. Submissions

### GET /api/v1/courses/:course_id/assignments/:assignment_id/submissions

Lists all submissions for an assignment.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `include[]` | string | optional | Values: `submission_history`, `submission_comments`, `rubric_assessment`, `assignment`, `visibility`, `course`, `user`, `group`, `read_status` |
| `grouped` | boolean | optional | Group by student for group assignments |
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "id": 70001,
    "assignment_id": 5001,
    "user_id": 12345,
    "body": "My essay submission text...",
    "url": null,
    "grade": "45",
    "score": 45.0,
    "submitted_at": "2026-03-24T10:00:00Z",
    "graded_at": "2026-03-24T14:00:00Z",
    "grader_id": 999,
    "attempt": 1,
    "submission_type": "online_text_entry",
    "workflow_state": "graded",
    "grade_matches_current_submission": true,
    "late": false,
    "missing": false,
    "excused": false,
    "late_policy_status": null,
    "points_deducted": null,
    "seconds_late": 0,
    "preview_url": "https://canvas.example.com/courses/100/assignments/5001/submissions/12345?preview=1",
    "attachments": [],
    "submission_comments": []
  }
]
```

---

### GET /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id

Returns a single submission. Use `"self"` as user_id for the current user.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `include[]` | string | optional | Same as list endpoint |

---

### POST /api/v1/courses/:course_id/assignments/:assignment_id/submissions

Submits an assignment on behalf of the current user.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `submission[submission_type]` | string | required | Values: `online_text_entry`, `online_url`, `online_upload`, `media_recording`, `basic_lti_launch`, `student_annotation` |
| `submission[body]` | string | optional | For `online_text_entry`: the submission body (HTML) |
| `submission[url]` | string | optional | For `online_url`: the URL |
| `submission[file_ids][]` | integer | optional | For `online_upload`: array of previously uploaded file IDs |
| `submission[media_comment_id]` | string | optional | For `media_recording`: Kaltura media ID |
| `submission[media_comment_type]` | string | optional | Media type: `audio` or `video` |
| `submission[annotatable_attachment_id]` | integer | optional | For `student_annotation` |
| `comment[text_comment]` | string | optional | Submission comment |

**Example Request:**
```
POST /api/v1/courses/100/assignments/5001/submissions
Content-Type: application/json

{
  "submission": {
    "submission_type": "online_text_entry",
    "body": "<p>Here is my essay submission...</p>"
  }
}
```

---

### PUT /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id

Grades a submission or adds a comment. Requires grading permissions.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `comment[text_comment]` | string | optional | Text comment |
| `comment[group_comment]` | boolean | optional | Apply comment to all group members |
| `comment[media_comment_id]` | string | optional | Kaltura media comment ID |
| `comment[media_comment_type]` | string | optional | `audio` or `video` |
| `comment[file_ids][]` | integer | optional | Attach files to comment |
| `submission[posted_grade]` | string | optional | Grade value (points, percentage, or letter) |
| `submission[excuse]` | boolean | optional | Mark submission as excused |
| `submission[late_policy_status]` | string | optional | Values: `late`, `missing`, `extended`, `none` |
| `submission[seconds_late_override]` | integer | optional | Override lateness calculation |
| `rubric_assessment` | object | optional | Rubric assessment data |

**Example Request:**
```
PUT /api/v1/courses/100/assignments/5001/submissions/12345
Content-Type: application/json

{
  "submission": {
    "posted_grade": "92"
  },
  "comment": {
    "text_comment": "Great work on this assignment!"
  }
}
```

---

### POST /api/v1/courses/:course_id/assignments/:assignment_id/submissions/update_grades

Bulk-update grades for an assignment. Requires grading permissions.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `grade_data[<student_id>][posted_grade]` | string | optional | Grade for each student |
| `grade_data[<student_id>][excuse]` | boolean | optional | Excuse each student |

**Example Request:**
```
POST /api/v1/courses/100/assignments/5001/submissions/update_grades
Content-Type: application/json

{
  "grade_data": {
    "12345": { "posted_grade": "95" },
    "12346": { "posted_grade": "88" },
    "12347": { "excuse": true }
  }
}
```

**Notes:** Returns a Progress object. Poll `GET /api/v1/progress/:id` to check completion.

---

## 6. Modules

### GET /api/v1/courses/:course_id/modules

Lists modules in a course.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `include[]` | string | optional | Values: `items`, `content_details` |
| `search_term` | string | optional | Search by module name |
| `student_id` | integer | optional | Show completion info for a specific student |
| `per_page` | integer | optional | Items per page |

**Notes:** The ReDefiners client uses `include: ['items', 'content_details']`.

**Example Response:**
```json
[
  {
    "id": 300,
    "name": "Week 1: Introduction",
    "position": 1,
    "unlock_at": null,
    "require_sequential_progress": false,
    "publish_final_grade": false,
    "prerequisite_module_ids": [],
    "state": "completed",
    "completed_at": "2026-02-01T10:00:00Z",
    "items_count": 5,
    "items_url": "https://canvas.example.com/api/v1/courses/100/modules/300/items",
    "published": true,
    "items": [
      {
        "id": 3001,
        "module_id": 300,
        "position": 1,
        "title": "Welcome Page",
        "type": "Page",
        "content_id": 800,
        "html_url": "https://canvas.example.com/courses/100/modules/items/3001",
        "url": "https://canvas.example.com/api/v1/courses/100/pages/welcome",
        "published": true,
        "content_details": {
          "points_possible": null,
          "due_at": null,
          "unlock_at": null,
          "lock_at": null
        }
      }
    ]
  }
]
```

---

### POST /api/v1/courses/:course_id/modules

Creates a new module. Requires course editing permissions.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `module[name]` | string | required | Module name |
| `module[unlock_at]` | datetime | optional | Unlock date (ISO 8601) |
| `module[position]` | integer | optional | Position in course |
| `module[require_sequential_progress]` | boolean | optional | Require items completed in order |
| `module[prerequisite_module_ids][]` | integer | optional | Prerequisite module IDs |
| `module[publish_final_grade]` | boolean | optional | Publish grade upon completion |

---

### PUT /api/v1/courses/:course_id/modules/:id

Updates a module. Accepts same parameters as POST plus:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `module[published]` | boolean | optional | Publish or unpublish the module |

---

### DELETE /api/v1/courses/:course_id/modules/:id

Deletes a module and optionally its items.

---

### GET /api/v1/courses/:course_id/modules/:module_id/items

Lists items within a module.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `include[]` | string | optional | Values: `content_details` |
| `search_term` | string | optional | Search by item title |
| `student_id` | integer | optional | Show completion for specific student |
| `per_page` | integer | optional | Items per page |

**Notes:** The ReDefiners client uses `include: ['content_details']`.

**Example Response:**
```json
[
  {
    "id": 3001,
    "module_id": 300,
    "position": 1,
    "title": "Welcome Page",
    "indent": 0,
    "type": "Page",
    "content_id": 800,
    "html_url": "https://canvas.example.com/courses/100/modules/items/3001",
    "url": "https://canvas.example.com/api/v1/courses/100/pages/welcome",
    "published": true,
    "completion_requirement": {
      "type": "must_view",
      "completed": true
    },
    "content_details": {
      "points_possible": null,
      "due_at": null,
      "unlock_at": null,
      "lock_at": null
    }
  }
]
```

**Item types:** `File`, `Page`, `Discussion`, `Assignment`, `Quiz`, `SubHeader`, `ExternalUrl`, `ExternalTool`

---

### POST /api/v1/courses/:course_id/modules/:module_id/items

Adds an item to a module.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `module_item[title]` | string | required | Item title (for SubHeader, ExternalUrl, ExternalTool) |
| `module_item[type]` | string | required | Values: `File`, `Page`, `Discussion`, `Assignment`, `Quiz`, `SubHeader`, `ExternalUrl`, `ExternalTool` |
| `module_item[content_id]` | integer | conditional | Required for File, Discussion, Assignment, Quiz |
| `module_item[position]` | integer | optional | Position within the module |
| `module_item[indent]` | integer | optional | Indentation level (0-5) |
| `module_item[page_url]` | string | conditional | Required for Page type |
| `module_item[external_url]` | string | conditional | Required for ExternalUrl, ExternalTool |
| `module_item[new_tab]` | boolean | optional | Open external links in new tab |
| `module_item[completion_requirement][type]` | string | optional | Values: `must_view`, `must_contribute`, `must_submit`, `must_mark_done`, `min_score` |
| `module_item[completion_requirement][min_score]` | number | optional | Minimum score for `min_score` type |

---

### PUT /api/v1/courses/:course_id/modules/:module_id/items/:id/done

Marks a module item as done (for `must_mark_done` completion requirement).

**Parameters:** None (no body required)

**Example Request:**
```
PUT /api/v1/courses/100/modules/300/items/3001/done
```

**Example Response:**
```json
{}
```

---

## 7. Calendar Events

### GET /api/v1/calendar_events

Lists calendar events and/or assignments.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | optional | Filter: `event`, `assignment` (omit for both) |
| `start_date` | date | optional | Start of date range (ISO 8601 date, e.g., "2026-03-01") |
| `end_date` | date | optional | End of date range |
| `undated` | boolean | optional | Include undated events |
| `all_events` | boolean | optional | Include events from all contexts |
| `context_codes[]` | string | optional | Filter by context: `course_100`, `group_50`, `user_12345` |
| `excludes[]` | string | optional | Values: `description`, `child_events`, `assignment` |
| `per_page` | integer | optional | Items per page |

**Notes:** The ReDefiners client fetches events and assignments separately using the `type` parameter.

**Example Request:**
```
GET /api/v1/calendar_events?type=event&start_date=2026-03-01&end_date=2026-03-31&context_codes[]=course_100
```

**Example Response:**
```json
[
  {
    "id": 9001,
    "title": "Office Hours",
    "description": "<p>Weekly office hours with Dr. Smith</p>",
    "start_at": "2026-03-25T14:00:00Z",
    "end_at": "2026-03-25T15:00:00Z",
    "all_day": false,
    "all_day_date": null,
    "location_name": "Room 204",
    "location_address": null,
    "context_code": "course_100",
    "context_name": "Introduction to CS",
    "workflow_state": "active",
    "created_at": "2026-01-20T10:00:00Z",
    "updated_at": "2026-01-20T10:00:00Z",
    "html_url": "https://canvas.example.com/calendar?event_id=9001",
    "type": "event",
    "effective_context_code": "course_100"
  }
]
```

---

### POST /api/v1/calendar_events

Creates a new calendar event.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendar_event[context_code]` | string | required | Context code (e.g., `course_100`, `user_12345`) |
| `calendar_event[title]` | string | required | Event title |
| `calendar_event[description]` | string | optional | Event description (HTML) |
| `calendar_event[start_at]` | datetime | optional | Start time (ISO 8601) |
| `calendar_event[end_at]` | datetime | optional | End time |
| `calendar_event[location_name]` | string | optional | Location name |
| `calendar_event[location_address]` | string | optional | Location address |
| `calendar_event[time_zone_edited]` | string | optional | Timezone the event was edited in |
| `calendar_event[all_day]` | boolean | optional | All-day event |
| `calendar_event[child_event_data][X][start_at]` | datetime | optional | For section-specific events |
| `calendar_event[child_event_data][X][end_at]` | datetime | optional | Section event end time |
| `calendar_event[child_event_data][X][context_code]` | string | optional | Section context code |
| `calendar_event[duplicate][count]` | integer | optional | Number of duplicates |
| `calendar_event[duplicate][interval]` | integer | optional | Days between duplicates |
| `calendar_event[duplicate][frequency]` | string | optional | Values: `daily`, `weekly`, `monthly` |
| `calendar_event[duplicate][append_iterator]` | boolean | optional | Append number to title |

**Example Request:**
```
POST /api/v1/calendar_events
Content-Type: application/json

{
  "calendar_event": {
    "context_code": "course_100",
    "title": "Study Group",
    "description": "Weekly study group meeting",
    "start_at": "2026-03-28T18:00:00Z",
    "end_at": "2026-03-28T20:00:00Z",
    "location_name": "Library Room 3"
  }
}
```

---

### GET /api/v1/calendar_events/:id

Returns a single calendar event.

---

### PUT /api/v1/calendar_events/:id

Updates a calendar event. Accepts same body parameters as POST.

---

### DELETE /api/v1/calendar_events/:id

Deletes a calendar event.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cancel_reason` | string | optional | Reason for cancellation (shown to participants) |
| `which` | string | optional | For recurring events: `one` (default) or `all` |

---

### GET /api/v1/appointment_groups

Lists appointment groups (sign-up slots).

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `scope` | string | optional | Values: `reservable` (available to sign up), `manageable` (user can manage) |
| `context_codes[]` | string | optional | Filter by context |
| `include_past_appointments` | boolean | optional | Include past appointments |
| `include[]` | string | optional | Values: `appointments`, `child_events`, `participant_count`, `reserved_times`, `all_context_codes` |

---

## 8. Conversations (Inbox)

### GET /api/v1/conversations

Lists the current user's conversations.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `scope` | string | optional | Values: `unread`, `starred`, `archived`, `sent` |
| `filter[]` | string | optional | Filter by course/group context codes |
| `filter_mode` | string | optional | Values: `and` (default), `or` |
| `interleave_submissions` | boolean | optional | Include submission comments |
| `include_all_conversation_ids` | boolean | optional | Return all conversation IDs matching filter |
| `include[]` | string | optional | Values: `participant_avatars` |
| `per_page` | integer | optional | Items per page |

**Example Request:**
```
GET /api/v1/conversations?scope=unread&per_page=20
```

**Example Response:**
```json
[
  {
    "id": 4001,
    "subject": "Question about Assignment 1",
    "workflow_state": "unread",
    "last_message": "Thanks for your help!",
    "last_message_at": "2026-03-24T08:30:00Z",
    "last_authored_message": "You're welcome!",
    "last_authored_message_at": "2026-03-24T08:00:00Z",
    "message_count": 3,
    "subscribed": true,
    "private": true,
    "starred": false,
    "properties": ["last_author"],
    "audience": [12346],
    "audience_contexts": {
      "courses": { "100": ["StudentEnrollment"] }
    },
    "avatar_url": "https://canvas.example.com/images/avatar.png",
    "participants": [
      { "id": 12345, "name": "Jane Student", "full_name": "Jane Student" },
      { "id": 12346, "name": "John Doe", "full_name": "John Doe" }
    ],
    "visible": true,
    "context_name": "Introduction to CS",
    "context_code": "course_100"
  }
]
```

---

### POST /api/v1/conversations

Creates a new conversation (sends a message).

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `recipients[]` | string | required | User IDs or context codes (e.g., `"12345"`, `"course_100"`) |
| `subject` | string | optional | Conversation subject |
| `body` | string | required | Message body (HTML) |
| `force_new` | boolean | optional | Force a new conversation (no reuse) |
| `group_conversation` | boolean | optional | Create a group conversation |
| `attachment_ids[]` | integer | optional | Attached file IDs |
| `media_comment_id` | string | optional | Kaltura media comment |
| `media_comment_type` | string | optional | `audio` or `video` |
| `mode` | string | optional | Values: `sync` (default), `async` |
| `scope` | string | optional | Mark with scope: `unread`, `starred`, `archived` |
| `filter[]` | string | optional | Course/group context filter |
| `context_code` | string | optional | Context for the conversation |
| `user_note` | boolean | optional | Create faculty journal entry (admin only) |

**Example Request:**
```
POST /api/v1/conversations
Content-Type: application/json

{
  "recipients": ["12346"],
  "subject": "Question about the midterm",
  "body": "<p>Hi, I had a question about...</p>",
  "context_code": "course_100"
}
```

---

### GET /api/v1/conversations/:id

Returns a single conversation with full message history.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `interleave_submissions` | boolean | optional | Include submission comments |
| `auto_mark_as_read` | boolean | optional | Mark as read (default: true) |

**Example Response:**
```json
{
  "id": 4001,
  "subject": "Question about Assignment 1",
  "workflow_state": "read",
  "messages": [
    {
      "id": 40001,
      "created_at": "2026-03-24T08:30:00Z",
      "body": "<p>Thanks for your help!</p>",
      "author_id": 12346,
      "generated": false,
      "forwarded_messages": [],
      "attachments": [],
      "media_comment": null,
      "participating_user_ids": [12345, 12346]
    }
  ],
  "participants": [
    { "id": 12345, "name": "Jane Student" },
    { "id": 12346, "name": "John Doe" }
  ]
}
```

---

### PUT /api/v1/conversations/:id

Updates conversation metadata.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `conversation[workflow_state]` | string | optional | Values: `read`, `unread`, `archived` |
| `conversation[subscribed]` | boolean | optional | Subscribe/unsubscribe to updates |
| `conversation[starred]` | boolean | optional | Star/unstar the conversation |
| `scope` | string | optional | Context scope |
| `filter[]` | string | optional | Context filter |

**Example Request (mark as read):**
```
PUT /api/v1/conversations/4001
Content-Type: application/json

{
  "conversation": {
    "workflow_state": "read"
  }
}
```

---

### DELETE /api/v1/conversations/:id

Deletes a conversation for the current user.

---

### POST /api/v1/conversations/:id/add_message

Adds a reply to an existing conversation.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `body` | string | required | Message body (HTML) |
| `attachment_ids[]` | integer | optional | Attached file IDs |
| `media_comment_id` | string | optional | Kaltura media comment |
| `media_comment_type` | string | optional | `audio` or `video` |
| `recipients[]` | string | optional | Additional recipients to add |
| `included_messages[]` | integer | optional | Message IDs to quote/forward |
| `user_note` | boolean | optional | Faculty journal entry |

**Example Request:**
```
POST /api/v1/conversations/4001/add_message
Content-Type: application/json

{
  "body": "<p>Thanks for the clarification!</p>"
}
```

---

### GET /api/v1/conversations/unread_count

Returns the unread conversation count.

**Example Response:**
```json
{
  "unread_count": "5"
}
```

**Notes:** The `unread_count` value is returned as a string, not an integer. Parse it accordingly.

---

## 9. Discussion Topics

### GET /api/v1/courses/:course_id/discussion_topics

Lists discussion topics in a course.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `include[]` | string | optional | Values: `all_dates`, `sections`, `sections_user_count`, `overrides` |
| `order_by` | string | optional | Values: `position` (default), `recent_activity`, `title` |
| `scope` | string | optional | Values: `locked`, `unlocked`, `pinned`, `unpinned` |
| `only_announcements` | boolean | optional | Return only announcements |
| `filter_by` | string | optional | Values: `all`, `unread` |
| `search_term` | string | optional | Search by title/message |
| `exclude_context_module_locked_topics` | boolean | optional | Exclude locked module topics |
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "id": 6001,
    "title": "Week 1 Discussion",
    "message": "<p>Share your thoughts on...</p>",
    "html_url": "https://canvas.example.com/courses/100/discussion_topics/6001",
    "posted_at": "2026-01-20T10:00:00Z",
    "last_reply_at": "2026-03-24T08:00:00Z",
    "require_initial_post": true,
    "user_can_see_posts": true,
    "discussion_subentry_count": 15,
    "read_state": "read",
    "unread_count": 2,
    "subscribed": true,
    "assignment_id": null,
    "delayed_post_at": null,
    "published": true,
    "lock_at": null,
    "locked": false,
    "pinned": false,
    "locked_for_user": false,
    "topic_children": [],
    "author": {
      "id": 999,
      "display_name": "Dr. Smith",
      "avatar_image_url": "https://canvas.example.com/images/avatar.png"
    },
    "permissions": {
      "attach": true,
      "update": false,
      "reply": true,
      "delete": false
    },
    "allow_rating": false,
    "only_graders_can_rate": false,
    "sort_by_rating": false
  }
]
```

---

### POST /api/v1/courses/:course_id/discussion_topics

Creates a new discussion topic.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | optional | Topic title |
| `message` | string | optional | Topic body (HTML) |
| `discussion_type` | string | optional | Values: `side_comment` (default), `threaded`, `not_threaded` |
| `published` | boolean | optional | Publish immediately |
| `delayed_post_at` | datetime | optional | Schedule post for later |
| `allow_rating` | boolean | optional | Allow liking of entries |
| `lock_at` | datetime | optional | Lock date |
| `podcast_enabled` | boolean | optional | Enable podcast feed |
| `podcast_has_student_posts` | boolean | optional | Include student posts in podcast |
| `require_initial_post` | boolean | optional | Require students post before viewing |
| `assignment` | object | optional | Create graded discussion (assignment object) |
| `is_announcement` | boolean | optional | Create as announcement instead |
| `pinned` | boolean | optional | Pin to top |
| `position_after` | string | optional | Position after topic ID |
| `group_category_id` | integer | optional | Create group discussions |
| `only_visible_to_overrides` | boolean | optional | Restrict visibility |
| `attachment` | file | optional | Attach a file (multipart) |
| `specific_sections` | string | optional | Comma-separated section IDs |

---

### GET /api/v1/courses/:course_id/discussion_topics/:id

Returns a single discussion topic.

---

### PUT /api/v1/courses/:course_id/discussion_topics/:id

Updates a discussion topic. Accepts same body parameters as POST.

---

### DELETE /api/v1/courses/:course_id/discussion_topics/:id

Deletes a discussion topic.

---

### GET /api/v1/courses/:course_id/discussion_topics/:id/view

Returns the full threaded view of a discussion with all entries and replies.

**Example Response:**
```json
{
  "unread_entries": [60002],
  "forced_entries": [],
  "participants": [
    { "id": 12345, "display_name": "Jane Student", "avatar_image_url": "..." },
    { "id": 999, "display_name": "Dr. Smith", "avatar_image_url": "..." }
  ],
  "view": [
    {
      "id": 60001,
      "user_id": 999,
      "message": "<p>Great point about...</p>",
      "created_at": "2026-03-20T10:00:00Z",
      "updated_at": "2026-03-20T10:00:00Z",
      "replies": [
        {
          "id": 60002,
          "user_id": 12345,
          "parent_id": 60001,
          "message": "<p>I agree, and also...</p>",
          "created_at": "2026-03-21T10:00:00Z"
        }
      ]
    }
  ],
  "new_entries": []
}
```

---

### POST /api/v1/courses/:course_id/discussion_topics/:id/entries

Creates a new top-level entry in a discussion.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | string | required | Entry body (HTML) |
| `attachment` | file | optional | Attach a file (multipart) |

---

### POST /api/v1/courses/:course_id/discussion_topics/:id/entries/:entry_id/replies

Creates a reply to an existing discussion entry.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | string | required | Reply body (HTML) |
| `attachment` | file | optional | Attach a file (multipart) |

---

## 10. Announcements

### GET /api/v1/announcements

Lists announcements across courses.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `context_codes[]` | string | required | Course/group context codes (e.g., `course_100`) |
| `start_date` | datetime | optional | Only return announcements posted after this date |
| `end_date` | datetime | optional | Only return announcements posted before this date |
| `active_only` | boolean | optional | Only active announcements (default: false) |
| `latest_only` | boolean | optional | Only the latest announcement per context (default: false) |
| `include[]` | string | optional | Values: `sections`, `sections_user_count` |
| `per_page` | integer | optional | Items per page |

**Notes:** The `context_codes[]` parameter is required. At least one context code must be provided.

**Example Request:**
```
GET /api/v1/announcements?context_codes[]=course_100&context_codes[]=course_200&active_only=true
```

**Example Response:**
```json
[
  {
    "id": 7001,
    "title": "Midterm Exam Update",
    "message": "<p>The midterm has been rescheduled...</p>",
    "posted_at": "2026-03-20T10:00:00Z",
    "delayed_post_at": null,
    "context_code": "course_100",
    "author": {
      "id": 999,
      "display_name": "Dr. Smith",
      "avatar_image_url": "https://canvas.example.com/images/avatar.png"
    },
    "read_state": "unread",
    "unread_count": 0,
    "discussion_subentry_count": 0,
    "html_url": "https://canvas.example.com/courses/100/discussion_topics/7001",
    "permissions": {
      "reply": true
    }
  }
]
```

---

## 11. Quizzes

### GET /api/v1/courses/:course_id/quizzes

Lists quizzes in a course.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search_term` | string | optional | Search by quiz title |
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "id": 8001,
    "title": "Chapter 1 Quiz",
    "html_url": "https://canvas.example.com/courses/100/quizzes/8001",
    "description": "<p>Quiz covering chapter 1 material</p>",
    "quiz_type": "assignment",
    "assignment_group_id": 200,
    "time_limit": 30,
    "shuffle_answers": true,
    "show_correct_answers": true,
    "show_correct_answers_last_attempt": false,
    "show_correct_answers_at": null,
    "hide_correct_answers_at": null,
    "scoring_policy": "keep_highest",
    "allowed_attempts": 2,
    "one_question_at_a_time": false,
    "cant_go_back": false,
    "access_code": null,
    "ip_filter": null,
    "due_at": "2026-03-25T23:59:00Z",
    "lock_at": null,
    "unlock_at": null,
    "published": true,
    "unpublishable": false,
    "locked_for_user": false,
    "points_possible": 20.0,
    "question_count": 10,
    "assignment_id": 5010,
    "all_dates": [],
    "version_number": 3,
    "permissions": {
      "read": true,
      "submit": true,
      "create": false,
      "manage": false,
      "read_statistics": false,
      "review_grades": false,
      "update": false
    }
  }
]
```

---

### POST /api/v1/courses/:course_id/quizzes

Creates a new quiz.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `quiz[title]` | string | required | Quiz title |
| `quiz[description]` | string | optional | Quiz description (HTML) |
| `quiz[quiz_type]` | string | optional | Values: `practice_quiz`, `assignment`, `graded_survey`, `survey` |
| `quiz[assignment_group_id]` | integer | optional | Assignment group |
| `quiz[time_limit]` | integer | optional | Time limit in minutes (null for no limit) |
| `quiz[shuffle_answers]` | boolean | optional | Shuffle answer choices |
| `quiz[hide_results]` | string | optional | Values: `always`, `until_after_last_attempt`, null (show results) |
| `quiz[show_correct_answers]` | boolean | optional | Show correct answers after submission |
| `quiz[show_correct_answers_last_attempt]` | boolean | optional | Only show correct answers on last attempt |
| `quiz[show_correct_answers_at]` | datetime | optional | Show correct answers after this date |
| `quiz[hide_correct_answers_at]` | datetime | optional | Hide correct answers after this date |
| `quiz[allowed_attempts]` | integer | optional | Max attempts (-1 for unlimited) |
| `quiz[scoring_policy]` | string | optional | Values: `keep_highest`, `keep_latest`, `keep_average` |
| `quiz[one_question_at_a_time]` | boolean | optional | Show one question at a time |
| `quiz[cant_go_back]` | boolean | optional | Lock answers (requires one_question_at_a_time) |
| `quiz[access_code]` | string | optional | Access code required to take quiz |
| `quiz[ip_filter]` | string | optional | IP address filter |
| `quiz[due_at]` | datetime | optional | Due date |
| `quiz[lock_at]` | datetime | optional | Lock date |
| `quiz[unlock_at]` | datetime | optional | Unlock date |
| `quiz[published]` | boolean | optional | Publish immediately |
| `quiz[one_time_results]` | boolean | optional | Students can only view results once |
| `quiz[only_visible_to_overrides]` | boolean | optional | Restrict visibility |

---

### GET /api/v1/courses/:course_id/quizzes/:id

Returns a single quiz.

---

### PUT /api/v1/courses/:course_id/quizzes/:id

Updates a quiz. Accepts same parameters as POST plus:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `quiz[notify_of_update]` | boolean | optional | Notify students of changes |

---

### DELETE /api/v1/courses/:course_id/quizzes/:id

Deletes a quiz.

---

### GET /api/v1/courses/:course_id/quizzes/:id/submissions

Lists quiz submissions.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `include[]` | string | optional | Values: `submission`, `quiz`, `user` |

**Example Response:**
```json
{
  "quiz_submissions": [
    {
      "id": 90001,
      "quiz_id": 8001,
      "user_id": 12345,
      "submission_id": 70010,
      "started_at": "2026-03-24T10:00:00Z",
      "finished_at": "2026-03-24T10:25:00Z",
      "end_at": "2026-03-24T10:30:00Z",
      "attempt": 1,
      "extra_attempts": 0,
      "extra_time": null,
      "manually_unlocked": false,
      "time_spent": 1500,
      "score": 18.0,
      "score_before_regrade": null,
      "kept_score": 18.0,
      "fudge_points": null,
      "has_seen_results": true,
      "workflow_state": "complete",
      "overdue_and_needs_submission": false,
      "questions_regraded_since_last_attempt": 0,
      "validation_token": "abc123"
    }
  ]
}
```

---

### POST /api/v1/courses/:course_id/quizzes/:id/submissions

Starts a new quiz attempt for the current user.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `access_code` | string | optional | Required if quiz has an access code |
| `preview` | boolean | optional | Start a preview attempt (for teachers) |

**Example Response:** Returns the quiz submission object with `validation_token` needed for answering questions.

---

### POST /api/v1/courses/:course_id/quizzes/:id/submissions/:id/complete

Completes/turns in a quiz attempt.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `attempt` | integer | required | Attempt number |
| `validation_token` | string | required | Token from submission start |
| `access_code` | string | optional | Quiz access code |

---

## 12. Pages (Wiki)

### GET /api/v1/courses/:course_id/pages

Lists wiki pages in a course.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sort` | string | optional | Sort by: `title` (default), `created_at`, `updated_at` |
| `order` | string | optional | `asc` (default) or `desc` |
| `search_term` | string | optional | Search by title |
| `published` | boolean | optional | Filter by published state |
| `per_page` | integer | optional | Items per page |

**Notes:** The ReDefiners client sorts by `title` by default.

**Example Response:**
```json
[
  {
    "page_id": 800,
    "url": "welcome",
    "title": "Welcome",
    "created_at": "2026-01-15T10:00:00Z",
    "updated_at": "2026-03-20T10:00:00Z",
    "hide_from_students": false,
    "editing_roles": "teachers",
    "last_edited_by": {
      "id": 999,
      "display_name": "Dr. Smith",
      "avatar_image_url": "..."
    },
    "body": null,
    "published": true,
    "front_page": true,
    "locked_for_user": false,
    "html_url": "https://canvas.example.com/courses/100/pages/welcome"
  }
]
```

**Notes:** The `body` field is not included in the list response. Fetch individual pages to get content.

---

### POST /api/v1/courses/:course_id/pages

Creates a new wiki page.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `wiki_page[title]` | string | required | Page title |
| `wiki_page[body]` | string | optional | Page content (HTML) |
| `wiki_page[editing_roles]` | string | optional | Values: `teachers`, `students`, `members`, `public` |
| `wiki_page[notify_of_update]` | boolean | optional | Send notification |
| `wiki_page[published]` | boolean | optional | Publish page |
| `wiki_page[front_page]` | boolean | optional | Set as front page |

**Example Request:**
```
POST /api/v1/courses/100/pages
Content-Type: application/json

{
  "wiki_page": {
    "title": "Study Guide",
    "body": "<h1>Study Guide</h1><p>Key topics for the exam...</p>",
    "published": true
  }
}
```

---

### GET /api/v1/courses/:course_id/pages/:url_or_id

Returns a single page by URL slug or ID. Includes the full `body` content.

**Example Request:**
```
GET /api/v1/courses/100/pages/welcome
```

**Example Response:**
```json
{
  "page_id": 800,
  "url": "welcome",
  "title": "Welcome",
  "body": "<h1>Welcome to CS101</h1><p>This course covers...</p>",
  "created_at": "2026-01-15T10:00:00Z",
  "updated_at": "2026-03-20T10:00:00Z",
  "published": true,
  "front_page": true,
  "editing_roles": "teachers",
  "last_edited_by": {
    "id": 999,
    "display_name": "Dr. Smith"
  },
  "revision_id": 5,
  "locked_for_user": false
}
```

---

### PUT /api/v1/courses/:course_id/pages/:url_or_id

Updates a page. Accepts same body parameters as POST.

---

### DELETE /api/v1/courses/:course_id/pages/:url_or_id

Deletes a page.

---

### GET /api/v1/courses/:course_id/front_page

Returns the course's designated front page.

**Notes:** Returns 404 if no front page is set. Response format is the same as a single page.

---

### GET /api/v1/courses/:course_id/pages/:url/revisions

Lists revision history for a page.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "revision_id": 5,
    "updated_at": "2026-03-20T10:00:00Z",
    "latest": true,
    "edited_by": {
      "id": 999,
      "display_name": "Dr. Smith"
    }
  },
  {
    "revision_id": 4,
    "updated_at": "2026-03-15T10:00:00Z",
    "latest": false,
    "edited_by": {
      "id": 999,
      "display_name": "Dr. Smith"
    }
  }
]
```

---

## 13. Files & Folders

### GET /api/v1/courses/:course_id/folders/root

Returns the root folder for a course.

**Example Response:**
```json
{
  "id": 1000,
  "name": "course files",
  "full_name": "course files",
  "context_id": 100,
  "context_type": "Course",
  "parent_folder_id": null,
  "created_at": "2026-01-15T10:00:00Z",
  "updated_at": "2026-01-15T10:00:00Z",
  "lock_at": null,
  "unlock_at": null,
  "position": null,
  "locked": false,
  "folders_url": "https://canvas.example.com/api/v1/folders/1000/folders",
  "files_url": "https://canvas.example.com/api/v1/folders/1000/files",
  "files_count": 12,
  "folders_count": 3,
  "hidden": false,
  "locked_for_user": false,
  "hidden_for_user": false,
  "for_submissions": false,
  "can_upload": true
}
```

---

### GET /api/v1/folders/:id/files

Lists files in a folder.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `content_types[]` | string | optional | Filter by MIME type |
| `exclude_content_types[]` | string | optional | Exclude MIME types |
| `search_term` | string | optional | Search by filename |
| `include[]` | string | optional | Values: `user`, `usage_rights`, `enhanced_preview_url`, `context_asset_string` |
| `only[]` | string | optional | Values: `names` |
| `sort` | string | optional | Sort by: `name`, `size`, `created_at`, `updated_at`, `content_type`, `user` |
| `order` | string | optional | `asc` or `desc` |
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "id": 11001,
    "uuid": "abc-def-123",
    "folder_id": 1000,
    "display_name": "lecture-notes.pdf",
    "filename": "lecture-notes.pdf",
    "content-type": "application/pdf",
    "url": "https://canvas.example.com/files/11001/download?download_frd=1",
    "size": 245760,
    "created_at": "2026-02-01T10:00:00Z",
    "updated_at": "2026-02-01T10:00:00Z",
    "unlock_at": null,
    "locked": false,
    "hidden": false,
    "lock_at": null,
    "hidden_for_user": false,
    "thumbnail_url": null,
    "modified_at": "2026-02-01T10:00:00Z",
    "mime_class": "pdf",
    "media_entry_id": null,
    "locked_for_user": false,
    "preview_url": "https://canvas.example.com/api/v1/canvadoc_session?..."
  }
]
```

---

### GET /api/v1/folders/:id/folders

Lists subfolders within a folder.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `per_page` | integer | optional | Items per page |

---

### GET /api/v1/files/:id

Returns a single file.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `include[]` | string | optional | Values: `user`, `usage_rights`, `enhanced_preview_url`, `context_asset_string` |

---

### DELETE /api/v1/files/:id

Deletes a file. Requires appropriate permissions.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `replace` | boolean | optional | If true, replaces rather than deletes |

---

### POST /api/v1/courses/:course_id/files (3-Step Upload)

Canvas uses a three-step file upload process:

**Step 1: Notify Canvas**

```
POST /api/v1/courses/:course_id/files
Content-Type: application/json

{
  "name": "my-document.pdf",
  "size": 245760,
  "content_type": "application/pdf",
  "parent_folder_id": 1000,
  "on_duplicate": "rename"
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | required | Filename |
| `size` | integer | required | File size in bytes |
| `content_type` | string | optional | MIME type (default: `application/octet-stream`) |
| `parent_folder_id` | integer | optional | Target folder ID |
| `parent_folder_path` | string | optional | Target folder path (alternative to ID) |
| `on_duplicate` | string | optional | Values: `overwrite`, `rename` (default) |
| `success_include[]` | string | optional | Include in final response |

**Step 1 Response:**
```json
{
  "upload_url": "https://canvas-uploads.s3.amazonaws.com/...",
  "upload_params": {
    "key": "uploads/12345/my-document.pdf",
    "Policy": "...",
    "X-Amz-Signature": "...",
    "Content-Type": "application/pdf",
    "success_action_redirect": "https://canvas.example.com/api/v1/files/11002/create_success?uuid=..."
  },
  "file_param": "file"
}
```

**Step 2: Upload to the URL**

Send a `POST` with `multipart/form-data` to the `upload_url`, including all `upload_params` fields followed by the `file` field.

**Step 3: Confirm**

If step 2 returns a 3xx redirect, follow the redirect with a `POST` to confirm the upload. The final response is the File object.

**Notes:** The ReDefiners `files.upload()` method handles all three steps automatically.

---

## 14. Groups

### GET /api/v1/users/self/groups

Lists groups the current user belongs to.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `context_type` | string | optional | Filter: `Account`, `Course` |
| `include[]` | string | optional | Values: `tabs`, `users`, `permissions`, `can_access`, `can_message` |
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "id": 50,
    "name": "Study Group A",
    "description": "Group for lab assignments",
    "is_public": false,
    "followed_by_user": false,
    "join_level": "invitation_only",
    "members_count": 4,
    "avatar_url": null,
    "context_type": "Course",
    "course_id": 100,
    "role": "communities",
    "group_category_id": 25,
    "sis_group_id": null,
    "sis_import_id": null,
    "storage_quota_mb": 50,
    "permissions": {
      "create_discussion_topic": true,
      "create_announcement": false
    },
    "has_submission": false
  }
]
```

---

### GET /api/v1/courses/:course_id/groups

Lists groups within a course.

**Parameters:** Same as user groups endpoint.

---

### POST /api/v1/groups

Creates a new group.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | required | Group name |
| `description` | string | optional | Group description |
| `is_public` | boolean | optional | Public visibility |
| `join_level` | string | optional | Values: `parent_context_auto_join`, `parent_context_request`, `invitation_only` |
| `storage_quota_mb` | integer | optional | Storage quota in MB |
| `sis_group_id` | string | optional | SIS group ID |
| `group_category_id` | integer | optional | Group category to create under |

---

### GET /api/v1/groups/:id

Returns a single group.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `include[]` | string | optional | Values: `permissions`, `tabs`, `users`, `can_access`, `can_message` |

---

### GET /api/v1/groups/:group_id/users

Lists members of a group.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search_term` | string | optional | Search by name/email |
| `include[]` | string | optional | Values: `avatar_url`, `email` |
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "id": 12345,
    "name": "Jane Student",
    "sortable_name": "Student, Jane",
    "short_name": "Jane",
    "login_id": "jane@example.com",
    "avatar_url": "https://canvas.example.com/images/avatar.png"
  }
]
```

---

### GET /api/v1/courses/:course_id/group_categories

Lists group categories (group sets) for a course.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "id": 25,
    "name": "Lab Groups",
    "role": "communities",
    "self_signup": "restricted",
    "auto_leader": "first",
    "context_type": "Course",
    "course_id": 100,
    "group_limit": 5,
    "groups_count": 6,
    "unassigned_users_count": 2,
    "protected": false,
    "allows_multiple_memberships": false,
    "is_member": true
  }
]
```

---

## 15. Rubrics

### GET /api/v1/courses/:course_id/rubrics

Lists rubrics in a course.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "id": 400,
    "title": "Essay Rubric",
    "context_id": 100,
    "context_type": "Course",
    "points_possible": 50.0,
    "rubric_points": 50.0,
    "free_form_criterion_comments": false,
    "data": [
      {
        "id": "crit_1",
        "description": "Thesis Statement",
        "long_description": "Clear and well-defined thesis statement",
        "points": 10.0,
        "criterion_use_range": false,
        "ratings": [
          { "id": "rating_1", "description": "Excellent", "long_description": "...", "points": 10.0 },
          { "id": "rating_2", "description": "Good", "long_description": "...", "points": 7.0 },
          { "id": "rating_3", "description": "Needs Improvement", "long_description": "...", "points": 3.0 },
          { "id": "rating_4", "description": "Missing", "long_description": "...", "points": 0.0 }
        ]
      }
    ]
  }
]
```

---

### POST /api/v1/courses/:course_id/rubrics

Creates a new rubric.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `rubric[title]` | string | required | Rubric title |
| `rubric[points_possible]` | number | optional | Total possible points |
| `rubric[free_form_criterion_comments]` | boolean | optional | Allow free-form comments |
| `rubric[criteria]` | object | optional | Criteria definitions (see format above) |
| `rubric_association[association_id]` | integer | optional | Associate with assignment/course |
| `rubric_association[association_type]` | string | optional | Values: `Assignment`, `Course` |
| `rubric_association[use_for_grading]` | boolean | optional | Use rubric for grading |
| `rubric_association[hide_score_total]` | boolean | optional | Hide total score from students |
| `rubric_association[purpose]` | string | optional | Values: `grading`, `bookmark` |

---

### GET /api/v1/courses/:course_id/rubrics/:id

Returns a single rubric.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `include[]` | string | optional | Values: `assessments`, `graded_assessments`, `peer_assessments`, `associations`, `assignment_associations` |
| `style` | string | optional | Values: `full` (include all data), `comments_only` |

---

### PUT /api/v1/courses/:course_id/rubrics/:id

Updates a rubric. Accepts same parameters as POST.

---

### DELETE /api/v1/courses/:course_id/rubrics/:id

Deletes a rubric.

---

## 16. Outcomes

### GET /api/v1/courses/:course_id/outcome_groups

Lists outcome groups for a course. Outcome groups are containers/folders for organizing outcomes.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "id": 500,
    "url": "https://canvas.example.com/api/v1/courses/100/outcome_groups/500",
    "title": "Course Outcomes",
    "description": "All outcomes for this course",
    "context_id": 100,
    "context_type": "Course",
    "parent_outcome_group": null,
    "vendor_guid": null,
    "subgroups_url": "https://canvas.example.com/api/v1/courses/100/outcome_groups/500/subgroups",
    "outcomes_url": "https://canvas.example.com/api/v1/courses/100/outcome_groups/500/outcomes",
    "can_edit": true
  }
]
```

---

### GET /api/v1/courses/:course_id/outcome_group_links

Lists all outcome links for a course (outcomes linked to groups).

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `outcome_style` | string | optional | Values: `full`, `abbrev` |
| `outcome_group_style` | string | optional | Values: `full`, `abbrev` |
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "outcome_group": {
      "id": 500,
      "title": "Course Outcomes"
    },
    "outcome": {
      "id": 501,
      "title": "Critical Thinking",
      "description": "Student demonstrates critical thinking...",
      "display_name": "Critical Thinking",
      "points_possible": 5.0,
      "mastery_points": 3.0,
      "ratings": [
        { "description": "Exceeds", "points": 5.0 },
        { "description": "Meets", "points": 3.0 },
        { "description": "Below", "points": 1.0 }
      ],
      "calculation_method": "decaying_average",
      "calculation_int": 65
    },
    "url": "https://canvas.example.com/api/v1/courses/100/outcome_groups/500/outcomes/501",
    "assessed": true,
    "can_unlink": true
  }
]
```

---

### GET /api/v1/outcomes/:id

Returns a single outcome.

**Example Response:**
```json
{
  "id": 501,
  "url": "https://canvas.example.com/api/v1/outcomes/501",
  "context_id": 100,
  "context_type": "Course",
  "title": "Critical Thinking",
  "display_name": "Critical Thinking",
  "description": "Student demonstrates critical thinking skills...",
  "vendor_guid": null,
  "points_possible": 5.0,
  "mastery_points": 3.0,
  "calculation_method": "decaying_average",
  "calculation_int": 65,
  "ratings": [
    { "description": "Exceeds Expectations", "points": 5.0 },
    { "description": "Meets Expectations", "points": 3.0 },
    { "description": "Does Not Meet", "points": 1.0 }
  ],
  "can_edit": true,
  "can_unlink": true,
  "assessed": true,
  "has_updateable_rubrics": false
}
```

---

### GET /api/v1/courses/:course_id/outcome_results

Returns outcome assessment results for students in a course.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_ids[]` | integer | optional | Filter by user IDs |
| `outcome_ids[]` | integer | optional | Filter by outcome IDs |
| `include[]` | string | optional | Values: `alignments`, `outcomes`, `outcomes.alignments`, `outcome_groups`, `outcome_links`, `outcome_paths`, `users` |
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
{
  "outcome_results": [
    {
      "id": 601,
      "score": 4.0,
      "submitted_or_assessed_at": "2026-03-20T10:00:00Z",
      "links": {
        "user": "12345",
        "learning_outcome": "501",
        "alignment": "assignment_5001"
      },
      "percent": 0.8,
      "mastery": true,
      "possible": 5.0,
      "hide_points": false
    }
  ],
  "linked": {
    "users": [],
    "outcomes": [],
    "alignments": []
  }
}
```

---

## 17. Conferences

### GET /api/v1/courses/:course_id/conferences

Lists web conferences for a course.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `state` | string | optional | Filter by state |
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
{
  "conferences": [
    {
      "id": 700,
      "conference_type": "BigBlueButton",
      "title": "Office Hours",
      "description": "Weekly office hours",
      "duration": 60,
      "started_at": "2026-03-24T14:00:00Z",
      "ended_at": null,
      "url": "https://canvas.example.com/courses/100/conferences/700/join",
      "long_running": false,
      "recordings": [],
      "user_settings": {
        "record": true
      },
      "has_advanced_settings": true,
      "context_type": "Course",
      "context_id": 100,
      "join_url": "https://canvas.example.com/courses/100/conferences/700/join",
      "users": [999, 12345, 12346]
    }
  ]
}
```

---

### POST /api/v1/courses/:course_id/conferences

Creates a new conference.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `web_conference[conference_type]` | string | required | Conference provider (e.g., `BigBlueButton`) |
| `web_conference[title]` | string | required | Conference title |
| `web_conference[description]` | string | optional | Description |
| `web_conference[duration]` | integer | optional | Duration in minutes |
| `web_conference[long_running]` | boolean | optional | No time limit |
| `web_conference[user_settings][record]` | boolean | optional | Enable recording |
| `web_conference[user_ids][]` | integer | optional | Invited user IDs |

---

## 18. Collaborations

### GET /api/v1/courses/:course_id/collaborations

Lists collaborations for a course (e.g., Google Docs, Microsoft 365 shared documents).

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "id": 750,
    "collaboration_type": "google_docs",
    "document_id": "abc123-google-doc",
    "title": "Group Project Document",
    "description": "Shared document for group project",
    "url": "https://docs.google.com/document/d/abc123",
    "created_at": "2026-02-01T10:00:00Z",
    "updated_at": "2026-03-20T10:00:00Z",
    "user_id": 999,
    "context_id": 100,
    "context_type": "Course",
    "update_url": "https://canvas.example.com/api/v1/collaborations/750",
    "permissions": {
      "update": false,
      "delete": false
    }
  }
]
```

---

## 19. ePortfolios

### GET /api/v1/eportfolios

Lists the current user's ePortfolios.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "id": 900,
    "user_id": 12345,
    "name": "My Learning Portfolio",
    "public": false,
    "created_at": "2026-01-15T10:00:00Z",
    "updated_at": "2026-03-20T10:00:00Z",
    "workflow_state": "active",
    "deleted_at": null,
    "spam_status": null
  }
]
```

---

### GET /api/v1/eportfolios/:id

Returns a single ePortfolio.

---

### GET /api/v1/eportfolios/:id/pages

Lists pages within an ePortfolio.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "id": 9001,
    "eportfolio_id": 900,
    "position": 1,
    "name": "About Me",
    "created_at": "2026-01-15T10:00:00Z",
    "updated_at": "2026-03-15T10:00:00Z"
  }
]
```

---

## 20. Planner

### GET /api/v1/planner/items

Lists planner items (assignments, announcements, and planner notes) for the current user.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `start_date` | datetime | optional | Start of date range (ISO 8601) |
| `end_date` | datetime | optional | End of date range |
| `context_codes[]` | string | optional | Filter by context |
| `observed_user_id` | integer | optional | For observer role |
| `filter` | string | optional | Values: `new_activity`, `ungraded_todo_items` |
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "context_type": "Course",
    "course_id": 100,
    "plannable_id": 5001,
    "plannable_type": "assignment",
    "planner_override": null,
    "plannable_date": "2026-03-25T23:59:00Z",
    "submissions": {
      "submitted": false,
      "excused": false,
      "graded": false,
      "late": false,
      "missing": false,
      "needs_grading": false,
      "has_feedback": false
    },
    "plannable": {
      "id": 5001,
      "title": "Essay Assignment",
      "course_id": 100,
      "due_at": "2026-03-25T23:59:00Z",
      "points_possible": 50.0,
      "created_at": "2026-01-20T10:00:00Z",
      "updated_at": "2026-03-15T10:00:00Z"
    },
    "html_url": "https://canvas.example.com/courses/100/assignments/5001",
    "new_activity": false
  }
]
```

---

### GET /api/v1/planner/overrides

Lists planner overrides (user customizations to planner items such as marking items as done or dismissing them).

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "id": 1001,
    "plannable_type": "assignment",
    "plannable_id": 5001,
    "user_id": 12345,
    "workflow_state": "active",
    "marked_complete": true,
    "dismissed": false,
    "created_at": "2026-03-20T10:00:00Z",
    "updated_at": "2026-03-20T10:00:00Z",
    "deleted_at": null
  }
]
```

---

### POST /api/v1/planner/overrides

Creates a planner override.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `plannable_type` | string | required | Values: `announcement`, `assignment`, `discussion_topic`, `quiz`, `wiki_page`, `planner_note` |
| `plannable_id` | integer | required | ID of the plannable item |
| `marked_complete` | boolean | optional | Mark as completed |
| `dismissed` | boolean | optional | Dismiss from planner |

**Example Request:**
```
POST /api/v1/planner/overrides
Content-Type: application/json

{
  "plannable_type": "assignment",
  "plannable_id": 5001,
  "marked_complete": true
}
```

---

### GET /api/v1/planner_notes

Lists user-created planner notes.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `start_date` | datetime | optional | Start of range |
| `end_date` | datetime | optional | End of range |
| `context_codes[]` | string | optional | Filter by context |
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "id": 1100,
    "title": "Study for midterm",
    "description": "Review chapters 1-5",
    "user_id": 12345,
    "course_id": 100,
    "workflow_state": "active",
    "todo_date": "2026-03-28T00:00:00Z",
    "linked_object_type": null,
    "linked_object_id": null,
    "linked_object_html_url": null,
    "linked_object_url": null
  }
]
```

---

### POST /api/v1/planner_notes

Creates a planner note.

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | required | Note title |
| `details` | string | optional | Note description |
| `todo_date` | datetime | required | Date for the note (ISO 8601) |
| `course_id` | integer | optional | Associate with a course |
| `linked_object_type` | string | optional | Link to plannable type |
| `linked_object_id` | integer | optional | Link to plannable ID |

**Example Request:**
```
POST /api/v1/planner_notes
Content-Type: application/json

{
  "title": "Office hours",
  "details": "Ask about assignment 3",
  "todo_date": "2026-03-28T14:00:00Z",
  "course_id": 100
}
```

---

## 21. Search

### GET /api/v1/search/recipients

Searches for users and contexts that can receive messages.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | optional | Search term (name or email) |
| `context` | string | optional | Limit to context (e.g., `course_100`) |
| `exclude[]` | string | optional | User IDs to exclude |
| `type` | string | optional | Values: `user`, `context` |
| `user_id` | integer | optional | Find a specific user |
| `from_conversation_id` | integer | optional | Participants of a conversation |
| `permissions[]` | string | optional | Required permissions: `send_messages`, `manage_grades` |
| `per_page` | integer | optional | Items per page |

**Example Request:**
```
GET /api/v1/search/recipients?search=jane&context=course_100&type=user
```

**Example Response:**
```json
[
  {
    "id": 12345,
    "name": "Jane Student",
    "full_name": "Jane Student",
    "common_courses": {
      "100": ["StudentEnrollment"]
    },
    "common_groups": {},
    "avatar_url": "https://canvas.example.com/images/avatar.png"
  }
]
```

---

### GET /api/v1/search/all_courses

Searches all available courses (for self-enrollment, browsing).

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | optional | Search term |
| `public_only` | boolean | optional | Only public courses |
| `open_enrollment_only` | boolean | optional | Only open enrollment courses |
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "id": 200,
    "name": "Public Art History",
    "course_code": "ART101",
    "enrollment_term_id": 5,
    "sis_course_id": null,
    "public_description": "Explore the history of art..."
  }
]
```

---

## 22. Notification Preferences

### GET /api/v1/users/self/communication_channels

Lists the user's communication channels (email, SMS, push).

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "id": 2001,
    "address": "jane@example.com",
    "type": "email",
    "position": 1,
    "user_id": 12345,
    "workflow_state": "active",
    "created_at": "2026-01-10T10:00:00Z"
  },
  {
    "id": 2002,
    "address": "push",
    "type": "push",
    "position": 2,
    "user_id": 12345,
    "workflow_state": "active",
    "created_at": "2026-01-10T10:00:00Z"
  }
]
```

---

### GET /api/v1/users/self/communication_channels/:id/notification_preferences

Lists notification preferences for a communication channel.

**Example Response:**
```json
{
  "notification_preferences": [
    {
      "href": "https://canvas.example.com/api/v1/users/self/communication_channels/2001/notification_preferences/new_announcement",
      "notification": "new_announcement",
      "category": "announcement",
      "frequency": "immediately"
    },
    {
      "notification": "assignment_due_date_changed",
      "category": "due_date",
      "frequency": "daily"
    },
    {
      "notification": "submission_graded",
      "category": "grading",
      "frequency": "immediately"
    }
  ]
}
```

**Frequency values:** `immediately`, `daily`, `weekly`, `never`

---

### PUT /api/v1/users/self/communication_channels/:type/:address/notification_preferences/:notification

Updates a notification preference.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | required | Channel type: `email`, `sms`, `push` |
| `address` | string | required | Channel address (email address, phone, or "push") |
| `notification` | string | required | Notification name (e.g., `new_announcement`, `submission_graded`) |

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `notification_preferences[frequency]` | string | required | Values: `immediately`, `daily`, `weekly`, `never` |

**Example Request:**
```
PUT /api/v1/users/self/communication_channels/email/jane@example.com/notification_preferences/new_announcement
Content-Type: application/json

{
  "notification_preferences": {
    "frequency": "daily"
  }
}
```

---

## 23. Analytics

### GET /api/v1/courses/:course_id/analytics/activity

Returns page view and participation data for a course over time.

**Example Response:**
```json
[
  {
    "date": "2026-03-20",
    "views": 150,
    "participations": 45
  },
  {
    "date": "2026-03-21",
    "views": 120,
    "participations": 30
  }
]
```

---

### GET /api/v1/courses/:course_id/analytics/assignments

Returns assignment-level analytics for a course.

**Example Response:**
```json
[
  {
    "assignment_id": 5001,
    "title": "Essay Assignment",
    "due_at": "2026-03-25T23:59:00Z",
    "points_possible": 50.0,
    "non_digital_submission": false,
    "muted": false,
    "min_score": 30.0,
    "max_score": 50.0,
    "median": 43.0,
    "first_quartile": 38.0,
    "third_quartile": 47.0,
    "tardiness_breakdown": {
      "on_time": 0.8,
      "late": 0.1,
      "missing": 0.05,
      "floating": 0.05
    }
  }
]
```

---

### GET /api/v1/courses/:course_id/analytics/student_summaries

Returns per-student summary analytics for a course.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sort_column` | string | optional | Sort by: `name`, `name_descending`, `score`, `score_descending`, `participations`, `participations_descending`, `page_views`, `page_views_descending` |
| `student_id` | integer | optional | Filter to specific student |
| `per_page` | integer | optional | Items per page |

**Example Response:**
```json
[
  {
    "id": 12345,
    "page_views": 250,
    "max_page_views": 500,
    "page_views_level": 2,
    "participations": 35,
    "max_participations": 50,
    "participations_level": 3,
    "tardiness_breakdown": {
      "on_time": 0.85,
      "late": 0.10,
      "missing": 0.05,
      "floating": 0.0,
      "total": 20
    }
  }
]
```

---

### GET /api/v1/courses/:course_id/analytics/users/:student_id/activity

Returns activity data for a specific student in a course.

**Example Response:**
```json
[
  {
    "date": "2026-03-20",
    "views": 15,
    "participations": 5
  },
  {
    "date": "2026-03-21",
    "views": 8,
    "participations": 3
  }
]
```

---

## 24. Brand/Theme

### GET /api/v1/brand_variables

Returns the global brand/theme variables for the Canvas instance.

**Example Response:**
```json
{
  "ic-brand-primary": "#0076B8",
  "ic-brand-font-color-dark": "#2D3B45",
  "ic-brand-button--primary-bgd": "#0076B8",
  "ic-brand-button--primary-text": "#FFFFFF",
  "ic-brand-button--secondary-bgd": "#2D3B45",
  "ic-brand-button--secondary-text": "#FFFFFF",
  "ic-brand-global-nav-bgd": "#394B58",
  "ic-brand-global-nav-ic-icon-svg-fill": "#FFFFFF",
  "ic-brand-global-nav-ic-icon-svg-fill--active": "#0076B8",
  "ic-brand-global-nav-menu-item__text-color": "#FFFFFF",
  "ic-brand-global-nav-menu-item__text-color--active": "#0076B8",
  "ic-brand-header-image": "https://canvas.example.com/accounts/1/brand_configs/header.png",
  "ic-brand-watermark": "",
  "ic-brand-watermark-opacity": "1",
  "ic-brand-favicon": "https://canvas.example.com/accounts/1/brand_configs/favicon.ico",
  "ic-brand-apple-touch-icon": "https://canvas.example.com/accounts/1/brand_configs/apple-touch-icon.png",
  "ic-brand-msapplication-tile-color": "#0076B8",
  "ic-brand-msapplication-tile-square": "",
  "ic-brand-msapplication-tile-wide": "",
  "ic-brand-right-sidebar-logo": "",
  "ic-brand-Login-body-bgd-color": "#394B58",
  "ic-brand-Login-body-bgd-image": "",
  "ic-brand-Login-body-bgd-shadow-color": "#2D3B45",
  "ic-brand-Login-logo": "",
  "ic-brand-Login-Content-bgd-color": "none",
  "ic-brand-Login-Content-border-color": "none",
  "ic-brand-Login-Content-inner-bgd": "none",
  "ic-brand-Login-Content-inner-body": "none",
  "ic-brand-Login-Content-inner-body-bgd": "none",
  "ic-brand-Login-Content-label-text-color": "none",
  "ic-brand-Login-Content-password-text-color": "none",
  "ic-brand-Login-Content-button-bgd": "none",
  "ic-brand-Login-Content-button-text": "none",
  "ic-brand-Login-footer-link-color": "none",
  "ic-brand-Login-footer-link-color-hover": "none",
  "ic-brand-Login-instructure-logo": "none"
}
```

---

### GET /api/v1/accounts/:id/brand_variables

Returns brand/theme variables for a specific account. Same response shape as the global endpoint.

---

## Appendix A: Common Data Types

### DateTime Format
All datetime values use ISO 8601 format: `2026-03-25T23:59:00Z`

### Context Codes
Context codes identify a course, group, or user: `course_100`, `group_50`, `user_12345`

### Workflow States
Common workflow states across resources:
- **Courses:** `unpublished`, `available`, `completed`, `deleted`
- **Assignments:** `published`, `unpublished`
- **Submissions:** `submitted`, `unsubmitted`, `graded`, `pending_review`
- **Enrollments:** `active`, `invited`, `creation_pending`, `deleted`, `rejected`, `completed`, `inactive`
- **Conversations:** `read`, `unread`, `archived`

### Include Parameters
The `include[]` parameter allows embedding related data in responses to reduce API calls. Pass multiple values by repeating the parameter:
```
GET /api/v1/courses?include[]=term&include[]=teachers&include[]=enrollments
```

---

## Appendix B: Error Handling

### Error Response Format
```json
{
  "errors": [
    {
      "message": "The specified resource does not exist."
    }
  ],
  "status": "not_found"
}
```

### Validation Error Format
```json
{
  "errors": {
    "name": [
      { "type": "required", "message": "name is required" }
    ],
    "due_at": [
      { "type": "invalid", "message": "invalid datetime" }
    ]
  }
}
```

### Common Error Codes

| Status | Meaning | Common Cause |
|--------|---------|-------------|
| 400 | Bad Request | Invalid parameters or malformed JSON |
| 401 | Unauthorized | Missing, invalid, or expired access token |
| 403 | Forbidden | Insufficient permissions or rate limited |
| 404 | Not Found | Resource does not exist or user lacks access |
| 409 | Conflict | Resource state conflict (e.g., duplicate enrollment) |
| 422 | Unprocessable Entity | Validation errors on input data |
| 500 | Internal Server Error | Canvas server error (retry may help) |

---

## Appendix C: ReDefiners API Client Reference

The ReDefiners frontend uses a centralized API client defined in `js/api.js`. Key features:

### Initialization
```javascript
const api = new CanvasAPI('/api');
// Or use the global instance:
window.ReDefinersAPI
```

### Sub-modules
| Module | Accessor | Primary Endpoints |
|--------|----------|-------------------|
| Users | `api.users` | `/v1/users/self/*` |
| Courses | `api.courses` | `/v1/courses/*` |
| Assignments | `api.assignments` | `/v1/courses/:id/assignments/*` |
| Modules | `api.modules` | `/v1/courses/:id/modules/*` |
| Calendar | `api.calendar` | `/v1/calendar_events/*` |
| Conversations | `api.conversations` | `/v1/conversations/*` |
| Announcements | `api.announcements` | `/v1/announcements` |
| Discussions | `api.discussions` | `/v1/courses/:id/discussion_topics/*` |
| Grades | `api.grades` | `/v1/courses/:id/enrollments`, assignment_groups |
| Quizzes | `api.quizzes` | `/v1/courses/:id/quizzes/*` |
| Pages | `api.pages` | `/v1/courses/:id/pages/*` |
| Files | `api.files` | `/v1/files/*`, `/v1/folders/*` |
| Planner | `api.planner` | `/v1/planner/*`, `/v1/planner_notes` |
| Search | `api.search` | `/v1/search/*` |

### Caching
The client uses TTL-based caching for GET requests. Cache durations:
- **10 minutes (600000ms):** Courses list, course settings, pages list, colors
- **5 minutes (300000ms):** User profile, settings, favorites, modules
- **2 minutes (120000ms):** Calendar events
- **1 minute (60000ms):** Conversations list, unread count
- **30 minutes (1800000ms):** File quota
- **1 hour (3600000ms):** Course tabs

### Pagination Helper
```javascript
// Fetch all pages automatically
const allCourses = await api.getAll('/v1/courses', { per_page: 50 });
```

### Error Handling
```javascript
try {
  const result = await api.courses.get(courseId);
} catch (error) {
  if (error.isUnauthorized) { /* redirect to login */ }
  if (error.isForbidden) { /* show permission error */ }
  if (error.isNotFound) { /* show 404 */ }
  if (error.isRateLimited) { /* back off */ }
  if (error.isNetworkError) { /* show offline message */ }
}
```
