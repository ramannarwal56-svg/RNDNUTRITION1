import React, { useState } from 'react';
import { MessageCircle, X, Send, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customText, setCustomText] = useState('');

  const phone = settings.whatsapp || "9306667128";

  const quickMessages = [
    { label: "Help me pick the right supplement", text: "Hi RND! I need personalized guidance choosing the right supplement stack for my fitness goals." },
    { label: "Question about my order / delivery", text: "Hi RND Team, I have a query regarding my recent order and delivery status." },
    { label: "Batch authenticity verification", text: "Hi RND, I want to confirm the authenticity of my product batch code." },
    { label: "Direct inquiry to Raman Narwal", text: "Hi Raman, contacting you regarding RND sports nutrition products." }
  ];

  const handleSend = (textToSend: string) => {
    const encoded = encodeURIComponent(textToSend || customText || "Hi RND Sports Nutrition!");
    const url = `https://wa.me/91${phone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setCustomText('');
  };

  return (
    <div id="rnd-floating-whatsapp" className="fixed bottom-6 right-6 z-40">
      {/* Expanded Quick Message Dialog */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl p-4 text-white animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold">RND Official WhatsApp</h4>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Online • Gohana, Haryana</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-3 text-xs text-neutral-300">
            Direct WhatsApp helpline with RND founder &amp; certified sports nutrition advisors. Select a quick inquiry:
          </div>

          <div className="space-y-1.5 mb-3">
            {quickMessages.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item.text)}
                className="w-full text-left p-2 rounded-lg bg-neutral-950/80 border border-neutral-800 hover:border-emerald-500/60 hover:bg-emerald-950/20 text-xs text-neutral-200 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Or type custom question..."
              className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend(customText);
              }}
            />
            <button
              onClick={() => handleSend(customText)}
              className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
              title="Send to WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[10px] text-neutral-400">
            <span>Official helpline: +91 {phone}</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              Verified Brand
            </span>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        id="whatsapp-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-[0_4px_20px_rgba(16,185,129,0.35)] transition-all duration-300 hover:scale-105"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="hidden sm:inline">Chat on WhatsApp</span>
      </button>
    </div>
  );
};
