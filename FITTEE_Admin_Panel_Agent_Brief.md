# FITTEE Admin Panel — Build Brief for the Coding Agent

> Hand this whole file to the agent as context. It is derived from the FITTEE architecture blueprint (v2.0), with the gaps and contradictions found in review already resolved. Where this brief differs from the blueprint, **this brief wins**. Items marked **[DECISION]** need the owner's confirmation before the agent builds that part.

---

## 0. Rules for the agent

1. Build in the order given in section 15. Finish and verify each milestone before starting the next.
2. Do not invent business rules, field names or endpoints. If something is missing, add a `TODO(owner):` comment and a line in `OPEN_QUESTIONS.md`, then continue with the safest default.
3. The admin app is a **pure client of the REST API**. It never imports Prisma, never talks to the database, and never shares runtime code with the storefront.
4. Every mutation must be: validated (Zod), permission-checked, audit-logged (by the API), and followed by a cache purge or revalidation (by the API). The admin only needs to surface success and failure clearly.
5. No dead buttons. If a feature is not built yet, do not render its control.
6. Small, reviewable commits per module. Write tests for the critical flows listed in section 14.

---

## 1. Product context

FITTEE is a Jharkhand-rooted contemporary tribal streetwear brand (Sohrai, Khovar, Karam, Dokra art on oversized and regular-fit tees). The storefront is Next.js 16. **The core mandate: the brand team, who are non-technical, must manage 100% of the public site from this admin panel with no code changes or redeploys.**

The admin panel is hosted at `https://admin.fittee.in`, talks to `https://api.fittee.in` (Node.js + Express + TypeScript + Prisma + PostgreSQL), uploads media directly to Cloudinary, and fulfils orders through Ekart Logistics.

**Primary users**

| User | Typical tasks | Device |
|---|---|---|
| Founder / Super admin | Dashboard, banners, page locks, everything | Laptop, phone |
| Catalog manager | Products, categories, journal, banners | Laptop |
| Logistics / packing staff | Orders, dispatch, labels, tracking | Desktop at a packing table, sometimes phone |

---

## 2. Scope and phasing

All seven modules are in scope. Build them in this priority order:

| Phase | Modules |
|---|---|
| **Phase 1 — launch-critical** | Auth & RBAC, Product Catalog (with Categories), Orders & Ekart, Festive Banners, Page Lock |
| **Phase 2** | Dashboard & MAU, Journal CMS, standalone Category manager polish, Coupons |
| **Phase 3** | Returns/refunds, newsletter & waitlist exports, audit-log viewer, abandoned-cart recovery |

Categories are small: in Phase 1 they ship as a simple list and form inside the Catalog area; the drag-and-drop ordering and richer fields come in Phase 2.

---

## 3. Tech stack and repository layout

**Stack (fixed)**

- Next.js 16 (App Router), React 19, TypeScript in strict mode
- Tailwind CSS v4, Lucide icons, Recharts for charts
- Recommended supporting libraries **[DECISION: agent may substitute equivalents]**: TanStack Query (server state), TanStack Table (tables), React Hook Form + Zod (forms), dnd-kit (drag and drop), Tiptap (rich text, Markdown in/out), date-fns with `date-fns-tz`, Sonner (toasts), Vitest + Testing Library, Playwright
- State: server state in TanStack Query; local UI state in React; no global store unless clearly needed

**Monorepo layout**

```
fittee/
├─ apps/
│  ├─ storefront/        # customer site (existing)
│  └─ admin/             # THIS PROJECT
│     ├─ src/app/
│     │  ├─ (auth)/login, /login/2fa
│     │  └─ (dashboard)/
│     │     ├─ page.tsx                 # Dashboard
│     │     ├─ products/ [id]/ new/
│     │     ├─ categories/
│     │     ├─ orders/ [id]/
│     │     ├─ banners/
│     │     ├─ journal/ [id]/ new/
│     │     ├─ page-locks/
│     │     ├─ coupons/
│     │     └─ settings/ (admin users, audit log)
│     ├─ src/components/ui/           # design-system primitives
│     ├─ src/components/<module>/
│     ├─ src/lib/api/                 # typed API client
│     ├─ src/lib/auth/
│     └─ src/middleware.ts            # route guard
└─ packages/
   └─ types/              # shared Zod schemas + TS types (API ⇄ admin)
```

**Environment variables (admin)**

