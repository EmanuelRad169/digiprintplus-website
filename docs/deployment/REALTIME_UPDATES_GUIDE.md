# Real-Time CMS Updates Setup Guide 🚀

**Status**: ✅ Implementation Complete

Your Next.js + Sanity site now has **instant content updates** without waiting for Netlify rebuilds!

---

## 🎯 How It Works

```
Sanity Studio → Webhook → Netlify API → On-Demand Revalidation → Live in 1-3 seconds
```

**Before**: Change → Publish → Wait 30-60s for rebuild → Live ❌  
**After**: Change → Publish → Live in 1-3 seconds ✅

---

## ✅ Part 1: Already Implemented

### 1. ISR (Incremental Static Regeneration)

- All pages have 60-second automatic revalidation
- Fallback if webhook fails

### 2. Draft Mode

- Preview unpublished changes instantly
- Enable: `/api/draft?secret=YOUR_SECRET&slug=/page-path`
- Disable: `/api/draft/disable`

### 3. **NEW: On-Demand Revalidation API**

- Located: `apps/web/src/app/api/revalidate/route.ts`
- Triggers instant page updates
- Validates webhook signatures for security
- Handles all document types (blog, products, services, pages)

---

## 🔧 Part 2: Configure Sanity Webhook

### Step 1: Go to Sanity Studio

1. Visit: https://www.sanity.io/manage/personal/project/as5tildt
2. Navigate to **API** → **Webhooks**
3. Click **Create Webhook** or edit existing webhook

### Step 2: Configure Webhook Settings

**Name**: `Netlify On-Demand Revalidation`

**URL**:

```
https://digiprint-main-web.netlify.app/api/revalidate
```

**Dataset**: `production`

**Trigger on**:

- ✅ Create
- ✅ Update
- ✅ Delete

**HTTP method**: `POST`

**HTTP Headers**: (optional, for debugging)

```
X-Webhook-Source: sanity-studio
```

**Secret**: (copy from your environment)

```
so26GsMt0Fr9|1puбeUQ
```

**Filter** (optional - send webhook only for specific types):

```groq
_type in ["post", "product", "service", "page", "siteSettings", "navigation", "megaMenu"]
```

**Projection** (optional - reduce payload size):

```groq
{
  _type,
  _id,
  slug,
  title
}
```

### Step 3: Save & Test

1. Click **Save**
2. Click **Trigger test webhook**
3. Should see: ✅ `200 OK` response
4. Check response body for `"success": true`

---

## ✨ Part 3: Verify Environment Variables

### Required on Netlify:

Go to: **Netlify Dashboard** → **Site Settings** → **Environment Variables**

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID="as5tildt"
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_SITE_URL="https://digiprint-main-web.netlify.app"

# API Tokens
SANITY_API_TOKEN=SET_IN_PLATFORM_UI_DO_NOT_COMMIT

# Webhook Security
SANITY_REVALIDATE_SECRET="so26GsMt0Fr9|1puбeUQ"

# Preview Mode
SANITY_PREVIEW_SECRET="D0Mpx6k/4rW0Rl8fVhEOlmQYP5sUBY0wr44QDJHsKuM="

# Optional: Build Hook (backup)
NETLIFY_BUILD_HOOK_URL=SET_IN_NETLIFY_UI_DO_NOT_COMMIT
```

**✅ All variables should already be set from ISR setup.**

---

## 🧪 Part 4: Test The Complete Flow

### Test 1: Local Webhook Test

```bash
cd apps/web

# Test blog post revalidation
node scripts/test-revalidation.js post "test-post-slug"

# Test product revalidation
node scripts/test-revalidation.js product "business-cards"

# Test site settings (revalidates all pages)
node scripts/test-revalidation.js siteSettings
```

Expected output:

```
🧪 Testing Revalidation Webhook
================================
Site URL: https://digiprint-main-web.netlify.app
Document Type: post
Slug: test-post-slug

📡 Response:
Status: 200

✅ Result: {
  "success": true,
  "revalidated": ["/blog", "/blog/test-post-slug"],
  "message": "Revalidated 2 path(s)",
  "now": 1737582000000
}

✅ Revalidation successful!
   Paths revalidated: /blog, /blog/test-post-slug

