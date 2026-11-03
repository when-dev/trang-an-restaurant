import { z } from "zod";
import raw from "../../data/menu.json";
import type { Locale } from "@/i18n/config";

export const CATEGORY_ORDER = [
  "soups-vietnamese",
  "vietnamese-specialties",
  "soups-small",
  "spring-rolls",
  "chicken",
  "beef",
  "pork",
  "tofu",
  "seafood",
  "fried",
  "noodles",
  "rice",
  "sides",
  "sushi",
  "sushi-sets",
  "poke-bowls",
] as const;
export type CategoryId = (typeof CATEGORY_ORDER)[number];

export const TAG_FILTERS = ["tofu", "chicken", "beef", "pork", "duck", "shrimp", "fish"] as const;
export const TAGS = [...TAG_FILTERS, "soup", "sushi", "noodles"] as const;
export type Tag = (typeof TAGS)[number];

const localized = z.object({ sk: z.string().min(1), en: z.string().min(1) });
/** Missing price = null. A price of 0 is never valid. */
const price = z.number().positive().multipleOf(0.01).nullable();

export const menuItemSchema = z.object({
  id: z.string().min(1),
  brochureNumber: z.number().int().positive().nullable(),
  category: z.enum(CATEGORY_ORDER),
  /** Variants of one dish (e.g. sushi 5/10 pcs) share a group; each keeps its own price. */
  group: z.string().nullable(),
  name: localized,
  gloss: localized.nullable(),
  description: localized.nullable(),
  portionLabel: z.string().nullable(),
  price: z.object({
    inStoreEur: z.number().positive().multipleOf(0.01),
    woltEur: price,
    boltEur: price,
    bistroEur: price,
  }),
  verification: z.object({
    inStore: z.enum(["seed-transcription", "brief-crosschecked", "photo-verified", "owner-confirmed"]),
    wolt: z
      .object({
        checkedAt: z.string(),
        itemName: z.string(),
        portionMatch: z.enum(["exact", "not-stated"]),
      })
      .nullable(),
    descriptionSource: z.string().nullable(),
    /** Wolt sells this dish in another portion/pack size — its price must not be shown here. */
    woltDifferentPortion: z.boolean(),
    needsReview: z.boolean(),
    notes: z.array(z.string()),
  }),
  /**
   * Image under /public (e.g. "/menu/menu-007-hovadzia-polievka.webp"), or null → branded placeholder.
   * `kind` drives the visible caption: AI illustrations are never presented as photos of the dish.
   * Applied by scripts/integrate-wolt-images.mjs (mapping: data/menu-image-mapping.json). `wolt-listing` =
   * photo from the restaurant's Wolt listing — real dish photos, but publication rights still to be confirmed.
   */
  image: z
    .object({
      src: z.string().regex(/^\/[\w\-/.]+\.(webp|avif|jpe?g|png)$/),
      alt: localized,
      kind: z.enum(["wolt-listing", "owner-photo", "ai-illustration", "menu-brochure"]),
      needsOwnerApproval: z.boolean(),
    })
    .nullable(),
  /** Only from a reliable source (owner). null = unknown — never guess. */
  allergens: z.array(z.number().int().min(1).max(14)).nullable(),
  tags: z.array(z.enum(TAGS)),
});

export const menuSchema = z.object({
  lastResearchDate: z.string(),
  currency: z.literal("EUR"),
  items: z.array(menuItemSchema),
});

export type MenuItem = z.infer<typeof menuItemSchema>;

export const menu = menuSchema.parse(raw);
export const menuItems: MenuItem[] = menu.items;

export interface MenuEntry {
  /** Stable key: group id or item id. */
  key: string;
  category: CategoryId;
  variants: MenuItem[];
}

/** Group sushi variants into one entry, keep every other item separate, preserve menu order. */
export function groupEntries(items: MenuItem[]): MenuEntry[] {
  const entries: MenuEntry[] = [];
  const byGroup = new Map<string, MenuEntry>();
  for (const item of items) {
    if (item.group) {
      const existing = byGroup.get(item.group);
      if (existing) {
        existing.variants.push(item);
        continue;
      }
      const entry = { key: item.group, category: item.category, variants: [item] };
      byGroup.set(item.group, entry);
      entries.push(entry);
    } else {
      entries.push({ key: item.id, category: item.category, variants: [item] });
    }
  }
  return entries;
}

export function categoriesWithItems(items: MenuItem[] = menuItems): CategoryId[] {
  const present = new Set(items.map((i) => i.category));
  return CATEGORY_ORDER.filter((c) => present.has(c));
}

export function itemsById(ids: readonly string[]): MenuItem[] {
  return ids.map((id) => {
    const item = menuItems.find((i) => i.id === id);
    if (!item) throw new Error(`Menu item ${id} not found`);
    return item;
  });
}

export function itemName(item: MenuItem, locale: Locale) {
  return item.name[locale];
}
