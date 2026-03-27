# ReDefiners Canvas LMS — User Accounts & Test Results

**Last Tested:** 2026-03-26
**Environment:** https://fineract.us
**Test Result:** 39/39 pages passed across 3 personas

---

## Account Credentials

### Admin Account
| Field | Value |
|-------|-------|
| **Email** | `admin@redefiners.org` |
| **Password** | `ReDefiners2024!` |
| **Role** | Site Admin + Teacher |
| **Courses** | 10 (enrolled as teacher in all) |

### Teacher Accounts

| Name | Email | Password | Courses |
|------|-------|----------|---------|
| Prof. Maria Garcia | `mgarcia@redefiners.edu` | `ReDefTeacher2024!` | Spanish 101 |
| Dr. James Chen | `jchen@redefiners.edu` | `ReDefTeacher2024!` | Biology 201, Environmental Science |
| Ms. Elena Rodriguez | `erodriguez@redefiners.edu` | `ReDefTeacher2024!` | English 101, World History |
| Dr. Amanda Foster | `afoster@redefiners.edu` | `ReDefTeacher2024!` | Math 101, Psychology, Music |
| Prof. Robert Williams | `rwilliams@redefiners.edu` | `ReDefTeacher2024!` | CS 110, Art History |

### Student Accounts (24 total, all use password: `ReDefStudent2024!`)

| Name | Email | Courses |
|------|-------|---------|
| Aisha Johnson | `aisha.johnson@redefiners.edu` | 10 |
| Carlos Rivera | `carlos.rivera@redefiners.edu` | 9 |
| Emily Chen | `emily.chen@redefiners.edu` | 7 |
| David Kim | `david.kim@redefiners.edu` | 8 |
| Sarah Adams | `sarah.adams@redefiners.edu` | 10 |
| Brian Chen | `brian.chen@redefiners.edu` | 8 |
| Diana Flores | `diana.flores@redefiners.edu` | 7 |
| James Garcia | `james.garcia@redefiners.edu` | 10 |
| Rosa Lopez | `rosa.lopez@redefiners.edu` | 8 |
| Michael Kim | `michael.kim@redefiners.edu` | 9 |
| Derek Nguyen | `derek.nguyen@redefiners.edu` | 10 |
| Maria Santos | `maria.santos@redefiners.edu` | 9 |
| Alex Thompson | `alex.thompson@redefiners.edu` | 10 |
| Priya Patel | `priya.patel@redefiners.edu` | 8 |
| Marcus Williams | `marcus.williams@redefiners.edu` | 8 |
| Sofia Morales | `sofia.morales@redefiners.edu` | 9 |
| Tyler Brooks | `tyler.brooks@redefiners.edu` | 7 |
| Yuki Tanaka | `yuki.tanaka@redefiners.edu` | 9 |
| Isabella Martinez | `isabella.martinez@redefiners.edu` | 9 |
| Liam OConnor | `liam.oconnor@redefiners.edu` | 9 |
| Fatima Ali | `fatima.ali@redefiners.edu` | 9 |
| Ryan Chang | `ryan.chang@redefiners.edu` | 8 |
| Olivia Washington | `olivia.washington@redefiners.edu` | 10 |
| Noah Petrov | `noah.petrov@redefiners.edu` | 9 |

---

## Courses (10)

| ID | Course Name | Teacher | Students |
|----|-------------|---------|----------|
| 1 | Spanish 101: Introduction to Spanish | Prof. Garcia | 24 |
| 2 | Biology 201: Cell Biology & Genetics | Dr. Chen | 24 |
| 3 | English Composition 101 | Ms. Rodriguez | 24 |
| 4 | Environmental Science 200 | Dr. Chen | 24 |
| 5 | World History: Modern Era | Ms. Rodriguez | 24 |
| 6 | Mathematics 101: College Algebra | Dr. Foster | ~18 |
| 7 | Computer Science 110: Intro to Programming | Prof. Williams | ~18 |
| 8 | Psychology 101 | Dr. Foster | ~16 |
| 9 | Art History 200: Renaissance to Modern | Prof. Williams | ~16 |
| 10 | Music Appreciation 100 | Dr. Foster | ~16 |

---

## Seeded Data

| Data Type | Count |
|-----------|-------|
| Users | 34 |
| Courses | 10 |
| Assignments | 61 |
| Graded Submissions | 1,014 |
| Quizzes | 30 |
| Discussions | 26 |
| Announcements | 12 |
| Modules (Items) | 10 (38) |
| Wiki Pages | 50 |
| Rubrics | 20 |
| Groups | 26 |
| Calendar Events | 17 |
| Conversations | 13 |
| ePortfolios | 6 |

