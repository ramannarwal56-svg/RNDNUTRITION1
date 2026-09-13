const fs = require('fs');

// AuthModal
let content = fs.readFileSync('src/components/common/AuthModal.tsx', 'utf-8');
content = content.replace(
  /const \[testOtpHint, setTestOtpHint\] = useState\(''\);\n/g,
  ''
);
content = content.replace(
  /if \(res\.demoOtp\) \{\n\s*setTestOtpHint\(res\.demoOtp\);\n\s*showToast\(`OTP generated: \$\{res\.demoOtp\}`\, "info"\);\n\s*\} else \{\n\s*showToast\("OTP sent to your email address!", "success"\);\n\s*\}/g,
  'showToast("OTP sent to your email address!", "success");'
);
content = content.replace(
  /\{testOtpHint && \([\s\S]*?<\/p>\n\s*\)\}/,
  ''
);
fs.writeFileSync('src/components/common/AuthModal.tsx', content);

// AccountPage
let account = fs.readFileSync('src/pages/AccountPage.tsx', 'utf-8');
account = account.replace(
  /const \[testOtpHint, setTestOtpHint\] = useState\(''\);\n/g,
  ''
);
account = account.replace(
  /if \(res\.demoOtp\) \{\n\s*setTestOtpHint\(res\.demoOtp\);\n\s*showToast\(`OTP generated: \$\{res\.demoOtp\}`\, "info"\);\n\s*\} else \{\n\s*showToast\("OTP sent to your email address!", "success"\);\n\s*\}/g,
  'showToast("OTP sent to your email address!", "success");'
);
account = account.replace(
  /\{testOtpHint && \([\s\S]*?<\/div>\n\s*\)\}/,
  ''
);
fs.writeFileSync('src/pages/AccountPage.tsx', account);

// Server.ts
let server = fs.readFileSync('server.ts', 'utf-8');
server = server.replace(
  /demoOtp: provider === "mock" \? result\.otp : undefined,\n/g,
  ''
);
server = server.replace(
  /const SMTP_EMAIL = process\.env\.SMTP_EMAIL \|\| "rndnutrition285@gmail\.com";/g,
  'const SMTP_EMAIL = process.env.SMTP_EMAIL || "ramannarwal56@gmail.com";'
);
fs.writeFileSync('server.ts', server);

