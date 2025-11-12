# Vercel Deployment Guide for DigiPrintPlus

## 🚀 Complete Deployment Setup & Troubleshooting

### Repository Information
- **GitHub Repository**: https://github.com/EmanuelRad169/digiprintplus-website
- **Project Type**: Turborepo Monorepo
- **Apps**: 
  - Frontend (Next.js): `apps/web`
  - Studio (Sanity): `apps/studio`

---

## 📋 Pre-Deployment Checklist

### 1. **Fix Package Manager Issues**

Your project has a **mismatch** between package managers:
- `package.json` specifies: `npm@10.9.0`
- But you have: `pnpm-lock.yaml` file

**Action Required:**

**Option A - Use NPM (Recommended for Vercel):**
```bash
# Remove pnpm lockfile
rm pnpm-lock.yaml

# Regenerate with npm
npm install

# Commit the new package-lock.json
git add package-lock.json
git commit -m "chore: switch to npm for Vercel compatibility"
git push
```

**Option B - Use PNPM:**
```bash
# Update package.json
# Change: "packageManager": "npm@10.9.0"
# To: "packageManager": "pnpm@8.0.0"

# Remove npm lockfile if it exists
rm package-lock.json

# Install with pnpm
pnpm install

# Commit changes
git add package.json pnpm-lock.yaml
git commit -m "chore: use pnpm as package manager"
git push
```

---

## 🔧 Vercel Project Configuration

### **Project 1: Frontend (Web App)**

#### Step 1: Create Vercel Project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `EmanuelRad169/digiprintplus-website`
3. Configure as follows:

#### Step 2: Project Settings
```
Project Name: digiprintplus-web (or your choice)
Framework Preset: Next.js
Root Directory: apps/web
Build Command: cd ../.. && npm run build:web
Output Directory: .next (default)
Install Command: npm install
Node.js Version: 18.x or 20.x
```

#### Step 3: Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

**Required Variables:**
```bash
# Sanity Configuration
SANITY_PROJECT_ID=as5tildt
SANITY_DATASET=production  # or development for testing
SANITY_API_TOKEN=<your-sanity-read-token>

# Public Variables (visible to browser)
NEXT_PUBLIC_SANITY_PROJECT_ID=as5tildt
NEXT_PUBLIC_SANITY_DATASET=production

# Analytics (Optional)
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX

# NextAuth (if using authentication)
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=<generate-random-secret>

# Email (Optional - for quote notifications)
SENDGRID_API_KEY=<your-sendgrid-key>
SALES_EMAIL=sales@digiprintplus.com
```

**How to get Sanity API Token:**
```bash
# In your local terminal
cd apps/studio
npx sanity manage

# Or visit: https://www.sanity.io/manage
# Navigate to: Project → API → Tokens
# Create a new token with "Read" permissions
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

### **Project 2: Sanity Studio**

#### Step 1: Create Separate Vercel Project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the SAME repository: `EmanuelRad169/digiprintplus-website`
3. Configure as follows:

#### Step 2: Project Settings
```
Project Name: digiprintplus-studio (or your choice)
Framework Preset: Other
Root Directory: apps/studio
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 18.x or 20.x
```

#### Step 3: Environment Variables
```bash
# Sanity Studio Configuration
SANITY_STUDIO_PROJECT_ID=as5tildt
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_API_VERSION=2023-05-03
```

---

## 🐛 Common Errors & Solutions

### **Error 1: "Module not found: Can't resolve '@workspace/...'"**

**Error Message:**
```
Module not found: Can't resolve '@workspace/ui'
Module not found: Can't resolve '@workspace/hooks'
```

**Root Cause:** Vercel needs to build the entire monorepo, not just the app directory.

**Solution:**
✅ **Already fixed with the `vercel.json` files created above**

The build command `cd ../.. && npm run build:web` ensures:
1. Navigates to monorepo root (`cd ../..`)
2. Builds all dependencies first (via Turbo)
3. Then builds the web app

---

### **Error 2: "SANITY_PROJECT_ID is not defined"**

**Error Message:**
```
ReferenceError: SANITY_PROJECT_ID is not defined
TypeError: Cannot read properties of undefined
```

**Root Cause:** Environment variables not set in Vercel.

**Solution:**
1. Go to Vercel Dashboard
2. Select your project → Settings → Environment Variables
3. Add ALL required environment variables (see list above)
4. **Important:** Add them to all environments (Production, Preview, Development)
5. Redeploy: Deployments → ... menu → Redeploy

---

### **Error 3: "Build failed: Command failed with exit code 1"**

**Error Message:**
```
Error: Build optimization failed
Type error: Cannot find module 'X'
```

**Root Cause:** TypeScript errors or missing dependencies.

**Solution:**

**Test locally first:**
```bash
# Clean everything
npm run clean
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm -rf .next apps/*/.next
rm -rf .turbo apps/*/.turbo

