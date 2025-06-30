#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = '/Applications/MAMP/htdocs/FredCMs';

// Import path mapping rules
const importMappings = [
  // Workspace imports
  { from: /@\/lib\/utils/g, to: '@workspace/utils' },
  { from: /@\/hooks\/use-toast/g, to: '@workspace/hooks' },
  
  // Internal UI component imports (relative paths)
  { from: /@\/components\/ui\/([^'"`]+)/g, to: './$1' },
  
  // Keep external imports as-is (they'll be handled by dependencies)
];

function updateImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Apply import mappings
    importMappings.forEach(({ from, to }) => {
      const originalContent = content;
      content = content.replace(from, to);
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
  const files = fs.readdirSync(directory);
  let totalUpdated = 0;
  
  for (const file of files) {
    const filePath = path.join(directory, file);
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

console.log('🚀 Starting Phase 2: Import Path Migration\n');

// Update UI components
console.log('📦 Updating packages/ui components...');
const uiPath = path.join(projectRoot, 'packages/ui/src');
const uiUpdated = findAndUpdateFiles(uiPath);

// Update hooks
console.log('\n📦 Updating packages/hooks...');
const hooksPath = path.join(projectRoot, 'packages/hooks/src');
const hooksUpdated = findAndUpdateFiles(hooksPath);

console.log(`\n✨ Phase 2 Complete: Updated ${uiUpdated + hooksUpdated} files`);
console.log(`   - UI components: ${uiUpdated} files`);
console.log(`   - Hooks: ${hooksUpdated} files`);

// Test compilation
console.log('\n🧪 Testing TypeScript compilation...');
console.log('Run the following to test packages:');
console.log('  cd packages/utils && npm run type-check');
console.log('  cd packages/ui && npm run type-check');
console.log('  cd packages/hooks && npm run type-check');
