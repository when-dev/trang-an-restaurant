# Trang An — website (proposal)

Bilingual (SK / EN) website for **Trang An — Vietnamská reštaurácia**, Železničiarska 3191/18, Bratislava.
Built as a **proposal** for the restaurant owners. `NEXT_PUBLIC_SITE_MODE` controls how it presents itself:

| Mode             | Use                                                                           | Visible notice                                                                       | Footer                                                    | Search engines |
| ---------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------- | -------------- |
| `demo` (default) | any public preview before approval                                            | one slim line “Neoficiálny návrh webu — nie je prevádzkovaný reštauráciou Trang An.” | “© 2026 · Návrh webovej stránky pre reštauráciu Trang An” | noindex        |
| `presentation`   | local client presentation — set in `.env.local` (git-ignored, never deployed) | none                                                                                 | same as demo                                              | noindex        |
| `official`       | only after the owner approved                                                 | none                                                                                 | “© 2026 Trang An. Všetky práva vyhradené.”                | indexable      |

Because `demo` is the default, a deployment without the variable can never look like the restaurant’s own site.

**Stack:** Next.js 16 (App Router, Cache Components, Proxy), React 19, TypeScript strict, Tailwind CSS v4,
Zod, lucide-react, Vitest, Playwright. No CMS, no database, no cookies besides the language preference.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000  →  redirects to /sk
```

| Command                       | What it does                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                 | Development server                                                                                                        |
| `npm run build` / `npm start` | Production build / serve it                                                                                               |
| `npm run lint`                | ESLint (Next core-web-vitals + TypeScript rules)                                                                          |
| `npm run typecheck`           | Generates route types, then `tsc --noEmit`                                                                                |
| `npm test`                    | Unit tests (prices, filters, opening hours, menu integrity)                                                               |
| `npm run test:e2e`            | Playwright (desktop + Pixel 7) against `next start`; run `npm run build` first and `npx playwright install chromium` once |
| `npm run format`              | Prettier                                                                                                                  |

Copy `.env.example` to `.env.local` and adjust (all variables are optional locally).

## Pages

| Route                                   | Content                                                                                                                                                                                                                                                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/sk`, `/en`                            | Hero, benefits, popular dishes (Wolt “Najviac objednávané”), categories, delivery platforms, about, Google reviews, contact + map                                                                                                                                                                      |
| `/[lang]/menu`                          | Full menu — all 144 SKUs, search (diacritics-insensitive), category chips (sticky), ingredient filters, delivery prices per dish; filters live in the URL (`?q=…&cat=…&tag=…`) and survive a language switch                                                                                           |
| `/[lang]/order`                         | Wolt / Bolt Food / Bistro.sk cards (no in-site checkout)                                                                                                                                                                                                                                               |
| `/[lang]/directions`                    | **Mobile only** (< 1024 px, bottom nav “Trasa”): address, hours, phone, explicit Google Maps / Apple Maps / call / copy actions and the animated route map. On desktop it redirects to `/contact`, which holds the same map and actions; its canonical points to Contact and it is not in the sitemap. |
| `/[lang]/about`, `/reviews`, `/contact` | About, Google reviews, contact & opening hours                                                                                                                                                                                                                                                         |
| any unknown path                        | Localized 404                                                                                                                                                                                                                                                                                          |

`/` and every path without a locale redirect to `/sk` (or to `/en` if the visitor chose EN before — cookie `NEXT_LOCALE`). No geo/IP detection.

## Where to change things

| What                                                                                                                                | File                                                                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Address, phone, opening hours, map coordinates, Google Place ID, delivery links, `verified` flags, featured dishes, rating snapshot | [`src/config/site.config.ts`](src/config/site.config.ts)                                                                                                                  |
| Menu: names, portions, prices, descriptions, images, allergens                                                                      | [`data/menu.json`](data/menu.json) (validated by Zod at build time — a typo fails the build instead of shipping)                                                          |
| All interface texts and SEO titles                                                                                                  | [`src/i18n/dictionaries/sk.ts`](src/i18n/dictionaries/sk.ts) and [`en.ts`](src/i18n/dictionaries/en.ts) (EN is type-checked against SK, a missing key is a compile error) |
| Price disclaimer under the menu                                                                                                     | `menu.priceNotice` in both dictionaries                                                                                                                                   |
| Colours, fonts, radii                                                                                                               | [`src/app/globals.css`](src/app/globals.css) (`@theme`)                                                                                                                   |

### Editing the menu

Each item in `data/menu.json`:

```jsonc
{
  "id": "menu-019",                 // stable, never reuse
  "brochureNumber": 19,             // number on the paper menu, or null
  "category": "vietnamese-specialties",
  "group": null,                    // same value = variants shown in one card (sushi 5/10 ks)
  "name": { "sk": "Bún bò Nam Bộ (hovädzie)", "en": "Bún bò Nam Bộ (beef)" },
  "gloss": { "sk": "…", "en": "…" },          // short explanation of a Vietnamese/Japanese name, or null
  "description": { "sk": "…", "en": "…" },    // only confirmed ingredients, or null
  "portionLabel": "450 g",
  "price": { "inStoreEur": 7, "woltEur": 8.5, "boltEur": null, "bistroEur": null },
  "verification": { "inStore": "seed-transcription", "wolt": { … }, "woltDifferentPortion": false, "needsReview": false, "notes": [] },
  "image": null,                    // { "src": "/images/menu/bun-bo.jpg", "alt": { "sk": "…", "en": "…" } }
  "allergens": null,                // e.g. [1, 3, 6] — only from the owner
  "tags": ["beef", "noodles"]       // drives the ingredient filters
}
```

