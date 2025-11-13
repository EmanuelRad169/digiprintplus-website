# 🔐 Required Environment Variables for Vercel

## ⚠️ IMPORTANT: Add This to Vercel NOW

You need to add **ONE MORE** environment variable to fix the sitemap error:

---

## 🆕 **New Required Variable**

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add this:

```
NEXT_PUBLIC_SITE_URL=https://digiprintplus.vercel.app
```

**Apply to:** Production, Preview, Development (all three)

---

## ✅ Complete Environment Variables Checklist

Make sure you have ALL of these in Vercel:

### **Required for Web App:**

```bash
# Sanity Configuration
SANITY_PROJECT_ID=as5tildt
SANITY_DATASET=production
SANITY_API_TOKEN=<your-sanity-token>

# Public Sanity Variables
NEXT_PUBLIC_SANITY_PROJECT_ID=as5tildt
NEXT_PUBLIC_SANITY_DATASET=production

# Site Configuration (NEW - REQUIRED FOR SITEMAP)
NEXT_PUBLIC_SITE_URL=https://digiprintplus.vercel.app

# NextAuth (Required if using authentication)
NEXTAUTH_URL=https://digiprintplus.vercel.app
NEXTAUTH_SECRET=<your-generated-secret>

# Analytics (Optional)
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX

# Email (Optional - for quote notifications)
SENDGRID_API_KEY=<your-sendgrid-key>
SALES_EMAIL=sales@digiprintplus.com
```

---

## 🔧 How to Add Environment Variables

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Click on your project: **digiprintplus-website**

### Step 2: Navigate to Settings
1. Click **Settings** (top navigation)
2. Click **Environment Variables** (left sidebar)

### Step 3: Add Each Variable
1. Click **"Add New"** button
2. Enter **Name**: (e.g., `NEXT_PUBLIC_SITE_URL`)
3. Enter **Value**: (e.g., `https://digiprintplus.vercel.app`)
4. Select **Environments**: Check ALL three:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
5. Click **Save**

### Step 4: Redeploy
After adding all variables:
1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Check **"Use existing Build Cache"** (optional)
5. Click **"Redeploy"**

---

## 🎯 What This Fixes

The `NEXT_PUBLIC_SITE_URL` variable fixes the sitemap error:

**Before (Error):**
```
❌ Dynamic server usage: Route /api/sitemap couldn't be rendered 
   statically because it used `request.headers`
```

**After (Fixed):**
```
✅ Sitemap generates using environment variable instead of headers
✅ No more dynamic server usage error
✅ Sitemap available at: https://digiprintplus.vercel.app/api/sitemap
```

---

## 🧪 How to Get Missing Values

### **SANITY_API_TOKEN**
```bash
# Method 1: Command line
cd apps/studio
npx sanity manage

# Method 2: Web interface
Visit: https://sanity.io/manage/personal/project/as5tildt
Navigate to: API → Tokens → Add API Token
Permissions: "Editor" or "Read"
Copy the token
```

### **NEXTAUTH_SECRET**
```bash
# Generate random secret
openssl rand -base64 32

# Copy the output and use it
```

---

## ✅ Verification After Adding Variables

### 1. Check Deployment Status
- Visit Vercel Dashboard
- Latest deployment should show **"Ready"** (green)
- No red errors in build logs

### 2. Test Sitemap
Visit: https://digiprintplus.vercel.app/api/sitemap

Should show XML like:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://digiprintplus.vercel.app/</loc>
    ...
  </url>
</urlset>
```

### 3. Test Main Site
- Visit: https://digiprintplus.vercel.app
- Should match localhost:3001
- No console errors (F12)

---

## 🚨 Common Mistakes to Avoid

1. **❌ Forgetting to select all environments**
   - ✅ Always check: Production, Preview, Development

2. **❌ Not redeploying after adding variables**
   - ✅ Must redeploy for changes to take effect

3. **❌ Using http:// instead of https://**
   - ✅ Use: `https://digiprintplus.vercel.app`
   - ❌ Not: `http://digiprintplus.vercel.app`

4. **❌ Forgetting the NEXT_PUBLIC_ prefix**
   - ✅ `NEXT_PUBLIC_SITE_URL` (accessible in browser)
   - ❌ `SITE_URL` (only accessible server-side)

---

## 📊 Current Status

- ✅ Code fix pushed to GitHub (commit: `9bc7532`)
- ✅ Local build works perfectly
- ⏳ Waiting for you to add `NEXT_PUBLIC_SITE_URL` to Vercel
- ⏳ Then redeploy to apply the fix

---

## 🎯 Next Steps

1. **Add `NEXT_PUBLIC_SITE_URL` to Vercel** ← DO THIS NOW
2. **Redeploy the project**
3. **Wait 3-5 minutes for build to complete**
4. **Test the sitemap**: https://digiprintplus.vercel.app/api/sitemap
5. **Confirm site works**: https://digiprintplus.vercel.app

---

**After adding the environment variable and redeploying, your sitemap error will be fixed!** ✅
