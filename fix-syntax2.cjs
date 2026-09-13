const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminPage.tsx', 'utf-8');

// The block starts with {activeTab === 'overview' && ( \n <div className="mb-6">
// And ends before {activeTab === 'orders' && (

// Let's replace the start
content = content.replace(
  "{activeTab === 'overview' && (\n          <div className=\"mb-6\">",
  "{activeTab === 'overview' && (\n        <>\n          <div className=\"mb-6\">"
);

// Let's replace the end
content = content.replace(
  "        {/* Tab 2: Orders Management */}\n        {activeTab === 'orders' && (",
  "        </>\n      )}\n\n        {/* Tab 2: Orders Management */}\n        {activeTab === 'orders' && ("
);

fs.writeFileSync('src/pages/AdminPage.tsx', content);
