const fs = require('fs');

let content = fs.readFileSync('src/pages/AccountPage.tsx', 'utf-8');

// Do the same for AccountPage

content = content.replace(
  '<label className="text-xs text-neutral-400 font-bold uppercase tracking-wider block mb-1">\n                  Email Address\n                </label>',
  '<label className="text-xs text-neutral-400 font-bold uppercase tracking-wider block mb-1">\n                  Email Address\n                </label>'
);
// It says Email Address but behaves like a phone number. 

// The input looks like:
/*
                <div className="flex items-center">
                  <span className="bg-neutral-800 px-3.5 py-3 rounded-l-xl text-xs text-neutral-400 border border-r-0 border-neutral-700">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="9306667128"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-r-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
*/

content = content.replace(
  /<div className="flex items-center">\s*<span className="bg-neutral-800 px-3\.5 py-3 rounded-l-xl text-xs text-neutral-400 border border-r-0 border-neutral-700">\s*\+91\s*<\/span>\s*<input\s*type="tel"\s*required\s*maxLength={10}\s*value={emailInput}\s*onChange={\(e\) => setEmailInput\(e\.target\.value\.replace\(\/\\D\/g, ''\)\)}\s*placeholder="9306667128"\s*className="w-full bg-neutral-950 border border-neutral-700 rounded-r-xl p-3 text-xs text-white focus:outline-none focus:border=\[#D4AF37\]"\s*\/>\s*<\/div>/g,
  `<div className="flex items-center">
                  <span className="bg-neutral-800 px-3.5 py-3 rounded-l-xl text-xs text-neutral-400 border border-r-0 border-neutral-700">
                    ✉️
                  </span>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-r-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>`
);

content = content.replace(
  "const cleanEmail = emailInput.replace(/\\D/g, '').slice(-10);",
  "const cleanEmail = emailInput.toLowerCase().trim();"
);

content = content.replace(
  "<span>OTP sent to +91 {emailInput}</span>",
  "<span>OTP sent to {emailInput}</span>"
);

fs.writeFileSync('src/pages/AccountPage.tsx', content);
