# FITTEE Backend — AI Agent & Code Generation Rules

> **Authoritative Guidelines for AI Coding Agents, Models, and Automated Code Generators**  
> Target: `/home/spidey/Documents/client_projects/fittee` (`backend` branch)  
> Purpose: Zero-error, type-safe, resilient code generation for the FITTEE REST API

---

## 1. Prime Directives for Coding Agents

1. **Branch Isolation**: Work strictly on the `backend` branch. Never modify, merge, or overwrite code on `main` (Storefront) or `admin` (Admin Panel).
2. **Zero Inventions**: Do not invent new database fields, endpoints, or business rules outside the architectural blueprint. If a requirement is ambiguous, stick to the documented contracts in `context.md`.
3. **Type Safety & Zero Warnings**: Code must compile with **0 errors and 0 warnings** under `tsc` (`npm run build`). No `any` escapes in public signatures.
4. **Offline Resilience**: The database may be unreachable during development or sandboxed test runs. Every database operation must safely fall back to in-memory mock datasets via `withDbFallback`.
5. **No Broken Builds**: Every change must be validated against `npm run build` and `npm test` before concluding work.

---

## 2. Core Architecture & File Structure

```
fittee/ (backend branch)
├── .env.example              # Template for environment variables
├── Dockerfile                # Multi-stage production container build
├── package.json              # Dependencies and lifecycle scripts
├── tsconfig.json             # TypeScript 5.8 strict compiler options
├── vitest.config.ts          # Vitest test runner configuration
├── context.md                # System context, data models, and API registry
├── AGENTS.md                 # Agent coding rules (this document)
├── prisma/
│   ├── schema.prisma         # 17 Prisma models for Neon PostgreSQL
│   └── seed.ts               # Database seed script for initial datasets
├── src/
│   ├── server.ts             # Process entrypoint & graceful shutdown
│   ├── app.ts                # Express application factory & middleware stack
│   ├── config/
│   │   ├── env.ts            # Zod-validated environment config
│   │   └── prisma.ts         # Singleton Prisma client & withDbFallback helper
│   ├── types/
│   │   └── express.d.ts      # Express Request augmentation (req.adminUser)
│   ├── utils/
│   │   ├── apiResponse.util.ts # Standardized ApiResponseHandler envelope
│   │   ├── errors.util.ts      # AppError custom error hierarchy
│   │   └── logger.util.ts      # Structured console logger
│   ├── middleware/
│   │   ├── auth.middleware.ts  # requireAdminAuth & requireRoles RBAC
│   │   ├── error.middleware.ts # Global notFoundHandler & errorHandler
│   │   └── validate.middleware.ts # Zod schema validation middleware
│   ├── data/
│   │   └── mockCatalog.data.ts # In-memory mock catalog & data seeds
│   ├── services/
│   │   ├── auth.service.ts          # Admin JWT authentication & hashing
│   │   ├── storeCatalog.service.ts  # Storefront catalog, banners & CMS
│   │   ├── order.service.ts         # Order placement, payments & status
│   │   ├── adminCatalog.service.ts  # Admin CRUD for banners, categories, products
│   │   ├── adminAnalytics.service.ts# Rolling MAU, DAU & revenue calculation
│   │   ├── razorpay.service.ts      # Razorpay orders & HMAC SHA256 verification
│   │   ├── ekart.service.ts         # Ekart logistics dispatch & serviceability
│   │   ├── invoice.service.ts       # 4x6" thermal labels & GST tax invoice PDFs
│   │   └── cloudinary.service.ts    # Signed direct-upload signatures
│   ├── controllers/                 # HTTP handlers delegating to services
│   └── routes/                      # Express route registrations
└── tests/                           # Vitest automated test suites
```

---

## 3. The 10 Golden Rules for Error-Free Code Generation

### Rule 1: Always Use `withDbFallback` for Prisma Database Calls
The production database is hosted on Neon Serverless (`ap-south-1`). In development or testing without live network access, a raw call like `await prisma.product.findMany()` will hang or fail.
- **Always wrap database queries** with `withDbFallback(dbQuery, fallback)` from `src/config/prisma.ts`.
- **Provide a realistic in-memory fallback** returning data from `src/data/mockCatalog.data.ts` or in-memory Maps.

```typescript
// ✅ CORRECT: Protected with fail-fast fallback
export class MyService {
  static async getItems() {
    return withDbFallback(
      () => prisma.myModel.findMany({ where: { isActive: true } }),
      () => IN_MEMORY_ITEMS.filter((i) => i.isActive)
    );
  }
}

// ❌ WRONG: Will hang and fail tests when Neon is unreachable
export class MyService {
  static async getItems() {
    return await prisma.myModel.findMany({ where: { isActive: true } });
  }
}
```

### Rule 2: Import Enums Directly from `@prisma/client`
Do not declare duplicate TypeScript enums or string unions that shadow Prisma types. Always import them directly:

```typescript
// ✅ CORRECT
import { AdminRole, OrderStatus, PaymentMethod, FitType, ProductBadge } from '@prisma/client';

// ❌ WRONG
export type OrderStatus = 'PLACED' | 'CONFIRMED'; // Conflicts with Prisma client
```

### Rule 3: Buffer Length Safety in Cryptographic Operations
In Node.js, `crypto.timingSafeEqual(bufA, bufB)` throws an uncaught `RangeError: Input buffers must have the same byte length` if the buffers have different lengths.
- **Always verify buffer lengths match before comparing**:

```typescript
// ✅ CORRECT
const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
const signatureBuffer = Buffer.from(receivedSignature, 'utf-8');

if (expectedBuffer.length !== signatureBuffer.length) {
  return false;
}
return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);

// ❌ WRONG: Throws RangeError if user sends a shorter/longer string
return crypto.timingSafeEqual(Buffer.from(sig1), Buffer.from(sig2));
```