💡 Your changes should now be live within seconds.
```

### Test 2: Live CMS Test

1. **Go to Sanity Studio**: https://your-studio-url.sanity.studio
2. **Edit a blog post**: Change the title
3. **Click Publish**
4. **Check your live site**: https://digiprint-main-web.netlify.app/blog
5. **Refresh the page**: Changes should appear in 1-3 seconds ✅

### Test 3: Verify Webhook Deliveries

1. Go to Sanity: **API** → **Webhooks**
2. Click your webhook
3. View **Deliveries** tab
4. Should see successful POST requests with `200` responses

---

## 📊 What Gets Revalidated

The API intelligently revalidates paths based on document type:

| Document Type    | Paths Revalidated               |
| ---------------- | ------------------------------- |
| **post**         | `/blog`, `/blog/[slug]`         |
| **product**      | `/products`, `/products/[slug]` |
| **service**      | `/services`, `/services/[slug]` |
| **page**         | `/[slug]`                       |
| **siteSettings** | All pages (layout)              |
| **navigation**   | All pages (layout)              |
| **megaMenu**     | All pages (layout)              |

---

## ⚡ Performance Expectations

| Action                   | Time to Live | Method                 |
| ------------------------ | ------------ | ---------------------- |
| **Publish change**       | 1-3 seconds  | On-demand revalidation |
| **Draft preview**        | Instant      | Draft mode             |
| **Webhook failure**      | 0-60 seconds | ISR fallback           |
| **First visit (cached)** | <100ms       | CDN edge cache         |

---

## 🔒 Security Features

✅ **Webhook signature verification**: Prevents unauthorized revalidation  
✅ **Secret validation**: Only Sanity can trigger revalidation  
✅ **HTTPS only**: Encrypted communication  
✅ **Type-safe**: TypeScript validation

---

## 🐛 Troubleshooting

### Issue: "Changes not appearing live"

**Check**:

1. Webhook is configured correctly in Sanity
2. Webhook shows successful deliveries (200 status)
3. Environment variables are set on Netlify
4. Clear browser cache (Cmd+Shift+R)

**Test webhook manually**:

```bash
curl -X POST https://digiprint-main-web.netlify.app/api/revalidate?path=/blog \
  -H "Content-Type: application/json"
```

### Issue: "401 Invalid signature"

**Fix**:

- Verify `SANITY_REVALIDATE_SECRET` matches in both:
  - Netlify environment variables
  - Sanity webhook configuration

### Issue: "Webhook times out"

**Check**:

- Site is deployed and accessible
- API route exists: `https://your-site.netlify.app/api/revalidate`
- Netlify functions are not blocked

### Issue: "Some pages update, others don't"

**Check**:

- Document type is handled in `/api/revalidate/route.ts`
- Slug structure matches your routing

---

## 🚀 Deployment (Final Step)

Deploy the new revalidation API:

```bash
cd /Applications/MAMP/htdocs/FredCMs

# Commit changes
git add apps/web/src/app/api/revalidate/route.ts
git add apps/web/scripts/test-revalidation.js
git add docs/deployment/REALTIME_UPDATES_GUIDE.md
git commit -m "feat: Add on-demand revalidation for real-time CMS updates"

# Push to trigger Netlify deployment
git push origin main
```

Wait for Netlify deployment to complete (~2-3 minutes).

---

## ✅ Verification Checklist

After deployment:

- [ ] Netlify build completed successfully
- [ ] API route accessible: `https://your-site.netlify.app/api/revalidate`
- [ ] Sanity webhook configured and saved
- [ ] Test webhook shows 200 response
- [ ] Edit a post in Sanity Studio
- [ ] Publish the change
- [ ] Refresh live site - changes appear within 3 seconds
- [ ] Check Sanity webhook deliveries - all successful

---

## 🎉 Success Criteria

You'll know it's working when:

1. ✅ Edit content in Sanity Studio
2. ✅ Click "Publish"
3. ✅ Refresh your live site
4. ✅ **Changes appear in 1-3 seconds** (not 30-60 seconds)

---

## 📈 Further Optimizations

### 1. Reduce ISR Interval (Optional)

Since on-demand revalidation is instant, you can increase ISR interval:

```typescript
// In page files
export const revalidate = 3600; // 1 hour instead of 60 seconds
```

**Benefits**: Reduces server load, CDN serves more cached pages

### 2. Add Stale-While-Revalidate

```typescript
// In next.config.js
experimental: {
  swrDelta: 60, // Serve stale content while revalidating
}
```

### 3. Monitor Webhook Health

Create a dashboard to track:

- Webhook delivery success rate
- Revalidation response times
- Failed webhooks

### 4. Tag-Based Revalidation (Advanced)

For more granular control:

```typescript
// Generate tags for related content
export const generateTags = (type: string, id: string) => [
  `${type}:${id}`,
  `${type}:list`,
  "global",
];

// Revalidate by tag
revalidateTag(`product:${id}`);
```

---

## 📚 Related Documentation

- [ISR Setup Guide](./ISR_SETUP_GUIDE.md)
- [Bundle Optimization](../optimization/BUNDLE_OPTIMIZATION_GUIDE.md)
- [Quick Deploy Guide](./QUICK_DEPLOY_GUIDE.md)

---

## 🆘 Support

**Webhook not working?** Check:

1. Sanity webhook deliveries for error messages
2. Netlify function logs for errors
3. Run local test: `node scripts/test-revalidation.js post test`

**Need help?**

- Sanity Webhooks Docs: https://www.sanity.io/docs/webhooks
- Next.js Revalidation: https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration

---

**🎊 Congratulations! You now have WordPress-like instant updates with Next.js + Sanity!**
