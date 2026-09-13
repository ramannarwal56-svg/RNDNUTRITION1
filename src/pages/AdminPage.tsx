import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { googleSignInForGmail } from '../utils/gmailAuth';
import { Product, Order, Coupon, AppSettings } from '../types';
import { generateOrderInvoicePdf } from '../utils/invoiceGenerator';
import { 
  Lock, 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Tag, 
  Settings, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Edit, 
  Download, 
  Truck, 
  Eye, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Search, 
  Save, 
  X,
  LogOut,
  RefreshCcw
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { settings, updateSettings, showToast, navigate } = useStore();

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState('');

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'coupons' | 'settings'>('overview');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [loading, setLoading] = useState(false);
  const [gmailConnected, setGmailConnected] = useState(false);
  
  const handleConnectGmail = async () => {
    try {
      showToast("Connecting to Gmail...", "info");
      const result = await googleSignInForGmail();
      if (result?.accessToken) {
        const res = await fetch('/api/admin/gmail-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: result.accessToken })
        });
        if (res.ok) {
          setGmailConnected(true);
          showToast("Gmail connected successfully! Order emails will now be sent automatically.", "success");
        } else {
          showToast("Failed to save Gmail token to server", "error");
        }
      }
    } catch (e: any) {
      console.error(e);
      showToast("Gmail connection failed: " + e.message, "error");
    }
  };

  // Filters & modals
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Product edit/create modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // New coupon modal
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 999,
    isActive: true
  });

  // Tracking edit modal
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);
  const [courierNameInput, setCourierNameInput] = useState('Delhivery Express');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');

  useEffect(() => {
    // Check if previously logged in admin in session
    const saved = sessionStorage.getItem('rnd_admin_auth');
    if (saved === 'true') {
      setIsAdminLoggedIn(true);
      fetchAdminData();
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === 'pixel1750') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('rnd_admin_auth', 'true');
      setAuthError('');
      fetchAdminData();
      showToast("Welcome Raman Narwal (Admin)", "success");
    } else {
      setAuthError("Incorrect Admin PIN.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('rnd_admin_auth');
    showToast("Admin logged out", "info");
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [oRes, pRes, cRes, sRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products?limit=100'),
        fetch('/api/coupons'),
        fetch('/api/settings')
      ]);

      if (oRes.ok) {
        const oData = await oRes.json();
        setOrders(oData.orders || []);
      }
      if (pRes.ok) {
        const pData = await pRes.json();
        setProducts(pData.products || []);
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        setCoupons(cData.coupons || []);
      }
      if (sRes.ok) {
        const sData = await sRes.json();
        setLocalSettings(sData);
      }
    } catch (e) {
      console.warn("Failed to load admin data:", e);
    } finally {
      setLoading(false);
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, status: string, trackingNum?: string, courier?: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: status,
          trackingNumber: trackingNum,
          courierName: courier
        })
      });

      if (res.ok) {
        showToast(`Order ${orderId} updated to ${status}`, "success");
        fetchAdminData();
        setTrackingModalOrder(null);
      }
    } catch {
      showToast("Failed to update order status", "error");
    }
  };

  // UPI Payment verification
  const handleVerifyUpiPayment = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentStatus: 'Paid',
          orderStatus: 'Confirmed'
        })
      });

      if (res.ok) {
        showToast(`Payment for order ${orderId} marked as verified & confirmed!`, "success");
        fetchAdminData();
      }
    } catch {
      showToast("Failed to verify UPI payment", "error");
    }
  };

  // Save product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.category || !editingProduct?.salePrice) {
      showToast("Please fill all required product fields", "warning");
      return;
    }

    try {
      const method = editingProduct.id ? 'PUT' : 'POST';
      const url = editingProduct.id ? `/api/products/${editingProduct.id}` : '/api/products';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });

      if (res.ok) {
        showToast(editingProduct.id ? "Product updated successfully!" : "New product created!", "success");
        setShowProductModal(false);
        setEditingProduct(null);
        fetchAdminData();
      }
    } catch {
      showToast("Error saving product", "error");
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast("Product deleted", "info");
        fetchAdminData();
      }
    } catch {
      showToast("Failed to delete product", "error");
    }
  };

  // Quick Stock Adjustment
  const handleStockAdjust = async (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stockQuantity + delta);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockQuantity: newStock })
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stockQuantity: newStock } : p));
      }
    } catch {
      showToast("Could not adjust stock", "error");
    }
  };

  // Save Store Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localSettings)
      });
      if (res.ok) {
        updateSettings(localSettings);
        showToast("Store settings updated successfully!", "success");
      }
    } catch {
      showToast("Failed to update store settings", "error");
    }
  };

  // Admin login view
  if (!isAdminLoggedIn) {
    return (
      <div id="rnd-admin-login" className="min-h-screen bg-neutral-950 text-neutral-100 py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 rounded-3xl space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white font-display">
              RND Admin Console
            </h1>
            <p className="text-xs text-neutral-400">
              Authorized Single-Administrator Access for Raman Narwal (Gohana, Sonipat)
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-xs text-red-300">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Enter Master Admin PIN / Password</label>
              <input
                type="password"
                required
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="PIN or Password"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white text-center font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-neutral-950 text-xs font-black uppercase tracking-wider transition-all shadow-lg"
            >
              Unlock Admin Terminal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Calculate high level metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingUpiOrders = orders.filter(o => o.orderStatus === 'Payment verification pending');
  const lowStockProducts = products.filter(p => p.stockQuantity < 10);

  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter !== 'All' && o.orderStatus !== orderStatusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        (o.upiUtr && o.upiUtr.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div id="rnd-admin-dashboard" className="min-h-screen bg-neutral-950 text-neutral-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Navbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              <span>Admin Desk</span>
              <span>•</span>
              <span>Gohana Central Warehouse</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-display">
              RND Executive Console
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
              title="Refresh Data"
            >
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleAdminLogout}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-300 flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview' ? 'bg-[#D4AF37] text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 relative ${
              activeTab === 'orders' ? 'bg-[#D4AF37] text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders ({orders.length})</span>
            {pendingUpiOrders.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute top-1 right-1" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'products' ? 'bg-[#D4AF37] text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Products &amp; Stock ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'coupons' ? 'bg-[#D4AF37] text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'settings' ? 'bg-[#D4AF37] text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Store Settings</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
        <>
          <div className="mb-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Automated Emails via Gmail</h3>
                <p className="text-sm text-neutral-400">Connect your ramannarwal56@gmail.com account to automatically send order confirmations to customers.</p>
              </div>
              <button
                onClick={handleConnectGmail}
                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors ${gmailConnected ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50' : 'bg-white text-neutral-950 hover:bg-neutral-200'}`}
              >
                {gmailConnected ? <CheckCircle2 className="w-5 h-5" /> : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                {gmailConnected ? 'Gmail Connected' : 'Connect Gmail'}
              </button>
            </div>
          </div>
  
          <div className="space-y-8">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <span className="text-xs text-neutral-400 uppercase font-bold tracking-wider">Gross Sales (INR)</span>
                <div className="text-2xl sm:text-3xl font-black text-white font-display">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-emerald-400">All India Dispatches</div>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <span className="text-xs text-neutral-400 uppercase font-bold tracking-wider">Total Orders</span>
                <div className="text-2xl sm:text-3xl font-black text-white font-display">
                  {orders.length}
                </div>
                <div className="text-[11px] text-neutral-400">Logged in database</div>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <span className="text-xs text-amber-400 uppercase font-bold tracking-wider">Pending UPI Proofs</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-display">
                  {pendingUpiOrders.length}
                </div>
                <div className="text-[11px] text-neutral-400">Awaiting UTR bank confirmation</div>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <span className="text-xs text-red-400 uppercase font-bold tracking-wider">Low Stock SKU Alerts</span>
                <div className="text-2xl sm:text-3xl font-black text-red-400 font-display">
                  {lowStockProducts.length}
                </div>
                <div className="text-[11px] text-neutral-400">&lt; 10 units at Gohana</div>
              </div>
            </div>

            {/* Pending Verifications Quick Action Bar */}
            {pendingUpiOrders.length > 0 && (
              <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                    <span>Action Required: {pendingUpiOrders.length} Pending UPI Payments</span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('orders');
                      setOrderStatusFilter('Payment verification pending');
                    }}
                    className="text-xs text-[#D4AF37] font-bold hover:underline"
                  >
                    View All Pending
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingUpiOrders.slice(0, 2).map(o => (
                    <div key={o.id} className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="font-bold text-white">{o.customerName} ({o.id})</div>
                        <div className="text-neutral-400">Amount: <strong className="text-white">₹{o.totalAmount}</strong></div>
                        <div className="text-[11px] text-[#D4AF37] font-mono">UTR: {o.upiUtr || 'No UTR specified'}</div>
                      </div>
                      <button
                        onClick={() => handleVerifyUpiPayment(o.id)}
                        className="px-3 py-2 rounded-xl bg-[#D4AF37] text-neutral-950 font-bold hover:bg-amber-400"
                      >
                        Approve Payment
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Dispatch Table Preview */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Recent Orders Stream
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-neutral-400 border-b border-neutral-800 pb-2">
                    <tr>
                      <th className="py-2">Order ID</th>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id} className="hover:bg-neutral-800/30">
                        <td className="py-3 font-mono font-bold text-white">{o.id}</td>
                        <td className="text-neutral-300">{o.customerName}</td>
                        <td className="text-neutral-400">{o.phone}</td>
                        <td className="font-bold text-white">₹{o.totalAmount}</td>
                        <td className="text-neutral-300">{o.paymentMethod}</td>
                        <td>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37]">
                            {o.orderStatus}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => generateOrderInvoicePdf(o)}
                            className="text-xs text-neutral-400 hover:text-white"
                            title="Invoice PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

        {/* Tab 2: Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Order ID, Phone, UTR..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
                {['All', 'Payment verification pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered'].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      orderStatusFilter === st
                        ? 'bg-[#D4AF37] text-neutral-950 font-bold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[800px]">
                <thead className="text-neutral-400 border-b border-neutral-800 pb-2 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-2.5">Order</th>
                    <th>Customer &amp; Address</th>
                    <th>Items</th>
                    <th>Amount &amp; Method</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {filteredOrders.map(o => (
                    <tr key={o.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-4 align-top">
                        <div className="font-mono font-bold text-white">{o.id}</div>
                        <div className="text-[10px] text-neutral-500">{new Date(o.createdAt).toLocaleDateString('en-IN')}</div>
                        {o.trackingNumber && (
                          <div className="text-[10px] text-[#D4AF37] font-mono mt-1">
                            AWB: {o.trackingNumber}
                          </div>
                        )}
                      </td>

                      <td className="align-top space-y-0.5">
                        <div className="font-bold text-white">{o.customerName}</div>
                        <div className="text-neutral-400">+91 {o.phone}</div>
                        <div className="text-[11px] text-neutral-500 line-clamp-2">
                          {o.shippingAddress.houseBuilding}, {o.shippingAddress.city}, {o.shippingAddress.state} - {o.shippingAddress.pincode}
                        </div>
                      </td>

                      <td className="align-top space-y-1">
                        {o.items.map((it, idx) => (
                          <div key={idx} className="text-[11px] text-neutral-300">
                            {it.name} ({it.flavour}) × {it.quantity}
                          </div>
                        ))}
                      </td>

                      <td className="align-top space-y-1">
                        <div className="font-bold text-white text-sm">₹{o.totalAmount}</div>
                        <div className="text-[11px] text-neutral-400">{o.paymentMethod}</div>
                        {o.upiUtr && (
                          <div className="text-[10px] text-amber-300 font-mono bg-neutral-950 p-1 rounded border border-neutral-800">
                            UTR: {o.upiUtr}
                          </div>
                        )}
                      </td>

                      <td className="align-top">
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          className="bg-neutral-950 border border-neutral-700 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                        >
                          <option value="Payment verification pending">Verification Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for delivery">Out for delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="align-top">
                        <div className="flex flex-col gap-1.5">
                          {o.orderStatus === 'Payment verification pending' && (
                            <button
                              onClick={() => handleVerifyUpiPayment(o.id)}
                              className="px-2 py-1 rounded bg-[#D4AF37] text-neutral-950 font-bold text-[10px] hover:bg-amber-400"
                            >
                              Approve UPI
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setTrackingModalOrder(o);
                              setCourierNameInput(o.courierName || 'Delhivery Express');
                              setTrackingNumberInput(o.trackingNumber || '');
                            }}
                            className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[10px] flex items-center gap-1"
                          >
                            <Truck className="w-3 h-3 text-[#D4AF37]" />
                            <span>AWB / Courier</span>
                          </button>

                          <button
                            onClick={() => generateOrderInvoicePdf(o)}
                            className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[10px] flex items-center gap-1"
                          >
                            <Download className="w-3 h-3 text-[#D4AF37]" />
                            <span>Tax Invoice</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Product Catalog & Stock */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Inventory &amp; Formulations ({products.length})
              </h2>

              <button
                onClick={() => {
                  setEditingProduct({
                    id: '',
                    name: '',
                    category: 'Whey Protein',
                    regularPrice: 3999,
                    salePrice: 3299,
                    stockQuantity: 50,
                    flavour: 'Rich Double Chocolate',
                    weightOrPackSize: '2 kg (4.4 lbs)',
                    servings: 60,
                    rating: 4.9,
                    reviewCount: 1,
                    sku: `RND-${Date.now().toString().slice(-4)}`,
                    isBestSeller: false,
                    isFeatured: true,
                    images: ['./images/rnd_whey_protein_1789192519698.jpg'],
                    shortDescription: 'Formulated with ultra-pure ingredients.',
                    ingredients: '100% Whey Protein Isolate, Natural Cocoa, Digestive Enzymes.'
                  });
                  setShowProductModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-neutral-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Formulation</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <div key={p.id} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-16 h-16 object-contain rounded-xl bg-neutral-950 p-2 border border-neutral-800"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-[#D4AF37] font-bold uppercase">{p.category}</div>
                      <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                      <div className="text-xs font-black text-white">
                        ₹{p.salePrice} <span className="text-[10px] text-neutral-500 line-through">₹{p.regularPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stock counter */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                    <span className="text-neutral-400">Current Stock:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStockAdjust(p, -5)}
                        className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-bold"
                      >
                        -5
                      </button>
                      <strong className={`font-mono ${p.stockQuantity < 10 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {p.stockQuantity}
                      </strong>
                      <button
                        onClick={() => handleStockAdjust(p, 5)}
                        className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-bold"
                      >
                        +5
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setShowProductModal(true);
                      }}
                      className="text-[#D4AF37] hover:underline flex items-center gap-1 font-bold"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="text-red-400 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Coupons Management */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Promotional Coupons
              </h2>
              <button
                onClick={() => setShowCouponModal(true)}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-neutral-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map(c => (
                <div key={c.id} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-bold font-mono text-[#D4AF37]">{c.code}</code>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Active
                    </span>
                  </div>
                  <div className="text-neutral-300">
                    Discount: <strong>{c.discountValue}{c.discountType === 'percentage' ? '%' : ' INR'} OFF</strong>
                  </div>
                  <div className="text-neutral-400 text-[11px]">
                    Min Order: ₹{c.minOrderAmount} • Used {c.usedCount || 0} times
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Store Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
            <h2 className="text-base font-bold uppercase tracking-wider text-white">
              Configure RND Business &amp; UPI Gateway
            </h2>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-400 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={localSettings.brandName}
                    onChange={(e) => setLocalSettings({ ...localSettings, brandName: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-white"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Official Location</label>
                  <input
                    type="text"
                    value={localSettings.location}
                    onChange={(e) => setLocalSettings({ ...localSettings, location: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-white"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={localSettings.phone}
                    onChange={(e) => setLocalSettings({ ...localSettings, phone: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-white"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={localSettings.whatsapp}
                    onChange={(e) => setLocalSettings({ ...localSettings, whatsapp: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-white"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Business Email</label>
                  <input
                    type="email"
                    value={localSettings.email}
                    onChange={(e) => setLocalSettings({ ...localSettings, email: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-white"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">UPI ID for Dynamic QR</label>
                  <input
                    type="text"
                    value={localSettings.upiId}
                    onChange={(e) => setLocalSettings({ ...localSettings, upiId: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Free Shipping Threshold (INR)</label>
                  <input
                    type="number"
                    value={localSettings.freeShippingThreshold}
                    onChange={(e) => setLocalSettings({ ...localSettings, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-white"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Standard Shipping Fee (INR)</label>
                  <input
                    type="number"
                    value={localSettings.shippingFee}
                    onChange={(e) => setLocalSettings({ ...localSettings, shippingFee: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-neutral-950 font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Store Configuration</span>
              </button>
            </form>
          </div>
        )}

        {/* Modal: AWB / Consignment Tracking Updater */}
        {trackingModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl p-6 text-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Update Courier AWB ({trackingModalOrder.id})
                </span>
                <button onClick={() => setTrackingModalOrder(null)}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-neutral-400 block mb-1">Courier Partner</label>
                  <input
                    type="text"
                    value={courierNameInput}
                    onChange={(e) => setCourierNameInput(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Consignment / AWB Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    placeholder="e.g. DEL78291038"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleUpdateOrderStatus(trackingModalOrder.id, 'Shipped', trackingNumberInput, courierNameInput)}
                  className="w-full py-3 rounded-xl bg-[#D4AF37] text-neutral-950 font-bold text-xs"
                >
                  Save &amp; Mark as Shipped
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Product Add / Edit */}
        {showProductModal && editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-700 rounded-2xl p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {editingProduct.id ? 'Edit Supplement' : 'New Supplement Formulation'}
                </span>
                <button onClick={() => setShowProductModal(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-400 block mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Category *</label>
                    <select
                      value={editingProduct.category || 'Whey Protein'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white"
                    >
                      <option value="Whey Protein">Whey Protein</option>
                      <option value="Creatine">Creatine</option>
                      <option value="Pre-Workout">Pre-Workout</option>
                      <option value="Mass Gainer">Mass Gainer</option>
                      <option value="Fat Burner">Fat Burner</option>
                      <option value="Protein Bars">Protein Bars</option>
                      <option value="Multivitamins">Multivitamins</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Regular Price (INR) *</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.regularPrice || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, regularPrice: Number(e.target.value) })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Sale Price (INR) *</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.salePrice || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: Number(e.target.value) })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Available Stock *</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.stockQuantity || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: Number(e.target.value) })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Flavour</label>
                    <input
                      type="text"
                      value={editingProduct.flavour || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, flavour: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Image URL</label>
                  <input
                    type="text"
                    value={editingProduct.images?.[0] || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={editingProduct.shortDescription || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isBestSeller || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                      className="accent-[#D4AF37]"
                    />
                    <span>Mark as Bestseller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isFeatured || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                      className="accent-[#D4AF37]"
                    />
                    <span>Featured on Home</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-neutral-800">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#D4AF37] text-neutral-950 font-bold"
                  >
                    Save Supplement
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-6 py-3 rounded-xl bg-neutral-800 text-white font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
