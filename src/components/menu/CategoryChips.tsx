"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/i18n/client";
import type { CategoryId } from "@/lib/menu";

/**
 * Horizontal, sticky category filter.
 * - Clipped inside its rounded frame; soft edge fades show there is more content.
 * - Arrow buttons page left/right on every screen size (pointer helpers; the chips themselves stay
 *   keyboard-reachable and the browser scrolls a focused chip into view).
 * - Touch swipe works natively; with a mouse the strip can also be dragged.
 * - The active chip is kept in view when the selection changes.
 */
export function CategoryChips({
  categories,
  counts,
  total,
  active,
  onSelect,
}: {
  categories: CategoryId[];
  counts: Map<CategoryId, number>;
  total: number;
  active: CategoryId | null;
  onSelect: (c: CategoryId | null) => void;
}) {
  const { dict } = useI18n();
  const scroller = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const left = el.scrollLeft > 2;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
    setEdges((e) => (e.left === left && e.right === right ? e : { left, right }));
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [measure]);

  // Keep the active chip visible (centred) when the selection changes.
  useEffect(() => {
    const el = scroller.current;
    const chip = el?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!el || !chip) return;
    const offset = chip.getBoundingClientRect().left - el.getBoundingClientRect().left + el.scrollLeft;
    el.scrollTo({ left: offset - el.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  const page = (dir: -1 | 1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  // Mouse drag-to-scroll (touch and pen keep native swiping).
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !scroller.current) return;
    drag.current = { x: e.clientX, left: scroller.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = scroller.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      el.setPointerCapture(e.pointerId);
    }
    if (d.moved) el.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    suppressClick.current = Boolean(drag.current?.moved);
    drag.current = null;
  };

  const chip =
    "inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-sm font-semibold whitespace-nowrap transition-colors select-none";
  const arrow =
    "border-line text-forest absolute top-1/2 z-10 size-9 -translate-y-1/2 cursor-pointer items-center justify-center inline-flex rounded-full border bg-white shadow-[0_4px_14px_-6px_rgb(24_32_27/0.35)] transition-opacity hover:bg-cream-200";

  return (
    <div className="lg:bg-cream sticky top-16 z-20 -mx-4 mt-8 sm:-mx-6 lg:top-20 lg:mx-0 lg:pt-3 lg:pb-2">
      <div className="border-line bg-cream/95 border-y backdrop-blur-md lg:overflow-hidden lg:rounded-full lg:border">
        <nav aria-label={dict.menu.categories} className="relative">
          <ul
            ref={scroller}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={(e) => {
              if (suppressClick.current) {
                e.preventDefault();
                e.stopPropagation();
                suppressClick.current = false;
              }
            }}
            className="flex scrollbar-none gap-2 overflow-x-auto overscroll-x-contain scroll-smooth px-4 py-2.5 sm:px-12"
          >
            {[null, ...categories].map((c) => {
              const isActive = active === c;
              return (
                <li key={c ?? "all"}>
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => onSelect(c)}
                    className={`${chip} ${
                      isActive ? "border-forest bg-forest text-cream" : "text-ink hover:bg-forest/8 border-transparent"
                    }`}
                  >
                    {c ? dict.categories[c] : dict.menu.allCategories}
                    <span className={`text-xs tabular-nums ${isActive ? "text-cream/70" : "text-muted"}`}>
                      {c ? counts.get(c) : total}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Edge fades — only where there is more to scroll. */}
          <span
            aria-hidden
            className={`from-cream pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r to-transparent transition-opacity sm:w-16 ${
              edges.left ? "opacity-100" : "opacity-0"
            }`}
          />
          <span
            aria-hidden
            className={`from-cream pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l to-transparent transition-opacity sm:w-16 ${
              edges.right ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Arrows: pointer helpers, hidden from the tab order (the chips themselves are focusable). */}
          <button
            type="button"
            tabIndex={-1}
            aria-label={dict.menu.scrollLeft}
            onClick={() => page(-1)}
            className={`${arrow} left-1.5 ${edges.left ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-label={dict.menu.scrollRight}
            onClick={() => page(1)}
            className={`${arrow} right-1.5 ${edges.right ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <ChevronRight aria-hidden className="size-5" />
          </button>
        </nav>
      </div>
    </div>
  );
}