```
NEXT_PUBLIC_API_BASE_URL=https://api.fittee.in/api/v1
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_STOREFRONT_URL=https://fittee.in   # for "View on storefront" links
```

Never put secrets in `NEXT_PUBLIC_*`. Cloudinary uploads use signatures from the API.

---

## 4. Authentication, roles and security

### 4.1 Auth flow

- Email + password login against `POST /admin/auth/login`.
- **Access token**: short-lived JWT (about 15 minutes), kept in memory only.
- **Refresh token**: httpOnly, Secure, SameSite=Strict cookie, rotated on every refresh. API client silently refreshes on a 401 and retries once; if refresh fails, redirect to `/login?next=<path>`.
- **2FA (TOTP)** required for `SUPER_ADMIN` and enabled as an option for others **[DECISION]**.
- Login screen: rate-limit messaging, no user enumeration ("Email or password is incorrect"), password visibility toggle.
- Idle timeout: warn at 25 minutes of inactivity, sign out at 30.
- Edge `middleware.ts` redirects unauthenticated requests to `/login`. Real authorization is always enforced by the API; hiding UI is only a convenience.

### 4.2 Roles and permissions

Roles: `SUPER_ADMIN`, `CATALOG_MGR`, `LOGISTICS_MGR`.

| Module | SUPER_ADMIN | CATALOG_MGR | LOGISTICS_MGR |
|---|---|---|---|
| Dashboard — engagement | Read | Read | Read |
| Dashboard — revenue & profit KPIs | Read | — | — |
| Products & Categories | Full | Full | Read |
| Festive Banners | Full | Full | — |
| Journal CMS | Full | Full | — |
| Orders & Ekart dispatch | Full | Read | Full |
| Coupons | Full | Full | — |
| Page Lock | Full | — | — |
| Admin users, audit log | Full | — | — |

Implement a `usePermission('orders:dispatch')` hook and a `<Can>` wrapper. The API returns the permission list on `GET /admin/auth/me`; the admin reads it from there instead of hard-coding roles in many places.

### 4.3 Hardening requirements

- Strict CSP, `frame-ancestors 'none'`, `X-Content-Type-Options`, `Referrer-Policy`.
- All destructive actions require a confirmation dialog. Highest-risk actions (global lock, cancel paid order, delete product) require typing a confirmation word.
- Never display secrets after creation (for example the page-lock bypass key).
- The admin must be placed behind an additional access layer (Cloudflare Access or IP allowlist) **[DECISION]**; Vercel IP restriction is plan-dependent.

---

## 5. Design system

**Direction: calm, minimal, premium, precise. Apple-like restraint. No glassmorphism, no blur panels, no gradients on surfaces, no decorative effects.** Hierarchy comes from spacing, type scale and weight, not from borders and shadows everywhere.

**Tokens**

| Token | Light | Dark |
|---|---|---|
| Canvas | `#FAFAF7` | `#0E0F0D` |
| Surface (cards) | `#FFFFFF` | `#161815` |
| Border | `#E7E5DF` | `#2A2C27` |
| Text primary | `#161714` | `#F2F1EC` |
| Text secondary | `#6B6A63` | `#9A9A92` |
| Accent (primary actions, active nav, focus ring) | `#B87A22` | `#E5A93C` |
| Success / Warning / Danger | `#2F7D4F` / `#B7791F` / `#C0392B` | tuned for contrast |

- The brand's mustard gold is the **only** accent colour and is used sparingly: primary buttons, the active nav item, focus rings, and key chart series. Everything else is neutral.
- Brand's terracotta and forest green appear only as subtle category or status hints, never as large fills.
- Typography: **Plus Jakarta Sans** for all UI (matches the storefront sans). Playfair Display is not used in the admin. Scale: 12 / 13 / 14 (body) / 16 / 20 / 24 / 32. Tabular numerals for all money and counts.
- Spacing on a 4px grid, radii 8px (controls) and 12px (cards), a single subtle shadow level for popovers only.
- Motion: 120–180ms ease-out for hover, popovers and toasts. No page-transition animations. Respect `prefers-reduced-motion`.
- Light theme default, dark theme supported through CSS variables.

**Layout**

- Left sidebar (240px, collapsible to icons), top bar with global search (orders by number, phone, customer code; products by title or SKU), a **live "Locks active" indicator** when any page lock is on, and the user menu.
- Content max-width 1280px, generous whitespace, page header with title, short description and primary action on the right.
- Desktop-first. Orders, dispatch and label printing must also work well on a phone and a tablet.

