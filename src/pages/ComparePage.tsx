import React from 'react';
import { useStore } from '../context/StoreContext';
import { Scale, X, ShoppingBag, ArrowRight } from 'lucide-react';

export const ComparePage: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, addToCart, navigate } = useStore();

  if (compareList.length === 0) {
    return (
      <div id="rnd-compare-empty" className="min-h-screen bg-neutral-950 text-neutral-100 py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-4 bg-neutral-900 border border-neutral-800 p-8 rounded-3xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-neutral-800 flex items-center justify-center text-[#D4AF37]">
            <Scale className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold uppercase text-white font-display">No Supplements to Compare</h2>
          <p className="text-xs text-neutral-400">
            Compare protein percentage, calories, BCAA ratio, and cost per scoop across up to 4 formulations.
          </p>
          <button
            onClick={() => navigate('shop')}
            className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-neutral-950 text-xs font-bold"
          >
            Browse Supplement Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="rnd-compare-page" className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display">
              Supplement Matrix Comparison
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Side-by-side nutritional breakdown of {compareList.length} RND formulations.
            </p>
          </div>
          <button
            onClick={clearCompare}
            className="text-xs text-neutral-400 hover:text-red-400 transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[700px] bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            {/* Header row with cards */}
            <div className="grid grid-cols-5 p-4 border-b border-neutral-800 items-start gap-4">
              <div className="font-bold text-xs uppercase tracking-wider text-neutral-400 pt-4">
                Supplement
              </div>
              {compareList.map(prod => (
                <div key={prod.id} className="relative p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center space-y-2">
                  <button
                    onClick={() => removeFromCompare(prod.id)}
                    className="absolute top-2 right-2 text-neutral-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    onClick={() => navigate('product', { id: prod.slug || prod.id })}
                    className="w-20 h-20 mx-auto object-contain p-1 cursor-pointer hover:scale-105 transition-transform"
                  />
                  <h4 
                    onClick={() => navigate('product', { id: prod.slug || prod.id })}
                    className="text-xs font-bold text-white truncate cursor-pointer hover:text-[#D4AF37] transition-colors"
                  >
                    {prod.name}
                  </h4>
                  <div className="text-xs font-black text-[#D4AF37]">
                    ₹{prod.salePrice.toLocaleString('en-IN')}
                  </div>
                  <button
                    onClick={() => addToCart(prod, prod.flavour, prod.weightOrPackSize, 1)}
                    className="w-full py-1.5 rounded-lg bg-[#D4AF37] text-neutral-950 font-bold text-[11px] flex items-center justify-center gap-1"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Category */}
            <div className="grid grid-cols-5 p-4 border-b border-neutral-800/60 text-xs items-center gap-4">
              <span className="font-bold text-neutral-400 uppercase">Category</span>
              {compareList.map(p => (
                <span key={p.id} className="text-center font-medium text-white">{p.category}</span>
              ))}
            </div>

            {/* Goal */}
            <div className="grid grid-cols-5 p-4 border-b border-neutral-800/60 text-xs items-center gap-4">
              <span className="font-bold text-neutral-400 uppercase">Fitness Goal</span>
              {compareList.map(p => (
                <span key={p.id} className="text-center font-medium text-[#D4AF37]">{p.goal}</span>
              ))}
            </div>

            {/* Servings */}
            <div className="grid grid-cols-5 p-4 border-b border-neutral-800/60 text-xs items-center gap-4">
              <span className="font-bold text-neutral-400 uppercase">Servings</span>
              {compareList.map(p => (
                <span key={p.id} className="text-center font-medium text-white">{p.servings} Servings</span>
              ))}
            </div>

            {/* Active Flavour & Pack Size */}
            <div className="grid grid-cols-5 p-4 border-b border-neutral-800/60 text-xs items-center gap-4">
              <span className="font-bold text-neutral-400 uppercase">Flavour &amp; Size</span>
              {compareList.map(p => (
                <span key={p.id} className="text-center text-neutral-300">
                  {p.flavour} • {p.weightOrPackSize}
                </span>
              ))}
            </div>

            {/* Key Nutrition Breakdown */}
            <div className="grid grid-cols-5 p-4 border-b border-neutral-800/60 text-xs items-start gap-4">
              <span className="font-bold text-neutral-400 uppercase">Nutrition Facts</span>
              {compareList.map(p => (
                <div key={p.id} className="text-center space-y-1 text-neutral-300">
                  {p.nutritionInfo && Object.entries(p.nutritionInfo).slice(0, 4).map(([k, v]) => (
                    <div key={k} className="text-[11px]">
                      <span className="capitalize text-neutral-500">{k}:</span> <strong className="text-white">{String(v)}</strong>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Purity Standards */}
            <div className="grid grid-cols-5 p-4 text-xs items-center gap-4">
              <span className="font-bold text-neutral-400 uppercase">NABL Certified</span>
              {compareList.map(p => (
                <span key={p.id} className="text-center text-emerald-400 font-bold">100% Genuine</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
