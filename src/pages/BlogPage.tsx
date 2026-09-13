import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BookOpen, Clock, User, ArrowRight, Sparkles, Tag, ChevronRight, CheckCircle2 } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  excerpt: string;
  content: string[];
  recommendedCategory?: string;
  image: string;
}

export const BlogPage: React.FC = () => {
  const { navigate, openFitGuide } = useStore();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const articles: Article[] = [
    {
      id: 'creatine-guide',
      title: 'How to Take Micronized Creatine Monohydrate (200 Mesh) for Maximum Strength',
      category: 'Creatine',
      readTime: '4 min read',
      date: 'June 2026',
      author: 'Raman Narwal, RND Founder',
      excerpt: 'Debunking the loading phase myth, hydration protocols, and why 200-mesh ultra-micronized creatine absorbs faster without stomach cramps.',
      image: './images/rnd_creatine_container_1789192533564.jpg',
      recommendedCategory: 'Creatine',
      content: [
        'Creatine monohydrate is the single most extensively researched sports supplement in human exercise history. It works by donating a high-energy phosphate molecule to ADP, regenerating ATP (adenosine triphosphate) during heavy 1–5 rep sets and explosive sprinting.',
        'Many beginners ask whether a loading phase of 20g per day for 5 days is strictly mandatory. The scientific consensus shows that while loading saturates muscle creatine stores within 5–7 days, taking a steady 3g to 5g daily reaches full cellular saturation in 3–4 weeks without gastrointestinal distress.',
        'RND Micronized Creatine is processed to an ultra-fine 200 Mesh particle size. Standard creatine often sits like sand at the bottom of the shaker; 200-mesh dissolves effortlessly and passes through the stomach wall rapidly.',
        'Hydration rule: Drink an extra 500ml of clean water daily for every 3g of creatine to facilitate intracellular muscle volumization.'
      ]
    },
    {
      id: 'whey-isolate-timing',
      title: 'Whey Protein Isolate vs Concentrate: Which Suits Indian Diets Better?',
      category: 'Whey Protein',
      readTime: '5 min read',
      date: 'May 2026',
      author: 'RND Research Desk',
      excerpt: 'Understanding lactose content, digestion rates, and why Whey Isolate delivers 90%+ protein density with virtually zero fat and carbs.',
      image: './images/rnd_whey_protein_1789192519698.jpg',
      recommendedCategory: 'Whey Protein',
      content: [
        'Traditional Indian vegetarian diets (roti, dal, paneer, rice) are rich in carbohydrates and healthy fats, but frequently fall short of the optimal 1.6g–2.0g protein per kilogram of bodyweight needed for hypertrophy.',
        'Whey Protein Concentrate typically contains 70–80% protein along with residual lactose, milk sugars, and fats. For people with mild lactose sensitivity (common in North India), this can cause bloating.',
        'RND Titanium Whey Isolate undergoes cross-flow microfiltration to remove almost 99% of lactose, fat, and ash, leaving 28g of clean bioavailable protein per 30g scoop. Enhanced with DigeZyme® digestive enzymes, absorption is smooth and immediate.'
      ]
    },
    {
      id: 'preworkout-safety',
      title: 'Pre-Workout Timing & Caffeine Tolerance: Maximizing Your Gym Session',
      category: 'Pre-Workout',
      readTime: '4 min read',
      date: 'May 2026',
      author: 'Raman Narwal',
      excerpt: 'How to avoid caffeine crashes, when to cycle off pre-workout stimulants, and the critical role of L-Citrulline in nitric oxide vasodilation.',
      image: './images/rnd_preworkout_tub_1789192545387.jpg',
      recommendedCategory: 'Pre-Workout',
      content: [
        'Pre-workouts are designed to sharpen mental focus, boost blood flow to working muscles, and buffer lactic acid during high-volume training.',
        'Peak caffeine concentration in the bloodstream occurs approximately 30 to 45 minutes after ingestion. Drinking your pre-workout on the drive to the gym ensures peak alertness as you finish your warm-up sets.',
        'RND Ignition X pairs 300mg of clean caffeine with 4000mg fermented L-Citrulline and 3200mg Beta-Alanine. L-Citrulline increases nitric oxide production, expanding blood vessels and giving you full muscular pumps without high blood pressure spikes.'
      ]
    },
    {
      id: 'fssai-counterfeit-spotting',
      title: 'How to Spot Fake Supplements in India: 5 Golden Authenticity Rules',
      category: 'Authenticity',
      readTime: '6 min read',
      date: 'April 2026',
      author: 'RND Quality & Compliance',
      excerpt: 'Counterfeit supplements remain a major issue in the Indian fitness market. Here is how RND protects every tub shipped from Gohana.',
      image: './images/rnd_hero_banner_1789192600800.jpg',
      recommendedCategory: 'Whey Protein',
      content: [
        '1. Direct-to-Consumer Dispatches: Middlemen and unverified regional wholesalers are the most common source of adulterated tubs. RND ships 100% of orders directly from our Gohana central facility.',
        '2. Holographic QR Batch Codes: Every RND tub features an individual holographic scratch-off security seal linked to real-time database validation.',
        '3. FSSAI & NABL Lab Reports: You can verify the third-party NABL certificate of analysis for your specific manufacturing batch right on our website.',
        '4. Seal Quality: Check for ultrasonic neck seals that cannot be removed and resealed without noticeable tearing.'
      ]
    }
  ];

  const filteredArticles = activeCategory === 'All' 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  return (
    <div id="rnd-blog-page" className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Science-Backed Training &amp; Nutrition</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-display">
            RND Performance Knowledge Base
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Real exercise science, supplement breakdowns, and honest advice from Raman Narwal and the Gohana sports nutrition team.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {['All', 'Creatine', 'Whey Protein', 'Pre-Workout', 'Authenticity'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeCategory === cat
                  ? 'bg-[#D4AF37] text-neutral-950 font-black shadow-md'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredArticles.map(article => (
            <article
              key={article.id}
              className="group bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-neutral-950">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[#D4AF37] text-[10px] font-bold uppercase border border-[#D4AF37]/30">
                    {article.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-4 text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {article.readTime}
                    </span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-neutral-800/80">
                <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  {article.author}
                </span>

                <button
                  onClick={() => setSelectedArticle(article)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#D4AF37] hover:underline"
                >
                  <span>Read Article</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* AI Fit Guide Callout */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-neutral-900 via-amber-950/20 to-neutral-900 border border-[#D4AF37]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <span>Need Personalized Supplement Advice?</span>
            </h3>
            <p className="text-xs text-neutral-400 max-w-lg">
              Our AI Fit Guide uses verified sports-nutrition guidelines to build your custom daily stack based on your bodyweight, training routine, and diet.
            </p>
          </div>

          <button
            onClick={openFitGuide}
            className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-neutral-950 font-black uppercase text-xs tracking-wider transition-all whitespace-nowrap shadow-lg"
          >
            Launch AI Fit Guide
          </button>
        </div>

        {/* Reading Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
            <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-700 rounded-3xl p-6 sm:p-8 text-white space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  {selectedArticle.category} Guide
                </span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold"
                >
                  Close
                </button>
              </div>

              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center gap-4 text-xs text-neutral-400">
                  <span>By {selectedArticle.author}</span>
                  <span>•</span>
                  <span>{selectedArticle.date}</span>
                  <span>•</span>
                  <span>{selectedArticle.readTime}</span>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {selectedArticle.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {selectedArticle.recommendedCategory && (
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-white">Recommended RND Formulation</div>
                    <div className="text-[11px] text-neutral-400">
                      Explore lab-tested {selectedArticle.recommendedCategory} products
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedArticle(null);
                      navigate('shop', { category: selectedArticle.recommendedCategory });
                    }}
                    className="px-4 py-2 rounded-xl bg-[#D4AF37] text-neutral-950 font-bold text-xs hover:bg-amber-400"
                  >
                    View Products
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
