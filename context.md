# FITTEE Backend — System Context & Model Architecture

> **Authoritative Technical Blueprint & System Context for the FITTEE E-Commerce REST API Backend**  
> Branch: `backend` | Runtime: Node.js (>=20) + Express + TypeScript + Prisma ORM + PostgreSQL (Neon)

---

## 1. Brand & Product Context

**FITTEE** is a contemporary streetwear brand rooted in the indigenous culture, tribal art, and folk traditions of Jharkhand, India.

- **Artistic Heritage**: Collections are built around living tribal art traditions:
  - **Sohrai**: Harvest and animal motifs painted by women artisans on mud walls.
  - **Khovar**: Bridal/wedding cave art featuring intricate linear and geometric combs.
  - **Karam**: Nature, flora, and festival celebration symbols.
  - **Dokra**: Ancient lost-wax brass and metal casting motifs.
- **Product Forms**:
  - High-GSM combed cotton oversized streetwear t-shirts (drop-shoulder, 240+ GSM).
  - Premium regular-fit daily wear tees (180+ GSM bio-washed).
  - Custom tribal co-creation inquiries and cultural journal storytelling.
- **Core Business Mandate**:
  - The non-technical brand and merchandising team must manage **100% of the public storefront** (products, banners, categories, journal blogs, page lock maintenance screens, and fulfillment) from the dedicated Admin Panel without touching code or redeploying.

---

## 2. Multi-Branch Repository Topology

The FITTEE codebase is organized across three Git branches:

| Branch | Application | Tech Stack | Hosted URL | Purpose |
|---|---|---|---|---|
| `main` | Customer Storefront | Next.js 16, React 19, Tailwind CSS, Framer Motion | `https://fittee.in` | Public e-commerce shopping experience |
| `admin` | Admin Control Panel | Next.js 16, Tailwind CSS, Lucide Icons, pure REST client | `https://admin.fittee.in` | Merchandising, MAU analytics, orders, CMS |
| `backend` | E-Commerce REST API | Node.js, Express, TypeScript, Prisma ORM, Neon PostgreSQL | `https://api.fittee.in` | Single source of business truth, transactions, logistics |

> **Strict Isolation Rule**: The `backend` branch contains the standalone Express server and Prisma ORM data layer. It does not import frontend code. The admin and storefront frontends communicate with this backend exclusively over HTTP REST.

---

## 3. Database & Runtime Architecture

### 3.1 Neon Serverless PostgreSQL & Connection Pooling

The primary persistence layer is **Neon Serverless PostgreSQL** hosted in AWS `ap-south-1` (Mumbai).

- **Connection Pooling (`DATABASE_URL`)**: Uses PgBouncer connection pooling (`-pooler` endpoint on port `5432`) to support serverless concurrency and prevent connection exhaustion.
- **Direct Connection (`DIRECT_URL`)**: Unpooled direct connection used exclusively for schema migrations (`prisma migrate dev`, `prisma db push`).
- **SSL Configuration**: Requires `sslmode=require` in production.

### 3.2 Dual-Mode Resilience Architecture (`withDbFallback`)

To enable development and automated testing in environments without network connectivity to Neon (e.g. offline dev, sandboxed CI/CD, local testing), every database query is protected by the `withDbFallback` pattern (`src/config/prisma.ts`):

```typescript
export const withDbFallback = async <T>(
  dbQuery: () => Promise<T>,
  fallback: () => Promise<T> | T
): Promise<T> => {
  if (isDatabaseAvailable === false) {
    return await fallback();
  }
  try {
    const queryPromise = dbQuery();
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('DB_TIMEOUT')), 500)
    );
    const result = await Promise.race([queryPromise, timeoutPromise]);
    isDatabaseAvailable = true;
    return result;
  } catch {
    isDatabaseAvailable = false;
    return await fallback();
  }
};
```

- When the database is unreachable, a 500ms race timeout triggers fail-fast mode.
- Subsequent calls immediately use the in-memory mock datasets without waiting for network timeouts.
- In-memory data stores (`MOCK_PRODUCTS`, `IN_MEMORY_ORDERS`, `IN_MEMORY_ADMIN_BANNERS`, etc.) support full CRUD, status updates, and filtering in fallback mode.

