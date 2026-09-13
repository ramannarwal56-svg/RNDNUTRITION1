import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { Product } from '../types';
import { 
  Filter, 
  Search, 
  X, 
  SlidersHorizontal, 
  Grid3X3, 
  ListFilter, 
  ChevronDown,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { routeParams, openFitGuide, navigate } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(routeParams.category || 'All');
  const [selectedGoal, setSelectedGoal] = useState<string>(routeParams.goal || 'All');
  const [selectedDiet, setSelectedDiet] = useState<string>('All');
  const [selectedFlavour, setSelectedFlavour] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [searchQuery, setSearchQuery] = useState<string>(routeParams.search || '');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isBestSellerOnly, setIsBestSellerOnly] = useState<boolean>(routeParams.bestSeller === 'true');
  const [isFeaturedOnly, setIsFeaturedOnly] = useState<boolean>(routeParams.featured === 'true');

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync when routeParams change
  useEffect(() => {
    if (routeParams.category) setSelectedCategory(routeParams.category);
    if (routeParams.search) setSearchQuery(routeParams.search);
    if (routeParams.goal) setSelectedGoal(routeParams.goal);
    if (routeParams.bestSeller === 'true') setIsBestSellerOnly(true);
    if (routeParams.featured === 'true') setIsFeaturedOnly(true);
  }, [routeParams]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedGoal, selectedDiet, maxPrice, sortBy, isBestSellerOnly, isFeaturedOnly]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedGoal !== 'All') params.append('goal', selectedGoal);
      if (selectedDiet !== 'All') params.append('diet', selectedDiet);
      if (maxPrice < 6000) params.append('maxPrice', String(maxPrice));
      if (isBestSellerOnly) params.append('bestSeller', 'true');
      if (isFeaturedOnly) params.append('featured', 'true');
      if (sortBy) params.append('sort', sortBy);
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        let list: Product[] = data.products || [];
        if (inStockOnly) {
          list = list.filter(p => p.stockQuantity > 0);
        }
        if (selectedFlavour !== 'All') {
          list = list.filter(p => p.flavour.toLowerCase().includes(selectedFlavour.toLowerCase()));
        }
        setProducts(list);
      } else {
        throw new Error('API not available');
      }
    } catch (e) {
      console.warn("Catalog fetch failed, using fallback:", e);
      import('../../server/data/initialData').then(mod => {
        let list = mod.INITIAL_PRODUCTS || [];
        if (selectedCategory !== 'All') list = list.filter(p => p.category === selectedCategory);
        if (searchQuery) list = list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        if (inStockOnly) list = list.filter(p => p.stockQuantity > 0);
        setProducts(list);
      });
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedGoal('All');
    setSelectedDiet('All');
    setSelectedFlavour('All');
    setMaxPrice(6000);
    setSearchQuery('');
    setSortBy('featured');
    setInStockOnly(false);
    setIsBestSellerOnly(false);
    setIsFeaturedOnly(false);
  };

  const categories = [
    'All',
    'Whey Protein',
    'Creatine',
    'Pre-Workout',
    'Mass Gainer',
    'Fat Burner',
    'Protein Bars',
    'Multivitamins'
  ];

  const goals = [
    'All',
    'Lean Muscle',
    'Mass Gaining',
    'Fat Loss',
    'Energy & Focus',
    'Endurance & Recovery'
  ];

  const flavours = [
    'All',
    'Chocolate',
    'Mango',
    'Coffee',
    'Blue Raspberry',
    'Green Apple',
    'Watermelon',
    'Unflavoured'
  ];

  return (
    <div id="rnd-shop-page" className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1">
              <span>Authentic Gym Supplements</span>
              <span>•</span>
              <span>India Only</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-display">
              Official Supplement Catalog
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Direct dispatch from Gohana, Sonipat. Third-party verified purity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openFitGuide}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600/20 to-[#D4AF37]/30 border border-[#D4AF37]/60 text-amber-300 text-xs font-bold hover:border-[#D4AF37] transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Unsure? Use AI Fit Guide</span>
            </button>

            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-bold"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-b border-neutral-800/80">
          {/* Search box */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') fetchProducts(); }}
              placeholder="Search isolate, creatine, bcaa..."
              className="w-full bg-neutral-900 text-white text-xs pl-10 pr-8 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-[#D4AF37]"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); fetchProducts(); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector & Active Count */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 text-xs">
            <span className="text-neutral-400">
              Showing <strong className="text-white">{products.length}</strong> formulations
            </span>

            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="featured">Featured First</option>
                <option value="bestselling">Bestsellers First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid with Sidebar Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Refine Catalog</span>
              </span>
              <button
                onClick={resetFilters}
                className="text-[11px] text-neutral-400 hover:text-[#D4AF37] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Supplement Category
              </label>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#D4AF37] text-neutral-950 font-bold'
                        : 'text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal Filter */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Fitness Goal
              </label>
              <div className="space-y-1">
                {goals.map(g => (
                  <button
                    key={g}
                    onClick={() => setSelectedGoal(g)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedGoal === g
                        ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-white font-bold'
                        : 'text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-neutral-400">Max Budget</span>
                <span className="font-bold text-[#D4AF37]">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="500"
                max="6000"
                step="200"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#D4AF37]"
              />
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>₹500</span>
                <span>₹6,000+</span>
              </div>
            </div>

            {/* Dietary Preference */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Dietary Preference
              </label>
              <select
                value={selectedDiet}
                onChange={(e) => setSelectedDiet(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="All">All Diets</option>
                <option value="Vegetarian">100% Vegetarian</option>
                <option value="Gluten-Free">Gluten-Free</option>
                <option value="Lactose Sensitive">Lactose Sensitive</option>
              </select>
            </div>

            {/* Quick Toggles */}
            <div className="space-y-2 pt-2 border-t border-neutral-800 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#D4AF37] rounded"
                />
                <span>In Stock Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBestSellerOnly}
                  onChange={(e) => setIsBestSellerOnly(e.target.checked)}
                  className="accent-[#D4AF37] rounded"
                />
                <span>Bestsellers Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-9">
            {loading ? (
              <div className="py-24 text-center">
                <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xs text-neutral-400">Loading catalog...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center rounded-2xl bg-neutral-900/50 border border-neutral-800 p-8 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">No supplements match your filter</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Try adjusting your price range, clearing the search query, or selecting another category.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-neutral-950 text-xs font-bold hover:bg-amber-400"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-md max-h-[85vh] overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-t-3xl sm:rounded-2xl p-6 text-white space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-sm font-bold uppercase tracking-wider">Filters</span>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400">Fitness Goal</label>
              <select
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
              >
                {goals.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Max Budget</span>
                <span className="text-[#D4AF37] font-bold">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="500"
                max="6000"
                step="200"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#D4AF37]"
              />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-neutral-800">
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-3 rounded-xl bg-neutral-800 text-white text-xs font-bold"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-xl bg-[#D4AF37] text-black text-xs font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
