#!/usr/bin/env node

/**
 * Build Diagnostic Tool
 * This script checks the build output for common issues that cause blank screens
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '..', 'build', 'client');

console.log('🔍 Build Diagnostic Tool\n');
console.log('=' .repeat(60));

// Check if build directory exists
if (!fs.existsSync(BUILD_DIR)) {
  console.error('❌ Build directory not found:', BUILD_DIR);
  console.log('\nPlease run: npm run build\n');
  process.exit(1);
}

console.log('✅ Build directory found:', BUILD_DIR);

// Check for critical files
const criticalFiles = [
  'index.html',
  'assets',
];

console.log('\n📄 Checking for critical files...');
for (const file of criticalFiles) {
  const filePath = path.join(BUILD_DIR, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.error(`  ❌ ${file} - MISSING!`);
  }
}

// Check index.html
const indexPath = path.join(BUILD_DIR, 'index.html');
if (fs.existsSync(indexPath)) {
  console.log('\n📄 Analyzing index.html...');
  const indexContent = fs.readFileSync(indexPath, 'utf-8');

  // Check for base href
  if (indexContent.includes('<base href="./"')) {
    console.log('  ✅ Contains <base href="./" />');
  } else {
    console.warn('  ⚠️ Missing <base href="./" />');
  }

  // Check for script tags
  const scriptMatches = indexContent.match(/<script[^>]*src="[^"]*"[^>]*>/g);
  if (scriptMatches) {
    console.log(`  ✅ Contains ${scriptMatches.length} script tag(s)`);
    scriptMatches.forEach((script) => {
      const srcMatch = script.match(/src="([^"]+)"/);
      if (srcMatch) {
        const src = srcMatch[1];
        if (src.startsWith('./') || src.startsWith('assets/')) {
          console.log(`    ✅ Relative path: ${src}`);
        } else if (src.startsWith('/')) {
          console.warn(`    ⚠️ Absolute path (may cause issues): ${src}`);
        } else {
          console.log(`    ℹ️ Other path: ${src}`);
        }
      }
    });
  } else {
    console.warn('  ⚠️ No script tags found');
  }

  // Check for link tags (CSS)
  const linkMatches = indexContent.match(/<link[^>]*href="[^"]*"[^>]*>/g);
  if (linkMatches) {
    console.log(`  ✅ Contains ${linkMatches.length} link tag(s)`);
  }

  // Check for root element
  if (indexContent.includes('id="root"')) {
    console.log('  ✅ Contains #root element');
  } else {
    console.error('  ❌ Missing #root element!');
  }

  // Check for errors or issues
  if (indexContent.includes('<!--')) {
    const commentMatches = indexContent.match(/<!--.*?-->/gs);
    if (commentMatches) {
      commentMatches.forEach((comment) => {
        if (comment.toLowerCase().includes('error') || comment.toLowerCase().includes('error')) {
          console.warn('  ⚠️ Found error comment:', comment.trim());
        }
      });
    }
  }
}

// Check assets directory
const assetsDir = path.join(BUILD_DIR, 'assets');
if (fs.existsSync(assetsDir)) {
  console.log('\n📦 Checking assets directory...');
  const files = fs.readdirSync(assetsDir);
  console.log(`  ✅ Found ${files.length} file(s)`);

  const jsFiles = files.filter((f) => f.endsWith('.js'));
  const cssFiles = files.filter((f) => f.endsWith('.css'));

  console.log(`    - JavaScript files: ${jsFiles.length}`);
  console.log(`    - CSS files: ${cssFiles.length}`);

  // Check for hashed filenames
  const hashedFiles = files.filter((f) => /\.[a-f0-9]{8,}\.(js|css)$/.test(f));
  console.log(`    - Hashed files: ${hashedFiles.length}`);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('✅ Diagnostic complete!\n');

// Suggestions
console.log('💡 Suggestions:');
console.log('  - If base href is missing, add <base href="./" /> to index.html');
console.log('  - If using absolute paths, change to relative paths in vite.config');
console.log('  - Check browser console (F12) for runtime errors');
console.log('  - Ensure all assets are loading correctly (Network tab)');
console.log('\n🚀 Ready to deploy!');
