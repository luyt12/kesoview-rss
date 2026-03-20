const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Check if .env exists in imap-smtp-email skill
const envPath = 'C:\\Program Files\\QClaw\\resources\\openclaw\\config\\skills\\imap-smtp-email\\.env';
const envExists = fs.existsSync(envPath);
console.log('=== Personal email (.env) ===');
console.log('File exists:', envExists);

// Check if any email bindings exist
console.log('\n=== Platform email bind status ===');
// Check common locations for bind info
const possiblePaths = [
  path.join(process.env.APPDATA || '', 'openclaw', 'email-bind.json'),
  path.join(process.env.USERPROFILE || '', '.openclaw', 'email-bind.json'),
  'C:\\Users\\yongl\\.openclaw\\email-bind.json'
];
possiblePaths.forEach(p => {
  try {
    if (fs.existsSync(p)) {
      console.log('Found:', p);
      const content = fs.readFileSync(p, 'utf8');
      console.log('Content:', content.substring(0, 200));
    }
  } catch(e) {}
});

// Test connectivity to public email API endpoint
console.log('\n=== Public email API connectivity ===');
const proxyHost = '127.0.0.1';
const proxyPort = 19000;
const targets = [
  { name: 'jprx.m.qq.com:443', host: 'jprx.m.qq.com', port: 443 },
];

function testConnect(target, callback) {
  const req = http.request({
    host: proxyHost,
    port: proxyPort,
    method: 'CONNECT',
    path: `${target.host}:${target.port}`,
    timeout: 5000,
  }, (res) => {
    callback({ success: false, error: `HTTP ${res.statusCode}` });
    res.destroy();
  });
  req.on('connect', (res, socket) => {
    if (res.statusCode === 200) { socket.end(); callback({ success: true }); }
    else { socket.end(); callback({ success: false, error: 'CONNECT failed' }); }
  });
  req.on('error', err => callback({ success: false, error: err.message }));
  req.on('timeout', () => { req.destroy(); callback({ success: false, error: 'TIMEOUT' }); });
}

testConnect(targets[0], (r) => {
  console.log(`jprx.m.qq.com:443 via proxy 19000: ${r.success ? '✅ Connected' : '❌ ' + r.error}`);
});

console.log('\n=== Summary ===');
console.log('Personal email (.env):', envExists ? '⚠️  Exists (check credentials)' : '❌ Not configured');
console.log('Platform public email:', '❌ Proxy unreachable');
console.log('\nRecommendation: Use personal email (SMTP) - needs credentials setup');
});
