import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";
import { absoluteUrl } from "@/lib/seo";

/** Only the owner-approved official site is indexable. */
export default function robots(): MetadataRoute.Robots {
  if (siteConfig.siteMode !== "official") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.siteUrl,
  };
}
