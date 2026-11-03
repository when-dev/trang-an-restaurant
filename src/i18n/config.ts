export const locales = ["sk", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "sk";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** BCP 47 tags used for Intl formatting, hreflang and OpenGraph. */
export const localeTags: Record<Locale, { intl: string; og: string; label: string; name: string }> = {
  sk: { intl: "sk-SK", og: "sk_SK", label: "SK", name: "Slovenčina" },
  en: { intl: "en-GB", og: "en_GB", label: "EN", name: "English" },
};

/** Replace the locale segment of a pathname, keeping the rest of the path. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const parts = pathname.split("/");
  if (parts[1] && isLocale(parts[1])) parts[1] = to;
  else parts.splice(1, 0, to);
  const out = parts.join("/");
  return out.length > 1 && out.endsWith("/") ? out.slice(0, -1) : out;
}
