import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Shield, FileText, Truck, RefreshCcw, AlertTriangle } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const { routeParams } = useStore();
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'shipping' | 'refund' | 'disclaimer'>('terms');

  useEffect(() => {
    if (routeParams.policy) {
      if (['terms', 'privacy', 'shipping', 'refund', 'disclaimer'].includes(routeParams.policy)) {
        setActiveTab(routeParams.policy as any);
      }
    }
  }, [routeParams.policy]);

  return (
    <div id="rnd-legal-page" className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-display">
            Policies &amp; Legal Transparency
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            RND operates with total legal compliance under Indian ecommerce, FSSAI, and consumer protection laws.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800">
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'terms' ? 'bg-[#D4AF37] text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'privacy' ? 'bg-[#D4AF37] text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'shipping' ? 'bg-[#D4AF37] text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Shipping Policy
          </button>
          <button
            onClick={() => setActiveTab('refund')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'refund' ? 'bg-[#D4AF37] text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Return &amp; Refund
          </button>
          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'disclaimer' ? 'bg-[#D4AF37] text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Supplement Disclaimer
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-neutral-300 space-y-6 leading-relaxed">
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white uppercase font-display">Terms and Conditions of Use</h2>
              <p>
                Welcome to RND Sports Nutrition (website operated from Gohana, Sonipat, Haryana, India). By accessing or purchasing from this store, you agree to be bound by Indian ecommerce regulations and the terms stated herein.
              </p>
              <h3 className="text-white font-bold text-sm pt-2">1. Scope of Service &amp; Geography</h3>
              <p>
                RND sells and delivers sports nutrition, dietary supplements, and gym accessories exclusively within the territorial borders of the Republic of India. We do not accept or process orders for international shipping outside India.
              </p>
              <h3 className="text-white font-bold text-sm pt-2">2. Single-Brand Authenticity Guarantee</h3>
              <p>
                All formulations listed on this store are manufactured and packaged under certified GMP and FSSAI standards. We guarantee 100% authentic inventory dispatched directly from our Gohana central facility without unauthorized intermediaries.
              </p>
              <h3 className="text-white font-bold text-sm pt-2">3. Jurisdiction</h3>
              <p>
                Any legal disputes arising out of contracts or transactions shall be subject to the exclusive jurisdiction of the competent courts in Sonipat / Haryana, India.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white uppercase font-display">Privacy &amp; Data Protection Policy</h2>
              <p>
                Your privacy is paramount. RND respects the Information Technology Act (2000) and the Digital Personal Data Protection Act of India.
              </p>
              <h3 className="text-white font-bold text-sm pt-2">1. Information We Collect</h3>
              <p>
                We collect your phone number for OTP verification, name, delivery shipping address, and email for tax invoice delivery and courier status SMS updates.
              </p>
              <h3 className="text-white font-bold text-sm pt-2">2. Non-Disclosure &amp; Zero Spam</h3>
              <p>
                We will never sell, lease, or distribute your customer data or phone numbers to third-party telemarketers. All transaction credentials (UPI strings, card tokens) are securely handled through encrypted gateways.
              </p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white uppercase font-display">Shipping &amp; Delivery Policy</h2>
              <p>
                RND ships to all serviceable Indian PIN codes via trusted surface and air express courier partners (Delhivery, BlueDart, DTDC).
              </p>
              <h3 className="text-white font-bold text-sm pt-2">1. Free Shipping Threshold</h3>
              <p>
                All orders with a cart subtotal of <strong>₹999 or above</strong> qualify for 100% FREE delivery across India. Orders below ₹999 incur a standard nominal shipping charge of ₹99.
              </p>
              <h3 className="text-white font-bold text-sm pt-2">2. Estimated Delivery Timelines</h3>
              <ul className="list-disc pl-5 space-y-1 text-neutral-400">
                <li>Haryana, Delhi NCR, Punjab: <strong>24 – 48 Hours</strong></li>
                <li>North India &amp; Major Metros (Mumbai, Bengaluru, Kolkata, Chennai): <strong>2 – 4 Days</strong></li>
                <li>Rest of India: <strong>3 – 5 Days</strong></li>
              </ul>
              <h3 className="text-white font-bold text-sm pt-2">3. Dispatch Facility</h3>
              <p>
                All orders are packed and dispatched directly from RND Sports Nutrition, Gohana, Sonipat, Haryana. AWB tracking links are provided via SMS and order tracking.
              </p>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white uppercase font-display">Return, Replacement &amp; Refund Policy</h2>
              <p>
                Because dietary supplements are consumable products subject to strict food safety guidelines, returns are governed by the following criteria:
              </p>
              <h3 className="text-white font-bold text-sm pt-2">1. Unopened Sealed Tubs</h3>
              <p>
                You may request a return within <strong>7 days</strong> of delivery if the container's outer tamper-evident seal is completely intact and unopened.
              </p>
              <h3 className="text-white font-bold text-sm pt-2">2. Transit Damage &amp; Defective Items</h3>
              <p>
                If your package arrives damaged, unsealed, or leaked during courier transit, contact us on WhatsApp (<strong>9306667128</strong>) within 24 hours with photos or unboxing video. We will dispatch an immediate replacement free of charge.
              </p>
              <h3 className="text-white font-bold text-sm pt-2">3. Refund Processing</h3>
              <p>
                Approved refunds are credited back to your original source account (UPI or bank account) within 3-5 business days.
              </p>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#D4AF37]" />
                <span className="font-bold text-xs uppercase tracking-wider">Statutory Supplement Notice</span>
              </div>
              <h2 className="text-lg font-bold text-white uppercase font-display">FSSAI Supplement &amp; Health Disclaimer</h2>
              <p className="leading-relaxed">
                Food supplements are not medicines. Follow the product label and recommended usage. Consult a qualified healthcare professional before use if you have a medical condition, take medication, are pregnant, or are breastfeeding.
              </p>
              <p className="leading-relaxed">
                Statements and formulations regarding dietary supplements have not been evaluated by any drug administration for the diagnosis, cure, mitigation, treatment, or prevention of any disease. Products are intended to supplement fitness, athletic training, and balanced dietary regimens in healthy adults.
              </p>
              <p className="text-neutral-400 text-xs">
                FSSAI Category: Health Supplements / Nutraceuticals / Foods for Special Dietary Use.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
