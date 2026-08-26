"use client";

import { useState } from "react";

const STEPS = [
  {
    n: "01",
    title: "Walk & Measure",
    tag: "Free on-site estimate.",
    detail:
      "We meet you at the property, walk the line, check grade, drainage and utility clearances, and talk through material options. Typically 30 to 45 minutes. Nothing is owed and nothing is assumed.",
  },
  {
    n: "02",
    title: "Drawing & Quote",
    tag: "Itemized. In writing.",
    detail:
      "You receive a layout drawing and a line-by-line quote covering material, post spacing, gates, hardware, labor and a start window. The number you sign is the number you pay.",
  },
  {
    n: "03",
    title: "Permits & Build",
    tag: "Our crews. Never subbed.",
    detail:
      "We pull county and municipal permits, submit to your HOA, and schedule utility marking. Then our own crews set posts and build the fence. Installation is never handed to a subcontractor.",
  },
  {
    n: "04",
    title: "Walkthrough",
    tag: "Every gate adjusted.",
    detail:
      "We walk the finished fence with you, adjust and level every gate, clear all debris from the site, and hand over care instructions along with your warranty paperwork.",
  },
];

export default function ProcessSteps() {
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ perspective: "1400px" }}>
      {STEPS.map((step, i) => {
        const isOn = flipped === i;
        return (
          <button
            key={step.n}
            type="button"
            aria-expanded={isOn}
            onClick={() => setFlipped(isOn ? null : i)}
            onMouseLeave={() => setFlipped((cur) => (cur === i ? null : cur))}
            onBlur={() => setFlipped((cur) => (cur === i ? null : cur))}
            className="relative h-64 text-left transition-transform duration-300 ease-out hover:-translate-y-2 focus-visible:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="relative h-full w-full transition-transform duration-700"
              style={{
                transformStyle: "preserve-3d",
                transform: isOn ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* front */}
              <div
                className="absolute inset-0 flex flex-col justify-start rounded-lg border border-white/15 bg-navy-800/90 p-6"
                style={{ backfaceVisibility: "hidden" }}
              >
                <b className="block text-4xl font-bold leading-none text-white/30">{step.n}</b>
                <h4 className="mt-2 text-xl font-bold text-white">{step.title}</h4>
                <span className="mt-1 text-sm text-navy-100/75">{step.tag}</span>
                <span className="mt-auto pt-3 text-[11px] uppercase tracking-widest text-white/40">
                  Click for detail
                </span>
              </div>
              {/* back */}
              <div
                className="absolute inset-0 flex flex-col justify-center rounded-lg border border-white/15 bg-navy-700 p-6"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <p className="text-sm leading-relaxed text-navy-50">{step.detail}</p>
                <span className="mt-3 text-[11px] uppercase tracking-widest text-white/40">
                  Move away to close
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
