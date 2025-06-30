#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = '/Applications/MAMP/htdocs/FredCMs';

function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

function getFileModified(filePath) {
  try {
    return fs.statSync(filePath).mtime;
  } catch {
    return new Date(0);
  }
}

function readFileHeader(filePath, lines = 5) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n').slice(0, lines).join('\n');
  } catch {
    return 'Cannot read file';
  }
}

function findFiles(dir, extensions, results = []) {
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        findFiles(filePath, extensions, results);
      } else if (stat.isFile()) {
        const ext = path.extname(file);
        if (extensions.includes(ext) || extensions.some(e => file.includes(e))) {
          results.push({
            path: filePath,
            relativePath: path.relative(projectRoot, filePath),
            name: file,
            size: getFileSize(filePath),
            modified: getFileModified(filePath),
            header: readFileHeader(filePath)
          });
        }
      }
    }
  } catch (error) {
    console.log(`Error reading directory ${dir}: ${error.message}`);
  }
  
  return results;
}

// Find all relevant files
const markdownFiles = findFiles(projectRoot, ['.md']);
const scriptFiles = findFiles(projectRoot, ['.ts', '.js']).filter(f => 
  f.relativePath.includes('script') || 
  f.name.startsWith('seed') || 
  f.name.startsWith('migrate') || 
  f.name.startsWith('verify') || 
  f.name.startsWith('cleanup') ||
  f.name.startsWith('test-') ||
  f.name.startsWith('check-') ||
  f.name.startsWith('validate-')
);
const configFiles = findFiles(projectRoot, ['.json', '.js', '.ts']).filter(f => 
  f.name.includes('config') || 
  f.name.includes('tsconfig') ||
  f.name.includes('package') ||
  f.name.includes('eslint') ||
  f.name.includes('prettier') ||
  f.name.includes('tailwind')
);
const shellFiles = findFiles(projectRoot, ['.sh']);

console.log('# PROJECT FILE ANALYSIS REPORT');
console.log('Generated on:', new Date().toISOString());
console.log('Project Root:', projectRoot);
console.log('');

// 1. Documentation Files Analysis
console.log('## 1. DOCUMENTATION FILES (.md) - ' + markdownFiles.length + ' files');
console.log('');
markdownFiles.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

markdownFiles.forEach(file => {
  console.log(`### ${file.name}`);
  console.log(`**Path:** \`${file.relativePath}\``);
  console.log(`**Size:** ${(file.size / 1024).toFixed(1)} KB`);
  console.log(`**Modified:** ${file.modified.toDateString()}`);
  console.log('**Content Preview:**');
  console.log('```');
  console.log(file.header.substring(0, 200) + (file.header.length > 200 ? '...' : ''));
  console.log('```');
  console.log('');
});

// 2. Scripts Analysis
console.log('## 2. SCRIPTS ANALYSIS - ' + scriptFiles.length + ' files');
console.log('');

const scriptCategories = {
  seed: scriptFiles.filter(f => f.name.includes('seed')),
  migrate: scriptFiles.filter(f => f.name.includes('migrate')),
  verify: scriptFiles.filter(f => f.name.includes('verify') || f.name.includes('validate')),
  cleanup: scriptFiles.filter(f => f.name.includes('cleanup')),
  test: scriptFiles.filter(f => f.name.includes('test')),
  check: scriptFiles.filter(f => f.name.includes('check')),
  utility: scriptFiles.filter(f => !['seed', 'migrate', 'verify', 'validate', 'cleanup', 'test', 'check'].some(cat => f.name.includes(cat)))
};

Object.entries(scriptCategories).forEach(([category, files]) => {
  if (files.length > 0) {
    console.log(`### ${category.toUpperCase()} Scripts (${files.length} files)`);
    files.forEach(file => {
      console.log(`- **${file.name}** (\`${file.relativePath}\`) - ${(file.size / 1024).toFixed(1)} KB`);
    });
    console.log('');
  }
});

// 3. Configuration Files
console.log('## 3. CONFIGURATION FILES - ' + configFiles.length + ' files');
console.log('');

const configCategories = {
  typescript: configFiles.filter(f => f.name.includes('tsconfig')),
  tailwind: configFiles.filter(f => f.name.includes('tailwind')),
  nextjs: configFiles.filter(f => f.name.includes('next.config')),
  package: configFiles.filter(f => f.name.includes('package')),
  eslint: configFiles.filter(f => f.name.includes('eslint') || f.name.includes('prettier')),
  other: configFiles.filter(f => !['tsconfig', 'tailwind', 'next.config', 'package', 'eslint', 'prettier'].some(cat => f.name.includes(cat)))
};

Object.entries(configCategories).forEach(([category, files]) => {
  if (files.length > 0) {
    console.log(`### ${category.toUpperCase()} Configs (${files.length} files)`);
    files.forEach(file => {
      console.log(`- **${file.name}** (\`${file.relativePath}\`)`);
    });
    console.log('');
  }
});

// 4. Shell Scripts
console.log('## 4. SHELL SCRIPTS - ' + shellFiles.length + ' files');
console.log('');
shellFiles.forEach(file => {
  console.log(`- **${file.name}** (\`${file.relativePath}\`) - ${(file.size / 1024).toFixed(1)} KB`);
});
console.log('');

// 5. Summary Statistics
console.log('## 5. SUMMARY STATISTICS');
console.log('');
console.log(`- **Total Documentation Files:** ${markdownFiles.length}`);
console.log(`- **Total Script Files:** ${scriptFiles.length}`);
console.log(`- **Total Configuration Files:** ${configFiles.length}`);
console.log(`- **Total Shell Scripts:** ${shellFiles.length}`);
console.log(`- **Grand Total Analyzed:** ${markdownFiles.length + scriptFiles.length + configFiles.length + shellFiles.length}`);
console.log('');

const totalSize = [...markdownFiles, ...scriptFiles, ...configFiles, ...shellFiles]
  .reduce((sum, file) => sum + file.size, 0);
console.log(`- **Total Size:** ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log('');

// 6. Recommendations
console.log('## 6. CONSOLIDATION OPPORTUNITIES');
console.log('');
console.log('### High Priority (Immediate Cleanup)');
console.log('- **Documentation:** ' + markdownFiles.filter(f => 
  f.name.includes('SUMMARY') || 
  f.name.includes('REPORT') || 
  f.name.includes('COMPLETE') ||
  f.name.includes('AUDIT')
).length + ' report/summary files can be archived');

console.log('- **Scripts:** ' + scriptFiles.filter(f => 
  f.name.includes('test-') || 
  f.name.includes('debug') ||
  f.relativePath.includes('examples/')
).length + ' test/debug scripts can be moved to tools/');

console.log('- **Configs:** ' + configFiles.filter(f => 
  f.name.includes('optimized') || 
  f.name.includes('analyzer')
).length + ' specialized configs can be conditionally loaded');

console.log('');
console.log('### Configuration Duplications');
if (configCategories.typescript.length > 2) {
  console.log(`- **TypeScript:** ${configCategories.typescript.length} tsconfig files (recommend 1 base + workspace extends)`);
}
if (configCategories.tailwind.length > 2) {
  console.log(`- **Tailwind:** ${configCategories.tailwind.length} tailwind configs (recommend 1 preset + workspace extends)`);
}
if (configCategories.package.length > 3) {
  console.log(`- **Package:** ${configCategories.package.length} package files (some may be optimization artifacts)`);
}
