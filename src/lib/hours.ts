import type { OpeningPeriod } from "@/config/site.config";

export interface ZonedNow {
  /** ISO weekday 1 (Mon) … 7 (Sun) */
  weekday: number;
  /** minutes since midnight */
  minutes: number;
}

const WEEKDAYS: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

/** Wall-clock weekday and time of `date` in `timeZone` (DST-safe, via Intl). */
export function zonedNow(date: Date, timeZone: string): ZonedNow {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    weekday: WEEKDAYS[get("weekday")],
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function periodFor(weekday: number, hours: readonly OpeningPeriod[]): OpeningPeriod | null {
  return hours.find((p) => p.days.includes(weekday)) ?? null;
}

export type OpenStatus =
  | { open: true; closes: string }
  | { open: false; opensToday: boolean; nextWeekday: number; opens: string }
  | { open: false; opensToday: false; nextWeekday: null; opens: null };

export function getOpenStatus(now: ZonedNow, hours: readonly OpeningPeriod[]): OpenStatus {
  const today = periodFor(now.weekday, hours);
  if (today) {
    const o = toMinutes(today.opens);
    const c = toMinutes(today.closes);
    if (now.minutes >= o && now.minutes < c) return { open: true, closes: today.closes };
    if (now.minutes < o) return { open: false, opensToday: true, nextWeekday: now.weekday, opens: today.opens };
  }
  for (let i = 1; i <= 7; i++) {
    const wd = ((now.weekday - 1 + i) % 7) + 1;
    const p = periodFor(wd, hours);
    if (p) return { open: false, opensToday: false, nextWeekday: wd, opens: p.opens };
  }
  return { open: false, opensToday: false, nextWeekday: null, opens: null };
}

/** Collapse days into ranges like [[1,5],[6,7]] for display. */
export function dayRanges(days: readonly number[]): [number, number][] {
  const sorted = [...days].sort((a, b) => a - b);
  const out: [number, number][] = [];
  for (const d of sorted) {
    const last = out.at(-1);
    if (last && d === last[1] + 1) last[1] = d;
    else out.push([d, d]);
  }
  return out;
}

/** schema.org OpeningHoursSpecification dayOfWeek values. */
export const SCHEMA_DAYS = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
