'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import CalmEntry from '@/app/components/CalmEntry';

export default function WelcomePage() {
  const [stage, setStage] = useState<'sync' | 'reveal'>('sync');
  const [syncStatus, setSyncStatus] = useState("Verifying Membership...");
  
  // In a real app, you would grab the order ID here to verify with backend
  // const searchParams = useSearchParams();
  // const orderId = searchParams.get('order');

  useEffect(() => {
    // PHASE 1: THE SYNC SIMULATION
    
    // T = 1.5s: Update status
    const timer1 = setTimeout(() => {
      setSyncStatus("Syncing with The Living Atlas...");
    }, 1500);

    // T = 3s: Success & Cookie Set
    const timer2 = setTimeout(() => {
      setSyncStatus("Access Granted.");
      // Set the auth cookie immediately so they can browse
      document.cookie = "memberful_session=true; path=/; max-age=31536000"; 
    }, 3000);

    // T = 4s: Transition to Reveal
    const timer3 = setTimeout(() => {
      setStage('reveal');
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col items-center justify-center p-6 text-center">
      
      <AnimatePresence mode='wait'>
        {stage === 'sync' ? (
          <motion.div 
            key="sync"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center space-y-8"
          >
            {/* COMPONENT 1: THE TOTEM (Animation) */}
            <div className="relative w-16 h-16">
               <svg className="animate-spin-slow w-full h-full text-brand-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                 <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20" />
                 <path d="M12 6v6l4 2" />
               </svg>
            </div>
            
            {/* COMPONENT 2: THE STATUS TEXT */}
            <p className="font-sans-body text-xs uppercase tracking-widest text-accent-brown animate-pulse">
              {syncStatus}
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="reveal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl w-full"
          >
            {/* PHASE 2: THE REVEAL */}
            <h1 className="font-serif-title text-4xl md:text-5xl text-brand-ink mb-4">
              Welcome to the Cohort.
            </h1>
            <p className="font-sans-body text-brand-ink/60 mb-12 leading-relaxed">
              You are now a Founding Member of The Interval.
            </p>

            {/* DIGITAL MEMBERSHIP CARD */}
            <div className="bg-white border-2 border-double border-accent-brown/20 p-8 mb-12 shadow-sm mx-auto max-w-sm rotate-1 hover:rotate-0 transition-transform duration-500">
               <div className="flex justify-between items-start mb-8">
                 <span className="font-serif-title text-xl text-brand-ink">The Interval</span>
                 <span className="font-sans-body text-[10px] uppercase tracking-widest text-accent-brown">No. 00124</span>
               </div>
               <div className="space-y-2 text-left">
                 <div className="flex justify-between border-b border-accent-brown/10 pb-1">
                    <span className="font-sans-body text-[10px] uppercase text-accent-brown/60">Status</span>
                    <span className="font-sans-body text-[10px] uppercase text-brand-ink">Active</span>
                 </div>
                 <div className="flex justify-between border-b border-accent-brown/10 pb-1">
                    <span className="font-sans-body text-[10px] uppercase text-accent-brown/60">Cohort</span>
                    <span className="font-sans-body text-[10px] uppercase text-brand-ink">2025</span>
                 </div>
                 <div className="flex justify-between border-b border-accent-brown/10 pb-1">
                    <span className="font-sans-body text-[10px] uppercase text-accent-brown/60">Access</span>
                    <span className="font-sans-body text-[10px] uppercase text-brand-ink">Unlimited</span>
                 </div>
               </div>
            </div>

            {/* RITUAL INSTRUCTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-16 border-t border-accent-brown/10 pt-8">
               <div>
                 <span className="font-sans-body text-[10px] uppercase tracking-widest text-accent-brown block mb-2">Thursday</span>
                 <p className="font-serif-title text-lg text-brand-ink">The Signal arrives in your inbox.</p>
               </div>
               <div>
                 <span className="font-sans-body text-[10px] uppercase tracking-widest text-accent-brown block mb-2">Sunday</span>
                 <p className="font-serif-title text-lg text-brand-ink">Visit the Atlas to research and unblock.</p>
               </div>
            </div>

            {/* PHASE 3: FIRST ACTION */}
            <div className="flex flex-col gap-4">
              <Link 
                href="/"
                className="w-full bg-brand-ink text-primary-bg py-4 font-sans-body text-xs uppercase tracking-widest hover:bg-accent-brown transition-colors"
              >
                Enter the Current Issue
              </Link>
              <Link 
                href="/account"
                className="text-xs text-brand-ink/40 hover:text-brand-ink uppercase tracking-widest transition-colors"
              >
                Configure Profile
              </Link>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}