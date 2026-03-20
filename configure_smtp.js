const fs = require('fs');
const path = require('path');

const envPath = 'C:\\Program Files\\QClaw\\resources\\openclaw\\config\\skills\\imap-smtp-email\\.env';

const envContent = `SMTP_HOST=smtp.163.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=kimberagent@163.com
SMTP_PASS=KUy32yx8YxKiQww7
SMTP_FROM=kimberagent@163.com
SMTP_REJECT_UNAUTHORIZED=false
`;

try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('SUCCESS: SMTP credentials written');
  console.log('Host: smtp.163.com');
  console.log('User: kimberagent@163.com');
  console.log('Port: 465 (SSL)');
} catch(e) {
  console.log('ERROR:', e.message);
  console.log('Trying workspace copy...');
  const wsPath = 'C:\\Users\\yongl\\.qclaw\\workspace\\imap-smtp-email.env';
  fs.writeFileSync(wsPath, envContent, 'utf8');
  console.log('Written to:', wsPath);
}
