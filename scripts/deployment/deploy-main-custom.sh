#!/bin/bash
set -e

echo "🚀 Deploying 'main' site (Web)..."
# Use the root netlify.toml which is now configured for Web only
npx netlify deploy --prod --filter digiprintplus-web
