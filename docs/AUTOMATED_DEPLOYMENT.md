# 🚀 Automated Deployment Guide

## Complete deployment automation from VS Code to Vercel

---

## ✅ **Setup Complete!**

Your project now has **3 ways** to deploy:

1. **VS Code Tasks** (Easiest - Click and deploy!)
2. **Terminal Scripts** (Quick command-line)
3. **GitHub Actions** (Automatic on push)

---

## 🎯 **Method 1: VS Code Tasks (RECOMMENDED)**

### **How to Use:**

1. Press **`Cmd+Shift+P`** (Mac) or **`Ctrl+Shift+P`** (Windows)
2. Type: **"Tasks: Run Task"**
3. Choose from:
   - 🚀 **Deploy All (Production)** ← Deploy both web + studio
   - 🚀 **Deploy All (Preview)** ← Test deployment
   - 🌐 **Deploy Web Only (Production)**
   - 🌐 **Deploy Web Only (Preview)**
   - 🎨 **Deploy Studio Only (Production)**
   - 🎨 **Deploy Studio Only (Preview)**

### **Or use keyboard shortcut:**
- Press **`Cmd+Shift+B`** (Mac) or **`Ctrl+Shift+B`** (Windows)
- This runs the default task: "Deploy All (Production)"

---

## 🎯 **Method 2: Terminal Scripts**

### **Deploy Everything:**
```bash
./scripts/deployment/deploy-all.sh --prod
```

### **Deploy Web App Only:**
```bash
./scripts/deployment/deploy-web.sh --prod
```

### **Deploy Studio Only:**
```bash
./scripts/deployment/deploy-studio.sh --prod
```

### **Preview Deployments** (test before production):
```bash
./scripts/deployment/deploy-all.sh          # No --prod flag
./scripts/deployment/deploy-web.sh
./scripts/deployment/deploy-studio.sh
```

---

## 🎯 **Method 3: GitHub Actions (Automatic)**

### **Automatic Deployment:**
- Push to `main` branch → **Automatically deploys to production**
- Push to `develop` branch → **Automatically creates preview**
- Open Pull Request → **Automatically creates preview**

### **Setup Required (One-Time):**

You need to add these secrets to GitHub:

1. Go to: https://github.com/EmanuelRad169/Digiprintplus/settings/secrets/actions

2. Click **"New repository secret"** and add:

   **Get Vercel Token:**
   ```bash
   # In your terminal:
   vercel tokens create "GitHub Actions Deploy"
   # Copy the token it gives you
   ```

   **Get Vercel IDs:**
   ```bash
   # For Web App:
   cd apps/web
   vercel link
   cat .vercel/project.json
   # Copy "orgId" and "projectId"
   
   # For Studio:
   cd apps/studio
   vercel link
   cat .vercel/project.json
   # Copy "orgId" and "projectId"
   ```

3. Add these secrets to GitHub:
   ```
   VERCEL_TOKEN=<your-token>
   VERCEL_ORG_ID=<your-org-id>
   VERCEL_PROJECT_ID_WEB=<web-project-id>
   VERCEL_PROJECT_ID_STUDIO=<studio-project-id>
   ```

---

## 📊 **Deployment Workflow**

### **What Each Script Does:**

1. **Installs dependencies** (`npm install`)
2. **Builds locally** to catch errors before deploying
3. **Deploys to Vercel** using CLI
4. **Shows deployment URL** when complete

### **Production vs Preview:**

