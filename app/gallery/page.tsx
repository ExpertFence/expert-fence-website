import type { Metadata } from "next";
import { services } from "@/lib/site-config";
import CTASection from "@/components/CTASection";
import PlaceholderTile from "@/components/PlaceholderTile";

export const metadata: Metadata = {
  title: "Project Gallery",
  description: "Completed fence installation projects across the DMV.",
};

export default function GalleryPage() {
  return (
    <>
      <section className="bg-navy-900">
        <div className="container-page py-16 text-center sm:py-20">
          <p className="eyebrow text-brand-400">Project Gallery</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Recent Work Across the DMV</h1>
          <p className="mx-auto mt-4 max-w-2xl text-navy-100/80">
            This gallery is ready to go — the tiles below are placeholders reserved for real before/after and
            completed-project photography.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <PlaceholderTile key={s.slug} label={s.name} />
          ))}
          {services.slice(0, 3).map((s) => (
            <PlaceholderTile key={`${s.slug}-2`} label={`${s.name} — before/after`} />
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
