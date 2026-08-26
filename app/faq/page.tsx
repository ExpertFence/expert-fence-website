import type { Metadata } from "next";
import FAQAccordion from "@/components/FAQAccordion";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about permits, timelines, HOA approval, and fencing materials in the DMV.",
};

export default function FAQPage() {
  return (
    <>
      <section className="bg-navy-900">
        <div className="container-page py-16 text-center sm:py-20">
          <p className="eyebrow text-brand-400">FAQ</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Frequently Asked Questions</h1>
        </div>
      </section>

      <section className="section">
        <div className="container-page max-w-3xl">
          <FAQAccordion />
        </div>
      </section>

      <CTASection />
    </>
  );
}
