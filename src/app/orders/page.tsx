"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Truck,
  Printer,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  PackageCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/storeContext';
import { useAuth } from '@/lib/authContext';
import { formatINR, formatIST } from '@/lib/utils';
import { OrderStatus, PaymentMethod } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';

export default function OrdersPage() {
  const router = useRouter();
  const { orders, dispatchWithEkart } = useStore();
  const { currentUser } = useAuth();
  const { success } = useToast();

  const [activeTab, setActiveTab] = useState<'ALL' | 'NEEDS_ACTION' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'ALL' | PaymentMethod>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const canDispatch = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'LOGISTICS_MGR';

  // Filter logic
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Tab filter
      if (activeTab === 'NEEDS_ACTION' && !(o.status === 'CONFIRMED' || o.status === 'PLACED')) return false;
      if (activeTab === 'PACKED' && o.status !== 'PACKED') return false;
      if (activeTab === 'SHIPPED' && o.status !== 'SHIPPED') return false;
      if (activeTab === 'DELIVERED' && o.status !== 'DELIVERED') return false;
      if (activeTab === 'CANCELLED' && !(o.status === 'CANCELLED' || o.status === 'RTO')) return false;

      // Payment filter
      if (paymentFilter !== 'ALL' && o.paymentMethod !== paymentFilter) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerCode.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          (o.awbNumber && o.awbNumber.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [orders, activeTab, paymentFilter, searchQuery]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredOrders.map((o) => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleBulkDispatch = () => {
    let bookedCount = 0;
    selectedIds.forEach((id) => {
      const ord = orders.find((o) => o.id === id);
      if (ord && ord.dispatchState !== 'BOOKED') {
        dispatchWithEkart(id);
        bookedCount++;
      }
    });
    success('Bulk Dispatch Completed', `Generated Ekart AWBs for ${bookedCount} orders`);
    setSelectedIds([]);
  };

  const handleBulkPrintLabels = () => {
    success('Thermal Labels Queued', `Sent ${selectedIds.length} 4x6" shipping labels to print spooler`);
  };

  const needsActionCount = orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PLACED').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 1. Header Bar: Title, Pipeline Status & Bulk Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E7E5DF] dark:border-[#2A2C27]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold text-[#161714] dark:text-[#F2F1EC] tracking-tight">
                Orders & Ekart Fulfillment
              </h1>
              <span className="text-[12px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#B87A22]/10 text-[#B87A22]">
                Ekart API Integrated
              </span>
            </div>
            <p className="text-[13px] text-[#6B6A63] dark:text-[#9A9A92] mt-0.5">
              Fulfillment pipeline, AWB tracking, thermal label generation, and dispatch state machine.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {needsActionCount > 0 && (
              <span className="flex items-center gap-1.5 text-[12px] font-bold px-3 py-1 rounded-full bg-[#B87A22]/15 text-[#B87A22]">
                <Clock className="w-3.5 h-3.5" />
                <span>{needsActionCount} Unfulfilled</span>
              </span>
            )}
          </div>
        </div>

        {/* 2. Pipeline Stage Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-[#E7E5DF] dark:border-[#2A2C27] overflow-x-auto">
          {[
            { key: 'ALL', label: `All (${orders.length})` },
            { key: 'NEEDS_ACTION', label: `Needs Action (${needsActionCount})`, alert: needsActionCount > 0 },
            { key: 'PACKED', label: `Packed (${orders.filter((o) => o.status === 'PACKED').length})` },
            { key: 'SHIPPED', label: `Shipped (${orders.filter((o) => o.status === 'SHIPPED').length})` },
            { key: 'DELIVERED', label: `Delivered (${orders.filter((o) => o.status === 'DELIVERED').length})` },
            { key: 'CANCELLED', label: `Cancelled (${orders.filter((o) => o.status === 'CANCELLED' || o.status === 'RTO').length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'border-[#B87A22] text-[#B87A22] font-bold'
                  : 'border-transparent text-[#6B6A63] hover:text-[#161714] dark:hover:text-[#F2F1EC]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.alert && <span className="w-1.5 h-1.5 rounded-full bg-[#B87A22] animate-pulse" />}
            </button>
          ))}
        </div>

        {/* 3. Search & Filter Bar */}
        <div className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8C8B83] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order #, customer code, phone, or AWB..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#E7E5DF] dark:border-[#2A2C27] bg-[#FAFAF7] dark:bg-[#0E0F0D] text-[13px] text-[#161714] dark:text-[#F2F1EC] placeholder-[#9A9A92] focus:outline-none focus:ring-1.5 focus:ring-[#B87A22]"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-[#E7E5DF] dark:border-[#2A2C27] bg-[#FAFAF7] dark:bg-[#0E0F0D] text-[12.5px] font-medium text-[#161714] dark:text-[#F2F1EC] focus:outline-none focus:ring-1.5 focus:ring-[#B87A22]"
            >
              <option value="ALL">All Payment Methods</option>
              <option value="RAZORPAY">Razorpay (Prepaid)</option>
              <option value="COD">Cash on Delivery (COD)</option>
            </select>
          </div>
        </div>

        {/* 4. Bulk Action Floating Bar */}
        {selectedIds.length > 0 && canDispatch && (
          <div className="p-3.5 rounded-xl bg-[#161714] text-[#F2F1EC] border border-[#2A2C27] shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[12px] font-bold px-2 py-0.5 rounded bg-[#B87A22] text-white">
                {selectedIds.length} Orders Selected
              </span>
              <span className="text-[13px] text-[#9A9A92]">Dispatch Actions:</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkPrintLabels}
                icon={<Printer className="w-3.5 h-3.5" />}
                className="bg-transparent text-white border-white/20 hover:bg-white/10"
              >
                Print Shipping Labels
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleBulkDispatch}
                icon={<Truck className="w-3.5 h-3.5" />}
              >
                Bulk Dispatch with Ekart
              </Button>
            </div>
          </div>
        )}

        {/* 5. Orders Table */}
        <div className="rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#FAFAF7] dark:bg-[#111310] border-b border-[#E7E5DF] dark:border-[#2A2C27] text-[11px] font-semibold uppercase text-[#8C8B83]">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedIds.length === filteredOrders.length && filteredOrders.length > 0}
                      className="rounded border-[#DCDAD2] text-[#B87A22] focus:ring-[#B87A22]"
                    />
                  </th>
                  <th className="py-3 px-3">Order Number</th>
                  <th className="py-3 px-3">Date (IST)</th>
                  <th className="py-3 px-3">Customer & Location</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Ekart Logistics</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F4EF] dark:divide-[#20221E]">
                {filteredOrders.map((ord) => {
                  const isPrepaid = ord.paymentMethod === 'RAZORPAY';

                  return (
                    <tr
                      key={ord.id}
                      className="hover:bg-[#FAFAF7] dark:hover:bg-[#20221E] transition-colors cursor-pointer group"
                      onClick={() => router.push(`/orders/${ord.id}`)}
                    >
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(ord.id)}
                          onChange={() => handleToggleSelect(ord.id)}
                          className="rounded border-[#DCDAD2] text-[#B87A22] focus:ring-[#B87A22]"
                        />
                      </td>

                      {/* Order Number */}
                      <td className="py-3.5 px-3">
                        <span className="font-mono font-bold text-[13px] text-[#161714] dark:text-[#F2F1EC] group-hover:text-[#B87A22] transition-colors block">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[11px] font-mono text-[#8C8B83] mt-0.5 block">
                          {ord.customerCode}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-3 text-[#6B6A63] dark:text-[#9A9A92] whitespace-nowrap text-[12px]">
                        {formatIST(ord.createdAt, { dateOnly: true })}
                        <span className="text-[11px] text-[#8C8B83] block">
                          {formatIST(ord.createdAt, { timeOnly: true })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-3">
                        <p className="font-semibold text-[#161714] dark:text-[#F2F1EC] leading-tight">
                          {ord.customerName}
                        </p>
                        <p className="text-[11.5px] text-[#8C8B83] mt-0.5">
                          {ord.shippingAddress.city}, {ord.shippingAddress.state} ({ord.shippingAddress.pincode})
                        </p>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          {ord.items.slice(0, 2).map((item) => (
                            <img
                              key={item.id}
                              src={item.thumbnail}
                              alt={item.productTitle}
                              className="w-8 h-9 object-cover rounded border border-[#E7E5DF] shrink-0"
                              title={`${item.productTitle} (${item.size})`}
                            />
                          ))}
                          {ord.items.length > 2 && (
                            <span className="text-[11px] font-bold text-[#8C8B83] px-1.5 py-1 rounded bg-[#F0EFEA]">
                              +{ord.items.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F0EFEA] text-[#161714] border border-[#E7E5DF]">
                          {isPrepaid ? 'RAZORPAY' : 'COD'}
                        </span>
                        <div className="mt-1">
                          <StatusBadge status={ord.paymentStatus} />
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-3 whitespace-nowrap font-bold text-[#161714] dark:text-[#F2F1EC] tabular-nums">
                        {formatINR(ord.totalAmount)}
                      </td>

                      {/* Ekart Logistics State */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {ord.awbNumber ? (
                          <div>
                            <span className="text-[11.5px] font-mono font-bold text-[#161714] dark:text-[#F2F1EC] block">
                              {ord.awbNumber}
                            </span>
                            <span className="text-[10.5px] text-[#2F7D4F] font-semibold flex items-center gap-1 mt-0.5">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>AWB Active</span>
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11.5px] text-[#8C8B83] italic">
                            Not dispatched
                          </span>
                        )}
                      </td>

                      {/* Order Status */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <StatusBadge status={ord.status} />
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          href={`/orders/${ord.id}`}
                          className="inline-flex p-1.5 rounded-md hover:bg-[#F0EFEA] dark:hover:bg-[#20221E] text-[#6B6A63] hover:text-[#161714] transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-[#8C8B83]">
                      No orders found matching this filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
