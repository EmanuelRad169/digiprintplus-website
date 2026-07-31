# Quote → Sanity → Order Ecosystem Audit

**Date:** 2026-07-30
**Scope:** `/quote` widget → submission transport → Sanity `quoteRequest` → Studio pipeline → order/fulfilment
**Verdict:** The loop is **open**. The front half (form) and the back half (Studio pipeline) are both built and both work — but nothing connects them. New quote requests submitted today do **not** reach Sanity.

---

## 1. The headline finding

There are **three** quote-submission implementations in this repo. The one the live form actually uses is the only one that does **not** talk to Sanity.

| # | Implementation | Writes to Sanity? | Wired up? |
|---|---|---|---|
| 1 | `apps/web/src/app/api/submit-quote/route.ts` | Yes — `sanityClient.create({_type:"quoteRequest"})` | **No. Zero callers.** `grep -rn "submit-quote" apps/web/src apps/studio/src` returns nothing. |
| 2 | `netlify/functions/submit-quote.ts` (repo root) | Yes — identical logic | **No. Not deployed.** See §2. |
| 3 | `useNetlifyForm` → `POST /` with `data-netlify="true"` | **No** | **Yes — this is what runs.** |

`apps/web/src/app/quote/page.tsx` calls `submitToNetlify(submissionData)`, which posts multipart form data to `/`. Netlify captures it into the **Forms dashboard** and nothing else happens. Sanity is never contacted.

**Consequence:** every quote request from the live site lands in a Netlify inbox the Studio cannot see. The "Quote Requests & Users" business inbox in the Studio is, in practice, a static list of old records.

---

## 2. Why the Netlify function never runs — two independent reasons

**Reason A — wrong functions directory.**
`netlify.toml` declares:

```toml
[functions]
  directory = "apps/web/netlify/functions"
```

That directory contains only `sanity-webhook.js`. The `submit-quote.ts` function lives in the **repo-root** `netlify/functions/` folder, which Netlify never looks at. It is dead weight in the build.

**Reason B — wrong function name.**
Even if the directory were corrected, Netlify Forms do not invoke an arbitrary function on submit. A form submission fires the reserved event function **`submission-created`**. A function called `submit-quote` would only run if something explicitly `fetch`ed `/.netlify/functions/submit-quote` — and nothing does.

---

## 3. Evidence from the live dataset

Query against `production`:

```
{"quoteRequest": 8, "quoteSettings": 1, "order": 0}
```

The 8 `quoteRequest` documents split into two groups:

- **3 seed/demo records** — `john.doe@example.com`, `sarah.johnson@techcorp.com`, `mike@localrestaurant.com`. All have `requestId: null` and `submittedAt: null`, so they were hand-created or seeded, not submitted through any code path.
- **5 machine-created records** — `QR-781766` (2025-07-01), `QR-515284` and `QR-516107` (2025-07-02), `QR-760452` (2025-07-07), `QR-323746` (2026-02-26). These carry the `QR-${Date.now().slice(-6)}` shape produced by the function, proving a submit path **did** work historically.

Note that `QR-516107` and `QR-515284` were created **0.8 seconds apart with empty `contact.email`** — that is a double-fire on an empty payload, i.e. the old path had no validation and no dedupe.

The 7-month gap between 2025-07-07 and 2026-02-26 with only one record is itself the symptom: the pipeline broke and nobody noticed, because there is no alerting (§6).

---

## 4. What *is* working

**`quoteSettings` → form is fully wired and healthy.** This is the one genuinely closed loop.

`getQuoteSettings()` in `contentFetchers.ts` queries the `quote-settings` singleton and both `job-specs-step.tsx` and `review-step.tsx` consume it, with a hardcoded `fallbackSettings` if the fetch fails. The document is populated:

- `jobSpecsStep.productTypes` — 9 entries
- `jobSpecsStep.quantities` — 8 entries
- `jobSpecsStep.paperTypes` — 6 entries
- `jobSpecsStep.finishes` — 6 entries
- `jobSpecsStep.turnaroundTimes` — 4 entries
- `labels.*`, `buttonText.*`, `contactStep`, `reviewStep` — all set

Editing these in the Studio **does** change the live form. Good.

**Studio pipeline structure is built.** `structure.ts` defines status-filtered lists (`New`, `Quote Sent`, etc.) via `_type == "quoteRequest" && status == $status`, plus an "All Quote Requests" list. The workspace is ready for volume it is not receiving.

