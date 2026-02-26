# Netlify Build Cache Clear Guide

## If "This project is configured to use npm" error persists

The build cache might contain old npm artifacts. Here's how to clear it:

### Option 1: Through Netlify UI (Easiest)

1. Go to: <https://app.netlify.com/sites/digiprint-main-web/deploys>
2. Click **Site settings** → **Build & deploy** → **Environment**
3. Scroll down and click **Clear build cache**
4. Then click **Trigger deploy** → **Clear cache and deploy site**

### Option 2: Through Netlify CLI

```bash
# Clear cache and deploy
netlify build --clear-cache --filter digiprintplus-web

# Or for production
netlify deploy --build --prod --clear-cache --filter digiprintplus-web
```

### Option 3: Add Cache-Busting Environment Variable

1. Go to: <https://app.netlify.com/sites/digiprint-main-web/settings/deploys#environment>
2. Add new variable:
   - Key: `NETLIFY_CACHE_BUST`
   - Value: `$(date +%s)` or any random string
3. This forces Netlify to rebuild without cache

## What We Fixed

### Root Cause

- `.npmrc` files contained npm-specific settings (`legacy-peer-deps`, `engine-strict`)
- These made pnpm think npm was configured
- Manual `pnpm install` in build command conflicted with Netlify's auto-install

### Permanent Solution

1. ✅ Converted all `.npmrc` files to use pnpm-compatible settings
2. ✅ Created `force-pnpm` plugin to remove npm artifacts before build
3. ✅ Removed manual `pnpm install` from build command
4. ✅ Let Netlify auto-detect pnpm from `pnpm-lock.yaml` + `PNPM_VERSION`

## Verification

After deploy completes, you should see:

```
Installing pnpm version 9.15.0
✅ pnpm-lock.yaml found
✅ Force PNPM Plugin: Environment prepared for pnpm
```

## Troubleshooting

### If error still appears

1. Clear Netlify cache (see above)
2. Check no `package-lock.json` in repo: `find . -name "package-lock.json"`
3. Verify `packageManager` in root package.json: `"packageManager": "pnpm@9.15.0"`
4. Check Netlify build logs for PNPM_VERSION detection

### Current Configuration

- **Package Manager**: `pnpm@9.15.0`
- **Node Version**: `20.11.1`
- **Build Command**: `cd apps/web && pnpm run build`
- **Netlify automatically installs dependencies before build command**
