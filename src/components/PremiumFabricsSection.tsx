"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation, type Variants } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FabricCard {
  id: string;
  title: string;
  desc: string;
  image: string;
}

const FABRIC_CARDS: FabricCard[] = [
  {
    id: "linen",
    title: "Linen",
    desc: "Lightweight, breathable and perfect for everyday comfort.",
    image: "/images/fabrics/swatch-linen-hd.jpg",
  },
  {
    id: "cotton",
    title: "Cotton",
    desc: "Soft, durable and naturally keeps you comfortable.",
    image: "/images/fabrics/swatch-cotton-hd.jpg",
  },
  {
    id: "handloom",
    title: "Handloom",
    desc: "Traditionally woven, rich in texture and cultural value.",
    image: "/images/fabrics/swatch-handloom-hd.jpg",
  },
  {
    id: "tribal-prints",
    title: "Tribal Prints",
    desc: "Authentic patterns inspired by Jharkhand's art and heritage.",
    image: "/images/fabrics/swatch-tribal-hd.jpg",
  },
];

// Exact Circular Outline Icons from the reference image
function LinenIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="#8D5A32"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-7 h-7 sm:w-[30px] sm:h-[30px]"
      aria-hidden="true"
    >
      {/* Outer elegant circle */}
      <circle cx="16" cy="16" r="14.5" stroke="#8D5A32" strokeWidth="1.1" />
      {/* Center stem */}
      <line x1="16" y1="23.5" x2="16" y2="10" strokeWidth="1.25" />
      {/* Center vertical leaf */}
      <path
        d="M16 10.5 C14.2 7.8 14.2 5.5 16 4.5 C17.8 5.5 17.8 7.8 16 10.5 Z"
        strokeWidth="1.2"
      />
      <line x1="16" y1="5.5" x2="16" y2="10" strokeWidth="1.1" />
      {/* Left leaf */}
      <path
        d="M16 16.5 C12.5 16.5 10 14.8 9.5 12.5 C12 11.8 14.5 13.5 16 16.5 Z"
        strokeWidth="1.2"
      />
      <line x1="11.2" y1="13.2" x2="15.2" y2="15.8" strokeWidth="1.1" />
      {/* Right leaf */}
      <path
        d="M16 16.5 C19.5 16.5 22 14.8 22.5 12.5 C20 11.8 17.5 13.5 16 16.5 Z"
        strokeWidth="1.2"
      />
      <line x1="20.8" y1="13.2" x2="16.8" y2="15.8" strokeWidth="1.1" />
    </svg>
  );
}

function CottonIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="#8D5A32"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-7 h-7 sm:w-[30px] sm:h-[30px]"
      aria-hidden="true"
    >
      {/* Outer elegant circle */}
      <circle cx="16" cy="16" r="14.5" stroke="#8D5A32" strokeWidth="1.1" />
      {/* Cotton boll fluffy cloud lobes */}
      <path
        d="M12.2 20.8 C10 20.8 8.2 19 8.2 16.8 C8.2 15 9.4 13.5 11.1 13 C11.3 10.6 13.4 8.8 16 8.8 C18.6 8.8 20.7 10.6 20.9 13 C22.6 13.5 23.8 15 23.8 16.8 C23.8 19 22 20.8 19.8 20.8 C18.7 20.8 17.7 20.3 17 19.5 C16.7 19.8 16.4 20 16 20 C15.6 20 15.3 19.8 15 19.5 C14.3 20.3 13.3 20.8 12.2 20.8 Z"
        strokeWidth="1.2"
      />
      {/* Inner sepal curves */}
      <path
        d="M13.8 19 C14.8 17 15.3 15 16 14 C16.7 15 17.2 17 18.2 19"
        strokeWidth="1.1"
      />
      {/* Stem */}
      <path d="M16 20.2 L16 24" strokeWidth="1.25" />
    </svg>
  );
}

function HandloomIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="#8D5A32"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-7 h-7 sm:w-[30px] sm:h-[30px]"
      aria-hidden="true"
    >
      {/* Outer elegant circle */}
      <circle cx="16" cy="16" r="14.5" stroke="#8D5A32" strokeWidth="1.1" />
      {/* 4 Vertical weave warp threads */}
      <line x1="11.5" y1="9.5" x2="11.5" y2="22.5" strokeWidth="1.25" />
      <line x1="14.5" y1="9.5" x2="14.5" y2="22.5" strokeWidth="1.25" />
      <line x1="17.5" y1="9.5" x2="17.5" y2="22.5" strokeWidth="1.25" />
      <line x1="20.5" y1="9.5" x2="20.5" y2="22.5" strokeWidth="1.25" />
      {/* 4 Horizontal weave weft threads */}
      <line x1="9.5" y1="11.5" x2="22.5" y2="11.5" strokeWidth="1.25" />
      <line x1="9.5" y1="14.5" x2="22.5" y2="14.5" strokeWidth="1.25" />
      <line x1="9.5" y1="17.5" x2="22.5" y2="17.5" strokeWidth="1.25" />
      <line x1="9.5" y1="20.5" x2="22.5" y2="20.5" strokeWidth="1.25" />
    </svg>
  );
}

function TribalPrintsIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="#8D5A32"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-7 h-7 sm:w-[30px] sm:h-[30px]"
      aria-hidden="true"
    >
      {/* Outer elegant circle */}
      <circle cx="16" cy="16" r="14.5" stroke="#8D5A32" strokeWidth="1.1" />
      {/* Inner concentric ring */}
      <circle cx="16" cy="16" r="3.2" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="1.3" fill="#8D5A32" stroke="none" />
      {/* Cardinal rays with tribal arrows */}
      <line x1="16" y1="8" x2="16" y2="12.8" strokeWidth="1.2" />
      <path d="M14.5 10 L16 8 L17.5 10" strokeWidth="1.1" />
      <line x1="16" y1="19.2" x2="16" y2="24" strokeWidth="1.2" />
      <path d="M14.5 22 L16 24 L17.5 22" strokeWidth="1.1" />
      <line x1="8" y1="16" x2="12.8" y2="16" strokeWidth="1.2" />
      <path d="M10 14.5 L8 16 L10 17.5" strokeWidth="1.1" />
      <line x1="19.2" y1="16" x2="24" y2="16" strokeWidth="1.2" />
      <path d="M22 14.5 L24 16 L22 17.5" strokeWidth="1.1" />
      {/* 4 Diagonal rays with tribal dots */}
      <line x1="10.5" y1="10.5" x2="13.5" y2="13.5" strokeWidth="1.1" />
      <circle cx="9.8" cy="9.8" r="0.9" fill="#8D5A32" stroke="none" />
      <line x1="18.5" y1="18.5" x2="21.5" y2="21.5" strokeWidth="1.1" />
      <circle cx="22.2" cy="22.2" r="0.9" fill="#8D5A32" stroke="none" />
      <line x1="21.5" y1="10.5" x2="18.5" y2="13.5" strokeWidth="1.1" />
      <circle cx="22.2" cy="9.8" r="0.9" fill="#8D5A32" stroke="none" />
      <line x1="13.5" y1="18.5" x2="10.5" y2="21.5" strokeWidth="1.1" />
      <circle cx="9.8" cy="22.2" r="0.9" fill="#8D5A32" stroke="none" />
    </svg>
  );
}

const CARD_ICONS: Record<string, React.ReactNode> = {
  linen: <LinenIcon />,
  cotton: <CottonIcon />,
  handloom: <HandloomIcon />,
  "tribal-prints": <TribalPrintsIcon />,
};

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const textBlockVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.12,
    },
  },
};

const textItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: luxuryEase,
    },
  },
};

const cardsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.28,
    },
  },
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: luxuryEase,
    },
  },
};

