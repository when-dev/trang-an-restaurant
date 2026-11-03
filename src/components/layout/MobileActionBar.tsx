"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navigation, ShoppingBag, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { href, isActivePath, type PagePath } from "@/lib/routes";

const ITEMS: { path: PagePath; label: "menu" | "orderShort" | "directions"; Icon: LucideIcon }[] = [
  { path: "/menu", label: "menu", Icon: UtensilsCrossed },
  { path: "/order", label: "orderShort", Icon: ShoppingBag },
  { path: "/directions", label: "directions", Icon: Navigation },
];

/**
 * Sticky bottom navigation on phones: Menu / Order / Directions — all internal pages.
 * The active item is derived from the URL (works on first load, refresh, client navigation and
 * locale switch, since the pathname is available during prerendering too). The footer reserves
 * matching bottom padding.
 */
export function MobileActionBar() {
  const { locale, dict } = useI18n();
  const pathname = usePathname();

  return (
    <nav
      aria-label={dict.a11y.mobileNav}
      className="border-line bg-cream/95 fixed inset-x-0 bottom-0 z-30 border-t px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto flex max-w-md gap-2">
        {ITEMS.map(({ path, label, Icon }) => {
          const active = isActivePath(pathname, locale, path);
          return (
            <li key={path} className="flex flex-1">
              <Link
                href={href(locale, path)}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl text-[0.75rem] font-bold transition-colors duration-200 ${
                  active
                    ? "bg-tomato-ink text-white shadow-[0_8px_20px_-12px_rgb(184_61_39/0.9)]"
                    : "text-forest hover:bg-forest/8"
                }`}
              >
                <Icon aria-hidden className="size-5" strokeWidth={active ? 2.25 : 2} />
                {dict.nav[label]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
