"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Check, ShoppingCart, ChevronLeft, ChevronRight, Heart, Star, ArrowRight } from "lucide-react";
import { TribalTreeWatermark } from "./TribalTreeWatermark";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const headerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const headerItemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: luxuryEase,
    },
  },
};

const productsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.08,
    },
  },
};

const productItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: luxuryEase,
    },
  },
};

const carouselShelfVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: luxuryEase,
    },
  },
};

interface Product {
  id: number;
  name: string;
  fit: "Regular Fit Tee" | "Oversized Fit Tee";
  category: "regular" | "oversized" | "new";
  price: number;
  originalPrice: number;
  badge?: "New" | "Bestseller" | null;
  image: string;
  colors: string[];
  objectPosition?: string;
  rating: number;
  reviewsCount: number;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Sohrai Spirit",
    fit: "Regular Fit Tee",
    category: "regular",
    price: 699,
    originalPrice: 1299,
    badge: "New",
    image: "/images/products/sohrai-spirit.jpg",
    colors: ["#E8DFC8", "#7A4B2A", "#2C3A24", "#1C1917"],
    objectPosition: "object-top",
    rating: 4.9,
    reviewsCount: 128,
  },
  {
    id: 2,
    name: "Karma Lines",
    fit: "Oversized Fit Tee",
    category: "oversized",
    price: 749,
    originalPrice: 1399,
    badge: null,
    image: "/images/products/karma-lines.jpg",
    colors: ["#EAE0CE", "#944C32", "#462519", "#191512"],
    objectPosition: "object-[center_20%]",
    rating: 4.8,
    reviewsCount: 94,
  },
  {
    id: 3,
    name: "Rising Roots",
    fit: "Oversized Fit Tee",
    category: "oversized",
    price: 749,
    originalPrice: 1499,
    badge: null,
    image: "/images/products/rising-roots.jpg",
    colors: ["#D9CFBD", "#B07C38", "#573919", "#1E1B17"],
    objectPosition: "object-top",
    rating: 4.9,
    reviewsCount: 156,
  },
  {
    id: 4,
    name: "Forest Tales",
    fit: "Regular Fit Tee",
    category: "regular",
    price: 699,
    originalPrice: 1299,
    badge: null,
    image: "/images/products/forest-tales.jpg",
    colors: ["#EAE2D2", "#8A572D", "#2E3A24", "#161616"],
    objectPosition: "object-[center_18%]",
    rating: 4.7,
    reviewsCount: 82,
  },
  {
    id: 5,
    name: "Tribal Horizon",
    fit: "Oversized Fit Tee",
    category: "oversized",
    price: 749,
    originalPrice: 1499,
    badge: "Bestseller",
    image: "/images/products/tribal-horizon.jpg",
    colors: ["#DFD4C0", "#C28A32", "#1E3522", "#181816"],
    objectPosition: "object-top",
    rating: 4.8,
    reviewsCount: 110,
  },
  {
    id: 6,
    name: "Hazaribagh Earth",
    fit: "Regular Fit Tee",
    category: "regular",
    price: 799,
    originalPrice: 1599,
    badge: null,
    image: "/images/products/hazaribagh-earth.jpg?v=2",
    colors: ["#E5D9C4", "#8C4325", "#36432B", "#1A1816"],
    objectPosition: "object-[center_22%]",
    rating: 4.8,
    reviewsCount: 76,
  },
  {
    id: 7,
    name: "Sarna Bloom",
    fit: "Oversized Fit Tee",
    category: "oversized",
    price: 699,
    originalPrice: 1299,
    badge: "New",
    image: "/images/products/sarna-bloom.jpg?v=2",
    colors: ["#E9E0CB", "#9A3428", "#4E2D22", "#191513"],
    objectPosition: "object-[center_18%]",
    rating: 5.0,
    reviewsCount: 204,
  },
  {
    id: 8,
    name: "Karam Rhythm",
    fit: "Oversized Fit Tee",
    category: "oversized",
    price: 749,
    originalPrice: 1499,
    badge: null,
    image: "/images/products/karam-rhythm.jpg?v=2",
    colors: ["#DED3BE", "#4A5432", "#5A3C22", "#1B1916"],
    objectPosition: "object-[center_22%]",
    rating: 4.7,
    reviewsCount: 68,
  },
  {
    id: 9,
    name: "Palash Stories",
    fit: "Regular Fit Tee",
    category: "regular",
    price: 799,
    originalPrice: 1599,
    badge: null,
    image: "/images/products/palash-stories.jpg?v=2",
    colors: ["#EAE1CD", "#7D1F26", "#9B5F2A", "#1B1716"],
    objectPosition: "object-[center_18%]",
    rating: 4.9,
    reviewsCount: 142,
  },
  {
    id: 10,
    name: "Adivasi Roots",
    fit: "Oversized Fit Tee",
    category: "oversized",
    price: 749,
    originalPrice: 1499,
    badge: "Bestseller",
    image: "/images/products/adivasi-roots.jpg?v=2",
    colors: ["#E4D8C2", "#B57E2F", "#3F2D1E", "#161412"],
    objectPosition: "object-[center_20%]",
    rating: 4.9,
    reviewsCount: 189,
  },
];

