# Deployment (Vercel)

The site is a standard Next.js 16 app — Vercel needs no extra configuration. All pages are prerendered at build time;
only the OG images and (with a Google key) the reviews refresh run on the server.

## 1. GitHub repository

```bash
git init            # if not done yet
git add -A
git commit -m "Trang An website demo"
gh repo create trang-an-web --private --source . --push   # or create the repo on github.com and push
```

Keep the repo **private** while the project is a demo (the `reference/` folder may contain menu photos you do not own).

## 2. Import into Vercel

1. <https://vercel.com/new> → _Import Git Repository_ → choose the repo.
2. Framework preset: **Next.js** (auto-detected). Build command `next build`, output default, Node.js 20+ (24 recommended).
3. Environment variables (_Settings → Environment Variables_, for Production and Preview):

   | Name                    | Value                                                  |
   | ----------------------- | ------------------------------------------------------ |
   | `NEXT_PUBLIC_SITE_URL`  | `https://<project>.vercel.app` (later the real domain) |
   | `NEXT_PUBLIC_SITE_MODE` | `demo`                                                 |
   | `GOOGLE_PLACES_API_KEY` | optional, see README                                   |

4. _Deploy_. After ~1 minute you get a public preview URL such as `https://trang-an-web.vercel.app`.

> `NEXT_PUBLIC_*` values are inlined at build time — after changing them, trigger **Redeploy**.

## 3. Check the preview

- `/` redirects to `/sk`, SK/EN switch works, `/sk/menu` lists 144 items.
- Demo banner visible; `/robots.txt` says `Disallow: /` (expected in demo mode).
- Links to Wolt / Bistro.sk open the restaurant pages; Bolt Food shows “Overiť dostupnosť”.
- Optional: run Lighthouse (Chrome DevTools → Lighthouse, mobile + desktop) and keep the report.

## 4. Custom domain (only after the owner agrees)

1. Vercel → _Project → Settings → Domains_ → add e.g. `trang-an.sk` and `www.trang-an.sk`.
2. At the domain registrar set the DNS records Vercel shows — typically
   - apex `trang-an.sk`: `A 76.76.21.21`
   - `www`: `CNAME cname.vercel-dns.com`
3. HTTPS certificates are issued automatically (Let’s Encrypt) once DNS propagates (minutes to a few hours).
4. Set `NEXT_PUBLIC_SITE_URL=https://trang-an.sk`, `NEXT_PUBLIC_SITE_MODE=official` → Redeploy.
5. Submit `https://trang-an.sk/sitemap.xml` in Google Search Console and add the URL to the Google Business Profile
   (done by the owner, who controls the profile).

## Alternatives

Any Node.js host that runs `next start` works (`npm ci && npm run build && npm start`, port via `-p`). Cloudflare
Workers/OpenNext is not needed for this project.
