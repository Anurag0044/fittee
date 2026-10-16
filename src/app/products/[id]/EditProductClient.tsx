"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductEditor } from '@/components/admin/ProductEditor';
import { useStore } from '@/lib/storeContext';

interface EditProductClientProps {
  id: string;
}

export default function EditProductClient({ id }: EditProductClientProps) {
  const { products } = useStore();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <AdminLayout>
        <div className="py-20 text-center max-w-md mx-auto space-y-3">
          <h2 className="text-xl font-bold text-[#161714] dark:text-[#F2F1EC]">Product Not Found</h2>
          <p className="text-[13px] text-[#8C8B83]">The requested product ID &quot;{id}&quot; does not exist in the active catalog.</p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#B87A22] text-white text-[13px] font-semibold hover:bg-[#A36919] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Products</span>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ProductEditor key={product.id} initialProduct={product} isNew={false} />
    </AdminLayout>
  );
}
