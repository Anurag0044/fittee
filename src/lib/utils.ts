// FITTEE Admin Panel — Utility Functions
// Enforces Asia/Kolkata IST timezone, INR currency formatting, and standard generators

export function formatINR(amount: number, showDecimals: boolean = false): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
}

export function formatIST(
  dateInput: string | Date | number,
  options?: {
    dateOnly?: boolean;
    timeOnly?: boolean;
    includeSeconds?: boolean;
  }
): string {
  try {
    const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return 'Invalid date';

    if (options?.dateOnly) {
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(date);
    }

    if (options?.timeOnly) {
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: options.includeSeconds ? '2-digit' : undefined,
        hour12: true,
      }).format(date);
    }

    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date) + ' IST';
  } catch {
    return String(dateInput);
  }
}

export function formatRelativeTime(dateInput: string | Date | number): string {
  try {
    const date = new Date(dateInput);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const absDiffSec = Math.floor(Math.abs(diffMs) / 1000);

    const isFuture = diffMs > 0;
    const prefix = isFuture ? 'in ' : '';
    const suffix = isFuture ? '' : ' ago';

    if (absDiffSec < 60) return isFuture ? 'in moments' : 'just now';
    if (absDiffSec < 3600) {
      const mins = Math.floor(absDiffSec / 60);
      return `${prefix}${mins} min${mins > 1 ? 's' : ''}${suffix}`;
    }
    if (absDiffSec < 86400) {
      const hours = Math.floor(absDiffSec / 3600);
      return `${prefix}${hours} hour${hours > 1 ? 's' : ''}${suffix}`;
    }
    const days = Math.floor(absDiffSec / 86400);
    return `${prefix}${days} day${days > 1 ? 's' : ''}${suffix}`;
  } catch {
    return '';
  }
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateSKU(slug: string, colorName: string, size: string): string {
  const cleanSlug = slug.toUpperCase().slice(0, 10);
  const cleanColor = colorName.toUpperCase().replace(/\s+/g, '').slice(0, 4);
  return `FIT-${cleanSlug}-${cleanColor}-${size}`;
}

export function calculateDiscount(sellingPrice: number, originalMrp: number): number {
  if (originalMrp <= 0 || sellingPrice >= originalMrp) return 0;
  return Math.round(((originalMrp - sellingPrice) / originalMrp) * 100);
}

export function generateIdempotencyKey(): string {
  return 'idemp_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
