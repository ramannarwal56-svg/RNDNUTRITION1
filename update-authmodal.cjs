const fs = require("fs");
let code = fs.readFileSync("src/components/common/AuthModal.tsx", "utf8");

code = code.replace(/sendPhoneOtp/g, "sendEmailOtp");
code = code.replace(/loginWithPhone/g, "loginWithEmail");
code = code.replace(/phoneInput/g, "emailInput");
code = code.replace(/setPhoneInput/g, "setEmailInput");
code = code.replace(/cleanPhone/g, "cleanEmail");

code = code.replace(
  /const cleanEmail = emailInput\.replace\(\/\\D\/g, ''\)\.slice\(-10\);\s*if \(cleanEmail\.length !== 10\) \{\s*showToast\("Please enter a valid 10-digit Indian phone number", "warning"\);\s*return;\s*\}/,
  `const cleanEmail = emailInput.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast("Please enter a valid email address", "warning");
      return;
    }`
);

code = code.replace(
  /showToast\("OTP sent to your phone number!", "success"\);/,
  `showToast("OTP sent to your email address!", "success");`
);

code = code.replace(/10-digit Mobile Number/g, "Email Address");
code = code.replace(/id="auth-phone"/g, 'id="auth-email" type="email"');
code = code.replace(/value=\{emailInput\}\s*onChange=\{\(e\) => setEmailInput\(e\.target\.value\)\}\s*placeholder="Enter your 10-digit number"/, `value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="Enter your email address"`);

fs.writeFileSync("src/components/common/AuthModal.tsx", code);
