# Sanity Studio (Backend) — Audit & Modernization

**Date:** July 30, 2026
**Target:** DigiPrintPlus Admin — `localhost:3333` (dev) / `dppadmin.sanity.studio` (prod), project `as5tildt`, dataset `production`, Sanity Studio v5
**Method:** Live click-through of the running Studio via browser automation + desk-structure/schema code review + direct GROQ queries against the production dataset.

---

## Overall: solid, well-built Studio with real data-integrity debt to clear before launch

The Studio itself is nicely made — logical grouping, rich list previews, field-group tabs, helpful field descriptions, emoji status pickers, a slug generator, and no console errors during navigation. The problems are in the **data** and in a few **structure/config choices**, not in the craft. Nothing here is a code blocker, but several items will confuse staff or surface stale/wrong content on the live site.

---

## 🔴 Data integrity (fix before go-live)

### 1. Orphaned documents of unregistered types (6 docs)
`about.ts` and `components.ts` schema files still exist on disk but are **not imported** in `src/schemas/index.ts`. The dataset still contains documents of those types:

- `component` — **5 documents**
- `about` — **1 document**

In the Studio these render as "Unknown/invalid document type" (uneditable, but they clutter global search and any `*[]`-style GROQ). Fix: decide per type — if unused, delete the 6 documents and delete the two dead schema files; if used, re-register the schema. (Frontend does not import these, so deletion is the likely answer.)

### 2. Duplicate "singletons" — already happening
The desk structure lists these with a **"+" create button and no singleton enforcement**, so editors can (and already did) create duplicates. Current published counts:

- `contactInfo` — **5 documents** (should be 1)
- `pageSettings` — **2 documents** (should be 1)
- `aboutSection` — **2 documents**
- `ctaSection` — **2 documents**

The frontend fetches these with `[0]`, so **which duplicate wins is nondeterministic** — a classic "why did the footer/contact info change on its own" bug. Fix: enforce singletons (fixed document id + `S.document().documentId(...)`, hide the create/delete actions), then merge/delete the extras.

### 3. Seven documents exist only as drafts (invisible on the live site)
25 draft documents total; **7 have no published version at all** → they never reach production (which reads published). Draft counts by type include **13 `productCategory` drafts** and 2 `service`, plus post/page/media/template/quoteRequest. Unpublished category edits mean the live category pages/nav can be stale. Fix: review these in the Studio's "Drafts" perspective and Publish (or discard) intentionally. Products are clean — **0 product drafts**.

### 4. Test/sample data mixed with real customer submissions
Of 8 published quote requests, **3 have no `requestId`** — the seed rows "John Doe (Sample Business LLC)", "Mike Chen (Local Restaurant)", "Sarah Johnson (TechCorp Solutions)", plus a "test tester (easy one)" entry. These show a literal **"null • …"** title in the list because the preview uses `requestId` as the prefix without a fallback, and they fail the schema's `requestId` required-rule (red validation marker). Fix: delete the seed/test quote requests before launch; make the preview coalesce a missing `requestId` (e.g. show the company name instead of `null`).

---

## 🟠 UX / configuration polish

5. **Singletons behave like lists.** `Global Settings`, `Footer`, `Quote Form`, `Navigation Menu`, `Page Settings`, `Integration Settings` open a list with a "+" instead of jumping straight to the one document. Enforce singleton + direct-open for a cleaner editor experience.

6. **`homepageSettings` is a ghost.** Schema is registered, but there are **0 documents**, and it is **not in the desk navigation** — yet the frontend reads it (`lib/sanity/homepageFetchers.ts`). Result: the homepage silently uses fallback defaults. Either add it to the nav and create the document, or remove the type and the fetcher.

7. **`faqCategory` is dead.** Registered schema, **0 documents**, not in the nav. Remove it or wire it up (the FAQ section uses `faqItem`, of which there are 7).

8. **`integrationSettings` empty.** In the nav, but **0 documents** — the "Integration Settings" pane is empty. Create the doc or hide the entry.

9. **`quoteRequest` over-requires fields.** Required includes `requestId`, `firstName`, `lastName`, `email`, `phone` (and more in Project Details). The public multi-step form doesn't guarantee all of these, so **real submissions can land invalid** (the real "Emanuel Rad" request shows a validation error). Align the required set with what the form actually collects, or fill server-side in `/api/submit-quote`.

