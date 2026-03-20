const https = require('https');

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const TAVILY_API_URL = 'api.tavily.com';

/**
 * Tavily AI Search
 * @param {string} query - Search query
 * @param {object} options - Search options
 * @returns {Promise<object>} Search results
 */
async function tavilySearch(query, options = {}) {
  if (!TAVILY_API_KEY) {
    throw new Error('TAVILY_API_KEY not set in environment');
  }

  const body = JSON.stringify({
    api_key: TAVILY_API_KEY,
    query: query,
    search_depth: options.searchDepth || options.search_depth || 'basic',
    max_results: options.maxResults || options.max_results || 5,
    include_answer: options.includeAnswer || options.include_answer || false,
    include_raw_content: options.includeRawContent || options.include_raw_content || false,
    include_images: options.includeImages || options.include_images || false,
    time_range: options.timeRange || options.time_range || undefined,
    topic: options.topic || 'general'
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: TAVILY_API_URL,
      port: 443,
      path: '/search',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      timeout: 30000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode === 200) {
            resolve(parsed);
          } else {
            reject(new Error(`Tavily API error: ${res.statusCode} - ${parsed.message || data}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${data.substring(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(body);
    req.end();
  });
}

/**
 * Quick search - basic results only
 */
async function quickSearch(query, maxResults = 5) {
  const result = await tavilySearch(query, { maxResults, searchDepth: 'basic' });
  return result.results.map(r => ({
    title: r.title,
    url: r.url,
    content: r.content,
    score: r.score
  }));
}

/**
 * Deep search with AI answer
 */
async function deepSearch(query, maxResults = 5) {
  const result = await tavilySearch(query, { 
    maxResults, 
    searchDepth: 'advanced',
    includeAnswer: true
  });
  return {
    answer: result.answer,
    results: result.results.map(r => ({
      title: r.title,
      url: r.url,
      content: r.content,
      score: r.score
    }))
  };
}

module.exports = {
  tavilySearch,
  quickSearch,
  deepSearch
};

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const query = args.join(' ');
  
  if (!query) {
    console.log('Usage: node tavily.js <search query>');
    console.log('Environment: TAVILY_API_KEY=tvly-xxx');
    process.exit(1);
  }

  tavilySearch(query, { maxResults: 5 })
    .then(result => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch(err => {
      console.error('Error:', err.message);
      process.exit(1);
    });
}
