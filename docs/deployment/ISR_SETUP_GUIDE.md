# ISR + Draft Mode Setup Complete! 🎉

Your site has been upgraded from **Static Export** to **Hybrid Rendering with ISR (Incremental Static Regeneration) and Draft Mode**. This gives you WordPress-like instant updates!

## ✅ What Has Been Implemented

### 1. **ISR Enabled on All Key Pages**

Pages now automatically refresh every 60 seconds after you publish changes in Sanity:

- Homepage (`/`)
- Products (`/products`, `/products/[slug]`, `/products/category/[category]`)
- Blog (`/blog`, `/blog/[slug]`)
- Services (`/services`, `/services/[slug]`)
- Dynamic pages (`/[slug]` - About, Finishing, Contact, etc.)
- Templates (`/templates`)

### 2. **Draft Mode API Routes Created**

- **Enable Preview**: `/api/draft?secret=YOUR_SECRET&slug=/page-slug`
- **Disable Preview**: `/api/draft/disable`

### 3. **Sanity Client Updated**

- Already configured to serve draft content when in preview mode
- Uses `perspective: "previewDrafts"` for unpublished content

### 4. **Next.js Configuration Updated**

- Removed static export (`output: "export"`)
- Enabled Next.js server runtime (`output: "standalone"`)
- Enabled image optimization

---

## 🚀 Required Setup Steps

### Step 1: Add Environment Variables to Netlify

Go to **Netlify Dashboard** → **Site Settings** → **Environment Variables** and add:

```bash
# Required (already should exist)
NEXT_PUBLIC_SANITY_PROJECT_ID="as5tildt"
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=skiHFAHXZ8LXn7ouA5eW6IaCUqjdYoTL2NR6hjW51ljZNzxYVzsf8FLheiBOiK3TtYASCy58Zq3CsKUxyR6yZhGiKAjxT3cWhHs2q1vIb1KScOUoWSMvy5cz2KrcRp5RGquVQQuunI4pYBry3hkDRUgWamrhugMQ8JLe3pRsl2UAQhOxVSsG

# New Required Variable for Preview Mode
SANITY_PREVIEW_SECRET="D0Mpx6k/4rW0Rl8fVhEOlmQYP5sUBY0wr44QDJHsKuM="

# Keep existing webhook variables
SANITY_WEBHOOK_SECRET="so26GsMt0Fr9|1puбeUQ"
NETLIFY_BUILD_HOOK_URL=https://api.netlify.com/build_hooks/698eefc2e469f49360946364
```

**To generate a secure preview secret:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 2: Deploy to Netlify

```bash
# From your project root
./scripts/deployment/deploy-web.sh --prod
```

This will:

- Build with the new ISR configuration
- Deploy the Next.js runtime to Netlify
- Enable the draft mode API routes

### Step 3: Set Up Preview Links in Sanity Studio

Add this to your Sanity Studio configuration (`apps/studio/sanity.config.ts`):

```typescript
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

export default defineConfig({
  // ... your existing config

  document: {
    productionUrl: async (prev, context) => {
      const { document } = context;
      const slug = document.slug?.current;
      const type = document._type;

      // Base URLs
      const previewUrl = "https://digiprint-main-web.netlify.app";
      const secret = "YOUR_SANITY_PREVIEW_SECRET"; // Match SANITY_PREVIEW_SECRET from Netlify

      // Generate preview URL based on document type
      let path = "/";

      if (type === "product" && slug) {
        path = `/products/${slug}`;
      } else if (type === "post" && slug) {
        path = `/blog/${slug}`;
      } else if (type === "service" && slug) {
        path = `/services/${slug}`;
      } else if (type === "page" && slug) {
        path = `/${slug}`;
      }

      return `${previewUrl}/api/draft?secret=${secret}&slug=${path}`;
    },
  },
});
```

---

## 🧪 How to Test

### Test 1: ISR (Automatic Updates)

1. Go to your **Sanity Studio**
2. Edit a page (e.g., change homepage headline)
3. Click **Publish**
4. Wait **60 seconds** (the revalidation window)
5. Refresh your production site
6. ✅ Changes should appear (no rebuild needed!)

### Test 2: Draft Preview (Instant Previews)

1. In **Sanity Studio**, create or edit a document
2. **Don't publish** - keep it as a draft
3. Look for the **"Open Preview"** button (will appear after Step 3 above)
4. Click it - should open your site in preview mode
5. ✅ You should see the unpublished changes instantly
6. Click **"Exit Preview"** link (we can add this to your site header)

### Test 3: Webhook Rebuild (Fallback)

Your webhook is still active as a safety net:

1. Publish a change in Sanity
2. Check **Netlify Dashboard** → **Deploys**
3. ✅ A new build should start automatically

---

## 📊 Performance Expectations

| Scenario            | Time to Live  | Method                     |
| ------------------- | ------------- | -------------------------- |
| **New publish**     | 0-60 seconds  | ISR automatic revalidation |
| **Draft preview**   | Instant       | Draft mode API             |
| **Webhook rebuild** | 30-60 seconds | Full rebuild (backup)      |

---

## 🎯 Next Steps (Optional Enhancements)

### 1. Add Exit Preview Button

Add this to your site header component:

```tsx
import { draftMode } from "next/headers";

export async function Header() {
  const { isEnabled } = await draftMode();

  return (
    <header>
      {/* ... your header content */}

      {isEnabled && (
        <div className="bg-yellow-500 text-black p-2 text-center">
          Preview Mode Active
          <a href="/api/draft/disable" className="ml-4 underline">
            Exit Preview
          </a>
        </div>
      )}
    </header>
  );
}
```

### 2. On-Demand Revalidation (Even Faster!)

For instant updates without waiting 60 seconds, add an API route:

```typescript
// apps/web/src/app/api/revalidate/route.ts
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-sanity-webhook-secret");

  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return new Response("Invalid secret", { status: 401 });
  }

  const body = await request.json();
  const path = body.path || "/";

  revalidatePath(path);

  return Response.json({ revalidated: true, path });
}
```

Then update your Sanity webhook to call this endpoint instead of the build hook.

### 3. Stale-While-Revalidate

For even better performance, consider adding `stale-while-revalidate` headers.

---

## 🆘 Troubleshooting

### Changes not appearing after 60 seconds?

1. Hard refresh your browser (Cmd+Shift+R or Ctrl+Shift+R)
2. Check browser console for errors
3. Verify environment variables in Netlify match exactly

### Preview mode not working?

1. Verify `SANITY_PREVIEW_SECRET` is set in Netlify
2. Check browser console for cookie errors
3. Ensure the secret in Sanity Studio matches Netlify

### Images not loading?

1. Check `cdn.sanity.io` is allowed in next.config.js `remotePatterns`
2. Verify images exist in Sanity
3. Check browser network tab for 403/404 errors

---

## 📝 Summary

**Before:** Static export → Every change required 30-60 second rebuild
**After:** ISR + Draft Mode → Changes appear in 0-60 seconds

You now have a true "live CMS" experience! 🎉

---

**Need Help?** Check the Next.js ISR docs: <https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration>
