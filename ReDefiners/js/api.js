/**
 * ReDefiners — Canvas LMS API Service
 *
 * Centralized API client for all Canvas LMS REST API interactions.
 * All calls route through the proxy server to handle authentication and CORS.
 *
 * Usage:
 *   import { CanvasAPI } from './api.js';
 *   const api = new CanvasAPI('/api');
 *   const courses = await api.courses.list();
 */

class CanvasAPI {
    /**
     * @param {string} baseURL - Proxy base URL (e.g., '/api' or 'http://localhost:3000/api')
     */
    constructor(baseURL = '/api') {
        this.baseURL = baseURL.replace(/\/$/, '');
        this._cache = new Map();
        this._rateLimitRemaining = Infinity;

        // Sub-modules
        this.users = new UsersAPI(this);
        this.courses = new CoursesAPI(this);
        this.assignments = new AssignmentsAPI(this);
        this.modules = new ModulesAPI(this);
        this.calendar = new CalendarAPI(this);
        this.conversations = new ConversationsAPI(this);
        this.announcements = new AnnouncementsAPI(this);
        this.discussions = new DiscussionsAPI(this);
        this.grades = new GradesAPI(this);
        this.quizzes = new QuizzesAPI(this);
        this.pages = new PagesAPI(this);
        this.files = new FilesAPI(this);
        this.planner = new PlannerAPI(this);
        this.search = new SearchAPI(this);
        this.conferences = new ConferencesAPI(this);
        this.collaborations = new CollaborationsAPI(this);
        this.groups = new GroupsAPI(this);
        this.people = new PeopleAPI(this);
        this.outcomes = new OutcomesAPI(this);
        this.rubrics = new RubricsAPI(this);
        this.admin = new AdminAPI(this);
        this.notifications = new NotificationsAPI(this);
        this.eportfolio = new EPortfolioAPI(this);
        this.contentMigrations = new ContentMigrationsAPI(this);
    }

    // ═══════════════════════════════════════
    // Core HTTP Methods
    // ═══════════════════════════════════════

    async _request(method, path, { body, params, cacheTTL } = {}) {
        const url = new URL(`${this.baseURL}${path}`, window.location.origin);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => url.searchParams.append(`${key}[]`, v));
                } else if (value !== undefined && value !== null) {
                    url.searchParams.set(key, value);
                }
            });
        }

        const cacheKey = `${method}:${url.toString()}`;

        // Check cache for GET requests
        if (method === 'GET' && cacheTTL) {
            const cached = this._cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < cacheTTL) {
                return cached.data;
            }
        }

        // Rate limit check
        if (this._rateLimitRemaining < 10) {
            console.warn('[CanvasAPI] Rate limit low:', this._rateLimitRemaining);
            // If we have cached data, return it
            const cached = this._cache.get(cacheKey);
            if (cached) return cached.data;
        }

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'same-origin',
        };

        if (body && method !== 'GET') {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url.toString(), options);

            // Track rate limit
            const remaining = response.headers.get('X-Canvas-Rate-Remaining');
            if (remaining) this._rateLimitRemaining = parseFloat(remaining);

            // Handle pagination info
            const linkHeader = response.headers.get('Link');
            const pagination = linkHeader ? this._parseLinkHeader(linkHeader) : null;

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: response.statusText }));
                throw new CanvasAPIError(response.status, error.message || error.errors, path);
            }

            const data = await response.json();
            const result = { data, pagination };

            // Cache GET responses
            if (method === 'GET' && cacheTTL) {
                this._cache.set(cacheKey, { data: result, timestamp: Date.now() });
            }

            return result;
        } catch (error) {
            if (error instanceof CanvasAPIError) throw error;
            throw new CanvasAPIError(0, `Network error: ${error.message}`, path);
        }
    }

    async get(path, options = {}) { return this._request('GET', path, options); }
    async post(path, body, options = {}) { return this._request('POST', path, { ...options, body }); }
    async put(path, body, options = {}) { return this._request('PUT', path, { ...options, body }); }
    async delete(path, options = {}) { return this._request('DELETE', path, options); }

    /**
     * Fetch all pages of a paginated endpoint
     * @param {string} path
     * @param {object} params
     * @returns {Promise<Array>}
     */
    async getAll(path, params = {}) {
        const allData = [];
        let nextUrl = null;
        params.per_page = params.per_page || 50;

        const first = await this.get(path, { params });
        allData.push(...(Array.isArray(first.data) ? first.data : [first.data]));
        nextUrl = first.pagination?.next;

        while (nextUrl) {
            const response = await fetch(nextUrl, {
                credentials: 'same-origin',
                headers: { 'Accept': 'application/json' },
            });
            const data = await response.json();
            allData.push(...(Array.isArray(data) ? data : [data]));

            const linkHeader = response.headers.get('Link');
            nextUrl = linkHeader ? this._parseLinkHeader(linkHeader)?.next : null;
        }

        return allData;
    }

    _parseLinkHeader(header) {
        if (!header) return null;
        const links = {};
        header.split(',').forEach(part => {
            const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
            if (match) links[match[2]] = match[1];
        });
        return links;
    }

    clearCache() { this._cache.clear(); }
    invalidateCache(pathPattern) {
        for (const key of this._cache.keys()) {
            if (key.includes(pathPattern)) this._cache.delete(key);
        }
    }
}

