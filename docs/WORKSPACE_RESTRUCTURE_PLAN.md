# Workspace Structure Audit & Restructuring Plan

## 📊 Current State Analysis

### Issues Identified:

#### 1. **Root Level Clutter**
- ❌ Loose scripts: `check-products.js`, `publish-product.js`, `setup-production-dataset.js`
- ❌ Misplaced: `src/` directory at root (should be in apps/web)
- ❌ Misplaced: `next-env.d.ts` at root (Next.js type file)
- ❌ Multiple documentation files (8+ MD files)
- ⚠️ Multiple lock files: `package-lock.json`, `pnpm-lock.yaml` (should only use pnpm)

#### 2. **Apps/Web Structure**
- ❌ Has nested `apps/` folder inside `apps/web/` (suspicious)
- ❌ Multiple environment files without clear purpose
- ✅ `src/` structure is good
- ✅ Scripts organized in `scripts/`

#### 3. **Apps/Studio Structure**
- ❌ 15+ loose script files at root level
- ❌ No clear scripts/ subdirectory
- ✅ Core config files properly placed

#### 4. **Documentation**
- ⚠️ 8 MD files at root (should consolidate)
- ✅ `docs/` folder exists
- ✅ `docs/archive/` for historical docs

---

## 🎯 Recommended Structure

### Standard Next.js + Sanity Monorepo Structure:

```
FredCMs/
├── .github/                    # GitHub Actions, workflows
├── .vscode/                    # VS Code settings
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── public/            # Static assets
│   │   ├── src/
│   │   │   ├── app/           # App Router pages
│   │   │   ├── components/    # React components
│   │   │   ├── lib/           # Utilities, helpers
│   │   │   ├── styles/        # Global styles
│   │   │   └── types/         # TypeScript types
│   │   ├── scripts/           # Web-specific scripts
│   │   ├── .env.example       # Environment template
│   │   ├── next.config.js     # Next.js config
│   │   ├── package.json       # Dependencies
│   │   └── tsconfig.json      # TS config
│   │
│   └── studio/                 # Sanity Studio
│       ├── schemas/           # Sanity schemas
│       ├── scripts/           # Studio-specific scripts
│       ├── src/               # Studio components
│       ├── sanity.config.ts   # Sanity config
│       ├── package.json       # Dependencies
│       └── tsconfig.json      # TS config
│
├── packages/                   # Shared packages
│   ├── config/                # Shared configs
│   ├── types/                 # Shared types
│   ├── ui/                    # Shared UI components
│   ├── utils/                 # Shared utilities
│   └── hooks/                 # Shared React hooks
│
├── scripts/                    # Project-wide scripts
│   ├── deployment/            # Deployment scripts
│   ├── data-management/       # Data scripts
│   ├── development/           # Dev scripts
│   ├── maintenance/           # Maintenance scripts
│   └── utils/                 # Script utilities
│
├── docs/                       # All documentation
│   ├── deployment/            # Deployment guides
│   ├── development/           # Dev guides
│   ├── optimization/          # Performance guides
│   ├── archive/               # Historical docs
│   └── README.md              # Docs index
│
├── config/                     # Root-level configs
├── netlify/                    # Netlify functions
├── .gitignore                  # Git ignore
├── package.json                # Root package.json
├── pnpm-workspace.yaml         # PNPM workspace
├── pnpm-lock.yaml             # Single lock file
├── turbo.json                 # Turborepo config
├── tsconfig.json              # Root TS config
├── README.md                  # Main README
└── netlify.toml               # Netlify config
```

---

## 🔨 Restructuring Actions

### Phase 1: Move Misplaced Files

```bash
# 1. Move loose root scripts to proper locations
mv check-products.js apps/studio/scripts/check-products.js
mv publish-product.js apps/studio/scripts/publish-product.js  
mv setup-production-dataset.js apps/studio/scripts/setup-production-dataset.js

# 2. Remove extra src/ at root (if it's duplicate)
# VERIFY FIRST: Does root src/ have unique content?

# 3. Move root next-env.d.ts if needed
# CHECK: Is this a symlink or duplicate?

# 4. Remove redundant lock file
rm package-lock.json  # Keep only pnpm-lock.yaml
```

### Phase 2: Organize Documentation

```bash
# Create documentation structure
mkdir -p docs/deployment docs/development docs/optimization

# Move deployment docs
mv QUICK_DEPLOY_GUIDE.md docs/deployment/
mv ISR_SETUP_GUIDE.md docs/deployment/
mv README_DEPLOYMENT.md docs/deployment/

# Move optimization docs
mv BUNDLE_OPTIMIZATION_GUIDE.md docs/optimization/
mv UNUSED_DEPENDENCIES.md docs/optimization/

# Move production docs
mv PRODUCTION_READY.md docs/deployment/
mv ROUTE_VERIFICATION.md docs/development/

# Update main README to reference new locations
```

### Phase 3: Organize Studio Scripts

```bash
cd apps/studio

# Create scripts directory structure
mkdir -p scripts/{data,navigation,templates,verification}

# Move scripts to appropriate subdirectories
mv check-*.js scripts/verification/
mv create-*.js scripts/data/
mv link-*.js scripts/templates/
mv map-*.js scripts/templates/
mv publish-*.js scripts/data/
mv restore-*.js scripts/navigation/
mv setup-*.js scripts/data/
mv update-*.js scripts/data/
```

