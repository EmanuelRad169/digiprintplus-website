#!/bin/bash

echo "🔍 Checking Sanity Visual Editing Configuration..."
echo "=================================================="

# Check packages
echo "📦 Checking installed packages..."
cd /Applications/MAMP/htdocs/FredCMs
echo "- @sanity/visual-editing in workspace: $(npm list @sanity/visual-editing | grep visual-editing || echo "❌ Not found")"
cd /Applications/MAMP/htdocs/FredCMs/apps/studio
echo "- @sanity/visual-editing in studio: $(npm list @sanity/visual-editing | grep visual-editing || echo "❌ Not found")"
cd /Applications/MAMP/htdocs/FredCMs/apps/web
echo "- @sanity/visual-editing in web: $(npm list @sanity/visual-editing | grep visual-editing || echo "❌ Not found")"
echo

# Check environment variables
echo "🔑 Checking environment variables..."
cd /Applications/MAMP/htdocs/FredCMs/apps/studio
echo "- Studio PREVIEW_URL: $(grep PREVIEW_URL .env.local || echo "❌ Not found")"
cd /Applications/MAMP/htdocs/FredCMs/apps/web
echo "- Web REVALIDATE_SECRET: $(grep REVALIDATE_SECRET .env.local || echo "❌ Not found")"
echo "- Web SANITY_STUDIO_URL: $(grep STUDIO_URL .env.local || echo "❌ Not found")"
echo

# Test API endpoints
echo "🌐 Testing API endpoints..."
echo "- Draft mode API: $(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001/api/draft-mode/enable?secret=preview-secret-key-2024")"
echo

# Run a visual editing check
echo "👁️ Testing visual editing connection..."
cd /Applications/MAMP/htdocs/FredCMs/apps/web
echo "Creating a test to verify visual editing..."

# Create test file if it doesn't exist
TEST_FILE="components/visual-editing-test.tsx"
if [ ! -f "$TEST_FILE" ]; then
cat > "$TEST_FILE" << 'EOL'
'use client'

import { useEffect, useState } from 'react'

export function VisualEditingTest() {
  const [status, setStatus] = useState('Checking...')
  
  useEffect(() => {
    const checkVisualEditing = async () => {
      try {
        // Check if we're in draft mode
        const isDraftMode = document.cookie.includes('__prerender_bypass')
        
        // Check for visual editing params
        const hasVisualParams = window.location.search.includes('preview') || 
                              window.location.search.includes('sanity')
        
        if (!isDraftMode && !hasVisualParams) {
          setStatus('Not in draft mode or visual editing mode')
          return
        }
        
        // Test API connection
        const response = await fetch('/api/draft-mode/enable?secret=preview-secret-key-2024')
        const success = response.ok
        
        if (success) {
          setStatus('✅ Visual editing API connection successful')
        } else {
          setStatus(`❌ API error: ${response.status} ${response.statusText}`)
        }
      } catch (error) {
        setStatus(`❌ Error: ${error.message}`)
      }
    }
    
    checkVisualEditing()
  }, [])
  
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px',
      background: '#000',
      color: '#fff',
      padding: '10px',
      borderRadius: '4px',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      Visual Editing Status: {status}
    </div>
  )
}
EOL
echo "- Created test component"
fi

echo
echo "✅ Checks complete! To test visual editing:"
echo "1. Ensure both studio and web servers are running"
echo "2. Go to the studio at http://localhost:3335"
echo "3. Open a document and click 'Open Preview'"
echo "4. Check browser console for any errors"
echo "=================================================="