// ═══════════════════════════════════════
// Error Class
// ═══════════════════════════════════════

class CanvasAPIError extends Error {
    constructor(status, message, path) {
        super(message);
        this.name = 'CanvasAPIError';
        this.status = status;
        this.path = path;
    }

    get isUnauthorized() { return this.status === 401; }
    get isForbidden() { return this.status === 403; }
    get isNotFound() { return this.status === 404; }
    get isRateLimited() { return this.status === 403 && this.message.includes('rate'); }
    get isNetworkError() { return this.status === 0; }
}

// ═══════════════════════════════════════
// API Sub-Modules
// ═══════════════════════════════════════

class UsersAPI {
    constructor(api) { this.api = api; }

    self()          { return this.api.get('/v1/users/self', { cacheTTL: 300000 }); }
    profile()       { return this.api.get('/v1/users/self/profile', { cacheTTL: 300000 }); }
    settings()      { return this.api.get('/v1/users/self/settings', { cacheTTL: 300000 }); }
    todo()          { return this.api.get('/v1/users/self/todo'); }
    todoCount()     { return this.api.get('/v1/users/self/todo_item_count'); }
    upcoming()      { return this.api.get('/v1/users/self/upcoming_events'); }
    missing()       { return this.api.get('/v1/users/self/missing_submissions'); }
    activityStream(){ return this.api.get('/v1/users/self/activity_stream'); }
    colors()        { return this.api.get('/v1/users/self/colors', { cacheTTL: 600000 }); }
    favorites()     { return this.api.get('/v1/users/self/favorites/courses', { cacheTTL: 300000 }); }

    updateProfile(data)         { return this.api.put('/v1/users/self', { user: data }); }
    updateSettings(data)        { return this.api.put('/v1/users/self/settings', data); }
    setColor(assetString, hex)  { return this.api.put(`/v1/users/self/colors/${assetString}`, { hexcode: hex }); }
    addFavorite(courseId)        { return this.api.post(`/v1/users/self/favorites/courses/${courseId}`); }
    removeFavorite(courseId)     { return this.api.delete(`/v1/users/self/favorites/courses/${courseId}`); }
}

class CoursesAPI {
    constructor(api) { this.api = api; }

    list(params = {}) {
        return this.api.get('/v1/courses', {
            params: { include: ['term', 'teachers', 'total_scores', 'enrollments'], ...params },
            cacheTTL: 600000,
        });
    }
    get(courseId, params = {}) {
        return this.api.get(`/v1/courses/${courseId}`, {
            params: { include: ['syllabus_body', 'teachers', 'term'], ...params },
            cacheTTL: 300000,
        });
    }
    tabs(courseId)       { return this.api.get(`/v1/courses/${courseId}/tabs`, { cacheTTL: 3600000 }); }
    settings(courseId)   { return this.api.get(`/v1/courses/${courseId}/settings`, { cacheTTL: 600000 }); }
    users(courseId, params = {}) {
        return this.api.get(`/v1/courses/${courseId}/users`, {
            params: { include: ['enrollments', 'avatar_url'], ...params },
        });
    }
    sections(courseId) { return this.api.get(`/v1/courses/${courseId}/sections`); }
}

class AssignmentsAPI {
    constructor(api) { this.api = api; }

