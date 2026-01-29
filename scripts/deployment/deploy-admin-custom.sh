#!/bin/bash
set -e

echo "🚀 Deploying 'admin' site (Studio)..."
cd apps/studio || exit
# Deploy studio using its own config
# We need to link this directory to a NEW site first, or pass site ID if known
if [ -f ".netlify/state.json" ]; then
    npx netlify deploy --prod
else
    echo "⚠️  Studio not linked yet. Please link it to your 'admin' project:"
    echo "cd apps/studio && npx netlify link"
    echo "Then run this script again."
    # Attempt interactive deploy if not linked (this might wait for user input)
    npx netlify deploy --prod
fi
