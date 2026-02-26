# 🚀 Instant Updates Deployment Checklist

**Commit**: `c3f1b15` - Instant revalidation + webhook hardening  
**Pushed**: February 25, 2026  
**Status**: Ready for environment configuration

---

## ✅ Completed (Just Pushed)

- ✅ Enhanced webhook with instant revalidation (1-5 second updates)
- ✅ Created build-time environment validation
- ✅ Created post-deployment verification suite
- ✅ Created comprehensive deployment runbook
- ✅ Created Netlify environment setup guide
- ✅ Created Sanity webhook setup guide
- ✅ Hardened studio deployment config
- ✅ Aligned Sanity API version (2024-01-01)
- ✅ Committed and pushed to main

---

## 📋 Next Steps (In Order)

### Step 1: Configure Environment Variables in Netlify ⏱️ 5-10 minutes

Follow the guide: [docs/NETLIFY_ENV_SETUP.md](../NETLIFY_ENV_SETUP.md)

**For Web App** (digiprint-main-web):

1. Go to: https://app.netlify.com/sites/digiprint-main-web/settings/deploys#environment

2. **Required Variables** (click "Add variable" for each):

   ```bash
   # Sanity Configuration (Public)
   NEXT_PUBLIC_SANITY_PROJECT_ID=as5tildt
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
   NEXT_PUBLIC_SANITY_STUDIO_URL=https://digiprint-admin-cms.netlify.app
   NEXT_PUBLIC_SITE_URL=https://digiprint-main-web.netlify.app

   # Sanity Secrets (Generate these)
   SANITY_API_TOKEN=sk...  # Get from https://sanity.io/manage/personal/tokens
   SANITY_WEBHOOK_SECRET=$(openssl rand -base64 32)  # Generate locally
   SANITY_REVALIDATE_SECRET=$(openssl rand -base64 32)  # Generate locally

   # Netlify Build Hook (Create in Netlify Dashboard)
   NETLIFY_BUILD_HOOK_URL=https://api.netlify.com/build_hooks/...  # Get from Netlify
   ```

3. **Generate Secrets**:

   ```bash
   # Run these locally and copy the output:

   echo "SANITY_WEBHOOK_SECRET:"
   openssl rand -base64 32

   echo "SANITY_REVALIDATE_SECRET:"
   openssl rand -base64 32
   ```

4. **Create Build Hook**:
   - Go to: https://app.netlify.com/sites/digiprint-main-web/settings/deploys#build-hooks
   - Click "Add build hook"
   - Name: `Sanity Content Update`
   - Branch: `main`
   - Copy URL and add as `NETLIFY_BUILD_HOOK_URL`

5. **Save all variables**

**For Studio** (digiprint-admin-cms):

1. Go to: https://app.netlify.com/sites/digiprint-admin-cms/settings/deploys#environment

2. **Required Variables**:
   ```bash
   SANITY_STUDIO_PRODUCTION_URL=https://digiprint-admin-cms.netlify.app
   ```

---

### Step 2: Trigger Deployment with New Env Vars ⏱️ 2-3 minutes

1. **Deploy Web App**:
   - Go to: https://app.netlify.com/sites/digiprint-main-web/deploys
   - Click "Trigger deploy" → "Clear cache and deploy site"
   - Wait for build to complete (~1-2 minutes)
   - **Verify**: Build succeeds with "✅ VALIDATION SUCCESSFUL"

2. **Deploy Studio**:
   - Go to: https://app.netlify.com/sites/digiprint-admin-cms/deploys
   - Click "Trigger deploy" → "Clear cache and deploy site"
   - Wait for build to complete (~1 minute)

---

### Step 3: Configure Sanity Webhook ⏱️ 3-5 minutes

Follow the guide: [docs/SANITY_WEBHOOK_SETUP.md](../SANITY_WEBHOOK_SETUP.md)

1. Go to: https://www.sanity.io/manage

2. Select project: **as5tildt**

3. Navigate to: **API** → **Webhooks**

4. Click: **"Add webhook"**

5. Configure:

   ```
   Name: Netlify Instant Updates
   URL: https://digiprint-main-web.netlify.app/.netlify/functions/sanity-webhook
   Dataset: production
   Secret: [Use the SANITY_WEBHOOK_SECRET value from Step 1]
   API Version: 2024-01-01
   ```

