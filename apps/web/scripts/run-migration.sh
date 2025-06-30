#!/bin/bash

# Change to the project directory
cd /Applications/MAMP/htdocs/FredCMs/apps/web

# Check if ts-node is installed globally or locally
if command -v ts-node &> /dev/null; then
  echo "Running migration script with ts-node..."
  ts-node scripts/migrateFeatures.ts
elif [ -f "./node_modules/.bin/ts-node" ]; then
  echo "Running migration script with local ts-node..."
  ./node_modules/.bin/ts-node scripts/migrateFeatures.ts
else
  echo "ts-node not found. Installing..."
  npm install --save-dev ts-node typescript @types/node
  echo "Running migration script..."
  ./node_modules/.bin/ts-node scripts/migrateFeatures.ts
fi

echo "Process completed."
