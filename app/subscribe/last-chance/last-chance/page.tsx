// FIX: Changed from CalmEntry_temp to CalmEntry
import CalmEntry from '@/app/components/CalmEntry'; 
import { Playfair_Display } from 'next/font/google';

const serif = Playfair_Display({ subsets: ['latin'] });

export default function LastChancePaywall() {
  const memberfulCheckoutURL = "YOUR_MEMBERFUL_CHECKOUT_URL_HERE"; 
  
  return (
    <CalmEntry>
      <div className={`${serif.className} text-center max-w-lg mx-auto py-20`}>
        <h1 className="text-4xl font-serif text-red-700 tracking-tight">
          The Lock is Active
        </h1>
        <p className="text-xl text-stone-600 mt-6 mb-8">
          The Living Atlas is a permanent library of taste—a utility, not a blog. 
          Access to the Atmospheric Search and Dynamic Field Guides requires the subscription.
        </p>
        
        <p className="text-2xl font-bold mb-8">
          Unlock the Sanctuary for $9/mo.
        </p>
        
        <a 
          href={memberfulCheckoutURL}
          className="inline-block bg-stone-900 text-white px-10 py-5 uppercase text-xs tracking-[0.3em] hover:bg-stone-700 transition-all duration-300"
        >
          Begin Your Ritual ($9/mo)
        </a>
        
        <p className="text-sm mt-8 text-stone-400">
          Seamless access via Memberful—no clunky generic portal.
        </p>
      </div>
    </CalmEntry>
  );
}