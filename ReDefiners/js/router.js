/**
 * ReDefiners — SPA Router
 *
 * Lightweight client-side router for page navigation.
 * Supports query params for context (course_id, assignment_id, etc.)
 * without full page reloads when navigating within the app.
 *
 * Usage:
 *   const router = new ReDefinersRouter();
 *   router.navigate('assignments.html', { course_id: 123 });
 */

class ReDefinersRouter {
    constructor() {
        this._routes = new Map();
        this._currentPage = this._getPageName();
        this._beforeNavigate = [];

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            const page = this._getPageName();
            if (page !== this._currentPage) {
                window.location.reload();
            }
        });

        // Intercept internal link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href) return;

            // Skip external links, anchors, and special protocols
            if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('javascript:')) return;

            // Skip links with target="_blank"
            if (link.target === '_blank') return;

            // Navigate internally
            e.preventDefault();
            this.navigate(href);
        });
    }

    /**
     * Get current page name from URL
     */
    _getPageName() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'dashboard.html';
        return page === '' ? 'dashboard.html' : page;
    }

    /**
     * Get all current URL parameters
     */
    getParams() {
        const params = {};
        const searchParams = new URLSearchParams(window.location.search);
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        return params;
    }

    /**
     * Get a specific parameter
     */
    getParam(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    /**
     * Get course ID from URL params
     */
    getCourseId() {
        return this.getParam('course_id');
    }

    /**
     * Get assignment ID from URL params
     */
    getAssignmentId() {
        return this.getParam('assignment_id');
    }

    /**
     * Navigate to a page
     * @param {string} href - Page URL (e.g., 'assignments.html?course_id=123')
     * @param {object} params - Additional query params to merge
     */
    navigate(href, params = {}) {
        // Parse the href
        const [page, queryString] = href.split('?');
        const url = new URL(page, window.location.origin);

        // Merge existing query params from href
        if (queryString) {
            const existingParams = new URLSearchParams(queryString);
            for (const [key, value] of existingParams) {
                url.searchParams.set(key, value);
            }
        }

        // Merge additional params
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, String(value));
            }
        });

        // Full page navigation (static HTML files)
        window.location.href = url.pathname + url.search;
    }

    /**
     * Navigate to a course sub-page
     */
    navigateToCourse(courseId, page = 'class.html') {
        this.navigate(page, { course_id: courseId });
    }

    /**
     * Navigate to assignment detail
     */
    navigateToAssignment(courseId, assignmentId) {
        this.navigate('assignment-detail.html', {
            course_id: courseId,
            assignment_id: assignmentId,
        });
    }

    /**
     * Navigate to discussion thread
     */
    navigateToDiscussion(courseId, topicId) {
        this.navigate('discussion-thread.html', {
            course_id: courseId,
            topic_id: topicId,
        });
    }

    /**
     * Navigate to quiz
     */
    navigateToQuiz(courseId, quizId, action = 'show') {
        const pages = {
            show: 'quiz-show.html',
            take: 'quiz-take.html',
            results: 'quiz-results.html',
        };
        this.navigate(pages[action] || 'quiz-show.html', {
            course_id: courseId,
            quiz_id: quizId,
        });
    }

    /**
     * Navigate to page view
     */
    navigateToPage(courseId, pageUrl) {
        this.navigate('page-view.html', {
            course_id: courseId,
            page_url: pageUrl,
        });
    }

    /**
     * Navigate back (with fallback)
     */
    back(fallback = 'dashboard.html') {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            this.navigate(fallback);
        }
    }

    /**
     * Build a URL with params (for link href attributes)
     */
    buildUrl(page, params = {}) {
        const url = new URL(page, window.location.origin);
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, String(value));
            }
        });
        return url.pathname + url.search;
    }
}

// Export as global
window.ReDefinersRouter = new ReDefinersRouter();
