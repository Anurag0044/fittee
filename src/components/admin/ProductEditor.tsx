"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  Code,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select, Switch } from '@/components/ui/FormElements';
import { SerpPreview } from '@/components/ui/SerpPreview';
import { useStore } from '@/lib/storeContext';
import { useToast } from '@/components/ui/Toast';
import { generateSlug, generateSKU, calculateDiscount, formatINR } from '@/lib/utils';
import { Product, ProductVariant, ProductImageItem, FitType, ProductStatus, ProductBadge } from '@/lib/types';

interface ProductEditorProps {
  initialProduct?: Product;
  isNew?: boolean;
}

const AVAILABLE_SIZES: ('S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL')[] = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

export function ProductEditor({ initialProduct, isNew = false }: ProductEditorProps) {
  const router = useRouter();
  const { addProduct, updateProduct, categories } = useStore();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'basics' | 'pricing' | 'story' | 'matrix' | 'media' | 'seo'>('basics');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Form State
  const [title, setTitle] = useState(initialProduct?.title || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || categories[0]?.id || '');
  const [fitType, setFitType] = useState<FitType>(initialProduct?.fitType || 'OVERSIZED_FIT');
  const [badge, setBadge] = useState<ProductBadge>(initialProduct?.badge || null);
  const [status, setStatus] = useState<ProductStatus>(initialProduct?.status || 'ACTIVE');

  // Pricing
  const [sellingPrice, setSellingPrice] = useState<number>(initialProduct?.sellingPrice || 749);
  const [originalMrp, setOriginalMrp] = useState<number>(initialProduct?.originalMrp || 1499);
  const [hsnCode, setHsnCode] = useState(initialProduct?.hsnCode || '61091000');
  const [gstRate, setGstRate] = useState<number>(initialProduct?.gstRate || 5);

  // Story & Fabric
  const [artworkStory, setArtworkStory] = useState(
    initialProduct?.artworkStory ||
      'Inspired by the ancestral Sohrai folk murals of Jharkhand, featuring stags, sacred trees, and natural ochre motifs.'
  );
  const [fabricDetails, setFabricDetails] = useState(
    initialProduct?.fabricDetails ||
      '240 GSM 100% Combed Cotton, Pre-shrunk, Bio-washed with soft silicone finish.'
  );

  // Variants Matrix (Colorways & Sizes)
  const [colorways, setColorways] = useState<{ name: string; hex: string }[]>(() => {
    if (initialProduct?.variants?.length) {
      const uniqueColors = new Map<string, string>();
      initialProduct.variants.forEach((v) => uniqueColors.set(v.colorName, v.colorHex));
      return Array.from(uniqueColors.entries()).map(([name, hex]) => ({ name, hex }));
    }
    return [
      { name: 'Natural Bone', hex: '#E8DFC8' },
      { name: 'Burnt Clay', hex: '#8D4E13' },
    ];
  });

  const [variants, setVariants] = useState<ProductVariant[]>(() => {
    if (initialProduct?.variants?.length) return initialProduct.variants;
    const defaults: ProductVariant[] = [];
    ['Natural Bone', 'Burnt Clay'].forEach((cName, cIdx) => {
      const hex = cName === 'Natural Bone' ? '#E8DFC8' : '#8D4E13';
      AVAILABLE_SIZES.forEach((sz, szIdx) => {
        defaults.push({
          id: `var_init_${cIdx}_${szIdx}_${sz}`,
          sku: `FIT-${cName.toUpperCase().slice(0, 4)}-${sz}`,
          colorName: cName,
          colorHex: hex,
          size: sz,
          stock: 15,
          lowStockThreshold: 5,
        });
      });
    });
    return defaults;
  });

  // Media
  const [images, setImages] = useState<ProductImageItem[]>(() => {
    if (initialProduct?.images?.length) return initialProduct.images;
    return [
      {
        id: 'img_1',
        url: '/images/products/sohrai-spirit.jpg',
        altText: 'Hero angle front view on model in natural sunlight',
        isHero: true,
        colorwayName: 'Natural Bone',
      },
    ];
  });

  // SEO
  const [metaTitle, setMetaTitle] = useState(
    initialProduct?.metaTitle || `${title || 'Tribal Streetwear Tee'} — FITTEE Modern Wear`
  );
  const [metaDescription, setMetaDescription] = useState(
    initialProduct?.metaDescription ||
      'Handcrafted Jharkhand folk art printed on 240 GSM organic cotton streetwear tees. Wear your culture with pride.'
  );
  const [targetKeywords, setTargetKeywords] = useState(initialProduct?.targetKeywords || 'sohrai tee, tribal graphic t-shirt');

  // Compute discount
  const computedDiscount = calculateDiscount(sellingPrice, originalMrp);

  // Auto-generate slug on title change if new
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setHasUnsavedChanges(true);
    if (isNew) {
      setSlug(generateSlug(val));
      setMetaTitle(`${val} — FITTEE Modern Wear`);
    }
  };

  // Add new colorway
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#2A5C2E');

  const handleAddColorway = () => {
    if (!newColorName.trim()) return;
    const cleanName = newColorName.trim();
    if (colorways.some((c) => c.name.toLowerCase() === cleanName.toLowerCase())) {
      error('Duplicate Color', 'A colorway with this name already exists.');
      return;
    }

    const updatedColorways = [...colorways, { name: cleanName, hex: newColorHex }];
    setColorways(updatedColorways);

    // Create variant rows for each size
    const newVariants: ProductVariant[] = AVAILABLE_SIZES.map((sz) => ({
      id: `var_${Date.now()}_${cleanName}_${sz}`,
      sku: generateSKU(slug || 'TEE', cleanName, sz),
      colorName: cleanName,
      colorHex: newColorHex,
      size: sz,
      stock: 10,
      lowStockThreshold: 5,
    }));

    setVariants((prev) => [...prev, ...newVariants]);
    setNewColorName('');
    setHasUnsavedChanges(true);
    success('Colorway Added', `Generated variants for ${cleanName}`);
  };

  // Update variant stock in matrix
  const handleVariantStockChange = (colorName: string, size: string, newStock: number) => {
    const colorHex = colorways.find((c) => c.name === colorName)?.hex || '#000000';
    setVariants((prev) => {
      const exists = prev.some((v) => v.colorName === colorName && v.size === size);
      if (exists) {
        return prev.map((v) =>
          v.colorName === colorName && v.size === size
            ? { ...v, stock: Math.max(0, newStock) }
            : v
        );
      } else {
        return [
          ...prev,
          {
            id: `var_cell_${colorName.toLowerCase().replace(/\s+/g, '_')}_${size}`,
            sku: generateSKU(slug || 'TEE', colorName, size),
            colorName,
            colorHex,
            size: size as any,
            stock: Math.max(0, newStock),
            lowStockThreshold: 5,
          },
        ];
      }
    });
    setHasUnsavedChanges(true);
  };

  // Add new Image (Simulate Cloudinary direct upload)
  const handleAddImage = (url: string) => {
    const newImg: ProductImageItem = {
      id: `img_${Date.now()}`,
      url,
      altText: `${title} view`,
      isHero: images.length === 0,
      colorwayName: colorways[0]?.name || 'all',
    };
    setImages((prev) => [...prev, newImg]);
    setHasUnsavedChanges(true);
    success('Image Added', 'Asset linked to product gallery');
  };

  // Save handler
  const handleSave = () => {
    if (!title.trim()) {
      error('Validation Failed', 'Product title is required');
      setActiveTab('basics');
      return;
    }
    if (sellingPrice > originalMrp) {
      error('Pricing Error', 'Selling price cannot exceed Original MRP');
      setActiveTab('pricing');
      return;
    }
    const hasHero = images.some((img) => img.isHero);
    if (!hasHero && images.length > 0) {
      images[0].isHero = true;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId);

    const productPayload = {
      title,
      slug: slug || generateSlug(title),
      categoryId,
      categoryName: selectedCategory ? selectedCategory.name : 'Tribal Art Murals',
      fitType,
      badge,
      sellingPrice,
      originalMrp,
      status,
      artworkStory,
      fabricDetails,
      hsnCode,
      gstRate,
      variants,
      images,
      metaTitle,
      metaDescription,
      targetKeywords,
    };

    if (isNew) {
      addProduct(productPayload);
      success('Product Published', `"${title}" created in catalog`);
      router.push('/products');
    } else if (initialProduct) {
      updateProduct(initialProduct.id, productPayload);
      success('Product Saved', `Changes saved to "${title}"`);
      setHasUnsavedChanges(false);
    }
  };

  const totalStock = variants.reduce((acc, v) => acc + v.stock, 0);

  // Auto JSON-LD Schema preview
  const jsonLdPreview = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title || 'Product Name',
    image: images.map((i) => i.url),
    description: metaDescription,
    sku: variants[0]?.sku || 'FIT-SKU',
    brand: { '@type': 'Brand', name: 'FITTEE' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: sellingPrice,
      availability: totalStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Header Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E7E5DF] dark:border-[#2A2C27]">
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="p-2 rounded-lg hover:bg-[#F0EFEA] dark:hover:bg-[#20221E] text-[#6B6A63] hover:text-[#161714] transition-colors"
            title="Back to Catalog"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-bold text-[#161714] dark:text-[#F2F1EC] tracking-tight">
                {isNew ? 'Create New Product' : `Edit: ${initialProduct?.title}`}
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#B87A22]/10 text-[#B87A22]">
                {fitType === 'OVERSIZED_FIT' ? 'Oversized' : 'Regular Fit'}
              </span>
            </div>
            <p className="text-[12.5px] text-[#6B6A63] dark:text-[#9A9A92]">
              SKU Matrix, Colorways, Cloudinary Media & SEO JSON-LD
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            onClick={() => router.push('/products')}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            icon={<Save className="w-4 h-4" />}
          >
            {isNew ? 'Publish Product' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E7E5DF] dark:border-[#2A2C27] overflow-x-auto">
        {[
          { key: 'basics', label: '1. Basics' },
          { key: 'pricing', label: '2. Pricing & GST' },
          { key: 'story', label: '3. Story & Fabric' },
          { key: 'matrix', label: `4. Variants Matrix (${variants.length} SKUs)` },
          { key: 'media', label: `5. Gallery (${images.length})` },
          { key: 'seo', label: '6. SEO & Schema' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px whitespace-nowrap cursor-pointer ${
              activeTab === tab.key
                ? 'border-[#B87A22] text-[#B87A22] font-bold'
                : 'border-transparent text-[#6B6A63] hover:text-[#161714] dark:hover:text-[#F2F1EC]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Main Form Canvas & Preview Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form Content (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* TAB 1: BASICS */}
          {activeTab === 'basics' && (
            <div className="p-6 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] space-y-5">
              <h3 className="text-[15px] font-bold text-[#161714] dark:text-[#F2F1EC]">Basic Garment Properties</h3>

              <Input
                label="Product Title *"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Sohrai Spirit Graphic Tee"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="URL Slug *"
                  value={slug}
                  onChange={(e) => {
                    setSlug(generateSlug(e.target.value));
                    setHasUnsavedChanges(true);
                  }}
                  hint="Public URL identifier: fittee.in/products/{slug}"
                />

                <Select
                  label="Category *"
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <Select
                  label="Silhouette Fit Type *"
                  value={fitType}
                  onChange={(e) => {
                    setFitType(e.target.value as FitType);
                    setHasUnsavedChanges(true);
                  }}
                  options={[
                    { value: 'OVERSIZED_FIT', label: 'Heavyweight Oversized Fit' },
                    { value: 'REGULAR_FIT', label: 'Classic Regular Fit' },
                  ]}
                />

                <Select
                  label="Storefront Badge"
                  value={badge || ''}
                  onChange={(e) => {
                    setBadge((e.target.value as ProductBadge) || null);
                    setHasUnsavedChanges(true);
                  }}
                  options={[
                    { value: '', label: 'None' },
                    { value: 'NEW', label: 'New' },
                    { value: 'BESTSELLER', label: 'Bestseller' },
                    { value: 'FESTIVE_SPECIAL', label: 'Festive Special' },
                  ]}
                />

                <Select
                  label="Catalog Status"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value as ProductStatus);
                    setHasUnsavedChanges(true);
                  }}
                  options={[
                    { value: 'ACTIVE', label: 'Active (Visible on Site)' },
                    { value: 'DRAFT', label: 'Draft (Hidden)' },
                    { value: 'ARCHIVED', label: 'Archived' },
                  ]}
                />
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & GST */}
          {activeTab === 'pricing' && (
            <div className="p-6 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] space-y-5">
              <h3 className="text-[15px] font-bold text-[#161714] dark:text-[#F2F1EC]">Pricing & Tax Geometry</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Selling Price (₹ INR) *"
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => {
                    setSellingPrice(Number(e.target.value));
                    setHasUnsavedChanges(true);
                  }}
                  hint="Customer checkout price"
                />

                <Input
                  label="Original MRP (₹ INR) *"
                  type="number"
                  value={originalMrp}
                  onChange={(e) => {
                    setOriginalMrp(Number(e.target.value));
                    setHasUnsavedChanges(true);
                  }}
                  hint="Strikethrough reference price"
                />
              </div>

              {/* Computed Discount Badge Notice */}
              <div className="p-4 rounded-lg bg-[#FAFAF7] dark:bg-[#20221E] border border-[#E7E5DF] dark:border-[#2A2C27] flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-semibold text-[#161714] dark:text-[#F2F1EC]">
                    Calculated Discount Badge (Auto-Computed)
                  </p>
                  <p className="text-[11.5px] text-[#6B6A63] dark:text-[#9A9A92]">
                    Formula: Math.round(((MRP - Selling) / MRP) * 100)
                  </p>
                </div>
                <span className="text-[14px] font-extrabold px-3 py-1 rounded bg-[#FDF2E7] text-[#9C380A] border border-[#EBB28E]">
                  {computedDiscount}% OFF
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Input
                  label="HSN Code"
                  value={hsnCode}
                  onChange={(e) => {
                    setHsnCode(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  hint="61091000 for cotton t-shirts"
                />

                <Select
                  label="GST Rate"
                  value={gstRate}
                  onChange={(e) => {
                    setGstRate(Number(e.target.value));
                    setHasUnsavedChanges(true);
                  }}
                  options={[
                    { value: 5, label: '5% GST (Apparel under ₹1,000)' },
                    { value: 12, label: '12% GST (Apparel above ₹1,000)' },
                  ]}
                />
              </div>
            </div>
          )}

          {/* TAB 3: STORY & FABRIC */}
          {activeTab === 'story' && (
            <div className="p-6 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] space-y-5">
              <h3 className="text-[15px] font-bold text-[#161714] dark:text-[#F2F1EC]">Cultural Heritage & Fabric Details</h3>

              <Textarea
                label="Artwork & Cultural Folklore Story *"
                value={artworkStory}
                onChange={(e) => {
                  setArtworkStory(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                rows={4}
                hint="Describe the regional narrative behind the artwork (Sohrai, Khovar, Karam, etc.)."
              />

              <Textarea
                label="Fabric Specifications & Composition *"
                value={fabricDetails}
                onChange={(e) => {
                  setFabricDetails(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                rows={3}
                hint="e.g. 240 GSM 100% Combed Cotton, Pre-shrunk, Bio-washed."
              />
            </div>
          )}

          {/* TAB 4: VARIANTS & INVENTORY MATRIX */}
          {activeTab === 'matrix' && (
            <div className="p-6 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-bold text-[#161714] dark:text-[#F2F1EC]">
                    Variant & Stock Matrix
                  </h3>
                  <p className="text-[12px] text-[#6B6A63] dark:text-[#9A9A92]">
                    Colorways (rows) × Sizes (columns). Auto-generates unique SKUs.
                  </p>
                </div>
                <span className="text-[12px] font-mono font-bold px-2.5 py-1 rounded-md bg-[#B87A22]/10 text-[#B87A22]">
                  Total Stock: {totalStock} units
                </span>
              </div>

              {/* Add New Colorway Row */}
              <div className="p-3.5 rounded-lg bg-[#FAFAF7] dark:bg-[#20221E] border border-[#E7E5DF] dark:border-[#2A2C27] flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="New colorway (e.g. Forest Moss)"
                  className="px-3 py-1.5 rounded-md border border-[#E7E5DF] text-[12.5px] bg-white dark:bg-[#161815] text-[#161714] dark:text-[#F2F1EC]"
                />
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-7 h-7 rounded border-none cursor-pointer"
                  />
                  <span className="font-mono text-[11px] text-[#8C8B83]">{newColorHex}</span>
                </div>
                <Button variant="secondary" size="sm" onClick={handleAddColorway} icon={<Plus className="w-3.5 h-3.5" />}>
                  Add Colorway
                </Button>
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto border border-[#E7E5DF] dark:border-[#2A2C27] rounded-lg">
                <table className="w-full text-left text-[12.5px]">
                  <thead className="bg-[#FAFAF7] dark:bg-[#111310] border-b border-[#E7E5DF] text-[11px] font-semibold uppercase text-[#8C8B83]">
                    <tr>
                      <th className="py-2.5 px-3">Colorway</th>
                      {AVAILABLE_SIZES.map((sz) => (
                        <th key={sz} className="py-2.5 px-2 text-center w-20">
                          {sz}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E5DF] dark:divide-[#20221E]">
                    {colorways.map((c) => (
                      <tr key={c.name} className="hover:bg-[#FAFAF7]/50">
                        <td className="py-2.5 px-3 font-semibold whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/20"
                              style={{ backgroundColor: c.hex }}
                            />
                            <span>{c.name}</span>
                          </div>
                        </td>

                        {AVAILABLE_SIZES.map((sz) => {
                          const variant = variants.find((v) => v.colorName === c.name && v.size === sz);
                          const stock = variant?.stock ?? 0;
                          const isZero = stock === 0;

                          return (
                            <td key={sz} className="py-2 px-2 text-center">
                              <input
                                type="number"
                                min="0"
                                value={stock}
                                onChange={(e) => handleVariantStockChange(c.name, sz, Number(e.target.value))}
                                className={`w-16 px-1.5 py-1 text-center rounded border font-mono text-[12px] font-bold focus:outline-none focus:ring-1 focus:ring-[#B87A22] ${
                                  isZero
                                    ? 'bg-[#C0392B]/10 text-[#C0392B] border-[#C0392B]/40'
                                    : stock <= 5
                                    ? 'bg-[#B7791F]/10 text-[#B7791F] border-[#B7791F]/40'
                                    : 'bg-white dark:bg-[#161815] text-[#161714] dark:text-[#F2F1EC] border-[#E7E5DF]'
                                }`}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: MEDIA & GALLERY */}
          {activeTab === 'media' && (
            <div className="p-6 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-bold text-[#161714] dark:text-[#F2F1EC]">
                    Cloudinary Media Gallery
                  </h3>
                  <p className="text-[12px] text-[#6B6A63] dark:text-[#9A9A92]">
                    Link images to specific colourways. Alt text is mandatory for SEO and accessibility.
                  </p>
                </div>
              </div>

              {/* Upload Drop Zone Simulation */}
              <div className="p-6 rounded-xl border-2 border-dashed border-[#DCDAD2] dark:border-[#30332C] hover:border-[#B87A22] text-center transition-colors">
                <ImageIcon className="w-8 h-8 text-[#8C8B83] mx-auto mb-2" />
                <p className="text-[13px] font-semibold text-[#161714] dark:text-[#F2F1EC]">
                  Drag & Drop or Choose Image
                </p>
                <p className="text-[11.5px] text-[#8C8B83] mt-0.5">
                  WebP, JPEG, PNG up to 10MB. Uploads directly to Cloudinary.
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddImage('/images/products/tribal-horizon.jpg')}
                  >
                    + Add Tribal Horizon Photo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddImage('/images/products/rising-roots.jpg')}
                  >
                    + Add Rising Roots Photo
                  </Button>
                </div>
              </div>

              {/* Uploaded Items List */}
              <div className="space-y-3">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="p-3.5 rounded-xl border border-[#E7E5DF] dark:border-[#2A2C27] flex items-center gap-4 bg-[#FAFAF7] dark:bg-[#20221E]"
                  >
                    <img
                      src={img.url}
                      alt={img.altText}
                      className="w-16 h-20 object-cover rounded-lg border border-[#E7E5DF] shrink-0"
                    />

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#B87A22]">
                          {img.isHero ? 'Hero Thumbnail' : `Gallery Image #${idx + 1}`}
                        </span>

                        <select
                          value={img.colorwayName || 'all'}
                          onChange={(e) => {
                            setImages((prev) =>
                              prev.map((item) =>
                                item.id === img.id ? { ...item, colorwayName: e.target.value } : item
                              )
                            );
                            setHasUnsavedChanges(true);
                          }}
                          className="px-2 py-1 rounded text-[11px] border border-[#E7E5DF] dark:border-[#2A2C27] bg-white dark:bg-[#161815] text-[#161714] dark:text-[#F2F1EC]"
                        >
                          <option value="all">Linked to: All Colours</option>
                          {colorways.map((c) => (
                            <option key={c.name} value={c.name}>
                              Linked to: {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Input
                        value={img.altText}
                        onChange={(e) => {
                          setImages((prev) =>
                            prev.map((item) => (item.id === img.id ? { ...item, altText: e.target.value } : item))
                          );
                          setHasUnsavedChanges(true);
                        }}
                        placeholder="Mandatory alt text for screen readers & SEO..."
                        className="py-1 text-[12px]"
                      />
                    </div>

                    <div className="flex flex-col gap-1 shrink-0">
                      {!img.isHero && (
                        <button
                          type="button"
                          onClick={() => {
                            setImages((prev) => prev.map((item) => ({ ...item, isHero: item.id === img.id })));
                            setHasUnsavedChanges(true);
                          }}
                          className="text-[11px] font-semibold text-[#B87A22] hover:underline"
                        >
                          Set as Hero
                        </button>
                      )}
                      {images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setImages((prev) => prev.filter((item) => item.id !== img.id));
                            setHasUnsavedChanges(true);
                          }}
                          className="text-[11px] text-[#C0392B] hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SEO & SCHEMA */}
          {activeTab === 'seo' && (
            <div className="p-6 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] space-y-6">
              <h3 className="text-[15px] font-bold text-[#161714] dark:text-[#F2F1EC]">SEO & Rich Structured Snippets</h3>

              <Input
                label="Primary Target Keywords"
                value={targetKeywords}
                onChange={(e) => {
                  setTargetKeywords(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                hint="Comma-separated keywords"
              />

              <Input
                label="Meta Title (60 Characters)"
                value={metaTitle}
                onChange={(e) => {
                  setMetaTitle(e.target.value);
                  setHasUnsavedChanges(true);
                }}
              />

              <Textarea
                label="Meta Description (160 Characters)"
                value={metaDescription}
                onChange={(e) => {
                  setMetaDescription(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                rows={3}
              />

              {/* Live SERP Preview */}
              <SerpPreview title={metaTitle} description={metaDescription} urlPath={`/products/${slug || 'product'}`} />

              {/* JSON-LD Schema Code Preview */}
              <div>
                <p className="text-[12px] font-semibold text-[#161714] dark:text-[#F2F1EC] mb-1.5 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-[#B87A22]" />
                  <span>Auto-Generated Product JSON-LD Schema</span>
                </p>
                <pre className="p-3.5 rounded-lg bg-[#161714] text-[#F2F1EC] font-mono text-[11px] overflow-x-auto border border-[#2A2C27]">
                  {JSON.stringify(jsonLdPreview, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Preview Rail */}
        <div className="space-y-5">
          <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] sticky top-24 space-y-4">
            <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#8C8B83]">Storefront Preview</h4>

            {/* Product Card Miniature */}
            <div className="rounded-xl overflow-hidden border border-[#E7E5DF] dark:border-[#2A2C27] bg-[#FAF7F2] dark:bg-[#111310]">
              <div className="relative aspect-[4/5] bg-[#E2D8C7] overflow-hidden">
                <img
                  src={images.find((i) => i.isHero)?.url || images[0]?.url || '/images/products/sohrai-spirit.jpg'}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                {badge && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E5A93C] text-[#161714]">
                    {badge}
                  </span>
                )}
              </div>

              <div className="p-3">
                <p className="text-[10px] font-semibold text-[#8C8B83] uppercase tracking-wider">
                  {fitType === 'OVERSIZED_FIT' ? 'Oversized Fit Tee' : 'Regular Fit Tee'}
                </p>
                <h5 className="font-bold text-[14px] text-[#161714] dark:text-[#F2F1EC] truncate mt-0.5">
                  {title || 'Untitled Product'}
                </h5>

                <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-[#E7E5DF] dark:border-[#2A2C27]">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-[15px] text-[#161714] dark:text-[#F2F1EC]">
                      {formatINR(sellingPrice)}
                    </span>
                    <span className="line-through text-[11px] text-[#8C8B83]">
                      {formatINR(originalMrp)}
                    </span>
                  </div>
                  {computedDiscount > 0 && (
                    <span className="text-[10px] font-bold text-[#9C380A] px-1.5 py-0.5 rounded bg-[#FDF2E7]">
                      {computedDiscount}% OFF
                    </span>
                  )}
                </div>

                {/* Color swatches */}
                <div className="flex items-center gap-1.5 mt-2.5">
                  {colorways.map((c) => (
                    <span
                      key={c.name}
                      className="w-3 h-3 rounded-full border border-black/20"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Live Inventory Summary */}
            <div className="pt-2 border-t border-[#E7E5DF] dark:border-[#2A2C27] space-y-1.5 text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#8C8B83]">Total Stock Units:</span>
                <span className="font-mono font-bold">{totalStock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C8B83]">Active SKUs:</span>
                <span className="font-mono">{variants.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C8B83]">HSN & GST:</span>
                <span className="font-mono">{hsnCode} ({gstRate}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
