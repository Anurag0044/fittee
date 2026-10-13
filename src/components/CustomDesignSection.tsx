"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Check, Sparkles, Palette, Shirt, Send } from "lucide-react";

interface StyleOption {
  id: string;
  name: string;
  origin: string;
  desc: string;
  accent: string;
}

const TRIBAL_STYLES: StyleOption[] = [
  {
    id: "sohrai",
    name: "Sohrai Harvest Mural",
    origin: "Hazaribagh Tradition",
    desc: "Fluid lines of horned stags, sacred trees & floral rosettes with natural earth pigments.",
    accent: "#B87A38",
  },
  {
    id: "khovar",
    name: "Khovar Nuptial Art",
    origin: "Birhor & Oraon Heritage",
    desc: "Comb-cut sacred geometric silhouettes, earth layers, and ancestral fertility motifs.",
    accent: "#8D4E13",
  },
  {
    id: "karam",
    name: "Karam Kalpavriksha",
    origin: "Chotanagpur Plateau",
    desc: "Sacred Tree of Life flanked by synchronized tribal dancers celebrating prosperity.",
    accent: "#2A5C2E",
  },
  {
    id: "dokra",
    name: "Dokra Lost-Wax Lines",
    origin: "Tribal Bell-Metal Art",
    desc: "Intricate metallic filament patterns inspired by ancient lost-wax figurines.",
    accent: "#C39B6C",
  },
];

const GARMENT_OPTIONS = [
  { id: "oversized", name: "Heavyweight Oversized Tee", gsm: "240 GSM", price: 899 },
  { id: "regular", name: "Classic Heritage Regular Tee", gsm: "200 GSM", price: 799 },
  { id: "hoodie", name: "Heavy French Terry Hoodie", gsm: "380 GSM", price: 1799 },
  { id: "tote", name: "Organic Canvas Art Tote", gsm: "340 GSM", price: 499 },
];

const PLACEMENT_OPTIONS = [
  { id: "back", name: "Full Back Tapestry", label: "Hero mural across the entire back" },
  { id: "chest", name: "Center Heritage Crest", label: "Bold statement piece on front chest" },
  { id: "pocket", name: "Pocket Minimal Accent", label: "Understated subtle folk art motif" },
];

