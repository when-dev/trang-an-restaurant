import Image from "next/image";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import type { MenuItem } from "@/lib/menu";
import { BrandMark } from "../BrandMark";

type DishImage = NonNullable<MenuItem["image"]>;

/**
 * Media area of a dish card — the dish image or an elegant branded placeholder, always in the same
 * box so cards line up. `cover` = top of the card (≥ sm), `thumb` = square thumbnail (phones).
 * The caller passes the display class (`flex`, `hidden sm:flex`, …) via `className`.
 * Both are rendered with CSS visibility switching; lazy loading means only the visible one is fetched.
 */
export function DishMedia({
  image,
  variant,
  categoryLabel,
  locale,
  dict,
  className = "",
}: {
  image: DishImage | null;
  variant: "cover" | "thumb";
  categoryLabel: string;
  locale: Locale;
  dict: Dictionary;
  className?: string;
}) {
  const cover = variant === "cover";
  // Matches the 600×338 (16:9) source photos exactly, so the cover never crops the dish.
  const frame = cover ? "aspect-video w-full" : "size-20 shrink-0 rounded-2xl";

  if (!image) {
    return (
      <div
        aria-hidden
        className={`bg-cream-200 relative flex-col items-center justify-center gap-2 overflow-hidden ${frame} ${className}`}
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 42%, rgb(255 253 248 / 0.9) 0, rgb(255 253 248 / 0) 58%), repeating-linear-gradient(135deg, rgb(155 116 83 / 0.07) 0 1px, transparent 1px 12px)",
        }}
      >
        <BrandMark className={`text-forest/80 ${cover ? "size-12" : "size-8"}`} />
        {cover && (
          <span className="text-wood-ink px-4 text-center text-[0.6875rem] font-bold tracking-[0.16em] uppercase">
            {categoryLabel}
          </span>
        )}
      </div>
    );
  }

  const brochure = image.kind === "menu-brochure";
  const caption =
    image.kind === "ai-illustration"
      ? dict.menu.imageAi
      : image.kind === "menu-brochure"
        ? dict.menu.imageBrochure
        : null;
  return (
    <div className={`${brochure ? "bg-white" : "bg-cream-200"} relative overflow-hidden ${frame} ${className}`}>
      <Image
        src={image.src}
        alt={image.alt[locale]}
        fill
        loading="lazy"
        sizes={cover ? "(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw" : "80px"}
        className={
          brochure
            ? "[mask-image:radial-gradient(ellipse_46%_50%_at_50%_54%,#000_62%,transparent_100%)] object-contain p-2"
            : "object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        }
      />
      {cover && caption && (
        <span className="absolute bottom-2 left-2 rounded-full bg-white/85 px-2 py-0.5 text-[0.625rem] font-semibold text-[#55657A] backdrop-blur">
          {caption}
        </span>
      )}
    </div>
  );
}
