import { readFile } from "node:fs/promises";
import path from "node:path";

const FONT_DIR = path.join(process.cwd(), "assets/fonts");

/** OFL fonts (Fraunces, Manrope) for next/og — latin + latin-ext so Slovak diacritics render. */
export async function ogFonts() {
  const load = (f: string) => readFile(path.join(FONT_DIR, f));
  const [fl, fle, ml, mle] = await Promise.all([
    load("fraunces-latin-600-normal.woff"),
    load("fraunces-latin-ext-600-normal.woff"),
    load("manrope-latin-600-normal.woff"),
    load("manrope-latin-ext-600-normal.woff"),
  ]);
  return [
    { name: "Fraunces", data: fl, weight: 600 as const, style: "normal" as const },
    { name: "Fraunces", data: fle, weight: 600 as const, style: "normal" as const },
    { name: "Manrope", data: ml, weight: 600 as const, style: "normal" as const },
    { name: "Manrope", data: mle, weight: 600 as const, style: "normal" as const },
  ];
}

/** Brand mark used by the favicon, apple icon and OG image. */
export function BowlMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="19" fill="#12382C" />
      <path d="M9 21h22a11 11 0 0 1-22 0z" fill="#F8F5ED" />
      <path d="M13 17c2-2 4 2 6 0s4 2 6 0" fill="none" stroke="#D95137" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 9l7-3M25 12l7-3" stroke="#9B7453" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
