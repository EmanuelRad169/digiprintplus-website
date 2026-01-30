# Sanity Webhook Setup Guide

This guide explains how to set up automatic Netlify rebuilds when content is published in Sanity Studio.

## Overview

When a template (or other content) is published in Sanity, a webhook will trigger a Netlify rebuild, ensuring the static site always shows the latest content without manual deployments.

## Step 1: Create Netlify Build Hook

1. Go to your Netlify site dashboard: https://app.netlify.com
2. Navigate to **Site Settings** → **Build & deploy** → **Build hooks**
3. Click **Add build hook**
4. Configure the build hook:
   - **Build hook name**: `Sanity Content Update`
   - **Branch to build**: `main`
5. Click **Save**
6. Copy the generated webhook URL (looks like: `https://api.netlify.com/build_hooks/[HOOK_ID]`)

## Step 2: Configure Environment Variables

### In Netlify UI:

1. Go to **Site Settings** → **Environment variables**
2. Add/update these variables:
   - `SANITY_WEBHOOK_SECRET` = `sanity-webhook-secret-2024`
   - `NETLIFY_BUILD_HOOK_URL` = `[paste the build hook URL from Step 1]`
3. Click **Save**
4. Trigger a new deployment for changes to take effect

### In netlify.toml (already configured):

The `SANITY_WEBHOOK_SECRET` is already set in the config file, but you should add the `NETLIFY_BUILD_HOOK_URL` to Netlify's UI environment variables (not committed to git for security).

## Step 3: Configure Sanity Webhook

1. Open Sanity Studio: https://dppadmin.sanity.studio
2. Go to **Manage** (top right) → **API** → **Webhooks**
3. Click **Create webhook**
4. Configure the webhook:

   **Name**: `Netlify Rebuild on Template Update`
   
   **URL**: `https://digiprint-main-web.netlify.app/api/webhook`
   
   **Dataset**: `production`
   
   **Trigger on**: Select the content types that should trigger rebuilds:
   - ✅ `template` (required)
   - ✅ `templateCategory` (optional)
   - ✅ `homepageSettings` (optional - for featured products)
   - ✅ `faqCategory` (optional)
   - ✅ Any other content types you want to trigger rebuilds
   
   **HTTP method**: `POST`
   
   **API version**: `v2021-06-07` or later
   
   **Include drafts**: ❌ No (only trigger on published content)
   
   **Secret**: `sanity-webhook-secret-2024` (must match your env variable)
   
   **Headers**: (leave empty - webhook library handles this)
   
   **Projection**: (optional) Leave empty or use:
   ```groq
   {
     _id,
     _type,
     title,
     slug
   }
   ```

5. Click **Save**

## Step 4: Test the Webhook

### Test from Sanity Studio:

1. After saving the webhook, click the **Test** button in Sanity
2. You should see a success response with status 200
3. Check Netlify to verify a new build was triggered

### Test by Publishing Content:

1. In Sanity Studio, edit a template
2. Make a small change (e.g., update the title)
3. Click **Publish**
4. Go to Netlify dashboard → **Deploys**
5. You should see a new deployment triggered with title "Sanity template update"
6. Wait for build to complete (~3-5 minutes)
7. Visit your site and verify the updated content appears

## Webhook Endpoint Details

**Endpoint**: `/api/webhook`
- **Method**: `POST` - Receives Sanity webhook
- **Method**: `GET` - Health check (returns configuration status)

**Response Codes**:
- `200` - Webhook received and Netlify build triggered successfully
- `401` - Invalid signature or missing webhook secret
- `500` - Internal error or failed to trigger Netlify build

## Monitoring & Debugging

### Check Webhook Logs in Sanity:

1. Go to **Manage** → **API** → **Webhooks**
2. Click on your webhook
3. View the **Delivery log** to see webhook attempts and responses

### Check Netlify Deploy Logs:

1. Go to Netlify dashboard → **Deploys**
2. Click on a deployment triggered by the webhook
3. View build logs to debug any issues

### Check API Route Logs:

Since this is a static export, API routes don't run on Netlify after build. However, during the build process, you can check Netlify's function logs if needed.

**Important**: For static exports, the webhook must trigger a full rebuild. The API route runs during the build to verify it exists, but the actual webhook handling happens via a serverless function deployment.

## Alternative: Serverless Function (Recommended for Production)

For better webhook handling with static exports, consider creating a Netlify function:

1. Create `netlify/functions/sanity-webhook.ts`
2. Move webhook logic there
3. Update Sanity webhook URL to: `https://digiprint-main-web.netlify.app/.netlify/functions/sanity-webhook`

This ensures the webhook endpoint is always available, even with static exports.

## Troubleshooting

### Webhook receives 404:
- Ensure the site has been deployed with the new API route
- Check that the URL is correct: `https://digiprint-main-web.netlify.app/api/webhook`
- For static exports, consider using a Netlify function instead

### Webhook receives 401 (Unauthorized):
- Verify `SANITY_WEBHOOK_SECRET` matches in both Sanity and Netlify
- Check that the secret is set in Netlify's environment variables
- Redeploy after changing environment variables

### Build not triggered:
- Verify `NETLIFY_BUILD_HOOK_URL` is set correctly
- Test the build hook directly with curl:
  ```bash
  curl -X POST https://api.netlify.com/build_hooks/[YOUR_HOOK_ID]
  ```
- Check Netlify build hooks are enabled

### Deployment takes too long:
- Netlify builds typically take 3-5 minutes
- Consider using ISR with Vercel instead of static export if real-time updates are critical
- Or implement a revalidation webhook for specific pages

## Security Notes

- Never commit `NETLIFY_BUILD_HOOK_URL` to git (keep in Netlify UI only)
- Keep `SANITY_WEBHOOK_SECRET` secure and rotate periodically
- Use HTTPS for all webhook URLs
- Monitor webhook delivery logs for suspicious activity

## Related Documentation

- [Sanity Webhooks Docs](https://www.sanity.io/docs/webhooks)
- [Netlify Build Hooks Docs](https://docs.netlify.com/configure-builds/build-hooks/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
