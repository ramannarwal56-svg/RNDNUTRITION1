const fs = require("fs");
let code = fs.readFileSync(".env.example", "utf8");

code = code.replace(
  /# Twilio Live Credentials \(for actual SMS OTPs\)\nTWILIO_LIVE_ACCOUNT_SID=""\nTWILIO_LIVE_AUTH_TOKEN=""\nTWILIO_LIVE_PHONE_NUMBER=""/,
  `# SMTP Email Credentials (for actual Email OTPs)
SMTP_EMAIL="rndnutrition285@gmail.com"
SMTP_PASSWORD=""`
);

fs.writeFileSync(".env.example", code);
