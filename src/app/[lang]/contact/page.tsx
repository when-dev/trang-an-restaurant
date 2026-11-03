import { notFound } from "next/navigation";
import { MapPin, Phone } from "lucide-react";
import { fullAddress, siteConfig } from "@/config/site.config";
import { getDictionary } from "@/i18n";
import { isLocale } from "@/i18n/config";
import { DeliveryCards } from "@/components/DeliveryCards";
import { DirectionsActions } from "@/components/DirectionsActions";
import { HoursList } from "@/components/HoursList";
import { MapCard } from "@/components/MapCard";
import { OpenStatus } from "@/components/OpenStatus";
import { PageIntro } from "@/components/Section";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return pageMetadata(lang, "/contact", { title: dict.meta.contactTitle, description: dict.meta.contactDescription });
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const block = "border-t border-line pt-6";
  const label = "text-xs font-bold tracking-[0.16em] uppercase text-wood-ink";

  return (
    <>
      <PageIntro eyebrow={dict.contact.eyebrow} title={dict.contact.title} text={dict.contact.lead} />
      <div className="container-page grid gap-12 pb-20 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-8">
          <section aria-labelledby="c-address" className={block}>
            <h2 id="c-address" className={label}>
              {dict.contact.addressTitle}
            </h2>
            <address className="mt-3 flex items-start gap-3 not-italic">
              <MapPin aria-hidden className="text-tomato-ink mt-1 size-5 shrink-0" />
              <span className="font-display text-forest text-2xl leading-snug">
                {siteConfig.address.street}
                <br />
                {siteConfig.address.postalCode} {siteConfig.address.city}
              </span>
            </address>
            <div className="mt-5">
              <DirectionsActions showCall={false} />
            </div>
          </section>

          <section aria-labelledby="c-phone" className={block}>
            <h2 id="c-phone" className={label}>
              {dict.contact.phoneTitle}
            </h2>
            <a href={siteConfig.phone.uri} className="text-forest mt-3 inline-flex min-h-11 items-center gap-3">
              <Phone aria-hidden className="text-tomato-ink size-5" />
              <span className="font-display link-underline text-2xl">{siteConfig.phone.display}</span>
            </a>
            <p className="text-muted mt-2 text-sm">{dict.contact.noEmail}</p>
          </section>

          <section aria-labelledby="c-hours" className={block}>
            <h2 id="c-hours" className={label}>
              {dict.contact.hoursTitle}
            </h2>
            <HoursList dict={dict} className="text-ink mt-3 max-w-sm text-lg" />
            <OpenStatus className="mt-4" />
            <p className="text-muted mt-2 text-sm">{dict.hours.disclaimer}</p>
          </section>
        </div>

        <section aria-labelledby="c-map" className="lg:pt-6">
          <h2 id="c-map" className="sr-only">
            {dict.contact.mapTitle} — {fullAddress}
          </h2>
          <MapCard variant="full" />
        </section>
      </div>

      <section aria-labelledby="c-delivery" className="bg-cream-200">
        <div className="container-page py-16 lg:py-20">
          <h2 id="c-delivery" className="font-display text-forest text-3xl sm:text-4xl">
            {dict.contact.deliveryTitle}
          </h2>
          <div className="mt-8">
            <DeliveryCards dict={dict} />
          </div>
        </div>
      </section>
    </>
  );
}
