import { MetadataRoute } from "next";
import { services, serviceAreas } from "@/lib/site-config";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://expert-fence-website.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/services", "/service-areas", "/about", "/gallery", "/testimonials", "/faq", "/contact"].map(
    (route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    })
  );

  const serviceRoutes = services.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const areaRoutes = serviceAreas.map((area) => ({
    url: `${BASE_URL}/service-areas/${area.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...areaRoutes];
}
