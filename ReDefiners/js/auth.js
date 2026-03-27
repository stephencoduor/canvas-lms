/**
 * ReDefiners — Authentication Handler
 *
 * Manages Canvas LMS authentication flow.
 * Canvas uses session cookies for web auth — once logged in via /login,
 * all /api/v1/* requests include the session cookie automatically.
 *
 * Flow:
 * 1. Check if authenticated (GET /api/v1/users/self)
 * 2. If 401, redirect to Canvas login page
 * 3. After login, Canvas redirects back to our app
 * 4. Session cookie is set, all API calls work
 */

class ReDefinersAuth {
    constructor() {
        this._user = null;
        this._isAuthenticated = false;
        this._loginUrl = '/login/canvas';
        this._logoutUrl = '/logout';
        this._publicPages = [
            'login.html',
            'registration.html',
            'forgot-password.html',
            'error-404.html',
            'terms-of-service.html',
            'accessibility.html',
            'mobile-login.html',
            'confirm-email.html',
            'registration-confirmation.html',
        ];
    }

    /**
     * Check if the current page requires authentication
     */
    _isPublicPage() {
        const page = window.location.pathname.split('/').pop() || '';
        return this._publicPages.includes(page);
    }

    /**
     * Check authentication status by calling the user API
     * Returns the user profile if authenticated, null otherwise
     */
    async checkAuth() {
        if (this._isPublicPage()) {
            return null;
        }

        try {
            const response = await fetch('/api/v1/users/self/profile', {
                credentials: 'same-origin',
                headers: { 'Accept': 'application/json' },
            });

            if (response.ok) {
                this._user = await response.json();
                this._isAuthenticated = true;
                return this._user;
            }

            if (response.status === 401) {
                this._isAuthenticated = false;
                this.redirectToLogin();
                return null;
            }

            // Other errors — don't redirect, might be temporary
            console.warn('[Auth] Unexpected status:', response.status);
            return null;

        } catch (error) {
            // Network error — might be offline or API unreachable
            console.error('[Auth] Network error:', error.message);

            // If we're in dev mode (localhost), don't redirect
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.info('[Auth] Dev mode — skipping auth redirect');
                return null;
            }

            return null;
        }
    }

    /**
     * Get the currently authenticated user
     */
    getUser() {
        return this._user;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this._isAuthenticated;
    }

    /**
     * Check if user has a specific role
     */
    hasRole(role) {
        if (!this._user || !this._user.enrollments) return false;
        return this._user.enrollments.some(e => e.role === role);
    }

    /**
     * Check if user is an admin
     */
    isAdmin() {
        // Check for admin-level permissions
        return this._user && (
            this._user.permissions?.can_manage_account ||
            this._user.permissions?.become_user ||
            // Fallback: check if user has SiteAdmin or AccountAdmin role
            false
        );
    }

    /**
     * Check if user is a teacher in any course
     */
    isTeacher() {
        return this.hasRole('TeacherEnrollment');
    }

    /**
     * Redirect to Canvas login page
     */
    redirectToLogin() {
        const returnTo = encodeURIComponent(window.location.href);
        // Canvas will redirect back after successful login
        window.location.href = `${this._loginUrl}?return_to=${returnTo}`;
    }

    /**
     * Handle login form submission (for custom login page)
     * Posts credentials to Canvas login endpoint
     */
    async login(username, password) {
        try {
            const response = await fetch('/login/canvas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'same-origin',
                body: new URLSearchParams({
                    'pseudonym_session[unique_id]': username,
                    'pseudonym_session[password]': password,
                    'pseudonym_session[remember_me]': '1',
                }),
                redirect: 'manual',
            });

            // Canvas returns 302 on success
            if (response.status === 302 || response.type === 'opaqueredirect' || response.ok) {
                window.location.href = '/dashboard.html';
                return { success: true };
            }

            return {
                success: false,
                error: 'Invalid username or password. Please try again.',
            };

        } catch (error) {
            return {
                success: false,
                error: 'Unable to connect. Please check your network and try again.',
            };
        }
    }

    /**
     * Log out the current user
     */
    async logout() {
        try {
            await fetch(this._logoutUrl, {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: { 'Accept': 'application/json' },
            });
        } catch (e) {
            // Logout might fail silently — that's ok
        }
        window.location.href = 'login.html';
    }

    /**
     * Get an API access token (for long-lived integrations)
     */
    async generateToken(purpose = 'ReDefiners Frontend') {
        try {
            const response = await fetch('/api/v1/users/self/tokens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    token: { purpose },
                }),
            });

            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (e) {
            console.error('[Auth] Token generation failed:', e);
            return null;
        }
    }
}

// Export as global
window.ReDefinersAuth = new ReDefinersAuth();