**Standard states (every screen must implement all)**: loading skeletons (not spinners on full pages), empty states with one clear action, inline error with retry, and a forbidden state for missing permissions.

**Accessibility**: WCAG 2.2 AA, full keyboard navigation, visible focus, labelled inputs, never rely on colour alone for status.

---

## 6. Shared UX patterns (build once in `components/ui`)

- **DataTable**: server-side pagination, sorting and filters, with filter state stored in the URL query string so views are shareable and survive refresh. Column visibility, sticky header, row actions menu, bulk selection bar.
- **Form shell**: React Hook Form + Zod, field-level errors, a sticky save bar showing "Unsaved changes", and a navigation guard.
- **StatusBadge**: one component mapping every status enum to a label and tone.
- **MediaUploader**: drag-and-drop, multi-file, client-side file-type and size checks, progress per file, reorder (dnd-kit), per-image **alt-text input (required)**, hero toggle. Flow in section 12.
- **SlugField**: auto-generates from title, manual override, uniqueness check against the API, warns when editing the slug of a published item (it changes the public URL).
- **CharCounter** and **SerpPreview**: Meta title (60) and meta description (160) with a live Google-result preview.
- **ConfirmDialog** with an optional "type to confirm" mode.
- **DateTimePicker**: displays and edits in **IST (Asia/Kolkata)**, sends ISO UTC to the API.
- **Money** component: INR formatting via `Intl.NumberFormat('en-IN')`.
- **Toasts** for success, and persistent inline banners for errors that need action.

---

## 7. Module specifications

### Module 1 — Dashboard & MAU (Phase 2)

**Route**: `/` · **Roles**: all (revenue cards hidden from non-super admins)

**Widgets**

- **MAU** (rolling 30 days) as the hero number with a 12-month bar chart (Recharts), month-over-month delta.
- Engagement: DAU, sessions, average session duration, **Stickiness = DAU / MAU %**.
- Commercial: gross revenue (today / week / month), net after returns, AOV, conversion rate.
- Order pipeline counts by status, clickable to the filtered orders list.
- Top products leaderboard with Fit split (Regular vs Oversized), colourway and size velocity.
- Geographic distribution: a ranked table by city/state first (Jharkhand cities highlighted); a map is optional later.
- Abandoned-cart rate with a "Send recovery reminders" action (Phase 3).
- Date range selector (7d / 30d / 90d / custom), all in IST.

**Rules**: show a "Last updated" timestamp on aggregated metrics; never show fabricated or placeholder numbers when data is missing, show an explicit "No data yet" state.

**API**: `GET /admin/analytics/dashboard?from&to`, `GET /admin/analytics/mau-history?months=12`.

**Acceptance**: MAU figure matches the backend's `DailySiteMetric` for the same day; each empty or failed widget fails independently without breaking the page.

---

### Module 2 — Festive Banners (Phase 1)

**Routes**: `/banners`, `/banners/new`, `/banners/[id]`

**List**: grouped by slot, columns for thumbnail, campaign, slot, schedule, priority, computed status (**Scheduled / Live / Expired / Paused**), active toggle. Filters by slot and status.

**Slots**: `HERO_BANNER`, `ANNOUNCEMENT_BAR`, `CAROUSEL_CARD`, `MID_PAGE_STRIP`.

**Form fields**: campaign name, slot, headline, subheadline, CTA text, redirect URL (internal path or https URL, validated), linked discount code (picker once Coupons exist), display priority, start and end date-time, active toggle.

**Media**: separate **desktop (1920×600)** and **mobile (800×1000)** uploads via MediaUploader, each with a live crop preview at its target aspect ratio. Block save if either image is missing for slots that need images. The announcement bar is text-only (no images).

**Behaviour**

- Warn (do not block) when another live banner in the same slot overlaps the schedule; show which one.
- End must be after start. Show "starts in 3 days" / "ends in 2 hours" relative hints.
- The **Active toggle is an instant kill switch**: one click, optimistic UI, success toast, and the API purges the storefront cache.
- Duplicate-banner action to reuse last year's campaign.
- Live preview panel rendering the banner at desktop and mobile widths.

**API**: `GET, POST /admin/banners`, `PUT, DELETE /admin/banners/:id`.

