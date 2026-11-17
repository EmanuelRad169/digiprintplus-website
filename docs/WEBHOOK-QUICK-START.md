# Quick Setup: Sanity Webhook → Netlify Rebuild

## 🎯 Goal


Automatically trigger Netlify rebuilds when templates are published in Sanity Studio.

---

## ⚡ Quick Steps (5 minutes)

### 1️⃣ Create Netlify Build Hook
<https://app.netlify.com>
1. **Go to**: <https://app.netlify.com> → Your Site → **Site Settings**
2. Navigate to: **Build & deploy** → **Build hooks**
3. Click: **Add build hook**
4. Enter:
   - Name: `Sanity Content Update`
   - Branch: `main`
5. Click **Save** and **copy the webhook URL**

### 2️⃣ Add Environment Variable to Netlify

1. Stay in **Site Settings** → Go to **Environment variables**
2. Click **Add a variable**
3. Add:
   - Key: `NETLIFY_BUILD_HOOK_URL`
   - Value: `[paste the URL from step 1]`
4. Click **Save**
5. **Important**: Trigger a manual deploy to apply the env variable

### 3️⃣ Configure Webhook in Sanity Studio
<https://digiprint-admin-cms.netlify.app>
1. **Go to**: <https://digiprint-admin-cms.netlify.app>
2. Click **Manage** (top right) → **API** → **Webhooks**
3. Click **Create webhook**
4. Enter these details:

   | Field | Value |
   |-------|-------|
   | **Name** | `Netlify Rebuild` |
   | **URL** | `https://digiprint-main-web.netlify.app/.netlify/functions/sanity-webhook` |
   | **Dataset** | `production` |
   | **Trigger on** | Select: `template`, `templateCategory`, `homepageSettings` |
   | **HTTP method** | `POST` |
   | **API version** | `v2021-06-07` |
   | **Include drafts** | ❌ Unchecked |
   | **Secret** | `sanity-webhook-secret-2024` |

5. Click **Save**

### 4️⃣ Test It

1. In Sanity webhook settings, click **Test webhook**
2. Should return: `200 OK` with message "Webhook received and Netlify build triggered"
3. Check Netlify → **Deploys** tab for new deployment
4. Or publish a template and watch it trigger automatically! 🎉

---

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| **404 Not Found** | Wait for Netlify deployment to complete, then retry |
| **401 Unauthorized** | Verify webhook secret matches: `sanity-webhook-secret-2024` |
| **No build triggered** | Check `NETLIFY_BUILD_HOOK_URL` is set correctly |
| **Function not found** | Ensure `netlify/functions/` folder deployed correctly |

---

## 📝 What Happens

```
Template Published in Sanity
         ↓
Webhook sent to Netlify Function
         ↓
Signature verified
         ↓
Netlify Build Hook triggered
         ↓
Full site rebuild (~3-5 min)
         ↓
Updated content live! ✨
```

---

## 🔗 Useful Links
<https://app.netlify.com>
- **Netlify Dashboard**
- **Sanity Studio**: <https://digiprint-admin-cms.netlify.app>
- **Detailed Docs**: `/docs/sanity-webhook-setup.md`

---

## ⚙️ Environment Variables Reference

| Variable | Where | Value |
|----------|-------|-------|
| `SANITY_WEBHOOK_SECRET` | Netlify (already set in netlify.toml) | `sanity-webhook-secret-2024` |
| `NETLIFY_BUILD_HOOK_URL` | **You need to add this in Netlify UI** | `https://api.netlify.com/build_hooks/[YOUR_ID]` |

---

**Status**: ✅ Code deployed, ⏳ Waiting for your configuration in Netlify & Sanity
