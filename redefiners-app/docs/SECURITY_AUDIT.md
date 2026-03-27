# ReDefiners Canvas LMS — Security Audit Report

**Date:** 2026-03-26
**Auditor:** Claude Opus 4.6
**Scope:** React SPA frontend + server infrastructure + deployment pipeline
**Status:** Active — remediation in progress

---

## Executive Summary

Identified **31 security findings** across the frontend, backend, and infrastructure:

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 5 | Fix in progress |
| HIGH | 6 | Fix in progress |
| MEDIUM | 10 | Planned |
| LOW | 10 | Backlog |

---

## CRITICAL FINDINGS

### C-001: Production Secrets Committed to Git
- **File:** `deploy/.env.production`
- **Issue:** Database passwords, encryption keys, and Rails secret_key_base are hardcoded and tracked in git history
- **Exposed secrets:**
  - `POSTGRES_PASSWORD=L_iQ02iorl6eW2xvxiuo0E5pXn1VrbxF`
  - `ENCRYPTION_KEY=4a6919c0aed5...` (64 chars)
  - `SECRET_KEY_BASE=ccdb67622a74...` (128 chars)
- **Impact:** Complete compromise of production database, session hijacking, data decryption
- **Remediation:**
  1. Rotate ALL secrets immediately
  2. Remove from git history with `git filter-repo`
  3. Use GitHub Secrets or Vault for secret management
  4. Add `.env.production` to `.gitignore`

### C-002: Missing Role-Based Access Control on Admin Pages
- **Files:** All files in `src/pages/admin/` (~15 pages)
- **Issue:** `ProtectedRoute` only checks if user is authenticated, NOT if user is admin. Any student can access `/admin/*` routes
- **Impact:** Privilege escalation — students can access user management, reports, permissions
- **Remediation:**
  1. Create `AdminRoute` wrapper component
  2. Check `user.role === 'admin'` or Canvas admin enrollment
  3. Wrap all `/admin/*` routes with `AdminRoute`

### C-003: XSS via dangerouslySetInnerHTML (13 instances)
- **Files:**
  - `AssignmentDetailPage.tsx:106` — `assignment.description`
  - `DiscussionThreadPage.tsx:58,140` — `entry.message`, `topic.message`
  - `QuizShowPage.tsx:99` — `quiz.description`
  - `QuizTakePage.tsx:42,66` — `question_text`, answer HTML
  - `QuizResultsPage.tsx:134,167` — question/answer HTML
  - `InboxPage.tsx:183` — `msg.body`
  - `SyllabusPage.tsx:67` — `course.syllabus_body`
  - `PageViewPage.tsx:90` — `page.body`
  - `QuestionBanksPage.tsx:189` — `q.question_text`
  - `QuizStatisticsPage.tsx:136` — question content
- **Issue:** Canvas API HTML content rendered without sanitization
- **Impact:** Stored XSS if Canvas stores malicious content
- **Remediation:**
  1. Install DOMPurify: `npm install dompurify @types/dompurify`
  2. Create `sanitizeHtml()` utility
  3. Replace all `dangerouslySetInnerHTML={{ __html: content }}` with `dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}`

### C-004: Deploying as Root User
- **File:** `.github/workflows/deploy.yml:12`
- **Issue:** `SERVER_USER: 'root'` — CI/CD deploys with root privileges
- **Impact:** Complete system compromise if SSH key is leaked
- **Remediation:**
  1. Create `deploy` user with limited sudo
  2. Restrict SSH key to deployment commands only
  3. Implement ForceCommand in sshd_config

### C-005: No CSRF Protection on State-Changing Requests
- **File:** `src/services/api-client.ts:78`
- **Issue:** POST/PUT/DELETE requests lack `X-CSRF-Token` header
- **Impact:** Cross-site request forgery — attacker site can make authenticated requests
- **Remediation:**
  1. Fetch CSRF token from Canvas (`GET /api/v1/users/self`)
  2. Include `X-CSRF-Token` header on all mutating requests

---

## HIGH FINDINGS

### H-001: Missing Content Security Policy Header
- **File:** `deploy/nginx/nginx.conf`
- **Issue:** No `Content-Security-Policy` header
- **Impact:** XSS attacks not mitigated by browser
- **Remediation:** Add CSP header to Nginx config

### H-002: Unrestricted File Upload Size (10GB)
- **File:** `deploy/nginx/nginx.conf:43` — `client_max_body_size 10g`
- **Issue:** Allows upload of files up to 10 gigabytes
- **Impact:** DoS via storage/memory exhaustion
- **Remediation:** Reduce to `500m` or `1g`

### H-003: Redis Without Authentication
- **File:** `deploy/docker-compose.production.yml`
- **Issue:** Redis runs without `--requirepass`
- **Impact:** If any container is compromised, Redis data (sessions, cache) is accessible
- **Remediation:** Add `--requirepass` to Redis command and update connection URL

### H-004: Missing Referrer-Policy Header
- **File:** `deploy/nginx/nginx.conf`
- **Impact:** Sensitive URL paths leaked via HTTP Referer header
- **Remediation:** `add_header Referrer-Policy "strict-origin-when-cross-origin";`

