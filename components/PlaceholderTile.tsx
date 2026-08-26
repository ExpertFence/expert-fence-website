import FenceArt from "@/components/illustrations/FenceArt";

// Custom brand illustration tile — used wherever a real project photo isn't
// available yet. Renders hand-built SVG art (not a photo, not a stock image)
// so the site reads as a finished, on-brand design. Pass `sample` only for
// spots that inherently claim to show real completed work (gallery), so
// visitors aren't misled into thinking it's an actual project photo.
export default function PlaceholderTile({
  label,
  variant = "hero",
  sample = false,
  className = "",
}: {
  label: string;
  variant?: "wood" | "vinyl" | "chainlink" | "aluminum" | "commercial" | "residential" | "repair" | "crew" | "hero";
  sample?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative aspect-[4/3] overflow-hidden rounded-lg shadow-card ${className}`}>
      <FenceArt variant={variant} label={label} />
      {sample && (
        <span className="absolute right-3 top-3 rounded-full bg-black/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
          Sample art — add real photo
        </span>
      )}
    </div>
  );
}