---

## 4. Prisma Schema & Data Models Registry

All database entities are declared in `prisma/schema.prisma`. Below is the complete specification of all 17 models, grouped by domain.

### 4.1 Core User & Customer Models

#### `AdminRole` (Enum)
- `SUPER_ADMIN`: Unrestricted access across all modules, financial metrics, page locks, and team permissions.
- `CATALOG_MGR`: Management of products, categories, festive banners, and cultural journal posts.
- `LOGISTICS_MGR`: Order status updates, Ekart dispatch, thermal label printing, and customer delivery tracking.

#### `AdminUser` (Table: `admin_users`)
Stores authenticated operators and staff of the FITTEE Admin Panel.
```prisma
model AdminUser {
  id               String    @id @default(uuid())
  name             String
  email            String    @unique
  passwordHash     String
  role             AdminRole @default(CATALOG_MGR)
  avatarUrl        String?
  twoFactorEnabled Boolean   @default(false)
  lastLoginAt      DateTime?
  permissions      String[]  @default([])
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  auditLogs        AuditLog[]
}
```

#### `Customer` (Table: `customers`)
Represents customer identities across guest and registered purchases.
```prisma
model Customer {
  id           String    @id @default(uuid())
  customerCode String    @unique // Format: "FIT-CUST-XXXX" (e.g., FIT-CUST-1049)
  fullName     String
  email        String    @unique
  phone        String
  firebaseUid  String?   @unique
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  addresses    Address[]
  orders       Order[]
}
```

#### `Address` (Table: `addresses`)
Shipping addresses associated with customer profiles.
```prisma
model Address {
  id            String   @id @default(uuid())
  customerId    String
  fullName      String
  phone         String
  addressLine1  String
  addressLine2  String?
  landmark      String?
  city          String
  state         String
  pincode       String   // 6 digits (Indian postal code)
  isDefault     Boolean  @default(false)
  isServiceable Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  customer      Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
}
```

---

### 4.2 Catalog & Apparel Models

#### Enums
- **`FitType`**: `REGULAR_FIT`, `OVERSIZED_FIT`
- **`ProductStatus`**: `DRAFT`, `ACTIVE`, `ARCHIVED`
- **`ProductBadge`**: `NEW`, `BESTSELLER`, `FESTIVE_SPECIAL`

#### `Category` (Table: `categories`)
Curated collections (e.g., "Sohrai Harvest Edition", "Khovar Bridal Line", "Dokra Signature").
```prisma
model Category {
  id              String    @id @default(uuid())
  name            String
  slug            String    @unique
  subtitle        String?
  storyExcerpt    String?
  bannerImage     String?
  iconMotif       String?
  displayOrder    Int       @default(0)
  isActive        Boolean   @default(true)
  metaTitle       String?
  metaDescription String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  products        Product[]
}
```

#### `Product` (Table: `products`)
Core apparel item model.
```prisma
model Product {
  id              String        @id @default(uuid())
  displayId       Int           @default(autoincrement()) // Compatibility with frontend numeric IDs (1, 2, 3...)
  title           String
  slug            String        @unique
  categoryId      String
  fitType         FitType       @default(REGULAR_FIT)
  badge           ProductBadge?
  sellingPrice    Float
  originalMrp     Float
  discountPercent Int           @default(0)
  status          ProductStatus @default(ACTIVE)
  artworkStory    String        @db.Text
  fabricDetails   String        @db.Text
  hsnCode         String        @default("61091000") // Cotton T-Shirts
  gstRate         Float         @default(5.0)       // 5% standard apparel GST
  rating          Float         @default(4.8)
  reviewsCount    Int           @default(0)
  metaTitle       String?
  metaDescription String?
  targetKeywords  String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  category        Category      @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  variants        ProductVariant[]
  images          ProductImage[]
  taggedInJournals JournalProductTag[]
}
```

