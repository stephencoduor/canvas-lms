# Canvas LMS Production Deployment Guide

## Overview

Canvas LMS is deployed to a Hostinger VPS (148.230.111.247) at **https://fineract.us** using Docker Compose with the ReDefiners custom theme.

---

## Architecture

```
Internet
   │
   ▼
┌──────────────────────────────────────────────────┐
│  Hostinger VPS (148.230.111.247)                 │
│  Ubuntu 22.04 LTS, 8GB RAM                      │
│                                                  │
│  ┌─────────────────────────────────────────────┐ │
│  │  Docker Compose Stack                       │ │
│  │                                             │ │
│  │  nginx:alpine ──► canvas-web (Passenger)    │ │
│  │  :80/:443          :80                      │ │
│  │                      │                      │ │
│  │              ┌───────┴───────┐              │ │
│  │              ▼               ▼              │ │
│  │         postgres:14     redis:7             │ │
│  │           :5432          :6379              │ │
│  │                                             │ │
│  │  canvas-jobs (delayed_job worker)           │ │
│  │  certbot (SSL renewal)                      │ │
│  └─────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

---

## Services

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| **web** | canvas-lms (custom build) | 80 | Rails app via Passenger |
| **jobs** | canvas-lms (custom build) | — | Background job worker |
| **postgres** | postgres:14-alpine | 5432 | Database |
| **redis** | redis:7-alpine | 6379 | Cache & sessions |
| **nginx** | nginx:alpine | 80, 443 | Reverse proxy + SSL |
| **certbot** | certbot/certbot | — | Let's Encrypt renewal |

---

## Configuration Files

### Environment Variables (`deploy/.env.production`)

| Variable | Purpose |
|----------|---------|
| `COMPOSE_PROJECT_NAME` | Docker project name (`canvas-lms`) |
| `CANVAS_DOMAIN` | Public domain (`fineract.us`) |
| `POSTGRES_USER` | Database user (`canvas`) |
| `POSTGRES_PASSWORD` | Database password |
| `POSTGRES_DB` | Database name (`canvas_production`) |
| `ENCRYPTION_KEY` | Canvas data encryption key (64 hex chars) |
| `SECRET_KEY_BASE` | Rails session secret (128 hex chars) |
| `RAILS_ENV` | Environment (`production`) |

### Canvas Config Files (`deploy/config/`)

| File | Purpose |
|------|---------|
| `database.yml` | PostgreSQL connection settings |
| `domain.yml` | Domain and SSL configuration |
| `redis.yml` | Redis connection for cache/sessions |
| `cache_store.yml` | Cache backend configuration |
| `security.yml` | Encryption keys, JWT, LTI settings |
| `outgoing_mail.yml` | SMTP email settings |
| `delayed_jobs.yml` | Background job configuration |
| `dynamic_settings.yml` | Feature flags and dynamic config |

### Nginx (`deploy/nginx/nginx.conf`)

- HTTP → HTTPS redirect
- SSL with Let's Encrypt certs (`/etc/letsencrypt/live/fineract.us/`)
- Reverse proxy to Canvas web container
- WebSocket support for live features
- Static asset caching (7 days)
- Max upload size: 10GB
- Security headers (HSTS, X-Frame-Options, etc.)

---

## CI/CD Pipeline

### GitHub Actions (`.github/workflows/deploy-canvas.yml`)

**Trigger:** Push to `master` branch or manual dispatch

**Steps:**
1. Checkout code from `stephencoduor/canvas-lms`
2. Setup SSH with deploy key (`secrets.SSH_PRIVATE_KEY`)
3. SSH to server and:
   - Clone repo if first deploy (`/opt/canvas-lms`)
   - Pull latest code (`git fetch && git reset --hard origin/master`)
   - Copy config files to Canvas config directory
   - Build Docker image (`docker compose build --no-cache web`)
   - Start database + redis first, wait 15s
   - Run database migrations (`rake db:migrate`)
   - Start all services
   - Health check loop (12 attempts, 15s apart)
4. Verify deployment via HTTPS health check

### Required GitHub Secrets

| Secret | Value |
|--------|-------|
| `SSH_PRIVATE_KEY` | Private SSH key for root@148.230.111.247 |

---

## Manual Deployment

### First-Time Setup

```bash
# SSH to server
ssh root@148.230.111.247

# Clone the repository
git clone --depth 1 --branch master \
  https://github.com/stephencoduor/canvas-lms.git /opt/canvas-lms

