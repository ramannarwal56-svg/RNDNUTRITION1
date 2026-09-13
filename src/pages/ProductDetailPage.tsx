import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Review } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { Product3DViewer } from '../components/common/Product3DViewer';
import { 
  getProductMediaGallery, 
  ProductMediaItem,
  generateNutritionReportSVG,
  generateAminoProfileSVG,
  generateBackNutritionLabelSVG,
  generateCertificateSVG
} from '../utils/productMedia';
import { 
  Star, 
  ShoppingBag, 
  Zap, 
  Heart, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  AlertCircle, 
  Clock, 
  Plus, 
  Minus,
  Sparkles,
  Send,
  Award,
  RotateCw,
  Eye,
  Maximize2,
  X,
  Download,
  Share2,
  Layers,
  ChevronRight,
  FileText,
  Dna,
  Package,
  FileCheck,
  Grid,
  BookOpen
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { routeParams, addToCart, toggleWishlist, isInWishlist, addToCompare, isInCompare, navigate, user, showToast } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Gallery and 3D State
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [fullScreenModal, setFullScreenModal] = useState<{ isOpen: boolean; title: string; src: string; type: string } | null>(null);
  const [allViewsModalOpen, setAllViewsModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'nutrition' | 'amino' | 'back' | 'certificate' | 'description' | 'reviews'>('nutrition');

  // Variant choices
  const [selectedFlavour, setSelectedFlavour] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Formulation selection (Choose your protein / formulation)
  const [selectedFormulation, setSelectedFormulation] = useState<string>('Whey PR');

  // 3D Image hover tilt for 2D container
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [imgTilt, setImgTilt] = useState({ x: 0, y: 0 });

  // Pincode estimator
  const [pincode, setPincode] = useState<string>('');
  const [pincodeResult, setPincodeResult] = useState<any>(null);
  const [pincodeLoading, setPincodeLoading] = useState<boolean>(false);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Related products
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const idOrSlug = routeParams.id || 'rnd-whey-isolate';
    fetchProductDetails(idOrSlug);
  }, [routeParams.id]);

  // Full media gallery (8 High-Def Views: Front, Back, NABL COA, Side Specs, Amino Acid Profile, Texture & Scoop, Scratch Seal, 360 3D)
  const mediaGallery: ProductMediaItem[] = product ? getProductMediaGallery(product) : [];

  // Image swapping function compliant with standard onclick="changeImage(this.src, this)"
  const changeImage = (src: string, element?: HTMLElement | null, index?: number) => {
    let targetIdx = index;
    if (targetIdx === undefined && product) {
      const currentList = getProductMediaGallery(product);
      targetIdx = currentList.findIndex(m => m.url === src);
      if (targetIdx < 0) targetIdx = 0;
    }

    if (targetIdx !== undefined && targetIdx >= 0) {
      setActiveMediaIndex(targetIdx);
      const selectedItem = mediaGallery[targetIdx];
      if (selectedItem?.type === '3d') {
        setViewMode('3d');
      } else {
        setViewMode('2d');
      }
    }

    // Direct DOM update for mainImage so swapping is instant
    const mainImg = document.getElementById('mainImage') as HTMLImageElement;
    if (mainImg && src) {
      mainImg.src = src;
    }

    // Update active class on all thumbnail elements
    const thumbs = document.querySelectorAll('.thumbnail-container .thumbnail');
    thumbs.forEach(t => t.classList.remove('active'));
    if (element) {
      element.classList.add('active');
    } else if (targetIdx !== undefined && thumbs[targetIdx]) {
      thumbs[targetIdx].classList.add('active');
    }
  };

  useEffect(() => {
    // Expose changeImage globally for any inline onclick="changeImage(this.src, this)" or script callers
    (window as any).changeImage = (src: string, element?: HTMLElement) => {
      changeImage(src, element);
    };
    return () => {
      delete (window as any).changeImage;
    };
  }, [product, mediaGallery]);

  const fetchProductDetails = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data: Product = await res.json();
        setProduct(data);
        setSelectedFlavour(data.flavour);
        setSelectedSize(data.weightOrPackSize);
        setActiveMediaIndex(0);
        setViewMode('2d');

        // Set initial formulation based on category
        if (data.category === 'Whey Protein') {
          setSelectedFormulation(data.name.includes('Isolate') ? 'Iso-Zero' : 'Whey PR');
        } else if (data.category === 'Creatine') {
          setSelectedFormulation('Micronized 200 Mesh');
        } else if (data.category === 'Pre-Workout') {
          setSelectedFormulation('Ignition X');
        } else {
          setSelectedFormulation('Pro PR Matrix');
        }

        // Fetch reviews & related
        fetchReviews(data.id);
        fetchRelated(data.category, data.id);
      } else {
        throw new Error('API not available');
      }
    } catch (e) {
      console.warn("Product detail fetch error, using fallback:", e);
      import('../../server/data/initialData').then(mod => {
        const data = mod.INITIAL_PRODUCTS.find(p => p.id === id || p.slug === id);
        if (data) {
          setProduct(data);
          setSelectedFlavour(data.flavour);
          setSelectedSize(data.weightOrPackSize);
          setActiveMediaIndex(0);
          setViewMode('2d');
          if (data.category === 'Whey Protein') {
            setSelectedFormulation(data.name.includes('Isolate') ? 'Iso-Zero' : 'Whey PR');
          } else if (data.category === 'Creatine') {
            setSelectedFormulation('Micronized 200 Mesh');
          } else if (data.category === 'Pre-Workout') {
            setSelectedFormulation('Ignition X');
          } else {
            setSelectedFormulation('Pro PR Matrix');
          }
          fetchRelated(data.category, data.id);
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (prodId: string) => {
    try {
      const res = await fetch(`/api/reviews?productId=${prodId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (e) {
      console.warn("Reviews fetch error:", e);
    }
  };

  const fetchRelated = async (category: string, currentId: string) => {
    try {
      const res = await fetch(`/api/products?category=${encodeURIComponent(category)}`);
      if (res.ok) {
        const data = await res.json();
        const related = (data.products || []).filter((p: Product) => p.id !== currentId).slice(0, 3);
        setRelatedProducts(related);
      } else {
        throw new Error('API not available');
      }
    } catch (e) {
      console.warn("Related fetch error, using fallback:", e);
      import('../../server/data/initialData').then(mod => {
        const related = mod.INITIAL_PRODUCTS.filter(p => p.category === category && p.id !== currentId).slice(0, 3);
        setRelatedProducts(related);
      });
    }
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setImgTilt({
      x: (y / rect.height) * -10,
      y: (x / rect.width) * 10
    });
  };

  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      showToast("Please enter a valid 6-digit Indian PIN code", "warning");
      return;
    }
    setPincodeLoading(true);
    try {
      const res = await fetch(`/api/pincode/${pincode}`);
      const data = await res.json();
      if (res.ok) {
        setPincodeResult(data);
      } else {
        showToast(data.error || "Could not check pincode", "error");
      }
    } catch {
      showToast("Pincode check failed", "error");
    } finally {
      setPincodeLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !newReviewComment.trim()) return;
    setReviewSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userName: newReviewName || user?.fullName || 'Verified Athlete',
          rating: newReviewRating,
          comment: newReviewComment.trim(),
          phone: user?.email
        })
      });
      if (res.ok) {
        const rev = await res.json();
        setReviews(prev => [rev, ...prev]);
        setNewReviewComment('');
        showToast("Review submitted! Thank you for supporting authentic RND nutrition.", "success");
      }
    } catch {
      showToast("Failed to submit review", "error");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Supplement Not Found</h2>
        <p className="text-sm text-neutral-400 mb-6">The requested product could not be located in our catalog.</p>
        <button
          onClick={() => navigate('shop')}
          className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-neutral-950 font-bold text-xs"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  // Active media item from the 8 gallery views
  const currentMedia = mediaGallery[activeMediaIndex] || mediaGallery[0];

  // Calculate dynamic price based on size variant if available
  let activePrice = product.salePrice;
  let activeRegular = product.regularPrice;
  if (selectedSize && product.variants) {
    const v = product.variants.find(item => item.size === selectedSize);
    if (v) {
      activePrice = v.salePrice;
      activeRegular = v.regularPrice;
    }
  }

  // Adjust formulation prices dynamically
  if (selectedFormulation === 'Performance Whey') {
    activePrice = Math.round(activePrice * 0.85);
    activeRegular = Math.round(activeRegular * 0.85);
  } else if (selectedFormulation === 'Iso-Zero') {
    activePrice = Math.round(activePrice * 1.12);
    activeRegular = Math.round(activeRegular * 1.12);
  } else if (selectedFormulation === 'Whey PR') {
    activePrice = Math.round(activePrice * 1.05);
    activeRegular = Math.round(activeRegular * 1.05);
  }

  const discountPercent = activeRegular > activePrice
    ? Math.round(((activeRegular - activePrice) / activeRegular) * 100)
    : 0;

  const isFav = isInWishlist(product.id);
  const inComp = isInCompare(product.id);

  // Formulation options definitions tailored to category
  const formulationOptions = product.category === 'Whey Protein' ? [
    { title: 'Performance Whey', subtitle: 'Concentrate whey protein', id: 'Performance Whey' },
    { title: 'Iso-Zero', subtitle: '100% Isolate only whey', id: 'Iso-Zero' },
    { title: 'Gold 100% Whey', subtitle: 'Isolate-primary whey blend', id: 'Gold 100% Whey' },
    { title: 'Whey PR', subtitle: 'Whey Concentrate with Creatine', id: 'Whey PR' },
  ] : product.category === 'Creatine' ? [
    { title: 'Micronized 200 Mesh', subtitle: 'Pure ATP Regeneration', id: 'Micronized 200 Mesh' },
    { title: 'Creapure® Gold', subtitle: 'German Gold Standard', id: 'Creapure® Gold' },
    { title: 'Creatine HCl Elite', subtitle: 'Concentrated Zero Bloat', id: 'Creatine HCl Elite' },
    { title: 'Creatine PR Matrix', subtitle: 'Creatine + Taurine Electrolytes', id: 'Creatine PR Matrix' },
  ] : product.category === 'Pre-Workout' ? [
    { title: 'Ignition X', subtitle: 'Explosive NO & Focus', id: 'Ignition X' },
    { title: 'Pump Stim-Free', subtitle: 'Pure Vasodilation & Hydration', id: 'Pump Stim-Free' },
    { title: 'PR Extreme 400', subtitle: 'High-Caffeine CNS Surge', id: 'PR Extreme 400' },
    { title: 'Amino Recharge', subtitle: 'Intra-Workout Endurance', id: 'Amino Recharge' },
  ] : [
    { title: 'Standard Formula', subtitle: 'Daily essential nutrition', id: 'Standard Formula' },
    { title: 'Elite Edition', subtitle: 'Enhanced bio-availability', id: 'Elite Edition' },
    { title: 'Hydro-Clean', subtitle: 'Zero additives & ultra pure', id: 'Hydro-Clean' },
    { title: 'Pro PR Matrix', subtitle: 'Maximum athletic strength', id: 'Pro PR Matrix' },
  ];

  return (
    <div id="rnd-product-detail-page" className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400">
          <button onClick={() => navigate('home')} className="hover:text-white">Home</button>
          <span>/</span>
          <button onClick={() => navigate('shop', { category: product.category })} className="hover:text-white">{product.category}</button>
          <span>/</span>
          <span className="text-[#D4AF37] font-semibold truncate">{product.name}</span>
        </nav>

        {/* Top Product Container: Left Side Gallery + Right Side Details */}
        <div className="product-container">
          
          {/* Left Side: Image Gallery */}
          <div className="product-gallery">
            {/* View Mode Toggle: 2D Studio Shot vs 360° All-Direction 3D */}
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-1.5 bg-neutral-900/90 p-1 rounded-xl border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setViewMode('2d')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    viewMode === '2d'
                      ? 'bg-[#D4AF37] text-neutral-950 shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>2D Studio Shot</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('3d');
                    // Find 3D thumbnail index
                    const idx3d = mediaGallery.findIndex(m => m.type === '3d');
                    if (idx3d >= 0) setActiveMediaIndex(idx3d);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    viewMode === '3d'
                      ? 'bg-[#D4AF37] text-neutral-950 shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>360° All-Direction 3D</span>
                </button>
              </div>

              {/* Inspect / Zoom Button */}
              {viewMode === '2d' && (
                <button
                  type="button"
                  onClick={() => setFullScreenModal({
                    isOpen: true,
                    title: currentMedia.title,
                    src: currentMedia.url,
                    type: currentMedia.type
                  })}
                  className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-[#D4AF37] hover:border-neutral-700 transition-colors flex items-center gap-1 text-xs font-semibold"
                  title="Inspect High-Res View"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Inspect</span>
                </button>
              )}
            </div>

            {/* Main Image or 3D Stage Container */}
            {viewMode === '3d' ? (
              <Product3DViewer
                product={product}
                customImage={product.images[0]}
                activeFace={currentMedia.type === 'back' ? 'back' : currentMedia.type === 'certificate' ? 'certificate' : currentMedia.type === 'side' ? 'side' : 'front'}
              />
            ) : (
              <div
                id="mainImageContainer"
                ref={imageContainerRef}
                onMouseMove={handleImageMouseMove}
                onMouseLeave={() => setImgTilt({ x: 0, y: 0 })}
                style={{
                  transform: `perspective(1000px) rotateX(${imgTilt.x}deg) rotateY(${imgTilt.y}deg)`,
                  transition: 'transform 0.1s ease-out'
                }}
                className="main-image-container group cursor-zoom-in"
                onClick={() => setFullScreenModal({
                  isOpen: true,
                  title: currentMedia.title,
                  src: currentMedia.url,
                  type: currentMedia.type
                })}
              >
                {/* Main Product Image (Front packshot, Back Nutrition Label, NABL Certificate, or Side Specs) */}
                <img
                  id="mainImage"
                  src={currentMedia.url}
                  alt={currentMedia.title || product.name}
                  referrerPolicy="no-referrer"
                  className="transition-transform duration-300 group-hover:scale-105"
                />

                {/* Badges Overlaid */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#D4AF37] text-neutral-950 shadow-md">
                    100% Genuine
                  </span>
                  {discountPercent > 0 && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-md">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Media Label Badge */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950/85 border border-neutral-700 text-xs font-semibold text-neutral-200 backdrop-blur-sm z-10 pointer-events-none">
                  {currentMedia.type === 'certificate' ? (
                    <Award className="w-4 h-4 text-emerald-400" />
                  ) : currentMedia.type === 'back' ? (
                    <Layers className="w-4 h-4 text-amber-400" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  )}
                  <span>{currentMedia.badge || currentMedia.title}</span>
                </div>
              </div>
            )}

            {/* Gallery Navigation Bar */}
            <div className="flex items-center justify-between px-1 text-xs text-neutral-400">
              <span className="font-semibold text-neutral-300">
                Gallery Views ({mediaGallery.length} Perspectives):
              </span>
              <span className="text-[#D4AF37] font-bold">
                {currentMedia.badge || currentMedia.title}
              </span>
            </div>

            {/* Thumbnail Container (8 Product Thumbnails with class="thumbnail" and onclick="changeImage(this.src, this)") */}
            <div className="thumbnail-container">
              {mediaGallery.slice(0, 8).map((item, idx) => {
                const isActive = activeMediaIndex === idx;
                return (
                  <img
                    key={item.id || idx}
                    id={`product-thumbnail-${idx + 1}`}
                    src={item.url}
                    alt={item.title}
                    title={`${item.title} (${item.badge})`}
                    referrerPolicy="no-referrer"
                    className={`thumbnail ${isActive ? 'active' : ''}`}
                    onClick={(e) => changeImage(item.url, e.currentTarget, idx)}
                    ref={(el) => {
                      if (el) {
                        el.setAttribute('onclick', 'changeImage(this.src, this)');
                      }
                    }}
                  />
                );
              })}
            </div>

            {/* View All 8 Views in Lightbox CTA */}
            <button
              type="button"
              id="view-all-8-views-btn"
              onClick={() => setAllViewsModalOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-[#D4AF37] text-xs font-bold text-[#D4AF37] flex items-center justify-center gap-2 transition-all shadow-md group"
            >
              <Grid className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span>View All 8 High-Res Angles &amp; Lab Reports</span>
            </button>

            {/* Quick Report Inspection Action Buttons */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 px-1">
                <span className="uppercase tracking-wider">Official Inspection Reports</span>
                <span className="text-emerald-400 font-semibold">100% Verified</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  id="btn-report-nutrition"
                  onClick={() => {
                    setActiveTab('nutrition');
                    const nutSvg = generateNutritionReportSVG(product);
                    setFullScreenModal({
                      isOpen: true,
                      title: `${product.name} - Official Nutrition Facts & Assay Report`,
                      src: nutSvg,
                      type: 'nutrition'
                    });
                  }}
                  className="p-2.5 rounded-xl bg-blue-950/30 hover:bg-blue-900/50 border border-blue-800/60 text-blue-300 text-[11px] font-bold flex flex-col items-center justify-center gap-1.5 transition-all text-center hover:shadow-lg"
                >
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Nutrition Facts</span>
                </button>

                <button
                  type="button"
                  id="btn-report-amino"
                  onClick={() => {
                    setActiveTab('amino');
                    const aminoSvg = generateAminoProfileSVG(product);
                    setFullScreenModal({
                      isOpen: true,
                      title: `${product.name} - Full Spectrum Amino Acid Profile Report`,
                      src: aminoSvg,
                      type: 'amino'
                    });
                  }}
                  className="p-2.5 rounded-xl bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-800/60 text-cyan-300 text-[11px] font-bold flex flex-col items-center justify-center gap-1.5 transition-all text-center hover:shadow-lg"
                >
                  <Dna className="w-4 h-4 text-cyan-400" />
                  <span>Amino Profile</span>
                </button>

                <button
                  type="button"
                  id="btn-report-back-panel"
                  onClick={() => {
                    setActiveTab('back');
                    const backSvg = generateBackNutritionLabelSVG(product);
                    setFullScreenModal({
                      isOpen: true,
                      title: `${product.name} - Authentic Back Panel Packaging Label`,
                      src: backSvg,
                      type: 'back'
                    });
                  }}
                  className="p-2.5 rounded-xl bg-amber-950/30 hover:bg-amber-900/50 border border-amber-800/60 text-amber-300 text-[11px] font-bold flex flex-col items-center justify-center gap-1.5 transition-all text-center hover:shadow-lg"
                >
                  <Package className="w-4 h-4 text-amber-400" />
                  <span>Back Panel Pic</span>
                </button>

                <button
                  type="button"
                  id="btn-report-nabl-coa"
                  onClick={() => {
                    setActiveTab('certificate');
                    const certSvg = generateCertificateSVG(product);
                    setFullScreenModal({
                      isOpen: true,
                      title: `${product.name} - Third-Party NABL Accredited COA Report`,
                      src: certSvg,
                      type: 'certificate'
                    });
                  }}
                  className="p-2.5 rounded-xl bg-emerald-950/30 hover:bg-emerald-900/50 border border-emerald-800/60 text-emerald-300 text-[11px] font-bold flex flex-col items-center justify-center gap-1.5 transition-all text-center hover:shadow-lg"
                >
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>NABL Certificate</span>
                </button>
              </div>
            </div>

            {/* Quick Guarantees bar below thumbnails */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] mb-1" />
                <span className="text-[11px] font-bold text-white">Direct Gohana Dispatch</span>
                <span className="text-[9px] text-neutral-400">Zero Middlemen</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col items-center justify-center">
                <Award className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="text-[11px] font-bold text-white">NABL Certified</span>
                <span className="text-[9px] text-neutral-400">Tested Accuracy</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col items-center justify-center">
                <RotateCw className="w-4 h-4 text-amber-400 mb-1" />
                <span className="text-[11px] font-bold text-white">Full 360° View</span>
                <span className="text-[9px] text-neutral-400">Move All Directions</span>
              </div>
            </div>
          </div>

          {/* Right Side: Product Details */}
          <div className="product-details">
            {/* Title & Subtitle */}
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                <span className="font-bold text-[#D4AF37] uppercase tracking-wider">{product.category}</span>
                <span>SKU: {product.sku}</span>
              </div>
              
              <h1 className="product-title">{product.name}</h1>
              <p className="product-subtitle">{selectedFlavour} - {selectedSize}</p>
            </div>

            {/* Ratings & Stock Status */}
            <div className="ratings">
              <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-black text-white">{product.rating} ★</span>
              </div>
              <span className="text-neutral-600">|</span>
              <span className="text-neutral-400 text-xs">{product.reviewCount} Reviews</span>
              <span className="text-neutral-600">|</span>
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>In Stock ({product.stockQuantity} ready)</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="price-section">
              <span className="current-price">₹{activePrice.toLocaleString('en-IN')}</span>
              {activeRegular > activePrice && (
                <span className="original-price">₹{activeRegular.toLocaleString('en-IN')}</span>
              )}
              {discountPercent > 0 && (
                <span className="discount">{discountPercent}% off</span>
              )}
              <span className="text-xs text-neutral-400 font-medium block sm:inline w-full sm:w-auto">
                Inclusive of all Indian taxes (GST)
              </span>
            </div>

            {/* Description & Formula Highlights Card */}
            <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Product Overview &amp; Description</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('description');
                    const el = document.getElementById('product-technical-tabs');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-[11px] text-[#D4AF37] hover:underline font-semibold flex items-center gap-0.5"
                >
                  <span>Read Full Science</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                {product.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-neutral-800/80 text-center">
                <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800/80">
                  <div className="text-[10px] text-neutral-400 font-medium">Protein / Scoop</div>
                  <div className="text-xs font-black text-[#D4AF37] mt-0.5">{product.proteinPerServing || '28.0g'}</div>
                </div>
                <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800/80">
                  <div className="text-[10px] text-neutral-400 font-medium">BCAAs Content</div>
                  <div className="text-xs font-black text-white mt-0.5">5.64g</div>
                </div>
                <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800/80">
                  <div className="text-[10px] text-neutral-400 font-medium">Added Sugar</div>
                  <div className="text-xs font-black text-emerald-400 mt-0.5">0.0g Zero</div>
                </div>
                <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800/80">
                  <div className="text-[10px] text-neutral-400 font-medium">QC Assay</div>
                  <div className="text-xs font-black text-blue-400 mt-0.5">NABL 100%</div>
                </div>
              </div>
            </div>

            {/* Variant Selection: Choose your protein / formulation */}
            <div className="variants">
              <h3>Choose your {product.category === 'Whey Protein' ? 'protein' : 'formulation'}</h3>
              <div className="variant-grid">
                {formulationOptions.map((opt) => {
                  const isSelected = selectedFormulation === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedFormulation(opt.id)}
                      className={`variant-option ${isSelected ? 'selected' : ''}`}
                    >
                      <strong>{opt.title}</strong>
                      <p>{opt.subtitle}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Flavour Selector Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                <span>Flavour: <strong className="text-white">{selectedFlavour}</strong></span>
              </label>
              <div className="flex flex-wrap gap-2">
                {[product.flavour, ...(product.variants ? product.variants.map(v => v.flavour).filter(f => f !== product.flavour) : [])].map(fl => (
                  <button
                    key={fl}
                    onClick={() => setSelectedFlavour(fl)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedFlavour === fl
                        ? 'bg-[#D4AF37] text-neutral-950 font-bold border-[#D4AF37] shadow-md'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {fl}
                  </button>
                ))}
              </div>
            </div>

            {/* Size / Pack Selector Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                <span>Size / Pack: <strong className="text-white">{selectedSize}</strong></span>
              </label>
              <div className="flex flex-wrap gap-2">
                {[product.weightOrPackSize, ...(product.variants ? product.variants.map(v => v.size).filter(s => s !== product.weightOrPackSize) : [])].map(sz => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedSize === sz
                        ? 'bg-[#D4AF37] text-neutral-950 font-bold border-[#D4AF37] shadow-md'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Main Action CTAs */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center bg-neutral-900 border border-neutral-700 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-neutral-400 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-9 text-center text-sm font-bold text-white">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-neutral-400 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Wishlist & Compare Icons */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-xl border transition-colors ${
                    isFav ? 'bg-red-600 text-white border-red-600' : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:text-white'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
                <button
                  type="button"
                  onClick={() => addToCompare(product)}
                  className={`p-3.5 rounded-xl border transition-colors ${
                    inComp ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:text-white'
                  }`}
                  title="Add to Comparison"
                >
                  <Scale className="w-4 h-4" />
                </button>
              </div>

              {/* User-requested Action Buttons (.action-buttons, .btn, .add-to-cart, .buy-now) */}
              <div className="action-buttons">
                <button 
                  id="pdp-add-to-cart-btn"
                  className="btn add-to-cart flex items-center justify-center gap-2"
                  onClick={() => addToCart(product, selectedFlavour, selectedSize, quantity)}
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  <span>ADD TO CART</span>
                </button>
                <button 
                  id="pdp-buy-now-btn"
                  className="btn buy-now flex items-center justify-center gap-2"
                  onClick={() => {
                    const added = addToCart(product, selectedFlavour, selectedSize, quantity);
                    if (added) {
                      navigate('checkout');
                    }
                  }}
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>BUY NOW</span>
                </button>
              </div>
            </div>

            {/* Indian Pincode Delivery Estimator */}
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3 mt-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>Check Delivery Time &amp; COD Availability</span>
              </div>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit PIN code (e.g. 131301)"
                  className="flex-1 bg-neutral-950 text-white text-xs px-3 py-2.5 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  disabled={pincodeLoading}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors"
                >
                  {pincodeLoading ? 'Checking...' : 'Check'}
                </button>
              </form>

              {pincodeResult && (
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Delivery Available to {pincodeResult.state} ({pincodeResult.pincode})</span>
                  </div>
                  <div className="text-neutral-300">
                    Estimated Time: <strong>{pincodeResult.estimatedDays}</strong> via Express Courier
                  </div>
                  <div className="text-neutral-400 text-[11px]">
                    Direct dispatch from: {pincodeResult.dispatchedFrom} • Cash on Delivery: Available
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Technical Documentation & Testing Dossier Tabs */}
        <div id="product-technical-tabs" className="border-t border-neutral-800 pt-10 space-y-8">
          {/* Tab Navigation Header */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-800 no-scrollbar">
            <button
              type="button"
              id="tab-btn-nutrition"
              onClick={() => setActiveTab('nutrition')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 border transition-all ${
                activeTab === 'nutrition'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Nutrition Facts &amp; Lab Assay</span>
            </button>

            <button
              type="button"
              id="tab-btn-amino"
              onClick={() => setActiveTab('amino')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 border transition-all ${
                activeTab === 'amino'
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-500/20'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <Dna className="w-4 h-4" />
              <span>Amino Acid Profile</span>
            </button>

            <button
              type="button"
              id="tab-btn-back"
              onClick={() => setActiveTab('back')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 border transition-all ${
                activeTab === 'back'
                  ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-500/20'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Pic of Back Panel</span>
            </button>

            <button
              type="button"
              id="tab-btn-certificate"
              onClick={() => setActiveTab('certificate')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 border transition-all ${
                activeTab === 'certificate'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>NABL Certificate (COA)</span>
            </button>

            <button
              type="button"
              id="tab-btn-description"
              onClick={() => setActiveTab('description')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 border transition-all ${
                activeTab === 'description'
                  ? 'bg-[#D4AF37] text-neutral-950 border-[#D4AF37] shadow-lg shadow-amber-500/20'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Full Description &amp; Science</span>
            </button>

            <button
              type="button"
              id="tab-btn-reviews"
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 border transition-all ${
                activeTab === 'reviews'
                  ? 'bg-neutral-100 text-neutral-950 border-white'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Customer Reviews ({reviews.length})</span>
            </button>
          </div>

          {/* TAB 1: NUTRITION FACTS & LAB ASSAY */}
          {activeTab === 'nutrition' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-blue-950/20 border border-blue-900/40">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <span>Official Nutrition Facts &amp; Lab Assay Verification</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Batch: <span className="text-amber-400 font-mono font-bold">{product.batchNumber || 'RND-2026-B88'}</span> • Direct NABL Laboratory Test Report for declared versus actual verified nutrient content.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const svg = generateNutritionReportSVG(product);
                      setFullScreenModal({
                        isOpen: true,
                        title: `${product.name} - Official Nutrition Facts & Assay Report`,
                        src: svg,
                        type: 'nutrition'
                      });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Full Report (High-Res)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Declared Supplement Facts Table */}
                <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wider text-white">Supplement Facts (Declared)</h4>
                      <p className="text-[11px] text-neutral-400">Serving Size: 1 Scoop (30g) • {product.servings} Servings</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-neutral-800 text-[11px] text-[#D4AF37] font-bold">
                      FSSAI Compliant
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-neutral-800/80 font-bold text-white">
                      <span>Nutrient Parameter</span>
                      <span>Per Serving (30g)</span>
                    </div>
                    {product.nutritionInfo ? (
                      Object.entries(product.nutritionInfo).map(([key, val]) => (
                        <div key={key} className="flex justify-between py-1.5 border-b border-neutral-800/50 text-neutral-300">
                          <span className="capitalize">{key}</span>
                          <strong className="text-white">{String(val)}</strong>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex justify-between py-1.5 border-b border-neutral-800/50 text-neutral-300">
                          <span>Energy / Calories</span>
                          <strong className="text-white">118.0 kcal</strong>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-neutral-800/50 text-neutral-300">
                          <span>Protein</span>
                          <strong className="text-[#D4AF37] font-bold">{product.proteinPerServing || '28.0g'}</strong>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-neutral-800/50 text-neutral-300">
                          <span>Total Fats</span>
                          <strong className="text-white">0.40g</strong>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-neutral-800/50 text-neutral-300">
                          <span>Total Carbohydrates</span>
                          <strong className="text-white">0.80g</strong>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-neutral-800/50 text-neutral-300">
                          <span>Added Sugars</span>
                          <strong className="text-emerald-400">0.00g (Zero Added Sugar)</strong>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between py-1.5 border-b border-neutral-800/50 text-neutral-300">
                      <span>DigeZyme Multi-Enzyme Complex</span>
                      <strong className="text-cyan-400">50 mg</strong>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-neutral-400">
                    <strong className="text-white block mb-1">Key Formulation Ingredients:</strong>
                    <p className="leading-relaxed">{product.ingredients}</p>
                  </div>
                </div>

                {/* Laboratory Tested vs Declared Verification Table */}
                <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wider text-white">NABL Tested vs. Declared Assay</h4>
                      <p className="text-[11px] text-emerald-400 font-semibold">ISO/IEC 17025 Certified Chemical Analysis</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-950 border border-emerald-800 text-[11px] text-emerald-400 font-bold">
                      100% Passed
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-neutral-800 text-neutral-400 text-[10px] uppercase font-bold">
                          <th className="py-2 pr-2">Parameter</th>
                          <th className="py-2 px-2">Declared</th>
                          <th className="py-2 px-2">Lab Tested</th>
                          <th className="py-2 pl-2 text-right">Result</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/50 text-neutral-300">
                        <tr>
                          <td className="py-2 pr-2 font-semibold text-white">Crude Protein</td>
                          <td className="py-2 px-2">{product.proteinPerServing || '28.0g'}</td>
                          <td className="py-2 px-2 text-amber-400 font-mono font-bold">28.42g</td>
                          <td className="py-2 pl-2 text-right text-emerald-400 font-bold">101.5% PASS</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-2 font-semibold text-white">Total Fats</td>
                          <td className="py-2 px-2">0.40g</td>
                          <td className="py-2 px-2 font-mono">0.38g</td>
                          <td className="py-2 pl-2 text-right text-emerald-400 font-bold">PASSED</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-2 font-semibold text-white">Carbohydrates</td>
                          <td className="py-2 px-2">0.80g</td>
                          <td className="py-2 px-2 font-mono">0.74g</td>
                          <td className="py-2 pl-2 text-right text-emerald-400 font-bold">PASSED</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-2 font-semibold text-white">Added Sugars</td>
                          <td className="py-2 px-2">0.00g</td>
                          <td className="py-2 px-2 font-mono">&lt; 0.05g</td>
                          <td className="py-2 pl-2 text-right text-emerald-400 font-bold">ZERO SUGAR</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-2 font-semibold text-white">Caloric Value</td>
                          <td className="py-2 px-2">118.0 kcal</td>
                          <td className="py-2 px-2 font-mono">118.2 kcal</td>
                          <td className="py-2 pl-2 text-right text-emerald-400 font-bold">100.2% PASS</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-2 font-semibold text-white">Moisture Content</td>
                          <td className="py-2 px-2">&lt; 5.0%</td>
                          <td className="py-2 px-2 font-mono">3.65%</td>
                          <td className="py-2 pl-2 text-right text-emerald-400 font-bold">PASSED</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-2 font-semibold text-white">Melamine / Spiking</td>
                          <td className="py-2 px-2">0.00%</td>
                          <td className="py-2 px-2 font-mono">Negative</td>
                          <td className="py-2 pl-2 text-right text-emerald-400 font-bold">100% PURE</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-[11px] text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Tested by Govt Accredited Central QC Laboratory under NABL Certificate ISO/IEC 17025.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AMINO ACID PROFILE REPORT */}
          {activeTab === 'amino' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-cyan-950/20 border border-cyan-900/40">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                    <Dna className="w-5 h-5 text-cyan-400" />
                    <span>Clinical Amino Acid Profile (HPLC Verified)</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Complete spectrum of Essential Amino Acids (EAAs) and BCAAs per 30g scoop. Verified 100% free of amino spiking.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const svg = generateAminoProfileSVG(product);
                      setFullScreenModal({
                        isOpen: true,
                        title: `${product.name} - Full Spectrum Amino Acid Profile Report`,
                        src: svg,
                        type: 'amino'
                      });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Full Profile (High-Res)</span>
                  </button>
                </div>
              </div>

              {/* Zero Amino Spiking Banner */}
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Total BCAAs</div>
                  <div className="text-xl font-black text-cyan-400 mt-0.5">6.14 g</div>
                  <div className="text-[10px] text-neutral-400">Leucine, Isoleucine, Valine</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Total EAAs</div>
                  <div className="text-xl font-black text-[#D4AF37] mt-0.5">13.12 g</div>
                  <div className="text-[10px] text-neutral-400">Full Essential Matrix</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Zero Spiking Test</div>
                  <div className="text-xl font-black text-emerald-400 mt-0.5">0.00% PASS</div>
                  <div className="text-[10px] text-neutral-400">No Free Glycine or Taurine</div>
                </div>
              </div>

              {/* Detailed Breakdown Tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* EAAs Table */}
                <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                  <h4 className="text-sm font-black uppercase tracking-wider text-cyan-400 border-b border-neutral-800 pb-2">
                    Essential Amino Acids (EAAs) per Scoop
                  </h4>
                  <div className="divide-y divide-neutral-800/60 text-xs">
                    <div className="flex justify-between py-2 text-neutral-300">
                      <span>L-Leucine (BCAA - Anabolic Trigger)</span>
                      <strong className="text-white font-mono">3,120 mg</strong>
                    </div>
                    <div className="flex justify-between py-2 text-neutral-300">
                      <span>L-Isoleucine (BCAA)</span>
                      <strong className="text-white font-mono">1,540 mg</strong>
                    </div>
                    <div className="flex justify-between py-2 text-neutral-300">
                      <span>L-Valine (BCAA)</span>
                      <strong className="text-white font-mono">1,480 mg</strong>
                    </div>
                    <div className="flex justify-between py-2 text-neutral-300">
                      <span>L-Lysine</span>
                      <strong className="text-white font-mono">2,620 mg</strong>
                    </div>
                    <div className="flex justify-between py-2 text-neutral-300">
                      <span>L-Threonine</span>
                      <strong className="text-white font-mono">1,940 mg</strong>
                    </div>
                    <div className="flex justify-between py-2 text-neutral-300">
                      <span>L-Phenylalanine</span>
                      <strong className="text-white font-mono">860 mg</strong>
                    </div>
                    <div className="flex justify-between py-2 text-neutral-300">
                      <span>L-Methionine</span>
                      <strong className="text-white font-mono">610 mg</strong>
                    </div>
                    <div className="flex justify-between py-2 text-neutral-300">
                      <span>L-Histidine</span>
                      <strong className="text-white font-mono">490 mg</strong>
                    </div>
                    <div className="flex justify-between py-2 text-neutral-300">
                      <span>L-Tryptophan</span>
                      <strong className="text-white font-mono">460 mg</strong>
                    </div>
                  </div>
                </div>

                {/* Non-Essential / Conditionally Essential */}
                <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                  <h4 className="text-sm font-black uppercase tracking-wider text-neutral-300 border-b border-neutral-800 pb-2">
                    Conditionally Essential &amp; Supporting Aminos
                  </h4>
                  <div className="divide-y divide-neutral-800/60 text-xs">
                    <div className="flex justify-between py-2 text-neutral-300">
                      <span>L-Glutamic Acid + Glutamine (Recovery)</span>
                      <strong className="text-[#D4AF37] font-mono">4,920 mg</strong>
                    </div>
                    <div className="flex justify-between py-2 text-neutral-300">
                      <span>L-Aspartic Acid</span>
                      <strong className="text-white font-mono">2,980 mg</strong>
                    </div>
                    <div className="flex justify-between py-2 text-neutral-300">
                      <span>L-Proline</span>
                      <strong className="text-white font-mono">1,620 mg</strong>
                    </div>
                    <div className="flex justify-between py-2 text-neutral-300">
                      <span>L-Alanine</span>
                      <strong className="text-white font-mono">1,410 mg</strong>
                    </div>
                    <div className="flex justify-between py-2 text-neutral-300">
                      <span>L-Serine</span>
                      <strong className="text-white font-mono">1,280 mg</strong>
                    </div>
                    <div className="flex justify-between py-2 text-neutral-300">
                      <span>L-Arginine (Nitric Oxide Precursor)</span>
                      <strong className="text-white font-mono">680 mg</strong>
                    </div>
                    <div className="flex justify-between py-2 text-neutral-300">
                      <span>L-Tyrosine</span>
                      <strong className="text-white font-mono">810 mg</strong>
                    </div>
                    <div className="flex justify-between py-2 text-neutral-300">
                      <span>L-Cysteine</span>
                      <strong className="text-white font-mono">640 mg</strong>
                    </div>
                    <div className="flex justify-between py-2 text-neutral-300">
                      <span>Glycine (Naturally Occurring in Whey)</span>
                      <strong className="text-white font-mono">470 mg</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PIC OF BACK PANEL LABEL */}
          {activeTab === 'back' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-amber-950/20 border border-amber-900/40">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-amber-400" />
                    <span>Direct Packaging Back Panel (High-Resolution Visual)</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Authentic production back panel label as printed on containers dispatched from the Gohana Facility.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const svg = generateBackNutritionLabelSVG(product);
                      setFullScreenModal({
                        isOpen: true,
                        title: `${product.name} - Authentic Back Panel Packaging Label`,
                        src: svg,
                        type: 'back'
                      });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Full Label (Fullscreen)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Visual Label Preview */}
                <div 
                  className="lg:col-span-6 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col items-center justify-center group cursor-pointer hover:border-amber-500/50 transition-colors"
                  onClick={() => {
                    const svg = generateBackNutritionLabelSVG(product);
                    setFullScreenModal({
                      isOpen: true,
                      title: `${product.name} - Authentic Back Panel Packaging Label`,
                      src: svg,
                      type: 'back'
                    });
                  }}
                >
                  <img
                    src={generateBackNutritionLabelSVG(product)}
                    alt={`${product.name} Back Panel`}
                    referrerPolicy="no-referrer"
                    className="max-h-[500px] w-auto object-contain rounded-lg shadow-xl group-hover:scale-[1.02] transition-transform"
                  />
                  <span className="text-xs text-amber-400 font-bold mt-3 flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Click to Enlarge &amp; Zoom Details</span>
                  </span>
                </div>

                {/* Regulatory & Manufacturing Details */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-wider text-white border-b border-neutral-800 pb-2">
                      Statutory Regulatory Declarations
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold">Manufactured &amp; Marketed By:</span>
                        <strong className="text-white block mt-0.5">RND Sports Nutrition Pvt. Ltd.</strong>
                        <p className="text-neutral-300 text-[11px] mt-0.5">Industrial Area, Gohana, Sonipat, Haryana - 131301, India</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
                        <div>
                          <span className="text-neutral-400 block text-[10px] uppercase font-bold">FSSAI Central License:</span>
                          <strong className="text-emerald-400 font-mono text-xs mt-0.5 block">10824005000123</strong>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[10px] uppercase font-bold">Country of Origin:</span>
                          <strong className="text-white text-xs mt-0.5 block">100% Made in India</strong>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
                        <div>
                          <span className="text-neutral-400 block text-[10px] uppercase font-bold">Customer Helpline:</span>
                          <strong className="text-white text-xs mt-0.5 block">+91 9306667128</strong>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[10px] uppercase font-bold">Official Email:</span>
                          <strong className="text-[#D4AF37] text-xs mt-0.5 block">ramannarwal56@gmail.com</strong>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-800">
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold">Vegetarian Symbol &amp; Allergen Statement:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-4 h-4 border-2 border-emerald-500 flex items-center justify-center rounded-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          </span>
                          <span className="text-[11px] text-white font-semibold">100% Vegetarian Product</span>
                        </div>
                        <p className="text-neutral-400 text-[11px] mt-1 leading-relaxed">
                          Contains Milk and Soy Lecithin (for instant mixing). Manufactured in a facility that also processes almonds and tree nuts.
                        </p>
                      </div>

                      <div className="pt-2 border-t border-neutral-800">
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold">Storage Advisory:</span>
                        <p className="text-neutral-300 text-[11px] mt-1 leading-relaxed">
                          Store in a cool, dry place away from direct sunlight &amp; moisture. Keep container tightly closed after each use. Do not use wet scoops.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NABL LAB CERTIFICATE (COA) */}
          {activeTab === 'certificate' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-400" />
                    <span>NABL Accredited Certificate of Analysis (COA)</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Independent laboratory verification confirming accurate protein potency and zero heavy metal contamination.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const svg = generateCertificateSVG(product);
                      setFullScreenModal({
                        isOpen: true,
                        title: `${product.name} - Third-Party NABL Accredited COA Report`,
                        src: svg,
                        type: 'certificate'
                      });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Full Certificate (High-Res)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Visual Certificate Preview */}
                <div 
                  className="lg:col-span-6 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col items-center justify-center group cursor-pointer hover:border-emerald-500/50 transition-colors"
                  onClick={() => {
                    const svg = generateCertificateSVG(product);
                    setFullScreenModal({
                      isOpen: true,
                      title: `${product.name} - Third-Party NABL Accredited COA Report`,
                      src: svg,
                      type: 'certificate'
                    });
                  }}
                >
                  <img
                    src={generateCertificateSVG(product)}
                    alt={`${product.name} COA Certificate`}
                    referrerPolicy="no-referrer"
                    className="max-h-[500px] w-auto object-contain rounded-lg shadow-xl group-hover:scale-[1.02] transition-transform"
                  />
                  <span className="text-xs text-emerald-400 font-bold mt-3 flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Click to Enlarge &amp; Verify Signatures</span>
                  </span>
                </div>

                {/* Analytical Safety Assay Breakdown */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-wider text-white border-b border-neutral-800 pb-2">
                      Heavy Metals &amp; Microbial Safety Analysis
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                        <div className="text-[11px] font-bold text-emerald-400">Toxic Heavy Metals Clearance:</div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300">
                          <div>Lead (Pb): <strong className="text-emerald-400">&lt; 0.02 ppm</strong> (Safe)</div>
                          <div>Arsenic (As): <strong className="text-emerald-400">&lt; 0.01 ppm</strong> (Safe)</div>
                          <div>Cadmium (Cd): <strong className="text-emerald-400">&lt; 0.01 ppm</strong> (Safe)</div>
                          <div>Mercury (Hg): <strong className="text-emerald-400">&lt; 0.005 ppm</strong> (Safe)</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                        <div className="text-[11px] font-bold text-emerald-400">Microbiological Purity:</div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300">
                          <div>Total Plate Count: <strong className="text-white">&lt; 200 CFU/g</strong></div>
                          <div>Yeast &amp; Mould: <strong className="text-white">&lt; 50 CFU/g</strong></div>
                          <div>E. Coli: <strong className="text-emerald-400">Absent / 25g</strong></div>
                          <div>Salmonella: <strong className="text-emerald-400">Absent / 25g</strong></div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                        <div className="text-[11px] font-bold text-white">Direct Gohana Dispatch Verification:</div>
                        <p className="text-neutral-400 text-[11px] leading-relaxed">
                          Every container is sealed with tamper-evident ultrasonic heat induction foil and assigned a unique scratch authenticity code verified at rndsupplements.com/verify.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FULL DESCRIPTION & SCIENCE */}
          {activeTab === 'description' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                <div className="border-b border-neutral-800 pb-3">
                  <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                    <span>Product Science &amp; Full Description</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Engineered for high-performing Indian athletes seeking ultra-pure macronutrients without fillers.
                  </p>
                </div>

                <div className="prose prose-invert max-w-none text-xs text-neutral-300 leading-relaxed space-y-3">
                  <p>
                    {product.description}
                  </p>
                  <p>
                    Manufactured under rigorous current Good Manufacturing Practices (cGMP) in our state-of-the-art manufacturing facility in Gohana, Sonipat (Haryana). Unlike brands relying on third-party contract packers, RND oversees every batch in-house with zero middlemen, guaranteeing authentic batch fresh supplements directly to your doorstep.
                  </p>
                </div>

                {product.benefits && (
                  <div className="pt-4 border-t border-neutral-800 space-y-2">
                    <strong className="text-xs font-bold text-white uppercase tracking-wider block">
                      Core Functional Benefits:
                    </strong>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.benefits.map((b, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300">
                          <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Usage & Health Advisory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                    <span>Recommended Usage &amp; Timing</span>
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {product.usageInstructions}
                  </p>
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
                    <strong className="text-white block">Optimal Stacking Protocol:</strong>
                    <span>Mix 1 scoop with 200–250ml of chilled water or low-fat milk. Consume immediately post-workout or in the morning to jumpstart muscle protein synthesis.</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-900/60 border border-amber-500/30 text-xs text-neutral-300 space-y-3">
                  <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 text-[#D4AF37]" />
                    <span>Mandatory FSSAI Health Advisory</span>
                  </div>
                  <p className="leading-relaxed">
                    Food supplements are not medicines. Follow the product label and recommended daily intake. Do not exceed the stated recommended daily usage. Not intended for use by persons under 18 years of age. Consult a physician before starting any diet or exercise program if you have medical conditions.
                  </p>
                  <div className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-800">
                    Category: Health Supplements / Proprietary Foods (FSSAI Lic. 10824005000123).
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CUSTOMER REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white font-display">
                    Customer Ratings &amp; Reviews
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Authentic verified buyer feedback from powerlifters, bodybuilders, and athletes across India.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Reviews List */}
                <div className="lg:col-span-7 space-y-4">
                  {reviews.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 text-center space-y-2">
                      <Star className="w-8 h-8 text-neutral-600 mx-auto" />
                      <p>Be the first verified athlete to review this RND formulation!</p>
                    </div>
                  ) : (
                    reviews.map(rev => (
                      <div key={rev.id} className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <strong className="text-xs text-white">{rev.userName}</strong>
                            {rev.isVerifiedPurchase && (
                              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                                <CheckCircle2 className="w-3 h-3" />
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-500">{rev.date}</span>
                        </div>

                        <div className="flex items-center text-amber-400 text-xs">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-neutral-700'}`}
                            />
                          ))}
                        </div>

                        <p className="text-xs text-neutral-300 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Submit Review Form */}
                <div className="lg:col-span-5 p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Leave Verified Feedback</h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div>
                      <label className="text-xs text-neutral-400 block mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        placeholder={user?.fullName || "e.g. Aman Sharma"}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-neutral-400 block mb-1">Rating</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewReviewRating(star)}
                            className={`p-1 text-sm ${star <= newReviewRating ? 'text-amber-400' : 'text-neutral-600'}`}
                          >
                            <Star className="w-5 h-5 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-neutral-400 block mb-1">Your Experience &amp; Results</label>
                      <textarea
                        required
                        rows={3}
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Describe mixability, taste, digestion, recovery, and strength results..."
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="w-full py-2.5 rounded-xl bg-[#D4AF37] text-neutral-950 text-xs font-bold hover:bg-amber-400 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Review</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-neutral-800 pt-10 space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight text-white font-display">
              You May Also Need
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen High-Resolution Inspection Modal (Nutrition Label / NABL Certificate) */}
      {fullScreenModal && fullScreenModal.isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => setFullScreenModal(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[90vh] bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900/90">
              <div className="flex items-center gap-2">
                {fullScreenModal.type === 'certificate' ? (
                  <Award className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Layers className="w-5 h-5 text-[#D4AF37]" />
                )}
                <h3 className="text-sm sm:text-base font-bold text-white">{fullScreenModal.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setFullScreenModal(null)}
                className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[#07090e]">
              <img
                src={fullScreenModal.src}
                alt={fullScreenModal.title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-neutral-800 bg-neutral-900/90 flex items-center justify-between text-xs text-neutral-400">
              <span>{product.name} • Certified Genuine</span>
              <a
                href={fullScreenModal.src}
                download={`${product.slug}-${fullScreenModal.type}.svg`}
                className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold flex items-center gap-1 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* All 8 Views & Perspectives Lightbox Modal */}
      {allViewsModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => setAllViewsModalOpen(false)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[92vh] bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900/90">
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">All 8 Perspectives &amp; Official Reports</h3>
                  <p className="text-[11px] text-neutral-400">{product.name} • Click any view to zoom or switch main perspective</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAllViewsModalOpen(false)}
                className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of all 8 items */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#0a0d14]">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaGallery.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    onClick={() => {
                      setActiveMediaIndex(idx);
                      const thumb = document.getElementById(`product-thumbnail-${idx + 1}`);
                      changeImage(item.url, thumb || undefined, idx);
                      setAllViewsModalOpen(false);
                    }}
                    className={`group relative p-3 rounded-xl border bg-neutral-900/90 cursor-pointer transition-all hover:scale-[1.02] hover:border-[#D4AF37] ${
                      activeMediaIndex === idx ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-lg' : 'border-neutral-800'
                    }`}
                  >
                    <div className="aspect-square w-full rounded-lg overflow-hidden bg-neutral-950 flex items-center justify-center p-2 mb-2">
                      <img
                        src={item.url}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white truncate">{item.title}</span>
                      <span className="text-[10px] text-[#D4AF37] font-semibold whitespace-nowrap">{item.badge}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-neutral-800 bg-neutral-900/90 flex items-center justify-between text-xs text-neutral-400">
              <span>RND Sports Nutrition • Direct Gohana Quality Control</span>
              <button
                type="button"
                onClick={() => setAllViewsModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#D4AF37] text-neutral-950 font-bold hover:bg-amber-400 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
