const https = require('https');

const API_KEY = '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';

function tavilySearch(query, options = {}) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      api_key: API_KEY,
      query: query,
      search_depth: 'advanced',
      max_results: options.maxResults || 5,
      include_answer: true,
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
      timeout: 25000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error(data.substring(0, 300))); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(body);
    req.end();
  });
}

const topics = [
  { name: '🌍 地缘政治', q: 'US Iran war 2026 latest developments March 20' },
  { name: '🤖 AI 与科技', q: 'AI technology news today March 2026' },
  { name: '🇺🇸 美国政治', q: 'Trump administration news today March 20 2026' },
  { name: '💰 市场与经济', q: 'stock market economy news today March 20 2026' },
];

(async () => {
  for (const topic of topics) {
    try {
      process.stdout.write(`[${topic.name}] 搜索中...\n`);
      const r = await tavilySearch(topic.q, { maxResults: 4 });
      process.stdout.write(`[${topic.name}] ✅ 成功\n`);
      process.stdout.write(`AI摘要: ${(r.answer || '无').substring(0, 200)}\n`);
      r.results.forEach((item, i) => {
        process.stdout.write(`  ${i+1}. ${item.title}\n`);
        process.stdout.write(`     ${item.url}\n`);
      });
      process.stdout.write('\n');
    } catch(e) {
      process.stdout.write(`[${topic.name}] ❌ 失败: ${e.message}\n\n`);
    }
  }
  process.stdout.write('=== DONE ===\n');
})();
