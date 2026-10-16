"use client";

import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Users,
  Activity,
  RefreshCw,
  Plus,
  Key,
  ShieldAlert,
  Check,
  Lock,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/FormElements';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/storeContext';
import { useAuth } from '@/lib/authContext';
import { useTheme, ThemeMode } from '@/lib/themeContext';
import { formatIST } from '@/lib/utils';
import { INITIAL_ADMIN_USERS } from '@/lib/mockData';
import { AdminRole, AdminUser } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';

export default function SettingsPage() {
  const { auditLogs } = useStore();
  const { currentUser, canAccessModule, switchRole } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { success } = useToast();

  const [activeTab, setActiveTab] = useState<'users' | 'appearance' | 'audit' | 'cache'>('users');
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [isPurging, setIsPurging] = useState(false);

  // Super Admin gate
  if (!canAccessModule('settings')) {
    return (
      <AdminLayout>
        <div className="py-20 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#C0392B]/10 text-[#C0392B] flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#161714] dark:text-[#F2F1EC]">Access Restricted</h2>
          <p className="text-[13px] text-[#8C8B83]">
            Settings, team permissions, and audit logs are restricted strictly to <span className="font-semibold text-[#161714] dark:text-[#F2F1EC]">Super Admins</span>.
          </p>
        </div>
      </AdminLayout>
    );
  }

  const handleRoleChange = (userId: string, newRole: AdminRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    success('Role Updated', 'Permissions updated in real-time');
  };

  const handlePurgeAll = () => {
    setIsPurging(true);
    setTimeout(() => {
      setIsPurging(false);
      success('Purge Completed', 'Cloudflare and Vercel edge caches invalidated across all storefront endpoints');
    }, 800);
  };

  const THEMES: { mode: ThemeMode; label: string; desc: string; icon: typeof Sun }[] = [
    {
      mode: 'light',
      label: 'Light Canvas',
      desc: 'Warm ivory canvas (#FAFAF7) with subtle borders and clear typography',
      icon: Sun,
    },
    {
      mode: 'dark',
      label: 'Dark Obsidian',
      desc: 'Deep muted carbon (#0E0F0D) with high-contrast ochre accents',
      icon: Moon,
    },
    {
      mode: 'system',
      label: 'Sync with System',
      desc: 'Automatically follows your operating system appearance preference',
      icon: Laptop,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E7E5DF] dark:border-[#2A2C27]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold text-[#161714] dark:text-[#F2F1EC] tracking-tight">
                Settings, Team & Audit Log
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#C0392B]/10 text-[#C0392B] border border-[#C0392B]/20">
                Super Admin
              </span>
            </div>
            <p className="text-[13px] text-[#6B6A63] dark:text-[#9A9A92] mt-0.5">
              Admin team management, appearance preferences, immutable audit trail, and edge cache commands.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-[#E7E5DF] dark:border-[#2A2C27] overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'users'
                ? 'border-[#B87A22] text-[#B87A22] font-bold'
                : 'border-transparent text-[#6B6A63] dark:text-[#9A9A92] hover:text-[#161714] dark:hover:text-[#F2F1EC]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Admin Users & RBAC ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('appearance')}
            className={`px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'appearance'
                ? 'border-[#B87A22] text-[#B87A22] font-bold'
                : 'border-transparent text-[#6B6A63] dark:text-[#9A9A92] hover:text-[#161714] dark:hover:text-[#F2F1EC]'
            }`}
          >
            {resolvedTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span>Appearance & Theme</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'audit'
                ? 'border-[#B87A22] text-[#B87A22] font-bold'
                : 'border-transparent text-[#6B6A63] dark:text-[#9A9A92] hover:text-[#161714] dark:hover:text-[#F2F1EC]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Audit Trail ({auditLogs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cache')}
            className={`px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'cache'
                ? 'border-[#B87A22] text-[#B87A22] font-bold'
                : 'border-transparent text-[#6B6A63] dark:text-[#9A9A92] hover:text-[#161714] dark:hover:text-[#F2F1EC]'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Edge Cache & Invalidation</span>
          </button>
        </div>

        {/* TAB 1: USERS & RBAC MATRIX */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#FAFAF7] dark:bg-[#111310] border-b border-[#E7E5DF] dark:border-[#2A2C27] text-[11px] font-semibold uppercase text-[#8C8B83]">
                  <tr>
                    <th className="py-3 px-4">Operator Name</th>
                    <th className="py-3 px-3">Email Address</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">2FA Security</th>
                    <th className="py-3 px-3">Last Active</th>
                    <th className="py-3 px-4 text-right">Switch Current Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F4EF] dark:divide-[#20221E]">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FAFAF7] dark:hover:bg-[#20221E] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#161714] dark:text-[#F2F1EC]">
                        {u.name}
                        {u.id === currentUser.id && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.2 rounded bg-[#B87A22]/10 text-[#B87A22]">
                            You
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-[#6B6A63] dark:text-[#9A9A92] font-mono text-[12px]">{u.email}</td>

                      <td className="py-3.5 px-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as AdminRole)}
                          className="px-2.5 py-1 rounded-md border border-[#E7E5DF] dark:border-[#2A2C27] text-[12px] bg-white dark:bg-[#161815] text-[#161714] dark:text-[#F2F1EC] font-medium"
                        >
                          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                          <option value="CATALOG_MGR">CATALOG_MGR</option>
                          <option value="LOGISTICS_MGR">LOGISTICS_MGR</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          u.twoFactorEnabled
                            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-[#20221E] dark:text-[#9A9A92]'
                        }`}>
                          {u.twoFactorEnabled ? 'TOTP Enabled' : 'Optional'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-[12px] text-[#8C8B83]">
                        {formatIST(u.lastLoginAt)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            switchRole(u.role);
                            success('Role Switched', `Active session updated to ${u.role}`);
                          }}
                        >
                          Simulate Role
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] space-y-3">
              <h3 className="font-bold text-[14px] text-[#161714] dark:text-[#F2F1EC]">Role Permissions Matrix (Brief Reference)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E7E5DF] dark:border-[#2A2C27] text-[#8C8B83]">
                      <th className="py-2">Module</th>
                      <th className="py-2">SUPER_ADMIN</th>
                      <th className="py-2">CATALOG_MGR</th>
                      <th className="py-2">LOGISTICS_MGR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F4EF] dark:divide-[#20221E] text-[#161714] dark:text-[#F2F1EC]">
                    <tr><td className="py-2">Dashboard Engagement</td><td>Read</td><td>Read</td><td>Read</td></tr>
                    <tr><td className="py-2">Revenue & Profit KPIs</td><td>Full</td><td>—</td><td>—</td></tr>
                    <tr><td className="py-2">Products & Categories</td><td>Full</td><td>Full</td><td>Read</td></tr>
                    <tr><td className="py-2">Orders & Ekart Dispatch</td><td>Full</td><td>Read</td><td>Full</td></tr>
                    <tr><td className="py-2">Festive Banners</td><td>Full</td><td>Full</td><td>—</td></tr>
                    <tr><td className="py-2">Page Lock Controller</td><td>Full</td><td>—</td><td>—</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPEARANCE & THEME CONTROLLER */}
        {activeTab === 'appearance' && (
          <div className="space-y-6 max-w-3xl">
            <div className="p-6 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] space-y-4">
              <div>
                <h3 className="font-bold text-[16px] text-[#161714] dark:text-[#F2F1EC]">
                  Theme & Visual Appearance
                </h3>
                <p className="text-[13px] text-[#6B6A63] dark:text-[#9A9A92] mt-1">
                  Choose your preferred workspace aesthetic. Settings persist across sessions on this device.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                {THEMES.map((t) => {
                  const Icon = t.icon;
                  const isSelected = theme === t.mode;
                  return (
                    <button
                      key={t.mode}
                      type="button"
                      onClick={() => {
                        setTheme(t.mode);
                        success('Appearance Updated', `Switched theme to ${t.label}`);
                      }}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#B87A22] bg-[#B87A22]/5 dark:bg-[#E5A93C]/10 ring-1 ring-[#B87A22]'
                          : 'border-[#E7E5DF] dark:border-[#2A2C27] bg-[#FAFAF7] dark:bg-[#111310] hover:border-[#B87A22]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#B87A22] text-white'
                            : 'bg-[#F0EFEA] dark:bg-[#20221E] text-[#6B6A63] dark:text-[#9A9A92]'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-[#B87A22] dark:text-[#E5A93C]">
                            <Check className="w-3.5 h-3.5" />
                            Active
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="text-[14px] font-bold text-[#161714] dark:text-[#F2F1EC]">
                          {t.label}
                        </h4>
                        <p className="text-[12px] text-[#6B6A63] dark:text-[#9A9A92] mt-1 leading-relaxed">
                          {t.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[#E7E5DF] dark:border-[#2A2C27] flex items-center justify-between text-[12px] text-[#8C8B83]">
                <span>Currently active: <strong className="text-[#161714] dark:text-[#F2F1EC] uppercase">{resolvedTheme} MODE</strong></span>
                <span>Keyboard shortcut: Click the top-right header icon anytime for instant toggle</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT LOG VIEWER */}
        {activeTab === 'audit' && (
          <div className="rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#FAFAF7] dark:bg-[#111310] border-b border-[#E7E5DF] dark:border-[#2A2C27] text-[11px] font-semibold uppercase text-[#8C8B83]">
                <tr>
                  <th className="py-3 px-4">Timestamp (IST)</th>
                  <th className="py-3 px-3">Operator</th>
                  <th className="py-3 px-3">Action</th>
                  <th className="py-3 px-3">Entity</th>
                  <th className="py-3 px-3">Diff / Summary</th>
                  <th className="py-3 px-4 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F4EF] dark:divide-[#20221E]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAFAF7] dark:hover:bg-[#20221E] transition-colors font-mono text-[12px]">
                    <td className="py-3 px-4 text-[#8C8B83] whitespace-nowrap">
                      {formatIST(log.timestamp)}
                    </td>

                    <td className="py-3 px-3 font-sans font-semibold text-[#161714] dark:text-[#F2F1EC]">
                      {log.actorName}
                      <span className="text-[10px] text-[#8C8B83] block">({log.actorRole})</span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-[#B87A22]/10 text-[#B87A22]">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-[#161714] dark:text-[#F2F1EC] font-semibold">
                      {log.entity} <span className="text-[#8C8B83]">({log.entityId})</span>
                    </td>

                    <td className="py-3 px-3 font-sans text-[#6B6A63] dark:text-[#9A9A92] max-w-md truncate">
                      {log.diffSummary}
                    </td>

                    <td className="py-3 px-4 text-right text-[#8C8B83]">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: EDGE CACHE */}
        {activeTab === 'cache' && (
          <div className="p-6 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] space-y-4 max-w-xl">
            <h3 className="font-bold text-[16px] text-[#161714] dark:text-[#F2F1EC]">Storefront Edge Cache Invalidation</h3>
            <p className="text-[13px] text-[#6B6A63] dark:text-[#9A9A92] leading-relaxed">
              When updating prices, products, or banners, the API automatically triggers surgical cache purges. Use this tool only if an edge CDN node is suspected of serving stale HTML.
            </p>

            <div className="p-4 rounded-lg bg-[#FAFAF7] dark:bg-[#111310] border border-[#E7E5DF] dark:border-[#2A2C27] space-y-2 text-xs text-[#161714] dark:text-[#F2F1EC]">
              <div className="flex justify-between">
                <span className="text-[#6B6A63] dark:text-[#9A9A92]">CDN Provider:</span>
                <span className="font-bold">Cloudflare Enterprise Edge</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6A63] dark:text-[#9A9A92]">Cache TTL:</span>
                <span className="font-mono">86,400s (stale-while-revalidate)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6A63] dark:text-[#9A9A92]">Last Purge:</span>
                <span className="text-[#2F7D4F] font-bold">2 mins ago (Success)</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handlePurgeAll}
              disabled={isPurging}
              isLoading={isPurging}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Purge All Edge Caches Globally
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
