import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

const paths = ["", "/about", "/services", "/reviews", "/videos", "/articles", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of paths) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${siteConfig.domain}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${siteConfig.domain}/${l}${path}`])
          ),
        },
      });
    }
  }

  return entries;
}
