# 🚀 Vercel Deployment Quick Reference

## Immediate Action Items

### 1. Fix Package Manager (CRITICAL)
```bash
cd /Applications/MAMP/htdocs/FredCMs

# Option A: Use NPM (Recommended)
rm pnpm-lock.yaml
npm install
git add package-lock.json
git commit -m "chore: standardize on npm"
git push

# Option B: Use PNPM
# Edit package.json line 5: "packageManager": "pnpm@8.0.0"
rm package-lock.json
pnpm install
git add package.json pnpm-lock.yaml
git commit -m "chore: standardize on pnpm"
git push
```

### 2. Test Local Build
```bash
cd /Applications/MAMP/htdocs/FredCMs
npm run build:web
# Must succeed before deploying to Vercel
```

### 3. Get Sanity API Token
```bash
cd apps/studio
npx sanity manage
# Or visit: https://sanity.io/manage/personal/project/as5tildt
# API tab → Create token → "Read" permissions
```

### 4. Generate NextAuth Secret
```bash
openssl rand -base64 32
```

---

## Vercel Project Setup

### Web App (Frontend)
```
Project Name: digiprintplus-web
Framework: Next.js
Root Directory: apps/web
Build Command: cd ../.. && npm run build:web
Output Directory: .next
Install Command: npm install
Node.js Version: 18.x
```

**Required Environment Variables:**
```
SANITY_PROJECT_ID=as5tildt
SANITY_DATASET=production
SANITY_API_TOKEN=<from-step-3>
NEXT_PUBLIC_SANITY_PROJECT_ID=as5tildt
NEXT_PUBLIC_SANITY_DATASET=production
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=<from-step-4>
```

### Studio (Sanity CMS)
```
Project Name: digiprintplus-studio
Framework: Other
Root Directory: apps/studio
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 18.x
```

**Required Environment Variables:**
```
SANITY_STUDIO_PROJECT_ID=as5tildt
SANITY_STUDIO_DATASET=production
```

---

## Troubleshooting Quick Fixes

### Error: Module not found
```bash
# Wrong root directory - Check Vercel settings
# Should be: apps/web or apps/studio
```

### Error: Environment variable not defined
```bash
# Add in Vercel Dashboard → Settings → Environment Variables
# Select ALL environments (Production, Preview, Development)
# Then: Deployments → ... → Redeploy
```

### Error: Build failed locally
```bash
# Clean and rebuild
rm -rf node_modules apps/*/node_modules .next apps/*/.next
npm install
npm run build:web
```

### Error: Package manager mismatch
```bash
# Keep only ONE lockfile
rm pnpm-lock.yaml  # if using npm
# OR
rm package-lock.json  # if using pnpm
```

---

## Verification Checklist

### Before Deploy
- [ ] Only ONE lockfile exists (package-lock.json OR pnpm-lock.yaml)
- [ ] `npm run build:web` succeeds locally
- [ ] All changes committed and pushed to GitHub
- [ ] `.env.local` not committed (check .gitignore)

### Vercel Configuration
- [ ] Root Directory set correctly
- [ ] Build Command includes `cd ../..` for web app
- [ ] All environment variables added
- [ ] Variables applied to all environments
- [ ] Node.js version 18.x or 20.x

### After Deploy
- [ ] Build logs show "Build completed"
- [ ] Website loads at .vercel.app URL
- [ ] No errors in browser console (F12)
- [ ] Sanity content displays
- [ ] Images load from cdn.sanity.io
- [ ] Auto-deploy works on git push

---

## Common Error Messages

| Error | Solution |
|-------|----------|
| "Cannot find module '@workspace/...'" | Root Directory wrong or build command incorrect |
| "SANITY_PROJECT_ID is not defined" | Add environment variables in Vercel settings |
| "Package manager lockfile mismatch" | Remove conflicting lockfile, keep only one |
| "Build optimization failed" | Fix TypeScript errors, run `npm run type-check` |
| "No output directory found" | Wrong Output Directory setting |
| "GitHub webhook not triggered" | Reconnect GitHub in Vercel settings |

---

## Need the Full Guide?

See: `docs/VERCEL_DEPLOYMENT_GUIDE.md` for detailed explanations and advanced troubleshooting.

---

## Test Commands

```bash
# Full local test
cd /Applications/MAMP/htdocs/FredCMs
npm install
npm run build:web
npm run build:studio

# Check for issues
npm run lint
npm run type-check

# Verify environment
node --version  # Should be 18.x or 20.x
npm --version
```
