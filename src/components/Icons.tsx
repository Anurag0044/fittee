import React from "react";

// Luxury handcrafted vector script logo for "Fittee."
export function FitteeLogo({ className = "h-11 sm:h-12 lg:h-[50px] w-auto" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center select-none ${className}`}>
      {/* Crisp vector luxury gold logomark */}
      <img
        src="/images/fittee-logo.svg"
        alt="Fittee."
        className="h-full w-auto object-contain transition-all duration-300 group-hover:brightness-110 drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]"
      />
    </div>
  );
}

// 1. Premium Fabrics / Everyday Wear (Stylized twin leaf motif)
export function FabricLeafIcon({ className = "w-6 h-6 text-[#E5A93C]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Outer leaf */}
      <path d="M12 21a9 9 0 0 0 9-9c0-6-6-9-9-9s-9 3-9 9a9 9 0 0 0 9 9z" />
      {/* Inner organic vein curve */}
      <path d="M3 12c4 0 7 2 9 6" />
      <path d="M12 3c0 4 2 7 6 9" />
    </svg>
  );
}

// 2. Authentic Tribal Designs / Rooted in Culture (Sohrai radiant sun motif)
export function TribalSunIcon({ className = "w-6 h-6 text-[#E5A93C]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Central circular core */}
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      {/* Radiating tribal rays */}
      <line x1="12" y1="2.2" x2="12" y2="4.8" />
      <line x1="12" y1="19.2" x2="12" y2="21.8" />
      <line x1="2.2" y1="12" x2="4.8" y2="12" />
      <line x1="19.2" y1="12" x2="21.8" y2="12" />
      {/* Diagonal rays */}
      <line x1="5.1" y1="5.1" x2="7" y2="7" />
      <line x1="17" y1="17" x2="18.9" y2="18.9" />
      <line x1="5.1" y1="18.9" x2="7" y2="17" />
      <line x1="17" y1="7" x2="18.9" y2="5.1" />
      {/* Small tribal orbital dots */}
      <circle cx="12" cy="1" r="0.8" fill="currentColor" />
      <circle cx="23" cy="12" r="0.8" fill="currentColor" />
      <circle cx="12" cy="23" r="0.8" fill="currentColor" />
      <circle cx="1" cy="12" r="0.8" fill="currentColor" />
    </svg>
  );
}

// 3. Custom & Bulk Orders (Isometric 3D box wireframe)
export function IsometricBoxIcon({ className = "w-6 h-6 text-[#E5A93C]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Top rhombus face */}
      <path d="M12 2.5 L20.5 7.4 L12 12.3 L3.5 7.4 Z" />
      {/* Left side face */}
      <path d="M3.5 7.4 L3.5 16.6 L12 21.5 L12 12.3 Z" />
      {/* Right side face */}
      <path d="M12 12.3 L12 21.5 L20.5 16.6 L20.5 7.4 Z" />
      {/* Inner design mark */}
      <circle cx="12" cy="7.4" r="1.3" />
    </svg>
  );
}

// 4. Proudly from Jharkhand, India (Geometric mountain peaks)
export function JharkhandMountainIcon({ className = "w-6 h-6 text-[#E5A93C]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Primary mountain peak */}
      <path d="M3 19.5 L13 4.5 L21 19.5 Z" />
      {/* Secondary overlapping ridge */}
      <path d="M11 19.5 L16.5 11 L22 19.5" />
      {/* Baseline */}
      <line x1="2" y1="19.5" x2="22" y2="19.5" />
    </svg>
  );
}
