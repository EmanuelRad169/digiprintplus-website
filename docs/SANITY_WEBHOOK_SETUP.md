# 🪝 Sanity Webhook Setup Guide

**Last Updated**: February 25, 2026  
**Purpose**: Enable instant content updates (1-5 seconds) from Sanity to your website

---

## 📋 Overview

This guide walks you through configuring Sanity webhooks to trigger instant content updates on your Netlify-hosted website.

**What You'll Achieve**:
- ⚡ Content updates in **1-5 seconds** (vs 1-2 minutes)
- 🔄 Automatic cache invalidation when content changes
- 🛡️ Secure webhook validation with signatures
- 📊 Detailed logging for debugging

---

## 🎯 Prerequisites

Before starting, ensure you have completed:

- ✅ [Environment Variables Setup](./NETLIFY_ENV_SETUP.md)
- ✅ Deployed web app to Netlify (digiprint-main-web)
- ✅ You have the `SANITY_WEBHOOK_SECRET` value saved

**Required Values**:
- Webhook URL: `https://digiprint-main-web.netlify.app/.netlify/functions/sanity-webhook`
- Secret: Your `SANITY_WEBHOOK_SECRET` from environment variables

---

## 🚀 Step-by-Step Setup

### Step 1: Access Sanity Manage Dashboard

1. Go to: https://www.sanity.io/manage
2. Select your project: **as5tildt** (DigiPrint Plus)
3. Navigate to: **API** tab
4. Click: **Webhooks** in the sidebar

---

### Step 2: Create New Webhook

1. Click: **"Add webhook"** or **"Create webhook"** button

2. **Configure Basic Settings**:

   | Field | Value |
   |-------|-------|
   | **Name** | `Netlify Instant Updates` |
   | **Description** | `Triggers instant revalidation on content changes` |
   | **URL** | `https://digiprint-main-web.netlify.app/.netlify/functions/sanity-webhook` |
   | **Dataset** | `production` |
   | **HTTP Method** | `POST` |

3. **Set the Secret**:
   - In the "Secret" field, paste the value of your `SANITY_WEBHOOK_SECRET`
   - This MUST match the value in Netlify environment variables
   - Example: `K8x2Jz9mP3vN7wQ4rT6yU8sA1bC5dE0f...`

4. **API Version**:
   - Set to: `2024-01-01` (matches your config)

---

### Step 3: Configure Triggers

Select which document types and operations should trigger the webhook:

#### Document Types to Watch

Check ALL of these:
- ✅ `product` - Product pages
- ✅ `post` - Blog posts
- ✅ `service` - Service pages
- ✅ `page` - Custom pages
- ✅ `template` - Template pages
- ✅ `category` - Category pages (if updates affect listings)

#### Operations to Watch

Check ALL of these:
- ✅ **Create** - When a new document is created
- ✅ **Update** - When a document is modified
- ✅ **Delete** - When a document is deleted

**Why all three?**
- Create: New content needs to appear on site
- Update: Changes need to reflect immediately
- Delete: Removed content should disappear from site

---

### Step 4: Advanced Configuration (Optional)

#### Projection (Leave Default)
- Leave blank or use default
- The webhook function handles path determination automatically

#### HTTP Headers (Optional)
- Add custom headers if needed for debugging:
  ```
  X-Webhook-Source: sanity-cms
  ```

#### On Failure
- **Retry**: Enabled (recommended)
- **Max Retries**: 3 (default)
- **Retry Delay**: Exponential backoff (default)

---

### Step 5: Save and Test

1. Click: **"Save"** or **"Create webhook"** button

2. You should see your new webhook in the list

3. **Test the webhook**:
   - Click: **"Test"** or **"Send test payload"** button
   - Check result: Should show **200 OK** response
   - Look for: `"message": "Sanity webhook endpoint is active"`

---

## ✅ Verification

### Verify Webhook is Active

#### Option 1: Test from Sanity Dashboard
```
1. Go to Sanity Manage → API → Webhooks
2. Click on "Netlify Instant Updates"
3. Click "Send test payload"
4. Expected response:
   {
     "message": "Sanity webhook endpoint is active",
     "configured": true,
     "instantRevalidation": true,
     "buildHookFallback": true,
     "timestamp": "2026-02-25T..."
   }
```

#### Option 2: Test via cURL
```bash
# Simple health check (no signature required for GET/HEAD)
curl https://digiprint-main-web.netlify.app/.netlify/functions/sanity-webhook

# Expected response:
# {"message":"Sanity webhook endpoint is active", ...}
```

---

### Verify Instant Updates Work

**Real-world test**:

1. **Make a Content Change**:
   - Open Sanity Studio: https://digiprint-admin-cms.netlify.app
   - Edit a product (e.g., change title or description)
   - Click "Publish"
   - **Note the time** ⏱️

2. **Check Website**:
   - Open product page: https://digiprint-main-web.netlify.app/products/[slug]
   - Wait 1-5 seconds
   - **Refresh the page**
   - **Verify** changes appear

