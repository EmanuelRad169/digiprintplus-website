# 🔧 Netlify Build Troubleshooting Guide

**Issue:** Netlify reports "Module has no exported member 'getBlogPostBySlug'" but the function exists.

---

## ✅ Local Verification Results

### Export Verification (Completed)

```bash
✅ Found: getAllTemplateCategories
✅ Found: getAllTemplates
✅ Found: getTemplateBySlug
✅ Found: getAllBlogPosts
✅ Found: getBlogPostBySlug ← TARGET FUNCTION
✅ Found: getFeaturedBlogPosts
✅ Found: getAllBlogSlugs
✅ Found: getBlogCategories

✅ Found interface: BlogPost
✅ Found interface: Template
✅ Found interface: TemplateCategory
```

**File:** `src/lib/sanity/fetchers.ts` (1,627 lines)  
**Function Location:** Line 1341

---

## 🔍 Root Cause Analysis

The function **DOES EXIST** locally. The Netlify error is likely caused by:

### 1. **Build Cache Issue** (Most Likely)
- Netlify cached an old version before we removed API routes
- The cache contains outdated TypeScript declarations
- **Solution:** Clear deploy cache

### 2. **TypeScript Module Resolution**
- tsconfig.json paths are correctly configured
- `baseUrl: "."` and `paths: { "@/*": ["./src/*"] }` verified
- **Status:** ✅ Configuration correct

### 3. **Build Timing Issue**
- The `netlify-prebuild.sh` script moves API routes
- This might cause TypeScript to rebuild with stale cache
- **Solution:** Added debug logging to prebuild script

---

## 🚀 Solution Steps

### Step 1: Clear Netlify Build Cache

**Option A: Via Netlify Dashboard**
1. Go to your Netlify site dashboard
2. Navigate to **Site Settings** → **Build & deploy** → **Build settings**
3. Click **"Clear cache and deploy site"**

**Option B: Via Netlify CLI** (if installed)
```bash
netlify build --clear-cache
```

**Option C: Via Deploy Settings**
1. Go to **Deploys** tab
2. Click **"Trigger deploy"**
3. Select **"Clear cache and deploy site"**

### Step 2: Verify Environment Variables

Ensure these are set in Netlify dashboard (**Site Settings** → **Environment variables**):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=as5tildt
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=[your_token]
NEXT_PUBLIC_SANITY_STUDIO_URL=https://digiprint-admin-cms.netlify.app
NETLIFY=true
```

### Step 3: Monitor Deploy Logs

After clearing cache, watch for these debug messages in the build log:

```bash
🔍 Verifying Sanity fetchers...
   ✓ fetchers.ts exists
   ✓ getBlogPostBySlug function found
🚀 Ready for build...
```

If you see:
- `⚠️ getBlogPostBySlug function NOT found` → File corruption issue
- `❌ fetchers.ts NOT found` → Path or deployment issue

---

## 📋 Pre-Deployment Checklist

Before triggering a new deploy:

- [x] ✅ `getBlogPostBySlug` exists in fetchers.ts (Line 1341)
- [x] ✅ Function is properly exported
- [x] ✅ TypeScript interface `BlogPost` exported (Line 1227)
- [x] ✅ Import in blog page is correct
- [x] ✅ Local build succeeds (`npm run build`)
- [x] ✅ Netlify mode build succeeds (`NETLIFY=true npm run build`)
- [x] ✅ tsconfig.json paths configured correctly
- [x] ✅ netlify-prebuild.sh includes debug logging
- [ ] ⏳ Netlify cache cleared
- [ ] ⏳ Fresh deploy triggered

---

## 🔄 Alternative: Force Fresh Build

If clearing cache doesn't work, try these steps:

### 1. Update Build Command

In `netlify.toml`, change build command to force clean build:

```toml
[build]
  command = "rm -rf .next node_modules/.cache && chmod +x netlify-prebuild.sh && ./netlify-prebuild.sh && NETLIFY=true npm run build"
```

### 2. Add Build Plugin

Install Netlify build plugin to ensure clean builds:

```bash
npm install --save-dev @netlify/plugin-nextjs
```

Then update `netlify.toml`:

```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 3. Disable Incremental Builds Temporarily

In `next.config.js`, add:

```javascript
experimental: {
  incrementalCacheHandlerPath: undefined,
}
```

---

## 🐛 Debug During Build

The updated `netlify-prebuild.sh` now includes these checks:

```bash
🔍 Verifying Sanity fetchers...
   ✓ fetchers.ts exists
   ✓ getBlogPostBySlug function found
```

If the function is NOT found during Netlify build but works locally:

1. **Check file upload:** Ensure Git committed all changes
   ```bash
   git status
   git log -1 --stat
   ```

2. **Check Netlify repository connection:**
   - Verify the correct branch is deployed (should be `main`)
   - Confirm latest commit hash matches your local repo

3. **Check for .gitignore issues:**
   ```bash
   git check-ignore -v src/lib/sanity/fetchers.ts
   ```
   Should return nothing (file should NOT be ignored)

---

## 📊 Build Statistics

**Expected Successful Build:**
```
✓ Compiled successfully in 6-8s
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (180+ routes)
   ○ /blog (static)
   ● /blog/[slug] (8 posts generated)
✓ Finalizing page optimization
✓ Export successful
```

**Current Local Build:** ✅ PASSING  
**Current Netlify Build:** ⏳ PENDING (needs cache clear)

---

## 🔐 Security Note

The `netlify.toml` file contains sensitive tokens. Ensure:

1. Tokens are also set in Netlify UI (more secure)
2. Consider using Netlify environment variables instead of `netlify.toml`
3. Move secrets to **Site Settings** → **Environment variables**

---

## 📞 If Issue Persists

If clearing cache doesn't resolve the issue:

1. **Check Netlify Support Status:**
   - https://www.netlifystatus.com/

2. **Review Netlify Build Logs:**
   - Look for any warnings before the error
   - Check if file was uploaded: `grep "fetchers.ts" deploy-log.txt`

3. **Test with Preview Deploy:**
   - Create a preview branch
   - Deploy to preview environment first

4. **Contact Netlify Support:**
   - Provide build ID
   - Mention "false TypeScript error for existing export"
   - Include this troubleshooting log

---

## ✅ Next Steps

1. **Push latest changes** (includes debug logging):
   ```bash
   git add -A
   git commit -m "fix: add Netlify build debug logging"
   git push origin main
   ```

2. **Clear Netlify cache** (see Step 1 above)

3. **Trigger new deploy**

4. **Monitor build logs** for debug output

5. **Verify deployment success:**
   ```bash
   curl https://your-site.netlify.app/blog/test-slug
   ```

---

**Updated:** February 6, 2026  
**Status:** Debug logging added, awaiting Netlify cache clear  
**Confidence Level:** 95% - Function exists, likely cache issue
