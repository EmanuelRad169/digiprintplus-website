#!/bin/bash
##############################################
# Netlify Runtime Verification
# Prints Node, npm, pnpm versions and lockfile status
##############################################

set -e

echo "=========================================="
echo "🔍 NETLIFY RUNTIME VERIFICATION"
echo "=========================================="
echo ""

echo "📦 Node.js Version:"
node -v || echo "❌ Node not found"
echo ""

echo "📦 npm Version:"
npm -v || echo "❌ npm not found"
echo ""

echo "📦 pnpm Version:"
pnpm -v || echo "❌ pnpm not found"
echo ""

echo "📋 Package Manager (from package.json):"
if [ -f "package.json" ]; then
  grep -A1 '"packageManager"' package.json || echo "❌ packageManager field not found"
else
  echo "❌ package.json not found"
fi
echo ""

echo "🔒 Lockfiles Present:"
if [ -f "pnpm-lock.yaml" ]; then
  echo "✅ pnpm-lock.yaml found"
else
  echo "❌ pnpm-lock.yaml NOT found"
fi

if [ -f "package-lock.json" ]; then
  echo "⚠️  package-lock.json found (SHOULD NOT EXIST)"
else
  echo "✅ package-lock.json not found (correct)"
fi

if [ -f "yarn.lock" ]; then
  echo "⚠️  yarn.lock found (SHOULD NOT EXIST)"
else
  echo "✅ yarn.lock not found (correct)"
fi
echo ""

echo "⚙️  Node Version Source:"
if [ -f ".nvmrc" ]; then
  echo "  .nvmrc: $(cat .nvmrc)"
fi
if [ -f ".node-version" ]; then
  echo "  .node-version: $(cat .node-version)"
fi
echo ""

echo "=========================================="
echo "✅ RUNTIME VERIFICATION COMPLETE"
echo "=========================================="
