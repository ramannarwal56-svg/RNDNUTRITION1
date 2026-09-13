import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { User, X } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, sendEmailOtp, loginWithEmail, showToast } = useStore();
  const [emailInput, setEmailInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast("Please enter a valid email address", "warning");
      return;
    }
    setAuthLoading(true);
    try {
      const res = await sendEmailOtp(cleanEmail);
      setOtpSent(true);
      showToast("OTP sent to your email address!", "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to send OTP", "error");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput || otpInput.length < 4) {
      showToast("Please enter the OTP received", "warning");
      return;
    }
    setAuthLoading(true);
    try {
      const cleanEmail = emailInput.toLowerCase().trim();
      await loginWithEmail(cleanEmail, otpInput.trim());
      showToast("Welcome to RND Sports Nutrition!", "success");
      setOtpSent(false);
      setOtpInput('');
      closeAuthModal();
    } catch (err: any) {
      showToast(err?.message || "Invalid OTP entered", "error");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl transition-all">
      <div className="bg-neutral-900/50 border border-[#D4AF37]/40 w-full max-w-md rounded-3xl shadow-[0_0_50px_-12px_rgba(212,175,55,0.4)] overflow-hidden relative animate-in fade-in zoom-in duration-300 backdrop-blur-2xl ring-1 ring-white/10">
        <button 
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white font-display">
              Sign In to Continue
            </h2>
            <p className="text-sm text-neutral-400">
              Please verify your email address to purchase authentic products.
            </p>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4 mt-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Email Address</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-neutral-500 font-bold">✉️</span>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="athlete@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all font-mono"
                    
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={authLoading || emailInput.length < 5}
                className="w-full bg-[#D4AF37] text-neutral-950 py-3.5 rounded-xl font-bold uppercase tracking-wide hover:bg-[#F3E5AB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {authLoading ? 'Sending...' : 'Send Secure OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 mt-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Enter OTP</label>
                <div className="text-xs text-neutral-400 mb-2">OTP sent to {emailInput}</div>
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  className="w-full px-4 py-3 bg-neutral-950 border border-[#D4AF37]/50 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all font-mono text-center tracking-[0.5em] text-lg"
                  
                  autoFocus
                  required
                />
                
              </div>
              <button
                type="submit"
                disabled={authLoading || otpInput.length < 4}
                className="w-full bg-[#D4AF37] text-neutral-950 py-3.5 rounded-xl font-bold uppercase tracking-wide hover:bg-[#F3E5AB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {authLoading ? 'Verifying...' : 'Verify & Login'}
              </button>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full py-2 text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Change email address
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
