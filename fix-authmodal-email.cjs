const fs = require('fs');

let content = fs.readFileSync('src/components/common/AuthModal.tsx', 'utf-8');
content = content.replace(
  "const cleanEmail = emailInput.replace(/\\D/g, '').slice(-10);",
  "const cleanEmail = emailInput.toLowerCase().trim();"
);

fs.writeFileSync('src/components/common/AuthModal.tsx', content);
