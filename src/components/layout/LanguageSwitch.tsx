"use client";

import { usePathname, useRouter } from "next/navigation";
import { localeTags, locales, switchLocalePath } from "@/i18n/config";
import { useI18n } from "@/i18n/client";

/** SK / EN toggle. Keeps the current page, query string (menu filters) and hash. */
export function LanguageSwitch({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav aria-label={dict.a11y.languageSwitch} className={className}>
      <ul
        className={`flex items-center rounded-full p-1 text-xs font-bold tracking-wider ${
          tone === "dark" ? "bg-forest/8 text-forest" : "bg-cream/10 text-cream"
        }`}
      >
        {locales.map((l) => {
          const active = l === locale;
          const target = switchLocalePath(pathname, l);
          return (
            <li key={l}>
              <a
                href={target}
                hrefLang={localeTags[l].intl}
                lang={localeTags[l].intl}
                aria-current={active ? "true" : undefined}
                aria-label={`${localeTags[l].name}${active ? ` — ${dict.a11y.currentLanguage}` : ""}`}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                  e.preventDefault();
                  if (active) return;
                  document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`;
                  router.push(`${target}${window.location.search}${window.location.hash}`, { scroll: false });
                }}
                className={`flex min-h-9 min-w-11 items-center justify-center rounded-full px-3 transition-colors ${
                  active ? (tone === "dark" ? "bg-forest text-cream" : "bg-cream text-forest") : "hover:bg-forest/10"
                }`}
              >
                {localeTags[l].label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
