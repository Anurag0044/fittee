# FITTEE E-Commerce Backend Service

The high-performance, production REST API backend powering the **FITTEE Tribal Heritage Apparel** platform and Admin Control Center.

## Tech Stack
* **Runtime:** Node.js (v20+) with TypeScript
* **HTTP Framework:** Express.js 4.x
* **Database ORM:** Prisma ORM 6.x
* **Primary Database:** Neon Serverless PostgreSQL (`ap-south-1` Mumbai)
* **Authentication:** Admin JWT (with RBAC) + Firebase Customer Identity
* **Payments:** Razorpay Payments Gateway (Dual-Mode: Live SDK + Mock Simulation)
* **Logistics:** Ekart Logistics API v2 (4x6" Thermal Shipping Labels, Serviceability, Dispatch Idempotency)
* **Document Engine:** PDFKit (GST Tax Invoices & Thermal Courier Consignments)
* **Media CDN:** Cloudinary (Signed Direct Client Uploads)
* **Testing:** Vitest + Supertest

---

## Getting Started

### 1. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Ensure `DATABASE_URL` is configured for Neon Serverless PostgreSQL with PgBouncer connection pooling (`-pooler` suffix).

### 2. Install Dependencies
```bash
npm install
```

### 3. Generate Prisma Client & Seed Database
```bash
npm run prisma:generate
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
The server will boot at `http://localhost:8000`.

### 5. Run Automated Tests
```bash
npm test
```

### 6. Production Build & Start
```bash
npm run build
npm start
```

---

## API Overview

### Health Probes
* `GET /health` — Liveness & readiness check (`{ success: true, status: "UP" }`).
* `GET /api/v1/health` — API prefix health probe.

### Customer Storefront (`/api/v1/store`)
* `GET /products` — Product catalog with `fit`, `category`, and `price` filters.
* `GET /products/:slug` — Full PDP details (story, fabric specs, variants, images).
* `GET /categories` — Active product categories ordered by display hierarchy.
* `GET /festive-banners` — Live sales banners and announcement ticker.
* `GET /journal` — Cultural blog articles.
* `GET /journal/:slug` — Single article with embedded shoppable product tags.
* `POST /custom-inquiries` — Custom apparel design submissions.
* `POST /newsletter/subscribe` — Promotional newsletter subscriber opt-in.
* `POST /logistics/pincode-check` — 6-digit Indian PIN delivery check.
* `GET /maintenance-status` — Fast cached status queried by Next.js Edge Middleware.

### Orders & Checkout (`/api/v1/store/orders`)
* `POST /` — Place order, validate stock, compute server-side totals, issue `FIT-CUST-XXXXX` and `FIT-2026-XXXX`.
* `POST /verify-payment` — Cryptographic HMAC SHA256 Razorpay payment verification.
* `POST /:id/cod-confirm` — Confirm Cash-on-Delivery order.
* `GET /:orderNumber` — Public tracking and order status timeline.

### Admin Control Center (`/api/v1/admin`)
*All admin routes require `Authorization: Bearer <JWT>` header.*

#### Authentication
* `POST /auth/login` — Super Admin & Manager login.
* `GET /auth/me` — Authenticated operator profile & role permissions.

#### Module 1: Dashboard Analytics & Rolling MAU
* `GET /analytics/dashboard` — MAU, DAU, stickiness ratio, revenue, pipeline counts, heatmap.

#### Module 2: Festive Banners
* `GET /banners` — List all banners.
* `POST /banners` — Create campaign banner.
* `PATCH /banners/:id/toggle` — Instant emergency kill-switch.
* `DELETE /banners/:id` — Delete banner.

#### Module 3: Cultural Journal CMS
* `GET /journal` — List all draft, scheduled, and published articles.
* `POST /journal` — Publish article with tagged products.

#### Module 4: Categories
* `GET /categories` — List categories with product counts.
* `POST /categories` — Create category.
* `PUT /categories/reorder` — Drag-and-drop reordering.

#### Module 5: Product Catalog
* `GET /products` — Complete inventory with variants, sizes, and stock thresholds.
* `POST /products` — Create new T-shirt with multi-variant matrix.
* `PUT /products/:id` — Update pricing, stories, and specifications.

#### Module 6: Order Fulfillment & Customer Viewing
* `GET /orders` — Filterable order list (`NEEDS_ACTION`, `PACKED`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
* `GET /orders/:id` — Customer viewing dossier (`customerCode`, click-to-call, WhatsApp deep link, Ekart serviceability, line items, and audit timeline).
* `PATCH /orders/:id/status` — Advance fulfillment stage.
* `POST /orders/:id/notes` — Append internal operator note.
* `POST /orders/:id/cancel` — Cancel order and return inventory.
* `POST /orders/:id/dispatch-ekart` — 1-click Ekart dispatch with `Idempotency-Key` header.
* `GET /orders/:id/label` — Stream thermal 4x6" PDF shipping label.
* `GET /orders/:id/invoice` — Stream formal GST Tax Invoice PDF.

#### Module 7: Dynamic Page Locks
* `GET /page-locks` — List route-level lock configurations.
* `POST /page-locks/toggle` — Toggle route maintenance lock.

#### Media Management
* `POST /media/sign-upload` — Generate cryptographic signature for direct Cloudinary uploads.