### Phase 4: Clean Up Environment Files

```bash
cd apps/web

# Keep only these:
# .env.local (local development, gitignored)
# .env.production (production values, gitignored)
# .env.example (template, committed)

# Remove others if duplicates
```

### Phase 5: Verify Structure

```bash
# Check for broken imports (automated detection)
cd /Applications/MAMP/htdocs/FredCMs
./scripts/maintenance/fix-import-paths.js

# Build test
pnpm build

# Run tests
pnpm test
```

---

## 📋 File Movement Checklist

### To Move:
- [ ] `check-products.js` → `apps/studio/scripts/verification/`
- [ ] `publish-product.js` → `apps/studio/scripts/data/`
- [ ] `setup-production-dataset.js` → `apps/studio/scripts/data/`
- [ ] `QUICK_DEPLOY_GUIDE.md` → `docs/deployment/`
- [ ] `ISR_SETUP_GUIDE.md` → `docs/deployment/`
- [ ] `BUNDLE_OPTIMIZATION_GUIDE.md` → `docs/optimization/`
- [ ] `UNUSED_DEPENDENCIES.md` → `docs/optimization/`
- [ ] `PRODUCTION_READY.md` → `docs/deployment/`
- [ ] `ROUTE_VERIFICATION.md` → `docs/development/`
- [ ] `README_DEPLOYMENT.md` → `docs/deployment/`

### To Remove:
- [ ] `package-lock.json` (keep only pnpm-lock.yaml)
- [ ] Duplicate env files (after verification)
- [ ] `apps/web/npm-shrinkwrap.json` (if not used)

### To Verify:
- [ ] Root `src/` directory - check if duplicate
- [ ] Root `next-env.d.ts` - check if needed
- [ ] `apps/web/apps/` - nested apps folder?

---

## 🔍 Import Path Updates

After moving files, update these import patterns:

### Pattern 1: Studio Scripts
```diff
// Before (from other studio scripts)
- require('../check-products.js')
+ require('./verification/check-products.js')
```

### Pattern 2: Documentation Links
```diff
// In README.md
- See [Quick Deploy Guide](./QUICK_DEPLOY_GUIDE.md)
+ See [Quick Deploy Guide](./docs/deployment/QUICK_DEPLOY_GUIDE.md)
```

### Pattern 3: VS Code Tasks
Update `.vscode/tasks.json` if it references moved scripts

---

## ✅ Validation Steps

### 1. Build Verification
```bash
# Clean build
pnpm clean
pnpm install
pnpm build

# Should complete without errors
```

### 2. Import Verification
```bash
# Check for broken imports
grep -r "from.*check-products" apps/
grep -r "require.*publish-product" apps/

# Fix any found issues
```

### 3. Script Execution Test
```bash
# Test moved scripts still work
cd apps/studio
node scripts/verification/check-products.js
```

### 4. Documentation Links
```bash
# Check all MD files for broken links
find docs -name "*.md" -exec grep -l "\[.*\](\.\./" {} \;

# Update relative paths
```

---

## 📦 Package.json Updates

### Root package.json - Add Script Aliases
```json
{
  "scripts": {
    "clean": "rm -rf apps/*/node_modules apps/*/.next turbo .turbo",
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "studio:check": "cd apps/studio && node scripts/verification/check-products.js",
    "web:analyze": "cd apps/web && ANALYZE=true pnpm build"
  }
}
```

---

## 🚀 Post-Restructuring Tasks

### 1. Update Documentation Index
Create `docs/README.md` with:
```markdown
# Documentation Index

## Deployment
- [Quick Deploy Guide](./deployment/QUICK_DEPLOY_GUIDE.md)
- [ISR Setup](./deployment/ISR_SETUP_GUIDE.md)
- [Production Ready](./deployment/PRODUCTION_READY.md)

## Optimization  
- [Bundle Optimization](./optimization/BUNDLE_OPTIMIZATION_GUIDE.md)
- [Unused Dependencies](./optimization/UNUSED_DEPENDENCIES.md)

## Development
- [Route Verification](./development/ROUTE_VERIFICATION.md)
```

### 2. Update Main README.md
Point to new documentation structure

### 3. Update CI/CD
Check GitHub Actions workflows for hardcoded paths

### 4. Update .gitignore
Ensure new structure is properly ignored:
```gitignore
# Build outputs
apps/*/dist
apps/*/.next
apps/*/out

# Environment files
.env.local
.env.production
!.env.example
```

---

## ⚠️ Before You Start

### Backup Checklist:
- [ ] Commit all current work
- [ ] Create backup branch: `git checkout -b backup/pre-restructure`
- [ ] Push backup: `git push origin backup/pre-restructure`
- [ ] Tag current state: `git tag pre-restructure`

### Safety Commands:
```bash
# Create backup
git checkout -b backup/pre-restructure
git push origin backup/pre-restructure

# Create restructure branch
git checkout -b refactor/workspace-structure

# Now safe to proceed with moves
```

---

## 🎯 Success Criteria

- [ ] All files in logical directories
- [ ] No loose scripts at project root
- [ ] Documentation organized by category
- [ ] Single package manager (pnpm only)
- [ ] `pnpm build` completes successfully
- [ ] `pnpm dev` starts both apps
- [ ] All imports resolve correctly
- [ ] CI/CD still works
- [ ] Documentation links all work

---

**Ready to proceed?** Start with Phase 1 after creating your backup branch.
