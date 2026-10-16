"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Shirt, ShoppingBag, Flag, Lock, X } from 'lucide-react';
import { useStore } from '@/lib/storeContext';
import { formatINR } from '@/lib/utils';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const { products, orders, banners, pageLocks } = useStore();
  const [query, setQuery] = useState('');

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredProducts = q
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.variants.some((v) => v.sku.toLowerCase().includes(q))
      )
    : [];

  const filteredOrders = q
    ? orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerCode.toLowerCase().includes(q) ||
          (o.awbNumber && o.awbNumber.toLowerCase().includes(q))
      )
    : [];

  const filteredBanners = q
    ? banners.filter((b) => b.campaignName.toLowerCase().includes(q) || b.headline.toLowerCase().includes(q))
    : [];

  const hasResults = filteredProducts.length > 0 || filteredOrders.length > 0 || filteredBanners.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#161815] rounded-2xl border border-[#E7E5DF] dark:border-[#2A2C27] shadow-[0_24px_60px_rgba(0,0,0,0.3)] overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E7E5DF] dark:border-[#2A2C27] gap-3">
          <Search className="w-5 h-5 text-[#8C8B83]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order #, AWB, customer code, product SKU, or title..."
            className="flex-1 bg-transparent text-[14px] text-[#161714] dark:text-[#F2F1EC] placeholder-[#9A9A92] focus:outline-none"
            autoFocus
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="p-1 text-[#8C8B83] hover:text-[#161714]">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FAFAF7] dark:bg-[#20221E] border border-[#E7E5DF] text-[#8C8B83]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {!q && (
            <div className="py-8 text-center text-[13px] text-[#8C8B83]">
              Type a keyword to quickly jump to any order, product, campaign, or customer record.
            </div>
          )}

          {q && !hasResults && (
            <div className="py-8 text-center text-[13px] text-[#8C8B83]">
              No matching records found for &ldquo;{query}&rdquo;.
            </div>
          )}

          {/* Orders Match */}
          {filteredOrders.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8C8B83]">
                Orders ({filteredOrders.length})
              </p>
              <div className="space-y-1">
                {filteredOrders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => {
                      onClose();
                      router.push(`/orders/${ord.id}`);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#FAFAF7] dark:hover:bg-[#20221E] text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#B87A22]/10 text-[#B87A22] flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[13px] font-bold text-[#161714] dark:text-[#F2F1EC] group-hover:text-[#B87A22]">
                            {ord.orderNumber}
                          </span>
                          <span className="text-[11px] font-mono text-[#8C8B83]">({ord.customerCode})</span>
                        </div>
                        <p className="text-[12px] text-[#6B6A63] dark:text-[#9A9A92]">
                          {ord.customerName} • {ord.shippingAddress.city}, {ord.shippingAddress.state}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-bold text-[#161714] dark:text-[#F2F1EC] tabular-nums">
                        {formatINR(ord.totalAmount)}
                      </p>
                      <span className="text-[11px] text-[#2F7D4F] font-semibold">{ord.status}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products Match */}
          {filteredProducts.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8C8B83]">
                Products ({filteredProducts.length})
              </p>
              <div className="space-y-1">
                {filteredProducts.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      onClose();
                      router.push(`/products/${prod.id}`);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#FAFAF7] dark:hover:bg-[#20221E] text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#F0EFEA] dark:bg-[#20221E] text-[#161714] flex items-center justify-center shrink-0">
                        <Shirt className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#161714] dark:text-[#F2F1EC] group-hover:text-[#B87A22]">
                          {prod.title}
                        </p>
                        <p className="text-[11px] text-[#8C8B83]">
                          {prod.categoryName} • {prod.fitType === 'OVERSIZED_FIT' ? 'Oversized' : 'Regular Fit'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-bold text-[#161714] dark:text-[#F2F1EC] tabular-nums">
                        {formatINR(prod.sellingPrice)}
                      </p>
                      <span className="text-[11px] text-[#8C8B83]">
                        {prod.variants.reduce((acc, v) => acc + v.stock, 0)} in stock
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Banners Match */}
          {filteredBanners.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8C8B83]">
                Festive Banners ({filteredBanners.length})
              </p>
              <div className="space-y-1">
                {filteredBanners.map((ban) => (
                  <button
                    key={ban.id}
                    onClick={() => {
                      onClose();
                      router.push('/banners');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#FAFAF7] dark:hover:bg-[#20221E] text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#B87A22]/10 text-[#B87A22] flex items-center justify-center shrink-0">
                        <Flag className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#161714] dark:text-[#F2F1EC] group-hover:text-[#B87A22]">
                          {ban.campaignName}
                        </p>
                        <p className="text-[11px] text-[#8C8B83]">{ban.slot}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        ban.isActive ? 'bg-[#2F7D4F]/10 text-[#2F7D4F]' : 'bg-[#F0EFEA] text-[#8C8B83]'
                      }`}
                    >
                      {ban.isActive ? 'LIVE' : 'PAUSED'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
