import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { serviceAreas, services, siteConfig } from "@/lib/site-config";
import CTASection from "@/components/CTASection";

export function generateStaticParams() {
  return serviceAreas.map((area) => ({ slug: area.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const area = serviceAreas.find((a) => a.slug === params.slug);
  if (!area) return {};
  return {
    title: `Fence Installation in ${area.name}`,
    description: `${siteConfig.businessName} installs and repairs wood, vinyl, chain link, and aluminum fencing in ${area.name}. Free on-site estimates.`,
  };
}

export default function ServiceAreaDetailPage({ params }: { params: { slug: string } }) {
  const area = serviceAreas.find((a) => a.slug === params.slug);
  if (!area) notFound();

  const otherAreas = serviceAreas.filter((a) => a.slug !== area.slug).slice(0, 5);

  return (
    <>
      <section className="bg-navy-900">
        <div className="container-page py-16 sm:py-20">
          <nav className="text-xs text-navy-100/60">
            <Link href="/service-areas" className="hover:text-brand-400">
              Service Areas
            </Link>{" "}
            / {area.name}
          </nav>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold text-white">Fence Installation &amp; Repair in {area.name}</h1>
          <p className="mt-4 max-w-2xl text-navy-100/80">{area.blurb}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="btn-primary">
              Get a Free Quote in {area.name}
            </Link>
            <a href={`tel:${siteConfig.phoneHref}`} className="btn-secondary">
              Call {siteConfig.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-navy-900">Fencing Services Available in {area.name}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="rounded-lg border border-navy-100 bg-white p-4 shadow-card transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="font-semibold text-navy-800">{s.name}</p>
                  <p className="mt-1 text-sm text-navy-600">{s.shortDescription}</p>
                </Link>
              ))}
            </div>

            <h2 className="mt-10 text-2xl font-bold text-navy-900">Local Know-How</h2>
            <p className="mt-3 text-navy-600">
              Every {area.name} estimate includes a review of local permit requirements, HOA guidelines where
              applicable, and utility locate coordination — so there are no surprises once installation begins.
            </p>
          </div>

          <aside className="rounded-lg border border-navy-100 bg-navy-50 p-6">
            <h3 className="font-semibold text-navy-800">Nearby Areas We Serve</h3>
            <ul className="mt-4 space-y-3">
              {otherAreas.map((a) => (
                <li key={a.slug}>
                  <Link href={`/service-areas/${a.slug}`} className="text-sm font-medium text-navy-700 hover:text-brand-600">
                    {a.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/service-areas" className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:underline">
              View all areas →
            </Link>
          </aside>
        </div>
      </section>

      <CTASection />
    </>
  );
}
