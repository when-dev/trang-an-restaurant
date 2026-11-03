"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Phone } from "lucide-react";
import { fullAddress, siteConfig } from "@/config/site.config";
import { useI18n } from "@/i18n/client";
import { ExternalLink } from "./ExternalLink";

const COPY_TEXT = `Trang An, ${fullAddress}`;

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers/contexts without the async Clipboard API.
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

/**
 * Explicit map/contact actions — the only controls that leave the site for a map service.
 * Used on the mobile Directions page (all actions) and on Contact (without "call": Contact shows the
 * phone number in its own block).
 */
export function DirectionsActions({ showCall = true }: { showCall?: boolean }) {
  const { dict } = useI18n();
  const t = dict.directions;
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = async () => {
    setStatus((await copyToClipboard(COPY_TEXT)) ? "copied" : "failed");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), 2500);
  };

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 [&>*]:whitespace-nowrap">
        <ExternalLink
          href={siteConfig.google.directionsUrl}
          newTabLabel={dict.a11y.opensInNewTab}
          className="btn btn-forest"
        >
          {t.openGoogle}
          <ArrowUpRight aria-hidden className="size-4" />
        </ExternalLink>
        <ExternalLink
          href={siteConfig.google.appleMapsUrl}
          newTabLabel={dict.a11y.opensInNewTab}
          className="btn btn-ghost"
        >
          {t.openApple}
          <ArrowUpRight aria-hidden className="size-4" />
        </ExternalLink>
        {showCall && (
          <a href={siteConfig.phone.uri} className="btn btn-primary">
            <Phone aria-hidden className="size-4" />
            {t.callRestaurant}
          </a>
        )}
        <button type="button" onClick={onCopy} className="btn btn-ghost">
          {status === "copied" ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
          {status === "copied" ? t.copied : t.copyAddress}
        </button>
      </div>
      <p aria-live="polite" className="sr-only">
        {status === "copied" ? t.copied : status === "failed" ? t.copyFailed : ""}
      </p>
      {status === "failed" && <p className="text-tomato-ink mt-2 text-sm font-semibold">{t.copyFailed}</p>}
      <p className="text-muted mt-3 text-xs">{t.externalNote}</p>
    </div>
  );
}
