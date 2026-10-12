"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ShoppingCart } from "lucide-react";
import { TribalTreeWatermark } from "./TribalTreeWatermark";

interface Product {
  id: number;
  name: string;
  fit: "Regular Fit Tee" | "Oversized Fit Tee";
  category: "regular" | "oversized" | "new";
  price: number;
  badge?: "New" | "Bestseller" | null;
  image: string;
  colors: string[];
  objectPosition?: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Sohrai Spirit",
    fit: "Regular Fit Tee",
    category: "regular",
    price: 699,
    badge: "New",
    image: "/images/products/sohrai-spirit.jpg",
    colors: ["#E8DFC8", "#7A4B2A", "#2C3A24", "#1C1917"],
    objectPosition: "object-top",
  },
  {
    id: 2,
    name: "Karma Lines",
    fit: "Oversized Fit Tee",
    category: "oversized",
    price: 749,
    badge: null,
    image: "/images/products/karma-lines.jpg",
    colors: ["#EAE0CE", "#944C32", "#462519", "#191512"],
    objectPosition: "object-[center_20%]",
  },
  {
    id: 3,
    name: "Rising Roots",
    fit: "Oversized Fit Tee",
    category: "oversized",
    price: 749,
    badge: null,
    image: "/images/products/rising-roots.jpg",
    colors: ["#D9CFBD", "#B07C38", "#573919", "#1E1B17"],
    objectPosition: "object-top",
  },
  {
    id: 4,
    name: "Forest Tales",
    fit: "Regular Fit Tee",
    category: "regular",
    price: 699,
    badge: null,
    image: "/images/products/forest-tales.jpg",
    colors: ["#EAE2D2", "#8A572D", "#2E3A24", "#161616"],
    objectPosition: "object-[center_18%]",
  },
  {
    id: 5,
    name: "Tribal Horizon",
    fit: "Oversized Fit Tee",
    category: "oversized",
    price: 749,
    badge: "Bestseller",
    image: "/images/products/tribal-horizon.jpg",
    colors: ["#DFD4C0", "#C28A32", "#1E3522", "#181816"],
    objectPosition: "object-top",
  },
  {
    id: 6,
    name: "Hazaribagh Earth",
    fit: "Regular Fit Tee",
    category: "regular",
    price: 799,
    badge: null,
    image: "/images/products/hazaribagh-earth.jpg?v=2",
    colors: ["#E5D9C4", "#8C4325", "#36432B", "#1A1816"],
    objectPosition: "object-[center_22%]",
  },
  {
    id: 7,
    name: "Sarna Bloom",
    fit: "Oversized Fit Tee",
    category: "oversized",
    price: 699,
    badge: "New",
    image: "/images/products/sarna-bloom.jpg?v=2",
    colors: ["#E9E0CB", "#9A3428", "#4E2D22", "#191513"],
    objectPosition: "object-[center_18%]",
  },
  {
    id: 8,
    name: "Karam Rhythm",
    fit: "Oversized Fit Tee",
    category: "oversized",
    price: 749,
    badge: null,
    image: "/images/products/karam-rhythm.jpg?v=2",
    colors: ["#DED3BE", "#4A5432", "#5A3C22", "#1B1916"],
    objectPosition: "object-[center_22%]",
  },
  {
    id: 9,
    name: "Palash Stories",
    fit: "Regular Fit Tee",
    category: "regular",
    price: 799,
    badge: null,
    image: "/images/products/palash-stories.jpg?v=2",
    colors: ["#EAE1CD", "#7D1F26", "#9B5F2A", "#1B1716"],
    objectPosition: "object-[center_18%]",
  },
  {
    id: 10,
    name: "Adivasi Roots",
    fit: "Oversized Fit Tee",
    category: "oversized",
    price: 749,
    badge: "Bestseller",
    image: "/images/products/adivasi-roots.jpg?v=2",
    colors: ["#E4D8C2", "#B57E2F", "#3F2D1E", "#161412"],
    objectPosition: "object-[center_20%]",
  },
];

type FilterType = "all" | "regular" | "oversized" | "new";

const FILTER_OPTIONS: { id: FilterType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "regular", label: "Regular Fit" },
  { id: "oversized", label: "Oversized Fit" },
  { id: "new", label: "New Arrivals" },
];

