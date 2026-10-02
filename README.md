# India-First Customizable Dropshipping E-Commerce Platform

A production-grade, highly customizable, India-first dropshipping e-commerce platform built with **Vue 3 (Composition API, Pug templates, Tailwind CSS 4, Pinia)** on the frontend and **Node.js, Express, and PostgreSQL (`pg-promise`)** on the backend.

Designed from the ground up for the Indian e-commerce ecosystem with native support for:
- **Cash on Delivery (COD)** with configurable risk control and handling fees
- **UPI & Online Payments** via Razorpay integration (Google Pay, PhonePe, Paytm, Cards, NetBanking)
- **Indian Address & Logistics Standard**: Pincode validation, state/city dropdowns, and courier integrations (Delhivery, BlueDart, Ekart, Shadowfax, DTDC, XpressBees, Speed Post)
- **Streamlined Manual Dropshipping Fulfillment Workflow**: Specially designed for marketplaces like **Meesho**, **IndiaMART**, and **GlowRoad** with 1-click clipboard address copying, supplier order recording, and tracking notifications.
- **Dynamic Theming & Zero-Hardcoded Branding**: Complete store identity (brand name, logos, colors, contact details, policies) is dynamically loaded from database settings and injected into CSS variables (`--store-primary`, `--store-accent`, `--store-background`, etc.).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Vue 3, Vite 8, Pinia, Vue Router, Pug (`<template lang="pug">`), Tailwind CSS 4, Lucide Icons |
| **Backend** | Node.js (v18+), Express, Helmet, CORS, Rate Limit, Multer, Pino Logger |
| **Database** | PostgreSQL 14+, `pg-promise` with named parameters `$/param/` and atomic transactions |
| **Security** | Short-lived JWT access tokens + HTTP-only rotation refresh tokens, bcrypt (cost factor 12), timing-safe HMAC webhook verification |
| **Payments** | Razorpay Payment Gateway & Webhook verification, Cash on Delivery (COD) |

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** >= 14 running locally or on a cloud provider (e.g., Supabase, Neon, AWS RDS)

### 2. Environment Configuration
Copy the server example environment file:
```bash
cp server/.env.example server/.env
```
Edit `server/.env` with your PostgreSQL database connection string and secret keys:
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgres://postgres:password@localhost:5432/dropshipping_db
CLIENT_URL=http://localhost:5173

JWT_SECRET=your_super_secret_jwt_access_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_min_32_chars

# Optional Razorpay credentials (if omitted or left blank, mock mode is activated)
RAZORPAY_KEY_ID=rzp_test_YourKeyHere
RAZORPAY_KEY_SECRET=YourSecretHere
RAZORPAY_WEBHOOK_SECRET=YourWebhookSecretHere

SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=ChangeMe@123!
```

### 3. Database Migration & Seeding
Initialize the database tables, schema indexes, default store settings, admin accounts, and demo products:
```bash
# Run database migrations
npm run db:migrate

# Seed default settings, admin user, and demo products
npm run db:seed
```

### 4. Running the Development Servers
Run both server API and web Vite server concurrently:
```bash
# Starts server at http://localhost:3001 and web at http://localhost:5173
npm run dev
```
Or run each service individually:
```bash
# Terminal 1: Server
npm run server

# Terminal 2: Web
npm run web
```

### 5. Accessing the Platform
- **Customer Storefront**: [http://localhost:5173](http://localhost:5173)
- **Admin Operations Portal**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
  - **Email**: `admin@example.com`
  - **Password**: `ChangeMe@123!` *(Change after first login)*
- **API Health Check**: [http://localhost:3001/health](http://localhost:3001/health)

---

## 📦 Dropshipping Fulfillment Operations

This platform solves the manual dropshipping bottleneck with a **3-step low-click fulfillment station**:

1. **Step 1: Copy Customer Details**
   - Click **"📋 Copy Details For Meesho / Supplier"** on any unfulfilled order.
   - Standardized recipient name, phone, address, landmark, city, state, and pincode are copied directly to your clipboard in the format required by Meesho / supplier checkout forms.
2. **Step 2: Supplier Order Placement**
   - Click **"Open Supplier ↗"** to jump directly to the supplier's product page.
   - Paste the customer details and complete checkout on the supplier site.
   - Enter the supplier's order ID (e.g. `MSH-12345678`) and click **"Record Supplier Order Placed"**.
3. **Step 3: Tracking & Shipment**
   - When the supplier provides the courier name and AWB tracking number, select the courier partner (e.g. *Delhivery*, *BlueDart*, *Ekart*, *Shadowfax*) and enter the tracking number.
   - Click **"Mark Shipped & Notify Customer"** to update status and enable live customer tracking.

---

## 🧪 Testing & Code Quality

```bash
# Run backend unit test suites (Auth, Payments, Suppliers)
npm test

# Run ESLint across backend codebase
npm run lint

# Build production bundle for frontend
npm run build
```

---

## 📄 License
MIT License. Built for production dropshipping operations in India.