### Rule 4: Standardized Response Envelopes via `ApiResponseHandler`
Controllers must never use `res.json({ ... })` directly. Always use `ApiResponseHandler`:

```typescript
// ✅ CORRECT
ApiResponseHandler.success(res, data, 'Categories retrieved successfully');
ApiResponseHandler.created(res, newItem, 'Item created successfully');

// ❌ WRONG
res.status(200).json({ ok: true, data });
```

### Rule 5: Strict Input Validation via Zod Middleware
Validate request inputs before they reach the controller using the validation middleware:
- Request body: `validateBody(schema)`
- Query params: `validateQuery(schema)`
- Path params: `validateParams(schema)`

```typescript
// In routes file:
myRouter.post('/items', validateBody(createItemSchema), MyController.createItem);
```

### Rule 6: Error Flow & Custom `AppError` Hierarchy
Throw structured errors using `AppError` from `src/utils/errors.util.ts`. Do not throw raw strings or generic `Error`:

```typescript
// Available helpers:
throw AppError.badRequest('Invalid coupon code provided');
throw AppError.unauthorized('Invalid or expired authentication token');
throw AppError.forbidden('Only Super Admin can perform this action');
throw AppError.notFound('Product with given slug not found');
throw AppError.conflict('SKU already exists in the catalog');
throw AppError.internal('Failed to generate shipping label PDF');
```

Controllers must wrap their logic in `try ... catch` and pass unhandled errors to `next(error)`:
```typescript
static async myHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await MyService.doWork(req.body);
    ApiResponseHandler.success(res, result);
  } catch (error) {
    next(error);
  }
}
```

### Rule 7: RBAC Protection on Admin Routes
Every admin endpoint must be secured:
1. First apply `requireAdminAuth` to verify the JWT and attach `req.adminUser`.
2. Apply `requireRoles(AdminRole.SUPER_ADMIN, ...)` if the operation requires specific privilege levels.

```typescript
adminOrderRouter.post(
  '/orders/:id/cancel',
  requireAdminAuth,
  requireRoles(AdminRole.SUPER_ADMIN, AdminRole.LOGISTICS_MGR),
  validateBody(cancelOrderSchema),
  AdminOrderController.cancelOrder
);
```

### Rule 8: Idempotency for Critical Operations
External integration calls (e.g., booking Ekart logistics dispatch or processing payments) must be idempotent:
- Check if the entity is already processed (e.g. `order.awbNumber` already exists or `order.dispatchState === 'BOOKED'`).
- If already processed, return the existing tracking / dispatch info rather than double-booking with the carrier.

### Rule 9: Safe Date Handling
- In Prisma models, date fields are `DateTime` (JavaScript `Date` instances).
- When filtering or comparing dates, parse incoming ISO strings with `new Date(isoString)`.
- When constructing mock in-memory objects, store dates as `Date` objects or ISO strings consistently.

### Rule 10: Server-Side Price Authority
Never trust item pricing or totals sent from client storefront requests:
- Look up the active selling price from the product/variant record on the server.
- Compute `subtotal = sum(unitPrice * quantity)`.
- Calculate apparel GST (5% standard, HSN `61091000`) and shipping fees on the backend.

---

## 4. Step-by-Step Recipes for Code Generation

### Recipe A: Adding a New Storefront Endpoint

1. **Service (`src/services/storeCatalog.service.ts`)**:
   Add a static method returning data with `withDbFallback`:
   ```typescript
   static async getFeaturedArtisans(): Promise<Artisan[]> {
     return withDbFallback(
       () => prisma.artisan.findMany({ where: { isActive: true } }),
       () => MOCK_ARTISANS
     );
   }
   ```
2. **Controller (`src/controllers/storeCatalog.controller.ts`)**:
   Add the handler:
   ```typescript
   static async getArtisans(_req: Request, res: Response, next: NextFunction): Promise<void> {
     try {
       const artisans = await StoreCatalogService.getFeaturedArtisans();
       ApiResponseHandler.success(res, artisans, 'Artisans retrieved');
     } catch (error) {
       next(error);
     }
   }
   ```
3. **Route (`src/routes/store.routes.ts`)**:
   Register the route:
   ```typescript
   storeRouter.get('/artisans', StoreCatalogController.getArtisans);
   ```
4. **Test (`tests/storefront.test.ts`)**:
   Add an automated test using Supertest:
   ```typescript
   it('GET /api/v1/store/artisans should return active artisans', async () => {
     const res = await request(app).get('/api/v1/store/artisans');
     expect(res.status).toBe(200);
     expect(res.body.success).toBe(true);
   });
   ```

---

### Recipe B: Modifying or Adding a Prisma Model

1. **Edit `prisma/schema.prisma`**:
   Define the model following existing naming conventions:
   - Model name: PascalCase (e.g. `Coupon`)
   - Table mapping: `@@map("coupons")`
   - Primary key: `id String @id @default(uuid())`
   - Timestamps: `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt`
2. **Generate Prisma Client**:
   Run `npx prisma generate` to refresh the TypeScript client declarations.
3. **Update In-Memory Mock Datasets**:
   Add corresponding in-memory fallback store in `src/data/mockCatalog.data.ts` or the service file.
4. **Compile & Test**:
   Run `npm run build` to verify types.

---

## 5. Verification Commands

Always run these verification steps before concluding any task:

```bash
# 1. Type-check entire codebase
npm run build

# 2. Run all unit and integration test suites
npm test

# 3. Check git status to ensure no unwanted files were created
git status
```

Acceptance Criteria:
- `npm run build` exits with code `0` (clean compilation).
- `npm test` passes all tests across all test suites.
- No modifications made outside the `backend` branch.
