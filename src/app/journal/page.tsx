"use client";

import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  Clock,
  Sparkles,
  Shirt,
  X,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/FormElements';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SerpPreview } from '@/components/ui/SerpPreview';
import { useStore } from '@/lib/storeContext';
import { useAuth } from '@/lib/authContext';
import { formatIST, generateSlug } from '@/lib/utils';
import { JournalArticle } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';

export default function JournalPage() {
  const { journalArticles, addJournalArticle, updateJournalArticle, products } = useStore();
  const { currentUser } = useAuth();
  const { success } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<JournalArticle | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [authorName, setAuthorName] = useState('Sujal');
  const [categoryTags, setCategoryTags] = useState('Folk Art, Craftsmanship');
  const [taggedProductIds, setTaggedProductIds] = useState<string[]>([]);
  const [status, setStatus] = useState<'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED'>('PUBLISHED');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  const canEdit = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CATALOG_MGR';

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setBody('');
    setAuthorName(currentUser.name);
    setCategoryTags('Jharkhand Heritage, Streetwear');
    setTaggedProductIds(['prod_1']);
    setStatus('PUBLISHED');
    setMetaTitle('');
    setMetaDescription('');
    setShowModal(true);
  };

  const handleOpenEdit = (art: JournalArticle) => {
    setEditingArticle(art);
    setTitle(art.title);
    setSlug(art.slug);
    setExcerpt(art.excerpt);
    setBody(art.body);
    setAuthorName(art.authorName);
    setCategoryTags(art.categoryTags.join(', '));
    setTaggedProductIds(art.taggedProductIds);
    setStatus(art.status);
    setMetaTitle(art.metaTitle);
    setMetaDescription(art.metaDescription);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const words = body.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.round(words / 200));

    const payload = {
      title,
      slug: slug || generateSlug(title),
      excerpt,
      body,
      coverImage: '/images/products/sohrai-spirit.jpg',
      authorName,
      readingTimeMinutes: readingTime,
      categoryTags: categoryTags.split(',').map((t) => t.trim()).filter(Boolean),
      taggedProductIds,
      status,
      publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : undefined,
      metaTitle: metaTitle || `${title} — FITTEE Journal`,
      metaDescription: metaDescription || excerpt,
    };

    if (editingArticle) {
      updateJournalArticle(editingArticle.id, payload);
      success('Article Updated', `Saved "${title}"`);
    } else {
      addJournalArticle(payload);
      success('Article Drafted', `Created article "${title}"`);
    }
    setShowModal(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E7E5DF] dark:border-[#2A2C27]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold text-[#161714] dark:text-[#F2F1EC] tracking-tight">
                Journal CMS
              </h1>
              <span className="text-[12px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#F0EFEA] text-[#6B6A63]">
                {journalArticles.length} Stories
              </span>
            </div>
            <p className="text-[13px] text-[#6B6A63] dark:text-[#9A9A92] mt-0.5">
              Publish cultural narratives, artisan spotlights, and connect shoppable tagged products.
            </p>
          </div>

          {canEdit && (
            <Button variant="primary" size="md" onClick={handleOpenCreate} icon={<Plus className="w-4 h-4 stroke-[2.5]" />}>
              Write Story
            </Button>
          )}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {journalArticles.map((art) => (
            <div
              key={art.id}
              className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-semibold text-[#8C8B83] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{art.readingTimeMinutes} min read</span>
                  </span>
                  <StatusBadge status={art.status} />
                </div>

                <h3 className="font-bold text-[16px] text-[#161714] dark:text-[#F2F1EC] leading-snug">
                  {art.title}
                </h3>
                <p className="text-[12.5px] text-[#6B6A63] dark:text-[#9A9A92] mt-2 line-clamp-2 leading-relaxed">
                  {art.excerpt}
                </p>

                {/* Category Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {art.categoryTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2 py-0.5 rounded bg-[#F5F4EF] text-[#161714] border border-[#E7E5DF]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Shoppable Tagged Products (Brief Module 3 requirement) */}
                {art.taggedProductIds.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-[#F5F4EF] flex items-center gap-2">
                    <Shirt className="w-3.5 h-3.5 text-[#B87A22]" />
                    <span className="text-[11.5px] text-[#8C8B83]">
                      Shoppable Products:{' '}
                      <strong className="text-[#161714]">
                        {art.taggedProductIds
                          .map((pid) => products.find((p) => p.id === pid)?.title || pid)
                          .join(', ')}
                      </strong>
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#E7E5DF] dark:border-[#2A2C27] flex items-center justify-between text-[12px] text-[#8C8B83]">
                <span>By {art.authorName}</span>
                {canEdit && (
                  <Button variant="outline" size="sm" onClick={() => handleOpenEdit(art)} icon={<Edit className="w-3.5 h-3.5" />}>
                    Edit Story
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-[#161815] rounded-2xl border p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-[16px] text-[#161714]">
                {editingArticle ? 'Edit Journal Story' : 'Draft Journal Story'}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Article Headline *"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!editingArticle) setSlug(generateSlug(e.target.value));
                }}
                placeholder="e.g. The Living Mud Walls of Hazaribagh..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="URL Slug"
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                />

                <Select
                  label="Publishing Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  options={[
                    { value: 'PUBLISHED', label: 'Published (Live)' },
                    { value: 'DRAFT', label: 'Draft' },
                    { value: 'SCHEDULED', label: 'Scheduled' },
                    { value: 'ARCHIVED', label: 'Archived' },
                  ]}
                />
              </div>

              <Textarea
                label="Story Summary Excerpt *"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
              />

              <Textarea
                label="Article Body Content (Markdown/Rich Text) *"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                placeholder="Write the cultural story narrative..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Author Name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                />

                <Input
                  label="Category Tags (comma-separated)"
                  value={categoryTags}
                  onChange={(e) => setCategoryTags(e.target.value)}
                />
              </div>

              {/* Shoppable Products Multi-Select */}
              <div>
                <label className="block text-[12px] font-semibold text-[#161714] mb-1.5">
                  Link Shoppable Products (renders under article)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg bg-[#FAFAF7]">
                  {products.map((p) => {
                    const isSelected = taggedProductIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setTaggedProductIds((prev) =>
                            prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev, p.id]
                          );
                        }}
                        className={`p-2 rounded text-left text-xs border transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#B87A22]/10 border-[#B87A22] font-bold text-[#B87A22] dark:text-[#E5A93C]'
                            : 'bg-white dark:bg-[#161815] border-[#E7E5DF] dark:border-[#2A2C27] text-[#161714] dark:text-[#F2F1EC] hover:border-[#B87A22]/50'
                        }`}
                      >
                        <span className="truncate">{p.title}</span>
                        {isSelected && <span className="text-xs">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2.5">
                <Button variant="outline" size="md" type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit">
                  Save Story
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
