"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DESKTOP_MEDIA } from "@/lib/responsive";

/**
 * Sends desktop visitors (≥ lg) to `to` — on direct open and when a window is resized past the
 * breakpoint. Renders nothing, so server and client markup are identical (no hydration mismatch).
 */
export function DesktopRedirect({ to }: { to: string }) {
  const router = useRouter();

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MEDIA);
    const check = () => {
      if (mq.matches) router.replace(`${to}${window.location.hash}`, { scroll: false });
    };
    check();
    mq.addEventListener("change", check);
    return () => mq.removeEventListener("change", check);
  }, [router, to]);

  return null;
}
