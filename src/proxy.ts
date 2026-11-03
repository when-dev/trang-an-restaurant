import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/i18n/config";

/**
 * "/" and any path without a locale prefix redirect to the Slovak version.
 * No Accept-Language / geo detection — the default is always predictable (SK); a visitor who
 * switched to EN before gets EN via the NEXT_LOCALE cookie set by the language switch.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (isLocale(first)) return NextResponse.next();

  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  const locale = pathname === "/" && cookie && isLocale(cookie) ? cookie : defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Skip Next internals, API routes and files with an extension (icons, robots.txt, sitemap.xml…).
  matcher: ["/((?!_next|api|icon|apple-icon|.*\\.[\\w]+$).*)"],
};
