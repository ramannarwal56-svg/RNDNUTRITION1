import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, UserProfile, StoreSettings, Order } from '../types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface StoreContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, flavour?: string, size?: string, quantity?: number) => boolean;
  removeFromCart: (productId: string, flavour?: string, size?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, flavour?: string, size?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Comparison
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;

  // User Auth
  user: UserProfile | null;
  userToken: string | null;
  loginUser: (user: UserProfile, token: string) => void;
  logoutUser: () => void;
  updateUserProfile: (updated: Partial<UserProfile>) => Promise<void>;
  sendEmailOtp: (email: string) => Promise<any>;
  loginWithEmail: (email: string, otp: string) => Promise<any>;

  // Admin Auth
  isAdmin: boolean;
  adminToken: string | null;
  loginAdmin: (token: string) => void;
  logoutAdmin: () => void;

  // Store Settings
  settings: StoreSettings;
  updateSettings: (newSettings: StoreSettings) => void;
  refreshSettings: () => Promise<void>;

  // Fit Guide AI modal
  isFitGuideOpen: boolean;
  openFitGuide: () => void;
  closeFitGuide: () => void;

  // Global Auth modal
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Navigation route state
  currentRoute: string;
  routeParams: Record<string, string>;
  navigate: (route: string, params?: Record<string, string>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "RND Sports Nutrition",
  businessLocation: "Gohana, Sonipat, Haryana, India",
  phone: "9306667128",
  whatsapp: "9306667128",
  email: "ramannarwal56@gmail.com",
  upiId: "9306667128@fam",
  upiPayeeName: "Raman",
  announcementText: "Authentic Fitness Nutrition Delivered Across India | 100% Genuine Formulations",
  heroHeadline: "Fuel Your Strength. Build Your RND.",
  heroSubheadline: "Premium sports nutrition for serious training, better recovery, and everyday performance across India.",
  freeShippingThreshold: 999,
  flatShippingRate: 99,
  codEnabled: true,
  gstRate: 0.18,
  fssaiNumberPlaceholder: "10824005000123 (Demo)"
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('rnd_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rnd_wishlist');
      return saved ? JSON.parse(saved) : ["rnd-whey-isolate"];
    } catch {
      return [];
    }
  });

  // Compare state
  const [compareList, setCompareList] = useState<Product[]>([]);

  // User auth state
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('rnd_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [userToken, setUserToken] = useState<string | null>(() => {
    return localStorage.getItem('rnd_user_token') || null;
  });

  // Admin auth state
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('rnd_admin_token') || null;
  });
  const isAdmin = Boolean(adminToken);

  // Settings
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);

  // UI States
  const [isFitGuideOpen, setIsFitGuideOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Simple client routing state
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      localStorage.setItem('rnd_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn("Storage sync error:", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('rnd_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn("Storage sync error:", e);
    }
  }, [wishlist]);

  // Fetch store settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.warn("Failed to fetch settings, using defaults:", err);
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const sendEmailOtp = async (email: string) => {
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      return data;
    } else {
      const text = await res.text();
      console.error("Server returned non-JSON response:", text);
      throw new Error("A server error occurred. Please try again later.");
    }
  };

  const loginWithEmail = async (email: string, otp: string) => {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid OTP');
    loginUser(data.user, data.token);
    return data;
  };

  const addToCart = (product: Product, flavour?: string, size?: string, quantity: number = 1): boolean => {
    const chosenFlavour = flavour || product.flavour;
    const chosenSize = size || product.weightOrPackSize;
    let chosenPrice = product.salePrice;

    if (size) {
      const variant = product.variants?.find(v => v.size === size);
      if (variant && variant.salePrice) {
        chosenPrice = variant.salePrice;
      }
    }

    setCart(prev => {
      const existingIdx = prev.findIndex(item => 
        item.productId === product.id && 
        item.selectedFlavour === chosenFlavour && 
        item.selectedSize === chosenSize
      );

      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          productId: product.id,
          product,
          selectedFlavour: chosenFlavour,
          selectedSize: chosenSize,
          quantity,
          price: chosenPrice
        }];
      }
    });

    showToast(`Added ${product.name} (${chosenSize}) to cart!`, 'success');
    return true;
  };

  const removeFromCart = (productId: string, flavour?: string, size?: string) => {
    setCart(prev => prev.filter(item => {
      const match = item.productId === productId &&
        (!flavour || item.selectedFlavour === flavour) &&
        (!size || item.selectedSize === size);
      return !match;
    }));
    showToast("Item removed from cart.", "info");
  };

  const updateCartQuantity = (productId: string, quantity: number, flavour?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, flavour, size);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.productId === productId && 
          (!flavour || item.selectedFlavour === flavour) && 
          (!size || item.selectedSize === size)) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('rnd_cart');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast("Removed from wishlist", "info");
        return prev.filter(id => id !== productId);
      } else {
        showToast("Added to wishlist", "success");
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const addToCompare = (product: Product) => {
    setCompareList(prev => {
      if (prev.some(p => p.id === product.id)) {
        showToast(`${product.name} is already in comparison table`, 'info');
        return prev;
      }
      if (prev.length >= 4) {
        showToast("You can compare up to 4 products at a time", 'warning');
        return prev;
      }
      showToast(`Added ${product.name} to comparison`, 'success');
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
    showToast("Removed from comparison", "info");
  };

  const isInCompare = (productId: string) => compareList.some(p => p.id === productId);

  const loginUser = (newUser: UserProfile, token: string) => {
    setUser(newUser);
    setUserToken(token);
    localStorage.setItem('rnd_user', JSON.stringify(newUser));
    localStorage.setItem('rnd_user_token', token);
    showToast(`Welcome back, ${newUser.fullName}!`, 'success');
  };

  const logoutUser = () => {
    setUser(null);
    setUserToken(null);
    localStorage.removeItem('rnd_user');
    localStorage.removeItem('rnd_user_token');
    showToast("Logged out successfully", "info");
  };

  const updateUserProfile = async (updated: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, ...updated })
      });
      if (res.ok) {
        const saved = await res.json();
        setUser(saved);
        localStorage.setItem('rnd_user', JSON.stringify(saved));
        showToast("Profile updated successfully", "success");
      }
    } catch (e) {
      showToast("Failed to update profile", "error");
    }
  };

  const loginAdmin = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('rnd_admin_token', token);
    showToast("Welcome to RND Admin Portal", "success");
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    localStorage.removeItem('rnd_admin_token');
    showToast("Admin session ended", "info");
  };

  const navigate = (route: string, params: Record<string, string> = {}) => {
    let targetRoute = route;
    const targetParams: Record<string, string> = { ...params };

    if (route === 'shipping-policy') {
      targetRoute = 'legal';
      targetParams.policy = 'shipping';
    } else if (route === 'return-policy') {
      targetRoute = 'legal';
      targetParams.policy = 'refund';
    } else if (route === 'terms') {
      targetRoute = 'legal';
      targetParams.policy = 'terms';
    } else if (route === 'privacy-policy') {
      targetRoute = 'legal';
      targetParams.policy = 'privacy';
    } else if (route === 'safety') {
      targetRoute = 'legal';
      targetParams.policy = 'disclaimer';
    } else if (route === 'admin-login') {
      targetRoute = 'admin';
    } else if (route === 'auth') {
      targetRoute = 'account';
    }

    setCurrentRoute(targetRoute);
    setRouteParams(targetParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        user,
        userToken,
        loginUser,
        logoutUser,
        updateUserProfile,
        sendEmailOtp,
        loginWithEmail,
        isAdmin,
        adminToken,
        loginAdmin,
        logoutAdmin,
        settings,
        updateSettings: (newSettings: StoreSettings) => setSettings(newSettings),
        refreshSettings: fetchSettings,
        isFitGuideOpen,
        openFitGuide: () => setIsFitGuideOpen(true),
        closeFitGuide: () => setIsFitGuideOpen(false),
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        toasts,
        showToast,
        removeToast,
        currentRoute,
        routeParams,
        navigate
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
