const fs = require('fs');
let content = fs.readFileSync('src/pages/AccountPage.tsx', 'utf-8');
content = content.replace(
  'maxLength={10}',
  ''
);
fs.writeFileSync('src/pages/AccountPage.tsx', content);
