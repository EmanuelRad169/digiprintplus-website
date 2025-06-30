#!/bin/bash

# Startup script for testing Sanity AI Assist

# Check if OpenAI API key is set
if grep -q "your_openai_api_key_here" .env.local; then
  echo "⚠️  WARNING: You need to set your actual OpenAI API key in .env.local first!"
  echo "    Edit .env.local and replace 'your_openai_api_key_here' with your actual API key."
  echo ""
  read -p "Do you want to continue anyway? (y/n) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Start Sanity Studio
echo "🚀 Starting Sanity Studio with AI Assist enabled..."
echo "📝 See AI_ASSIST_GUIDE.md for usage instructions and prompt examples"
echo "✨ Look for the magic wand icon next to text fields when editing documents"
echo ""
npm run dev
