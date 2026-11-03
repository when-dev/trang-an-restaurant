import type { Locale } from "@/i18n/config";

export const PAGES = ["", "/menu", "/order", "/directions", "/about", "/reviews", "/contact"] as const;
export type PagePath = (typeof PAGES)[number];

export function href(locale: Locale, path: PagePath | `${PagePath}#${string}` = ""): string {
  return `/${locale}${path}`;
}

/** True when `pathname` is `path` (or below it) for the given locale. Home matches only exactly. */
export function isActivePath(pathname: string, locale: Locale, path: PagePath): boolean {
  const target = href(locale, path);
  if (path === "") return pathname === target || pathname === `${target}/`;
  return pathname === target || pathname.startsWith(`${target}/`);
}
