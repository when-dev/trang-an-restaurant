import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { href } from "@/lib/routes";

/**
 * "Directions" link that respects the mobile/desktop split without JavaScript (no hydration risk):
 * below `lg` it opens the mobile Directions page, from `lg` up the Contact page. Exactly one of
 * the two links is displayed (the other is `display: none`, so it is not focusable or announced).
 */
export function DirectionsLink({
  locale,
  className = "",
  children,
}: {
  locale: Locale;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Link href={href(locale, "/directions")} className={`${className} lg:hidden`}>
        {children}
      </Link>
      <Link href={href(locale, "/contact")} className={`${className} hidden lg:inline-flex`}>
        {children}
      </Link>
    </>
  );
}
