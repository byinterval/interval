'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// --- Sub-Components ---

// 1. The Totem (Animation)
// A fine-line SVG that animates a "key turn" or "lock open" effect
const SyncTotem = ({ isSuccess }: { isSuccess: boolean }) => (
  <div className={`transition-all duration-700 ${isSuccess ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Ring */}
      <circle cx="32" cy="32" r="30" stroke="#1A1A1A" strokeWidth="1.5" className="animate-spin-slow" style={{ animationDuration: '8s' }} />
      {/* The Keyhole / Tumbler */}
      <path 
        d="M32 12V24M32 40V52M12 32H24M40 32H52" 
        stroke="#1A1A1A" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        className="animate-pulse"
      />
      {/* The Lock Mechanism */}
      <circle cx="32" cy="32" r="8" stroke="#1A1A1A" strokeWidth="1.5" />
    </svg>
  </div>
);

// 2. The Digital Membership Card
const MembershipCard = ({ name }: { name: string }) => (
  <div className="w-full max-w-sm mx-auto border-2 border-double border-[#1A1A1A] p-6 my-8 text-center bg-[#FDFBF7] shadow-sm">
    <div className="font-mono text-xs tracking-widest uppercase mb-4 text-gray-500">The Interval</div>
    <div className="space-y-2 font-mono text-sm text-[#1A1A1A]">
      <div className="flex justify-between border-b border-gray-200 pb-1">
        <span>MEMBER</span>
        <span className="font-bold">{name}</span>
      </div>
      <div className="flex justify-between border-b border-gray-200 pb-1">
        <span>COHORT</span>
        <span>2026</span>
      </div>
      <div className="flex justify-between">
        <span>STATUS</span>
        <span className="bg-[#1A1A1A] text-[#FDFBF7] px-1 text-xs">ACTIVE</span>
      </div>
    </div>
  </div>
);

// --- Main Logic Component ---

function WelcomeFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // States
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [statusMessage, setStatusMessage] = useState('Verifying Membership...');
  const [userData, setUserData] = useState({ firstName: 'Member', fullName: '' });

  useEffect(() => {
    const orderId = searchParams.get('order'); // from Lemon Squeezy redirect
    
    if (!orderId) {
      // Dev fallback or error if accessed directly without param
      setStatus('error');
      return;
    }

    // 1. The Animation Sequence (Visual Pacing)
    const timers: NodeJS.Timeout[] = [];
    
    timers.push(setTimeout(() => setStatusMessage('Syncing with The Living Atlas...'), 1500));
    timers.push(setTimeout(() => setStatusMessage('Access Granted.'), 3000));

    // 2. The API Handshake
    const syncSession = async () => {
      try {
        const res = await fetch('/api/auth/sync-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        });

        if (!res.ok) throw new Error('Handshake failed');

        const data = await res.json();
        
        // Wait for the "visual" 3s minimum to pass before showing success
        setTimeout(() => {
          setUserData({ 
            firstName: data.user.firstName, 
            fullName: `${data.user.firstName} ${data.user.lastName || ''}`.trim() 
          });
          setStatus('success');
        }, 3200);

      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };

    syncSession();

    return () => timers.forEach(clearTimeout);
  }, [searchParams]);

  // --- Views ---

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFBF7] text-[#1A1A1A] p-6">
        <h1 className="font-serif text-3xl mb-4">The key is stuck.</h1>
        <p className="font-sans text-gray-600 mb-8 text-center max-w-md">
          We received your payment, but the digital handshake failed. Please contact our concierge.
        </p>
        <a 
          href="mailto:support@theinterval.com" 
          className="border-b border-[#1A1A1A] pb-0.5 hover:opacity-50 transition-opacity"
        >
          Contact Concierge
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Phase 1: The Sync (Absolute Centered) */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${status === 'success' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <SyncTotem isSuccess={status === 'success'} />
        <p className="mt-8 font-mono text-xs tracking-widest uppercase animate-pulse">
          {statusMessage}
        </p>
      </div>

      {/* Phase 2: The Reveal (Slide Up) */}
      <div className={`w-full max-w-2xl transform transition-all duration-1000 delay-300 ${status === 'success' ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="font-serif text-4xl md:text-5xl">
            Welcome, {userData.firstName}.
          </h1>
          <p className="font-sans text-gray-600">
            You are now a Founding Member of The Interval.
          </p>
        </div>

        {/* Card */}
        <MembershipCard name={userData.fullName || userData.firstName} />

        {/* Ritual Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12 text-sm border-t border-b border-gray-200 py-8">
          <div className="text-center md:text-left">
            <h3 className="font-bold mb-2">THURSDAY</h3>
            <p className="text-gray-600">The Signal arrives in your inbox. <br/> A 5-minute calibration.</p>
          </div>
          <div className="text-center md:text-right">
            <h3 className="font-bold mb-2">SUNDAY</h3>
            <p className="text-gray-600">Visit the Atlas to research <br/> and unblock your creativity.</p>
          </div>
        </div>

        {/* Phase 3: Footer Actions */}
        <div className="flex flex-col items-center space-y-6">
          <Link 
            href="/issues/latest" 
            className="bg-[#1A1A1A] text-[#FDFBF7] px-8 py-4 font-mono text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors w-full md:w-auto text-center"
          >
            Enter Issue 048
          </Link>
          
          <Link 
            href="/registry" 
            className="text-xs text-gray-500 hover:text-[#1A1A1A] border-b border-transparent hover:border-gray-300 transition-all"
          >
            Configure Profile
          </Link>
        </div>

      </div>
    </div>
  );
}

// Wrap in Suspense for Next.js build safety
export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7]" />}>
      <WelcomeFlow />
    </Suspense>
  );
}