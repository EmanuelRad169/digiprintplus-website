#!/bin/bash
# Remove unnecessary Sharp platform binaries after build

echo "🔧 Removing unnecessary Sharp platform binaries..."

cd /Applications/MAMP/htdocs/FredCMs/apps/web/.next/standalone/node_modules/.pnpm || exit 0

# Remove Sharp binaries for platforms we don't need (keep only Linux x64)
REMOVED_SIZE=0
REMOVED_COUNT=0

# Array of patterns to remove
declare -a PATTERNS=(
  "@img+sharp-darwin-"
  "@img+sharp-win32-"
  "@img+sharp-linux-arm@"
  "@img+sharp-linux-arm64@"
  "@img+sharp-linux-ppc64@"
  "@img+sharp-linux-s390x@"
  "@img+sharp-linux-riscv64@"
  "@img+sharp-linuxmusl-"
  "@img+sharp-wasm32@"
  "@img+sharp-libvips-darwin-"
  "@img+sharp-libvips-linuxmusl-"
  "@img+sharp-libvips-linux-arm@"
  "@img+sharp-libvips-linux-arm64@"
  "@img+sharp-libvips-linux-ppc64@"
  "@img+sharp-libvips-linux-s390x@"
  "@img+sharp-libvips-linux-riscv64@"
)

for pattern in "${PATTERNS[@]}"; do
  # Use find to locate matching directories
  while IFS= read -r dir; do
    if [ -d "$dir" ]; then
      SIZE=$(du -sh "$dir" 2>/dev/null | cut -f1)
      echo "  Removing $dir ($SIZE)"
      rm -rf "$dir"
      REMOVED_COUNT=$((REMOVED_COUNT + 1))
    fi
  done < <(find . -maxdepth 1 -type d -name "${pattern}*" 2>/dev/null)
done

echo "✅ Removed $REMOVED_COUNT unnecessary Sharp binaries (~210MB saved)"
echo ""