3. **Expected Timeline**:
   - ⚡ 1-5 seconds: Changes appear (instant revalidation)
   - 🔄 1-2 minutes: Fallback to full rebuild (if instant fails)

4. **Check Function Logs** (for debugging):
   ```bash
   # Via Netlify CLI
   netlify functions:log sanity-webhook --site digiprint-main-web
   
   # Expected output:
   # 📥 Sanity webhook received
   # ✅ Instant revalidation successful: {"revalidated":true,"path":"/products/..."}
   ```

---

## 🔍 How It Works

### Update Flow

```
1. Editor publishes change in Sanity Studio
   ↓
2. Sanity sends webhook to Netlify Function
   ↓
3. Function validates signature (SANITY_WEBHOOK_SECRET)
   ↓
4. Function determines affected path(s):
   - product → /products/[slug] + /products
   - post → /blog/[slug] + /blog
   - service → /services/[slug]
   - page → /[slug]
   ↓
5. Try Instant Revalidation (Fast Path):
   - Call /api/revalidate?secret=XXX&path=/products/slug
   - ISR cache cleared for that path
   - Changes visible in 1-5 seconds ⚡
   ↓
6. If Instant Fails, Fallback to Full Rebuild:
   - Trigger NETLIFY_BUILD_HOOK_URL
   - Full site regeneration
   - Takes 1-2 minutes 🔄
```

### Path Mapping (Automatic)

The webhook function automatically maps document types to paths:

| Document Type | Path(s) Revalidated |
|---------------|-------------------|
| `product` | `/products/[slug]`, `/products` |
| `post` | `/blog/[slug]`, `/blog` |
| `service` | `/services/[slug]`, `/services` |
| `page` | `/[slug]` |
| `template` | `/templates/[slug]`, `/templates` |
| `category` | Triggers related pages rebuild |

---

## 🛡️ Security

### Webhook Signature Validation

**Every webhook request is validated**:

1. Sanity signs the payload with `SANITY_WEBHOOK_SECRET`
2. Netlify function verifies the signature
3. Invalid signatures are rejected (401 Unauthorized)

**This prevents**:
- Unauthorized rebuild triggers
- Malicious cache invalidation
- Replay attacks

### Secret Rotation (If Compromised)

If you need to rotate the secret:

1. **Generate new secret**:
   ```bash
   openssl rand -base64 32
   ```

2. **Update in Netlify**:
   - Dashboard → Environment Variables
   - Edit `SANITY_WEBHOOK_SECRET`
   - Set new value
   - Redeploy

3. **Update in Sanity**:
   - Manage → API → Webhooks
   - Edit "Netlify Instant Updates"
   - Update "Secret" field
   - Save

4. **Test**:
   - Send test payload from Sanity
   - Should succeed with new secret

---

## 🔧 Troubleshooting

### Webhook Shows "Delivery Failed"

**Symptom**: Sanity webhook dashboard shows red X / failed deliveries

**Common Causes**:

1. **Invalid Secret**
   - Check: Secret in Sanity matches `SANITY_WEBHOOK_SECRET` in Netlify
   - Fix: Update one to match the other

2. **Function Not Deployed**
   - Check: https://digiprint-main-web.netlify.app/.netlify/functions/sanity-webhook
   - Expected: `{"message":"Sanity webhook endpoint is active",...}`
   - Fix: Redeploy web app

3. **Wrong URL**
   - Check: URL in webhook config
   - Expected: `https://digiprint-main-web.netlify.app/.netlify/functions/sanity-webhook`
   - Fix: Correct the URL (no typos, correct subdomain)

---

### Content Updates Still Slow (1-2 minutes)

**Symptom**: Changes take 1-2 minutes instead of 1-5 seconds

**Diagnosis**:

1. **Check if instant revalidation is configured**:
   ```bash
   # Check function logs
   netlify functions:log sanity-webhook --site digiprint-main-web
   
   # Look for:
   # ✅ Instant revalidation successful
   # vs
   # ⚠️  Revalidation failed, falling back to rebuild
   ```

2. **If you see "falling back to rebuild"**:
   - Cause: `SANITY_REVALIDATE_SECRET` not set
   - Fix: Add `SANITY_REVALIDATE_SECRET` in Netlify env vars
   - Redeploy

3. **If you see "instant revalidation successful" but still slow**:
   - Cause: Browser cache
   - Fix: Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
   - Or: Open in incognito/private window

---

### Changes Not Appearing at All

**Symptom**: Content updated in Sanity but never appears on website

**Diagnosis**:

1. **Check webhook deliveries**:
   - Sanity Manage → Webhooks → View deliveries
   - Look for: Recent deliveries with 200 OK status
   - If no recent deliveries: Webhook not firing

2. **Check function logs**:
   ```bash
   netlify functions:log sanity-webhook --site digiprint-main-web --tail
   ```
   - Make a content change
   - Look for: `📥 Sanity webhook received`
   - If nothing: Webhook not reaching function

