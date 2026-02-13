# Unused Dependencies Report

## ❌ Confirmed Unused (Safe to Remove)

### 1. next-auth (0 usages found)
**Size Impact:** ~2-3 MB
**Removal Command:**
```bash
cd /Applications/MAMP/htdocs/FredCMs
pnpm remove next-auth --filter=digiprintplus-web
```

### 2. @headlessui/react (0 usages found)  
**Size Impact:** ~300-500 KB
**Note:** You're using Radix UI instead, which is better.
**Removal Command:**
```bash
pnpm remove @headlessui/react --filter=digiprintplus-web
```

## ✅ In Use (Keep)

### 1. @react-pdf/renderer (1 usage)
**Location:** Check output above for specific file
**Keep:** Yes, actively used for PDF generation

---

## Additional Optimization Opportunities

### Radix UI Consolidation
You're using 18 separate Radix UI packages. Consider:
- Using only the components you need
- Check if all 18 are actually used

**Audit Command:**
```bash
cd /Applications/MAMP/htdocs/FredCMs/apps/web

# Check each Radix package usage
for pkg in $(cat package.json | grep "@radix-ui" | cut -d'"' -f2); do
  count=$(grep -r "$pkg" src/ 2>/dev/null | wc -l)
  echo "$pkg: $count usages"
done
```

### Framer Motion
**Size:** ~100KB (significant)
**Check usage:**
```bash
grep -r "from 'framer-motion'" src/ | wc -l
```
If minimal, consider replacing with CSS animations.

---

## Recommended Removals (Run These)

```bash
cd /Applications/MAMP/htdocs/FredCMs

# Remove unused dependencies
pnpm remove next-auth @headlessui/react --filter=digiprintplus-web

# Deduplicate dependencies
pnpm dedupe

# Reinstall to clean up
rm -rf node_modules/.pnpm
pnpm install

# Rebuild and check size
cd apps/web && pnpm build:netlify
./scripts/check-bundle-size.sh
```

---

## Expected Savings

| Package | Size | Impact |
|---------|------|--------|
| next-auth | ~2-3 MB | Medium |
| @headlessui/react | ~500 KB | Small |
| Dedupe | ~5-10 MB | Medium |
| **Total** | **~8-14 MB** | **Good** |

Combined with Sharp cleanup (~210MB already done), this would put you closer to target!