### H-005: Weak SSL Cipher Configuration
- **File:** `deploy/nginx/nginx.conf:32` — `ssl_ciphers HIGH:!aNULL:!MD5`
- **Impact:** May allow weaker ciphers
- **Remediation:** Use modern ECDHE-only cipher suite

### H-006: Insecure Theme Loading (Path Traversal Risk)
- **File:** `src/contexts/ThemeContext.tsx:37`
- **Issue:** Theme ID from localStorage used in URL without validation on initial load
- **Impact:** If combined with XSS, arbitrary CSS loading
- **Remediation:** Validate theme ID against whitelist on every load, not just on `setTheme()`

---

## MEDIUM FINDINGS

### M-001: No Rate Limiting
- **Location:** Nginx config
- **Impact:** Brute force, scraping, API abuse
- **Remediation:** Add `limit_req_zone` for login and API endpoints

### M-002: Missing Permissions-Policy Header
- **Impact:** Iframes could access camera, microphone
- **Remediation:** `add_header Permissions-Policy "camera=(), microphone=(), geolocation=()";`

### M-003: Excessive Proxy Timeouts (300s)
- **Impact:** Slow loris attacks, resource exhaustion
- **Remediation:** Reduce to 10s connect, 60s read/send

### M-004: No Memory Limit on Nginx Container
- **Impact:** Can consume all host memory
- **Remediation:** Add `memory: 512M` deploy limit

### M-005: PostgreSQL Without Connection Limits
- **Impact:** Connection exhaustion attacks
- **Remediation:** Set `max_connections=100`

### M-006: No Build Integrity Verification
- **Impact:** Corrupted/tampered builds deployed without checksums
- **Remediation:** Generate and verify SHA256 checksums

### M-007: No Deployment Audit Logging
- **Impact:** No forensic trail for security incidents
- **Remediation:** Log all deployment commands centrally

### M-008: IDOR on URL Parameters
- **Files:** Assignment, quiz, page URL params not validated
- **Note:** Canvas API enforces permissions server-side, so actual risk is low
- **Remediation:** Add frontend validation as defense-in-depth

### M-009: Missing OCSP Stapling
- **Impact:** Certificate revocation checks add latency
- **Remediation:** Enable `ssl_stapling on;` in Nginx

### M-010: ReactQueryDevtools in Production
- **File:** `src/App.tsx:24`
- **Impact:** Users can inspect API cache data
- **Remediation:** Conditionally include only in development

---

## LOW FINDINGS

### L-001: No Subresource Integrity for Theme CSS
### L-002: Service Worker Silent Error Handling
### L-003: Mail Server Domain Mismatch (`lms.k8s-gke.us` vs `fineract.us`)
### L-004: Missing gzip Compression
### L-005: Error Boundary May Expose Stack Traces
### L-006: localStorage Theme Without Integrity Check
### L-007: No Security.txt File
### L-008: Missing X-Robots-Tag for Private Pages
### L-009: No Cookie Secure/HttpOnly Flags Enforcement
### L-010: Missing Favicon Security (no SVG injection risk though)

---

## Remediation Plan

### Phase 1 — Immediate (24 hours)
| Finding | Action | Owner |
|---------|--------|-------|
| C-001 | Rotate all production secrets, remove from git history | DevOps |
| C-003 | Install DOMPurify, sanitize all 13 dangerouslySetInnerHTML | Frontend |
| C-002 | Create AdminRoute, wrap admin pages | Frontend |

### Phase 2 — Urgent (48 hours)
| Finding | Action | Owner |
|---------|--------|-------|
| C-004 | Create deploy user, restrict root SSH | DevOps |
| C-005 | Add CSRF token to API client | Frontend |
| H-001 | Add CSP header to Nginx | DevOps |
| H-003 | Enable Redis authentication | DevOps |

### Phase 3 — This Week
| Finding | Action | Owner |
|---------|--------|-------|
| H-002 | Reduce upload limit to 500m | DevOps |
| H-004 | Add Referrer-Policy header | DevOps |
| H-005 | Update SSL ciphers | DevOps |
| M-001 | Add rate limiting to Nginx | DevOps |
| M-010 | Remove devtools from production | Frontend |

### Phase 4 — Next Sprint
| Finding | Action | Owner |
|---------|--------|-------|
| M-002 to M-009 | Remaining medium fixes | Team |
| L-001 to L-010 | Low priority fixes | Team |

---

## Test Accounts

| Role | Email | Password | Use For |
|------|-------|----------|---------|
| Admin | admin@redefiners.org | ReDefiners2024! | Admin testing |
| Teacher | mgarcia@redefiners.edu | (set via Canvas) | Teacher flow testing |
| Student | aisha.johnson@redefiners.edu | (set via Canvas) | Student flow testing |

---

## Compliance Notes

- **OWASP Top 10 2021:** Findings map to A01 (Broken Access Control), A03 (Injection/XSS), A05 (Security Misconfiguration), A07 (Identification & Auth Failures)
- **FERPA:** Student data is protected server-side by Canvas, but frontend XSS could expose it
- **GDPR:** Data privacy settings page exists but needs actual policy enforcement

---

*Report generated by Claude Opus 4.6 security audit. Last updated: 2026-03-26.*
