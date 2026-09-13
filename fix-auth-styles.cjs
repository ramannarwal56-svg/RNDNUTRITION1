const fs = require('fs');

let content = fs.readFileSync('src/components/common/AuthModal.tsx', 'utf-8');

// Also ensure we remove any maxLength stuff if still there
content = content.replace(/maxLength={.*?}/g, '');

fs.writeFileSync('src/components/common/AuthModal.tsx', content);
