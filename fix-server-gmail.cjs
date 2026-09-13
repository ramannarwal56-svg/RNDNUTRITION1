const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf-8');

const gmailApiCode = `
// Gmail API Integration
let adminGmailAccessToken: string | null = null;

app.post("/api/admin/gmail-token", (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Token required" });
  adminGmailAccessToken = token;
  console.log("Admin Gmail Token saved to memory");
  res.json({ success: true });
});

async function sendEmailViaGmail(to: string, subject: string, messageText: string, htmlMessage?: string) {
  if (!adminGmailAccessToken) {
    console.warn("No admin Gmail token available to send email to", to);
    return false;
  }
  
  const fromEmail = "ramannarwal56@gmail.com";
  
  const emailLines = [
    \`From: RND Sports Nutrition <\${fromEmail}>\`,
    \`To: \${to}\`,
    \`Subject: \${subject}\`,
    "Content-Type: text/html; charset=utf-8",
    "",
    htmlMessage || messageText
  ];
  
  const rawEmail = Buffer.from(emailLines.join("\\r\\n")).toString('base64url');
  
  try {
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${adminGmailAccessToken}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw: rawEmail })
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Gmail API Error:", errorText);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to send email via Gmail API:", err);
    return false;
  }
}
`;

content = content.replace(
  'const app = express();',
  'const app = express();\n' + gmailApiCode
);

// Add email sending to /api/orders
content = content.replace(
  '  res.status(201).json(order);\n});',
  `  // Send order confirmation email
  const emailHtml = \`
    <h2>Order Confirmation - RND Sports Nutrition</h2>
    <p>Dear \${customerName},</p>
    <p>Thank you for your order!</p>
    <p><strong>Order ID:</strong> \${order.id}</p>
    <p><strong>Total Amount:</strong> ₹\${order.totalAmount}</p>
    <p>Your order is currently <strong>\${order.orderStatus}</strong>.</p>
    <p>We will notify you once it ships.</p>
    <br/>
    <p>- RND Sports Nutrition Team</p>
  \`;
  sendEmailViaGmail(email, "Your RND Sports Nutrition Order - " + order.id, "", emailHtml);
  
  res.status(201).json(order);
});`
);

// Update OTP to also try Gmail if token exists
const otpRegex = /if \(SMTP_EMAIL && SMTP_PASSWORD\) \{/;
content = content.replace(
  otpRegex,
  `if (adminGmailAccessToken) {
    const emailHtml = \`
      <h2>Your RND Sports Nutrition Login Code</h2>
      <p>Your secure login code is: <strong>\${result.otp}</strong></p>
      <p>It expires in 5 minutes. Do not share this with anyone.</p>
      <p>- RND Sports Nutrition Team</p>
    \`;
    const sent = await sendEmailViaGmail(clean, "Your Secure RND Login Code", "", emailHtml);
    if (sent) provider = "gmail_api";
  } else if (SMTP_EMAIL && SMTP_PASSWORD) {`
);

fs.writeFileSync('server.ts', content);
