"use client";

import React, { useState } from 'react';
import {
  Plus,
  Flag,
  Power,
  Calendar,
  Layers,
  Edit,
  Trash2,
  AlertTriangle,
  ExternalLink,
  Eye,
  Check,
  Smartphone,
  Monitor,
  X,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input, Select, Switch } from '@/components/ui/FormElements';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/storeContext';
import { useAuth } from '@/lib/authContext';
import { formatIST, formatRelativeTime } from '@/lib/utils';
import { BannerSlot, Banner } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';

export default function BannersPage() {
  const { banners, toggleBannerKillSwitch, addBanner, updateBanner, deleteBanner } = useStore();
  const { currentUser } = useAuth();
  const { success, warning } = useToast();

  const [activeSlotFilter, setActiveSlotFilter] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [previewBanner, setPreviewBanner] = useState<Banner | null>(null);

  // Form states
  const [campaignName, setCampaignName] = useState('');
  const [slot, setSlot] = useState<BannerSlot>('HERO_BANNER');
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [ctaText, setCtaText] = useState('Explore Collection');
  const [redirectUrl, setRedirectUrl] = useState('/#shop');
  const [priority, setPriority] = useState<number>(1);
  const [desktopImage, setDesktopImage] = useState('/images/hero-clean-bg.jpg');
  const [mobileImage, setMobileImage] = useState('/images/hero-clean-bg.jpg');
  const [startDateTime, setStartDateTime] = useState('2026-10-01T00:00:00Z');
  const [endDateTime, setEndDateTime] = useState('2026-10-31T23:59:59Z');
  const [isActive, setIsActive] = useState(true);

  const canEdit = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CATALOG_MGR';

  const filteredBanners = banners.filter((b) => {
    if (activeSlotFilter !== 'ALL' && b.slot !== activeSlotFilter) return false;
    return true;
  });

  const handleOpenCreate = () => {
    setEditingBanner(null);
    setCampaignName('');
    setSlot('HERO_BANNER');
    setHeadline('Festive Sohrai Collection');
    setSubheadline('Handcrafted regional heritage on 240 GSM luxury streetwear.');
    setCtaText('Shop Collection');
    setRedirectUrl('/#shop');
    setPriority(1);
    setDesktopImage('/images/hero-clean-bg.jpg');
    setMobileImage('/images/hero-clean-bg.jpg');
    setStartDateTime(new Date().toISOString());
    setEndDateTime(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
    setIsActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (b: Banner) => {
    setEditingBanner(b);
    setCampaignName(b.campaignName);
    setSlot(b.slot);
    setHeadline(b.headline);
    setSubheadline(b.subheadline || '');
    setCtaText(b.ctaText || '');
    setRedirectUrl(b.redirectUrl);
    setPriority(b.priority);
    setDesktopImage(b.desktopImageUrl || '/images/hero-clean-bg.jpg');
    setMobileImage(b.mobileImageUrl || '/images/hero-clean-bg.jpg');
    setStartDateTime(b.startDateTime);
    setEndDateTime(b.endDateTime);
    setIsActive(b.isActive);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim() || !headline.trim()) {
      warning('Validation Incomplete', 'Campaign name and headline are required');
      return;
    }

    const payload = {
      campaignName,
      slot,
      headline,
      subheadline,
      ctaText,
      redirectUrl,
      priority,
      desktopImageUrl: slot === 'ANNOUNCEMENT_BAR' ? undefined : desktopImage,
      mobileImageUrl: slot === 'ANNOUNCEMENT_BAR' ? undefined : mobileImage,
      startDateTime,
      endDateTime,
      isActive,
    };

    if (editingBanner) {
      updateBanner(editingBanner.id, payload);
      success('Banner Updated', `Saved changes to "${campaignName}"`);
    } else {
      addBanner(payload);
      success('Banner Scheduled', `Created campaign banner "${campaignName}"`);
    }
    setShowModal(false);
  };

  // Instant Kill Switch Toggle Handler (Brief Module 2 requirement)
  const handleToggle = (b: Banner) => {
    const nextState = toggleBannerKillSwitch(b.id);
    if (nextState) {
      success('Banner Activated', `"${b.campaignName}" is now live. Storefront cache purged.`);
    } else {
      warning('Instant Kill Switch Activated', `"${b.campaignName}" killed immediately across storefront.`);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 1. Header Bar: Title & Create Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E7E5DF] dark:border-[#2A2C27]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold text-[#161714] dark:text-[#F2F1EC] tracking-tight">
                Festive Banners & Schedules
              </h1>
              <span className="text-[12px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#B87A22]/10 text-[#B87A22]">
                Instant Kill-Switch Enabled
              </span>
            </div>
            <p className="text-[13px] text-[#6B6A63] dark:text-[#9A9A92] mt-0.5">
              Control hero campaigns, announcement bars, and promotional strips with 1-click cache purges.
            </p>
          </div>

          {canEdit && (
            <Button variant="primary" size="md" onClick={handleOpenCreate} icon={<Plus className="w-4 h-4 stroke-[2.5]" />}>
              Create Campaign Banner
            </Button>
          )}
        </div>

        {/* 2. Slot Filter Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-[#E7E5DF] dark:border-[#2A2C27] overflow-x-auto">
          {[
            { key: 'ALL', label: `All Slots (${banners.length})` },
            { key: 'HERO_BANNER', label: 'Hero Banners (1920x600)' },
            { key: 'ANNOUNCEMENT_BAR', label: 'Announcement Bar (Text)' },
            { key: 'MID_PAGE_STRIP', label: 'Mid-Page Strip' },
            { key: 'CAROUSEL_CARD', label: 'Festive Carousel Card' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveSlotFilter(tab.key)}
              className={`px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px whitespace-nowrap cursor-pointer ${
                activeSlotFilter === tab.key
                  ? 'border-[#B87A22] text-[#B87A22] font-bold'
                  : 'border-transparent text-[#6B6A63] hover:text-[#161714] dark:hover:text-[#F2F1EC]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3. Banners List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBanners.map((b) => {
            const isHero = b.slot === 'HERO_BANNER';
            const isTextOnly = b.slot === 'ANNOUNCEMENT_BAR';

            return (
              <div
                key={b.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  b.isActive
                    ? 'bg-[#FFFFFF] dark:bg-[#161815] border-[#E7E5DF] dark:border-[#2A2C27] shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
                    : 'bg-[#FAFAF7] dark:bg-[#111310] border-[#E7E5DF] opacity-75'
                }`}
              >
                {/* Media Preview or Text Banner Strip */}
                {isTextOnly ? (
                  <div className="p-4 bg-[#B87A22] text-[#FFFFFF] text-[12px] font-semibold text-center flex items-center justify-center">
                    <span className="truncate">{b.headline}</span>
                  </div>
                ) : (
                  <div className="relative aspect-[16/7] bg-[#E2D8C7] overflow-hidden">
                    <img
                      src={b.desktopImageUrl || '/images/hero-clean-bg.jpg'}
                      alt={b.campaignName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3.5 text-white">
                      <p className="text-[14px] font-bold leading-tight drop-shadow-sm">{b.headline}</p>
                      {b.subheadline && (
                        <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">{b.subheadline}</p>
                      )}
                    </div>

                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs">
                      {b.slot.replace('_', ' ')}
                    </span>
                  </div>
                )}

                {/* Details Section */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[14px] text-[#161714] dark:text-[#F2F1EC] truncate">
                        {b.campaignName}
                      </h3>
                      <StatusBadge status={b.isActive ? 'LIVE' : 'PAUSED'} />
                    </div>

                    <div className="mt-2 space-y-1 text-[11.5px] text-[#6B6A63] dark:text-[#9A9A92]">
                      <div className="flex items-center justify-between">
                        <span>Target Slot:</span>
                        <span className="font-semibold text-[#161714] dark:text-[#F2F1EC]">{b.slot}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Schedule:</span>
                        <span>{formatIST(b.startDateTime, { dateOnly: true })} – {formatIST(b.endDateTime, { dateOnly: true })}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Priority Weight:</span>
                        <span className="font-mono font-bold">#{b.priority}</span>
                      </div>
                    </div>
                  </div>

                  {/* Kill Switch Toggle & Actions Bar */}
                  <div className="pt-3 border-t border-[#E7E5DF] dark:border-[#2A2C27] flex items-center justify-between">
                    {/* Instant 1-Click Kill Switch Button (Brief requirement) */}
                    <button
                      type="button"
                      onClick={() => handleToggle(b)}
                      disabled={!canEdit}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-bold transition-all cursor-pointer ${
                        b.isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100'
                      }`}
                      title="1-click live toggle with edge cache invalidation"
                    >
                      <Power className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{b.isActive ? 'Active (Live)' : 'Paused (Killed)'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewBanner(b)}
                        className="p-1.5 rounded hover:bg-[#F0EFEA] text-[#6B6A63] hover:text-[#161714]"
                        title="Live responsive preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {canEdit && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(b)}
                            className="p-1.5 rounded hover:bg-[#F0EFEA] text-[#6B6A63] hover:text-[#161714]"
                            title="Edit banner"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              deleteBanner(b.id);
                              success('Banner Deleted', `Removed "${b.campaignName}"`);
                            }}
                            className="p-1.5 rounded hover:bg-[#F0EFEA] text-[#8C8B83] hover:text-[#C0392B]"
                            title="Delete banner"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Create / Edit Banner Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-[#161815] rounded-2xl border border-[#E7E5DF] dark:border-[#2A2C27] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-[#E7E5DF] flex items-center justify-between shrink-0">
              <h3 className="text-[16px] font-bold text-[#161714] dark:text-[#F2F1EC]">
                {editingBanner ? 'Edit Campaign Banner' : 'Create Campaign Banner'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-[#8C8B83] hover:text-[#161714]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
              <Input
                label="Campaign Name *"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. Durga Puja Festive Edition"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Target Storefront Slot *"
                  value={slot}
                  onChange={(e) => setSlot(e.target.value as BannerSlot)}
                  options={[
                    { value: 'HERO_BANNER', label: 'Hero Banner (Desktop 1920x600 & Mobile)' },
                    { value: 'ANNOUNCEMENT_BAR', label: 'Announcement Bar (Top Text Strip)' },
                    { value: 'MID_PAGE_STRIP', label: 'Mid-Page Strip Banner' },
                    { value: 'CAROUSEL_CARD', label: 'Festive Carousel Card' },
                  ]}
                />

                <Input
                  label="Display Priority (Rank)"
                  type="number"
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  hint="Lower number wins collisions (e.g. 1)"
                />
              </div>

              <Input
                label="Headline Title *"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Durga Puja Festive Edition"
              />

              {slot !== 'ANNOUNCEMENT_BAR' && (
                <>
                  <Input
                    label="Subheadline Description"
                    value={subheadline}
                    onChange={(e) => setSubheadline(e.target.value)}
                    placeholder="e.g. Handcrafted regional heritage on 240 GSM luxury streetwear."
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="CTA Button Text"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      placeholder="e.g. Explore Collection"
                    />

                    <Input
                      label="Redirect Target URL"
                      value={redirectUrl}
                      onChange={(e) => setRedirectUrl(e.target.value)}
                      placeholder="e.g. /#shop or https://fittee.in/..."
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-[#FAFAF7] border border-[#E7E5DF] space-y-3">
                    <p className="text-[12px] font-bold text-[#161714]">Media Assets (Desktop & Mobile Formats)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-medium text-[#8C8B83] mb-1">Desktop (1920x600)</label>
                        <input
                          type="text"
                          value={desktopImage}
                          onChange={(e) => setDesktopImage(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded border border-[#E7E5DF] dark:border-[#2A2C27] bg-white dark:bg-[#161815] text-[12px] text-[#161714] dark:text-[#F2F1EC]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#8C8B83] mb-1">Mobile (800x1000)</label>
                        <input
                          type="text"
                          value={mobileImage}
                          onChange={(e) => setMobileImage(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded border border-[#E7E5DF] dark:border-[#2A2C27] bg-white dark:bg-[#161815] text-[12px] text-[#161714] dark:text-[#F2F1EC]"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-2">
                <Switch
                  checked={isActive}
                  onChange={setIsActive}
                  label="Publish Live (Active State)"
                  description="When enabled, banner will display during scheduled window."
                />
              </div>

              <div className="pt-4 border-t flex justify-end gap-2.5">
                <Button variant="outline" size="md" type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit">
                  {editingBanner ? 'Save Changes' : 'Schedule Banner'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Live Responsive Preview Drawer */}
      {previewBanner && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-4xl bg-white dark:bg-[#161815] rounded-2xl border shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-[16px] text-[#161714]">Responsive Banner Preview</h3>
                <p className="text-xs text-[#8C8B83]">Previewing &ldquo;{previewBanner.campaignName}&rdquo;</p>
              </div>
              <button onClick={() => setPreviewBanner(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-[#8C8B83] mb-1.5 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4" />
                  <span>Desktop View (1920×600)</span>
                </p>
                <div className="relative aspect-[16/6] bg-[#0D120C] rounded-xl overflow-hidden border">
                  <img
                    src={previewBanner.desktopImageUrl || '/images/hero-clean-bg.jpg'}
                    alt="Desktop Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-10 text-white max-w-xl">
                    <h2 className="text-2xl font-bold tracking-tight">{previewBanner.headline}</h2>
                    <p className="text-sm text-white/80 mt-1">{previewBanner.subheadline}</p>
                    {previewBanner.ctaText && (
                      <div className="mt-4">
                        <span className="px-4 py-2 rounded-full bg-[#E5A93C] text-black text-xs font-bold shadow-md">
                          {previewBanner.ctaText}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#8C8B83] mb-1.5 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile View (800×1000)</span>
                </p>
                <div className="w-64 mx-auto aspect-[4/5] bg-[#0D120C] rounded-xl overflow-hidden border relative">
                  <img
                    src={previewBanner.mobileImageUrl || '/images/hero-clean-bg.jpg'}
                    alt="Mobile Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                    <h3 className="text-sm font-bold">{previewBanner.headline}</h3>
                    <p className="text-[11px] text-white/80 line-clamp-2 mt-0.5">{previewBanner.subheadline}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