    list(courseId, params = {}) {
        return this.api.get(`/v1/courses/${courseId}/assignments`, {
            params: { include: ['submission', 'score_statistics'], order_by: 'position', ...params },
        });
    }
    get(courseId, assignmentId) {
        return this.api.get(`/v1/courses/${courseId}/assignments/${assignmentId}`, {
            params: { include: ['submission', 'rubric_assessment'] },
        });
    }
    groups(courseId) {
        return this.api.get(`/v1/courses/${courseId}/assignment_groups`, {
            params: { include: ['assignments', 'submission'] },
        });
    }
    submission(courseId, assignmentId, userId = 'self') {
        return this.api.get(`/v1/courses/${courseId}/assignments/${assignmentId}/submissions/${userId}`);
    }
    submit(courseId, assignmentId, submission) {
        return this.api.post(`/v1/courses/${courseId}/assignments/${assignmentId}/submissions`, { submission });
    }
    rubric(courseId, rubricId) {
        return this.api.get(`/v1/courses/${courseId}/rubrics/${rubricId}`);
    }
    peerReviews(courseId, assignmentId) {
        return this.api.get(`/v1/courses/${courseId}/assignments/${assignmentId}/peer_reviews`);
    }
}

class ModulesAPI {
    constructor(api) { this.api = api; }

    list(courseId) {
        return this.api.get(`/v1/courses/${courseId}/modules`, {
            params: { include: ['items', 'content_details'] },
            cacheTTL: 300000,
        });
    }
    items(courseId, moduleId) {
        return this.api.get(`/v1/courses/${courseId}/modules/${moduleId}/items`, {
            params: { include: ['content_details'] },
        });
    }
    markDone(courseId, moduleId, itemId) {
        return this.api.put(`/v1/courses/${courseId}/modules/${moduleId}/items/${itemId}/done`);
    }
    itemSequence(courseId, assetType, assetId) {
        return this.api.get(`/v1/courses/${courseId}/module_item_sequence`, {
            params: { asset_type: assetType, asset_id: assetId },
        });
    }
}

class CalendarAPI {
    constructor(api) { this.api = api; }

    events(startDate, endDate, params = {}) {
        return this.api.get('/v1/calendar_events', {
            params: { type: 'event', start_date: startDate, end_date: endDate, ...params },
            cacheTTL: 120000,
        });
    }
    assignments(startDate, endDate, params = {}) {
        return this.api.get('/v1/calendar_events', {
            params: { type: 'assignment', start_date: startDate, end_date: endDate, ...params },
            cacheTTL: 120000,
        });
    }
    all(startDate, endDate, contextCodes = []) {
        return this.api.get('/v1/calendar_events', {
            params: { start_date: startDate, end_date: endDate, context_codes: contextCodes, all_events: true },
        });
    }
    create(event) {
        return this.api.post('/v1/calendar_events', { calendar_event: event });
    }
    update(eventId, event) {
        return this.api.put(`/v1/calendar_events/${eventId}`, { calendar_event: event });
    }
    remove(eventId) {
        return this.api.delete(`/v1/calendar_events/${eventId}`);
    }
    appointmentGroups() {
        return this.api.get('/v1/appointment_groups');
    }
}

class ConversationsAPI {
    constructor(api) { this.api = api; }

    list(params = {}) {
        return this.api.get('/v1/conversations', { params, cacheTTL: 60000 });
    }
    get(conversationId) {
        return this.api.get(`/v1/conversations/${conversationId}`);
    }
    create(recipients, subject, body, options = {}) {
        return this.api.post('/v1/conversations', {
            recipients, subject, body, ...options,
        });
    }
    addMessage(conversationId, body, options = {}) {
        return this.api.post(`/v1/conversations/${conversationId}/add_message`, {
            body, ...options,
        });
    }
    update(conversationId, data) {
        return this.api.put(`/v1/conversations/${conversationId}`, { conversation: data });
    }
    remove(conversationId) {
        return this.api.delete(`/v1/conversations/${conversationId}`);
    }
    markRead(conversationId) {
        return this.api.put(`/v1/conversations/${conversationId}`, {
            conversation: { workflow_state: 'read' },
        });
    }
    star(conversationId)   { return this.update(conversationId, { starred: true }); }
    unstar(conversationId) { return this.update(conversationId, { starred: false }); }
    archive(conversationId) {
        return this.update(conversationId, { workflow_state: 'archived' });
    }
    unreadCount() {
        return this.api.get('/v1/conversations/unread_count', { cacheTTL: 60000 });
    }
}

class AnnouncementsAPI {
    constructor(api) { this.api = api; }

    list(contextCodes, params = {}) {
        return this.api.get('/v1/announcements', {
            params: { context_codes: contextCodes, ...params },
            cacheTTL: 300000,
        });
    }
}

