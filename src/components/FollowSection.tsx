"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CommunityCard {
  id: string;
  title: string;
  tag: string;
  image: string;
}

const COMMUNITY_CARDS: CommunityCard[] = [
  {
    id: "terracotta",
    title: "Terracotta Sohrai Deer Mural",
    tag: "@arjun.vrma",
    image: "/images/community/community-terracotta.jpg",
  },
  {
    id: "forest-green",
    title: "Forest Green Kalpavriksha",
    tag: "@priya_jh",
    image: "/images/community/community-forest-green.jpg",
  },
  {
    id: "black-sun",
    title: "Obsidian Black Sacred Sun",
    tag: "@kabir.roots",
    image: "/images/community/community-black-sun.jpg",
  },
  {
    id: "cream-ecru",
    title: "Ecru Sepia Folk Dancers",
    tag: "@ananya_s",
    image: "/images/community/community-cream-ecru.jpg",
  },
  {
    id: "earth-brown",
    title: "Cocoa Tree & Crescent Moon",
    tag: "@rohit.tribal",
    image: "/images/community/community-earth-brown.jpg",
  },
];

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2.5" />
    </svg>
  );
}

// ─── Continuous Traditional Jharkhand Sawtooth Geometric Border ───
function TribalSawtoothBorder({ orientation = "top" }: { orientation?: "top" | "bottom" }) {
  const isTop = orientation === "top";
  return (
    <div className="relative w-full overflow-hidden pointer-events-none select-none z-10 shrink-0 h-4 sm:h-5 opacity-85 mix-blend-multiply">
      <svg className="w-full h-full" aria-hidden="true">
        <defs>
          <pattern
            id={`sawtooth-border-${orientation}`}
            width="18"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            {isTop ? (
              <>
                {/* Top double baseline rules */}
                <line x1="0" y1="1.5" x2="18" y2="1.5" stroke="#8D5A32" strokeWidth="1.1" />
                <line x1="0" y1="3.5" x2="18" y2="3.5" stroke="#8D5A32" strokeWidth="0.75" />
                {/* Downward chevron triangle teeth */}
                <path d="M 1.5 5 L 16.5 5 L 9 14.5 Z" fill="#8D5A32" />
                <line x1="0" y1="16" x2="18" y2="16" stroke="#8D5A32" strokeWidth="0.75" />
              </>
            ) : (
              <>
                <line x1="0" y1="2.5" x2="18" y2="2.5" stroke="#8D5A32" strokeWidth="0.75" />
                {/* Upward chevron triangle teeth */}
                <path d="M 1.5 14 L 16.5 14 L 9 4.5 Z" fill="#8D5A32" />
                {/* Bottom double baseline rules */}
                <line x1="0" y1="15.5" x2="18" y2="15.5" stroke="#8D5A32" strokeWidth="0.75" />
                <line x1="0" y1="17.5" x2="18" y2="17.5" stroke="#8D5A32" strokeWidth="1.1" />
              </>
            )}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#sawtooth-border-${orientation})`} />
      </svg>
    </div>
  );
}

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
      staggerChildren: 0.08,
      delayChildren: 0.26,
    },
  },
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: luxuryEase,
    },
  },
};

