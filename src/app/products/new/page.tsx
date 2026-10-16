"use client";

import React, { Suspense } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductEditor } from '@/components/admin/ProductEditor';

export default function NewProductPage() {
  return (
    <Suspense
      fallback={
        <AdminLayout>
          <div className="py-20 text-center text-[#8C8B83]">Loading product editor...</div>
        </AdminLayout>
      }
    >
      <AdminLayout>
        <ProductEditor isNew={true} />
      </AdminLayout>
    </Suspense>
  );
}
