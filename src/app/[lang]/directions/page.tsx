import { notFound } from "next/navigation";
import { MapPin, Phone, TrainFront } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { getDictionary } from "@/i18n";
import { isLocale } from "@/i18n/config";
import { DesktopRedirect } from "@/components/DesktopRedirect";
import { DirectionsActions } from "@/components/DirectionsActions";
import { HoursList } from "@/components/HoursList";
import { MapCard } from "@/components/MapCard";
import { OpenStatus } from "@/components/OpenStatus";
import { PageIntro } from "@/components/Section";
import { href } from "@/lib/routes";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/directions">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  const meta = pageMetadata(lang, "/directions", {
    title: dict.meta.directionsTitle,
    description: dict.meta.directionsDescription,
  });
  // Mobile-only view of the Contact information — Contact is the canonical page.
  return { ...meta, alternates: { ...meta.alternates, canonical: absoluteUrl(`/${lang}/contact`) } };
}

export default async function DirectionsPage({ params }: PageProps<"/[lang]/directions">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.directions;
  const label = "text-xs font-bold tracking-[0.16em] uppercase text-wood-ink";

  return (
    <>
      {/* Mobile-only page: on desktop the same information lives on Contact. */}
      <DesktopRedirect to={href(lang, "/contact")} />
      <PageIntro eyebrow={t.eyebrow} title={t.title} text={t.lead} />

      <div className="container-page grid gap-10 pb-16 lg:grid-cols-2 lg:gap-12 lg:pb-24">
        {/* Map first on phones (visual orientation), on the right and sticky on desktop. */}
        <div className="order-first lg:order-last">
          <div className="lg:sticky lg:top-28">
            <MapCard variant="full" />
          </div>
        </div>

        <div className="space-y-8">
          <section aria-labelledby="d-address" className="card shadow-soft p-6 sm:p-8">
            <h2 id="d-address" className={label}>
              {dict.contact.addressTitle}
            </h2>
            <address className="mt-3 flex items-start gap-3 not-italic">
              <MapPin aria-hidden className="text-tomato-ink mt-1 size-5 shrink-0" />
              <span>
                <span className="font-display text-forest block text-2xl leading-snug sm:text-3xl">
                  {siteConfig.address.street}
                  <br />
                  {siteConfig.address.postalCode} {siteConfig.address.city}
                </span>
              </span>
            </address>

            <h3 className={`${label} mt-8`}>{t.actionsTitle}</h3>
            <div className="mt-3">
              <DirectionsActions />
            </div>
          </section>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <section aria-labelledby="d-hours" className="border-line border-t pt-6">
              <h2 id="d-hours" className={label}>
                {dict.contact.hoursTitle}
              </h2>
              <HoursList dict={dict} className="text-ink mt-3 max-w-xs" />
              <OpenStatus className="mt-4" />
              <p className="text-muted mt-2 text-sm">{dict.hours.disclaimer}</p>
            </section>
            <section aria-labelledby="d-phone" className="border-line border-t pt-6">
              <h2 id="d-phone" className={label}>
                {dict.contact.phoneTitle}
              </h2>
              <a href={siteConfig.phone.uri} className="text-forest mt-3 inline-flex min-h-11 items-center gap-3">
                <Phone aria-hidden className="text-tomato-ink size-5" />
                <span className="font-display link-underline text-2xl">{siteConfig.phone.display}</span>
              </a>
            </section>
          </div>

          <section aria-labelledby="d-help" className="bg-forest-100 flex gap-4 rounded-[var(--radius-card)] p-6">
            <span className="text-forest inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white">
              <TrainFront aria-hidden className="size-5" />
            </span>
            <div>
              <h2 id="d-help" className="font-display text-forest text-xl">
                {t.helpTitle}
              </h2>
              <p className="text-muted mt-1">{t.helpText}</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
