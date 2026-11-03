import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowRight, ArrowUpRight, Bike, MapPin, Navigation, Phone, Store } from "lucide-react";
import { fullAddress, siteConfig } from "@/config/site.config";
import { fmt, getDictionary } from "@/i18n";
import { isLocale } from "@/i18n/config";
import { DeliveryCards } from "@/components/DeliveryCards";
import { DirectionsLink } from "@/components/DirectionsLink";
import { HeroArt } from "@/components/HeroArt";
import { HoursList } from "@/components/HoursList";
import { MapCard } from "@/components/MapCard";
import { MenuCard } from "@/components/menu/MenuCard";
import { OpenStatus } from "@/components/OpenStatus";
import { Reviews } from "@/components/Reviews";
import { SectionHeading } from "@/components/Section";
import { formatDate, formatPortion, formatPrice } from "@/lib/format";
import { categoriesWithItems, groupEntries, itemsById, menuItems } from "@/lib/menu";
import { href } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return pageMetadata(lang, "", { title: dict.meta.homeTitle, description: dict.meta.homeDescription });
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang;
  const dict = getDictionary(locale);
  const featured = groupEntries(itemsById(siteConfig.featured.itemIds));
  const heroDish = menuItems.find((i) => i.id === "menu-019")!;
  const categories = categoriesWithItems();
  const benefitIcons = [MapPin, Store, Bike];

  return (
    <>
      {/* HERO */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden">
        <div className="container-page relative grid items-center gap-10 pt-6 pb-14 sm:pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pt-8 lg:pb-24">
          <div className="reveal relative z-10">
            <p className="eyebrow">{dict.home.eyebrow}</p>
            <h1
              id="hero-title"
              className="font-display text-forest mt-5 text-[2.75rem] leading-[0.98] sm:text-6xl lg:text-[5.25rem]"
            >
              {dict.home.heroTitle}
            </h1>
            <p className="text-muted mt-6 max-w-xl text-lg leading-relaxed sm:text-xl">{dict.home.heroSubtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href={href(locale, "/menu")} className="btn btn-forest">
                {dict.common.viewMenu}
                <ArrowRight aria-hidden className="size-4" />
              </Link>
              <Link href={href(locale, "/order")} className="btn btn-primary">
                {dict.common.orderOnline}
                <ArrowUpRight aria-hidden className="size-4" />
              </Link>
              <DirectionsLink locale={locale} className="btn btn-ghost">
                <Navigation aria-hidden className="size-4" />
                {dict.common.directions}
              </DirectionsLink>
            </div>
            <dl className="border-line mt-10 grid gap-x-8 gap-y-4 border-t pt-6 text-sm sm:grid-cols-[auto_auto_1fr]">
              <div>
                <dt className="sr-only">{dict.common.address}</dt>
                <dd className="flex items-start gap-2">
                  <MapPin aria-hidden className="text-tomato-ink mt-0.5 size-4 shrink-0" />
                  <span>{fullAddress}</span>
                </dd>
              </div>
              <div>
                <dt className="sr-only">{dict.common.phone}</dt>
                <dd className="flex items-center gap-2">
                  <Phone aria-hidden className="text-tomato-ink size-4 shrink-0" />
                  <a href={siteConfig.phone.uri} className="link-underline text-ink font-semibold whitespace-nowrap">
                    {siteConfig.phone.display}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">{dict.common.hours}</dt>
                <dd>
                  <OpenStatus />
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-[34rem] lg:max-w-none">
            <div aria-hidden className="bg-cream-200 absolute -inset-[4%] rounded-full" />
            <div aria-hidden className="bg-tomato absolute top-[2%] -right-[2%] size-[38%] rounded-full" />
            <div aria-hidden className="bg-forest absolute bottom-[10%] -left-[3%] size-[16%] rounded-full" />
            <HeroArt
              label={dict.home.heroIllustration}
              className="reveal relative w-full drop-shadow-none [animation-delay:120ms]"
            />
            <Link
              href={href(locale, "/menu")}
              className="card reveal shadow-lift absolute bottom-[4%] left-0 flex max-w-[15rem] flex-col gap-1 p-4 transition-transform [animation-delay:320ms] hover:-translate-y-0.5 sm:left-[2%] sm:p-5"
            >
              <span className="text-wood-ink text-xs font-semibold tracking-wide">
                № {heroDish.brochureNumber} · {formatPortion(heroDish.portionLabel, locale)}
              </span>
              <span className="font-display text-forest text-lg leading-tight">{heroDish.name[locale]}</span>
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-muted text-xs">{dict.menu.inStore}</span>
                <span className="font-display text-ink text-2xl tabular-nums">
                  {formatPrice(heroDish.price.inStoreEur, locale)}
                </span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section aria-label={dict.home.eyebrow} className="border-line bg-paper border-y">
        <ul className="container-page divide-line grid py-2 md:grid-cols-3 md:divide-x">
          {dict.home.benefits.map((b, i) => {
            const Icon = benefitIcons[i];
            return (
              <li key={b.title} className="flex items-start gap-4 py-5 md:px-8 md:first:pl-0 md:last:pr-0">
                <span className="bg-forest-100 text-forest inline-flex size-11 shrink-0 items-center justify-center rounded-full">
                  <Icon aria-hidden className="size-5" />
                </span>
                <div>
                  <p className="text-ink font-semibold">{b.title}</p>
                  <p className="text-muted mt-1 text-sm">{b.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* FAVOURITES */}
      <section aria-labelledby="fav-title" className="container-page py-20 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="fav-title"
            eyebrow={dict.home.favoritesEyebrow}
            title={dict.home.favoritesTitle}
            text={dict.home.favoritesText}
          />
          <Link href={href(locale, "/menu")} className="btn btn-ghost self-start lg:self-auto">
            {dict.common.viewMenu}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {featured.map((entry) => (
            <li key={entry.key}>
              <MenuCard entry={entry} locale={locale} dict={dict} />
            </li>
          ))}
        </ul>
        <p className="text-muted mt-4 text-xs">
          {fmt(dict.home.favoritesSource, { date: formatDate(siteConfig.featured.checkedAt, locale) })}
        </p>
      </section>

      {/* CATEGORIES */}
      <section aria-labelledby="cat-title" className="bg-forest text-cream grain">
        <div className="container-page py-20 lg:py-28">
          <SectionHeading
            id="cat-title"
            tone="light"
            eyebrow={dict.home.categoriesEyebrow}
            title={dict.home.categoriesTitle}
            text={fmt(dict.home.categoriesText, { count: menuItems.length, groups: categories.length })}
          />
          <ul className="bg-cream/15 mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] lg:grid-cols-4">
            {categories.map((c, i) => {
              const count = menuItems.filter((m) => m.category === c).length;
              return (
                <li key={c} className="bg-forest">
                  <Link
                    href={`${href(locale, "/menu")}?cat=${c}`}
                    className="group hover:bg-forest-700 flex h-full min-h-28 flex-col justify-between gap-3 p-4 transition-colors sm:p-5 lg:flex-row lg:items-center lg:gap-4"
                  >
                    <span>
                      <span className="text-cream/55 block text-xs font-semibold tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display mt-1 block text-lg leading-tight sm:text-xl">
                        {dict.categories[c]}
                      </span>
                    </span>
                    <span className="text-cream/70 flex items-center gap-2 text-sm tabular-nums">
                      {count}
                      <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ORDER */}
      <section id="order" aria-labelledby="order-title" className="container-page scroll-mt-24 py-20 lg:py-28">
        <SectionHeading
          id="order-title"
          eyebrow={dict.home.orderEyebrow}
          title={dict.home.orderTitle}
          text={dict.home.orderText}
        />
        <div className="mt-10">
          <DeliveryCards dict={dict} />
        </div>
        <p className="text-muted mt-4 text-sm">{dict.order.feesNote}</p>
      </section>

      {/* ABOUT */}
      <section aria-labelledby="about-title" className="border-line bg-paper border-y">
        <div className="container-page grid gap-10 py-20 lg:grid-cols-[1fr_1fr] lg:items-center lg:py-28">
          <SectionHeading id="about-title" eyebrow={dict.home.aboutEyebrow} title={dict.home.aboutTitle} />
          <div>
            <p className="text-muted text-lg leading-relaxed">{dict.home.aboutText}</p>
            <Link href={href(locale, "/about")} className="btn btn-ghost mt-8">
              {dict.home.aboutCta}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section aria-labelledby="reviews-title" className="container-page py-20 lg:py-28">
        <SectionHeading id="reviews-title" eyebrow={dict.home.reviewsEyebrow} title={dict.home.reviewsTitle} />
        <div className="mt-10">
          <Suspense fallback={<div className="card h-48 animate-pulse" />}>
            <Reviews locale={locale} dict={dict} limit={3} />
          </Suspense>
        </div>
      </section>

      {/* CONTACT */}
      <section aria-labelledby="contact-title" className="bg-cream-200">
        <div className="container-page grid gap-10 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:py-28">
          <div>
            <SectionHeading id="contact-title" eyebrow={dict.home.contactEyebrow} title={dict.home.contactTitle} />
            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-muted text-sm font-semibold">{dict.common.hours}</h3>
                <HoursList dict={dict} className="text-ink mt-2 max-w-xs" />
                <OpenStatus className="mt-3" />
                <p className="text-muted mt-2 text-xs">{dict.hours.disclaimer}</p>
              </div>
              <div>
                <h3 className="text-muted text-sm font-semibold">{dict.common.phone}</h3>
                <a
                  href={siteConfig.phone.uri}
                  className="font-display text-forest link-underline mt-1 inline-block text-2xl"
                >
                  {siteConfig.phone.display}
                </a>
              </div>
              <Link href={href(locale, "/contact")} className="btn btn-ghost">
                {dict.nav.contact}
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          </div>
          <MapCard />
        </div>
      </section>
    </>
  );
}
