import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import FenceDivider from "@/components/FenceDivider";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/gallery", label: "Gallery" },
  { href: "/testimonials", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-navy-100 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-navy-800">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-navy-800 text-brand-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M4 20V6M4 6l4-2 4 2 4-2 4 2v14M12 4v16M8 8v12M16 8v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-lg leading-tight">
            {siteConfig.businessName}
            <span className="block text-[11px] font-medium uppercase tracking-wide text-navy-600">
              Fence Installation &amp; Repair
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-navy-700 transition hover:text-brand-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${siteConfig.phoneHref}`}
            className="hidden text-sm font-semibold text-navy-800 sm:block"
          >
            {siteConfig.phoneDisplay}
          </a>
          <Link href="/contact" className="btn-primary !px-4 !py-2 text-xs sm:!px-5 sm:!py-2.5 sm:text-sm">
            Get a Free Quote
          </Link>
        </div>
      </div>
      <FenceDivider className="text-brand-500" />
    </header>
  );
}