# Fresh install
npm install

# Build the web app
npm run build:web

# If this fails locally, fix the errors before deploying
```

**Common fixes:**
- Check `tsconfig.json` paths are correct
- Ensure all imports use correct paths
- Verify all dependencies are in `package.json`

---

### **Error 4: "Package manager lockfile mismatch"**

**Error Message:**
```
Error: Found pnpm-lock.yaml but using npm
Warning: Multiple lockfiles detected
```

**Root Cause:** Multiple package manager lockfiles exist.

**Solution:**
```bash
# Choose ONE package manager and remove others

# If using NPM:
rm pnpm-lock.yaml
npm install

# If using PNPM:
rm package-lock.json
pnpm install

# Commit the change
git add .
git commit -m "fix: resolve package manager lockfile"
git push
```

Then update Vercel settings:
- Settings → General → Build & Development Settings
- Install Command: `npm install` or `pnpm install`

---

### **Error 5: "GitHub webhook not triggered"**

**Symptoms:**
- Push to GitHub but Vercel doesn't deploy
- Manual deploys work but automatic deploys don't

**Root Cause:** GitHub webhook not configured or broken.

**Solution:**

1. **Check webhook exists:**
   - GitHub repo → Settings → Webhooks
   - Should see Vercel webhook URL
   - Check "Recent Deliveries" for errors

2. **Recreate webhook in Vercel:**
   - Vercel Project → Settings → Git
   - Disconnect and reconnect repository
   - This recreates the webhook

3. **Check branch configuration:**
   - Vercel Project → Settings → Git
   - Production Branch: `main` (or your branch name)
   - Ensure this matches your GitHub default branch

---

### **Error 6: "No build output found"**

**Error Message:**
```
Error: No output directory named ".next" found after the build completed
```

**Root Cause:** Build command doesn't produce output in expected location.

**Solution:**

Check the build actually succeeds:
```bash
# In your local terminal
cd apps/web
npm run build

# Verify .next directory is created
ls -la .next/
```

In Vercel:
- Settings → General → Build & Development Settings
- Output Directory: `.next`
- Build Command: `cd ../.. && npm run build:web`

---

## ✅ Deployment Verification Checklist

### **Before Deploying:**
- [ ] Choose ONE package manager (npm or pnpm)
- [ ] Remove conflicting lockfiles
- [ ] Run `npm install` or `pnpm install` locally
- [ ] Test build locally: `npm run build:web`
- [ ] Test build locally: `npm run build:studio`
- [ ] Commit and push all changes
- [ ] Verify `.gitignore` excludes: `.env.local`, `node_modules/`, `.next/`

### **Vercel Configuration:**
- [ ] Created separate Vercel project for web app
- [ ] Created separate Vercel project for studio
- [ ] Set Root Directory correctly:
  - Web: `apps/web`
  - Studio: `apps/studio`
- [ ] Set Build Command correctly:
  - Web: `cd ../.. && npm run build:web`
  - Studio: `npm run build`
- [ ] Set Install Command: `npm install` (or `pnpm install`)
- [ ] Added all required environment variables
- [ ] Environment variables set for ALL environments (Production, Preview, Development)

### **After Deploying:**
- [ ] Check deployment logs for errors
- [ ] Visit the deployed URL
- [ ] Test main pages load correctly
- [ ] Verify Sanity content displays correctly
- [ ] Check browser console for errors (F12)
- [ ] Test forms and interactive features
- [ ] Check responsive design on mobile
- [ ] Verify images load from Sanity CDN
- [ ] Test Studio login and content editing

### **GitHub Integration:**
- [ ] Verify automatic deployments trigger on push
- [ ] Check GitHub webhook exists (Settings → Webhooks)
- [ ] Verify webhook "Recent Deliveries" show success
- [ ] Test preview deployments on PR creation

---

## 🔍 Debugging Failed Deployments

### **Step 1: Check Build Logs**
1. Vercel Dashboard → Deployments
2. Click on the failed deployment
3. Read the entire log from start to finish
4. Look for first error (errors cascade)

### **Step 2: Common Log Patterns**

**Pattern:** `Cannot find module` or `Module not found`
→ Missing dependency or wrong import path

**Pattern:** `Environment variable not defined`
→ Add missing env vars in Vercel settings

**Pattern:** `Build optimization failed`
→ TypeScript errors - run `npm run type-check` locally

**Pattern:** `ENOENT: no such file or directory`
→ Wrong Root Directory setting in Vercel

**Pattern:** `Command failed with exit code 1`
→ Generic error - scroll up to see actual error message

### **Step 3: Test Locally**

Always test the EXACT build command Vercel uses:

```bash
# For web app
cd /Applications/MAMP/htdocs/FredCMs
npm install
npm run build:web

