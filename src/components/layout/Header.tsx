"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu as MenuIcon, Phone, X } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { useI18n } from "@/i18n/client";
import { href, isActivePath, type PagePath } from "@/lib/routes";
import { LanguageSwitch } from "./LanguageSwitch";
import { Wordmark } from "./Wordmark";

type NavKey = "home" | "menu" | "directions" | "about" | "reviews" | "contact";

/** Desktop (≥ lg) navigation. Location info lives on Contact there, so there is no Directions item. */
const NAV: { path: PagePath; key: NavKey }[] = [
  { path: "/menu", key: "menu" },
  { path: "/about", key: "about" },
  { path: "/reviews", key: "reviews" },
  { path: "/contact", key: "contact" },
];

/** Mobile menu (< lg) additionally links Home and the mobile-only Directions page. */
const MOBILE_NAV: { path: PagePath; key: NavKey }[] = [
  { path: "", key: "home" },
  { path: "/menu", key: "menu" },
  { path: "/directions", key: "directions" },
  { path: "/about", key: "about" },
  { path: "/reviews", key: "reviews" },
  { path: "/contact", key: "contact" },
];

export function Header() {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [panelTop, setPanelTop] = useState(64);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = () => Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab") {
        const els = [toggleRef.current!, ...focusables()];
        const i = els.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          els.at(-1)?.focus();
        } else if (!e.shiftKey && i === els.length - 1) {
          e.preventDefault();
          els[0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (path: PagePath) => isActivePath(pathname, locale, path);

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          scrolled || open ? "bg-cream/92 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md" : "bg-cream/0"
        }`}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link href={href(locale)} aria-label={dict.a11y.home} className="-m-2 shrink-0 rounded-lg p-2">
            <Wordmark />
          </Link>

          <nav aria-label={dict.a11y.mainNav} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.key}>
                  <Link
                    href={href(locale, item.path)}
                    aria-current={isActive(item.path) ? "page" : undefined}
                    className="text-ink/80 hover:text-forest aria-[current=page]:text-forest relative inline-flex min-h-11 items-center rounded-full px-3 text-[0.9375rem] font-semibold whitespace-nowrap transition-colors xl:px-4"
                  >
                    {dict.nav[item.key]}
                    <span
                      aria-hidden
                      className={`bg-tomato absolute inset-x-3 bottom-1.5 h-0.5 origin-left rounded-full transition-transform duration-300 xl:inset-x-4 ${
                        isActive(item.path) ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitch />
            <Link
              href={href(locale, "/order")}
              className="btn btn-primary hidden !min-h-11 whitespace-nowrap sm:inline-flex lg:!px-4 xl:!px-[1.35rem]"
            >
              {dict.nav.order}
              <ArrowUpRight aria-hidden className="size-4" />
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="text-forest hover:bg-forest/8 inline-flex size-11 items-center justify-center rounded-full lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? dict.a11y.closeMenu : dict.a11y.openMenu}
              onClick={() => {
                setPanelTop(headerRef.current?.getBoundingClientRect().bottom ?? 64);
                setOpen((v) => !v);
              }}
            >
              {open ? <X aria-hidden className="size-6" /> : <MenuIcon aria-hidden className="size-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Outside <header>: its backdrop-filter would become the containing block of a fixed child. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        style={{ top: panelTop }}
        className="bg-cream fixed inset-x-0 bottom-0 z-40 overflow-y-auto lg:hidden"
      >
        <nav aria-label={dict.a11y.mainNav} className="container-page flex min-h-full flex-col pt-6 pb-28">
          <ul className="divide-line border-line divide-y border-y">
            {MOBILE_NAV.map((item, i) => (
              <li key={item.key} className="reveal" style={{ animationDelay: `${i * 40}ms` }}>
                <Link
                  href={href(locale, item.path)}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  className="font-display text-forest aria-[current=page]:text-tomato-ink flex min-h-16 items-center justify-between text-3xl"
                >
                  {dict.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            <Link href={href(locale, "/order")} className="btn btn-primary w-full">
              {dict.nav.order}
            </Link>
            <a href={siteConfig.phone.uri} className="btn btn-ghost w-full">
              <Phone aria-hidden className="size-4" />
              {siteConfig.phone.display}
            </a>
          </div>
          <div className="mt-8 flex items-center justify-between">
            <span className="text-muted text-sm font-semibold">{dict.footer.language}</span>
            <LanguageSwitch />
          </div>
        </nav>
      </div>
    </>
  );
}
