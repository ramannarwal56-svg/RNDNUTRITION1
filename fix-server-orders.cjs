const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

// The original checkout code had `!customerName || !phone || !shippingAddress || !Array.isArray(items)`
// And the server might require a phone number that is not '0000000000'.
// Let's modify the server to require email instead of phone, or both.
content = content.replace(
  'if (!customerName || !phone || !shippingAddress || !Array.isArray(items) || items.length === 0) {',
  'if (!customerName || !email || !shippingAddress || !Array.isArray(items) || items.length === 0) {'
);

fs.writeFileSync('server.ts', content);
