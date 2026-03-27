/**
 * ReDefiners — Application Controller
 *
 * Page initialization, shared behaviors, and Canvas API bootstrapping.
 * Include this on every page after api.js and render.js.
 *
 * <script src="js/api.js"></script>
 * <script src="js/render.js"></script>
 * <script src="js/app.js"></script>
 */

(function () {
    'use strict';

    const api = window.ReDefinersAPI;
    const render = window.ReDefinersRenderer;

    // ═══════════════════════════════════════
    // URL Parameter Helpers
    // ═══════════════════════════════════════

    function getParam(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    function getCourseId() {
        return getParam('course_id');
    }

    // ═══════════════════════════════════════
    // Global: Top Bar User Profile
    // ═══════════════════════════════════════

    async function initTopBar() {
        try {
            const { data: profile } = await api.users.profile();

            // Update avatar
            const avatars = document.querySelectorAll('.nav-avatar, .top-avatar');
            avatars.forEach(img => {
                if (profile.avatar_url) img.src = profile.avatar_url;
            });

            // Update welcome message
            const welcomeName = document.querySelector('.welcome-sec h3, .welcome-name');
            if (welcomeName && profile.short_name) {
                welcomeName.textContent = `Welcome, ${profile.short_name}!`;
            }

            // Notification badge
            try {
                const { data: unread } = await api.conversations.unreadCount();
                if (unread?.unread_count) {
                    render.updateNotificationBadge(parseInt(unread.unread_count));
                }
            } catch (e) { /* notification count is non-critical */ }

        } catch (error) {
            if (error.isUnauthorized) {
                window.location.href = 'login.html';
            }
            console.error('[TopBar] Failed to load profile:', error);
        }
    }

    // ═══════════════════════════════════════
    // Page: Dashboard
    // ═══════════════════════════════════════

    async function initDashboard() {
        // Courses
        try {
            const { data: courses } = await api.courses.list();
            const courseContainer = document.querySelector('.video-carousel, .course-carousel-container');
            if (courseContainer && courses) {
                render.courseCardList(courses.slice(0, 6), courseContainer);
            }
        } catch (e) { console.error('[Dashboard] Courses:', e); }

        // To-Do
        try {
            const { data: todoItems } = await api.users.todo();
            const todoContainer = document.querySelector('.todo-container, .right-end');
            if (todoContainer && todoItems) {
                render.todoList(todoItems.slice(0, 8), todoContainer);
            }
        } catch (e) { console.error('[Dashboard] Todo:', e); }

        // Upcoming events for calendar widget
        try {
            const now = new Date();
            const endDate = new Date(now);
            endDate.setDate(endDate.getDate() + 14);
            const { data: events } = await api.calendar.all(
                now.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0]
            );
            const eventContainer = document.querySelector('.calendar-events, .right-sidebar .calendar-list');
            if (eventContainer && events) {
                events.slice(0, 5).forEach(ev => eventContainer.appendChild(render.calendarEvent(ev)));
            }
        } catch (e) { console.error('[Dashboard] Calendar:', e); }
    }

    // ═══════════════════════════════════════
    // Page: Courses
    // ═══════════════════════════════════════

    async function initCourses() {
        const container = document.querySelector('.course-list-container, .video-carousel');
        if (!container) return;

        render.showLoading(container, 'card', 4);

        try {
            const { data: courses } = await api.courses.list();
            render.courseCardList(courses, container);
        } catch (e) {
            console.error('[Courses]', e);
            container.innerHTML = '';
            container.appendChild(render.emptyState('Error loading courses', e.message));
        }
    }

    // ═══════════════════════════════════════
    // Page: Assignments Index
    // ═══════════════════════════════════════

    async function initAssignments() {
        const courseId = getCourseId();
        if (!courseId) return;

        const container = document.querySelector('.assignments-container, #assign');
        if (!container) return;

        render.showLoading(container, 'row', 6);

        try {
            const { data: groups } = await api.assignments.groups(courseId);
            render.assignmentGroupList(groups, container);
        } catch (e) {
            console.error('[Assignments]', e);
            container.innerHTML = '';
            container.appendChild(render.emptyState('Error loading assignments', e.message));
        }
    }

    // ═══════════════════════════════════════
    // Page: Grades
    // ═══════════════════════════════════════

    async function initGrades() {
        const courseId = getCourseId();
        if (!courseId) return;

        const container = document.querySelector('.grades-container, #assign');
        if (!container) return;

        render.showLoading(container, 'row', 8);

        try {
            const [groupsRes, enrollmentsRes] = await Promise.all([
                api.grades.assignmentGroupsWithGrades(courseId),
                api.grades.enrollments(courseId),
            ]);

            const enrollment = enrollmentsRes.data?.find(e => e.type === 'StudentEnrollment');
            const totalGrade = enrollment?.grades?.current_score;

            render.gradesTable(groupsRes.data, totalGrade, container);
        } catch (e) {
            console.error('[Grades]', e);
            container.innerHTML = '';
            container.appendChild(render.emptyState('Error loading grades', e.message));
        }
    }

    // ═══════════════════════════════════════
    // Page: Modules
    // ═══════════════════════════════════════

    async function initModules() {
        const courseId = getCourseId();
        if (!courseId) return;

        const container = document.querySelector('.modules-container, #assign');
        if (!container) return;

        render.showLoading(container, 'row', 5);

        try {
            const { data: modules } = await api.modules.list(courseId);
            render.moduleList(modules, container);
        } catch (e) {
            console.error('[Modules]', e);
            container.innerHTML = '';
            container.appendChild(render.emptyState('Error loading modules', e.message));
        }
    }

    // ═══════════════════════════════════════
    // Page: Calendar
    // ═══════════════════════════════════════

    async function initCalendar() {
        // Calendar page has its own Materialize-based calendar.
        // This enhances it with Canvas event data.
        try {
            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
            const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

            const [eventsRes, assignmentsRes] = await Promise.all([
                api.calendar.events(startDate, endDate),
                api.calendar.assignments(startDate, endDate),
            ]);

            const allEvents = [...(eventsRes.data || []), ...(assignmentsRes.data || [])];

            // Highlight dates with events on the calendar grid
            allEvents.forEach(event => {
                const date = new Date(event.start_at || event.assignment?.due_at);
                if (!date) return;
                const day = date.getDate();
                const cell = document.querySelector(`td[data-day="${day}"]`);
                if (cell) {
                    cell.classList.add('blue-td');
                    cell.style.cursor = 'pointer';
                    cell.title = event.title;
                }
            });

            // Populate event list
            const listContainer = document.querySelector('.event-list, .calendar-events');
            if (listContainer) {
                listContainer.innerHTML = '';
                if (allEvents.length === 0) {
                    listContainer.appendChild(render.el('p', '', {
                        text: 'No events this month',
                        style: 'color:var(--text-muted);font-size:13px;',
                    }));
                } else {
                    allEvents
                        .sort((a, b) => new Date(a.start_at || a.assignment?.due_at) - new Date(b.start_at || b.assignment?.due_at))
                        .forEach(ev => listContainer.appendChild(render.calendarEvent(ev)));
                }
            }
        } catch (e) {
            console.error('[Calendar]', e);
        }
    }

    // ═══════════════════════════════════════
    // Page: Announcements
    // ═══════════════════════════════════════

    async function initAnnouncements() {
        try {
            const { data: courses } = await api.courses.list();
            const contextCodes = courses.map(c => `course_${c.id}`);

            const { data: announcements } = await api.announcements.list(contextCodes);

            const tbody = document.querySelector('.table-inside1 tbody, .announce-table tbody');
            if (tbody && announcements) {
                tbody.innerHTML = '';
                if (announcements.length === 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = '<td colspan="4" style="text-align:center;padding:40px;color:var(--text-muted);">No announcements</td>';
                    tbody.appendChild(row);
                } else {
                    announcements.forEach(a => tbody.appendChild(render.announcementRow(a)));
                }
            }
        } catch (e) {
            console.error('[Announcements]', e);
        }
    }

    // ═══════════════════════════════════════
    // Page: Inbox
    // ═══════════════════════════════════════

    async function initInbox() {
        const listContainer = document.querySelector('.mess-form, .inbox-left .people-sec');
        if (!listContainer) return;

        render.showLoading(listContainer, 'row', 5);

        try {
            const { data: conversations } = await api.conversations.list();
            listContainer.innerHTML = '';
            if (!conversations || conversations.length === 0) {
                listContainer.appendChild(render.emptyState('No messages', 'Your inbox is empty.'));
            } else {
                conversations.forEach(conv => listContainer.appendChild(render.conversationRow(conv)));
            }

            // Load specific conversation if ID in URL
            const convId = getParam('id');
            if (convId) {
                const { data: thread } = await api.conversations.get(convId);
                const threadContainer = document.querySelector('.real-mess, .inbox-right');
                if (threadContainer && thread) {
                    threadContainer.innerHTML = '';
                    (thread.messages || []).forEach(msg => {
                        const msgEl = render.el('div', '', { style: 'margin:15px 0;' });
                        const header = render.el('div', 'real-mess-inn');
                        header.appendChild(render.el('img', '', {
                            src: msg.avatar_url || 'Images/image1.png',
                            style: 'width:35px;height:35px;border-radius:100%;',
                        }));
                        const body = render.el('div', 'mess-body', { html: msg.body });
                        header.appendChild(body);
                        msgEl.appendChild(header);
                        msgEl.appendChild(render.el('h5', '', { text: render.formatDateTime(msg.created_at) }));
                        threadContainer.appendChild(msgEl);
                    });
                }
            }
        } catch (e) {
            console.error('[Inbox]', e);
            listContainer.innerHTML = '';
            listContainer.appendChild(render.emptyState('Error loading messages', e.message));
        }
    }

    // ═══════════════════════════════════════
    // Page: Profile
    // ═══════════════════════════════════════

    async function initProfile() {
        try {
            const { data: profile } = await api.users.profile();

            // Update profile image
            const profileImg = document.querySelector('.profile-img img, .message-pro img');
            if (profileImg && profile.avatar_url) profileImg.src = profile.avatar_url;

            // Update name
            const nameEl = document.querySelector('.pr-inn h5, .message-pro h5');
            if (nameEl) nameEl.textContent = profile.name;

            // Update email
            const emailEl = document.querySelector('.pr-inn p');
            if (emailEl) emailEl.textContent = profile.primary_email || '';

            // Update bio
            const bioEl = document.querySelector('.about p');
            if (bioEl && profile.bio) bioEl.textContent = profile.bio;

        } catch (e) {
            console.error('[Profile]', e);
        }
    }

    // ═══════════════════════════════════════
    // Page: Course Home
    // ═══════════════════════════════════════

    async function initCourseHome() {
        const courseId = getCourseId();
        if (!courseId) return;

        try {
            const { data: course } = await api.courses.get(courseId);

            // Update course title
            const titleEl = document.querySelector('.course-title, .banner-title, h3.second-color');
            if (titleEl && course.name) titleEl.textContent = course.name;

            // Update course code
            const codeEl = document.querySelector('.course-code, .banner-subtitle');
            if (codeEl && course.course_code) codeEl.textContent = course.course_code;
        } catch (e) { console.error('[CourseHome] Course:', e); }

        // Load recent announcements
        try {
            const { data: announcements } = await api.announcements.list([`course_${courseId}`]);
            const announceContainer = document.querySelector('.announce-list, .recent-announcements');
            if (announceContainer && announcements) {
                announceContainer.innerHTML = '';
                announcements.slice(0, 3).forEach(a => announceContainer.appendChild(render.announcementRow(a)));
            }
        } catch (e) { console.error('[CourseHome] Announcements:', e); }

        // Load upcoming assignments
        try {
            const { data: assignments } = await api.assignments.list(courseId);
            const upcomingContainer = document.querySelector('.upcoming-assignments, .assign-list');
            if (upcomingContainer && assignments) {
                const upcoming = assignments
                    .filter(a => a.due_at && new Date(a.due_at) > new Date())
                    .sort((a, b) => new Date(a.due_at) - new Date(b.due_at))
                    .slice(0, 5);
                upcomingContainer.innerHTML = '';
                upcoming.forEach(a => upcomingContainer.appendChild(render.assignmentRow(a)));
            }
        } catch (e) { console.error('[CourseHome] Assignments:', e); }
    }

    // ═══════════════════════════════════════
    // Page: Assignment Detail
    // ═══════════════════════════════════════

    async function initAssignmentDetail() {
        const courseId = getCourseId();
        const assignmentId = getParam('assignment_id');
        if (!courseId || !assignmentId) return;

        try {
            const { data: assignment } = await api.assignments.get(courseId, assignmentId);

            // Update title
            const titleEl = document.querySelector('.assignment-title, h4.second-color, h3.second-color');
            if (titleEl) titleEl.textContent = assignment.name;

            // Update description
            const descEl = document.querySelector('.assignment-description, .assign-desc');
            if (descEl) descEl.innerHTML = assignment.description || 'No description provided.';

            // Update points
            const pointsEl = document.querySelector('.assignment-points, .points-badge');
            if (pointsEl) pointsEl.textContent = `${assignment.points_possible || 0} points`;

            // Update due date
            const dueEl = document.querySelector('.assignment-due, .due-date');
            if (dueEl && assignment.due_at) {
                dueEl.textContent = `Due ${render.formatDateTime(assignment.due_at)}`;
            }

            // Update submission status
            if (assignment.submission) {
                const statusEl = document.querySelector('.submission-status');
                if (statusEl) {
                    statusEl.textContent = render.submissionStatus(assignment.submission);
                }
            }

            // Load rubric if present
            if (assignment.rubric) {
                const rubricContainer = document.querySelector('.rubric-container, .rubric-table');
                if (rubricContainer) {
                    rubricContainer.innerHTML = '';
                    const table = render.el('table', 'tw-w-full tw-text-sm');
                    const thead = render.el('thead');
                    const headRow = render.el('tr', 'tw-border-b');
                    headRow.appendChild(render.el('th', 'tw-text-left tw-py-2 tw-text-gray-500', { text: 'Criteria' }));
                    headRow.appendChild(render.el('th', 'tw-text-right tw-py-2 tw-text-gray-500', { text: 'Points' }));
                    thead.appendChild(headRow);
                    table.appendChild(thead);
                    const tbody = render.el('tbody');
                    assignment.rubric.forEach(criterion => {
                        const row = render.el('tr', 'tw-border-b');
                        row.appendChild(render.el('td', 'tw-py-2', { text: criterion.description }));
                        row.appendChild(render.el('td', 'tw-py-2 tw-text-right tw-font-medium', { text: `${criterion.points}` }));
                        tbody.appendChild(row);
                    });
                    table.appendChild(tbody);
                    rubricContainer.appendChild(table);
                }
            }
        } catch (e) {
            console.error('[AssignmentDetail]', e);
        }
    }

    // ═══════════════════════════════════════
    // Page: Submission
    // ═══════════════════════════════════════

    async function initSubmission() {
        const courseId = getCourseId();
        const assignmentId = getParam('assignment_id');
        if (!courseId || !assignmentId) return;

        try {
            const [assignmentRes, submissionRes] = await Promise.all([
                api.assignments.get(courseId, assignmentId),
                api.assignments.submission(courseId, assignmentId),
            ]);

            const assignment = assignmentRes.data;
            const submission = submissionRes.data;

            // Update assignment name
            const titleEl = document.querySelector('.submission-title, h4.second-color');
            if (titleEl) titleEl.textContent = assignment.name;

            // Update grade
            const gradeEl = document.querySelector('.submission-grade, .grade-display');
            if (gradeEl && submission.score !== null) {
                gradeEl.textContent = `${submission.score}/${assignment.points_possible}`;
            }

            // Update status
            const statusEl = document.querySelector('.submission-status');
            if (statusEl) {
                statusEl.textContent = render.submissionStatus(submission);
            }
        } catch (e) {
            console.error('[Submission]', e);
        }
    }

    // ═══════════════════════════════════════
    // Page: Pages Index
    // ═══════════════════════════════════════

    async function initPages() {
        const courseId = getCourseId();
        if (!courseId) return;

        const container = document.querySelector('.pages-container, .pages-list, #assign');
        if (!container) return;

        render.showLoading(container, 'row', 5);

        try {
            const { data: pages } = await api.pages.list(courseId);
            container.innerHTML = '';

            if (!pages || pages.length === 0) {
                container.appendChild(render.emptyState('No pages', 'This course has no pages yet.'));
                return;
            }

            pages.forEach(page => {
                const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-3 tw-rounded-lg tw-border tw-border-gray-100 tw-mb-2 hover:tw-bg-gray-50 tw-cursor-pointer');
                row.innerHTML = `
                    <div class="tw-flex tw-items-center tw-gap-3">
                        <i class="fa fa-file-alt tw-text-primary-400"></i>
                        <div>
                            <a href="page-view.html?course_id=${courseId}&page_url=${encodeURIComponent(page.url)}" class="tw-text-sm tw-font-medium second-color tw-no-underline hover:tw-text-accent-green">${render.truncate(page.title, 60)}</a>
                            <p class="tw-text-xs tw-text-gray-500">${page.published ? 'Published' : 'Draft'} &bull; Updated ${render.relativeTime(page.updated_at)}</p>
                        </div>
                    </div>
                    ${page.front_page ? '<span class="tw-bg-accent-green/10 tw-text-accent-green tw-text-xs tw-px-2 tw-py-0.5 tw-rounded-full">Front Page</span>' : ''}
                `;
                container.appendChild(row);
            });
        } catch (e) {
            console.error('[Pages]', e);
            container.innerHTML = '';
            container.appendChild(render.emptyState('Error loading pages', e.message));
        }
    }

    // ═══════════════════════════════════════
    // Page: Page View
    // ═══════════════════════════════════════

    async function initPageView() {
        const courseId = getCourseId();
        const pageUrl = getParam('page_url');
        if (!courseId || !pageUrl) return;

        try {
            const { data: page } = await api.pages.get(courseId, pageUrl);

            // Update title
            const titleEl = document.querySelector('.page-title, h4.second-color, h3.second-color');
            if (titleEl) titleEl.textContent = page.title;

            // Update body
            const bodyEl = document.querySelector('.page-body, .page-content, .wiki-content');
            if (bodyEl) bodyEl.innerHTML = page.body || '<p>This page is empty.</p>';

            // Update meta
            const metaEl = document.querySelector('.page-meta, .page-info');
            if (metaEl) {
                metaEl.textContent = `Last updated ${render.relativeTime(page.updated_at)}`;
            }

            // Breadcrumb
            const breadcrumb = document.querySelector('.breadcrumb');
            if (breadcrumb) {
                breadcrumb.innerHTML = `
                    <a href="class.html?course_id=${courseId}">Course</a> &rsaquo;
                    <a href="pages.html?course_id=${courseId}">Pages</a> &rsaquo;
                    <span>${render.truncate(page.title, 40)}</span>
                `;
            }
        } catch (e) {
            console.error('[PageView]', e);
        }
    }

    // ═══════════════════════════════════════
    // Page: Files
    // ═══════════════════════════════════════

    async function initFiles() {
        const courseId = getCourseId();
        if (!courseId) return;

        const container = document.querySelector('.files-container, .file-list, #assign');
        if (!container) return;

        render.showLoading(container, 'row', 5);

        try {
            // Get root folder first
            const { data: rootFolder } = await api.files.rootFolder(courseId);

            // Load files and subfolders in parallel
            const [filesRes, foldersRes, quotaRes] = await Promise.all([
                api.files.listInFolder(courseId, rootFolder.id),
                api.files.listFolders(courseId, rootFolder.id),
                api.files.quota(courseId),
            ]);

            container.innerHTML = '';

            // Render folders
            (foldersRes.data || []).forEach(folder => {
                const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-3 tw-rounded-lg tw-border tw-border-gray-100 tw-mb-2 hover:tw-bg-gray-50 tw-cursor-pointer');
                row.innerHTML = `
                    <div class="tw-flex tw-items-center tw-gap-3">
                        <i class="fa fa-folder tw-text-accent-orange"></i>
                        <div>
                            <p class="tw-text-sm tw-font-medium second-color">${folder.name}</p>
                            <p class="tw-text-xs tw-text-gray-500">${folder.files_count || 0} files</p>
                        </div>
                    </div>
                    <i class="fa fa-chevron-right tw-text-gray-300"></i>
                `;
                container.appendChild(row);
            });

            // Render files
            (filesRes.data || []).forEach(file => {
                const icon = file.content_type?.includes('pdf') ? 'fa-file-pdf tw-text-red-500' :
                             file.content_type?.includes('image') ? 'fa-file-image tw-text-blue-500' :
                             file.content_type?.includes('video') ? 'fa-file-video tw-text-purple-500' :
                             file.content_type?.includes('word') ? 'fa-file-word tw-text-blue-600' :
                             'fa-file tw-text-gray-400';
                const size = file.size > 1048576 ? `${(file.size / 1048576).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`;

                const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-3 tw-rounded-lg tw-border tw-border-gray-100 tw-mb-2 hover:tw-bg-gray-50');
                row.innerHTML = `
                    <div class="tw-flex tw-items-center tw-gap-3">
                        <i class="fa ${icon}"></i>
                        <div>
                            <p class="tw-text-sm tw-font-medium second-color">${file.display_name}</p>
                            <p class="tw-text-xs tw-text-gray-500">${size} &bull; ${render.relativeTime(file.updated_at)}</p>
                        </div>
                    </div>
                    <a href="${file.url}" target="_blank" class="tw-text-gray-400 hover:tw-text-accent-green"><i class="fa fa-download"></i></a>
                `;
                container.appendChild(row);
            });

            // Storage quota
            const quotaEl = document.querySelector('.storage-quota, .quota-bar');
            if (quotaEl && quotaRes.data) {
                const used = quotaRes.data.quota_used || 0;
                const total = quotaRes.data.quota || 1;
                const pct = Math.round((used / total) * 100);
                const usedMB = (used / 1048576).toFixed(1);
                const totalMB = (total / 1048576).toFixed(0);
                quotaEl.innerHTML = `
                    <p class="tw-text-xs tw-text-gray-500 tw-mb-1">Storage: ${usedMB} MB / ${totalMB} MB (${pct}%)</p>
                    <div class="tw-w-full tw-bg-gray-100 tw-rounded-full tw-h-2">
                        <div class="tw-bg-accent-green tw-h-2 tw-rounded-full" style="width:${pct}%"></div>
                    </div>
                `;
            }

            if ((filesRes.data || []).length === 0 && (foldersRes.data || []).length === 0) {
                container.appendChild(render.emptyState('No files', 'This course has no files yet.'));
            }
        } catch (e) {
            console.error('[Files]', e);
            container.innerHTML = '';
            container.appendChild(render.emptyState('Error loading files', e.message));
        }
    }

    // ═══════════════════════════════════════
    // Page: Syllabus
    // ═══════════════════════════════════════

    async function initSyllabus() {
        const courseId = getCourseId();
        if (!courseId) return;

        try {
            const { data: course } = await api.courses.get(courseId);

            // Update syllabus body
            const bodyEl = document.querySelector('.syllabus-body, .syllabus-content, .page-content');
            if (bodyEl && course.syllabus_body) {
                bodyEl.innerHTML = course.syllabus_body;
            }

            // Load assignments for the syllabus schedule
            const { data: assignments } = await api.assignments.list(courseId, { order_by: 'due_at' });
            const scheduleContainer = document.querySelector('.syllabus-schedule, .assignment-schedule');
            if (scheduleContainer && assignments) {
                scheduleContainer.innerHTML = '';
                assignments
                    .filter(a => a.due_at)
                    .sort((a, b) => new Date(a.due_at) - new Date(b.due_at))
                    .forEach(a => {
                        const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-2 tw-border-b tw-border-gray-100');
                        row.innerHTML = `
                            <div>
                                <p class="tw-text-sm second-color">${a.name}</p>
                                <p class="tw-text-xs tw-text-gray-500">${render.formatDate(a.due_at)}</p>
                            </div>
                            <span class="tw-text-xs tw-text-gray-400">${a.points_possible || 0} pts</span>
                        `;
                        scheduleContainer.appendChild(row);
                    });
            }
        } catch (e) {
            console.error('[Syllabus]', e);
        }
    }

    // ═══════════════════════════════════════
    // Batch 3: Assessment & Grading
    // ═══════════════════════════════════════

    async function initQuizzes() {
        const courseId = getCourseId();
        if (!courseId) return;
        const container = document.querySelector('.quizzes-container, .quiz-list, #assign');
        if (!container) return;
        render.showLoading(container, 'row', 5);
        try {
            const { data: quizzes } = await api.quizzes.list(courseId);
            container.innerHTML = '';
            if (!quizzes || quizzes.length === 0) {
                container.appendChild(render.emptyState('No quizzes', 'No quizzes in this course.'));
                return;
            }
            quizzes.forEach(q => {
                const statusColor = q.published ? 'tw-text-accent-green' : 'tw-text-gray-400';
                const statusText = q.published ? 'Published' : 'Draft';
                const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-3 tw-rounded-lg tw-border tw-border-gray-100 tw-mb-2 hover:tw-bg-gray-50');
                row.innerHTML = `
                    <div class="tw-flex tw-items-center tw-gap-3">
                        <i class="fa fa-question-circle tw-text-purple-500"></i>
                        <div>
                            <a href="quiz-take.html?course_id=${courseId}&quiz_id=${q.id}" class="tw-text-sm tw-font-medium second-color tw-no-underline hover:tw-text-accent-green">${render.truncate(q.title, 60)}</a>
                            <p class="tw-text-xs tw-text-gray-500">${q.question_count || 0} questions &bull; ${q.points_possible || 0} pts &bull; ${q.time_limit ? q.time_limit + ' min' : 'No time limit'}</p>
                        </div>
                    </div>
                    <div class="tw-flex tw-items-center tw-gap-3">
                        <span class="tw-text-xs ${statusColor}">${statusText}</span>
                        ${q.due_at ? `<span class="tw-text-xs tw-text-gray-400">Due ${render.formatDate(q.due_at)}</span>` : ''}
                    </div>
                `;
                container.appendChild(row);
            });
        } catch (e) {
            console.error('[Quizzes]', e);
            container.innerHTML = '';
            container.appendChild(render.emptyState('Error loading quizzes', e.message));
        }
    }

    async function initQuizTake() {
        const courseId = getCourseId();
        const quizId = getParam('quiz_id');
        if (!courseId || !quizId) return;
        try {
            const { data: quiz } = await api.quizzes.get(courseId, quizId);
            const titleEl = document.querySelector('.quiz-title, h4.second-color, h3.second-color');
            if (titleEl) titleEl.textContent = quiz.title;
            const descEl = document.querySelector('.quiz-description, .quiz-desc');
            if (descEl) descEl.innerHTML = quiz.description || 'No description.';
            const metaEl = document.querySelector('.quiz-meta');
            if (metaEl) {
                metaEl.innerHTML = `
                    <span><i class="fa fa-question-circle"></i> ${quiz.question_count || 0} questions</span>
                    <span><i class="fa fa-star"></i> ${quiz.points_possible || 0} points</span>
                    ${quiz.time_limit ? `<span><i class="fa fa-clock"></i> ${quiz.time_limit} minutes</span>` : ''}
                    ${quiz.allowed_attempts > 0 ? `<span><i class="fa fa-redo"></i> ${quiz.allowed_attempts} attempts</span>` : ''}
                `;
            }
        } catch (e) { console.error('[QuizTake]', e); }
    }

    async function initQuizResults() {
        const courseId = getCourseId();
        const quizId = getParam('quiz_id');
        if (!courseId || !quizId) return;
        try {
            const { data: quiz } = await api.quizzes.get(courseId, quizId);
            const titleEl = document.querySelector('.quiz-title, h4.second-color');
            if (titleEl) titleEl.textContent = `Results: ${quiz.title}`;
            const scoreEl = document.querySelector('.quiz-score, .score-display');
            if (scoreEl) scoreEl.textContent = `${quiz.points_possible || 0} pts possible`;
        } catch (e) { console.error('[QuizResults]', e); }
    }

    async function initGradebook() {
        const courseId = getCourseId();
        if (!courseId) return;
        const container = document.querySelector('.gradebook-container, .gradebook-table, #assign');
        if (!container) return;
        render.showLoading(container, 'row', 8);
        try {
            const [studentsRes, groupsRes] = await Promise.all([
                api.people.list(courseId, { enrollment_type: ['student'] }),
                api.grades.assignmentGroupsWithGrades(courseId),
            ]);
            container.innerHTML = '';
            const assignments = (groupsRes.data || []).flatMap(g => g.assignments || []);
            if (!studentsRes.data?.length || !assignments.length) {
                container.appendChild(render.emptyState('No gradebook data', 'No students or assignments found.'));
                return;
            }
            const table = render.el('table', 'tw-w-full tw-text-xs');
            const thead = render.el('thead', 'tw-bg-gray-50');
            const headRow = render.el('tr');
            headRow.appendChild(render.el('th', 'tw-text-left tw-p-2 tw-font-medium tw-text-gray-600 tw-sticky tw-left-0 tw-bg-gray-50', { text: 'Student' }));
            assignments.slice(0, 10).forEach(a => {
                headRow.appendChild(render.el('th', 'tw-text-center tw-p-2 tw-font-medium tw-text-gray-600', { text: render.truncate(a.name, 15) }));
            });
            headRow.appendChild(render.el('th', 'tw-text-center tw-p-2 tw-font-medium tw-text-gray-600', { text: 'Total' }));
            thead.appendChild(headRow);
            table.appendChild(thead);
            const tbody = render.el('tbody');
            studentsRes.data.slice(0, 20).forEach(student => {
                const row = render.el('tr', 'tw-border-b tw-border-gray-100 hover:tw-bg-gray-50');
                row.appendChild(render.el('td', 'tw-p-2 tw-font-medium tw-sticky tw-left-0 tw-bg-white', { text: student.name }));
                assignments.slice(0, 10).forEach(() => {
                    row.appendChild(render.el('td', 'tw-text-center tw-p-2 tw-text-gray-500', { text: '—' }));
                });
                const enrollment = student.enrollments?.find(e => e.type === 'StudentEnrollment');
                const total = enrollment?.grades?.current_score || '—';
                row.appendChild(render.el('td', 'tw-text-center tw-p-2 tw-font-bold', { text: `${total}%` }));
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
            const wrapper = render.el('div', 'tw-overflow-x-auto');
            wrapper.appendChild(table);
            container.appendChild(wrapper);
        } catch (e) {
            console.error('[Gradebook]', e);
            container.innerHTML = '';
            container.appendChild(render.emptyState('Error loading gradebook', e.message));
        }
    }

    async function initSpeedGrader() {
        const courseId = getCourseId();
        const assignmentId = getParam('assignment_id');
        if (!courseId || !assignmentId) return;
        try {
            const { data: assignment } = await api.assignments.get(courseId, assignmentId);
            const titleEl = document.querySelector('.assignment-title, h4.second-color');
            if (titleEl) titleEl.textContent = `Speed Grader: ${assignment.name}`;
            const pointsEl = document.querySelector('.total-points');
            if (pointsEl) pointsEl.textContent = `${assignment.points_possible || 0} pts possible`;
        } catch (e) { console.error('[SpeedGrader]', e); }
    }

    async function initRubrics() {
        const courseId = getCourseId();
        if (!courseId) return;
        const container = document.querySelector('.rubrics-container, .rubric-list, #assign');
        if (!container) return;
        render.showLoading(container, 'row', 4);
        try {
            const { data: rubrics } = await api.rubrics.list(courseId);
            container.innerHTML = '';
            if (!rubrics || rubrics.length === 0) {
                container.appendChild(render.emptyState('No rubrics', 'No rubrics created yet.'));
                return;
            }
            rubrics.forEach(r => {
                const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-3 tw-rounded-lg tw-border tw-border-gray-100 tw-mb-2 hover:tw-bg-gray-50');
                row.innerHTML = `
                    <div class="tw-flex tw-items-center tw-gap-3">
                        <i class="fa fa-th-list tw-text-accent-orange"></i>
                        <div>
                            <p class="tw-text-sm tw-font-medium second-color">${r.title}</p>
                            <p class="tw-text-xs tw-text-gray-500">${r.points_possible || 0} pts &bull; ${(r.data || []).length} criteria</p>
                        </div>
                    </div>
                `;
                container.appendChild(row);
            });
        } catch (e) {
            console.error('[Rubrics]', e);
            container.innerHTML = '';
            container.appendChild(render.emptyState('Error loading rubrics', e.message));
        }
    }

    async function initOutcomes() {
        const courseId = getCourseId();
        if (!courseId) return;
        const container = document.querySelector('.outcomes-container, .outcome-list, #assign');
        if (!container) return;
        render.showLoading(container, 'row', 4);
        try {
            const { data: groups } = await api.outcomes.groups(courseId);
            container.innerHTML = '';
            if (!groups || groups.length === 0) {
                container.appendChild(render.emptyState('No outcomes', 'No learning outcomes defined.'));
                return;
            }
            groups.forEach(g => {
                const section = render.el('div', 'tw-mb-4');
                section.innerHTML = `
                    <h5 class="tw-text-sm tw-font-semibold second-color tw-mb-2"><i class="fa fa-bullseye tw-text-accent-green tw-mr-2"></i>${g.title}</h5>
                    <p class="tw-text-xs tw-text-gray-500 tw-ml-6">${g.description || 'No description'}</p>
                `;
                container.appendChild(section);
            });
        } catch (e) {
            console.error('[Outcomes]', e);
            container.innerHTML = '';
            container.appendChild(render.emptyState('Error loading outcomes', e.message));
        }
    }

    // ═══════════════════════════════════════
    // Batch 4: Communication & Social
    // ═══════════════════════════════════════

    async function initDiscussions() {
        const courseId = getCourseId();
        if (!courseId) return;
        const container = document.querySelector('.discussions-container, .discussion-list, #assign');
        if (!container) return;
        render.showLoading(container, 'row', 5);
        try {
            const { data: topics } = await api.discussions.list(courseId);
            container.innerHTML = '';
            if (!topics || topics.length === 0) {
                container.appendChild(render.emptyState('No discussions', 'No discussion topics yet.'));
                return;
            }
            topics.forEach(t => {
                const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-3 tw-rounded-lg tw-border tw-border-gray-100 tw-mb-2 hover:tw-bg-gray-50');
                row.innerHTML = `
                    <div class="tw-flex tw-items-center tw-gap-3">
                        <i class="fa fa-comments tw-text-blue-500"></i>
                        <div>
                            <a href="discussion-thread.html?course_id=${courseId}&topic_id=${t.id}" class="tw-text-sm tw-font-medium second-color tw-no-underline hover:tw-text-accent-green">${render.truncate(t.title, 60)}</a>
                            <p class="tw-text-xs tw-text-gray-500">${t.discussion_subentry_count || 0} replies &bull; ${t.unread_count || 0} unread &bull; ${render.relativeTime(t.last_reply_at || t.posted_at)}</p>
                        </div>
                    </div>
                    <div class="tw-flex tw-items-center tw-gap-2">
                        ${t.pinned ? '<span class="tw-text-xs tw-text-accent-orange"><i class="fa fa-thumbtack"></i></span>' : ''}
                        ${t.locked ? '<span class="tw-text-xs tw-text-gray-400"><i class="fa fa-lock"></i></span>' : ''}
                    </div>
                `;
                container.appendChild(row);
            });
        } catch (e) {
            console.error('[Discussions]', e);
            container.innerHTML = '';
            container.appendChild(render.emptyState('Error loading discussions', e.message));
        }
    }

    async function initDiscussionThread() {
        const courseId = getCourseId();
        const topicId = getParam('topic_id');
        if (!courseId || !topicId) return;
        try {
            const [topicRes, threadRes] = await Promise.all([
                api.discussions.get(courseId, topicId),
                api.discussions.fullThread(courseId, topicId),
            ]);
            const topic = topicRes.data;
            const thread = threadRes.data;
            const titleEl = document.querySelector('.topic-title, h4.second-color, h3.second-color');
            if (titleEl) titleEl.textContent = topic.title;
            const bodyEl = document.querySelector('.topic-body, .discussion-body');
            if (bodyEl) bodyEl.innerHTML = topic.message || '';
            const repliesContainer = document.querySelector('.replies-container, .discussion-replies');
            if (repliesContainer && thread.view) {
                repliesContainer.innerHTML = '';
                (thread.view || []).forEach(entry => {
                    const participant = (thread.participants || []).find(p => p.id === entry.user_id) || {};
                    const reply = render.el('div', 'tw-flex tw-gap-3 tw-p-3 tw-border-b tw-border-gray-100');
                    reply.innerHTML = `
                        <img src="${participant.avatar_image_url || 'Images/profile.PNG'}" class="tw-w-8 tw-h-8 tw-rounded-full tw-object-cover" />
                        <div class="tw-flex-1">
                            <div class="tw-flex tw-justify-between tw-items-center tw-mb-1">
                                <span class="tw-text-sm tw-font-medium second-color">${participant.display_name || 'Anonymous'}</span>
                                <span class="tw-text-xs tw-text-gray-400">${render.relativeTime(entry.created_at)}</span>
                            </div>
                            <div class="tw-text-sm tw-text-gray-600">${entry.message || ''}</div>
                        </div>
                    `;
                    repliesContainer.appendChild(reply);
                });
            }
        } catch (e) { console.error('[DiscussionThread]', e); }
    }

    async function initConferences() {
        const courseId = getCourseId();
        if (!courseId) return;
        const container = document.querySelector('.conferences-container, .conference-list, #assign');
        if (!container) return;
        render.showLoading(container, 'row', 3);
        try {
            const { data: result } = await api.conferences.list(courseId);
            const conferences = result.conferences || result || [];
            container.innerHTML = '';
            if (conferences.length === 0) {
                container.appendChild(render.emptyState('No conferences', 'No video conferences scheduled.'));
                return;
            }
            conferences.forEach(c => {
                const isLive = c.started_at && !c.ended_at;
                const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-3 tw-rounded-lg tw-border tw-border-gray-100 tw-mb-2 hover:tw-bg-gray-50');
                row.innerHTML = `
                    <div class="tw-flex tw-items-center tw-gap-3">
                        <i class="fa fa-video ${isLive ? 'tw-text-accent-green' : 'tw-text-gray-400'}"></i>
                        <div>
                            <p class="tw-text-sm tw-font-medium second-color">${c.title}</p>
                            <p class="tw-text-xs tw-text-gray-500">${c.description || 'No description'} &bull; ${c.participant_count || 0} participants</p>
                        </div>
                    </div>
                    ${isLive ? '<span class="tw-bg-accent-green/10 tw-text-accent-green tw-text-xs tw-px-2 tw-py-0.5 tw-rounded-full">Live</span>' : `<span class="tw-text-xs tw-text-gray-400">${c.started_at ? 'Ended' : 'Upcoming'}</span>`}
                `;
                container.appendChild(row);
            });
        } catch (e) {
            console.error('[Conferences]', e);
            container.innerHTML = '';
            container.appendChild(render.emptyState('Error loading conferences', e.message));
        }
    }

    async function initCollaborations() {
        const courseId = getCourseId();
        if (!courseId) return;
        const container = document.querySelector('.collaborations-container, .collab-list, #assign');
        if (!container) return;
        render.showLoading(container, 'row', 3);
        try {
            const { data: collabs } = await api.collaborations.list(courseId);
            container.innerHTML = '';
            if (!collabs || collabs.length === 0) {
                container.appendChild(render.emptyState('No collaborations', 'No collaborative documents yet.'));
                return;
            }
            collabs.forEach(c => {
                const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-3 tw-rounded-lg tw-border tw-border-gray-100 tw-mb-2 hover:tw-bg-gray-50');
                row.innerHTML = `
                    <div class="tw-flex tw-items-center tw-gap-3">
                        <i class="fa fa-users-cog tw-text-blue-500"></i>
                        <div>
                            <p class="tw-text-sm tw-font-medium second-color">${c.title}</p>
                            <p class="tw-text-xs tw-text-gray-500">${c.description || ''} &bull; Created ${render.relativeTime(c.created_at)}</p>
                        </div>
                    </div>
                    <a href="${c.url || '#'}" target="_blank" class="tw-text-xs tw-text-accent-green hover:tw-underline">Open</a>
                `;
                container.appendChild(row);
            });
        } catch (e) {
            console.error('[Collaborations]', e);
            container.innerHTML = '';
            container.appendChild(render.emptyState('Error loading collaborations', e.message));
        }
    }

    async function initGroups() {
        const courseId = getCourseId();
        const container = document.querySelector('.groups-container, .group-list, #assign');
        if (!container) return;
        render.showLoading(container, 'row', 4);
        try {
            const { data: groups } = courseId
                ? await api.groups.listForCourse(courseId)
                : await api.groups.listForUser();
            container.innerHTML = '';
            if (!groups || groups.length === 0) {
                container.appendChild(render.emptyState('No groups', 'You are not in any groups.'));
                return;
            }
            groups.forEach(g => {
                const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-3 tw-rounded-lg tw-border tw-border-gray-100 tw-mb-2 hover:tw-bg-gray-50');
                row.innerHTML = `
                    <div class="tw-flex tw-items-center tw-gap-3">
                        <i class="fa fa-users tw-text-primary-400"></i>
                        <div>
                            <p class="tw-text-sm tw-font-medium second-color">${g.name}</p>
                            <p class="tw-text-xs tw-text-gray-500">${g.members_count || 0} members &bull; ${g.context_type || ''}</p>
                        </div>
                    </div>
                `;
                container.appendChild(row);
            });
        } catch (e) {
            console.error('[Groups]', e);
            container.innerHTML = '';
            container.appendChild(render.emptyState('Error loading groups', e.message));
        }
    }

    async function initPeople() {
        const courseId = getCourseId();
        if (!courseId) return;
        const container = document.querySelector('.people-container, .people-list, #assign');
        if (!container) return;
        render.showLoading(container, 'row', 8);
        try {
            const { data: users } = await api.people.list(courseId);
            container.innerHTML = '';
            if (!users || users.length === 0) {
                container.appendChild(render.emptyState('No people', 'No participants in this course.'));
                return;
            }
            users.forEach(u => {
                const role = u.enrollments?.[0]?.type?.replace('Enrollment', '') || 'User';
                const roleColor = role === 'Teacher' ? 'tw-text-accent-orange' : role === 'Student' ? 'tw-text-blue-500' : 'tw-text-gray-500';
                const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-3 tw-rounded-lg tw-border tw-border-gray-100 tw-mb-2 hover:tw-bg-gray-50');
                row.innerHTML = `
                    <div class="tw-flex tw-items-center tw-gap-3">
                        <img src="${u.avatar_url || 'Images/profile.PNG'}" class="tw-w-9 tw-h-9 tw-rounded-full tw-object-cover" />
                        <div>
                            <p class="tw-text-sm tw-font-medium second-color">${u.name}</p>
                            <p class="tw-text-xs tw-text-gray-500">${u.email || u.login_id || ''}</p>
                        </div>
                    </div>
                    <span class="tw-text-xs ${roleColor} tw-font-medium">${role}</span>
                `;
                container.appendChild(row);
            });
        } catch (e) {
            console.error('[People]', e);
            container.innerHTML = '';
            container.appendChild(render.emptyState('Error loading people', e.message));
        }
    }

    // ═══════════════════════════════════════
    // Batch 5: Admin & Settings
    // ═══════════════════════════════════════

    async function initAccountSettings() {
        try {
            const { data: profile } = await api.users.profile();
            const nameEl = document.querySelector('.settings-name, input[name="name"]');
            if (nameEl) nameEl.value = profile.name || '';
            const emailEl = document.querySelector('.settings-email, input[name="email"]');
            if (emailEl) emailEl.value = profile.primary_email || '';
            const avatarEl = document.querySelector('.settings-avatar, .profile-avatar img');
            if (avatarEl && profile.avatar_url) avatarEl.src = profile.avatar_url;
            const bioEl = document.querySelector('textarea[name="bio"]');
            if (bioEl && profile.bio) bioEl.value = profile.bio;
        } catch (e) { console.error('[AccountSettings]', e); }
    }

    async function initCourseSettings() {
        const courseId = getCourseId();
        if (!courseId) return;
        try {
            const { data: course } = await api.courses.get(courseId);
            const nameEl = document.querySelector('input[name="course_name"]');
            if (nameEl) nameEl.value = course.name || '';
            const codeEl = document.querySelector('input[name="course_code"]');
            if (codeEl) codeEl.value = course.course_code || '';
        } catch (e) { console.error('[CourseSettings]', e); }
    }

    async function initPermissions() {
        try {
            const { data: accounts } = await api.admin.accounts();
            if (!accounts?.length) return;
            const accountId = accounts[0].id;
            const { data: roles } = await api.admin.roles(accountId);
            const container = document.querySelector('.permissions-container, .roles-list, #assign');
            if (!container || !roles) return;
            container.innerHTML = '';
            roles.forEach(r => {
                const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-3 tw-rounded-lg tw-border tw-border-gray-100 tw-mb-2');
                row.innerHTML = `
                    <div>
                        <p class="tw-text-sm tw-font-medium second-color">${r.label || r.role}</p>
                        <p class="tw-text-xs tw-text-gray-500">Base role: ${r.base_role_type || 'Custom'}</p>
                    </div>
                    <span class="tw-text-xs ${r.workflow_state === 'active' ? 'tw-text-accent-green' : 'tw-text-gray-400'}">${r.workflow_state}</span>
                `;
                container.appendChild(row);
            });
        } catch (e) { console.error('[Permissions]', e); }
    }

    async function initUserManagement() {
        try {
            const { data: accounts } = await api.admin.accounts();
            if (!accounts?.length) return;
            const accountId = accounts[0].id;
            const { data: users } = await api.admin.users(accountId, { per_page: 25 });
            const container = document.querySelector('.users-container, .user-list, #assign');
            if (!container || !users) return;
            container.innerHTML = '';
            users.forEach(u => {
                const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-3 tw-rounded-lg tw-border tw-border-gray-100 tw-mb-2 hover:tw-bg-gray-50');
                row.innerHTML = `
                    <div class="tw-flex tw-items-center tw-gap-3">
                        <img src="${u.avatar_url || 'Images/profile.PNG'}" class="tw-w-8 tw-h-8 tw-rounded-full tw-object-cover" />
                        <div>
                            <p class="tw-text-sm tw-font-medium second-color">${u.name}</p>
                            <p class="tw-text-xs tw-text-gray-500">${u.email || u.login_id || ''}</p>
                        </div>
                    </div>
                    <span class="tw-text-xs tw-text-gray-400">ID: ${u.id}</span>
                `;
                container.appendChild(row);
            });
        } catch (e) { console.error('[UserManagement]', e); }
    }

    async function initAdminDashboard() {
        try {
            const { data: accounts } = await api.admin.accounts();
            if (!accounts?.length) return;
            const accountId = accounts[0].id;
            const nameEl = document.querySelector('.account-name, h3.second-color');
            if (nameEl) nameEl.textContent = accounts[0].name || 'Account';
        } catch (e) { console.error('[AdminDashboard]', e); }
    }

    async function initSubAccounts() {
        try {
            const { data: accounts } = await api.admin.accounts();
            if (!accounts?.length) return;
            const { data: subs } = await api.admin.subAccounts(accounts[0].id);
            const container = document.querySelector('.sub-accounts-container, #assign');
            if (!container || !subs) return;
            container.innerHTML = '';
            if (subs.length === 0) {
                container.appendChild(render.emptyState('No sub-accounts', 'No sub-accounts configured.'));
                return;
            }
            subs.forEach(s => {
                const row = render.el('div', 'tw-p-3 tw-rounded-lg tw-border tw-border-gray-100 tw-mb-2');
                row.innerHTML = `<p class="tw-text-sm tw-font-medium second-color">${s.name}</p><p class="tw-text-xs tw-text-gray-500">ID: ${s.id}</p>`;
                container.appendChild(row);
            });
        } catch (e) { console.error('[SubAccounts]', e); }
    }

    // ═══════════════════════════════════════
    // Batch 6: Remaining Pages
    // ═══════════════════════════════════════

    async function initNotifications() {
        const container = document.querySelector('.notifications-container, .notif-list, #assign');
        if (!container) return;
        render.showLoading(container, 'row', 5);
        try {
            const { data: items } = await api.notifications.list();
            container.innerHTML = '';
            if (!items || items.length === 0) {
                container.appendChild(render.emptyState('No notifications', 'You are all caught up!'));
                return;
            }
            items.slice(0, 30).forEach(item => {
                const iconMap = { Announcement: 'fa-bullhorn tw-text-accent-orange', Submission: 'fa-file-alt tw-text-blue-500', Conversation: 'fa-envelope tw-text-primary-400', Message: 'fa-comment tw-text-accent-green' };
                const icon = iconMap[item.type] || 'fa-bell tw-text-gray-400';
                const row = render.el('div', 'tw-flex tw-items-start tw-gap-3 tw-p-3 tw-border-b tw-border-gray-100');
                row.innerHTML = `
                    <i class="fa ${icon} tw-mt-1"></i>
                    <div class="tw-flex-1">
                        <p class="tw-text-sm second-color">${item.title || item.type}</p>
                        <p class="tw-text-xs tw-text-gray-500">${render.relativeTime(item.created_at)}</p>
                    </div>
                `;
                container.appendChild(row);
            });
        } catch (e) {
            console.error('[Notifications]', e);
            container.innerHTML = '';
            container.appendChild(render.emptyState('Error loading notifications', e.message));
        }
    }

    async function initEPortfolio() {
        const container = document.querySelector('.portfolio-container, .portfolio-list, #assign');
        if (!container) return;
        render.showLoading(container, 'row', 3);
        try {
            const { data: portfolios } = await api.eportfolio.list();
            container.innerHTML = '';
            if (!portfolios || portfolios.length === 0) {
                container.appendChild(render.emptyState('No portfolios', 'Create your first portfolio to showcase your work.'));
                return;
            }
            portfolios.forEach(p => {
                const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-3 tw-rounded-lg tw-border tw-border-gray-100 tw-mb-2 hover:tw-bg-gray-50');
                row.innerHTML = `
                    <div class="tw-flex tw-items-center tw-gap-3">
                        <i class="fa fa-briefcase tw-text-primary-400"></i>
                        <div>
                            <p class="tw-text-sm tw-font-medium second-color">${p.name}</p>
                            <p class="tw-text-xs tw-text-gray-500">${p.public ? 'Public' : 'Private'} &bull; Updated ${render.relativeTime(p.updated_at)}</p>
                        </div>
                    </div>
                `;
                container.appendChild(row);
            });
        } catch (e) {
            console.error('[EPortfolio]', e);
            container.innerHTML = '';
            container.appendChild(render.emptyState('Error loading portfolios', e.message));
        }
    }

    async function initPlanner() {
        const container = document.querySelector('.planner-container, .planner-list, #assign');
        if (!container) return;
        render.showLoading(container, 'row', 6);
        try {
            const { data: items } = await api.planner.items({ per_page: 20 });
            container.innerHTML = '';
            if (!items || items.length === 0) {
                container.appendChild(render.emptyState('Nothing planned', 'Your planner is clear!'));
                return;
            }
            let lastDate = '';
            items.forEach(item => {
                const date = render.formatDate(item.plannable_date);
                if (date !== lastDate) {
                    lastDate = date;
                    container.appendChild(render.el('h5', 'tw-text-xs tw-font-semibold tw-text-gray-500 tw-mt-4 tw-mb-2 tw-uppercase', { text: date }));
                }
                const typeIcon = item.plannable_type === 'assignment' ? 'fa-file-alt tw-text-blue-500' :
                                 item.plannable_type === 'quiz' ? 'fa-question-circle tw-text-purple-500' :
                                 item.plannable_type === 'discussion_topic' ? 'fa-comments tw-text-accent-green' :
                                 'fa-calendar tw-text-gray-400';
                const row = render.el('div', 'tw-flex tw-items-center tw-gap-3 tw-p-2 tw-rounded-lg hover:tw-bg-gray-50');
                row.innerHTML = `
                    <i class="fa ${typeIcon}"></i>
                    <div class="tw-flex-1">
                        <p class="tw-text-sm second-color">${item.plannable?.title || 'Untitled'}</p>
                        <p class="tw-text-xs tw-text-gray-500">${item.context_name || ''}</p>
                    </div>
                    <span class="tw-text-xs tw-text-gray-400">${item.plannable?.points_possible ? item.plannable.points_possible + ' pts' : ''}</span>
                `;
                container.appendChild(row);
            });
        } catch (e) {
            console.error('[Planner]', e);
            container.innerHTML = '';
            container.appendChild(render.emptyState('Error loading planner', e.message));
        }
    }

    async function initSearchResults() {
        const query = getParam('q');
        if (!query) return;
        const container = document.querySelector('.search-results-container, .results-list, #assign');
        if (!container) return;
        render.showLoading(container, 'row', 5);
        try {
            const { data: courses } = await api.search.allCourses({ search_term: query });
            const { data: recipients } = await api.search.recipients({ search: query, per_page: 10 });
            container.innerHTML = '';
            if (courses?.length) {
                container.appendChild(render.el('h5', 'tw-text-sm tw-font-semibold tw-text-gray-600 tw-mb-2', { text: `Courses (${courses.length})` }));
                courses.forEach(c => {
                    const row = render.el('div', 'tw-flex tw-items-center tw-gap-3 tw-p-2 tw-rounded-lg hover:tw-bg-gray-50');
                    row.innerHTML = `<i class="fa fa-book tw-text-primary-400"></i><a href="class.html?course_id=${c.id}" class="tw-text-sm second-color tw-no-underline hover:tw-text-accent-green">${c.name}</a>`;
                    container.appendChild(row);
                });
            }
            if (recipients?.length) {
                container.appendChild(render.el('h5', 'tw-text-sm tw-font-semibold tw-text-gray-600 tw-mt-4 tw-mb-2', { text: `People (${recipients.length})` }));
                recipients.forEach(r => {
                    const row = render.el('div', 'tw-flex tw-items-center tw-gap-3 tw-p-2 tw-rounded-lg hover:tw-bg-gray-50');
                    row.innerHTML = `<img src="${r.avatar_url || 'Images/profile.PNG'}" class="tw-w-7 tw-h-7 tw-rounded-full" /><p class="tw-text-sm second-color">${r.name}</p>`;
                    container.appendChild(row);
                });
            }
            if (!courses?.length && !recipients?.length) {
                container.appendChild(render.emptyState('No results', `No results found for "${query}".`));
            }
        } catch (e) {
            console.error('[Search]', e);
            container.innerHTML = '';
            container.appendChild(render.emptyState('Search error', e.message));
        }
    }

    async function initAnalytics() {
        const courseId = getCourseId();
        if (!courseId) return;
        try {
            const { data: course } = await api.courses.get(courseId);
            const titleEl = document.querySelector('.analytics-title, h4.second-color');
            if (titleEl) titleEl.textContent = `Analytics: ${course.name}`;
        } catch (e) { console.error('[Analytics]', e); }
    }

    async function initGradebookHistory() {
        const courseId = getCourseId();
        if (!courseId) return;
        const container = document.querySelector('.history-container, #assign');
        if (!container) return;
        try {
            const { data: groups } = await api.grades.assignmentGroupsWithGrades(courseId);
            const assignments = (groups || []).flatMap(g => g.assignments || []);
            container.innerHTML = '';
            if (assignments.length === 0) {
                container.appendChild(render.emptyState('No history', 'No grade changes recorded.'));
                return;
            }
            assignments.slice(0, 20).forEach(a => {
                const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-2 tw-border-b tw-border-gray-100');
                row.innerHTML = `
                    <p class="tw-text-sm second-color">${a.name}</p>
                    <span class="tw-text-xs tw-text-gray-400">${a.points_possible || 0} pts</span>
                `;
                container.appendChild(row);
            });
        } catch (e) { console.error('[GradebookHistory]', e); }
    }

    async function initContentMigrations() {
        const courseId = getCourseId();
        if (!courseId) return;
        const container = document.querySelector('.migrations-container, #assign');
        if (!container) return;
        try {
            const { data: migrations } = await api.contentMigrations.list(courseId);
            container.innerHTML = '';
            if (!migrations || migrations.length === 0) {
                container.appendChild(render.emptyState('No migrations', 'No content imports yet.'));
                return;
            }
            migrations.forEach(m => {
                const statusColor = m.workflow_state === 'completed' ? 'tw-text-accent-green' : m.workflow_state === 'failed' ? 'tw-text-red-500' : 'tw-text-accent-orange';
                const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-3 tw-border-b tw-border-gray-100');
                row.innerHTML = `
                    <div>
                        <p class="tw-text-sm second-color">${m.migration_type_title || m.migration_type}</p>
                        <p class="tw-text-xs tw-text-gray-500">Created ${render.relativeTime(m.created_at)}</p>
                    </div>
                    <span class="tw-text-xs ${statusColor}">${m.workflow_state}</span>
                `;
                container.appendChild(row);
            });
        } catch (e) { console.error('[ContentMigrations]', e); }
    }

    async function initSisImport() {
        try {
            const { data: accounts } = await api.admin.accounts();
            if (!accounts?.length) return;
            const { data: imports } = await api.admin.sisImports(accounts[0].id);
            const container = document.querySelector('.sis-container, #assign');
            if (!container) return;
            const sisImports = imports?.sis_imports || imports || [];
            container.innerHTML = '';
            if (sisImports.length === 0) {
                container.appendChild(render.emptyState('No SIS imports', 'No SIS data imports found.'));
                return;
            }
            sisImports.slice(0, 15).forEach(i => {
                const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-3 tw-border-b tw-border-gray-100');
                row.innerHTML = `
                    <div>
                        <p class="tw-text-sm second-color">Import #${i.id}</p>
                        <p class="tw-text-xs tw-text-gray-500">${render.relativeTime(i.created_at)}</p>
                    </div>
                    <span class="tw-text-xs ${i.workflow_state === 'imported' ? 'tw-text-accent-green' : 'tw-text-accent-orange'}">${i.workflow_state}</span>
                `;
                container.appendChild(row);
            });
        } catch (e) { console.error('[SisImport]', e); }
    }

    async function initReports() {
        try {
            const { data: accounts } = await api.admin.accounts();
            if (!accounts?.length) return;
            const { data: reports } = await api.admin.reports(accounts[0].id);
            const container = document.querySelector('.reports-container, #assign');
            if (!container || !reports) return;
            container.innerHTML = '';
            reports.forEach(r => {
                const row = render.el('div', 'tw-p-3 tw-rounded-lg tw-border tw-border-gray-100 tw-mb-2');
                row.innerHTML = `
                    <p class="tw-text-sm tw-font-medium second-color">${r.title || r.report}</p>
                    <p class="tw-text-xs tw-text-gray-500">${r.parameters?.length || 0} parameters</p>
                `;
                container.appendChild(row);
            });
        } catch (e) { console.error('[Reports]', e); }
    }

    async function initDeveloperKeys() {
        try {
            const { data: accounts } = await api.admin.accounts();
            if (!accounts?.length) return;
            const { data: keys } = await api.admin.developerKeys(accounts[0].id);
            const container = document.querySelector('.devkeys-container, #assign');
            if (!container || !keys) return;
            container.innerHTML = '';
            if (keys.length === 0) {
                container.appendChild(render.emptyState('No developer keys', 'No API keys configured.'));
                return;
            }
            keys.forEach(k => {
                const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-3 tw-border-b tw-border-gray-100');
                row.innerHTML = `
                    <div>
                        <p class="tw-text-sm tw-font-medium second-color">${k.name || 'Unnamed Key'}</p>
                        <p class="tw-text-xs tw-text-gray-500">ID: ${k.id} &bull; ${k.workflow_state}</p>
                    </div>
                `;
                container.appendChild(row);
            });
        } catch (e) { console.error('[DeveloperKeys]', e); }
    }

    // ═══════════════════════════════════════
    // Batch 7-8: Extended Page Initializers
    // ═══════════════════════════════════════

    // --- Account & Admin extended ---
    async function initAccountAdminTools() {
        try {
            const { data: accounts } = await api.admin.accounts();
            const el = document.querySelector('.admin-tools-title, h3.second-color');
            if (el && accounts?.[0]) el.textContent = `Admin Tools: ${accounts[0].name}`;
        } catch (e) { console.error('[AccountAdminTools]', e); }
    }

    async function initAccountCalendarSettings() {
        try {
            const { data: profile } = await api.users.profile();
            const el = document.querySelector('.settings-user, .user-name');
            if (el) el.textContent = profile.name;
        } catch (e) { console.error('[AccountCalendarSettings]', e); }
    }

    async function initAccountSearch() {
        const query = getParam('q');
        if (!query) return;
        try {
            const { data: accounts } = await api.admin.accounts();
            if (!accounts?.length) return;
            const { data: users } = await api.admin.users(accounts[0].id, { search_term: query });
            const container = document.querySelector('.search-results, #assign');
            if (!container) return;
            container.innerHTML = '';
            (users || []).forEach(u => {
                const row = render.el('div', 'tw-flex tw-items-center tw-gap-3 tw-p-3 tw-border-b tw-border-gray-100');
                row.innerHTML = `<img src="${u.avatar_url || 'Images/profile.PNG'}" class="tw-w-8 tw-h-8 tw-rounded-full" /><div><p class="tw-text-sm second-color">${u.name}</p><p class="tw-text-xs tw-text-gray-500">${u.email || ''}</p></div>`;
                container.appendChild(row);
            });
        } catch (e) { console.error('[AccountSearch]', e); }
    }

    async function initAccountStatistics() {
        try {
            const { data: accounts } = await api.admin.accounts();
            if (!accounts?.length) return;
            const el = document.querySelector('.stats-title, h3.second-color');
            if (el) el.textContent = `Statistics: ${accounts[0].name}`;
        } catch (e) { console.error('[AccountStatistics]', e); }
    }

    async function initAccountReports() {
        try {
            const { data: accounts } = await api.admin.accounts();
            if (!accounts?.length) return;
            const { data: reports } = await api.admin.reports(accounts[0].id);
            const container = document.querySelector('.reports-container, #assign');
            if (!container || !reports) return;
            container.innerHTML = '';
            reports.forEach(r => {
                const row = render.el('div', 'tw-p-3 tw-border-b tw-border-gray-100');
                row.innerHTML = `<p class="tw-text-sm tw-font-medium second-color">${r.title || r.report}</p>`;
                container.appendChild(row);
            });
        } catch (e) { console.error('[AccountReports]', e); }
    }

    async function initAuthProviders() {
        try {
            const { data: accounts } = await api.admin.accounts();
            const el = document.querySelector('.auth-title, h3.second-color');
            if (el && accounts?.[0]) el.textContent = `Authentication: ${accounts[0].name}`;
        } catch (e) { console.error('[AuthProviders]', e); }
    }

    async function initBrandConfigs() {
        try {
            const { data: accounts } = await api.admin.accounts();
            const el = document.querySelector('.brand-title, h3.second-color');
            if (el && accounts?.[0]) el.textContent = `Theme: ${accounts[0].name}`;
        } catch (e) { console.error('[BrandConfigs]', e); }
    }

    async function initTermsIndex() {
        try {
            const { data: accounts } = await api.admin.accounts();
            if (!accounts?.length) return;
            const { data: terms } = await api.admin.terms(accounts[0].id);
            const container = document.querySelector('.terms-container, #assign');
            if (!container) return;
            container.innerHTML = '';
            const termsList = terms?.enrollment_terms || terms || [];
            termsList.forEach(t => {
                const row = render.el('div', 'tw-p-3 tw-border-b tw-border-gray-100');
                row.innerHTML = `<p class="tw-text-sm tw-font-medium second-color">${t.name}</p><p class="tw-text-xs tw-text-gray-500">${t.start_at ? render.formatDate(t.start_at) : 'No start'} — ${t.end_at ? render.formatDate(t.end_at) : 'No end'}</p>`;
                container.appendChild(row);
            });
        } catch (e) { console.error('[TermsIndex]', e); }
    }

    // --- Assignment extended ---
    async function initAssignmentEdit() {
        const courseId = getCourseId();
        const assignmentId = getParam('assignment_id');
        if (!courseId || !assignmentId) return;
        try {
            const { data: a } = await api.assignments.get(courseId, assignmentId);
            const nameEl = document.querySelector('input[name="name"]');
            if (nameEl) nameEl.value = a.name || '';
            const descEl = document.querySelector('.assignment-desc, textarea[name="description"]');
            if (descEl) descEl.value = a.description || '';
            const pointsEl = document.querySelector('input[name="points"]');
            if (pointsEl) pointsEl.value = a.points_possible || '';
        } catch (e) { console.error('[AssignmentEdit]', e); }
    }

    async function initPeerReview() {
        const courseId = getCourseId();
        const assignmentId = getParam('assignment_id');
        if (!courseId || !assignmentId) return;
        try {
            const { data: reviews } = await api.assignments.peerReviews(courseId, assignmentId);
            const container = document.querySelector('.reviews-container, #assign');
            if (!container) return;
            container.innerHTML = '';
            if (!reviews?.length) { container.appendChild(render.emptyState('No peer reviews', 'No reviews assigned.')); return; }
            reviews.forEach(r => {
                const row = render.el('div', 'tw-p-3 tw-border-b tw-border-gray-100');
                row.innerHTML = `<p class="tw-text-sm second-color">Reviewer: ${r.user_id} → Assessor: ${r.assessor_id}</p><p class="tw-text-xs tw-text-gray-500">${r.workflow_state}</p>`;
                container.appendChild(row);
            });
        } catch (e) { console.error('[PeerReview]', e); }
    }

    // --- Quiz extended ---
    async function initQuizShow() {
        const courseId = getCourseId();
        const quizId = getParam('quiz_id');
        if (!courseId || !quizId) return;
        try {
            const { data: quiz } = await api.quizzes.get(courseId, quizId);
            const titleEl = document.querySelector('.quiz-title, h3.second-color, h4.second-color');
            if (titleEl) titleEl.textContent = quiz.title;
            const descEl = document.querySelector('.quiz-description');
            if (descEl) descEl.innerHTML = quiz.description || '';
        } catch (e) { console.error('[QuizShow]', e); }
    }

    async function initQuizStatistics() {
        const courseId = getCourseId();
        const quizId = getParam('quiz_id');
        if (!courseId || !quizId) return;
        try {
            const { data: quiz } = await api.quizzes.get(courseId, quizId);
            const titleEl = document.querySelector('.stats-title, h3.second-color');
            if (titleEl) titleEl.textContent = `Statistics: ${quiz.title}`;
        } catch (e) { console.error('[QuizStatistics]', e); }
    }

    async function initQuestionBanks() {
        const courseId = getCourseId();
        if (!courseId) return;
        const container = document.querySelector('.qbanks-container, #assign');
        if (!container) return;
        container.appendChild(render.el('p', 'tw-text-sm tw-text-gray-500 tw-p-4', { text: 'Question banks are managed through the course quiz editor.' }));
    }

    // --- Course extended ---
    async function initCourseStatistics() {
        const courseId = getCourseId();
        if (!courseId) return;
        try {
            const { data: course } = await api.courses.get(courseId);
            const el = document.querySelector('.stats-title, h3.second-color');
            if (el) el.textContent = `Statistics: ${course.name}`;
        } catch (e) { console.error('[CourseStatistics]', e); }
    }

    async function initCoursePaces() {
        const courseId = getCourseId();
        if (!courseId) return;
        try {
            const { data: course } = await api.courses.get(courseId);
            const el = document.querySelector('.paces-title, h3.second-color');
            if (el) el.textContent = `Course Pacing: ${course.name}`;
        } catch (e) { console.error('[CoursePaces]', e); }
    }

    async function initAllCourses() {
        const container = document.querySelector('.all-courses-container, .course-list, #assign');
        if (!container) return;
        render.showLoading(container, 'card', 6);
        try {
            const { data: courses } = await api.search.allCourses({ per_page: 50 });
            if (courses) render.courseCardList(courses, container);
        } catch (e) {
            console.error('[AllCourses]', e);
            container.innerHTML = '';
            container.appendChild(render.emptyState('Error loading courses', e.message));
        }
    }

    async function initCopyStatus() {
        const courseId = getCourseId();
        if (!courseId) return;
        try {
            const { data: migrations } = await api.contentMigrations.list(courseId);
            const container = document.querySelector('.migration-status, #assign');
            if (!container) return;
            container.innerHTML = '';
            (migrations || []).forEach(m => {
                const row = render.el('div', 'tw-p-3 tw-border-b tw-border-gray-100');
                row.innerHTML = `<p class="tw-text-sm second-color">${m.migration_type_title || m.migration_type}</p><p class="tw-text-xs ${m.workflow_state === 'completed' ? 'tw-text-accent-green' : 'tw-text-accent-orange'}">${m.workflow_state} ${m.progress_url ? `(${m.completion || 0}%)` : ''}</p>`;
                container.appendChild(row);
            });
        } catch (e) { console.error('[CopyStatus]', e); }
    }

    async function initBlueprintCourses() {
        const courseId = getCourseId();
        if (!courseId) return;
        try {
            const { data: course } = await api.courses.get(courseId);
            const el = document.querySelector('.blueprint-title, h3.second-color');
            if (el) el.textContent = `Blueprint: ${course.name}`;
        } catch (e) { console.error('[Blueprint]', e); }
    }

    async function initContentExports() {
        const courseId = getCourseId();
        if (!courseId) return;
        const container = document.querySelector('.exports-container, #assign');
        if (!container) return;
        container.appendChild(render.el('p', 'tw-text-sm tw-text-gray-500 tw-p-4', { text: 'Content exports allow you to download course content as a ZIP file.' }));
    }

    async function initContentSharing() {
        const courseId = getCourseId();
        if (!courseId) return;
        const container = document.querySelector('.sharing-container, #assign');
        if (!container) return;
        container.appendChild(render.el('p', 'tw-text-sm tw-text-gray-500 tw-p-4', { text: 'Share course content with other instructors and courses.' }));
    }

    // --- Discussion extended ---
    async function initDiscussionEdit() {
        const courseId = getCourseId();
        const topicId = getParam('topic_id');
        if (!courseId || !topicId) return;
        try {
            const { data: topic } = await api.discussions.get(courseId, topicId);
            const titleEl = document.querySelector('input[name="title"]');
            if (titleEl) titleEl.value = topic.title || '';
            const bodyEl = document.querySelector('textarea[name="message"]');
            if (bodyEl) bodyEl.value = topic.message || '';
        } catch (e) { console.error('[DiscussionEdit]', e); }
    }

    // --- File extended ---
    async function initFilePreview() {
        const fileId = getParam('file_id');
        if (!fileId) return;
        try {
            const { data: file } = await api.files.get(fileId);
            const titleEl = document.querySelector('.file-title, h4.second-color');
            if (titleEl) titleEl.textContent = file.display_name;
            const previewEl = document.querySelector('.file-preview, .preview-area');
            if (previewEl && file.preview_url) {
                previewEl.innerHTML = `<iframe src="${file.preview_url}" class="tw-w-full tw-h-96 tw-border-0"></iframe>`;
            }
        } catch (e) { console.error('[FilePreview]', e); }
    }

    async function initFileDetails() {
        const fileId = getParam('file_id');
        if (!fileId) return;
        try {
            const { data: file } = await api.files.get(fileId);
            const titleEl = document.querySelector('.file-title, h4.second-color');
            if (titleEl) titleEl.textContent = file.display_name;
            const sizeEl = document.querySelector('.file-size');
            if (sizeEl) sizeEl.textContent = file.size > 1048576 ? `${(file.size / 1048576).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`;
        } catch (e) { console.error('[FileDetails]', e); }
    }

    // --- ePortfolio extended ---
    async function initEPortfolioModeration() {
        try {
            const { data: portfolios } = await api.eportfolio.list();
            const container = document.querySelector('.moderation-container, #assign');
            if (!container) return;
            container.innerHTML = '';
            (portfolios || []).forEach(p => {
                const row = render.el('div', 'tw-p-3 tw-border-b tw-border-gray-100');
                row.innerHTML = `<p class="tw-text-sm second-color">${p.name}</p><p class="tw-text-xs tw-text-gray-500">${p.public ? 'Public' : 'Private'}</p>`;
                container.appendChild(row);
            });
        } catch (e) { console.error('[EPortfolioModeration]', e); }
    }

    // --- Grades extended ---
    async function initUserGrades() {
        try {
            const { data: courses } = await api.courses.list();
            const container = document.querySelector('.user-grades-container, #assign');
            if (!container) return;
            container.innerHTML = '';
            for (const course of (courses || []).slice(0, 10)) {
                try {
                    const { data: enrollments } = await api.grades.enrollments(course.id);
                    const enrollment = enrollments?.find(e => e.type === 'StudentEnrollment');
                    const grade = enrollment?.grades?.current_score;
                    const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-3 tw-border-b tw-border-gray-100');
                    row.innerHTML = `<p class="tw-text-sm second-color">${course.name}</p><span class="tw-text-sm tw-font-bold ${grade >= 70 ? 'tw-text-accent-green' : 'tw-text-accent-orange'}">${grade !== null && grade !== undefined ? grade + '%' : '—'}</span>`;
                    container.appendChild(row);
                } catch (_) { /* skip courses where grades aren't accessible */ }
            }
        } catch (e) { console.error('[UserGrades]', e); }
    }

    async function initGradebookUploads() {
        const courseId = getCourseId();
        if (!courseId) return;
        try {
            const { data: course } = await api.courses.get(courseId);
            const el = document.querySelector('.upload-title, h3.second-color');
            if (el) el.textContent = `Upload Grades: ${course.name}`;
        } catch (e) { console.error('[GradebookUploads]', e); }
    }

    // --- User extended ---
    async function initProfileShow() {
        try {
            const { data: profile } = await api.users.profile();
            const nameEl = document.querySelector('.profile-name, h3.second-color');
            if (nameEl) nameEl.textContent = profile.name;
            const imgEl = document.querySelector('.profile-img img');
            if (imgEl && profile.avatar_url) imgEl.src = profile.avatar_url;
        } catch (e) { console.error('[ProfileShow]', e); }
    }

    async function initUserSettings() {
        try {
            const { data: profile } = await api.users.profile();
            const nameEl = document.querySelector('input[name="name"]');
            if (nameEl) nameEl.value = profile.name || '';
            const emailEl = document.querySelector('input[name="email"]');
            if (emailEl) emailEl.value = profile.primary_email || '';
        } catch (e) { console.error('[UserSettings]', e); }
    }

    async function initUserLogins() {
        try {
            const { data: profile } = await api.users.profile();
            const el = document.querySelector('.logins-user, h3.second-color');
            if (el) el.textContent = `Login History: ${profile.name}`;
        } catch (e) { console.error('[UserLogins]', e); }
    }

    async function initUserObservees() {
        try {
            const { data: profile } = await api.users.profile();
            const el = document.querySelector('.observees-title, h3.second-color');
            if (el) el.textContent = `Observing: ${profile.name}`;
        } catch (e) { console.error('[UserObservees]', e); }
    }

    async function initUserOutcomeResults() {
        try {
            const { data: profile } = await api.users.profile();
            const el = document.querySelector('.outcomes-title, h3.second-color');
            if (el) el.textContent = `Outcomes: ${profile.name}`;
        } catch (e) { console.error('[UserOutcomeResults]', e); }
    }

    // --- Calendar extended ---
    async function initEditCalendarEvent() {
        const eventId = getParam('event_id');
        if (!eventId) return;
        try {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
            const { data: events } = await api.calendar.events(start, end);
            const event = (events || []).find(e => e.id == eventId);
            if (event) {
                const titleEl = document.querySelector('input[name="title"]');
                if (titleEl) titleEl.value = event.title || '';
            }
        } catch (e) { console.error('[EditCalendarEvent]', e); }
    }

    // --- Conversation extended ---
    async function initConversationCompose() {
        try {
            const { data: recipients } = await api.search.recipients({ per_page: 20 });
            const container = document.querySelector('.recipients-list, .compose-recipients');
            if (!container || !recipients) return;
            container.innerHTML = '';
            recipients.forEach(r => {
                const opt = render.el('div', 'tw-flex tw-items-center tw-gap-2 tw-p-2 tw-cursor-pointer hover:tw-bg-gray-50');
                opt.innerHTML = `<img src="${r.avatar_url || 'Images/profile.PNG'}" class="tw-w-6 tw-h-6 tw-rounded-full" /><span class="tw-text-sm">${r.name}</span>`;
                container.appendChild(opt);
            });
        } catch (e) { console.error('[ConversationCompose]', e); }
    }

    // --- Manage groups ---
    async function initManageGroups() {
        const courseId = getCourseId();
        if (!courseId) return;
        try {
            const { data: categories } = await api.groups.categories(courseId);
            const container = document.querySelector('.group-categories, #assign');
            if (!container) return;
            container.innerHTML = '';
            (categories || []).forEach(cat => {
                const row = render.el('div', 'tw-p-3 tw-border-b tw-border-gray-100');
                row.innerHTML = `<p class="tw-text-sm tw-font-medium second-color">${cat.name}</p><p class="tw-text-xs tw-text-gray-500">${cat.group_limit || 'No limit'} per group &bull; ${cat.groups_count || 0} groups</p>`;
                container.appendChild(row);
            });
        } catch (e) { console.error('[ManageGroups]', e); }
    }

    // --- Wiki extended ---
    async function initWikiPageEdit() {
        const courseId = getCourseId();
        const pageUrl = getParam('page_url');
        if (!courseId || !pageUrl) return;
        try {
            const { data: page } = await api.pages.get(courseId, pageUrl);
            const titleEl = document.querySelector('input[name="title"]');
            if (titleEl) titleEl.value = page.title || '';
            const bodyEl = document.querySelector('textarea[name="body"]');
            if (bodyEl) bodyEl.value = page.body || '';
        } catch (e) { console.error('[WikiPageEdit]', e); }
    }

    async function initWikiPageRevisions() {
        const courseId = getCourseId();
        const pageUrl = getParam('page_url');
        if (!courseId || !pageUrl) return;
        try {
            const { data: revisions } = await api.pages.revisions(courseId, pageUrl);
            const container = document.querySelector('.revisions-container, #assign');
            if (!container) return;
            container.innerHTML = '';
            (revisions || []).forEach(r => {
                const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-3 tw-border-b tw-border-gray-100');
                row.innerHTML = `<div><p class="tw-text-sm second-color">Revision ${r.revision_id}</p><p class="tw-text-xs tw-text-gray-500">${render.relativeTime(r.updated_at)}</p></div>`;
                container.appendChild(row);
            });
        } catch (e) { console.error('[WikiPageRevisions]', e); }
    }

    // --- K5 (Elementary) ---
    async function initK5Dashboard() {
        // K5 dashboard is an elementary-themed version of the regular dashboard
        await initDashboard();
    }

    async function initK5Course() {
        await initCourseHome();
    }

    // --- Outcome extended ---
    async function initOutcomeManagement() {
        const courseId = getCourseId();
        if (!courseId) return;
        try {
            const { data: groups } = await api.outcomes.groups(courseId);
            const container = document.querySelector('.outcome-mgmt-container, #assign');
            if (!container) return;
            container.innerHTML = '';
            (groups || []).forEach(g => {
                const row = render.el('div', 'tw-p-3 tw-border-b tw-border-gray-100');
                row.innerHTML = `<p class="tw-text-sm tw-font-medium second-color"><i class="fa fa-bullseye tw-text-accent-green tw-mr-2"></i>${g.title}</p>`;
                container.appendChild(row);
            });
        } catch (e) { console.error('[OutcomeManagement]', e); }
    }

    // --- Rubric extended ---
    async function initRubricDetail() {
        const courseId = getCourseId();
        const rubricId = getParam('rubric_id');
        if (!courseId || !rubricId) return;
        try {
            const { data: rubric } = await api.rubrics.get(courseId, rubricId);
            const titleEl = document.querySelector('.rubric-title, h3.second-color');
            if (titleEl) titleEl.textContent = rubric.title;
            const container = document.querySelector('.criteria-container, #assign');
            if (!container) return;
            container.innerHTML = '';
            (rubric.data || []).forEach(c => {
                const row = render.el('div', 'tw-p-3 tw-border-b tw-border-gray-100');
                row.innerHTML = `<p class="tw-text-sm tw-font-medium second-color">${c.description}</p><p class="tw-text-xs tw-text-gray-500">${c.points} points &bull; ${(c.ratings || []).length} ratings</p>`;
                container.appendChild(row);
            });
        } catch (e) { console.error('[RubricDetail]', e); }
    }

    // --- Section management ---
    async function initSectionManagement() {
        const courseId = getCourseId();
        if (!courseId) return;
        try {
            const { data: course } = await api.courses.get(courseId);
            const el = document.querySelector('.sections-title, h3.second-color');
            if (el) el.textContent = `Sections: ${course.name}`;
        } catch (e) { console.error('[SectionManagement]', e); }
    }

    // --- Learning path ---
    async function initLearningPath() {
        const courseId = getCourseId();
        if (!courseId) return;
        try {
            const { data: modules } = await api.modules.list(courseId);
            const container = document.querySelector('.learning-path-container, #assign');
            if (!container) return;
            render.moduleList(modules || [], container);
        } catch (e) { console.error('[LearningPath]', e); }
    }

    // --- Media gallery ---
    async function initMediaGallery() {
        const courseId = getCourseId();
        if (!courseId) return;
        const container = document.querySelector('.media-container, #assign');
        if (!container) return;
        container.appendChild(render.el('p', 'tw-text-sm tw-text-gray-500 tw-p-4', { text: 'Media gallery displays course videos, images, and audio files.' }));
    }

    // --- Smart search ---
    async function initSmartSearch() {
        const query = getParam('q');
        if (!query) { await initSearchResults(); return; }
        await initSearchResults();
    }

    // --- Student context ---
    async function initStudentContext() {
        const courseId = getCourseId();
        const studentId = getParam('student_id');
        if (!courseId || !studentId) return;
        try {
            const { data: user } = await api.people.get(courseId, studentId);
            const nameEl = document.querySelector('.student-name, h3.second-color');
            if (nameEl) nameEl.textContent = user.name;
            const imgEl = document.querySelector('.student-avatar img');
            if (imgEl && user.avatar_url) imgEl.src = user.avatar_url;
        } catch (e) { console.error('[StudentContext]', e); }
    }

    // --- Teacher activity ---
    async function initTeacherActivityReport() {
        const courseId = getCourseId();
        if (!courseId) return;
        try {
            const { data: course } = await api.courses.get(courseId);
            const el = document.querySelector('.report-title, h3.second-color');
            if (el) el.textContent = `Teacher Activity: ${course.name}`;
        } catch (e) { console.error('[TeacherActivityReport]', e); }
    }

    // --- Jobs dashboard (admin) ---
    async function initJobsDashboard() {
        try {
            const { data: accounts } = await api.admin.accounts();
            const el = document.querySelector('.jobs-title, h3.second-color');
            if (el && accounts?.[0]) el.textContent = `Jobs: ${accounts[0].name}`;
        } catch (e) { console.error('[JobsDashboard]', e); }
    }

    // --- Change password ---
    async function initChangePassword() {
        try {
            const { data: profile } = await api.users.profile();
            const el = document.querySelector('.password-user, .user-email');
            if (el) el.textContent = profile.primary_email || profile.name;
        } catch (e) { console.error('[ChangePassword]', e); }
    }

    // --- Accessibility ---
    async function initAccessibility() {
        // Static page, no API needed — just ensure sidebar loads
    }

    // --- Prior users ---
    async function initPriorUsers() {
        const courseId = getCourseId();
        if (!courseId) return;
        try {
            const { data: course } = await api.courses.get(courseId);
            const el = document.querySelector('.prior-title, h3.second-color');
            if (el) el.textContent = `Prior Enrollments: ${course.name}`;
        } catch (e) { console.error('[PriorUsers]', e); }
    }

    // --- Analytics hub ---
    async function initAnalyticsHub() {
        try {
            const { data: courses } = await api.courses.list();
            const container = document.querySelector('.analytics-courses, #assign');
            if (!container) return;
            container.innerHTML = '';
            (courses || []).forEach(c => {
                const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-3 tw-border-b tw-border-gray-100 tw-cursor-pointer hover:tw-bg-gray-50');
                row.innerHTML = `<p class="tw-text-sm second-color">${c.name}</p><a href="analytics.html?course_id=${c.id}" class="tw-text-xs tw-text-accent-green">View</a>`;
                container.appendChild(row);
            });
        } catch (e) { console.error('[AnalyticsHub]', e); }
    }

    // --- Notification settings ---
    async function initNotificationSettings() {
        try {
            const { data: channels } = await api.notifications.communicationChannels();
            const container = document.querySelector('.channels-container, #assign');
            if (!container) return;
            container.innerHTML = '';
            (channels || []).forEach(ch => {
                const row = render.el('div', 'tw-flex tw-items-center tw-justify-between tw-p-3 tw-border-b tw-border-gray-100');
                row.innerHTML = `<div><p class="tw-text-sm second-color">${ch.address}</p><p class="tw-text-xs tw-text-gray-500">${ch.type} &bull; ${ch.workflow_state}</p></div>`;
                container.appendChild(row);
            });
        } catch (e) { console.error('[NotificationSettings]', e); }
    }

    // --- Page views (user activity) ---
    async function initPageViews() {
        try {
            const { data: stream } = await api.people.activityStream();
            const container = document.querySelector('.pageviews-container, #assign');
            if (!container) return;
            container.innerHTML = '';
            (stream || []).slice(0, 20).forEach(item => {
                const row = render.el('div', 'tw-p-2 tw-border-b tw-border-gray-100');
                row.innerHTML = `<p class="tw-text-sm second-color">${item.title || item.type}</p><p class="tw-text-xs tw-text-gray-500">${render.relativeTime(item.created_at)}</p>`;
                container.appendChild(row);
            });
        } catch (e) { console.error('[PageViews]', e); }
    }

    // ═══════════════════════════════════════
    // Page Router (COMPLETE — 174 pages)
    // ═══════════════════════════════════════

    const pageInitializers = {
        // ── Core ──
        'dashboard.html': initDashboard,
        'courses.html': initCourses,
        'inbox.html': initInbox,
        'profile.html': initProfile,
        'calendar.html': initCalendar,

        // ── Course Content ──
        'class.html': initCourseHome,
        'course-home.html': initCourseHome,
        'classroom.html': initModules,
        'assignments.html': initAssignments,
        'assignment-detail.html': initAssignmentDetail,
        'assignment-edit.html': initAssignmentEdit,
        'assignment-group-weights.html': initAssignments,
        'assignment-peer-reviews.html': initPeerReview,
        'assignment-rubric-assessment.html': initAssignmentDetail,
        'submission.html': initSubmission,
        'submission-detail.html': initSubmission,
        'submission-comments.html': initSubmission,
        'submit-assignment.html': initAssignmentDetail,
        'modules.html': initModules,
        'pages.html': initPages,
        'page-view.html': initPageView,
        'wiki-page-edit.html': initWikiPageEdit,
        'wiki-page-revisions.html': initWikiPageRevisions,
        'files.html': initFiles,
        'file-preview.html': initFilePreview,
        'file-details.html': initFileDetails,
        'file-show.html': initFileDetails,
        'syllabus.html': initSyllabus,
        'announcement.html': initAnnouncements,
        'announcements-list.html': initAnnouncements,
        'media-gallery.html': initMediaGallery,
        'learning-path.html': initLearningPath,

        // ── Assessment & Grading ──
        'quizzes.html': initQuizzes,
        'quiz-take.html': initQuizTake,
        'quiz-results.html': initQuizResults,
        'quiz-show.html': initQuizShow,
        'quiz-statistics.html': initQuizStatistics,
        'quiz-history.html': initQuizShow,
        'quiz-log-auditing.html': initQuizStatistics,
        'quiz-submission.html': initQuizResults,
        'quizzes-access-code.html': initQuizTake,
        'moderate-quiz.html': initQuizShow,
        'question-banks.html': initQuestionBanks,
        'grades.html': initGrades,
        'gradebook.html': initGradebook,
        'gradebook-history.html': initGradebookHistory,
        'gradebook-uploads.html': initGradebookUploads,
        'enhanced-gradebook.html': initGradebook,
        'speed-grader.html': initSpeedGrader,
        'rubrics.html': initRubrics,
        'rubric-detail.html': initRubricDetail,
        'edit-rubric.html': initRubricDetail,
        'outcomes.html': initOutcomes,
        'outcome-management.html': initOutcomeManagement,
        'outcome-alignments.html': initOutcomes,
        'outcome-alignment-v2.html': initOutcomes,
        'user-outcome-results.html': initUserOutcomeResults,
        'grade-passback.html': initGrades,
        'peer-review.html': initPeerReview,
        'user-grades.html': initUserGrades,

        // ── Communication & Social ──
        'discussions.html': initDiscussions,
        'discussion-thread.html': initDiscussionThread,
        'discussion-edit.html': initDiscussionEdit,
        'discussion-insights.html': initDiscussions,
        'conferences.html': initConferences,
        'collaborations.html': initCollaborations,
        'groups.html': initGroups,
        'manage-groups.html': initManageGroups,
        'student-groups.html': initGroups,
        'people.html': initPeople,
        'course-people-new.html': initPeople,
        'prior-users.html': initPriorUsers,
        'conversation-compose.html': initConversationCompose,
        'bulk-message.html': initConversationCompose,
        'student-context.html': initStudentContext,

        // ── Admin & Settings ──
        'account-settings.html': initAccountSettings,
        'account-admin-tools.html': initAccountAdminTools,
        'account-calendar-settings.html': initAccountCalendarSettings,
        'account-course-user-search.html': initAccountSearch,
        'account-grading-settings.html': initAccountSettings,
        'account-manage.html': initAccountAdminTools,
        'account-notification-settings.html': initNotificationSettings,
        'account-reports.html': initAccountReports,
        'account-search.html': initAccountSearch,
        'account-statistics.html': initAccountStatistics,
        'course-settings.html': initCourseSettings,
        'course-grading-standards.html': initCourseSettings,
        'course-link-validator.html': initCourseSettings,
        'course-navigation-settings.html': initCourseSettings,
        'course-notification-settings.html': initNotificationSettings,
        'course-pace-editor.html': initCoursePaces,
        'course-statistics.html': initCourseStatistics,
        'course-wizard.html': initCourseHome,
        'course-catalog.html': initAllCourses,
        'copy-course.html': initCourseSettings,
        'course-copy-status.html': initCopyStatus,
        'course-paces.html': initCoursePaces,
        'permissions.html': initPermissions,
        'user-management.html': initUserManagement,
        'admin-dashboard.html': initAdminDashboard,
        'sub-accounts.html': initSubAccounts,
        'developer-keys.html': initDeveloperKeys,
        'reports.html': initReports,
        'sis-import.html': initSisImport,
        'authentication-providers.html': initAuthProviders,
        'brand-configs.html': initBrandConfigs,
        'terms-index.html': initTermsIndex,
        'feature-flags.html': initAccountAdminTools,
        'plugins.html': initAccountAdminTools,
        'rate-limiting.html': initAccountAdminTools,
        'release-notes.html': initAccountAdminTools,
        'jobs-dashboard.html': initJobsDashboard,
        'section-management.html': initSectionManagement,
        'lti-registrations.html': initAccountAdminTools,
        'teacher-activity-report.html': initTeacherActivityReport,

        // ── Content Management ──
        'content-migrations.html': initContentMigrations,
        'content-exports.html': initContentExports,
        'content-sharing.html': initContentSharing,
        'content-notices.html': initContentSharing,
        'blueprint-courses.html': initBlueprintCourses,
        'epub-exports.html': initContentExports,
        'webzip-export.html': initContentExports,

        // ── User & Profile ──
        'profile-show.html': initProfileShow,
        'user-settings.html': initUserSettings,
        'user-logins.html': initUserLogins,
        'user-name.html': initProfileShow,
        'user-lists.html': initUserManagement,
        'user-observees.html': initUserObservees,
        'manage-avatars.html': initProfileShow,
        'change-password.html': initChangePassword,

        // ── Calendar ──
        'edit-calendar-event.html': initEditCalendarEvent,
        'appointment-groups.html': initCalendar,

        // ── ePortfolio ──
        'eportfolio.html': initEPortfolio,
        'eportfolio-moderation.html': initEPortfolioModeration,
        'eportfolio-wizard.html': initEPortfolio,

        // ── Remaining / Utility ──
        'notifications.html': initNotifications,
        'planner.html': initPlanner,
        'search-results.html': initSearchResults,
        'smart-search.html': initSmartSearch,
        'analytics.html': initAnalytics,
        'analytics-hub.html': initAnalyticsHub,
        'all-courses.html': initAllCourses,
        'page-views.html': initPageViews,
        'k5-dashboard.html': initK5Dashboard,
        'k5-course.html': initK5Course,
        'ai-experiences.html': initAccountAdminTools,
        'discovery-page.html': initAllCourses,
        'attendance-tracker.html': initPeople,
        'enrollment-options.html': initCourseSettings,
        'self-enrollment.html': initCourseSettings,
        'choose-mastery-path.html': initModules,
        'prerequisites-lookup.html': initModules,
        'honor-pledge.html': initAssignmentDetail,
        'deep-linking.html': initAccountAdminTools,
        'password-complexity.html': initAccountAdminTools,

        // ── Auth pages (minimal init) ──
        'forgot-password.html': initAccessibility,
        'registration.html': initAccessibility,
        'mobile-login.html': initAccessibility,
        'otp-login.html': initAccessibility,
        'qr-mobile-login.html': initAccessibility,
        'oauth2-confirm.html': initAccessibility,
        'act-as-modal.html': initAccountAdminTools,
        'external-content-success.html': initAccessibility,
        'external-apps.html': initAccountAdminTools,
        'external-tools.html': initAccountAdminTools,

        // ── Static/Info pages ──
        'accessibility.html': initAccessibility,
        'acceptable-use-policy.html': initAccessibility,
        'terms-of-service.html': initAccessibility,
        'error-404.html': initAccessibility,
        'error-form.html': initAccessibility,
        'graphiql.html': initAccessibility,
        'theme-editor.html': initBrandConfigs,
        'theme-preview.html': initBrandConfigs,
        'new-quiz-builder.html': initQuizTake,
    };

    // ═══════════════════════════════════════
    // Init
    // ═══════════════════════════════════════

    document.addEventListener('DOMContentLoaded', async () => {
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';

        // Skip API init on login page
        if (currentPage === 'login.html') return;

        // Init sidebar (renders into #sidebar-root for new pages, enhances existing for original pages)
        if (window.ReDefinersSidebar) {
            try {
                await window.ReDefinersSidebar.init();
            } catch (e) {
                console.error('[Sidebar] Init failed:', e);
            }
        }

        // Init top bar (all authenticated pages)
        await initTopBar();

        // Init page-specific content
        const init = pageInitializers[currentPage];
        if (init) {
            try {
                await init();
            } catch (e) {
                console.error(`[${currentPage}] Init failed:`, e);
                if (e.isUnauthorized) {
                    window.location.href = 'login.html';
                }
            }
        }
    });

    // ═══════════════════════════════════════
    // Global Error Handler
    // ═══════════════════════════════════════

    window.addEventListener('unhandledrejection', (event) => {
        if (event.reason?.isUnauthorized) {
            window.location.href = 'login.html';
        } else {
            console.error('[Unhandled]', event.reason);
            render.toast('Something went wrong. Please try again.', 'error');
        }
    });

})();
