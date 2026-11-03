"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useI18n } from "@/i18n/client";
import { href } from "@/lib/routes";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { locale, dict } = useI18n();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-20 text-center">
      <div className="max-w-lg">
        <h1 className="font-display text-forest text-4xl">{dict.error.title}</h1>
        <p className="text-muted mt-4 text-lg">{dict.error.text}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn btn-primary">
            {dict.error.retry}
          </button>
          <Link href={href(locale)} className="btn btn-ghost">
            {dict.common.backHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
