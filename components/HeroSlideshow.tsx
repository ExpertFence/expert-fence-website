"use client";

import { useEffect, useState } from "react";
import FenceArt from "@/components/illustrations/FenceArt";

const SLIDES: { variant: Parameters<typeof FenceArt>[0]["variant"]; label: string }[] = [
  { variant: "hero", label: "Cedar Privacy & Drive Gate" },
  { variant: "residential", label: "Estate Drive Gate" },
  { variant: "aluminum", label: "Pool Enclosure" },
  { variant: "wood", label: "Cedar with Lattice Top" },
  { variant: "commercial", label: "Arched Gate & Finial Posts" },
];

export default function HeroSlideshow({ className = "" }: { className?: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), 4800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={className}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-card">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.label}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === active ? 1 : 0 }}
            aria-hidden={i !== active}
          >
            <FenceArt variant={slide.variant} label={slide.label} />
          </div>
        ))}
        <span className="absolute right-3 top-3 rounded-full bg-black/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
          Sample art — add real photo
        </span>
        <div className="absolute bottom-3 left-3 z-10 rounded bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          {SLIDES[active].label}
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.label}
            type="button"
            aria-label={slide.label}
            onClick={() => setActive(i)}
            className={`h-10 flex-1 overflow-hidden rounded border-2 transition ${
              i === active ? "border-brand-500 opacity-100" : "border-transparent opacity-60 hover:opacity-90"
            }`}
          >
            <div className="pointer-events-none h-full w-full scale-[3]">
              <FenceArt variant={slide.variant} label="" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