10. **Vision (GROQ playground) is enabled in production config.** Any Studio user can run arbitrary reads against the dataset. Fine for an internal team; if outside staff get Studio access, gate Vision to non-prod or admins.

11. **Generic folder icons everywhere.** Functional but plain — see modernization below.

---

## ✅ Healthy

- Structure groups (Blog, Pages, Products, Site Settings, Media, Requests & Users, Site Content) all load correctly.
- List previews are genuinely good: thumbnails + structured subtitles (category · status · featured/rating for products; QR · name · type · status for quotes).
- Editor forms use **field-group tabs** (Basic Info / Content & Features / Images & Gallery / SEO & Meta, etc.), field **descriptions**, a slug **Generate** button, and emoji **status/priority** pickers.
- **No console errors** during navigation and record opening.
- **Vision** connects to the production dataset and runs.
- **Products are clean**: 137, all published, all with slugs/images/categories, 0 drafts.

---

## 🎨 Making it slicker & more "printshop" (your dashboard question)

You linked the Sanity **Dashboard** intro. Two different things share that name — worth separating:

### A) The Sanity org Dashboard (`sanity.io/welcome`)
A newer **organization-level hub**: it lists your deployed studios and official apps (Canvas, Media Library, Content Agent), plus notifications, favorites, an org switcher, and a light/dark/system theme. It is **not where brand identity lives** — customization is limited to pinning studios/apps and the theme. Good as a launcher; it won't make the admin feel like *your* printshop.

### B) Your Studio itself (`dppadmin.sanity.studio`) — this is where "slick" happens
You already have a `dashboardConfig.tsx` scaffolded, so you're part-way there. Highest-impact upgrades, roughly in order:

1. **Brand it.** Add a Studio **logo component** (your DigiPrintPlus mark, not the default "DA" tile), a custom **navbar title**, and a **brand theme** (Studio v5 `theme`/`@sanity/ui` — set the primary to your brand color, tune light/dark). This single change is what makes it read as "our tool."

2. **Give staff a real landing dashboard** (via the `@sanity/dashboard` plugin you've scaffolded). Instead of an empty structure pane on load, show:
   - **New quote requests (last 7 days)** — the #1 thing staff should see.
   - **Order pipeline by status** (New / In Review / Quote Sent / In Production / Completed).
   - **Recently edited products**, and a **Netlify deploy** button + last-deploy status widget.

3. **A status-based quote pipeline** in the structure — status-filtered lists (New, In Review, Quote Sent, In Production, Completed) so the team works the queue like a kanban, instead of one flat "Quote Requests" list. Your `quoteRequest` already has the status field with emoji labels; this is mostly desk-structure wiring.

4. **Per-type icons** (`@sanity/icons`): product = package, template = documents, quoteRequest = clipboard/receipt, media = images, siteSettings = cog, etc. Instantly makes the sidebar scannable versus today's identical folder icons.

5. **Enforce singletons with direct-open + icons** (fixes items 2 & 5 above and looks cleaner).

6. **Document badges/actions** for the print workflow — e.g. a "Needs review" badge on quotes missing info, or a one-click "Mark quote sent" action.

A fully custom React app via the **App SDK** is possible but a much heavier lift — you almost certainly don't need it. Items 1–4 get you a modern, branded, printshop-flavored admin with modest effort.

---

## Suggested order

1. Delete the 6 orphaned `component`/`about` docs + their dead schema files.
2. Merge/delete duplicate `contactInfo` (5→1), `pageSettings` (2→1), `aboutSection`, `ctaSection`; then enforce singletons.
3. Delete seed/test quote requests; fix the preview null fallback; align `quoteRequest` required fields to the form.
4. Triage the 25 drafts (esp. 13 product categories) — publish or discard the 7 draft-only docs.
5. Resolve the ghosts: `homepageSettings`, `faqCategory`, empty `integrationSettings`.
6. Then the polish: brand theme + logo, landing dashboard widgets (new quotes / pipeline / deploy), per-type icons, quote pipeline structure.
