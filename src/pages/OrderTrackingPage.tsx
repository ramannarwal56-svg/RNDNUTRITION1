import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { generateOrderInvoicePdf } from '../utils/invoiceGenerator';
import { 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  Download, 
  MessageCircle,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { routeParams, settings, showToast } = useStore();

  const [orderId, setOrderId] = useState(routeParams.orderId || '');
  const [phone, setPhone] = useState(routeParams.phone || '');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (routeParams.orderId) {
      handleLookup(routeParams.orderId);
    }
  }, [routeParams.orderId]);

  const handleLookup = async (lookupId?: string) => {
    const id = (lookupId || orderId).trim();
    if (!id) {
      showToast("Please enter an Order ID", "warning");
      return;
    }

    setLoading(true);
    setNotFound(false);
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        setNotFound(true);
        setOrder(null);
      }
    } catch {
      setNotFound(true);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Order Confirmed', key: 'Confirmed', desc: 'Order verified in Gohana system' },
    { title: 'Under Processing', key: 'Processing', desc: 'Formulation batch allocation' },
    { title: 'Quality Packed', key: 'Packed', desc: 'Sealed with tamper-proof packaging' },
    { title: 'Dispatched', key: 'Shipped', desc: 'Handed to Delhivery Express' },
    { title: 'Out for Delivery', key: 'Out for delivery', desc: 'With local courier executive' },
    { title: 'Delivered', key: 'Delivered', desc: 'Handed over successfully' }
  ];

  const getStepStatus = (stepKey: string) => {
    if (!order) return 'upcoming';
    const statusOrder = ['Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];
    const currentIdx = statusOrder.indexOf(order.orderStatus);
    const targetIdx = statusOrder.indexOf(stepKey);

    if (order.orderStatus === 'Payment verification pending' && stepKey === 'Confirmed') {
      return 'pending-verification';
    }

    if (currentIdx > targetIdx) return 'completed';
    if (currentIdx === targetIdx) return 'active';
    return 'upcoming';
  };

  return (
    <div id="rnd-order-tracking-page" className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>India-Wide Consignment Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-display">
            Track Your RND Shipment
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
            Check live consignment milestone status, courier tracking number, and dispatch logs directly from our Gohana, Haryana hub.
          </p>
        </div>

        {/* Search Lookup Form */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl max-w-xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup();
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Order ID (e.g. RND-2026-1001)
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                  placeholder="Enter order reference number"
                  className="w-full bg-neutral-950 text-white text-xs pl-10 pr-4 py-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#D4AF37] font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-neutral-950 text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Retrieving shipment logs...</span>
              ) : (
                <>
                  <span>Track Consignment Status</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {notFound && (
            <div className="mt-4 p-3 rounded-xl bg-red-950/80 border border-red-800 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Order ID not found. Please verify your order confirmation or WhatsApp 9306667128.</span>
            </div>
          )}
        </div>

        {/* Tracking Details Display */}
        {order && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Status Card */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-800">
                <div>
                  <span className="text-xs text-neutral-400">Shipment ID:</span>
                  <div className="text-lg font-mono font-bold text-white">{order.id}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold border border-[#D4AF37]/40">
                    Status: {order.orderStatus}
                  </span>
                  <button
                    onClick={() => generateOrderInvoicePdf(order)}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                    title="Download Tax Invoice"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Courier Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-400 block text-[11px]">Courier Partner:</span>
                  <strong className="text-white">{order.courierName || 'Delhivery Surface / Air'}</strong>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-400 block text-[11px]">AWB / Tracking Number:</span>
                  <strong className="text-[#D4AF37] font-mono">{order.trackingNumber || 'Pending AWB'}</strong>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-400 block text-[11px]">Origin Dispatch:</span>
                  <strong className="text-white">Gohana, Sonipat, Haryana</strong>
                </div>
              </div>
            </div>

            {/* Timeline Stepper */}
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Delivery Timeline Progress
              </h2>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-800">
                {steps.map((st, idx) => {
                  const status = getStepStatus(st.key);
                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Status Indicator Icon */}
                      <div className="absolute -left-6 sm:-left-8 top-0">
                        {status === 'completed' ? (
                          <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#D4AF37] text-neutral-950 flex items-center justify-center font-bold shadow-md">
                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                        ) : status === 'active' ? (
                          <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#D4AF37] text-neutral-950 flex items-center justify-center font-bold animate-pulse shadow-lg">
                            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                        ) : status === 'pending-verification' ? (
                          <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-500 flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <h4 className={`text-sm font-bold ${status === 'completed' || status === 'active' ? 'text-white' : 'text-neutral-500'}`}>
                          {st.title}
                        </h4>
                        <p className="text-xs text-neutral-400">{st.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Destination Address Card */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-neutral-400 block font-semibold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span>Delivery Destination</span>
                </span>
                <div className="text-white font-bold">{order.customerName} (+91 {order.phone})</div>
                <div className="text-neutral-300">
                  {order.shippingAddress.houseBuilding}, {order.shippingAddress.streetArea}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </div>
              </div>

              <a
                href={`https://wa.me/91${settings.whatsapp}?text=Hi%20RND!%20Need%20update%20on%20my%20order%20${order.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Courier Desk</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