**Acceptance**: a banner scheduled for the future is invisible on the storefront until the start time without any manual action; toggling off removes it within the cache purge window.

---

### Module 3 — Journal CMS (Phase 2)

**Routes**: `/journal`, `/journal/new`, `/journal/[id]`

**Fields**: title, slug, excerpt, body (Tiptap: headings, blockquote/pull-quote, lists, links, inline images via MediaUploader, embedded video URL), cover image (+ alt text), author name, reading time (auto = words ÷ 200, overridable), category tags, tagged products, status.

**Workflow**: `DRAFT → SCHEDULED → PUBLISHED → ARCHIVED`. Scheduled posts require a future publish date-time (IST); the backend scheduler publishes them.

**SEO & social panel**: meta title (60 counter), meta description (160 counter), SERP preview, canonical URL, OpenGraph title / description / image with a social card preview.

**Shoppable tags**: a searchable multi-select of active products; show selected products as cards in the sidebar; the storefront renders them below the article.

**Quality of life**: autosave drafts every 30 seconds, "last saved" indicator, a preview button that opens the storefront article with a preview token, and a body-size guard.

**API**: `GET, POST /admin/journal`, `PUT, DELETE /admin/journal/:id`.

**Acceptance**: switching a post to Published makes it appear on `/journal` after the cache purge; unpublishing removes it; deleting a tagged product does not break the post.

---

### Module 4 — Category Manager (basic in Phase 1, full in Phase 2)

**Routes**: `/categories`, `/categories/new`, `/categories/[id]`

**Fields**: name, slug, subtitle, story excerpt, banner image (+ alt text), icon motif, display order, active toggle, meta title, meta description. Optional parent category **[DECISION: flat or two-level hierarchy]**.

**Behaviour**: drag-and-drop reordering (dnd-kit) with an explicit "Save order" action; the active toggle hides the category from storefront navigation without touching its products; deleting a category that still has products is blocked with a clear message offering to reassign them.

**API**: `GET, POST /admin/categories`, `PUT, DELETE /admin/categories/:id`, `PUT /admin/categories/reorder` (**new**: accepts an ordered id list).

---

### Module 5 — Product Catalog with SEO (Phase 1)

**Routes**: `/products`, `/products/new`, `/products/[id]`

**List**: search (title, slug, SKU), filters (category, fit, status, badge, stock state), columns for hero thumbnail, title, category, fit, price, total stock, status, updated. Bulk actions: archive, change category, change badge.

**Product form — tabbed or sectioned, with a sticky preview rail**

1. **Basics**: title, slug, category, fit type (`REGULAR_FIT` / `OVERSIZED_FIT`), badge (`NEW`, `BESTSELLER`, `FESTIVE_SPECIAL`, or none), status.
2. **Pricing**: selling price, original MRP, and a **read-only computed discount badge** ("46% OFF"). Validate selling price ≤ MRP.
3. **Story & fabric**: artwork story (rich text), fabric details (for example "240 GSM, 100% combed cotton, pre-shrunk, bio-washed").
4. **Variants & inventory matrix**: add colourways (name + hex picker) as rows, sizes (S, M, L, XL, XXL, 3XL) as columns, a stock quantity in each cell. SKUs auto-generate as `FIT-{SLUG}-{COLOR}-{SIZE}` and are editable only until the first order exists. Highlight cells at 0 and below a configurable low-stock threshold.
5. **Images**: MediaUploader, each image **linked to a colourway** (or "all colours"), required alt text, hero flag, drag to reorder. The storefront uses this link to switch the gallery per colourway.
6. **SEO**: primary target keyword, meta title and meta description with counters and SERP preview, and a read-only preview of the auto-generated Product JSON-LD (name, image, price, currency INR, availability).

**Status rules**

- Stored statuses: `DRAFT`, `ACTIVE`, `ARCHIVED`.
- **Low Stock** and **Out of Stock** are *derived* from inventory and shown as badges. They are not manually set.
- A product cannot be set to `ACTIVE` without a hero image, at least one in-stock variant, price, category and meta title.
- Archive, never hard-delete, if the product appears in any order.

**API**: `GET, POST /admin/products`, `PUT, DELETE /admin/products/:id`.

**Acceptance**: publishing a product with two colourways and six sizes creates the correct number of unique SKUs; editing price updates the storefront after the purge; two admins editing the same product trigger a "changed by someone else" conflict warning (use `updatedAt` as the version).

---

