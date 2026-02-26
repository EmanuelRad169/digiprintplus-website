# 📘 Netlify Deployment Runbook

Complete guide for deploying and maintaining the DigiPrintPlus Netlify infrastructure.

**Last Updated**: February 26, 2026  
**Status**: Production-Ready ✅

---

## 🌐 Site Overview

| Site | URL | Purpose | Netlify Site ID |
|------|-----|---------|-----------------|
| **Web App** | https://digiprint-main-web.netlify.app | Main customer-facing website | `e3e4c5d4-99fa-41da-8608-99820d0a5bd5` |
| **Sanity Studio** | https://digiprint-admin-cms.netlify.app | Content management system | Check Netlify dashboard |

---

##  1. Prerequisites

### Required Access
- ✅ Netlify account with team/site access
- ✅ Sanity project access (Project ID: `as5tildt`)
- ✅ GitHub repository write access
- ✅ Local environment with Node 20.11.1 + pnpm 9.15.0

### Required Environment Variables

**Web App** (`digiprint-main-web`):
```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=as5tildt
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_SANITY_STUDIO_URL=https://digiprint-admin-cms.netlify.app

# Sanity API Access
SANITY_API_TOKEN=<read-token-from-sanity>

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://digiprint-main-web.netlify.app

# Webhook & Revalidation
SANITY_WEBHOOK_SECRET=<generate-random-string>
SANITY_REVALIDATE_SECRET=<generate-random-string>
NETLIFY_BUILD_HOOK_URL=<from-netlify-build-hooks>

# Optional Analytics
NEXT_PUBLIC_GA4_ID=<google-analytics-id>
NEXT_PUBLIC_GTM_ID=<google-tag-manager-id>
```

**Sanity Studio** (`digiprint-admin-cms`):
```bash
# Studio Configuration
SANITY_STUDIO_PRODUCTION_URL=https://digiprint-main-web.netlify.app
SANITY_STUDIO_PREVIEW_SECRET=<same-as-revalidate-secret>
```

---

## 🚀 2. Initial Setup

### A. Configure Netlify Sites

**Web App Setup**:
```bash
# 1. Link local repo to Netlify
cd /path/to/FredCMs
netlify link --filter digiprintplus-web

# 2. Set all environment variables
netlify env:set NEXT_PUBLIC_SANITY_PROJECT_ID "as5tildt" --filter digiprintplus-web
netlify env:set NEXT_PUBLIC_SANITY_DATASET "production" --filter digiprintplus-web
# ... (repeat for all variables)

# 3. Verify configuration
tsx apps/web/scripts/verify-netlify-env.ts
```

**Studio Setup**:
```bash
# Similar process for studio site
netlify link --filter digiprintplus-studio
```

### B. Configure Sanity Webhooks

1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select project `as5tildt` → API → Webhooks
3. Create webhook:
   - **Name**: "Netlify On-Demand Revalidation"
   - **URL**: `https://digiprint-main-web.netlify.app/.netlify/functions/sanity-webhook`
   - **Dataset**: `production`
   - **Trigger on**: Create, Update, Delete
   - **Filter**: `_type in ["product", "post", "service", "page"]`
   - **Secret**: Use `SANITY_WEBHOOK_SECRET` value
   - **HTTP method**: POST
   - **API version**: `2024-01-01`

### C. Configure Netlify Build Hooks

1. Go to Netlify Dashboard → Site Settings → Build & deploy → Build hooks
2. Create build hook: "Sanity Content Update"
3. Copy URL and set as `NETLIFY_BUILD_HOOK_URL` environment variable

---

## 🔄 3. Deployment Workflows

### A. Automated Deployments (Git Push)

**Trigger**: Push to `main` branch

```bash
# Standard deployment flow
git add .
git commit -m "feat: your changes"
git push origin main

# Netlify automatically:
# 1. Detects push to main
# 2. Runs build verification
# 3. Builds web app
# 4. Deploys to production
```

**Build Process**:
```
1. Install pnpm 9.15.0
2. Run pnpm install --frozen-lockfile
3. Execute: tsx apps/web/scripts/verify-netlify-env.ts
4. Execute: cd apps/web && pnpm run build
5. Deploy .next output
6. Deploy functions from netlify/functions/
```

### B. Manual Deployments

**Preview Deploy** (for testing):
```bash
netlify deploy --build --filter digiprintplus-web

# Review preview URL, then promote to production:
netlify deploy --prod --alias production --filter digiprintplus-web
```

