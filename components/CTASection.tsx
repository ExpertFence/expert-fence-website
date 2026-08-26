import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function CTASection() {
  return (
    <section className="bg-navy-800">
      <div className="container-page flex flex-col items-center gap-6 py-16 text-center sm:py-20">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Ready for a fence that's built for the DMV?
        </h2>
        <p className="max-w-xl text-navy-100/80">
          Get a free, no-obligation quote from a licensed, local crew. Most estimates are scheduled within 48 hours.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/contact" className="btn-primary">
            Get My Free Quote
          </Link>
          <a href={`tel:${siteConfig.phoneHref}`} className="btn-secondary">
            Call {siteConfig.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
