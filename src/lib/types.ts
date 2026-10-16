// FITTEE Admin Panel — TypeScript Type Definitions
// Strictly derived from FITTEE Architecture Blueprint v2.0 & Agent Brief

export type AdminRole = 'SUPER_ADMIN' | 'CATALOG_MGR' | 'LOGISTICS_MGR';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  twoFactorEnabled: boolean;
  lastLoginAt: string;
  permissions: string[];
}

export type FitType = 'REGULAR_FIT' | 'OVERSIZED_FIT';
export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
export type ProductBadge = 'NEW' | 'BESTSELLER' | 'FESTIVE_SPECIAL' | null;

export interface ProductVariant {
  id: string;
  sku: string;
  colorName: string;
  colorHex: string;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL';
  stock: number;
  lowStockThreshold: number;
}

export interface ProductImageItem {
  id: string;
  url: string;
  altText: string;
  isHero: boolean;
  colorwayName?: string; // Links image to specific colourway or "all"
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  fitType: FitType;
  badge: ProductBadge;
  sellingPrice: number;
  originalMrp: number;
  discountPercent: number; // Computed: Math.round(((mrp - selling) / mrp) * 100)
  status: ProductStatus;
  artworkStory: string;
  fabricDetails: string;
  hsnCode: string;
  gstRate: number; // e.g. 5 or 12
  variants: ProductVariant[];
  images: ProductImageItem[];
  metaTitle: string;
  metaDescription: string;
  targetKeywords?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  storyExcerpt: string;
  bannerImage: string;
  iconMotif: string;
  displayOrder: number;
  isActive: boolean;
  productCount: number;
  metaTitle?: string;
  metaDescription?: string;
}

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RTO';

export type PaymentMethod = 'RAZORPAY' | 'COD';
export type PaymentStatus = 'PAID' | 'PENDING' | 'REFUNDED' | 'FAILED';
export type DispatchState = 'NOT_BOOKED' | 'QUEUED' | 'BOOKED' | 'FAILED';

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  fitType: FitType;
  colorName: string;
  colorHex: string;
  size: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  thumbnail: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isServiceable?: boolean;
}

export interface OrderStatusTimelineEntry {
  status: OrderStatus;
  timestamp: string;
  note: string;
  actor?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "FIT-2026-8942"
  customerCode: string; // e.g. "FIT-CUST-1049"
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  status: OrderStatus;
  dispatchState: DispatchState;
  awbNumber?: string;
  manifestId?: string;
  courierName?: string;
  timeline: OrderStatusTimelineEntry[];
  internalNotes: string[];
  createdAt: string;
  updatedAt: string;
}

export type BannerSlot = 'HERO_BANNER' | 'ANNOUNCEMENT_BAR' | 'CAROUSEL_CARD' | 'MID_PAGE_STRIP';
export type BannerStatus = 'SCHEDULED' | 'LIVE' | 'EXPIRED' | 'PAUSED';

export interface Banner {
  id: string;
  campaignName: string;
  slot: BannerSlot;
  headline: string;
  subheadline?: string;
  ctaText?: string;
  redirectUrl: string;
  linkedCouponCode?: string;
  priority: number;
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  startDateTime: string; // ISO UTC
  endDateTime: string; // ISO UTC
  isActive: boolean; // Instant kill switch
  createdAt: string;
  updatedAt: string;
}

export type PageLockMode = 'COMING_SOON' | 'MAINTENANCE';

export interface PageLock {
  id: string;
  routePath: string; // e.g. "/*", "/custom-design", "/checkout"
  mode: PageLockMode;
  isLocked: boolean;
  title: string;
  message: string;
  contactEmail: string;
  backgroundImageUrl?: string;
  estimatedEndTime?: string;
  lastChangedBy: string;
  lastChangedAt: string;
  bypassSecretHash?: string;
  activePreviewTokens?: string[];
}

export interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FLAT' | 'FREE_SHIPPING';
  value: number; // % or INR
  minOrderValue: number;
  maxDiscountCap?: number;
  usageLimitTotal: number;
  usageCount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

export interface JournalArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string;
  authorName: string;
  readingTimeMinutes: number;
  categoryTags: string[];
  taggedProductIds: string[];
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogItem {
  id: string;
  actorName: string;
  actorEmail: string;
  actorRole: AdminRole;
  action: string;
  entity: string;
  entityId: string;
  diffSummary: string;
  ipAddress: string;
  timestamp: string;
}

export interface AnalyticsMetrics {
  rollingMau: number;
  mauChangePercent: number;
  dau: number;
  stickinessRatio: number; // DAU / MAU %
  avgSessionDurationSeconds: number;
  grossRevenueToday: number;
  grossRevenueThisMonth: number;
  netRevenueAfterReturns: number;
  averageOrderValue: number;
  conversionRate: number;
  historicalMau: { month: string; mau: number; revenue: number }[];
  orderPipelineCounts: Record<OrderStatus, number>;
  topProducts: {
    id: string;
    name: string;
    fitType: FitType;
    unitsSold: number;
    revenue: number;
    image: string;
  }[];
  regionalDistribution: {
    region: string;
    orders: number;
    revenue: number;
    isJharkhand: boolean;
  }[];
}
