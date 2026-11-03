"use client";

import { ArrowRight, Info } from "lucide-react";
import { fullAddress } from "@/config/site.config";
import { useI18n } from "@/i18n/client";
import { DirectionsLink } from "./DirectionsLink";
import { RouteMap } from "./map/RouteMap";

/**
 * Map card with the illustrated, animated route map — the single map implementation, used everywhere.
 * No map tiles or embeds (nothing to attribute, no third-party requests) and it never navigates away
 * by itself:
 * - `preview` (home, about): CTA → Directions page on mobile, Contact page on desktop;
 * - `full` (Contact, mobile Directions): no CTA — those pages show the map-service buttons next to it.
 */
export function MapCard({ variant = "preview", className = "" }: { variant?: "preview" | "full"; className?: string }) {
  const { locale, dict } = useI18n();
  const t = dict.directions;

  return (
    <div className={`card shadow-soft overflow-hidden ${className}`}>
      <div className="relative aspect-[4/3] w-full bg-[#E3EAF2] sm:aspect-[16/10]">
        <RouteMap
          label={t.mapLabel}
          originLabel={t.mapOrigin}
          originHint={t.mapOriginHint}
          className="absolute inset-0 size-full"
        />
        <p
          title={t.mapOriginHint}
          className="pointer-events-none absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-[0.6875rem] font-medium text-[#55657A] backdrop-blur"
        >
          <Info aria-hidden className="size-3" />
          {t.routeNote}
        </p>
      </div>

      <div className="border-line flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <p className="text-ink text-sm font-semibold">{fullAddress}</p>
        {variant === "preview" && (
          <DirectionsLink locale={locale} className="btn btn-primary !min-h-11 shrink-0 text-sm">
            {t.previewCta}
            <ArrowRight aria-hidden className="size-4" />
          </DirectionsLink>
        )}
      </div>
    </div>
  );
}
