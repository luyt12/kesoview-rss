const { tavilySearch, quickSearch, deepSearch } = require('./tavily.js');

// Test with hardcoded key for now
process.env.TAVILY_API_KEY = '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';

const query = process.argv.slice(2).join(' ') || 'OpenClaw AI agent framework';

console.log('Testing Tavily Search...');
console.log('Query:', query);
console.log('');

quickSearch(query, 3)
  .then(results => {
    console.log('✅ Quick Search Results:');
    results.forEach((r, i) => {
      console.log(`\n${i+1}. ${r.title}`);
      console.log(`   URL: ${r.url}`);
      console.log(`   Score: ${r.score?.toFixed(3)}`);
      console.log(`   ${r.content?.substring(0, 150)}...`);
    });
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
