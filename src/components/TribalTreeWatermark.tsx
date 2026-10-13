import React from "react";
import Image from "next/image";

import tribalTreeClean from "../../public/images/tribal-tree-clean.png";

interface TribalTreeWatermarkProps {
  className?: string;
  opacity?: number;
}

/**
 * Authentic Sacred Kalpavriksha (Tree of Life) & Karam Festival Dancers
 * Pixel-accurate reproduction of the traditional Jharkhand Sohrai/Karam folk art
 * featuring the central sacred tree, six flared-skirt dancers holding hands and sprigs,
 * wildflower floor sprouts, and geometric chevron base border.
 */
export function TribalTreeWatermark({
  className = "",
  opacity = 0.32,
}: TribalTreeWatermarkProps) {
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      <div className="relative w-full h-full">
        <Image
          src={tribalTreeClean}
          alt="Sacred Karam Tree of Life and Tribal Dancers"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 960px"
          className="object-contain object-center drop-shadow-[0_2px_12px_rgba(184,123,46,0.15)]"
        />
      </div>
    </div>
  );
}
