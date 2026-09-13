import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, navigate } = useStore();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlistProducts();
  }, [wishlist]);

  const fetchWishlistProducts = async () => {
    if (wishlist.length === 0) {
      setWishlistProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        const matches = (data.products || []).filter((p: Product) => wishlist.includes(p.id));
        setWishlistProducts(matches);
      }
    } catch {
      console.warn("Wishlist fetch error");
    } finally {
      setLoading(false);
    }
  };

  if (wishlist.length === 0) {
    return (
      <div id="rnd-wishlist-empty" className="min-h-screen bg-neutral-950 text-neutral-100 py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-4 bg-neutral-900 border border-neutral-800 p-8 rounded-3xl shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-neutral-800 flex items-center justify-center text-red-500">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-xl font-bold uppercase text-white font-display">Your Wishlist is Empty</h2>
          <p className="text-xs text-neutral-400">
            Save your favorite formulations, protein powders, and pre-workouts for quick reordering.
          </p>
          <button
            onClick={() => navigate('shop')}
            className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-neutral-950 text-xs font-bold"
          >
            Explore Supplements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="rnd-wishlist-page" className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="pb-6 border-b border-neutral-800">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display">
            My Saved Wishlist ({wishlistProducts.length})
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Authentic supplements saved to your account.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-neutral-400">Loading saved items...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
