# Form Submission Audit Report

**Date**: February 25, 2026  
**Site**: https://digiprint-main-web.netlify.app

## Executive Summary

Multiple issues found with form submissions and email notifications:

1. **No email notifications configured** for Netlify Forms
2. **Webhook disabled** due to 6 consecutive failures
3. **Mixed submission methods** (some use Netlify Forms, some use custom API)

---

## Active Forms Across Site

### 1. **Quote Request Form** (`quote-request`)

- **Location**: `/quote`
- **Status**: ⚠️ Uses custom API endpoint
- **Submission Method**: Custom `/api/submit-quote` function
- **Data Storage**: Sanity CMS (`quoteRequest` documents)
- **Email Notifications**: ❌ NOT CONFIGURED
- **File**: [apps/web/src/app/quote/page.tsx](apps/web/src/app/quote/page.tsx)
- **Handler**: [netlify/functions/submit-quote.ts](netlify/functions/submit-quote.ts)

**Issues:**

- No email sending after quote submission
- Only saves to Sanity CMS
- Code comment says "Send confirmation email (optional - can be added later)"

### 2. **Contact Form** (`contact`)

- **Location**: `/contact`
- **Status**: ⚠️ Configured but no email
- **Submission Method**: Netlify Forms
- **Data Storage**: Netlify Forms dashboard
- **Email Notifications**: ❌ NOT CONFIGURED
- **File**: [apps/web/src/components/contact-form.tsx](apps/web/src/components/contact-form.tsx)

**Issues:**

- Submissions stored in Netlify but no email alerts
- Need to configure Form Notifications in Netlify dashboard

### 3. **Custom Template Request** (`custom-template-request`)

- **Location**: `/templates` (modal)
- **Status**: ⚠️ Configured but no email
- **Submission Method**: Netlify Forms
- **Data Storage**: Netlify Forms dashboard
- **Email Notifications**: ❌ NOT CONFIGURED
- **File**: [apps/web/src/app/templates/client.tsx](apps/web/src/app/templates/client.tsx#L488)

**Issues:**

- Submissions stored in Netlify but no email alerts
- Need to configure Form Notifications

### 4. **Custom Design Request** (`custom-design-request`)

- **Location**: Site-wide (modal component)
- **Status**: ⚠️ Configured but no email
- **Submission Method**: Netlify Forms
- **Data Storage**: Netlify Forms dashboard
- **Email Notifications**: ❌ NOT CONFIGURED
- **File**: [apps/web/src/components/RequestCustomDesignModal.tsx](apps/web/src/components/RequestCustomDesignModal.tsx)

**Issues:**

- Submissions stored in Netlify but no email alerts
- Need to configure Form Notifications

### 5. **Template Download** (`template-download`)

- **Location**: `/templates`
- **Status**: ⚠️ Form declared but not actively used
- **Submission Method**: Direct download (no form submission)
- **Note**: This appears to be a placeholder form not actually in use

---

## Disabled Webhook Issue

### Sanity Webhook Failed

```
Post to https://digiprint-main-web.netlify.app/.netlify/functions/sanity-webhook
when deploy starts - DISABLED (6 failures)
```

**Root Cause**: The webhook URL is incorrect

- **Current**: `.netlify/functions/sanity-webhook`
- **Problem**: This URL is being called when _deploy starts_, but the function expects to receive Sanity webhook POST requests, not deploy notifications
- **Location**: [netlify/functions/sanity-webhook.ts](netlify/functions/sanity-webhook.ts)

**What this webhook does:**

- Receives content updates from Sanity CMS
- Validates webhook signature
- Triggers Netlify rebuild via build hook

**Why it's failing:**

- It's configured as a _deploy notification webhook_ instead of a _Sanity incoming webhook_
- The function expects Sanity signatures but receives Netlify deploy notifications

---

## Required Fixes

### Priority 1: Enable Email Notifications

#### A. Configure Netlify Forms Email Notifications

In Netlify Dashboard:

1. Go to **Site Settings** → **Forms** → **Form notifications**
2. For each form, add email notification:
   - `contact`
   - `custom-template-request`
   - `custom-design-request`
3. Set recipient email (e.g., orders@digiprintplus.com)

#### B. Add Email to Quote Submission Function

Integrate email service (SendGrid, Mailgun, or Resend) in:

- [netlify/functions/submit-quote.ts](netlify/functions/submit-quote.ts#L76-L77)

### Priority 2: Fix Webhook Configuration

#### Remove Incorrect Webhook

In Netlify Dashboard:

1. Go to **Site Settings** → **Build & deploy** → **Deploy notifications**
2. **Delete** the disabled webhook to `sanity-webhook`
3. This is NOT a deploy notification webhook

#### Configure Correct Sanity Webhook

In Sanity Studio:

1. Go to **API** → **Webhooks**
2. Create webhook pointing to: `https://digiprint-main-web.netlify.app/.netlify/functions/sanity-webhook`
3. Set secret: Use `SANITY_WEBHOOK_SECRET` from env vars
4. Trigger on: Content changes

### Priority 3: Environment Variables Check

Verify these are set in Netlify:

- ✅ `SANITY_API_TOKEN` - For saving quotes to Sanity
- ❌ `SANITY_WEBHOOK_SECRET` - For verifying Sanity webhooks (likely missing)
- ❌ `NETLIFY_BUILD_HOOK_URL` - For triggering rebuilds (likely missing)
- ❌ Email service credentials (e.g., `SENDGRID_API_KEY`)

---

## Recommended Email Integration

### Option 1: Resend (Recommended)

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "quotes@digiprintplus.com",
  to: "orders@digiprintplus.com",
  subject: "New Quote Request",
  html: emailTemplate,
});
```

### Option 2: SendGrid

```typescript
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: "orders@digiprintplus.com",
  from: "quotes@digiprintplus.com",
  subject: "New Quote Request",
  html: emailTemplate,
});
```

---

## Testing Checklist

After fixes:

- [ ] Submit contact form → Receive email
- [ ] Submit quote request → Receive email
- [ ] Submit custom template request → Receive email
- [ ] Submit custom design request → Receive email
- [ ] Update content in Sanity → Site rebuilds automatically
- [ ] Check Netlify Forms dashboard for submissions
- [ ] Verify all environment variables are set

---

## Next Steps

1. **Immediate**: Configure email notifications in Netlify Dashboard for existing forms
2. **Short-term**: Add email service (Resend/SendGrid) to quote submission function
3. **Short-term**: Remove incorrect webhook from Netlify
4. **Short-term**: Configure Sanity webhook properly in Sanity Studio
5. **Long-term**: Consider consolidating all forms to use same submission method
