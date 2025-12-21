'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURATION ---
const COLORS = {
  paper: '#FDFBF7',
  ink: '#1A1A1A',
};

function WelcomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State: 'loading' | 'success' | 'error'
  const [viewState, setViewState] = useState<'loading' | 'success' | 'error'>('loading');
  const [loadingMessage, setLoadingMessage] = useState('Verifying Membership...');
  const [userData, setUserData] = useState({ name: '', email: '', cohort: '2026' });

  useEffect(() => {
    // --- STEP 1: CAPTURE DATA ---
    const emailParam = searchParams.get('user_email') || searchParams.get('email');
    const nameParam = searchParams.get('user_name') || searchParams.get('name');
    
    setUserData({
      name: nameParam || 'Member',
      email: emailParam || '',
      cohort: new Date().getFullYear().toString()
    });

    // --- STEP 2: THE STATUS CYCLE ---
    const timer1 = setTimeout(() => {
      setLoadingMessage('Syncing with The Living Atlas...');
    }, 1500);

    const timer2 = setTimeout(() => {
      // --- STEP 3: THE HANDSHAKE ---
      if (emailParam) localStorage.setItem('interval_user_email', emailParam);
      if (nameParam) localStorage.setItem('interval_user_name', nameParam);
      localStorage.setItem('interval_membership_status', 'active');

      document.cookie = "interval_session=true; path=/; max-age=31536000; SameSite=Lax";
      
      window.dispatchEvent(new Event('storage'));

      setLoadingMessage('Access Granted.');
      setTimeout(() => setViewState('success'), 800);

    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [searchParams]);

  return (
    <main 
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ backgroundColor: COLORS.paper, color: COLORS.ink }}
    >
      <AnimatePresence mode="wait">
        
        {/* --- PHASE 1: THE SYNC --- */}
        {viewState === 'loading' && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center text-center"
          >
            {/* THE ANIMATION */}
            <div className="w-24 h-24 mb-12 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={COLORS.ink}
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                />
              </svg>
              <motion.div 
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 2.2, duration: 0.5 }}
                 className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-[#1A1A1A]" 
              />
            </div>

            {/* THE STATUS TEXT */}
            <motion.p
              key={loadingMessage}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="font-sans-body text-xs uppercase tracking-[0.2em] opacity-60"
            >
              {loadingMessage}
            </motion.p>
          </motion.div>
        )}

        {/* --- PHASE 2: THE REVEAL --- */}
        {viewState === 'success' && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl w-full flex flex-col items-center text-center"
          >
            
            {/* WELCOME HEADER */}
            <h1 className="font-serif-title text-4xl md:text-5xl mb-4 tracking-tight">
              Welcome, {userData.name.split(' ')[0]}.
            </h1>
            <p className="font-serif-title text-xl md:text-2xl italic opacity-60 mb-12">
              You are now a Founding Member of The Interval.
            </p>

            {/* MEMBERSHIP CARD */}
            <div className="w-full max-w-md border-4 border-double border-[#1A1A1A]/10 p-8 md:p-12 mb-16 relative">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FDFBF7] px-4">
                  <span className="font-sans-body text-[10px] uppercase tracking-[0.2em] opacity-40">Credentials</span>
               </div>
               
               <div className="space-y-4 font-sans-body text-xs uppercase tracking-[0.15em] text-[#1A1A1A]/80">
                  <div className="flex justify-between border-b border-[#1A1A1A]/5 pb-2">
                    <span className="opacity-40">Member</span>
                    <span>{userData.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1A1A1A]/5 pb-2">
                    <span className="opacity-40">Cohort</span>
                    <span>{userData.cohort}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-40">Status</span>
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-900 animate-pulse" />
                      Active
                    </span>
                  </div>
               </div>
            </div>

            {/* INSTRUCTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full max-w-lg mb-20 text-left md:text-center">
              <div>
                <span className="font-sans-body text-[10px] text-[#1A1A1A]/40 uppercase tracking-widest block mb-2">The Push</span>
                <p className="font-serif-title text-lg leading-relaxed">
                  <span className="font-bold">Thursday.</span><br/>
                  The Signal arrives in your inbox.
                </p>
              </div>
              <div>
                <span className="font-sans-body text-[10px] text-[#1A1A1A]/40 uppercase tracking-widest block mb-2">The Pull</span>
                <p className="font-serif-title text-lg leading-relaxed">
                  <span className="font-bold">Sunday.</span><br/>
                  Visit the Atlas to research and unblock.
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col items-center gap-6">
              <button
                onClick={() => router.push('/')}
                className="group relative px-10 py-4 bg-[#1A1A1A] text-[#FDFBF7] rounded-full overflow-hidden transition-transform hover:scale-105"
              >
                <span className="relative z-10 font-sans-body text-xs uppercase tracking-[0.25em]">
                  Enter Issue No. 01
                </span>
              </button>
              
              <button 
                onClick={() => router.push('/account')}
                className="font-sans-body text-[10px] uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity border-b border-transparent hover:border-[#1A1A1A]"
              >
                Configure Profile
              </button>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7]" />}>
      <WelcomeContent />
    </Suspense>
  );
}