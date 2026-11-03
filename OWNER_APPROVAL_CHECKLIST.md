# Owner approval checklist — before switching to `official`

Go through this with the owner of Trang An. Until every **required** item is ticked, keep `NEXT_PUBLIC_SITE_MODE=demo`.

## Required

- [ ] **Consent to use the name** “Trang An — Vietnamská reštaurácia” and to publish the site as the restaurant’s own.
- [ ] **Logo** — is there an official logo? Rights to use it (file in SVG/PNG).
- [ ] **Photos** — 115 dish photos are taken from the restaurant’s Wolt listing. Get **written permission** to use them on this website (and check Wolt’s terms), or provide own photos. `MENU_IMAGE_AUDIT.md` lists the 29 dishes still without a photo and the 9 that only need a quick answer (which protein a shared Wolt photo shows). Rights for any interior photos.
- [ ] **Prices and portions** — confirm every row of `data/menu.json`, especially the items listed in `data/PRICE_AUDIT.md` §3 (Teriyaki kura, Syr s hranolkami, Losos/Tuniak, sushi sets, futomaki/tamago 10 ks, poke bowls).
- [ ] **How often prices change** and who reports changes (phone, e-mail, message).
- [ ] **Allergens** (EU 1–14) per dish — or approval to keep “Informácie o alergénoch vám poskytne personál”.
- [ ] **Ingredients** — the descriptions come from the Wolt listing; confirm they are correct for in-store dishes too.
- [ ] **Opening hours** — Po–Pi 09:00–19:30, So–Ne 10:00–17:00; holiday closures; lunch menu (denné menu) if any.
- [ ] **Contact** — phone +421 948 107 313 for the public? E-mail address to publish? Reservations by phone yes/no?
- [ ] **Delivery links** — confirm Wolt, Bistro.sk and especially the **Bolt Food** page (`food.bolt.eu/en-US/326/p/136664`). Which platforms should be shown?
- [ ] **Delivery prices** — OK to show Wolt prices (snapshot 3. 11. 2026) next to in-store prices?
- [ ] **Google reviews** — show only the link + rating snapshot, or set up the Places API (Google Cloud account, billing, key restricted to Places API (New))?
- [ ] **Legal details** for the footer / privacy page: company name, IČO, DIČ/IČ DPH, registered address (Obchodný register / Živnostenský register).
- [ ] **Privacy** — the site sets no tracking cookies; if analytics or a reservation form are wanted, a privacy policy and cookie consent are needed first.
- [ ] **Domain and hosting** — which domain (e.g. trang-an.sk), who owns it (should be the owner), Vercel account owner, who pays.

## Nice to have

- [ ] Social profiles (Facebook / Instagram) — add to `social` in `src/config/site.config.ts`.
- [ ] Short text about the restaurant in the owner’s words (no invented history is used now).
- [ ] Payment options on site (cash / card), seating, accessibility, parking.
- [ ] Who maintains the site after launch (service agreement).

## After approval

1. Update `data/menu.json` (`verification.inStore: "owner-confirmed"`), `site.config.ts`, photos.
2. Set `NEXT_PUBLIC_SITE_MODE=official`, real `NEXT_PUBLIC_SITE_URL`, redeploy (see `DEPLOYMENT.md`).
3. Owner adds the website URL to the Google Business Profile and the delivery platforms.
