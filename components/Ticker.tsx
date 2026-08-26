const ITEMS = [
  "40 Years In Business",
  "A+ BBB Rating",
  "Top Rated · Angi",
  'Class "A" Licensed · DC · MD · VA',
  "Custom Fabrication",
  "Free On-Site Estimates",
];

export default function Ticker() {
  const line = ITEMS.join("   ◆   ");
  return (
    <div className="overflow-hidden whitespace-nowrap bg-navy-900 py-3">
      <div className="inline-block animate-marquee text-sm font-semibold uppercase tracking-widest text-white/75">
        <span className="mx-6">{line}</span>
        <span className="mx-6">{line}</span>
      </div>
    </div>
  );
}
