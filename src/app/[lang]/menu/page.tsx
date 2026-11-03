import Link from "next/link";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { fmt, getDictionary } from "@/i18n";
import { isLocale } from "@/i18n/config";
import { MenuExplorer } from "@/components/menu/MenuExplorer";
import { PageIntro } from "@/components/Section";
import { formatDate } from "@/lib/format";
import { menuItems } from "@/lib/menu";
import { href } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/menu">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return pageMetadata(lang, "/menu", { title: dict.meta.menuTitle, description: dict.meta.menuDescription });
}

export default async function MenuPage({ params }: PageProps<"/[lang]/menu">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <PageIntro eyebrow={dict.menu.eyebrow} title={dict.menu.title} text={dict.menu.intro} />
      <div className="container-page">
        <aside
          aria-label={dict.menu.priceNotice}
          className="border-wood/30 bg-paper text-ink flex gap-3 rounded-2xl border p-4 text-sm sm:p-5"
        >
          <Info aria-hidden className="text-wood-ink mt-0.5 size-5 shrink-0" />
          <div className="space-y-1.5">
            <p>{dict.menu.priceNotice}</p>
            <p className="text-muted">
              {dict.menu.allergenNotice} {dict.menu.imagesNotice}{" "}
              {fmt(dict.menu.source, {
                menuDate: formatDate(siteConfig.menuPhotoDate, lang),
                woltDate: formatDate(siteConfig.researchDate, lang),
              })}
            </p>
          </div>
        </aside>
      </div>
      <div className="container-page pt-8 pb-20 lg:pb-28">
        <MenuExplorer items={menuItems} />
        <div className="mt-14 flex justify-center">
          <Link href={href(lang, "/order")} className="btn btn-primary">
            {dict.common.orderOnline}
          </Link>
        </div>
      </div>
    </>
  );
}
