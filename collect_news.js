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

(async () => {
  const topics = [
    { name: '🌍 Geopolitics - US/Iran War', q: 'US Iran war 2026 latest developments March 20' },
    { name: '🤖 AI & Tech', q: 'AI technology news today March 2026' },
    { name: '🇺🇸 US Politics', q: 'Trump administration news today March 20 2026' },
    { name: '🇨🇳 China', q: 'China news today March 20 2026' },
    { name: '💰 Markets', q: 'stock market economy news today March 20 2026' },
  ];

  const report = {};
  for (const topic of topics) {
    try {
      console.log(`Searching: ${topic.name}...`);
      const r = await tavilySearch(topic.q, { maxResults: 5 });
      report[topic.name] = {
        answer: r.answer,
        results: r.results
      };
      console.log(`  Got ${r.results.length} results`);
    } catch(e) {
      console.log(`  FAILED: ${e.message}`);
      report[topic.name] = { error: e.message };
    }
  }

  // Save raw report
  const fs = require('fs');
  fs.writeFileSync('C:\\Users\\yongl\\.qclaw\\workspace\\daily_report_raw.json', JSON.stringify(report, null, 2));
  console.log('\n✅ Report saved to daily_report_raw.json');
  console.log('\n=== ANSWERS ===');
  for (const [topic, data] of Object.entries(report)) {
    console.log(`\n${topic}:`);
    if (data.error) console.log('  ERROR:', data.error);
    else if (data.answer) console.log('  ', data.answer.substring(0, 300));
    else console.log('  (no answer)');
  }
})();
