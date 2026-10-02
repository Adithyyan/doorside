# Production Deployment Guide

This guide covers deploying the India-First Dropshipping platform onto a production Linux server (Ubuntu 22.04 LTS) using **Nginx**, **PM2**, and **PostgreSQL**.

---

## 1. Server Architecture & Port Allocation

- **Frontend**: Static files built by Vite (`frontend/dist/`) and served directly by Nginx with client-side SPA fallback.
- **Backend API**: Node.js Express process managed by PM2 listening on `http://127.0.0.1:5000`.
- **Database**: PostgreSQL 14+ listening on `127.0.0.1:5432`.
- **Reverse Proxy**: Nginx listening on ports 80 (HTTP redirect) and 443 (HTTPS SSL).

---

## 2. Server Setup & Dependencies

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+ (NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx postgresql postgresql-contrib

# Install PM2 process manager globally
sudo npm install -g pm2
```

---

## 3. Database Configuration

```bash
# Switch to postgres user and create database & user
sudo -u postgres psql

CREATE DATABASE dropshipping_prod;
CREATE USER dropshipping_user WITH ENCRYPTED PASSWORD 'StrongSecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE dropshipping_prod TO dropshipping_user;
\q
```

---

## 4. Application Deployment

Clone the repository and install dependencies:
```bash
cd /var/www
sudo git clone <your-repo-url> dropshipping
sudo chown -R $USER:$USER /var/www/dropshipping
cd /var/www/dropshipping

# Install root, backend, and frontend dependencies
npm install
```

Configure backend production environment:
```bash
cp backend/.env.example backend/.env
nano backend/.env
```
Ensure production variables are set:
```env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgres://dropshipping_user:StrongSecurePassword123!@127.0.0.1:5432/dropshipping_prod
CLIENT_URL=https://yourdomain.com

JWT_SECRET=generate_a_random_32_character_secret_here
JWT_REFRESH_SECRET=generate_another_random_32_character_secret_here

RAZORPAY_KEY_ID=rzp_live_YourLiveKeyHere
RAZORPAY_KEY_SECRET=YourLiveSecretHere
RAZORPAY_WEBHOOK_SECRET=YourLiveWebhookSecretHere

COOKIE_SECURE=true
COOKIE_SAMESITE=strict

SEED_ADMIN_EMAIL=admin@yourdomain.com
SEED_ADMIN_PASSWORD=InitialAdminPassword456!
```

Run database migrations and default seeds:
```bash
npm run db:migrate
npm run db:seed
```

Build the frontend production bundle:
```bash
npm run build
```

---

## 5. PM2 Process Management

Start the backend API using PM2:
```bash
cd /var/www/dropshipping/backend
pm2 start src/server.js --name "dropshipping-api" -i max
pm2 save
pm2 startup
```

Verify backend health:
```bash
curl http://127.0.0.1:5000/health
# Response: {"success":true,"data":{"status":"ok","database":"connected"}}
```

---

## 6. Nginx Reverse Proxy Configuration

Create Nginx site configuration:
```bash
sudo nano /etc/nginx/sites-available/dropshipping
```

Paste the following configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates managed by Certbot
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/json;

    # Frontend Single Page App static files
    root /var/www/dropshipping/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads static directory
    location /uploads/ {
        proxy_pass http://127.0.0.1:5000/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

Enable site and install SSL with Certbot:
```bash
sudo ln -s /etc/nginx/sites-available/dropshipping /etc/nginx/sites-enabled/
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo nginx -t
sudo systemctl reload nginx
```

---

## 7. Daily Database Backup Automation

Set up automated daily PostgreSQL backups:
```bash
sudo mkdir -p /var/backups/postgres
sudo crontab -e
```
Add daily backup cron job at 3:00 AM:
```cron
0 3 * * * pg_dump -U dropshipping_user -h 127.0.0.1 dropshipping_prod | gzip > /var/backups/postgres/db_$(date +\%Y\%m\%d).sql.gz
```
