'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import CalmEntry from '@/app/components/CalmEntry';

export default function SignUpPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // LEMON SQUEEZY VARIANT URLS
  // Replace these with your actual Lemon Squeezy checkout URLs for each variant
  const CHECKOUT_URLS = {
    monthly: 'https://store.theinterval.com/checkout/buy/11111?embed=1', 
    annual: 'https://store.theinterval.com/checkout/buy/22222?embed=1'   
  };

  const activeUrl = billingCycle === 'monthly' ? CHECKOUT_URLS.monthly : CHECKOUT_URLS.annual;
  const activePrice = billingCycle === 'monthly' ? '£8/month' : '£80/year';

  // Initialize Lemon Squeezy on mount to ensure the overlay script works
  useEffect(() => {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.createLemonSqueezy) {
      // @ts-ignore
      window.createLemonSqueezy();
    }
  }, []);

  const openCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    // @ts-ignore
    if (typeof window !== 'undefined' && window.LemonSqueezy) {
      // @ts-ignore
      window.LemonSqueezy.Url.Open(activeUrl);
    } else {
        // Fallback if script hasn't loaded yet
        window.location.href = activeUrl;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A]">
      <CalmEntry>
        {/* Navigation Removed per request */}

        <main className="max-w-4xl mx-auto px-6 pt-32 md:pt-48 pb-24 flex flex-col items-center">
          
          {/* ZONE A: THE MANIFESTO */}
          <section className="text-center max-w-2xl mb-24 md:mb-32">
            <h1 className="font-serif-title text-4xl md:text-6xl leading-[1.1] mb-12">
              The internet is noisy.<br/>
              Your mind shouldn't be.
            </h1>
            <p className="font-serif-title text-xl md:text-2xl leading-relaxed text-[#1A1A1A]/80 mb-12">
              Join the Founding Members of The Interval and reclaim 5 minutes of calm every week.
            </p>
            
            {/* Primary CTA - Triggers Lemon Squeezy Overlay */}
            <button
              onClick={openCheckout}
              className="inline-block border border-[#1A1A1A] text-[#1A1A1A] px-8 py-4 uppercase text-xs tracking-[0.2em] font-sans-body hover:bg-[#1A1A1A] hover:text-[#FDFBF7] transition-all duration-500"
            >
              Become a Member {activePrice}
            </button>
          </section>

          {/* ZONE B: THE LEDGER (Value Pillars) */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full mb-32 border-t border-[#E5E5E5] pt-16">
            {/* Pillar 1 */}
            <div className="text-center space-y-4">
              <div className="h-12 flex items-center justify-center">
                {/* Ritual Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3 className="font-sans-body text-sm uppercase tracking-widest">The Ritual</h3>
              <p className="font-sans-body text-xs text-[#1A1A1A]/70 leading-relaxed max-w-[200px] mx-auto">
                The Thursday Micro-Drop. The Thesis, The Signal, The Artifact.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="text-center space-y-4">
              <div className="h-12 flex items-center justify-center">
                {/* Atlas Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M3 3v18h18"/>
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                </svg>
              </div>
              <h3 className="font-sans-body text-sm uppercase tracking-widest">The Atlas</h3>
              <p className="font-sans-body text-xs text-[#1A1A1A]/70 leading-relaxed max-w-[200px] mx-auto">
                Unlimited access to the Living Atlas and Atmospheric Search.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="text-center space-y-4">
              <div className="h-12 flex items-center justify-center">
                {/* Vault Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="4" y="4" width="16" height="16" rx="2"/>
                  <path d="M12 4v16"/>
                </svg>
              </div>
              <h3 className="font-sans-body text-sm uppercase tracking-widest">Personal Library</h3>
              <p className="font-sans-body text-xs text-[#1A1A1A]/70 leading-relaxed max-w-[200px] mx-auto">
                Save, curate, and export your own library of references.
              </p>
            </div>
          </section>

          {/* ZONE C: THE COMMITMENT (Pricing Card) */}
          <section className="w-full max-w-lg border border-[#E5E5E5] p-8 md:p-12 relative bg-white">
            {/* The Badge */}
            <div className="absolute -top-4 -right-4 bg-[#1A1A1A] text-[#FDFBF7] rounded-full w-24 h-24 flex items-center justify-center text-center p-2 transform rotate-12 shadow-xl">
              <span className="font-sans-body text-[8px] uppercase tracking-widest leading-tight">
                Founding Member<br/>2025
              </span>
            </div>

            <div className="text-center space-y-8">
              <h3 className="font-serif-title text-2xl">Choose your commitment</h3>
              
              {/* Toggle */}
              <div className="inline-flex border border-[#1A1A1A] p-1">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 text-xs uppercase tracking-widest transition-colors ${
                    billingCycle === 'monthly' ? 'bg-[#1A1A1A] text-[#FDFBF7]' : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/5'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-6 py-2 text-xs uppercase tracking-widest transition-colors ${
                    billingCycle === 'annual' ? 'bg-[#1A1A1A] text-[#FDFBF7]' : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/5'
                  }`}
                >
                  Annual
                </button>
              </div>

              <div className="space-y-2">
                <p className="font-serif-title text-4xl">{activePrice}</p>
                {billingCycle === 'annual' && (
                  <p className="font-sans-body text-[10px] uppercase tracking-widest text-[#1A1A1A]/60">
                    (Two Months Free)
                  </p>
                )}
              </div>

              {/* Dynamic Checkout Button */}
              <button
                onClick={openCheckout}
                className="block w-full bg-[#1A1A1A] text-[#FDFBF7] py-4 uppercase text-xs tracking-[0.2em] hover:bg-[#5D514C] transition-colors"
              >
                Become a Member
              </button>

              <p className="font-serif-title italic text-sm text-[#1A1A1A]/40">
                Pause or cancel anytime from your Registry.
              </p>
            </div>
          </section>

        </main>
      </CalmEntry>
    </div>
  );
}