# 🚀 Deployment Checklist for DigiPrint+

## Pre-Deployment

- [ ] Run audit script: `npm run audit:deploy`
- [ ] Fix all critical issues from audit
- [ ] Update `.env.local` with production values
- [ ] Test build locally: `cd apps/web && npm run build`
- [ ] Verify static export: `npx serve@latest out`

## Netlify Configuration

### Environment Variables (Settings → Environment variables)

Copy from `NETLIFY_ENV_VARS.txt`:

- [ ] NEXT_PUBLIC_SANITY_PROJECT_ID
- [ ] NEXT_PUBLIC_SANITY_DATASET
- [ ] NEXT_PUBLIC_SANITY_API_VERSION
- [ ] SANITY_API_TOKEN
- [ ] NEXT_PUBLIC_SITE_URL

### Build Settings (Site configuration → Build & deploy)

- [ ] Build command: `npm run build:netlify`
- [ ] Publish directory: `out`
- [ ] Node version: `18` or higher

## Sanity Studio

- [ ] Verify dataset is "production"
- [ ] Check all content is published (not drafts)
- [ ] Verify products have slugs
- [ ] Verify blog posts have slugs
- [ ] Test Sanity API token has read permissions

## Post-Deployment Verification

- [ ] Visit homepage: `/`
- [ ] Test static pages: `/about`, `/services`, `/contact`
- [ ] Test dynamic routes: `/products/[slug]`, `/blog/[slug]`
- [ ] Check SEO files: `/robots.txt`, `/sitemap.xml`
- [ ] Verify content loads from Sanity
- [ ] Test forms (if applicable)

## Troubleshooting

### If routes return 404:

1. Check Netlify deploy logs for missing pages
2. Verify `generateStaticParams()` exists in dynamic routes
3. Ensure content has valid slugs in Sanity
4. Clear Netlify cache and redeploy

### If Sanity content doesn't appear:

1. Verify environment variables in Netlify
2. Check API token permissions
3. Ensure dataset is "production"
4. Verify content is published (not drafts)

### If SEO files don't work:

1. Verify `robots.ts` and `sitemap.ts` have `dynamic = 'force-static'`
2. Check build output includes these files
3. Verify they're accessible at `/robots.txt` and `/sitemap.xml`

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Sanity API Tokens](https://www.sanity.io/docs/http-auth)
