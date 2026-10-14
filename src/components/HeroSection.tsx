"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Navbar } from "./Navbar";
import {
  QuiltedFabricIcon,
  ConcentricTribalSunIcon,
  TailorShirtIcon,
  JharkhandMapIcon,
} from "./Icons";

// The 6 clean tribal outfits
export const HERO_OUTFITS = [
  "/images/hero-outfit-1.png",
  "/images/hero-outfit-2.png",
  "/images/hero-outfit-3.png",
  "/images/hero-outfit-4.png",
  "/images/hero-outfit-5.png",
  "/images/hero-outfit-6.png",
];

export function HeroSection() {
  const [slide, setSlide] = useState(1);
  const totalSlides = HERO_OUTFITS.length;
  const prevSlideRef = useRef(1);

  const heroSectionRef = useRef<HTMLElement>(null);
  const outfitImagesRef = useRef<(HTMLImageElement | null)[]>([]);

  // 1. Figma-Style Circular Arc Transition between outfits
  useEffect(() => {
    const prevIndex = prevSlideRef.current - 1;
    const nextIndex = slide - 1;

    if (prevIndex === nextIndex) return;

    const prevEl = outfitImagesRef.current[prevIndex];
    const nextEl = outfitImagesRef.current[nextIndex];

    if (prevEl && nextEl) {
      // Determine circular carousel direction (forward vs backward)
      const isForward =
        (nextIndex > prevIndex && !(prevIndex === 0 && nextIndex === totalSlides - 1)) ||
        (prevIndex === totalSlides - 1 && nextIndex === 0);
      const dir = isForward ? 1 : -1;

      // Outgoing outfit rotates out along the circular arc
      gsap.to(prevEl, {
        opacity: 0,
        x: -40 * dir,
        y: 8,
        rotation: -2.2 * dir,
        scale: 0.95,
        duration: 0.75,
        ease: "power2.inOut",
        transformOrigin: "bottom center",
        overwrite: "auto",
      });

      // Incoming outfit sweeps into view along the circular trajectory
      gsap.fromTo(
        nextEl,
        {
          opacity: 0,
          x: 40 * dir,
          y: 8,
          rotation: 2.2 * dir,
          scale: 0.95,
          transformOrigin: "bottom center",
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          transformOrigin: "bottom center",
          overwrite: "auto",
        }
      );
    }

    prevSlideRef.current = slide;
  }, [slide, totalSlides]);

  // 3. Autoplay outfit cycle every 4.5 seconds (smart pause when off-screen or tab hidden)
  useEffect(() => {
    let isVisible = true;
    const heroEl = heroSectionRef.current;

    let observer: IntersectionObserver | null = null;
    if (typeof window !== "undefined" && "IntersectionObserver" in window && heroEl) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
        },
        { threshold: 0.1 }
      );
      observer.observe(heroEl);
    }

    const timer = setInterval(() => {
      if (!isVisible || (typeof document !== "undefined" && document.hidden)) return;
      setSlide((prev) => (prev === totalSlides ? 1 : prev + 1));
    }, 4500);

    return () => {
      clearInterval(timer);
      if (observer && heroEl) observer.unobserve(heroEl);
    };
  }, [totalSlides]);



  return (
    <section
      ref={heroSectionRef}
      className="relative w-full h-[100dvh] min-h-[640px] max-h-[1080px] flex flex-col justify-between overflow-hidden select-none isolate"
    >
      {/* Background Photographic Canvas */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-clean-bg.jpg"
          alt="Fittee Tribal Fashion Campaign Jharkhand"
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
        />

        {/* Cinematic Vignette Layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/75 to-black/40 sm:from-black/85 sm:via-black/25 sm:to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 sm:hidden pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/95 via-black/55 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      </motion.div>

      {/* Top Floating Organic Navigation */}
      <Navbar />

      {/* Main Hero Content Area */}
      <div className="relative z-20 w-full flex-1 flex items-center justify-between px-6 sm:px-10 lg:px-14 my-auto">
        {/* Left Typographic Showcase */}
        <div className="max-w-md sm:max-w-xl lg:max-w-2xl text-left">
          {/* Eyebrow Tag */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-5"
          >
            <span className="text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.24em] text-[#E5D8C8] sm:text-[#C9BAA7] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              TRIBAL ROOTS
            </span>
            <span className="w-7 sm:w-10 h-[1px] bg-[#D49B42] inline-block opacity-90" />
            <span className="text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.24em] text-[#E5D8C8] sm:text-[#C9BAA7] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              MODERN WEAR
            </span>
          </motion.div>

          {/* Main Display Headline */}
          <h1 className="font-editorial text-[42px] sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[80px] font-bold text-white tracking-tight leading-[1.04] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
            <motion.span
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
              className="block text-white"
            >
              Wear Your
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
              className="block text-[#E2A642] italic font-normal tracking-tight my-0.5 sm:my-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]"
            >
              Culture
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.60, ease: [0.16, 1, 0.3, 1] }}
              className="block text-white"
            >
              With Pride.
            </motion.span>
          </h1>

          {/* Subtitle / Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 sm:mt-5 text-[#F0EAE1] sm:text-[#DDD5C7] text-xs sm:text-base lg:text-[16px] max-w-[210px] sm:max-w-md font-normal leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
          >
            Contemporary apparel inspired by the tribal art and spirit of Jharkhand.
          </motion.p>

          {/* Dual Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.82, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4"
          >
            {/* Primary Mustard Button */}
            <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="#shop"
                className="inline-flex items-center justify-center gap-2 bg-[#E2A33C] hover:bg-[#D49533] text-[#1A1612] font-semibold text-xs sm:text-sm w-[150px] sm:w-auto px-5 sm:px-7 py-2.5 sm:py-3 rounded-full shadow-[0_4px_16px_rgba(226,163,60,0.3)] transition-colors duration-150"
              >
                <span>Shop Collection</span>
                <span className="text-sm font-bold">→</span>
              </Link>
            </motion.div>

            {/* Ghost Transparent Button */}
            <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="#customize"
                className="inline-flex items-center justify-center gap-2 bg-black/60 sm:bg-black/35 hover:bg-white/10 text-white font-medium text-xs sm:text-sm w-[150px] sm:w-auto px-5 sm:px-7 py-2.5 sm:py-3 rounded-full border border-white/60 hover:border-white/80 backdrop-blur-md transition-colors duration-150 shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
              >
                <span>Customize Now</span>
                <span className="text-sm font-bold opacity-80 hidden sm:inline">→</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Vertical Editorial Annotation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="hidden xl:flex items-start gap-3.5 absolute right-6 xl:right-10 top-20 xl:top-24 select-none pointer-events-none z-20"
          aria-hidden="true"
        >
          {/* Vertical Hairline Divider */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.85, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "top" }}
            className="w-[1px] h-20 bg-gradient-to-b from-white/40 via-white/20 to-transparent mt-1"
          />

          {/* Slanted Editorial Text */}
          <div className="font-editorial italic text-[#EDE5D8]/85 text-sm xl:text-[15px] leading-tight tracking-wide">
            <div>People</div>
            <div>Roots</div>
            <div>Stories</div>
            <div>On Fabric</div>
          </div>
        </motion.div>
      </div>

      {/* Center-Right: Multi-Outfit Showcase Anchored at Bottom Behind Wave Banner */}
      <motion.div
        initial={{ opacity: 0, y: 75, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="flex absolute right-[-5vw] sm:right-0 lg:right-4 xl:right-12 2xl:right-20 bottom-0 h-[52vh] max-h-[380px] sm:h-[60vh] sm:max-h-[480px] md:h-[76vh] md:max-h-[660px] lg:max-h-[720px] xl:max-h-[800px] 2xl:max-h-[880px] w-[75vw] max-w-[340px] sm:w-[60vw] md:w-[50vw] md:max-w-[720px] pointer-events-none select-none z-10 items-end justify-center"
      >
        {/* Inner Motion Rig */}
        <div
          className="relative w-full h-full flex items-end justify-center will-change-transform"
        >
          {/* All 6 Outfits Preloaded for Instant Butter-Smooth Crossfading */}
          {HERO_OUTFITS.map((src, index) => (
            <img
              key={index}
              ref={(el) => {
                outfitImagesRef.current[index] = el;
              }}
              src={src}
              alt="Fittee Tribal Fashion Campaign"
              className="absolute inset-0 h-full w-auto mx-auto object-contain object-bottom drop-shadow-[0_24px_48px_rgba(0,0,0,0.85)] filter pointer-events-none select-none will-change-transform"
              style={{ opacity: index === 0 ? 1 : 0 }}
              loading={index <= 1 ? "eager" : "lazy"}
              decoding="async"
            />
          ))}
        </div>
      </motion.div>

      {/* Bottom Organic Double-Wave Value Strip & Carousel Controls - Lowered profile showcasing apparel */}
      <motion.div
        initial={{ opacity: 0, y: 55 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 w-full h-[126px] sm:h-[132px] lg:h-[140px] xl:h-[148px] shrink-0 overflow-hidden select-none"
      >
        {/* Layer 1 & 2: SVG Double-Curved Wave Canvas */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          <svg
            viewBox="0 0 1440 145"
            preserveAspectRatio="none"
            className="w-full h-full block"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              {/* Metallic Gold Accent Gradient */}
              <linearGradient id="waveGoldRim" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B37E26" />
                <stop offset="18%" stopColor="#E2B45A" />
                <stop offset="35%" stopColor="#F8DE97" />
                <stop offset="50%" stopColor="#D4A13E" />
                <stop offset="70%" stopColor="#F5D890" />
                <stop offset="85%" stopColor="#DEAC4F" />
                <stop offset="100%" stopColor="#A67320" />
              </linearGradient>

              {/* Rich Forest Green Card Gradient */}
              <linearGradient id="richGreenCard" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#102615" />
                <stop offset="30%" stopColor="#17381F" />
                <stop offset="70%" stopColor="#1C4225" />
                <stop offset="100%" stopColor="#0F2414" />
              </linearGradient>

              {/* Tactile Green Linen Weave Pattern */}
              <pattern id="greenLinenPattern" width="4" height="4" patternUnits="userSpaceOnUse">
                <path d="M 0 2 L 4 2 M 2 0 L 2 4" stroke="#25522E" strokeWidth="0.5" opacity="0.35" />
              </pattern>

              {/* Warm Textured Ivory / Ecru Canvas Gradient */}
              <linearGradient id="ivoryLinenCanvas" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F7F2E9" />
                <stop offset="25%" stopColor="#EFE8DC" />
                <stop offset="75%" stopColor="#ECE4D6" />
                <stop offset="100%" stopColor="#E5DDCF" />
              </linearGradient>

              {/* Subtle Ivory Canvas Weave Pattern */}
              <pattern id="linenTexturePattern" width="4" height="4" patternUnits="userSpaceOnUse">
                <path d="M 0 2 L 4 2 M 2 0 L 2 4" stroke="#D3C9B8" strokeWidth="0.5" opacity="0.32" />
              </pattern>

              {/* Soft Drop Shadow for Floating Ivory Wave Canvas */}
              <filter id="waveShadow" x="-5%" y="-20%" width="110%" height="140%">
                <feDropShadow dx="0" dy="-3" stdDeviation="4.5" floodColor="#000000" floodOpacity="0.45" />
              </filter>
            </defs>

            {/* Layer 1: Green Card Under the Wave (Organic curved ribbon under the photo, visible behind crests & bottom corners) */}
            <path
              d="M 0 24 C 90 22, 165 4, 250 4 C 380 4, 560 40, 740 40 C 860 40, 960 16, 1060 16 C 1200 16, 1340 50, 1440 52 L 1440 145 L 0 145 Z"
              fill="url(#richGreenCard)"
            />
            {/* Green Card Linen Weave Overlay */}
            <path
              d="M 0 24 C 90 22, 165 4, 250 4 C 380 4, 560 40, 740 40 C 860 40, 960 16, 1060 16 C 1200 16, 1340 50, 1440 52 L 1440 145 L 0 145 Z"
              fill="url(#greenLinenPattern)"
            />

            {/* Green Card Upper Gold Hairline Border against Hero Background */}
            <path
              d="M 0 24 C 90 22, 165 4, 250 4 C 380 4, 560 40, 740 40 C 860 40, 960 16, 1060 16 C 1200 16, 1340 50, 1440 52"
              fill="none"
              stroke="url(#waveGoldRim)"
              strokeWidth="1.5"
              opacity="0.9"
            />

            {/* Delicate Bespoke Hairline Accent Swoosh Loop in the Green Card above Crest 1 */}
            <path
              d="M 140 22 C 220 8, 330 4, 430 16"
              fill="none"
              stroke="url(#waveGoldRim)"
              strokeWidth="0.95"
              opacity="0.6"
            />

            {/* Layer 2: Front Ivory Parchment Wave Canvas transitioning into Cream Collection */}
            <path
              d="M 0 42 C 90 40, 165 18, 250 18 C 380 18, 560 74, 740 74 C 860 74, 960 34, 1060 34 C 1200 34, 1340 72, 1440 74 L 1440 145 L 0 145 Z"
              fill="url(#ivoryLinenCanvas)"
              filter="url(#waveShadow)"
            />
            {/* Canvas Weave Overlay */}
            <path
              d="M 0 42 C 90 40, 165 18, 250 18 C 380 18, 560 74, 740 74 C 860 74, 960 34, 1060 34 C 1200 34, 1340 72, 1440 74 L 1440 145 L 0 145 Z"
              fill="url(#linenTexturePattern)"
            />

            {/* Front Ivory Wave Top Luminous Gold Border Rim */}
            <path
              d="M 0 42 C 90 40, 165 18, 250 18 C 380 18, 560 74, 740 74 C 860 74, 960 34, 1060 34 C 1200 34, 1340 72, 1440 74"
              fill="none"
              stroke="url(#waveGoldRim)"
              strokeWidth="2.2"
            />
          </svg>
        </div>

        {/* Left Corner Botanical Leaves - Flawless, enlarged premium botanical leaves with zero line breaks */}
        <motion.div
          initial={{ opacity: 0, scale: 0.72, x: -28, y: 22, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
          transition={{ duration: 1.1, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "bottom left" }}
          className="absolute -left-2 sm:left-0 bottom-0 pointer-events-none z-20 w-[124px] sm:w-[138px] lg:w-[155px] xl:w-[170px] h-auto select-none will-change-transform"
        >
          <svg viewBox="0 0 190 145" fill="none" className="w-full h-auto drop-shadow-[0_8px_22px_rgba(0,0,0,0.65)]">
            <defs>
              <linearGradient id="leafDeepGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#09140C" />
                <stop offset="40%" stopColor="#122715" />
                <stop offset="80%" stopColor="#1C3C20" />
                <stop offset="100%" stopColor="#0B170E" />
              </linearGradient>
              <linearGradient id="leafLitGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#152B19" />
                <stop offset="50%" stopColor="#28502F" />
                <stop offset="85%" stopColor="#35653C" />
                <stop offset="100%" stopColor="#19331D" />
              </linearGradient>
              {/* Lower Hero Leaf Gradients - Lush, broad & premium */}
              <linearGradient id="leafLowerDeepGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#071209" />
                <stop offset="30%" stopColor="#112614" />
                <stop offset="70%" stopColor="#1D3E21" />
                <stop offset="100%" stopColor="#0A180D" />
              </linearGradient>
              <linearGradient id="leafLowerShine" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#316337" stopOpacity="0.85" />
                <stop offset="45%" stopColor="#418049" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#16301A" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="leafLowerShadow" x1="0%" y1="30%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#050C06" stopOpacity="0" />
                <stop offset="50%" stopColor="#060E07" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#040804" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="goldVeinL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F9E29D" />
                <stop offset="35%" stopColor="#E0AE4B" />
                <stop offset="70%" stopColor="#F3D37F" />
                <stop offset="100%" stopColor="#A87522" />
              </linearGradient>

              {/* Exact ClipPaths Guaranteeing Zero Line Breaks or Whisker Protrusions */}
              <clipPath id="leftUpperLeafClip">
                <path d="M 0 30 C 35 18, 80 12, 142 16 C 88 34, 42 42, 0 38 Z" />
              </clipPath>
              <clipPath id="leftLowerLeafClip">
                <path d="M 0 44 C 42 46, 84 68, 116 120 C 82 134, 40 120, 0 74 Z" />
              </clipPath>
            </defs>

            {/* Leaf 1 (Upper Leaf - Arching up-right along wave contour) */}
            <g>
              {/* 1. Base Leaf Body Fill */}
              <path
                d="M 0 30 C 35 18, 80 12, 142 16 C 88 34, 42 42, 0 38 Z"
                fill="url(#leafDeepGreen)"
              />
              {/* 2. Upper Lit Sheen Overlay */}
              <path
                d="M 0 30 C 35 18, 80 12, 142 16 C 82 18, 38 25, 0 34 Z"
                fill="url(#leafLitGreen)"
                opacity="0.65"
              />
              {/* 3. Strictly Clipped Interior: Veins & Central Rachis */}
              <g clipPath="url(#leftUpperLeafClip)">
                <path
                  d="M -5 34 C 40 25, 84 17, 142 16"
                  stroke="url(#goldVeinL)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M 24 30 C 30 21, 38 18, 48 18
                     M 46 25 C 54 18, 64 15, 74 15
                     M 70 21 C 78 15, 88 13, 98 14
                     M 92 18 C 100 14, 110 13, 120 14
                     M 112 17 C 120 15, 128 15, 134 15.5
                     M 26 31 C 32 37, 40 40, 48 40
                     M 48 26 C 56 33, 66 36, 76 35
                     M 72 22 C 80 27, 90 28, 100 28
                     M 94 19 C 102 23, 112 24, 122 23
                     M 114 17 C 120 20, 128 21, 134 19"
                  stroke="url(#goldVeinL)"
                  strokeWidth="0.85"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              </g>
              {/* 4. Gilded Perimeter Stroke On Top */}
              <path
                d="M 0 30 C 35 18, 80 12, 142 16 C 88 34, 42 42, 0 38 Z"
                fill="none"
                stroke="url(#goldVeinL)"
                strokeWidth="1.0"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* Leaf 2 (Enlarged Hero Lower Leaf - Lush, full & unbroken contour) */}
            <g>
              {/* 1. Base Leaf Body Fill */}
              <path
                d="M 0 44 C 42 46, 84 68, 116 120 C 82 134, 40 120, 0 74 Z"
                fill="url(#leafLowerDeepGreen)"
              />
              {/* 2. Soft Upper Sheen Layer */}
              <path
                d="M 0 44 C 42 46, 84 68, 116 120 C 78 86, 42 60, 0 58 Z"
                fill="url(#leafLowerShine)"
                opacity="0.65"
              />
              {/* 3. Soft Lower Shadow Layer */}
              <path
                d="M 0 58 C 42 60, 78 86, 116 120 C 82 134, 40 120, 0 74 Z"
                fill="url(#leafLowerShadow)"
                opacity="0.5"
              />
              {/* 4. Strictly Clipped Interior: Curvier Organic Veins & Central Rachis */}
              <g clipPath="url(#leftLowerLeafClip)">
                <path
                  d="M -5 56 C 38 52, 76 82, 116 120"
                  stroke="url(#goldVeinL)"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                />
                <path
                  d="M 20 57 C 23 48, 29 44, 38 45
                     M 36 60 C 41 51, 49 47, 60 48
                     M 53 64 C 59 55, 69 52, 82 54
                     M 70 70 C 77 61, 87 59, 100 62
                     M 87 77 C 94 69, 105 68, 118 72
                     M 104 85 C 111 78, 120 78, 130 84
                     M 118 93 C 123 88, 130 89, 136 94
                     M 20 57 C 22 72, 28 82, 34 88
                     M 36 60 C 40 76, 48 90, 56 98
                     M 53 64 C 58 82, 68 96, 76 106
                     M 70 70 C 76 88, 86 102, 94 112
                     M 87 77 C 93 92, 102 105, 110 114
                     M 104 85 C 110 98, 118 108, 124 114
                     M 118 93 C 122 101, 128 107, 132 110"
                  stroke="url(#goldVeinL)"
                  strokeWidth="1.0"
                  strokeLinecap="round"
                  opacity="0.95"
                />
              </g>
              {/* 5. Gilded Leaf Perimeter Outline On Top (Flawless continuous gold rim) */}
              <path
                d="M 0 44 C 42 46, 84 68, 116 120 C 82 134, 40 120, 0 74 Z"
                fill="none"
                stroke="url(#goldVeinL)"
                strokeWidth="1.15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </motion.div>

        {/* Right Corner Botanical Leaves - Exactly 3 seamless botanical leaves including warm amber leaf */}
        <motion.div
          initial={{ opacity: 0, scale: 0.72, x: 28, y: 22, rotate: 8 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
          transition={{ duration: 1.1, delay: 0.82, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "bottom right" }}
          className="absolute right-0 bottom-0 pointer-events-none z-20 w-[115px] sm:w-[130px] lg:w-[145px] xl:w-[160px] h-auto select-none will-change-transform"
        >
          <svg viewBox="0 0 180 145" fill="none" className="w-full h-auto drop-shadow-[0_8px_22px_rgba(0,0,0,0.65)]">
            <defs>
              <linearGradient id="leafDeepGreenR" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#09140C" />
                <stop offset="40%" stopColor="#122715" />
                <stop offset="80%" stopColor="#1C3C20" />
                <stop offset="100%" stopColor="#0B170E" />
              </linearGradient>
              <linearGradient id="leafLitGreenR" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#152B19" />
                <stop offset="50%" stopColor="#28502F" />
                <stop offset="85%" stopColor="#35653C" />
                <stop offset="100%" stopColor="#19331D" />
              </linearGradient>
              <linearGradient id="goldVeinR" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F9E29D" />
                <stop offset="35%" stopColor="#E0AE4B" />
                <stop offset="70%" stopColor="#F3D37F" />
                <stop offset="100%" stopColor="#A87522" />
              </linearGradient>
              {/* Warm Autumn Amber Leaf Gradients */}
              <linearGradient id="leafDeepAmber" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6C420D" />
                <stop offset="50%" stopColor="#9B6619" />
                <stop offset="100%" stopColor="#B87D25" />
              </linearGradient>
              <linearGradient id="leafLitAmber" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8F5C16" />
                <stop offset="45%" stopColor="#C9943B" />
                <stop offset="85%" stopColor="#E2B755" />
                <stop offset="100%" stopColor="#9C6B1C" />
              </linearGradient>
              <linearGradient id="amberVein" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F2D179" />
                <stop offset="50%" stopColor="#D4A038" />
                <stop offset="100%" stopColor="#7E5212" />
              </linearGradient>
            </defs>

            {/* Leaf 3: Bottom Warm Amber Leaf (Nestled beneath the middle leaf) */}
            <g>
              {/* Unified Amber Silhouette */}
              <path
                d="M 180 84 C 142 94, 102 112, 64 132 C 96 142, 140 138, 180 120 Z"
                fill="url(#leafDeepAmber)"
                stroke="#E2B755"
                strokeWidth="0.75"
              />
              {/* Upper Lit Amber Sheen Overlay */}
              <path
                d="M 180 84 C 142 94, 102 112, 64 132 C 100 124, 140 112, 180 102 Z"
                fill="url(#leafLitAmber)"
                opacity="0.8"
              />
              {/* Central Amber-Gold Spine */}
              <path
                d="M 180 102 C 140 112, 100 124, 64 132"
                stroke="url(#amberVein)"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              {/* Amber Lateral Veins */}
              <path
                d="M 166 104 Q 158 96 148 94
                   M 148 110 Q 138 102 126 100
                   M 126 116 Q 116 108 104 108
                   M 104 122 Q 94 116 84 118
                   M 82 127 Q 76 123 70 126
                   M 166 106 Q 160 118 152 124
                   M 146 112 Q 138 126 128 132
                   M 124 118 Q 116 128 106 134
                   M 102 124 Q 96 132 88 135
                   M 82 129 Q 76 133 72 134"
                stroke="url(#amberVein)"
                strokeWidth="0.85"
                strokeLinecap="round"
                opacity="0.95"
              />
            </g>

            {/* Leaf 2: Dominant Middle Hero Leaf (Sweeping down-left towards circular button) */}
            <g>
              {/* Unified Green Leaf Body */}
              <path
                d="M 180 50 C 125 54, 70 72, 14 95 C 65 116, 125 110, 180 78 Z"
                fill="url(#leafDeepGreenR)"
                stroke="url(#goldVeinR)"
                strokeWidth="0.85"
              />
              {/* Upper Lit Sheen Overlay */}
              <path
                d="M 180 50 C 125 54, 70 72, 14 95 C 68 84, 124 70, 180 64 Z"
                fill="url(#leafLitGreenR)"
                opacity="0.65"
              />
              {/* Golden Central Spine pointing at the arrow button */}
              <path
                d="M 180 64 C 124 70, 68 84, 14 95"
                stroke="url(#goldVeinR)"
                strokeWidth="2.0"
                strokeLinecap="round"
              />
              {/* Crisp Herringbone Lateral Gold Veins */}
              <path
                d="M 164 67 Q 152 58 138 56
                   M 142 71 Q 128 62 114 60
                   M 118 75 Q 102 66 88 66
                   M 92 80 Q 76 72 62 73
                   M 66 85 Q 52 79 38 82
                   M 40 90 Q 30 86 22 89
                   M 166 70 Q 158 84 146 94
                   M 144 74 Q 132 90 120 102
                   M 120 78 Q 106 94 94 105
                   M 94 82 Q 80 96 70 106
                   M 68 87 Q 56 98 46 103
                   M 42 92 Q 32 98 24 100"
                stroke="url(#goldVeinR)"
                strokeWidth="0.85"
                strokeLinecap="round"
                opacity="0.9"
              />
            </g>

            {/* Leaf 1: Top Leaf (Arching up-left along top wave slope) */}
            <g>
              {/* Unified Leaf Body */}
              <path
                d="M 180 18 C 146 8, 114 4, 82 4 C 114 18, 146 26, 180 28 Z"
                fill="url(#leafDeepGreenR)"
                stroke="url(#goldVeinR)"
                strokeWidth="0.7"
              />
              {/* Upper Lit Sheen Overlay */}
              <path
                d="M 180 18 C 146 8, 114 4, 82 4 C 112 8, 145 14, 180 23 Z"
                fill="url(#leafLitGreenR)"
                opacity="0.65"
              />
              {/* Golden Central Spine */}
              <path
                d="M 180 23 C 145 14, 112 8, 82 4"
                stroke="url(#goldVeinR)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Lateral Gold Veins */}
              <path
                d="M 162 20 Q 150 14 136 12
                   M 140 16 Q 128 10 114 8
                   M 116 11 Q 104 7 92 6
                   M 162 22 Q 152 26 140 27
                   M 142 18 Q 130 22 118 22
                   M 118 13 Q 106 17 94 16"
                stroke="url(#goldVeinR)"
                strokeWidth="0.8"
                strokeLinecap="round"
                opacity="0.9"
              />
            </g>
          </svg>
        </motion.div>

        {/* Content: 4 Columns & Controls inside Ivory Canvas Wave - Generous clearance & harmonious spacing */}
        <div className="relative z-30 w-full h-full pl-8 pr-6 sm:pl-14 sm:pr-10 md:pl-18 md:pr-14 lg:pl-24 xl:pl-28 lg:pr-24 xl:pr-32 pt-[70px] sm:pt-[56px] lg:pt-[60px] xl:pt-[62px] pb-2 sm:pb-3.5 lg:pb-4 flex items-center">
          {/* Desktop Single-Row Layout (lg and above) */}
          <div className="hidden lg:flex items-center justify-between w-full gap-2 xl:gap-4">
            {/* Col 1: Premium Fabrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="group flex items-center gap-2.5 xl:gap-3 select-none cursor-default shrink-0"
            >
              <QuiltedFabricIcon className="w-7 h-7 xl:w-8 xl:h-8 text-[#543818] shrink-0 group-hover:scale-105 transition-transform duration-200" />
              <div className="text-left">
                <div className="font-editorial text-[#1E1914] text-[14px] xl:text-[15.5px] font-medium leading-snug group-hover:text-[#8C5E24] transition-colors duration-200">
                  Premium Fabrics
                </div>
                <div className="text-[#736B5E] text-[9px] xl:text-[9.5px] tracking-[0.16em] uppercase font-sans font-medium mt-0.5 leading-none">
                  FOR EVERYDAY WEAR
                </div>
              </div>
            </motion.div>

            {/* Hairline Divider */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, delay: 0.78, ease: [0.16, 1, 0.3, 1] }}
              className="w-[1px] h-7 xl:h-8 bg-[#C5BCAD]/85 shrink-0 mx-1 xl:mx-2.5"
            />

            {/* Col 2: Authentic Tribal Designs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group flex items-center gap-2.5 xl:gap-3 select-none cursor-default shrink-0"
            >
              <ConcentricTribalSunIcon className="w-7 h-7 xl:w-8 xl:h-8 text-[#543818] shrink-0 group-hover:scale-105 transition-transform duration-200" />
              <div className="text-left">
                <div className="font-editorial text-[#1E1914] text-[14px] xl:text-[15.5px] font-medium leading-snug group-hover:text-[#8C5E24] transition-colors duration-200">
                  Authentic Tribal Designs
                </div>
                <div className="text-[#736B5E] text-[9px] xl:text-[9.5px] tracking-[0.16em] uppercase font-sans font-medium mt-0.5 leading-none">
                  ROOTED IN CULTURE
                </div>
              </div>
            </motion.div>

            {/* Hairline Divider */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, delay: 0.88, ease: [0.16, 1, 0.3, 1] }}
              className="w-[1px] h-7 xl:h-8 bg-[#C5BCAD]/85 shrink-0 mx-1 xl:mx-2.5"
            />

            {/* Col 3: Custom & Bulk Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="group flex items-center gap-2.5 xl:gap-3 select-none cursor-default shrink-0"
            >
              <TailorShirtIcon className="w-7 h-7 xl:w-8 xl:h-8 text-[#543818] shrink-0 group-hover:scale-105 transition-transform duration-200" />
              <div className="text-left">
                <div className="font-editorial text-[#1E1914] text-[14px] xl:text-[15.5px] font-medium leading-snug group-hover:text-[#8C5E24] transition-colors duration-200">
                  Custom & Bulk Orders
                </div>
                <div className="text-[#736B5E] text-[9px] xl:text-[9.5px] tracking-[0.16em] uppercase font-sans font-medium mt-0.5 leading-none">
                  FOR TEAMS & BUSINESSES
                </div>
              </div>
            </motion.div>

            {/* Hairline Divider */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, delay: 0.98, ease: [0.16, 1, 0.3, 1] }}
              className="w-[1px] h-7 xl:h-8 bg-[#C5BCAD]/85 shrink-0 mx-1 xl:mx-2.5"
            />

            {/* Col 4: Proudly from Jharkhand, India */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="group flex items-center gap-2.5 xl:gap-3 select-none cursor-default shrink-0 mr-4 lg:mr-8 xl:mr-12"
            >
              <JharkhandMapIcon className="w-7 h-7 xl:w-8 xl:h-8 text-[#543818] shrink-0 group-hover:scale-105 transition-transform duration-200" />
              <div className="text-left">
                <div className="font-editorial text-[#1E1914] text-[14px] xl:text-[15.5px] font-medium leading-tight group-hover:text-[#8C5E24] transition-colors duration-200">
                  Proudly from
                </div>
                <div className="font-editorial text-[#1E1914] text-[14px] xl:text-[15.5px] font-medium leading-tight group-hover:text-[#8C5E24] transition-colors duration-200 mt-0.5">
                  Jharkhand, India
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile & Tablet 2x2 Clean Responsive Grid (under lg) */}
          <div className="flex lg:hidden flex-col gap-2.5 w-full">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
              {/* Item 1 */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 pl-1.5 sm:pl-0">
                <QuiltedFabricIcon className="w-5 h-5 sm:w-7 sm:h-7 text-[#543818] shrink-0" />
                <div className="text-left">
                  <div className="font-editorial text-[#1E1914] text-[11px] sm:text-[13px] font-medium leading-tight">
                    Premium Fabrics
                  </div>
                  <div className="text-[#736B5E] text-[7px] sm:text-[8.5px] tracking-wider uppercase font-sans font-medium leading-none mt-0.5">
                    FOR EVERYDAY WEAR
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 pl-2 sm:pl-3 border-l border-[#D3C7B5]/80">
                <ConcentricTribalSunIcon className="w-5 h-5 sm:w-7 sm:h-7 text-[#543818] shrink-0" />
                <div className="text-left">
                  <div className="font-editorial text-[#1E1914] text-[11px] sm:text-[13px] font-medium leading-tight">
                    Authentic Tribal Designs
                  </div>
                  <div className="text-[#736B5E] text-[7px] sm:text-[8.5px] tracking-wider uppercase font-sans font-medium leading-none mt-0.5">
                    ROOTED IN CULTURE
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 pl-1.5 sm:pl-0 pt-1.5 border-t border-[#D3C7B5]/80">
                <TailorShirtIcon className="w-5 h-5 sm:w-7 sm:h-7 text-[#543818] shrink-0" />
                <div className="text-left">
                  <div className="font-editorial text-[#1E1914] text-[11px] sm:text-[13px] font-medium leading-tight">
                    Custom & Bulk Orders
                  </div>
                  <div className="text-[#736B5E] text-[7px] sm:text-[8.5px] tracking-wider uppercase font-sans font-medium leading-none mt-0.5">
                    FOR TEAMS & BUSINESSES
                  </div>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 pl-2 sm:pl-3 pt-1.5 border-l border-t border-[#D3C7B5]/80">
                <JharkhandMapIcon className="w-5 h-5 sm:w-7 sm:h-7 text-[#543818] shrink-0" />
                <div className="text-left">
                  <div className="font-editorial text-[#1E1914] text-[11px] sm:text-[13px] font-medium leading-tight">
                    Proudly from
                  </div>
                  <div className="font-editorial text-[#1E1914] text-[11px] sm:text-[13px] font-medium leading-tight">
                    Jharkhand, India
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
