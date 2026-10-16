"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Shirt,
  Layers,
  ShoppingBag,
  Flag,
  Lock,
  BookOpen,
  Tag,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { useStore } from '@/lib/storeContext';

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function AdminSidebar({ isCollapsed, setIsCollapsed }: AdminSidebarProps) {
  const pathname = usePathname();
  const { currentUser, canAccessModule } = useAuth();
  const { orders, products, pageLocks } = useStore();

  const unfulfilledOrdersCount = orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PLACED').length;
  const activeProductsCount = products.filter((p) => p.status === 'ACTIVE').length;
  const activeLocksCount = pageLocks.filter((l) => l.isLocked).length;

  const NAV_ITEMS = [
    {
      label: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      module: 'dashboard',
    },
    {
      label: 'Products',
      href: '/products',
      icon: Shirt,
      module: 'products',
      badge: activeProductsCount,
    },
    {
      label: 'Categories',
      href: '/categories',
      icon: Layers,
      module: 'categories',
    },
    {
      label: 'Orders',
      href: '/orders',
      icon: ShoppingBag,
      module: 'orders',
      badge: unfulfilledOrdersCount > 0 ? unfulfilledOrdersCount : undefined,
      badgeColor: 'bg-[#B87A22] text-white',
    },
    {
      label: 'Festive Banners',
      href: '/banners',
      icon: Flag,
      module: 'banners',
    },
    {
      label: 'Page Locks',
      href: '/page-locks',
      icon: Lock,
      module: 'page_locks',
      badge: activeLocksCount > 0 ? `${activeLocksCount} ON` : undefined,
      badgeColor: 'bg-[#C0392B] text-white',
    },
    {
      label: 'Journal CMS',
      href: '/journal',
      icon: BookOpen,
      module: 'journal',
    },
    {
      label: 'Coupons',
      href: '/coupons',
      icon: Tag,
      module: 'coupons',
    },
    {
      label: 'Settings & Audit',
      href: '/settings',
      icon: Settings,
      module: 'settings',
    },
  ];

  const visibleNavItems = NAV_ITEMS.filter((item) => canAccessModule(item.module));

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen bg-[#FFFFFF] dark:bg-[#161815] border-r border-[#E7E5DF] dark:border-[#2A2C27] flex flex-col justify-between transition-all duration-200 select-none ${
        isCollapsed ? 'w-[68px]' : 'w-[240px]'
      }`}
    >
      {/* 1. Header with Brand & Collapse toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#E7E5DF] dark:border-[#2A2C27] shrink-0">
        {!isCollapsed ? (
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif italic text-2xl font-bold text-[#161714] dark:text-[#F2F1EC] tracking-tight">
              Fittee<span className="text-[#B87A22]">.</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#FAFAF7] dark:bg-[#20221E] border border-[#E7E5DF] dark:border-[#2A2C27] text-[#6B6A63] dark:text-[#9A9A92]">
              Ops
            </span>
          </Link>
        ) : (
          <div className="w-full flex justify-center">
            <span className="font-serif italic text-2xl font-bold text-[#161714] dark:text-[#F2F1EC]">
              F<span className="text-[#B87A22]">.</span>
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-md text-[#6B6A63] hover:text-[#161714] hover:bg-[#F5F4EF] dark:hover:bg-[#20221E] dark:hover:text-[#F2F1EC] transition-colors ${
            isCollapsed ? 'hidden' : 'block'
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Primary Navigation Links */}
      <div className="flex-1 py-4 px-3 overflow-y-auto overflow-x-hidden space-y-1">
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150 group relative ${
                isActive
                  ? 'bg-[#B87A22]/10 text-[#B87A22] font-semibold dark:bg-[#E5A93C]/10 dark:text-[#E5A93C]'
                  : 'text-[#6B6A63] hover:text-[#161714] hover:bg-[#F5F4EF] dark:text-[#9A9A92] dark:hover:text-[#F2F1EC] dark:hover:bg-[#20221E]'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#B87A22] dark:text-[#E5A93C]' : 'text-[#6B6A63] group-hover:text-[#161714] dark:text-[#9A9A92] dark:group-hover:text-[#F2F1EC]'
                }`}
              />

              {!isCollapsed && (
                <>
                  <span className="truncate flex-1">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10.5px] font-bold px-1.5 py-0.2 rounded-full tabular-nums shrink-0 ${
                        item.badgeColor || 'bg-[#F0EFEA] text-[#6B6A63] dark:bg-[#2A2C27] dark:text-[#9A9A92]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}

              {/* Active left indicator notch */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#B87A22] dark:bg-[#E5A93C] rounded-r-full" />
              )}
            </Link>
          );
        })}
      </div>

      {/* 3. Footer with Operator Status & Expand Button */}
      <div className="p-3 border-t border-[#E7E5DF] dark:border-[#2A2C27] shrink-0 bg-[#FAFAF7]/50 dark:bg-[#111310]/50">
        {isCollapsed ? (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="p-2 rounded-lg text-[#6B6A63] hover:text-[#161714] hover:bg-[#F5F4EF] dark:hover:bg-[#20221E]"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#6B6A63] dark:text-[#9A9A92] px-1">
              <span className="flex items-center gap-1 font-semibold text-[#161714] dark:text-[#F2F1EC]">
                <Shield className="w-3.5 h-3.5 text-[#B87A22]" />
                {currentUser.role.replace('_', ' ')}
              </span>
              <span className="text-[10px] text-[#2F7D4F] font-bold">● ONLINE</span>
            </div>

            <a
              href="https://fittee.in"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] font-medium text-[#6B6A63] hover:text-[#161714] dark:text-[#9A9A92] dark:hover:text-[#F2F1EC] bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] hover:border-[#B87A22] transition-colors"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3 h-3 text-[#9A9A92]" />
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}
