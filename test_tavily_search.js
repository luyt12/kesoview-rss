const https = require('https');

const API_KEY = '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';

async function tavilySearch(query, options = {}) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      api_key: API_KEY,
      query,
      search_depth: options.depth || 'basic',
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
      timeout: 15000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error('Parse error: ' + data.substring(0, 200))); }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(body);
    req.end();
  });
}

// Test 1: Latest AI news
(async () => {
  console.log('=== Test 1: AI 新闻 ===');
  try {
    const r1 = await tavilySearch('latest artificial intelligence news today', { depth: 'basic', maxResults: 5 });
    console.log('✅ Tavily Search OK');
    console.log(`   查询: ${r1.query}`);
    r1.results.forEach((item, i) => {
      console.log(`   ${i+1}. ${item.title}`);
      console.log(`      ${item.url}`);
    });
  } catch(e) {
    console.log('❌ Test 1 failed:', e.message);
  }

  // Test 2: 搜索中文内容
  console.log('\n=== Test 2: 中文内容搜索 ===');
  try {
    const r2 = await tavilySearch('中国最新科技新闻', { depth: 'basic', maxResults: 3 });
    console.log('✅ 中文搜索 OK');
    r2.results.forEach((item, i) => {
      console.log(`   ${i+1}. ${item.title}`);
    });
  } catch(e) {
    console.log('❌ Test 2 failed:', e.message);
  }

  // Test 3: 深入搜索
  console.log('\n=== Test 3: 深入搜索 (deep) ===');
  try {
    const r3 = await tavilySearch('OpenAI GPT-5 release date', { depth: 'advanced', maxResults: 3 });
    console.log('✅ 深入搜索 OK');
    r3.results.forEach((item, i) => {
      console.log(`   ${i+1}. ${item.title}`);
      console.log(`      分数: ${item.score?.toFixed(3)} | ${item.url.substring(0, 60)}...`);
    });
  } catch(e) {
    console.log('❌ Test 3 failed:', e.message);
  }
})();
