import React, { useState, useRef } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { 
  ShoppingBag, 
  Heart, 
  Scale, 
  Star, 
  Check, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isPurchased?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isPurchased = false }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    addToCompare, 
    removeFromCompare, 
    isInCompare, 
    navigate 
  } = useStore();

  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Selected variant size state (default to first variant or product default)
  const [selectedSize, setSelectedSize] = useState<string>(product.weightOrPackSize);

  // Calculate dynamic price based on selected size variant
  const activeVariant = product.variants?.find(v => v.size === selectedSize);
  const activeSalePrice = activeVariant ? activeVariant.salePrice : product.salePrice;
  const activeRegularPrice = activeVariant ? activeVariant.price : product.regularPrice;

  const discountPercent = activeRegularPrice > activeSalePrice
    ? Math.round(((activeRegularPrice - activeSalePrice) / activeRegularPrice) * 100)
    : 0;

  const savingsAmount = activeRegularPrice > activeSalePrice
    ? activeRegularPrice - activeSalePrice
    : 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setRotX(rotateX);
    setRotY(rotateY);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotX(0);
    setRotY(0);
  };

  const isFav = isInWishlist(product.id);
  const inComp = isInCompare(product.id);

  // Key nutrition metrics callout tailored for authentic supplement buying experience
  const getNutritionHighlight = (p: Product): string => {
    if (p.category === 'Whey Protein') {
      const protein = p.proteinPerServing || (p.nutritionalInfo && p.nutritionalInfo['Protein']) || '28g';
      const bcaa = (p.nutritionalInfo && p.nutritionalInfo['BCAAs']) || '6.3g';
      return `${protein} Protein • ${bcaa} BCAAs • 0g Sugar`;
    }
    if (p.category === 'Creatine') {
      return '200 Mesh Micronized • 100% Pure ATP';
    }
    if (p.category === 'Pre-Workout') {
      return '300mg Caffeine • 6g Citrulline • Pump Matrix';
    }
    if (p.category === 'Mass Gainer') {
      const cal = p.caloriesPerServing || '1,250 kcal';
      const prot = p.proteinPerServing || '50g';
      return `${cal} • ${prot} Protein • Multi-Carbs`;
    }
    if (p.category === 'Fat Burner') {
      return 'Thermogenic Cut • L-Carnitine • Zero Crash';
    }
    if (p.category === 'Protein Bars') {
      return '20g Protein • Zero Added Sugar • Real Whey';
    }
    if (p.category === 'Multivitamins') {
      return '100% RDA Minerals • 32 Bio-Active Nutrients';
    }
    return p.shortDescription || `${p.servings} Servings • Lab Certified`;
  };

  return (
    <div
      ref={cardRef}
      id={`product-card-${product.id}`}
      onClick={() => navigate('product', { id: product.slug || product.id })}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out, border-color 0.3s ease'
      }}
      className={`group relative flex flex-col rounded-2xl bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950 overflow-hidden shadow-xl transition-all duration-300 cursor-pointer ${
        isPurchased
          ? 'border-2 border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-[0_15px_35px_rgba(212,175,55,0.18)] hover:shadow-[0_22px_45px_rgba(212,175,55,0.3)]'
          : 'border border-neutral-800 hover:border-[#D4AF37]/80 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(212,175,55,0.2)]'
      }`}
    >
      {/* Dynamic Lighting Sheen */}
      {isHovered && (
        <div 
          className="pointer-events-none absolute inset-0 z-20 opacity-40 bg-gradient-to-tr from-transparent via-[#D4AF37]/15 to-transparent transition-opacity duration-300" 
        />
      )}

      {/* Product Image Stage: Studio Radial Pedestal */}
      <div className="relative aspect-[4/3.5] sm:aspect-square w-full bg-[radial-gradient(circle_at_center,#221a1a_0%,#110c0c_55%,#070505_100%)] border-b border-neutral-800/80 overflow-hidden flex items-center justify-center p-4">
        {/* Subtle studio glow on hover */}
        <div className="absolute inset-0 bg-radial from-[#D4AF37]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Product Jar/Tub with Object Contain (Never cropped) */}
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-108 filter drop-shadow-[0_15px_22px_rgba(0,0,0,0.9)]"
          loading="lazy"
        />

        {/* Quick View Spec Badge on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <span className="px-3.5 py-1.5 rounded-xl bg-neutral-950/95 text-[#D4AF37] border border-[#D4AF37]/70 text-xs font-black tracking-wide shadow-2xl flex items-center gap-1.5 backdrop-blur-md">
            <span>View 8 Views &amp; Specs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Top Badges (Left) */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {isPurchased && (
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 via-[#D4AF37] to-amber-400 text-neutral-950 shadow-lg flex items-center gap-1 border border-amber-300">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>You Bought This</span>
            </span>
          )}
          {product.isBestSeller && !isPurchased && (
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 text-white shadow-lg border border-red-400/40">
              Bestseller
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-[#D4AF37] text-neutral-950 shadow-md">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Action Icons (Wishlist & Compare) Right */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
          <button
            id={`wishlist-toggle-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isFav 
                ? 'bg-red-600 text-white shadow-lg scale-105' 
                : 'bg-black/70 text-neutral-300 hover:text-white hover:bg-neutral-800'
            }`}
            title={isFav ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>

          <button
            id={`compare-toggle-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              if (inComp) {
                removeFromCompare(product.id);
              } else {
                addToCompare(product);
              }
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              inComp
                ? 'bg-[#D4AF37] text-black shadow-lg scale-105' 
                : 'bg-black/70 text-neutral-300 hover:text-white hover:bg-neutral-800'
            }`}
            title="Compare specifications"
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Nutritional Highlights Pill Bar at Bottom of Image Stage */}
        <div className="absolute bottom-2 inset-x-2 z-10">
          <div className="px-2.5 py-1 rounded-lg bg-neutral-950/90 border border-neutral-800 text-[10px] font-bold text-amber-300 backdrop-blur-md flex items-center justify-between shadow-md">
            <span className="truncate">{getNutritionHighlight(product)}</span>
            <span className="text-emerald-400 font-extrabold ml-1 flex-shrink-0">100% Lab Tested</span>
          </div>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category & Servings header */}
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-extrabold uppercase tracking-wider text-[#D4AF37]">
              {product.category}
            </span>
            <span className="text-neutral-400 font-medium">
              {product.servings} Servings ({selectedSize})
            </span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => navigate('product', { id: product.slug || product.id })}
            className="text-sm sm:text-base font-black text-white line-clamp-2 hover:text-[#D4AF37] cursor-pointer transition-colors leading-snug font-display"
          >
            {product.name}
          </h3>

          {/* Flavour & Dietary */}
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-neutral-400">
            <span className="truncate font-medium text-neutral-300">{product.flavour}</span>
            <span>•</span>
            <span className="text-emerald-400 text-[11px] font-semibold">{product.dietaryPreference}</span>
          </div>

          {/* Variant Size Selector Pills (if multiple sizes exist) */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5" onClick={(e) => e.stopPropagation()}>
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedSize(v.size)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                    selectedSize === v.size
                      ? 'bg-[#D4AF37] text-neutral-950 shadow-sm border border-[#D4AF37]'
                      : 'bg-neutral-800/80 text-neutral-400 border border-neutral-700/60 hover:text-white hover:border-neutral-500'
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          )}

          {/* Rating & Social Proof */}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-neutral-800/60 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-[11px]">
                <Star className="w-3 h-3 fill-current mr-1" />
                <span>{product.rating}</span>
              </div>
              <span className="text-[11px] text-neutral-400">({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Gohana Sealed</span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA Section */}
        <div className="pt-3 border-t border-neutral-800 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white font-display">
                ₹{activeSalePrice.toLocaleString('en-IN')}
              </span>
              {activeRegularPrice > activeSalePrice && (
                <span className="text-xs text-neutral-500 line-through">
                  ₹{activeRegularPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {savingsAmount > 0 && (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                Save ₹{savingsAmount.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] text-neutral-400">
            <span className="flex items-center gap-1">
              <Truck className="w-3 h-3 text-[#D4AF37]" />
              <span>Ships in 24h</span>
            </span>
            <span>Free Delivery &gt; ₹999</span>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              id={`add-to-cart-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, product.flavour, selectedSize);
              }}
              className={`w-full py-2.5 px-2 rounded-xl active:scale-98 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border group/btn ${
                isPurchased
                  ? 'bg-amber-950/70 border-[#D4AF37] text-amber-200 hover:bg-amber-900/80 shadow-[0_2px_10px_rgba(212,175,55,0.15)]'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700/80 hover:border-[#D4AF37]/50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37] group-hover/btn:scale-110 transition-transform" />
              <span>{isPurchased ? 'Reorder Item' : 'Add to Cart'}</span>
            </button>

            <button
              id={`buy-now-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                const added = addToCart(product, product.flavour, selectedSize);
                if (added) {
                  navigate('checkout');
                }
              }}
              className="w-full py-2.5 px-2 rounded-xl bg-gradient-to-r from-amber-600 via-[#D4AF37] to-amber-500 active:scale-98 text-neutral-950 text-xs font-black transition-all hover:brightness-110 flex items-center justify-center gap-1 shadow-[0_2px_12px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.45)]"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

