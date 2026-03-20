const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check QClaw config dir for any proxy/gateway/API key configs
const configDir = 'C:\\Program Files\\QClaw\\resources\\openclaw\\config';
const qclawDir = path.dirname(configDir);

// Find all .json/.yaml/.env files in qclaw config and settings dirs
function findFiles(dir, files) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        findFiles(full, files);
      } else if (/\.(json|yaml|yml|env|toml|ini|conf|cfg)$/i.test(entry.name)) {
        files.push(full);
      }
    }
  } catch(e) {}
}

const files = [];
findFiles(configDir, files);
findFiles(qclawDir, files);

console.log('=== Found config files ===');
files.forEach(f => console.log(f));

// Check for tvly in env vars
console.log('\n=== Env vars with proxy/gateway/key ===');
Object.keys(process.env).forEach(k => {
  if (/proxy|gateway|auth|remote|key|token|port|url/i.test(k)) {
    console.log(k + ' = ' + (k.toLowerCase().includes('key') || k.toLowerCase().includes('token') || k.toLowerCase().includes('auth') && !k.includes('AUTH_GATEWAY_PORT') ? '[REDACTED]' : process.env[k]));
  }
});
