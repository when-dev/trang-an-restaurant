import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { fullAddress, platformHref, siteConfig } from "@/config/site.config";
import { fmt, type Dictionary } from "@/i18n";
import { localeTags, locales, type Locale } from "@/i18n/config";
import { formatDate } from "@/lib/format";
import { href } from "@/lib/routes";
import { ExternalLink } from "../ExternalLink";
import { HoursList } from "../HoursList";
import { Wordmark } from "./Wordmark";

const PAGES = ["/menu", "/order", "/about", "/reviews", "/contact"] as const;

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const heading = "text-xs font-bold tracking-[0.16em] uppercase text-cream/55";
  const link = "link-underline inline-flex min-h-8 items-center text-cream/85 hover:text-white";
  const year = siteConfig.copyrightYear;
  // Only the owner-approved site may carry the restaurant's copyright line.
  const legal = fmt(siteConfig.siteMode === "official" ? dict.footer.copyright : dict.footer.proposal, { year });

  return (
    // Bottom padding on phones keeps the content clear of the fixed bottom navigation.
    <footer className="grain bg-forest text-cream relative pb-[calc(4.75rem+env(safe-area-inset-bottom))] lg:pb-0">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr] lg:gap-12 lg:py-16">
        <div className="space-y-5">
          <Wordmark tone="light" />
          <p className="text-cream/70 max-w-xs text-[0.9375rem]">{dict.footer.tagline}</p>
          <address className="space-y-2 text-[0.9375rem] not-italic">
            <span className="text-cream/90 flex items-start gap-2.5">
              <MapPin aria-hidden className="text-tomato mt-0.5 size-4 shrink-0" />
              {fullAddress}
            </span>
            <a href={siteConfig.phone.uri} className={`${link} gap-2.5`}>
              <Phone aria-hidden className="text-tomato size-4 shrink-0" />
              {siteConfig.phone.display}
            </a>
          </address>
        </div>

        <nav aria-label={dict.footer.pages}>
          <h2 className={heading}>{dict.footer.pages}</h2>
          <ul className="mt-4 space-y-1">
            {PAGES.map((p) => (
              <li key={p}>
                <Link href={href(locale, p)} className={link}>
                  {dict.nav[p.slice(1) as "menu" | "order" | "about" | "reviews" | "contact"]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={heading}>{dict.footer.delivery}</h2>
          <ul className="mt-4 space-y-1">
            {siteConfig.delivery.map((p) => (
              <li key={p.id}>
                <ExternalLink href={platformHref(p)} newTabLabel={dict.a11y.opensInNewTab} className={link}>
                  {p.name}
                </ExternalLink>
              </li>
            ))}
            <li>
              <ExternalLink href={siteConfig.google.mapsUrl} newTabLabel={dict.a11y.opensInNewTab} className={link}>
                Google Maps
              </ExternalLink>
            </li>
          </ul>
        </div>

        <div>
          <h2 className={heading}>{dict.common.hours}</h2>
          <HoursList dict={dict} className="text-cream/90 mt-4 max-w-56" />
          <p className="text-cream/55 mt-3 text-xs">{dict.hours.disclaimer}</p>
        </div>
      </div>

      <div className="border-cream/15 border-t">
        <div className="container-page text-cream/60 flex flex-col gap-3 py-5 text-[0.8125rem] lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <p className="text-cream/80">{legal}</p>
          <p>{fmt(dict.footer.sourcesNote, { date: formatDate(siteConfig.researchDate, locale) })}</p>
          <ul aria-label={dict.footer.language} className="flex gap-4">
            {locales.map((l) => (
              <li key={l}>
                <Link
                  href={`/${l}`}
                  hrefLang={localeTags[l].intl}
                  lang={localeTags[l].intl}
                  aria-current={l === locale ? "true" : undefined}
                  className={`${link} !min-h-6 aria-[current=true]:text-white aria-[current=true]:no-underline`}
                >
                  {localeTags[l].name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
