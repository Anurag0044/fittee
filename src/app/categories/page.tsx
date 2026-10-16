"use client";

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  ExternalLink,
  Tag,
  Check,
  X,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Switch } from '@/components/ui/FormElements';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/storeContext';
import { useAuth } from '@/lib/authContext';
import { generateSlug } from '@/lib/utils';
import { Category } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, reorderCategories } = useStore();
  const { currentUser } = useAuth();
  const { success, error } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [storyExcerpt, setStoryExcerpt] = useState('');
  const [iconMotif, setIconMotif] = useState('tribal-sun');
  const [isActive, setIsActive] = useState(true);

  const canEdit = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CATALOG_MGR';

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setSubtitle('');
    setStoryExcerpt('');
    setIconMotif('tribal-sun');
    setIsActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setSubtitle(cat.subtitle);
    setStoryExcerpt(cat.storyExcerpt);
    setIconMotif(cat.iconMotif);
    setIsActive(cat.isActive);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      slug: slug || generateSlug(name),
      subtitle,
      storyExcerpt,
      bannerImage: '/images/products/sohrai-spirit.jpg',
      iconMotif,
      displayOrder: editingCategory ? editingCategory.displayOrder : categories.length + 1,
      isActive,
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, payload);
      success('Category Updated', `Saved "${name}"`);
    } else {
      addCategory(payload);
      success('Category Created', `Added "${name}" to catalog taxonomy`);
    }
    setShowModal(false);
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newOrder = [...categories];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    reorderCategories(newOrder.map((c) => c.id));
    success('Reordered', 'Updated category storefront priority');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E7E5DF] dark:border-[#2A2C27]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold text-[#161714] dark:text-[#F2F1EC] tracking-tight">
                Collection Categories
              </h1>
              <span className="text-[12px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#F0EFEA] text-[#6B6A63]">
                {categories.length} Categories
              </span>
            </div>
            <p className="text-[13px] text-[#6B6A63] dark:text-[#9A9A92] mt-0.5">
              Organize Jharkhand art traditions, display order, and storefront navigation filters.
            </p>
          </div>

          {canEdit && (
            <Button variant="primary" size="md" onClick={handleOpenCreate} icon={<Plus className="w-4 h-4 stroke-[2.5]" />}>
              Add Category
            </Button>
          )}
        </div>

        {/* Categories Table */}
        <div className="rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#FAFAF7] dark:bg-[#111310] border-b border-[#E7E5DF] text-[11px] font-semibold uppercase text-[#8C8B83]">
              <tr>
                <th className="py-3 px-4 w-16">Order</th>
                <th className="py-3 px-3">Category Name</th>
                <th className="py-3 px-3">Subtitle & Tradition</th>
                <th className="py-3 px-3">Slug Identifier</th>
                <th className="py-3 px-3">Products</th>
                <th className="py-3 px-3">Nav Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F4EF] dark:divide-[#20221E]">
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-[#FAFAF7] dark:hover:bg-[#20221E] transition-colors">
                  {/* Order controls */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-bold text-xs w-4">{idx + 1}</span>
                      {canEdit && (
                        <div className="flex flex-col">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveOrder(idx, 'up')}
                            className="p-0.5 text-[#8C8B83] hover:text-[#161714] disabled:opacity-20"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === categories.length - 1}
                            onClick={() => handleMoveOrder(idx, 'down')}
                            className="p-0.5 text-[#8C8B83] hover:text-[#161714] disabled:opacity-20"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Name */}
                  <td className="py-3 px-3 font-bold text-[#161714] dark:text-[#F2F1EC]">
                    {cat.name}
                  </td>

                  {/* Subtitle */}
                  <td className="py-3 px-3 text-[#6B6A63] dark:text-[#9A9A92] max-w-xs truncate">
                    {cat.subtitle}
                  </td>

                  {/* Slug */}
                  <td className="py-3 px-3 font-mono text-[12px] text-[#8C8B83]">
                    /{cat.slug}
                  </td>

                  {/* Products count */}
                  <td className="py-3 px-3 font-mono font-semibold text-[12px]">
                    {cat.productCount} products
                  </td>

                  {/* Active Toggle */}
                  <td className="py-3 px-3">
                    <StatusBadge
                      status={cat.isActive ? 'ACTIVE' : 'ARCHIVED'}
                      label={cat.isActive ? 'Visible in Nav' : 'Hidden from Nav'}
                    />
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 rounded hover:bg-[#F0EFEA] text-[#6B6A63] hover:text-[#161714]"
                        title="Edit category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog for Category Create / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#161815] rounded-2xl border p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-[16px] text-[#161714]">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Category Name *"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingCategory) setSlug(generateSlug(e.target.value));
                }}
                placeholder="e.g. Dokra Metal Crafts"
              />

              <Input
                label="URL Slug *"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
                placeholder="dokra-metal-crafts"
              />

              <Input
                label="Subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Short tagline for category page banner"
              />

              <Textarea
                label="Tradition Story Excerpt"
                value={storyExcerpt}
                onChange={(e) => setStoryExcerpt(e.target.value)}
                rows={3}
                placeholder="Brief cultural story explaining the heritage origins..."
              />

              <Switch
                checked={isActive}
                onChange={setIsActive}
                label="Display in Storefront Navigation"
                description="Hiding removes it from menu without touching products."
              />

              <div className="pt-4 border-t flex justify-end gap-2.5">
                <Button variant="outline" size="md" type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit">
                  Save Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
