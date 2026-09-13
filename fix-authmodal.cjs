const fs = require('fs');

let content = fs.readFileSync('src/components/common/AuthModal.tsx', 'utf-8');

// The original AuthModal has mobile number logic still present.
// Let's replace the mobile inputs with email inputs.

content = content.replace(
  '<label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Mobile Number</label>',
  '<label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Email Address</label>'
);

content = content.replace(
  'Please verify your mobile number to purchase authentic products.',
  'Please verify your email address to purchase authentic products.'
);

content = content.replace(
  'Change mobile number',
  'Change email address'
);

content = content.replace(
  /<span className="absolute left-4 text-neutral-500 font-bold">\+91<\/span>/,
  '<span className="absolute left-4 text-neutral-500 font-bold">✉️</span>'
);

// We need to fix the input. Currently it's `type="tel"` and `maxLength={10}`.
content = content.replace(
  /type="tel"/,
  'type="email"'
);

content = content.replace(
  /placeholder="9999999999"/,
  'placeholder="athlete@example.com"'
);

// Remove maxLength
content = content.replace(
  /maxLength={10}/,
  ''
);

// We need to fix the verify OTP logic which currently does:
// const cleanEmail = emailInput.replace(/\D/g, '').slice(-10);
// This ruins the email address.
content = content.replace(
  "const cleanEmail = emailInput.replace(/\\D/g, '').slice(-10);",
  "const cleanEmail = emailInput.toLowerCase().trim();"
);

// Email input validation for button
content = content.replace(
  "disabled={authLoading || emailInput.length < 10}",
  "disabled={authLoading || emailInput.length < 5}"
);

fs.writeFileSync('src/components/common/AuthModal.tsx', content);
