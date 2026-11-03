import { localeTags, type Locale } from "@/i18n/config";

const priceFormatters = new Map<Locale, Intl.NumberFormat>();

/** 4,80 € (sk) / €4.80 (en). `null` is never formatted as 0 — callers must handle missing prices. */
export function formatPrice(value: number, locale: Locale): string {
  let f = priceFormatters.get(locale);
  if (!f) {
    f = new Intl.NumberFormat(localeTags[locale].intl, {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    priceFormatters.set(locale, f);
  }
  // Normalise narrow/no-break spaces so output is stable across ICU versions.
  return f.format(value).replace(/[  ]/g, " ");
}

/** "2026-11-03" -> "3. 11. 2026" (sk) / "3 November 2026" (en) */
export function formatDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  if (locale === "sk") {
    if (d === undefined) return `${m}/${y}`;
    return `${d}. ${m}. ${y}`;
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: d === undefined ? undefined : "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatRating(value: number, locale: Locale): string {
  return new Intl.NumberFormat(localeTags[locale].intl, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

/** Portion labels use the Slovak abbreviation "ks"; translate it for English. */
export function formatPortion(label: string | null, locale: Locale): string | null {
  if (!label) return null;
  return locale === "en" ? label.replace(/\bks\b/, "pcs") : label;
}