# For studio
cd /Applications/MAMP/htdocs/FredCMs/apps/studio
npm install
npm run build
```

If it fails locally, it will fail on Vercel. Fix local errors first.

---

## 📦 Monorepo Build Optimization

### **Current Build Process:**

1. Vercel clones your repo
2. Runs: `npm install` (in monorepo root)
3. Runs: `cd ../.. && npm run build:web`
4. Turbo builds dependencies first (packages/*)
5. Then builds apps/web
6. Outputs to `apps/web/.next`

### **Build Performance Tips:**

1. **Use Turbo Cache:**
   - Already configured in `turbo.json`
   - Speeds up subsequent builds

2. **Optimize Dependencies:**
   ```bash
   # Remove unused dependencies
   npm prune
   
   # Update to latest versions
   npm outdated
   npm update
   ```

3. **Vercel Build Settings:**
   - Node.js Version: Use LTS (18.x or 20.x)
   - Enable "Automatically expose System Environment Variables" if needed

---

## 🆘 Still Having Issues?

### **Get Help:**

1. **Share build logs:**
   - Copy the ENTIRE build log from Vercel
   - Look for the FIRST error message (usually near the top)
   - Share the error with context (5-10 lines before/after)

2. **Check Vercel Status:**
   - Visit: https://www.vercel-status.com/
   - Ensure no ongoing incidents

3. **Common Commands to Share:**
   ```bash
   # Local build test
   cd /Applications/MAMP/htdocs/FredCMs
   npm run build:web 2>&1 | tee build.log
   
   # Check environment
   node --version
   npm --version
   
   # Verify Sanity connection
   cd apps/studio
   npx sanity debug --secrets
   ```

4. **Provide this info:**
   - Exact error message from Vercel log
   - Node.js version (local and Vercel)
   - Package manager and version
   - Screenshot of Vercel project settings
   - Whether it builds successfully locally

---

## 🎯 Quick Fix Commands

```bash
# Complete reset and fresh deploy
cd /Applications/MAMP/htdocs/FredCMs

# Clean everything
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm -rf .next apps/*/.next .turbo apps/*/.turbo
rm pnpm-lock.yaml  # If using npm
# OR
rm package-lock.json  # If using pnpm

# Fresh install
npm install  # or pnpm install

# Test build
npm run build:web

# If successful, commit and push
git add .
git commit -m "fix: clean build for Vercel deployment"
git push origin main
```

---

## 📝 Example Successful Deployment Log

What a successful deployment should look like:

```
[HH:MM:SS] Cloning github.com/EmanuelRad169/digiprintplus-website
[HH:MM:SS] Cloning completed in 2s
[HH:MM:SS] Running "npm install"
[HH:MM:SS] Installing dependencies...
[HH:MM:SS] Dependencies installed in 45s
[HH:MM:SS] Running build command: cd ../.. && npm run build:web
[HH:MM:SS] > digiprintplus-monorepo@2.0.0 build:web
[HH:MM:SS] > cd apps/web && npm run build
[HH:MM:SS] Generating build outputs...
[HH:MM:SS] ✓ Compiled successfully
[HH:MM:SS] ✓ Creating an optimized production build
[HH:MM:SS] ✓ Collecting page data
[HH:MM:SS] Build completed in 120s
[HH:MM:SS] Deployment completed in 180s
```

---

## 🎉 Success Indicators

Your deployment is successful when:

1. ✅ Build logs show "Build completed"
2. ✅ Deployment status shows "Ready"
3. ✅ Website loads at the .vercel.app URL
4. ✅ No console errors in browser DevTools
5. ✅ Content from Sanity displays correctly
6. ✅ Images load from cdn.sanity.io
7. ✅ Forms and interactions work
8. ✅ Automatic deploys trigger on git push

---

## 📞 Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Turborepo Documentation**: https://turbo.build/repo/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Sanity Documentation**: https://www.sanity.io/docs

---

*Last Updated: November 12, 2025*
