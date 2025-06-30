#!/bin/bash
echo "Testing Next.js static assets..."

BASE_URL="http://localhost:3000"

# Test main page
echo "Testing main page..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/")
echo "Main page status: $STATUS"

# Test CSS file
echo "Testing CSS file..."
CSS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/_next/static/css/app/layout.css")
echo "CSS file status: $CSS_STATUS"

# Test a chunk file
echo "Testing JS chunks..."
CHUNK_FILE=$(find .next/static/chunks -name "*.js" | head -1 | sed 's|.next/static/|_next/static/|')
if [ ! -z "$CHUNK_FILE" ]; then
    CHUNK_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/$CHUNK_FILE")
    echo "Chunk file status: $CHUNK_STATUS"
fi

# Test font files
echo "Testing font files..."
FONT_FILE=$(find .next/static/media -name "*.woff2" | head -1 | sed 's|.next/static/|_next/static/|')
if [ ! -z "$FONT_FILE" ]; then
    FONT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/$FONT_FILE")
    echo "Font file status: $FONT_STATUS"
fi

echo "Asset test complete!"
