"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ShoppingCart } from "lucide-react";

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

          {/* Leaf gradients — Left corner leaves (top-left side, lower cluster) */}
          <linearGradient id="leafGr1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A2E1A" />
            <stop offset="45%" stopColor="#223C22" />
            <stop offset="100%" stopColor="#0F1E10" />
          </linearGradient>
          <linearGradient id="leafGr2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#162A16" />
            <stop offset="50%" stopColor="#1E3820" />
            <stop offset="100%" stopColor="#0B1A0C" />
          </linearGradient>
          <linearGradient id="leafGr3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0E2010" />
            <stop offset="55%" stopColor="#1B3620" />
            <stop offset="100%" stopColor="#253E24" />
          </linearGradient>

          {/* Right corner leaf gradients */}
          <linearGradient id="leafGrR1" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1A2E1A" />
            <stop offset="45%" stopColor="#223C22" />
            <stop offset="100%" stopColor="#0F1E10" />
          </linearGradient>
          <linearGradient id="leafGrR2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#152615" />
            <stop offset="50%" stopColor="#1D361E" />
            <stop offset="100%" stopColor="#0C1B0D" />
          </linearGradient>
          <linearGradient id="leafGrR3" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#243E23" />
            <stop offset="60%" stopColor="#1B3020" />
            <stop offset="100%" stopColor="#0F200F" />
          </linearGradient>

          {/* Sohrai sun mandala gradient */}
          <radialGradient id="suryaGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B87A22" stopOpacity="0.45" />
            <stop offset="40%" stopColor="#A0691C" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#8A5515" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* ─── 1. Base Warm Parchment Canvas ────────────────────────────── */}
      {/* Layered warm gradient so top feels lighter (from the hero wave) and edges are richer */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 130% 90% at 50% -5%, #F5EFE2 0%, #EAE0CA 40%, #E2D5BB 100%)" }}
      />

      {/* ─── 2. Paper / Handmade-Paper Noise Texture ─────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.07] mix-blend-overlay"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: "300px 300px" }}
      />

      {/* ─── 3. Sohrai Sun Mandala — Top-Right (behind corner leaves) ── */}
      <div className="absolute -top-8 -right-4 w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 pointer-events-none z-[1] opacity-70">
        <svg viewBox="0 0 300 300" className="w-full h-full" fill="none">
          {/* Outer glow ring */}
          <circle cx="150" cy="150" r="140" fill="url(#suryaGrad)" />
          {/* Radiating spokes */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            const rad = (angle * Math.PI) / 180;
            const x1 = 150 + 42 * Math.cos(rad);
            const y1 = 150 + 42 * Math.sin(rad);
            const x2 = 150 + 130 * Math.cos(rad);
            const y2 = 150 + 130 * Math.sin(rad);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#B87A22" strokeWidth={i % 3 === 0 ? "1.8" : "0.9"} strokeOpacity="0.55" />
            );
          })}
          {/* Central rings */}
          <circle cx="150" cy="150" r="42" stroke="#B87A22" strokeWidth="1.4" strokeOpacity="0.5" fill="none" />
          <circle cx="150" cy="150" r="28" stroke="#B87A22" strokeWidth="1.1" strokeOpacity="0.45" fill="none" />
          <circle cx="150" cy="150" r="14" stroke="#B87A22" strokeWidth="1.1" strokeOpacity="0.4" fill="none" />
          <circle cx="150" cy="150" r="6" fill="#B87A22" fillOpacity="0.4" />
          {/* Outer decorative ring */}
          <circle cx="150" cy="150" r="120" stroke="#A06A1A" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 6" fill="none" />
          {/* Petal tips on 8 primary spokes */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8;
            const rad = (angle * Math.PI) / 180;
            const px = 150 + 130 * Math.cos(rad);
            const py = 150 + 130 * Math.sin(rad);
            return (
              <circle key={i} cx={px} cy={py} r="4" fill="#B87A22" fillOpacity="0.45" />
            );
          })}
        </svg>
      </div>

      {/* ─── 4. Top-Right Corner Botanical Leaves ─────────────────────── */}
      {/* Large realistic tropical foliage, pinned to top-right, partially cropped */}
      <div className="absolute -right-10 -top-8 w-64 sm:w-80 lg:w-[400px] h-72 sm:h-96 lg:h-[480px] pointer-events-none z-[2]">
        <svg viewBox="0 0 380 440" fill="none" className="w-full h-full drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)]">
          {/* Leaf A — largest, sweeping from top-right down-left */}
          <path d="M 370 20
            C 320 45, 250 80, 180 160
            C 135 215, 100 260, 85 300
            C 130 245, 200 180, 280 120
            C 330 82, 360 50, 370 20 Z"
            fill="url(#leafGrR1)" />
          {/* Leaf A midrib */}
          <path d="M 370 20 C 300 80, 200 180, 85 300"
            stroke="#0A1A0B" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />
          {/* Leaf A veins */}
          <path d="M 280 120 C 240 155, 195 190, 160 230 M 330 82 C 290 115, 250 155, 220 195 M 240 140 C 210 170, 185 205, 165 240"
            stroke="#0A1A0B" strokeWidth="0.6" strokeOpacity="0.35" fill="none" />

          {/* Leaf B — medium, drooping right */}
          <path d="M 380 85
            C 355 110, 310 155, 275 220
            C 250 265, 235 310, 240 345
            C 255 305, 285 255, 320 200
            C 350 155, 375 115, 380 85 Z"
            fill="url(#leafGrR2)" />
          {/* Leaf B midrib */}
          <path d="M 380 85 C 340 160, 280 260, 240 345"
            stroke="#0A1A0B" strokeWidth="1" strokeOpacity="0.45" fill="none" />

          {/* Leaf C — smaller, upper-right cluster */}
          <path d="M 360 0
            C 330 18, 290 40, 255 80
            C 225 115, 205 150, 200 185
            C 225 145, 265 105, 305 68
            C 338 38, 358 14, 360 0 Z"
            fill="url(#leafGrR3)" />

          {/* Leaf D — long narrow drooping leaf, far right */}
          <path d="M 380 140
            C 375 180, 365 240, 360 310
            C 358 350, 360 390, 365 440
            C 362 390, 368 330, 370 270
            C 375 210, 380 165, 380 140 Z"
            fill="url(#leafGrR1)" opacity="0.7" />
        </svg>
      </div>

      {/* ─── 5. Bottom-Left Corner Botanical Leaves ───────────────────── */}
      <div className="absolute -left-8 -bottom-8 w-56 sm:w-72 lg:w-[340px] h-56 sm:h-72 lg:h-[340px] pointer-events-none z-[2]">
        <svg viewBox="0 0 320 320" fill="none" className="w-full h-full drop-shadow-[0_-8px_20px_rgba(0,0,0,0.45)]">
          {/* Leaf A — sweeping bottom-left, curling upward */}
          <path d="M 20 310
            C 60 255, 130 185, 215 130
            C 160 180, 90 255, 20 310 Z"
            fill="url(#leafGr1)" />
          <path d="M 20 310 C 90 225, 170 165, 215 130"
            stroke="#071408" strokeWidth="1.1" strokeOpacity="0.5" fill="none" />
          <path d="M 120 215 C 150 195, 185 170, 215 145 M 75 255 C 105 235, 140 210, 170 185"
            stroke="#071408" strokeWidth="0.6" strokeOpacity="0.3" fill="none" />

          {/* Leaf B — sweeping from bottom, tilting right */}
          <path d="M 0 295
            C 40 230, 100 165, 170 110
            C 120 165, 60 235, 0 295 Z"
            fill="url(#leafGr2)" opacity="0.9" />

          {/* Leaf C — curled corner leaf */}
          <path d="M 30 320
            C 80 275, 150 220, 230 175
            C 175 220, 105 278, 30 320 Z"
            fill="url(#leafGr3)" opacity="0.75" />
        </svg>
      </div>

      {/* ─── 6. Left Sidebar Thin Sohrai Bark Art Strip ───────────────── */}
      {/* Vertical strip of Warli/Sohrai-style minimal tribal people & tree art */}
      <div className="absolute top-0 left-0 w-[60px] sm:w-[72px] h-full pointer-events-none z-[1] opacity-[0.16]"
        style={{ color: "#7A5528" }}>
        <svg viewBox="0 0 60 700" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="w-full h-full">
          {/* Sacred tree trunk */}
          <line x1="30" y1="680" x2="30" y2="80" />
          {/* Branches */}
          <path d="M30 150 Q15 130 8 108 M30 150 Q45 130 52 108" />
          <path d="M30 210 Q12 188 4 164 M30 210 Q48 188 56 164" />
          <path d="M30 280 Q15 260 8 238 M30 280 Q45 260 52 238" />
          <path d="M30 350 Q14 328 6 304 M30 350 Q46 328 54 304" />
          <path d="M30 420 Q16 400 9 378 M30 420 Q44 400 51 378" />
          <path d="M30 490 Q15 470 8 448 M30 490 Q45 470 52 448" />
          <path d="M30 560 Q16 542 9 520 M30 560 Q44 542 51 520" />
          {/* Leaf tufts at branch ends */}
          <circle cx="8" cy="108" r="5" fill="currentColor" fillOpacity="0.5" />
          <circle cx="52" cy="108" r="5" fill="currentColor" fillOpacity="0.5" />
          <circle cx="4" cy="164" r="6" fill="currentColor" fillOpacity="0.45" />
          <circle cx="56" cy="164" r="6" fill="currentColor" fillOpacity="0.45" />
          <circle cx="6" cy="304" r="5" fill="currentColor" fillOpacity="0.4" />
          <circle cx="54" cy="304" r="5" fill="currentColor" fillOpacity="0.4" />
          {/* Sun at top */}
          <circle cx="30" cy="68" r="14" strokeWidth="1.4" />
          <circle cx="30" cy="68" r="6" fill="currentColor" fillOpacity="0.45" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * 45 * Math.PI) / 180;
            return <line key={i} x1={30 + 16 * Math.cos(a)} y1={68 + 16 * Math.sin(a)} x2={30 + 22 * Math.cos(a)} y2={68 + 22 * Math.sin(a)} strokeWidth="1" />;
          })}
          {/* Tribal figure near bottom of strip */}
          <circle cx="30" cy="615" r="5" />
          <line x1="30" y1="620" x2="30" y2="642" />
          <line x1="18" y1="630" x2="42" y2="630" />
          <line x1="30" y1="642" x2="22" y2="658" />
          <line x1="30" y1="642" x2="38" y2="658" />
        </svg>
      </div>

      {/* ─── 7. Left Editorial Tagline ────────────────────────────────── */}
      <div className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 pointer-events-none z-[3] hidden lg:flex flex-col gap-0.5">
        <p className="font-serif italic text-[10px] tracking-wide text-[#7A5528]/50 leading-loose">
          People<br />Roots<br />Stories<br />On Fabric
        </p>
        <span className="block w-4 h-[1px] bg-[#7A5528]/35 mt-1" />
      </div>

      {/* ─── 8. Right Editorial Tagline ───────────────────────────────── */}
      <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 pointer-events-none z-[3] hidden lg:flex flex-col items-center">
        <p className="font-sans text-[8px] sm:text-[9px] font-semibold tracking-[0.28em] text-[#7A5528]/45 uppercase"
          style={{ writingMode: "vertical-rl", letterSpacing: "0.35em" }}>
          Tribal Art Modern Wear
        </p>
      </div>

      {/* ─── 9. Faint Floral Sohrai Pattern — Bottom Center ──────────── */}
      {/* Subtle repeating folk motifs behind the lower card row */}
      <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none z-[1] opacity-[0.07]"
        style={{ color: "#9A6A30" }}>
        <svg viewBox="0 0 1200 160" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.1">
          {/* Repeating leaf-flower motifs */}
          {[80, 240, 400, 560, 720, 880, 1040, 1200].map((x, i) => (
            <g key={i} transform={`translate(${x}, 80)`}>
              <circle cx="0" cy="0" r="12" strokeWidth="1" />
              <circle cx="0" cy="0" r="5" fill="currentColor" fillOpacity="0.5" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a, j) => {
                const r = (a * Math.PI) / 180;
                return <line key={j} x1={0} y1={0} x2={20 * Math.cos(r)} y2={20 * Math.sin(r)} strokeWidth="0.8" />;
              })}
            </g>
          ))}
        </svg>
      </div>

      {/* ─── 10. Delicate Gold Top Hairline (Hero → Section seam) ─────── */}
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
