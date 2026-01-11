#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (file.endsWith('.js')) {
      callback(filePath);
    }
  });
}

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Replace @soulboard/* imports with relative paths pointing to dist folder
  const regex = /require\(["']@soulboard\/([^"']+)["']\)/g;
  content = content.replace(regex, (match, importPath) => {
    modified = true;
    // Get relative path from current file to the import
    const fileDir = path.dirname(filePath);
    const distDir = path.join(__dirname, 'dist');
    const targetPath = path.join(distDir, importPath);
    let relativePath = path.relative(fileDir, targetPath);
    // Ensure it starts with ./ or ../
    if (!relativePath.startsWith('.')) {
      relativePath = './' + relativePath;
    }
    // Convert Windows paths to Unix
    relativePath = relativePath.replace(/\\/g, '/');
    return `require("${relativePath}")`;
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed imports in ${filePath}`);
  }
}

const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  walkDir(distDir, fixImports);
  console.log('Import paths fixed!');
}