Rules: prices are numbers in EUR; **unknown = `null`, never `0`**; a delivery price belongs only to the _same_ dish in
the _same_ portion. After editing run `npm test`. See [`data/PRICE_AUDIT.md`](data/PRICE_AUDIT.md).

### Images

Dish photos come from the restaurant’s **Wolt listing** — **115 of 144** menu items have a confirmed photo, see
[`MENU_IMAGE_AUDIT.md`](MENU_IMAGE_AUDIT.md) (every placeholder has a stated reason). **Publication rights are not yet
confirmed**; get written permission before public launch.

Pipeline:

1. Put photos (any of PNG/JPG/AVIF/WebP, any filename) into `public/menu/` or `assets/menu-originals-wolt/`.
2. `node scripts/wolt-photo-evidence.mjs` — reads the Wolt listing and records which Wolt dish each photo shows
   (pixel comparison) → `data/wolt-photo-evidence.json`.
3. `node scripts/integrate-wolt-images.mjs --write` — matches photos to menu items (Wolt evidence + filename matcher in
   `scripts/lib/dish-matching.mjs`: diacritics, synonyms, word order, protein/noodle/soup guards), converts to
   `public/menu/wolt/<menu-id>-<dish-slug>.webp`, updates only `image` fields in `data/menu.json`, writes
   `data/menu-image-mapping.json` and `MENU_IMAGE_AUDIT.md`.
4. `npm run images:check` — every reference exists and decodes, WebP 16:9, no photo shared across different
   proteins or without a record, no orphan files.

Manual decisions (photo content contradicting Wolt’s label, protein visible in a shared photo) live in
`VISUAL_OVERRIDES` / `VISUAL_PROTEIN` at the top of the integration script. Items without a confirmed photo show a
branded placeholder, never an unrelated photo. Cards use `next/image` (AVIF/WebP, lazy, responsive `sizes`): a 16:9
cover from 640 px up, an 80 px thumbnail on phones; only `/menu/**` may be optimised (`images.localPatterns`).
The reference menu photos in `reference/` are never published.

## Google reviews

- **Without a key (default):** a dated, attributed rating snapshot (`google.ratingSnapshot` in the config, can be
  hidden with `show: false`) and buttons “Prečítať recenzie na Google” / “Napísať recenziu na Google”. No review text,
  author or avatar is invented or copied.
- **With `GOOGLE_PLACES_API_KEY`:** [`src/lib/google-places.ts`](src/lib/google-places.ts) calls _Place Details (New)_
  server-side, cached for an hour (`"use cache"` + `cacheLife("hours")`), and shows the live rating, count and the up to
  5 reviews Google returns — with author attribution, “Translated by Google” where applicable and a link to all reviews.
  On errors it falls back to the snapshot state.
  1. Google Cloud console → enable **Places API (New)** → create an API key → restrict it to that API.
  2. Set `GOOGLE_PLACES_API_KEY` in Vercel → _Settings → Environment Variables_ → redeploy.
  3. Check the [Places API policies](https://developers.google.com/maps/documentation/places/web-service/policies)
     (attribution, no long-term storage of review content).

## Switching from demo to official

Only after the owner signed off ([`OWNER_APPROVAL_CHECKLIST.md`](OWNER_APPROVAL_CHECKLIST.md)):

1. Set `NEXT_PUBLIC_SITE_MODE=official` and `NEXT_PUBLIC_SITE_URL=https://<final-domain>`.
2. Set `verified: true` for Bolt Food once its link is confirmed in a browser.
3. Replace AI illustrations with licensed photos (see _Images_), add confirmed social profiles to `social`.
4. Redeploy. The unofficial notice disappears, the footer shows “© 2026 Trang An. Všetky práva vyhradené.”,
   `robots.txt` allows indexing and the sitemap is announced.

## Privacy

No analytics, no tracking cookies, no third-party requests on page load except Google Fonts files, which `next/font`
self-hosts at build time. The map is an own SVG illustration (no tiles, no embed); Google Maps and Apple Maps are only links. The single
cookie `NEXT_LOCALE` stores the language choice (strictly functional). If analytics are added later, add a consent
banner first.

## Project structure

```
data/                 menu.json (source of truth), seed, Wolt snapshot, PRICE_AUDIT.md
scripts/              one-time seed → menu.json migration
src/app/[lang]/       pages, layout, 404, error boundary, OG image
src/app/              sitemap, robots, manifest, icons
src/components/       UI (layout/, menu/, cards, map, reviews, JSON-LD)
src/config/           site.config.ts
src/i18n/             locales, dictionaries, client provider
src/lib/              menu (Zod), search, format, hours, Google Places, SEO
src/proxy.ts          locale redirect
tests/unit, tests/e2e Vitest, Playwright
```

Deployment: see [`DEPLOYMENT.md`](DEPLOYMENT.md).
