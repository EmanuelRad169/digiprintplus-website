# Bundle Optimization Strategy - Action Plan

## 📊 Analysis Summary

**Current Status:**
- Total build size: ~353MB → **Target: <250MB**
- Standalone bundle: ~316MB (OVER 250MB LIMIT)
- Main issues identified:
  1. Sharp image library with all platform binaries (~227MB)
  2. Large components without code splitting (575 lines)
  3. No tree-shaking configuration
  4. Multiple Radix UI components (~18 packages)
  5. Storybook in devDependencies (not affecting production but bloating node_modules)

---

## ✅ Step 1: Dependencies Audit & Removal

### 1.1 Remove Unused Dependencies

**Identified Potentially Unused:**
```bash
# Check if these are actually used in your codebase
@react-pdf/renderer  # 4.3.2 - Used for PDF generation, keep if needed
next-auth           # 4.24.13 - Authentication, check if used
next-seo            # 6.8.0 - SEO management, check if used
```

**Action:**
```bash
cd /Applications/MAMP/htdocs/FredCMs/apps/web
# Search for usage
grep -r "from '@react-pdf/renderer'" src/
grep -r "from 'next-auth'" src/
grep -r "from 'next-seo'" src/

# If not found, remove:
pnpm remove @react-pdf/renderer next-auth next-seo
```

### 1.2 Consolidate UI Libraries

**Issue:** Multiple component libraries increasing bundle:
- @headlessui/react (19 KB)
- @radix-ui/* (18 separate packages)
- @heroicons/react (bundling all icons)

**Solution:** Stick with Radix UI only, remove Headless UI if not critical:
```bash
# Check Headless UI usage
grep -r "@headlessui" src/ | wc -l

# If minimal usage, migrate to Radix UI equivalent
```

### 1.3 Icon Optimization (IMPORTANT)

**Current:** Importing entire icon libraries
**Solution:** Tree-shakeable imports (already configured!)

```typescript
// ❌ Bad: Imports entire library
import { HomeIcon, UserIcon } from '@heroicons/react/24/outline';

// ✅ Good: Tree-shakeable (our config handles this)
import HomeIcon from '@heroicons/react/24/outline/HomeIcon';
import UserIcon from '@heroicons/react/24/outline/UserIcon';
```

---

## ✅ Step 2: Code Splitting Implementation

### 2.1 Dynamic Imports for Large Components

**Identified Large Components (>200 lines):**

```typescript
// apps/web/src/app/templates/page.tsx
import dynamic from 'next/dynamic';

// ❌ Before: Static import
import { MegaMenuNew } from '@/components/MegaMenuNew';
import { ProductTabs } from '@/components/product-tabs';
import { RequestCustomDesignModal } from '@/components/RequestCustomDesignModal';

// ✅ After: Dynamic import
const MegaMenuNew = dynamic(() => import('@/components/MegaMenuNew'), {
  loading: () => <div>Loading...</div>,
  ssr: true // Keep SSR for SEO
});

const ProductTabs = dynamic(() => import('@/components/product-tabs'), {
  ssr: false // Client-only if not needed for SEO
});

const RequestCustomDesignModal = dynamic(
  () => import('@/components/RequestCustomDesignModal'),
  { ssr: false } // Modals don't need SSR
);
```

### 2.2 Route-based Code Splitting

Next.js automatically splits routes, but verify you're not importing heavy components in `layout.tsx`:

```typescript
// ❌ Bad: Heavy component in root layout
import { ProductCategoryNav } from '@/components/product-category-nav';

// ✅ Good: Only in specific routes
// Import ProductCategoryNav only in /products layout
```

---

## ✅ Step 3: Tree-Shaking Configuration

### 3.1 Update package.json

```json
{
  "name": "digiprintplus-web",
  "sideEffects": [
    "*.css",
    "*.scss"
  ]
}
```

### 3.2 Verify Excluded Packages

Some packages have side effects and can't be tree-shaken. Document them:

```json
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/styles/**/*",
    "./src/lib/sanity.ts" // If it has initialization side effects
  ]
}
```

---

## ✅ Step 4: Sharp Platform Binary Cleanup (CRITICAL)

**Impact: Saves ~210MB** ✅ Already implemented!

The script `remove-sharp-binaries.sh` removes unnecessary platform binaries.

**Verify it runs after build:**
```bash
# Check if it's in post-build script
grep "remove-sharp-binaries" apps/web/package.json
```

---

## ✅ Step 5: Asset Optimization

### 5.1 Image Optimization

**Found 3 images not using next/image:**
```bash
# Find them
grep -rn "src=" src/ | grep -v "next/image" | grep -E '\.(jpg|jpeg|png|webp)'
```

**Fix:**
```tsx
// ❌ Before
<img src="/images/hero.jpg" alt="Hero" />

