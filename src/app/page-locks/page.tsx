"use client";

import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  ShieldAlert,
  Copy,
  Check,
  Eye,
  ExternalLink,
  Edit,
  Clock,
  Sparkles,
  AlertTriangle,
  X,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select, Switch } from '@/components/ui/FormElements';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useStore } from '@/lib/storeContext';
import { useAuth } from '@/lib/authContext';
import { formatIST } from '@/lib/utils';
import { PageLock, PageLockMode } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';

export default function PageLocksPage() {
  const { pageLocks, togglePageLock, updatePageLock, generatePreviewLink } = useStore();
  const { currentUser, canAccessModule } = useAuth();
  const { success, warning, error } = useToast();

  const [confirmLockTarget, setConfirmLockTarget] = useState<PageLock | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [editingLock, setEditingLock] = useState<PageLock | null>(null);
  const [previewLock, setPreviewLock] = useState<PageLock | null>(null);

  // Edit form states
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<PageLockMode>('MAINTENANCE');
  const [contactEmail, setContactEmail] = useState('');
  const [estimatedEndTime, setEstimatedEndTime] = useState('');

  // Role Gate: Super Admin Only (Module 7 Brief requirement)
  if (!canAccessModule('page_locks')) {
    return (
      <AdminLayout>
        <div className="py-20 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#C0392B]/10 text-[#C0392B] flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#161714]">Access Restricted</h2>
          <p className="text-[13px] text-[#8C8B83]">
            Page Lock & Maintenance controller is restricted strictly to the <span className="font-semibold text-[#161714]">Super Admin</span> role.
          </p>
        </div>
      </AdminLayout>
    );
  }

  // Handle lock toggle with safety guard for /* and /checkout
  const handleToggleClick = (lock: PageLock) => {
    if (!lock.isLocked) {
      // Locking requires confirmation
      if (lock.routePath === '/*' || lock.routePath === '/checkout') {
        setConfirmLockTarget(lock);
        return;
      }
      togglePageLock(lock.id);
      warning('Route Locked', `Lock active on ${lock.routePath}. Public traffic will see maintenance screen.`);
    } else {
      // Unlocking is 1-click
      togglePageLock(lock.id);
      success('Route Restored', `${lock.routePath} unlocked. Normal traffic resumed.`);
    }
  };

  const handleGenerateLink = (lock: PageLock) => {
    const link = generatePreviewLink(lock.id);
    navigator.clipboard.writeText(link);
    setCopiedLink(lock.id);
    success('Bypass Preview Link Generated', 'Signed token copied to clipboard (valid for 2 hours)');
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleOpenEdit = (lock: PageLock) => {
    setEditingLock(lock);
    setTitle(lock.title);
    setMessage(lock.message);
    setMode(lock.mode);
    setContactEmail(lock.contactEmail);
    setEstimatedEndTime(lock.estimatedEndTime || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLock) return;
    updatePageLock(editingLock.id, {
      title,
      message,
      mode,
      contactEmail,
      estimatedEndTime: estimatedEndTime || undefined,
    });
    success('Lock Settings Saved', `Updated configuration for ${editingLock.routePath}`);
    setEditingLock(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 1. Header Bar: Title, Super Admin Notice & Security Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E7E5DF] dark:border-[#2A2C27]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold text-[#161714] dark:text-[#F2F1EC] tracking-tight">
                Page Lock & Maintenance Controller
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#C0392B]/10 text-[#C0392B] border border-[#C0392B]/20">
                Super Admin Only
              </span>
            </div>
            <p className="text-[13px] text-[#6B6A63] dark:text-[#9A9A92] mt-0.5">
              Control edge maintenance screens, &ldquo;Coming Soon&rdquo; teasers, and single-use signed bypass preview links.
            </p>
          </div>
        </div>

        {/* 2. Security Notice Box */}
        <div className="p-4 rounded-xl bg-[#FAFAF7] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-[#B87A22] shrink-0 mt-0.5" />
          <div className="text-[12.5px] text-[#6B6A63] dark:text-[#9A9A92] leading-relaxed">
            <span className="font-semibold text-[#161714] dark:text-[#F2F1EC]">
              Edge Propagation Guarantee:
            </span>{' '}
            Locks update on the storefront within seconds. Locking critical routes like{' '}
            <code className="font-mono font-bold text-[#C0392B] bg-[#C0392B]/10 px-1 py-0.5 rounded">/*</code> or{' '}
            <code className="font-mono font-bold text-[#C0392B] bg-[#C0392B]/10 px-1 py-0.5 rounded">/checkout</code>{' '}
            requires typing confirmation. Team members can use the{' '}
            <strong className="text-[#161714] dark:text-[#F2F1EC]">&ldquo;Copy Preview Link&rdquo;</strong> button to bypass lock screens while working.
          </div>
        </div>

        {/* 3. Page Locks Management Table */}
        <div className="rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#FAFAF7] dark:bg-[#111310] border-b border-[#E7E5DF] text-[11px] font-semibold uppercase text-[#8C8B83]">
                <tr>
                  <th className="py-3 px-4">Route Scope</th>
                  <th className="py-3 px-3">Lock Mode</th>
                  <th className="py-3 px-3">Display Title & Message</th>
                  <th className="py-3 px-3">Lock Status</th>
                  <th className="py-3 px-3">Last Changed</th>
                  <th className="py-3 px-3">Staff Preview Bypass</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F4EF] dark:divide-[#20221E]">
                {pageLocks.map((lock) => {
                  const isGlobal = lock.routePath === '/*';

                  return (
                    <tr
                      key={lock.id}
                      className="hover:bg-[#FAFAF7] dark:hover:bg-[#20221E] transition-colors"
                    >
                      {/* Route Scope */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-[13px] font-bold px-2 py-0.5 rounded ${
                              isGlobal
                                ? 'bg-[#C0392B]/10 text-[#C0392B] border border-[#C0392B]/30'
                                : 'bg-[#F0EFEA] text-[#161714] border border-[#E7E5DF]'
                            }`}
                          >
                            {lock.routePath}
                          </span>
                          {isGlobal && (
                            <span className="text-[10.5px] font-bold text-[#C0392B] uppercase">
                              (Entire Site)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Mode */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <StatusBadge
                          status={lock.mode}
                          tone={lock.mode === 'COMING_SOON' ? 'info' : 'warning'}
                        />
                      </td>

                      {/* Title & Message */}
                      <td className="py-3.5 px-3 max-w-xs">
                        <p className="font-bold text-[#161714] dark:text-[#F2F1EC] truncate">
                          {lock.title}
                        </p>
                        <p className="text-[11.5px] text-[#8C8B83] truncate mt-0.5">
                          {lock.message}
                        </p>
                      </td>

                      {/* Lock Toggle Button */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleClick(lock)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
                            lock.isLocked
                              ? 'bg-[#C0392B] text-white shadow-xs'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                          }`}
                        >
                          {lock.isLocked ? (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              <span>LOCKED</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3.5 h-3.5" />
                              <span>UNLOCKED</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Last Changed */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-[12px] text-[#6B6A63]">
                        <span>{formatIST(lock.lastChangedAt, { dateOnly: true })}</span>
                        <span className="text-[11px] text-[#8C8B83] block">by {lock.lastChangedBy}</span>
                      </td>

                      {/* Bypass Preview Link (Brief Module 7 requirement) */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateLink(lock)}
                          icon={copiedLink === lock.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        >
                          {copiedLink === lock.id ? 'Copied Token!' : 'Copy Bypass Link'}
                        </Button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewLock(lock)}
                            className="p-1.5 rounded hover:bg-[#F0EFEA] text-[#6B6A63] hover:text-[#161714]"
                            title="Preview lock screen"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(lock)}
                            className="p-1.5 rounded hover:bg-[#F0EFEA] text-[#6B6A63] hover:text-[#161714]"
                            title="Edit lock settings"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* High-Risk Confirm Dialog for Locking Critical Routes (Brief requirement: type "LOCK") */}
      {confirmLockTarget && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setConfirmLockTarget(null)}
          onConfirm={() => {
            togglePageLock(confirmLockTarget.id);
            setConfirmLockTarget(null);
            warning('Global Lock Deployed', `All public visitors on ${confirmLockTarget.routePath} will now see the maintenance screen.`);
          }}
          title={`Lock Critical Route: ${confirmLockTarget.routePath}`}
          description={`WARNING: Locking "${confirmLockTarget.routePath}" will immediately prevent customer access. All public visits will redirect to the ${confirmLockTarget.mode} screen.`}
          confirmWord="LOCK"
          confirmText="Deploy Lock Screen"
          variant="danger"
        />
      )}

      {/* Edit Lock Modal */}
      {editingLock && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#161815] rounded-2xl border p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-[16px] text-[#161714]">Configure Lock: {editingLock.routePath}</h3>
                <p className="text-xs text-[#8C8B83]">Public maintenance screen presentation</p>
              </div>
              <button onClick={() => setEditingLock(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <Select
                label="Lock Mode"
                value={mode}
                onChange={(e) => setMode(e.target.value as PageLockMode)}
                options={[
                  { value: 'MAINTENANCE', label: 'Maintenance (Technical updates in progress)' },
                  { value: 'COMING_SOON', label: 'Coming Soon (Teaser countdown mode)' },
                ]}
              />

              <Input
                label="Display Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Textarea
                label="Display Message for Public *"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />

                <Input
                  label="Estimated End Time (ISO UTC)"
                  value={estimatedEndTime}
                  onChange={(e) => setEstimatedEndTime(e.target.value)}
                  placeholder="2026-10-25T18:00:00Z"
                  hint="Used for countdown timer"
                />
              </div>

              <div className="pt-4 border-t flex justify-end gap-2.5">
                <Button variant="outline" size="md" type="button" onClick={() => setEditingLock(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit">
                  Save Settings
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Public Lock Screen Live Preview Modal */}
      {previewLock && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#0D120C] text-[#FAF7F2] rounded-2xl border border-white/20 p-8 shadow-2xl relative overflow-hidden text-center space-y-4">
            <button
              onClick={() => setPreviewLock(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white p-1 rounded-full bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#B87A22] text-black">
              {previewLock.mode === 'COMING_SOON' ? 'Coming Soon' : 'Under Maintenance'}
            </span>

            <h2 className="font-serif italic text-3xl font-bold text-[#FAF7F2] max-w-lg mx-auto">
              {previewLock.title}
            </h2>

            <p className="text-sm text-[#FAF7F2]/80 max-w-md mx-auto leading-relaxed">
              {previewLock.message}
            </p>

            {previewLock.estimatedEndTime && (
              <div className="pt-2 font-mono text-xs text-[#B87A22]">
                Estimated Reopening: {formatIST(previewLock.estimatedEndTime)}
              </div>
            )}

            <div className="pt-4 text-xs text-[#FAF7F2]/50">
              Need assistance? Reach our team at{' '}
              <a href={`mailto:${previewLock.contactEmail}`} className="text-[#B87A22] underline">
                {previewLock.contactEmail}
              </a>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
