const fs = require('fs');
let content = fs.readFileSync('src/components/common/AuthModal.tsx', 'utf-8');
content = content.replace(
  'maxLength={10}',
  ''
);
fs.writeFileSync('src/components/common/AuthModal.tsx', content);
