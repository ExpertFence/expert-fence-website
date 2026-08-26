import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://expert-fence-website.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${siteConfig.businessName} | Fence Installation & Repair in DC, Maryland & Virginia`,
    template: `%s | ${siteConfig.businessName}`,
  },
  description:
    "Licensed, insured fence installation and repair across the DMV — wood, vinyl, chain link, aluminum & ornamental iron, and commercial fencing. Free on-site estimates.",
  keywords: [
    "fence company DMV",
    "fence installation Maryland",
    "fence installation Virginia",
    "fence installation Washington DC",
    "wood fence installation",
    "vinyl fence installation",
    "chain link fence",
    "commercial fencing contractor",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: siteConfig.businessName,
    title: `${siteConfig.businessName} | Fence Installation & Repair in DC, Maryland & Virginia`,
    description:
      "Licensed, insured fence installation and repair across the DMV. Free on-site estimates, financing available.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.businessName} | DMV Fence Installation & Repair`,
    description: "Licensed, insured fence installation and repair across DC, Maryland & Virginia.",
  },
  robots: { index: true, follow: true },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: siteConfig.businessName,
  description:
    "Licensed, insured fence installation and repair company serving Washington D.C., Maryland, and Virginia.",
  telephone: siteConfig.phoneDisplay,
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.line1,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.state,
    postalCode: siteConfig.address.zip,
    addressCountry: "US",
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Washington, D.C." },
    { "@type": "AdministrativeArea", name: "Maryland" },
    { "@type": "AdministrativeArea", name: "Virginia" },
  ],
  openingHoursSpecification: siteConfig.hours.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.day,
    opens: h.time.split("–")[0]?.trim(),
    closes: h.time.split("–")[1]?.trim(),
  })),
  priceRange: "$$",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white font-sans text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
