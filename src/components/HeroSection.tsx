"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
  const modelsEntranceRef = useRef<HTMLDivElement>(null);
  const modelsRigRef = useRef<HTMLDivElement>(null);
  const outfitImagesRef = useRef<(HTMLImageElement | null)[]>([]);

  // 1. Initial GSAP Pop-up Entrance and Continuous Premium Circular Orbit
  useEffect(() => {
    const entranceEl = modelsEntranceRef.current;
    const rigEl = modelsRigRef.current;
    if (!entranceEl || !rigEl) return;

    const ctx = gsap.context(() => {
      // Hidden initial setup
      gsap.set(entranceEl, {
        opacity: 0,
        y: 65,
        scale: 0.95,
        transformOrigin: "bottom center",
      });

      // Smooth Pop-up Entrance - firmly anchored
      const tl = gsap.timeline({ delay: 0.3 });
      tl.to(entranceEl, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
      });
    }, heroSectionRef);

    return () => ctx.revert();
  }, []);

  // 2. Figma-Style Circular Arc Transition between outfits
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

  // 3. Autoplay outfit cycle every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev === totalSlides ? 1 : prev + 1));
    }, 4500);

    return () => clearInterval(timer);
  }, [totalSlides]);

  const handlePrev = () => {
    setSlide((prev) => (prev === 1 ? totalSlides : prev - 1));
  };

  const handleNext = () => {
    setSlide((prev) => (prev === totalSlides ? 1 : prev + 1));
  };

  return (
    <section
      ref={heroSectionRef}
      className="relative w-full h-[100dvh] min-h-[640px] max-h-[1080px] flex flex-col justify-between overflow-hidden select-none isolate"
    >
      {/* Background Photographic Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-clean-bg.jpg"
          alt="Fittee Tribal Fashion Campaign Jharkhand"
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
        />

        {/* Cinematic Vignette Layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 sm:via-black/25 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/95 via-black/55 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      </div>

      {/* Top Floating Organic Navigation */}
      <Navbar />

      {/* Main Hero Content Area */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-between px-6 sm:px-10 lg:px-14 my-auto">
        {/* Left Typographic Showcase */}
        <div className="max-w-md sm:max-w-xl lg:max-w-2xl text-left">
          {/* Eyebrow Tag */}
          <div className="flex items-center gap-3 mb-3.5 sm:mb-5">
            <span className="text-[11px] sm:text-[11.5px] font-semibold tracking-[0.24em] text-[#C9BAA7] uppercase">
              TRIBAL ROOTS
            </span>
            <span className="w-8 sm:w-10 h-[1px] bg-[#D49B42] inline-block opacity-90" />
            <span className="text-[11px] sm:text-[11.5px] font-semibold tracking-[0.24em] text-[#C9BAA7] uppercase">
              MODERN WEAR
            </span>
          </div>

          {/* Main Display Headline */}
          <h1 className="font-editorial text-5xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[80px] font-bold text-white tracking-tight leading-[1.04] drop-shadow-[0_3px_12px_rgba(0,0,0,0.6)]">
            <span className="block text-white">Wear Your</span>
            <span className="block text-[#DDA23E] italic font-normal tracking-tight my-0.5 sm:my-1">
              Culture
            </span>
            <span className="block text-white">With Pride.</span>
          </h1>

          {/* Subtitle / Description */}
          <p className="mt-4 sm:mt-5 text-[#DDD5C7] text-sm sm:text-base lg:text-[16px] max-w-sm sm:max-w-md font-normal leading-relaxed drop-shadow-sm">
            Contemporary apparel inspired by the tribal art and spirit of Jharkhand.
          </p>

          {/* Dual Action Buttons */}
          <div className="mt-6 sm:mt-8 flex items-center gap-3 sm:gap-4">
            {/* Primary Mustard Button */}
            <Link
              href="#shop"
              className="inline-flex items-center gap-2 bg-[#E2A33C] hover:bg-[#D49533] text-[#1A1612] font-semibold text-xs sm:text-sm px-6 sm:px-7 py-2.5 sm:py-3 rounded-full shadow-[0_4px_16px_rgba(226,163,60,0.3)] transition-all duration-150 active:scale-95"
            >
              <span>Shop Collection</span>
              <span className="text-sm font-bold">→</span>
            </Link>

            {/* Ghost Transparent Button */}
            <Link
              href="#customize"
              className="inline-flex items-center gap-2 bg-black/35 hover:bg-white/10 text-white font-medium text-xs sm:text-sm px-6 sm:px-7 py-2.5 sm:py-3 rounded-full border border-white/50 hover:border-white/80 backdrop-blur-sm transition-all duration-150 active:scale-95"
            >
              <span>Customize Now</span>
              <span className="text-sm font-bold opacity-80">→</span>
            </Link>
          </div>
        </div>

        {/* Right Vertical Editorial Annotation */}
        <div
          className="hidden xl:flex items-start gap-3.5 absolute right-6 xl:right-10 top-20 xl:top-24 select-none pointer-events-none z-20"
          aria-hidden="true"
        >
          {/* Vertical Hairline Divider */}
          <div className="w-[1px] h-20 bg-gradient-to-b from-white/40 via-white/20 to-transparent mt-1" />

          {/* Slanted Editorial Text */}
          <div className="font-editorial italic text-[#EDE5D8]/85 text-sm xl:text-[15px] leading-tight tracking-wide">
            <div>People</div>
            <div>Roots</div>
            <div>Stories</div>
            <div>On Fabric</div>
          </div>
        </div>
      </div>

      {/* Center-Right: Multi-Outfit Showcase Anchored at Bottom Behind Wave Banner */}
      <div
        ref={modelsEntranceRef}
        className="hidden md:flex absolute right-0 lg:right-4 xl:right-12 2xl:right-20 bottom-0 h-[74vh] max-h-[640px] lg:max-h-[700px] xl:max-h-[780px] 2xl:max-h-[850px] w-[50vw] max-w-[720px] pointer-events-none select-none z-10 items-end justify-center"
      >
        {/* Inner Motion Rig */}
        <div
          ref={modelsRigRef}
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
              loading="eager"
            />
          ))}
        </div>
      </div>

      {/* Bottom Organic Double-Wave Value Strip & Carousel Controls */}
      <div className="relative z-20 w-full overflow-hidden select-none">
        {/* Layer 1 & 2: SVG Double-Curved Wave Canvas */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          <svg
            viewBox="0 0 1440 160"
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

              {/* Deep Moss / Charcoal Linen Back Ribbon Gradient */}
              <linearGradient id="darkMossRibbon" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#152115" />
                <stop offset="45%" stopColor="#1A281A" />
                <stop offset="100%" stopColor="#111911" />
              </linearGradient>

              {/* Warm Textured Ivory / Ecru Canvas Gradient */}
              <linearGradient id="ivoryLinenCanvas" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F6F1E8" />
                <stop offset="25%" stopColor="#EFE8DC" />
                <stop offset="75%" stopColor="#ECE4D6" />
                <stop offset="100%" stopColor="#E5DDCF" />
              </linearGradient>

              {/* Subtle Organic Canvas Weave Pattern */}
              <pattern id="linenTexturePattern" width="4" height="4" patternUnits="userSpaceOnUse">
                <path d="M 0 2 L 4 2 M 2 0 L 2 4" stroke="#D3C9B8" strokeWidth="0.5" opacity="0.3" />
              </pattern>

              {/* Soft Drop Shadow for Ivory Wave Crest */}
              <filter id="waveShadow" x="-5%" y="-20%" width="110%" height="140%">
                <feDropShadow dx="0" dy="-4" stdDeviation="6" floodColor="#000000" floodOpacity="0.45" />
              </filter>
            </defs>

            {/* Layer 1: Back Deep Moss Green Ribbon */}
            <path
              d="M 0 72 C 160 48, 300 42, 460 58 C 620 74, 760 38, 910 28 C 1060 18, 1220 42, 1340 52 C 1390 56, 1420 58, 1440 60 L 1440 160 L 0 160 Z"
              fill="url(#darkMossRibbon)"
            />
            {/* Back Ribbon Gold Hairline Upper Border */}
            <path
              d="M 0 72 C 160 48, 300 42, 460 58 C 620 74, 760 38, 910 28 C 1060 18, 1220 42, 1340 52 C 1390 56, 1420 58, 1440 60"
              fill="none"
              stroke="url(#waveGoldRim)"
              strokeWidth="1.4"
              opacity="0.85"
            />

            {/* Subtle Bespoke Hairline Accent Loop above wave */}
            <path
              d="M 180 62 C 260 45, 340 40, 440 56"
              fill="none"
              stroke="url(#waveGoldRim)"
              strokeWidth="0.9"
              opacity="0.55"
            />

            {/* Layer 2: Front Warm Ivory Canvas Wave */}
            <path
              d="M 0 80 C 130 96, 250 68, 370 52 C 490 38, 610 46, 730 70 C 830 88, 920 95, 1020 76 C 1120 54, 1230 36, 1330 48 C 1380 54, 1415 62, 1440 66 L 1440 160 L 0 160 Z"
              fill="url(#ivoryLinenCanvas)"
              filter="url(#waveShadow)"
            />
            {/* Canvas Weave Overlay */}
            <path
              d="M 0 80 C 130 96, 250 68, 370 52 C 490 38, 610 46, 730 70 C 830 88, 920 95, 1020 76 C 1120 54, 1230 36, 1330 48 C 1380 54, 1415 62, 1440 66 L 1440 160 L 0 160 Z"
              fill="url(#linenTexturePattern)"
            />
            {/* Front Ivory Wave Luminous Gold Border Rim */}
            <path
              d="M 0 80 C 130 96, 250 68, 370 52 C 490 38, 610 46, 730 70 C 830 88, 920 95, 1020 76 C 1120 54, 1230 36, 1330 48 C 1380 54, 1415 62, 1440 66"
              fill="none"
              stroke="url(#waveGoldRim)"
              strokeWidth="2.2"
            />
          </svg>
        </div>

        {/* Left Corner Botanical Leaves */}
        <div className="absolute left-0 bottom-0 pointer-events-none z-10 w-[90px] sm:w-[115px] lg:w-[140px] xl:w-[160px] h-auto select-none">
          <svg viewBox="0 0 160 140" fill="none" className="w-full h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.55)]">
            <defs>
              <linearGradient id="leafGradLeft1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#101A10" />
                <stop offset="50%" stopColor="#1C2D1D" />
                <stop offset="100%" stopColor="#0B130C" />
              </linearGradient>
              <linearGradient id="leafGradLeft2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#172618" />
                <stop offset="50%" stopColor="#253C27" />
                <stop offset="100%" stopColor="#111B12" />
              </linearGradient>
              <linearGradient id="goldVeinLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5D48E" />
                <stop offset="50%" stopColor="#D9A349" />
                <stop offset="100%" stopColor="#AF7C26" />
              </linearGradient>
            </defs>
            {/* Upper Leaf pointing up-right */}
            <g transform="translate(-10, 42) rotate(-16)">
              <path d="M 0 0 C 35 -28, 85 -32, 125 -8 C 90 22, 40 18, 0 0 Z" fill="url(#leafGradLeft1)" stroke="#B3802C" strokeWidth="0.6" />
              <path d="M 0 0 C 45 -10, 85 -12, 125 -8" stroke="url(#goldVeinLeft)" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M 25 -3 L 40 -16 M 45 -6 L 65 -20 M 65 -8 L 88 -20 M 85 -9 L 108 -16" stroke="url(#goldVeinLeft)" strokeWidth="1" />
              <path d="M 25 -3 L 38 8 M 45 -6 L 62 6 M 65 -8 L 85 4 M 85 -9 L 105 -2" stroke="url(#goldVeinLeft)" strokeWidth="1" />
            </g>
            {/* Lower Leaf draping down-right */}
            <g transform="translate(-5, 68) rotate(24)">
              <path d="M 0 0 C 38 -28, 92 -30, 135 -6 C 98 25, 42 22, 0 0 Z" fill="url(#leafGradLeft2)" stroke="#B3802C" strokeWidth="0.6" />
              <path d="M 0 0 C 50 -10, 95 -10, 135 -6" stroke="url(#goldVeinLeft)" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M 28 -3 L 44 -17 M 50 -6 L 72 -20 M 72 -8 L 98 -19 M 95 -9 L 118 -15" stroke="url(#goldVeinLeft)" strokeWidth="1" />
              <path d="M 28 -3 L 42 10 M 50 -6 L 68 8 M 72 -8 L 94 6 M 95 -9 L 114 -1" stroke="url(#goldVeinLeft)" strokeWidth="1" />
            </g>
          </svg>
        </div>

        {/* Right Corner Botanical Leaves */}
        <div className="absolute right-0 bottom-0 pointer-events-none z-10 w-[90px] sm:w-[115px] lg:w-[140px] xl:w-[160px] h-auto select-none">
          <svg viewBox="0 0 160 140" fill="none" className="w-full h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.55)]">
            <defs>
              <linearGradient id="leafGradRight1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#101A10" />
                <stop offset="50%" stopColor="#1C2D1D" />
                <stop offset="100%" stopColor="#0B130C" />
              </linearGradient>
              <linearGradient id="leafGradRight2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#172618" />
                <stop offset="50%" stopColor="#253C27" />
                <stop offset="100%" stopColor="#111B12" />
              </linearGradient>
              <linearGradient id="goldVeinRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5D48E" />
                <stop offset="50%" stopColor="#D9A349" />
                <stop offset="100%" stopColor="#AF7C26" />
              </linearGradient>
            </defs>
            {/* Upper Leaf pointing left */}
            <g transform="translate(170, 48) scale(-1, 1) rotate(18)">
              <path d="M 0 0 C 40 -32, 95 -35, 140 -8 C 100 26, 45 22, 0 0 Z" fill="url(#leafGradRight1)" stroke="#B3802C" strokeWidth="0.6" />
              <path d="M 0 0 C 50 -12, 100 -12, 140 -8" stroke="url(#goldVeinRight)" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M 30 -4 L 48 -19 M 55 -7 L 78 -22 M 80 -9 L 105 -20 M 102 -10 L 125 -15" stroke="url(#goldVeinRight)" strokeWidth="1" />
              <path d="M 30 -4 L 45 10 M 55 -7 L 74 8 M 80 -9 L 100 6 M 102 -10 L 120 -1" stroke="url(#goldVeinRight)" strokeWidth="1" />
            </g>
            {/* Lower Leaf pointing down-left */}
            <g transform="translate(165, 88) scale(-1, 1) rotate(-16)">
              <path d="M 0 0 C 35 -26, 85 -28, 125 -6 C 90 22, 40 18, 0 0 Z" fill="url(#leafGradRight2)" stroke="#B3802C" strokeWidth="0.6" />
              <path d="M 0 0 C 45 -10, 90 -10, 125 -6" stroke="url(#goldVeinRight)" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M 25 -3 L 40 -16 M 48 -6 L 68 -18 M 70 -7 L 92 -17 M 90 -8 L 110 -13" stroke="url(#goldVeinRight)" strokeWidth="1" />
              <path d="M 25 -3 L 38 8 M 48 -6 L 64 7 M 70 -7 L 88 5 M 90 -8 L 106 -1" stroke="url(#goldVeinRight)" strokeWidth="1" />
            </g>
          </svg>
        </div>

        {/* Content: 4 Columns & Controls inside Ivory Canvas Wave */}
        <div className="relative z-20 w-full pl-10 sm:pl-16 md:pl-20 lg:pl-24 xl:pl-28 pr-6 sm:pr-12 md:pr-16 lg:pr-20 xl:pr-24 pt-6 sm:pt-7 lg:pt-8 xl:pt-9 pb-3.5 sm:pb-4 lg:pb-4.5">
          {/* Desktop Single-Row Layout (lg and above) */}
          <div className="hidden lg:flex items-center justify-between w-full gap-2 xl:gap-4">
            {/* Col 1: Premium Fabrics */}
            <div className="group flex items-center gap-3 select-none cursor-default shrink-0">
              <QuiltedFabricIcon className="w-8 h-8 xl:w-9 xl:h-9 text-[#543818] shrink-0 group-hover:scale-105 transition-transform duration-200" />
              <div className="text-left">
                <div className="font-editorial text-[#1E1914] text-[14.5px] xl:text-[16px] font-medium leading-snug group-hover:text-[#8C5E24] transition-colors duration-200">
                  Premium Fabrics
                </div>
                <div className="text-[#736B5E] text-[9.5px] xl:text-[10px] tracking-[0.16em] uppercase font-sans font-medium mt-0.5 leading-none">
                  FOR EVERYDAY WEAR
                </div>
              </div>
            </div>

            {/* Hairline Divider */}
            <div className="w-[1px] h-8 xl:h-9 bg-[#C5BCAD] shrink-0 mx-1 xl:mx-3" />

            {/* Col 2: Authentic Tribal Designs */}
            <div className="group flex items-center gap-3 select-none cursor-default shrink-0">
              <ConcentricTribalSunIcon className="w-8 h-8 xl:w-9 xl:h-9 text-[#543818] shrink-0 group-hover:scale-105 transition-transform duration-200" />
              <div className="text-left">
                <div className="font-editorial text-[#1E1914] text-[14.5px] xl:text-[16px] font-medium leading-snug group-hover:text-[#8C5E24] transition-colors duration-200">
                  Authentic Tribal Designs
                </div>
                <div className="text-[#736B5E] text-[9.5px] xl:text-[10px] tracking-[0.16em] uppercase font-sans font-medium mt-0.5 leading-none">
                  ROOTED IN CULTURE
                </div>
              </div>
            </div>

            {/* Hairline Divider */}
            <div className="w-[1px] h-8 xl:h-9 bg-[#C5BCAD] shrink-0 mx-1 xl:mx-3" />

            {/* Col 3: Custom & Bulk Orders */}
            <div className="group flex items-center gap-3 select-none cursor-default shrink-0">
              <TailorShirtIcon className="w-8 h-8 xl:w-9 xl:h-9 text-[#543818] shrink-0 group-hover:scale-105 transition-transform duration-200" />
              <div className="text-left">
                <div className="font-editorial text-[#1E1914] text-[14.5px] xl:text-[16px] font-medium leading-snug group-hover:text-[#8C5E24] transition-colors duration-200">
                  Custom & Bulk Orders
                </div>
                <div className="text-[#736B5E] text-[9.5px] xl:text-[10px] tracking-[0.16em] uppercase font-sans font-medium mt-0.5 leading-none">
                  FOR TEAMS & BUSINESSES
                </div>
              </div>
            </div>

            {/* Hairline Divider */}
            <div className="w-[1px] h-8 xl:h-9 bg-[#C5BCAD] shrink-0 mx-1 xl:mx-3" />

            {/* Col 4: Proudly from Jharkhand, India */}
            <div className="group flex items-center gap-3 select-none cursor-default shrink-0">
              <JharkhandMapIcon className="w-8 h-8 xl:w-9 xl:h-9 text-[#543818] shrink-0 group-hover:scale-105 transition-transform duration-200" />
              <div className="text-left">
                <div className="font-editorial text-[#1E1914] text-[14.5px] xl:text-[16px] font-medium leading-tight group-hover:text-[#8C5E24] transition-colors duration-200">
                  Proudly from
                </div>
                <div className="font-editorial text-[#1E1914] text-[14.5px] xl:text-[16px] font-medium leading-tight group-hover:text-[#8C5E24] transition-colors duration-200 mt-0.5">
                  Jharkhand, India
                </div>
              </div>
            </div>

            {/* Circular Next Button (Control) */}
            <button
              type="button"
              onClick={handleNext}
              className="w-8 h-8 xl:w-9 xl:h-9 rounded-full border border-[#8C6D3B] hover:border-[#543818] hover:bg-[#543818]/10 text-[#543818] flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-105 cursor-pointer ml-2 xl:ml-4 shrink-0 focus:outline-none shadow-sm"
              aria-label="Next Outfit"
              title="Next outfit"
            >
              <svg className="w-3.5 h-3.5 xl:w-4 xl:h-4 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Mobile & Tablet 2x2 Clean Responsive Grid (under lg) */}
          <div className="flex lg:hidden flex-col gap-3 w-full">
            <div className="grid grid-cols-2 gap-3 w-full">
              {/* Item 1 */}
              <div className="flex items-center gap-2.5">
                <QuiltedFabricIcon className="w-7 h-7 text-[#543818] shrink-0" />
                <div className="text-left">
                  <div className="font-editorial text-[#1E1914] text-[13px] font-medium leading-snug">
                    Premium Fabrics
                  </div>
                  <div className="text-[#736B5E] text-[8.5px] tracking-wider uppercase font-sans font-medium leading-none mt-0.5">
                    FOR EVERYDAY WEAR
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center gap-2.5">
                <ConcentricTribalSunIcon className="w-7 h-7 text-[#543818] shrink-0" />
                <div className="text-left">
                  <div className="font-editorial text-[#1E1914] text-[13px] font-medium leading-snug">
                    Authentic Tribal Designs
                  </div>
                  <div className="text-[#736B5E] text-[8.5px] tracking-wider uppercase font-sans font-medium leading-none mt-0.5">
                    ROOTED IN CULTURE
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-center gap-2.5">
                <TailorShirtIcon className="w-7 h-7 text-[#543818] shrink-0" />
                <div className="text-left">
                  <div className="font-editorial text-[#1E1914] text-[13px] font-medium leading-snug">
                    Custom & Bulk Orders
                  </div>
                  <div className="text-[#736B5E] text-[8.5px] tracking-wider uppercase font-sans font-medium leading-none mt-0.5">
                    FOR TEAMS & BUSINESSES
                  </div>
                </div>
              </div>

              {/* Item 4 + Button */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <JharkhandMapIcon className="w-7 h-7 text-[#543818] shrink-0" />
                  <div className="text-left">
                    <div className="font-editorial text-[#1E1914] text-[13px] font-medium leading-snug">
                      Proudly from
                    </div>
                    <div className="font-editorial text-[#1E1914] text-[13px] font-medium leading-snug">
                      Jharkhand, India
                    </div>
                  </div>
                </div>

                {/* Next button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-7 h-7 rounded-full border border-[#8C6D3B] text-[#543818] flex items-center justify-center shrink-0 active:scale-90"
                  aria-label="Next Outfit"
                >
                  <svg className="w-3 h-3 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
