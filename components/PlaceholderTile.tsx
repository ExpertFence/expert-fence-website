// Clearly-labeled visual placeholder — intentionally not a real photo.
// Swap these out for real project photography before launch.
export default function PlaceholderTile({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-navy-200 bg-navy-50 p-4 text-center ${className}`}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-navy-300" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8.5" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M21 15l-5-5-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <p className="text-xs font-medium text-navy-400">{label}</p>
      <p className="text-[10px] uppercase tracking-wide text-navy-300">Sample placeholder — add real photo</p>
    </div>
  );
}
