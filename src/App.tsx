import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { FitGuideModal } from './components/common/FitGuideModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AccountPage } from './pages/AccountPage';
import { AuthenticityPage } from './pages/AuthenticityPage';
import { ComparePage } from './pages/ComparePage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { BlogPage } from './pages/BlogPage';

import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentRoute, toasts } = useStore();
  const toast = toasts[toasts.length - 1];

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute]);

  const renderCurrentView = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-success':
        return <OrderSuccessPage />;
      case 'track':
        return <OrderTrackingPage />;
      case 'account':
        return <AccountPage />;
      case 'authenticity':
        return <AuthenticityPage />;
      case 'compare':
        return <ComparePage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'legal':
      case 'safety':
        return <LegalPage />;
      case 'blog':
        return <BlogPage />;
      case 'auth':
        return <AccountPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080808] text-neutral-100 font-sans antialiased selection:bg-[#D4AF37] selection:text-neutral-950">
      {/* Header Navigation */}
      <Header />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Floating Interactive Widgets */}
      <FloatingWhatsApp />
      <FitGuideModal />

      {/* Global Toast Notifications */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200 pointer-events-none">
          <div className={`px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border backdrop-blur-md ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
              : toast.type === 'error'
              ? 'bg-red-950/90 text-red-300 border-red-500/50'
              : 'bg-neutral-900/90 text-[#D4AF37] border-[#D4AF37]/50'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#D4AF37]" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
