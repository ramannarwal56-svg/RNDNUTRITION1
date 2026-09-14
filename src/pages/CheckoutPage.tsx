import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShieldCheck, 
  Truck, 
  QrCode, 
  CreditCard, 
  Banknote, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Lock,
  Copy,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart, user, settings, routeParams, navigate, showToast } = useStore();

  // Customer Contact
  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');

  // Shipping Address
  const defaultAddr = user?.savedAddresses?.[0];
  const [houseBuilding, setHouseBuilding] = useState(defaultAddr?.houseBuilding || '');
  const [streetArea, setStreetArea] = useState(defaultAddr?.streetArea || '');
  const [landmark, setLandmark] = useState(defaultAddr?.landmark || '');
  const [city, setCity] = useState(defaultAddr?.city || '');
  const [state, setState] = useState(defaultAddr?.state || 'Haryana');
  const [pincode, setPincode] = useState(defaultAddr?.pincode || '');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'UPI QR' | 'Net banking / Card' | 'Cash on delivery'>('UPI QR');
  const [upiUtr, setUpiUtr] = useState('');
  const [upiPayerName, setUpiPayerName] = useState('');

  // Card details (for gateway simulation)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Order placement loading & errors
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculation state
  const [calcSummary, setCalcSummary] = useState({
    subtotal: 0,
    discount: 0,
    shippingCharge: 0,
    taxAmount: 0,
    totalAmount: 0
  });

  const couponCode = routeParams.coupon || '';

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal", "Delhi-NCR", "Chandigarh", "Jammu and Kashmir", "Ladakh"
  ];

  useEffect(() => {
    if (cart.length === 0) {
      navigate('cart');
      return;
    }
    
    // Fallback manual calculation using local cart data
    const localSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const localShipping = localSubtotal >= settings.freeShippingThreshold ? 0 : settings.flatShippingRate;
    const localTax = Math.round(localSubtotal * settings.gstRate * 100) / 100;
    setCalcSummary({
      subtotal: localSubtotal,
      discount: 0,
      shippingCharge: localShipping,
      taxAmount: localTax,
      totalAmount: localSubtotal + localShipping
    });
    
    fetchOrderCalculation();
  }, [cart, couponCode]);

  const fetchOrderCalculation = async () => {
    try {
      const payload = {
        items: cart.map(i => ({
          productId: i.productId,
          selectedFlavour: i.selectedFlavour,
          selectedSize: i.selectedSize,
          quantity: i.quantity
        })),
        couponCode
      };

      const res = await fetch('/api/cart/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setCalcSummary({
            subtotal: data.subtotal,
            discount: data.discount,
            shippingCharge: data.shippingCharge,
            taxAmount: data.taxAmount,
            totalAmount: data.totalAmount
          });
        }
      }
    } catch (err) {
      console.warn("Calculation error:", err);
    }
  };

  const handleCopyUpi = () => {
    const upi = "9306667128@fam";
    navigator.clipboard?.writeText(upi);
    showToast(`Copied UPI ID: ${upi}`, "success");
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!houseBuilding.trim() || !streetArea.trim() || !city.trim() || pincode.trim().length !== 6) {
      setErrorMessage("Please complete your delivery address with a valid 6-digit Indian PIN code.");
      return;
    }

    if (paymentMethod === 'UPI QR' && !upiUtr.trim()) {
      setErrorMessage("Please enter your 12-digit UPI Transaction Reference / UTR number after completing the payment.");
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        customerName: customerName.trim(),
        phone: cleanPhone,
        email: email.trim(),
        shippingAddress: {
          houseBuilding: houseBuilding.trim(),
          streetArea: streetArea.trim(),
          landmark: landmark.trim(),
          city: city.trim(),
          state,
          pincode: pincode.trim()
        },
        items: cart.map(i => ({
          productId: i.productId,
          selectedFlavour: i.selectedFlavour,
          selectedSize: i.selectedSize,
          quantity: i.quantity
        })),
        couponCode,
        paymentMethod,
        upiUtr: upiUtr.trim() || undefined,
        upiPayerName: upiPayerName.trim() || undefined
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Server returned non-JSON response:", text);
        if (res.status === 405 || res.status === 302 || text.includes('405 Not Allowed') || text.includes('__cookie_check')) {
          throw new Error("Security session expired. Please refresh the page to securely place your order.");
        }
        throw new Error(`Server connection error or invalid response.`);
      }

      if (!res.ok) {
        throw new Error(data.error || "Order placement failed.");
      }

      // Generate WhatsApp order message
      const adminPhone = "919306667128"; // 9306667128 with India country code
      let waMessage = `*New Order: ${data.id}*\n\n`;
      waMessage += `*Customer:* ${customerName.trim()}\n`;
      waMessage += `*Phone:* ${cleanPhone}\n`;
      if (email.trim()) waMessage += `*Email:* ${email.trim()}\n`;
      waMessage += `\n*Items:*\n`;
      cart.forEach(item => {
        waMessage += `- ${item.quantity}x ${item.productId} (${item.selectedFlavour || 'Standard'}, ${item.selectedSize || 'Standard'})\n`;
      });
      waMessage += `\n*Total:* ₹${calcSummary?.totalAmount || '0'}\n`;
      waMessage += `*Payment:* ${paymentMethod}\n`;
      if (upiUtr.trim()) {
        waMessage += `*UPI UTR:* ${upiUtr.trim()}\n`;
      }
      waMessage += `\n*Delivery Address:*\n${houseBuilding.trim()}, ${streetArea.trim()}\n${city.trim()}, ${state} - ${pincode.trim()}`;

      clearCart();
      showToast("Order generated successfully! Please confirm via WhatsApp.", "success");
      navigate('order-success', { orderId: data.id, waMessage: encodeURIComponent(waMessage) });
    } catch (err: any) {
      setErrorMessage(err?.message || "Could not process order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const upiId = "9306667128@fam";
  const payeeName = "Raman";
  // Dynamic UPI string:
  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${calcSummary.totalAmount}&cu=INR&tn=RND%20Order`;
  // QR image service for direct scanning on mobile or desktop
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUri)}&format=svg`;

  return (
    <div id="rnd-checkout-page" className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Checkout Header */}
        <div className="pb-6 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display flex items-center gap-3">
              <Lock className="w-6 h-6 text-[#D4AF37]" />
              <span>Secure India Checkout</span>
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Delivering authentic gym supplements to your doorstep across India.
            </p>
          </div>
          <div className="text-right text-xs text-neutral-400 hidden sm:block">
            <span>Dispatch Origin:</span>
            <strong className="text-white block">Gohana, Sonipat, Haryana</strong>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact, Shipping & Payment Form */}
          <div className="lg:col-span-8 space-y-8">
            {/* Step 1: Customer Contact Info */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-neutral-950 flex items-center justify-center font-black">
                  1
                </span>
                <span>Customer Contact Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Vikram Singh"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Email Address (For Order Updates) *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Phone Number (10 digits) *</label>
                  <div className="flex items-center">
                    <span className="bg-neutral-800 px-3 py-3 rounded-l-xl text-xs text-neutral-400 border border-r-0 border-neutral-700">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="9876543210"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-r-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-neutral-950 flex items-center justify-center font-black">
                  2
                </span>
                <span>Shipping Address (India Only)</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Flat / House No. / Building / Floor *</label>
                  <input
                    type="text"
                    required
                    value={houseBuilding}
                    onChange={(e) => setHouseBuilding(e.target.value)}
                    placeholder="e.g. House No. 42, Green Avenue"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Street / Colony / Sector / Area *</label>
                  <input
                    type="text"
                    required
                    value={streetArea}
                    onChange={(e) => setStreetArea(e.target.value)}
                    placeholder="e.g. Near Model Town / Gohana Road"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Opposite Gym / Stadium"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">City / Town *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Gohana / Sonipat"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">6-Digit PIN Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="131301"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1">State / Union Territory *</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {indianStates.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-neutral-950 flex items-center justify-center font-black">
                  3
                </span>
                <span>Select Payment Method</span>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* UPI QR */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI QR')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    paymentMethod === 'UPI QR'
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow-lg'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <QrCode className="w-6 h-6 text-[#D4AF37]" />
                    <span className="text-[10px] font-bold bg-amber-500/20 text-[#D4AF37] px-2 py-0.5 rounded">
                      Instant
                    </span>
                  </div>
                  <strong className="text-xs block text-white">UPI QR Code</strong>
                  <span className="text-[11px] text-neutral-400">GPay, PhonePe, Paytm, CRED</span>
                </button>

                {/* Net banking / Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Net banking / Card')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    paymentMethod === 'Net banking / Card'
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow-lg'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className="w-6 h-6 text-[#D4AF37]" />
                    <span className="text-[10px] font-bold bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                      Gateway
                    </span>
                  </div>
                  <strong className="text-xs block text-white">Card / NetBanking</strong>
                  <span className="text-[11px] text-neutral-400">Debit, Credit &amp; NetBanking</span>
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on delivery')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    paymentMethod === 'Cash on delivery'
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow-lg'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Banknote className="w-6 h-6 text-[#D4AF37]" />
                    <span className="text-[10px] font-bold bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                      COD
                    </span>
                  </div>
                  <strong className="text-xs block text-white">Cash on Delivery</strong>
                  <span className="text-[11px] text-neutral-400">Pay cash upon parcel delivery</span>
                </button>
              </div>

              {/* UPI Payment Flow Details */}
              {paymentMethod === 'UPI QR' && (
                <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6">
                  <div className="text-xs text-neutral-300">
                    Scan the dynamic UPI QR Code with any UPI App on your phone. Exact payable amount: <strong className="text-[#D4AF37] text-sm">₹{calcSummary.totalAmount}</strong>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                    {/* Real QR Code */}
                    <div className="p-2 bg-white rounded-xl shadow-lg flex-shrink-0">
                      <img
                        src={qrUrl}
                        alt="RND UPI Payment QR Code"
                        className="w-44 h-44 object-contain"
                      />
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-neutral-400 block text-[11px]">Payee VPA / UPI ID:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="bg-neutral-950 px-2.5 py-1.5 rounded-lg border border-neutral-800 text-[#D4AF37] font-mono font-bold">
                            {upiId}
                          </code>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white"
                            title="Copy UPI ID"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-neutral-400 block text-[11px]">Payee Account Name:</span>
                        <strong className="text-white">{payeeName}</strong>
                      </div>

                      <div className="pt-1">
                        <a
                          href={upiUri}
                          className="inline-flex items-center gap-1 text-xs text-[#D4AF37] hover:underline font-bold"
                        >
                          <span>Open UPI App on this device</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* UTR Reference Input (Critical for Admin Verification) */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-white">
                      Enter UPI Payment Proof
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-neutral-400 block mb-1">
                          12-Digit UPI UTR / Transaction Reference No. *
                        </label>
                        <input
                          type="text"
                          required
                          value={upiUtr}
                          onChange={(e) => setUpiUtr(e.target.value)}
                          placeholder="e.g. 418293849102"
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-neutral-400 block mb-1">
                          Account Holder Name (As per UPI App)
                        </label>
                        <input
                          type="text"
                          value={upiPayerName}
                          onChange={(e) => setUpiPayerName(e.target.value)}
                          placeholder="e.g. Raman Narwal"
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Your order will be marked as <em>Payment verification pending</em>. Raman Narwal and the RND team will confirm your UTR against the bank ledger and dispatch within 24 hours.
                    </p>
                  </div>
                </div>
              )}

              {/* Gateway Card Payment */}
              {paymentMethod === 'Net banking / Card' && (
                <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                  <div className="text-xs text-neutral-300">
                    Enter your debit or credit card details (RuPay, Visa, Mastercard accepted).
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-neutral-400 block mb-1">Card Number</label>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• 8912"
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-xs text-white font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-neutral-400 block mb-1">Valid Thru (MM/YY)</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-neutral-400 block mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cash On Delivery notice */}
              {paymentMethod === 'Cash on delivery' && (
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Cash on Delivery Confirmed</span>
                  </div>
                  <p>
                    Please keep exact cash ready (₹{calcSummary.totalAmount}) at the time of delivery by our courier partner. Our delivery executive will provide a digital delivery receipt.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Review Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5 sticky top-28">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Items in Order ({cart.length})
              </h2>

              {/* Item preview list */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs pb-2 border-b border-neutral-800/80">
                    <img
                      src={item.product?.images[0] || './images/rnd_whey_protein_1789192519698.jpg'}
                      alt={item.product?.name}
                      className="w-12 h-12 object-contain rounded-lg bg-neutral-950 p-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white truncate">{item.product?.name}</div>
                      <div className="text-[11px] text-neutral-400 truncate">
                        {item.selectedFlavour} • {item.selectedSize} × {item.quantity}
                      </div>
                    </div>
                    <div className="font-black text-white">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-xs text-neutral-300 pt-2 border-t border-neutral-800">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{calcSummary.subtotal.toLocaleString('en-IN')}</span>
                </div>

                {calcSummary.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon Discount</span>
                    <span>-₹{calcSummary.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>India Express Shipping</span>
                  <span>{calcSummary.shippingCharge === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${calcSummary.shippingCharge}`}</span>
                </div>

                <div className="flex justify-between text-neutral-400">
                  <span>Estimated GST (18%)</span>
                  <span>₹{calcSummary.taxAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-base font-black text-white pt-3 border-t border-neutral-800 font-display">
                  <span>Total Amount</span>
                  <span className="text-[#D4AF37]">₹{calcSummary.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                id="place-order-submit-btn"
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 via-[#D4AF37] to-amber-500 hover:brightness-110 text-neutral-950 font-black text-sm uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>Place Order (₹{calcSummary.totalAmount.toLocaleString('en-IN')})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-[11px] text-neutral-400 text-center space-y-1">
                <div>🔒 256-bit encrypted secure transactions.</div>
                <div>Dispatched from RND Gohana, Sonipat, Haryana.</div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
