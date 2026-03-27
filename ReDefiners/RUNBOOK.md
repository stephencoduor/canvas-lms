# ReDefiners - Operational Runbook

> Canvas LMS Custom Frontend Operations Guide
> Version: 1.0.0
> Last Updated: 2026-03-19

---

## Table of Contents

1. [Quick Reference](#1-quick-reference)
2. [Environment Setup](#2-environment-setup)
3. [Local Development](#3-local-development)
4. [Canvas LMS Configuration](#4-canvas-lms-configuration)
5. [Deployment Procedures](#5-deployment-procedures)
6. [Monitoring & Health Checks](#6-monitoring--health-checks)
7. [Troubleshooting Guide](#7-troubleshooting-guide)
8. [Incident Response](#8-incident-response)
9. [Maintenance Procedures](#9-maintenance-procedures)
10. [Security Operations](#10-security-operations)
11. [Spec-Kit Pipeline Runbook](#11-spec-kit-pipeline-runbook)
12. [Rollback Procedures](#12-rollback-procedures)
13. [Contact & Escalation](#13-contact--escalation)

---

## 1. Quick Reference

### Key URLs

| Resource | URL |
|---|---|
| Application (production) | `https://your-app-domain.com` |
| Application (staging) | `https://staging.your-app-domain.com` |
| Canvas LMS instance | `https://your-institution.instructure.com` |
| Canvas Admin panel | `https://your-institution.instructure.com/accounts/1` |
| Canvas Developer Keys | `https://your-institution.instructure.com/accounts/1/developer_keys` |
| GitHub repo (spec-kit) | `https://github.com/stephencoduor/spec-kit-private.git` |
| Canvas API docs | `https://developerdocs.instructure.com/services/canvas` |

### Key Commands

```bash
# Start development server
npm run dev

# Run production build
npm run build

# Start production server
npm start

# Run tests
npm test

# Check Canvas API connectivity
curl -H "Authorization: Bearer $CANVAS_TOKEN" \
  "$CANVAS_BASE_URL/api/v1/users/self"

# View application logs
pm2 logs redefiners

# Restart application
pm2 restart redefiners

# Check application status
pm2 status
```

### Critical Environment Variables

| Variable | Description | Where Set |
|---|---|---|
| `CANVAS_BASE_URL` | Canvas instance URL | `.env` / hosting secrets |
| `CANVAS_CLIENT_ID` | OAuth2 Developer Key ID | `.env` / hosting secrets |
| `CANVAS_CLIENT_SECRET` | OAuth2 Developer Key secret | `.env` / hosting secrets |
| `CANVAS_REDIRECT_URI` | OAuth callback URL | `.env` / hosting secrets |
| `SESSION_SECRET` | Express session encryption key | `.env` / hosting secrets |
| `PORT` | Application port | `.env` (default: 3000) |
| `NODE_ENV` | Environment mode | `.env` |
| `REDIS_URL` | Session store (if using Redis) | `.env` / hosting secrets |

---

## 2. Environment Setup

### Prerequisites

| Tool | Minimum Version | Check Command |
|---|---|---|
| Node.js | 18.x LTS | `node --version` |
| npm | 9.x | `npm --version` |
| Git | 2.x | `git --version` |
| Redis (optional) | 7.x | `redis-cli ping` |

### Initial Setup

```bash
# 1. Clone the repository
git clone https://github.com/stephencoduor/spec-kit-private.git
cd spec-kit-private

# 2. Install dependencies (once package.json exists)
npm install

# 3. Create environment file
cp .env.example .env

# 4. Edit .env with your Canvas credentials
#    (See Section 4 for obtaining Canvas Developer Keys)

# 5. Verify Canvas connectivity
node -e "
const https = require('https');
const url = process.env.CANVAS_BASE_URL + '/api/v1/users/self';
// Quick connectivity check
"
```

### Static-Only Development (Current State)

While the project is still a static template without a backend:

```bash
# Option A: Python simple server
python -m http.server 8080

# Option B: Node simple server
npx serve .

# Option C: VS Code Live Server extension
# Right-click login.html → Open with Live Server
```

Open `http://localhost:8080/login.html` to view the template.

---

## 3. Local Development

### Development Workflow

```bash
# 1. Start the development server
npm run dev
# Server starts at http://localhost:3000

# 2. Make changes to HTML/CSS/JS files
#    Changes are served immediately (static files)
#    Server-side changes require restart

# 3. Test Canvas API integration
#    Use browser DevTools Network tab to verify API calls
#    Check proxy server logs for errors

# 4. Run linting
npm run lint

# 5. Run tests
npm test
```

### File Editing Guide

| Change Type | Files to Edit | Notes |
|---|---|---|
| Page layout | `*.html` | Modify HTML structure |
| Styling | `styles.css` | Single CSS file, search by component name |
| Navigation links | All `*.html` files | Sidebar is duplicated in each file |
| API integration | `js/api.js` (to create) | Centralize all Canvas API calls |
| New page | Create `*.html` + add to sidebar nav | Follow existing page structure |

### Common Development Tasks

#### Adding a New Page

1. Copy an existing page (e.g., `dashboard.html`) as a starting point
2. Keep the left sidebar and top bar intact
3. Replace the main content area
4. Add navigation link to the sidebar in **all** HTML files
5. Add page-specific styles to `styles.css`

#### Modifying the Sidebar

The sidebar is **duplicated** in every HTML file. Any sidebar change must be applied to all 8 post-login pages:
- `dashboard.html`
- `courses.html`
- `classroom.html`
- `class.html`
- `calendar.html`
- `announcement.html`
- `inbox.html`
- `profile.html`

#### Adding Canvas API Integration to a Page

1. Create or update `js/api.js` with the new endpoint call
2. Add a loading state placeholder in the HTML
3. Write a render function in `js/render.js`
4. Call the API on page load: `document.addEventListener('DOMContentLoaded', fetchData)`
5. Handle errors: display user-friendly message on API failure

---

## 4. Canvas LMS Configuration

### Creating a Developer Key

**Who can do this**: Canvas Account Admin

1. Log into Canvas as an admin
2. Navigate to **Admin** → select your account
3. Click **Developer Keys** in the left sidebar
4. Click **+ Developer Key** → **+ API Key**
5. Fill in:
   - **Key Name**: `ReDefiners Frontend`
   - **Owner Email**: your admin email
   - **Redirect URIs**:
     - `http://localhost:3000/auth/callback` (development)
     - `https://your-app-domain.com/auth/callback` (production)
   - **Icon URL**: (optional) link to your app icon
6. Under **Enforce Scopes**, toggle ON and select required scopes:
   ```
   Courses - read
   Assignments - read, submit
   Calendar Events - read, create
   Announcements - read
   Conversations - read, create
   Users - read (self)
   Enrollments - read
   Discussion Topics - read
   Modules - read
   ```
7. Click **Save Key**
8. Copy the numeric **ID** (this is your `CANVAS_CLIENT_ID`)
9. Click **Show Key** to reveal the secret (this is your `CANVAS_CLIENT_SECRET`)
10. Set the key state to **ON**

### Testing the Developer Key

```bash
# Step 1: Open this URL in a browser (replace values)
# https://YOUR_CANVAS.instructure.com/login/oauth2/auth?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:3000/auth/callback

# Step 2: After Canvas login, you'll be redirected to:
# http://localhost:3000/auth/callback?code=AUTHORIZATION_CODE

# Step 3: Exchange the code for a token
curl -X POST https://YOUR_CANVAS.instructure.com/login/oauth2/token \
  -d "grant_type=authorization_code" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=http://localhost:3000/auth/callback" \
  -d "code=AUTHORIZATION_CODE"

# Step 4: Test the token
curl -H "Authorization: Bearer ACCESS_TOKEN" \
  https://YOUR_CANVAS.instructure.com/api/v1/users/self
```

### Canvas Instance Settings

Verify these settings in your Canvas instance:
- **CORS**: Not natively supported (proxy required)
- **API Rate Limits**: Default limits apply; contact Instructure for increases
- **File Storage**: Check quota for assignment submissions
- **Conversation Settings**: Ensure messaging is enabled for all users

---

## 5. Deployment Procedures

### Pre-Deployment Checklist

```
[ ] All environment variables set in production environment
[ ] Canvas Developer Key configured with production redirect URI
[ ] Canvas Developer Key state is ON
[ ] SSL certificate configured for production domain
[ ] Session secret is unique and secure (min 32 chars)
[ ] Node.js version matches local development version
[ ] npm ci (clean install) completes without errors
[ ] All tests pass
[ ] Static assets optimized (images compressed, CSS minified)
[ ] Error pages configured (404, 500)
[ ] Logging configured (stdout for container, file for VM)
[ ] Health check endpoint responds
```

### Deployment Option A: VPS / VM (Nginx + PM2)

```bash
# On the server:

# 1. Clone and install
git clone https://github.com/stephencoduor/spec-kit-private.git /opt/redefiners
cd /opt/redefiners
npm ci --production

# 2. Set environment variables
cp .env.example .env
nano .env  # Configure all required variables

# 3. Start with PM2
pm2 start server/index.js --name redefiners
pm2 save
pm2 startup  # Enable auto-start on reboot

# 4. Configure Nginx as reverse proxy
# /etc/nginx/sites-available/redefiners
```

**Nginx Configuration:**

```nginx
server {
    listen 443 ssl;
    server_name your-app-domain.com;

    ssl_certificate /etc/ssl/certs/your-cert.pem;
    ssl_certificate_key /etc/ssl/private/your-key.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /Images/ {
        alias /opt/redefiners/public/Images/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /styles.css {
        alias /opt/redefiners/public/styles.css;
        expires 7d;
    }
}
```

```bash
# Enable and test Nginx config
sudo ln -s /etc/nginx/sites-available/redefiners /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Deployment Option B: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
USER node
CMD ["node", "server/index.js"]
```

```bash
# Build and run
docker build -t redefiners .
docker run -d \
  --name redefiners \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  redefiners
```

### Deployment Option C: Static-Only (Current State)

While the project has no backend, deploy static files to:

| Platform | Command/Steps |
|---|---|
| GitHub Pages | Push to `gh-pages` branch or configure in repo settings |
| Netlify | Connect repo, set publish directory to `.` |
| AWS S3 + CloudFront | `aws s3 sync . s3://your-bucket --exclude ".git/*"` |
| Vercel | `npx vercel --prod` |

**Note**: Static deployment cannot integrate with Canvas API due to CORS. Use only for UI review and design iteration.

### Post-Deployment Verification

```bash
# 1. Check application is running
curl -f https://your-app-domain.com/health || echo "FAIL"

# 2. Test login flow
# Open https://your-app-domain.com/login.html in browser
# Click login → should redirect to Canvas

# 3. Verify API proxy
curl -v https://your-app-domain.com/api/courses \
  -H "Cookie: session=YOUR_SESSION_COOKIE"

# 4. Check error handling
curl https://your-app-domain.com/api/nonexistent
# Should return structured error, not stack trace

# 5. Verify static assets
curl -I https://your-app-domain.com/styles.css
# Check Content-Type and Cache-Control headers
```

---

## 6. Monitoring & Health Checks

### Health Check Endpoint

Implement at `GET /health`:

```json
{
  "status": "ok",
  "timestamp": "2026-03-19T10:00:00Z",
  "version": "1.0.0",
  "checks": {
    "canvas_api": "reachable",
    "session_store": "connected"
  }
}
```

### Key Metrics to Monitor

| Metric | Warning Threshold | Critical Threshold |
|---|---|---|
| Response time (p95) | > 2s | > 5s |
| Error rate (5xx) | > 1% | > 5% |
| Canvas API latency | > 3s | > 10s |
| Canvas rate limit remaining | < 200 | < 50 |
| Memory usage | > 80% | > 95% |
| CPU usage | > 70% | > 90% |
| Active sessions | > 80% capacity | > 95% capacity |

### Log Locations

| Log | Location | Content |
|---|---|---|
| Application | `pm2 logs redefiners` / stdout | Request logs, API proxy logs |
| Nginx access | `/var/log/nginx/access.log` | HTTP request log |
| Nginx error | `/var/log/nginx/error.log` | Proxy errors, upstream failures |
| System | `journalctl -u redefiners` | Service start/stop, crashes |

### Uptime Monitoring

Set up external monitoring (UptimeRobot, Pingdom, or similar) for:
- `GET /health` — expect 200 response
- `GET /login.html` — expect 200 response
- Canvas API reachability (from your proxy)

---

## 7. Troubleshooting Guide

### Problem: Login Redirects to Canvas but Fails

| Check | Command | Expected |
|---|---|---|
| Developer Key is ON | Canvas Admin > Developer Keys | State = ON |
| Redirect URI matches | Compare .env to Canvas config | Exact match including protocol |
| Client ID correct | Compare .env to Canvas | Numeric ID matches |
| Client Secret correct | Regenerate if unsure | Secret was copied correctly |

**Resolution Steps:**
1. Check browser Network tab for the OAuth redirect URL
2. Verify all URL parameters match Canvas configuration
3. Check server logs for token exchange errors
4. Try generating a new Developer Key if secret may be compromised

### Problem: API Calls Return 401 Unauthorized

```bash
# Check if token is expired
curl -v -H "Authorization: Bearer $TOKEN" \
  $CANVAS_BASE_URL/api/v1/users/self

# If expired, check refresh token logic in server logs
pm2 logs redefiners --lines 50 | grep "token"
```

**Resolution:**
1. Token expired (1hr TTL) → Verify refresh token flow is working
2. Token revoked → User must re-authenticate
3. Scopes insufficient → Update Developer Key scopes in Canvas Admin

### Problem: API Calls Return 403 Forbidden

**Possible causes:**
1. **Rate limited**: Check `X-Rate-Limit-Remaining` header
2. **Insufficient permissions**: User lacks access to the resource
3. **Scopes not enabled**: Developer Key missing required scopes

```bash
# Check rate limit headers
curl -v -H "Authorization: Bearer $TOKEN" \
  $CANVAS_BASE_URL/api/v1/courses 2>&1 | grep "X-Rate"
```

### Problem: Canvas API Returns Empty Data

1. Verify the authenticated user is enrolled in courses
2. Check `enrollment_state` parameter (active vs all)
3. Confirm the Canvas instance has the expected data
4. Test directly in Canvas web UI to verify data exists

### Problem: Static Assets Not Loading

```bash
# Check file paths
ls -la public/Images/
ls -la public/styles.css

# Verify Nginx static file config
nginx -t

# Check browser console for 404s
# Open DevTools → Console → look for failed resource loads
```

### Problem: Mobile Layout Broken

1. Check viewport meta tag in HTML head:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```
2. Test at 890px breakpoint (the single responsive breakpoint)
3. Verify `.res-hide` and `.res-show` classes are applied correctly
4. Check for inline styles overriding responsive CSS

### Problem: Calendar Not Displaying Events

1. Verify Materialize CSS is loading (CDN dependency)
2. Check Canvas calendar events API returns data for the date range
3. Verify date format conversion between Canvas ISO 8601 and display format
4. Check browser console for JavaScript errors

### Problem: Session Lost / User Logged Out Unexpectedly

1. Check session store (Redis) connectivity
2. Verify `SESSION_SECRET` hasn't changed (invalidates all sessions)
3. Check cookie settings (`secure`, `sameSite`, `httpOnly`)
4. Verify `express-session` configuration matches deployment (proxy trust)

---

## 8. Incident Response

### Severity Levels

| Level | Definition | Response Time | Examples |
|---|---|---|---|
| **P1 - Critical** | Service completely down, all users affected | 15 min | App unreachable, Canvas auth broken for all |
| **P2 - Major** | Core feature broken, many users affected | 1 hour | API proxy down, sessions lost |
| **P3 - Minor** | Non-core feature broken, workaround exists | 4 hours | Calendar not loading, styling issues |
| **P4 - Low** | Cosmetic issue, minimal impact | 24 hours | Icon missing, minor alignment issue |

### Incident Response Steps

#### P1 - Service Down

```bash
# 1. Verify the issue
curl -f https://your-app-domain.com/health

# 2. Check application process
pm2 status
pm2 logs redefiners --lines 100

# 3. Check system resources
free -m
df -h
top -n 1

# 4. Check Nginx
systemctl status nginx
tail -50 /var/log/nginx/error.log

# 5. Attempt restart
pm2 restart redefiners

# 6. If restart fails, check for port conflicts
lsof -i :3000
netstat -tlnp | grep 3000

# 7. Check Canvas API availability
curl -o /dev/null -s -w "%{http_code}" \
  $CANVAS_BASE_URL/api/v1/users/self \
  -H "Authorization: Bearer $CANVAS_TOKEN"

# 8. If Canvas is down, check status page
# https://status.instructure.com
```

#### P2 - Feature Broken

```bash
# 1. Identify the failing component from logs
pm2 logs redefiners --lines 200 | grep -i error

# 2. Test the specific API endpoint
curl -v https://your-app-domain.com/api/[endpoint]

# 3. Compare with direct Canvas API call
curl -v -H "Authorization: Bearer $TOKEN" \
  $CANVAS_BASE_URL/api/v1/[endpoint]

# 4. Check for recent deployments
git log --oneline -5

# 5. Rollback if needed (see Section 12)
```

---

## 9. Maintenance Procedures

### Regular Maintenance Schedule

| Task | Frequency | Procedure |
|---|---|---|
| Review application logs | Daily | `pm2 logs redefiners` — check for errors |
| Check Canvas API rate limit usage | Weekly | Review proxy logs for 403 responses |
| Update Node.js dependencies | Monthly | `npm audit` + `npm update` |
| Rotate session secrets | Quarterly | Update `SESSION_SECRET`, restart app |
| Review Canvas Developer Key scopes | Quarterly | Verify only needed scopes are enabled |
| SSL certificate renewal | Before expiry | Auto-renew with certbot or manual update |
| Backup configuration | Monthly | Copy `.env` to secure storage |
| Test disaster recovery | Quarterly | Verify deployment from scratch works |

### Updating the Application

```bash
# 1. Pull latest changes
cd /opt/redefiners
git pull origin main

# 2. Install any new dependencies
npm ci --production

# 3. Run tests (if available)
npm test

# 4. Restart application
pm2 restart redefiners

# 5. Verify health
curl -f https://your-app-domain.com/health

# 6. Monitor logs for errors
pm2 logs redefiners --lines 20
```

### Updating Static Assets

When modifying HTML/CSS/JS without server changes:

```bash
# 1. Pull changes
git pull origin main

# 2. Clear Nginx cache (if caching is enabled)
sudo rm -rf /var/cache/nginx/*
sudo systemctl reload nginx

# 3. Verify in browser (hard refresh: Ctrl+Shift+R)
```

### Canvas LMS Updates

When your Canvas instance is updated:

1. Check Canvas release notes for API changes
2. Test all API endpoints in staging
3. Verify no DOM changes affect any custom JS injection (if used)
4. Update any deprecated API endpoint calls
5. Re-test full user workflow

---

## 10. Security Operations

### Security Checklist

```
[ ] HTTPS enforced on all routes (redirect HTTP → HTTPS)
[ ] Session cookies: httpOnly=true, secure=true, sameSite=strict
[ ] Canvas OAuth tokens stored server-side only (never in client)
[ ] CANVAS_CLIENT_SECRET not committed to git
[ ] .env file in .gitignore
[ ] Helmet.js middleware enabled (security headers)
[ ] Rate limiting on auth endpoints
[ ] Input sanitization on any user-submitted content
[ ] CSP (Content Security Policy) headers configured
[ ] No sensitive data in URL parameters
[ ] Error pages do not expose stack traces in production
```

### Token Security

- Access tokens expire in **1 hour** — implement automatic refresh
- Store tokens in server-side session, never in `localStorage` or cookies
- On logout, call `DELETE /login/oauth2/token` to revoke the token
- Refresh tokens should be encrypted at rest if stored in a database

### Dependency Security

```bash
# Check for known vulnerabilities
npm audit

# Auto-fix where possible
npm audit fix

# Review and update outdated packages
npm outdated
```

---

## 11. Spec-Kit Pipeline Runbook

### Pipeline Overview

The Spec-Kit pipeline from `https://github.com/stephencoduor/spec-kit-private.git` follows a sequential workflow. Each stage must complete before the next begins.

### Running the Pipeline

```
Stage 1: /speckit.constitution
  Purpose: Establish project principles, constraints, and non-negotiables
  Input:   Project description, stakeholder requirements
  Output:  spec-kit/constitution.md
  Duration: ~30 min

Stage 2: /speckit.specify
  Purpose: Define detailed functional specifications
  Input:   Constitution + feature requirements
  Output:  spec-kit/specification.md
  Duration: ~1-2 hours

Stage 3: /speckit.clarify
  Purpose: Resolve ambiguities, confirm assumptions
  Input:   Specification + stakeholder Q&A
  Output:  spec-kit/clarifications.md
  Duration: ~30-60 min

Stage 4: /speckit.plan
  Purpose: Create implementation plan with phases and milestones
  Input:   Specification + clarifications
  Output:  spec-kit/plan.md
  Duration: ~1 hour

Stage 5: /speckit.tasks
  Purpose: Break plan into executable, assignable tasks
  Input:   Implementation plan
  Output:  spec-kit/tasks.md
  Duration: ~30-60 min

Stage 6: /speckit.analyze
  Purpose: Analyze dependencies, risks, and blockers
  Input:   Tasks + codebase state
  Output:  spec-kit/analysis.md
  Duration: ~30-60 min

Stage 7: /speckit.checklist
  Purpose: Generate pre-implementation checklist
  Input:   Analysis + tasks
  Output:  spec-kit/checklist.md
  Duration: ~15-30 min

Stage 8: /speckit.implement
  Purpose: Execute implementation based on all prior artifacts
  Input:   All prior spec-kit artifacts + codebase
  Output:  Working code changes
  Duration: Varies by scope
```

### Pipeline Recovery

If a stage fails or produces unsatisfactory output:
1. Do **not** skip ahead — re-run the failed stage
2. If the issue stems from an earlier stage, re-run from that stage forward
3. Commit spec-kit artifacts after each successful stage for traceability

### Artifact Storage

```bash
# Create spec-kit directory
mkdir -p spec-kit

# After each stage, commit the artifact
git add spec-kit/
git commit -m "spec-kit: complete [stage-name] phase"
git push origin main
```

---

## 12. Rollback Procedures

### Application Rollback

```bash
# 1. Identify the last known good commit
git log --oneline -10

# 2. Deploy the previous version
git checkout <commit-hash>
npm ci --production
pm2 restart redefiners

# 3. Verify
curl -f https://your-app-domain.com/health

# 4. Once stable, create a fix branch from main
git checkout main
git checkout -b fix/rollback-issue
# Apply fix, test, merge
```

### Configuration Rollback

```bash
# If .env changes caused issues
# Restore from backup
cp /secure-backups/.env.backup .env
pm2 restart redefiners
```

### Canvas Configuration Rollback

1. If Developer Key changes caused issues:
   - Revert to previous redirect URIs
   - Re-enable previously enabled scopes
   - Toggle key OFF then ON if state is uncertain

2. If Canvas theme changes caused issues:
   - Go to Canvas Admin > Themes
   - Revert to previous theme or default

---

## 13. Contact & Escalation

### Escalation Matrix

| Issue Type | First Contact | Escalation |
|---|---|---|
| Application bugs | Development team | Tech lead |
| Canvas API issues | Canvas admin | Instructure support |
| Infrastructure | DevOps / hosting provider | SRE team |
| Security incident | Security team | CISO |
| Canvas outage | Check status.instructure.com | Instructure support case |

### External Resources

| Resource | URL |
|---|---|
| Canvas API Documentation | https://developerdocs.instructure.com/services/canvas |
| Canvas Community | https://community.canvaslms.com |
| Instructure Status Page | https://status.instructure.com |
| Canvas GitHub (open source) | https://github.com/instructure/canvas-lms |
| Instructure Support | https://cases.canvaslms.com |
| Spec-Kit Repository | https://github.com/stephencoduor/spec-kit-private.git |

---

## 14. Canvas API Operations

### Rate Limit Monitoring

Canvas API uses a "request cost" model rather than simple request counting.

```bash
# Check current rate limit status from a recent response
curl -v -H "Authorization: Bearer $TOKEN" \
  $CANVAS_BASE_URL/api/v1/users/self 2>&1 | grep -i "x-rate"

# Expected headers:
# X-Request-Cost: 0.05
# X-Rate-Limit-Remaining: 700.0
```

**Rate Limit Thresholds**:

| Remaining | Action |
|---|---|
| > 300 | Normal operation |
| 100–300 | Log warning, reduce background polling frequency |
| 50–100 | Pause non-critical requests, serve cached data |
| < 50 | Stop all requests except auth refresh, serve cached data for 60s |
| 0 (403 response) | Full backoff, wait for `Retry-After` header, alert ops team |

**Proxy implementation pattern**:

```javascript
// In proxy middleware - track rate limits
app.use('/api/*', async (req, res, next) => {
    const canvasRes = await fetch(canvasUrl, { headers });
    const remaining = parseFloat(canvasRes.headers.get('X-Rate-Limit-Remaining'));

    // Forward rate info to client
    res.set('X-Canvas-Rate-Remaining', remaining);

    if (remaining < 50) {
        console.warn(`[RATE LIMIT] Low: ${remaining} remaining`);
        // Return cached response if available
    }
});
```

### Canvas File Upload Protocol

Canvas uses a three-step file upload process. This is required for assignment submissions, inbox attachments, profile avatars, and course files.

```bash
# Step 1: Notify Canvas about the file (get upload URL)
curl -X POST "$CANVAS_BASE_URL/api/v1/courses/$COURSE_ID/assignments/$ASSIGNMENT_ID/submissions/self/files" \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=homework.pdf" \
  -F "size=1048576" \
  -F "content_type=application/pdf"

# Response: { "upload_url": "https://...", "upload_params": { "key": "...", ... } }

# Step 2: Upload the file to the returned URL
curl -X POST "$UPLOAD_URL" \
  -F "key=$KEY" \
  -F "file=@homework.pdf"

# Response: 301 redirect with Location header containing confirmation URL

# Step 3: Confirm the upload
curl -X POST "$CONFIRMATION_URL" \
  -H "Authorization: Bearer $TOKEN"

# Response: { "id": 12345, "display_name": "homework.pdf", ... }
# Use this file ID in the submission
```

### Canvas Pagination Handling

```bash
# All list endpoints are paginated. Check Link header:
curl -v -H "Authorization: Bearer $TOKEN" \
  "$CANVAS_BASE_URL/api/v1/courses?per_page=50" 2>&1 | grep "^< Link:"

# Parse Link header for rel="next"
# Link: <https://canvas.example.com/api/v1/courses?page=2&per_page=50>; rel="next",
#        <https://canvas.example.com/api/v1/courses?page=5&per_page=50>; rel="last"

# IMPORTANT: Always use the URL from the Link header.
# Never construct pagination URLs manually.
# Maximum per_page is 100 for most endpoints.
```

### Canvas Token Refresh

```bash
# Tokens expire after 1 hour. Refresh before expiry:
curl -X POST "$CANVAS_BASE_URL/login/oauth2/token" \
  -d "grant_type=refresh_token" \
  -d "client_id=$CLIENT_ID" \
  -d "client_secret=$CLIENT_SECRET" \
  -d "refresh_token=$REFRESH_TOKEN"

# Response: { "access_token": "new_token", "token_type": "Bearer", "expires_in": 3600 }
# Note: refresh_token does NOT change. Store and reuse it.
```

### Canvas API Testing Script

Save as `scripts/test-canvas-api.sh`:

```bash
#!/bin/bash
# Test all Canvas API endpoint families used by ReDefiners
# Usage: CANVAS_BASE_URL=https://... TOKEN=... ./test-canvas-api.sh

BASE="$CANVAS_BASE_URL/api/v1"
AUTH="Authorization: Bearer $TOKEN"

echo "=== Canvas API Connectivity Test ==="
echo "Instance: $CANVAS_BASE_URL"
echo ""

test_endpoint() {
    local name="$1"
    local url="$2"
    local status=$(curl -s -o /dev/null -w "%{http_code}" -H "$AUTH" "$url")
    if [ "$status" = "200" ]; then
        echo "[PASS] $name ($status)"
    else
        echo "[FAIL] $name ($status)"
    fi
}

# Tier 1 - Core
echo "--- Tier 1: Core ---"
test_endpoint "User Profile"         "$BASE/users/self/profile"
test_endpoint "Courses"              "$BASE/courses?per_page=1"
test_endpoint "Todo Items"           "$BASE/users/self/todo"
test_endpoint "Upcoming Events"      "$BASE/users/self/upcoming_events"
test_endpoint "Calendar Events"      "$BASE/calendar_events?per_page=1"
test_endpoint "Conversations"        "$BASE/conversations?per_page=1"
test_endpoint "Planner Items"        "$BASE/planner/items?per_page=1"
test_endpoint "Favorites"            "$BASE/users/self/favorites/courses"

# Get first course ID for course-scoped tests
COURSE_ID=$(curl -s -H "$AUTH" "$BASE/courses?per_page=1" | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])" 2>/dev/null)

if [ -n "$COURSE_ID" ]; then
    echo ""
    echo "--- Course-scoped (course_id=$COURSE_ID) ---"
    test_endpoint "Assignments"      "$BASE/courses/$COURSE_ID/assignments?per_page=1"
    test_endpoint "Assignment Groups" "$BASE/courses/$COURSE_ID/assignment_groups"
    test_endpoint "Modules"          "$BASE/courses/$COURSE_ID/modules?per_page=1"
    test_endpoint "Enrollments"      "$BASE/courses/$COURSE_ID/enrollments?per_page=1"
    test_endpoint "Tabs"             "$BASE/courses/$COURSE_ID/tabs"

    # Tier 2 - Essential
    echo ""
    echo "--- Tier 2: Essential ---"
    test_endpoint "Discussion Topics" "$BASE/courses/$COURSE_ID/discussion_topics?per_page=1"
    test_endpoint "Announcements"    "$BASE/announcements?context_codes[]=course_$COURSE_ID&per_page=1"
    test_endpoint "Pages"            "$BASE/courses/$COURSE_ID/pages?per_page=1"
    test_endpoint "Quizzes"          "$BASE/courses/$COURSE_ID/quizzes?per_page=1"
    test_endpoint "Files"            "$BASE/courses/$COURSE_ID/files?per_page=1"
    test_endpoint "Rubrics"          "$BASE/courses/$COURSE_ID/rubrics?per_page=1"

    # Tier 3 - Extended
    echo ""
    echo "--- Tier 3: Extended ---"
    test_endpoint "Users (Roster)"   "$BASE/courses/$COURSE_ID/users?per_page=1"
    test_endpoint "Sections"         "$BASE/courses/$COURSE_ID/sections"
    test_endpoint "Conferences"      "$BASE/courses/$COURSE_ID/conferences"
    test_endpoint "Group Categories" "$BASE/courses/$COURSE_ID/group_categories"

    # Tier 4 - Instructor
    echo ""
    echo "--- Tier 4: Instructor ---"
    test_endpoint "Analytics Activity" "$BASE/courses/$COURSE_ID/analytics/activity"
    test_endpoint "Course Settings"  "$BASE/courses/$COURSE_ID/settings"
    test_endpoint "External Tools"   "$BASE/courses/$COURSE_ID/external_tools?per_page=1"
fi

echo ""
echo "--- Rate Limit Status ---"
curl -s -D - -o /dev/null -H "$AUTH" "$BASE/users/self" 2>&1 | grep -i "x-rate"

echo ""
echo "=== Test Complete ==="
```

### Canvas Instance Health Check

```bash
# Quick check: is the Canvas instance reachable?
curl -s -o /dev/null -w "%{http_code}" "$CANVAS_BASE_URL/api/v1/users/self" \
  -H "Authorization: Bearer $TOKEN"
# 200 = healthy, 401 = token expired, 403 = rate limited, 5xx = Canvas issue

# Check Instructure status page programmatically
curl -s https://status.instructure.com/api/v2/status.json | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f'Canvas Status: {data[\"status\"][\"description\"]}')
print(f'Indicator: {data[\"status\"][\"indicator\"]}')
"
```

---

## 15. Canvas Release Compatibility

### Tracking Canvas Updates

Canvas is deployed on a **3-week release cycle**. Updates can affect:
- API response formats (new fields, deprecated fields)
- API endpoint behavior
- Feature flags
- LTI tool configurations
- Theme/branding options

### Pre-Update Checklist

```
[ ] Review Canvas release notes (community.canvaslms.com/t5/Canvas-Releases)
[ ] Check for deprecated API endpoints used by ReDefiners
[ ] Review new API features that could improve the frontend
[ ] Test all pages against Canvas Beta environment (if available)
[ ] Update any hardcoded Canvas UI references
[ ] Verify no scope changes in Developer Key
[ ] Run full Canvas API test script (Section 14)
[ ] Update CANVAS_API_CATALOG.md if endpoints change
```

### Canvas Beta Testing

If your institution has a Beta environment:

```bash
# Set beta URL
export CANVAS_BETA_URL="https://your-institution.beta.instructure.com"

# Run API tests against beta
CANVAS_BASE_URL=$CANVAS_BETA_URL TOKEN=$BETA_TOKEN ./scripts/test-canvas-api.sh

# Compare responses between production and beta
diff <(curl -s -H "Authorization: Bearer $PROD_TOKEN" "$CANVAS_PROD_URL/api/v1/courses?per_page=1" | python3 -m json.tool) \
     <(curl -s -H "Authorization: Bearer $BETA_TOKEN" "$CANVAS_BETA_URL/api/v1/courses?per_page=1" | python3 -m json.tool)
```

---

## 16. Performance Optimization

### Canvas API Response Caching

| Endpoint | Cache TTL | Invalidation |
|---|---|---|
| `/api/v1/users/self` | 5 minutes | On profile update |
| `/api/v1/courses` | 10 minutes | On enrollment change |
| `/api/v1/courses/:id/tabs` | 1 hour | On course settings change |
| `/api/v1/courses/:id/modules` | 5 minutes | On module update |
| `/api/v1/courses/:id/assignments` | 2 minutes | On assignment create/update |
| `/api/v1/calendar_events` | 2 minutes | On event create/update/delete |
| `/api/v1/conversations` | 1 minute | On new message |
| `/api/v1/announcements` | 5 minutes | On new announcement |
| `/api/v1/courses/:id/pages` | 10 minutes | On page edit |
| `/api/v1/courses/:id/files/quota` | 30 minutes | On file upload/delete |

### Frontend Performance Targets

| Metric | Target | Current | Tool |
|---|---|---|---|
| First Contentful Paint | < 1.5s | ~2.5s (CDN deps) | Lighthouse |
| Largest Contentful Paint | < 2.5s | ~4s (images) | Lighthouse |
| Total Blocking Time | < 200ms | ~150ms | Lighthouse |
| Cumulative Layout Shift | < 0.1 | ~0.15 | Lighthouse |
| CSS bundle size | < 50KB gzipped | ~25KB (styles.css) | Build tool |
| JS bundle size | < 100KB gzipped | ~80KB (jQuery+plugins) | Build tool |
| Image assets | < 2MB total | ~5MB (unoptimized) | ImageOptim |

### Optimization Actions

```bash
# 1. Optimize images (run before each deploy)
npx sharp-cli --input "public/Images/*.png" --output "public/Images/" --quality 80 --format webp

# 2. Minify CSS
npx csso public/styles.css --output public/styles.min.css

# 3. Self-host CDN dependencies (eliminate external network calls)
npm install bootstrap@5 @fortawesome/fontawesome-free
# Copy to public/vendor/

# 4. Preload critical fonts
# Add to <head>:
# <link rel="preload" href="/fonts/poppins-v20-latin-300.woff2" as="font" type="font/woff2" crossorigin>

# 5. Lazy load below-fold images
# Add loading="lazy" to all <img> tags not in the initial viewport
```
