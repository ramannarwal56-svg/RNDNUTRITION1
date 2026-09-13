import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, showToast } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Query');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      showToast("Please fill in all required fields", "warning");
      return;
    }
    setSubmitted(true);
    showToast("Message received! Our Gohana desk will contact you within 2 hours.", "success");
  };

  return (
    <div id="rnd-contact-page" className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
            <span>Direct Athlete Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-display">
            Contact RND Sports Nutrition
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Reach Raman Narwal and the team directly at our Gohana headquarters for wholesale inquiries, order tracking, and stack recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Phone & WhatsApp Card */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase">Official Phone Helpline</h3>
                  <a href={`tel:+91${settings.phone}`} className="text-xs text-neutral-300 hover:text-[#D4AF37] font-mono">
                    +91 {settings.phone}
                  </a>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase">Instant WhatsApp Desk</h3>
                  <a 
                    href={`https://wa.me/91${settings.whatsapp}?text=Hello%20RND!%20I%20have%20an%20inquiry.`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:underline font-mono"
                  >
                    +91 {settings.whatsapp} (Chat Now)
                  </a>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-600/20 text-blue-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase">Email Support</h3>
                  <a href={`mailto:${settings.email}`} className="text-xs text-neutral-300 hover:text-white">
                    {settings.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Warehouse Location Card */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>Headquarters &amp; Dispatch Facility</span>
              </div>
              <p className="text-neutral-300 leading-relaxed">
                RND Sports Nutrition<br />
                Gohana, Sonipat, Haryana, India - 131301
              </p>
              <div className="flex items-center gap-1.5 text-neutral-400 pt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Operational Hours: 9:00 AM – 9:00 PM IST (Mon - Sun)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
            <h2 className="text-base font-bold uppercase tracking-wider text-white">
              Send a Direct Message
            </h2>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-neutral-950 border border-emerald-500/40 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">Thank You!</h3>
                <p className="text-xs text-neutral-300 max-w-sm mx-auto">
                  Your message has been sent to Raman Narwal. We will reply via WhatsApp or phone shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sahil Dahiya"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 9812345678"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sahil@example.com"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Product Query">Supplement / Stack Query</option>
                      <option value="Order Tracking">Order Status &amp; Tracking</option>
                      <option value="Authenticity Check">Authenticity Verification</option>
                      <option value="Wholesale Bulk">Gym Trainer / Wholesale Bulk Order</option>
                      <option value="Feedback">Feedback or Suggestion</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist your fitness goals today?"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-neutral-950 text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Gohana Desk</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
