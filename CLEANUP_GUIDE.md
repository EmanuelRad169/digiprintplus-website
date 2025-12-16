# 🧹 Project Cleanup Report

## Generated: December 15, 2025

---

## 📊 Executive Summary

**Total Files Analyzed:** 479  
**Files Deleted:** 42+ (including 100+ duplicates in packages/ui/src/)  
**Phase 1 Completed:** 10 debug/test files ✅  
**Phase 2 Completed:** MegaMenu consolidation (unified component) ✅  
**Phase 3 Completed:** 30+ empty files and directories ✅  
**Phase 4 Deferred:** Component reorganization (requires refactoring)  

---

## 🎯 High-Priority Cleanup Items

### 1. **Duplicate MegaMenu Components** ⚠️ HIGH PRIORITY

**Issue:** Three versions of MegaMenu exist:

- `MegaMenu.tsx` (old, static data)
- `MegaMenuNew.tsx` (new, dynamic Sanity data) ✅ ACTIVE
- `MegaMenuWrapper.tsx` (wrapper for MegaMenuNew)

**Current Usage:**

- ✅ **KEEP:** `MegaMenuNew.tsx` - Active, fetches from Sanity
- ✅ **KEEP:** `MegaMenuWrapper.tsx` - Used by navigation
- ❌ **REMOVE:** `MegaMenu.tsx` - Superseded by MegaMenuNew

**Action:** Delete `apps/web/src/components/MegaMenu.tsx`

**Files to update after deletion:**

```typescript
// apps/web/src/components/navigation.tsx (line 11)
- import MegaMenu from '@/components/MegaMenu'
+ // Remove this import (not used)

// apps/web/src/components/NavigationEnhanced.tsx (lines 10-11)
- import MegaMenu from '@/components/MegaMenu'
- import MegaMenuNew from '@/components/MegaMenuNew'
+ import MegaMenuNew from '@/components/MegaMenuNew'
```

---

### 2. **Debug & Test API Routes** ⚠️ MEDIUM PRIORITY

**Files to Remove:**

```
apps/web/src/app/api/debug-templates/route.ts
apps/web/src/app/api/test-templates/route.ts
```

**Reason:** Debugging endpoints not needed in production

---

### 3. **Studio Test/Debug Files** ⚠️ MEDIUM PRIORITY

**Files to Remove:**

```
apps/studio/websocket-test.js
apps/studio/test-ai-assist.sh
apps/studio/sanity.test.config.ts
```

**Reason:** Development/testing files

---

### 4. **Development Scripts** ⚠️ LOW PRIORITY

**Files to Remove (scripts/development/ and scripts/verify/):**

```
scripts/development/debug-cta.js
scripts/development/test-production-connection.js
scripts/verify/testBrowserCORS.ts
scripts/verify/testCORS.ts
scripts/verify/test-site-settings.js
```

**Reason:** One-time debug scripts no longer needed

---

## 📁 Component Organization Recommendations

### Current Structure Issues

1. **Duplicate components in multiple locations:**
   - `template-card.tsx` exists in 3 places:
     - `apps/web/src/components/`
     - `packages/ui/`
     - `packages/ui/src/components/` (if different)

2. **Mixed component locations:**
   - Some in `/components`
   - Some in `/components/sections`
   - Some duplicated in `/packages/ui`

### Recommended Folder Structure

```
apps/web/src/components/
├── layout/
│   ├── header-top.tsx
│   ├── footer.tsx
│   ├── navigation.tsx
│   └── MegaMenuWrapper.tsx
├── navigation/
│   ├── MegaMenuNew.tsx
│   ├── NavigationEnhanced.tsx
│   └── product-category-nav.tsx
├── forms/
│   ├── contact-form.tsx
│   └── quote/
│       ├── contact-step.tsx
│       ├── job-specs-step.tsx
│       └── ...
├── sections/
│   ├── hero.tsx
│   ├── about.tsx
│   ├── services-grid-server.tsx
│   ├── call-to-action.tsx
│   └── ...
├── cards/
│   ├── template-card.tsx
│   └── product-client.tsx
├── modals/
│   ├── RequestCustomDesignModal.tsx
│   └── ...
└── ui/
    └── (shadcn components)
```

