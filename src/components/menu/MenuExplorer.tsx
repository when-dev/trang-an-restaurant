"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { fmt, pluralItems } from "@/i18n";
import { useI18n } from "@/i18n/client";
import {
  CATEGORY_ORDER,
  TAG_FILTERS,
  categoriesWithItems,
  groupEntries,
  type CategoryId,
  type MenuItem,
  type Tag,
} from "@/lib/menu";
import { filterMenu, type MenuFilter } from "@/lib/search";
import { CategoryChips } from "./CategoryChips";
import { MenuCard } from "./MenuCard";

function readUrl(): { q: string; cat: CategoryId | null; tags: Tag[] } {
  const p = new URLSearchParams(window.location.search);
  const cat = p.get("cat");
  return {
    q: p.get("q") ?? "",
    cat: cat && (CATEGORY_ORDER as readonly string[]).includes(cat) ? (cat as CategoryId) : null,
    tags: (p.get("tag")?.split(",") ?? []).filter((t): t is Tag => (TAG_FILTERS as readonly string[]).includes(t)),
  };
}

export function MenuExplorer({ items }: { items: MenuItem[] }) {
  const { locale, dict } = useI18n();
  const [filter, setFilter] = useState<MenuFilter>({ query: "", category: null, tags: [] });
  const { query, category, tags } = filter;
  const deferredQuery = useDeferredValue(query);
  const listRef = useRef<HTMLDivElement>(null);

  // Restore filters from the URL (also after a language switch, which keeps the query string).
  useEffect(() => {
    const s = readUrl();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from window.location
    setFilter({ query: s.q, category: s.cat, tags: s.tags });
  }, []);

  /** Update filters and keep the URL shareable without adding history entries. */
  const update = (patch: Partial<MenuFilter>) => {
    const next = { ...filter, ...patch };
    setFilter(next);
    const p = new URLSearchParams();
    if (next.query.trim()) p.set("q", next.query.trim());
    if (next.category) p.set("cat", next.category);
    if (next.tags.length) p.set("tag", next.tags.join(","));
    const qs = p.toString();
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`,
    );
  };

  const allCategories = useMemo(() => categoriesWithItems(items), [items]);
  const countByCategory = useMemo(() => {
    const m = new Map<CategoryId, number>();
    for (const i of items) m.set(i.category, (m.get(i.category) ?? 0) + 1);
    return m;
  }, [items]);

  const filtered = useMemo(
    () => filterMenu(items, { query: deferredQuery, category, tags }),
    [items, deferredQuery, category, tags],
  );
  const sections = useMemo(() => {
    const entries = groupEntries(filtered);
    return categoriesWithItems(filtered).map((c) => ({ id: c, entries: entries.filter((e) => e.category === c) }));
  }, [filtered]);

  const selectCategory = (c: CategoryId | null) => {
    update({ category: c });
    const top = listRef.current?.getBoundingClientRect().top;
    if (top !== undefined && top < 0) {
      listRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    }
  };

  const toggleTag = (t: Tag) => update({ tags: tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t] });
  const hasFilters = Boolean(query || category || tags.length);
  const chip =
    "inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-sm font-semibold whitespace-nowrap transition-colors";

  return (
    <div>
      {/* Search + ingredient filters */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-10">
        <div>
          <label htmlFor="menu-search" className="text-ink mb-2 block text-sm font-semibold">
            {dict.menu.searchLabel}
          </label>
          <div className="relative">
            <Search
              aria-hidden
              className="text-muted pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2"
            />
            <input
              id="menu-search"
              type="search"
              inputMode="search"
              autoComplete="off"
              value={query}
              onChange={(e) => update({ query: e.target.value })}
              placeholder={dict.menu.searchPlaceholder}
              className="border-line bg-paper text-ink shadow-soft placeholder:text-muted/80 focus:border-forest focus-visible:ring-tomato-ink/40 h-13 w-full rounded-full border pr-12 pl-12 text-base focus:outline-none focus-visible:ring-3 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => update({ query: "" })}
                aria-label={dict.menu.clearSearch}
                className="text-muted hover:bg-cream-200 hover:text-ink absolute top-1/2 right-1.5 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full"
              >
                <X aria-hidden className="size-4" />
              </button>
            )}
          </div>
        </div>
        {/* A labelled group instead of <fieldset>/<legend>: legends ignore normal block layout and
            shifted this column upward. Both columns share one label row, then a 52 px control row. */}
        <div role="group" aria-labelledby="menu-filters-label">
          <p id="menu-filters-label" className="text-ink mb-2 block text-sm font-semibold">
            {dict.menu.filters}
          </p>
          <ul className="flex min-h-13 flex-wrap items-center gap-2">
            {TAG_FILTERS.map((t) => {
              const active = tags.includes(t);
              return (
                <li key={t}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleTag(t)}
                    className={`${chip} !min-h-10 ${
                      active
                        ? "border-tomato-ink bg-tomato-ink text-white"
                        : "border-line bg-paper text-ink hover:border-forest"
                    }`}
                  >
                    {dict.tags[t]}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="text-muted mt-2 text-xs">{dict.menu.filtersHint}</p>
        </div>
      </div>

      <CategoryChips
        categories={allCategories}
        counts={countByCategory}
        total={items.length}
        active={category}
        onSelect={selectCategory}
      />

      <div ref={listRef} className="scroll-mt-36">
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-muted text-sm font-semibold">
            {fmt(dict.menu.results, {
              count: filtered.length,
              items: pluralItems(locale, filtered.length, dict.common.items),
            })}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => update({ query: "", category: null, tags: [] })}
              className="link-underline text-forest inline-flex min-h-11 items-center text-sm font-semibold"
            >
              {dict.menu.clearFilters}
            </button>
          )}
        </div>

        {sections.length === 0 ? (
          <div className="card text-muted mt-6 p-10 text-center">{dict.menu.noResults}</div>
        ) : (
          sections.map((s) => (
            <section key={s.id} aria-labelledby={`cat-${s.id}`} className="mt-10 first:mt-6">
              <div className="mb-5 flex items-baseline gap-4">
                <h2 id={`cat-${s.id}`} className="font-display text-forest text-3xl sm:text-4xl">
                  {dict.categories[s.id]}
                </h2>
                <span aria-hidden className="bg-line h-px flex-1" />
                <span className="text-muted text-sm tabular-nums">
                  {s.entries.reduce((n, e) => n + e.variants.length, 0)}
                </span>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {s.entries.map((entry) => (
                  <li key={entry.key} className="animate-fade">
                    <MenuCard entry={entry} locale={locale} dict={dict} />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