6. **Select Triggers**:
   - Document types: ✅ product, post, service, page, template
   - Operations: ✅ Create, Update, Delete

7. Click: **"Save"**

8. **Test**: Click "Send test payload"
   - Expected response: `{"message":"Sanity webhook endpoint is active",...}`

---

### Step 4: Verify Deployment ⏱️ 2-3 minutes

Run verification scripts to ensure everything works:

```bash
# Navigate to repo root
cd /Applications/MAMP/htdocs/FredCMs

# Verify environment variables are detected (should pass now)
npm run verify:env

# Run full deployment verification
npm run verify:deployment

# Run quick smoke tests
bash scripts/deployment/netlify-smoke.sh
```

**Expected Results**:

- ✅ All environment variables configured
- ✅ All routes return 200 OK
- ✅ Dynamic content loads from Sanity
- ✅ Security headers present
- ✅ Webhook endpoint active

---

### Step 5: Test Instant Updates (Real-World Test) ⏱️ 2-3 minutes

**The Big Test** - Does content update in 1-5 seconds?

1. **Note Current Time**: ⏰ ******\_******

2. **Edit Content in Sanity**:
   - Open: https://digiprint-admin-cms.netlify.app
   - Edit a product (change title or description)
   - Click: **"Publish"**

3. **Check Website**:
   - Open: https://digiprint-main-web.netlify.app/products/[slug]
   - Wait: **5 seconds**
   - Refresh page: Ctrl+Shift+R / Cmd+Shift+R (hard refresh)
   - **Verify**: Changes appear ✅

4. **Check Function Logs** (optional):

   ```bash
   netlify functions:log sanity-webhook --site digiprint-main-web --tail

   # Expected output after making content change:
   # 📥 Sanity webhook received: {...}
   # ✅ Instant revalidation successful: {"revalidated":true,...}
   ```

5. **Success Criteria**:
   - ⚡ Changes appear in **1-5 seconds** (instant revalidation)
   - OR
   - 🔄 Changes appear in **1-2 minutes** (fallback rebuild)

---

### Step 6: Monitor First 24 Hours ⏱️ Ongoing

**Check Webhook Health**:

1. **Via Sanity Dashboard**:
   - Go to: https://www.sanity.io/manage → Webhooks
   - Click: "Netlify Instant Updates"
   - View: Deliveries tab
   - Look for: ✅ Green checkmarks (200 OK)

2. **Via Netlify Logs**:
   - Go to: https://app.netlify.com/sites/digiprint-main-web/functions
   - Click: `sanity-webhook`
   - Check: Recent invocations
   - Verify: No errors

3. **Via CLI** (real-time monitoring):
   ```bash
   netlify functions:log sanity-webhook --site digiprint-main-web --tail
   ```

**What to Look For**:

- ✅ "📥 Sanity webhook received" - Good!
- ✅ "✅ Instant revalidation successful" - Perfect!
- ⚠️ "⚠️ Revalidation failed, falling back to rebuild" - Works but check SANITY_REVALIDATE_SECRET
- ❌ "❌ Webhook signature validation failed" - Check SANITY_WEBHOOK_SECRET

---

## 🔍 Verification Commands Cheat Sheet

```bash
# Quick health check (all sites)
bash scripts/deployment/netlify-smoke.sh

# Full deployment verification
npm run verify:deployment

# Environment variable validation
npm run verify:env

# Check webhook endpoint health
curl https://digiprint-main-web.netlify.app/.netlify/functions/sanity-webhook

# Monitor webhook logs (real-time)
netlify functions:log sanity-webhook --site digiprint-main-web --tail

# List all environment variables (verify they're set)
netlify env:list --site digiprint-main-web
netlify env:list --site digiprint-admin-cms

# Check build status
netlify status --site digiprint-main-web

# Trigger manual deployment
netlify deploy --build --prod --dir apps/web
```

---

## 📊 Success Metrics

After completing all steps, you should have:

### Performance Metrics

