const fs = require("fs");
let code = fs.readFileSync("server.ts", "utf8");

// GET profile
code = code.replace(
  /const phone = \(req\.query\.phone as string\) \|\| \(req\.headers\['x-user-phone'\] as string\);\s*if \(\!phone\) \{\s*return res\.status\(400\)\.json\(\{ error: "Phone number is required\." \}\);\s*\}\s*const clean = phone\.replace\(\/\\D\/g, ''\)\.slice\(-10\);\s*const user = db\.getUserByPhone\(clean\);/,
  `const email = (req.query.email as string) || (req.query.phone as string) || (req.headers['x-user-email'] as string);
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }
  const clean = email.toLowerCase().trim();
  const user = db.getUserByEmail(clean);`
);

// PUT profile
code = code.replace(
  /const \{ phone, fullName, email, savedAddresses, wishlist \} = req\.body;\s*if \(\!phone\) \{\s*return res\.status\(400\)\.json\(\{ error: "Phone number is required\." \}\);\s*\}\s*const clean = phone\.replace\(\/\\D\/g, ''\)\.slice\(-10\);\s*let user: any = db\.getUserByPhone\(clean\) \|\| \{/,
  `const { email, phone, fullName, savedAddresses, wishlist } = req.body;
  const actualEmail = email || phone;
  if (!actualEmail) {
    return res.status(400).json({ error: "Email is required." });
  }
  const clean = actualEmail.toLowerCase().trim();
  let user: any = db.getUserByEmail(clean) || {`
);

// POST order address save
code = code.replace(
  /const cleanPhone = phone\.replace\(\/\\D\/g, ''\)\.slice\(-10\);\s*const user = db\.getUserByPhone\(cleanPhone\);/,
  `const actualEmail = email || phone;
  const cleanEmail = (actualEmail || "").toLowerCase().trim();
  const user = db.getUserByEmail(cleanEmail);`
);

// Get orders by phone
code = code.replace(
  /const clean = phone\.replace\(\/\\D\/g, ''\)\.slice\(-10\);\s*const customerOrders = db\.getOrdersByPhone\(clean\);/,
  `const customerOrders = db.getOrders().filter(o => o.email.toLowerCase().trim() === phone.toLowerCase().trim() || o.phone.replace(/\\D/g, '').slice(-10) === phone.replace(/\\D/g, '').slice(-10));`
);

fs.writeFileSync("server.ts", code);
