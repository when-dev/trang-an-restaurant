import { siteConfig } from "@/config/site.config";
import type { Dictionary } from "@/i18n";
import { dayRanges } from "@/lib/hours";

export function HoursList({ dict, className = "" }: { dict: Dictionary; className?: string }) {
  return (
    <dl className={`space-y-1.5 ${className}`}>
      {siteConfig.openingHours.map((p) => (
        <div key={p.days.join()} className="flex justify-between gap-6 tabular-nums">
          <dt>
            {dayRanges(p.days)
              .map(([a, b]) =>
                a === b ? dict.hours.dayShort[a - 1] : `${dict.hours.dayShort[a - 1]} – ${dict.hours.dayShort[b - 1]}`,
              )
              .join(", ")}
          </dt>
          <dd className="font-semibold">
            {p.opens} – {p.closes}
          </dd>
        </div>
      ))}
    </dl>
  );
}
