const fs = require('fs');
const path = require('path');

const dirs = [
  'C:\\Program Files\\QClaw\\resources\\openclaw\\config\\skills\\email-skill',
  'C:\\Program Files\\QClaw\\resources\\openclaw\\config\\skills\\imap-smtp-email'
];

for (const dir of dirs) {
  console.log('=== ' + dir + ' ===');
  try {
    const files = fs.readdirSync(dir, { recursive: true })
      .filter(f => String(f).endsWith('.cmd') || String(f).endsWith('.sh') || String(f).endsWith('.js'));
    files.forEach(f => console.log(f));
  } catch(e) {
    console.log('ERROR: ' + e.message);
  }
}
