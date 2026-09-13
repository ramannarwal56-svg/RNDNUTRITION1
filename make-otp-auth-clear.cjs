const fs = require('fs');

// We should also replace the label to be Email Address in the AuthModal if there is a remnant. 
let content = fs.readFileSync('src/components/common/AuthModal.tsx', 'utf-8');

// If there is any mention of "Change email address" we can verify it
if (content.includes("Change email address")) {
  console.log("Change email address found.");
} else {
  console.log("Change email address not found, fixing.");
  content = content.replace("Change mobile number", "Change email address");
}

fs.writeFileSync('src/components/common/AuthModal.tsx', content);

let content2 = fs.readFileSync('src/pages/AccountPage.tsx', 'utf-8');
if (content2.includes("Change mobile number")) {
  console.log("Changing in AccountPage.");
  content2 = content2.replace("Change mobile number", "Change email address");
  fs.writeFileSync('src/pages/AccountPage.tsx', content2);
}
