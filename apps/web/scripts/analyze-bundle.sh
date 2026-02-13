#!/bin/bash
# Comprehensive Bundle Size Analysis Report

echo "========================================="
echo "📊 BUNDLE SIZE OPTIMIZATION ANALYSIS"
echo "Date: $(date)"
echo "========================================="
echo ""

cd /Applications/MAMP/htdocs/FredCMs/apps/web

# 1. Current Build Size
echo "1️⃣  CURRENT BUILD SIZES"
echo "-----------------------------------"
if [ -d ".next" ]; then
  echo "Total .next directory: $(du -sh .next 2>/dev/null | cut -f1)"
  echo "Standalone bundle: $(du -sh .next/standalone 2>/dev/null | cut -f1)"
  echo "Server chunks: $(du -sh .next/server 2>/dev/null | cut -f1)"
  echo "Static assets: $(du -sh .next/static 2>/dev/null | cut -f1)"
else
  echo "⚠️  No build found - run 'npm run build' first"
fi
echo ""

# 2. Largest Packages Analysis
echo "2️⃣  LARGEST DEPENDENCIES (Top 20)"
echo "-----------------------------------"
cd ../.. && pnpm list --depth=0 --filter=digiprintplus-web 2>/dev/null | grep -v "^Legend" | grep -v "^$" | head -20
echo ""

# 3. Check for Duplicates
echo "3️⃣  DUPLICATE PACKAGE CHECK"
echo "-----------------------------------"
cd /Applications/MAMP/htdocs/FredCMs
echo "Checking for duplicate React versions..."
pnpm why react 2>&1 | grep "react " | sort -u | head -10
echo ""

# 4. Unused Dependencies
echo "4️⃣  POTENTIALLY UNUSED DEPENDENCIES"
echo "-----------------------------------"
cd apps/web
echo "Dependencies declared in package.json:"
cat package.json | grep -A 100 '"dependencies":' | grep -B 100 '"devDependencies"' | grep '"@' | wc -l | xargs echo "Total: "
echo ""

# 5. Static Assets
echo "5️⃣  STATIC ASSETS ANALYSIS"
echo "-----------------------------------"
if [ -d "public" ]; then
  echo "Total public directory: $(du -sh public 2>/dev/null | cut -f1)"
  echo ""
  echo "Largest files in public:"
  find public -type f -exec du -h {} \; 2>/dev/null | sort -hr | head -10
else
  echo "No public directory found"
fi
echo ""

# 6. Image Optimization Check
echo "6️⃣  IMAGE OPTIMIZATION CHECK"
echo "-----------------------------------"
echo "Images not using next/image:"
grep -r "src=" src/ 2>/dev/null | grep -v "next/image" | grep -E '\.(jpg|jpeg|png|gif|webp)' | wc -l | xargs echo "Count: "
echo ""

# 7. Code Splitting Opportunities
echo "7️⃣  CODE SPLITTING OPPORTUNITIES"
echo "-----------------------------------"
echo "Large components without dynamic imports:"
find src/components -name "*.tsx" -type f -exec wc -l {} \; 2>/dev/null | sort -nr | head -10 | while read lines file; do
  if [ $lines -gt 200 ]; then
    echo "  $file ($lines lines)"
  fi
done
echo ""

# 8. Server Bundle Analysis
echo "8️⃣  SERVER BUNDLE TOP FILES"
echo "-----------------------------------"
if [ -d ".next/server" ]; then
  find .next/server -name "*.js" -type f -exec du -h {} \; 2>/dev/null | sort -hr | head -15
fi
echo ""

# 9. Package.json sideEffects Check
echo "9️⃣  TREE-SHAKING CONFIGURATION"
echo "-----------------------------------"
if grep -q "sideEffects" package.json; then
  echo "✅ sideEffects configured:"
  grep -A 5 "sideEffects" package.json
else
  echo "⚠️  No sideEffects field - tree shaking may not be optimal"
  echo "   Add: \"sideEffects\": false to package.json for better tree shaking"
fi
echo ""

# 10. Build-time vs Runtime Dependencies
echo "🔟 DEPENDENCY CLASSIFICATION"
echo "-----------------------------------"
echo "Production dependencies: $(cat package.json | grep -A 100 '"dependencies":' | grep -c '": "')"
echo "Dev dependencies: $(cat package.json | grep -A 100 '"devDependencies":' | grep -c '": "')"
echo ""

echo "========================================="
echo "✅ Analysis Complete!"
echo "========================================="
echo ""
echo "💡 NEXT STEPS:"
echo "1. Run 'npm run analyze' to open interactive bundle analyzer"
echo "2. Review the duplicate dependencies and consider upgrading"
echo "3. Add dynamic imports for large components"
echo "4. Optimize images in public/ directory"
echo "5. Set sideEffects: false in package.json if applicable"
