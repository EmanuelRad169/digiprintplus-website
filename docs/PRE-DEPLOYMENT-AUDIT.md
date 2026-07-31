# FredCMs (DigiPrintPlus 2.0) — Pre-Deployment Audit

**Date:** July 30, 2026
**Scope:** Full monorepo (apps/web + apps/studio), Sanity dataset `as5tildt/production`, Netlify config, live site `digiprint-main-web.netlify.app`
**Method:** Real production build + type-check run on a clean copy of your source, static config/security review, GROQ content-integrity audit, live route spot-checks.

---

## Overall Status: 🟡 NOT READY — 3 blockers, deployable after fixes

The codebase is in good technical shape (type-check passes clean, webpack compile passes, Studio builds clean, content integrity in Sanity is strong). The blockers are a **leaked API token**, a **stale deployment nearly 5 months behind local work**, and a **guessable draft-mode secret**.

---

## 🔴 BLOCKERS (must fix before deploying)

### 1. `SANITY_API_TOKEN` is embedded in public client-side JavaScript
**Severity: Critical — active secret leak**

`apps/web/next.config.js` line 133 puts the token in the `env:` block:

```js
env: {
  ...
  SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,  // ← inlines into CLIENT bundles
}
```

Next.js inlines everything in `env:` into browser bundles. I verified empirically: after building, the full 180-char `skt...` token appears **in 4 publicly downloadable chunks**, including `chunks/app/layout-*.js` (loaded on every page):

- `.next/static/chunks/9785-*.js`
- `.next/static/chunks/app/layout-*.js`
- `.next/static/chunks/app/thank-you/page-*.js`
- `.next/static/chunks/app/templates/page-*.js`

Anyone can extract this token from the live site and read — and if it has write scope, modify — your dataset, including the 10 `quoteRequest` documents containing customer names, emails, and phone numbers.

