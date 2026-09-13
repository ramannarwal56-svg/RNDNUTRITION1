import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, MapPin, Award, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useStore();

  return (
    <div id="rnd-about-page" className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
            <span>Born in Gohana, Haryana</span>
            <span>•</span>
            <span>Fueling India</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-white font-display tracking-tight leading-tight">
            Forged For Raw Athletic Power. 100% Authentic.
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Founded by Raman Narwal in Gohana, Sonipat, RND was created to eradicate adulterated, under-dosed supplements from the Indian fitness ecosystem.
          </p>
        </div>

        {/* Narrative & Founder Message */}
        <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
          <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-display">
            The RND Mission: Zero Compromise Sports Nutrition
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
            <p>
              In recent years, the Indian supplement marketplace has been flooded with spurious fake proteins, masked amino-spiking tricks, and grey-market imports lacking batch tracking. Athletes, bodybuilders, and fitness enthusiasts in Haryana and across India work too hard in the gym to have their health compromised by deceptive formulations.
            </p>
            <p>
              <strong>RND</strong> operates on a simple, uncompromising ethos: <em>Direct Manufacturer-to-Consumer Integrity</em>. Every batch of our Whey Protein, Creapure-standard Creatine, Pre-Workouts, and Mass Gainers is produced under strict GMP certification, verified through third-party NABL-accredited analytical laboratories, and dispatched directly from our Gohana hub.
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Raman Narwal</div>
              <div className="text-xs text-[#D4AF37]">Founder &amp; Managing Director, RND</div>
            </div>
            <div className="text-right text-xs text-neutral-400">
              Gohana, Sonipat, Haryana
            </div>
          </div>
        </div>

        {/* 3 Core Commitments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">Clinical Dosing</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No proprietary blends that hide active doses. You know exactly how many grams of protein, BCAA, and citrulline malate you are getting in every scoop.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">NABL Lab Transparency</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every container comes with a verifiable scratch-off holographic seal that links directly to official batch assay results.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">Gohana Dispatch Hub</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We ship only within India via top-tier express courier services, guaranteeing prompt 24-48 hour delivery in Haryana/NCR and 3-5 days pan-India.
            </p>
          </div>
        </div>

        {/* CTA to Shop */}
        <div className="text-center p-8 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 border border-neutral-800 space-y-4">
          <h2 className="text-2xl font-black uppercase text-white font-display">
            Ready to Experience True Nutrition?
          </h2>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Upgrade your supplement stack with genuine sports formulations crafted for champions.
          </p>
          <button
            onClick={() => navigate('shop')}
            className="px-8 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-neutral-950 text-xs font-black uppercase tracking-wider transition-all shadow-lg inline-flex items-center gap-2"
          >
            <span>Explore RND Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
