const fs = require('fs');

let content = fs.readFileSync('src/pages/AccountPage.tsx', 'utf-8');

content = content.replace(
  'className="min-h-screen bg-neutral-950/95 text-neutral-100 py-16 px-4 flex items-center justify-center backdrop-blur-md transition-all"',
  'className="min-h-screen bg-black text-neutral-100 py-16 px-4 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black"'
);

content = content.replace(
  'className="max-w-md w-full bg-neutral-900/95 border border-[#D4AF37]/40 p-8 rounded-3xl space-y-6 shadow-2xl backdrop-blur-xl ring-1 ring-white/5"',
  'className="max-w-md w-full bg-neutral-900/40 border border-[#D4AF37]/30 p-8 rounded-3xl space-y-6 shadow-[0_0_40px_-15px_rgba(212,175,55,0.3)] backdrop-blur-2xl ring-1 ring-white/10"'
);

fs.writeFileSync('src/pages/AccountPage.tsx', content);

// Let's do the same for AuthModal
let modal = fs.readFileSync('src/components/common/AuthModal.tsx', 'utf-8');
modal = modal.replace(
  'className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-md transition-all"',
  'className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl transition-all"'
);

modal = modal.replace(
  'className="bg-neutral-900/95 border border-[#D4AF37]/40 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300 backdrop-blur-xl ring-1 ring-white/5"',
  'className="bg-neutral-900/50 border border-[#D4AF37]/40 w-full max-w-md rounded-3xl shadow-[0_0_50px_-12px_rgba(212,175,55,0.4)] overflow-hidden relative animate-in fade-in zoom-in duration-300 backdrop-blur-2xl ring-1 ring-white/10"'
);
fs.writeFileSync('src/components/common/AuthModal.tsx', modal);

