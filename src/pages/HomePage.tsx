import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { Product, Order, OrderItem } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Flame, 
  Zap, 
  Dumbbell, 
  CheckCircle2, 
  Star, 
  MessageCircle, 
  Scale, 
  BookOpen, 
  ChevronRight,
  TrendingUp,
  Award,
  Repeat,
  ShoppingBag,
  PackageCheck
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate, openFitGuide, settings, user, addToCart, showToast, openAuthModal } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickBatch, setQuickBatch] = useState('');
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [purchasedProductIds, setPurchasedProductIds] = useState<Set<string>>(new Set());

  // 3D Hero tilt coordinates
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchProducts();
    fetchPastOrders();
  }, [user]);

  const fetchPastOrders = async () => {
    if (!user) {
      setPastOrders([]);
      setPurchasedProductIds(new Set());
      return;
    }

    try {
      const phone = user.phone || user.email;
      const res = await fetch(`/api/orders?phone=${phone}`);
      if (res.ok) {
        const data = await res.json();
        if (data.orders && data.orders.length > 0) {
          setPastOrders(data.orders);
          const ids = new Set<string>();
          data.orders.forEach((o: Order) => {
            o.items.forEach(item => ids.add(item.productId));
          });
          setPurchasedProductIds(ids);
          return;
        } else {
          setPastOrders([]);
          setPurchasedProductIds(new Set());
        }
      }
    } catch (err) {
      console.warn("Orders fetch failed:", err);
    }
    setPurchasedProductIds(new Set());
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      } else {
        throw new Error('API not available');
      }
    } catch (e) {
      console.warn("Products fetch failed, falling back to static data for GitHub Pages:", e);
      import('../../server/data/initialData').then(mod => {
        setProducts(mod.INITIAL_PRODUCTS || []);
      }).catch(err => {
        console.error("Failed to load static fallback data:", err);
      });
    } finally {
      setLoading(false);
    }
  };

  // Purchased products list for Reorder Stack
  const pastPurchasedItems = useMemo(() => {
    if (pastOrders.length > 0) {
      const map = new Map<string, { item: OrderItem; orderDate: string; orderId: string; orderStatus: string }>();
      pastOrders.forEach(order => {
        order.items.forEach(item => {
          if (!map.has(item.productId)) {
            map.set(item.productId, {
              item,
              orderDate: order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent',
              orderId: order.id,
              orderStatus: order.orderStatus
            });
          }
        });
      });
      return Array.from(map.values());
    }

    return [];
  }, [pastOrders]);

  const handleReorderAllPastItems = () => {
    if (!user) {
      return;
    }
    let count = 0;
    pastPurchasedItems.forEach(({ item }) => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.flavour, item.size, item.quantity || 1);
        count++;
      }
    });

    if (count > 0) {
      showToast(`Added your ${count}-item Reorder Stack to Cart!`, 'success');
      navigate('checkout');
    }
  };

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setHeroTilt({
      x: (y / rect.height) * -12,
      y: (x / rect.width) * 12
    });
  };

  const handleHeroMouseLeave = () => {
    setHeroTilt({ x: 0, y: 0 });
  };

  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);

  const signatureCategoryProducts = useMemo(() => {
    const desiredIds = [
      'rnd-whey-isolate',
      'rnd-creatine-micronized',
      'rnd-preworkout-ignition',
      'rnd-mass-gainer-anabolic',
      'rnd-fatburner-shred-thermo',
      'rnd-protein-bars-box',
      'rnd-multivitamin-elite'
    ];
    const map = new Map<string, Product>(products.map(p => [p.id, p]));
    const list: Product[] = [];
    desiredIds.forEach(id => {
      const p = map.get(id);
      if (p) list.push(p);
    });
    if (list.length < 7) {
      const remaining = products.filter(p => !list.some(item => item.id === p.id));
      list.push(...remaining.slice(0, 7 - list.length));
    }
    return list;
  }, [products]);

  const categories = [
    { name: 'Whey Protein', icon: Dumbbell, desc: 'Isolates & Pure Concentrates', count: '3 Products', image: './images/rnd_whey_protein_1789192519698.jpg' },
    { name: 'Creatine', icon: Zap, desc: '200-Mesh Micronized ATP Booster', count: '2 Products', image: './images/rnd_creatine_container_1789192533564.jpg' },
    { name: 'Pre-Workout', icon: Flame, desc: 'Explosive Nitric Oxide & Focus', count: '2 Products', image: './images/rnd_preworkout_tub_1789192545387.jpg' },
    { name: 'Mass Gainer', icon: TrendingUp, desc: 'High Calorie Bulking Matrix', count: '2 Products', image: './images/rnd_mass_gainer_1789192555719.jpg' },
    { name: 'Fat Burner', icon: Flame, desc: 'Thermogenic Metabolic Catalyst', count: '1 Product', image: './images/rnd_fat_burner_1789192565381.jpg' },
    { name: 'Protein Bars', icon: Dumbbell, desc: '20g Gourmet Sugar-Free Snack', count: '1 Product', image: './images/rnd_protein_bars_1789192576924.jpg' },
    { name: 'Multivitamins', icon: ShieldCheck, desc: 'High-Potency Micronutrients', count: '1 Product', image: './images/rnd_multivitamins_1789192587333.jpg' }
  ];

  const goals = [
    { title: 'Lean Muscle & Definition', desc: 'Isolate protein + pure BCAAs', filter: 'Lean Muscle' },
    { title: 'Heavy Mass & Bulking', desc: 'Calorie dense gainers + creatine', filter: 'Mass Gaining' },
    { title: 'Fat Loss & Shred', desc: 'Thermogenics + low-carb protein', filter: 'Fat Loss' },
    { title: 'Power & High Energy', desc: 'Pre-workouts + micronized ATP', filter: 'Energy & Focus' }
  ];

  return (
    <div id="rnd-home-page" className="min-h-screen bg-neutral-950 text-neutral-100 overflow-x-hidden">
      {/* 3D Hero Section */}
      <section 
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-800"
      >
        {/* Animated Gold Streaks & Dynamic Ambient Light */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[140px]" />
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px]" />
        </div>

        <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
          {/* Left Text & Call to Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-[#D4AF37]/50 text-neutral-300 text-xs font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
              <span>ALL INDIA DELIVERY AVAILABLE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black uppercase tracking-tight font-display leading-none">
              <span className="block text-white">FUEL YOUR</span>
              <span className="block bg-gradient-to-r from-amber-200 via-[#D4AF37] to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
                STRENGTH.
              </span>
              <span className="block text-neutral-100">BUILD YOUR RND.</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Authentic Indian sports nutrition engineered for serious training, rapid recovery, and clean muscle development. Zero banned substances, 100% verified batches.
            </p>

            {/* Value Checkpoints */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>NABL Lab Tested</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>QR Batch Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Next-Day Dispatch</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                id="hero-shop-all-btn"
                onClick={() => navigate('shop')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-600 via-[#D4AF37] to-amber-500 hover:brightness-110 text-neutral-950 text-sm font-black tracking-wider uppercase shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <span>Shop Supplements</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-fitguide-btn"
                onClick={openFitGuide}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#D4AF37] text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Fit Guide (Recommendation)</span>
              </button>
            </div>
          </div>

          {/* Right 3D Visual Stage with Floating Supplement Jars */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div 
              style={{
                transform: `perspective(1000px) rotateX(${heroTilt.x}deg) rotateY(${heroTilt.y}deg)`,
                transition: 'transform 0.15s ease-out'
              }}
              className="relative w-72 sm:w-88 h-96 sm:h-[440px] preserve-3d"
            >
              {/* Central Pedestal Glow */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64 h-24 bg-[#D4AF37]/25 blur-3xl rounded-full" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-6 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60 blur-sm rounded-full" />

              {/* Main Center Floating Tub: Whey Isolate */}
              <div className="absolute inset-0 flex flex-col items-center justify-center animate-float">
                <div className="relative group p-3 rounded-2xl bg-neutral-900/90 border border-[#D4AF37]/70 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(212,175,55,0.3)] backdrop-blur-md overflow-hidden">
                  <img
                    src="./images/rnd_whey_protein_1789192519698.jpg"
                    alt="RND Whey Protein Premium Protein Powder"
                    referrerPolicy="no-referrer"
                    className="w-52 sm:w-64 h-56 sm:h-68 object-cover rounded-xl filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.95)]"
                  />
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-wider shadow-md">
                    100% Isolate
                  </div>
                  <div className="mt-2 text-center">
                    <h3 className="text-sm font-black text-white tracking-wide">RND WHEY PROTEIN</h3>
                    <p className="text-xs text-[#D4AF37] font-semibold">Premium Protein Powder • Gold Series</p>
                  </div>
                </div>
              </div>

              {/* Floating Floating Badge Left: Creatine 200 Mesh */}
              <div className="absolute -left-6 top-16 p-3 rounded-xl bg-neutral-950/90 border border-neutral-700 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-2.5 animate-pulse">
                <Zap className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <div className="text-[11px] font-bold text-white">200 Mesh Micronized</div>
                  <div className="text-[10px] text-neutral-400">Pure ATP Regeneration</div>
                </div>
              </div>

              {/* Floating Badge Right: Lab Certified */}
              <div className="absolute -right-6 bottom-20 p-3 rounded-xl bg-neutral-950/90 border border-[#D4AF37]/50 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-[11px] font-bold text-white">Batch Sealed</div>
                  <div className="text-[10px] text-neutral-400">Gohana Formulation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 Supplement Categories (With 3D Hover Depth) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              <Dumbbell className="w-4 h-4" />
              <span>Targeted Formulation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display mt-1">
              Explore By Category
            </h2>
          </div>
          <button
            onClick={() => navigate('shop')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] hover:text-white transition-colors"
          >
            <span>View All Supplements</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => navigate('shop', { category: cat.name })}
                className="group relative cursor-pointer rounded-xl bg-neutral-900/80 border border-neutral-800 p-4 text-center hover:border-[#D4AF37] hover:shadow-[0_10px_25px_rgba(212,175,55,0.15)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center justify-between"
              >
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 group-hover:border-[#D4AF37]/60 text-[#D4AF37] transition-colors mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-neutral-200 group-hover:text-white transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-neutral-500 mt-1">{cat.count}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Buy Again • Products You Previously Ordered (Athlete Reorder Stack) */}
      {pastPurchasedItems.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-800">
          <div className="rounded-3xl bg-gradient-to-r from-amber-950/30 via-neutral-900/90 to-neutral-950 border-2 border-[#D4AF37]/60 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(212,175,55,0.15)]">
            {/* Header bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800/80 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-[11px] font-black uppercase tracking-wider mb-2">
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Athlete Reorder Stack • Fast 1-Click Refill</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display">
                  Products You Used To Buy
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mt-1">
                  Reorder your active training stack in 1 click with the exact same authentic store styling. Verified genuine formulations with batch authenticity records delivered directly from Gohana, Sonipat.
                </p>
                <div className="mt-2.5 flex items-center gap-2 text-xs text-[#D4AF37]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-semibold">Last order delivered to {user?.name || 'Raman Narwal'} ({user?.email || '9306667128'})</span>
                </div>
              </div>

              {/* Master Reorder Button */}
              <button
                id="reorder-complete-stack-btn"
                onClick={handleReorderAllPastItems}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-[#D4AF37] to-amber-500 hover:brightness-110 active:scale-98 text-neutral-950 text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(212,175,55,0.4)] whitespace-nowrap"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Reorder Complete Stack ({pastPurchasedItems.length} Products)</span>
              </button>
            </div>

            {/* Grid of Previously Purchased Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pastPurchasedItems.map(({ item, orderDate, orderStatus }) => {
                const matchedProd = products.find(p => p.id === item.productId);
                if (matchedProd) {
                  return (
                    <div key={item.productId} className="flex flex-col">
                      <div className="mb-2.5 px-3 py-1.5 rounded-xl bg-amber-950/70 border border-[#D4AF37]/50 text-[11px] text-amber-200 flex items-center justify-between">
                        <span className="font-bold truncate">Bought: {item.flavour} ({item.size})</span>
                        <span className="text-emerald-400 font-extrabold flex-shrink-0 ml-1.5">✓ {orderStatus}</span>
                      </div>
                      <ProductCard product={matchedProd} isPurchased={true} />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </section>
      )}

      {/* RND Commercial Packaging Architecture & Photography Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
              <span>Packaging Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-display mt-1">
              Engineered In Matte Black &amp; Metallic Gold
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mt-1.5 leading-relaxed">
              Every RND product is housed in luxury matte black packaging with our signature embossed metallic-gold insignia, subtle crimson rim accents, and dramatic studio contour lighting.
            </p>
          </div>
          <button
            onClick={() => navigate('shop')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] hover:text-white transition-colors"
          >
            <span>Explore Complete Lineup</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Master 16:9 Cinematic Commercial Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-neutral-800 hover:border-[#D4AF37]/80 shadow-[0_20px_60px_rgba(0,0,0,0.9)] mb-10 group transition-colors duration-300">
          <img
            src="./images/rnd_hero_banner_1789192600800.jpg"
            alt="RND Commercial Supplement Photography Stack - Matte Black and Metallic Gold"
            referrerPolicy="no-referrer"
            className="w-full h-64 sm:h-96 lg:h-[480px] object-cover object-center group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] text-[11px] font-bold uppercase tracking-wider w-fit mb-2">
              <span>Signature Commercial Series</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-black uppercase text-white font-display">
              Strength. Discipline. Performance.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mt-1 leading-relaxed">
              Photorealistic studio photography with verified lab-certified formulations. Clean blank label zones ready for technical specifications. No copied competitor logos, zero artificial fluff.
            </p>
          </div>
        </div>

        {/* 7 Brand Commercial Supplement Products Grid with Live Store Theme */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#D4AF37] block">
                FLAGSHIP FORMULATIONS ACROSS ALL 7 CATEGORIES
              </span>
              <h3 className="text-xl font-black text-white uppercase font-display mt-0.5">
                Official Supplement Store Formulations
              </h3>
            </div>
            <span className="text-xs text-neutral-400 hidden sm:inline">
              Showing 7 Signature Categories with Live Store Theme &amp; Instant Cart
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {signatureCategoryProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                isPurchased={purchasedProductIds.has(prod.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              <Flame className="w-4 h-4" />
              <span>Athlete Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display mt-1">
              Top Selling Formulations
            </h2>
          </div>
          <button
            onClick={() => navigate('shop', { bestSeller: 'true' })}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] hover:text-white transition-colors"
          >
            <span>See All Bestsellers</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-neutral-400">Loading authentic formulations...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isPurchased={purchasedProductIds.has(product.id)} 
              />
            ))}
          </div>
        )}
      </section>

      {/* Shop By Fitness Goal Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-800">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            <Award className="w-4 h-4" />
            <span>Targeted Protocols</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display mt-1">
            Shop By Your Fitness Goal
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {goals.map((g, idx) => (
            <div
              key={idx}
              onClick={() => navigate('shop', { goal: g.filter })}
              className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 hover:border-[#D4AF37] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">
                Phase {idx + 1}
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors mb-1">
                {g.title}
              </h3>
              <p className="text-xs text-neutral-400 mb-4">{g.desc}</p>
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 group-hover:text-white">
                <span>View Stack</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Authenticity Verification Hero Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-[#D4AF37]/40 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Fake Supplements Guarantee</span>
              </span>

              <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-display leading-tight">
                Verify Your RND Batch Authenticity
              </h2>

              <p className="text-sm text-neutral-300 max-w-xl leading-relaxed">
                Every genuine RND tub carries a laser-etched batch code and tamper-proof inner seal. Check your manufacturing batch against our master register directly from Gohana, Sonipat.
              </p>

              {/* Quick Batch Lookup Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (quickBatch.trim()) {
                    navigate('authenticity', { batch: quickBatch.trim() });
                  }
                }}
                className="flex flex-col sm:flex-row gap-2 max-w-md pt-2"
              >
                <input
                  type="text"
                  value={quickBatch}
                  onChange={(e) => setQuickBatch(e.target.value)}
                  placeholder="Enter batch code (e.g. RND-WI-2026-01)"
                  className="flex-1 bg-neutral-950 text-white text-xs px-4 py-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all shadow-md"
                >
                  Verify Now
                </button>
              </form>
              <div className="text-[11px] text-neutral-500">
                Sample batches to test: <span className="text-[#D4AF37] cursor-pointer" onClick={() => setQuickBatch('RND-WI-2026-01')}>RND-WI-2026-01</span>, <span className="text-[#D4AF37] cursor-pointer" onClick={() => setQuickBatch('RND-CR-2026-04')}>RND-CR-2026-04</span>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block">Manufactured in Gohana, Sonipat</strong>
                  <span className="text-neutral-400">Strict Good Manufacturing Practices (GMP) and ISO certified premises.</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block">100% Label Accuracy</strong>
                  <span className="text-neutral-400">Zero amino spiking. Exactly what is stated on the label is inside the jar.</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block">Heavy Metals & Purity Certified</strong>
                  <span className="text-neutral-400">NABL accredited lab tests for Lead, Cadmium, Arsenic and Mercury below detectable limits.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel/Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display mt-1">
              Featured Formulations
            </h2>
          </div>
          <button
            onClick={() => navigate('shop', { featured: 'true' })}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] hover:text-white transition-colors"
          >
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isPurchased={purchasedProductIds.has(product.id)} 
            />
          ))}
        </div>
      </section>

      {/* Comparison Tool Teaser */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-800">
        <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Compare Supplement Specifications</h3>
              <p className="text-xs text-neutral-400 max-w-md mt-0.5">
                Analyze protein percentages, amino acid profiles, servings per tub, and cost per scoop side-by-side.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('compare')}
            className="px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-all border border-neutral-700 flex items-center gap-2"
          >
            <span>Open Comparison Matrix</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>
      </section>

      {/* Direct WhatsApp Helpline Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/60 via-neutral-900 to-neutral-950 border border-emerald-800/50 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Need Supplement Stacking Help?</h4>
              <p className="text-xs text-neutral-300 mt-0.5">
                Connect directly with Raman Narwal and the RND Gohana nutrition team on WhatsApp for free guidance.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/91${settings.whatsapp}?text=Hi%20RND!%20I%20want%20guidance%20on%20choosing%20the%20right%20supplements.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-lg flex-shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat On WhatsApp: {settings.whatsapp}</span>
          </a>
        </div>
      </section>
    </div>
  );
};
