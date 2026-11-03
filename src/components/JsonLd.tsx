import { siteConfig } from "@/config/site.config";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { SCHEMA_DAYS } from "@/lib/hours";
import { absoluteUrl } from "@/lib/seo";

/**
 * schema.org Restaurant. Deliberately no AggregateRating/Review: there is no permitted source
 * to republish them from.
 */
export function RestaurantJsonLd({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": absoluteUrl("/#restaurant"),
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    description: dict.meta.homeDescription,
    url: absoluteUrl(`/${locale}`),
    telephone: siteConfig.phone.uri.replace("tel:", ""),
    image: absoluteUrl(`/${locale}/opengraph-image`),
    servesCuisine: siteConfig.cuisine,
    priceRange: "€",
    currenciesAccepted: "EUR",
    menu: absoluteUrl(`/${locale}/menu`),
    hasMenu: absoluteUrl(`/${locale}/menu`),
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      postalCode: siteConfig.address.postalCode,
      addressLocality: siteConfig.address.city,
      addressCountry: siteConfig.address.countryCode,
    },
    geo: { "@type": "GeoCoordinates", latitude: siteConfig.geo.lat, longitude: siteConfig.geo.lng },
    hasMap: siteConfig.google.mapsUrl,
    openingHoursSpecification: siteConfig.openingHours.map((p) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: p.days.map((d) => `https://schema.org/${SCHEMA_DAYS[d]}`),
      opens: p.opens,
      closes: p.closes,
    })),
    sameAs: [
      ...siteConfig.delivery.filter((p) => p.verified).map((p) => p.url),
      ...siteConfig.social.map((s) => s.url),
    ],
  };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output with "<" escaped cannot break out of the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