**Production Deploy** (direct):
```bash
#Full production deployment
netlify deploy --build --prod --filter digiprintplus-web
```

### C. Sanity Content Updates

**How it works**:

1. **Instant Updates** (preferred):
   - Editor saves content in Sanity Studio
   - Webhook triggers `sanity-webhook` function
   - Function calls `/api/revalidate` endpoint
   - ISR cache cleared for specific page
   - **Update visible in ~1-5 seconds** ⚡

2. **Full Rebuild** (fallback):
   - If revalidation fails
   - Webhook triggers Netlify build hook
   - Full site rebuild (~1-2 minutes)
   - All pages regenerated

**Testing Content Updates**:
```bash
# 1. Edit a product in Sanity Studio
# 2. Save and publish
# 3. Check Netlify Function logs
# 4. Verify update appears on site immediately
```

---

## 🔍 4. Verification & Testing

### Pre-Deployment Checks

```bash
# Verify environment variables
npm run verify:env

# Type check
cd apps/web && pnpm type-check

# Lint check
pnpm lint

# Test build locally
pnpm build
```

### Post-Deployment Verification

**Automated**:
```bash
# Run full verification suite
npm run verify:deployment

# Or run smoke tests
bash scripts/deployment/netlify-smoke.sh
```

**Manual Checks**:
1. ✅ Visit https://digiprint-main-web.netlify.app
2. ✅ Check critical pages load (/, /products, /blog)
3. ✅ Verify webhook: `curl https://digiprint-main-web.netlify.app/.netlify/functions/sanity-webhook`
4. ✅ Test Sanity content update
5. ✅ Check robots.txt and sitemap.xml

---

## 📊 5. Monitoring & Logs

### Where to Check Logs

**Netlify Build Logs**:
- URL: `https://app.netlify.com/sites/digiprint-main-web/deploys`
- Shows: Build output, errors, warnings, deployment status

**Netlify Function Logs**:
- URL: `https://app.netlify.com/sites/digiprint-main-web/functions`
- Shows: Webhook executions, errors, revalidation attempts
- Filter by: `sanity-webhook`

**Real-time Logs** (CLI):
```bash
# Stream function logs
netlify functions:log sanity-webhook --filter digiprintplus-web

# Stream build logs  
netlify watch --filter digiprintplus-web
```

### Key Metrics to Monitor

| Metric | Target | Warning |
|--------|--------|---------|
| Build Time | <2 minutes | >3 minutes |
| Build Success Rate | >95% | <90% |
| Function Execution Time | <1 second | >3 seconds |
| Page Load Time (P95) | <1 second | >2 seconds |
| ISR Revalidation | <5 seconds | >10 seconds |

---

## 🚨 6. Troubleshooting

### Build Failures

**"This project is configured to use npm"**:
- **Cause**: npm artifacts in cache
- **Fix**: Clear build cache in Netlify → "Clear cache and deploy site"

**"Missing environment variable"**:
- **Cause**: Env var not set in Netlify
- **Fix**: 
  ```bash
  netlify env:list --filter digiprintplus-web
  netlify env:set VAR_NAME "value" --filter digiprintplus-web
  ```

**TypeScript Errors**:
- **Cause**: Type mismatches or missing exports
- **Fix**: Run `pnpm type-check` locally to identify issues

### Content Not Updating

**Instant updates not working**:
1. Check Function logs for revalidation errors
2. Verify `SANITY_REVALIDATE_SECRET` is set
3. Verify `NEXT_PUBLIC_SITE_URL` is correct
4. Test revalidation endpoint:
   ```bash
   curl -X POST "https://digiprint-main-web.netlify.app/api/revalidate?secret=YOUR_SECRET&path=/products/test"
   ```

**Full rebuilds not triggering**:
1. Check Sanity webhook configuration
2. Verify `NETLIFY_BUILD_HOOK_URL` is set
3. Check Netlify Function logs for errors
4. Test webhook manually:
   ```bash
   curl -X POST https://digiprint-main-web.netlify.app/.netlify/functions/sanity-webhook
   ```

### Performance Issues

**Slow page loads**:
- Check ISR configuration (should be 60 seconds for most pages)
- Verify CDN cache headers are set
- Run Lighthouse audit

**Large bundle size**:
- Run bundle analyzer: `pnpm analyze`
- Check for unnecessary dependencies
- Verify tree-shaking is working