class DiscussionsAPI {
    constructor(api) { this.api = api; }

    list(courseId, params = {}) {
        return this.api.get(`/v1/courses/${courseId}/discussion_topics`, { params });
    }
    get(courseId, topicId) {
        return this.api.get(`/v1/courses/${courseId}/discussion_topics/${topicId}`);
    }
    fullThread(courseId, topicId) {
        return this.api.get(`/v1/courses/${courseId}/discussion_topics/${topicId}/view`);
    }
    postEntry(courseId, topicId, message) {
        return this.api.post(`/v1/courses/${courseId}/discussion_topics/${topicId}/entries`, { message });
    }
    postReply(courseId, topicId, entryId, message) {
        return this.api.post(
            `/v1/courses/${courseId}/discussion_topics/${topicId}/entries/${entryId}/replies`,
            { message }
        );
    }
    rate(courseId, topicId, entryId, rating) {
        return this.api.put(
            `/v1/courses/${courseId}/discussion_topics/${topicId}/entries/${entryId}/rating`,
            { rating }
        );
    }
    markAllRead(courseId, topicId) {
        return this.api.put(`/v1/courses/${courseId}/discussion_topics/${topicId}/read_all`);
    }
}

class GradesAPI {
    constructor(api) { this.api = api; }

    enrollments(courseId) {
        return this.api.get(`/v1/courses/${courseId}/enrollments`, {
            params: { user_id: 'self', include: ['grades'] },
        });
    }
    assignmentGroupsWithGrades(courseId) {
        return this.api.get(`/v1/courses/${courseId}/assignment_groups`, {
            params: { include: ['assignments', 'submission'] },
        });
    }
}

class QuizzesAPI {
    constructor(api) { this.api = api; }

    list(courseId) {
        return this.api.get(`/v1/courses/${courseId}/quizzes`);
    }
    get(courseId, quizId) {
        return this.api.get(`/v1/courses/${courseId}/quizzes/${quizId}`);
    }
    startSubmission(courseId, quizId) {
        return this.api.post(`/v1/courses/${courseId}/quizzes/${quizId}/submissions`);
    }
    getQuestions(courseId, quizId, submissionId) {
        return this.api.get(
            `/v1/courses/${courseId}/quizzes/${quizId}/submissions/${submissionId}/questions`
        );
    }
    completeSubmission(courseId, quizId, submissionId, data) {
        return this.api.post(
            `/v1/courses/${courseId}/quizzes/${quizId}/submissions/${submissionId}/complete`,
            data
        );
    }
}

class PagesAPI {
    constructor(api) { this.api = api; }

    list(courseId, params = {}) {
        return this.api.get(`/v1/courses/${courseId}/pages`, {
            params: { sort: 'title', ...params },
            cacheTTL: 600000,
        });
    }
    frontPage(courseId) {
        return this.api.get(`/v1/courses/${courseId}/front_page`, { cacheTTL: 600000 });
    }
    get(courseId, pageUrl) {
        return this.api.get(`/v1/courses/${courseId}/pages/${pageUrl}`);
    }
    revisions(courseId, pageUrl) {
        return this.api.get(`/v1/courses/${courseId}/pages/${pageUrl}/revisions`);
    }
    create(courseId, wiki_page) {
        return this.api.post(`/v1/courses/${courseId}/pages`, { wiki_page });
    }
    update(courseId, pageUrl, wiki_page) {
        return this.api.put(`/v1/courses/${courseId}/pages/${pageUrl}`, { wiki_page });
    }
}

class FilesAPI {
    constructor(api) { this.api = api; }

    listInFolder(courseId, folderId) {
        return this.api.get(`/v1/courses/${courseId}/folders/${folderId}/files`);
    }
    listFolders(courseId, folderId) {
        return this.api.get(`/v1/courses/${courseId}/folders/${folderId}/folders`);
    }
    rootFolder(courseId) {
        return this.api.get(`/v1/courses/${courseId}/folders/root`);
    }
    quota(courseId) {
        return this.api.get(`/v1/courses/${courseId}/files/quota`, { cacheTTL: 1800000 });
    }
    get(fileId) {
        return this.api.get(`/v1/files/${fileId}`);
    }
    remove(fileId) {
        return this.api.delete(`/v1/files/${fileId}`);
    }

