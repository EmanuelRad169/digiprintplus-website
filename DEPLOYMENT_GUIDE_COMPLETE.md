# 🚀 DigiPrint+ Deployment Guide - Complete Workflow

## Quick Start

```bash
# 1. Run auto-fix to prepare for deployment
npm run fix:deploy

# 2. Run audit to verify everything is ready
npm run audit:deploy

# 3. Test local build
cd apps/web && npm run build && npx serve@latest out

# 4. After deploying to Netlify, verify the deployment
npm run verify:deployment https://your-site.netlify.app
```

## Scripts Overview

| Script | Command | Purpose |
|--------|---------|---------|
| **Auto-Fix** | `npm run fix:deploy` | Automatically fixes common deployment issues |
| **Audit** | `npm run audit:deploy` | Comprehensive 6-phase audit of deployment readiness |
| **Verify Deployment** | `npm run verify:deployment [URL]` | Tests all routes after deployment |
| **Verify Environment** | `npm run verify:env` | Quick Sanity connection check |

## Complete Deployment Process

### Phase 1: Pre-Deployment Checks

1. **Run Auto-Fix**
   ```bash
   npm run fix:deploy
   ```
   This will:
   - ✅ Update `robots.ts` to use environment variables
   - ✅ Update `sitemap.ts` to use environment variables
   - ✅ Validate `.env.local` configuration
   - ✅ Create `NETLIFY_ENV_VARS.txt` template
   - ✅ Validate Next.js config
   - ✅ Generate `DEPLOYMENT_CHECKLIST.md`

2. **Run Comprehensive Audit**
   ```bash
   npm run audit:deploy
   ```
   This checks:
   - Environment variables (local vs Netlify)
   - Sanity connection & dataset
   - GROQ queries & dynamic routes
   - SEO files (robots.txt, sitemap.xml)
   - Build configuration

3. **Review Generated Files**
   - `NETLIFY_ENV_VARS.txt` - Environment variables to set in Netlify
   - `DEPLOYMENT_CHECKLIST.md` - Step-by-step deployment guide

### Phase 2: Local Testing

1. **Test Static Build**
   ```bash
   cd apps/web
   npm run build
   ```

2. **Serve Locally**
   ```bash
   npx serve@latest out
   ```

3. **Verify Routes**
   - Homepage: http://localhost:3000
   - Products: http://localhost:3000/products
   - Dynamic product: http://localhost:3000/products/business-cards-premium
   - SEO: http://localhost:3000/robots.txt
   - Sitemap: http://localhost:3000/sitemap.xml

### Phase 3: Netlify Configuration

#### A. Set Environment Variables

1. Go to Netlify Dashboard
2. Select your site
3. **Settings** → **Environment variables**
4. Add all variables from `NETLIFY_ENV_VARS.txt`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=as5tildt
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your-token-here
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
```

**Important**: 
- Get `SANITY_API_TOKEN` from Sanity.io dashboard
- Update `NEXT_PUBLIC_SITE_URL` to your actual Netlify URL
- Ensure all values match your production environment

#### B. Configure Build Settings

1. **Build command**: `npm run build:netlify`
2. **Publish directory**: `out`
3. **Node version**: `18` or higher

Set these in:
- **Settings** → **Build & deploy** → **Build settings**

Or create/update `netlify.toml`:
```toml
[build]
  command = "npm run build:netlify"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"
```

### Phase 4: Deploy

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "chore: deployment ready"
   git push
   ```

2. **Trigger Netlify Deploy**
   - Automatic: Netlify will auto-deploy from GitHub
   - Manual: Click "Trigger deploy" in Netlify dashboard

3. **Monitor Build Logs**
   - Check for errors in Netlify build logs
   - Verify all pages are generated
   - Look for missing environment variables

### Phase 5: Post-Deployment Verification

1. **Run Verification Script**
   ```bash
   npm run verify:deployment https://your-site.netlify.app
   ```

2. **Manual Testing Checklist**
   - [ ] Homepage loads
   - [ ] Static pages work (/about, /services, /contact)
   - [ ] Products page loads
   - [ ] Dynamic product pages work
   - [ ] Sanity content appears
   - [ ] Images load correctly
   - [ ] SEO files accessible:
     - https://your-site.netlify.app/robots.txt
     - https://your-site.netlify.app/sitemap.xml
   - [ ] Forms work (if applicable)
   - [ ] Navigation functions properly

