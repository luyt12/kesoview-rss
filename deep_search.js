const https = require('https');

const API_KEY = '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';

function tavilySearch(query, options = {}) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      api_key: API_KEY,
      query: query,
      search_depth: options.searchDepth || 'advanced',
      max_results: options.maxResults || 15,
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
  console.log('=== Deep Search: JD Vance on 2026 Iran War ===\n');

  const queries = [
    { q: 'JD Vance Iran war 2026 position stance', depth: 'advanced' },
    { q: 'JD Vance Trump administration Iran military strikes 2026', depth: 'advanced' },
    { q: 'Vice President JD Vance Iran policy controversy', depth: 'advanced' },
  ];

  const allUrls = new Set();
  let answer = '';

  for (const item of queries) {
    try {
      const r = await tavilySearch(item.q, { searchDepth: item.depth, maxResults: 10, includeAnswer: true });
      if (r.answer) answer = r.answer;
      r.results.forEach(res => allUrls.add(res.url));
      console.log(`Query "${item.q}": +${r.results.length} results (total: ${allUrls.size})`);
    } catch(e) {
      console.log(`Query "${item.q}": FAILED - ${e.message}`);
    }
  }

  console.log(`\n✅ Total unique sources: ${allUrls.size}`);
  allUrls.forEach((url, i) => console.log(`  ${i+1}. ${url}`));

  if (answer) {
    console.log('\n📝 Tavily AI Answer:');
    console.log(answer);
  }
})();
