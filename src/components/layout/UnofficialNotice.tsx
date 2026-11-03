import { siteConfig } from "@/config/site.config";
import type { Dictionary } from "@/i18n";

/**
 * Minimal "unofficial proposal" line — shown only in `demo` mode (public previews before the owner's
 * approval) so visitors cannot mistake the site for the restaurant's own. Hidden in `presentation`
 * (local client presentation) and `official` mode.
 */
export function UnofficialNotice({ dict }: { dict: Dictionary }) {
  if (siteConfig.siteMode !== "demo") return null;
  return (
    <p
      role="note"
      className="bg-cream-200 text-ink/75 border-line border-b px-4 py-1.5 text-center text-xs leading-snug"
    >
      {dict.demo.notice}
    </p>
  );
}
