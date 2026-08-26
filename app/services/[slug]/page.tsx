import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, serviceAreas } from "@/lib/site-config";
import CTASection from "@/components/CTASection";
import PlaceholderTile from "@/components/PlaceholderTile";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.shortDescription,
  };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) notFound();

  const otherServices = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <section className="bg-navy-900">
        <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <nav className="text-xs text-navy-100/60">
              <Link href="/services" className="hover:text-brand-400">
                Services
              </Link>{" "}
              / {service.name}
            </nav>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{service.name}</h1>
            <p className="mt-4 text-navy-100/80">{service.heroDescription}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-primary">
                Get a Free Quote
              </Link>
            </div>
          </div>
          <PlaceholderTile label={`${service.name} example`} className="!aspect-video border-white/20 bg-white/5 text-navy-100 [&_p]:text-navy-100" />
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-navy-900">What's Included</h2>
            <ul className="mt-5 space-y-3">
              {service.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-navy-700">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs text-brand-600">
                    ✓
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-2xl font-bold text-navy-900">Ideal For</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {service.idealFor.map((tag) => (
                <span key={tag} className="rounded-full bg-navy-50 px-3 py-1 text-sm font-medium text-navy-600">
                  {tag}
                </span>
              ))}
            </div>

            <h2 className="mt-10 text-2xl font-bold text-navy-900">Available Across the DMV</h2>
            <p className="mt-3 text-navy-600">
              We install {service.name.toLowerCase()} in {serviceAreas.length}+ communities across Washington D.C.,
              Maryland, and Virginia. A few popular areas:
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {serviceAreas.slice(0, 6).map((area) => (
                <Link
                  key={area.slug}
                  href={`/service-areas/${area.slug}`}
                  className="rounded-full border border-navy-200 px-3 py-1 text-sm text-navy-600 hover:border-brand-400 hover:text-brand-600"
                >
                  {area.name}
                </Link>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-navy-100 bg-navy-50 p-6">
            <h3 className="font-semibold text-navy-800">Other Services</h3>
            <ul className="mt-4 space-y-3">
              {otherServices.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-sm font-medium text-navy-700 hover:text-brand-600">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/services" className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:underline">
              View all services →
            </Link>
          </aside>
        </div>
      </section>

      <CTASection />
    </>
  );
}
