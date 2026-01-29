#!/bin/bash

# Netlify pre-build script to prepare standalone deployment
set -e

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

echo "✅ All components verified"
echo "🚀 Ready for build..."