#### `ProductVariant` (Table: `product_variants`)
SKU-level inventory item representing color and size combinations.
- **SKU Format**: `SKU-<MOTIF>-<FIT>-<COLOR>-<SIZE>` (e.g., `SKU-SOH-REG-WH-M`)
- **Sizes**: `S`, `M`, `L`, `XL`, `XXL`, `3XL`
```prisma
model ProductVariant {
  id                String   @id @default(uuid())
  productId         String
  sku               String   @unique
  colorName         String
  colorHex          String   // e.g., "#E8DFC8"
  size              String
  stock             Int      @default(0)
  lowStockThreshold Int      @default(5)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  product           Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
}
```

#### `ProductImage` (Table: `product_images`)
```prisma
model ProductImage {
  id           String   @id @default(uuid())
  productId    String
  url          String
  altText      String   @default("FITTEE Tribal T-Shirt")
  isHero       Boolean  @default(false)
  colorwayName String?  // Links to specific variant colorway or "all"
  displayOrder Int      @default(0)
  createdAt    DateTime @default(now())
  product      Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
}
```

---

### 4.3 Orders, Logistics & Payments

#### Enums
- **`OrderStatus`**: `PLACED`, `CONFIRMED`, `PACKED`, `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`, `RTO`
- **`PaymentMethod`**: `RAZORPAY`, `COD`
- **`PaymentStatus`**: `PAID`, `PENDING`, `REFUNDED`, `FAILED`
- **`DispatchState`**: `NOT_BOOKED`, `QUEUED`, `BOOKED`, `FAILED`

#### `Order` (Table: `orders`)
Transactional order record capturing snapshot customer and shipping data.
```prisma
model Order {
  id              String        @id @default(uuid())
  orderNumber     String        @unique // e.g. "FIT-2026-8942"
  customerId      String
  customerCode    String        // e.g. "FIT-CUST-1049"
  customerName    String
  customerEmail   String
  customerPhone   String
  shippingAddress Json          // Snapshot: { fullName, phone, addressLine1, addressLine2, city, state, pincode }
  subtotal        Float
  discountAmount  Float         @default(0)
  couponCode      String?
  shippingFee     Float         @default(0)
  totalAmount     Float
  paymentMethod   PaymentMethod @default(RAZORPAY)
  paymentStatus   PaymentStatus @default(PENDING)
  transactionId   String?
  status          OrderStatus   @default(PLACED)
  dispatchState   DispatchState @default(NOT_BOOKED)
  awbNumber       String?
  manifestId      String?
  courierName     String?       @default("Ekart Logistics")
  internalNotes   String[]      @default([])
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  customer        Customer      @relation(fields: [customerId], references: [id], onDelete: Restrict)
  items           OrderItem[]
  timeline        OrderStatusTimeline[]
}
```

#### `OrderItem` (Table: `order_items`)
Line items purchased within an order.
```prisma
model OrderItem {
  id           String   @id @default(uuid())
  orderId      String
  productId    String
  variantId    String?
  productTitle String
  fitType      FitType  @default(REGULAR_FIT)
  colorName    String
  colorHex     String
  size         String
  sku          String
  quantity     Int      @default(1)
  unitPrice    Float
  totalPrice   Float
  thumbnail    String
  order        Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
}
```

#### `OrderStatusTimeline` (Table: `order_status_timeline`)
Audit trail of status transitions.
```prisma
model OrderStatusTimeline {
  id        String      @id @default(uuid())
  orderId   String
  status    OrderStatus
  actor     String      @default("SYSTEM") // Operator name, "SYSTEM", or "EKART_WEBHOOK"
  note      String
  timestamp DateTime    @default(now())
  order     Order       @relation(fields: [orderId], references: [id], onDelete: Cascade)
}
```

---

### 4.4 Marketing, Festive Banners & Cultural Journal CMS

#### Enums
- **`BannerSlot`**: `HERO_BANNER`, `ANNOUNCEMENT_BAR`, `CAROUSEL_CARD`, `MID_PAGE_STRIP`
- **`JournalStatus`**: `DRAFT`, `SCHEDULED`, `PUBLISHED`, `ARCHIVED`

