import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Logo } from './Logo';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RefreshCcw, 
  Award,
  ArrowUpRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, settings, showToast } = useStore();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Thank you for subscribing to RND Elite Nutrition alerts!", "success");
  };

  return (
    <footer id="rnd-global-footer" className="bg-neutral-950 text-neutral-300 border-t border-neutral-800/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Badges Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-neutral-800">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <div className="p-3 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">100% Authentic</h4>
              <p className="text-xs text-neutral-400">Direct from Gohana facility with QR & batch seal.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <div className="p-3 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">India-Wide Delivery</h4>
              <p className="text-xs text-neutral-400">Delhi-NCR next day. Free shipping on orders &gt; ₹999.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <div className="p-3 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Lab Tested Purity</h4>
              <p className="text-xs text-neutral-400">Heavy metals checked &amp; NABL third-party verified.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <div className="p-3 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Hassle-Free Support</h4>
              <p className="text-xs text-neutral-400">Direct founder &amp; nutrition helpline on 9306667128.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand & Address Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              RND is an Indian sports-nutrition brand committed to pure, unadulterated gym supplements for athletes, bodybuilders, and fitness enthusiasts across India.
            </p>

            <div className="space-y-2 pt-2 text-xs text-neutral-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>RND Sports Nutrition, Gohana, Sonipat, Haryana, India (PIN 131301)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>Phone / WhatsApp: <strong className="text-white">9306667128</strong></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>Email: <strong className="text-white">{settings.email}</strong></span>
              </div>
            </div>

            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] text-[#D4AF37] font-semibold">
                FSSAI Central / State Reg: {settings.fssaiNumberPlaceholder}
              </span>
            </div>
          </div>

          {/* Categories Column */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-white">Categories</h5>
            <ul className="space-y-2 text-sm">
              {[
                'Whey Protein',
                'Creatine',
                'Pre-Workout',
                'Mass Gainer',
                'Fat Burner',
                'Protein Bars',
                'Multivitamins'
              ].map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => navigate('shop', { category: cat })}
                    className="text-neutral-400 hover:text-[#D4AF37] transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care & Tools */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-white">Direct Access</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate('authenticity')} className="text-neutral-400 hover:text-[#D4AF37] transition-colors">
                  Verify Batch Authenticity
                </button>
              </li>
              <li>
                <button onClick={() => navigate('track')} className="text-neutral-400 hover:text-[#D4AF37] transition-colors">
                  Track Delivery Status
                </button>
              </li>
              <li>
                <button onClick={() => navigate('safety')} className="text-neutral-400 hover:text-[#D4AF37] transition-colors">
                  Safety &amp; RDA Standards
                </button>
              </li>
              <li>
                <button onClick={() => navigate('compare')} className="text-neutral-400 hover:text-[#D4AF37] transition-colors">
                  Supplement Comparison Matrix
                </button>
              </li>
              <li>
                <button onClick={() => navigate('blog')} className="text-neutral-400 hover:text-[#D4AF37] transition-colors">
                  Fitness &amp; Nutrition Guides
                </button>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="text-neutral-400 hover:text-[#D4AF37] transition-colors">
                  About RND Story
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="text-neutral-400 hover:text-[#D4AF37] transition-colors">
                  Contact RND Gohana
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Policy Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-white">Policies &amp; Legal</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate('shipping-policy')} className="text-neutral-400 hover:text-[#D4AF37] transition-colors">
                  Shipping Policy (India)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('return-policy')} className="text-neutral-400 hover:text-[#D4AF37] transition-colors">
                  Returns &amp; Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('terms')} className="text-neutral-400 hover:text-[#D4AF37] transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => navigate('privacy-policy')} className="text-neutral-400 hover:text-[#D4AF37] transition-colors">
                  Privacy Policy
                </button>
              </li>
            </ul>

            <div className="pt-4">
              <h6 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Join RND Athletes Club</h6>
              <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-1">
                <input
                  type="email"
                  required
                  placeholder="Enter email..."
                  className="bg-neutral-900 text-white text-xs px-3 py-2 rounded border border-neutral-700 w-full focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded bg-[#D4AF37] text-neutral-950 text-xs font-bold hover:bg-amber-400"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Mandatory Supplement & Health Disclaimer (Full Compliance) */}
        <div className="my-8 p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-400 text-xs space-y-2 leading-relaxed">
          <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-[11px] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Supplement Compliance &amp; Health Notice</span>
          </div>
          <p>
            Food supplements are not medicines. Follow the product label and recommended usage. Consult a qualified healthcare professional before use if you have a medical condition, take medication, are pregnant, or are breastfeeding. Products displayed on this website are not intended to diagnose, treat, cure, or prevent any disease. Results may vary from individual to individual depending on diet, training consistency, and genetics.
          </p>
          <p className="text-[11px] text-neutral-500">
            Delivery available exclusively within Republic of India. All prices are inclusive of applicable GST.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 text-xs text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} RND Sports Nutrition. All Rights Reserved. Gohana, Sonipat, Haryana, India.
          </div>

          {/* Payment Icons / Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded font-semibold text-[10px] text-neutral-300">
              UPI Instant
            </span>
            <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded font-semibold text-[10px] text-neutral-300">
              Google Pay
            </span>
            <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded font-semibold text-[10px] text-neutral-300">
              PhonePe
            </span>
            <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded font-semibold text-[10px] text-neutral-300">
              Paytm
            </span>
            <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded font-semibold text-[10px] text-neutral-300">
              RuPay / Cards
            </span>
            <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded font-semibold text-[10px] text-neutral-300">
              Cash on Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
