#!/bin/bash

# Script to fix dependency issues in the project

echo "🔄 Running dependency fix script..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install --legacy-peer-deps

# Sync Tailwind CSS versions
echo "🔄 Syncing Tailwind CSS versions..."
npm install tailwindcss@3.3.3 postcss@8.4.27 autoprefixer@10.4.14 --save-dev --legacy-peer-deps

# Install web app dependencies
echo "📦 Installing web app dependencies..."
cd apps/web
npm install --legacy-peer-deps
npm install tailwindcss@3.3.3 postcss@8.4.27 autoprefixer@10.4.14 tailwindcss-animate --save-dev --legacy-peer-deps

# Install studio dependencies
echo "📦 Installing studio dependencies..."
cd ../studio
npm install --legacy-peer-deps
npm install tailwindcss@3.3.3 postcss@8.4.27 autoprefixer@10.4.14 tailwindcss-animate --save-dev --legacy-peer-deps

# Return to root
cd ../..

# Create shrinkwrap to lock dependencies
echo "🔒 Locking dependencies with npm-shrinkwrap.json..."
npm shrinkwrap

echo "✅ Dependency fix complete!"