export function PremiumFabricsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const noiseLayerRef = useRef<HTMLDivElement>(null);
  const treeRef = useRef<HTMLDivElement>(null);

  const textControls = useAnimation();
  const cardsControls = useAnimation();

  // ─── Seamless Natural Gradient Noise Removal Refresh Effect (Exact match to CustomDesignSection) ───
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const photoEl = photoRef.current;
      const noiseEl = noiseLayerRef.current;
      const treeEl = treeRef.current;

      if (!photoEl || !noiseEl) return;

      // Initial state: Textile image rests under natural matte gradient noise
      gsap.set(photoEl, {
        opacity: 0.88,
        filter: "contrast(0.94)",
      });
      gsap.set(noiseEl, {
        autoAlpha: 0.92,
        filter: "blur(0px)",
        display: "block",
      });

      if (treeEl) {
        gsap.set(treeEl, { opacity: 0.35, x: -10 });
      }

      const triggerFramerAnimations = () => {
        textControls.start("visible");
        cardsControls.start("visible");
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          once: true,
          onEnter: triggerFramerAnimations,
        },
        delay: 0.1,
      });

      // Natural gradient noise dissolves smoothly away without moving lines or seams
      tl.to(
        noiseEl,
        {
          autoAlpha: 0,
          filter: "blur(8px)",
          duration: 1.2,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(noiseEl, { display: "none" });
          },
        },
        0
      );

      // Authentic textile photo clarifies into 100% full rich contrast
      tl.to(
        photoEl,
        {
          opacity: 1,
          filter: "contrast(1)",
          duration: 1.3,
          ease: "power2.out",
        },
        0.05
      );

      // Left Sohrai tree artwork gently clarifies
      if (treeEl) {
        tl.to(
          treeEl,
          {
            opacity: 0.9,
            x: 0,
            duration: 1.2,
            ease: "power2.out",
          },
          0.1
        );
      }

      // Check on immediate refresh if the section is already in or near viewport
      ScrollTrigger.refresh();
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
        triggerFramerAnimations();
      }
    }, section);

    return () => ctx.revert();
  }, [textControls, cardsControls]);

  return (
    <section
      ref={sectionRef}
      id="premium-fabrics"
      aria-label="Premium Fabrics — Natural Textures Deeper Stories"
      className="relative w-full section-optimize overflow-hidden select-none isolate bg-[#EAE2D5] text-[#1C1610]"
    >
      {/* ─── 1. Continuous Parchment Canvas (Exact match to CustomDesignSection & FeaturedCollection) ─── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #E2D5BB 0%, #EAE0CA 35%, #EAE2D5 75%, #EAE2D5 100%)",
        }}
      />

      {/* ─── 2. Paper Noise Texture Overlay (Optimized 1-octave SVG noise) ─── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />

      {/* ─── 3. Delicate Gold Top Hairline Seam (Connecting seamlessly from previous section) ─── */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C89B4C]/45 to-transparent pointer-events-none z-10" />

      {/* 
        ─── 4. Right Background: Hero Folded Fabrics Photograph ───
        Stretched edge-to-edge on the right like CustomDesignSection, cleanly inset from the top hairline.
        Reveals as natural gradient noise dissolves smoothly away on refresh/scroll.
      */}
      <div
        className="absolute right-0 top-5 sm:top-6 lg:top-7 bottom-20 sm:bottom-24 lg:bottom-28 w-full sm:w-[60%] md:w-[55%] lg:w-[53%] xl:w-[50%] pointer-events-none select-none z-2 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) 3%, rgba(0,0,0,0.85) 15%, black 24%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) 3%, rgba(0,0,0,0.85) 15%, black 24%, black 100%)",
        }}
      >
        {/* The Stationary HD Photo (100% full rich contrast) */}
        <div
          ref={photoRef}
          className="w-full h-full will-change-transform"
        >
          <img
            src="/images/fabrics/stacked-fabrics-hero.jpg"
            alt="Handpicked folded artisanal fabrics"
            draggable={false}
            className="w-full h-full object-cover object-center sm:object-right pointer-events-none select-none"
            loading="eager"
          />
        </div>

        {/* 
          ─── Natural Gradient Noise Veil (Exact match to CustomDesignSection) ───
          Softly dissolves in place on refresh/scroll, revealing the textile photo seamlessly.
        */}
        <div
          ref={noiseLayerRef}
          style={{
            backgroundImage: `
              linear-gradient(to right, #EAE0CA 0%, rgba(234, 224, 202, 0.85) 30%, rgba(234, 224, 202, 0.45) 60%, transparent 100%),
              url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E")
            `,
            backgroundSize: "cover, 140px 140px",
          }}
          className="absolute inset-0 z-10 pointer-events-none will-change-transform"
        />
      </div>

      {/* ─── 4. Left Far Edge: Folk Tree Artwork (Anchored to avoid text collision) ─── */}
      <div
        ref={treeRef}
        className="absolute -left-2 sm:left-0 top-0 bottom-24 sm:bottom-28 lg:bottom-32 w-[180px] sm:w-[240px] md:w-[280px] lg:w-[320px] pointer-events-none select-none z-1 opacity-80 sm:opacity-90 mix-blend-multiply will-change-transform"
      >
        <Image
          src="/images/fabrics/sohrai-tree-art.png"
          alt="Traditional Sohrai sacred tree with perched bird"
          fill
          priority
          sizes="320px"
          draggable={false}
          className="object-contain object-left-top sm:object-left pointer-events-none select-none"
        />
      </div>

      {/* ─── 5. Main Content Container ─── */}
      <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-14 pb-5 sm:pb-7 flex flex-col justify-between min-h-[560px] sm:min-h-[590px] lg:min-h-[620px]">

        {/* ── Top Half: Headlines & Subtext (Staggered Silky Reveal) ── */}
        <motion.div
          initial="hidden"
          animate={textControls}
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={textBlockVariants}
          className="relative z-10 w-full pl-0 sm:pl-[70px] md:pl-[100px] lg:pl-[130px] xl:pl-[160px] max-w-[560px] lg:max-w-[640px] pt-5 sm:pt-7 lg:pt-9"
        >
          {/* Eyebrow: PREMIUM FABRICS — with Subtle Flying Bird */}
          <motion.div
            variants={textItemVariants}
            className="flex items-center justify-between max-w-[340px] sm:max-w-[380px] mb-2.5 sm:mb-3"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="font-sans text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.24em] text-[#8D4E13] uppercase">
                PREMIUM FABRICS
              </span>
              <span className="inline-block w-8 sm:w-12 h-[1.5px] bg-[#8D4E13]/70" />
            </div>

            {/* Subtle Flying Bird Folk Motif */}
            <motion.div
              animate={{
                y: [-1, 2, -1],
                rotate: [0, -1, 1, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-8 sm:w-9 h-auto opacity-80 mix-blend-multiply pointer-events-none -mt-1 mr-2"
            >
              <Image
                src="/images/fabrics/sohrai-bird-flight.png"
                alt="Folk bird in flight"
                width={55}
                height={40}
                draggable={false}
                className="w-full h-auto object-contain pointer-events-none select-none"
              />
            </motion.div>
          </motion.div>

          {/* Main Headline Stack: Natural Textures / Deeper Stories (Strictly on one line each) */}
          <motion.h2
            variants={textItemVariants}
            className="font-editorial text-3xl sm:text-4xl md:text-[44px] lg:text-[50px] xl:text-[54px] font-bold text-[#081A0B] tracking-[-0.02em] leading-[1.06]"
          >
            <span className="block whitespace-nowrap">Natural Textures</span>
            <span className="block font-normal italic text-[#B87A38] my-0.5 sm:my-1 pr-2 whitespace-nowrap">
              Deeper Stories
            </span>
          </motion.h2>

          {/* Subtitle Description */}
          <motion.p
            variants={textItemVariants}
            className="mt-4 sm:mt-5 text-[#213326]/85 text-[13.5px] sm:text-[14.5px] lg:text-[15.5px] font-normal leading-[1.65] max-w-sm sm:max-w-md font-sans"
          >
            Handpicked fabrics that feel real, breathe better and carry the essence of
            Jharkhand’s craft and culture.
          </motion.p>
        </motion.div>

        {/* ── Bottom Half: Simple & Clean Premium Cream Cards Shelf (Staggered Cascade Reveal) ── */}
        <div className="mt-6 sm:mt-9 lg:mt-11">
          <motion.div
            initial="hidden"
            animate={cardsControls}
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={cardsContainerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 lg:gap-4 xl:gap-4.5"
          >
            {FABRIC_CARDS.map((card) => (
              <motion.div
                key={card.id}
                variants={cardItemVariants}
                className="group relative flex items-stretch rounded-2xl overflow-hidden bg-[#FAF5EB] border border-[#DFD1BA] shadow-[0_2px_14px_rgba(40,30,18,0.04)] hover:border-[#C4A982] hover:shadow-[0_4px_18px_rgba(40,30,18,0.07)] transition-all duration-300 text-left select-none cursor-default min-h-[128px] sm:min-h-[136px] lg:min-h-[140px]"
              >
                {/* Left Swatch Preview: Flush to card top, bottom, and left edge */}
                <div className="relative w-[38%] sm:w-[40%] shrink-0 overflow-hidden bg-[#ECE2D0] pointer-events-none select-none">
                  <img
                    src={card.image}
                    alt={`${card.title} texture`}
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none select-none"
                    loading="eager"
                  />
                </div>

                {/* Right Content Area: Rich warm cream parchment */}
                <div className="flex-1 min-w-0 p-3 sm:p-3.5 lg:p-3 xl:p-3.5 flex flex-col justify-center">
                  {/* Circular Outline Icon Badge — Completely stationary with zero hover movement */}
                  <div className="mb-1.5 sm:mb-2 shrink-0">
                    {CARD_ICONS[card.id]}
                  </div>

                  {/* Title in Editorial Serif */}
                  <h3 className="font-editorial text-[16px] sm:text-[17px] font-bold text-[#142618] tracking-tight leading-tight mb-1 group-hover:text-[#8D4E13] transition-colors">
                    {card.title}
                  </h3>

                  {/* Description: Clean, crisp, no truncation */}
                  <p className="text-[11px] sm:text-[11.5px] lg:text-[11px] xl:text-[11.5px] text-[#4A4237]/90 leading-[1.4] font-sans font-normal">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─── 6. Bottom Edge Traditional Tribal Geometric Border Strip ─── */}
      <div className="relative w-full overflow-hidden pointer-events-none select-none z-10 shrink-0 mt-3 sm:mt-4">
        <div
          className="w-full h-5 sm:h-6 opacity-85 mix-blend-multiply"
          style={{
            backgroundImage: "url('/images/fabrics/tribal-border-ribbon.png')",
            backgroundRepeat: "repeat-x",
            backgroundSize: "auto 100%",
          }}
        />
      </div>
    </section>
  );
}
