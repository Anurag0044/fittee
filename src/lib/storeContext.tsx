"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  Product,
  Category,
  Order,
  Banner,
  PageLock,
  Coupon,
  JournalArticle,
  AuditLogItem,
  AnalyticsMetrics,
  OrderStatus,
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_BANNERS,
  INITIAL_PAGE_LOCKS,
  INITIAL_COUPONS,
  INITIAL_JOURNAL,
  INITIAL_AUDIT_LOGS,
  INITIAL_ANALYTICS,
} from './mockData';
import { useAuth } from './authContext';

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'discountPercent'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  archiveProduct: (id: string) => void;
  updateVariantStock: (productId: string, variantId: string, newStock: number) => void;

  // Categories
  categories: Category[];
  addCategory: (cat: Omit<Category, 'id' | 'productCount'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  reorderCategories: (newOrderedIds: string[]) => void;

  // Orders & Dispatch
  orders: Order[];
  updateOrderStatus: (id: string, newStatus: OrderStatus, note?: string) => void;
  dispatchWithEkart: (orderId: string) => { success: boolean; awb: string; message: string };
  cancelOrder: (orderId: string, reason: string) => void;
  addOrderNote: (orderId: string, note: string) => void;

  // Festive Banners
  banners: Banner[];
  toggleBannerKillSwitch: (id: string) => boolean;
  addBanner: (banner: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBanner: (id: string, updates: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;

  // Page Locks
  pageLocks: PageLock[];
  togglePageLock: (id: string) => void;
  updatePageLock: (id: string, updates: Partial<PageLock>) => void;
  generatePreviewLink: (id: string) => string;
  isAnyPageLockActive: boolean;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  toggleCouponActive: (id: string) => void;

  // Journal
  journalArticles: JournalArticle[];
  addJournalArticle: (article: Omit<JournalArticle, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJournalArticle: (id: string, updates: Partial<JournalArticle>) => void;

  // Audit Logs
  auditLogs: AuditLogItem[];

  // Analytics
  analytics: AnalyticsMetrics;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [pageLocks, setPageLocks] = useState<PageLock[]>(INITIAL_PAGE_LOCKS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [journalArticles, setJournalArticles] = useState<JournalArticle[]>(INITIAL_JOURNAL);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [analytics] = useState<AnalyticsMetrics>(INITIAL_ANALYTICS);

  // Helper to append to Audit Log
  const logAudit = (action: string, entity: string, entityId: string, diffSummary: string) => {
    const newLog: AuditLogItem = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action,
      entity,
      entityId,
      diffSummary,
      ipAddress: '103.82.112.44',
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // ─── Products Logic ───
  const addProduct = (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'discountPercent'>) => {
    const id = `prod_${Date.now()}`;
    const discount =
      data.originalMrp > 0 ? Math.round(((data.originalMrp - data.sellingPrice) / data.originalMrp) * 100) : 0;

    const newProduct: Product = {
      ...data,
      id,
      discountPercent: discount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProduct, ...prev]);
    logAudit('PRODUCT_CREATED', 'Product', id, `Created product "${data.title}" at ₹${data.sellingPrice}`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const sellingPrice = updates.sellingPrice ?? p.sellingPrice;
        const originalMrp = updates.originalMrp ?? p.originalMrp;
        const discountPercent =
          originalMrp > 0 ? Math.round(((originalMrp - sellingPrice) / originalMrp) * 100) : 0;

        return {
          ...p,
          ...updates,
          sellingPrice,
          originalMrp,
          discountPercent,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    logAudit('PRODUCT_UPDATED', 'Product', id, `Updated fields: ${Object.keys(updates).join(', ')}`);
  };

  const archiveProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'ARCHIVED', updatedAt: new Date().toISOString() } : p))
    );
    logAudit('PRODUCT_ARCHIVED', 'Product', id, 'Status changed to ARCHIVED');
  };

  const updateVariantStock = (productId: string, variantId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          variants: p.variants.map((v) => (v.id === variantId ? { ...v, stock: Math.max(0, newStock) } : v)),
          updatedAt: new Date().toISOString(),
        };
      })
    );
    logAudit('INVENTORY_UPDATED', 'Product', productId, `Variant ${variantId} stock adjusted to ${newStock}`);
  };

  // ─── Categories Logic ───
  const addCategory = (cat: Omit<Category, 'id' | 'productCount'>) => {
    const id = `cat_${Date.now()}`;
    const newCat: Category = { ...cat, id, productCount: 0 };
    setCategories((prev) => [...prev, newCat]);
    logAudit('CATEGORY_CREATED', 'Category', id, `Added category ${cat.name}`);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    logAudit('CATEGORY_UPDATED', 'Category', id, `Updated: ${Object.keys(updates).join(', ')}`);
  };

  const reorderCategories = (newOrderedIds: string[]) => {
    setCategories((prev) => {
      const map = new Map(prev.map((c) => [c.id, c]));
      return newOrderedIds
        .map((id, index) => {
          const item = map.get(id);
          return item ? { ...item, displayOrder: index + 1 } : null;
        })
        .filter(Boolean) as Category[];
    });
    logAudit('CATEGORIES_REORDERED', 'Category', 'all', 'Updated category display order');
  };

  // ─── Orders Logic ───
  const updateOrderStatus = (id: string, newStatus: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== id) return ord;
        return {
          ...ord,
          status: newStatus,
          timeline: [
            ...ord.timeline,
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              note: note || `Status transitioned to ${newStatus}`,
              actor: currentUser.name,
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
    logAudit('ORDER_STATUS_CHANGED', 'Order', id, `Order status changed to ${newStatus}`);
  };

  const dispatchWithEkart = (orderId: string) => {
    const awb = `EKART-JH-${Math.floor(100000000 + Math.random() * 900000000)}`;
    const manifest = `MNF-RNC-${Math.floor(1000 + Math.random() * 9000)}`;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          status: 'PACKED',
          dispatchState: 'BOOKED',
          awbNumber: awb,
          manifestId: manifest,
          courierName: 'Ekart Logistics Surface',
          timeline: [
            ...ord.timeline,
            {
              status: 'PACKED',
              timestamp: new Date().toISOString(),
              note: `Booked with Ekart Logistics. AWB: ${awb}, Manifest: ${manifest}`,
              actor: currentUser.name,
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    logAudit('EKART_DISPATCH_BOOKED', 'Order', orderId, `Assigned AWB ${awb} via Ekart Logistics`);
    return { success: true, awb, message: 'Shipment created and ready for thermal label printing' };
  };

  const cancelOrder = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          status: 'CANCELLED',
          timeline: [
            ...ord.timeline,
            {
              status: 'CANCELLED',
              timestamp: new Date().toISOString(),
              note: `Cancelled by operator. Reason: ${reason}`,
              actor: currentUser.name,
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
    logAudit('ORDER_CANCELLED', 'Order', orderId, `Cancelled order. Reason: ${reason}`);
  };

  const addOrderNote = (orderId: string, note: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          internalNotes: [...ord.internalNotes, `${note} (${currentUser.name})`],
          updatedAt: new Date().toISOString(),
        };
      })
    );
    logAudit('ORDER_NOTE_ADDED', 'Order', orderId, `Added note: "${note}"`);
  };

  // ─── Banners Logic ───
  const toggleBannerKillSwitch = (id: string): boolean => {
    let nextState = false;
    setBanners((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        nextState = !b.isActive;
        return { ...b, isActive: nextState, updatedAt: new Date().toISOString() };
      })
    );
    logAudit(
      'BANNER_KILL_SWITCH_TOGGLED',
      'Banner',
      id,
      `Toggled active state to ${nextState ? 'LIVE' : 'PAUSED'}. Edge cache invalidated.`
    );
    return nextState;
  };

  const addBanner = (banner: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `ban_${Date.now()}`;
    const newBanner: Banner = {
      ...banner,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBanners((prev) => [newBanner, ...prev]);
    logAudit('BANNER_CREATED', 'Banner', id, `Created banner for campaign ${banner.campaignName}`);
  };

  const updateBanner = (id: string, updates: Partial<Banner>) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b)));
    logAudit('BANNER_UPDATED', 'Banner', id, `Updated banner fields`);
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    logAudit('BANNER_DELETED', 'Banner', id, 'Deleted banner');
  };

  // ─── Page Locks Logic ───
  const togglePageLock = (id: string) => {
    setPageLocks((prev) =>
      prev.map((lock) => {
        if (lock.id !== id) return lock;
        const nextState = !lock.isLocked;
        logAudit(
          'PAGE_LOCK_TOGGLED',
          'PageLock',
          id,
          `Route ${lock.routePath} lock set to ${nextState ? 'LOCKED' : 'UNLOCKED'}`
        );
        return {
          ...lock,
          isLocked: nextState,
          lastChangedBy: currentUser.name,
          lastChangedAt: new Date().toISOString(),
        };
      })
    );
  };

  const updatePageLock = (id: string, updates: Partial<PageLock>) => {
    setPageLocks((prev) =>
      prev.map((lock) =>
        lock.id === id
          ? {
              ...lock,
              ...updates,
              lastChangedBy: currentUser.name,
              lastChangedAt: new Date().toISOString(),
            }
          : lock
      )
    );
    logAudit('PAGE_LOCK_UPDATED', 'PageLock', id, `Updated lock settings for ${updates.routePath || id}`);
  };

  const generatePreviewLink = (id: string): string => {
    const token = `prev_${Math.random().toString(36).substring(2, 10)}`;
    const lock = pageLocks.find((l) => l.id === id);
    const targetPath = lock ? (lock.routePath === '/*' ? '/' : lock.routePath) : '/';
    logAudit('PREVIEW_LINK_GENERATED', 'PageLock', id, `Generated preview bypass token for ${targetPath}`);
    return `https://fittee.in${targetPath}?preview_token=${token}`;
  };

  const isAnyPageLockActive = useMemo(() => {
    return pageLocks.some((l) => l.isLocked);
  }, [pageLocks]);

  // ─── Coupons Logic ───
  const addCoupon = (data: Omit<Coupon, 'id' | 'usageCount'>) => {
    const id = `coup_${Date.now()}`;
    const newCoupon: Coupon = { ...data, id, usageCount: 0 };
    setCoupons((prev) => [newCoupon, ...prev]);
    logAudit('COUPON_CREATED', 'Coupon', id, `Created coupon ${data.code}`);
  };

  const toggleCouponActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    logAudit('COUPON_TOGGLED', 'Coupon', id, 'Toggled active state');
  };

  // ─── Journal Logic ───
  const addJournalArticle = (data: Omit<JournalArticle, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `art_${Date.now()}`;
    const newArt: JournalArticle = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setJournalArticles((prev) => [newArt, ...prev]);
    logAudit('JOURNAL_ARTICLE_CREATED', 'JournalArticle', id, `Drafted article: ${data.title}`);
  };

  const updateJournalArticle = (id: string, updates: Partial<JournalArticle>) => {
    setJournalArticles((prev) =>
      prev.map((art) => (art.id === id ? { ...art, ...updates, updatedAt: new Date().toISOString() } : art))
    );
    logAudit('JOURNAL_ARTICLE_UPDATED', 'JournalArticle', id, 'Updated article');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        archiveProduct,
        updateVariantStock,
        categories,
        addCategory,
        updateCategory,
        reorderCategories,
        orders,
        updateOrderStatus,
        dispatchWithEkart,
        cancelOrder,
        addOrderNote,
        banners,
        toggleBannerKillSwitch,
        addBanner,
        updateBanner,
        deleteBanner,
        pageLocks,
        togglePageLock,
        updatePageLock,
        generatePreviewLink,
        isAnyPageLockActive,
        coupons,
        addCoupon,
        toggleCouponActive,
        journalArticles,
        addJournalArticle,
        updateJournalArticle,
        auditLogs,
        analytics,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
