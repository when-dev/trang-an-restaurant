import "server-only";
import { cacheLife } from "next/cache";
import { z } from "zod";
import { siteConfig } from "@/config/site.config";
import type { Locale } from "@/i18n/config";

/**
 * Google Places API (New) — Place Details, server-side only.
 * Enabled when GOOGLE_PLACES_API_KEY is set. Google returns at most 5 reviews ("most relevant"),
 * so the UI always links to Google Maps for the full list. Attribution is rendered by the caller.
 * Terms: https://developers.google.com/maps/documentation/places/web-service/policies
 */

const reviewSchema = z.object({
  rating: z.number().optional(),
  relativePublishTimeDescription: z.string().optional(),
  publishTime: z.string().optional(),
  text: z.object({ text: z.string(), languageCode: z.string().optional() }).optional(),
  originalText: z.object({ text: z.string(), languageCode: z.string().optional() }).optional(),
  authorAttribution: z
    .object({
      displayName: z.string().optional(),
      uri: z.string().optional(),
      photoUri: z.string().optional(),
    })
    .optional(),
  googleMapsUri: z.string().optional(),
});

const placeSchema = z.object({
  rating: z.number().optional(),
  userRatingCount: z.number().optional(),
  googleMapsUri: z.string().optional(),
  reviews: z.array(reviewSchema).optional(),
});

export type PlaceReview = z.infer<typeof reviewSchema>;

export type PlaceData =
  | { status: "disabled" }
  | { status: "error" }
  | {
      status: "ok";
      rating: number | null;
      userRatingCount: number | null;
      googleMapsUri: string;
      reviews: PlaceReview[];
      fetchedAt: string;
    };

export async function getPlaceData(locale: Locale): Promise<PlaceData> {
  "use cache";
  cacheLife("hours");

  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return { status: "disabled" };

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${siteConfig.google.placeId}?languageCode=${locale}`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
        },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) {
      console.error(`[google-places] HTTP ${res.status}`);
      return { status: "error" };
    }
    const data = placeSchema.parse(await res.json());
    return {
      status: "ok",
      rating: data.rating ?? null,
      userRatingCount: data.userRatingCount ?? null,
      googleMapsUri: data.googleMapsUri ?? siteConfig.google.mapsUrl,
      reviews: (data.reviews ?? []).filter((r) => r.text?.text || r.originalText?.text),
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error("[google-places] request failed", err);
    return { status: "error" };
  }
}