### Module 6 — Orders & Ekart Logistics (Phase 1)

**Routes**: `/orders`, `/orders/[id]`

**List**: tabs for All, Needs action (paid and unfulfilled), Packed, Shipped, Delivered, Cancelled/RTO. Search by order number, customer name, phone, customer code, AWB. Filters by status, payment method, payment status, date range, state. Bulk actions: bulk dispatch, bulk print labels.

**Order detail layout**

- **Customer card**: customer code (e.g. `FIT-CUST-84920`) with a link to that customer's order history, name, verified phone (click-to-call and WhatsApp deep link), email.
- **Shipping address**: full structured address (flat/house, building, street, landmark, city, state, 6-digit pincode) with a one-click **Copy address** and a serviceability badge from Ekart.
- **Line items**: thumbnail, product, fit, colour swatch, size, SKU, quantity, unit price, total.
- **Financials**: subtotal, discounts (with coupon code), shipping fee, total, payment method (Razorpay or COD), payment status, transaction id.
- **Timeline**: chronological `OrderStatusLog` including webhook-driven courier events.
- **Ekart panel**: AWB, tracking URL, label download, manifest id, and dispatch state.

**Status model**: `PLACED → CONFIRMED → PACKED → SHIPPED → OUT_FOR_DELIVERY → DELIVERED`, plus `CANCELLED` and `RTO`. Show only valid next actions for the current status; never offer an impossible transition.

**Dispatch flow ("Dispatch with Ekart")**

1. Pre-checks shown as a checklist: payment paid (or COD verified), address complete, pincode serviceable, stock allocated.
2. Click sends `POST /admin/orders/:id/dispatch-ekart` with an `Idempotency-Key` header, so double-clicks and retries never create two shipments.
3. Dispatch state machine shown in the UI: `NOT_BOOKED → QUEUED → BOOKED` or `FAILED`.
4. On `BOOKED`: show AWB, enable **Print label** (thermal-friendly PDF) and **Download GST invoice**, set status to Packed or Shipped according to backend response.
5. On `FAILED` or API downtime: show the reason, keep the order in a "Dispatch failed" queue, provide **Retry** (the backend also retries with backoff). Never lose the request.

**Other actions**: confirm order, mark packed, cancel (required reason, refund prompt for prepaid orders, restock option), add internal note, resend tracking notification.

**Real-time**: poll (or SSE if the API supports it) the order detail while open; courier webhook events appear without a manual refresh.

**API**: `GET /admin/orders`, `GET /admin/orders/:id`, `POST /admin/orders/:id/dispatch-ekart`, plus **new**: `POST /admin/orders/:id/confirm`, `/pack`, `/cancel`, `GET /admin/orders/:id/label`, `GET /admin/orders/:id/invoice`, `POST /admin/orders/:id/notes`, `POST /admin/orders/bulk-dispatch`.

**Acceptance**: a prepaid order flows from placed to shipped in three clicks or fewer; a duplicate click never creates a second AWB; a webhook "delivered" event updates the open order screen; a phone-sized layout lets staff dispatch and print a label.

---

### Module 7 — Page Lock & Maintenance Controller (Phase 1)

**Route**: `/page-locks` · **Role**: `SUPER_ADMIN` only

**List**: every lock record with route scope, mode, state, last changed, and who changed it. A permanent **"Locks active" indicator** appears in the top bar whenever any lock is on.

**Form fields**: route path (`/*` for the whole site, or a path like `/custom-design`, `/checkout`, `/journal`), mode (`COMING_SOON` or `MAINTENANCE`), locked toggle, display title, display message, contact email, background image, estimated end time (shown to the public as a countdown), optional scheduled start and end.

**Behaviour**

- **Preview before saving**: render the exact public maintenance screen for both modes.
- **Bypass**: the admin generates a bypass key once; it is shown a single time, then stored hashed by the API. The panel offers a **"Copy preview link"** button that produces a signed, expiring link which sets an httpOnly preview cookie on the storefront. Staff browse locked pages while the public sees the lock screen.
- **Safety**: locking `/*` or `/checkout` requires typing the word `LOCK` in a confirm dialog and shows the expected impact ("All customer pages will show the maintenance screen"). Unlocking needs one click.
- **Propagation status**: after saving, show "Pushed to edge ✓" (or a retry state), because the storefront reads lock state from an edge-native store pushed by the API.
- Overlapping rules: a specific route lock plus a global lock is allowed; display which rule currently wins.

