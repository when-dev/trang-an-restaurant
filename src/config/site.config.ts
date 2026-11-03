/**
 * Single source of truth for restaurant facts, links and integration flags.
 * Menu items live in data/menu.json. Texts live in src/i18n/dictionaries/*.
 */

export type SiteMode = "demo" | "presentation" | "official";
export type PlatformId = "wolt" | "bolt" | "bistro";

export interface DeliveryPlatform {
  id: PlatformId;
  name: string;
  /** Direct link to the Trang An page on the platform. */
  url: string;
  /** Fallback when `verified` is false: the platform's official city listing / search. */
  fallbackUrl: string;
  /** Set to true only after the link was opened manually in a normal browser and shows Trang An. */
  verified: boolean;
  /** Name under which the restaurant is listed on the platform. */
  listedAs: string;
}

export interface OpeningPeriod {
  /** ISO weekday: 1 = Monday … 7 = Sunday */
  days: number[];
  opens: string; // "HH:MM", Europe/Bratislava
  closes: string;
}

function parseSiteMode(value: string | undefined): SiteMode {
  return value === "official" || value === "presentation" ? value : "demo";
}

export const siteConfig = {
  /**
   * - "demo" (default — any public preview before approval): one slim "unofficial proposal" notice.
   * - "presentation" (local client presentation, set in .env.local): no notice.
   * - "official" (only after the owner approved, see OWNER_APPROVAL_CHECKLIST.md): restaurant
   *   copyright line in the footer and search-engine indexing.
   * Everything except "official" is noindex and never claims the restaurant runs the site.
   */
  siteMode: parseSiteMode(process.env.NEXT_PUBLIC_SITE_MODE),
  copyrightYear: 2026,
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),

  name: "Trang An",
  legalName: "Trang An — Vietnamská reštaurácia",
  cuisine: ["Vietnamese", "Asian", "Sushi"],

  address: {
    street: "Železničiarska 3191/18",
    postalCode: "811 04",
    city: "Bratislava",
    country: "Slovensko",
    countryCode: "SK",
  },
  geo: { lat: 48.1570136, lng: 17.110057 },

  phone: {
    display: "+421 948 107 313",
    uri: "tel:+421948107313",
  },

  timeZone: "Europe/Bratislava",
  openingHours: [
    { days: [1, 2, 3, 4, 5], opens: "09:00", closes: "19:30" },
    { days: [6, 7], opens: "10:00", closes: "17:00" },
  ] satisfies OpeningPeriod[],

  google: {
    placeId: "ChIJRZvoEgCJbEcR9xCAIWttWCM",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Trang%20An%20Bratislava&query_place_id=ChIJRZvoEgCJbEcR9xCAIWttWCM",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Trang%20An%20Bratislava&destination_place_id=ChIJRZvoEgCJbEcR9xCAIWttWCM",
    /** Apple Maps (web + iOS/macOS app): driving/walking directions to the restaurant's coordinates. */
    appleMapsUrl:
      "https://maps.apple.com/?daddr=48.1570136,17.110057&q=Trang%20An%2C%20%C5%BDelezni%C4%8Diarska%2018%2C%20Bratislava",
    reviewsUrl: "https://search.google.com/local/reviews?placeid=ChIJRZvoEgCJbEcR9xCAIWttWCM",
    writeReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJRZvoEgCJbEcR9xCAIWttWCM",
    /**
     * Rating seen manually on Google Maps on the research date. Shown only as a dated snapshot,
     * never as a live value. Set `show: false` to hide it.
     */
    ratingSnapshot: { show: true, value: 4.4, checkedAt: "2026-11-03" },
  },

  delivery: [
    {
      id: "wolt",
      name: "Wolt",
      url: "https://wolt.com/sk/svk/bratislava/restaurant/trang-an-vietnamska-restauracia",
      fallbackUrl: "https://wolt.com/sk/svk/bratislava",
      verified: true,
      listedAs: "Trang An – Vietnamská reštaurácia",
    },
    {
      id: "bolt",
      name: "Bolt Food",
      url: "https://food.bolt.eu/en-US/326/p/136664",
      fallbackUrl: "https://food.bolt.eu/sk-sk/326-bratislava/",
      // The link loads, but the page is client-rendered and could not be confirmed to show Trang An.
      verified: false,
      listedAs: "Trang an restaurant",
    },
    {
      id: "bistro",
      name: "Bistro.sk",
      url: "https://www.bistro.sk/restauracia/trangan",
      fallbackUrl: "https://www.bistro.sk/",
      verified: true,
      listedAs: "Trangan",
    },
  ] satisfies DeliveryPlatform[],

  /**
   * "Obľúbené jedlá" on the home page = the dishes Wolt shows under "Najviac objednávané"
   * (checked on `checkedAt`). No own popularity statistics are claimed.
   */
  featured: {
    source: "Wolt — Najviac objednávané",
    checkedAt: "2026-11-03",
    itemIds: ["menu-037", "menu-057", "menu-054", "menu-055", "menu-032"],
  },

  /** Social profiles — add only profiles whose existence the owner confirmed. */
  social: [] as { name: string; url: string }[],

  /** Date the public sources (hours, links, Wolt prices) were checked. */
  researchDate: "2026-11-03",
  /** Date of the paper menu the in-store prices come from. */
  menuPhotoDate: "2026-08",

  integrations: {
    /** Server-side Google Places API (New). Active only when GOOGLE_PLACES_API_KEY is set. */
    googlePlaces: Boolean(process.env.GOOGLE_PLACES_API_KEY),
    analytics: false,
  },
} as const;

export type SiteConfig = typeof siteConfig;

export function getPlatform(id: PlatformId): DeliveryPlatform {
  const p = siteConfig.delivery.find((d) => d.id === id);
  if (!p) throw new Error(`Unknown platform ${id}`);
  return p;
}

/** Link to send the visitor to: the direct page if verified, otherwise the official listing. */
export function platformHref(p: DeliveryPlatform): string {
  return p.verified ? p.url : p.fallbackUrl;
}

export const fullAddress = `${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.city}`;
