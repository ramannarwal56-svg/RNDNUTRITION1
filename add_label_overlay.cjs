const fs = require('fs');

let content = fs.readFileSync('src/components/common/ProductCard.tsx', 'utf8');

const searchString = '<img';

const overlayCode = `
        {/* Dynamic Label Overlay Hack */}
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] flex flex-col items-center justify-center text-center pointer-events-none opacity-80 mix-blend-plus-lighter z-10" style={{ transform: 'translate(-50%, -50%) rotate(-1deg)' }}>
           <span className="text-[9px] font-black uppercase text-white/90 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
             {product.name.replace('RND Titanium ', '').replace('RND COLOSSUS ', '').replace('RND ', '')}
           </span>
           <span className="text-[12px] font-black text-amber-300 mt-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
             {selectedSize}
           </span>
        </div>
`;

if (content.includes(searchString)) {
  content = content.replace(searchString, overlayCode + '\n        <img');
  fs.writeFileSync('src/components/common/ProductCard.tsx', content);
  console.log("Overlay added.");
} else {
  console.log("Could not find anchor.");
}
