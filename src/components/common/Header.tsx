import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Logo } from './Logo';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  User, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronDown, 
  ArrowRight,
  Phone,
  Scale,
  Settings as SettingsIcon,
  Flame,
  Zap,
  Dumbbell
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    cartCount, 
    wishlist, 
    compareList, 
    user, 
    isAdmin, 
    openFitGuide, 
    navigate, 
    currentRoute,
    settings 
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  const categories = [
    { name: 'Whey Protein', icon: Dumbbell, desc: 'Isolates & Blends for muscle growth' },
    { name: 'Creatine', icon: Zap, desc: 'Micronized monohydrate for strength' },
    { name: 'Pre-Workout', icon: Flame, desc: 'Explosive energy & skin-splitting pumps' },
    { name: 'Mass Gainer', icon: Dumbbell, desc: 'High calorie formulas for hardgainers' },
    { name: 'Fat Burner', icon: Flame, desc: 'Thermogenic matrix & metabolic support' },
    { name: 'Protein Bars', icon: Dumbbell, desc: '20g protein gourmet power snacks' },
    { name: 'Multivitamins', icon: ShieldCheck, desc: 'Daily micronutrients & joint care' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('shop', { search: searchQuery.trim() });
      setSearchBarOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 shadow-2xl">
      {/* Top Announcement Bar */}
      <div 
        id="rnd-top-announcement-bar"
        className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-300 text-xs py-2 px-4 border-b border-neutral-800/80"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
              100% GENUINE
            </span>
            <span className="text-xs text-neutral-300 font-medium">
              {settings.announcementText}
            </span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400 text-xs font-medium">
            <div className="hidden md:flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Direct Support: <strong className="text-white">9306667128</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Logo onClick={() => navigate('home')} />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              id="nav-link-home"
              onClick={() => navigate('home')}
              className={`px-3 py-2 text-sm font-semibold tracking-wide transition-colors ${
                currentRoute === 'home' ? 'text-[#D4AF37]' : 'text-neutral-300 hover:text-white'
              }`}
            >
              Home
            </button>

            <button
              id="nav-link-shop"
              onClick={() => navigate('shop')}
              className={`px-3 py-2 text-sm font-semibold tracking-wide transition-colors ${
                currentRoute === 'shop' ? 'text-[#D4AF37]' : 'text-neutral-300 hover:text-white'
              }`}
            >
              Shop All
            </button>

            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setCategoryDropdownOpen(true)}
              onMouseLeave={() => setCategoryDropdownOpen(false)}
            >
              <button
                id="nav-categories-dropdown-btn"
                className="flex items-center gap-1 px-3 py-2 text-sm font-semibold tracking-wide text-neutral-300 hover:text-white transition-colors"
              >
                <span>Categories</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>

              {categoryDropdownOpen && (
                <div 
                  id="categories-dropdown-menu"
                  className="absolute top-full left-0 w-80 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1.5 border-b border-neutral-800">
                    Supplement Categories
                  </div>
                  <div className="py-1">
                    {categories.map(cat => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.name}
                          onClick={() => {
                            navigate('shop', { category: cat.name });
                            setCategoryDropdownOpen(false);
                          }}
                          className="w-full flex items-start gap-3 p-2.5 rounded-lg text-left hover:bg-neutral-800/80 transition-colors group"
                        >
                          <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-[#D4AF37] group-hover:border-[#D4AF37] transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-neutral-200 group-hover:text-[#D4AF37] transition-colors">
                              {cat.name}
                            </div>
                            <div className="text-xs text-neutral-400">
                              {cat.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              id="nav-link-authenticity"
              onClick={() => navigate('authenticity')}
              className={`px-3 py-2 text-sm font-semibold tracking-wide transition-colors ${
                currentRoute === 'authenticity' ? 'text-[#D4AF37]' : 'text-neutral-300 hover:text-white'
              }`}
            >
              Verify Batch
            </button>

            <button
              id="nav-link-safety"
              onClick={() => navigate('safety')}
              className={`px-3 py-2 text-sm font-semibold tracking-wide transition-colors ${
                currentRoute === 'safety' ? 'text-[#D4AF37]' : 'text-neutral-300 hover:text-white'
              }`}
            >
              Safety & FSSAI
            </button>

            <button
              id="nav-link-blog"
              onClick={() => navigate('blog')}
              className={`px-3 py-2 text-sm font-semibold tracking-wide transition-colors ${
                currentRoute === 'blog' ? 'text-[#D4AF37]' : 'text-neutral-300 hover:text-white'
              }`}
            >
              Guides & Blog
            </button>
          </nav>

          {/* Action Icons & CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Shopping Assistant Button */}
            <button
              id="header-fitguide-ai-btn"
              onClick={openFitGuide}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-amber-600/20 via-[#D4AF37]/30 to-amber-500/20 border border-[#D4AF37]/60 text-amber-300 text-xs font-bold tracking-wide hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" style={{ animationDuration: '8s' }} />
              <span>AI Fit Guide</span>
            </button>

            {/* Search Toggle / Input */}
            <button
              id="header-search-toggle"
              onClick={() => setSearchBarOpen(!searchBarOpen)}
              className="p-2.5 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Search supplements"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Compare */}
            <button
              id="header-compare-btn"
              onClick={() => navigate('compare')}
              className="relative p-2.5 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Compare supplements"
            >
              <Scale className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <button
              id="header-wishlist-btn"
              onClick={() => navigate('wishlist')}
              className="relative p-2.5 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => navigate('cart')}
              className="relative p-2.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-200 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D4AF37] text-neutral-950 text-xs font-black flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Login */}
            <button
              id="header-user-btn"
              onClick={() => navigate(user ? 'account' : 'auth')}
              className="p-2.5 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title={user ? `Account: ${user.fullName}` : "Customer Login"}
            >
              <User className="w-5 h-5" />
            </button>

            {/* Admin Dashboard shortcut if admin */}
            {isAdmin && (
              <button
                id="header-admin-btn"
                onClick={() => navigate('admin')}
                className="p-2.5 rounded-full bg-amber-500/20 text-[#D4AF37] border border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-black transition-all"
                title="Admin Control Center"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              id="header-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Dropdown Live Search Bar */}
        {searchBarOpen && (
          <div className="py-3 border-t border-neutral-800 animate-in fade-in duration-200">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-neutral-400" />
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search whey isolate, creatine 200-mesh, pre-workout..."
                className="w-full bg-neutral-900 text-white pl-12 pr-28 py-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#D4AF37] text-sm"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-bold hover:bg-amber-400 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-navigation-drawer"
          className="lg:hidden fixed inset-x-0 top-[110px] bottom-0 bg-neutral-950/98 border-t border-neutral-800 p-6 overflow-y-auto z-50 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <button
              onClick={() => {
                openFitGuide();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-amber-600/20 to-[#D4AF37]/20 border border-[#D4AF37]/50 text-amber-300 font-bold text-sm"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>RND Fit Guide (AI Assistant)</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="space-y-1 pt-2">
              <div className="text-xs font-bold uppercase text-neutral-500 tracking-wider px-2">Navigation</div>
              {[
                { name: 'Home', route: 'home' },
                { name: 'Shop All Supplements', route: 'shop' },
                { name: 'Verify Batch Authenticity', route: 'authenticity' },
                { name: 'Supplement Safety & FSSAI', route: 'safety' },
                { name: 'Workout & Nutrition Blog', route: 'blog' },
                { name: 'Track Your Order', route: 'track' },
                { name: 'About RND', route: 'about' },
                { name: 'Contact & Support', route: 'contact' }
              ].map(item => (
                <button
                  key={item.route}
                  onClick={() => {
                    navigate(item.route);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-neutral-200 font-medium hover:bg-neutral-900 hover:text-[#D4AF37]"
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="space-y-1 pt-2 border-t border-neutral-800">
              <div className="text-xs font-bold uppercase text-neutral-500 tracking-wider px-2">Categories</div>
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => {
                    navigate('shop', { category: cat.name });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-300 hover:bg-neutral-900 hover:text-[#D4AF37]"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-800 space-y-3">
            <div className="text-xs text-neutral-400">
              Direct Support: <strong className="text-white">9306667128</strong>
            </div>
            <button
              onClick={() => {
                navigate(user ? 'account' : 'auth');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-bold text-sm"
            >
              {user ? `Account (${user.fullName})` : 'Customer Login / Register'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