#### `FestiveBanner` (Table: `festive_banners`)
Dynamic promotional banners displayed on storefront touchpoints.
```prisma
model FestiveBanner {
  id               String     @id @default(uuid())
  campaignName     String
  slot             BannerSlot @default(HERO_BANNER)
  headline         String
  subheadline      String?
  ctaText          String?    @default("Explore Collection")
  redirectUrl      String     @default("/#featured")
  linkedCouponCode String?
  priority         Int        @default(1)
  desktopImageUrl  String?
  mobileImageUrl   String?
  startDateTime    DateTime
  endDateTime      DateTime
  isActive         Boolean    @default(true)
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt
}
```

#### `JournalPost` (Table: `journal_posts`) & `JournalProductTag`
Cultural editorial articles celebrating tribal art traditions with shoppable product tags.
```prisma
model JournalPost {
  id                 String              @id @default(uuid())
  title              String
  slug               String              @unique
  excerpt            String              @db.Text
  body               String              @db.Text
  coverImage         String
  authorName         String              @default("FITTEE Cultural Collective")
  readingTimeMinutes Int                 @default(4)
  categoryTags       String[]            @default([])
  status             JournalStatus       @default(PUBLISHED)
  publishedAt        DateTime?
  metaTitle          String?
  metaDescription    String?
  createdAt          DateTime            @default(now())
  updatedAt          DateTime            @updatedAt
  taggedProducts     JournalProductTag[]
}

model JournalProductTag {
  id        String      @id @default(uuid())
  journalId String
  productId String
  journal   JournalPost @relation(fields: [journalId], references: [id], onDelete: Cascade)
  product   Product     @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([journalId, productId])
}
```

---

### 4.5 Operations, Security, Metrics & Inquiries

#### `PageLockSetting` (Table: `page_lock_settings`)
Allows the admin team to dynamically take routes offline (`/*`, `/custom-design`, `/checkout`) with Maintenance or Coming Soon templates.
```prisma
enum PageLockMode {
  COMING_SOON
  MAINTENANCE
}

model PageLockSetting {
  id                  String       @id @default(uuid())
  routePath           String       @unique // e.g., "/*", "/custom-design"
  mode                PageLockMode @default(MAINTENANCE)
  isLocked            Boolean      @default(false)
  title               String       @default("Scheduled Upgrades in Progress")
  message             String       @db.Text
  contactEmail        String       @default("contact@fittee.in")
  backgroundImageUrl  String?
  estimatedEndTime    DateTime?
  lastChangedBy       String       @default("Admin")
  lastChangedAt       DateTime     @default(now())
  bypassSecretHash    String?
  activePreviewTokens String[]     @default([])
}
```

#### `DailySiteMetric` (Table: `daily_site_metrics`)
Tracks daily traffic, 30-day Rolling MAU, revenue, and regional distribution.
```prisma
model DailySiteMetric {
  id                String   @id @default(uuid())
  date              DateTime @unique @db.Date
  totalVisitors     Int      @default(0)
  uniqueSessions    Int      @default(0)
  rollingMau        Int      @default(0)
  dau               Int      @default(0)
  stickinessRatio   Float    @default(0) // (DAU / MAU) * 100
  grossRevenue      Float    @default(0)
  netRevenue        Float    @default(0)
  ordersCount       Int      @default(0)
  unitsSold         Int      @default(0)
  averageOrderValue Float    @default(0)
  regionalData      Json?    // Array: [{ region: "Ranchi, JH", orders: 42, revenue: 37758 }]
  createdAt         DateTime @default(now())
}
```

