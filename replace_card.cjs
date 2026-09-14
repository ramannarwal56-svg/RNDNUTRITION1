const fs = require('fs');

let content = fs.readFileSync('src/components/common/ProductCard.tsx', 'utf8');

const returnIndex = content.indexOf('return (');
if (returnIndex !== -1) {
  content = content.slice(0, returnIndex);
  
  const newReturn = `return (
    <div
      ref={cardRef}
      id={\`product-card-\${product.id}\`}
      onClick={() => navigate('product', { id: product.slug || product.id })}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? \`perspective(1000px) rotateX(\${rotX}deg) rotateY(\${rotY}deg) translateY(-6px)\`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out, border-color 0.3s ease'
      }}
      className="group relative flex flex-col h-full rounded-2xl bg-[#111111] border border-neutral-800 overflow-hidden transition-all duration-300 cursor-pointer hover:border-neutral-600"
    >
      {/* 1. Product image against a dark background */}
      <div className="relative aspect-[4/3.5] w-full bg-[radial-gradient(circle_at_center,#221a1a_0%,#0a0a0a_70%,#000000_100%)] flex items-center justify-center p-6 border-b border-neutral-800">
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 z-10">
          <button 
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }} 
            className="p-2 rounded-full bg-black/60 text-neutral-400 hover:text-white transition-colors"
          >
            <Heart className={\`w-4 h-4 \${isFav ? 'fill-red-500 text-red-500' : 'fill-transparent'}\`} />
          </button>
        </div>
      </div>

      <div className="flex flex-col p-5 flex-1">
        {/* 2. Green horizontal nutrition highlight banner */}
        <div className="w-full bg-emerald-950/40 border border-emerald-900/60 rounded flex items-center px-3 py-1.5 mb-3">
          <span className="text-emerald-400 text-[10.5px] font-bold tracking-wide uppercase truncate w-full">
            {getNutritionHighlight(product)}
          </span>
        </div>

        {/* 3. Bold white product name */}
        <h3 className="text-[15px] font-black text-white leading-snug mb-1.5 line-clamp-2">
          {product.name}
        </h3>

        {/* 4. Grey flavor text */}
        <p className="text-[13px] font-medium text-neutral-400 mb-2.5">
          {product.flavour}
        </p>

        {/* 5. Star ratings with review count */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center text-[#D4AF37]">
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-[11px] font-medium text-neutral-500">
            ({product.reviewCount || 128} Reviews)
          </span>
        </div>

        {/* 6. Yellow weight/size tags */}
        <div className="flex flex-wrap gap-2 mb-3 mt-1" onClick={(e) => e.stopPropagation()}>
          {product.variants && product.variants.length > 0 ? (
            product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedSize(v.size)}
                className={\`px-2.5 py-1 rounded text-[11px] font-bold transition-colors border \${
                  selectedSize === v.size
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]'
                    : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500'
                }\`}
              >
                {v.size}
              </button>
            ))
          ) : (
            <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]">
              {product.weightOrPackSize}
            </span>
          )}
        </div>

        {/* Spacer to push everything below to the bottom */}
        <div className="flex-1 min-h-[8px]"></div>

        {/* 7. Green verification text */}
        <div className="flex items-center gap-1.5 text-emerald-500 text-[11px] font-bold mb-2.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Trustified Certified</span>
        </div>

        {/* 8. Current price in large font next to strikethrough price */}
        <div className="flex items-baseline gap-2.5 mb-1">
          <span className="text-2xl font-black text-white tracking-tight">
            ₹{activeSalePrice.toLocaleString('en-IN')}
          </span>
          {activeRegularPrice > activeSalePrice && (
            <span className="text-[13px] font-medium text-neutral-500 line-through">
              ₹{activeRegularPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* 9. Shipping availability text */}
        <div className="text-[11px] font-medium text-neutral-400 mb-4 flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-neutral-500" />
          <span>Ships in 24h • Free Delivery &gt; ₹999</span>
        </div>

        {/* 10. Two prominent yellow buttons for 'Add to Cart' and 'Buy Now' */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-neutral-800/80">
          <button
            onClick={(e) => { e.stopPropagation(); addToCart(product, product.flavour, selectedSize); }}
            className="w-full py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-[#D4AF37] hover:border-[#D4AF37] hover:bg-neutral-800 text-[13px] font-bold flex items-center justify-center gap-2 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Cart
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (addToCart(product, product.flavour, selectedSize)) navigate('checkout');
            }}
            className="w-full py-2.5 rounded-lg bg-[#D4AF37] hover:bg-amber-400 text-black text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(212,175,55,0.2)]"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
`;

  fs.writeFileSync('src/components/common/ProductCard.tsx', content + newReturn);
  console.log("ProductCard updated successfully.");
} else {
  console.log("Could not find return statement in ProductCard.");
}
