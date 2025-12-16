#!/usr/bin/env node
/**
 * Project Cleanup Analysis Script
 * Identifies unused files, duplicates, and candidates for cleanup
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const EXCLUDED_DIRS = ['node_modules', '.next', 'dist', '.git', '.turbo', '.vercel'];
const FILE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js', '.css', '.scss'];

class CleanupAnalyzer {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.allFiles = [];
    this.imports = new Map();
    this.duplicates = [];
    this.unusedCandidates = [];
    this.debugFiles = [];
  }

  // Scan directory recursively
  scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(this.rootDir, fullPath);
      
      if (entry.isDirectory()) {
        if (!EXCLUDED_DIRS.includes(entry.name)) {
          this.scanDirectory(fullPath);
        }
      } else {
        const ext = path.extname(entry.name);
        if (FILE_EXTENSIONS.includes(ext)) {
          this.allFiles.push(relativePath);
          this.analyzeFile(fullPath, relativePath);
        }
      }
    }
  }

  // Analyze individual file
  analyzeFile(fullPath, relativePath) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    const fileName = path.basename(relativePath);
    
    // Check for debug/test/temp files
    if (fileName.match(/(test|spec|example|temp|debug|old|backup|unused|\.bak)/i)) {
      this.debugFiles.push({
        path: relativePath,
        reason: 'Suspicious filename pattern'
      });
    }
    
    // Extract imports
    const importMatches = content.matchAll(/import\s+.*?from\s+['"](.+?)['"]/g);
    for (const match of importMatches) {
      const importPath = match[1];
      if (!importPath.startsWith('.')) continue; // Skip node_modules
      
      if (!this.imports.has(relativePath)) {
        this.imports.set(relativePath, []);
      }
      this.imports.get(relativePath).push(importPath);
    }
    
    // Check for duplicate patterns
    const baseName = fileName.replace(/\.(tsx|ts|jsx|js)$/, '');
    if (baseName.match(/-v\d+|_old|_new|Copy|backup/i)) {
      this.duplicates.push({
        path: relativePath,
        pattern: 'Versioned or backup file'
      });
    }
    
    // Check if file is mostly empty
    const meaningfulLines = content.split('\n').filter(line => {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*');
    }).length;
    
    if (meaningfulLines < 5 && content.length < 200) {
      this.unusedCandidates.push({
        path: relativePath,
        reason: 'Nearly empty file',
        lines: meaningfulLines
      });
    }
  }

  // Find files that are never imported
  findUnimportedFiles() {
    const imported = new Set();
    
    for (const [file, imports] of this.imports.entries()) {
      for (const imp of imports) {
        imported.add(imp);
      }
    }
    
    const unimported = [];
    for (const file of this.allFiles) {
      const fileName = path.basename(file, path.extname(file));
      let isImported = false;
      
      for (const imp of imported) {
        if (imp.includes(fileName)) {
          isImported = true;
          break;
        }
      }
      
      // Skip entry points and config files
      const skipPatterns = [
        'page.tsx',
        'layout.tsx',
        'route.ts',
        'middleware.ts',
        '.config.',
        'index.ts',
        'index.tsx'
      ];
      
      const shouldSkip = skipPatterns.some(pattern => file.includes(pattern));
      
      if (!isImported && !shouldSkip) {
        unimported.push(file);
      }
    }
    
    return unimported;
  }

  // Generate report
  generateReport() {
    const unimported = this.findUnimportedFiles();
    
    const report = {
      summary: {
        totalFiles: this.allFiles.length,
        debugFiles: this.debugFiles.length,
        duplicates: this.duplicates.length,
        emptyFiles: this.unusedCandidates.length,
        unimported: unimported.length
      },
      details: {
        debugFiles: this.debugFiles,
        duplicates: this.duplicates,
        emptyFiles: this.unusedCandidates,
        potentiallyUnused: unimported.slice(0, 50) // Limit for readability
      },
      recommendations: []
    };
    
    // Add recommendations
    if (this.debugFiles.length > 0) {
      report.recommendations.push('Review and remove debug/test files from production code');
    }
    if (this.duplicates.length > 0) {
      report.recommendations.push('Consolidate or remove duplicate/versioned files');
    }
    if (unimported.length > 10) {
      report.recommendations.push(`${unimported.length} files appear unused - verify and clean up`);
    }
    
    return report;
  }

  // Run analysis
  analyze() {
    console.log('🔍 Starting project cleanup analysis...\n');
    
    this.scanDirectory(this.rootDir);
    const report = this.generateReport();
    
    // Save report
    const reportPath = path.join(this.rootDir, 'cleanup-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Print summary
    console.log('📊 Analysis Summary:');
    console.log(`   Total Files Scanned: ${report.summary.totalFiles}`);
    console.log(`   Debug/Test Files: ${report.summary.debugFiles}`);
    console.log(`   Duplicate Patterns: ${report.summary.duplicates}`);
    console.log(`   Nearly Empty Files: ${report.summary.emptyFiles}`);
    console.log(`   Potentially Unused: ${report.summary.unimported}`);
    console.log(`\n✅ Full report saved to: ${reportPath}\n`);
    
    return report;
  }
}

// Run if called directly
if (require.main === module) {
  const rootDir = path.join(__dirname, '..');
  const analyzer = new CleanupAnalyzer(rootDir);
  analyzer.analyze();
}

module.exports = CleanupAnalyzer;
