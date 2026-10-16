"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  Shirt,
  MoreVertical,
  ExternalLink,
  Edit,
  Archive,
  ArrowUpDown,
  Tag,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/storeContext';
import { useAuth } from '@/lib/authContext';
import { formatINR } from '@/lib/utils';
import { ProductStatus, FitType } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';

export default function ProductsPage() {
  const router = useRouter();
  const { products, archiveProduct, updateProduct } = useStore();
  const { currentUser } = useAuth();
  const { success } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [fitFilter, setFitFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const canEdit = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CATALOG_MGR';

  // Categories list
  const categoriesList = useMemo(() => {
    const set = new Set(products.map((p) => p.categoryName));
    return Array.from(set);
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.variants.some((v) => v.sku.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = categoryFilter === 'ALL' || p.categoryName === categoryFilter;
      const matchesFit = fitFilter === 'ALL' || p.fitType === fitFilter;
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;

      return matchesSearch && matchesCat && matchesFit && matchesStatus;
    });
  }, [products, searchQuery, categoryFilter, fitFilter, statusFilter]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleBulkArchive = () => {
    selectedIds.forEach((id) => archiveProduct(id));
    success('Bulk Archived', `Archived ${selectedIds.length} products`);
    setSelectedIds([]);
  };

  const handleBulkChangeBadge = (badge: 'NEW' | 'BESTSELLER' | 'FESTIVE_SPECIAL' | null) => {
    selectedIds.forEach((id) => updateProduct(id, { badge }));
    success('Badge Updated', `Assigned badge to ${selectedIds.length} products`);
    setSelectedIds([]);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 1. Header Bar: Title, Count & Primary Create CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E7E5DF] dark:border-[#2A2C27]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold text-[#161714] dark:text-[#F2F1EC] tracking-tight">
                Product Catalog
              </h1>
              <span className="text-[12px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#F0EFEA] dark:bg-[#20221E] text-[#6B6A63] dark:text-[#9A9A92]">
                {products.length} Products
              </span>
            </div>
            <p className="text-[13px] text-[#6B6A63] dark:text-[#9A9A92] mt-0.5">
              Manage streetwear garments, size/color variant matrix, stock levels, and SEO metadata.
            </p>
          </div>

          {canEdit && (
            <div className="flex items-center gap-2.5">
              <Button
                variant="primary"
                size="md"
                onClick={() => router.push('/products/new')}
                icon={<Plus className="w-4 h-4 stroke-[2.5]" />}
              >
                Add New Product
              </Button>
            </div>
          )}
        </div>

        {/* 2. Filters & Search Control Bar */}
        <div className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8C8B83] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, slug, or SKU (e.g. SOHRAI)..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#E7E5DF] dark:border-[#2A2C27] bg-[#FAFAF7] dark:bg-[#0E0F0D] text-[13px] text-[#161714] dark:text-[#F2F1EC] placeholder-[#9A9A92] focus:outline-none focus:ring-1.5 focus:ring-[#B87A22]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category Select */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#E7E5DF] dark:border-[#2A2C27] bg-[#FAFAF7] dark:bg-[#0E0F0D] text-[12.5px] font-medium text-[#161714] dark:text-[#F2F1EC] focus:outline-none focus:ring-1.5 focus:ring-[#B87A22]"
            >
              <option value="ALL">All Categories</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Fit Filter */}
            <select
              value={fitFilter}
              onChange={(e) => setFitFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#E7E5DF] dark:border-[#2A2C27] bg-[#FAFAF7] dark:bg-[#0E0F0D] text-[12.5px] font-medium text-[#161714] dark:text-[#F2F1EC] focus:outline-none focus:ring-1.5 focus:ring-[#B87A22]"
            >
              <option value="ALL">All Fits</option>
              <option value="OVERSIZED_FIT">Oversized Fit</option>
              <option value="REGULAR_FIT">Regular Fit</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#E7E5DF] dark:border-[#2A2C27] bg-[#FAFAF7] dark:bg-[#0E0F0D] text-[12.5px] font-medium text-[#161714] dark:text-[#F2F1EC] focus:outline-none focus:ring-1.5 focus:ring-[#B87A22]"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            {(searchQuery || categoryFilter !== 'ALL' || fitFilter !== 'ALL' || statusFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('ALL');
                  setFitFilter('ALL');
                  setStatusFilter('ALL');
                }}
                className="text-[12px] font-semibold text-[#B87A22] hover:underline px-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* 3. Bulk Selection Floating / Sticky Bar */}
        {selectedIds.length > 0 && canEdit && (
          <div className="p-3.5 rounded-xl bg-[#161714] text-[#F2F1EC] border border-[#2A2C27] shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[12px] font-bold px-2 py-0.5 rounded bg-[#B87A22] text-white">
                {selectedIds.length} Selected
              </span>
              <span className="text-[13px] text-[#9A9A92]">Bulk actions:</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkChangeBadge('BESTSELLER')}
                className="bg-transparent text-white border-white/20 hover:bg-white/10"
              >
                Mark Bestseller
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkChangeBadge('NEW')}
                className="bg-transparent text-white border-white/20 hover:bg-white/10"
              >
                Mark New
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleBulkArchive}
              >
                Archive Selected
              </Button>
            </div>
          </div>
        )}

        {/* 4. Products Table */}
        <div className="rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#FAFAF7] dark:bg-[#111310] border-b border-[#E7E5DF] dark:border-[#2A2C27] text-[11px] font-semibold uppercase text-[#8C8B83]">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                      className="rounded border-[#DCDAD2] text-[#B87A22] focus:ring-[#B87A22]"
                    />
                  </th>
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Silhouette</th>
                  <th className="py-3 px-3">Price & MRP</th>
                  <th className="py-3 px-3">Variants / Stock</th>
                  <th className="py-3 px-3">Badge</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F4EF] dark:divide-[#20221E]">
                {filteredProducts.map((p) => {
                  const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
                  const isOutOfStock = totalStock === 0;
                  const isLowStock = totalStock > 0 && totalStock <= 15;
                  const heroImg = p.images.find((img) => img.isHero) || p.images[0];

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-[#FAFAF7] dark:hover:bg-[#20221E] transition-colors group"
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(p.id)}
                          onChange={() => handleToggleSelect(p.id)}
                          className="rounded border-[#DCDAD2] text-[#B87A22] focus:ring-[#B87A22]"
                        />
                      </td>

                      {/* Product Column */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={heroImg?.url || '/images/products/sohrai-spirit.jpg'}
                            alt={p.title}
                            className="w-10 h-12 object-cover rounded-md bg-[#F0EFEA] border border-[#E7E5DF] shrink-0"
                          />
                          <div>
                            <Link
                              href={`/products/${p.id}`}
                              className="font-semibold text-[#161714] dark:text-[#F2F1EC] hover:text-[#B87A22] transition-colors leading-tight block"
                            >
                              {p.title}
                            </Link>
                            <span className="text-[11px] font-mono text-[#8C8B83] mt-0.5 block">
                              /{p.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 text-[#6B6A63] dark:text-[#9A9A92] font-medium">
                        {p.categoryName}
                      </td>

                      {/* Fit */}
                      <td className="py-3 px-3">
                        <span className="text-[11.5px] px-2 py-0.5 rounded font-medium bg-[#F0EFEA] text-[#161714] border border-[#E7E5DF] whitespace-nowrap">
                          {p.fitType === 'OVERSIZED_FIT' ? 'Oversized' : 'Regular Fit'}
                        </span>
                      </td>

                      {/* Price & Discount */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-bold text-[#161714] dark:text-[#F2F1EC] tabular-nums">
                          {formatINR(p.sellingPrice)}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8C8B83]">
                          <span className="line-through tabular-nums">{formatINR(p.originalMrp)}</span>
                          {p.discountPercent > 0 && (
                            <span className="text-[#9C380A] font-bold">
                              {p.discountPercent}% OFF
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Variants & Total Stock */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-[12px] font-bold">
                          <span className={isOutOfStock ? 'text-[#C0392B]' : isLowStock ? 'text-[#B7791F]' : 'text-[#161714] dark:text-[#F2F1EC]'}>
                            {totalStock} units
                          </span>
                          <span className="text-[11px] font-normal text-[#8C8B83]">
                            ({p.variants.length} SKUs)
                          </span>
                        </div>
                        <div className="mt-0.5">
                          {isOutOfStock ? (
                            <StatusBadge status="OUT_OF_STOCK" label="Out of Stock" tone="danger" />
                          ) : isLowStock ? (
                            <StatusBadge status="LOW_STOCK" label="Low Stock" tone="warning" />
                          ) : (
                            <span className="text-[11px] text-[#2F7D4F] font-semibold">● Healthy</span>
                          )}
                        </div>
                      </td>

                      {/* Badge */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {p.badge ? (
                          <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-[#E5A93C] text-[#161714] shadow-xs">
                            {p.badge}
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#8C8B83]">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <StatusBadge status={p.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/products/${p.id}`}
                            className="p-1.5 rounded-md hover:bg-[#F0EFEA] dark:hover:bg-[#20221E] text-[#6B6A63] hover:text-[#161714] transition-colors"
                            title="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => {
                                archiveProduct(p.id);
                                success('Product Archived', `"${p.title}" archived`);
                              }}
                              className="p-1.5 rounded-md hover:bg-[#F0EFEA] dark:hover:bg-[#20221E] text-[#8C8B83] hover:text-[#C0392B] transition-colors"
                              title="Archive product"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-[#8C8B83]">
                      No products match your search or filter criteria.
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
