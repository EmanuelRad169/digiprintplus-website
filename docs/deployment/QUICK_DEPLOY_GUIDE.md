# 🚀 QUICK DEPLOYMENT GUIDE

## Current Status
✅ **Site is production-ready** - Already using `production` dataset  
✅ **No dataset migration needed**  
✅ **All fixes applied**

---

## Deploy to Netlify (Recommended)

### 1. Push to GitHub
```bash
git add .
git commit -m "feat: add draft mode support to templates page, document hardcoded data"
git push origin main
```

### 2. Netlify will auto-deploy or manually trigger:
```bash
# If auto-deploy is configured, Netlify will build automatically
# Otherwise, go to: https://app.netlify.com/sites/digiprint-main-web/deploys
# Click "Trigger deploy" → "Deploy site"
```

### 3. Verify Environment Variables on Netlify
Go to: **Site Settings** → **Environment Variables**

Required variables:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=as5tildt
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_SANITY_STUDIO_URL=https://digiprint-admin-cms.netlify.app
SANITY_API_TOKEN=SET_IN_PLATFORM_UI_DO_NOT_COMMIT
```

---

## Post-Deployment Testing

### Test ISR (5-minute cache)
```bash
1. Edit template in Sanity Studio: https://digiprint-admin-cms.netlify.app
2. Publish changes
3. Wait 5 minutes
4. Visit: https://digiprint-main-web.netlify.app/templates
5. ✅ Changes should appear without rebuild
```

### Test Draft Mode (Optional)
Draft mode requires `/api/draft` route. If not implemented, create:

**File:** `apps/web/src/app/api/draft/route.ts`
```typescript
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug') || '/';

  // Check secret (use SANITY_REVALIDATE_SECRET from .env)
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  draftMode().enable();
  redirect(slug);
}
```

Then preview from Sanity Studio will work automatically.

---

## Verification Commands

### Before Deploy
```bash
./scripts/deployment/pre-deploy-verification.sh
```

### After Deploy
```bash
# Check homepage
curl -I https://digiprint-main-web.netlify.app/

# Check templates page
curl -s https://digiprint-main-web.netlify.app/templates | grep -i "template"

# Check CTA section
curl -s https://digiprint-main-web.netlify.app/ | grep -i "ready to get started"
```

---

## Rollback Plan (If Needed)

### Option 1: Revert Git Commit
```bash
git revert HEAD
git push origin main
```

### Option 2: Redeploy Previous Build
Go to Netlify dashboard → **Deploys** → Find previous successful deploy → Click **Publish deploy**

### Option 3: Restore Sanity Dataset
```bash
cd apps/studio
npx sanity dataset import backups/sanity-datasets/production-backup-YYYYMMDD_HHMMSS.tar.gz production --replace
```

---

## Support Contacts
- **Netlify Deploy Status:** https://app.netlify.com/sites/digiprint-main-web/deploys
- **Sanity Studio:** https://digiprint-admin-cms.netlify.app
- **Sanity Manage:** https://www.sanity.io/manage/personal/project/as5tildt

---

**🎉 Your site is ready to deploy!**
