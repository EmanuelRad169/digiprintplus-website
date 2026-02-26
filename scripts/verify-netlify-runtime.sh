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
PNPM_VERSION=$(pnpm -v 2>/dev/null || echo "")
if [ -z "$PNPM_VERSION" ]; then
  echo "❌ pnpm not found"
  echo "Fix: Run 'corepack enable && corepack prepare pnpm@9.15.4 --activate'"
  exit 1
fi
echo "$PNPM_VERSION"
echo "✅ pnpm is available"
echo ""

echo "📋 Package Manager (from package.json):"
if [ -f "package.json" ]; then
  PKG_MANAGER=$(grep '"packageManager"' package.json | grep -o 'pnpm@[0-9.]*' || echo "")
  if [ -z "$PKG_MANAGER" ]; then
    echo "❌ ERROR: packageManager must be set to pnpm@9.15.4 in root package.json"
    exit 1
  fi
  echo "  $PKG_MANAGER"
  if [[ "$PKG_MANAGER" != "pnpm@9.15.4" ]]; then
    echo "⚠️  WARNING: packageManager is $PKG_MANAGER but expected pnpm@9.15.4"
  else
    echo "✅ packageManager is pnpm@9.15.4 (correct)"
  fi
else
  echo "❌ package.json not found"
  exit 1
fi
echo ""

echo "🔒 Lockfiles Present:"
if [ -f "pnpm-lock.yaml" ]; then
  echo "✅ pnpm-lock.yaml found"
else
  echo "❌ pnpm-lock.yaml NOT found"
  exit 1
fi

if [ -f "package-lock.json" ]; then
  echo "❌ ERROR: package-lock.json found (MUST NOT EXIST with pnpm)"
  echo "Fix: Run 'rm -f package-lock.json'"
  exit 1
else
  echo "✅ package-lock.json not found (correct)"
fi

if [ -f "yarn.lock" ]; then
  echo "❌ ERROR: yarn.lock found (MUST NOT EXIST with pnpm)"
  echo "Fix: Run 'rm -f yarn.lock'"
  exit 1
else
  echo "✅ yarn.lock not found (correct)"
fi
echo ""

echo "🔧 Next.js Version Consistency Check:"
ROOT_NEXT=$(grep '"next":' package.json | head -1 | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+' || echo "")
WEB_NEXT=$(grep '"next":' apps/web/package.json | head -1 | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+' || echo "")
UI_NEXT=$(grep '"next":' packages/ui/package.json | head -1 | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+' || echo "")

echo "  Root: $ROOT_NEXT"
echo "  apps/web: $WEB_NEXT"
echo "  packages/ui: $UI_NEXT"

if [ "$ROOT_NEXT" != "$WEB_NEXT" ] || [ "$ROOT_NEXT" != "$UI_NEXT" ]; then
  echo "⚠️  WARNING: Next.js versions differ across workspaces"
  echo "  Expected all to match pnpm override: 15.5.12"
else
  echo "✅ Next.js versions consistent"
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
