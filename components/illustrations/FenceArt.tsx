// Custom brand illustrations — hand-built SVG, not stock photography.
// Used everywhere a real project photo isn't available yet, so the site
// reads as an intentional, finished design rather than an unfinished
// wireframe. Swap any of these for real photography once it's ready.

type Variant =
  | "wood"
  | "vinyl"
  | "chainlink"
  | "aluminum"
  | "commercial"
  | "residential"
  | "repair"
  | "crew"
  | "hero";

const GRADIENTS: Record<string, [string, string]> = {
  a: ["#0f2038", "#1d3a5f"],
  b: ["#152c49", "#0a1526"],
  c: ["#0f2038", "#4b6789"],
};

function pick(seed: string): [string, string] {
  const keys = Object.keys(GRADIENTS);
  const idx = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % keys.length;
  return GRADIENTS[keys[idx]];
}

function WoodPickets({ x = 0 }: { x?: number }) {
  const pickets = Array.from({ length: 9 });
  return (
    <g transform={`translate(${x} 150)`}>
      {pickets.map((_, i) => (
        <rect key={i} x={i * 24} y={-70 + (i % 2 === 0 ? 0 : 6)} width="16" height={70 - (i % 2 === 0 ? 0 : 6)} rx="2" fill="#f2711a" opacity={0.9 - (i % 3) * 0.15} />
      ))}
      <rect x="-4" y="-4" width="220" height="8" fill="#ff8a3d" opacity="0.85" />
    </g>
  );
}

function VinylPanels({ x = 0 }: { x?: number }) {
  return (
    <g transform={`translate(${x} 150)`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={i * 34} y={-64} width="26" height="64" rx="6" fill="#ffffff" opacity={0.92} />
      ))}
      <rect x="-4" y="-4" width="210" height="8" fill="#ffffff" opacity="0.85" />
    </g>
  );
}

function ChainDiamonds({ x = 0 }: { x?: number }) {
  const rows = 4;
  const cols = 8;
  const dias = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = x + c * 18 + (r % 2 === 0 ? 0 : 9);
      const cy = 100 + r * 16;
      dias.push(<path key={`${r}-${c}`} d={`M${cx} ${cy - 9} L${cx + 9} ${cy} L${cx} ${cy + 9} L${cx - 9} ${cy} Z`} stroke="#ff8a3d" strokeWidth="1.4" fill="none" opacity="0.75" />);
    }
  }
  return <g>{dias}</g>;
}

function OrnamentalSpikes({ x = 0 }: { x?: number }) {
  return (
    <g transform={`translate(${x} 150)`}>
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={i} transform={`translate(${i * 26} 0)`}>
          <rect x="0" y="-60" width="4" height="60" fill="#ff8a3d" opacity="0.9" />
          <path d="M-4 -60 L2 -74 L8 -60 Z" fill="#ff8a3d" opacity="0.9" />
        </g>
      ))}
      <rect x="-4" y="-8" width="216" height="6" fill="#ff8a3d" opacity="0.7" />
    </g>
  );
}

function ToolBadge() {
  return (
    <g transform="translate(200 150)">
      <circle r="46" fill="#f2711a" opacity="0.15" />
      <circle r="34" fill="#f2711a" opacity="0.9" />
      <path
        d="M-10 8 L-2 0 L2 4 L10 -4 M2 -10 L10 -18 L18 -10 L10 -2 Z"
        stroke="#ffffff"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(-4 4) scale(1.1)"
      />
    </g>
  );
}

export default function FenceArt({ variant, label }: { variant: Variant; label?: string }) {
  const [from, to] = pick(variant + (label || ""));
  const gid = `grad-${variant}-${(label || "x").replace(/\s+/g, "")}`;

  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label={label || variant}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
        <radialGradient id={`${gid}-glow`} cx="80%" cy="15%" r="60%">
          <stop offset="0%" stopColor="#ff8a3d" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ff8a3d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${gid})`} />
      <rect width="400" height="300" fill={`url(#${gid}-glow)`} />

      {variant === "wood" && (
        <>
          <WoodPickets x={0} />
          <WoodPickets x={200} />
        </>
      )}
      {variant === "vinyl" && (
        <>
          <VinylPanels x={-10} />
          <VinylPanels x={195} />
        </>
      )}
      {variant === "chainlink" && <ChainDiamonds x={20} />}
      {variant === "aluminum" && (
        <>
          <OrnamentalSpikes x={-10} />
          <OrnamentalSpikes x={205} />
        </>
      )}
      {(variant === "commercial" || variant === "residential" || variant === "repair" || variant === "crew" || variant === "hero") && (
        <>
          <WoodPickets x={-30} />
          <ChainDiamonds x={230} />
          <ToolBadge />
        </>
      )}

      {label && (
        <text x="20" y="270" fill="#ffffff" fontSize="15" fontWeight="600" opacity="0.92" fontFamily="Inter, system-ui, sans-serif">
          {label}
        </text>
      )}
    </svg>
  );
}