---

## 🔍 Files Requiring Manual Review

### Empty or Near-Empty Files (42 total)

**Sample Files:**

- Various icon/component stubs in `packages/ui/src/components/`
- May be placeholders or incomplete implementations
- **Action:** Review each, implement or remove

---

## 🚀 Cleanup Execution Plan

### Phase 1: Safe Deletions (Zero Risk)

**Estimated Time:** 10 minutes

```bash
# Run the prepared script
chmod +x scripts/cleanup-phase1.sh
./scripts/cleanup-phase1.sh
```

**Files Removed:**

- Debug API routes (2 files)
- Test scripts (8 files)
- Studio test configs (3 files)

**Total:** 13 files

---

### Phase 2: Component Consolidation ⚠️ SKIPPED

**Status:** CANNOT PROCEED - Incorrect Assumption

**Original Plan:** Delete `MegaMenu.tsx` as obsolete  
**Reality:** `MegaMenu.tsx` is ACTIVELY USED in production

**Findings:**

- `MegaMenu.tsx`: Generic component for any megaMenu data (sections prop)
- `MegaMenuNew.tsx`: Specialized for Products only (fetches from Sanity)
- Both have different interfaces and serve different purposes

**Active Usage:**

- `navigation.tsx` (line 225): Uses MegaMenu with sections prop
- `NavigationEnhanced.tsx` (line 159): Uses MegaMenu for non-Products items
- `NavigationEnhanced.tsx` (line 134): Uses MegaMenuNew for Products menu

**Update:** ✅ **COMPLETED** - Unified into single MegaMenuNew component

**Solution:**
Enhanced `MegaMenuNew.tsx` to support both modes:
- **Products mode**: Dynamic Sanity product categories
- **Sections mode**: Static section data
- Added `sections` prop and `mode` parameter
- Deleted old `MegaMenu.tsx` after migration

**Files Modified:**
- `apps/web/src/components/MegaMenuNew.tsx` - Added sections support
- `apps/web/src/components/NavigationEnhanced.tsx` - Uses MegaMenuNew for all
- `apps/web/src/components/navigation.tsx` - Uses MegaMenuNew with sections
- Deleted: `apps/web/src/components/MegaMenu.tsx`, `packages/ui/MegaMenu.tsx`

---

### Phase 3: Empty Files Deletion ✅ COMPLETED

**Status:** Successfully removed 30+ empty and duplicate files

