const fs = require('fs');

// We should also replace the label to be Email Address in the AuthModal if there is a remnant. 
let content = fs.readFileSync('src/components/common/AuthModal.tsx', 'utf-8');

// The AuthModal doesn't have the string "OTP sent to {emailInput}", let's see what it has
// Wait, I saw `<label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Enter OTP</label>` earlier in AuthModal.

content = content.replace(
  '<label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Enter OTP</label>',
  '<label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Enter OTP</label>\n                <div className="text-xs text-neutral-400 mb-2">OTP sent to {emailInput}</div>'
);

fs.writeFileSync('src/components/common/AuthModal.tsx', content);

