#!/bin/bash

# Netlify pre-build script to prepare standalone deployment
set -e
cd "$(dirname "$0")"

echo "🏗️  Preparing Netlify deployment..."

# Copy essential workspace packages if they don't exist locally
echo "📦 Checking required utilities..."

# Ensure utils exist locally
if [ ! -f "src/lib/utils.ts" ]; then
    echo "⚙️  Creating local utils..."
    mkdir -p src/lib
    cat > src/lib/utils.ts << 'EOF'
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
EOF
fi

# Verify all UI components exist locally
echo "🎨 Verifying UI components..."
UI_DIR="src/components/ui"
if [ ! -d "$UI_DIR" ]; then
    echo "❌ UI components directory not found"
    exit 1
fi

# Check for required components
for component in "button.tsx" "input.tsx" "textarea.tsx" "dialog.tsx" "label.tsx"; do
    if [ ! -f "$UI_DIR/$component" ]; then
        echo "❌ Missing required component: $component"
        exit 1
    fi
done

# Temporarily rename problematic API routes for static export
echo "🔧 Preparing API routes for static export..."
mkdir -p .netlify-backup

# Backup and disable API routes that conflict with static export
API_ROUTES=("deploy" "draft-mode" "preview" "exit-preview" "revalidate" "quotes" "sanity-proxy" "send-custom-request" "sitemap" "test-blog" "visual-editing" "categories" "products")
API_FILES=("cors.ts" "errors.ts")
DYNAMIC_ROUTES=("robots.txt" "sitemap.ts")
PROBLEMATIC_ROUTES=("templates/[slug]" "products/category/[category]/[item]")

for route in "${API_ROUTES[@]}"; do
    if [ -d "src/app/api/$route" ]; then
        echo "   Backing up API route: $route"
        mv "src/app/api/$route" ".netlify-backup/$route" 2>/dev/null || true
    fi
done

for file in "${API_FILES[@]}"; do
    if [ -f "src/app/api/$file" ]; then
        echo "   Backing up API file: $file"
        mv "src/app/api/$file" ".netlify-backup/$file" 2>/dev/null || true
    fi
done

for route in "${DYNAMIC_ROUTES[@]}"; do
    if [ -f "src/app/$route" ] || [ -d "src/app/$route" ]; then
        echo "   Backing up dynamic route: $route"
        mv "src/app/$route" ".netlify-backup/$route" 2>/dev/null || true
    fi
done

for route in "${PROBLEMATIC_ROUTES[@]}"; do
    if [ -d "src/app/$route" ]; then
        echo "   Backing up problematic route: $route"
        route_name=$(echo "$route" | tr '/' '-' | tr '[' '_' | tr ']' '_')
        mv "src/app/$route" ".netlify-backup/$route_name" 2>/dev/null || true
    fi
done

echo "✅ All components verified"
echo "🚀 Ready for build..."