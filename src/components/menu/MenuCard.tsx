import { ArrowUpRight, ChevronDown, CircleHelp } from "lucide-react";
import { getPlatform, platformHref, type PlatformId } from "@/config/site.config";
import { fmt, type Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { formatDate, formatPortion, formatPrice } from "@/lib/format";
import type { MenuEntry, MenuItem } from "@/lib/menu";
import { DishMedia } from "./DishMedia";

const PLATFORMS: {
  id: PlatformId;
  field: "woltEur" | "boltEur" | "bistroEur";
  label: "woltPrice" | "boltPrice" | "bistroPrice";
  check: "checkWolt" | "checkBolt" | "checkBistro";
}[] = [
  { id: "wolt", field: "woltEur", label: "woltPrice", check: "checkWolt" },
  { id: "bolt", field: "boltEur", label: "boltPrice", check: "checkBolt" },
  { id: "bistro", field: "bistroEur", label: "bistroPrice", check: "checkBistro" },
];

function DeliveryPrices({ item, locale, dict }: { item: MenuItem; locale: Locale; dict: Dictionary }) {
  return (
    <ul className="space-y-2 text-sm">
      {PLATFORMS.map((p) => {
        const value = item.price[p.field];
        const platform = getPlatform(p.id);
        return (
          <li key={p.id} className="flex min-h-8 items-center justify-between gap-3">
            <span className="text-ink font-semibold">{dict.menu[p.label]}</span>
            {value != null ? (
              <span className="text-right">
                <span className="text-ink font-semibold tabular-nums">{formatPrice(value, locale)}</span>
                {p.id === "wolt" && item.verification.wolt && (
                  <span className="text-muted block text-xs">
                    {fmt(dict.menu.woltCheckedAt, { date: formatDate(item.verification.wolt.checkedAt, locale) })}
                  </span>
                )}
              </span>
            ) : (
              <a
                href={platformHref(platform)}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-forest inline-flex min-h-8 items-center gap-1 text-right font-semibold"
              >
                {dict.menu[p.check]}
                <ArrowUpRight aria-hidden className="size-3.5 shrink-0" />
                <span className="sr-only">{dict.a11y.opensInNewTab}</span>
              </a>
            )}
          </li>
        );
      })}
      {item.verification.woltDifferentPortion && <li className="text-muted text-xs">{dict.menu.woltOtherPortion}</li>}
    </ul>
  );
}

/** One "Delivery prices" disclosure per card; variants (e.g. 5 / 10 pcs) are listed separately inside. */
function DeliveryDetails({ items, locale, dict }: { items: MenuItem[]; locale: Locale; dict: Dictionary }) {
  return (
    <details className="group/d bg-cream-200/60 open:bg-cream-200 rounded-xl">
      <summary className="text-forest flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 px-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        <span>{dict.menu.deliveryPrices}</span>
        <ChevronDown aria-hidden className="size-4 transition-transform group-open/d:rotate-180" />
      </summary>
      <div className="divide-line divide-y px-3 pb-3">
        {items.map((item) => (
          <div key={item.id} className="py-2 first:pt-0 last:pb-0">
            {items.length > 1 && (
              <p className="text-wood-ink mb-1 text-xs font-bold tracking-wide uppercase">
                {formatPortion(item.portionLabel, locale)}
              </p>
            )}
            <DeliveryPrices item={item} locale={locale} dict={dict} />
          </div>
        ))}
      </div>
    </details>
  );
}

export function MenuCard({ entry, locale, dict }: { entry: MenuEntry; locale: Locale; dict: Dictionary }) {
  const first = entry.variants[0];
  const isGroup = entry.variants.length > 1;
  const name = first.name[locale];
  const secondaryName = locale === "en" && first.name.sk !== first.name.en ? first.name.sk : null;
  const needsReview = entry.variants.some((v) => v.verification.needsReview);
  const portion = formatPortion(first.portionLabel, locale);
  const image = entry.variants.find((v) => v.image)?.image ?? null;
  const media = { image, categoryLabel: dict.categories[first.category], locale, dict };

  return (
    <article
      id={`dish-${entry.key}`}
      className="card group hover:shadow-lift flex h-full flex-col overflow-hidden transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5"
    >
      <DishMedia variant="cover" {...media} className="hidden sm:flex" />
      <div className="flex flex-1 flex-col p-5">
        <div className="text-wood-ink flex items-center justify-between gap-3 text-xs font-semibold tracking-wide">
          <span className="tabular-nums">
            {first.brochureNumber != null && (
              <>
                <span className="sr-only">{dict.menu.number} </span>
                <span aria-hidden>№ </span>
                {first.brochureNumber}
              </>
            )}
            {first.brochureNumber != null && portion && !isGroup && <span aria-hidden> · </span>}
            {!isGroup && portion}
          </span>
          {needsReview && (
            <span
              title={dict.menu.needsReviewHint}
              className="bg-cream-200 text-wood-ink inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] whitespace-nowrap"
            >
              <CircleHelp aria-hidden className="size-3" />
              {dict.menu.needsReview}
              <span className="sr-only">: {dict.menu.needsReviewHint}</span>
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <DishMedia variant="thumb" {...media} className="flex sm:hidden" />
          <div className="min-w-24 flex-1 sm:min-w-36">
            <h3 className="font-display text-forest text-xl leading-tight">{name}</h3>
            {secondaryName && (
              <p lang="sk" className="text-muted mt-0.5 text-sm">
                {secondaryName}
              </p>
            )}
            {first.gloss && <p className="text-wood-ink mt-1 text-sm italic">{first.gloss[locale]}</p>}
          </div>
          {!isGroup && (
            <p className="shrink-0 text-right">
              <span className="font-display text-ink block text-[1.75rem] leading-none tabular-nums">
                {formatPrice(first.price.inStoreEur, locale)}
              </span>
              <span className="text-muted mt-1 block text-[0.6875rem] font-semibold tracking-wide uppercase">
                {dict.menu.inStore}
              </span>
            </p>
          )}
        </div>
        {first.description && (
          <p className="text-muted mt-3 text-sm leading-relaxed">
            <span className="sr-only">{dict.menu.ingredientsSource} </span>
            {first.description[locale]}
          </p>
        )}

        <div className="mt-auto pt-4">
          {isGroup ? (
            <div className="space-y-2">
              <p className="text-muted text-xs font-semibold tracking-wide uppercase">{dict.menu.variants}</p>
              <ul className="divide-line border-line divide-y border-y">
                {entry.variants.map((v) => (
                  <li key={v.id} className="flex items-baseline justify-between py-2">
                    <span className="text-ink font-semibold">{formatPortion(v.portionLabel, locale)}</span>
                    <span className="text-right">
                      <span className="sr-only">{dict.menu.inStore}: </span>
                      <span className="font-display text-ink text-2xl tabular-nums">
                        {formatPrice(v.price.inStoreEur, locale)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-muted text-xs">{dict.menu.inStore}</p>
              <div className="pt-1">
                <DeliveryDetails items={entry.variants} locale={locale} dict={dict} />
              </div>
            </div>
          ) : (
            <DeliveryDetails items={[first]} locale={locale} dict={dict} />
          )}
        </div>
      </div>
    </article>
  );
}
