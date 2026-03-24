#!/bin/bash
set -euo pipefail

# ═══════════════════════════════════════════════════
# Canvas LMS Production Deployment Script
# Server: 148.230.111.247 | Domain: lms.k8s-gke.us
# ═══════════════════════════════════════════════════

REPO_URL="https://github.com/stephencoduor/canvas-lms.git"
DEPLOY_DIR="/opt/canvas-lms"
DEPLOY_CONF="$DEPLOY_DIR/deploy"

echo "═══════════════════════════════════════"
echo " Canvas LMS Deployment"
echo " Domain: lms.k8s-gke.us"
echo "═══════════════════════════════════════"

# ── Step 1: Install Docker if not present ──
if ! command -v docker &>/dev/null; then
    echo "[1/8] Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
else
    echo "[1/8] Docker already installed: $(docker --version)"
fi

if ! docker compose version &>/dev/null; then
    echo "[1/8] Installing Docker Compose plugin..."
    apt-get update -qq && apt-get install -y docker-compose-plugin
else
    echo "[1/8] Docker Compose ready: $(docker compose version --short)"
fi

# ── Step 2: Stop existing services ──
echo "[2/8] Stopping existing services..."
# Stop Mifos Fineract or any other containers
docker stop $(docker ps -q) 2>/dev/null || true
# Stop any non-Docker services on ports 80/443
fuser -k 80/tcp 2>/dev/null || true
fuser -k 443/tcp 2>/dev/null || true

# ── Step 3: Clone or update repository ──
if [ -d "$DEPLOY_DIR/.git" ]; then
    echo "[3/8] Updating existing repository..."
    cd "$DEPLOY_DIR"
    git fetch origin
    git reset --hard origin/master
else
    echo "[3/8] Cloning repository..."
    git clone "$REPO_URL" "$DEPLOY_DIR"
    cd "$DEPLOY_DIR"
fi

# ── Step 4: Copy config files ──
echo "[4/8] Setting up configuration files..."
cp deploy/config/database.yml config/database.yml
cp deploy/config/domain.yml config/domain.yml
cp deploy/config/redis.yml config/redis.yml
cp deploy/config/cache_store.yml config/cache_store.yml
cp deploy/config/security.yml config/security.yml
cp deploy/config/outgoing_mail.yml config/outgoing_mail.yml
cp deploy/config/delayed_jobs.yml config/delayed_jobs.yml
cp deploy/config/dynamic_settings.yml config/dynamic_settings.yml

# ── Step 5: Build Docker images ──
echo "[5/8] Building Canvas Docker image (this takes 15-30 minutes on first run)..."
cd "$DEPLOY_CONF"
docker compose -f docker-compose.production.yml --env-file .env.production build --no-cache web

# ── Step 6: Start database and Redis ──
echo "[6/8] Starting database and Redis..."
docker compose -f docker-compose.production.yml --env-file .env.production up -d postgres redis
echo "Waiting for PostgreSQL to be ready..."
sleep 15

# ── Step 7: Initialize database ──
echo "[7/8] Running database setup..."
docker compose -f docker-compose.production.yml --env-file .env.production run --rm web \
    bundle exec rake db:create db:migrate

# Create initial admin account
echo "Creating initial admin account..."
docker compose -f docker-compose.production.yml --env-file .env.production run --rm web \
    bundle exec rake db:initial_setup <<EOF
canvas@lms.k8s-gke.us
admin
ReDefiners LMS
lms.k8s-gke.us
y
EOF

# ── Step 8: Start all services ──
echo "[8/8] Starting all Canvas services..."
docker compose -f docker-compose.production.yml --env-file .env.production up -d

echo ""
echo "═══════════════════════════════════════"
echo " Canvas LMS is starting up!"
echo " URL: http://lms.k8s-gke.us"
echo ""
echo " Run setup-ssl.sh for HTTPS"
echo "═══════════════════════════════════════"
