"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "./Navbar";
import {
  FabricLeafIcon,
  TribalSunIcon,
  IsometricBoxIcon,
  JharkhandMountainIcon,
} from "./Icons";

export function HeroSection() {
  const [slide, setSlide] = useState(1);
  const totalSlides = 3;

  const handlePrev = () => {
    setSlide((prev) => (prev === 1 ? totalSlides : prev - 1));
  };

  const handleNext = () => {
    setSlide((prev) => (prev === totalSlides ? 1 : prev + 1));
  };

  return (
    <section className="relative w-full h-[100dvh] min-h-[640px] max-h-[1080px] flex flex-col justify-between overflow-hidden select-none isolate">
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
        {/* Left Dark Gradient for Typography Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 sm:via-black/25 to-transparent pointer-events-none" />
        {/* Bottom Bar Depth Scrim */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
        {/* Top Header Scrim */}
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
          className="hidden lg:flex items-start gap-3.5 absolute right-8 xl:right-14 top-28 xl:top-32 select-none pointer-events-none"
          aria-hidden="true"
        >
          {/* Vertical Hairline Divider */}
          <div className="w-[1px] h-24 bg-gradient-to-b from-white/40 via-white/20 to-transparent mt-1" />

          {/* Slanted Editorial Text */}
          <div className="font-editorial italic text-[#EDE5D8]/85 text-base xl:text-[17px] leading-tight tracking-wide">
            <div>People</div>
            <div>Roots</div>
            <div>Stories</div>
            <div>On Fabric</div>
          </div>
        </div>
      </div>

      {/* Bottom Value Strip & Carousel Controls */}
      <div className="relative z-20 w-full border-t border-white/15 bg-black/40 backdrop-blur-md">
        <div className="w-full px-6 sm:px-10 lg:px-14 py-3 sm:py-3.5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* 4 Feature Columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full md:w-auto flex-1">
              {/* Feature 1 */}
              <div className="flex items-center gap-3 md:border-r border-white/15 pr-3">
                <FabricLeafIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#DDA23E] shrink-0" />
                <div className="text-left">
                  <div className="text-white text-xs sm:text-[13px] font-medium leading-snug">
                    Premium Fabrics
                  </div>
                  <div className="text-[#B8AFA2] text-[10.5px] sm:text-xs leading-none mt-0.5">
                    For Everyday Wear
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3 md:border-r border-white/15 pr-3">
                <TribalSunIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#DDA23E] shrink-0" />
                <div className="text-left">
                  <div className="text-white text-xs sm:text-[13px] font-medium leading-snug">
                    Authentic Tribal Designs
                  </div>
                  <div className="text-[#B8AFA2] text-[10.5px] sm:text-xs leading-none mt-0.5">
                    Rooted in Culture
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3 md:border-r border-white/15 pr-3">
                <IsometricBoxIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#DDA23E] shrink-0" />
                <div className="text-left">
                  <div className="text-white text-xs sm:text-[13px] font-medium leading-snug">
                    Custom & Bulk Orders
                  </div>
                  <div className="text-[#B8AFA2] text-[10.5px] sm:text-xs leading-none mt-0.5">
                    For Teams & Businesses
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-3">
                <JharkhandMountainIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#DDA23E] shrink-0" />
                <div className="text-left">
                  <div className="text-white text-xs sm:text-[13px] font-medium leading-snug">
                    Proudly from
                  </div>
                  <div className="text-[#B8AFA2] text-[10.5px] sm:text-xs leading-none mt-0.5">
                    Jharkhand, India
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel Controls (Far Right) */}
            <div className="flex items-center justify-end gap-3 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-white/15">
              {/* Pagination index */}
              <div className="font-mono text-xs sm:text-sm font-medium tracking-wider text-[#DDA23E] mr-2">
                <span className="font-bold">
                  {String(slide).padStart(2, "0")}
                </span>
                <span className="mx-1.5 opacity-60 text-white">──</span>
                <span className="opacity-80 text-[#C9BAA7]">
                  {String(totalSlides).padStart(2, "0")}
                </span>
              </div>

              {/* Prev Button */}
              <button
                type="button"
                onClick={handlePrev}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/40 hover:border-[#DDA23E] text-white hover:text-[#DDA23E] flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-90 focus:outline-none"
                aria-label="Previous Slide"
              >
                <span className="text-sm font-bold">←</span>
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/40 hover:border-[#DDA23E] text-white hover:text-[#DDA23E] flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-90 focus:outline-none"
                aria-label="Next Slide"
              >
                <span className="text-sm font-bold">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
