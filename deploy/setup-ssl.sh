#!/bin/bash
set -euo pipefail

# ═══════════════════════════════════════
# SSL Setup with Let's Encrypt (Certbot)
# Domain: lms.k8s-gke.us
# ═══════════════════════════════════════

DOMAIN="lms.k8s-gke.us"
EMAIL="admin@${DOMAIN}"
DEPLOY_DIR="/opt/canvas-lms/deploy"

echo "Setting up SSL for ${DOMAIN}..."

cd "$DEPLOY_DIR"

# Step 1: Start nginx with HTTP-only config first
echo "[1/4] Starting Nginx in HTTP-only mode..."
# Create temporary HTTP-only nginx config
cat > nginx/nginx-temp.conf << 'HTTPCONF'
server {
    listen 80;
    server_name lms.k8s-gke.us;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://web:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 10g;
    }
}
HTTPCONF

# Temporarily use HTTP config
docker compose -f docker-compose.production.yml --env-file .env.production run --rm \
    -v "$(pwd)/nginx/nginx-temp.conf:/etc/nginx/conf.d/default.conf:ro" \
    nginx nginx -t 2>/dev/null || true

docker compose -f docker-compose.production.yml --env-file .env.production up -d nginx

# Step 2: Obtain certificate
echo "[2/4] Obtaining SSL certificate..."
docker compose -f docker-compose.production.yml --env-file .env.production run --rm certbot \
    certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN"

# Step 3: Switch to SSL nginx config
echo "[3/4] Activating SSL configuration..."
rm -f nginx/nginx-temp.conf

# Step 4: Restart nginx with full SSL config
echo "[4/4] Restarting Nginx with SSL..."
docker compose -f docker-compose.production.yml --env-file .env.production restart nginx

echo ""
echo "═══════════════════════════════════════"
echo " SSL configured for https://${DOMAIN}"
echo " Certificate auto-renews via certbot"
echo "═══════════════════════════════════════"