**API**: `GET, PUT /admin/page-locks`, plus **new**: `POST /admin/page-locks/:id/preview-link`.

**Acceptance**: after toggling a lock, the public route shows the lock screen within a few seconds and the preview link still reaches the real page; unlocking restores it equally quickly.

---

### Supporting modules

- **Coupons (Phase 2)**: code, type (percent / flat / free shipping), value, min order value, usage limit (total and per customer), valid-from/to in IST, applicable categories or products, active toggle, redemption count. **API (new)**: `GET, POST /admin/coupons`, `PUT, DELETE /admin/coupons/:id`.
- **Admin users (Phase 1)**: invite, change role, deactivate, force sign-out, reset 2FA. SUPER_ADMIN only.
- **Audit log (Phase 3 UI, API logs from day one)**: who, what, which record, before/after diff, timestamp, IP. Read-only.
- **Customers (Phase 3)**: read-only profile by customer code with order history and lifetime value.

---

## 8. Data requirements the admin depends on

The blueprint's schema is missing several things the admin UI needs. The backend must provide these; the admin is built assuming they exist. Where the backend is not ready, the agent should stub against a typed mock API client, not change the design.

- Use Prisma **enums** for `FitType`, `ProductStatus`, `OrderStatus`, `PaymentMethod`, `PaymentStatus`, `PageLockMode`, `BannerSlot`, `JournalStatus`, `AdminRole`.
- `Product.discountPercent` is **computed**, not stored.
- **Guest orders**: `Order.customerId` must be nullable, or guests get a shadow `Customer` row. Shipping address snapshotted onto the order.
- **Product images ↔ colourways**: `ProductImage.variantColorName` (or a `ProductColor` table) so galleries switch per colour.
- **Category**: add `subtitle`, `storyExcerpt`, `iconMotif`, and optionally `parentId`.
- **Journal**: add `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImageUrl`; statuses `DRAFT | SCHEDULED | PUBLISHED | ARCHIVED`.
- **Coupon** and **CouponRedemption** models.
- **VisitorSession / event** table powering MAU (rolling MAU cannot be derived from `DailySiteMetric` alone).
- **Dispatch**: `Order.dispatchState`, `dispatchAttempts`, `lastDispatchError`, plus an idempotency key store.
- **GST**: GSTIN, HSN code per product, invoice number and date, CGST/SGST/IGST breakdown on the order.
- **AuditLog**: actor, action, entity, entityId, diff (JSON), IP, createdAt.
- **Return/refund** model (Phase 3).
- **PageLockSetting**: `bypassSecretHash` instead of a plaintext secret, plus scheduling fields.

---

## 9. API client conventions

- Base URL from `NEXT_PUBLIC_API_BASE_URL`; one typed client in `src/lib/api`, with types and Zod schemas imported from `packages/types`.
- Response envelope: `{ data, meta? }` for success and `{ error: { code, message, fields? } }` for failure. Map `fields` onto form field errors.
- Pagination: `?page&pageSize&sort&order` with `meta: { total, page, pageSize }`.
- Concurrency: send `If-Match` with `updatedAt` (or a version) on updates; handle `409` with a "reload to see changes" dialog.
- Idempotency: `Idempotency-Key` header (UUID) on dispatch, cancel/refund and bulk operations.
- Timeouts: 30 seconds default; dispatch and uploads show long-running progress UI.
- Use TanStack Query keys per resource, and invalidate precisely after mutations.

---

## 10. Cache invalidation contract

The admin never talks to the CDN. The **API** purges or revalidates on each mutation: products, categories, banners, journal, and page-lock changes. The admin's job is to:

- show success only after the API confirms,
- show the "Pushed to edge" state for page locks,
- never imply a change is live if the API reports a purge failure (show a warning with a retry).

---

## 11. Notifications to the customer (context)

Dispatch triggers WhatsApp and SMS tracking messages. These require an approved provider, WhatsApp templates and DLT registration for SMS **[DECISION: provider]**. The admin only needs a "Resend tracking notification" action and a delivery-status line on the order.

---

## 12. Cloudinary upload flow