---

## Test Results: Admin (12/12 PASSED)

| # | Page | Status | Screenshot |
|---|------|--------|------------|
| 1 | Dashboard | PASS | admin-01-dashboard.png |
| 2 | Courses | PASS | admin-02-courses.png |
| 3 | Admin Dashboard | PASS | admin-03-admin-dashboard.png |
| 4 | User Management | PASS | admin-04-admin-users.png |
| 5 | Reports | PASS | admin-05-admin-reports.png |
| 6 | Permissions | PASS | admin-06-admin-permissions.png |
| 7 | Terms | PASS | admin-07-admin-terms.png |
| 8 | Settings | PASS | admin-08-settings.png |
| 9 | Profile | PASS | admin-09-profile.png |
| 10 | Inbox | PASS | admin-10-inbox.png |
| 11 | Calendar | PASS | admin-11-calendar.png |
| 12 | Notifications | PASS | admin-12-notifications.png |

## Test Results: Teacher (12/12 PASSED)

| # | Page | Status | Screenshot |
|---|------|--------|------------|
| 1 | Dashboard | PASS | teacher-01-dashboard.png |
| 2 | Courses | PASS | teacher-02-courses.png |
| 3 | Course Home | PASS | teacher-03-course-home.png |
| 4 | Assignments | PASS | teacher-04-assignments.png |
| 5 | Gradebook | PASS | teacher-05-gradebook.png |
| 6 | Speed Grader | PASS | teacher-06-speed-grader.png |
| 7 | People | PASS | teacher-07-people.png |
| 8 | Modules | PASS | teacher-08-modules.png |
| 9 | Discussions | PASS | teacher-09-discussions.png |
| 10 | Quizzes | PASS | teacher-10-quizzes.png |
| 11 | Inbox | PASS | teacher-11-inbox.png |
| 12 | Profile | PASS | teacher-12-profile.png |

## Test Results: Student (15/15 PASSED)

| # | Page | Status | Screenshot |
|---|------|--------|------------|
| 1 | Dashboard | PASS | student-01-dashboard.png |
| 2 | Courses | PASS | student-02-courses.png |
| 3 | Course Home | PASS | student-03-course-home.png |
| 4 | Assignments | PASS | student-04-assignments.png |
| 5 | Grades | PASS | student-05-grades.png |
| 6 | Modules | PASS | student-06-modules.png |
| 7 | Discussions | PASS | student-07-discussions.png |
| 8 | Quizzes | PASS | student-08-quizzes.png |
| 9 | Pages | PASS | student-09-pages.png |
| 10 | Files | PASS | student-10-files.png |
| 11 | Inbox | PASS | student-11-inbox.png |
| 12 | Profile | PASS | student-12-profile.png |
| 13 | Planner | PASS | student-13-planner.png |
| 14 | ePortfolio | PASS | student-14-eportfolio.png |
| 15 | Calendar | PASS | student-15-calendar.png |

---

## User Story Verification

### Student Stories (US-001 to US-020)
| ID | Story | Status |
|----|-------|--------|
| US-001 | Login with email/password | PASS |
| US-002 | See enrolled courses on dashboard | PASS |
| US-003 | View assignments with due dates | PASS |
| US-006 | View grades by course | PASS |
| US-007 | Participate in discussions | PASS |
| US-008 | View modules with completion tracking | PASS |
| US-009 | Read course pages and syllabus | PASS |
| US-010 | Access course files | PASS |
| US-011 | Send/receive messages via inbox | PASS |
| US-012 | View calendar with events | PASS |
| US-013 | Use planner | PASS |
| US-015 | Manage profile/settings | PASS |
| US-016 | Create ePortfolio | PASS |
| US-019 | Switch light/dark mode | PASS |

### Teacher Stories (US-021 to US-040)
| ID | Story | Status |
|----|-------|--------|
| US-024 | Grade via speed grader | PASS |
| US-025 | Manage gradebook | PASS |
| US-026 | Manage modules | PASS |
| US-029 | View analytics | PASS |
| US-031 | Manage people | PASS |

### Admin Stories (US-041 to US-055)
| ID | Story | Status |
|----|-------|--------|
| US-041 | Manage users | PASS |
| US-043 | Manage terms | PASS |
| US-046 | Set permissions | PASS |
| US-053 | Generate reports | PASS |

---

*All screenshots stored in `react-screenshots/user-testing/`*
*Automated testing via Puppeteer on 2026-03-26*