#### `CustomInquiry` (Table: `custom_inquiries`)
Stores customer co-creation requests for custom tribal motifs and garments.
```prisma
enum InquiryStatus {
  NEW
  IN_REVIEW
  CONTACTED
  ARCHIVED
}

model CustomInquiry {
  id              String        @id @default(uuid())
  customerEmail   String
  styleChoice     String        // sohrai, khovar, karam, dokra
  garmentChoice   String        // oversized, regular, hoodie, tote
  placementChoice String        // back, chest, pocket
  customPrompt    String        @db.Text
  status          InquiryStatus @default(NEW)
  internalNotes   String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

#### `NewsletterSubscriber` (Table: `newsletter_subscribers`)
```prisma
model NewsletterSubscriber {
  id           String   @id @default(uuid())
  email        String   @unique
  isActive     Boolean  @default(true)
  subscribedAt DateTime @default(now())
}
```

#### `AuditLog` (Table: `audit_logs`)
Captures all critical administrative actions for accountability.
```prisma
model AuditLog {
  id          String     @id @default(uuid())
  adminUserId String?
  actorName   String
  actorEmail  String
  actorRole   AdminRole
  action      String     // e.g. "PRODUCT_CREATE", "BANNER_TOGGLE", "ORDER_DISPATCH"
  entity      String     // e.g. "Product", "FestiveBanner", "Order"
  entityId    String
  diffSummary String     @db.Text
  ipAddress   String     @default("127.0.0.1")
  timestamp   DateTime   @default(now())
  adminUser   AdminUser? @relation(fields: [adminUserId], references: [id], onDelete: SetNull)
}
```

---

## 5. API Conventions & Standard Envelopes

All responses conform to the standard `ApiResponsePayload<T>` envelope (`src/utils/apiResponse.util.ts`):

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-10-16T15:00:00.000Z"
}
```

### Standard Error Response:
```json
{
  "success": false,
  "message": "Validation failed",
  "error": [
    { "field": "customer.email", "message": "Valid customer email required" }
  ],
  "timestamp": "2026-10-16T15:00:00.000Z"
}
```

### HTTP Status Codes:
- `200 OK`: Successful retrieval or update.
- `201 Created`: Successful entity creation (`ApiResponseHandler.created`).
- `400 Bad Request`: Validation failure or business rule violation (`AppError.badRequest`).
- `401 Unauthorized`: Missing, invalid, or expired JWT token (`AppError.unauthorized`).
- `403 Forbidden`: Authenticated user lacks required `AdminRole` (`AppError.forbidden`).
- `404 Not Found`: Resource does not exist (`AppError.notFound`).
- `409 Conflict`: Resource collision (e.g. duplicate slug or SKU) (`AppError.conflict`).
- `500 Internal Server Error`: Unhandled exception (`AppError.internal`).

---

## 6. Complete API Route Registry

### 6.1 Storefront Customer Endpoints (`/api/v1/store/...`)

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| `GET` | `/products` | Public | List active products (supports category, fitType filter) |
| `GET` | `/products/:slug` | Public | Get single product by slug or numeric ID |
| `GET` | `/categories` | Public | List active categories ordered by `displayOrder` |
| `GET` | `/festive-banners` | Public | Active promotional banners for homepage & strips |
| `GET` | `/journal` | Public | Published cultural storytelling articles |
| `GET` | `/journal/:slug` | Public | Article detail with shoppable tagged products |
| `POST` | `/custom-inquiries` | Public | Submit custom tribal co-creation request |
| `POST` | `/newsletter/subscribe` | Public | Newsletter subscription |
| `POST` | `/logistics/pincode-check` | Public | Pincode delivery serviceability check |
| `GET` | `/maintenance-status` | Public | Current maintenance / page lock status |
| `POST` | `/orders` | Public | Create order (calculates totals, creates Razorpay order) |
| `POST` | `/orders/verify-payment` | Public | Verify Razorpay HMAC-SHA256 signature |
| `POST` | `/orders/:id/cod-confirm` | Public | Confirm Cash-on-Delivery order |
| `GET` | `/orders/:orderNumber` | Public | Public order tracking summary by order number |

### 6.2 Admin Control Endpoints (`/api/v1/admin/...`)

