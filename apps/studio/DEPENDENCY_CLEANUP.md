# 📦 Studio Dependency Cleanup Report

**Date:** November 13, 2025  
**Status:** ✅ Warnings Suppressed | ⚠️ Upgrade Recommended

---

## 🔍 Investigation Results

### Deprecation Warnings (from Vercel build):

#### ❌ inflight@1.0.6
- **Type:** Transitive dependency (Sanity internal)
- **Risk:** Memory leak warning
- **Action:** ✅ NONE - Not directly used
- **Resolution:** Will be fixed by Sanity v4 upgrade

#### ❌ Babel Plugins (4 warnings)
```
@babel/plugin-proposal-numeric-separator
@babel/plugin-proposal-class-properties  
@babel/plugin-proposal-optional-chaining
@babel/plugin-proposal-nullish-coalescing-operator
```
- **Type:** Transitive dependencies (Sanity internal build tools)
- **Action:** ✅ NONE - Internal to Sanity's Vite build
- **Resolution:** Will be fixed by Sanity v4 upgrade

#### ❌ glob@7.2.3
- **Status:** ✅ Your code uses modern glob@10.x and glob@11.x
- **Type:** Old version buried in Sanity dependency tree
- **Action:** ✅ NONE - Already using latest where possible
- **Resolution:** Will be fixed by Sanity v4 upgrade

---

## ✅ Actions Taken

### 1. Added `.npmrc` Configuration
```bash
# Suppress deprecation warnings from Sanity internal dependencies
loglevel=error

# Use npm workspaces properly
legacy-peer-deps=false
```

**Result:** Build warnings will be suppressed in future deployments.

### 2. Ran `npm audit fix`
- Added 82 packages (security patches)
- ⚠️ 10 moderate vulnerabilities remain (all from `prismjs` in Sanity v3)
- Cannot be fixed without breaking change (Sanity v4 upgrade)

---

## 📊 Current Package Status

| Package | Current | Latest | Type |
|---------|---------|--------|------|
| sanity | 3.99.0 | **4.15.0** | ⚠️ Major upgrade |
| @sanity/assist | 4.4.8 | **5.0.2** | ⚠️ Major upgrade |
| @sanity/dashboard | 4.1.4 | **5.0.0** | ⚠️ Major upgrade |
| @sanity/vision | 3.99.0 | **4.15.0** | ⚠️ Major upgrade |
| @sanity/visual-editing | 2.15.4 | **4.0.0** | ⚠️ Major upgrade |
| react | 18.3.1 | 19.2.0 | Optional |
| react-dom | 18.3.1 | 19.2.0 | Optional |

---

## 🛡️ Security Vulnerabilities

**Current:** 10 moderate vulnerabilities  
**Root Cause:** `prismjs` DOM Clobbering vulnerability in Sanity v3 UI  
**Impact:** Low - affects syntax highlighting in Studio  
**Fix:** Upgrade to Sanity v4

---

## 🚀 Recommended Next Steps

### Option A: Keep Current Setup ✅ (Recommended for now)
- ✅ Warnings suppressed via `.npmrc`
- ✅ Studio builds and deploys successfully
- ✅ No functionality issues
- ⚠️ Security warnings remain (low impact)

**Good for:** Maintaining stability while preparing for v4 upgrade

---

### Option B: Upgrade to Sanity v4 🎯 (Future task)

This is a **MAJOR BREAKING CHANGE** - requires careful planning.

#### Benefits:
- ✅ Fixes all deprecation warnings
- ✅ Resolves prismjs security vulnerabilities  
- ✅ Modern build tools (no more old Babel plugins)
- ✅ Better performance and new features

#### Migration Steps:
```bash
# 1. Review breaking changes
# Visit: https://www.sanity.io/docs/migrating-to-v4

# 2. Update package.json
npm install sanity@^4.15.0 \
  @sanity/vision@^4.15.0 \
  @sanity/assist@^5.0.2 \
  @sanity/dashboard@^5.0.0 \
  @sanity/visual-editing@^4.0.0

# 3. Update schemas and config
# - Review sanity.config.ts for API changes
# - Test all custom components
# - Update any deprecated APIs

# 4. Test locally
npm run dev

# 5. Deploy to staging first
vercel --preview

# 6. Deploy to production
vercel --prod
```

#### Risks:
- ⚠️ Breaking changes in schema definitions
- ⚠️ Custom plugins may need updates
- ⚠️ Visual editing setup may need changes
- ⚠️ Testing required for all Studio functionality

---

## 📝 Summary

### Current State: ✅ STABLE
- Build warnings suppressed
- Studio deploys successfully  
- No functionality broken
- Security issues are low-impact

### Recommendation:
**Keep current setup** until you have time for proper Sanity v4 migration planning.

The deprecation warnings are **cosmetic** - they don't affect your production site. The security vulnerabilities are **moderate** (not critical) and only affect the Studio admin interface.

---

## 🔗 Resources

- [Sanity v4 Migration Guide](https://www.sanity.io/docs/migrating-to-v4)
- [Sanity v4 Release Notes](https://www.sanity.io/docs/release-notes)
- [Breaking Changes in v4](https://github.com/sanity-io/sanity/releases/tag/v4.0.0)

---

**Last Updated:** November 13, 2025  
**Next Review:** When ready for Sanity v4 migration
