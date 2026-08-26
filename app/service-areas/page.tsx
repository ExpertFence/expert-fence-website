import type { Metadata } from "next";
import Link from "next/link";
import { serviceAreas } from "@/lib/site-config";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Service Areas",
  description: "Fence installation and repair across Washington D.C., Maryland, and Virginia.",
};

const regions = ["DC", "Maryland", "Virginia"] as const;

export default function ServiceAreasPage() {
  return (
    <>
      <section className="bg-navy-900">
        <div className="container-page py-16 text-center sm:py-20">
          <p className="eyebrow text-brand-400">Service Areas</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Serving the Entire DMV</h1>
          <p className="mx-auto mt-4 max-w-2xl text-navy-100/80">
            Our crews are on the road across the District, Maryland, and Virginia every day. Don't see your
            neighborhood listed? Call us — we likely still cover it.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page space-y-14">
          {regions.map((region) => {
            const areasInRegion = serviceAreas.filter((a) => a.region === region);
            return (
              <div key={region}>
                <h2 className="text-2xl font-bold text-navy-900">
                  {region === "DC" ? "Washington, D.C." : region}
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {areasInRegion.map((area) => (
                    <Link
                      key={area.slug}
                      href={`/service-areas/${area.slug}`}
                      className="rounded-lg border border-navy-100 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <h3 className="font-semibold text-navy-800">{area.name}</h3>
                      <p className="mt-2 text-sm text-navy-600">{area.blurb}</p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CTASection />
    </>
  );
}
