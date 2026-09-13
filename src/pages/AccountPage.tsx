import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, UserProfile, Address } from '../types';
import { generateOrderInvoicePdf } from '../utils/invoiceGenerator';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Package, 
  LogOut, 
  Plus, 
  Trash2, 
  Download, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, loginWithEmail, logoutUser, sendEmailOtp, showToast, navigate } = useStore();

  // Auth flow states
  const [emailInput, setEmailInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);

  // User profile active tab
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Address modal/form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddr, setNewAddr] = useState<Address>({
    houseBuilding: '',
    streetArea: '',
    landmark: '',
    city: '',
    state: 'Haryana',
    pincode: ''
  });

  useEffect(() => {
    if (user?.email) {
      fetchUserOrders(user.email);
    }
  }, [user]);

  const fetchUserOrders = async (phone: string) => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`/api/orders?phone=${phone}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.warn("User orders fetch error:", e);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast("Please enter a valid email address", "warning");
      return;
    }
    setAuthLoading(true);
    try {
      const res = await sendEmailOtp(cleanEmail);
      setOtpSent(true);
      showToast("OTP sent to your email address!", "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to send OTP", "error");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput || otpInput.length < 4) {
      showToast("Please enter the OTP received", "warning");
      return;
    }
    setAuthLoading(true);
    try {
      const cleanEmail = emailInput.toLowerCase().trim();
      await loginWithEmail(cleanEmail, otpInput.trim());
      showToast("Welcome to RND Sports Nutrition!", "success");
      setOtpSent(false);
      setOtpInput('');
    } catch (err: any) {
      showToast(err?.message || "Invalid OTP entered", "error");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.houseBuilding || !newAddr.city || newAddr.pincode.length !== 6) {
      showToast("Please fill all required address fields", "warning");
      return;
    }

    try {
      const res = await fetch('/api/user/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: user?.email,
          address: newAddr
        })
      });
      if (res.ok) {
        showToast("Address saved successfully!", "success");
        setShowAddressForm(false);
        setNewAddr({ houseBuilding: '', streetArea: '', landmark: '', city: '', state: 'Haryana', pincode: '' });
      }
    } catch {
      showToast("Failed to save address", "error");
    }
  };

  // Not logged in view: Phone OTP Form
  if (!user) {
    return (
      <div id="rnd-auth-page" className="min-h-screen bg-black text-neutral-100 py-16 px-4 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black">
        <div className="max-w-md w-full bg-neutral-900/40 border border-[#D4AF37]/30 p-8 rounded-3xl space-y-6 shadow-[0_0_40px_-15px_rgba(212,175,55,0.3)] backdrop-blur-2xl ring-1 ring-white/10">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white font-display">
              Athlete Sign In
            </h1>
            <p className="text-xs text-neutral-400">
              Instant login with your email. No passwords required.
            </p>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <div className="flex items-center">
                  <span className="bg-neutral-800 px-3.5 py-3 rounded-l-xl text-xs text-neutral-400 border border-r-0 border-neutral-700">
                    ✉️
                  </span>
                  <input
                    type="email"
                    required
                    
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="athlete@example.com"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-r-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-neutral-950 text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                {authLoading ? 'Sending OTP...' : 'Send Verification OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 flex items-center justify-between">
                <span>OTP sent to {emailInput}</span>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-xs text-[#D4AF37] font-bold hover:underline"
                >
                  Change
                </button>
              </div>

              

              <div>
                <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider block mb-1">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="• • • • • •"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-neutral-950 text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                {authLoading ? 'Verifying...' : 'Verify & Log In'}
              </button>
            </form>
          )}

          <div className="pt-2 text-center text-[11px] text-neutral-500">
            By signing in, you agree to RND's Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    );
  }

  // Logged in user dashboard
  return (
    <div id="rnd-account-dashboard" className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* User Top Profile Card */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-[#D4AF37] text-neutral-950 flex items-center justify-center text-2xl font-black font-display shadow-lg">
              {user.fullName ? user.fullName[0].toUpperCase() : 'R'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white font-display">
                  {user.fullName || 'RND Athlete'}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-[#D4AF37] border border-amber-500/30">
                  Verified Account
                </span>
              </div>
              <div className="text-xs text-neutral-400 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {user.email}
                </span>
                {user.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {user.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={logoutUser}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dashboard Tabs Navigation */}
        <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'orders'
                ? 'bg-[#D4AF37] text-neutral-950 font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'addresses'
                ? 'bg-[#D4AF37] text-neutral-950 font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Saved Addresses
          </button>
        </div>

        {/* Tab 1: Orders List */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {ordersLoading ? (
              <div className="py-12 text-center text-xs text-neutral-400">Loading your orders...</div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
                <Package className="w-12 h-12 text-neutral-500 mx-auto" />
                <h3 className="text-base font-bold text-white">No orders placed yet</h3>
                <p className="text-xs text-neutral-400">
                  Ready to fuel your training? Explore our certified pure supplements.
                </p>
                <button
                  onClick={() => navigate('shop')}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-neutral-950 text-xs font-bold"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              orders.map(order => (
                <div
                  key={order.id}
                  className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-800">
                    <div>
                      <span className="text-xs text-neutral-400">Order Placed: {new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                      <div className="text-sm font-mono font-bold text-white mt-0.5">
                        {order.id}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold border border-[#D4AF37]/40">
                        {order.orderStatus}
                      </span>
                      <div className="text-base font-black text-white font-display">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Items in this order */}
                  <div className="space-y-2">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-neutral-300">
                        <span>{it.name} ({it.flavour}, {it.size}) × {it.quantity}</span>
                        <span className="font-bold text-white">₹{it.subtotal.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-800">
                    <div className="text-xs text-neutral-400">
                      Destination: <strong>{order.shippingAddress.city}, {order.shippingAddress.state}</strong>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => generateOrderInvoicePdf(order)}
                        className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Tax Invoice PDF</span>
                      </button>

                      <button
                        onClick={() => navigate('track', { orderId: order.id, phone: order.phone })}
                        className="px-3.5 py-2 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Live</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Delivery Locations
              </h2>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-neutral-950 text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Add Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">House / Flat / Building *</label>
                    <input
                      type="text"
                      required
                      value={newAddr.houseBuilding}
                      onChange={(e) => setNewAddr({ ...newAddr, houseBuilding: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Street / Colony *</label>
                    <input
                      type="text"
                      required
                      value={newAddr.streetArea}
                      onChange={(e) => setNewAddr({ ...newAddr, streetArea: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">6-Digit PIN Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={newAddr.pincode}
                      onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value.replace(/\D/g, '') })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-neutral-950 text-xs font-bold"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-5 py-2.5 rounded-xl bg-neutral-800 text-white text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.savedAddresses?.map((addr, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    <span>Address #{idx + 1}</span>
                  </div>
                  <p className="text-neutral-300">
                    {addr.houseBuilding}, {addr.streetArea}
                  </p>
                  <p className="text-neutral-400">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
