# Sanity Blockers — Remaining Manual Steps

Code fixes are already applied to your Mac. These 3 things I could not do for you.

---

## STEP 1 — Rotate the Sanity API token (REQUIRED)

The old token shipped in public JavaScript on every deploy. Treat it as compromised.

1. Go to https://www.sanity.io/manage/project/as5tildt/api#tokens
2. Create a new token — name it `netlify-web-build`, permission **Viewer** if the site
   only reads content. It needs **Editor** only if you keep `/api/submit-quote` writing
   quote requests with it (you currently do).
3. Delete the old token starting `sktYFXZ9...`
4. Put the new value in:
   - Netlify UI → Site settings → Environment variables → `SANITY_API_TOKEN`
   - `apps/web/.env.local` line 2 (local dev)

The old token is `sktYFXZ9jvLO7Hub...MLf6k1dzhVuk5c8QYIqoWObjEuZ53MdDsG8a4gU0Coo...`
— search your Netlify env for it to confirm you replaced the right one.

---

## STEP 2 — Apply the 5 `.env` edits by hand

The desktop bridge refuses to write `.env*` files, so these must be done by hand.

Your generated preview secret:

```
nM8jMUjcPnbsIYDjwnoUoDVd7Xqo1mjAH0_s-8S7llw
```

### a) `apps/web/.env.local` — ADD one line

```
SANITY_PREVIEW_SECRET=nM8jMUjcPnbsIYDjwnoUoDVd7Xqo1mjAH0_s-8S7llw
```

### b) `apps/web/.env.production` — ADD one line, FIX one line

```
SANITY_PREVIEW_SECRET=nM8jMUjcPnbsIYDjwnoUoDVd7Xqo1mjAH0_s-8S7llw
```

and change line 3 — it currently points local production builds at the wrong dataset:

```diff
- NEXT_PUBLIC_SANITY_DATASET=development
+ NEXT_PUBLIC_SANITY_DATASET=production
```

(Only change this if pointing at `development` wasn't deliberate.)

### c) `apps/studio/.env.production` — REPLACE the weak secret

```diff
- SANITY_STUDIO_PREVIEW_SECRET=sanity-preview-secret
+ SANITY_STUDIO_PREVIEW_SECRET=nM8jMUjcPnbsIYDjwnoUoDVd7Xqo1mjAH0_s-8S7llw
```

### d) `apps/studio/.env.development` — DELETE this line

```
SANITY_STUDIO_PREVIEW_SECRET=sanity-preview-secret
```

This file is **tracked in git**, which is how the secret became public. Keep it
secret-free from now on.

### e) `apps/studio/.env.development.local` — CREATE this new file

```
SANITY_STUDIO_PREVIEW_SECRET=nM8jMUjcPnbsIYDjwnoUoDVd7Xqo1mjAH0_s-8S7llw
SANITY_STUDIO_PRODUCTION_URL=http://localhost:3001
```

It matches `.env*.local` in your root `.gitignore`, so it stays out of git, and Vite
loads it after `.env.development` so it wins.

---

## STEP 3 — Set the secret in Netlify, then redeploy

Netlify UI → Site settings → Environment variables:

| Variable | Value |
|---|---|
| `SANITY_API_TOKEN` | the NEW token from Step 1 |
| `SANITY_PREVIEW_SECRET` | `nM8jMUjcPnbsIYDjwnoUoDVd7Xqo1mjAH0_s-8S7llw` |

`SANITY_PREVIEW_SECRET` is now a **required** variable — `verify-netlify-env.ts` runs in
`prebuild` and will fail the Netlify build if it's missing, too short, or still the old
default. That's intentional: the build fails loudly instead of shipping broken preview.

Then redeploy the Studio so it picks up the new secret:

```bash
cd apps/studio && pnpm run deploy
```

---

## STEP 4 — Verify after deploy

```bash
# 1. Old default secret must be rejected (expect: 401)
curl -s -o /dev/null -w "%{http_code}\n" \
  "https://digiprint-main-web.netlify.app/api/draft?secret=sanity-preview-secret&slug=/"

# 2. New secret must work (expect: 307)
curl -s -o /dev/null -w "%{http_code}\n" \
  "https://digiprint-main-web.netlify.app/api/draft?secret=nM8jMUjcPnbsIYDjwnoUoDVd7Xqo1mjAH0_s-8S7llw&slug=/"

# 3. Open redirect must be blocked (expect: your own domain, NOT evil.com)
curl -s -o /dev/null -w "%{redirect_url}\n" \
  "https://digiprint-main-web.netlify.app/api/draft?secret=nM8jMUjcPnbsIYDjwnoUoDVd7Xqo1mjAH0_s-8S7llw&slug=https://evil.com"
```

---

## Known ceiling on the preview secret

I verified this after rebuilding the Studio: `sanity build` compiles
`SANITY_STUDIO_PREVIEW_SECRET` into the public bundle (found it in
`dist/static/sanity-BJUEmlvP.js`). Anyone who loads `dppadmin.sanity.studio` can
extract it — that's inherent to the `productionUrl` + shared-secret pattern, not a
bug in your setup.

This still fixes the real problem (the secret was a guessable string published in
git), but if you want draft mode to be genuinely access-controlled, the upgrade is
`next-sanity`'s `defineEnableDraftMode` with `@sanity/preview-url-secret`, which
validates a rotating per-session secret stored in your dataset instead of a static
shared string. You already have `sanity.previewUrlSecret` documents in the dataset and
`@sanity/visual-editing` installed, so you're most of the way there. Worth doing as a
follow-up, not a deploy blocker.
