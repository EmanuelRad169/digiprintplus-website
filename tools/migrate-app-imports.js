#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = '/Applications/MAMP/htdocs/FredCMs';

// Import path mapping rules for apps
const appImportMappings = [
  // Utils
  { from: /@\/lib\/utils/g, to: '@workspace/utils' },
  
  // Hooks  
  { from: /@\/hooks\/use-toast/g, to: '@workspace/hooks' },
  
  // UI components (standard ones that moved to workspace)
  { from: /@\/components\/ui\/(button|input|textarea|label|dialog)/g, to: '@workspace/ui' },
  
  // Keep app-specific UI components that didn't move
  // (like sanity-image which is app-specific)
];

function updateImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Apply import mappings
    appImportMappings.forEach(({ from, to }) => {
      const originalContent = content;
      
      if (from.source.includes('(button|input|textarea|label|dialog)')) {
        // Handle multiple component imports from UI
        content = content.replace(
          /@\/components\/ui\/(button|input|textarea|label|dialog)/g,
          '@workspace/ui'
        );
      } else {
        content = content.replace(from, to);
      }
      
      if (content !== originalContent) {
        modified = true;
      }
    });
    
    // Write back if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${path.relative(projectRoot, filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function findAndUpdateFiles(directory) {
  if (!fs.existsSync(directory)) {
    console.log(`⚠️  Directory not found: ${directory}`);
    return 0;
  }

  const files = fs.readdirSync(directory);
  let totalUpdated = 0;
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    
    // Skip node_modules and other dirs
    if (file === 'node_modules' || file.startsWith('.')) {
      continue;
    }
    
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      totalUpdated += findAndUpdateFiles(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (updateImportsInFile(filePath)) {
        totalUpdated++;
      }
    }
  }
  
  return totalUpdated;
}

console.log('🚀 Starting Phase 2B: Update App Imports\n');

// Update web app
console.log('📱 Updating apps/web...');
const webPath = path.join(projectRoot, 'apps/web');
const webUpdated = findAndUpdateFiles(webPath);

// Update studio app  
console.log('\n🎨 Updating apps/studio...');
const studioPath = path.join(projectRoot, 'apps/studio');
const studioUpdated = findAndUpdateFiles(studioPath);

console.log(`\n✨ Phase 2B Complete: Updated ${webUpdated + studioUpdated} files`);
console.log(`   - Web app: ${webUpdated} files`);
console.log(`   - Studio app: ${studioUpdated} files`);

// Test compilation
console.log('\n🧪 Next: Test the apps...');
console.log('Run: cd apps/web && npm run type-check');
console.log('Run: cd apps/studio && npm run type-check');
