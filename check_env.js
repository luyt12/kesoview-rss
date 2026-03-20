const fs = require('fs');
const path = require('path');

const skillDir = 'C:\\Program Files\\QClaw\\resources\\openclaw\\config\\skills\\imap-smtp-email';
const envPath = path.join(skillDir, '.env');

console.log('=== .env exists?', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  console.log('=== .env content (keys only) ===');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const key = trimmed.split('=')[0];
      console.log(key);
    }
  });
}

const commonPath = 'C:\\Program Files\\QClaw\\resources\\openclaw\\config\\skills\\email-skill\\scripts\\windows\\common.cmd';
console.log('\n=== common.cmd content ===');
console.log(fs.readFileSync(commonPath, 'utf8'));
