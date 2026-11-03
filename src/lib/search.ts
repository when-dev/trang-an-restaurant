import type { CategoryId, MenuItem, Tag } from "./menu";

/** Lower-case and strip diacritics (Slovak + Vietnamese, incl. đ). */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Search words that do not appear literally in the menu. "pho" points to the broth soups with
 * flat rice noodles, star anise and cinnamon — the menu itself does not use the word.
 */
const SYNONYMS: Record<string, string[]> = {
  pho: ["siroke rezance"],
};

export function searchableText(item: MenuItem): string {
  return normalize(
    [
      item.name.sk,
      item.name.en,
      item.gloss?.sk,
      item.gloss?.en,
      item.description?.sk,
      item.description?.en,
      item.portionLabel,
      item.brochureNumber != null ? `#${item.brochureNumber}` : null,
    ]
      .filter(Boolean)
      .join(" | "),
  );
}

export interface MenuFilter {
  query: string;
  category: CategoryId | null;
  tags: Tag[];
}

export function matchesQuery(item: MenuItem, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  const hay = searchableText(item);
  if (/^\d+$/.test(q) && item.brochureNumber === Number(q)) return true;
  const words = q.split(" ");
  if (words.every((w) => hay.includes(w))) return true;
  const alt = SYNONYMS[q];
  return Boolean(alt?.some((a) => hay.includes(a)));
}

/** Tags combine with OR (e.g. "tofu or shrimp"), then AND with category and query. */
export function filterMenu(items: MenuItem[], filter: MenuFilter): MenuItem[] {
  return items.filter(
    (item) =>
      (!filter.category || item.category === filter.category) &&
      (filter.tags.length === 0 || filter.tags.some((t) => item.tags.includes(t))) &&
      matchesQuery(item, filter.query),
  );
}
