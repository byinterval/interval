'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

function WelcomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState('verifying'); // verifying | granted

  useEffect(() => {
    // 1. THE HANDSHAKE
    // We run this immediately when the page loads
    const performHandshake = () => {
      
      // A. Set the "Active" status in Local Storage
      localStorage.setItem('interval_membership_status', 'active');
      
      // B. Capture email if Lemon Squeezy sent it
      const email = searchParams.get('user_email');
      if (email) localStorage.setItem('interval_user_email', email);

      // C. SET THE COOKIE (The Golden Key)
      // This is what the Middleware and Member Hook look for.
      document.cookie = "interval_session=true; path=/; max-age=31536000; SameSite=Lax";

      // D. Broadcast the change so the Navbar updates instantly
      window.dispatchEvent(new Event('storage'));

      // E. Show the "Enter" button after a brief "Verification" delay
      setTimeout(() => {
        setStep('granted');
      }, 2000);
    };

    performHandshake();
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[#F4F4F0] flex flex-col items-center justify-center text-center p-6">
      <AnimatePresence mode='wait'>
        
        {/* STATE 1: VERIFYING (The Loading Bar) */}
        {step === 'verifying' && (
          <motion.div 
            key="verifying"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md w-full"
          >
            <div className="w-16 h-16 bg-accent-brown mx-auto mb-8 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-[#F4F4F0] rounded-full" />
            </div>
            <h1 className="font-serif-title text-2xl text-brand-ink mb-4">
              Verifying Credentials...
            </h1>
            <div className="w-full h-px bg-accent-brown/20 relative overflow-hidden mt-8">
                <motion.div 
                    className="absolute inset-0 bg-accent-brown"
                    initial={{ x: '-100%' }}
                    animate={{ x: '0%' }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                />
            </div>
          </motion.div>
        )}

        {/* STATE 2: ACCESS GRANTED (The Button) */}
        {step === 'granted' && (
          <motion.div 
            key="granted"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-md w-full"
          >
             <span className="font-sans-body text-xs text-accent-brown uppercase tracking-[0.2em] mb-6 block">
                Membership Confirmed
             </span>
             
             <h1 className="font-serif-title text-5xl md:text-6xl text-brand-ink mb-12">
               Welcome to<br/>The Interval.
             </h1>

             {/* THE ENTRY BUTTON */}
             <button
               onClick={() => router.push('/')} // Sends them to Issue 01
               className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-sans-body text-xs font-medium tracking-[0.2em] text-white bg-brand-ink rounded-full transition-all duration-300 hover:bg-accent-brown hover:scale-105 hover:shadow-xl uppercase"
             >
               <span className="relative z-10">Enter Issue No. 01</span>
             </button>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F4F0]" />}>
      <WelcomeContent />
    </Suspense>
  );
}