**Fix:**
1. Remove `SANITY_API_TOKEN` from the `env:` block in `next.config.js` (server code reads `process.env.SANITY_API_TOKEN` natively — it doesn't need the block).
2. **Rotate the token** at sanity.io/manage → API → Tokens (the current one must be treated as compromised — it has shipped in every deploy since this config existed).
3. Update the token in Netlify UI env vars, redeploy, and confirm the new build's `/_next/static/chunks/` no longer contains it.
4. Server-only secrets that should never be in `env:`: `SANITY_API_TOKEN`, `SANITY_WEBHOOK_SECRET`, `SANITY_REVALIDATE_SECRET` (I verified the other secrets are currently NOT leaking — only the Sanity token).

### 2. Deployed site is ~5 months behind local work (39 uncommitted files on `main`)
**Severity: Critical — deployment state drift**

- Last commit on `main`: `be83cf5` — **March 2, 2026**
- Uncommitted right now: **39 modified/deleted files**, including core pages (`layout.tsx`, products, blog, services, templates, finishing), `fetchers.ts`, schemas (`template.ts`, `media.ts`), and `pnpm-lock.yaml`.

Evidence this matters: the **live** homepage still shows the placeholder phone `(555) 123-4567` in the bottom CTA and a stuck "Loading…" fragment — both already fixed in your local source. Your local fixes aren't reaching production.

**Fix:** Review, commit, and push the pending work (or stash what isn't ready). Deleted-file cleanups (`product.ts.backup`, old seed scripts) should land in the same commit. Until this is pushed, any "deploy" ships March code.

### 3. Draft/preview mode is protected by a publicly known default secret
**Severity: High**

`apps/web/src/app/api/draft/route.ts`:

```ts
const previewSecret = process.env.SANITY_PREVIEW_SECRET || "sanity-preview-secret";
```

- `SANITY_PREVIEW_SECRET` is **not set** in `apps/web/.env.local`, `.env.production`, or the Netlify env list in `netlify.toml` → the route accepts the hardcoded fallback `sanity-preview-secret`, which is also in the public git history.
- Compounding it, there's a **name mismatch**: Studio's `sanity.config.ts` reads `SANITY_STUDIO_PREVIEW_SECRET` while web reads `SANITY_PREVIEW_SECRET`. Even if you set one, the other side won't match unless both are configured.

Anyone can hit `/api/draft?secret=sanity-preview-secret&slug=/` and put their session into draft mode, exposing unpublished content (25 draft documents currently in the dataset).

**Fix:** Generate one strong secret, set it as `SANITY_PREVIEW_SECRET` in Netlify and `SANITY_STUDIO_PREVIEW_SECRET` in the Studio deploy env, and remove both hardcoded fallbacks (fail closed with a 500/401 if unset).

---

## 🟠 WARNINGS (should fix, not deploy-stopping)

### 4. `/api/submit-quote` is an unvalidated, unthrottled write endpoint
No schema validation (zod is installed but unused here), no rate limiting, no honeypot/CAPTCHA. Any bot can POST arbitrary JSON and create unlimited `quoteRequest` documents using your privileged server token. Recommend: zod validation, basic rate limiting (or move fully to Netlify Forms which has spam filtering — you already define a `quote` form there, so you effectively have two submission paths).

### 5. CORS wildcard on all `/api/*` routes
`middleware.ts` answers preflights with `Access-Control-Allow-Origin: *` plus `Allow-Credentials: true` for every API route. Tighten to your own origins.

### 6. Split-brain deploy targets: Netlify vs Vercel
- `netlify.toml` deploys to Netlify; `.github/workflows/deploy-vercel.yml` + `vercel-check.yml` deploy to Vercel; `apps/web/.env.production` sets `NEXT_PUBLIC_SITE_URL=https://digiprintplus.vercel.app`.
- If a production build ever runs without Netlify's UI override, canonical URLs, sitemap, robots, and OG tags will point at the Vercel domain. Pick one platform, delete the other's config, and align `NEXT_PUBLIC_SITE_URL` everywhere. Also: no custom domain (digiprintplus.com) is configured anywhere — the site canonicalizes to `digiprint-main-web.netlify.app`. Intentional?

### 7. Analytics are placeholders
`NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX`, `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX` in local env (and the build accepted them as "valid"). Verify real IDs exist in Netlify UI env, otherwise production has no analytics. The env validator should reject `XXXX` patterns.

### 8. Quote email automation doesn't exist in code
README promises "email automation"; `SENDGRID_API_KEY` sits in env — but no code imports SendGrid/nodemailer/Resend anywhere. Quote notifications depend entirely on Netlify Forms notification settings (configured in the Netlify UI — worth verifying) and on someone watching the Studio. Also note `netlify/functions/submit-quote.ts` at the repo root is **dead code**: `netlify.toml` points functions at `apps/web/netlify/functions`, which only contains `sanity-webhook.js`.

### 9. Hardcoded contact-info fallbacks are inconsistent
`siteSettings` in Sanity has no `contactInfo` (hasContact: false), so components fall back to hardcoded values that disagree: `(949) 770-5000` in the header vs `(800) 555-1234` in `products/[slug]/page.tsx` line 70. Populate `siteSettings.contactInfo` in Studio and remove divergent hardcoded numbers.

### 10. Housekeeping
- `apps/studio/src/schemas/product.ts.bak2` (25KB backup file) sitting in schemas dir.
- Root `.env.local` contains a stray shell command line (`cd apps/web && pnpm verify:all`) — malformed.
- Root `.env` points `SANITY_DATASET=development` with a real write token — confusing next to production configs.
- Legacy `MegaMenu.tsx` / `MegaMenuNew.tsx` / `navigation.tsx` / `NavigationEnhanced.tsx` coexist — dead-code risk.

---

## ✅ WHAT'S HEALTHY

**Build verification (run on a clean copy of your current source):**

| Check | Result |
|---|---|
| `tsc --noEmit` (web) | ✅ Pass, zero errors |
| Webpack production compile (web) | ✅ Pass |
| Env validation + Netlify Forms verification (prebuild) | ✅ Pass (5/5 forms) |
| Sanity Studio production build | ✅ Pass (34s) |
| Static page generation (SSG) | ⚠️ Could not verify — my sandbox can't reach the Sanity API; compile succeeded, page-data collection needs a network-enabled build. Nothing in code suggests it will fail — the live site's pages were generated by the same pipeline. |

**Content integrity (Sanity `production` dataset):**
- 137 products: all have slugs (all unique), images, and categories; **zero broken category references**. 107 active / 30 in `draft` status (confirm the 30 are intentionally hidden).
- 60 published templates: every one has a preview (or external preview URL) and a download file (or external URL). ✅
- 9 posts: all have slugs, authors, cover images, excerpts. ✅
- Navigation menu intact (7 items), revalidation webhook properly signature-verified. ✅
- Security headers (HSTS, X-Frame-Options, nosniff, referrer policy) configured in both `next.config.js` and `netlify.toml`. ✅
- `robots.txt` + `sitemap.xml` present and pointing at the right host. ✅

**Live site spot-check:** home, /products (35+ categories), /templates (60 results, pagination, filters), /blog (8 posts with images) all render without errors.

**Minor SEO polish (optional):** 7/9 posts and 3 active products lack `seo.metaDescription`; 25 stale draft documents worth triaging in Studio.

---

## Recommended order of operations

1. Remove `SANITY_API_TOKEN` from `next.config.js` `env:` block → commit.
2. Rotate the Sanity token; update Netlify env.
3. Set a real `SANITY_PREVIEW_SECRET` (web + studio names) and delete hardcoded fallbacks.
4. Review + commit + push the 39 pending files.
5. Verify Netlify UI env: real GA4/GTM IDs, correct `NEXT_PUBLIC_SITE_URL`, forms notifications enabled.
6. Deploy → then confirm: new chunks contain no `skt` token, `/api/draft?secret=sanity-preview-secret` returns 401, placeholder phone gone from homepage.
7. (Post-deploy) zod validation + rate limiting on `/api/submit-quote`; decide Netlify vs Vercel and delete the loser.