export function CustomDesignSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(TRIBAL_STYLES[0].id);
  const [selectedGarment, setSelectedGarment] = useState(GARMENT_OPTIONS[0].id);
  const [selectedPlacement, setSelectedPlacement] = useState(PLACEMENT_OPTIONS[0].id);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");

  // Lock background scroll when modal is active
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const currentGarment = GARMENT_OPTIONS.find((g) => g.id === selectedGarment) || GARMENT_OPTIONS[0];

  return (
    <section
      id="custom-design"
      className="relative w-full bg-[#EAE2D5] min-h-[500px] sm:min-h-[540px] lg:min-h-[580px] flex flex-col justify-between overflow-hidden select-none isolate"
    >
      {/* ─── 1. Base Continuous Parchment Canvas (Seamlessly continues from FeaturedCollection) ─── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #E2D5BB 0%, #EAE0CA 20%, #E6DCBF 75%, #DFCFAA 100%)",
        }}
      />

      {/* ─── 2. Paper Noise Texture Overlay ───────────────────────────── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "300px 300px",
        }}
      />

      {/* ─── 3. Delicate Gold Top Hairline Seam (Connecting seamlessly from slider) ─── */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C89B4C]/45 to-transparent pointer-events-none z-10" />

      {/* 
        ─── 4. Authentic Sohrai Tree of Life, Sun & Deer Linework ───
        Anchored cleanly along the far left edge with organic ink absorption into parchment
      */}
      <div className="absolute left-0 sm:left-2 lg:left-4 xl:left-8 top-0 bottom-16 sm:bottom-20 lg:bottom-24 w-[240px] sm:w-[300px] lg:w-[370px] xl:w-[410px] pointer-events-none select-none z-1 opacity-25 sm:opacity-90 transition-opacity">
        <picture>
          <source srcSet="/images/tribal-art-perfect.webp" type="image/webp" />
          <img
            src="/images/tribal-art-perfect.png"
            alt="Authentic Jharkhand Sohrai Sacred Kalpavriksha Tree, Sun and Folk Deer"
            className="w-full h-full object-contain object-left-bottom mix-blend-multiply"
            loading="lazy"
          />
        </picture>
      </div>

      {/* ─── 5. Main Editorial Typography & Action Area ─── */}
      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 my-auto flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="w-full pl-0 sm:pl-[100px] md:pl-[130px] lg:pl-[160px] xl:pl-[190px] max-w-[800px]"
        >
          {/* Eyebrow: MADE FOR YOU — */}
          <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
            <span className="font-sans text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.24em] text-[#8D4E13] uppercase">
              MADE FOR YOU
            </span>
            <span className="inline-block w-8 sm:w-12 h-[1.5px] bg-[#8D4E13]/70" />
          </div>

          {/* Main Headline Stack: Custom / Handmade / Designs */}
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-[56px] xl:text-[60px] font-bold text-[#081A0B] tracking-[-0.02em] leading-[1.02]">
            <span className="block">Custom</span>
            <span className="block font-normal italic text-[#B87A38] my-0.5 sm:my-1 pr-2">
              Handmade
            </span>
            <span className="block">Designs</span>
          </h2>

          {/* Subtitle Description */}
          <p className="mt-4 sm:mt-5 text-[#213326]/85 text-[13.5px] sm:text-[14.5px] lg:text-[15.5px] font-normal leading-[1.65] max-w-sm sm:max-w-md">
            Your idea, brought to life through art inspired by the people, patterns and
            spirit of Jharkhand.
          </p>

          {/* CTA Action Button */}
          <div className="mt-6 sm:mt-8">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              aria-label="Open custom handmade design studio modal"
              className="group relative inline-flex items-center gap-2.5 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#192917] hover:bg-[#0E1D0C] text-[#FAF7F2] text-[13px] sm:text-[14px] font-medium tracking-wide transition-all duration-300 shadow-[0_8px_22px_rgba(25,41,23,0.22)] hover:shadow-[0_12px_28px_rgba(25,41,23,0.32)] hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
            >
              <span>Create Your Design</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* ─── 6. Authentic Jharkhand Tribal Geometric Bottom Border (Edge-to-Edge) ─── */}
      <div className="relative w-full overflow-hidden pointer-events-none select-none z-1 shrink-0 mt-6 sm:mt-8 pb-1 sm:pb-2">
        <svg
          className="w-full h-5 sm:h-5.5 opacity-85 mix-blend-multiply"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="sohrai-border-pattern"
              width="22"
              height="22"
              patternUnits="userSpaceOnUse"
            >
              {/* Continuous Earth Baseline */}
              <line
                x1="0"
                y1="2.5"
                x2="22"
                y2="2.5"
                stroke="#9E5C22"
                strokeWidth="1.4"
                strokeLinecap="round"
              />

              {/* Sacred Sohrai Mountain Chevron (Inverted Triangle) with Diamond Seed Cutout */}
              <path
                d="M 2 4.2 L 20 4.2 L 11 17.5 Z M 11 7 L 13.8 10.5 L 11 13.5 L 8.2 10.5 Z"
                fill="#9E5C22"
                fillRule="evenodd"
                opacity="0.9"
              />

              {/* Inter-mountain Valley Folk Sprout Accents */}
              <circle cx="0" cy="6.5" r="0.85" fill="#9E5C22" opacity="0.75" />
              <circle cx="22" cy="6.5" r="0.85" fill="#9E5C22" opacity="0.75" />
              <line
                x1="0"
                y1="2.5"
                x2="0"
                y2="5"
                stroke="#9E5C22"
                strokeWidth="1.1"
                opacity="0.75"
              />
              <line
                x1="22"
                y1="2.5"
                x2="22"
                y2="5"
                stroke="#9E5C22"
                strokeWidth="1.1"
                opacity="0.75"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sohrai-border-pattern)" />
        </svg>
      </div>

      {/* ─── Bespoke Jharkhand Tribal Art Studio Modal ─────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-[#0E130D]/75 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-[#F5EFE2] rounded-2xl sm:rounded-3xl border border-[#D9CBB7] shadow-[0_24px_60px_rgba(0,0,0,0.35)] overflow-hidden z-10 my-auto text-[#1C1610]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="custom-studio-title"
            >
              {/* Top Accent Band */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#B87A38] via-[#8D4E13] to-[#2A5C2E]" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
                className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-[#EAE0CA] hover:bg-[#DDD2BB] text-[#1C1610] flex items-center justify-center transition-colors duration-150 cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4 stroke-[2.2]" />
              </button>

              <div className="p-5 sm:p-7 md:p-8 max-h-[85vh] overflow-y-auto">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Header Block */}
                    <div>
                      <div className="flex items-center gap-2 text-[#8D4E13] mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="font-sans text-[11px] font-bold tracking-widest uppercase">
                          Bespoke Artistry
                        </span>
                      </div>
                      <h3
                        id="custom-studio-title"
                        className="font-editorial text-2xl sm:text-3xl font-bold text-[#081A0B] tracking-tight"
                      >
                        Create Your{" "}
                        <span className="italic font-normal text-[#B87A38]">
                          Custom Design
                        </span>
                      </h3>
                      <p className="mt-1 text-[#665643] text-xs sm:text-[13px] leading-relaxed">
                        Handcrafted by indigenous artisans in Jharkhand. Describe your idea or
                        pick a traditional folklore motif.
                      </p>
                    </div>

                    {/* Step 1: Select Tribal Tradition */}
                    <div>
                      <label className="block text-[11px] font-bold tracking-wider uppercase text-[#736350] mb-2.5 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-[#B87A38]" />
                        <span>1. Choose Tribal Folk Art Tradition</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {TRIBAL_STYLES.map((style) => (
                          <div
                            key={style.id}
                            onClick={() => setSelectedStyle(style.id)}
                            className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                              selectedStyle === style.id
                                ? "bg-[#EDE2D1] border-[#B87A38] shadow-sm ring-1 ring-[#B87A38]"
                                : "bg-[#FAF7F2] border-[#E2D5C0] hover:border-[#C4B298]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-editorial font-bold text-sm text-[#1C1610]">
                                {style.name}
                              </h4>
                              {selectedStyle === style.id && (
                                <Check className="w-3.5 h-3.5 text-[#B87A38] stroke-[2.5]" />
                              )}
                            </div>
                            <p className="text-[10px] font-medium text-[#8D4E13] uppercase tracking-wider mb-1">
                              {style.origin}
                            </p>
                            <p className="text-[11px] text-[#6E5D49] leading-snug">
                              {style.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Select Garment Silhouette */}
                    <div>
                      <label className="block text-[11px] font-bold tracking-wider uppercase text-[#736350] mb-2.5 flex items-center gap-1.5">
                        <Shirt className="w-3.5 h-3.5 text-[#B87A38]" />
                        <span>2. Select Silhouette Canvas</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {GARMENT_OPTIONS.map((garment) => (
                          <button
                            key={garment.id}
                            type="button"
                            onClick={() => setSelectedGarment(garment.id)}
                            className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                              selectedGarment === garment.id
                                ? "bg-[#192917] text-[#FAF7F2] border-[#192917] shadow-sm"
                                : "bg-[#FAF7F2] text-[#1C1610] border-[#E2D5C0] hover:border-[#C4B298]"
                            }`}
                          >
                            <p className="text-[11px] font-bold leading-tight truncate">
                              {garment.name}
                            </p>
                            <div className="flex items-center justify-between mt-1 text-[10px]">
                              <span className="opacity-75">{garment.gsm}</span>
                              <span className="font-semibold">₹{garment.price}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 3: Placement */}
                    <div>
                      <label className="block text-[11px] font-bold tracking-wider uppercase text-[#736350] mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#B87A38]" />
                        <span>3. Motif Placement</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {PLACEMENT_OPTIONS.map((place) => (
                          <button
                            key={place.id}
                            type="button"
                            onClick={() => setSelectedPlacement(place.id)}
                            className={`p-2 rounded-lg border text-center text-xs transition-all cursor-pointer ${
                              selectedPlacement === place.id
                                ? "bg-[#EDE2D1] border-[#B87A38] font-bold text-[#1C1610]"
                                : "bg-[#FAF7F2] border-[#E2D5C0] text-[#6E5D49] hover:border-[#C4B298]"
                            }`}
                          >
                            {place.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 4: Describe Your Vision */}
                    <div>
                      <label className="block text-[11px] font-bold tracking-wider uppercase text-[#736350] mb-1.5">
                        4. Describe Your Vision or Idea
                      </label>
                      <textarea
                        rows={3}
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="E.g. A majestic forest deer with Sohrai floral antlers under the sacred sun, in deep ochre and coal pigments..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CBB7] bg-[#FAF7F2] text-[#1C1610] placeholder-[#A49480] text-xs sm:text-[13px] focus:outline-none focus:ring-1.5 focus:ring-[#B87A38] focus:border-[#B87A38] transition-all resize-none"
                      />
                    </div>

                    {/* Contact Email & Estimate */}
                    <div className="pt-2 border-t border-[#E2D5C0] flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="w-full sm:w-auto">
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="Your email address"
                          className="w-full sm:w-60 px-3.5 py-2.5 rounded-xl border border-[#D9CBB7] bg-[#FAF7F2] text-xs text-[#1C1610] focus:outline-none focus:ring-1.5 focus:ring-[#B87A38]"
                        />
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                        <div className="text-right">
                          <span className="block text-[10px] uppercase tracking-wider text-[#857461]">
                            Estimated Starting At
                          </span>
                          <span className="font-editorial text-lg font-bold text-[#1C1610]">
                            ₹{currentGarment.price}
                          </span>
                        </div>

                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-full bg-[#192917] hover:bg-[#0E1D0C] text-[#FAF7F2] text-xs font-semibold tracking-wide flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
                        >
                          <span>Request Concept</span>
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  /* Success Confirmation State */
                  <div className="py-8 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-full bg-[#EDE2D1] border border-[#B87A38] flex items-center justify-center text-[#B87A38]">
                      <Check className="w-7 h-7 stroke-[2.5]" />
                    </div>
                    <h4 className="font-editorial text-2xl font-bold text-[#1C1610]">
                      Design Inquiry Received
                    </h4>
                    <p className="text-xs sm:text-sm text-[#665643] max-w-md mx-auto leading-relaxed">
                      Thank you! Our indigenous artisan collective will review your vision for the{" "}
                      <span className="font-semibold text-[#1C1610]">{currentGarment.name}</span>{" "}
                      and send a hand-drawn pencil proof to{" "}
                      <span className="font-semibold text-[#1C1610]">{customerEmail}</span> within 24 hours.
                    </p>
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsSubmitted(false);
                          setIsModalOpen(false);
                        }}
                        className="px-6 py-2 rounded-full bg-[#192917] text-[#FAF7F2] text-xs font-semibold cursor-pointer"
                      >
                        Return to Collection
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