    /**
     * Three-step Canvas file upload
     * @param {string} uploadPath - e.g., '/v1/courses/123/files'
     * @param {File} file - Browser File object
     * @param {object} params - Additional params (e.g., parent_folder_id)
     */
    async upload(uploadPath, file, params = {}) {
        // Step 1: Notify Canvas
        const step1 = await this.api.post(uploadPath, {
            name: file.name,
            size: file.size,
            content_type: file.type || 'application/octet-stream',
            ...params,
        });

        // Step 2: Upload to the URL Canvas provides
        const formData = new FormData();
        if (step1.data.upload_params) {
            Object.entries(step1.data.upload_params).forEach(([k, v]) => formData.append(k, v));
        }
        formData.append('file', file);

        const step2 = await fetch(step1.data.upload_url, {
            method: 'POST',
            body: formData,
        });

        // Step 3: Confirm (follow redirect or POST to location)
        if (step2.status === 301 || step2.status === 302 || step2.status === 303) {
            const confirmUrl = step2.headers.get('Location');
            const step3 = await fetch(confirmUrl, { method: 'POST', credentials: 'same-origin' });
            return step3.json();
        }

        return step2.json();
    }
}

class PlannerAPI {
    constructor(api) { this.api = api; }

    items(params = {}) {
        return this.api.get('/v1/planner/items', { params });
    }
    overrides() {
        return this.api.get('/v1/planner/overrides');
    }
    createOverride(data) {
        return this.api.post('/v1/planner/overrides', data);
    }
    notes() {
        return this.api.get('/v1/planner_notes');
    }
    createNote(data) {
        return this.api.post('/v1/planner_notes', data);
    }
}

class SearchAPI {
    constructor(api) { this.api = api; }

    recipients(params = {}) {
        return this.api.get('/v1/search/recipients', { params });
    }
    allCourses(params = {}) {
        return this.api.get('/v1/search/all_courses', { params });
    }
}

// ═══════════════════════════════════════
// Conferences API
// ═══════════════════════════════════════

class ConferencesAPI {
    constructor(api) { this.api = api; }

    list(courseId) {
        return this.api.get(`/v1/courses/${courseId}/conferences`);
    }
    forUser() {
        return this.api.get('/v1/conferences');
    }
}

// ═══════════════════════════════════════
// Collaborations API
// ═══════════════════════════════════════

class CollaborationsAPI {
    constructor(api) { this.api = api; }

    list(courseId) {
        return this.api.get(`/v1/courses/${courseId}/collaborations`);
    }
    members(collabId) {
        return this.api.get(`/v1/collaborations/${collabId}/members`);
    }
}

// ═══════════════════════════════════════
// Groups API
// ═══════════════════════════════════════

class GroupsAPI {
    constructor(api) { this.api = api; }

    listForCourse(courseId) {
        return this.api.get(`/v1/courses/${courseId}/groups`);
    }
    listForUser() {
        return this.api.get('/v1/users/self/groups');
    }
    get(groupId) {
        return this.api.get(`/v1/groups/${groupId}`);
    }
    members(groupId) {
        return this.api.get(`/v1/groups/${groupId}/users`);
    }
    categories(courseId) {
        return this.api.get(`/v1/courses/${courseId}/group_categories`);
    }
}

// ═══════════════════════════════════════
// People / Enrollments API
// ═══════════════════════════════════════

class PeopleAPI {
    constructor(api) { this.api = api; }

    list(courseId, params = {}) {
        return this.api.get(`/v1/courses/${courseId}/users`, {
            params: { include: ['avatar_url', 'enrollments', 'email'], ...params },
        });
    }
    get(courseId, userId) {
        return this.api.get(`/v1/courses/${courseId}/users/${userId}`, {
            params: { include: ['avatar_url', 'enrollments', 'email'] },
        });
    }
    enrollments(courseId, params = {}) {
        return this.api.get(`/v1/courses/${courseId}/enrollments`, { params });
    }
    activityStream(userId = 'self') {
        return this.api.get(`/v1/users/${userId}/activity_stream`);
    }
}

// ═══════════════════════════════════════
// Outcomes API
// ═══════════════════════════════════════

class OutcomesAPI {
    constructor(api) { this.api = api; }

