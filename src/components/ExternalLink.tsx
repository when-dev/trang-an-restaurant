import type { ComponentProps } from "react";

/** External link that always opens in a new tab safely and announces it to screen readers. */
export function ExternalLink({
  children,
  newTabLabel,
  ...props
}: ComponentProps<"a"> & { href: string; newTabLabel: string }) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="sr-only"> {newTabLabel}</span>
    </a>
  );
}
