/**
 * ReDefiners — DOM Rendering Engine
 *
 * Transforms Canvas API data into DOM elements matching the ReDefiners design system.
 * Works with the existing jQuery-based pages and the css/tokens.css design tokens.
 *
 * Usage:
 *   const renderer = new ReDefinersRenderer();
 *   renderer.courseCard(courseData, containerEl);
 */

class ReDefinersRenderer {
    constructor() {
        this.dateFormatter = new Intl.DateTimeFormat('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
        this.timeFormatter = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric', minute: '2-digit',
        });
        this.relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    }

    // ═══════════════════════════════════════
    // Utility Helpers
    // ═══════════════════════════════════════

    /**
     * Create an element with classes and optional attributes
     */
    el(tag, classes = '', attrs = {}) {
        const element = document.createElement(tag);
        if (classes) element.className = classes;
        Object.entries(attrs).forEach(([k, v]) => {
            if (k === 'text') element.textContent = v;
            else if (k === 'html') element.innerHTML = v;
            else element.setAttribute(k, v);
        });
        return element;
    }

    formatDate(isoString) {
        if (!isoString) return 'No date';
        return this.dateFormatter.format(new Date(isoString));
    }

    formatTime(isoString) {
        if (!isoString) return '';
        return this.timeFormatter.format(new Date(isoString));
    }

    formatDateTime(isoString) {
        if (!isoString) return 'No date';
        return `${this.formatDate(isoString)} at ${this.formatTime(isoString)}`;
    }

    relativeTime(isoString) {
        if (!isoString) return '';
        const diff = new Date(isoString) - new Date();
        const days = Math.round(diff / (1000 * 60 * 60 * 24));
        if (Math.abs(days) < 1) {
            const hours = Math.round(diff / (1000 * 60 * 60));
            return this.relativeFormatter.format(hours, 'hour');
        }
        return this.relativeFormatter.format(days, 'day');
    }

    truncate(text, maxLen = 80) {
        if (!text) return '';
        return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
    }

    stripHTML(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html || '';
        return tmp.textContent || '';
    }

    submissionStatus(submission) {
        if (!submission) return { label: 'Not Submitted', class: 'not-submitted' };
        const ws = submission.workflow_state;
        if (submission.excused) return { label: 'Excused', class: 'excused' };
        if (ws === 'graded') return { label: 'Graded', class: 'graded' };
        if (submission.late) return { label: 'Late', class: 'late' };
        if (submission.missing) return { label: 'Missing', class: 'missing' };
        if (ws === 'submitted') return { label: 'Submitted', class: 'submitted' };
        return { label: 'Not Submitted', class: 'not-submitted' };
    }

    // ═══════════════════════════════════════
    // Breadcrumbs
    // ═══════════════════════════════════════

    breadcrumbs(items, container) {
        const nav = this.el('nav', 'breadcrumbs', { 'aria-label': 'Breadcrumb' });
        items.forEach((item, i) => {
            if (i > 0) {
                nav.appendChild(this.el('span', 'breadcrumbs__separator', { text: '>' }));
            }
            if (i === items.length - 1) {
                nav.appendChild(this.el('span', 'breadcrumbs__current', { text: item.label }));
            } else {
                nav.appendChild(this.el('a', '', { text: item.label, href: item.href || '#' }));
            }
        });
        container.prepend(nav);
        return nav;
    }

    // ═══════════════════════════════════════
    // Status Pills
    // ═══════════════════════════════════════

    statusPill(status) {
        return this.el('span', `status-pill status-pill--${status.class}`, { text: status.label });
    }

    // ═══════════════════════════════════════
    // Course Cards (Dashboard)
    // ═══════════════════════════════════════

    courseCard(course) {
        const card = this.el('div', 'car-last-in');
        const img = this.el('img', '', {
            src: course.image_download_url || 'Images/car1.png',
            alt: course.name,
            style: 'width:100%;height:150px;object-fit:cover;border-radius:10px;',
        });
        const title = this.el('h5', '', {
            text: course.name,
            style: 'font-weight:bold;margin-top:10px;',
        });
        const code = this.el('p', '', {
            text: course.course_code || '',
            style: 'font-size:12px;color:var(--text-secondary);',
        });
        const term = this.el('p', '', {
            text: course.term?.name || '',
            style: 'font-size:11px;color:var(--text-muted);',
        });
        const btn = this.el('button', '', { text: 'View Course' });
        btn.addEventListener('click', () => {
            window.location.href = `class.html?course_id=${course.id}`;
        });

        card.append(img, title, code, term, btn);
        return card;
    }

    courseCardList(courses, container) {
        container.innerHTML = '';
        if (courses.length === 0) {
            container.appendChild(this.emptyState('No courses found', 'You are not enrolled in any courses yet.'));
            return;
        }
        courses.forEach(course => container.appendChild(this.courseCard(course)));
    }

    // ═══════════════════════════════════════
    // Assignment List
    // ═══════════════════════════════════════

    assignmentRow(assignment) {
        const row = this.el('div', 'assign-inn');

        // Left side: icon + info
        const left = this.el('div', 'assign-img');
        const icon = this.el('i', 'fa-solid fa-file-lines', {
            style: 'font-size:24px;color:var(--text-secondary);margin-right:12px;',
        });
        const info = this.el('div');
        const name = this.el('h5', '', { text: assignment.name });
        name.style.cursor = 'pointer';
        name.addEventListener('click', () => {
            window.location.href = `assignment-detail.html?course_id=${assignment.course_id}&id=${assignment.id}`;
        });
        const meta = this.el('p', '', {
            text: assignment.due_at
                ? `Due ${this.formatDateTime(assignment.due_at)}`
                : 'No due date',
            style: 'color:var(--text-secondary);',
        });
        info.append(name, meta);
        left.append(icon, info);

        // Right side: points + status
        const right = this.el('div', '', { style: 'text-align:right;display:flex;align-items:center;gap:12px;' });
        const points = this.el('span', '', {
            text: assignment.points_possible ? `${assignment.points_possible} pts` : '',
            style: 'font-size:13px;color:var(--text-secondary);',
        });
        const status = this.submissionStatus(assignment.submission);
        right.append(points, this.statusPill(status));

        row.append(left, right);
        return row;
    }

    assignmentGroupList(groups, container) {
        container.innerHTML = '';
        if (!groups || groups.length === 0) {
            container.appendChild(this.emptyState('No assignments', 'This course has no assignments yet.'));
            return;
        }

        groups.forEach(group => {
            const section = this.el('div', '', { style: 'margin-bottom:20px;' });
            const header = this.el('div', '', {
                style: 'display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--color-neutral-200);',
            });
            const groupName = this.el('h4', '', {
                text: group.name,
                style: 'font-weight:bold;font-size:16px;margin:0;',
            });
            const weight = this.el('span', '', {
                text: group.group_weight ? `${group.group_weight}% of total` : '',
                style: 'font-size:12px;color:var(--text-secondary);',
            });
            header.append(groupName, weight);
            section.appendChild(header);

            if (group.assignments && group.assignments.length > 0) {
                group.assignments.forEach(a => section.appendChild(this.assignmentRow(a)));
            } else {
                const empty = this.el('p', '', {
                    text: 'No assignments in this group',
                    style: 'padding:10px;color:var(--text-muted);font-size:13px;',
                });
                section.appendChild(empty);
            }
            container.appendChild(section);
        });
    }

    // ═══════════════════════════════════════
    // Grades Table
    // ═══════════════════════════════════════

    gradesTable(groups, totalGrade, container) {
        container.innerHTML = '';

        // Total grade header
        if (totalGrade !== undefined) {
            const total = this.el('div', 'progres', {
                style: 'margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;',
            });
            const label = this.el('h3', '', { text: 'Total Grade', style: 'font-weight:bold;margin:0;' });
            const score = this.el('h3', '', {
                text: `${totalGrade}%`,
                style: 'font-weight:bold;margin:0;color:var(--color-primary-700);font-size:28px;',
            });
            total.append(label, score);
            container.appendChild(total);
        }

        // Assignment rows by group
        groups.forEach(group => {
            const section = this.el('div', '', { style: 'margin-bottom:16px;' });
            const header = this.el('div', '', {
                style: 'background:var(--color-neutral-100);padding:8px 16px;border-radius:var(--radius-md);display:flex;justify-content:space-between;',
            });
            header.appendChild(this.el('strong', '', { text: group.name }));
            if (group.group_weight) {
                header.appendChild(this.el('span', '', { text: `${group.group_weight}%`, style: 'color:var(--text-secondary);font-size:13px;' }));
            }
            section.appendChild(header);

            (group.assignments || []).forEach(a => {
                const row = this.el('div', '', {
                    style: 'display:flex;justify-content:space-between;align-items:center;padding:10px 16px;border-bottom:1px solid var(--color-neutral-100);',
                });
                const nameCol = this.el('div');
                nameCol.appendChild(this.el('span', '', { text: a.name, style: 'font-size:14px;' }));
                if (a.due_at) {
                    nameCol.appendChild(this.el('p', '', {
                        text: this.formatDate(a.due_at),
                        style: 'font-size:11px;color:var(--text-muted);margin:0;',
                    }));
                }

                const scoreCol = this.el('div', '', { style: 'text-align:right;display:flex;align-items:center;gap:10px;' });
                const sub = a.submission;
                const status = this.submissionStatus(sub);
                scoreCol.appendChild(this.statusPill(status));

                if (sub && sub.score !== null && sub.score !== undefined) {
                    scoreCol.appendChild(this.el('span', '', {
                        text: `${sub.score} / ${a.points_possible}`,
                        style: 'font-weight:bold;font-size:14px;',
                    }));
                } else {
                    scoreCol.appendChild(this.el('span', '', {
                        text: `- / ${a.points_possible || '-'}`,
                        style: 'font-size:14px;color:var(--text-muted);',
                    }));
                }

                row.append(nameCol, scoreCol);
                section.appendChild(row);
            });

            container.appendChild(section);
        });
    }

    // ═══════════════════════════════════════
    // Module List
    // ═══════════════════════════════════════

    moduleList(modules, container) {
        container.innerHTML = '';
        if (!modules || modules.length === 0) {
            container.appendChild(this.emptyState('No modules', 'This course has no modules yet.'));
            return;
        }

        modules.forEach(mod => {
            const section = this.el('div', 'progres', { style: 'margin-bottom:16px;padding:0;overflow:hidden;' });

            // Module header
            const header = this.el('div', '', {
                style: 'display:flex;justify-content:space-between;align-items:center;padding:16px 20px;cursor:pointer;background:var(--color-white);',
            });
            const left = this.el('div', '', { style: 'display:flex;align-items:center;gap:10px;' });
            const chevron = this.el('i', 'fa-solid fa-chevron-down', { style: 'font-size:12px;color:var(--text-secondary);transition:transform 0.2s;' });
            const title = this.el('h4', '', { text: mod.name, style: 'font-weight:bold;margin:0;font-size:16px;' });

            // Lock indicator
            if (mod.state === 'locked') {
                left.appendChild(this.el('i', 'fa-solid fa-lock', { style: 'color:var(--text-muted);' }));
            }
            left.append(chevron, title);

            const badge = this.el('span', '', {
                text: `${mod.items_count || 0} items`,
                style: 'font-size:12px;color:var(--text-secondary);',
            });
            header.append(left, badge);

            // Module items
            const itemsContainer = this.el('div', '', { style: 'border-top:1px solid var(--color-neutral-100);' });
            (mod.items || []).forEach(item => {
                itemsContainer.appendChild(this.moduleItem(item, mod.id));
            });

            // Toggle collapse
            header.addEventListener('click', () => {
                const isHidden = itemsContainer.style.display === 'none';
                itemsContainer.style.display = isHidden ? 'block' : 'none';
                chevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
            });

            section.append(header, itemsContainer);
            container.appendChild(section);
        });
    }

    moduleItem(item, moduleId) {
        const row = this.el('div', '', {
            style: 'display:flex;align-items:center;gap:12px;padding:10px 20px;border-bottom:1px solid var(--color-neutral-50);',
        });

        // Completion checkbox
        const checkbox = this.el('input', '', { type: 'checkbox' });
        if (item.completion_requirement?.completed) checkbox.checked = true;
        row.appendChild(checkbox);

        // Type icon
        const iconMap = {
            Assignment: 'fa-file-lines',
            Quiz: 'fa-question-circle',
            Discussion: 'fa-comments',
            Page: 'fa-file-alt',
            File: 'fa-paperclip',
            ExternalUrl: 'fa-external-link-alt',
            ExternalTool: 'fa-puzzle-piece',
            SubHeader: 'fa-heading',
        };
        const iconClass = iconMap[item.type] || 'fa-circle';
        row.appendChild(this.el('i', `fa-solid ${iconClass}`, {
            style: 'color:var(--text-secondary);width:20px;text-align:center;',
        }));

        // Item info
        const info = this.el('div', '', { style: 'flex:1;' });
        const nameEl = this.el('span', '', { text: item.title, style: 'font-size:14px;cursor:pointer;' });
        if (item.type !== 'SubHeader' && item.html_url) {
            nameEl.style.color = 'var(--text-link)';
            nameEl.addEventListener('click', () => { window.location.href = item.html_url; });
        }
        info.appendChild(nameEl);

        // Due date if available
        if (item.content_details?.due_at) {
            info.appendChild(this.el('span', '', {
                text: ` - Due ${this.formatDate(item.content_details.due_at)}`,
                style: 'font-size:11px;color:var(--text-muted);',
            }));
        }
        row.appendChild(info);

        // Points
        if (item.content_details?.points_possible) {
            row.appendChild(this.el('span', '', {
                text: `${item.content_details.points_possible} pts`,
                style: 'font-size:12px;color:var(--text-secondary);',
            }));
        }

        // Requirement icon
        if (item.completion_requirement) {
            const reqMap = {
                must_view: 'fa-eye', must_submit: 'fa-paper-plane',
                must_contribute: 'fa-comment', min_score: 'fa-star',
            };
            const reqIcon = reqMap[item.completion_requirement.type] || 'fa-check';
            row.appendChild(this.el('i', `fa-solid ${reqIcon}`, {
                style: 'font-size:11px;color:var(--text-muted);',
                title: item.completion_requirement.type.replace('_', ' '),
            }));
        }

        return row;
    }

    // ═══════════════════════════════════════
    // Discussion List
    // ═══════════════════════════════════════

    discussionRow(topic) {
        const row = this.el('div', 'discuss-inn');
        const avatar = this.el('img', '', {
            src: topic.author?.avatar_image_url || 'Images/image1.png',
            style: 'width:35px;height:35px;border-radius:100%;',
        });
        const content = this.el('div', 'discuss-chk');
        const title = this.el('h5', '', { text: topic.title, style: 'cursor:pointer;' });
        title.addEventListener('click', () => {
            window.location.href = `discussion-thread.html?course_id=${topic.assignment?.course_id || ''}&topic_id=${topic.id}`;
        });

        const meta = this.el('p', '', {
            text: `${topic.discussion_subentry_count || 0} replies | ${topic.unread_count || 0} unread | ${this.formatDate(topic.posted_at)}`,
        });

        content.append(title, meta);

        // Badges
        if (topic.pinned) {
            content.appendChild(this.el('span', 'status-pill status-pill--submitted', { text: 'Pinned', style: 'font-size:10px;' }));
        }
        if (topic.locked) {
            content.appendChild(this.el('span', 'status-pill status-pill--not-submitted', { text: 'Closed', style: 'font-size:10px;margin-left:4px;' }));
        }

        row.append(avatar, content);
        return row;
    }

    // ═══════════════════════════════════════
    // To-Do List (Dashboard)
    // ═══════════════════════════════════════

    todoList(items, container) {
        container.innerHTML = '';
        if (!items || items.length === 0) {
            container.appendChild(this.el('p', '', {
                text: 'Nothing to do right now!',
                style: 'color:var(--text-muted);font-size:13px;padding:10px;',
            }));
            return;
        }

        items.forEach(item => {
            const row = this.el('div', '', {
                style: 'display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--color-neutral-100);',
            });
            const colorDot = this.el('div', '', {
                style: `width:8px;height:8px;border-radius:100%;background:${item.context_type === 'Course' ? 'var(--color-accent-blue)' : 'var(--color-accent-purple)'};flex-shrink:0;`,
            });
            const info = this.el('div', '', { style: 'flex:1;min-width:0;' });
            info.appendChild(this.el('p', '', {
                text: item.plannable?.title || item.plannable_type,
                style: 'margin:0;font-size:13px;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;',
            }));
            info.appendChild(this.el('p', '', {
                text: item.plannable?.due_at ? this.formatDateTime(item.plannable.due_at) : 'No due date',
                style: 'margin:0;font-size:11px;color:var(--text-muted);',
            }));
            const check = this.el('input', '', { type: 'checkbox' });
            if (item.planner_override?.marked_complete) check.checked = true;

            row.append(colorDot, info, check);
            container.appendChild(row);
        });
    }

    // ═══════════════════════════════════════
    // Calendar Events
    // ═══════════════════════════════════════

    calendarEvent(event) {
        const row = this.el('div', '', {
            style: 'display:flex;align-items:center;gap:10px;padding:8px;border-radius:var(--radius-md);margin-bottom:4px;',
        });
        const colorBar = this.el('div', '', {
            style: `width:4px;height:36px;border-radius:2px;background:${event.context_color || 'var(--color-accent-blue)'};`,
        });
        const info = this.el('div', '', { style: 'flex:1;' });
        info.appendChild(this.el('p', '', {
            text: event.title,
            style: 'margin:0;font-size:13px;font-weight:500;',
        }));
        info.appendChild(this.el('p', '', {
            text: event.start_at ? this.formatTime(event.start_at) : 'All day',
            style: 'margin:0;font-size:11px;color:var(--text-secondary);',
        }));
        row.append(colorBar, info);
        return row;
    }

    // ═══════════════════════════════════════
    // Conversation List (Inbox)
    // ═══════════════════════════════════════

    conversationRow(conv) {
        const row = this.el('div', 'people-inn', { style: 'cursor:pointer;padding:8px;border-radius:var(--radius-sm);' });
        if (conv.workflow_state === 'unread') {
            row.style.background = 'var(--color-neutral-100)';
        }
        row.addEventListener('click', () => {
            window.location.href = `inbox.html?id=${conv.id}`;
        });

        const avatar = this.el('img', '', {
            src: conv.avatar_url || 'Images/image1.png',
            style: 'width:45px;height:45px;border-radius:100%;',
        });
        const content = this.el('div');
        const nameRow = this.el('div', '', { style: 'display:flex;justify-content:space-between;' });
        nameRow.appendChild(this.el('h5', '', {
            text: conv.participants?.map(p => p.name).join(', ') || conv.subject || 'No subject',
        }));
        nameRow.appendChild(this.el('span', '', {
            text: this.formatDate(conv.last_message_at),
            style: 'font-size:10px;color:var(--text-muted);',
        }));
        const preview = this.el('p', '', {
            text: this.truncate(this.stripHTML(conv.last_message), 60),
        });

        content.append(nameRow, preview);
        row.append(avatar, content);
        return row;
    }

    // ═══════════════════════════════════════
    // Announcement Row
    // ═══════════════════════════════════════

    announcementRow(announcement) {
        const row = this.el('tr', 'table-tr1');
        row.style.cursor = 'pointer';
        row.addEventListener('mouseenter', () => {
            row.style.background = 'white';
            row.style.boxShadow = 'var(--shadow-2)';
        });
        row.addEventListener('mouseleave', () => {
            row.style.background = '';
            row.style.boxShadow = '';
        });

        const titleCell = this.el('td', 'table-td1');
        titleCell.appendChild(this.el('strong', '', { text: announcement.title }));
        titleCell.appendChild(this.el('p', '', {
            text: this.truncate(this.stripHTML(announcement.message), 80),
            style: 'margin:0;font-size:11px;color:var(--text-secondary);',
        }));

        const dateCell = this.el('td', 'table-td1', { text: this.formatDate(announcement.posted_at) });
        const authorCell = this.el('td', 'table-td1', { text: announcement.author?.display_name || '' });
        const actionCell = this.el('td', 'table-td1');
        actionCell.appendChild(this.el('button', 'btn btn--secondary btn--sm', { text: 'View' }));

        row.append(titleCell, dateCell, authorCell, actionCell);
        return row;
    }

    // ═══════════════════════════════════════
    // Progress Bars
    // ═══════════════════════════════════════

    progressBar(label, value, max, variant = 'blue') {
        const container = this.el('div', '', { style: 'margin-bottom:15px;' });
        const header = this.el('div', 'progress-in');
        header.appendChild(this.el('h5', '', { text: label }));
        header.appendChild(this.el('span', '', { text: `${value}/${max}` }));
        container.appendChild(header);

        const progress = this.el('progress', `progress-field progress-field${variant === 'blue' ? '1' : variant === 'yellow' ? '2' : '3'}`, {
            value: value, max: max,
        });
        container.appendChild(progress);
        return container;
    }

    // ═══════════════════════════════════════
    // Empty State
    // ═══════════════════════════════════════

    emptyState(heading, description, ctaText, ctaHref) {
        const container = this.el('div', 'empty-state');
        container.appendChild(this.el('div', 'empty-state__icon', { html: '<i class="fa-solid fa-inbox"></i>' }));
        container.appendChild(this.el('h3', 'empty-state__heading', { text: heading }));
        container.appendChild(this.el('p', 'empty-state__description', { text: description }));
        if (ctaText) {
            const btn = this.el('button', 'empty-state__cta', { text: ctaText });
            if (ctaHref) btn.addEventListener('click', () => { window.location.href = ctaHref; });
            container.appendChild(btn);
        }
        return container;
    }

    // ═══════════════════════════════════════
    // Loading Skeletons
    // ═══════════════════════════════════════

    skeleton(type = 'card', count = 1) {
        const container = this.el('div');
        for (let i = 0; i < count; i++) {
            container.appendChild(this.el('div', `skeleton skeleton--${type}`));
        }
        return container;
    }

    showLoading(container, type = 'row', count = 5) {
        container.innerHTML = '';
        container.appendChild(this.skeleton(type, count));
    }

    // ═══════════════════════════════════════
    // Toast Notifications
    // ═══════════════════════════════════════

    toast(message, type = 'info', duration = 5000) {
        const icons = { success: '&#10003;', error: '&#10007;', warning: '!', info: 'i' };
        const toast = this.el('div', `toast toast--${type}`);
        toast.innerHTML = `
            <div class="toast__icon">${icons[type]}</div>
            <span>${message}</span>
            <button class="toast__close">&times;</button>
        `;
        document.body.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => toast.classList.add('toast--visible'));

        // Close handlers
        const close = () => {
            toast.classList.remove('toast--visible');
            setTimeout(() => toast.remove(), 300);
        };
        toast.querySelector('.toast__close').addEventListener('click', close);
        if (duration) setTimeout(close, duration);

        return toast;
    }

    // ═══════════════════════════════════════
    // Notification Badge
    // ═══════════════════════════════════════

    updateNotificationBadge(count) {
        let badge = document.querySelector('.notification-badge');
        if (!badge) {
            badge = this.el('span', 'notification-badge', {
                style: 'position:absolute;top:-4px;right:-4px;background:var(--color-error);color:white;font-size:10px;padding:2px 6px;border-radius:var(--radius-full);font-weight:bold;',
            });
            const bellIcon = document.querySelector('.fa-bell')?.parentElement;
            if (bellIcon) {
                bellIcon.style.position = 'relative';
                bellIcon.appendChild(badge);
            }
        }
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = count > 0 ? 'inline' : 'none';
    }
}

// ═══════════════════════════════════════
// Global Instance
// ═══════════════════════════════════════

window.ReDefinersRenderer = new ReDefinersRenderer();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ReDefinersRenderer };
}
