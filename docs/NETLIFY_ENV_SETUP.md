# 🔐 Netlify Environment Variables Setup Guide

**Last Updated**: February 25, 2026  
**Required For**: Instant content updates + secure deployment pipeline

---

## 📋 Overview

This guide details ALL environment variables required for both Netlify sites to function correctly with instant Sanity content updates.

**Two Sites to Configure**:
1. **Web App** (digiprint-main-web)
2. **Studio** (digiprint-admin-cms)

---

## 🌐 Web App Environment Variables

**Site**: `digiprint-main-web`  
**URL**: https://digiprint-main-web.netlify.app  
**Dashboard**: https://app.netlify.com/sites/digiprint-main-web/settings/deploys#environment

### Required Variables (8 total)

#### 1. NEXT_PUBLIC_SANITY_PROJECT_ID ⭐ REQUIRED
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=as5tildt
```
- **Description**: Your Sanity project ID
- **Where to find**: Sanity Dashboard → Project Settings
- **Impact if missing**: Build fails, cannot fetch content
- **Visibility**: Public (exposed to browser)

---

#### 2. NEXT_PUBLIC_SANITY_DATASET ⭐ REQUIRED
```bash
NEXT_PUBLIC_SANITY_DATASET=production
```
- **Description**: Sanity dataset name
- **Common values**: `production`, `development`, `staging`
- **Impact if missing**: Uses default "production"
- **Visibility**: Public (exposed to browser)

---

#### 3. NEXT_PUBLIC_SANITY_API_VERSION ⭐ REQUIRED
```bash
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```
- **Description**: Sanity API version for queries
- **Format**: ISO date (YYYY-MM-DD)
- **Current**: `2024-01-01` (locked across web and studio)
- **Impact if missing**: Uses default, may cause inconsistencies
- **Visibility**: Public (exposed to browser)

---

#### 4. NEXT_PUBLIC_SANITY_STUDIO_URL ⭐ REQUIRED
```bash
NEXT_PUBLIC_SANITY_STUDIO_URL=https://digiprint-admin-cms.netlify.app
```
- **Description**: URL where Sanity Studio is hosted
- **Value**: Your studio Netlify subdomain
- **Impact if missing**: CORS errors, preview links broken
- **Visibility**: Public (exposed to browser)
- **Note**: Do NOT add trailing slash

---

#### 5. NEXT_PUBLIC_SITE_URL ⭐ REQUIRED
```bash
NEXT_PUBLIC_SITE_URL=https://digiprint-main-web.netlify.app
```
- **Description**: Canonical URL of your website
- **Value**: Your web app Netlify subdomain
- **Impact if missing**: SEO issues, Open Graph broken
- **Visibility**: Public (exposed to browser)
- **Note**: Do NOT add trailing slash
- **Future**: Update when migrating to custom domain

---

#### 6. SANITY_API_TOKEN 🔒 SECRET
```bash
SANITY_API_TOKEN=skXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
- **Description**: Sanity read token for build-time content fetching
- **How to create**:
  1. Go to: https://www.sanity.io/manage/personal/tokens
  2. Click "Add API token"
  3. Name: `netlify-web-readonly`
  4. Permissions: **Viewer** (read-only is sufficient)
  5. Copy the token (you'll only see it once)
- **Impact if missing**: Build fails, cannot fetch content
- **Visibility**: SECRET (server-side only, never exposed)
- **Security**: Never commit this to git

---

#### 7. SANITY_WEBHOOK_SECRET 🔒 SECRET
```bash
SANITY_WEBHOOK_SECRET=$(openssl rand -base64 32)
```
- **Description**: Secret for validating Sanity webhook signatures
- **How to generate**:
  ```bash
  openssl rand -base64 32
  # Example output: K8x2Jz9mP3vN7wQ4rT6yU8sA1bC5dE0f...
  ```
- **Impact if missing**: Webhook validation fails, security risk
- **Visibility**: SECRET (used in webhook function)
- **Security**: Must match value in Sanity webhook config
- **Save this**: You'll need it again for Step 3

---

#### 8. SANITY_REVALIDATE_SECRET 🔒 SECRET ⚡ NEW
```bash
SANITY_REVALIDATE_SECRET=$(openssl rand -base64 32)
```
- **Description**: Secret for authenticating instant revalidation requests
- **How to generate**:
  ```bash
  openssl rand -base64 32
  # Example output: M5a9Lk3Pq7RtYu2Wv8Zx1Bn4Cd6Fg0Hi...
  ```
- **Impact if missing**: Falls back to full rebuild (slower updates)
- **Visibility**: SECRET (used in webhook + revalidate endpoint)
- **Purpose**: Enables 1-5 second content updates
- **Status**: Optional but HIGHLY recommended

---

#### 9. NETLIFY_BUILD_HOOK_URL 🔒 SECRET
```bash
NETLIFY_BUILD_HOOK_URL=https://api.netlify.com/build_hooks/XXXXXXXXXXXXX
```
- **Description**: Netlify build hook URL for triggering full rebuilds
- **How to create**:
  1. Go to: https://app.netlify.com/sites/digiprint-main-web/settings/deploys#build-hooks
  2. Click "Add build hook"
  3. Name: `Sanity Content Update`
  4. Branch: `main`
  5. Copy the URL
- **Impact if missing**: Fallback rebuild fails if instant revalidation unavailable
- **Visibility**: SECRET (not public, but not highly sensitive)
- **Purpose**: Fallback when instant revalidation fails

---

### Optional Variables (Analytics, Optimization)

#### NEXT_PUBLIC_GA4_ID
```bash
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
```
- **Description**: Google Analytics 4 tracking ID
- **Impact if missing**: No analytics tracking
- **Visibility**: Public

---

#### NEXT_PUBLIC_GTM_ID
```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```
- **Description**: Google Tag Manager container ID
- **Impact if missing**: No GTM tracking
- **Visibility**: Public

---

## 🎨 Studio Environment Variables

**Site**: `digiprint-admin-cms`  
**URL**: https://digiprint-admin-cms.netlify.app  
**Dashboard**: https://app.netlify.com/sites/digiprint-admin-cms/settings/deploys#environment

### Required Variables (1 total)

#### SANITY_STUDIO_PRODUCTION_URL
```bash
SANITY_STUDIO_PRODUCTION_URL=https://digiprint-admin-cms.netlify.app
```
- **Description**: URL where the studio is hosted (for CORS)
- **Impact if missing**: CORS errors when accessing from other origins
- **Visibility**: Used by Sanity Studio config

---

## 🚀 How to Set Environment Variables in Netlify

### Method 1: Via Netlify Dashboard (Recommended)

1. **Navigate to Site Settings**:
   - Web: https://app.netlify.com/sites/digiprint-main-web/settings/deploys#environment
   - Studio: https://app.netlify.com/sites/digiprint-admin-cms/settings/deploys#environment

2. **Add Each Variable**:
   - Click "Edit variables" or "Add a variable"
   - Key: Enter exact name (e.g., `SANITY_API_TOKEN`)
   - Value: Paste the value
   - Scopes: Leave as "All scopes" (default)
   - Click "Set variable" or "Save"

3. **Verify All Variables**:
   - Check the list shows all required variables
   - Ensure no typos in names
   - Values should NOT have quotes around them

4. **Trigger New Deploy**:
   - Navigate to: Deploys tab
   - Click "Trigger deploy" → "Clear cache and deploy site"
   - This ensures new env vars are picked up

---

### Method 2: Via Netlify CLI (Advanced)

```bash
# Set environment variable for web site
netlify env:set SANITY_API_TOKEN "skXXXXXXXXXX" --site digiprint-main-web

# List all environment variables (verify)
netlify env:list --site digiprint-main-web

# Set environment variable for studio site
netlify env:set SANITY_STUDIO_PRODUCTION_URL "https://digiprint-admin-cms.netlify.app" --site digiprint-admin-cms
```

---

## ✅ Verification

### Verify Environment Variables Are Set

```bash
# Option 1: Via Netlify CLI
netlify env:list --site digiprint-main-web

# Option 2: Via build logs
# Deploy the site and check build logs for:
# "✅ All required environment variables are configured"
```

### Verify Build Succeeds

After setting all variables, the build should pass validation:

```bash
# You should see in build logs:
🔍 Validating Netlify Environment Variables...

✅ All required environment variables are configured

✅ VALIDATION SUCCESSFUL
Build can proceed safely.
```

---

## 🔧 Troubleshooting

### Build Fails with "MISSING: NEXT_PUBLIC_SANITY_PROJECT_ID"

**Cause**: Environment variable not set or misspelled

**Fix**:
1. Check Netlify Dashboard → Environment Variables
2. Ensure exact name: `NEXT_PUBLIC_SANITY_PROJECT_ID` (case-sensitive)
3. Ensure value is set (not empty)
4. Redeploy: "Clear cache and deploy site"

---

### Webhook Returns 401/403 Errors

**Cause**: `SANITY_WEBHOOK_SECRET` mismatch

**Fix**:
1. Verify secret in Netlify matches Sanity webhook config
2. Generate a new secret if needed:
   ```bash
   openssl rand -base64 32
   ```
3. Update in BOTH places:
   - Netlify: Environment Variables
   - Sanity: Manage → API → Webhooks → Edit → Secret

---

### Content Updates Trigger Full Rebuild (Slow)

**Cause**: `SANITY_REVALIDATE_SECRET` not set

**Fix**:
1. Generate secret:
   ```bash
   openssl rand -base64 32
   ```
2. Add to Netlify: `SANITY_REVALIDATE_SECRET=<value>`
3. Redeploy
4. Test: Edit content in Sanity, should update in 1-5 seconds

---

### CORS Errors in Studio

**Cause**: `NEXT_PUBLIC_SANITY_STUDIO_URL` or `SANITY_STUDIO_PRODUCTION_URL` incorrect

**Fix**:
1. Ensure web app has: `NEXT_PUBLIC_SANITY_STUDIO_URL=https://digiprint-admin-cms.netlify.app`
2. Ensure studio has: `SANITY_STUDIO_PRODUCTION_URL=https://digiprint-admin-cms.netlify.app`
3. No trailing slashes
4. Exact URLs (check for typos)
5. Redeploy both sites

---

## 📚 Quick Reference

### Copy-Paste Template (Web App)

```bash
# Required - Replace with your actual values
NEXT_PUBLIC_SANITY_PROJECT_ID=as5tildt
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_SANITY_STUDIO_URL=https://digiprint-admin-cms.netlify.app
NEXT_PUBLIC_SITE_URL=https://digiprint-main-web.netlify.app
SANITY_API_TOKEN=skXXXXXXXXXXXXXXXXXXXXXXXX
SANITY_WEBHOOK_SECRET=K8x2Jz9mP3vN7wQ4rT6yU8sA1bC5dE0f
SANITY_REVALIDATE_SECRET=M5a9Lk3Pq7RtYu2Wv8Zx1Bn4Cd6Fg0Hi
NETLIFY_BUILD_HOOK_URL=https://api.netlify.com/build_hooks/XXXXXXXXXXXXX

# Optional
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### Copy-Paste Template (Studio)

```bash
SANITY_STUDIO_PRODUCTION_URL=https://digiprint-admin-cms.netlify.app
```

---

## 🔗 Related Documentation

- [Sanity Webhook Setup](./SANITY_WEBHOOK_SETUP.md) - Configure webhooks in Sanity
- [Deployment Runbook](./DEPLOYMENT_RUNBOOK.md) - Complete deployment guide
- [Quick Action Checklist](./QUICK_ACTION_CHECKLIST.md) - Pre-deployment checklist

---

## 🆘 Support

**Issue**: Variable not showing up after setting  
**Solution**: Clear cache and redeploy

**Issue**: Build still fails after setting all variables  
**Solution**: Check build logs for specific missing variable, verify exact spelling

**Issue**: Need to update variable value  
**Solution**: Edit in Netlify Dashboard → Save → Trigger deploy

---

**Setup Complete?** ✅  
Next step: [Configure Sanity Webhook](./SANITY_WEBHOOK_SETUP.md)