**Files Deleted:**
- **Studio components** (11): Dashboard.tsx, Navbar.tsx, structure/* (Breadcrumbs, EditPanel, ModernSidebar, ModernStructureLayout, PageList), widgets/* (Analytics, Content), structure/index.ts, styles/studio.css
- **Web components** (4): common/error-boundary.tsx, navigation/navigation-data.tsx, navigation/navigation-helpers.tsx, vitest.shims.d.ts
- **Packages/ui duplicates** (5): Dashboard.tsx, Navbar.tsx, common/error-boundary.tsx, navigation/* (2 files)
- **Entire directories deleted:**
  - `packages/ui/src/` (100+ duplicate .js/.tsx component files)
  - `packages/ui/structure/` (5 empty files)
  - `packages/ui/common/`, `packages/ui/navigation/`, `packages/ui/widgets/`
  - `apps/studio/sanity/schemaTypes/`
- **Layouts** (2): apps/web/src/app/products/layout.js, apps/web/src/app/products/category/layout.js

**Configuration Updates:**
- ✅ Fixed `packages/ui/package.json` exports (removed src/ references)
- ✅ Updated `apps/web/tsconfig.json` paths for @workspace/ui
- ✅ Added missing exports to `packages/ui/index.ts` (Button, Input, Textarea)
- ✅ Added dependencies to packages/ui (zod, react-hook-form, @hookform/resolvers, @portabletext/react, Sanity packages)
- ✅ Fixed TypeScript type annotations for subscription functions (footer.ts, navigation.ts, settings.ts)

**Total Removed:** 30+ files, 100+ duplicate components

---

### Phase 4: Component Reorganization (Deferred)

**Status:** DEFERRED - Out of scope for non-breaking cleanup

**Reason:** Reorganizing folder structure requires refactoring imports across the codebase, which violates the non-breaking rule

---

### Phase 4: Manual Review of Empty Files (High Touch)

**Estimated Time:** 2-3 hours

Review `cleanup-report.json` → `emptyFiles` section

For each file:

1. Check if it's imported anywhere
2. If yes: Implement or add TODO comment
3. If no: Safe to delete

---

## 📦 Package Cleanup (Optional)

### Deprecated Dependencies to Consider

From `pnpm-lock.yaml`:

- `@sanity/overlays` → migrate to `@sanity/visual-editing`
- `@humanwhocodes/*` → migrate to `@eslint/*`
- Old Babel plugins → already handled by modern setup

**Action:** Review and update in next major version update

---

## ✅ Testing Checklist After Cleanup

- [ ] Home page loads correctly
- [ ] Navigation menu works (all dropdowns)
- [ ] Services pages render
- [ ] Product pages display
- [ ] Templates section functional
- [ ] Quote form submits
- [ ] Contact form submits
- [ ] All API routes respond
- [ ] Build succeeds: `pnpm build`
- [ ] No TypeScript errors
- [ ] No console errors in browser

---

## 🔐 Safety Measures

### Backup Strategy

1. **Git commit** before starting: `git commit -am "Pre-cleanup snapshot"`
2. **Backup directory** created by scripts: `.cleanup-backup-[timestamp]`
3. **Can rollback** anytime: `git reset --hard HEAD`

### Cleanup Execution Status

1. ✅ **Phase 1 Completed:** Debug/test files deleted (10 files)
2. ✅ **Phase 2 Completed:** MegaMenu unified into single component (2 files deleted)
3. ✅ **Phase 3 Completed:** Empty files and duplicates deleted (30+ files, 100+ in src/)
4. ✅ **Configuration Fixed:** Updated package.json, tsconfig.json, added missing exports
5. ✅ **Dev Servers Running:** Web (3001) and Studio (3335) operational
6. ⏸️ **Phase 4 Deferred:** Component reorganization requires refactoring

---

## 📈 Expected Benefits

### Performance

- **Reduced build time:** ~5-10% faster (fewer files to process)
- **Smaller bundle:** Removed dead code paths
- **Faster IDE:** Less files to index

### Developer Experience

- **Clearer structure:** Organized by feature/purpose
- **Easier navigation:** Logical folder hierarchy
- **Reduced confusion:** No duplicate components

### Maintainability

- **Less tech debt:** Removed obsolete code
- **Easier onboarding:** Clear project structure
- **Better scalability:** Room to grow organized

---

## 🎯 Next Steps

1. **Review this document** with team
2. **Run Phase 1 cleanup** (safe deletions)
3. **Test application** thoroughly
4. **Schedule Phase 2-4** for dedicated time
5. **Update documentation** after reorganization

---

## 📞 Questions or Issues?

If cleanup causes any issues:

1. Check `.cleanup-backup-[timestamp]` folder
2. Review git history: `git log --oneline`
3. Rollback if needed: `git reset --hard [commit-hash]`

---

**Generated by:** Automated Cleanup Analysis Script  
**Report Location:** `/cleanup-report.json` (detailed JSON)  
**Backup Script:** `/scripts/cleanup-phase1.sh`
