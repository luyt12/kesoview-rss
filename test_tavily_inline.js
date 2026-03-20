// Direct inline test - no require
const https = require('https');

const API_KEY = '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';

function tavilySearch(query, options = {}) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      api_key: API_KEY,
      query: query,
      search_depth: options.searchDepth || 'basic',
      max_results: options.maxResults || 5,
      include_answer: options.includeAnswer || false,
      include_raw_content: false,
      include_images: false
    });

    const req = https.request({
      hostname: 'api.tavily.com',
      port: 443,
      path: '/search',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      timeout: 20000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const p = JSON.parse(data);
          if (res.statusCode === 200) resolve(p);
          else reject(new Error(`HTTP ${res.statusCode}: ${p.message || data}`));
        } catch(e) { reject(new Error(data.substring(0, 200))); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(body);
    req.end();
  });
}

const query = process.argv.slice(2).join(' ') || 'OpenClaw AI agents';

console.log('=== Tavily Search Skill Test ===');
console.log('Query:', query);

tavilySearch(query, { maxResults: 5 })
  .then(r => {
    console.log('\n✅ SUCCESS! Got', r.results.length, 'results');
    console.log('\nTop results:');
    r.results.slice(0, 5).forEach((item, i) => {
      console.log(`\n${i+1}. ${item.title}`);
      console.log(`   ${item.url}`);
      console.log(`   Score: ${item.score?.toFixed(3)}`);
      console.log(`   ${item.content?.substring(0, 120)}...`);
    });
    if (r.answer) console.log('\n📝 AI Answer:', r.answer);
  })
  .catch(err => {
    console.error('\n❌ FAILED:', err.message);
    process.exit(1);
  });
