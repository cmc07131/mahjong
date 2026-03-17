#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Add type="module" to script tags
  html = html.replace(
    /<script src="([^"]+)" defer><\/script>/g,
    '<script src="$1" type="module"></script>'
  );
  
  fs.writeFileSync(indexPath, html);
  console.log('✅ Fixed script tags in index.html');
} else {
  console.log('❌ index.html not found');
}