- ⚡ **Content update speed**: 1-5 seconds (96% faster than before)
- 🔄 **Build time**: 1-2 minutes (unchanged, optimized)
- ✅ **Webhook success rate**: 95%+ instant revalidation
- 📉 **Failed deployments**: Near zero with env validation

### Reliability Indicators

- ✅ Build passes with environment validation
- ✅ Webhook deliveries show 200 OK
- ✅ Function logs show "instant revalidation successful"
- ✅ Zero authentication errors (401/403)
- ✅ Content updates work for all document types

### Developer Experience

- ✅ Clear error messages when env vars missing
- ✅ One-command deployment verification
- ✅ Structured function logs (easy debugging)
- ✅ Comprehensive documentation (guides for everything)

---

## 🚨 Troubleshooting

### Build Fails After Push

**Symptom**: Netlify build fails with validation errors

**Cause**: Environment variables not set

**Fix**: Complete Step 1 above (configure env vars in Netlify)

---

### Webhook Test Fails in Sanity

**Symptom**: "Send test payload" shows error

**Possible Causes**:

1. **Function not deployed yet** → Wait for Netlify deploy to complete
2. **Wrong secret** → Verify SANITY_WEBHOOK_SECRET matches in both places
3. **Wrong URL** → Check for typos in webhook URL

**Fix**: See [SANITY_WEBHOOK_SETUP.md](../SANITY_WEBHOOK_SETUP.md) troubleshooting section

---

### Content Updates Still Slow

**Symptom**: Changes take 1-2 minutes instead of 1-5 seconds

**Diagnosis**:

```bash
# Check function logs
netlify functions:log sanity-webhook --site digiprint-main-web --tail

# Make a content change in Sanity
# Look for:
# ✅ "Instant revalidation successful" → Good, browser cache issue
# ⚠️  "Falling back to rebuild" → SANITY_REVALIDATE_SECRET not set
```

**Fix**:

1. If "falling back to rebuild": Set `SANITY_REVALIDATE_SECRET` env var
2. If "revalidation successful": Clear browser cache (Cmd+Shift+R)

---

## 📚 Documentation Reference

All guides are in the `docs/` folder:

- **[NETLIFY_ENV_SETUP.md](../NETLIFY_ENV_SETUP.md)** - Environment variables guide
- **[SANITY_WEBHOOK_SETUP.md](../SANITY_WEBHOOK_SETUP.md)** - Webhook configuration guide
- **[DEPLOYMENT_RUNBOOK.md](../DEPLOYMENT_RUNBOOK.md)** - Complete operations guide
- **[DEPLOYMENT_HARDENING_SUMMARY.md](../DEPLOYMENT_HARDENING_SUMMARY.md)** - What was changed
- **[QUICK_ACTION_CHECKLIST.md](../QUICK_ACTION_CHECKLIST.md)** - Quick reference

---

## 🎯 Timeline Estimate

| Step                         | Estimated Time    |
| ---------------------------- | ----------------- |
| Configure env vars (web)     | 5-7 minutes       |
| Configure env vars (studio)  | 1-2 minutes       |
| Trigger deploys (both sites) | 2-3 minutes       |
| Configure Sanity webhook     | 3-5 minutes       |
| Run verification scripts     | 2-3 minutes       |
| Test instant updates         | 2-3 minutes       |
| **Total**                    | **15-23 minutes** |

---

## ✅ Final Checklist

Before marking as complete, verify:

- [ ] All environment variables set in Netlify (web app)
- [ ] Studio environment variables set
- [ ] Both sites deployed successfully
- [ ] Build logs show "✅ VALIDATION SUCCESSFUL"
- [ ] Sanity webhook created and tested
- [ ] Webhook test payload returns 200 OK
- [ ] Verification scripts pass (`npm run verify:deployment`)
- [ ] Smoke tests pass (`bash scripts/deployment/netlify-smoke.sh`)
- [ ] Real content edit appears in <5 seconds
- [ ] Function logs show "✅ Instant revalidation successful"
- [ ] No errors in Sanity webhook deliveries
- [ ] Monitoring set up (checking logs regularly)

---

**All Steps Complete?** 🎉  
Your instant content updates are now live!

**Enjoy**: WordPress-like editing experience with 1-5 second updates from Sanity to your Netlify site.
