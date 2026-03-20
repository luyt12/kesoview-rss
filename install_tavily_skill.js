const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\yongl\\.qclaw\\workspace\\skills\\tavily-search';
const destDir = 'C:\\Program Files\\QClaw\\resources\\openclaw\\config\\skills\\tavily-search';

// Create dest dir if not exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy files
const files = fs.readdirSync(srcDir);
files.forEach(f => {
  const src = path.join(srcDir, f);
  const dest = path.join(destDir, f);
  fs.copyFileSync(src, dest);
  console.log('Copied:', f);
});

console.log('\n✅ Tavily Search skill installed to:', destDir);
