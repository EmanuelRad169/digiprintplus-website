#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = '/Applications/MAMP/htdocs/FredCMs';

// Files that need Radix component prop fixes
const radixFiles = [
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

function fixRadixComponentProps(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix forwardRef components that need className and children props
    const forwardRefComponentPattern = /const\s+(\w+)\s*=\s*React\.forwardRef<([^,]+),\s*([^>]+)>\s*\(\s*\(\s*\{\s*([^}]*)\s*\},\s*ref\s*\)\s*=>/g;
    
    content = content.replace(forwardRefComponentPattern, (match, componentName, refType, propsType, destructuredProps) => {
      const usesClassName = destructuredProps.includes('className');
      const usesChildren = destructuredProps.includes('children');
      
      if (usesClassName || usesChildren) {
        // Replace the props type with an intersection that includes standard HTML props
        let newPropsType = propsType;
        
        // Add HTML attributes for className support
        if (usesClassName && !propsType.includes('HTMLAttributes')) {
          newPropsType = `${propsType} & React.HTMLAttributes<HTMLElement>`;
          modified = true;
        }
        
        // For components that use children, ensure children prop is included
        if (usesChildren && !propsType.includes('children')) {
          newPropsType = `${newPropsType} & { children?: React.ReactNode }`;
          modified = true;
        }
        
        return match.replace(propsType, newPropsType);
      }
      
      return match;
    });
    
    // Alternative pattern for components defined differently
    const componentPropsPattern = /React\.ComponentPropsWithoutRef<typeof ([^>]+)>/g;
    
    content = content.replace(componentPropsPattern, (match, componentRef) => {
      // Check if this component uses className or children in its implementation
      const usesClassName = content.includes('className={');
      const usesChildren = content.includes('children') && !content.includes('children:');
      
      if (usesClassName || usesChildren) {
        modified = true;
        return `React.ComponentPropsWithoutRef<typeof ${componentRef}> & React.HTMLAttributes<HTMLElement>`;
      }
      
      return match;
    });
    
    // Write back if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed Radix props: ${path.relative(projectRoot, filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

console.log('🔧 Starting Radix UI Component Type Fixes\n');

let totalFixed = 0;

radixFiles.forEach(file => {
  const filePath = path.join(projectRoot, file);
  if (fs.existsSync(filePath)) {
    if (fixRadixComponentProps(filePath)) {
      totalFixed++;
    }
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log(`\n✨ Radix Type Fixes Complete: Updated ${totalFixed} files`);
