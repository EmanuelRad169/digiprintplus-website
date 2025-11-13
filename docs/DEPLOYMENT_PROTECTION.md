# 🛡️ Deployment Protection Guide

This document explains the deployment protection mechanism implemented for both the Web App and Sanity Studio.

## Overview

Both apps have protected `/api/deploy` endpoints that require a secret token to prevent unauthorized deployment triggers. This adds a security layer for automated deployments, webhooks, and CI/CD pipelines.

---

## 🔐 Secrets

Each app has its own unique bypass secret:

### Web App
- **Secret:** `59382ff42c21e5891f75f397bcd02e6f`
- **Endpoint:** `https://digiprintplus.vercel.app/api/deploy`
- **Environment Variable:** `VERCEL_AUTOMATION_BYPASS_SECRET`

### Studio
- **Secret:** `bc5f8e4f27c99ab2d476d6a7a5d015f9`
- **Endpoint:** `https://studio-1fzynqyra-emanuels-projects-1dd59b95.vercel.app/api/deploy`
- **Environment Variable:** `VERCEL_AUTOMATION_BYPASS_SECRET`

---

## 📡 API Usage

### Method: `POST` only

The endpoints only accept POST requests. GET, PUT, DELETE, etc. will return `405 Method Not Allowed`.

### Authentication

Provide the secret in one of two ways:

#### Option 1: Query Parameter
```bash
curl -X POST "https://digiprintplus.vercel.app/api/deploy?secret=59382ff42c21e5891f75f397bcd02e6f"
```

#### Option 2: Header
```bash
curl -X POST "https://digiprintplus.vercel.app/api/deploy" \
  -H "x-deploy-secret: 59382ff42c21e5891f75f397bcd02e6f"
```

### Request Body (Optional)

```bash
curl -X POST "https://digiprintplus.vercel.app/api/deploy?secret=YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "environment": "production",
    "branch": "main",
    "commit": "abc123",
    "revalidatePaths": ["/", "/products"]
  }'
```

---

## ✅ Response Codes

| Code | Meaning |
|------|---------|
| `200` | ✅ Success - Deployment authorized |
| `403` | 🚫 Forbidden - Invalid or missing secret |
| `405` | ❌ Method Not Allowed - Use POST only |
| `500` | ⚠️ Internal Server Error |

### Success Response (200)
```json
{
  "success": true,
  "message": "Deployment authorized and processed",
  "timestamp": "2025-11-13T21:30:00.000Z",
  "deployment": {
    "environment": "production",
    "branch": "main",
    "commit": "abc123"
  }
}
```

### Error Response (403)
```json
{
  "success": false,
  "message": "Unauthorized: Invalid or missing deployment secret",
  "timestamp": "2025-11-13T21:30:00.000Z"
}
```

---

## 🧪 Testing

Run the automated test suite:

```bash
./scripts/deployment/test-deploy-protection.sh
```

This script tests:
- ✅ Rejection without secret
- ✅ Rejection with wrong secret
- ✅ Authorization with correct secret
- ✅ Method validation (POST only)
- ✅ Both query param and header authentication
- ✅ Both web and studio endpoints

### Manual Testing

#### Test Web App (Should Fail)
```bash
curl -X POST https://digiprintplus.vercel.app/api/deploy
```

#### Test Web App (Should Succeed)
```bash
curl -X POST "https://digiprintplus.vercel.app/api/deploy?secret=59382ff42c21e5891f75f397bcd02e6f"
```

#### Test Studio (Should Succeed)
```bash
curl -X POST "https://studio-1fzynqyra-emanuels-projects-1dd59b95.vercel.app/api/deploy?secret=bc5f8e4f27c99ab2d476d6a7a5d015f9"
```

---

## 🔧 Configuration

### Vercel Environment Variables

Both apps have the secret configured in Vercel:

```bash
# Already added via CLI
vercel env add VERCEL_AUTOMATION_BYPASS_SECRET production
vercel env add VERCEL_AUTOMATION_BYPASS_SECRET preview
```

### Local Development

Update your local `.env` files:

**apps/web/.env.local:**
```bash
VERCEL_AUTOMATION_BYPASS_SECRET=59382ff42c21e5891f75f397bcd02e6f
```

**apps/studio/.env.local:**
```bash
VERCEL_AUTOMATION_BYPASS_SECRET=bc5f8e4f27c99ab2d476d6a7a5d015f9
```

---

## 🤖 CI/CD Integration

### GitHub Actions Example

```yaml
- name: Trigger Production Deployment
  run: |
    curl -X POST "https://digiprintplus.vercel.app/api/deploy?secret=${{ secrets.VERCEL_DEPLOY_SECRET }}" \
      -H "Content-Type: application/json" \
      -d '{"environment":"production","branch":"${{ github.ref_name }}"}'
```

### Vercel Webhook Example

Configure a webhook in your Vercel dashboard to call this endpoint after successful deployments:

```
POST https://your-monitoring-service.com/webhook
Body: Include the deploy secret in payload
```

---

## 🚨 Security Notes

1. **Never commit secrets to Git** - They're in `.env.production` which is gitignored
2. **Rotate secrets periodically** - Update via Vercel CLI
3. **Monitor logs** - Failed attempts are logged with IP addresses
4. **Use HTTPS only** - Secrets transmitted over secure connection
5. **Different secrets per app** - Web and Studio have separate secrets for isolation

---

## 🔄 Rotating Secrets

To rotate the bypass secret:

1. Generate a new secret:
   ```bash
   openssl rand -hex 16
   ```

2. Update Vercel environment variables:
   ```bash
   cd apps/web
   echo "NEW_SECRET" | vercel env rm VERCEL_AUTOMATION_BYPASS_SECRET production
   echo "NEW_SECRET" | vercel env add VERCEL_AUTOMATION_BYPASS_SECRET production
   ```

3. Update your `.env.production` files

4. Redeploy both apps:
   ```bash
   ./scripts/deployment/deploy-all.sh --prod
   ```

---

## 📊 Monitoring & Logs

### View Deployment Logs

```bash
vercel logs https://digiprintplus.vercel.app --follow
```

### Check for Unauthorized Attempts

Look for log entries like:
```
🚨 Unauthorized deployment attempt blocked
```

These include:
- Timestamp
- IP address
- Whether secret was missing or invalid

---

## 💡 Use Cases

1. **Automated Deployments** - Trigger from CI/CD without manual intervention
2. **Webhook Integrations** - Connect to third-party services securely
3. **Cache Invalidation** - Clear CDN/ISR caches programmatically
4. **Deployment Notifications** - Log to monitoring services
5. **Custom Workflows** - Integrate with your deployment pipeline

---

## 🆘 Troubleshooting

### 403 Forbidden
- Check secret is correct and matches environment variable
- Verify secret is URL-encoded if using query params
- Ensure no extra spaces or quotes in secret

### 405 Method Not Allowed
- Use POST method only
- Check your HTTP client is sending POST, not GET

### 500 Internal Server Error
- Check Vercel logs for detailed error
- Verify environment variables are set
- Test locally first with `npm run dev`

---

## 📚 Related Documentation

- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)

---

**Last Updated:** November 13, 2025  
**Status:** ✅ Production Ready
