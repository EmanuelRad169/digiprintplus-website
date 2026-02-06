#!/bin/bash

# Script to verify Sanity fetcher exports
set -e

echo "🔍 Verifying Sanity Fetcher Exports..."
echo ""

FETCHERS_FILE="src/lib/sanity/fetchers.ts"

if [ ! -f "$FETCHERS_FILE" ]; then
    echo "❌ ERROR: $FETCHERS_FILE not found!"
    exit 1
fi

echo "✅ File exists: $FETCHERS_FILE"
echo ""

# Check for each critical export
EXPORTS=(
    "getAllTemplateCategories"
    "getAllTemplates"
    "getTemplateBySlug"
    "getAllBlogPosts"
    "getBlogPostBySlug"
    "getFeaturedBlogPosts"
    "getAllBlogSlugs"
    "getBlogCategories"
)

MISSING=0

for export_name in "${EXPORTS[@]}"; do
    if grep -q "export async function $export_name" "$FETCHERS_FILE"; then
        echo "✅ Found: $export_name"
    else
        echo "❌ Missing: $export_name"
        MISSING=$((MISSING + 1))
    fi
done

echo ""

# Check for TypeScript interfaces
INTERFACES=(
    "BlogPost"
    "Template"
    "TemplateCategory"
)

for interface_name in "${INTERFACES[@]}"; do
    if grep -q "export interface $interface_name" "$FETCHERS_FILE"; then
        echo "✅ Found interface: $interface_name"
    else
        echo "❌ Missing interface: $interface_name"
        MISSING=$((MISSING + 1))
    fi
done

echo ""

if [ $MISSING -eq 0 ]; then
    echo "✅ All exports verified successfully!"
    echo ""
    echo "📊 File stats:"
    wc -l "$FETCHERS_FILE"
    echo ""
    echo "🔍 Last modified:"
    ls -lh "$FETCHERS_FILE" | awk '{print $6, $7, $8, $9}'
    exit 0
else
    echo "❌ ERROR: $MISSING export(s) missing!"
    exit 1
fi
