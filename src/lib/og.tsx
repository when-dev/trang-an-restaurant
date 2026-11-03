import { frauncesLatin, frauncesLatinExt, manropeLatin, manropeLatinExt } from "./og-fonts.generated";

const decode = (b64: string): ArrayBuffer => {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
};

/**
 * OFL fonts (Fraunces, Manrope) for next/og — latin + latin-ext so Slovak diacritics render.
 * Embedded (scripts/embed-og-fonts.mjs) instead of read from disk: Cloudflare Workers have no filesystem.
 */
export async function ogFonts() {
  const [fl, fle, ml, mle] = [frauncesLatin, frauncesLatinExt, manropeLatin, manropeLatinExt].map(decode);
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
