# 🚀 **COMPLETE VERCEL DEPLOYMENT GUIDE**

## 📋 **Prerequisites (Complete these first):**

```bash
# 1. Accept Xcode license (required for git commands)
sudo xcodebuild -license accept

# 2. Setup production dataset in Sanity
node setup-production-dataset.js

# 3. Deploy Sanity Studio
cd apps/studio
npx sanity deploy
# Choose hostname: digiprintplus-studio (or your preferred name)
```

## 🔧 **Step 1: Prepare Git Repository**

```bash
# Add GitHub remote (replace with your actual repo URL)
git remote add origin https://github.com/EmanuelRad169/digiprintplus-website.git

# Or if remote exists but wrong URL:
git remote set-url origin https://github.com/EmanuelRad169/digiprintplus-website.git

# Stage all changes
git add .

# Commit with deployment message
git commit -m "feat: production environment setup for Vercel deployment

- Configure production Sanity dataset
- Update studio config for env-based dataset selection
- Fix production environment variables
- Ready for Vercel deployment"

# Push to GitHub
git push -u origin main
```

## ⚙️ **Step 2: Configure Vercel Environment Variables**

### **In Vercel Dashboard → Project Settings → Environment Variables:**

**Production Environment:**

```
NEXT_PUBLIC_SANITY_PROJECT_ID=as5tildt
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_SANITY_STUDIO_URL=https://digiprintplus-web.vercel.app/studio
NEXT_PUBLIC_SITE_URL=https://digiprintplus-web.vercel.app
SANITY_API_TOKEN=skurOFO8xH6eqvNmmOMR0SySJmHaQeCo8jcXUFKVKJllsaOk7uCztTDbez0VmGuhxtrWWC6MauEMpbyiU
SANITY_REVALIDATE_SECRET=preview-secret-key-2024
NEXTAUTH_URL=https://digiprintplus-web.vercel.app
NEXTAUTH_SECRET=kgo14HoesUkAXYYVaODtdove4qqFEbuPbBhqe57gt2M=
VERCEL_AUTOMATION_BYPASS_SECRET=59382ff42c21e5891f75f397bcd02e6f
```

**Preview Environment (optional):**

```
NEXT_PUBLIC_SANITY_DATASET=development
NEXT_PUBLIC_SANITY_STUDIO_URL=https://digiprintplus-web.vercel.app/studio
NEXT_PUBLIC_SITE_URL=https://digiprintplus-web-git-preview-username.vercel.app
# ... rest same as production
```

## 🌐 **Step 3: Deploy to Vercel**

### **Option A: Connect GitHub Repository**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub: `digiprintplus-website`
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or `apps/web` if monorepo)
   - **Build Command**: `npm run build` (or `pnpm build`)
   - **Output Directory**: `.next`
5. Add environment variables from Step 2
6. Deploy!

### **Option B: Vercel CLI (Alternative)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: digiprintplus-web
# - Directory: apps/web (if monorepo) or ./ (if root)
# - Override settings? No

# Deploy to production
vercel --prod
```

## 🔍 **Step 4: Verify Deployment**

### **Check these URLs work:**

- ✅ **Frontend**: https://digiprintplus-web.vercel.app
- ✅ **Studio**: https://digiprintplus-web.vercel.app/studio
- ✅ **API Routes**: https://digiprintplus-web.vercel.app/api/sanity/webhook

### **Test Sanity Integration:**

1. Visit studio URL and login
2. Create/edit content
3. Check if changes appear on frontend
4. Test preview mode (if implemented)

## 🐛 **Troubleshooting Common Issues**

### **Build Errors:**

```bash
# If build fails, test locally first:
cd apps/web
npm run build
# Fix any TypeScript/build errors before deploying
```

### **Environment Variable Issues:**

- Ensure all `NEXT_PUBLIC_*` variables are set correctly
- Check Vercel logs for missing environment variables
- Verify Sanity token has correct permissions

### **Studio Access Issues:**

```bash
# Redeploy Sanity Studio if needed:
cd apps/studio
npx sanity deploy --hostname digiprintplus-studio
```

### **Dataset Issues:**

```bash
# Create production dataset if doesn't exist:
cd apps/studio
npx sanity dataset create production

# Copy data from development to production:
npx sanity dataset export development backup.tar.gz
npx sanity dataset import backup.tar.gz production
```

## ✅ **Final Verification Checklist**

- [ ] Xcode license accepted
- [ ] Production dataset created and populated
- [ ] Sanity Studio deployed to custom hostname
- [ ] Code pushed to GitHub repository
- [ ] Vercel project created and deployed
- [ ] All environment variables configured
- [ ] Frontend loads correctly
- [ ] Studio accessible and functional
- [ ] Content updates reflect on frontend
- [ ] Custom domain configured (optional)

## 🎯 **Expected Result**

Your localhost environment (`http://localhost:3001`) will be fully mirrored at:

- **Production site**: `https://digiprintplus-web.vercel.app`
- **Sanity Studio**: `https://digiprintplus-web.vercel.app/studio`
- **Same data**: Production dataset with your current content
- **Same functionality**: All features working identically

---

💡 **Tip**: After successful deployment, consider setting up automatic deployments on git push and Sanity webhook for real-time content updates!
