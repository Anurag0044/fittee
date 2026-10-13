"use client";

import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

// ─── Authentic Concentric Tribal Mandala Sun Emblem ───
function ConcentricSunEmblem({ className = "w-3.5 h-3.5 text-[#D4A13E]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="3" strokeWidth="1.8" />
      <circle cx="16" cy="16" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="16" r="6" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="9" strokeWidth="1.6" />
      <line x1="16" y1="2" x2="16" y2="5.5" strokeWidth="1.8" />
      <line x1="16" y1="26.5" x2="16" y2="30" strokeWidth="1.8" />
      <line x1="2" y1="16" x2="5.5" y2="16" strokeWidth="1.8" />
      <line x1="26.5" y1="16" x2="30" y2="16" strokeWidth="1.8" />
      <line x1="6" y1="6" x2="8.8" y2="8.8" strokeWidth="1.8" />
      <line x1="23.2" y1="23.2" x2="26" y2="26" strokeWidth="1.8" />
      <line x1="26" y1="6" x2="23.2" y2="8.8" strokeWidth="1.8" />
      <line x1="8.8" y1="23.2" x2="6" y2="26" strokeWidth="1.8" />
    </svg>
  );
}

// ─── Woven Selvedge Geometric Ribbon: Refined Handloom Border Strip ───
function FooterHeritageBorder() {
  return (
    <div className="relative w-full overflow-hidden pointer-events-none select-none z-10 shrink-0 h-4 sm:h-5">
      <svg className="w-full h-full" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern
            id="footer-selvedge-pattern"
            width="28"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            {/* Top gold hairline */}
            <line x1="0" y1="1.5" x2="28" y2="1.5" stroke="#C48D3F" strokeWidth="0.85" strokeOpacity="0.45" />
            {/* Fine woven micro-diamond with center golden dot */}
            <path
              d="M 14 3.5 L 21 10 L 14 16.5 L 7 10 Z"
              fill="none"
              stroke="#C48D3F"
              strokeWidth="0.8"
              strokeOpacity="0.55"
            />
            <circle cx="14" cy="10" r="1.1" fill="#E5A93C" fillOpacity="0.8" />
            {/* Horizontal connector thread */}
            <path d="M 0 10 L 7 10 M 21 10 L 28 10" stroke="#C48D3F" strokeWidth="0.6" strokeOpacity="0.3" />
            {/* Bottom guide hairline */}
            <line x1="0" y1="18.5" x2="28" y2="18.5" stroke="#C48D3F" strokeWidth="0.6" strokeOpacity="0.25" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#footer-selvedge-pattern)" />
      </svg>
    </div>
  );
}

// ─── Subtle Sacred Horizon Backdrop ───
function FooterSacredBackdrop() {
  return (
    <svg
      viewBox="0 0 1200 320"
      fill="none"
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1100px] max-w-full h-[220px] pointer-events-none select-none opacity-[0.035] mix-blend-screen"
      aria-hidden="true"
    >
      <circle cx="600" cy="180" r="45" stroke="#E5A93C" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="600" cy="180" r="80" stroke="#E5A93C" strokeWidth="1.2" strokeDasharray="4 4" />
      <circle cx="600" cy="180" r="120" stroke="#E5A93C" strokeWidth="0.8" />
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24;
        const rad = (angle * Math.PI) / 180;
        const x1 = 600 + Math.cos(rad) * 48;
        const y1 = 180 + Math.sin(rad) * 48;
        const x2 = 600 + Math.cos(rad) * 125;
        const y2 = 180 + Math.sin(rad) * 125;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E5A93C" strokeWidth="0.8" />;
      })}
      <path d="M 0 280 Q 300 240, 600 260 T 1200 280 L 1200 320 L 0 320 Z" fill="#E5A93C" fillOpacity="0.08" />
    </svg>
  );
}

