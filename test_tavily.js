const https = require('https');

const API_KEY = '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';
const body = JSON.stringify({
  api_key: API_KEY,
  query: 'latest AI news',
  search_depth: 'basic',
  max_results: 3
});

const options = {
  hostname: 'api.tavily.com',
  port: 443,
  path: '/search',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  },
  timeout: 15000
};

// First test DNS resolution
const dns = require('dns');
dns.lookup('api.tavily.com', (err, addr) => {
  if (err) {
    console.log('❌ DNS resolution failed:', err.message);
  } else {
    console.log('✅ DNS resolved to:', addr);
  }
});

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('✅ Connected! Status:', res.statusCode);
    try {
      const parsed = JSON.parse(data);
      console.log('Response:', JSON.stringify(parsed, null, 2).substring(0, 500));
    } catch(e) {
      console.log('Raw response:', data.substring(0, 300));
    }
  });
});

req.on('error', (err) => {
  console.log('❌ Request failed:', err.message);
});

req.on('timeout', () => {
  req.destroy();
  console.log('❌ Request timed out');
});

req.write(body);
req.end();