1. Admin selects files; the client validates type (JPEG/PNG/WebP/AVIF), size and minimum dimensions.
2. Client calls `POST /admin/media/sign-upload` with folder and intended use.
3. Client uploads **directly to Cloudinary** with the returned signature, timestamp and params.
4. On success, the client stores `secure_url` and `public_id` in the form state and sends them with the entity save.
5. Alt text is required before the parent form can be saved.
6. Deleting an image in the form removes the association; orphan cleanup is the backend's job.

Display with `f_auto,q_auto` and responsive widths; never hotlink full-resolution originals in lists.

---

## 13. Non-functional requirements

- **Performance**: list screens interactive in under 2 seconds on a typical laptop connection; no client bundles from storefront code; route-level code splitting; Recharts and the rich-text editor loaded lazily.
- **Reliability**: every network call has loading, error and retry states; optimistic updates only where rollback is implemented.
- **Observability**: Sentry (or equivalent) for the admin app with the admin user id attached (no PII beyond that).
- **Privacy**: customer phone and address are visible only to roles that need them; mask phone numbers in list views (full number on the detail page); never write customer data to logs or analytics.
- **Browser support**: current Chrome, Edge, Safari, Firefox; iOS Safari and Android Chrome for the order screens.

---

## 14. Testing requirements

- **Unit** (Vitest): slug generation, discount computation, SKU generation, IST ⇄ UTC conversion, permission hook.
- **Component**: DataTable URL-state sync, MediaUploader validation, form error mapping.
- **E2E** (Playwright), minimum set:
  1. Login, 2FA, forced re-login on expired refresh token.
  2. Create a product with variants and images, publish it, and archive it.
  3. Schedule a banner, then toggle it off with the kill switch.
  4. Order → dispatch with Ekart (mocked) → label download; double-click does not duplicate.
  5. Lock `/custom-design`, verify the public lock screen and the preview link bypass, then unlock.
  6. Role restrictions: `LOGISTICS_MGR` cannot open Page Lock or edit products.

---

## 15. Build order and milestones

| # | Milestone | Done when |
|---|---|---|
| M0 | Scaffold `apps/admin`, Tailwind tokens, `ui` primitives, typed API client with mocks, CI (lint, typecheck, tests) | App boots, tokens and DataTable/Form shell documented |
| M1 | Auth, RBAC, route guard, app shell, 2FA, idle timeout | Role matrix in section 4.2 enforced end to end |
| M2 | Media uploader + Categories (basic) + Product Catalog | A full product with variants, images and SEO can be created and published |
| M3 | Orders list and detail, status actions, Ekart dispatch, label and invoice | Dispatch acceptance criteria in Module 6 pass |
| M4 | Festive Banners | Scheduling and kill-switch acceptance pass |
| M5 | Page Lock controller + top-bar lock indicator | Module 7 acceptance passes with the storefront middleware |
| M6 | Dashboard & MAU | Metrics reconcile with backend aggregates |
| M7 | Journal CMS | Draft → scheduled → published works with product tags |
| M8 | Coupons, categories polish, audit-log viewer, customers, returns | Phase 3 backlog items closed |

At the end of each milestone the agent should post: what was built, what was stubbed, what is blocked on the backend, and updated `OPEN_QUESTIONS.md`.

---

## 16. Open decisions for the owner

1. **Database**: Neon or Cloud SQL (the blueprint recommends Neon but still references Cloud SQL, VPC connector and Auth Proxy). Affects backend only, but should be settled first.
2. **Edge store** for page locks and caching (Vercel Edge Config or Upstash vs Redis behind Cloud Run) and how the API pushes changes to it.
3. **Ekart access**: confirm direct API access under a commercial agreement; otherwise plan a courier-service interface with an aggregator fallback.
4. **Messaging provider** for WhatsApp, SMS and COD OTP, including DLT registration.
5. **2FA** policy for non-super admins, and the extra access layer in front of `admin.fittee.in`.
6. **Category hierarchy**: flat or two-level.
7. **Cart and checkout rules** the admin must reflect: free-shipping threshold, COD fee and limits, returns window.
8. **DPDP Act**: consent and retention policy for the visitor tracking that powers MAU.

---

## 17. Definition of done (whole project)

- All Phase 1 modules pass their acceptance criteria and the Playwright suite in CI.
- A non-technical operator can, without a developer: add a product, schedule a festive banner, dispatch an order and print its label, and lock `/checkout` then unlock it.
- No admin action leaves the storefront in a stale state; failures are always visible to the operator.
- Accessibility pass (keyboard-only walkthrough of every module) and security checklist from section 4.3 completed.
