import React from 'react';

type Tone = 'success' | 'warning' | 'danger' | 'neutral' | 'accent' | 'info';

interface StatusBadgeProps {
  status: string;
  tone?: Tone;
  label?: string;
  className?: string;
  dot?: boolean;
}

const STATUS_MAP: Record<string, { label: string; tone: Tone }> = {
  // Orders
  PLACED: { label: 'Placed', tone: 'neutral' },
  CONFIRMED: { label: 'Confirmed', tone: 'accent' },
  PACKED: { label: 'Packed', tone: 'info' },
  SHIPPED: { label: 'Shipped', tone: 'info' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', tone: 'warning' },
  DELIVERED: { label: 'Delivered', tone: 'success' },
  CANCELLED: { label: 'Cancelled', tone: 'danger' },
  RTO: { label: 'RTO / Returned', tone: 'danger' },

  // Payments
  PAID: { label: 'Paid', tone: 'success' },
  PENDING: { label: 'Pending', tone: 'warning' },
  REFUNDED: { label: 'Refunded', tone: 'neutral' },
  FAILED: { label: 'Failed', tone: 'danger' },

  // Products
  ACTIVE: { label: 'Active', tone: 'success' },
  DRAFT: { label: 'Draft', tone: 'neutral' },
  ARCHIVED: { label: 'Archived', tone: 'neutral' },
  IN_STOCK: { label: 'In Stock', tone: 'success' },
  LOW_STOCK: { label: 'Low Stock', tone: 'warning' },
  OUT_OF_STOCK: { label: 'Out of Stock', tone: 'danger' },

  // Banners
  LIVE: { label: 'Live', tone: 'success' },
  SCHEDULED: { label: 'Scheduled', tone: 'info' },
  EXPIRED: { label: 'Expired', tone: 'neutral' },
  PAUSED: { label: 'Paused', tone: 'warning' },

  // Page Lock
  LOCKED: { label: 'Locked', tone: 'danger' },
  UNLOCKED: { label: 'Unlocked', tone: 'success' },
  MAINTENANCE: { label: 'Maintenance', tone: 'warning' },
  COMING_SOON: { label: 'Coming Soon', tone: 'info' },
};

export function StatusBadge({ status, tone, label, className = '', dot = true }: StatusBadgeProps) {
  const mapped = STATUS_MAP[status.toUpperCase()] || { label: status, tone: 'neutral' };
  const effectiveTone = tone || mapped.tone;
  const effectiveLabel = label || mapped.label;

  const toneClasses: Record<Tone, { badge: string; dot: string }> = {
    success: {
      badge: 'bg-[#2F7D4F]/10 text-[#24633E] border-[#2F7D4F]/25 dark:text-[#52B77A]',
      dot: 'bg-[#2F7D4F]',
    },
    warning: {
      badge: 'bg-[#B7791F]/10 text-[#8C5A14] border-[#B7791F]/25 dark:text-[#E0A03C]',
      dot: 'bg-[#B7791F]',
    },
    danger: {
      badge: 'bg-[#C0392B]/10 text-[#962B20] border-[#C0392B]/25 dark:text-[#E86253]',
      dot: 'bg-[#C0392B]',
    },
    accent: {
      badge: 'bg-[#B87A22]/10 text-[#8C5A14] border-[#B87A22]/30 dark:text-[#E5A93C]',
      dot: 'bg-[#B87A22]',
    },
    info: {
      badge: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
      dot: 'bg-sky-600',
    },
    neutral: {
      badge: 'bg-[#F0EFEA] text-[#5C5B54] border-[#E2E0D8] dark:bg-[#1E201C] dark:text-[#A8A7A0] dark:border-[#2E302A]',
      dot: 'bg-[#8A887E]',
    },
  };

  const current = toneClasses[effectiveTone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11.5px] font-medium border leading-none tracking-tight ${current.badge} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`} />}
      <span>{effectiveLabel}</span>
    </span>
  );
}
