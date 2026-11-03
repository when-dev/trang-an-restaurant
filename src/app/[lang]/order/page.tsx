import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { getDictionary } from "@/i18n";
import { isLocale } from "@/i18n/config";
import { DeliveryCards } from "@/components/DeliveryCards";
import { OpenStatus } from "@/components/OpenStatus";
import { PageIntro } from "@/components/Section";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/order">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return pageMetadata(lang, "/order", { title: dict.meta.orderTitle, description: dict.meta.orderDescription });
}

export default async function OrderPage({ params }: PageProps<"/[lang]/order">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <PageIntro eyebrow={dict.order.eyebrow} title={dict.order.title} text={dict.order.text} />
      <div className="container-page pb-20 lg:pb-28">
        <DeliveryCards dict={dict} headingLevel={2} />
        <p className="text-muted mt-4 text-sm">{dict.order.feesNote}</p>

        <section
          aria-labelledby="pickup"
          className="bg-forest text-cream mt-14 grid gap-6 rounded-[var(--radius-card)] p-6 sm:p-10 md:grid-cols-[1fr_auto] md:items-center"
        >
          <div>
            <h2 id="pickup" className="font-display text-3xl">
              {dict.order.pickupTitle}
            </h2>
            <p className="text-cream/80 mt-2 max-w-xl">{dict.order.pickupText}</p>
            <OpenStatus tone="light" className="mt-4" />
          </div>
          <a href={siteConfig.phone.uri} className="btn btn-light">
            <Phone aria-hidden className="size-4" />
            {siteConfig.phone.display}
          </a>
        </section>
      </div>
    </>
  );
}
