#!/usr/bin/env node

/**
 * SMTP Email - Workspace Version
 * Copied from imap-smtp-email skill, patched to use workspace .env
 */

const nodemailer = require('nodemailer');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Env vars injected directly - no dotenv needed
process.env.SMTP_HOST = 'smtp.163.com';
process.env.SMTP_PORT = '465';
process.env.SMTP_SECURE = 'true';
process.env.SMTP_USER = 'kimberagent@163.com';
process.env.SMTP_PASS = 'KUy32yx8YxKiQww7';
process.env.SMTP_FROM = 'kimberagent@163.com';
process.env.SMTP_REJECT_UNAUTHORIZED = 'false';
process.env.ALLOWED_READ_DIRS = 'C:\\Users\\yongl\\.qclaw\\workspace';

function validateReadPath(inputPath) {
  let realPath;
  try {
    realPath = fs.realpathSync(inputPath);
  } catch {
    realPath = path.resolve(inputPath);
  }
  const allowedDirsStr = process.env.ALLOWED_READ_DIRS;
  if (!allowedDirsStr) {
    throw new Error('ALLOWED_READ_DIRS not set');
  }
  const allowedDirs = allowedDirsStr.split(',').map(d =>
    path.resolve(d.trim().replace(/^~/, os.homedir()))
  );
  const allowed = allowedDirs.some(dir =>
    realPath === dir || realPath.startsWith(dir + path.sep)
  );
  if (!allowed) {
    throw new Error(`Access denied: '${inputPath}' is outside allowed directories`);
  }
  return realPath;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0];
  const options = {};
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[i + 1];
      options[key] = value || true;
      if (value && !value.startsWith('--')) i++;
    }
  }
  return { command, options };
}

function createTransporter() {
  const config = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    tls: { rejectUnauthorized: false },
  };
  if (!config.host || !config.auth.user || !config.auth.pass) {
    throw new Error('Missing SMTP config: SMTP_HOST, SMTP_USER, SMTP_PASS');
  }
  return nodemailer.createTransport(config);
}

async function sendEmail(options) {
  const transporter = createTransporter();
  try {
    await transporter.verify();
    console.log('SMTP server verified');
  } catch (err) {
    throw new Error('SMTP connection failed: ' + err.message);
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: options.to,
    subject: options.subject || '(no subject)',
    text: options.text || undefined,
    html: options.html || undefined,
  };

  if (!mailOptions.text && !mailOptions.html) {
    mailOptions.text = options.body || '';
  }

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId, to: mailOptions.to };
}

async function main() {
  const { command, options } = parseArgs();
  console.log('Command:', command);
  console.log('Options:', JSON.stringify(options));

  try {
    if (command === 'send') {
      if (!options.to) throw new Error('Missing --to');
      if (!options.subject && !options['subject-file']) throw new Error('Missing --subject');

      if (options['body-file']) {
        validateReadPath(options['body-file']);
        const content = fs.readFileSync(options['body-file'], 'utf8');
        options.text = content;
      } else if (options.body) {
        options.text = options.body;
      }

      const result = await sendEmail(options);
      console.log(JSON.stringify(result, null, 2));
    } else if (command === 'test') {
      const transporter = createTransporter();
      await transporter.verify();
      console.log(JSON.stringify({ success: true, message: 'SMTP ready' }));
    } else {
      console.error('Usage: node smtp_workspace.js test | send --to <email> --subject <text> --body <text>');
      process.exit(1);
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
