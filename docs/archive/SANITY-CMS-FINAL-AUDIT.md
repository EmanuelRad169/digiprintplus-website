# 🔍 SANITY CMS AUDIT REPORT — Final Production Verification

**Date:** February 6, 2026  
**Project:** DigiPrintPlus — Next.js 15 + Sanity CMS + Netlify  
**Build Status:** ✅ PASSING (200 static pages generated)

---

## ✅ GROQ Query Status Filtering Audit

### 1. Templates ✅ COMPLIANT
```groq
*[_type == "template" && !(_id in path('drafts.**')) && (!defined(status) || status == "published")]
```
- ✅ Draft filtering: `!(_id in path('drafts.**'))`
- ✅ Status resilience: `(!defined(status) || status == "published")`
- ✅ Graceful undefined handling

### 2. Template Categories ✅ COMPLIANT
```groq
*[_type == "templateCategory" && !(_id in path('drafts.**')) && (!defined(status) || status == "published")]
```
- ✅ Draft filtering present
- ✅ Status filtering with resilience

### 3. Products ✅ COMPLIANT
```groq
*[_type == "product" && status == "active" && !(_id in path('drafts.**'))]
```
- ✅ Draft filtering present
- ✅ Active status required (strict filtering)
- ✅ Used consistently across all product queries

### 4. Product Categories ✅ COMPLIANT
```groq
*[_type == "productCategory" && !(_id in path('drafts.**'))]
```
- ✅ Draft filtering present
- ℹ️ No status field (categories are always active once published)

### 5. Blog Posts ⚠️ PARTIAL
```groq
*[_type == "post" && !(_id in path('drafts.**'))]
```
- ✅ Draft filtering present
- ⚠️ **No status field** — blog posts don't have `status` in schema
- **Note:** This is acceptable IF blog CMS schema doesn't include status field
- **Recommendation:** Add `isPublished` boolean or `status` enum to post schema

### 6. Services ✅ COMPLIANT
```groq
*[_type == "service" && isActive == true]
```
- ✅ Active filtering via `isActive` boolean
- ℹ️ No draft filtering (services edited directly, no draft system)

### 7. Hero Slides ✅ COMPLIANT
```groq
*[_type == "heroSlide" && isActive == true]
```
- ✅ Active filtering
- ℹ️ Uses `isActive` instead of status enum (simpler approach)

### 8. CTA Sections ❌ MISSING FILTERING
```groq
*[_type == "ctaSection" && sectionId == $sectionId][0]
```
- ❌ **No draft filtering**
- ❌ **No status filtering**
- ⚠️ **Risk:** Draft CTA content could leak into production

---

## ⚠️ CRITICAL ISSUES FOUND

### Issue #1: CTA Section Query Missing Draft Filter
**Location:** `/apps/web/src/lib/sanity/contentFetchers.ts` line ~417  
**Current Query:**
```groq
*[_type == "ctaSection" && sectionId == $sectionId][0]
```

**Should Be:**
```groq
*[_type == "ctaSection" && sectionId == $sectionId && !(_id in path('drafts.**'))][0]
```

**Impact:** Draft CTA content visible on homepage in production

---

## 🛠 FIXES REQUIRED

### Priority 1: Fix CTA Query (HIGH)
Add draft filtering to `getCTASectionById()` in contentFetchers.ts

### Priority 2: Add Blog Post Status (MEDIUM)
**Option A:** Add to Sanity schema:
```typescript
{
  name: 'status',
  type: 'string',
  title: 'Status',
  options: {
    list: [
      { title: 'Draft', value: 'draft' },
      { title: 'Published', value: 'published' }
    ]
  },
  initialValue: 'draft'
}
```

**Option B:** Use existing `publishedAt` field as status indicator:
```groq
*[_type == "post" && !(_id in path('drafts.**')) && defined(publishedAt)]
```

### Priority 3: Audit Homepage Settings Query (LOW)
Check `homepageSettings` schema for draft/status fields

---

## ✅ VERIFIED WORKING

1. ✅ **ENV Variables** — All Sanity config loaded properly
2. ✅ **Netlify Webhook** — Configured and documented
3. ✅ **Static Export** — 200 pages generated successfully
4. ✅ **Image Config** — remotePatterns properly configured
5. ✅ **generateStaticParams** — Present on all 5 dynamic routes
6. ✅ **Draft Mode Code** — Exists but inactive (expected for static export)

---

## 📊 Query Coverage Summary

| Content Type | Draft Filter | Status Filter | Resilient | Grade |
|--------------|--------------|---------------|-----------|-------|
| Templates | ✅ | ✅ | ✅ | A+ |
| Template Categories | ✅ | ✅ | ✅ | A+ |
| Products | ✅ | ✅ | ✅ | A+ |
| Product Categories | ✅ | N/A | ✅ | A |
| Blog Posts | ✅ | ⚠️ | ✅ | B+ |
| Services | N/A | ✅ | ✅ | A |
| Hero Slides | N/A | ✅ | ✅ | A |
| **CTA Sections** | ❌ | ❌ | ❌ | **F** |

---

## 🎯 NEXT ACTIONS

1. **IMMEDIATE:** Fix CTA query to add draft filtering
2. **RECOMMENDED:** Add status field to blog post schema
3. **OPTIONAL:** Add draft filtering to services/heroSlides if they get draft system later

---

## 📝 Notes

- Static export mode means no `/api/draft` route possible (requires SSR)
- draftMode() calls in pages are inactive and harmless (return false always)
- Webhook triggers full rebuild via Netlify build hook (5-10 min update time)
- All queries properly handle missing/undefined fields with resilient filtering

