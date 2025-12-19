'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

function WelcomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Initializing Ritual...');

  useEffect(() => {
    // 1. CAPTURE DATA
    // Lemon Squeezy sends data back in the URL parameters
    const email = searchParams.get('user_email') || localStorage.getItem('interval_user_email');
    const name = searchParams.get('user_name');

    setStatus('Verifying Membership...');

    if (email) {
      // 2. SAVE TO STORAGE (For the UI to display "Founding Member")
      localStorage.setItem('interval_membership_status', 'active');
      localStorage.setItem('interval_user_email', email);
      if (name) localStorage.setItem('interval_user_name', name);

      // 3. SET THE CRITICAL COOKIE (The Fix)
      // This creates the "interval_session" cookie that Middleware & useMember look for.
      // Max-Age: 1 year (31536000 seconds)
      document.cookie = "interval_session=true; path=/; max-age=31536000; SameSite=Lax";

      // 4. SIGNAL SUCCESS
      // Force a storage event so other tabs/components update immediately
      window.dispatchEvent(new Event('storage'));

      setStatus('Access Granted.');

      // 5. REDIRECT
      // Wait a brief moment for the cookie to stick, then go to the Atlas
      setTimeout(() => {
        router.push('/atlas');
      }, 1500);

    } else {
      // Fallback if no email found (e.g. direct visit)
      setStatus('Redirecting...');
      setTimeout(() => router.push('/'), 2000);
    }
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-[#F4F4F0] flex flex-col items-center justify-center text-center p-6">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        {/* LOGO MARK */}
        <div className="w-16 h-16 bg-accent-brown mx-auto mb-8 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-[#F4F4F0] rounded-full animate-pulse" />
        </div>

        {/* TITLE */}
        <h1 className="font-serif-title text-3xl text-brand-ink mb-4">
          {status === 'Access Granted.' ? 'Welcome to The Interval.' : 'Confirming Entry...'}
        </h1>

        {/* STATUS TEXT */}
        <p className="font-sans-body text-xs text-accent-brown uppercase tracking-widest mb-12">
          {status}
        </p>

        {/* LOADING BAR */}
        <div className="w-full h-px bg-accent-brown/20 relative overflow-hidden">
            <motion.div 
                className="absolute inset-0 bg-accent-brown"
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
            />
        </div>

      </motion.div>
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