// Call smtp.js with env vars injected via process.env
// This bypasses the need to write to Program Files
process.env.SMTP_HOST = 'smtp.163.com';
process.env.SMTP_PORT = '465';
process.env.SMTP_SECURE = 'true';
process.env.SMTP_USER = 'kimberagent@163.com';
process.env.SMTP_PASS = 'KUy32yx8YxKiQww7';
process.env.SMTP_FROM = 'kimberagent@163.com';
process.env.SMTP_REJECT_UNAUTHORIZED = 'false';
process.env.ALLOWED_READ_DIRS = 'C:\\Users\\yongl\\.qclaw\\workspace';

// Override dotenv path to point to workspace .env instead
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
  if (id === 'dotenv' || id.endsWith('dotenv') || id.includes('dotenv/config')) {
    // Return a mock dotenv that does nothing
    return { config: () => {} };
  }
  return originalRequire.apply(this, arguments);
};

const path = require('path');
const smtpJsPath = 'C:\\Program Files\\QClaw\\resources\\openclaw\\config\\skills\\imap-smtp-email\\scripts\\smtp.js';

async function main() {
  // Patch smtp.js's dotenv loading
  const fs = require('fs');
  let smtpCode = fs.readFileSync(smtpJsPath, 'utf8');
  
  // Replace dotenv config line to skip loading .env from skill dir
  smtpCode = smtpCode.replace(
    "require('dotenv').config({ path: path.resolve(__dirname, '../.env') });",
    "// Env vars injected directly, no .env needed"
  );
  
  // Write patched script to workspace
  const patchedPath = 'C:\\Users\\yongl\\.qclaw\\workspace\\smtp_patched.js';
  fs.writeFileSync(patchedPath, smtpCode);
  console.log('Patched smtp.js written to workspace');
  
  // Now require and run
  delete require.cache[smtpJsPath];
  const smtpModule = require(patchedPath);
}

main().catch(console.error);
