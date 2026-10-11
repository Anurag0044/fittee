import React from "react";

// Luxury handcrafted vector script logo for "Fittee."
export function FitteeLogo({ className = "h-11 sm:h-12 lg:h-[50px] w-auto" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center select-none ${className}`}>
      {/* Crisp vector luxury gold logomark */}
      <img
        src="/images/fittee-logo.svg"
        alt="Fittee."
        className="h-full w-auto object-contain transition-all duration-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]"
      />
    </div>
  );
}

// 1. Premium Fabrics / Everyday Wear (Isometric Quilted Textile Swatch Stack)
export function QuiltedFabricIcon({ className = "w-7 h-7 sm:w-8 sm:h-8 text-[#543818]" }: { className?: string }) {
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
      {/* Top folded sheet: isometric diamond with soft rounded corners */}
      <path d="M16 4.8 L27.5 11.5 L16 18.2 L4.5 11.5 Z" />
      {/* Quilted diamond stitches on top surface */}
      <path d="M9 9.5 L20 16" strokeDasharray="1.2 2" strokeWidth="1.2" />
      <path d="M13 7.2 L24 13.8" strokeDasharray="1.2 2" strokeWidth="1.2" />
      <path d="M20 7.2 L9 13.8" strokeDasharray="1.2 2" strokeWidth="1.2" />
      <path d="M24 9.5 L13 16" strokeDasharray="1.2 2" strokeWidth="1.2" />
      {/* Middle fold layer */}
      <path d="M4.5 11.5 v4.2 c0 1 1.2 1.8 2.8 2.6 L16 24.2 L27.5 17.5 v-4.2" />
      {/* Bottom stacked fold layer */}
      <path d="M4.5 18.2 v4.2 c0 1.2 1.4 2.2 3.2 3 L16 30.2 L27.5 23.5 v-4.2" />
    </svg>
  );
}

// 2. Authentic Tribal Designs / Rooted in Culture (Sohrai Concentric Mandala Sun)
export function ConcentricTribalSunIcon({ className = "w-7 h-7 sm:w-8 sm:h-8 text-[#543818]" }: { className?: string }) {
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
      {/* Center ring and solid center dot */}
      <circle cx="16" cy="16" r="2.8" strokeWidth="1.8" />
      <circle cx="16" cy="16" r="1.1" fill="currentColor" stroke="none" />
      {/* Middle concentric ring */}
      <circle cx="16" cy="16" r="5.8" strokeWidth="1.6" />
      {/* Outer concentric ring */}
      <circle cx="16" cy="16" r="8.8" strokeWidth="1.8" />
      {/* 8 Primary rays (Cardinal & 45-degree diagonal) */}
      <line x1="16" y1="2.5" x2="16" y2="6.2" strokeWidth="1.9" />
      <line x1="16" y1="25.8" x2="16" y2="29.5" strokeWidth="1.9" />
      <line x1="2.5" y1="16" x2="6.2" y2="16" strokeWidth="1.9" />
      <line x1="25.8" y1="16" x2="29.5" y2="16" strokeWidth="1.9" />
      <line x1="6.5" y1="6.5" x2="9.2" y2="9.2" strokeWidth="1.9" />
      <line x1="22.8" y1="22.8" x2="25.5" y2="25.5" strokeWidth="1.9" />
      <line x1="25.5" y1="6.5" x2="22.8" y2="9.2" strokeWidth="1.9" />
      <line x1="9.2" y1="22.8" x2="6.5" y2="25.5" strokeWidth="1.9" />
      {/* 8 Secondary tick rays */}
      <line x1="11.8" y1="4.2" x2="12.7" y2="6.4" strokeWidth="1.3" />
      <line x1="20.2" y1="4.2" x2="19.3" y2="6.4" strokeWidth="1.3" />
      <line x1="11.8" y1="27.8" x2="12.7" y2="25.6" strokeWidth="1.3" />
      <line x1="20.2" y1="27.8" x2="19.3" y2="25.6" strokeWidth="1.3" />
      <line x1="4.2" y1="11.8" x2="6.4" y2="12.7" strokeWidth="1.3" />
      <line x1="4.2" y1="20.2" x2="6.4" y2="19.3" strokeWidth="1.3" />
      <line x1="27.8" y1="11.8" x2="25.6" y2="12.7" strokeWidth="1.3" />
      <line x1="27.8" y1="20.2" x2="25.6" y2="19.3" strokeWidth="1.3" />
    </svg>
  );
}

// 3. Custom & Bulk Orders (Tailor Silhouette T-Shirt with Measuring Tape Ruler)
export function TailorShirtIcon({ className = "w-7 h-7 sm:w-8 sm:h-8 text-[#543818]" }: { className?: string }) {
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
      {/* Crewneck collar line */}
      <path d="M10.2 6.5 C12.2 9 17.2 9 19.2 6.5" />
      {/* T-shirt silhouette */}
      <path d="M10.2 6.5 L4.5 10.8 L7.8 15.2 L10.5 14 V28.5 H21 V14 L23.6 15.2 L26.8 10.8 L21 6.5" />
      {/* Tailor ruler / measuring tape along right side */}
      <rect x="22.5" y="11.5" width="6" height="17" rx="0.8" strokeWidth="1.7" />
      {/* Ruler inch tick markings */}
      <line x1="22.5" y1="14.8" x2="25" y2="14.8" strokeWidth="1.3" />
      <line x1="22.5" y1="17.8" x2="26.5" y2="17.8" strokeWidth="1.4" />
      <line x1="22.5" y1="20.8" x2="25" y2="20.8" strokeWidth="1.3" />
      <line x1="22.5" y1="23.8" x2="26.5" y2="23.8" strokeWidth="1.4" />
      <line x1="22.5" y1="26.8" x2="25" y2="26.8" strokeWidth="1.3" />
      {/* Vertical tailor stitch seam dots */}
      <line x1="18" y1="14.5" x2="18" y2="25" strokeDasharray="1 2.5" strokeWidth="1.3" />
    </svg>
  );
}

// 4. Proudly from Jharkhand, India (Geographic boundary map of Jharkhand)
export function JharkhandMapIcon({ className = "w-7 h-7 sm:w-8 sm:h-8 text-[#543818]" }: { className?: string }) {
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
      {/* Authentic Geographic contour outline of Jharkhand state */}
      <path d="M9.5 12.8 C7.5 14.2 5 15.5 5 17.5 C5 20 6.8 20.8 6.8 22.8 C6.8 24.8 5.5 26 6.8 28 C8.2 29.5 10.8 28.5 12.5 30.2 C13.8 31.5 15.8 32 17 30.5 C18.5 29 20.2 29.5 21.2 28 C22 26.5 21.2 25 22.5 23.5 C24 22 26 22.5 26 20 C26 18.2 23.8 17.5 25 15 C26.2 12.5 29.5 8.5 28.5 6.5 C27.5 5 25.8 7 24.2 7.5 C23 8 22 6.8 19.5 7.5 C17 8.2 15 7 13.5 8.8 C12 10.2 11.2 11 9.5 12.8 Z" />
      {/* Provenance dot marking Ranchi */}
      <circle cx="18.5" cy="19.5" r="1.3" fill="#C89B48" stroke="none" />
    </svg>
  );
}

// Backward-compatible aliases
export const FabricLeafIcon = QuiltedFabricIcon;
export const TribalSunIcon = ConcentricTribalSunIcon;
export const IsometricBoxIcon = TailorShirtIcon;
export const JharkhandMountainIcon = JharkhandMapIcon;

