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
NODE_VERSION=$(node -v 2>/dev/null || echo "")
if [ -z "$NODE_VERSION" ]; then
  echo "❌ Node not found"
  exit 1
fi
echo "$NODE_VERSION"

# Extract major version (e.g., v20.11.1 -> 20)
NODE_MAJOR=$(echo "$NODE_VERSION" | sed 's/^v//' | cut -d. -f1)
if [ "$NODE_MAJOR" != "20" ]; then
  echo ""
  echo "❌ ERROR: Node major version must be 20, found: $NODE_MAJOR"
  echo "Expected: v20.x.x"
  echo "Actual: $NODE_VERSION"
  exit 1
fi
echo "✅ Node 20.x detected (correct)"
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
