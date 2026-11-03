/** Text wordmark (the restaurant's own logo can replace it once licensed). */
export function Wordmark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const main = tone === "dark" ? "text-forest" : "text-cream";
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 40 40" aria-hidden className="size-9 shrink-0">
        <circle cx="20" cy="20" r="19" className={tone === "dark" ? "fill-forest" : "fill-cream"} />
        <path d="M9 21h22a11 11 0 0 1-22 0z" className={tone === "dark" ? "fill-cream" : "fill-forest"} />
        <path d="M13 17c2-2 4 2 6 0s4 2 6 0" fill="none" stroke="#D95137" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 9l7-3M25 12l7-3" stroke="#9B7453" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.375rem] font-semibold ${main}`}>Trang An</span>
        <span
          className={`mt-1 hidden text-[0.625rem] font-bold tracking-[0.18em] uppercase min-[420px]:block ${
            tone === "dark" ? "text-wood-ink" : "text-cream/75"
          }`}
        >
          Vietnamská reštaurácia
        </span>
      </span>
    </span>
  );
}