| Method | Endpoint | Allowed Roles | Purpose |
|---|---|---|---|
| `POST` | `/auth/login` | Public | Admin login, returns JWT token & operator details |
| `GET` | `/auth/me` | Authenticated | Validate token and retrieve current admin user |
| `GET` | `/analytics/dashboard` | Authenticated | Rolling MAU, gross/net revenue, order volume |
| `GET` | `/banners` | Authenticated | List all festive banners (active & inactive) |
| `POST` | `/banners` | Authenticated | Create festive banner |
| `PATCH` | `/banners/:id/toggle` | Authenticated | Instant toggle active/inactive status |
| `DELETE` | `/banners/:id` | Authenticated | Remove festive banner |
| `GET` | `/journal` | Authenticated | List all articles (draft, scheduled, published) |
| `POST` | `/journal` | Authenticated | Create new cultural journal post |
| `GET` | `/categories` | Authenticated | List all categories |
| `POST` | `/categories` | Authenticated | Create new product category |
| `PUT` | `/categories/reorder` | Authenticated | Reorder categories via drag-and-drop order list |
| `GET` | `/products` | Authenticated | List catalog with inventory and status |
| `POST` | `/products` | Authenticated | Create product with variants and artwork story |
| `PUT` | `/products/:id` | Authenticated | Update product details and inventory |
| `GET` | `/orders` | Authenticated | Filtered order dossier (tabs, search, payment) |
| `GET` | `/orders/:id` | Authenticated | Comprehensive customer viewing dossier |
| `PATCH` | `/orders/:id/status` | Authenticated | Manual status override with timeline log |
| `POST` | `/orders/:id/notes` | Authenticated | Append operator internal timestamped note |
| `POST` | `/orders/:id/cancel` | `SUPER_ADMIN`, `LOGISTICS_MGR` | Cancel order & return inventory |
| `POST` | `/orders/:id/dispatch-ekart` | `SUPER_ADMIN`, `LOGISTICS_MGR` | 1-Click Ekart dispatch & AWB assignment |
| `GET` | `/orders/:id/label` | Authenticated | Stream 4x6" thermal PDF shipping label |
| `GET` | `/orders/:id/invoice` | Authenticated | Stream standard GST tax invoice PDF |
| `POST` | `/media/sign-upload` | Authenticated | Generate signed Cloudinary upload params |
| `GET` | `/page-locks` | Authenticated | List all route lock configurations |
| `POST` | `/page-locks/toggle` | Authenticated | Instant lock/unlock of storefront routes |

---

## 7. External Integrations Architecture

### 7.1 Razorpay Payment Engine
- **Order Creation**: Generated in paise (`totalAmount * 100`).
- **Signature Verification**: Verifies `HMAC-SHA256(order_id + "|" + payment_id, secret)`.
- **Buffer Safety**: Validates matching byte length before calling `crypto.timingSafeEqual` to avoid Node.js `RangeError`.
- **Mock Simulation Mode**: Enabled when `MOCK_EXTERNAL_SERVICES=true` or test keys are present.

### 7.2 Ekart Logistics Engine
- **Pincode Serviceability**: Evaluates deliverability, standard delivery days (2–4 days for Jharkhand, 4–7 days pan-India), and COD availability.
- **Dispatch Booking**: Books shipments via Ekart API, assigns unique AWB tracking code (`EKT-IND-XXXXXX`), and transitions order state to `PACKED` / `SHIPPED`.
- **Idempotency Protection**: Repeated dispatch calls return the existing booking without duplicating manifests or carrier fees.
- **Thermal Label Generator**: Generates 288x432 pt (4x6" standard) thermal PDF labels with barcode placeholders, consignee address, and routing codes (`src/services/invoice.service.ts`).
- **GST Invoice Generator**: Generates formatted A4 tax invoice PDFs detailing HSN code `61091000`, 5% apparel GST split (CGST 2.5% + SGST 2.5% or IGST 5%), and supplier TIN/GSTIN.

### 7.3 Cloudinary Direct Upload
- Frontends upload media directly to Cloudinary using signed parameters generated by `/api/v1/admin/media/sign-upload`.
- Generates `SHA-1` signature on `(folder + timestamp + api_secret)` so API keys are never exposed in client bundles.
