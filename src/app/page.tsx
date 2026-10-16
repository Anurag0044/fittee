"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Clock,
  ArrowUpRight,
  ChevronRight,
  MapPin,
  Calendar,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/lib/authContext';
import { useStore } from '@/lib/storeContext';
import { useTheme } from '@/lib/themeContext';
import { formatINR } from '@/lib/utils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function AdminDashboardPage() {
  const { currentUser, canAccessModule } = useAuth();
  const { analytics, orders } = useStore();
  const { resolvedTheme } = useTheme();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '12m'>('30d');

  const showRevenueKpis = canAccessModule('revenue_kpis');

  // Pipeline counts
  const needsActionCount = orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PLACED').length;
  const packedCount = orders.filter((o) => o.status === 'PACKED').length;
  const shippedCount = orders.filter((o) => o.status === 'SHIPPED').length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* 1. Header Bar: Welcome, Timezone Notice & Date Range Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E7E5DF] dark:border-[#2A2C27]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold text-[#161714] dark:text-[#F2F1EC] tracking-tight">
                Operations Dashboard
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#F5F4EF] dark:bg-[#20221E] text-[#6B6A63] dark:text-[#9A9A92] border border-[#E7E5DF] dark:border-[#2A2C27]">
                IST (Asia/Kolkata)
              </span>
            </div>
            <p className="text-[13px] text-[#6B6A63] dark:text-[#9A9A92] mt-0.5">
              Live storefront pulse, monthly active users, fulfillment pipeline, and catalog velocity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] rounded-lg p-1 text-[12px] font-medium text-[#6B6A63]">
              {(['7d', '30d', '90d', '12m'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setDateRange(r)}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    dateRange === r
                      ? 'bg-[#B87A22] text-white font-semibold shadow-xs'
                      : 'hover:text-[#161714] dark:hover:text-[#F2F1EC]'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Top Hero Metric Row: MAU Hero Card + Engagement & Commercial KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Hero Widget: Rolling 30-Day MAU (Brief requirement) */}
          <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[12.5px] font-semibold text-[#6B6A63] dark:text-[#9A9A92]">
                Monthly Active Users (MAU)
              </span>
              <Users className="w-4 h-4 text-[#B87A22]" />
            </div>

            <div className="mt-3">
              <div className="text-[32px] font-bold text-[#161714] dark:text-[#F2F1EC] tabular-nums tracking-tight leading-none">
                {analytics.rollingMau.toLocaleString('en-IN')}
              </div>

              <div className="flex items-center gap-2 mt-2.5">
                <span className="inline-flex items-center gap-0.5 text-[11.5px] font-semibold px-1.5 py-0.5 rounded bg-[#2F7D4F]/10 text-[#24633E] dark:text-[#52B77A]">
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  <span>+{analytics.mauChangePercent}%</span>
                </span>
                <span className="text-[11.5px] text-[#8C8B83]">vs previous 30 days</span>
              </div>
            </div>
          </div>

          {/* Stickiness Ratio (DAU / MAU) */}
          <MetricCard
            title="Stickiness (DAU / MAU)"
            value={`${analytics.stickinessRatio}%`}
            subtitle={`DAU: ${analytics.dau.toLocaleString('en-IN')}`}
            icon={<TrendingUp className="w-4 h-4 text-[#B87A22]" />}
            delta={{ value: 3.2, label: 'high repeat visit rate' }}
          />

          {/* Commercial KPI 1: Gross Revenue (Super Admin Only) */}
          {showRevenueKpis ? (
            <MetricCard
              title="Gross Revenue (This Month)"
              value={formatINR(analytics.grossRevenueThisMonth)}
              subtitle={`Today: ${formatINR(analytics.grossRevenueToday)}`}
              icon={<DollarSign className="w-4 h-4 text-[#2F7D4F]" />}
              delta={{ value: 14.8, label: 'MoM' }}
            />
          ) : (
            <MetricCard
              title="Average Session Duration"
              value="3m 14s"
              subtitle="Visitor dwell time on storefront"
              icon={<Clock className="w-4 h-4 text-[#8C8B83]" />}
              delta={{ value: 8.5, label: 'MoM' }}
            />
          )}

          {/* Commercial KPI 2: AOV & Conversion */}
          {showRevenueKpis ? (
            <MetricCard
              title="Average Order Value (AOV)"
              value={formatINR(analytics.averageOrderValue)}
              subtitle={`Conversion: ${analytics.conversionRate}%`}
              icon={<ShoppingBag className="w-4 h-4 text-[#B87A22]" />}
              delta={{ value: 4.1, label: 'basket expansion' }}
            />
          ) : (
            <MetricCard
              title="Storefront Conversion Rate"
              value={`${analytics.conversionRate}%`}
              subtitle="Cart-to-order ratio"
              icon={<ShoppingBag className="w-4 h-4 text-[#B87A22]" />}
              delta={{ value: 2.1, label: 'MoM' }}
            />
          )}
        </div>

        {/* 3. Order Pipeline Status Shelf (Clickable to filtered orders) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-bold text-[#161714] dark:text-[#F2F1EC] uppercase tracking-wider">
              Fulfillment Pipeline
            </h2>
            <Link
              href="/orders"
              className="text-[12px] font-semibold text-[#B87A22] hover:underline flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <Link
              href="/orders?status=needs_action"
              className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] hover:border-[#B87A22] transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#6B6A63]">Needs Action</span>
                <span className="w-2 h-2 rounded-full bg-[#B87A22] animate-ping" />
              </div>
              <p className="text-[24px] font-bold text-[#B87A22] mt-1 tabular-nums leading-none">
                {needsActionCount}
              </p>
              <p className="text-[11px] text-[#8C8B83] mt-2">Paid & waiting for pack</p>
            </Link>

            <Link
              href="/orders?status=packed"
              className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] hover:border-[#B87A22] transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#6B6A63]">Packed & AWB Booked</span>
                <span className="w-2 h-2 rounded-full bg-sky-500" />
              </div>
              <p className="text-[24px] font-bold text-[#161714] dark:text-[#F2F1EC] mt-1 tabular-nums leading-none">
                {packedCount}
              </p>
              <p className="text-[11px] text-[#8C8B83] mt-2">Ready for Ekart pickup</p>
            </Link>

            <Link
              href="/orders?status=shipped"
              className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] hover:border-[#B87A22] transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#6B6A63]">In Transit (Ekart)</span>
                <span className="w-2 h-2 rounded-full bg-[#B7791F]" />
              </div>
              <p className="text-[24px] font-bold text-[#161714] dark:text-[#F2F1EC] mt-1 tabular-nums leading-none">
                {shippedCount}
              </p>
              <p className="text-[11px] text-[#8C8B83] mt-2">En route to customers</p>
            </Link>

            <Link
              href="/orders?status=delivered"
              className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] hover:border-[#B87A22] transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#6B6A63]">Delivered (30d)</span>
                <span className="w-2 h-2 rounded-full bg-[#2F7D4F]" />
              </div>
              <p className="text-[24px] font-bold text-[#2F7D4F] mt-1 tabular-nums leading-none">
                {deliveredCount}
              </p>
              <p className="text-[11px] text-[#8C8B83] mt-2">Successful handovers</p>
            </Link>
          </div>
        </div>

        {/* 4. Chart & Regional Breakdown: 12-Month MAU Bar Chart & Geo Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 12-Month Recharts Bar Chart */}
          <div className="lg:col-span-2 p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[14px] font-bold text-[#161714] dark:text-[#F2F1EC]">
                  12-Month MAU Growth Trajectory
                </h3>
                <p className="text-[12px] text-[#6B6A63] dark:text-[#9A9A92]">
                  Monthly active visitors engaging with Sohrai & Khovar collections
                </p>
              </div>
              <span className="text-[11.5px] font-semibold text-[#B87A22]">
                Current: 38,450 MAU
              </span>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.historicalMau} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={resolvedTheme === 'dark' ? '#2A2C27' : '#E7E5DF'}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: resolvedTheme === 'dark' ? '#9A9A92' : '#6B6A63' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: resolvedTheme === 'dark' ? '#9A9A92' : '#6B6A63' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `${val / 1000}k`}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(184, 122, 34, 0.05)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 bg-[#161714] text-[#F2F1EC] rounded-lg border border-[#2A2C27] shadow-lg text-[12px]">
                            <p className="font-bold text-[#B87A22]">{data.month}</p>
                            <p className="mt-1">MAU: <span className="font-mono font-bold">{data.mau.toLocaleString('en-IN')}</span></p>
                            <p>Revenue: <span className="font-mono">{formatINR(data.revenue)}</span></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="mau" fill="#B87A22" radius={[4, 4, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Regional Sales Breakdown: Jharkhand Highlighted (Brief Module 1 requirement) */}
          <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-bold text-[#161714] dark:text-[#F2F1EC]">
                  Top Regional Markets
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#B87A22]/10 text-[#B87A22]">
                  Jharkhand Roots
                </span>
              </div>
              <p className="text-[12px] text-[#6B6A63] dark:text-[#9A9A92] mb-3">
                Order concentration by city with regional origin highlighting.
              </p>

              <div className="space-y-2.5">
                {analytics.regionalDistribution.map((reg) => (
                  <div
                    key={reg.region}
                    className="flex items-center justify-between py-1 border-b border-[#F5F4EF] dark:border-[#20221E] last:border-none"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-3.5 h-3.5 ${reg.isJharkhand ? 'text-[#B87A22]' : 'text-[#8C8B83]'}`} />
                      <span className={`text-[13px] ${reg.isJharkhand ? 'font-bold text-[#161714] dark:text-[#F2F1EC]' : 'text-[#6B6A63] dark:text-[#9A9A92]'}`}>
                        {reg.region}
                      </span>
                      {reg.isJharkhand && (
                        <span className="text-[9.5px] px-1 rounded bg-[#B87A22]/10 text-[#B87A22] font-semibold">
                          JH
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-[12.5px] font-semibold text-[#161714] dark:text-[#F2F1EC] tabular-nums">
                        {reg.orders} orders
                      </span>
                      <span className="text-[11px] text-[#8C8B83] block tabular-nums">
                        {formatINR(reg.revenue)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-[#8C8B83] pt-3 mt-3 border-t border-[#E7E5DF] dark:border-[#2A2C27]">
              64% of volume originates from eastern region hubs via Ekart Ranchi Hub.
            </p>
          </div>
        </div>

        {/* 5. Top Products Leaderboard with Fit Split */}
        <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[14px] font-bold text-[#161714] dark:text-[#F2F1EC]">
                Product Velocity Leaderboard
              </h3>
              <p className="text-[12px] text-[#6B6A63] dark:text-[#9A9A92]">
                Ranked by units sold across Regular vs Oversized silhouette taxonomy.
              </p>
            </div>
            <Link
              href="/products"
              className="text-[12px] font-semibold text-[#B87A22] hover:underline"
            >
              Catalog Management →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#E7E5DF] dark:border-[#2A2C27] text-[11px] font-semibold uppercase text-[#8C8B83]">
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Silhouette / Fit</th>
                  <th className="py-2.5 px-3 text-right">Units Sold</th>
                  <th className="py-2.5 px-3 text-right">Gross Revenue</th>
                  <th className="py-2.5 px-3 text-right">Stock State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F4EF] dark:divide-[#20221E]">
                {analytics.topProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAFAF7] dark:hover:bg-[#20221E] transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-9 h-11 object-cover rounded-md bg-[#F0EFEA] dark:bg-[#20221E] border border-[#E7E5DF] dark:border-[#2A2C27] shrink-0"
                        />
                        <span className="font-semibold text-[#161714] dark:text-[#F2F1EC]">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[12px] px-2 py-0.5 rounded bg-[#F0EFEA] dark:bg-[#20221E] text-[#161714] dark:text-[#F2F1EC] font-medium border border-[#E7E5DF] dark:border-[#2A2C27]">
                        {p.fitType === 'OVERSIZED_FIT' ? 'Oversized Fit' : 'Regular Fit'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold tabular-nums text-[#161714] dark:text-[#F2F1EC]">
                      {p.unitsSold}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold tabular-nums text-[#161714] dark:text-[#F2F1EC]">
                      {formatINR(p.revenue)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <StatusBadge status="IN_STOCK" label="Healthy Stock" tone="success" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
