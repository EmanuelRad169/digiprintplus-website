# Pre-Launch Blockers — status as of 2026-07-31

Checked live against the running app and the `production` dataset, not from memory.

---

## Blockers (must fix before launch)

### 1. `SANITY_API_TOKEN` is Viewer-scoped — quote requests cannot be saved
`apps/web/.env.local` holds a valid 180-char `sktY…` token that authenticates but
returns `Insufficient permissions; permission "create" required` on write.
`apps/studio/.env.local` still contains the literal placeholder (`your…`, 22 chars).

**Effect:** every quote request fails to reach Sanity. It is captured by the
Netlify Forms fallback, so no lead is lost, but the Studio pipeline stays empty.

**Fix (owner only):** manage.sanity.io → project `as5tildt` → API → Tokens →
create an **Editor** token → set `SANITY_API_TOKEN` in `apps/web/.env.local` and
in the Netlify UI. Delete the old token rather than re-scoping it — it was
exposed in the client bundle before `next.config.js` was corrected.

### 2. 30 of 136 products return 404
`status == "draft"` on 30 products. `generateStaticParams` filters on
`status == "active"` and the page sets `dynamicParams = false`, so those slugs
are permanently unreachable. Confirmed examples: `akuafoil-rack-cards`,
`black-edge-postcards`, `black-edge-hang-tags`.

**Fix:** either flip them to `active` in the Studio (content decision) or allow
`dynamicParams` so drafts resolve on demand (code decision). Needs your call.

### 3. `QuotePDFGenerator` breaks against the migrated schema
7 references to `quoteData.jobSpecs.productType` / `.quantity` / `.finish` etc.
treat `jobSpecs` as an object. It is now an array, so these render `undefined`.
The component also exists in **two** copies (`apps/studio/src/components/` and
`apps/web/src/components/`) and is imported by neither app.

**Fix:** update it to iterate line items, or delete both copies until the
"Quote Sent" step is actually built. Right now it is broken dead code.

---

## High priority (not launch-blocking, but silent-failure risks)

### 4. Netlify functions directory mismatch
`netlify.toml` sets `directory = "apps/web/netlify/functions"`, which contains
only `sanity-webhook.js`. The repo-root `netlify/functions/` still holds
`submit-quote.ts` and `sanity-webhook.ts` — never deployed, pure confusion.
Delete them or fix the path.

### 5. Uploaded artwork never reaches Sanity
Files post to Netlify Forms as attachments. Nothing calls
`client.assets.upload()`, so `quoteRequest.files` is always empty and customer
artwork is invisible from the Studio.

### 6. No notifications
No confirmation email to the customer, no internal alert on a new request. This
is why the previous pipeline outage went unnoticed from Jul 2025 to Feb 2026.

---

## Known gaps (post-launch)

- **No `order` document type.** The ecosystem ends at `quoteRequest`; there is no
  quote → order conversion.
- **No pricing engine.** `estimate.amount` and `estimate.breakdown[]` are typed
  by hand in the Studio.
- **`customerType` is hardcoded to `"new"`** on every submission, so repeat
  customers are not recognised and there is no order history.

---

## Resolved this session

- Quote form → Sanity transport reconnected (`/api/submit-quote` now called).
- Server-side validation: rejects blank/malformed email and empty product lists.
- 30-second dedupe guard (the dataset had two submissions 0.8s apart).
- 503 + explicit log when the token is missing, instead of a generic failure.
- `jobSpecs` migrated object → array; all 8 records converted and published.
- Multi-product quoting: basket, "Add to quote", repeatable line items,
  per-item validation, review table.
- Two TypeScript errors from the migration (`formData.productType` after the
  field was removed) — `tsc --noEmit` now passes clean.
- Draft-mode hardening, client-bundle token leak, stale-cache 500s, mega-menu
  alphabetisation, product page compaction, card unification.

---

## Housekeeping

`_to_delete/` contains `migrate-jobspecs.mjs` and `_audit_src.tar.gz` — safe to
remove.
