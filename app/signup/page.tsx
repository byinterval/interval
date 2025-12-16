'use client';
import { useState, useEffect } from 'react';
import CalmEntry from '@/app/components/CalmEntry';

export default function SignUpPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // REPLACE THESE WITH YOUR REAL LEMON SQUEEZY LINKS
  const CHECKOUT_URLS = {
    monthly: 'https://theinterval.lemonsqueezy.com/buy/95a294a6-75fb-4cbf-a5d0-6cdb2e6cffb6?enabled=1153473', 
    annual: 'https://theinterval.lemonsqueezy.com/buy/2ddf2910-8144-4403-b81b-eec93648dd9f?enabled=1153468'   
  };

  const activeUrl = billingCycle === 'monthly' ? CHECKOUT_URLS.monthly : CHECKOUT_URLS.annual;
  const activePrice = billingCycle === 'monthly' ? '£8/month' : '£80/year';

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
        window.location.href = activeUrl;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A]">
      <CalmEntry>
        <main className="max-w-4xl mx-auto px-6 pt-32 md:pt-48 pb-24 flex flex-col items-center">
          
          <section className="text-center max-w-2xl mb-24 md:mb-32">
            <h1 className="font-serif-title text-4xl md:text-6xl leading-[1.1] mb-12">
              The internet is noisy.<br/>
              Your mind shouldn't be.
            </h1>
            <p className="font-serif-title text-xl md:text-2xl leading-relaxed text-[#1A1A1A]/80 mb-12">
              Join the Founding Members of The Interval and reclaim 5 minutes of calm every week.
            </p>
            
            <button
              onClick={openCheckout}
              className="inline-block border border-[#1A1A1A] text-[#1A1A1A] px-8 py-4 uppercase text-xs tracking-[0.2em] font-sans-body hover:bg-[#1A1A1A] hover:text-[#FDFBF7] transition-all duration-500"
            >
              Become a Member {activePrice}
            </button>
          </section>

          {/* ... (Ledger and Commitment sections remain same as previous design) ... */}
           {/* Re-use the Ledger/Pricing UI code from previous turn if needed, or ask me to output full file again */}
        </main>
      </CalmEntry>
    </div>
  );
}