export function FeaturedCollection() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedColor, setSelectedColor] = useState<Record<number, number>>({});
  const [addedId, setAddedId] = useState<number | null>(null);

  const handleAddToCart = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1400);
  };

  const cycleFilter = (direction: "next" | "prev") => {
    const currentIndex = FILTER_OPTIONS.findIndex((f) => f.id === activeFilter);
    if (direction === "next") {
      const nextIndex = (currentIndex + 1) % FILTER_OPTIONS.length;
      setActiveFilter(FILTER_OPTIONS[nextIndex].id);
    } else {
      const prevIndex = (currentIndex - 1 + FILTER_OPTIONS.length) % FILTER_OPTIONS.length;
      setActiveFilter(FILTER_OPTIONS[prevIndex].id);
    }
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "regular") return p.category === "regular";
    if (activeFilter === "oversized") return p.category === "oversized";
    if (activeFilter === "new") return p.badge === "New";
    return true;
  });

  return (
    <section
      id="shop"
      className="relative w-full bg-[#EAE2D5] py-14 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 overflow-hidden select-none isolate"
    >
      {/* ─── Hidden SVG Pattern Defs ──────────────────────────────────── */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          {/* Card cloth weave texture */}
          <pattern id="cardClothWeavePattern" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M 0 2 L 4 2 M 2 0 L 2 4" stroke="#C8BCAE" strokeWidth="0.5" opacity="0.35" />
          </pattern>

          {/* Paper grain texture */}
          <filter id="paperGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended" />
            <feComposite in="blended" in2="SourceGraphic" operator="in" />
          </filter>

          {/* ── Premium Botanical Leaf Textures ── */}
          {/* 1. Cellular Cuticle Matrix — Microscopic organic cell texture */}
          <pattern id="leafCellularPattern" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
            <path d="M 0 4 L 8 4 M 4 0 L 4 8" stroke="#3E7544" strokeWidth="0.45" strokeOpacity="0.38" />
            <circle cx="4" cy="4" r="0.75" fill="#EBD287" fillOpacity="0.25" />
            <circle cx="0" cy="0" r="0.5" fill="#589B5F" fillOpacity="0.2" />
            <circle cx="8" cy="8" r="0.5" fill="#589B5F" fillOpacity="0.2" />
          </pattern>

          {/* 2. Micro-Rib Venation Striations — Natural angled capillaries across the leaf blade */}
          <pattern id="leafMicroRibPattern" width="6" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(36)">
            <line x1="0" y1="0" x2="6" y2="4.5" stroke="#4C8C53" strokeWidth="0.55" strokeOpacity="0.42" />
            <line x1="0" y1="7" x2="6" y2="11.5" stroke="#4C8C53" strokeWidth="0.55" strokeOpacity="0.42" />
            <line x1="0" y1="3.5" x2="6" y2="8" stroke="#0E2812" strokeWidth="0.45" strokeOpacity="0.5" />
            <line x1="0" y1="10.5" x2="6" y2="15" stroke="#0E2812" strokeWidth="0.45" strokeOpacity="0.5" />
          </pattern>

          {/* 3. Royal Gold Mica Shimmer Stippling — Artisanal gold dusting reminiscent of Sohrai minerals */}
          <pattern id="leafGoldFleckPattern" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="5" r="0.8" fill="#F8E19B" fillOpacity="0.5" />
            <circle cx="15" cy="8" r="0.95" fill="#DCAB47" fillOpacity="0.55" />
            <circle cx="8" cy="16" r="0.65" fill="#FCE9B2" fillOpacity="0.42" />
            <circle cx="18" cy="18" r="0.75" fill="#C9943B" fillOpacity="0.48" />
            <path d="M 3 13 Q 5 15 4 17" stroke="#F8E19B" strokeWidth="0.35" strokeOpacity="0.4" fill="none" />
            <path d="M 12 3 Q 15 4 14 6" stroke="#DCAB47" strokeWidth="0.35" strokeOpacity="0.4" fill="none" />
          </pattern>

          {/* 4. Fine Longitudinal Fibers — Drooping willow/foliage striations */}
          <pattern id="leafFineFiberPattern" width="4" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
            <line x1="1" y1="0" x2="1" y2="20" stroke="#3D7543" strokeWidth="0.4" strokeOpacity="0.35" />
            <line x1="3" y1="0" x2="3" y2="20" stroke="#122A14" strokeWidth="0.35" strokeOpacity="0.4" />
          </pattern>

          {/* ── Upgraded High-Depth Botanical Gradients — Top-Right Cluster ── */}
          <linearGradient id="leafGrR1" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#08180A" />
            <stop offset="25%" stopColor="#122B14" />
            <stop offset="55%" stopColor="#1C4220" />
            <stop offset="85%" stopColor="#2A5C2E" />
            <stop offset="100%" stopColor="#0D1E0F" />
          </linearGradient>
          <linearGradient id="leafGrR2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1C0E" />
            <stop offset="35%" stopColor="#173619" />
            <stop offset="70%" stopColor="#2B562D" />
            <stop offset="100%" stopColor="#102512" />
          </linearGradient>
          <linearGradient id="leafGrR3" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#1E3A1C" />
            <stop offset="40%" stopColor="#325A2A" />
            <stop offset="75%" stopColor="#606F2B" />
            <stop offset="100%" stopColor="#8A671F" />
          </linearGradient>
          <linearGradient id="leafGrR4" x1="100%" y1="20%" x2="0%" y2="80%">
            <stop offset="0%" stopColor="#0E2310" />
            <stop offset="45%" stopColor="#1B3B1E" />
            <stop offset="80%" stopColor="#27522A" />
            <stop offset="100%" stopColor="#0A180C" />
          </linearGradient>

          {/* Specular Wax Sheens & Gold Spine Gradients (Right) */}
          <linearGradient id="leafSheenR" x1="85%" y1="0%" x2="15%" y2="100%">
            <stop offset="0%" stopColor="#87DB93" stopOpacity="0.5" />
            <stop offset="40%" stopColor="#5EBD6B" stopOpacity="0.28" />
            <stop offset="80%" stopColor="#2F6E37" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#122E15" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="leafGoldRachisR" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F9E2A0" />
            <stop offset="35%" stopColor="#DCAB47" />
            <stop offset="70%" stopColor="#F3D37F" />
            <stop offset="100%" stopColor="#8C5E1A" />
          </linearGradient>
          <linearGradient id="leafVeinGoldR" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EAD087" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#A8D28F" stopOpacity="0.58" />
            <stop offset="100%" stopColor="#3C7040" stopOpacity="0.32" />
          </linearGradient>

          {/* ── Upgraded High-Depth Botanical Gradients — Bottom-Left Cluster ── */}
          <linearGradient id="leafGr1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#071609" />
            <stop offset="30%" stopColor="#132D16" />
            <stop offset="65%" stopColor="#224A26" />
            <stop offset="90%" stopColor="#306435" />
            <stop offset="100%" stopColor="#112713" />
          </linearGradient>
          <linearGradient id="leafGr2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0B1C0E" />
            <stop offset="40%" stopColor="#18381C" />
            <stop offset="80%" stopColor="#2D5C30" />
            <stop offset="100%" stopColor="#122814" />
          </linearGradient>
          <linearGradient id="leafGr3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0F2412" />
            <stop offset="40%" stopColor="#254823" />
            <stop offset="75%" stopColor="#4D6228" />
            <stop offset="100%" stopColor="#7E651E" />
          </linearGradient>

          {/* Specular Wax Sheens & Gold Spine Gradients (Left) */}
          <linearGradient id="leafSheenL" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#153218" stopOpacity="0" />
            <stop offset="30%" stopColor="#3E7D46" stopOpacity="0.12" />
            <stop offset="70%" stopColor="#78CE83" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#A4ECAD" stopOpacity="0.52" />
          </linearGradient>
          <linearGradient id="leafGoldRachisL" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8C5E1A" />
            <stop offset="30%" stopColor="#DCAB47" />
            <stop offset="70%" stopColor="#F9E2A0" />
            <stop offset="100%" stopColor="#E6BA58" />
          </linearGradient>
          <linearGradient id="leafVeinGoldL" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4A824E" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#A5D18D" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#EBD287" stopOpacity="0.82" />
          </linearGradient>

          {/* ── Botanical Leaf & Earth Master Shading Gradients ── */}
          <linearGradient id="leafBladeLit" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1A0E" />
            <stop offset="25%" stopColor="#1B381F" />
            <stop offset="65%" stopColor="#2E5A33" />
            <stop offset="100%" stopColor="#437748" />
          </linearGradient>
          <linearGradient id="leafBladeShadow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#061008" />
            <stop offset="40%" stopColor="#0E2211" />
            <stop offset="80%" stopColor="#18361C" />
            <stop offset="100%" stopColor="#0A160C" />
          </linearGradient>
          <linearGradient id="leafMidribGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FAF0C5" />
            <stop offset="35%" stopColor="#DFBF6A" />
            <stop offset="70%" stopColor="#A4BE72" />
            <stop offset="100%" stopColor="#466E3A" />
          </linearGradient>
          <linearGradient id="leafVeinLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0D28E" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#96BC75" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#305E35" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="leafSheenGloss" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A6F0AE" stopOpacity="0.45" />
            <stop offset="40%" stopColor="#68BF72" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1C4020" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="sohraiSunOchre" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F5DF9E" stopOpacity="0.5" />
            <stop offset="30%" stopColor="#D9A842" stopOpacity="0.3" />
            <stop offset="65%" stopColor="#B37822" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#8A5515" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="earthMoundGrad" x1="30%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%" stopColor="#7E451E" />
            <stop offset="35%" stopColor="#5E3113" />
            <stop offset="70%" stopColor="#43210C" />
            <stop offset="100%" stopColor="#251206" />
          </linearGradient>
        </defs>
      </svg>

      {/* ─── 1. Base Warm Parchment Canvas ────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 130% 90% at 50% -5%, #F5EFE2 0%, #EAE0CA 40%, #E2D5BB 100%)" }}
      />

      {/* ─── 2. Paper / Handmade-Paper Noise Texture ─────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.07] mix-blend-overlay"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: "300px 300px" }}
      />

      {/* ─── 3. Top-Left Botanical Leaves Sprig (Lush Realistic Foliage) ─── */}
      {/* Pinned to top-left corner, pointing down & inward over the title */}
      <div className="absolute -top-3 -left-4 sm:-left-3 lg:-left-2 w-56 sm:w-72 lg:w-[380px] h-64 sm:h-84 lg:h-[430px] pointer-events-none z-[3]">
        <svg viewBox="0 0 380 430" fill="none" className="w-full h-full drop-shadow-[0_16px_30px_rgba(0,0,0,0.55)]">
          {/* Main Woody Branch Stem */}
          <path
            d="M -10 -10 C 35 35, 80 85, 130 175 C 150 215, 165 265, 175 320"
            stroke="#261A10"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M -10 -10 C 35 35, 80 85, 130 175"
            stroke="#4A3420"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Leaf 1: Top-most leaf (sweeping right along the top) */}
          <g>
            {/* Shadow Half */}
            <path d="M 65 65 C 105 32, 175 22, 235 50 C 180 65, 120 70, 65 65 Z" fill="url(#leafBladeShadow)" />
            {/* Lit Half */}
            <path d="M 65 65 C 115 65, 180 80, 235 50 C 180 40, 115 32, 65 65 Z" fill="url(#leafBladeLit)" />
            {/* Texture Overlays */}
            <path d="M 65 65 C 105 32, 175 22, 235 50 C 180 80, 120 75, 65 65 Z" fill="url(#leafMicroRibPattern)" opacity="0.35" />
            <path d="M 65 65 C 105 32, 175 22, 235 50 C 180 80, 120 75, 65 65 Z" fill="url(#leafCellularPattern)" opacity="0.3" />
            {/* Wax Sheen Highlight */}
            <path d="M 65 65 C 110 38, 175 28, 235 50 C 175 42, 115 45, 65 65 Z" fill="url(#leafSheenGloss)" opacity="0.65" />
            {/* Golden Midrib */}
            <path d="M 65 65 C 120 52, 180 48, 235 50" stroke="url(#leafMidribGold)" strokeWidth="1.4" strokeLinecap="round" />
            {/* Branching Veins */}
            <path d="M 110 56 C 130 44, 155 38, 180 40 M 145 52 C 165 42, 190 38, 210 42 M 105 58 C 125 68, 150 72, 175 68 M 140 54 C 160 64, 185 68, 205 62"
              stroke="url(#leafVeinLine)" strokeWidth="0.7" strokeLinecap="round" />
          </g>

          {/* Leaf 2: Outer-left drooping leaf (running down the left edge) */}
          <g>
            <path d="M 55 55 C 20 95, 5 155, 28 225 C 50 165, 68 110, 55 55 Z" fill="url(#leafBladeShadow)" />
            <path d="M 55 55 C 45 110, 48 165, 28 225 C 15 155, 30 95, 55 55 Z" fill="url(#leafBladeLit)" />
            <path d="M 55 55 C 20 95, 5 155, 28 225 C 50 165, 68 110, 55 55 Z" fill="url(#leafMicroRibPattern)" opacity="0.35" />
            <path d="M 55 55 C 38 105, 35 160, 28 225" stroke="url(#leafMidribGold)" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M 45 105 C 32 118, 22 135, 18 155 M 40 145 C 30 160, 24 178, 22 195"
              stroke="url(#leafVeinLine)" strokeWidth="0.65" strokeLinecap="round" />
          </g>

          {/* Leaf 3: Grand Hero Center Leaf (sweeping down-right towards the title) */}
          <g>
            {/* Shadow Half */}
            <path d="M 105 125 C 160 135, 240 185, 300 270 C 230 280, 155 230, 105 125 Z" fill="url(#leafBladeShadow)" />
            {/* Lit Half */}
            <path d="M 105 125 C 165 145, 245 200, 300 270 C 235 240, 160 175, 105 125 Z" fill="url(#leafBladeLit)" />
            {/* Textures */}
            <path d="M 105 125 C 160 135, 240 185, 300 270 C 230 280, 155 230, 105 125 Z" fill="url(#leafMicroRibPattern)" opacity="0.4" />
            <path d="M 105 125 C 160 135, 240 185, 300 270 C 230 280, 155 230, 105 125 Z" fill="url(#leafCellularPattern)" opacity="0.32" />
            {/* Specular Sheen */}
            <path d="M 105 125 C 160 140, 235 190, 300 270 C 240 220, 175 160, 105 125 Z" fill="url(#leafSheenGloss)" opacity="0.75" />
            {/* Crisp Rim Hairline */}
            <path d="M 105 125 C 160 135, 240 185, 300 270" stroke="#F5E4B2" strokeWidth="0.75" strokeOpacity="0.5" fill="none" />
            {/* Golden Midrib */}
            <path d="M 105 125 C 170 165, 235 215, 300 270" stroke="url(#leafMidribGold)" strokeWidth="1.6" strokeLinecap="round" />
            {/* Intricate Branching Veins */}
            <path d="M 140 148 C 170 140, 205 142, 235 152
                     M 175 174 C 210 170, 245 178, 275 195
                     M 215 205 C 245 208, 275 220, 292 238
                     M 135 154 C 150 175, 175 195, 195 210
                     M 170 182 C 190 205, 215 228, 238 245
                     M 210 215 C 230 240, 252 258, 275 268"
              stroke="url(#leafVeinLine)" strokeWidth="0.75" strokeLinecap="round" />
          </g>

          {/* Leaf 4: Lower drooping leaf (hanging downward) */}
          <g>
            <path d="M 125 165 C 115 215, 120 280, 155 340 C 178 285, 172 215, 125 165 Z" fill="url(#leafBladeShadow)" />
            <path d="M 125 165 C 145 215, 150 280, 155 340 C 130 285, 125 215, 125 165 Z" fill="url(#leafBladeLit)" />
            <path d="M 125 165 C 115 215, 120 280, 155 340 C 178 285, 172 215, 125 165 Z" fill="url(#leafMicroRibPattern)" opacity="0.35" />
            <path d="M 125 165 C 135 220, 142 280, 155 340" stroke="url(#leafMidribGold)" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M 132 210 C 122 230, 118 252, 120 275 M 138 260 C 130 280, 128 302, 134 322"
              stroke="url(#leafVeinLine)" strokeWidth="0.65" strokeLinecap="round" />
          </g>

          {/* Leaf 5: Terminal tip leaf */}
          <g>
            <path d="M 165 245 C 170 295, 195 335, 225 375 C 215 335, 195 285, 165 245 Z" fill="url(#leafBladeLit)" />
            <path d="M 165 245 C 170 295, 195 335, 225 375" stroke="url(#leafMidribGold)" strokeWidth="1.1" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* ─── 4. Bottom-Left Botanical Leaves & Raw Earth Mound ─────────── */}
      {/* Pinned to bottom-left corner with organic soil mound and curving leaves */}
      <div className="absolute -left-6 -bottom-6 sm:-left-4 sm:-bottom-4 w-56 sm:w-72 lg:w-[340px] h-56 sm:h-72 lg:h-[340px] pointer-events-none z-[3]">
        <svg viewBox="0 0 340 340" fill="none" className="w-full h-full drop-shadow-[0_-12px_24px_rgba(0,0,0,0.45)]">
          {/* Organic Red Earth & Rock Mound Texture */}
          <path
            d="M 0 230 C 45 225, 80 240, 110 270 C 135 295, 155 315, 170 340 L 0 340 Z"
            fill="url(#earthMoundGrad)"
          />
          <path
            d="M 0 230 C 45 225, 80 240, 110 270 C 135 295, 155 315, 170 340"
            stroke="#8F5022"
            strokeWidth="1.5"
            strokeOpacity="0.6"
            fill="none"
          />
          {/* Earth Texture Noise Stippling */}
          <path d="M 20 280 Q 40 282 60 280 M 35 305 Q 65 308 95 302 M 50 325 Q 85 328 120 322"
            stroke="#361B0A" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="3 5" fill="none" />

          {/* Woody Branch emerging from soil */}
          <path d="M 50 290 C 75 250, 110 190, 170 120" stroke="#261A10" strokeWidth="3.2" strokeLinecap="round" />

          {/* Leaf A: Large sweeping leaf arching up-right */}
          <g>
            <path d="M 75 260 C 110 220, 165 170, 220 130 C 170 170, 115 235, 75 260 Z" fill="url(#leafBladeShadow)" />
            <path d="M 75 260 C 120 235, 175 185, 220 130 C 160 160, 105 210, 75 260 Z" fill="url(#leafBladeLit)" />
            <path d="M 75 260 C 110 220, 165 170, 220 130 C 170 170, 115 235, 75 260 Z" fill="url(#leafMicroRibPattern)" opacity="0.38" />
            <path d="M 75 260 C 125 215, 175 170, 220 130" stroke="url(#leafMidribGold)" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M 110 220 C 130 205, 155 190, 178 180 M 145 190 C 165 178, 190 162, 210 152"
              stroke="url(#leafVeinLine)" strokeWidth="0.7" strokeLinecap="round" />
          </g>

          {/* Leaf B: Curving up-left */}
          <g>
            <path d="M 60 270 C 50 220, 65 175, 95 130 C 85 180, 75 230, 60 270 Z" fill="url(#leafBladeLit)" />
            <path d="M 60 270 C 65 220, 78 175, 95 130" stroke="url(#leafMidribGold)" strokeWidth="1.2" strokeLinecap="round" />
          </g>

          {/* Leaf C: Lower accent leaf */}
          <g>
            <path d="M 90 240 C 120 220, 150 200, 175 180 C 145 205, 115 225, 90 240 Z" fill="url(#leafBladeLit)" opacity="0.85" />
            <path d="M 90 240 C 120 220, 150 200, 175 180" stroke="url(#leafMidribGold)" strokeWidth="1" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* ─── 5. Top-Right Corner Sohrai Sun Mandala ────────────────────── */}
      {/* Pinned to top-right corner, in authentic warm etched ochre linework */}
      <div className="absolute -top-6 -right-6 sm:-top-4 sm:-right-4 w-60 h-60 sm:w-76 sm:h-76 lg:w-[380px] lg:h-[380px] pointer-events-none z-[1] opacity-75">
        <svg viewBox="0 0 360 360" className="w-full h-full" fill="none">
          {/* Soft atmospheric ochre aura glow */}
          <circle cx="200" cy="160" r="150" fill="url(#sohraiSunOchre)" />

          {/* 24 Radiating Spokes with Petal Tips */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            const rad = (angle * Math.PI) / 180;
            const innerR = 46;
            const outerR = 135;
            const x1 = 200 + innerR * Math.cos(rad);
            const y1 = 160 + innerR * Math.sin(rad);
            const x2 = 200 + outerR * Math.cos(rad);
            const y2 = 160 + outerR * Math.sin(rad);
            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#A86F28"
                  strokeWidth={i % 3 === 0 ? "1.8" : "0.95"}
                  strokeOpacity="0.6"
                />
                {/* Petal Tips on Primary Spokes */}
                {i % 2 === 0 && (
                  <circle cx={x2} cy={y2} r="3.5" fill="#C9943B" fillOpacity="0.75" />
                )}
              </g>
            );
          })}

          {/* Concentric Geometric Sacred Rings */}
          <circle cx="200" cy="160" r="142" stroke="#A86F28" strokeWidth="0.8" strokeOpacity="0.35" fill="none" />
          <circle cx="200" cy="160" r="126" stroke="#BD8232" strokeWidth="1.2" strokeOpacity="0.45" strokeDasharray="3 5" fill="none" />
          <circle cx="200" cy="160" r="74" stroke="#A86F28" strokeWidth="1" strokeOpacity="0.5" fill="none" />
          <circle cx="200" cy="160" r="46" stroke="#A86F28" strokeWidth="1.5" strokeOpacity="0.65" fill="none" />
          <circle cx="200" cy="160" r="32" stroke="#BD8232" strokeWidth="1.1" strokeOpacity="0.5" strokeDasharray="2 3" fill="none" />
          <circle cx="200" cy="160" r="18" stroke="#A86F28" strokeWidth="1.2" strokeOpacity="0.6" fill="none" />
          <circle cx="200" cy="160" r="6" fill="#C9943B" fillOpacity="0.6" />
        </svg>
      </div>


      {/* ─── 7. Central Background Sacred Kalpavriksha (Tree of Life) & Karam Dancers Watermark ── */}
      <TribalTreeWatermark className="absolute top-2 sm:top-4 lg:top-5 left-1/2 -translate-x-1/2 w-[520px] sm:w-[680px] lg:w-[840px] xl:w-[940px] h-[220px] sm:h-[270px] lg:h-[320px] z-[0]" opacity={0.34} />

      {/* ─── 8. Left Editorial Tagline & Lower Watermark Dancers ────────── */}
      <div className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 pointer-events-none z-[3] hidden lg:flex flex-col gap-0.5">
        <p className="font-serif italic text-[10px] tracking-wide text-[#7A5528]/50 leading-loose">
          People<br />Roots<br />Stories<br />On Fabric
        </p>
        <span className="block w-4 h-[1px] bg-[#7A5528]/35 mt-1 mb-2" />
        <div className="w-4 h-4 text-[#B87A22] opacity-60">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <circle cx="12" cy="12" r="6" strokeDasharray="2 3" />
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
          </svg>
        </div>
      </div>

      {/* Faint Tribal Dancers Watermark Lower-Left */}
      <div className="absolute bottom-8 left-2 sm:left-4 w-28 sm:w-36 h-28 pointer-events-none z-[1] opacity-[0.14]" style={{ color: "#8A5A24" }}>
        <svg viewBox="0 0 120 100" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
          <circle cx="40" cy="20" r="4" fill="currentColor" fillOpacity="0.4" />
          <path d="M 35 28 L 45 28 L 40 38 Z" fill="currentColor" fillOpacity="0.35" />
          <path d="M 40 38 L 34 48 L 46 48 Z" fill="currentColor" fillOpacity="0.35" />
          <line x1="37" y1="48" x2="32" y2="62" />
          <line x1="43" y1="48" x2="48" y2="62" />
          <line x1="40" y1="32" x2="20" y2="26" />
          <line x1="40" y1="32" x2="60" y2="26" />
        </svg>
      </div>

      {/* ─── 9. Delicate Gold Top Hairline (Hero → Section seam) ─────── */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C89B4C]/35 to-transparent pointer-events-none z-10" />


      <div className="relative z-10 max-w-[1220px] mx-auto">
        {/* Editorial Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-9"
        >
          {/* Typographic Title Block */}
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-[10.5px] font-semibold tracking-[0.22em] text-[#786957] uppercase">
                FEATURED COLLECTION
              </span>
              <span className="w-7 h-[1px] bg-[#B37E26] inline-block opacity-75" />
              <span className="text-[10.5px] font-semibold tracking-[0.22em] text-[#B37E26] uppercase">
                HANDPICKED
              </span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#1C1610] tracking-tight leading-[1.08]">
              Wear Your{" "}
              <span className="italic font-normal text-[#B87A22]">
                Heritage.
              </span>
            </h2>

            <p className="mt-1.5 text-[#635543] text-[13px] sm:text-sm font-normal max-w-md leading-relaxed">
              Contemporary silhouettes inspired by the tribal art and spirit of Jharkhand.
            </p>
          </div>

          {/* Minimal Apple-Style Segmented Navigation Pills on Cream */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center p-1 rounded-full bg-[#D8CEBD]/70 border border-[#C7BBA8]/80">
              {FILTER_OPTIONS.map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id)}
                    className={`relative px-3.5 sm:px-4 py-1.5 rounded-full text-[11.5px] sm:text-xs font-medium tracking-wide transition-colors duration-200 cursor-pointer select-none focus:outline-none ${isActive ? "text-[#FAF7F2]" : "text-[#4A3D2D] hover:text-[#1C1610]"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="creamActiveFilterTab"
                        className="absolute inset-0 rounded-full bg-[#1C1610] shadow-xs"
                        transition={{ type: "spring", stiffness: 450, damping: 36 }}
                      />
                    )}
                    <span className="relative z-10 font-semibold">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Circular Step Arrows */}
            <div className="flex items-center gap-1.5 ml-1">
              <button
                type="button"
                onClick={() => cycleFilter("prev")}
                aria-label="Previous category"
                className="w-8 h-8 rounded-full bg-[#D8CEBD]/70 hover:bg-[#1C1610] text-[#3D3122] hover:text-[#FAF7F2] border border-[#C7BBA8]/80 flex items-center justify-center transition-colors duration-150 cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[2]" />
              </button>
              <button
                type="button"
                onClick={() => cycleFilter("next")}
                aria-label="Next category"
                className="w-8 h-8 rounded-full bg-[#D8CEBD]/70 hover:bg-[#1C1610] text-[#3D3122] hover:text-[#FAF7F2] border border-[#C7BBA8]/80 flex items-center justify-center transition-colors duration-150 cursor-pointer shadow-2xs"
              >
                <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Compact, High-End Luxury Editorial Product Grid with Silky Fluid Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-3.5 lg:gap-4"
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col rounded-xl overflow-hidden bg-[#F7F3EB] border border-[#DDD3C2] hover:border-[#B8853B]/70 transition-all duration-300 shadow-[0_2px_8px_rgba(40,28,14,0.04)] hover:shadow-[0_8px_20px_rgba(40,28,14,0.08)] cursor-pointer"
              >
                {/* 1. Compact Portrait Photography Window (Natural, Unobstructed) */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#E2D8C7]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover ${product.objectPosition || "object-top"
                      } transition-transform duration-500 ease-out group-hover:scale-[1.03]`}
                    loading="lazy"
                  />

                  {/* Subtle Top Photographic Vignette */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-60" />

                  {/* Minimal Subtle Badge */}
                  {product.badge && (
                    <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[8.5px] font-sans font-semibold tracking-wider uppercase text-[#1C1610] bg-[#E5A93C] shadow-2xs">
                      {product.badge}
                    </span>
                  )}

                  {/* Understated Quick Add Pill (Floats up on Hover) */}
                  <div className="absolute inset-x-2 bottom-2 z-20 pointer-events-none group-hover:pointer-events-auto opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, product.id)}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-[#1C1610]/90 hover:bg-[#1C1610] text-[#FAF7F2] text-[10.5px] font-semibold tracking-wide uppercase flex items-center justify-center gap-1 transition-colors duration-150 shadow-md cursor-pointer backdrop-blur-xs"
                    >
                      {addedId === product.id ? (
                        <>
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>Added</span>
                        </>
                      ) : (
                        <span>Quick Add</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Organic Wave Transition into Cloth Panel */}
                <div className="relative w-full h-2.5 -mt-2.5 z-10 pointer-events-none overflow-hidden">
                  <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full block">
                    <path d="M 0 10 C 35 2, 65 10, 100 4 L 100 10 L 0 10 Z" fill="#F7F3EB" />
                  </svg>
                </div>

                {/* 2. Compact Minimalist Information Panel with Tactile Cloth Weave */}
                <div className="relative p-2.5 sm:p-3 flex flex-col justify-between flex-1 bg-[#F7F3EB] overflow-hidden">
                  {/* Subtle Tactile Cloth Weave Texture Overlay */}
                  <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply">
                    <svg className="w-full h-full block">
                      <rect width="100%" height="100%" fill="url(#cardClothWeavePattern)" />
                    </svg>
                  </div>

                  <div className="relative z-10">
                    {/* Fit Taxonomy */}
                    <p className="font-sans text-[9px] sm:text-[9.5px] uppercase tracking-[0.16em] text-[#857461] font-semibold leading-none">
                      {product.fit}
                    </p>

                    {/* Product Name */}
                    <h3 className="font-editorial text-[13.5px] sm:text-[14px] font-semibold text-[#1C1610] group-hover:text-[#9E6C21] transition-colors duration-200 mt-1 leading-snug truncate">
                      {product.name}
                    </h3>
                  </div>

                  {/* Price, Colorways & Circular Cart Action */}
                  <div className="relative z-10 flex items-end justify-between mt-2 pt-1.5 border-t border-[#E6DDD0]">
                    <div>
                      <span className="font-sans text-[13px] sm:text-[13.5px] font-bold text-[#1C1610] tracking-tight block">
                        ₹{product.price}
                      </span>

                      {/* Minimalist Colorway Circles */}
                      <div className="flex items-center gap-1 mt-1">
                        {product.colors.map((color, colorIdx) => {
                          const isSelected = (selectedColor[product.id] ?? 0) === colorIdx;
                          return (
                            <button
                              key={colorIdx}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedColor((prev) => ({ ...prev, [product.id]: colorIdx }));
                              }}
                              style={{ backgroundColor: color }}
                              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all cursor-pointer ${isSelected
                                ? "ring-1.5 ring-[#1C1610] scale-110 shadow-2xs"
                                : "border border-black/15 opacity-80 hover:opacity-100"
                                }`}
                              title={`Colorway ${colorIdx + 1}`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Circular Luxury Shopping Cart Button */}
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, product.id)}
                      aria-label={`Add ${product.name} to cart`}
                      className="w-7 h-7 rounded-full bg-[#EDE5D6] hover:bg-[#1C1610] text-[#3D3122] hover:text-[#FAF7F2] border border-[#DDD3C2] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs shrink-0 group/cart"
                    >
                      {addedId === product.id ? (
                        <Check className="w-3.5 h-3.5 stroke-[2.5] text-emerald-600" />
                      ) : (
                        <ShoppingCart className="w-3.5 h-3.5 stroke-[1.8] group-hover/cart:scale-105 transition-transform" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
