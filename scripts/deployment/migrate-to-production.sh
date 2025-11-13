#!/bin/bash

echo "🚀 Copying data from development to production dataset..."

cd /Applications/MAMP/htdocs/FredCMs/apps/studio

# Export development dataset
echo "📤 Exporting development dataset..."
npx sanity dataset export development development-backup.tar.gz

# Import to production dataset
echo "📥 Importing to production dataset..."
npx sanity dataset import development-backup.tar.gz production --replace

echo "✅ Data migration complete!"
echo "🗑️ Cleaning up backup file..."
rm development-backup.tar.gz

echo "🎉 Development data has been copied to production!"