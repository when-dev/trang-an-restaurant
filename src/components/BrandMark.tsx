/** The Trang An bowl mark (same drawing as the favicon / wordmark). Decorative. */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={className}>
      <circle cx="20" cy="20" r="19" fill="currentColor" />
      <path d="M9 21h22a11 11 0 0 1-22 0z" fill="#F8F5ED" />
      <path d="M13 17c2-2 4 2 6 0s4 2 6 0" fill="none" stroke="#D95137" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 9l7-3M25 12l7-3" stroke="#9B7453" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
