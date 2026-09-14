const fs = require('fs');

let content = fs.readFileSync('src/components/common/ProductCard.tsx', 'utf8');

// Replace the Add to Cart button classes
content = content.replace(
  'className="w-full py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-[#D4AF37] hover:border-[#D4AF37] hover:bg-neutral-800 text-[13px] font-bold flex items-center justify-center gap-2 transition-all"',
  'className="w-full py-2.5 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-black text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-md"'
);

// Replace the Buy Now button classes
content = content.replace(
  'className="w-full py-2.5 rounded-lg bg-[#D4AF37] hover:bg-amber-400 text-black text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(212,175,55,0.2)]"',
  'className="w-full py-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(250,204,21,0.3)]"'
);

// Update tags to solid yellow to be distinctively "yellow weight/size tags" as requested
content = content.replace(
  /bg-\[\#D4AF37\]\/10 text-\[\#D4AF37\] border-\[\#D4AF37\]/g,
  'bg-yellow-500 text-black border-yellow-500'
);

fs.writeFileSync('src/components/common/ProductCard.tsx', content);
console.log("Updated buttons and tags.");
