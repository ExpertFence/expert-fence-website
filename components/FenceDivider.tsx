// Thin decorative fence-line silhouette used as a section divider —
// reinforces the brand without pretending to be a photo.
export default function FenceDivider({ className = "" }: { className?: string }) {
  const pickets = Array.from({ length: 40 });
  return (
    <svg viewBox="0 0 800 28" preserveAspectRatio="none" className={`h-6 w-full ${className}`} aria-hidden="true">
      <rect x="0" y="22" width="800" height="4" fill="currentColor" opacity="0.5" />
      {pickets.map((_, i) => (
        <rect key={i} x={i * 20 + 4} y={i % 2 === 0 ? 4 : 8} width="8" height={i % 2 === 0 ? 20 : 16} fill="currentColor" opacity="0.8" />
      ))}
    </svg>
  );
}
