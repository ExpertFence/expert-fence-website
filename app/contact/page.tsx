import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Get a Free Quote",
  description: "Request a free, no-obligation fence installation or repair estimate anywhere in the DMV.",
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container-page grid gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Get a Free Quote</p>
          <h1 className="mt-2 text-3xl font-bold text-navy-900 sm:text-4xl">Let's Talk About Your Fence</h1>
          <p className="mt-4 text-navy-600">
            Fill out the form and we'll follow up within one business day to schedule a free, no-obligation on-site
            estimate — or call us directly.
          </p>

          <div className="mt-8 space-y-4 rounded-lg border border-navy-100 bg-navy-50 p-6">
            <div>
              <p className="text-sm font-semibold text-navy-800">Call or Text</p>
              <a href={`tel:${siteConfig.phoneHref}`} className="text-lg font-bold text-brand-600">
                {siteConfig.phoneDisplay}
              </a>
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-800">Email</p>
              <a href={`mailto:${siteConfig.email}`} className="text-navy-600">
                {siteConfig.email}
              </a>
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-800">Hours</p>
              {siteConfig.hours.map((h) => (
                <p key={h.day} className="text-sm text-navy-600">
                  {h.day}: {h.time}
                </p>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-800">Service Area</p>
              <p className="text-sm text-navy-600">Washington D.C., Maryland &amp; Virginia</p>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
