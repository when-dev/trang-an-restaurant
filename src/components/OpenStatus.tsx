"use client";

import { useSyncExternalStore } from "react";
import { siteConfig } from "@/config/site.config";
import { fmt } from "@/i18n";
import { useI18n } from "@/i18n/client";
import { getOpenStatus, zonedNow } from "@/lib/hours";

// Re-evaluate every minute. The server snapshot is `null`, so SSR and hydration render the same
// neutral placeholder and the real status appears only on the client (no hydration mismatch).
function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 60_000);
  return () => window.clearInterval(id);
}
const getMinuteKey = () => Math.floor(Date.now() / 60_000);
const getServerKey = () => null;

export function OpenStatus({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const { dict } = useI18n();
  const minute = useSyncExternalStore(subscribe, getMinuteKey, getServerKey);

  if (minute === null) {
    return (
      <span className={`inline-flex items-center gap-2 text-sm ${className}`} aria-live="polite">
        <span aria-hidden className="size-2.5 rounded-full bg-current opacity-30" />
        <span className="opacity-70">{dict.hours.checking}</span>
      </span>
    );
  }

  const status = getOpenStatus(zonedNow(new Date(minute * 60_000), siteConfig.timeZone), siteConfig.openingHours);
  let detail = "";
  if (status.open) detail = fmt(dict.hours.closesAt, { time: status.closes });
  else if (status.opensToday) detail = fmt(dict.hours.opensTodayAt, { time: status.opens });
  else if (status.nextWeekday) {
    const today = zonedNow(new Date(minute * 60_000), siteConfig.timeZone).weekday;
    const isTomorrow = status.nextWeekday === (today % 7) + 1;
    detail = fmt(dict.hours.opensAt, {
      day: isTomorrow ? dict.hours.tomorrow : dict.hours.dayNames[status.nextWeekday - 1],
      time: status.opens,
    });
  }

  return (
    <span className={`inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm ${className}`} aria-live="polite">
      <span aria-hidden className={`relative size-2.5 rounded-full ${status.open ? "bg-herb" : "bg-tomato"}`}>
        {status.open && (
          <span className="bg-herb absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:hidden" />
        )}
      </span>
      <strong className={tone === "dark" ? "text-ink" : "text-cream"}>
        {status.open ? dict.hours.openNow : dict.hours.closedNow}
      </strong>
      {detail && <span className={tone === "dark" ? "text-muted" : "text-cream/75"}>· {detail}</span>}
    </span>
  );
}
