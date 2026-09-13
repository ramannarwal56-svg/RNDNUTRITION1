const fs = require('fs');
let content = fs.readFileSync('src/pages/AccountPage.tsx', 'utf-8');

// The original auth wrapper in Account page:
// <div id="rnd-auth-page" className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-4 flex items-center justify-center">
// <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 rounded-3xl space-y-6 shadow-2xl">

content = content.replace(
  '<div id="rnd-auth-page" className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-4 flex items-center justify-center">',
  '<div id="rnd-auth-page" className="min-h-screen bg-neutral-950/95 text-neutral-100 py-16 px-4 flex items-center justify-center backdrop-blur-md transition-all">'
);

content = content.replace(
  '<div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 rounded-3xl space-y-6 shadow-2xl">',
  '<div className="max-w-md w-full bg-neutral-900/95 border border-[#D4AF37]/40 p-8 rounded-3xl space-y-6 shadow-2xl backdrop-blur-xl ring-1 ring-white/5">'
);

fs.writeFileSync('src/pages/AccountPage.tsx', content);
