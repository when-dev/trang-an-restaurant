import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import { defaultLocale, localeTags, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import type { PagePath } from "./routes";

export function absoluteUrl(path: string): string {
  return `${siteConfig.siteUrl}${path}`;
}

/** Localized metadata with canonical, hreflang alternates, OpenGraph and Twitter card. */
export function pageMetadata(
  locale: Locale,
  path: PagePath,
  { title, description }: { title: string; description: string },
): Metadata {
  const dict = getDictionary(locale);
  const languages: Record<string, string> = {};
  for (const l of locales) languages[localeTags[l].intl] = absoluteUrl(`/${l}${path}`);
  languages["x-default"] = absoluteUrl(`/${defaultLocale}${path}`);
  const indexable = siteConfig.siteMode === "official";

  return {
    title: path === "" ? { absolute: title } : title,
    description,
    alternates: { canonical: absoluteUrl(`/${locale}${path}`), languages },
    openGraph: {
      type: "website",
      siteName: dict.meta.siteName,
      title,
      description,
      url: absoluteUrl(`/${locale}${path}`),
      locale: localeTags[locale].og,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeTags[l].og),
    },
    twitter: { card: "summary_large_image", title, description },
    // Until the owner approves, the site must not compete with the restaurant's own listings in search.
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  };
}
