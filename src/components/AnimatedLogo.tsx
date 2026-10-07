"use client";

import React, { useRef, useEffect, useId } from "react";
import { gsap } from "gsap";

interface AnimatedLogoProps {
  className?: string;
}

export function AnimatedLogo({
  className = "h-11 sm:h-12 lg:h-[48px] xl:h-[52px] w-auto",
}: AnimatedLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const cleanId = rawId.replace(/:/g, "");
  const gradId = `fitteeGoldGrad-${cleanId}`;
  const glowId = `luxuryGlow-${cleanId}`;
  const maskId = `cursiveMask-${cleanId}`;
  const fullMaskId = `maskFull-${cleanId}`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const fTopEl = container.querySelector<SVGPathElement>(`#stroke_f_top-${cleanId}`);
      const fStemEl = container.querySelector<SVGPathElement>(`#stroke_f_stem-${cleanId}`);
      const bodyEl = container.querySelector<SVGPathElement>(`#stroke_body-${cleanId}`);
      const barEl = container.querySelector<SVGPathElement>(`#stroke_bar-${cleanId}`);
      const dotEl = container.querySelector<SVGPathElement>(`#stroke_dot-${cleanId}`);
      const fullVeil = container.querySelector<SVGRectElement>(`#${fullMaskId}`);

      if (!fTopEl || !fStemEl || !bodyEl || !barEl || !dotEl || !fullVeil) return;

      const fTopLen = fTopEl.getTotalLength ? fTopEl.getTotalLength() : 120;
      const fStemLen = fStemEl.getTotalLength ? fStemEl.getTotalLength() : 280;
      const bodyLen = bodyEl.getTotalLength ? bodyEl.getTotalLength() : 1500;
      const barLen = barEl.getTotalLength ? barEl.getTotalLength() : 180;
      const dotLen = dotEl.getTotalLength ? dotEl.getTotalLength() : 40;

      // Clean Slate: strictly 0 opacity initially to eliminate any premature lines or dots
      gsap.set(fTopEl, { strokeDasharray: fTopLen + 5, strokeDashoffset: fTopLen + 5, opacity: 0 });
      gsap.set(fStemEl, { strokeDasharray: fStemLen + 5, strokeDashoffset: fStemLen + 5, opacity: 0 });
      gsap.set(bodyEl, { strokeDasharray: bodyLen + 5, strokeDashoffset: bodyLen + 5, opacity: 0 });
      gsap.set(barEl, { strokeDasharray: barLen + 5, strokeDashoffset: barLen + 5, opacity: 0 });
      gsap.set(dotEl, { strokeDasharray: dotLen + 5, strokeDashoffset: dotLen + 5, opacity: 0 });
      gsap.set(fullVeil, { opacity: 0 });

      // Natural, deliberate cursive calligraphy timeline (F -> i -> tt -> ee flow)
      const tl = gsap.timeline({
        delay: 0.2, // graceful entrance breath
      });

      // 1. Capital 'F' crown flourish (left to right, stays cleanly within F)
      tl.to(fTopEl, {
        opacity: 1,
        duration: 0.04,
      })
        .to(fTopEl, {
          strokeDashoffset: 0,
          duration: 0.32,
          ease: "power2.out",
        }, "<")

        // 2. Capital 'F' stem plunges from top of stem, loops through descender, rises to waist
        .to(fStemEl, {
          opacity: 1,
          duration: 0.04,
        }, "-=0.12")
        .to(fStemEl, {
          strokeDashoffset: 0,
          duration: 0.42,
          ease: "power1.inOut",
        }, "<")

        // 3. Fluid cursive flow through the word body: i -> tt (full peaks) -> ee (tail)
        .to(bodyEl, {
          opacity: 1,
          duration: 0.04,
        }, "-=0.08")
        .to(bodyEl, {
          strokeDashoffset: 0,
          duration: 1.75,
          ease: "power1.inOut",
        }, "<")

        // 4. Swift signature crossbar flourish across the double t's (drawn only after letters)
        .to(barEl, {
          opacity: 1,
          duration: 0.04,
        }, "-=0.15")
        .to(barEl, {
          strokeDashoffset: 0,
          duration: 0.32,
          ease: "power2.out",
        }, "<")

        // 5. Delicate ink dot on the 'i'
        .to(dotEl, {
          opacity: 1,
          duration: 0.04,
        }, "-=0.08")
        .to(dotEl, {
          strokeDashoffset: 0,
          duration: 0.12,
          ease: "none",
        }, "<")

        // 6. Seamless veil brings 100% vector shape to crisp perfection
        .to(fullVeil, {
          opacity: 1,
          duration: 0.22,
          ease: "power1.in",
        }, "+=0.04");

    }, container);

    return () => ctx.revert();
  }, [cleanId, fullMaskId]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center select-none cursor-pointer transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] ${className}`}
    >
      <svg
        viewBox="9 7 325 194"
        fill="none"
        className="h-full w-auto overflow-visible drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]"
      >
        <defs>
          {/* Authentic Brand Gold Gradient - 100% Identical to Default Logo */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#FCE6A8" />
            <stop offset="30%" stopColor="#EDB34A" />
            <stop offset="70%" stopColor="#DE992B" />
            <stop offset="100%" stopColor="#B87515" />
          </linearGradient>

          {/* Luxury Drop Glow */}
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.65" />
            <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#EDB34A" floodOpacity="0.3" />
          </filter>

          {/* Clean Cursive Write-on Mask - Natural Calligraphy Anatomy */}
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="350" height="210">
            {/* 100% Black Background = Hidden canvas */}
            <rect width="100%" height="100%" fill="black" />

            {/* Cursive Writing Path in White */}
            <g stroke="white" strokeWidth="38" strokeLinecap="round" strokeLinejoin="round" fill="none">
              {/* 1. Capital 'F' crown flourish (stays within F bounds) */}
              <path
                id={`stroke_f_top-${cleanId}`}
                d="M 14 88 C 35 76 60 65 92 58"
                opacity={0}
                style={{ opacity: 0 }}
              />

              {/* 2. Capital 'F' vertical stem & descender loop */}
              <path
                id={`stroke_f_stem-${cleanId}`}
                d="M 48 86 C 40 115 30 155 20 198 C 22 201 36 200 42 180 C 48 155 55 125 75 110"
                opacity={0}
                style={{ opacity: 0 }}
              />

              {/* 3. Cursive word body from F waist into: i -> tt (full peaks) -> ee */}
              <path
                id={`stroke_body-${cleanId}`}
                d="M 75 110 C 85 130 88 155 94 164 C 99 165 108 155 116 146 C 126 120 140 50 156 15 C 155 50 148 110 148 148 C 160 110 174 45 188 9 C 186 45 180 105 178 142 C 198 120 218 95 224 88 C 220 82 205 85 196 100 C 188 115 192 132 205 135 C 215 136 225 130 232 125 C 248 105 272 82 280 78 C 278 72 260 76 250 92 C 242 108 245 125 258 127 C 275 128 300 108 330 81"
                opacity={0}
                style={{ opacity: 0 }}
              />

              {/* 4. Signature crossbar flourish across the double t's (drawn after letters) */}
              <path
                id={`stroke_bar-${cleanId}`}
                d="M 115 58 C 145 58 185 55 230 44"
                opacity={0}
                style={{ opacity: 0 }}
              />

              {/* 5. 'i' dot */}
              <path
                id={`stroke_dot-${cleanId}`}
                d="M 101 88 L 109 95"
                strokeWidth={24}
                opacity={0}
                style={{ opacity: 0 }}
              />
            </g>

            {/* Seamless veil ensures 100% crisp vector display post-animation */}
            <rect
              id={fullMaskId}
              width="100%"
              height="100%"
              fill="white"
              opacity={0}
              style={{ opacity: 0 }}
            />
          </mask>
        </defs>

        {/* The Authentic Brand Gold Logo penned out cleanly in natural cursive */}
        <path
          d="M 104 84 L 100 87 L 99 88 L 98 90 L 98 96 L 99 98 L 101 100 L 108 100 L 111 97 L 112 95 L 112 88 L 111 86 L 109 84 Z  M 184 9 L 182 10 L 179 13 L 178 16 L 175 19 L 175 24 L 174 28 L 171 33 L 170 41 L 169 44 L 168 46 L 166 48 L 164 49 L 159 51 L 157 51 L 155 49 L 155 47 L 156 41 L 157 38 L 159 35 L 160 32 L 160 26 L 162 22 L 162 19 L 161 17 L 159 15 L 153 15 L 151 16 L 149 19 L 148 21 L 147 23 L 144 34 L 143 38 L 143 43 L 142 46 L 140 48 L 140 51 L 139 53 L 137 55 L 135 56 L 131 56 L 128 57 L 123 60 L 121 58 L 120 52 L 118 51 L 115 51 L 110 54 L 107 55 L 99 56 L 93 59 L 89 59 L 86 60 L 83 62 L 80 63 L 75 63 L 71 64 L 66 67 L 59 68 L 56 70 L 52 71 L 49 71 L 45 72 L 42 74 L 39 75 L 35 75 L 31 76 L 27 79 L 19 80 L 17 81 L 14 83 L 11 86 L 11 91 L 14 94 L 19 94 L 24 92 L 31 88 L 36 88 L 39 87 L 41 85 L 47 83 L 49 83 L 52 86 L 50 93 L 47 98 L 47 102 L 46 105 L 41 110 L 38 111 L 33 111 L 30 112 L 26 115 L 23 115 L 20 116 L 17 118 L 13 122 L 12 124 L 13 128 L 17 130 L 19 129 L 22 127 L 25 124 L 27 123 L 32 123 L 35 121 L 37 121 L 39 123 L 39 127 L 38 132 L 35 139 L 35 143 L 32 148 L 31 152 L 31 159 L 30 161 L 28 163 L 27 165 L 27 170 L 26 174 L 24 177 L 23 181 L 23 186 L 20 193 L 19 197 L 19 199 L 35 199 L 35 197 L 36 196 L 36 192 L 37 188 L 39 185 L 40 180 L 40 173 L 44 166 L 45 157 L 48 145 L 51 138 L 52 134 L 51 130 L 53 125 L 55 123 L 56 121 L 56 118 L 59 115 L 62 115 L 67 112 L 76 111 L 79 110 L 82 109 L 85 107 L 88 106 L 89 104 L 89 101 L 87 99 L 78 99 L 75 100 L 72 102 L 69 103 L 64 104 L 62 104 L 60 101 L 61 99 L 63 97 L 64 92 L 64 86 L 67 82 L 68 78 L 70 76 L 75 76 L 85 72 L 93 71 L 100 68 L 104 68 L 108 67 L 116 63 L 118 65 L 118 67 L 120 69 L 125 69 L 132 67 L 135 70 L 134 73 L 132 76 L 131 84 L 130 87 L 128 90 L 127 93 L 127 101 L 123 108 L 123 112 L 122 115 L 120 118 L 119 126 L 118 128 L 116 130 L 115 135 L 110 143 L 104 150 L 101 153 L 99 153 L 97 151 L 97 145 L 98 140 L 99 136 L 100 131 L 104 124 L 105 118 L 105 113 L 102 110 L 98 110 L 96 111 L 91 119 L 91 123 L 90 125 L 88 127 L 87 129 L 86 134 L 84 141 L 83 147 L 83 152 L 84 156 L 85 158 L 86 160 L 88 162 L 88 163 L 92 165 L 96 165 L 99 164 L 101 163 L 106 159 L 107 158 L 112 151 L 116 147 L 118 149 L 120 155 L 123 157 L 125 158 L 129 158 L 131 157 L 134 155 L 141 148 L 143 144 L 146 142 L 148 144 L 148 146 L 151 149 L 151 150 L 153 152 L 162 152 L 167 148 L 176 138 L 179 135 L 181 135 L 183 137 L 183 138 L 185 140 L 188 142 L 190 143 L 193 144 L 200 144 L 205 143 L 213 140 L 218 136 L 222 135 L 227 132 L 234 127 L 240 122 L 242 124 L 242 126 L 247 131 L 253 134 L 262 134 L 269 132 L 277 129 L 279 128 L 281 127 L 288 123 L 291 120 L 294 119 L 298 116 L 303 112 L 316 100 L 317 99 L 323 93 L 325 91 L 325 90 L 328 88 L 329 87 L 332 83 L 332 81 L 329 79 L 320 87 L 309 98 L 303 103 L 300 104 L 293 110 L 290 111 L 286 115 L 281 118 L 279 119 L 272 122 L 269 123 L 266 123 L 262 125 L 260 125 L 258 124 L 254 120 L 253 118 L 253 115 L 256 112 L 258 111 L 260 111 L 262 110 L 269 106 L 274 103 L 278 99 L 280 96 L 281 93 L 284 90 L 284 82 L 283 79 L 278 75 L 269 75 L 266 76 L 263 79 L 260 80 L 251 89 L 247 94 L 246 98 L 244 100 L 243 102 L 243 105 L 242 107 L 240 110 L 228 122 L 221 127 L 217 129 L 209 133 L 206 134 L 198 134 L 195 131 L 194 129 L 193 126 L 193 123 L 196 120 L 198 119 L 204 117 L 207 116 L 210 113 L 215 111 L 220 106 L 223 102 L 224 100 L 224 96 L 225 95 L 225 92 L 224 88 L 222 86 L 219 84 L 211 84 L 204 87 L 202 88 L 195 94 L 191 99 L 188 103 L 187 105 L 187 107 L 183 112 L 179 122 L 175 126 L 175 128 L 172 132 L 168 137 L 162 143 L 160 141 L 160 127 L 161 123 L 164 118 L 164 109 L 165 106 L 167 103 L 168 100 L 168 96 L 169 93 L 171 90 L 172 87 L 172 82 L 173 80 L 176 77 L 178 76 L 186 75 L 190 73 L 194 72 L 199 72 L 203 71 L 206 70 L 209 68 L 210 66 L 209 63 L 206 62 L 204 62 L 196 64 L 188 64 L 182 67 L 179 67 L 177 64 L 180 60 L 180 57 L 183 54 L 188 53 L 193 52 L 199 52 L 205 51 L 209 49 L 213 48 L 224 48 L 227 47 L 229 45 L 229 43 L 230 41 L 229 39 L 228 37 L 227 36 L 225 35 L 221 35 L 218 36 L 213 39 L 202 40 L 194 43 L 190 43 L 189 44 L 186 44 L 184 41 L 185 39 L 187 37 L 188 35 L 188 28 L 189 24 L 191 22 L 192 19 L 192 13 L 191 11 L 188 9 Z  M 213 94 L 215 96 L 214 98 L 211 102 L 206 107 L 203 110 L 201 110 L 199 108 L 200 106 L 206 99 L 210 95 Z  M 269 87 L 271 90 L 270 92 L 258 103 L 256 101 L 260 97 L 264 91 Z  M 160 60 L 162 60 L 164 62 L 163 68 L 162 70 L 160 72 L 156 73 L 152 77 L 153 83 L 156 83 L 158 85 L 158 87 L 156 90 L 155 101 L 154 104 L 152 106 L 151 109 L 151 116 L 149 120 L 144 132 L 143 134 L 139 138 L 139 140 L 132 147 L 129 144 L 129 141 L 130 134 L 131 129 L 132 124 L 136 114 L 136 106 L 137 104 L 139 102 L 140 100 L 140 95 L 141 92 L 143 89 L 144 86 L 144 82 L 145 79 L 147 76 L 148 73 L 148 67 L 152 63 L 155 63 Z"
          fill={`url(#${gradId})`}
          fillRule="evenodd"
          filter={`url(#${glowId})`}
          mask={`url(#${maskId})`}
        />
      </svg>
    </div>
  );
}