export function FollowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const squirrelRef = useRef<HTMLDivElement>(null);

  const textControls = useAnimation();
  const cardsControls = useAnimation();

  // ─── Synchronized GSAP ScrollTrigger & Refresh Entrance Trigger ───
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const squirrelEl = squirrelRef.current;

      if (squirrelEl) {
        gsap.set(squirrelEl, { opacity: 0.35, x: -12 });
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

      // Left Sohrai squirrel folk art smoothly clarifies
      if (squirrelEl) {
        tl.to(
          squirrelEl,
          {
            opacity: 0.9,
            x: 0,
            duration: 1.25,
            ease: "power2.out",
          },
          0.05
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
      id="community"
      aria-label="Our Community — Our Culture. Your Story."
      className="relative w-full overflow-hidden select-none isolate bg-[#EAE2D5] text-[#1C1610]"
    >
      {/* ─── 1. Continuous Unified Parchment Canvas (Exact match to other sections) ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[#EAE2D5]" />

      {/* ─── 2. Paper Noise Texture Overlay ─── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "300px 300px",
        }}
      />

      {/* ─── 3. Main Content Container ─── */}
      <div className="relative z-10 max-w-[1420px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 lg:gap-8 xl:gap-10">

          {/* ── Left Column: Squirrel Artwork + Editorial Typography & CTA ── */}
          <div className="relative z-10 w-full lg:w-[42%] xl:w-[39%] shrink-0 flex flex-col sm:flex-row items-start sm:items-start gap-4 sm:gap-5 lg:gap-5 xl:gap-6">
            
            {/* 
              ── The Sohrai Folk Squirrel on Blooming Branch ──
              Organic mineral-pigment folk art integrated into the parchment canvas
            */}
            <motion.div
              ref={squirrelRef}
              animate={{
                y: [-1.2, 1.2, -1.2],
                rotate: [-0.35, 0.35, -0.35],
              }}
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-[130px] sm:w-[150px] md:w-[165px] lg:w-[180px] xl:w-[200px] shrink-0 sm:pt-0.5 pointer-events-none select-none mix-blend-multiply opacity-85 sm:opacity-90 will-change-transform"
              style={{ aspectRatio: "885 / 604" }}
            >
              <img
                src="/images/community/sohrai-squirrel.svg"
                alt="Traditional Sohrai folk squirrel perched on blooming branch"
                width={885}
                height={604}
                draggable={false}
                className="w-full h-auto object-contain object-left pointer-events-none select-none"
              />
            </motion.div>

            {/* Editorial Typography Stack & Follow CTA */}
            <motion.div
              initial="hidden"
              animate={textControls}
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={textBlockVariants}
              className="flex-1 min-w-0"
            >
              {/* Eyebrow: OUR COMMUNITY — */}
              <motion.div
                variants={textItemVariants}
                className="flex items-center gap-2 sm:gap-2.5 mb-1.5 sm:mb-2"
              >
                <span className="font-sans text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#8D4E13] uppercase">
                  OUR COMMUNITY
                </span>
                <span className="inline-block w-6 sm:w-8 h-[1.5px] bg-[#8D4E13]/70" />
              </motion.div>

              {/* Display Headline: Our Culture. / Your Story. */}
              <motion.h2
                variants={textItemVariants}
                className="font-editorial text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-bold text-[#081A0B] tracking-[-0.02em] leading-[1.08]"
              >
                <span className="block whitespace-nowrap">Our Culture.</span>
                <span className="block font-normal italic text-[#B87A38] my-0.5 sm:my-1 pr-2 whitespace-nowrap">
                  Your Story.
                </span>
              </motion.h2>

              {/* Supporting Description */}
              <motion.p
                variants={textItemVariants}
                className="mt-2.5 sm:mt-3 text-[#213326]/85 text-[12px] sm:text-[13px] lg:text-[13.5px] font-normal leading-[1.6] max-w-xs font-sans"
              >
                A growing community of people who wear their roots with pride. Tag us on
                Instagram and be a part of the story.
              </motion.p>

              {/* Warm Golden-Amber Pill CTA Button */}
              <motion.div variants={textItemVariants} className="mt-4 sm:mt-5">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Fittee on Instagram"
                  className="group relative inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#E2A44B] hover:bg-[#D49339] text-[#142618] font-sans font-semibold text-[12.5px] sm:text-[13px] shadow-[0_4px_14px_rgba(226,164,75,0.28)] hover:shadow-[0_6px_20px_rgba(226,164,75,0.38)] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
                >
                  <InstagramIcon className="w-3.5 h-3.5 stroke-[2.2] transition-transform duration-300 group-hover:scale-110" />
                  <span>Follow @fittee</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.4] transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </motion.div>
            </motion.div>

          </div>

          {/* ── Right Column: 5 Portrait Community Photo Cards ── */}
          <div className="relative z-10 w-full lg:w-[56%] xl:w-[59%]">
            <motion.div
              initial="hidden"
              animate={cardsControls}
              whileInView="visible"
              viewport={{ once: true, amount: 0.08 }}
              variants={cardsContainerVariants}
              className="flex lg:grid lg:grid-cols-5 gap-2.5 sm:gap-3 xl:gap-3.5 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0 scrollbar-none snap-x lg:snap-none"
            >
              {COMMUNITY_CARDS.map((card) => (
                <motion.div
                  key={card.id}
                  variants={cardItemVariants}
                  className="group relative w-[160px] sm:w-[180px] md:w-[195px] lg:w-auto shrink-0 lg:shrink aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-[#E2D8C7] border border-[#DDD3C2] hover:border-[#B8853B]/70 shadow-[0_3px_12px_rgba(40,28,14,0.06)] hover:shadow-[0_8px_22px_rgba(40,28,14,0.12)] transition-all duration-400 select-none cursor-pointer snap-center"
                >
                  {/* High Quality Editorial Image */}
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 640px) 160px, (max-width: 1024px) 195px, 200px"
                    draggable={false}
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none select-none"
                  />

                  {/* Subtle Cinematic Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none opacity-80 group-hover:opacity-65 transition-opacity duration-300" />

                  {/* Minimal Subtle Instagram Handle Pill on Hover */}
                  <div className="absolute bottom-2.5 inset-x-2.5 z-10 flex items-center justify-between text-white/95 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                    <span className="font-sans text-[11px] font-medium tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                      {card.tag}
                    </span>
                    <InstagramIcon className="w-3.5 h-3.5 opacity-85" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>

      {/* ─── 6. Bottom Traditional Tribal Geometric Border Strip ─── */}
      <TribalSawtoothBorder orientation="bottom" />
    </section>
  );
}

// Named alias
export const CommunitySection = FollowSection;
