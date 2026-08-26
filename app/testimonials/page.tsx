import type { Metadata } from "next";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "What DMV homeowners and businesses say about working with us.",
};

// These are structural placeholders only — clearly labeled as samples so no
// visitor mistakes them for real reviews. Replace with actual customer
// testimonials (with permission) before launch, ideally linked to your
// Google Business Profile reviews.
const sampleTestimonials = [
  { role: "Homeowner", area: "Silver Spring, MD", quote: "Crew showed up on time, finished in two days, and cleaned up completely. Fence looks great." },
  { role: "Property Manager", area: "Fairfax County, VA", quote: "Handled our multi-building perimeter project on schedule and coordinated well with our other contractors." },
  { role: "Homeowner", area: "Washington, DC", quote: "Walked us through HOA requirements and handled all the paperwork. Made the whole process easy." },
];

export default function TestimonialsPage() {
  return (
    <>
      <section className="bg-navy-900">
        <div className="container-page py-16 text-center sm:py-20">
          <p className="eyebrow text-brand-400">Customer Reviews</p>
          <h1 className="mt-2 text-4xl font-bold text-white">What Our Customers Say</h1>
          <p className="mx-auto mt-4 max-w-2xl text-navy-100/80">
            This section is a layout placeholder — swap in real, permissioned customer quotes or embed your Google
            Business Profile reviews before launch.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sampleTestimonials.map((t, i) => (
            <figure key={i} className="relative rounded-lg border border-dashed border-navy-200 bg-navy-50 p-6">
              <span className="absolute right-4 top-4 rounded-full bg-navy-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy-600">
                Sample — replace before launch
              </span>
              <blockquote className="mt-6 text-navy-700">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm font-medium text-navy-500">
                {t.role} · {t.area}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
