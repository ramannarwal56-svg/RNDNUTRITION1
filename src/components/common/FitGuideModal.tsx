import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, AlertCircle, ShoppingBag, ArrowRight, RefreshCw } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const FitGuideModal: React.FC = () => {
  const { isFitGuideOpen, closeFitGuide, addToCart, navigate } = useStore();

  const [step, setStep] = useState<'questions' | 'loading' | 'result'>('questions');
  const [goal, setGoal] = useState('Lean Muscle & Strength');
  const [experienceLevel, setExperienceLevel] = useState('Regular Gym Goer (1-3 yrs)');
  const [budget, setBudget] = useState('₹3,000 - ₹5,000 / month');
  const [dietary, setDietary] = useState('Vegetarian');
  const [customQuery, setCustomQuery] = useState('');

  const [aiResult, setAiResult] = useState<{
    recommendation: string;
    recommendedProductIds: string[];
    disclaimer: string;
  } | null>(null);

  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);

  if (!isFitGuideOpen) return null;

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStep('loading');

    try {
      // Fetch full products first to match IDs
      const prodsRes = await fetch('/api/products');
      const prodsData = await prodsRes.json();
      const allProducts: Product[] = prodsData.products || [];

      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          experienceLevel,
          budget,
          dietaryRestrictions: dietary,
          userMessage: customQuery
        })
      });

      if (!res.ok) throw new Error("Failed to get recommendation");
      const data = await res.json();
      setAiResult(data);

      const recProducts = allProducts.filter(p => data.recommendedProductIds?.includes(p.id));
      setMatchedProducts(recProducts.length > 0 ? recProducts : allProducts.slice(0, 2));
      setStep('result');
    } catch (err) {
      console.error("Fit guide error:", err);
      // Fallback
      setAiResult({
        recommendation: `### RND Strength & Lean Protocol
Based on your goal of ${goal} (${experienceLevel}), we recommend pairing **RND Titanium 100% Whey Isolate** for immediate post-workout amino acid delivery, combined with **RND Micronized Creatine (200 Mesh)** taken daily to saturate cellular ATP reserves.

- **Morning / Post-Workout:** 1 scoop Whey Isolate with chilled water.
- **Anytime Daily:** 3g Creatine with fruit juice or shake.
- **Hydration:** Consume at least 3.5 litres of water daily to support creatine uptake.`,
        recommendedProductIds: ["rnd-whey-isolate", "rnd-creatine-micronized"],
        disclaimer: "Food supplements are not medicines. Follow the product label and recommended usage. Consult a qualified healthcare professional before use."
      });
      setStep('result');
    }
  };

  const handleReset = () => {
    setStep('questions');
    setAiResult(null);
  };

  return (
    <div 
      id="fit-guide-modal-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div 
        id="fit-guide-modal-container"
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-6 text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-wide flex items-center gap-2">
                <span>RND FIT GUIDE</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-[#D4AF37] border border-[#D4AF37]/30">
                  AI Nutritionist
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Personalized sports supplement protocol formulated for your body &amp; goals.
              </p>
            </div>
          </div>

          <button
            onClick={closeFitGuide}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        {step === 'questions' && (
          <form onSubmit={handleGenerate} className="py-5 space-y-5">
            {/* Goal */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                1. What is your primary fitness goal?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Lean Muscle & Strength',
                  'Fat Loss & Cutting',
                  'Heavy Mass / Bulking',
                  'Explosive Energy & Pre-Workout Pump',
                  'Daily Health & Recovery'
                ].map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                      goal === g
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                2. Your training experience
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Beginner (< 6 months)', 'Regular (1-3 yrs)', 'Advanced Athlete'].map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setExperienceLevel(lvl)}
                    className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                      experienceLevel === lvl
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Preference & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Dietary Preference
                </label>
                <select
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="Vegetarian">Vegetarian (100% Veg)</option>
                  <option value="No restrictions">No restrictions</option>
                  <option value="Lactose Sensitive">Lactose Sensitive (Pure Isolate)</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Target Monthly Budget
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="Under ₹2,500 (Essentials)">Under ₹2,500 (Essentials)</option>
                  <option value="₹3,000 - ₹5,000 (Optimal Stack)">₹3,000 - ₹5,000 (Optimal Stack)</option>
                  <option value="₹5,000+ (Elite Performance)">₹5,000+ (Elite Performance)</option>
                </select>
              </div>
            </div>

            {/* Custom Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Any specific question or training routine? (Optional)
              </label>
              <textarea
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="e.g., I lift at 6:00 AM, train 5 days a week. Looking for clean recovery without bloating."
                rows={2}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-[#D4AF37] to-amber-500 text-neutral-950 font-black text-sm tracking-wide shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate My Supplement Protocol</span>
            </button>
          </form>
        )}

        {step === 'loading' && (
          <div className="py-16 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
            <h4 className="text-base font-bold text-white">Analyzing RND Supplement Matrix...</h4>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Synthesizing amino profiles, micronutrient timing, and optimal stacks for {goal}...
            </p>
          </div>
        )}

        {step === 'result' && aiResult && (
          <div className="py-5 space-y-6">
            {/* Recommendation Markdown Box */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs leading-relaxed text-neutral-200">
              <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Your Personalized Protocol</span>
              </div>
              <div className="whitespace-pre-line text-neutral-300">
                {aiResult.recommendation}
              </div>
            </div>

            {/* Matched Product Cards */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Recommended RND Products For This Stack
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedProducts.map((p) => (
                  <div 
                    key={p.id}
                    className="p-3 rounded-xl bg-neutral-950/90 border border-neutral-800 flex items-center justify-between gap-3 hover:border-[#D4AF37]/50 transition-colors"
                  >
                    <img 
                      src={p.images[0]} 
                      alt={p.name} 
                      className="w-14 h-14 object-cover rounded-lg bg-neutral-900 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h6 className="text-xs font-bold text-white truncate">{p.name}</h6>
                      <p className="text-[11px] text-neutral-400 truncate">{p.flavour} • {p.weightOrPackSize}</p>
                      <div className="text-xs font-black text-[#D4AF37] mt-0.5">₹{p.salePrice}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => {
                          addToCart(p);
                        }}
                        className="p-2 rounded-lg bg-[#D4AF37] text-black hover:bg-amber-400 transition-colors"
                        title="Add to cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          closeFitGuide();
                          navigate('product', { id: p.slug || p.id });
                        }}
                        className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                        title="View details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Disclaimer */}
            <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/80 flex items-start gap-2.5 text-[11px] text-neutral-400">
              <AlertCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <span>{aiResult.disclaimer}</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Adjust Answers</span>
              </button>

              <button
                onClick={() => {
                  closeFitGuide();
                  navigate('shop');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-neutral-950 text-xs font-bold hover:bg-amber-400 transition-colors"
              >
                Explore Full Catalog
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
