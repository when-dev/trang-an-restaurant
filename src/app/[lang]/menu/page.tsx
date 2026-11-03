import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n";
import { isLocale } from "@/i18n/config";
import { MenuExplorer } from "@/components/menu/MenuExplorer";
import { PageIntro } from "@/components/Section";
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
      <div className="container-page pb-20 lg:pb-28">
        <MenuExplorer items={menuItems} />
        <p className="text-muted mt-12 text-center text-xs">{dict.menu.footnote}</p>
        <div className="mt-6 flex justify-center">
          <Link href={href(lang, "/order")} className="btn btn-primary">
            {dict.common.orderOnline}
          </Link>
        </div>
      </div>
    </>
  );
}
