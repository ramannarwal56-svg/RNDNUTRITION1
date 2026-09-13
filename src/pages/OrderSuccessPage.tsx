import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { generateOrderInvoicePdf } from '../utils/invoiceGenerator';
import { 
  CheckCircle2, 
  Download, 
  Truck, 
  MessageCircle, 
  ArrowRight, 
  Clock, 
  MapPin, 
  ShieldCheck 
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { routeParams, navigate, settings } = useStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const orderId = routeParams.orderId;

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    } catch (e) {
      console.warn("Order fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (order) {
      generateOrderInvoicePdf(order);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div id="rnd-order-success-page" className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Success Header Banner */}
        <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 text-center space-y-4 shadow-2xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
            Order Confirmed &amp; Queued
          </span>

          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-display">
            Thank You For Trusting RND!
          </h1>

          <p className="text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
            Your order has been recorded in our Gohana dispatch facility. We are preparing authentic, lab-verified supplements for speedy delivery to your address.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs">
            <div className="px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-400 block text-[11px]">Order Reference:</span>
              <strong className="text-[#D4AF37] font-mono text-sm">{order?.id || orderId || 'RND-2026-SUCCESS'}</strong>
            </div>

            <div className="px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-400 block text-[11px]">Estimated India Delivery:</span>
              <strong className="text-white text-sm">3 - 5 Business Days</strong>
            </div>
          </div>
        </div>

        {/* Order Details & UPI verification note */}
        {order && (
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Order &amp; Payment Status
              </h2>
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                {order.orderStatus}
              </span>
            </div>

            {order.paymentMethod === 'UPI QR' && (
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
                <div className="text-[#D4AF37] font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>UPI Payment Verification In Progress</span>
                </div>
                <p className="text-neutral-300 leading-relaxed">
                  Recorded Transaction UTR: <strong className="font-mono text-white">{order.upiUtr || 'Submitted'}</strong>. Our finance desk in Gohana will verify this against the bank ledger and dispatch your package immediately.
                </p>
              </div>
            )}

            {/* Courier & Tracking Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-neutral-400 block">Courier Partner:</span>
                <strong className="text-white text-sm">{order.courierName || 'Delhivery Express'}</strong>
                <span className="text-[11px] text-neutral-500 block">Air / Surface Express (India-wide)</span>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-neutral-400 block">Consignment Tracking Number:</span>
                <strong className="text-[#D4AF37] font-mono text-sm">{order.trackingNumber || 'Generated at packing'}</strong>
                <span className="text-[11px] text-neutral-500 block">Live status available in 12 hours</span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1 text-xs">
              <span className="text-neutral-400 block font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Shipping Destination:</span>
              </span>
              <div className="text-white font-bold">{order.customerName} (+91 {order.phone})</div>
              <div className="text-neutral-300">
                {order.shippingAddress.houseBuilding}, {order.shippingAddress.streetArea}
              </div>
              <div className="text-neutral-300">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </div>
            </div>

            {/* Item list */}
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-neutral-400 uppercase tracking-wider">Supplements Ordered</h3>
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-neutral-800 text-neutral-300">
                  <span>{it.name} ({it.flavour}, {it.size}) × {it.quantity}</span>
                  <strong className="text-white">₹{it.subtotal.toLocaleString('en-IN')}</strong>
                </div>
              ))}
              <div className="flex justify-between pt-2 text-sm font-black text-white font-display">
                <span>Total Amount Paid</span>
                <span className="text-[#D4AF37]">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Invoice & Tracking CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                id="download-invoice-btn"
                onClick={handleDownloadInvoice}
                className="w-full py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-neutral-700"
              >
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>Download Tax Invoice (PDF)</span>
              </button>

              <button
                onClick={() => navigate('track', { orderId: order.id, phone: order.phone })}
                className="w-full py-3.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>Track Order Live</span>
              </button>
            </div>
          </div>
        )}

        {/* WhatsApp Helpline for this Order */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-900 border border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-emerald-600 text-white flex-shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Have questions regarding this order?</h4>
              <p className="text-xs text-neutral-400">Direct assistance from Raman Narwal on 9306667128</p>
            </div>
          </div>

          <a
            href={`https://wa.me/91${settings.whatsapp}?text=Hi%20RND!%20My%20Order%20ID%20is%20${order?.id || orderId}.%20Can%20you%20confirm%20dispatch%20status?`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 flex-shrink-0"
          >
            <span>Chat on WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => navigate('shop')}
            className="text-xs text-[#D4AF37] hover:text-white transition-colors underline"
          >
            Continue Exploring RND Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
