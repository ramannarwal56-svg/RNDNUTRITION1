const fs = require("fs");
let code = fs.readFileSync("server.ts", "utf8");

code = code.replace(
  /\/\/ 4\. Phone OTP Authentication API([\s\S]*?)app\.post\("\/api\/auth\/admin-login"/,
  `// 4. Email OTP Authentication API
app.post("/api/auth/send-otp", async (req, res) => {
  const email = req.body.email || req.body.phone;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "A valid email address is required." });
  }

  const clean = email.toLowerCase().trim();
  const result = db.generateOtp(clean);
  if (!result.success) {
    return res.status(429).json({ error: result.message, cooldownRemaining: result.cooldownRemaining });
  }

  let provider = process.env.OTP_PROVIDER || "mock";
  const SMTP_EMAIL = process.env.SMTP_EMAIL || "rndnutrition285@gmail.com";
  const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

  if (SMTP_EMAIL && SMTP_PASSWORD) {
    try {
      const transporter = require("nodemailer").createTransport({
        service: "gmail",
        auth: { user: SMTP_EMAIL, pass: SMTP_PASSWORD }
      });
      await transporter.sendMail({
        from: \`"RND Sports Nutrition" <\${SMTP_EMAIL}>\`,
        to: clean,
        subject: "Your Secure RND Login Code",
        text: \`Your secure login code is: \${result.otp}\\nIt expires in 5 minutes. Do not share this with anyone.\\n\\n- RND Sports Nutrition Team\`
      });
      provider = "nodemailer";
    } catch (err) {
      console.error("Failed to send live OTP via Nodemailer:", err);
    }
  }

  res.json({
    message: result.message,
    phone: clean, // keeping phone key for payload backward compat
    email: clean,
    cooldownSeconds: 60,
    demoOtp: provider === "mock" ? result.otp : undefined,
    provider
  });
});

app.post("/api/auth/verify-otp", (req, res) => {
  const email = req.body.email || req.body.phone;
  const { otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email address and OTP code are required." });
  }

  const clean = email.toLowerCase().trim();
  const result = db.verifyOtp(clean, otp);

  if (!result.valid) {
    return res.status(400).json({ error: result.message });
  }

  const isAdmin = clean === "ramannarwal56@gmail.com" || clean === ADMIN_PHONE;

  res.json({
    message: result.message,
    token: \`rnd_user_token_\${clean}_\${Date.now()}\`,
    user: result.user,
    isAdmin
  });
});

app.post("/api/auth/admin-login"`
);

// fix req, res types just in case
code = code.replace(/app\.post\("\/api\/auth\/send-otp", async \(req, res\) => {/, 'app.post("/api/auth/send-otp", async (req: Request, res: Response) => {');
code = code.replace(/app\.post\("\/api\/auth\/verify-otp", \(req, res\) => {/, 'app.post("/api/auth/verify-otp", (req: Request, res: Response) => {');

fs.writeFileSync("server.ts", code);