    groups(courseId) {
        return this.api.get(`/v1/courses/${courseId}/outcome_groups`);
    }
    groupOutcomes(courseId, groupId) {
        return this.api.get(`/v1/courses/${courseId}/outcome_groups/${groupId}/outcomes`);
    }
    get(outcomeId) {
        return this.api.get(`/v1/outcomes/${outcomeId}`);
    }
    results(courseId, params = {}) {
        return this.api.get(`/v1/courses/${courseId}/outcome_results`, { params });
    }
    rollups(courseId, params = {}) {
        return this.api.get(`/v1/courses/${courseId}/outcome_rollups`, { params });
    }
}

// ═══════════════════════════════════════
// Rubrics API
// ═══════════════════════════════════════

class RubricsAPI {
    constructor(api) { this.api = api; }

    list(courseId) {
        return this.api.get(`/v1/courses/${courseId}/rubrics`);
    }
    get(courseId, rubricId) {
        return this.api.get(`/v1/courses/${courseId}/rubrics/${rubricId}`, {
            params: { include: ['assessments', 'associations'] },
        });
    }
}

// ═══════════════════════════════════════
// Admin / Account API
// ═══════════════════════════════════════

class AdminAPI {
    constructor(api) { this.api = api; }

    accounts() {
        return this.api.get('/v1/accounts');
    }
    account(accountId) {
        return this.api.get(`/v1/accounts/${accountId}`);
    }
    subAccounts(accountId) {
        return this.api.get(`/v1/accounts/${accountId}/sub_accounts`, {
            params: { recursive: true },
        });
    }
    roles(accountId) {
        return this.api.get(`/v1/accounts/${accountId}/roles`);
    }
    permissions(accountId) {
        return this.api.get(`/v1/accounts/${accountId}/permissions`);
    }
    users(accountId, params = {}) {
        return this.api.get(`/v1/accounts/${accountId}/users`, {
            params: { include: ['avatar_url', 'email'], ...params },
        });
    }
    reports(accountId) {
        return this.api.get(`/v1/accounts/${accountId}/reports`);
    }
    analytics(accountId, type = 'current') {
        return this.api.get(`/v1/accounts/${accountId}/analytics/${type}/activity`);
    }
    sisImports(accountId) {
        return this.api.get(`/v1/accounts/${accountId}/sis_imports`);
    }
    terms(accountId) {
        return this.api.get(`/v1/accounts/${accountId}/terms`);
    }
    developerKeys(accountId) {
        return this.api.get(`/v1/accounts/${accountId}/developer_keys`);
    }
    gradeChangeLog(params = {}) {
        return this.api.get('/v1/audit/grade_change', { params });
    }
    courseAuditLog(params = {}) {
        return this.api.get('/v1/audit/course', { params });
    }
}

// ═══════════════════════════════════════
// Notifications API
// ═══════════════════════════════════════

class NotificationsAPI {
    constructor(api) { this.api = api; }

    list() {
        return this.api.get('/v1/users/self/activity_stream', {
            params: { only_active_courses: true },
        });
    }
    summary() {
        return this.api.get('/v1/users/self/activity_stream/summary');
    }
    communicationChannels() {
        return this.api.get('/v1/users/self/communication_channels');
    }
    preferences(channelId) {
        return this.api.get(`/v1/users/self/communication_channels/${channelId}/notification_preferences`);
    }
}

// ═══════════════════════════════════════
// ePortfolio API
// ═══════════════════════════════════════

class EPortfolioAPI {
    constructor(api) { this.api = api; }

    list() {
        return this.api.get('/v1/users/self/eportfolios');
    }
    get(portfolioId) {
        return this.api.get(`/v1/eportfolios/${portfolioId}`);
    }
    pages(portfolioId) {
        return this.api.get(`/v1/eportfolios/${portfolioId}/pages`);
    }
}

// ═══════════════════════════════════════
// Content Migrations API
// ═══════════════════════════════════════

class ContentMigrationsAPI {
    constructor(api) { this.api = api; }

    list(courseId) {
        return this.api.get(`/v1/courses/${courseId}/content_migrations`);
    }
    get(courseId, migrationId) {
        return this.api.get(`/v1/courses/${courseId}/content_migrations/${migrationId}`);
    }
    create(courseId, data) {
        return this.api.post(`/v1/courses/${courseId}/content_migrations`, data);
    }
    migrators(courseId) {
        return this.api.get(`/v1/courses/${courseId}/content_migrations/migrators`);
    }
}

// ═══════════════════════════════════════
// Export
// ═══════════════════════════════════════

// Global instance
window.ReDefinersAPI = new CanvasAPI('/api');

// ES Module export (when using bundler)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CanvasAPI, CanvasAPIError };
}
