# 🚀 Deployment Hardening Quick Action Checklist

## ⏱️ 30-Minute Critical Fixes

### 1. Fix SEO Domain Issue (15 min)

**In Netlify Dashboard**:
1. Go to: <https://app.netlify.com/sites/digiprint-main-web/settings/deploys#environment>
2. Click **Add variable**
3. Add:
   - Key: `NEXT_PUBLIC_SITE_URL`
   - Value: `https://digiprint-main-web.netlify.app` (or your custom domain)
4. Click **Save**
5. Trigger new deployment: **Deploys → Trigger deploy → Deploy site**

**Verification** (after deploy):
```bash
curl https://digiprint-main-web.netlify.app/robots.txt
# Should show: Sitemap: https://[your-domain]/sitemap.xml

curl https://digiprint-main-web.netlify.app/sitemap.xml | head -20
# Should show: <loc>https://[your-domain]</loc>
```

### 2. Fix TypeScript Deprecation (5 min)

**File**: [apps/web/tsconfig.json](apps/web/tsconfig.json)

Add to `compilerOptions`:
```json
{
  "compilerOptions": {
    "ignoreDeprecations": "6.0",
    "baseUrl": ".",
    // ... rest stays the same
  }
}
```

**Verify**:
```bash
cd apps/web && pnpm type-check
# Should not show baseUrl deprecation warning
```

### 3. Fix Webhook TypeScript Error (5 min)

**File**: [netlify/functions/sanity-webhook.ts](netlify/functions/sanity-webhook.ts)

Change line 100:
```typescript
// Before:
const buildData = await netlifyResponse.json();

// After:
const buildData = (await netlifyResponse.json()) as { id: string };
```

### 4. Update Documentation (5 min)

**File**: [NETLIFY_ENV_VARS.txt](NETLIFY_ENV_VARS.txt)

Update:
```diff
- # Build command: npm run build
+ # Build command: cd apps/web && pnpm run build

- # Publish directory: .next
+ # Publish directory: apps/web/.next

- # Node version: 18 or higher
+ # Node version: 20.11.1 (locked in netlify.toml)
```

**Commit & Push**:
```bash
git add apps/web/tsconfig.json netlify/functions/sanity-webhook.ts NETLIFY_ENV_VARS.txt
git commit -m "Fix: Critical deployment issues - TypeScript, webhook types, docs"
git push origin main
```

---

## ⏱️ 1-Hour High Priority Tasks

### 5. Upgrade Netlify Plugin (20 min)

**Steps**:
1. Go to: <https://app.netlify.com/sites/digiprint-main-web/plugins>
2. Find `@netlify/plugin-nextjs` v4.41.6
3. Click **Remove** or **Uninstall**
4. Go to: <https://app.netlify.com/plugins/@netlify/plugin-nextjs>
5. Click **Install** → Select site → Install v5.15.8
6. Trigger new deployment
7. Check build logs for plugin version

**Remove from netlify.toml**:
```diff
- [[plugins]]
-   package = "@netlify/plugin-nextjs"
```

### 6. Verify All Environment Variables (20 min)

**In Netlify Dashboard**: <https://app.netlify.com/sites/digiprint-main-web/settings/deploys#environment>

**Checklist**:
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` = `as5tildt`
- [ ] `NEXT_PUBLIC_SANITY_DATASET` = `production`
- [ ] `NEXT_PUBLIC_SANITY_API_VERSION` = `2024-01-01`
- [ ] `SANITY_API_TOKEN` = (verify exists and has read permissions)
- [ ] `NEXT_PUBLIC_SITE_URL` = (your production domain)
- [ ] `SANITY_WEBHOOK_SECRET` = (verify exists)
- [ ] `NETLIFY_BUILD_HOOK_URL` = (verify exists)
- [ ] `NEXT_PUBLIC_SANITY_STUDIO_URL` = `https://digiprint-admin-cms.netlify.app`

**Optional Analytics**:
- [ ] `NEXT_PUBLIC_GA4_ID` = (if using Google Analytics 4)
- [ ] `NEXT_PUBLIC_GTM_ID` = (if using Google Tag Manager)

### 7. Harden Studio Deployment (20 min)

**File**: [apps/studio/netlify.toml](apps/studio/netlify.toml)

