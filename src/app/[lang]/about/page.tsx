import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getDictionary } from "@/i18n";
import { isLocale } from "@/i18n/config";
import { HeroArt } from "@/components/HeroArt";
import { MapCard } from "@/components/MapCard";
import { PageIntro } from "@/components/Section";
import { href } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return pageMetadata(lang, "/about", { title: dict.meta.aboutTitle, description: dict.meta.aboutDescription });
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <PageIntro eyebrow={dict.about.eyebrow} title={dict.about.title} text={dict.about.lead} />

      <div className="container-page grid gap-12 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <ol className="space-y-10">
          {dict.about.sections.map((s, i) => (
            <li
              key={s.title}
              className="border-line grid grid-cols-[3rem_1fr] gap-4 border-t pt-8 sm:grid-cols-[4.5rem_1fr]"
            >
              <span aria-hidden className="font-display text-tomato text-4xl sm:text-5xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-display text-forest text-2xl sm:text-3xl">{s.title}</h2>
                <p className="text-muted mt-3 text-lg leading-relaxed">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <figure className="self-start lg:sticky lg:top-28">
          <div className="bg-cream-200 relative rounded-[2rem] p-8 sm:p-12">
            <div aria-hidden className="bg-tomato/85 absolute inset-[14%] rounded-full" />
            <HeroArt label={dict.home.heroIllustration} className="relative w-full" />
          </div>
          <figcaption className="text-muted mt-3 text-sm">{dict.about.photosNote}</figcaption>
        </figure>
      </div>

      <section aria-labelledby="where" className="bg-cream-200">
        <div className="container-page grid gap-10 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <h2 id="where" className="font-display text-forest text-4xl">
              {dict.about.locationTitle}
            </h2>
            <p className="text-muted mt-4 text-lg">{dict.about.locationText}</p>
            <div className="mt-10">
              <p className="font-display text-forest text-2xl">{dict.about.ctaTitle}</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link href={href(lang, "/menu")} className="btn btn-forest">
                  {dict.common.viewMenu}
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
                <Link href={href(lang, "/order")} className="btn btn-primary">
                  {dict.common.orderOnline}
                  <ArrowUpRight aria-hidden className="size-4" />
                </Link>
              </div>
            </div>
          </div>
          <MapCard />
        </div>
      </section>
    </>
  );
}
