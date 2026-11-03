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

## Cloudflare Workers (OpenNext)

The repo contains the Cloudflare configuration: `wrangler.jsonc` (Worker **`trang-an-restaurant`**, bindings `ASSETS`,
`IMAGES`, `WORKER_SELF_REFERENCE`) and `open-next.config.ts` (prerendered pages served from static assets).

**Workers Builds** (Cloudflare dashboard → Worker `trang-an-restaurant` → Settings → Build):

| Setting                   | Value                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| Build command             | `npx opennextjs-cloudflare build`                                                                       |
| Deploy command            | `npx opennextjs-cloudflare deploy`                                                                      |
| Build variables           | `NEXT_PUBLIC_SITE_URL=https://<worker-or-domain>`, `NEXT_PUBLIC_SITE_MODE=demo` (inlined at build time) |
| Runtime secret (optional) | `GOOGLE_PLACES_API_KEY`                                                                                 |

From a machine (Linux/macOS/WSL — OpenNext does not officially support native Windows): `npm run deploy`
(= build + deploy, needs `npx wrangler login`). Local check of the built Worker: `npm run preview`.

Rules:

- The Worker **name in `wrangler.jsonc` must equal the Worker name in Cloudflare**, and `WORKER_SELF_REFERENCE.service`
  must equal that same name. Without a committed `wrangler.jsonc`, OpenNext generates one from the `package.json`
  name — that mismatch (`trang-an` vs `trang-an-restaurant`) caused deploy error **10143**.
- Do not pass `--name` to the deploy command; rename in `wrangler.jsonc` (both places) instead.
- Cloudflare-specific code constraints: no filesystem at runtime (the OG-image fonts are embedded in
  `src/lib/og-fonts.generated.ts`); Next 16 `proxy.ts` runs as OpenNext’s _experimental_ Node.js middleware.

## Other Node.js hosts

Any Node.js host that runs `next start` works (`npm ci && npm run build && npm start`, port via `-p`).
