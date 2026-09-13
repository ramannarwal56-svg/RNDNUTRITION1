const fs = require("fs");
let code = fs.readFileSync("src/pages/AccountPage.tsx", "utf8");

code = code.replace(
  /const cleanEmail = emailInput\.replace\(\/\\D\/g, ''\)\.slice\(-10\);\s*if \(cleanEmail\.length !== 10\) \{\s*showToast\("Please enter a valid 10-digit Indian phone number", "warning"\);\s*return;\s*\}/,
  `const cleanEmail = emailInput.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast("Please enter a valid email address", "warning");
      return;
    }`
);

code = code.replace(/10-Digit Mobile Number/g, "Email Address");
code = code.replace(/Instant login with your Indian phone number\. No passwords required\./g, "Instant login with your email. No passwords required.");

fs.writeFileSync("src/pages/AccountPage.tsx", code);