**`quoteRequest` schema is genuinely well-designed** — grouped into overview / customer / project / quote / files / workflow, with `estimate.amount`, `estimate.breakdown[]`, `estimate.validUntil`, `assignedTo`, `priority`, and a full address object.

---

## 5. Data-model gaps

**The submit payload fills a fraction of the schema.** Both submit implementations write only `contact.*`, `jobSpecs.*`, `needsDesignAssistance`, `source`, `customerType`. Never populated by any code:

- `projectInfo.*` (projectName, description, industry) — the form does not collect these
- `estimate.*` — no pricing engine exists; must be typed by hand in the Studio
- `files` — see below
- `contact.address`, `contact.website` — not collected
- `jobSpecs.printing.colorType` / `.sides`, `jobSpecs.deliveryMethod` — schema fields with no form input

**Uploaded files never reach Sanity.** The form appends `File` objects to `FormData` and posts them to Netlify Forms, which stores them as form-submission attachments on Netlify's side. The `files` field group on `quoteRequest` is never written. Even the Sanity-writing implementations ignore files entirely — neither uploads assets via `client.assets.upload()`. So a customer's artwork is invisible from the Studio.

**`finish` is lossy.** The form captures a single `finish` string; the schema expects an array. Both implementations do `payload.finish ? [payload.finish] : []`, so a customer can never request more than one finish despite the schema supporting it.

---

## 6. Missing pieces of a closed ordering system

**No order document type.** `apps/studio/src/schemas/` has no `order.ts`, and `count(*[_type=="order"])` is `0`. There is no schema, no status model, and no code path for converting an accepted quote into an order. The ecosystem currently **ends** at `quoteRequest`.

**No customer notification.** Nothing sends a confirmation email. The Netlify function even documents the hole:

> `// Send confirmation email (optional - can be added later)`

A customer submits and receives no acknowledgement beyond the `/forms/success` redirect.

**No internal notification.** No Slack/email alert on a new request. Combined with the broken pipeline, this is exactly why a 7-month outage went unnoticed.

**No quote-sent artefact.** `QuotePDFGenerator.tsx` exists in **two** places — `apps/studio/src/components/` and `apps/web/src/components/` — and is imported by **nothing** in either app. The `Quote Sent` status in the Studio pipeline has no mechanism behind it; the status is set manually with no PDF and no send.

**No dedupe or rate limiting.** The double-fire in the dataset shows this concretely.

**No customer identity.** `customerType` is hardcoded to `"new"` on every submission. There is no lookup against existing contacts, so a repeat customer always looks new and there is no order history.

---

## 7. Recommended remediation, in order

1. **Reconnect submissions to Sanity.** Cleanest option: have the form `POST` to the existing `/api/submit-quote` Next.js route (it already works and is already deployed by the Next runtime), and keep the Netlify Forms post as a redundant capture. This needs no Netlify config change and deletes the deployment ambiguity.
2. **Delete the two dead implementations** — repo-root `netlify/functions/submit-quote.ts` and one of the duplicate `QuotePDFGenerator.tsx` files — or fix the `netlify.toml` functions directory. Two half-working copies of the same thing is how this broke.
3. **Add server-side validation and dedupe** in the route: reject empty email, collapse identical payloads inside a short window.
4. **Upload files to Sanity** via `client.assets.upload()` and reference them from `quoteRequest.files`, so artwork is visible in the Studio.
5. **Add notifications** — customer confirmation email plus an internal alert. Without this, silent failure recurs.
6. **Design the `order` schema** and a Studio action that converts an accepted `quoteRequest` into an `order`, carrying contact, specs, files, and the agreed estimate.
7. **Wire `QuotePDFGenerator`** to a Studio document action on `quoteRequest`, so `Quote Sent` produces an actual artefact.
8. **Backfill the missing form fields** the schema already anticipates (colour/sides, delivery method, project description) or trim them from the schema so the model matches reality.

---

## 8. Health summary

| Layer | Status |
|---|---|
| Quote form UX & validation | Healthy (rebuilt 2026-07-30) |
| `quoteSettings` → form content | **Working** |
| Form → Sanity transport | **Broken — no path** |
| File capture → Sanity | **Missing** |
| Studio quote pipeline UI | Built, starved of data |
| Estimate / pricing | Manual only |
| Quote PDF / send | **Dead code** |
| Quote → Order conversion | **Does not exist** |
| Customer / internal notification | **Does not exist** |
