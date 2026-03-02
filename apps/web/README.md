# DigiPrint Plus Web App

This is the main Next.js web application for DigiPrint Plus.

## 🚀 Getting Started

```bash
pnpm install
pnpm dev
```

## 📝 Netlify Forms Architecture

We use a "Active SSOT" (Single Source of Truth) pattern to ensure our Netlify Forms are production-reliable and regression-proof.

### 1. Single Source of Truth (SSOT)



A form names are defined in **one place**:
 
- File: [`src/lib/netlify/forms.ts`](src/lib/netlify/forms.ts)
- Usage: React components impart names from here. Static HTML verification uses this file.



## . Adding a New Form
  
To d a new form safely:
  
1.  **Register:** Add a new key to `NETLIFY_FORMS` in `src/lib/netlify/forms.ts`.
2.  **Define:** Add the static HTML definition in `public/__forms.html` (matching the new key).
3.  **Implement:** Use `NETLIFY_FORMS.YOUR_NEW_KEY` in your React component's `form` name prop.
4.  **Verify:** Run `pnpm verify:forms` to confirm everything lines up.



### 3. Verification & Testing

#### Build-Time Checks

We run a script before every build to ensure `public/__forms.html` matches `src/lib/netlify/forms.ts`.



```bash
pnpm verify:forms
```

#### Live Smoke Testing

We have a script to send real POST requests to the live site to confirm submissions work.

```bash

# Test all forms

pnpm smoke:forms

# Test specific forms

pnpm smoke:forms --forms=contact,quote
```


#  Email Notification Testing
 
To verify admin emails are actually being delivered:

```bash
pnpm verify:forms:manual
```
*
*his will print a checklist for verifying email delivery and spam folders.
*
*## 4. Troubleshooting
*
- **404 on Submit:** Usually means a mismatch between React name and `__forms.html`. Run `pnpm verify:forms`.
- **200 but no Email:** Check Netlify Dashboard > Forms. If data is there, check your Spam folder or Netlify Form Notification settings.

---

## 🛠 Scripts

- `dev`: Run the development server
- `build`: Build for production (Netlify)
- `verify:forms`: Check form configuration consistency
- `smoke:forms`: Run live smoke tests against production
- `verify:forms:manual`: Guide for email verification
