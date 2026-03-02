# Netlify Forms Email Verification Plan

**Goal:** Confirm that form submissions not only reach Netlify (Status 200) but also trigger email notifications to the admin team.

## ✅ Step 1: Trigger a Smoke Test

Run the manual smoke test locally to generate fresh submissions.

```bash
# In apps/web
pnpm exec tsx scripts/smoke-netlify-forms.ts
```

Expected output:

> ✅ Form 'contact' submitted successfully
> ✅ Form 'quote' submitted successfully
> ...

## 🔍 Step 2: Verify in Netlify Dashboard

Even if emails fail, the data **must** exist in Netlify.

1.  Go to [Netlify Dashboard](https://app.netlify.com).
2.  Select the site `digiprint-main-web`.
3.  Click **Forms** in the top navigation.
4.  Check "Active Forms". You should see new submissions from "Smoke Test User".

## 📧 Step 3: Verify Email Delivery

Check the inbox of the configured admin email (e.g., `fred@digiprintplus.com` or similar).

1.  **Search Subject Lines:**
    - "New Form Submission: contact"
    - "New Form Submission: quote"
2.  **Check Spam/Junk:** Netlify emails often land in Spam initially.
3.  **Check Promotions:** (Gmail users).

## 🛠 Troubleshooting Delivery

If submissions appear in the Dashboard but NOT in email:

1.  **Notification Settings:**
    - Go to **Site Settings > Forms > Form Notifications**.
    - Ensure an email notification is added.
    - Target: `Any form` or specific forms like `contact`.
    - Event: `New form submission`.
2.  **Spam Filters:**
    - Whitelist `no-reply@netlify.com`.
    - Mark existing emails as "Not Spam".

## 🤖 Automated Email Testing?

Netlify does not provide an API to check if an email was sent. We must rely on:

1.  **Smoke Tests** (proves Netlify accepted the data).
2.  **Dashboard Checks** (proves data was persisted).
3.  **Manual Email Checks** (proves notification delivery).
