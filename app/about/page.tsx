import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import CTASection from "@/components/CTASection";
import PlaceholderTile from "@/components/PlaceholderTile";

export const metadata: Metadata = {
  title: "About Us",
  description: `About ${siteConfig.businessName} — licensed, insured fence contractors serving the DMV.`,
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-navy-900">
        <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow text-brand-400">About {siteConfig.businessName}</p>
            <h1 className="mt-2 text-4xl font-bold text-white">Locally Owned, Region-Trusted</h1>
            <p className="mt-4 text-navy-100/80">
              {siteConfig.businessName} has spent {siteConfig.yearsInBusiness}+ years installing and repairing
              fences across Washington D.C., Maryland, and Virginia. What started as a small residential crew has
              grown into a full-service operation handling everything from backyard privacy fences to multi-phase
              commercial perimeter security — without losing the local, answer-the-phone service homeowners expect.
            </p>
          </div>
          <PlaceholderTile label="Crew or founder photo" className="!aspect-video border-white/20 bg-white/5 text-navy-100 [&_p]:text-navy-100" />
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-8 sm:grid-cols-3">
          {[
            ["Licensed &amp; Insured", siteConfig.license],
            ["Region Expertise", "We know DC, Maryland, and Virginia permit rules, HOA processes, and soil conditions."],
            ["Written Warranty", "Every install includes a written workmanship warranty and manufacturer material warranties."],
          ].map(([title, body]) => (
            <div key={title as string} className="rounded-lg border border-navy-100 bg-white p-6 shadow-card">
              <h3 className="font-semibold text-navy-800" dangerouslySetInnerHTML={{ __html: title as string }} />
              <p className="mt-2 text-sm text-navy-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-navy-50">
        <div className="container-page max-w-3xl">
          <h2 className="text-2xl font-bold text-navy-900">Our Process</h2>
          <ol className="mt-6 space-y-6">
            {[
              ["1. Free Consultation", "We walk your property, discuss materials and budget, and flag any permit or HOA requirements."],
              ["2. Written Estimate", "You get a clear, itemized quote — no surprise change orders."],
              ["3. Permitting & Utility Locates", "We handle the paperwork and coordinate utility marking before digging."],
              ["4. Installation", "Most residential jobs are completed in 1–3 days by our in-house crews."],
              ["5. Final Walkthrough", "We review the finished fence with you and register your warranty."],
            ].map(([title, body]) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  {title.charAt(0)}
                </span>
                <div>
                  <p className="font-semibold text-navy-800">{title.slice(3)}</p>
                  <p className="text-sm text-navy-600">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CTASection />
    </>
  );
}
