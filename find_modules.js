const Module = require('module');
const paths = Module.globalPaths;
console.log('Global paths:');
paths.forEach(p => console.log(' ', p));

const fs = require('fs');
const skillDir = 'C:/Program Files/QClaw/resources/openclaw/config/skills/imap-smtp-email';
const nm = skillDir + '/node_modules';
if (fs.existsSync(nm)) {
  console.log('\nModules in skill:', fs.readdirSync(nm).join(', '));
} else {
  console.log('\nNo node_modules in skill dir');
}

try {
  const res = require.resolve('nodemailer');
  console.log('\nnodemailer at:', res);
} catch(e) {
  console.log('\nnodemailer NOT FOUND');
}
