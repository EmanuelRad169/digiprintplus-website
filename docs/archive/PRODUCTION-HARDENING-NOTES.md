# Production Hardening Notes — Next.js + Sanity + Netlify

**Date:** January 2025  
**Status:** In Progress

---

## Task 3: Webhook Revalidation Assessment

### LIMITATION: Static Export Mode

**Critical:** This project uses `output: "export"` in [next.config.js](apps/web/next.config.js), which generates a fully static site. This architectural decision has the following implications:

#### What Doesn't Work with Static Export

- ❌ API Routes (no `/api/*` endpoints)
- ❌ On-Demand Revalidation (`revalidatePath`, `revalidateTag`)
- ❌ Incremental Static Regeneration (ISR)
- ❌ Server-Side Rendering (SSR)
- ❌ `cookies()`, `headers()` (except in Netlify Functions)
- ❌ Draft Mode (requires server-side session)

#### How Webhooks Work in This Architecture

1. **Sanity Webhook** → Configured at:
   - URL: `https://digiprintplus.netlify.app/.netlify/functions/sanity-webhook`
   - Handler: [netlify/functions/sanity-webhook.ts](netlify/functions/sanity-webhook.ts)
   - Verification: Uses `@sanity/webhook` signature validation

2. **Build Hook** → Webhook triggers:
   - Netlify Build Hook URL (stored in env var `NETLIFY_BUILD_HOOK_URL`)
   - Full site rebuild initiated
   - All 200+ pages regenerated from Sanity CMS

3. **Deployment Pipeline:**

   ```
   Sanity CMS Update
   ↓
   Webhook POST → Netlify Function
   ↓
   Trigger Build Hook
   ↓
   Full Site Rebuild (5-10 min)
   ↓
   Deploy to CDN
   ```

#### Performance Implications

**Pros:**

- ✅ Instant page loads (pre-rendered HTML)
- ✅ No server costs (static hosting)
- ✅ Maximum reliability (no server failures)
- ✅ Global CDN distribution

**Cons:**

- ⏱️ Content updates take 5-10 minutes (full rebuild)
- 💾 Large site = longer build times
- 🔄 No real-time preview mode (requires manual rebuild)

#### Alternative Considered

**Incremental Static Regeneration (ISR)** would enable:

- On-demand revalidation via `/api/revalidate`
- Faster updates (seconds instead of minutes)
- Preview mode support

**Why We Stick with Static Export:**

- Client prefers maximum performance and reliability
- Content updates are infrequent (not real-time)
- Build time (5-10 min) is acceptable for update cadence
- No server costs = better margin

---

## Recommendation: Document for Client

Create a **Content Update SLA** document:

- Expected time from "Publish" to live: 5-10 minutes
- Webhook status monitoring (Sanity dashboard)
- Netlify build logs access
- Emergency manual deploy process

---

**Status:** ✅ Documented  
**Action Required:** Share with client for expectations management