const ANIMATED_PHRASES = [
  "Popular Styles",
  "Most loved",
  "People's picks",
  "Get one now",
];

const CAROUSEL_WORDS = [
  "Arrivals",
  "Trends",
  "Wears",
] as const;

const NEW_ARRIVALS = [
  PRODUCTS[0], // Sohrai Spirit (New)
  PRODUCTS[6], // Sarna Bloom (New)
  PRODUCTS[3], // Forest Tales
  PRODUCTS[1], // Karma Lines
  PRODUCTS[2], // Rising Roots
  PRODUCTS[8], // Palash Stories
  PRODUCTS[4], // Tribal Horizon
  PRODUCTS[9], // Adivasi Roots
];

const CAROUSEL_PRODUCTS = [...NEW_ARRIVALS, ...NEW_ARRIVALS, ...NEW_ARRIVALS];

export function FeaturedCollection() {
  const [selectedColor, setSelectedColor] = useState<Record<number, number>>({});
  const [cartItems, setCartItems] = useState<Record<number, boolean>>({});
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});
  const [favToast, setFavToast] = useState<{ id: number; text: string; isAdding: boolean } | null>(null);
  const favToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [cartToast, setCartToast] = useState<{ id: number; text: string; isAdding?: boolean } | null>(null);
  const cartToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const normalizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const normalizeSubTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [carouselWordIndex, setCarouselWordIndex] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const carouselSectionRef = useRef<HTMLDivElement>(null);

  // Centered Focus Coverflow Carousel State
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [cardDim, setCardDim] = useState({ width: 360, gap: 24 });
  const [activeIndex, setActiveIndex] = useState(NEW_ARRIVALS.length); // Middle set (index 8)
  const [isPaused, setIsPaused] = useState(false);
  const [isNormalizing, setIsNormalizing] = useState(false);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const isSectionVisibleRef = useRef(true);

  // Monitor section visibility to pause background timers when offscreen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isSectionVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isSectionVisibleRef.current || (typeof document !== "undefined" && document.hidden)) return;
      setPhraseIndex((prev) => (prev + 1) % ANIMATED_PHRASES.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isSectionVisibleRef.current || (typeof document !== "undefined" && document.hidden)) return;
      setCarouselWordIndex((prev) => (prev + 1) % CAROUSEL_WORDS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (favToastTimeoutRef.current) {
        clearTimeout(favToastTimeoutRef.current);
      }
      if (cartToastTimeoutRef.current) {
        clearTimeout(cartToastTimeoutRef.current);
      }
      if (normalizeTimeoutRef.current) {
        clearTimeout(normalizeTimeoutRef.current);
      }
      if (normalizeSubTimeoutRef.current) {
        clearTimeout(normalizeSubTimeoutRef.current);
      }
    };
  }, []);

  // Responsive dimensions for precise viewport centering without mount jitter
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
      if (typeof window !== "undefined") {
        if (window.innerWidth < 640) {
          setCardDim({ width: 275, gap: 16 });
        } else if (window.innerWidth < 1024) {
          setCardDim({ width: 320, gap: 20 });
        } else {
          setCardDim({ width: 360, gap: 24 });
        }
      }
      setIsLayoutReady(true);
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleNext = () => {
    if (isNormalizing) return;
    const next = activeIndex + 1;
    setActiveIndex(next);

    // If reaching the 3rd set, silently normalize back to the 2nd set
    if (next >= NEW_ARRIVALS.length * 2) {
      if (normalizeTimeoutRef.current) clearTimeout(normalizeTimeoutRef.current);
      normalizeTimeoutRef.current = setTimeout(() => {
        setIsNormalizing(true);
        setActiveIndex(next - NEW_ARRIVALS.length);
        if (normalizeSubTimeoutRef.current) clearTimeout(normalizeSubTimeoutRef.current);
        normalizeSubTimeoutRef.current = setTimeout(() => setIsNormalizing(false), 50);
      }, 880);
    }
  };

  const handlePrev = () => {
    if (isNormalizing) return;
    const prev = activeIndex - 1;
    setActiveIndex(prev);

    // If reaching the 1st set, silently normalize back to the 2nd set
    if (prev < NEW_ARRIVALS.length) {
      if (normalizeTimeoutRef.current) clearTimeout(normalizeTimeoutRef.current);
      normalizeTimeoutRef.current = setTimeout(() => {
        setIsNormalizing(true);
        setActiveIndex(prev + NEW_ARRIVALS.length);
        if (normalizeSubTimeoutRef.current) clearTimeout(normalizeSubTimeoutRef.current);
        normalizeSubTimeoutRef.current = setTimeout(() => setIsNormalizing(false), 50);
      }, 880);
    }
  };

  // Autoplay timer: 3.8s cadence with automatic pause on hover and offscreen
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      if (!isSectionVisibleRef.current || (typeof document !== "undefined" && document.hidden)) return;
      handleNext();
    }, 3800);
    return () => clearInterval(timer);
  }, [isPaused, activeIndex, isNormalizing]);

  const handleAddToCart = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const willBeInCart = !cartItems[id];
    setCartItems((prev) => ({ ...prev, [id]: willBeInCart }));

    if (cartToastTimeoutRef.current) {
      clearTimeout(cartToastTimeoutRef.current);
    }
    if (favToastTimeoutRef.current) {
      clearTimeout(favToastTimeoutRef.current);
    }
    setFavToast(null);

    setCartToast({
      id,
      text: willBeInCart ? "Added to Cart" : "Removed from Cart",
      isAdding: willBeInCart,
    });

    cartToastTimeoutRef.current = setTimeout(() => {
      setCartToast(null);
    }, 2200);
  };

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const willBeFav = !favorites[id];
    setFavorites((prev) => ({ ...prev, [id]: willBeFav }));

    if (favToastTimeoutRef.current) {
      clearTimeout(favToastTimeoutRef.current);
    }
    if (cartToastTimeoutRef.current) {
      clearTimeout(cartToastTimeoutRef.current);
    }
    setCartToast(null);

    setFavToast({
      id,
      text: willBeFav ? "Added to your favourites" : "Removed from favourites",
      isAdding: willBeFav,
    });

    favToastTimeoutRef.current = setTimeout(() => {
      setFavToast(null);
    }, 2200);
  };

  const handleBuyNow = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setCartItems((prev) => ({ ...prev, [id]: true }));

    if (cartToastTimeoutRef.current) {
      clearTimeout(cartToastTimeoutRef.current);
    }
    if (favToastTimeoutRef.current) {
      clearTimeout(favToastTimeoutRef.current);
    }
    setFavToast(null);

    setCartToast({ id, text: "Added to Cart", isAdding: true });

    cartToastTimeoutRef.current = setTimeout(() => {
      setCartToast(null);
    }, 2200);
  };

  return (
    <section
      ref={sectionRef}
      id="shop"
      className="relative w-full bg-[#EAE2D5] section-optimize pt-14 sm:pt-16 lg:pt-20 pb-8 sm:pb-10 lg:pb-12 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 overflow-hidden select-none isolate"
    >
      {/* ─── Hidden SVG Pattern Defs ──────────────────────────────────── */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
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

      {/* ─── 2. Paper / Handmade-Paper Noise Texture (Optimized 1-octave SVG noise) ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: "200px 200px" }}
      />



      {/* ─── 7. Central Background Sacred Kalpavriksha (Tree of Life) & Karam Dancers Watermark ── */}
      <TribalTreeWatermark className="absolute top-2 sm:top-4 lg:top-5 left-[95%] sm:left-1/2 -translate-x-1/2 w-[520px] sm:w-[680px] lg:w-[840px] xl:w-[940px] h-[220px] sm:h-[270px] lg:h-[320px] z-[0]" opacity={0.36} />

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


      {/* ─── 9. Delicate Gold Top Hairline (Hero → Section seam) ─────── */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C89B4C]/35 to-transparent pointer-events-none z-10" />


      <div className="relative z-10 max-w-[1220px] mx-auto">
        {/* Editorial Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05, margin: "0px 0px -30px 0px" }}
          variants={headerContainerVariants}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-9"
        >
          {/* Typographic Title Block */}
          <motion.div variants={headerItemVariants}>
            <div className="flex items-center gap-2.5 sm:gap-2.5 mb-2.5 sm:mb-2.5">
              <span className="text-[10.5px] sm:text-[10.5px] font-semibold tracking-[0.2em] sm:tracking-[0.22em] text-[#786957] uppercase">
                FEATURED COLLECTION
              </span>
              <span className="w-6 sm:w-7 h-[1.5px] sm:h-[1px] bg-[#B85D1B] sm:bg-[#B37E26] inline-block opacity-90 rounded-full" />
              <span className="hidden sm:inline text-[10.5px] font-semibold tracking-[0.22em] text-[#B37E26] uppercase">
                HANDPICKED
              </span>
            </div>

            <h2 className="font-editorial text-[38px] sm:text-4xl lg:text-[40px] font-bold text-[#14110C] tracking-tight leading-[1.03] sm:leading-[1.08]">
              <span className="block sm:inline text-[#14110C]">Wear Your </span>
              <span className="block sm:inline italic font-bold text-[#B85D1B] sm:text-[#B87A22]">
                Heritage<span className="not-italic text-[#14110C]">.</span>
              </span>
            </h2>

            <p className="mt-2.5 sm:mt-2 text-[#56493A] text-[13.5px] sm:text-sm font-normal max-w-[310px] sm:max-w-md leading-[1.4] sm:leading-relaxed">
              Contemporary silhouettes inspired by{" "}
              <span className="block sm:inline">the tribal art and spirit of Jharkhand.</span>
            </p>
          </motion.div>

          {/* Right Side: Desktop Animated Classy Editorial Text */}
          <motion.div variants={headerItemVariants} className="hidden sm:flex sm:items-end justify-end gap-3.5 self-end">
            {/* Subtle Vertical Gold Divider */}
            <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[#B37E26]/50 to-transparent" />

            <div className="text-right">
              {/* Great Offers with Durga Puja Shine Animation */}
              <div className="flex items-center justify-end mb-0.5 px-2">
                <span className="font-editorial text-2xl font-bold tracking-tight select-none">
                  <span className="animate-durga-shine pr-1 pb-0.5">Great Offers</span>
                </span>
              </div>

              {/* Classy Animated Rotating Text - Expanded width & right padding to prevent italic clipping */}
              <div className="h-11 relative overflow-hidden flex items-center justify-end min-w-[260px] px-2 py-0.5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={phraseIndex}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                    className="font-editorial italic text-2xl font-normal text-[#B87A22] tracking-tight whitespace-nowrap leading-normal py-0.5 pr-4 pl-1"
                  >
                    {ANIMATED_PHRASES[phraseIndex]}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 4 Minimal Indicator Bars */}
              <div className="flex items-center justify-end gap-1.5 mt-1.5 pr-3">
                {ANIMATED_PHRASES.map((_, i) => (
                  <span
                    key={i}
                    className={`h-0.5 rounded-full transition-all duration-300 ${i === phraseIndex
                        ? "w-4 bg-[#B87A22]"
                        : "w-1.5 bg-[#C7BBA8]/70"
                      }`}
                  />
                ))}
              </div>

              {/* Show All Option */}
              <div className="flex items-center justify-end mt-2.5 px-2">
                <button
                  type="button"
                  onClick={() => {
                    const shopGrid = document.querySelector("#shop .grid");
                    if (shopGrid) {
                      shopGrid.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="group/showall inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D9CEBC] hover:border-[#B87A22] bg-[#FAF7F2]/85 hover:bg-[#FAF7F2] text-[#5C4832] hover:text-[#1C1610] text-[11px] font-sans font-semibold tracking-[0.14em] uppercase transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
                >
                  <span>Show All</span>
                  <ArrowRight className="w-3 h-3 text-[#B87A22] transition-transform duration-200 group-hover/showall:translate-x-0.5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Mobile Clean Integrated Action Bar */}
          <motion.div variants={headerItemVariants} className="flex sm:hidden items-center justify-between w-full pt-3.5 mt-2.5 border-t border-[#D9CEBC]/75">
            {/* Left: Great Offers with Animated Phrase Directly Below */}
            <div className="flex flex-col min-w-0">
              <span className="font-editorial text-[18px] font-bold text-[#1C1610] tracking-tight leading-tight select-none">
                <span className="animate-durga-shine pr-0.5">Great Offers</span>
              </span>

              {/* Cycling phrase directly below */}
              <div className="h-7 relative overflow-hidden flex items-center min-w-0 mt-0.5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={phraseIndex}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.38, ease: luxuryEase }}
                    className="font-editorial italic text-[17px] font-normal text-[#B87A22] tracking-tight whitespace-nowrap"
                  >
                    {ANIMATED_PHRASES[phraseIndex]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Show All Button */}
            <button
              type="button"
              onClick={() => {
                const shopGrid = document.querySelector("#shop .grid");
                if (shopGrid) {
                  shopGrid.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              className="group/showall inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D9CEBC] hover:border-[#B87A22] bg-[#FAF7F2] text-[#5C4832] hover:text-[#1C1610] text-[11px] font-sans font-semibold tracking-[0.14em] uppercase shrink-0 shadow-2xs active:scale-95 transition-all duration-200"
            >
              <span>Show All</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B87A22]" />
            </button>
          </motion.div>
        </motion.div>

        {/* Compact, High-End Luxury Editorial Product Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05, margin: "0px 0px -40px 0px" }}
          variants={productsContainerVariants}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-3.5 lg:gap-4"
        >
          {PRODUCTS.map((product) => (
            <motion.div
              key={product.id}
              variants={productItemVariants}
              className="group relative flex flex-col rounded-xl overflow-hidden bg-[#F7F3EB] border border-[#DDD3C2] hover:border-[#B8853B]/70 transition-[border-color,box-shadow] duration-300 shadow-[0_2px_8px_rgba(40,28,14,0.04)] hover:shadow-[0_8px_20px_rgba(40,28,14,0.08)] cursor-pointer"
            >
              {/* 1. Compact Portrait Photography Window (Natural, Unobstructed) */}
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#E2D8C7]">
                <img
                  src={product.image}
                  alt={product.name}
                  draggable={false}
                  decoding="async"
                  className={`w-full h-full object-cover select-none pointer-events-none ${product.objectPosition || "object-top"
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

                {/* Floating Favourite Icon - Minimal, clean, no glass */}
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(e, product.id)}
                  aria-label={favorites[product.id] ? "Remove from wishlist" : "Add to wishlist"}
                  className="absolute top-2 right-2 z-20 w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-[#FAF7F2] hover:bg-white text-[#1C1610] border border-[#DDD3C2] shadow-xs flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110 active:scale-90 group/fav"
                >
                  <Heart
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-200 ${favorites[product.id]
                      ? "fill-[#D9383A] text-[#D9383A] scale-110"
                      : "text-[#5C4D3C] group-hover/fav:text-[#D9383A]"
                      }`}
                  />
                </button>
              </div>

              {/* 2. Compact Minimalist Information Panel */}
              <div className="relative p-2.5 sm:p-3 flex flex-col justify-between flex-1 bg-[#F7F3EB]">
                <div className="relative z-10">
                  {/* Fit Taxonomy & Star Rating Row - Minimal, clean, high-visibility */}
                  <div className="flex items-center justify-between gap-1 sm:gap-1.5 min-w-0">
                    <p className="font-sans text-[8px] sm:text-[9.5px] uppercase tracking-[0.08em] sm:tracking-[0.12em] text-[#857461] font-semibold leading-none truncate min-w-0 flex-1">
                      {product.fit}
                    </p>
                    <div className="flex items-center gap-0.5 sm:gap-1 font-sans leading-none shrink-0 whitespace-nowrap ml-auto">
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#B87A22] text-[#B87A22] shrink-0" />
                      <span className="font-bold text-[10.5px] sm:text-[11px] text-[#1C1610]">{product.rating.toFixed(1)}</span>
                      <span className="text-[#4E3F2F] font-semibold text-[9.5px] sm:text-[10.5px]">({product.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Product Name */}
                  <h3 className="font-editorial text-[13px] sm:text-[14px] font-semibold text-[#1C1610] group-hover:text-[#9E6C21] transition-colors duration-200 mt-1 leading-snug truncate">
                    {product.name}
                  </h3>
                </div>

                {/* Price, Colorways & Actions Panel */}
                <div className="relative z-10 flex flex-col mt-2.5 pt-2 border-t border-[#E6DDD0]/80">
                  {/* Price Row: Discounted Price, Strikethrough M.R.P., and High-Visibility Animated Discount Tag */}
                  <div className="flex items-center justify-between gap-1 sm:gap-2 py-0.5">
                    <div className="flex items-baseline flex-nowrap min-w-0">
                      <span className="font-sans text-[14px] sm:text-[15.5px] font-bold text-[#1C1610] tracking-tight leading-none">
                        ₹{product.price}
                      </span>
                      <span className="font-sans text-[11px] sm:text-[12px] text-[#8C7E6D] line-through font-normal leading-none ml-1.5 sm:ml-2 tracking-normal shrink-0">
                        ₹{product.originalPrice}
                      </span>
                    </div>
                    <span className="relative overflow-hidden inline-flex items-center shrink-0 whitespace-nowrap font-sans text-[8.5px] sm:text-[10px] font-extrabold tracking-tight sm:tracking-wide px-1.5 sm:px-2 py-0.5 rounded-md border animate-discount-highlight select-none shadow-xs">
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 pointer-events-none -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent animate-discount-sweep"
                      />
                      <span className="relative z-10 font-bold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </span>
                  </div>

                  {/* Colorway Swatches and Cart Button Row */}
                  <div className="flex items-center justify-between mt-2.5">
                    {/* Minimalist Colorway Circles */}
                    <div className="flex items-center gap-1">
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
                            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${isSelected
                              ? "ring-1.5 ring-[#1C1610] scale-110 shadow-2xs"
                              : "border border-black/15 opacity-80 hover:opacity-100"
                              }`}
                            title={`Colorway ${colorIdx + 1}`}
                          />
                        );
                      })}
                    </div>

                    {/* Circular Luxury Shopping Cart Button */}
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, product.id)}
                      aria-label={cartItems[product.id] ? `Remove ${product.name} from cart` : `Add ${product.name} to cart`}
                      className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs shrink-0 group/cart ${cartItems[product.id]
                          ? "bg-emerald-600 border border-emerald-600 text-white shadow-xs"
                          : "bg-[#EDE5D6] hover:bg-[#1C1610] text-[#3D3122] hover:text-[#FAF7F2] border border-[#DDD3C2]"
                        }`}
                      title={cartItems[product.id] ? "In Cart (Click to uncheck)" : "Add to Cart"}
                    >
                      {cartItems[product.id] ? (
                        <Check className="w-3.5 h-3.5 stroke-[2.8] text-white" />
                      ) : (
                        <ShoppingCart className="w-3.5 h-3.5 stroke-[1.8] group-hover/cart:scale-105 transition-transform" />
                      )}
                    </button>
                  </div>

                  {/* Minimalist Cream Luxury Buy Now Button */}
                  <button
                    type="button"
                    onClick={(e) => handleBuyNow(e, product.id)}
                    aria-label={`Buy ${product.name} now`}
                    className="w-full mt-2 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-lg font-sans text-[9.5px] sm:text-[10.5px] font-semibold tracking-[0.14em] sm:tracking-[0.18em] uppercase transition-colors duration-200 cursor-pointer active:scale-[0.98] bg-gradient-to-r from-[#F4EEE2] via-[#ECE2D0] to-[#F4EEE2] text-[#221810] border border-[#D6C7B2] hover:border-[#B87A22] hover:text-[#8D4E13] shadow-[0_2px_6px_rgba(40,28,14,0.05),inset_0_1px_0_rgba(255,255,255,0.8)]"
                  >
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── Premium Horizontal Autoplay Carousel / Slider: New Arrivals ─── */}
        <motion.div
          ref={carouselSectionRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05, margin: "0px 0px -40px 0px" }}
          variants={carouselShelfVariants}
          className="mt-14 sm:mt-18 lg:mt-20 pt-10 sm:pt-14 border-t border-[#D9CEBC]"
        >
          {/* Section Header: Minimal, Tasteful Editorial Header with Continuous Premium Motion & Durga Puja Sale */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h3 className="font-editorial text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#1C1610] tracking-tight leading-none flex items-center gap-2 whitespace-nowrap">
                <span>New</span>
                <span className="relative h-9 sm:h-11 lg:h-12 overflow-hidden inline-flex items-center py-1 pr-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={carouselWordIndex}
                      initial={{ y: 16, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -16, opacity: 0 }}
                      transition={{ duration: 0.42, ease: luxuryEase }}
                      className="italic font-normal text-[#B87A22] inline-flex items-baseline gap-2"
                    >
                      <span>{CAROUSEL_WORDS[carouselWordIndex]}</span>
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B87A22]/75 translate-y-[-2px]" />
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h3>

              <p className="mt-1 text-[#6B5E4C] text-[12.5px] sm:text-[13px] font-normal leading-relaxed">
                Curated silhouettes inspired by regional tribal folklore.
              </p>
            </div>

            {/* Right End Side: Lifted up to the exact level of New Arrivals with Shiny Effect */}
            <div className="flex items-center sm:items-start justify-start sm:justify-end shrink-0 sm:pt-0.5 pt-2 sm:pt-0 border-t border-[#D9CEBC]/60 sm:border-0">
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-2 sm:gap-0 text-left sm:text-right">
                <h4 className="font-editorial text-[18px] sm:text-3xl lg:text-[34px] font-bold text-[#1C1610] tracking-tight leading-[1.25] pb-0 sm:pb-1 whitespace-nowrap select-none flex items-baseline sm:justify-end gap-1.5 sm:gap-2">
                  <span className="animate-durga-shine pr-0.5 sm:pr-1 sm:pb-1">Durga Puja</span>
                  <span className="italic font-normal text-[#B87A22]">Sale</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B87A22]/75 translate-y-[-2px]" />
                </h4>
                <p className="text-[#8C765E] text-[10.5px] sm:text-[12px] font-medium tracking-wide uppercase sm:text-right sm:mt-1 shrink-0">
                  Festive Special Edition
                </p>
              </div>
            </div>
          </div>

          {/* Centered Focus Coverflow Carousel with Auto-Play & Navigation */}
          {(() => {
            const step = cardDim.width + cardDim.gap;
            const targetTranslateX =
              containerWidth > 0
                ? containerWidth / 2 - (activeIndex * step + cardDim.width / 2)
                : 0;

            return (
              <div
                ref={containerRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
                className="relative -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 xl:-mx-12 py-8 overflow-hidden select-none isolate"
              >
                {/* Smooth Centered Gliding Track */}
                <motion.div
                  initial={false}
                  animate={{ x: targetTranslateX }}
                  transition={
                    !isLayoutReady || isNormalizing
                      ? { duration: 0 }
                      : { duration: 0.85, ease: luxuryEase }
                  }
                  className="flex items-center transform-gpu will-change-transform"
                  style={{ gap: `${cardDim.gap}px` }}
                >
                  {CAROUSEL_PRODUCTS.map((product, idx) => {
                    const isActive = idx === activeIndex;
                    const isDirectNeighbor = Math.abs(idx - activeIndex) === 1;

                    return (
                      <div
                        key={`${product.id}-${idx}`}
                        onClick={() => {
                          if (!isActive) {
                            setIsNormalizing(false);
                            setActiveIndex(idx);
                          }
                        }}
                        style={{ width: `${cardDim.width}px` }}
                        className={`shrink-0 ${isLayoutReady
                            ? "transition-[transform,opacity,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                            : ""
                          } cursor-pointer rounded-2xl overflow-hidden bg-[#F7F3EB] border ${isActive
                            ? "scale-[1.06] z-20 border-[#B8853B]/70"
                            : isDirectNeighbor
                              ? "scale-[0.91] z-10 opacity-90 hover:opacity-100 border-[#DDD3C2]"
                              : "scale-[0.86] z-0 opacity-75 hover:opacity-90 border-[#DDD3C2]"
                          }`}
                      >
                        {/* Portrait Photography Window */}
                        <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#E2D8C7]">
                          <img
                            src={product.image}
                            alt={product.name}
                            draggable={false}
                            decoding="async"
                            className={`w-full h-full object-cover select-none pointer-events-none ${product.objectPosition || "object-top"} transition-transform duration-700 ease-out ${isActive ? "hover:scale-105" : ""
                              }`}
                            loading="lazy"
                          />

                          {/* Subtle Photographic Vignette */}
                          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-60" />

                          {/* Top-Left Gold NEW Badge */}
                          {product.badge && (
                            <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full text-[9px] font-sans font-bold tracking-wider uppercase text-[#1C1610] bg-[#E5A93C] shadow-2xs">
                              {product.badge}
                            </span>
                          )}

                          {/* Top-Right Favorite Button - Minimal, clean, no glass */}
                          <button
                            type="button"
                            onClick={(e) => toggleFavorite(e, product.id)}
                            aria-label={favorites[product.id] ? "Remove from wishlist" : "Add to wishlist"}
                            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-white text-[#1C1610] border border-[#DDD3C2] shadow-xs flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110 active:scale-90 group/fav"
                          >
                            <Heart
                              className={`w-4 h-4 transition-all duration-200 ${favorites[product.id]
                                ? "fill-[#D9383A] text-[#D9383A] scale-110"
                                : "text-[#5C4D3C] group-hover/fav:text-[#D9383A]"
                                }`}
                            />
                          </button>
                        </div>

                        {/* Compact Minimalist Information Panel */}
                        <div className="relative p-3.5 sm:p-4 flex flex-col justify-between flex-1 bg-[#F7F3EB]">
                          <div className="relative z-10">
                            {/* Fit Taxonomy & Star Rating Row - Minimal, clean, high-visibility */}
                            <div className="flex items-center justify-between gap-1.5 min-w-0">
                              <p className="font-sans text-[9px] sm:text-[9.5px] uppercase tracking-[0.12em] text-[#857461] font-semibold leading-none truncate min-w-0 flex-1">
                                {product.fit}
                              </p>
                              <div className="flex items-center gap-1 font-sans leading-none shrink-0 whitespace-nowrap ml-auto">
                                <Star className="w-3.5 h-3.5 fill-[#B87A22] text-[#B87A22] shrink-0" />
                                <span className="font-bold text-[11.5px] text-[#1C1610]">{product.rating.toFixed(1)}</span>
                                <span className="text-[#4E3F2F] font-semibold text-[10.5px] sm:text-[11px]">({product.reviewsCount})</span>
                              </div>
                            </div>

                            {/* Product Name */}
                            <h4 className="font-editorial text-[15px] sm:text-[16.5px] font-bold text-[#1C1610] group-hover:text-[#9E6C21] transition-colors duration-200 mt-1 leading-snug truncate">
                              {product.name}
                            </h4>
                          </div>

                          {/* Price, Colorways & Action */}
                          <div className="relative z-10 flex flex-col mt-3.5 pt-2.5 border-t border-[#E6DDD0]/80">
                            {/* Price Row: Discounted Price, Strikethrough M.R.P., and High-Visibility Animated Discount Tag */}
                            <div className="flex items-center justify-between gap-2 py-0.5">
                              <div className="flex items-baseline flex-nowrap min-w-0">
                                <span className="font-sans text-[16px] sm:text-[17px] font-bold text-[#1C1610] tracking-tight leading-none">
                                  ₹{product.price}
                                </span>
                                <span className="font-sans text-[12px] sm:text-[12.5px] text-[#8C7E6D] line-through font-normal leading-none ml-2.5 tracking-normal shrink-0">
                                  ₹{product.originalPrice}
                                </span>
                              </div>
                              <span className="relative overflow-hidden inline-flex items-center shrink-0 whitespace-nowrap font-sans text-[10px] sm:text-[10.5px] font-extrabold tracking-wide px-2.5 py-0.5 rounded-md border animate-discount-highlight select-none shadow-xs">
                                <span
                                  aria-hidden="true"
                                  className="absolute inset-0 pointer-events-none -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent animate-discount-sweep"
                                />
                                <span className="relative z-10 font-bold">
                                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                </span>
                              </span>
                            </div>

                            {/* Colorways and Cart Action Button */}
                            <div className="flex items-center justify-between mt-2.5">
                              {/* Minimalist Colorway Circles */}
                              <div className="flex items-center gap-1.5">
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
                                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${isSelected
                                        ? "ring-1.5 ring-[#1C1610] scale-110 shadow-2xs"
                                        : "border border-black/15 opacity-80 hover:opacity-100"
                                        }`}
                                      title={`Colorway ${colorIdx + 1}`}
                                    />
                                  );
                                })}
                              </div>

                              {/* Circular Cart Action Button */}
                              <button
                                type="button"
                                onClick={(e) => handleAddToCart(e, product.id)}
                                aria-label={cartItems[product.id] ? `Remove ${product.name} from cart` : `Add ${product.name} to cart`}
                                className={`w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs shrink-0 group/cart ${cartItems[product.id]
                                    ? "bg-emerald-600 border border-emerald-600 text-white shadow-xs"
                                    : "bg-[#EAE2D5] hover:bg-[#1C1610] text-[#3D3122] hover:text-[#FAF7F2] border border-[#DDD3C2]"
                                  }`}
                                title={cartItems[product.id] ? "In Cart (Click to uncheck)" : "Add to Cart"}
                              >
                                {cartItems[product.id] ? (
                                  <Check className="w-3.5 h-3.5 stroke-[2.8] text-white" />
                                ) : (
                                  <ShoppingCart className="w-3.5 h-3.5 stroke-[1.8] group-hover/cart:scale-105 transition-transform" />
                                )}
                              </button>
                            </div>

                            {/* Minimalist Cream Luxury Buy Now Button */}
                            <button
                              type="button"
                              onClick={(e) => handleBuyNow(e, product.id)}
                              aria-label={`Buy ${product.name} now`}
                              className="w-full mt-2.5 py-2 sm:py-2.5 px-3.5 rounded-lg font-sans text-[10.5px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors duration-200 cursor-pointer active:scale-[0.98] bg-gradient-to-r from-[#F4EEE2] via-[#ECE2D0] to-[#F4EEE2] text-[#221810] border border-[#D6C7B2] hover:border-[#B87A22] hover:text-[#8D4E13] shadow-[0_2px_6px_rgba(40,28,14,0.05),inset_0_1px_0_rgba(255,255,255,0.8)]"
                            >
                              <span>Buy Now</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>

                {/* Floating Left and Right Navigation Buttons matching the user reference screenshot */}
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous slide"
                  className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FAF7F2]/95 hover:bg-[#FAF7F2] text-[#1C1610] border border-[#D9CEBC] shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 z-30 cursor-pointer backdrop-blur-xs"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2]" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next slide"
                  className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FAF7F2]/95 hover:bg-[#FAF7F2] text-[#1C1610] border border-[#D9CEBC] shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 z-30 cursor-pointer backdrop-blur-xs"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2]" />
                </button>

                {/* Centered Minimal Pill Indicators matching the user reference screenshot */}
                <div className="flex items-center justify-center gap-2 mt-8">
                  {NEW_ARRIVALS.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setIsNormalizing(false);
                        setActiveIndex(NEW_ARRIVALS.length + i);
                      }}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${i === (activeIndex % NEW_ARRIVALS.length)
                        ? "w-8 bg-[#B87A22]"
                        : "w-3.5 bg-[#CBBFB0]/70 hover:bg-[#A89882]"
                        }`}
                    />
                  ))}
                </div>
              </div>
            );
          })()}
        </motion.div>
      </div>

      {/* ─── Global Minimal Floating Toast for Cart & Favourites - Luxury Minimalist, No Glass ─── */}
      <AnimatePresence>
        {cartToast && (
          <motion.div
            key="cart-toast"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.94 }}
            transition={{ duration: 0.28, ease: luxuryEase }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#1C1610] text-[#FAF7F2] border border-[#3A2F22] shadow-[0_12px_32px_rgba(0,0,0,0.35)] flex items-center gap-2.5 pointer-events-none select-none max-w-[90vw]"
          >
            <span
              className={`w-6 h-6 rounded-full bg-[#2C2218] flex items-center justify-center shrink-0 border ${cartToast.isAdding !== false
                  ? "border-emerald-500/30 text-emerald-400"
                  : "border-[#FAF7F2]/20 text-[#FAF7F2]/70"
                }`}
            >
              {cartToast.isAdding !== false ? (
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <ShoppingCart className="w-3.5 h-3.5 stroke-[1.8]" />
              )}
            </span>
            <span className="font-sans text-xs sm:text-[13px] font-medium tracking-wide text-[#FAF7F2]">
              {cartToast.text}
            </span>
          </motion.div>
        )}
        {favToast && !cartToast && (
          <motion.div
            key="fav-toast"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.94 }}
            transition={{ duration: 0.28, ease: luxuryEase }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#1C1610] text-[#FAF7F2] border border-[#3A2F22] shadow-[0_12px_32px_rgba(0,0,0,0.35)] flex items-center gap-2.5 pointer-events-none select-none max-w-[90vw]"
          >
            <span className="w-6 h-6 rounded-full bg-[#2C2218] flex items-center justify-center shrink-0">
              <Heart
                className={`w-3.5 h-3.5 ${favorites[favToast.id]
                  ? "fill-[#D9383A] text-[#D9383A]"
                  : "text-[#FAF7F2]/60"
                  }`}
              />
            </span>
            <span className="font-sans text-xs sm:text-[13px] font-medium tracking-wide text-[#FAF7F2]">
              {favToast.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
