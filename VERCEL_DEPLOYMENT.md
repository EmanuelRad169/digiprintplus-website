# Vercel Deployment Guide - pnpm Monorepo

## 🎯 Project Structure

This is a pnpm workspace monorepo with the following structure:

```
FredCMs/
├── apps/
│   ├── web/          # Next.js web application
│   └── studio/       # Sanity Studio
├── packages/
│   ├── ui/           # Shared UI components
│   ├── utils/        # Shared utilities
│   ├── hooks/        # Shared React hooks
│   └── types/        # Shared TypeScript types
├── vercel.json       # Root Vercel config (for web deployment)
└── pnpm-workspace.yaml
```

## 📦 Package Manager Configuration

**Required:** This project uses `pnpm` as the package manager.

- `package.json` specifies: `"packageManager": "pnpm@9.15.0"`
- `pnpm-workspace.yaml` defines workspace packages
- All dependencies are managed via pnpm workspace protocol

## 🔧 Vercel Project Settings

### For Web App (apps/web)

**Root Directory:** `./` (monorepo root)

**Build & Development Settings:**
- **Install Command:** `pnpm install --frozen-lockfile`
- **Build Command:** `pnpm -w -F digiprintplus-web run build`
- **Dev Command:** `pnpm -w -F digiprintplus-web run dev`
- **Output Directory:** `apps/web/.next`
- **Framework Preset:** Next.js

### For Studio App (apps/studio)

**Root Directory:** `./` (monorepo root)

**Build & Development Settings:**
- **Install Command:** `pnpm install --frozen-lockfile`
- **Build Command:** `pnpm -w -F digiprintplus-studio run build`
- **Dev Command:** `pnpm -w -F digiprintplus-studio run dev`
- **Output Directory:** `apps/studio/dist`
- **Framework Preset:** Other

## 🚀 Deployment Process

### Automatic Deployments

Pushing to `main` branch triggers automatic deployments for:
- **Web App:** https://digiprintplus.vercel.app
- **Studio:** https://studio.digiprintplus.vercel.app

### Manual Deployment

From the monorepo root:

```bash
# Deploy web app
pnpm -w -F digiprintplus-web run build
vercel --prod

# Deploy studio
pnpm -w -F digiprintplus-studio run build
vercel --prod
```

## 🔑 Environment Variables

### Required for Web App

Add these in Vercel Dashboard → Settings → Environment Variables:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=as5tildt
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=<your-token>

# Site URLs
NEXT_PUBLIC_SITE_URL=https://digiprintplus.vercel.app
NEXT_PUBLIC_SANITY_STUDIO_URL=https://studio.digiprintplus.vercel.app

# Security
VERCEL_AUTOMATION_BYPASS_SECRET=<your-secret>
```

## 🐛 Troubleshooting

### Issue: "npm error Tracker idealTree already exists"

**Cause:** Vercel is trying to use npm instead of pnpm.

**Solution:**
1. Verify `package.json` has `"packageManager": "pnpm@9.15.0"`
2. Check Vercel project settings use pnpm commands
3. Clear build cache and redeploy

### Issue: "Cannot read file '/packages/config/typescript/react.json'"

**Cause:** TypeScript path resolution fails when workspace dependencies aren't installed from root.

**Solution:**
1. Ensure install command is: `pnpm install --frozen-lockfile` (runs from root)
2. Build command must use workspace filter: `pnpm -w -F <package-name> run build`
3. Root Directory must be `./` (monorepo root), not `apps/web`

### Issue: Build succeeds but missing Tailwind styles

**Cause:** Tailwind content paths don't include workspace packages.

**Solution:**
Check `apps/web/tailwind.config.js` includes:
```js
content: [
  './src/**/*.{ts,tsx,js,jsx}',
  '../../packages/ui/**/*.{ts,tsx,js,jsx}',
]
```

## 📊 Build Logs Validation

A successful build should show:

```
Running "install" command: pnpm install --frozen-lockfile
✓ Dependencies installed

Running "build" command: pnpm -w -F digiprintplus-web run build
✓ Build completed
```

**No more:**
- ❌ `cd ../.. && npm install`
- ❌ `npm error Tracker "idealTree" already exists`

## 🎨 Vercel Dashboard Quick Links

- **Web Project:** https://vercel.com/emanuels-projects-1dd59b95/web
- **Web Settings:** https://vercel.com/emanuels-projects-1dd59b95/web/settings
- **Environment Variables:** https://vercel.com/emanuels-projects-1dd59b95/web/settings/environment-variables
- **Build & Dev Settings:** https://vercel.com/emanuels-projects-1dd59b95/web/settings/general

## ✅ Deployment Checklist

Before deploying:
- [ ] `pnpm-workspace.yaml` exists and defines packages
- [ ] `package.json` has `"packageManager": "pnpm@9.15.0"`
- [ ] All `vercel.json` files use pnpm commands
- [ ] No `npm install` commands anywhere in repo
- [ ] Vercel Root Directory is `./` (not `apps/web`)
- [ ] Environment variables configured in Vercel
- [ ] Local build succeeds: `pnpm install && pnpm -w -F digiprintplus-web run build`

## 📝 Command Reference

```bash
# Install all workspace dependencies
pnpm install --frozen-lockfile

# Build specific package
pnpm -w -F digiprintplus-web run build
pnpm -w -F digiprintplus-studio run build

# Build all packages
pnpm -w run build

# Run dev servers
pnpm -w -F digiprintplus-web run dev       # Port 3001
pnpm -w -F digiprintplus-studio run dev    # Port 3335

# Clean and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```
