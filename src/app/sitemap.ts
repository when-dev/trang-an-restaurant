import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";
import { defaultLocale, localeTags, locales } from "@/i18n/config";
import { PAGES } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${siteConfig.researchDate}T00:00:00Z`);
  // /directions is a mobile-only view of /contact (its canonical points there) — not listed.
  return PAGES.filter((path) => path !== "/directions").flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${path}`),
      lastModified,
      changeFrequency: path === "/menu" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path === "/menu" ? 0.9 : 0.6,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [localeTags[l].intl, absoluteUrl(`/${l}${path}`)])),
          "x-default": absoluteUrl(`/${defaultLocale}${path}`),
        },
      },
    })),
  );
}
