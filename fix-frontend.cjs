const fs = require("fs");

function replaceInFile(path, regexes, replacements) {
  if (!fs.existsSync(path)) return;
  let code = fs.readFileSync(path, "utf8");
  for (let i = 0; i < regexes.length; i++) {
    code = code.replace(regexes[i], replacements[i]);
  }
  fs.writeFileSync(path, code);
}

replaceInFile("src/pages/ProductDetailPage.tsx", [/user\?\.phone/g], ["user?.email"]);
replaceInFile("src/pages/HomePage.tsx", [/(?:const phone =) user\?\.phone/g, /user\?\.phone/g], ["const phone = user?.email", "user?.email"]);
replaceInFile("src/pages/CheckoutPage.tsx", [/user\?\.phone/g], ["user?.email"]);
replaceInFile("src/pages/AccountPage.tsx", [/user\?\.phone/g], ["user?.email"]);

