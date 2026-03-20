const http = require('http');
const https = require('https');

// Test proxy connectivity to multiple targets
const targets = [
  { name: 'Google', host: 'google.com', port: 443, path: '/', protocol: 'https' },
  { name: 'GitHub API', host: 'api.github.com', port: 443, path: '/zen', protocol: 'https' },
  { name: 'Brave Search', host: 'api.search.brave.com', port: 443, path: '/res/v1/search?q=test', protocol: 'https' },
];

const proxyHost = '127.0.0.1';
const proxyPort = 19000;

function testProxy(target, callback) {
  const start = Date.now();
  const req = http.request({
    host: proxyHost,
    port: proxyPort,
    method: 'CONNECT',
    path: `${target.host}:${target.port}`,
    timeout: 8000,
  }, (res) => {
    callback({ name: target.name, success: false, error: 'Unexpected response code: ' + res.statusCode, ms: Date.now() - start });
    res.destroy();
  });

  req.on('connect', (res, socket) => {
    if (res.statusCode === 200) {
      socket.end();
      callback({ name: target.name, success: true, ms: Date.now() - start });
    } else {
      socket.end();
      callback({ name: target.name, success: false, error: 'CONNECT failed: ' + res.statusCode, ms: Date.now() - start });
    }
  });

  req.on('error', (err) => {
    callback({ name: target.name, success: false, error: err.message, ms: Date.now() - start });
  });

  req.on('timeout', () => {
    req.destroy();
    callback({ name: target.name, success: false, error: 'TIMEOUT', ms: Date.now() - start });
  });
}

function runTests(index, results) {
  if (index >= targets.length) {
    console.log('\n=== Summary ===');
    results.forEach(r => {
      console.log(`${r.success ? '✅' : '❌'} ${r.name}: ${r.success ? r.ms + 'ms' : r.error}`);
    });
    return;
  }
  testProxy(targets[index], (result) => {
    results.push(result);
    runTests(index + 1, results);
  });
}

console.log('Testing proxy 127.0.0.1:19000...');
runTests(0, []);
