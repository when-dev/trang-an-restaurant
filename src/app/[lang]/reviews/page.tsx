import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getDictionary } from "@/i18n";
import { isLocale } from "@/i18n/config";
import { PageIntro } from "@/components/Section";
import { Reviews } from "@/components/Reviews";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/reviews">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return pageMetadata(lang, "/reviews", { title: dict.meta.reviewsTitle, description: dict.meta.reviewsDescription });
}

export default async function ReviewsPage({ params }: PageProps<"/[lang]/reviews">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <PageIntro eyebrow={dict.reviews.eyebrow} title={dict.reviews.title} text={dict.reviews.lead} />
      <div className="container-page pb-20 lg:pb-28">
        <Suspense fallback={<div className="card h-56 animate-pulse" />}>
          <Reviews locale={lang} dict={dict} />
        </Suspense>
      </div>
    </>
  );
}
