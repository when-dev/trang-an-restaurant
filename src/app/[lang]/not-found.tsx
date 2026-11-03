import Link from "next/link";
import { lang } from "next/root-params";
import { ArrowRight } from "lucide-react";
import { getDictionary } from "@/i18n";
import { defaultLocale, isLocale } from "@/i18n/config";
import { href } from "@/lib/routes";

export default async function NotFound() {
  const value = await lang();
  const locale = isLocale(value) ? value : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-20 text-center">
      <div className="max-w-lg">
        <title>{`${dict.meta.notFoundTitle} · Trang An`}</title>
        <p aria-hidden className="font-display text-tomato text-[7rem] leading-none sm:text-[9rem]">
          {dict.notFound.code}
        </p>
        <h1 className="font-display text-forest mt-4 text-4xl">{dict.notFound.title}</h1>
        <p className="text-muted mt-4 text-lg">{dict.notFound.text}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={href(locale, "/menu")} className="btn btn-forest">
            {dict.common.viewMenu}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
          <Link href={href(locale)} className="btn btn-ghost">
            {dict.common.backHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
