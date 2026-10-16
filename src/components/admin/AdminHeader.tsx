"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Lock,
  ChevronDown,
  User,
  ShieldCheck,
  RefreshCw,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { useStore } from '@/lib/storeContext';
import { useTheme } from '@/lib/themeContext';
import { useToast } from '@/components/ui/Toast';
import { AdminRole } from '@/lib/types';

interface AdminHeaderProps {
  onOpenSearch: () => void;
}

export function AdminHeader({ onOpenSearch }: AdminHeaderProps) {
  const { currentUser, switchRole, logout } = useAuth();
  const { isAnyPageLockActive, pageLocks } = useStore();
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const { success } = useToast();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  const activeLocks = pageLocks.filter((l) => l.isLocked);

  const handlePurgeCache = () => {
    setIsPurging(true);
    setTimeout(() => {
      setIsPurging(false);
      success('Edge Cache Purged', 'Storefront CDN revalidated across all edge regions in 320ms');
    }, 600);
  };

  const ROLES: { role: AdminRole; label: string; desc: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Full permissions & revenue metrics' },
    { role: 'CATALOG_MGR', label: 'Catalog Manager', desc: 'Products, Banners & Journal CMS' },
    { role: 'LOGISTICS_MGR', label: 'Logistics Manager', desc: 'Orders & Ekart dispatch fulfillment' },
  ];

  return (
    <header className="h-16 bg-[#FFFFFF] dark:bg-[#161815] border-b border-[#E7E5DF] dark:border-[#2A2C27] px-6 flex items-center justify-between sticky top-0 z-20">
      {/* 1. Global Search Trigger Button */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-[#FAFAF7] dark:bg-[#0E0F0D] border border-[#E7E5DF] dark:border-[#2A2C27] hover:border-[#B87A22] text-[#6B6A63] dark:text-[#9A9A92] text-[13px] transition-colors cursor-pointer group"
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#8C8B83] group-hover:text-[#B87A22] transition-colors" />
            <span>Search orders, products, AWB, customers...</span>
          </span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#EFECE6] dark:bg-[#20221E] text-[#6B6A63] border border-[#DDD9CE] dark:border-[#30332C]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* 2. Middle & Right Utility Clusters */}
      <div className="flex items-center gap-3.5">
        {/* Live Active Page Lock Warning Badge (Module 7 Requirement) */}
        {isAnyPageLockActive && (
          <Link
            href="/page-locks"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-[#C0392B]/10 text-[#C0392B] border border-[#C0392B]/30 hover:bg-[#C0392B]/15 transition-colors animate-pulse"
            title="Click to manage active page locks"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{activeLocks.length} Page Lock{activeLocks.length > 1 ? 's' : ''} Active</span>
          </Link>
        )}

        {/* Quick Cache Purge Trigger */}
        <button
          type="button"
          onClick={handlePurgeCache}
          disabled={isPurging}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-[#6B6A63] hover:text-[#161714] dark:text-[#9A9A92] dark:hover:text-[#F2F1EC] hover:bg-[#FAFAF7] dark:hover:bg-[#20221E] border border-[#E7E5DF] dark:border-[#2A2C27] transition-colors cursor-pointer"
          title="Manually purge edge CDN cache"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPurging ? 'animate-spin text-[#B87A22]' : ''}`} />
          <span>Purge Edge</span>
        </button>

        {/* Theme Mode Toggle Button (Light / Dark) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-[#6B6A63] hover:text-[#161714] dark:text-[#9A9A92] dark:hover:text-[#F2F1EC] hover:bg-[#FAFAF7] dark:hover:bg-[#20221E] border border-[#E7E5DF] dark:border-[#2A2C27] transition-colors cursor-pointer"
          title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#E5A93C] transition-transform duration-200 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-[#6B6A63] transition-transform duration-200 hover:-rotate-12" />
          )}
        </button>

        {/* Role Switcher Pill Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E7E5DF] dark:border-[#2A2C27] bg-[#FAFAF7] dark:bg-[#20221E] hover:border-[#B87A22] text-[#161714] dark:text-[#F2F1EC] text-[12px] font-medium transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#B87A22]" />
            <span className="font-semibold">{currentUser.role.replace('_', ' ')}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8C8B83]" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#FFFFFF] dark:bg-[#161815] rounded-xl border border-[#E7E5DF] dark:border-[#2A2C27] shadow-[0_12px_32px_rgba(0,0,0,0.15)] p-2 z-50">
              <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8C8B83]">
                Switch Test Role (RBAC)
              </p>
              {ROLES.map((r) => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => {
                    switchRole(r.role);
                    setRoleDropdownOpen(false);
                    success('Role Switched', `Active session updated to ${r.label}`);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-[12px] transition-colors cursor-pointer flex flex-col ${
                    currentUser.role === r.role
                      ? 'bg-[#B87A22]/10 text-[#B87A22] font-semibold'
                      : 'hover:bg-[#F5F4EF] dark:hover:bg-[#20221E] text-[#161714] dark:text-[#F2F1EC]'
                  }`}
                >
                  <span>{r.label}</span>
                  <span className="text-[11px] font-normal text-[#8C8B83] mt-0.5">{r.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Account Menu */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#E7E5DF] dark:border-[#2A2C27]">
          <div className="w-8 h-8 rounded-full bg-[#161714] text-[#FAF7F2] dark:bg-[#FAF7F2] dark:text-[#161714] flex items-center justify-center text-[12px] font-bold">
            {currentUser.name.charAt(0)}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-[12.5px] font-semibold text-[#161714] dark:text-[#F2F1EC] leading-tight truncate max-w-[120px]">
              {currentUser.name}
            </p>
            <p className="text-[11px] text-[#8C8B83] leading-none truncate max-w-[120px]">
              {currentUser.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
