"use client";

import { useState } from "react";
import { faqs } from "@/lib/site-config";

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-navy-100 rounded-lg border border-navy-100 bg-white shadow-card">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={faq.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-semibold text-navy-800">{faq.question}</span>
              <span
                className={`shrink-0 text-brand-500 transition-transform ${isOpen ? "rotate-45" : ""}`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            {isOpen && <p className="px-5 pb-5 text-sm text-navy-600">{faq.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