// ─── Social Media Icons ───
function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2.2" />
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PinterestIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <line x1="12" y1="9" x2="12" y2="22" strokeWidth="2" />
      <path d="M8 12c-1.5 0-3-1.5-3-3.5A6.5 6.5 0 0 1 18.5 7c0 4-2.5 7-6 7-1.5 0-2.5-.8-3-1.8" />
    </svg>
  );
}

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ─── Authentic Complete Fitee Vector Script Logomark ───
function FiteeAuthenticLogo() {
  return (
    <div className="relative inline-flex items-center select-none">
      <svg
        viewBox="9 7 325 194"
        fill="none"
        className="h-10 sm:h-11 w-auto overflow-visible drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]"
        aria-label="Fitee Brand Logomark"
      >
        <defs>
          <linearGradient id="footerCleanGoldGrad" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#FCE6A8" />
            <stop offset="30%" stopColor="#EDB34A" />
            <stop offset="70%" stopColor="#DE992B" />
            <stop offset="100%" stopColor="#B87515" />
          </linearGradient>
        </defs>
        <path
          d="M 104 84 L 100 87 L 99 88 L 98 90 L 98 96 L 99 98 L 101 100 L 108 100 L 111 97 L 112 95 L 112 88 L 111 86 L 109 84 Z  M 184 9 L 182 10 L 179 13 L 178 16 L 175 19 L 175 24 L 174 28 L 171 33 L 170 41 L 169 44 L 168 46 L 166 48 L 164 49 L 159 51 L 157 51 L 155 49 L 155 47 L 156 41 L 157 38 L 159 35 L 160 32 L 160 26 L 162 22 L 162 19 L 161 17 L 159 15 L 153 15 L 151 16 L 149 19 L 148 21 L 147 23 L 144 34 L 143 38 L 143 43 L 142 46 L 140 48 L 140 51 L 139 53 L 137 55 L 135 56 L 131 56 L 128 57 L 123 60 L 121 58 L 120 52 L 118 51 L 115 51 L 110 54 L 107 55 L 99 56 L 93 59 L 89 59 L 86 60 L 83 62 L 80 63 L 75 63 L 71 64 L 66 67 L 59 68 L 56 70 L 52 71 L 49 71 L 45 72 L 42 74 L 39 75 L 35 75 L 31 76 L 27 79 L 19 80 L 17 81 L 14 83 L 11 86 L 11 91 L 14 94 L 19 94 L 24 92 L 31 88 L 36 88 L 39 87 L 41 85 L 47 83 L 49 83 L 52 86 L 50 93 L 47 98 L 47 102 L 46 105 L 41 110 L 38 111 L 33 111 L 30 112 L 26 115 L 23 115 L 20 116 L 17 118 L 13 122 L 12 124 L 13 128 L 17 130 L 19 129 L 22 127 L 25 124 L 27 123 L 32 123 L 35 121 L 37 121 L 39 123 L 39 127 L 38 132 L 35 139 L 35 143 L 32 148 L 31 152 L 31 159 L 30 161 L 28 163 L 27 165 L 27 170 L 26 174 L 24 177 L 23 181 L 23 186 L 20 193 L 19 197 L 19 199 L 35 199 L 35 197 L 36 196 L 36 192 L 37 188 L 39 185 L 40 180 L 40 173 L 44 166 L 45 157 L 48 145 L 51 138 L 52 134 L 51 130 L 53 125 L 55 123 L 56 121 L 56 118 L 59 115 L 62 115 L 67 112 L 76 111 L 79 110 L 82 109 L 85 107 L 88 106 L 89 104 L 89 101 L 87 99 L 78 99 L 75 100 L 72 102 L 69 103 L 64 104 L 62 104 L 60 101 L 61 99 L 63 97 L 64 92 L 64 86 L 67 82 L 68 78 L 70 76 L 75 76 L 85 72 L 93 71 L 100 68 L 104 68 L 108 67 L 116 63 L 118 65 L 118 67 L 120 69 L 125 69 L 132 67 L 135 70 L 134 73 L 132 76 L 131 84 L 130 87 L 128 90 L 127 93 L 127 101 L 123 108 L 123 112 L 122 115 L 120 118 L 119 126 L 118 128 L 116 130 L 115 135 L 110 143 L 104 150 L 101 153 L 99 153 L 97 151 L 97 145 L 98 140 L 99 136 L 100 131 L 104 124 L 105 118 L 105 113 L 102 110 L 98 110 L 96 111 L 91 119 L 91 123 L 90 125 L 88 127 L 87 129 L 86 134 L 84 141 L 83 147 L 83 152 L 84 156 L 85 158 L 86 160 L 88 162 L 88 163 L 92 165 L 96 165 L 99 164 L 101 163 L 106 159 L 107 158 L 112 151 L 116 147 L 118 149 L 120 155 L 123 157 L 125 158 L 129 158 L 131 157 L 134 155 L 141 148 L 143 144 L 146 142 L 148 144 L 148 146 L 151 149 L 151 150 L 153 152 L 162 152 L 167 148 L 176 138 L 179 135 L 181 135 L 183 137 L 183 138 L 185 140 L 188 142 L 190 143 L 193 144 L 200 144 L 205 143 L 213 140 L 218 136 L 222 135 L 227 132 L 234 127 L 240 122 L 242 124 L 242 126 L 247 131 L 253 134 L 262 134 L 269 132 L 277 129 L 279 128 L 281 127 L 288 123 L 291 120 L 294 119 L 298 116 L 303 112 L 316 100 L 317 99 L 323 93 L 325 91 L 325 90 L 328 88 L 329 87 L 332 83 L 332 81 L 329 79 L 320 87 L 309 98 L 303 103 L 300 104 L 293 110 L 290 111 L 286 115 L 281 118 L 279 119 L 272 122 L 269 123 L 266 123 L 262 125 L 260 125 L 258 124 L 254 120 L 253 118 L 253 115 L 256 112 L 258 111 L 260 111 L 262 110 L 269 106 L 274 103 L 278 99 L 280 96 L 281 93 L 284 90 L 284 82 L 283 79 L 278 75 L 269 75 L 266 76 L 263 79 L 260 80 L 251 89 L 247 94 L 246 98 L 244 100 L 243 102 L 243 105 L 242 107 L 240 110 L 228 122 L 221 127 L 217 129 L 209 133 L 206 134 L 198 134 L 195 131 L 194 129 L 193 126 L 193 123 L 196 120 L 198 119 L 204 117 L 207 116 L 210 113 L 215 111 L 220 106 L 223 102 L 224 100 L 224 96 L 225 95 L 225 92 L 224 88 L 222 86 L 219 84 L 211 84 L 204 87 L 202 88 L 195 94 L 191 99 L 188 103 L 187 105 L 187 107 L 183 112 L 179 122 L 175 126 L 175 128 L 172 132 L 168 137 L 162 143 L 160 141 L 160 127 L 161 123 L 164 118 L 164 109 L 165 106 L 167 103 L 168 100 L 168 96 L 169 93 L 171 90 L 172 87 L 172 82 L 173 80 L 176 77 L 178 76 L 186 75 L 190 73 L 194 72 L 199 72 L 203 71 L 206 70 L 209 68 L 210 66 L 209 63 L 206 62 L 204 62 L 196 64 L 188 64 L 182 67 L 179 67 L 177 64 L 180 60 L 180 57 L 183 54 L 188 53 L 193 52 L 199 52 L 205 51 L 209 49 L 213 48 L 224 48 L 227 47 L 229 45 L 229 43 L 230 41 L 229 39 L 228 37 L 227 36 L 225 35 L 221 35 L 218 36 L 213 39 L 202 40 L 194 43 L 190 43 L 189 44 L 186 44 L 184 41 L 185 39 L 187 37 L 188 35 L 188 28 L 189 24 L 191 22 L 192 19 L 192 13 L 191 11 L 188 9 Z  M 213 94 L 215 96 L 214 98 L 211 102 L 206 107 L 203 110 L 201 110 L 199 108 L 200 106 L 206 99 L 210 95 Z  M 269 87 L 271 90 L 270 92 L 258 103 L 256 101 L 260 97 L 264 91 Z  M 160 60 L 162 60 L 164 62 L 163 68 L 162 70 L 160 72 L 156 73 L 152 77 L 153 83 L 156 83 L 158 85 L 158 87 L 156 90 L 155 101 L 154 104 L 152 106 L 151 109 L 151 116 L 149 120 L 144 132 L 143 134 L 139 138 L 139 140 L 132 147 L 129 144 L 129 141 L 130 134 L 131 129 L 132 124 L 136 114 L 136 106 L 137 104 L 139 102 L 140 100 L 140 95 L 141 92 L 143 89 L 144 86 L 144 82 L 145 79 L 147 76 L 148 73 L 148 67 L 152 63 L 155 63 Z"
          fill="url(#footerCleanGoldGrad)"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
}

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const footerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: luxuryEase,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const columnVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: luxuryEase },
  },
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setIsSubscribed(false);
    }, 4000);
  };

  return (
    <footer
      id="footer"
      aria-label="Fitee Brand Heritage Footer"
      className="relative w-full overflow-hidden isolate select-none bg-[#090E0A] text-[#FAF4EA]"
    >
      {/* ─── 1. Top Woven Selvedge Geometric Ribbon ─── */}
      <FooterHeritageBorder />

      {/* ─── 2. Tactile Paper Texture Overlay ─── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "300px 300px",
        }}
      />

      {/* ─── 3. Subtle Warm Ambient Radial Base Glow & Sacred Horizon ─── */}
      <div
        className="absolute inset-x-0 bottom-0 h-[320px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(212, 161, 62, 0.08), transparent 75%)",
        }}
      />
      <FooterSacredBackdrop />

      {/* ─── 4. Main Nav & Newsletter Content (Streamlined Single-Tier Grid) ─── */}
      <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={footerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-start"
        >
          {/* ── Column 1: Brand Anchor & Socials (Lg: 4 cols) ── */}
          <motion.div
            variants={columnVariants}
            className="lg:col-span-4 flex flex-col justify-between pr-0 lg:pr-6"
          >
            <div>
              {/* Authentic Cursive Logomark */}
              <a href="#hero" aria-label="Fitee Home" className="inline-block group mb-1">
                <FiteeAuthenticLogo />
              </a>

              {/* Tagline Ribbon with delicate gold rules */}
              <div className="flex items-center gap-2.5 my-3">
                <span className="w-5 h-px bg-[#C48D3F]/50" />
                <span className="font-sans text-[10px] sm:text-[10.5px] font-semibold tracking-[0.22em] text-[#D4A13E] uppercase">
                  PEOPLE · ROOTS · STORIES · ON FABRIC
                </span>
                <span className="w-5 h-px bg-[#C48D3F]/50" />
              </div>

              {/* Crisp Editorial Bio */}
              <p className="font-sans text-[13px] sm:text-[13.5px] leading-[1.65] text-[#9EA89C] max-w-[320px] font-normal">
                Contemporary apparel inspired by the tribal art, nature and everyday life of Jharkhand.
              </p>
            </div>

            {/* Social Media Tags: Clean, Minimalist Burnished Bronze Icons */}
            <div className="mt-8 flex items-center gap-4 text-[#D4A13E]">
              {[
                { name: "Instagram", icon: <InstagramIcon className="w-[18px] h-[18px]" />, href: "https://instagram.com" },
                { name: "Facebook", icon: <FacebookIcon className="w-[18px] h-[18px]" />, href: "https://facebook.com" },
                { name: "YouTube", icon: <YoutubeIcon className="w-[19px] h-[19px]" />, href: "https://youtube.com" },
                { name: "Pinterest", icon: <PinterestIcon className="w-[18px] h-[18px]" />, href: "https://pinterest.com" },
                { name: "X", icon: <XIcon className="w-[16px] h-[16px]" />, href: "https://x.com" },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow Fitee on ${social.name}`}
                  className="hover:text-[#FAF4EA] hover:scale-115 transition-all duration-200 cursor-pointer p-1"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── Column 2: Shop (Lg: 2 cols) ── */}
          <motion.div variants={columnVariants} className="lg:col-span-2">
            <h3 className="font-editorial text-[17px] sm:text-[18px] font-bold text-[#FAF4EA] tracking-tight mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "All Products", href: "#shop" },
                { label: "Tribal Heritage", href: "#collection" },
                { label: "Oversized Fit", href: "#shop" },
                { label: "New Arrivals", href: "#shop" },
                { label: "Bestsellers", href: "#shop" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="font-sans text-[13px] sm:text-[13.5px] text-[#9EA89C] hover:text-[#E5A93C] transition-colors duration-200 inline-block hover:translate-x-0.5"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Column 3: Company (Lg: 2 cols) ── */}
          <motion.div variants={columnVariants} className="lg:col-span-2">
            <h3 className="font-editorial text-[17px] sm:text-[18px] font-bold text-[#FAF4EA] tracking-tight mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Our Story", href: "#about" },
                { label: "Journal", href: "#journal" },
                { label: "Custom Orders", href: "#custom-design" },
                { label: "Shipping Policy", href: "#shipping" },
                { label: "Returns & Exchange", href: "#returns" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="font-sans text-[13px] sm:text-[13.5px] text-[#9EA89C] hover:text-[#E5A93C] transition-colors duration-200 inline-block hover:translate-x-0.5"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Column 4: Join Our Journey (Lg: 4 cols) ── */}
          <motion.div variants={columnVariants} className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <h3 className="font-editorial text-[17px] sm:text-[18px] font-bold text-[#FAF4EA] tracking-tight mb-2">
                Join Our Journey
              </h3>
              <p className="font-sans text-[13px] text-[#9EA89C] leading-[1.55] mb-4">
                Get updates on new collections, stories and special drops.
              </p>

              {/* Refined Pill Newsletter Input */}
              <form onSubmit={handleSubscribe} className="relative">
                <div className="relative flex items-center rounded-full bg-[#111711] border border-[#2B392A] hover:border-[#4B5E48] focus-within:border-[#D4A13E] focus-within:ring-2 focus-within:ring-[#D4A13E]/20 transition-all p-1 pl-4 sm:pl-4.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    aria-label="Email address for newsletter"
                    className="bg-transparent text-[#FAF4EA] placeholder-[#647462] text-[13px] outline-none flex-1 font-sans min-w-0"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="w-8.5 h-8.5 rounded-full bg-gradient-to-r from-[#D4A13E] to-[#E5B55A] hover:from-[#E5B55A] hover:to-[#F3C775] text-[#090E0A] flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-[0_2px_10px_rgba(212,161,62,0.25)] hover:scale-105 cursor-pointer ml-1"
                  >
                    {isSubscribed ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <ArrowRight className="w-4 h-4 stroke-[2.4]" />
                    )}
                  </button>
                </div>
                {isSubscribed && (
                  <p className="absolute -bottom-5 left-3 text-[11px] text-[#E5B55A] font-sans font-medium">
                    Thank you for joining our journey!
                  </p>
                )}
              </form>

              <p className="font-sans text-[11px] text-[#617260] mt-3">
                By subscribing, you agree to our Privacy Policy.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ─── 5. Sub-Footer Bottom Bar ─── */}
      <div className="relative z-10 border-t border-[#182217] bg-[#070B07]/95 py-5 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
          {/* Copyright */}
          <p className="font-sans text-[11.5px] sm:text-[12px] text-[#788876]">
            © 2026 Fitee. All rights reserved.
          </p>

          {/* Designed in Jharkhand · Worn Everywhere */}
          <div className="flex items-center justify-center gap-2 text-[#D4A13E] font-sans text-[11.5px] sm:text-[12px] font-medium tracking-wide">
            <span>Designed in Jharkhand</span>
            <ConcentricSunEmblem className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span className="text-[#364634]">|</span>
            <span>Worn Everywhere</span>
          </div>

          {/* Legal / Policy Links */}
          <div className="flex items-center gap-3 text-[#788876] font-sans text-[11.5px] sm:text-[12px]">
            <a href="#terms" className="hover:text-[#E5A93C] transition-colors">
              Terms
            </a>
            <span className="text-[#263324]">|</span>
            <a href="#privacy" className="hover:text-[#E5A93C] transition-colors">
              Privacy
            </a>
            <span className="text-[#263324]">|</span>
            <a href="#faq" className="hover:text-[#E5A93C] transition-colors">
              FAQ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Named alias
export default Footer;