---

## 🔧 7. Maintenance Tasks

### Weekly

- [ ] Review deployment logs for errors
- [ ] Check function execution metrics
- [ ] Verify webhook success rate
- [ ] Test critical user flows

### Monthly

- [ ] Update dependencies: `pnpm update`
- [ ] Review and clear old deployments
- [ ] Audit environment variables
- [ ] Run full verification suite
- [ ] Review Core Web Vitals metrics

### Quarterly

- [ ] Audit security headers
- [ ] Review and update documentation
- [ ] Performance optimization review
- [ ] Dependency security audit: `pnpm audit`

---

## 📝 8. Quick Reference Commands

```bash
# Deploy web to production
netlify deploy --build --prod --filter digiprintplus-web

# Deploy studio to production
netlify deploy --build --prod --filter digiprintplus-studio

# View environment variables
netlify env:list --filter digiprintplus-web

# Set environment variable
netlify env:set VAR_NAME "value" --filter digiprintplus-web

# Stream function logs
netlify functions:log sanity-webhook --filter digiprintplus-web

# Run verification suite
npm run verify:deployment

# Run smoke tests
bash scripts/deployment/netlify-smoke.sh

# Check build locally
cd apps/web && pnpm build

# Test env vars
tsx apps/web/scripts/verify-netlify-env.ts

# Clear local Next.js cache
cd apps/web && rm -rf .next

# View production build analytics
cd apps/web && pnpm analyze
```

---

## 🎯 9. Success Criteria

A deployment is considered successful when:

- ✅ Build completes in <2 minutes
- ✅ All verification checks pass
- ✅ Homepage loads in <1 second
- ✅ Sanity webhook responds with 200
- ✅ Content updates appear within 5 seconds
- ✅ Security headers present on all pages
- ✅ robots.txt and sitemap.xml accessible
- ✅ No console errors in browser
- ✅ Forms submit successfully
- ✅ All critical pages load (/, /products, /blog, /contact)

---

## 📞 10. Support & Resources

### Documentation

- [Netlify Docs](https://docs.netlify.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Sanity Docs](https://www.sanity.io/docs)
- [Project README](../README.md)

### Configuration Files

- Web config: [`netlify.toml`](../netlify.toml)
- Studio config: [`apps/studio/netlify.toml`](../apps/studio/netlify.toml)
- Next.js config: [`apps/web/next.config.js`](../apps/web/next.config.js)
- Sanity config: [`apps/studio/sanity.config.ts`](../apps/studio/sanity.config.ts)

### Scripts

- Env verification: [`apps/web/scripts/verify-netlify-env.ts`](../apps/web/scripts/verify-netlify-env.ts)
- Deployment verification: [`scripts/verify-deployment.ts`](../scripts/verify-deployment.ts)
- Smoke tests: [`scripts/deployment/netlify-smoke.sh`](../scripts/deployment/netlify-smoke.sh)

### Emergency Contacts

- **Netlify Status**: https://www.netlifystatus.com/
- **Sanity Status**: https://status.sanity.io/

---

## ✅ Deployment Checklist

Use this before each major release:

### Pre-Deployment

- [ ] Run `pnpm verify:env` - all env vars valid
- [ ] Run `pnpm type-check` - no TypeScript errors
- [ ] Run `pnpm lint` - no linting errors
- [ ] Run `pnpm build` locally - build succeeds
- [ ] Test critical flows locally
- [ ] Review changed files
- [ ] Update documentation if needed

### Deployment

- [ ] Push to `main` or run `netlify deploy --prod`
- [ ] Monitor build logs for errors
- [ ] Wait for "Deploy successful" confirmation

### Post-Deployment

- [ ] Run `npm run verify:deployment`
- [ ] Test homepage and critical pages
- [ ] Test Sanity content update
- [ ] Verify webhook endpoint responds
- [ ] Check security headers
- [ ] Test form submissions
- [ ] Verify SEO files (robots.txt, sitemap.xml)

### Rollback Plan

If deployment fails:
```bash
# Option 1: Rollback in Netlify UI
# Go to Deploys → Click previous successful deploy → "Publish deploy"

# Option 2: Revert git commit
git revert HEAD
git push origin main

# Option 3: Deploy specific commit
git checkout <previous-commit>
netlify deploy --prod --filter digiprintplus-web
```

---

**End of Runbook** | Version 2.0 | February 26, 2026
