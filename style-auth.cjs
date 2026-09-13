const fs = require('fs');
let content = fs.readFileSync('src/components/common/AuthModal.tsx', 'utf-8');

// Focus Mode styling
// Replace: <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
content = content.replace(
  '<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">',
  '<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-md transition-all">'
);

// Replace: <div className="bg-neutral-900 border border-[#D4AF37]/30 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
content = content.replace(
  '<div className="bg-neutral-900 border border-[#D4AF37]/30 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">',
  '<div className="bg-neutral-900/95 border border-[#D4AF37]/40 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300 backdrop-blur-xl ring-1 ring-white/5">'
);

fs.writeFileSync('src/components/common/AuthModal.tsx', content);
