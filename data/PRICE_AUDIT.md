# Price & data audit — Trang An menu

Audit date: **2026-11-03** · Source of truth: [`data/menu.json`](./menu.json) (144 SKUs)

## 1. Sources

| Source                                                                                                                                             | What it provided                                                              | Status                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `data/menu.seed.json` — manual transcription of the paper menu (photos `09-inhouse-menu-aug2026-part-a.png`, `10-inhouse-menu-aug2026-part-b.png`) | Dish names, portions, **in-store prices**                                     | Used as-is. **The photos themselves were not in the repository** (`reference/` was empty), so no line could be re-read from the image in this pass — see §3. |
| Project brief, table §7                                                                                                                            | 9 reference pairs (photo Aug 2026 / Wolt)                                     | All 9 match `menu.json` (enforced by the generator and by `tests/unit/menu.test.ts`).                                                                        |
| Public Wolt restaurant page, read 2026-11-03 → `data/wolt-snapshot-2026-11-03.json` (136 entries)                                                  | **Wolt prices** and the **ingredient lists** the restaurant publishes on Wolt | Attached only where dish and portion match (rules below).                                                                                                    |
| Bolt Food, Bistro.sk                                                                                                                               | —                                                                             | No prices collected. `boltEur` / `bistroEur` = `null` for all items; UI shows “Overiť cenu na Bolt Food” / “Pozrieť cenu na Bistro.sk”.                      |

Conversion script: [`scripts/build-menu-from-seed.mjs`](../scripts/build-menu-from-seed.mjs) (one-time; `menu.json` is now edited by hand).

## 2. Matching rules applied

1. In-store price = seed value only. Nothing was derived, rounded or computed from Wolt.
2. A Wolt price is attached only if the Wolt item is the same dish **and** the portion is identical (`portionMatch: "exact"`, 64 items) or Wolt does not state a portion at all (`"not-stated"`, 58 items — mostly stir-fries and noodles, where Wolt omits the gram weight).
3. A different stated portion ⇒ **no Wolt price** (`woltDifferentPortion: true`), and the card says “Na Wolt v inom balení — cena nie je porovnateľná”.
4. No percentage mark-ups, no fixed delivery surcharge, no zeros. Missing = `null`.

Result: **122 of 144** SKUs have a Wolt price; **22** have none.

## 3. Items needing review (`needsReview: true` or noteworthy)

| ID                                                                     | Dish                                     | Issue                                                                                                                           | Action needed                                                                             |
| ---------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| menu-055                                                               | Teriyaki kura                            | Seed **250 g**, Wolt **200 g** (7,00 €). Seed had a Wolt price of 7,00 € — removed.                                             | Re-read the portion on the Aug 2026 photo; if 200 g, set `portionLabel` and `woltEur: 7`. |
| menu-058                                                               | Syr s hranolkami                         | Seed **350 g**, Wolt **250 g** (6,80 €). Seed Wolt price removed.                                                               | Same as above.                                                                            |
| menu-073                                                               | Losos 150 g (7,00 €)                     | Wolt has “Tempura losos 150 g” (7,50 €). Possibly the same dish, possibly not.                                                  | Confirm name with owner.                                                                  |
| menu-074                                                               | Tuniak 150 g                             | Not on Wolt at all.                                                                                                             | Confirm the dish is still offered.                                                        |
| sushi-set-1 … 6                                                        | Sushi sety                               | Paper-menu seed has no composition/piece count; descriptions are the Wolt ingredient lists. Sets on Wolt may differ in content. | Confirm composition and piece count with owner.                                           |
| sushi-*-maki-6/12 (10 SKUs)                                            | Sake / Avokádo / Kappa / Kani / Ebi maki | In store 6/12 ks, Wolt 8/16 ks → different SKUs.                                                                                | None — intentionally no Wolt price.                                                       |
| sushi-sake-uramaki, sushi-tobiko-uramaki, sushi-california-futomaki-10 |                                          | Not on Wolt (in these sizes).                                                                                                   | None.                                                                                     |
| sushi-sake-futomaki-10, sushi-tamago-tempura-10                        | Sake futomaki / Tamago tempura 10 ks     | In-store 9,80 € = Wolt 9,80 €, although every other dish is 0,40–2,00 € cheaper in store. Possibly a transcription error.       | Re-read the photo. Flagged `needsReview`.                                                 |
| poke-* (3)                                                             | Poke bowly                               | Not on Wolt. No description.                                                                                                    | Owner to confirm ingredients.                                                             |
| menu-024 … 028                                                         | Miến … Nam Bộ                            | Seed had no Wolt price; Wolt has 9,00 € (beef/shrimp/duck) and 8,50 € (chicken/tofu), same 450 g → now filled.                  | None.                                                                                     |

Plausibility checks: the Wolt price is higher than in store by +0,40 € … +2,00 € for every matched dish except the two 10-piece rolls flagged above (difference 0,00 €; Ebi tempura 10 ks is +0,20 €); variants of the same sushi scale consistently (5 → 10 ks ≈ ×2 minus 0,10–0,20 €); no duplicate IDs; 16 categories.

Things that look unusual but were **not changed** (cannot verify without the photo):

- `sushi-sake-futomaki-10` 9,80 € vs `sushi-sake-uramaki-10` 9,90 € — plausible.
- `menu-035` Pikantné kuracie mäso 5,00 € while other chicken dishes are 4,80 € — Wolt also prices it higher (7,00 € vs 6,50 €), so consistent.

## 4. Wolt prices found differing from the seed

None. Every Wolt price already present in the seed equalled the 2026-11-03 Wolt snapshot.

## 5. Links checked (2026-11-03, `curl` with a browser User-Agent)

| Link                                                 | Result                                                                                            | Config                                                                                                                                                |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wolt `…/restaurant/trang-an-vietnamska-restauracia`  | 200, page contains the Trang An menu                                                              | `verified: true`                                                                                                                                      |
| Bistro.sk `…/restauracia/trangan`                    | 403 to automated requests (bot protection); listed as confirmed in the brief                      | `verified: true` — **open it manually in a browser before launch**                                                                                    |
| Bolt Food `…/en-US/326/p/136664`                     | 200 → redirects to `/en/326/p/136664/`, client-rendered page; could not confirm it shows Trang An | `verified: false` — UI sends visitors to the Bolt Food Bratislava listing with an “Overiť dostupnosť” badge and offers the direct link as “neoverený” |
| Google Maps (place ID `ChIJRZvoEgCJbEcR9xCAIWttWCM`) | Standard Maps URL scheme                                                                          | —                                                                                                                                                     |

## 6. Delivery price status

| Platform  | Filled | Missing |
| --------- | -----: | ------: |
| Wolt      |    122 |      22 |
| Bolt Food |      0 |     144 |
| Bistro.sk |      0 |     144 |

## 7. How to re-verify

1. Put the two Aug 2026 menu photos into `reference/`.
2. For each row of `menu.json`, compare `name.sk`, `portionLabel`, `price.inStoreEur`; on a confirmed row set `verification.inStore` to `"photo-verified"` (or `"owner-confirmed"` after the owner signs off).
3. Run `npm test` — the integrity tests fail on zero prices, duplicate IDs, a Wolt price on maki, etc.
