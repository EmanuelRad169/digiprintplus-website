#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = '/Applications/MAMP/htdocs/FredCMs';

// Files that need prop interface fixes
const problematicFiles = [
  'packages/ui/src/components/context-menu.tsx',
  'packages/ui/src/components/menubar.tsx', 
  'packages/ui/src/components/navigation-menu.tsx',
  'packages/ui/src/components/radio-group.tsx',
  'packages/ui/src/components/scroll-area.tsx',
  'packages/ui/src/components/slider.tsx',
  'packages/ui/src/components/switch.tsx',
  'packages/ui/src/components/toggle-group.tsx',
  'packages/ui/src/components/toggle.tsx'
];

// Common prop extensions needed
const propExtensions = {
  className: 'className?: string',
  children: 'children?: React.ReactNode'
};

function fixComponentProps(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Pattern 1: Fix forwardRef component props that are missing className/children
    const forwardRefPattern = /React\.ComponentPropsWithoutRef<typeof [^>]+> & \{([^}]*)\}/g;
    
    content = content.replace(forwardRefPattern, (match, existingProps) => {
      let newProps = existingProps;
      
      // Add className if not present and the component uses it
      if (!newProps.includes('className') && match.includes('className')) {
        newProps += newProps.trim() ? '\n    className?: string;' : '\n    className?: string;';
        modified = true;
      }
      
      // Add children if not present and the component uses it  
      if (!newProps.includes('children') && match.includes('children')) {
        newProps += newProps.trim() ? '\n    children?: React.ReactNode;' : '\n    children?: React.ReactNode;';
        modified = true;
      }
      
      return `React.ComponentPropsWithoutRef<typeof ${match.split('typeof ')[1].split('>')[0]}> & {${newProps}\n}`;
    });
    
    // Pattern 2: Fix cases where props are completely missing base HTML attributes
    const restrictiveTypePattern = /React\.ComponentProps<typeof ([^>]+)>/g;
    
    content = content.replace(restrictiveTypePattern, (match, componentType) => {
      // If the component uses className or children, extend with HTML attributes
      const usesClassName = content.includes('className={');
      const usesChildren = content.includes('children');
      
      if (usesClassName || usesChildren) {
        modified = true;
        return `React.ComponentProps<typeof ${componentType}> & React.HTMLAttributes<HTMLElement>`;
      }
      
      return match;
    });
    
    // Write back if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed props: ${path.relative(projectRoot, filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

console.log('🔧 Starting Phase 3: TypeScript Definition Fixes\n');

let totalFixed = 0;

problematicFiles.forEach(file => {
  const filePath = path.join(projectRoot, file);
  if (fs.existsSync(filePath)) {
    if (fixComponentProps(filePath)) {
      totalFixed++;
    }
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log(`\n✨ Phase 3 Complete: Fixed ${totalFixed} files`);
console.log('\n🧪 Testing TypeScript compilation...');
console.log('Run: cd packages/ui && npm run type-check');