Replace entire content:
```toml
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20.11.1"
  PNPM_VERSION = "9.15.0"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

# Cache static assets
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

**Commit & Deploy**:
```bash
git add apps/studio/netlify.toml
git commit -m "feat: Harden Studio deployment with security headers and caching"
git push origin main
```

---

## ⏱️ 2-4 Hour Medium Priority Tasks

### 8. Align Package Versions (2 hours)

**Issue**: React version mismatch between Studio (19.x) and Web (18.x)

**Option A - Upgrade Web to React 19** (Recommended for new projects):
```bash
cd apps/web
pnpm update react@latest react-dom@latest @types/react@latest
pnpm install
pnpm type-check
pnpm build
```

**Option B - Downgrade Studio to React 18** (Safer for production):
```bash
cd apps/studio
pnpm add react@18 react-dom@18 @types/react@18
pnpm install
pnpm build
```

**Test thoroughly before deploying!**

### 9. Update ESLint (1 hour)

**Current**: ESLint 8.x with Next.js 15.x

**Update**:
```bash
cd apps/web
pnpm add -D eslint@9 eslint-config-next@latest
pnpm lint
```

**If errors occur**: May need to update ESLint config format to flat config

### 10. Add Comprehensive CSP (30 min)

**File**: [netlify.toml](netlify.toml)

Add after existing headers:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = """
      default-src 'self'; 
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; 
      style-src 'self' 'unsafe-inline'; 
      img-src 'self' data: blob: https: https://cdn.sanity.io; 
      font-src 'self' data:; 
      connect-src 'self' https://api.sanity.io https://*.netlify.app;
      frame-ancestors 'none';
    """
```

**Test**: Check browser console for CSP violations

---

## 🔍 Verification Commands

### After Each Deploy

**Check Site Status**:
```bash
curl -I https://digiprint-main-web.netlify.app
# Should return: HTTP/2 200
```

**Check Security Headers**:
```bash
curl -I https://digiprint-main-web.netlify.app | grep -i "x-frame\|x-xss\|x-content"
```

**Check SEO**:
```bash
curl https://digiprint-main-web.netlify.app/robots.txt
curl https://digiprint-main-web.netlify.app/sitemap.xml | head -20
```

**Check Webhook**:
```bash
curl https://digiprint-main-web.netlify.app/.netlify/functions/sanity-webhook
# Should return: {"message":"Sanity webhook endpoint is active","configured":true}
```

**Check Studio**:
```bash
curl -I https://digiprint-admin-cms.netlify.app
# Should return: HTTP/2 200
```

---

## 📊 Progress Tracking

### Critical Issues
- [ ] ✅ Set NEXT_PUBLIC_SITE_URL environment variable
- [ ] ✅ Fix TypeScript baseUrl deprecation
- [ ] ✅ Fix webhook TypeScript error
- [ ] ✅ Update NETLIFY_ENV_VARS.txt documentation

### High Priority
- [ ] 🟡 Upgrade @netlify/plugin-nextjs to v5.15.8
- [ ] 🟡 Verify all environment variables in Netlify
- [ ] 🟡 Harden Studio deployment configuration

### Medium Priority
- [ ] 🟢 Align React versions across monorepo
- [ ] 🟢 Update ESLint to v9.x
- [ ] 🟢 Add comprehensive Content-Security-Policy

### Optional Enhancements
- [ ] ⚪ Add preconnect hints for performance
- [ ] ⚪ Set up Lighthouse CI monitoring
- [ ] ⚪ Create deployment runbook

---

## 🆘 Troubleshooting

### If Build Fails After Changes

1. **Check Build Logs**: <https://app.netlify.com/sites/digiprint-main-web/deploys>
2. **Clear Cache**: Deploys → Options → Clear cache and deploy site
3. **Test Locally**:
   ```bash
   cd /Applications/MAMP/htdocs/FredCMs
   pnpm install
   cd apps/web
   pnpm build
   ```

### If Environment Variables Don't Apply

1. **Verify Saved**: Check Netlify Dashboard shows the variable
2. **Trigger Fresh Deploy**: Don't use "Retry deploy", use "Trigger deploy"
3. **Check Scoping**: Ensure variable applies to "All" or "Production" context

### If SEO Still Shows Wrong Domain

1. **Clear Browser Cache**
2. **Check Netlify CDN**: May take 5-10 minutes to propagate
3. **Force Rebuild**: Clear cache and deploy site
4. **Verify Env Var**: `echo $NEXT_PUBLIC_SITE_URL` in build logs

---

## 📅 Timeline Recommendation

**Day 1** (30 min):
- ✅ All critical fixes
- ✅ Commit and deploy

**Day 2** (1 hour):
- 🟡 Upgrade Netlify plugin
- 🟡 Verify environment variables
- 🟡 Harden Studio

**Week 2** (4 hours):
- 🟢 Align package versions
- 🟢 Update ESLint
- 🟢 Add CSP

**Ongoing**:
- Monitor build success rate
- Track Core Web Vitals
- Review security headers monthly

---

## ✅ Success Criteria

Your deployment is **production-ready** when:

- ✅ All builds succeed consistently
- ✅ robots.txt and sitemap.xml use correct domain
- ✅ No TypeScript errors or warnings
- ✅ Security headers pass security audit
- ✅ All environment variables verified
- ✅ Both sites (web + studio) deploy successfully
- ✅ Sanity webhook triggers builds correctly
- ✅ Forms submit and webhook endpoint responds

---

**Last Updated**: February 26, 2026  
**Reference**: See [DEPLOYMENT_AUDIT_REPORT.md](DEPLOYMENT_AUDIT_REPORT.md) for full analysis
