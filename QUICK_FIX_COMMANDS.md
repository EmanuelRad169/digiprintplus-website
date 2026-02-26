# 🚀 Quick Commands Reference

## Local Verification (Run These Before Deploying)

```bash
# 1. Use correct Node version
nvm use 20  # or: nvm install 20 && nvm use 20

# 2. Clean install
rm -rf node_modules apps/web/node_modules apps/studio/node_modules
pnpm install

# 3. Verify toolchain
cd apps/web && pnpm verify:toolchain

# 4. Verify environment
pnpm verify:env

# 5. Verify exports
pnpm verify:exports

# 6. Test local build
pnpm build

# 7. Test Netlify-mode build
NETLIFY=true pnpm build
```

## If Verification Fails

### Node version mismatch:
```bash
nvm install 20
nvm use 20
node -v  # Should show v20.x.x
```

### Dependency version mismatch:
```bash
pnpm install
```

### ESLint parser error:
```bash
# Already fixed by aligning eslint-config-next with Next.js version
# If still happens, check that pnpm overrides are in root package.json
cat package.json | grep -A5 "pnpm"
```

## Deploy to Netlify

```bash
# Commit changes
git add -A
git commit -m "Type your commit message"
git push origin main

# Netlify auto-deploys from main branch
```

## Manual Deploy (if needed)

```bash
cd apps/web
pnpm deploy:prod
```

## Check Live Deployment

```bash
cd apps/web
pnpm verify:live  # Checks production site
pnpm verify:webhook  # Checks webhook security
```

## Troubleshooting Build on Netlify

If Netlify build fails, check:
1. Netlify UI → Site settings → Environment variables (all required vars set?)
2. Netlify build log → Look for which step failed
3. Run locally with `NETLIFY=true pnpm build` to reproduce

## Key Files Changed

- ✅ `package.json` (root) - Added pnpm overrides, aligned Next.js version
- ✅ `apps/web/package.json` - Updated eslint-config-next, removed manual SWC binaries, added verify scripts
- ✅ `netlify.toml` - Fixed functions directory path
- ✅ `apps/web/scripts/verify-build-toolchain.js` - NEW: Pre-build verification
- ✅ `apps/web/scripts/verify-exports.ts` - NEW: Export verification
- ✅ `DEPLOYMENT_ROOT_CAUSE_FIX.md` - Complete documentation

## What Was Fixed

1. **ESLint parser error** - eslint-config-next now matches Next.js 15.5.12
2. **Version consistency** - pnpm overrides lock versions across workspace
3. **Functions path** - Fixed to `apps/web/netlify/functions`
4. **SWC binaries** - Removed manual versions, Next.js auto-manages
5. **Pre-flight checks** - Verification scripts catch issues before build