| Type | Command Flag | When to Use |
|------|-------------|-------------|
| **Production** | `--prod` or `-p` | Deploy to live site (https://digiprintplus.vercel.app) |
| **Preview** | (no flag) | Test changes before going live |

---

## 🔐 **Environment Variables**

### **Current Setup:**

✅ **Web App** (`apps/web/.env.production`):
- `NEXT_PUBLIC_SANITY_PROJECT_ID=as5tildt`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `NEXT_PUBLIC_SITE_URL=https://digiprintplus.vercel.app`
- Plus: NEXTAUTH_*, SENDGRID_*, etc.

✅ **Studio** (`apps/studio/.env.production`):
- `SANITY_STUDIO_PROJECT_ID=as5tildt`
- `SANITY_STUDIO_DATASET=production`

### **Managing Environment Variables:**

**Option 1: Vercel Dashboard**
- https://vercel.com/dashboard → Your Project → Settings → Environment Variables

**Option 2: Vercel CLI**
```bash
# Add a new env var
vercel env add VARIABLE_NAME production

# List all env vars
vercel env ls

# Pull env vars to local
vercel env pull .env.local
```

---

## 🎮 **Quick Start Guide**

### **Your First Deployment:**

1. **Make sure you're logged in:**
   ```bash
   vercel whoami
   # Should show: emanuelrad169
   ```

2. **Link your projects** (one-time setup):
   ```bash
   cd apps/web
   vercel link
   # Follow prompts, select your project
   
   cd ../studio
   vercel link
   # Follow prompts, select your project
   ```

3. **Deploy using VS Code:**
   - Press `Cmd+Shift+P`
   - Type: "Tasks: Run Task"
   - Choose: "🚀 Deploy All (Production)"
   - Watch it deploy!

4. **Or deploy using terminal:**
   ```bash
   ./scripts/deployment/deploy-all.sh --prod
   ```

---

## 📝 **Common Workflows**

### **Workflow 1: Quick Fix**
```bash
# Make your changes in VS Code
# Test locally
npm run dev

# Deploy just web (fast)
./scripts/deployment/deploy-web.sh --prod
```

### **Workflow 2: Full Update**
```bash
# Make changes to both web and studio
# Test locally

# Deploy everything
./scripts/deployment/deploy-all.sh --prod
```

### **Workflow 3: Test Before Deploy**
```bash
# Deploy preview first
./scripts/deployment/deploy-web.sh

# Get preview URL from output
# Test it thoroughly

# Deploy to production when ready
./scripts/deployment/deploy-web.sh --prod
```

---

## 🔧 **Troubleshooting**

### **"Not logged in to Vercel"**
```bash
vercel login
```

### **"Project not linked"**
```bash
cd apps/web     # or apps/studio
vercel link
```

### **"Build failed locally"**
- Fix the errors shown in the output
- Run `npm run build` to test
- Deploy again when build succeeds

### **"Environment variables not found"**
```bash
# Check your .env.production file exists
ls -la apps/web/.env.production

# Or pull from Vercel
cd apps/web
vercel env pull .env.production
```

---

## 📊 **Deployment URLs**

### **Production:**
- **Web App**: https://digiprintplus.vercel.app
- **Studio**: Check Vercel dashboard for URL
- **GitHub**: https://github.com/EmanuelRad169/Digiprintplus

### **Preview:**
- Unique URL generated for each preview deployment
- Find in deployment output or Vercel dashboard

---

## 🎉 **Success Indicators**

You'll know deployment worked when you see:

```
✅ Deployment successful!

📊 View deployment:
   Dashboard: https://vercel.com/dashboard
   Live Site: https://digiprintplus.vercel.app

🎉 All systems deployed!
```

---

## 📞 **Need Help?**

### **Check Deployment Status:**
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Actions: https://github.com/EmanuelRad169/Digiprintplus/actions

### **View Logs:**
```bash
# Vercel deployment logs
vercel logs <deployment-url>

# GitHub Actions logs
# Visit: https://github.com/EmanuelRad169/Digiprintplus/actions
```

---

## 🚀 **You're All Set!**

Your deployment is now **fully automated**. Choose your preferred method and deploy! 🎊

**Quick Deploy Commands:**
```bash
# From VS Code: Cmd+Shift+B
# From Terminal: ./scripts/deployment/deploy-all.sh --prod
# From GitHub: git push origin main (auto-deploys!)
```