## Troubleshooting

### Issue: Routes Return 404

**Symptoms**: Product or blog pages show 404 errors

**Solutions**:
1. Check Netlify deploy logs for "Page not found" errors
2. Verify `generateStaticParams()` exists in dynamic route files
3. Ensure Sanity content has valid slugs:
   ```bash
   npm run verify:env
   ```
4. Check if content is published (not drafts) in Sanity Studio
5. Clear Netlify cache and redeploy

### Issue: Sanity Content Doesn't Load

**Symptoms**: Pages load but show no content from Sanity

**Solutions**:
1. Verify environment variables in Netlify dashboard
2. Check `SANITY_API_TOKEN` has read permissions
3. Ensure `NEXT_PUBLIC_SANITY_DATASET` is set to "production"
4. Test API connection:
   ```bash
   npm run verify:env
   ```
5. Check Sanity Studio - verify content is published

### Issue: SEO Files Not Working

**Symptoms**: /robots.txt or /sitemap.xml return 404

**Solutions**:
1. Verify files have `dynamic = 'force-static'` export:
   - `apps/web/src/app/robots.ts`
   - `apps/web/src/app/sitemap.ts`
2. Check build output includes these files
3. Verify Next.js config has `output: "export"` for Netlify
4. Redeploy with cache cleared

### Issue: Build Fails on Netlify

**Symptoms**: Netlify build fails with errors

**Common Causes & Solutions**:

1. **Missing Environment Variables**
   - Add all required vars from `NETLIFY_ENV_VARS.txt`

2. **TypeScript Errors**
   - Fix all type errors locally first
   - Run: `cd apps/web && npm run type-check`

3. **Out of Memory**
   - Build command already includes: `NODE_OPTIONS='--max-old-space-size=4096'`
   - If still failing, contact Netlify support

4. **Dependency Issues**
   - Clear Netlify cache: **Deploys** → **Trigger deploy** → **Clear cache and deploy**

## Environment Variables Reference

### Required for Frontend (digiprint-main-web)

| Variable | Example | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `as5tildt` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Sanity dataset name |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-01-01` | Sanity API version |
| `SANITY_API_TOKEN` | `sk...` | Sanity API token (read permissions) |
| `NEXT_PUBLIC_SITE_URL` | `https://your-site.com` | Production site URL |

### Optional Variables

| Variable | Purpose |
|----------|---------|
| `SANITY_REVALIDATE_SECRET` | For draft/preview mode |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager |

## Sanity Configuration

### Required Permissions

Your `SANITY_API_TOKEN` must have:
- ✅ **Viewer** role (read access)
- ✅ Access to the `production` dataset

### How to Get API Token

1. Go to https://www.sanity.io/manage
2. Select your project
3. **API** → **Tokens**
4. **Add API token**
5. Give it a descriptive name (e.g., "Netlify Production")
6. Select **Viewer** permissions
7. Copy the token (shown only once!)

### Verify Content is Ready

1. **Products**: Must have `slug` field filled
2. **Blog Posts**: Must have `slug` field filled
3. **All Content**: Must be published (not drafts)

Check in Sanity Studio or run:
```bash
npm run audit:deploy
```

## Additional Resources

- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Detailed checklist
- [NETLIFY_ENV_VARS.txt](./NETLIFY_ENV_VARS.txt) - Environment variables template
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Netlify Documentation](https://docs.netlify.com/)
- [Sanity API Tokens](https://www.sanity.io/docs/http-auth)

## Quick Commands Reference

```bash
# Audit & Fix
npm run fix:deploy              # Auto-fix common issues
npm run audit:deploy            # Full deployment audit
npm run verify:env              # Quick Sanity check

# Build & Test
cd apps/web
npm run build                   # Local build test
npm run build:netlify           # Netlify-specific build
npx serve@latest out            # Serve static build

# Post-Deployment
npm run verify:deployment <URL> # Verify deployed site

# Development
npm run dev:web                 # Start web dev server
npm run dev:studio              # Start Sanity Studio
```

## Support

If you encounter issues not covered here:
1. Check build logs in Netlify dashboard
2. Run `npm run audit:deploy` for diagnostic info
3. Review Sanity Studio content
4. Check browser console for client-side errors

---

**Last Updated**: $(date)
**Next.js Version**: 15.5.11
**Node Version**: 18+