// ✅ After
import Image from 'next/image';
<Image 
  src="/images/hero.jpg" 
  alt="Hero"
  width={1200}
  height={600}
  priority // For above-fold images
/>
```

### 5.2 Font Optimization

Verify fonts are using Next.js font optimization:
```typescript
// next.config.js already has forceSwcTransforms: true ✅
```

---

## ✅ Step 6: Webpack/Build Configuration Review

### 6.1 Verify outputFileTracingExcludes (Already done! ✅)

```javascript
// next.config.js
outputFileTracingExcludes: {
  '*': [
    'node_modules/@swc/**',
    'node_modules/@esbuild/**',
    'node_modules/webpack/**',
    // ... etc
  ]
}
```

### 6.2 Additional Optimizations

```javascript
// next.config.js
experimental: {
  optimizePackageImports: [
    '@radix-ui/react-icons',
    '@heroicons/react',
    'lucide-react',
    'framer-motion'
  ],
},
```

---

## ✅ Step 7: Dependency Cleanup Commands

```bash
cd /Applications/MAMP/htdocs/FredCMs

# 1. Remove duplicate dependencies
pnpm dedupe

# 2. Check for outdated packages with smaller alternatives
pnpm outdated

# 3. Audit dependencies
pnpm audit

# 4. Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## ✅ Step 8: CI/CD Bundle Size Check

### 8.1 Create Bundle Size Tracking Script

```bash
# apps/web/scripts/check-bundle-size.sh
#!/bin/bash
MAX_SIZE_MB=250
BUNDLE_SIZE=$(du -sm .next/standalone 2>/dev/null | cut -f1)

if [ $BUNDLE_SIZE -gt $MAX_SIZE_MB ]; then
  echo "❌ Bundle size ($BUNDLE_SIZE MB) exceeds limit ($MAX_SIZE_MB MB)"
  exit 1
else
  echo "✅ Bundle size OK: $BUNDLE_SIZE MB / $MAX_SIZE_MB MB"
fi
```

### 8.2 Add to package.json

```json
{
  "scripts": {
    "build:check": "npm run build && ./scripts/check-bundle-size.sh"
  }
}
```

### 8.3 GitHub Actions (optional)

```yaml
# .github/workflows/bundle-size.yml
name: Bundle Size Check
on: [push, pull_request]
jobs:
  check-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build:check
```

---

## 🎯 Priority Action Items

### Immediate (Do Now):
1. ✅ Run Sharp binary cleanup (already implemented)
2. ✅ Add tree-shaking configuration (sideEffects)
3. 🔧 Remove unused dependencies (@react-pdf/renderer, next-auth if unused)
4. 🔧 Add dynamic imports to top 5 large components

### Short-term (This Week):
5. 🔧 Consolidate icon imports to tree-shakeable format
6. 🔧 Migrate 3 images to next/image
7. 🔧 Add bundle size CI check
8. 🔧 Run `pnpm dedupe`

### Long-term (Ongoing):
9. Monitor bundle size in each PR
10. Regular dependency audits
11. Consider lazy-loading non-critical routes

---

## 📈 Expected Results

| Optimization | Size Reduction | Status |
|-------------|---------------|--------|
| Sharp binaries cleanup | ~210MB | ✅ Done |
| Remove cache from deploy | ~765MB → 0 | ✅ Done |
| Tree-shaking config | ~10-20MB | ⏳ To do |
| Dynamic imports | ~15-30MB | ⏳ To do |
| Icon optimization | ~5-10MB | ⏳ To do |
| Unused deps removal | ~10-25MB | ⏳ To do |
| **Total Expected** | **~250MB** | **Target** |

---

## 🔍 Monitoring & Analysis

```bash
# Regular checks
pnpm run analyze              # Interactive bundle analysis
pnpm run analyze:server       # Server bundle only
pnpm run analyze:browser      # Client bundle only
./scripts/analyze-bundle.sh   # Full report
```

---

## Next Steps

1. Wait for `ANALYZE=true pnpm build` to complete
2. Open browser to view interactive bundle visualization
3. Identify specific large modules in the graph
4. Apply optimizations from this guide
5. Rebuild and verify size reduction