# Copy config files
cd /opt/canvas-lms
cp deploy/config/*.yml config/

# Generate SSL certificate
certbot certonly --standalone -d fineract.us --agree-tos -m admin@redefiners.org

# Build and start
cd deploy
docker compose -f docker-compose.production.yml --env-file .env.production build web
docker compose -f docker-compose.production.yml --env-file .env.production up -d postgres redis
sleep 15

# Initialize database
docker compose -f docker-compose.production.yml --env-file .env.production run --rm web \
  bundle exec rake db:create db:initial_setup

# Start all services
docker compose -f docker-compose.production.yml --env-file .env.production up -d
```

### Update Deployment

```bash
ssh root@148.230.111.247
cd /opt/canvas-lms

# Pull latest code
git fetch origin master --depth 1
git reset --hard origin/master

# Copy updated config files
cp deploy/config/*.yml config/

# Rebuild and restart
cd deploy
docker compose -f docker-compose.production.yml --env-file .env.production build web
docker compose -f docker-compose.production.yml --env-file .env.production up -d

# Run migrations if needed
docker compose -f docker-compose.production.yml --env-file .env.production exec web \
  bundle exec rake db:migrate
```

### Apply ReDefiners Theme

```bash
# After containers are running, apply the brand config
docker compose -f docker-compose.production.yml --env-file .env.production exec web \
  bundle exec rails runner ReDefiners/canvas_brand_config.rb

# Or upload via Theme Editor:
# 1. Login as admin at https://fineract.us
# 2. Go to Admin > Account > Themes
# 3. Upload CSS: public/redefiners-theme/redefiners_overrides.css
# 4. Upload JS: public/redefiners-theme/redefiners_instui.js
# 5. Set brand colors per canvas_brand_config.rb
```

---

## Useful Commands

### Check Status
```bash
cd /opt/canvas-lms/deploy
docker compose -f docker-compose.production.yml ps
```

### View Logs
```bash
# All services
docker compose -f docker-compose.production.yml logs -f

# Specific service
docker compose -f docker-compose.production.yml logs -f web
docker compose -f docker-compose.production.yml logs -f nginx
docker compose -f docker-compose.production.yml logs -f jobs
```

### Restart Services
```bash
# Restart everything
docker compose -f docker-compose.production.yml restart

# Restart single service
docker compose -f docker-compose.production.yml restart web
docker compose -f docker-compose.production.yml restart nginx
```

### Stop Everything
```bash
docker compose -f docker-compose.production.yml down
```

### Stop and Remove Data (DESTRUCTIVE)
```bash
docker compose -f docker-compose.production.yml down -v
```

### Rails Console
```bash
docker compose -f docker-compose.production.yml exec web bundle exec rails console
```

### Run Rake Tasks
```bash
docker compose -f docker-compose.production.yml exec web bundle exec rake <task>
```

### Database Backup
```bash
docker compose -f docker-compose.production.yml exec postgres \
  pg_dump -U canvas canvas_production > backup_$(date +%Y%m%d).sql
```

### Database Restore
```bash
cat backup.sql | docker compose -f docker-compose.production.yml exec -T postgres \
  psql -U canvas canvas_production
```

---

## ReDefiners Theme Integration

The theme is applied at 3 levels:

### 1. InstUI Theme Overrides (Build-time)
**File:** `ui/shared/redefiners-theme/index.ts`
- Loaded in `ui/boot/index.js` during Canvas bootstrap
- Overrides 30+ InstUI components (buttons, cards, inputs, navigation, etc.)
- Sets Inter/Poppins fonts, teal color palette, rounded borders

### 2. Brand Config Variables (Database)
**File:** `ReDefiners/canvas_brand_config.rb`
- Applied via `rails runner` or Theme Editor UI
- Sets all `ic-brand-*` CSS variables (colors, logos, nav)
- Persisted in `brand_configs` table

### 3. CSS Overrides (Runtime)
**File:** `public/redefiners-theme/redefiners_overrides.css`
- Loaded in `_head.html.erb` after base Canvas styles
- 1,981 lines covering 42 Canvas UI sections
- Dashboard cards, navigation, buttons, forms, tables, gradebook, calendar, etc.

### 4. JS Brand Variables (Runtime)
**File:** `public/redefiners-theme/redefiners_instui.js`
- Loaded in `_head.html.erb` before main Canvas JS
- Extends `CANVAS_ACTIVE_BRAND_VARIABLES` with ReDefiners colors
- Loads Google Fonts dynamically

---

## Admin Credentials

| Field | Value |
|-------|-------|
| URL | https://fineract.us |
| Email | admin@redefiners.org |
| Password | ReDefiners2024! |

---

## Firewall (UFW)

```bash
# Required ports
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS

# Check status
ufw status
```

---

## Troubleshooting

### Container keeps restarting
```bash
docker compose -f docker-compose.production.yml logs web --tail 50
```

### Database connection errors
```bash
# Check postgres is healthy
docker compose -f docker-compose.production.yml exec postgres pg_isready -U canvas

# Verify config
cat config/database.yml
```

### SSL certificate expired
```bash
certbot renew --force-renewal
docker compose -f docker-compose.production.yml restart nginx
```

### Out of disk space
```bash
# Clean Docker
docker system prune -af
docker volume prune -f

# Check disk
df -h
```

### Canvas health check failing
```bash
# Check from inside container
docker compose -f docker-compose.production.yml exec web curl -f http://localhost:80/health_check

# Check Rails logs
docker compose -f docker-compose.production.yml exec web tail -100 log/production.log
```

### Need to reset admin password
```bash
docker compose -f docker-compose.production.yml exec web bundle exec rails runner \
  "u = User.find_by_email('admin@redefiners.org'); u.pseudonyms.first.update(password: 'NewPassword123!', password_confirmation: 'NewPassword123!')"
```

---

## Server Details

| Field | Value |
|-------|-------|
| Provider | Hostinger VPS |
| IP Address | 148.230.111.247 |
| OS | Ubuntu 22.04 LTS |
| RAM | 8GB |
| Domain | fineract.us |
| Deploy Dir | /opt/canvas-lms |
| SSL | Let's Encrypt (auto-renew via certbot) |
| Docker Compose File | deploy/docker-compose.production.yml |
| GitHub Repo | github.com/stephencoduor/canvas-lms |
| ReDefiners Repo | github.com/stephencoduor/redefiners |
