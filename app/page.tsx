import Link from "next/link";
import { services, serviceAreas, siteConfig } from "@/lib/site-config";
import CTASection from "@/components/CTASection";
import PlaceholderTile from "@/components/PlaceholderTile";
import HeroSlideshow from "@/components/HeroSlideshow";
import Ticker from "@/components/Ticker";
import ProcessSteps from "@/components/ProcessSteps";

const galleryItems: { label: string; variant: Parameters<typeof PlaceholderTile>[0]["variant"] }[] = [
  { label: "Cedar Privacy & Drive Gate", variant: "wood" },
  { label: "Artisan Custom Gate", variant: "commercial" },
  { label: "Pool Enclosure", variant: "aluminum" },
  { label: "Scalloped Vinyl Picket", variant: "vinyl" },
  { label: "Custom Arched Gate", variant: "residential" },
  { label: "Estate Drive Gate", variant: "hero" },
  { label: "Lattice Gate Under Arch", variant: "repair" },
  { label: "Vinyl Privacy", variant: "vinyl" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(242,113,26,0.25),_transparent_55%)]" />
        <div className="container-page relative grid gap-10 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow text-brand-400">Licensed &amp; Insured · Serving the Entire DMV</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Built Right. Built To Last. — {siteConfig.yearsInBusiness}+ Years Serving DC, Maryland &amp; Virginia
            </h1>
            <p className="mt-5 max-w-xl text-lg text-navy-100/80">
              Wood, vinyl, chain link, aluminum, and commercial fencing — installed by local crews who know DMV permits,
              HOA requirements, and soil conditions inside and out.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-primary">
                Get a Free Quote
              </Link>
              <a href={`tel:${siteConfig.phoneHref}`} className="btn-secondary">
                Call {siteConfig.phoneDisplay}
              </a>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-white">
              <div>
                <dt className="text-2xl font-bold">{siteConfig.yearsInBusiness}+</dt>
                <dd className="text-xs text-navy-100/70">Years in Business</dd>
              </div>
              <div>
                <dt className="text-2xl font-bold">7</dt>
                <dd className="text-xs text-navy-100/70">Fence Types Installed</dd>
              </div>
              <div>
                <dt className="text-2xl font-bold">DC·MD·VA</dt>
                <dd className="text-xs text-navy-100/70">Full DMV Coverage</dd>
              </div>
            </dl>
          </div>
          <HeroSlideshow />
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-navy-100 bg-navy-50">
        <div className="container-page flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-6 text-sm font-medium text-navy-600">
          <span>✓ Free On-Site Estimates</span>
          <span>✓ Licensed &amp; Insured</span>
          <span>✓ HOA Paperwork Handled</span>
          <span>✓ Financing Available</span>
          <span>✓ Locally Owned &amp; Operated</span>
        </div>
      </section>

      <Ticker />

      {/* Gallery teaser */}
      <section className="section">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Our Work</p>
              <h2 className="mt-2 text-3xl font-bold text-navy-900">Fences We&apos;ve Built</h2>
            </div>
            <Link href="/gallery" className="text-sm font-semibold text-brand-600 hover:underline">
              Browse the full gallery →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {galleryItems.map((item, i) => (
              <PlaceholderTile
                key={item.label + i}
                label={item.label}
                variant={item.variant}
                sample
                className={i === 0 ? "sm:col-span-2 sm:row-span-2 !aspect-square" : "!aspect-square"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Services overview */}
      <section className="section bg-navy-50">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">What We Install</p>
            <h2 className="mt-2 text-3xl font-bold text-navy-900">A Fence Company That Does It All</h2>
            <p className="mt-3 text-navy-600">
              From backyard privacy to full commercial perimeter security, our crews are trained and equipped across
              every major fence material.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex flex-col rounded-lg border border-navy-100 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="font-semibold text-navy-800 group-hover:text-brand-600">{service.name}</h3>
                <p className="mt-2 flex-1 text-sm text-navy-600">{service.shortDescription}</p>
                <span className="mt-4 text-sm font-medium text-brand-600">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Why Homeowners &amp; Businesses Choose Us</p>
            <h2 className="mt-2 text-3xl font-bold text-navy-900">
              Local Crews Who Know the DMV&apos;s Permits, Soil &amp; HOAs
            </h2>
            <ul className="mt-6 space-y-4">
              {[
                ["Permit &amp; HOA experience", "We prepare the drawings and paperwork most DC, MD, and VA jurisdictions require."],
                ["Frost-line-rated installs", "Every post is set to the depth Mid-Atlantic freeze-thaw cycles demand."],
                ["Transparent, written quotes", "No surprise change orders — your estimate is your price."],
                ["Real local reviews", "We're proud of our reputation across Maryland and Virginia neighborhoods."],
              ].map(([title, body]) => (
                <li key={title} className="flex gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    ✓
                  </span>
                  <div>
                    <p className="font-semibold text-navy-800" dangerouslySetInnerHTML={{ __html: title }} />
                    <p className="text-sm text-navy-600">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <PlaceholderTile label="Wood Fence Installs" variant="wood" />
            <PlaceholderTile label="Vinyl Privacy Fencing" variant="vinyl" className="mt-8" />
            <PlaceholderTile label="Licensed & Insured Crews" variant="crew" className="-mt-8" />
            <PlaceholderTile label="Ornamental Aluminum Gates" variant="aluminum" />
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section bg-navy-900">
        <div className="container-page">
          <p className="eyebrow text-brand-400">How It Works</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Four Steps From Quote to Finished Fence</h2>
          <div className="mt-10">
            <ProcessSteps />
          </div>
        </div>
      </section>

      {/* Service areas */}
      <section className="section">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">Where We Work</p>
            <h2 className="mt-2 text-3xl font-bold text-navy-900">Proudly Serving the Entire DMV</h2>
            <p className="mt-3 text-navy-600">
              From the District to the Maryland and Virginia suburbs, our crews are on the road across the metro
              area every day.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {serviceAreas.map((area) => (
              <Link
                key={area.slug}
                href={`/service-areas/${area.slug}`}
                className="flex items-center justify-between rounded-md border border-navy-100 bg-white px-4 py-3 text-sm font-medium text-navy-700 transition hover:border-brand-300 hover:text-brand-600"
              >
                {area.name}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
          <Link href="/service-areas" className="mt-6 inline-block text-sm font-semibold text-brand-600 hover:underline">
            View all service areas →
          </Link>
        </div>
      </section>

      <CTASection />
    </>
  );
}
