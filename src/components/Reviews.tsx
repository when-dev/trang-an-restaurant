import { ArrowUpRight, PenLine, Star } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { fmt, type Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { formatDate, formatRating } from "@/lib/format";
import { getPlaceData, type PlaceReview } from "@/lib/google-places";
import { ExternalLink } from "./ExternalLink";

function Stars({ value }: { value: number }) {
  return (
    <span aria-hidden className="text-tomato inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className="size-4" fill={value >= i - 0.25 ? "currentColor" : "none"} strokeWidth={1.75} />
      ))}
    </span>
  );
}

function GoogleButtons({ dict }: { dict: Dictionary }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <ExternalLink
        href={siteConfig.google.reviewsUrl}
        newTabLabel={dict.a11y.opensInNewTab}
        className="btn btn-forest"
      >
        {dict.reviews.readOnGoogle}
        <ArrowUpRight aria-hidden className="size-4" />
      </ExternalLink>
      <ExternalLink
        href={siteConfig.google.writeReviewUrl}
        newTabLabel={dict.a11y.opensInNewTab}
        className="btn btn-ghost"
      >
        <PenLine aria-hidden className="size-4" />
        {dict.reviews.writeReview}
      </ExternalLink>
    </div>
  );
}

function ReviewCard({ review, dict }: { review: PlaceReview; dict: Dictionary }) {
  const author = review.authorAttribution;
  const text = review.text?.text ?? review.originalText?.text ?? "";
  const translated =
    review.text?.languageCode &&
    review.originalText?.languageCode &&
    review.text.languageCode !== review.originalText.languageCode;
  return (
    <li className="card flex flex-col p-6">
      <div className="flex items-center gap-3">
        {author?.photoUri && (
          // Google-hosted author photo, shown as required by the attribution policy.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={author.photoUri}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            className="size-10 rounded-full"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="min-w-0">
          {author?.uri ? (
            <ExternalLink
              href={author.uri}
              newTabLabel={dict.a11y.opensInNewTab}
              className="link-underline text-ink font-semibold"
            >
              {author.displayName}
            </ExternalLink>
          ) : (
            <span className="text-ink font-semibold">{author?.displayName}</span>
          )}
          <p className="text-muted text-xs">{review.relativePublishTimeDescription}</p>
        </div>
      </div>
      {review.rating != null && (
        <div className="mt-3 flex items-center gap-2">
          <Stars value={review.rating} />
          <span className="sr-only">
            {review.rating} {dict.reviews.outOf}
          </span>
        </div>
      )}
      <p className="text-ink/85 mt-3 line-clamp-6 text-[0.9375rem] leading-relaxed">{text}</p>
      <p className="text-muted mt-auto pt-4 text-xs">
        {translated ? `${dict.reviews.translatedByGoogle} · ` : ""}
        {dict.reviews.fromGoogle}
      </p>
    </li>
  );
}

/** Honest reviews block: live Places API data when configured, otherwise a dated snapshot + links. */
export async function Reviews({ locale, dict, limit = 5 }: { locale: Locale; dict: Dictionary; limit?: number }) {
  const data = await getPlaceData(locale);
  const snapshot = siteConfig.google.ratingSnapshot;

  if (data.status === "ok") {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          {data.rating != null && (
            <div>
              <p className="text-muted text-sm font-semibold">{dict.reviews.liveRating}</p>
              <p className="mt-1 flex items-baseline gap-3">
                <span className="font-display text-forest text-6xl">{formatRating(data.rating, locale)}</span>
                <span className="text-muted">{dict.reviews.outOf}</span>
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Stars value={data.rating} />
                {data.userRatingCount != null && (
                  <span className="text-muted text-sm">
                    {fmt(dict.reviews.reviewCount, { count: data.userRatingCount.toLocaleString(locale) })}
                  </span>
                )}
              </div>
            </div>
          )}
          <GoogleButtons dict={dict} />
        </div>
        {data.reviews.length > 0 && (
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.reviews.slice(0, limit).map((r, i) => (
              <ReviewCard key={`${r.publishTime ?? i}`} review={r} dict={dict} />
            ))}
          </ul>
        )}
        <p className="text-muted text-sm">
          {dict.reviews.liveNote} <span className="text-ink font-semibold">{dict.reviews.attribution}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="card grid gap-8 p-6 sm:p-10 md:grid-cols-[auto_1fr] md:items-center">
      {snapshot.show ? (
        <div className="md:border-line md:border-r md:pr-10">
          <p className="text-muted text-sm font-semibold">{dict.reviews.snapshotLabel}</p>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="text-muted text-2xl" aria-hidden>
              ≈
            </span>
            <span className="font-display text-forest text-6xl">{formatRating(snapshot.value, locale)}</span>
            <span className="text-muted">{dict.reviews.outOf}</span>
          </p>
          <Stars value={snapshot.value} />
        </div>
      ) : null}
      <div className="space-y-5">
        {data.status === "error" && <p className="text-tomato-ink font-semibold">{dict.reviews.apiUnavailable}</p>}
        {snapshot.show && (
          <p className="text-muted text-sm">
            {fmt(dict.reviews.snapshotNote, { date: formatDate(snapshot.checkedAt, locale) })}
          </p>
        )}
        <GoogleButtons dict={dict} />
        <p className="text-muted text-xs font-semibold">Google Maps · {dict.reviews.attribution}</p>
      </div>
    </div>
  );
}
