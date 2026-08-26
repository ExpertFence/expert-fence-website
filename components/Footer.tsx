import Link from "next/link";
import { siteConfig, services, serviceAreas } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-navy-100">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold text-white">{siteConfig.businessName}</p>
          <p className="mt-2 text-sm text-navy-100/80">{siteConfig.tagline}</p>
          <p className="mt-4 text-sm">
            {siteConfig.address.line1}
            <br />
            {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}
          </p>
          <p className="mt-3 text-sm">{siteConfig.license}</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-400">Services</p>
          <ul className="mt-3 space-y-2 text-sm">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-brand-400">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-400">Service Areas</p>
          <ul className="mt-3 space-y-2 text-sm">
            {serviceAreas.slice(0, 6).map((a) => (
              <li key={a.slug}>
                <Link href={`/service-areas/${a.slug}`} className="hover:text-brand-400">
                  {a.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/service-areas" className="mt-2 inline-block text-sm font-medium text-brand-400 hover:underline">
            View all areas →
          </Link>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-400">Contact</p>
          <p className="mt-3 text-sm">
            <a href={`tel:${siteConfig.phoneHref}`} className="hover:text-brand-400">
              {siteConfig.phoneDisplay}
            </a>
          </p>
          <p className="mt-1 text-sm">
            <a href={`mailto:${siteConfig.email}`} className="hover:text-brand-400">
              {siteConfig.email}
            </a>
          </p>
          <div className="mt-3 space-y-1 text-sm text-navy-100/80">
            {siteConfig.hours.map((h) => (
              <p key={h.day}>
                {h.day}: {h.time}
              </p>
            ))}
          </div>
          <Link href="/contact" className="btn-primary mt-4 !px-4 !py-2 text-xs">
            Request a Free Quote
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-navy-100/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.businessName}. All rights reserved.</p>
          <p>Licensed &amp; insured serving Washington D.C., Maryland &amp; Virginia.</p>
        </div>
      </div>
    </footer>
  );
}
