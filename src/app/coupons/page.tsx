"use client";

import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Percent,
  DollarSign,
  Truck,
  Check,
  Calendar,
  X,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input, Select, Switch } from '@/components/ui/FormElements';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/storeContext';
import { useAuth } from '@/lib/authContext';
import { formatINR, formatIST } from '@/lib/utils';
import { Coupon } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';

export default function CouponsPage() {
  const { coupons, addCoupon, toggleCouponActive } = useStore();
  const { currentUser } = useAuth();
  const { success } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'PERCENTAGE' | 'FLAT' | 'FREE_SHIPPING'>('PERCENTAGE');
  const [value, setValue] = useState<number>(15);
  const [minOrderValue, setMinOrderValue] = useState<number>(999);
  const [maxDiscountCap, setMaxDiscountCap] = useState<number>(500);
  const [usageLimitTotal, setUsageLimitTotal] = useState<number>(500);
  const [validFrom, setValidFrom] = useState('2026-10-01T00:00:00Z');
  const [validTo, setValidTo] = useState('2026-10-31T23:59:59Z');
  const [isActive, setIsActive] = useState(true);

  const canEdit = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CATALOG_MGR';

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addCoupon({
      code: code.trim().toUpperCase(),
      type,
      value,
      minOrderValue,
      maxDiscountCap: type === 'PERCENTAGE' ? maxDiscountCap : undefined,
      usageLimitTotal,
      validFrom,
      validTo,
      isActive,
    });

    success('Coupon Created', `Discount code ${code.toUpperCase()} is ready`);
    setShowModal(false);
    setCode('');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E7E5DF] dark:border-[#2A2C27]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold text-[#161714] dark:text-[#F2F1EC] tracking-tight">
                Discount Coupons & Promotions
              </h1>
              <span className="text-[12px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#F0EFEA] text-[#6B6A63]">
                {coupons.length} Active Codes
              </span>
            </div>
            <p className="text-[13px] text-[#6B6A63] dark:text-[#9A9A92] mt-0.5">
              Manage promotional codes, percentage discounts, minimum basket thresholds, and redemptions.
            </p>
          </div>

          {canEdit && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowModal(true)}
              icon={<Plus className="w-4 h-4 stroke-[2.5]" />}
            >
              Create New Coupon
            </Button>
          )}
        </div>

        {/* Coupons Table */}
        <div className="rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#FAFAF7] dark:bg-[#111310] border-b border-[#E7E5DF] text-[11px] font-semibold uppercase text-[#8C8B83]">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-3">Type & Discount Value</th>
                <th className="py-3 px-3">Min Order Basket</th>
                <th className="py-3 px-3">Redemptions</th>
                <th className="py-3 px-3">Schedule (IST)</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F4EF] dark:divide-[#20221E]">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAFAF7] dark:hover:bg-[#20221E] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[14px] text-[#161714] dark:text-[#F2F1EC]">
                    <span className="px-2.5 py-1 rounded-md bg-[#B87A22]/10 text-[#B87A22] border border-[#B87A22]/20">
                      {c.code}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-bold text-[#161714] dark:text-[#F2F1EC]">
                      {c.type === 'PERCENTAGE' && `${c.value}% OFF`}
                      {c.type === 'FLAT' && `${formatINR(c.value)} FLAT OFF`}
                      {c.type === 'FREE_SHIPPING' && 'Free Express Shipping'}
                    </div>
                    {c.maxDiscountCap && (
                      <span className="text-[11px] text-[#8C8B83]">Up to {formatINR(c.maxDiscountCap)}</span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 font-mono font-semibold text-[#161714] dark:text-[#F2F1EC]">
                    {formatINR(c.minOrderValue)}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-mono font-bold text-[#161714] dark:text-[#F2F1EC]">
                      {c.usageCount}
                    </span>
                    <span className="text-[11px] text-[#8C8B83]"> / {c.usageLimitTotal}</span>
                  </td>

                  <td className="py-3.5 px-3 text-[12px] text-[#6B6A63]">
                    {formatIST(c.validFrom, { dateOnly: true })} – {formatIST(c.validTo, { dateOnly: true })}
                  </td>

                  <td className="py-3.5 px-3">
                    <StatusBadge status={c.isActive ? 'LIVE' : 'EXPIRED'} />
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => {
                          toggleCouponActive(c.id);
                          success('Coupon Toggled', `${c.code} active state changed`);
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                          c.isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Disabled'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#161815] rounded-2xl border p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-[16px] text-[#161714]">Create Promo Coupon</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <Input
                label="Coupon Code *"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SOHRAI20"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Discount Type *"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  options={[
                    { value: 'PERCENTAGE', label: 'Percentage (%) Discount' },
                    { value: 'FLAT', label: 'Flat (₹ INR) Discount' },
                    { value: 'FREE_SHIPPING', label: 'Free Shipping Waiver' },
                  ]}
                />

                <Input
                  label="Discount Value *"
                  type="number"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  hint={type === 'PERCENTAGE' ? 'Percentage (e.g. 15 for 15%)' : 'Rupees discount'}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Minimum Order Basket (₹)"
                  type="number"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(Number(e.target.value))}
                />

                <Input
                  label="Total Usage Limit"
                  type="number"
                  value={usageLimitTotal}
                  onChange={(e) => setUsageLimitTotal(Number(e.target.value))}
                />
              </div>

              <div className="pt-4 border-t flex justify-end gap-2.5">
                <Button variant="outline" size="md" type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit">
                  Generate Code
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
