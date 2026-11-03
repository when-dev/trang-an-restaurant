import { ArrowUpRight, BadgeCheck, CircleAlert } from "lucide-react";
import { platformHref, siteConfig, type DeliveryPlatform } from "@/config/site.config";
import { fmt, type Dictionary } from "@/i18n";
import { menuItems } from "@/lib/menu";
import { ExternalLink } from "./ExternalLink";

const ACCENT: Record<DeliveryPlatform["id"], string> = {
  wolt: "#009DE0",
  bolt: "#34D186",
  bistro: "var(--color-wood)",
};

function knownPriceCount(p: DeliveryPlatform): number {
  const field = p.id === "wolt" ? "woltEur" : p.id === "bolt" ? "boltEur" : "bistroEur";
  return menuItems.filter((i) => i.price[field] != null).length;
}

/** Three platform cards. No ETA, fees or availability are shown — the platform decides those. */
export function DeliveryCards({ dict, headingLevel = 3 }: { dict: Dictionary; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as const;
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {siteConfig.delivery.map((p, i) => {
        const count = knownPriceCount(p);
        return (
          <li
            key={p.id}
            className="card reveal group shadow-soft hover:shadow-lift relative flex flex-col overflow-hidden p-6 transition-shadow duration-300"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: ACCENT[p.id] }} />
            <div className="flex items-start justify-between gap-3">
              <H className="font-display text-forest text-2xl">{p.name}</H>
              {p.verified ? (
                <span className="bg-forest-100 text-forest inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold">
                  <BadgeCheck aria-hidden className="size-3.5" />
                  {dict.order.verified}
                </span>
              ) : (
                <span className="bg-tomato-100 text-tomato-deep inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold">
                  <CircleAlert aria-hidden className="size-3.5" />
                  {dict.order.unverified}
                </span>
              )}
            </div>
            <p className="text-muted mt-2 text-sm">{fmt(dict.order.listedAs, { name: p.listedAs })}</p>
            <dl className="border-line mt-5 border-t pt-4 text-sm">
              <dt className="text-muted">{dict.order.compare.prices}</dt>
              <dd className="text-ink mt-0.5 font-semibold">
                {count > 0 ? fmt(dict.order.woltPricesKnown, { count }) : dict.order.pricesUnknown}
              </dd>
            </dl>
            {!p.verified && <p className="text-muted mt-4 text-sm">{dict.order.unverifiedText}</p>}
            <div className="mt-auto flex flex-col gap-2 pt-6">
              <ExternalLink
                href={platformHref(p)}
                newTabLabel={dict.a11y.opensInNewTab}
                className="btn btn-forest w-full"
              >
                {p.verified
                  ? fmt(dict.order.openOn, { platform: p.name })
                  : fmt(dict.order.searchOn, { platform: p.name })}
                <ArrowUpRight
                  aria-hidden
                  className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </ExternalLink>
              {!p.verified && (
                <ExternalLink
                  href={p.url}
                  newTabLabel={dict.a11y.opensInNewTab}
                  className="link-underline text-forest inline-flex min-h-11 items-center justify-center text-sm font-semibold"
                >
                  {dict.order.directLink}
                </ExternalLink>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
