const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminPage.tsx', 'utf-8');

content = content.replace(
  /{activeTab === 'overview' && \(\n\s*<div className="mb-6">/,
  `{activeTab === 'overview' && (\n        <>\n          <div className="mb-6">`
);

// We need to find where the overview block ends.
// Let's find the end of activeTab === 'overview' which is likely before `{activeTab === 'orders' && (`
content = content.replace(
  /\n\s*\{activeTab === 'orders' && \(/,
  `\n        </>\n      )}\n\n      {activeTab === 'orders' && (`
);

// Wait, the previous replace actually removed `)}` if we don't handle it carefully. 
// Let's do it safely.
