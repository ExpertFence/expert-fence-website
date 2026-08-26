import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/site-config";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Fence Installation Services",
  description:
    "Wood, vinyl, chain link, aluminum & ornamental iron, commercial, residential, and repair services across the DMV.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="bg-navy-900">
        <div className="container-page py-16 text-center sm:py-20">
          <p className="eyebrow text-brand-400">Our Services</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Every Fence Type, One Local Contractor</h1>
          <p className="mx-auto mt-4 max-w-2xl text-navy-100/80">
            Whichever material fits your property, budget, and HOA requirements, our crews install and repair it —
            backed by a written warranty and local know-how.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group flex flex-col rounded-lg border border-navy-100 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h2 className="text-lg font-semibold text-navy-800 group-hover:text-brand-600">{service.name}</h2>
              <p className="mt-2 text-sm text-navy-600">{service.heroDescription}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {service.idealFor.map((tag) => (
                  <li key={tag} className="rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-600">
                    {tag}
                  </li>
                ))}
              </ul>
              <span className="mt-4 text-sm font-medium text-brand-600">View details →</span>
            </Link>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