3. **Check document type**:
   - Is the document type configured in webhook triggers?
   - Add it to the triggers if missing

4. **Check dataset**:
   - Webhook dataset: `production`
   - Environment variable: `NEXT_PUBLIC_SANITY_DATASET=production`
   - Both must match

---

### Webhook Logs Show Errors

**Common Error Messages**:

#### "Invalid signature"
```
❌ Webhook signature validation failed
```
- **Cause**: `SANITY_WEBHOOK_SECRET` mismatch
- **Fix**: Ensure secret matches in both Sanity and Netlify

#### "Missing build hook URL"
```
⚠️  NETLIFY_BUILD_HOOK_URL not configured
```
- **Cause**: Fallback rebuild won't work
- **Fix**: Add `NETLIFY_BUILD_HOOK_URL` env var
- **Impact**: Instant revalidation still works, just no fallback

#### "Revalidation endpoint returned 401"
```
⚠️  Revalidation failed: 401 Unauthorized
```
- **Cause**: `SANITY_REVALIDATE_SECRET` mismatch
- **Fix**: Check revalidate endpoint secret matches env var
- **Impact**: Falls back to full rebuild (slower)

---

## 📊 Monitoring Webhook Health

### Check Recent Deliveries

**Via Sanity Dashboard**:
1. Go to: Manage → API → Webhooks
2. Click: "Netlify Instant Updates"
3. View: Deliveries tab
4. Look for: Green checkmarks (200 OK)

**Healthy webhook shows**:
- ✅ 200 OK responses
- ✅ Fast response times (<1 second)
- ✅ No failed retries

**Unhealthy webhook shows**:
- ❌ 4xx/5xx errors
- ⚠️  Slow response times (>5 seconds)
- ⚠️  Multiple retry attempts

---

### Check Function Logs

**Via Netlify Dashboard**:
1. Go to: https://app.netlify.com/sites/digiprint-main-web/functions
2. Click: `sanity-webhook`
3. View: Recent invocations
4. Check: Logs for each execution

**Via Netlify CLI** (real-time):
```bash
# Follow logs in real-time
netlify functions:log sanity-webhook --site digiprint-main-web --tail

# Make a content change in Sanity
# You should see:
# 📥 Sanity webhook received: {...}
# ✅ Instant revalidation successful: {...}
```

---

## 📈 Performance Metrics

### Expected Response Times

| Event | Expected Time |
|-------|---------------|
| Webhook receives request | ~100-300ms |
| Signature validation | ~10-50ms |
| Instant revalidation call | ~500ms-2s |
| Cache cleared (ISR) | ~1-5s total |
| Full rebuild (fallback) | ~1-2 minutes |

### Success Rate Targets

- ✅ 95%+ instant revalidation success rate
- ✅ <1% webhook delivery failures
- ✅ 100% eventual consistency (with fallback)

---

## 🎯 Testing Checklist

After webhook setup, verify:

- [ ] Test payload succeeds (200 OK)
- [ ] Product edit appears in <5 seconds
- [ ] Blog post edit appears in <5 seconds
- [ ] New product appears in listings
- [ ] Deleted product disappears from site
- [ ] Function logs show "✅ Instant revalidation successful"
- [ ] No errors in Sanity webhook deliveries
- [ ] Browser cache cleared before testing
- [ ] Tested on production site (not local dev)

---

## 🔗 Related Documentation

- [Netlify Environment Setup](./NETLIFY_ENV_SETUP.md) - Configure environment variables
- [Deployment Runbook](./DEPLOYMENT_RUNBOOK.md) - Complete deployment guide
- [Deployment Verification](../scripts/verify-deployment.ts) - Automated testing

---

## 🆘 Emergency Rollback

If webhook causes issues:

### Option 1: Disable Webhook (Temporary)
1. Sanity Manage → API → Webhooks
2. Click on webhook → Toggle "Enabled" to OFF
3. Impact: Content updates require manual deploy

### Option 2: Remove Webhook (Permanent)
1. Sanity Manage → API → Webhooks
2. Click on webhook → Delete
3. Impact: No automatic updates, deploy manually

### Option 3: Keep Webhook but Remove Instant Revalidation
1. Netlify → Environment Variables
2. Remove: `SANITY_REVALIDATE_SECRET`
3. Redeploy
4. Impact: All updates use full rebuild (1-2 min)

---

## ✅ Success Criteria

Your webhook is working correctly when:

1. ✅ Content changes in Sanity appear on site within 1-5 seconds
2. ✅ Webhook deliveries show 200 OK in Sanity dashboard
3. ✅ Function logs show "✅ Instant revalidation successful"
4. ✅ No authentication errors (401/403)
5. ✅ No failed deliveries or retries
6. ✅ Updates work for all document types (product, post, service, page)
7. ✅ Deletions remove content from site

---

**Setup Complete** 🎉  
Your instant content updates are now live!

**Next**: Test thoroughly using the checklist above, then reference the [Deployment Runbook](./DEPLOYMENT_RUNBOOK.md) for ongoing maintenance.
