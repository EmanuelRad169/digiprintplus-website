#!/bin/bash

# Script to generate TypeScript types from Sanity schemas

echo "🔄 Generating TypeScript types from Sanity schemas..."

# Make sure the output directory exists
mkdir -p apps/web/types/sanity

# Use sanity-codegen to generate types from Sanity schemas
npx sanity-codegen

echo "✅ TypeScript types generation complete!"

# Instructions for installing sanity-codegen
# npm install --save-dev sanity-codegen

# Also requires sanity-codegen.config.ts at project root:
# export default {
#   schemaPath: 'apps/studio/schemas',
#   outputPath: 'apps/web/types/sanity/schema.ts',
#   prettier: true,
# };
