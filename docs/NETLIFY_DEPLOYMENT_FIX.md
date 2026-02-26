# Netlify Production Deployment Fix - February 25, 2026

## Problem

Production deployment to Netlify was failing with the error:

```
Error: You don't appear to be in a folder that is linked to a project
```

## Root Cause

This project is a **monorepo** with multiple packages (web, studio, config, hooks, types, ui, utils). When running Netlify CLI commands without specifying which project to use, Netlify was unable to determine which site to deploy to, causing the deployment to fail.

## Solution Applied

### 1. Updated Deployment Script

Modified [scripts/deployment/deploy-web.sh](scripts/deployment/deploy-web.sh) to include the `--filter` flag to specify the web app project:

**Before:**

```bash
netlify deploy --build --prod
```

**After:**

```bash
netlify deploy --build --prod --filter digiprintplus-web
```

This tells Netlify CLI to deploy the `digiprintplus-web` project specifically.

### 2. Site Information

- **Site ID**: `e3e4c5d4-99fa-41da-8608-99820d0a5bd5`
- **Site Name**: `digiprint-main-web`
- **URL**: http://digiprint-main-web.netlify.app
- **Admin URL**: https://app.netlify.com/projects/digiprint-main-web

### 3. Created Helper Script

Created [scripts/deployment/fix-netlify-link.sh](scripts/deployment/fix-netlify-link.sh) to recreate the Netlify link configuration if needed in the future.

## How to Deploy Now

### Production Deployment

```bash
./scripts/deployment/deploy-all.sh --prod
```

Or just the web app:

```bash
./scripts/deployment/deploy-web.sh --prod
```

### Preview Deployment

```bash
./scripts/deployment/deploy-all.sh
```

## Additional Notes

- The `--filter` flag is necessary for all Netlify CLI commands in monorepos
- The deployment script now properly specifies which project to deploy
- If you encounter the linking error again, run: `./scripts/deployment/fix-netlify-link.sh`

## Environment Variables

Make sure these are set in the Netlify dashboard (Settings → Environment variables):

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (should be "production")
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_TOKEN`
- `NEXT_PUBLIC_SITE_URL`

## Testing

After this fix, you can test with a preview deployment first:

```bash
./scripts/deployment/deploy-web.sh
```

Then proceed with production when ready:

```bash
./scripts/deployment/deploy-web.sh --prod
```
