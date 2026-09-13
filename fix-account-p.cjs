const fs = require('fs');

let content = fs.readFileSync('src/pages/AccountPage.tsx', 'utf-8');
content = content.replace(
  '<span className="bg-neutral-800 px-3.5 py-3 rounded-l-xl text-xs text-neutral-400 border border-r-0 border-neutral-700">\n                    +91\n                  </span>',
  '<span className="bg-neutral-800 px-3.5 py-3 rounded-l-xl text-xs text-neutral-400 border border-r-0 border-neutral-700">\n                    ✉️\n                  </span>'
);

content = content.replace(
  'type="tel"',
  'type="email"'
);

content = content.replace(
  'placeholder="9306667128"',
  'placeholder="athlete@example.com"'
);

content = content.replace(
  "onChange={(e) => setEmailInput(e.target.value.replace(/\\D/g, ''))}",
  "onChange={(e) => setEmailInput(e.target.value)}"
);

content = content.replace(
  '+91 {user.email}',
  '{user.email}'
);

content = content.replace(
  "onChange={(e) => setOtpInput(e.target.value.replace(/\\D/g, ''))}",
  "onChange={(e) => setOtpInput(e.target.value)}"
);

fs.writeFileSync('src/pages/AccountPage.tsx', content);
