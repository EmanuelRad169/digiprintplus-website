# Netlify Forms Hardening Report

**Date:** 2024-02-23
**Status:** ✅ PROTECTED

## 1. Problem Summary

We identified a critical silent failure mode where React component `form` names (e.g., `quote-request`) did not match the static HTML form definitions used by Netlify's build bots (e.g., `quote`). This caused form submissions to return 404s.

## 2. Hardening Measures Implemented

### A. Single Source of Truth (SSOT)

We eliminated "magic strings" by creating a central registry for all Netlify form names.

- **File:** `apps/web/src/lib/netlify/forms.ts`
- **Usage:** All React components and verification scripts import names from here.

### B. Build-Time Verification (Fail Fast)

We added a script that runs **before every build**. It parses the static `public/__forms.html` file and ensures it perfectly validates against the SSOT registry.

- **Script:** `apps/web/scripts/verify-netlify-forms.ts`
- **Checks:**
  - Form name existence.
  - `hidden` attribute presence.
  - `netlify-honeypot` attribute presence.
  - `data-netlify="true"` attribute presence.
- **Command:** `pnpm --filter web verify:forms`

### C. Live Smoke Testing

We added a script to verify the **production environment** is accepting POST requests for all our forms.

- **Script:** `apps/web/scripts/smoke-netlify-forms.ts`
- **Method:** Sends valid HTTP POST requests with dummy data to the live site.
- **Success Criteria:** HTTP 200 OK response.

## 3. Active Forms Registry

| ID  | SSOT Key            | HTML Name           | Component Path                                                |
| :-- | :------------------ | :------------------ | :------------------------------------------------------------ |
| 1   | `CONTACT`           | `contact`           | `apps/web/src/components/contact-form.tsx`                    |
| 2   | `QUOTE`             | `quote`             | `apps/web/src/app/(website)/quote/page.tsx`                   |
| 3   | `CUSTOM_DESIGN`     | `custom-design`     | `apps/web/src/components/modals/RequestCustomDesignModal.tsx` |
| 4   | `CUSTOM_TEMPLATE`   | `custom-template`   | `apps/web/src/components/templates/client.tsx`                |
| 5   | `TEMPLATE_DOWNLOAD` | `template-download` | (Legacy/Direct Download)                                      |

## 4. Maintenance Guide

### Adding a New Form

1.  Add the new form key/name to `apps/web/src/lib/netlify/forms.ts`.
2.  Add the static form definition to `apps/web/public/__forms.html`.
3.  Import the name in your React component: `import { NETLIFY_FORMS } from '@/lib/netlify/forms'`.
4.  Run verification: `pnpm --filter web verify:forms`.

### Troubleshooting

If a build fails on `verify:forms`:

1.  Read the error message—it will tell you exactly which attribute is missing in `__forms.html`.
2.  Ensure `__forms.html` matches the keys in `forms.ts`.
