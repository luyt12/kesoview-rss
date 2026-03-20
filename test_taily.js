const http = require('http');
const https = require('https');
const { execSync } = require('child_process');

// Test direct internet connectivity
function testHttp(url, name, callback) {
  const start = Date.now();
  const req = http.get(url, { timeout: 8000 }, (res) => {
    console.log(`✅ ${name}: ${res.statusCode} (${Date.now() - start}ms)`);
    res.destroy();
    callback(true);
  });
  req.on('error', (err) => {
    console.log(`❌ ${name}: ${err.message} (${Date.now() - start}ms)`);
    callback(false);
  });
  req.on('timeout', () => {
    req.destroy();
    console.log(`❌ ${name}: TIMEOUT`);
    callback(false);
  });
}

// Check Windows proxy settings
console.log('=== Windows Proxy Settings ===');
try {
  const out = execSync('reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" 2>nul', { encoding: 'utf8' });
  const lines = out.split('\n').filter(l => l.includes('ProxyEnable') || l.includes('ProxyServer') || l.includes('ProxyOverride'));
  lines.forEach(l => console.log(l.trim()));
} catch(e) {
  console.log('Could not read proxy settings');
}

// Check environment variables for proxy
console.log('\n=== Proxy env vars ===');
['HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'http_proxy', 'https_proxy', 'all_proxy', 'TVLY_PROXY', 'TVLY_URL'].forEach(k => {
  const v = process.env[k];
  if (v) console.log(`${k}=${v}`);
});

// Check if any common VPN ports are listening
console.log('\n=== Common VPN ports listening ===');
const vpnPorts = [7890, 7891, 1080, 8080, 8118, 9050, 9051, 10808, 19000, 19001];
vpnPorts.forEach(port => {
  try {
    const s = require('net').createConnection({ port, host: '127.0.0.1', timeout: 500 });
    s.on('connect', () => {
      console.log(`✅ Port ${port} is open`);
      s.destroy();
    });
    s.on('timeout', () => {
      s.destroy();
    });
    s.on('error', () => {
      // port closed
    });
  } catch(e) {}
});

setTimeout(() => {
  console.log('\n=== Direct internet test ===');
  testHttp('http://www.baidu.com', 'Baidu', () => {});
  testHttp('http://www.qq.com', 'QQ.com', () => {});
  testHttp('https://www.google.com', 'Google HTTPS', () => {});
}, 500);
