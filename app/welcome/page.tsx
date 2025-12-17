'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// --- Sub-Components ---

// 1. The Totem (Animation)
const SyncTotem = ({ isSuccess }: { isSuccess: boolean }) => (
  <div className={`transition-all duration-700 ${isSuccess ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" stroke="#1A1A1A" strokeWidth="1.5" className="animate-spin-slow" style={{ animationDuration: '8s' }} />
      <path 
        d="M32 12V24M32 40V52M12 32H24M40 32H52" 
        stroke="#1A1A1A" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        className="animate-pulse"
      />
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
  // NEW: State for the dynamic issue button
  const [latestIssue, setLatestIssue] = useState({ number: '...', slug: '' });

  useEffect(() => {
    // 1. FIND THE ID: Check every possible format Lemon Squeezy uses
    const orderId = 
      searchParams.get('order') ||            
      searchParams.get('order_id') ||         
      searchParams.get('order[id]') ||        
      searchParams.get('checkout[id]') ||     
      searchParams.get('checkout_id');       

    // Debugging: See exactly what the URL has
    console.log('Detected Params:', Array.from(searchParams.entries()));
    console.log('Found Order ID:', orderId);

    // 2. If no ID found, stop immediately
    if (!orderId) {
      console.log('No order ID found in URL');
      setStatus('error');
      return;
    }

    // 3. Setup Timers and Sync
    const timers: ReturnType<typeof setTimeout>[] = [];
    
    // Animation timers
    timers.push(setTimeout(() => setStatusMessage('Syncing with The Living Atlas...'), 1500));
    timers.push(setTimeout(() => setStatusMessage('Access Granted.'), 3000));

    const syncSession = async () => {
      try {
        const res = await fetch('/api/auth/sync-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        });

        if (!res.ok) throw new Error('Handshake failed');

        const data = await res.json();
        
        // Success: Update the UI
        timers.push(setTimeout(() => {
          // Update User Data
          setUserData({ 
            firstName: data.user.firstName, 
            fullName: `${data.user.firstName} ${data.user.lastName || ''}`.trim() 
          });

          // Update Issue Data (NEW)
          if (data.latestIssue) {
            setLatestIssue({ 
              number: data.latestIssue.issueNumber, 
              slug: data.latestIssue.slug 
            });
          }

          setStatus('success');
        }, 3200));

      } catch (err) {
        console.error('Sync Error:', err);
        setStatus('error');
      }
    };

    // Start the sync
    syncSession();

    // Cleanup timers if the user leaves the page
    return () => timers.forEach(clearTimeout);
  }, [searchParams]);

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
      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${status === 'success' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <SyncTotem isSuccess={status === 'success'} />
        <p className="mt-8 font-mono text-xs tracking-widest uppercase animate-pulse">
          {statusMessage}
        </p>
      </div>

      <div className={`w-full max-w-2xl transform transition-all duration-1000 delay-300 ${status === 'success' ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="text-center space-y-4 mb-12">
          <h1 className="font-serif text-4xl md:text-5xl">
            Welcome, {userData.firstName}.
          </h1>
          <p className="font-sans text-gray-600">
            You are now a Founding Member of The Interval.
          </p>
        </div>

        <MembershipCard name={userData.fullName || userData.firstName} />

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

        <div className="flex flex-col items-center space-y-6">
          <Link 
            // Dynamic link to the latest issue
            href={latestIssue.slug ? `/issue/${latestIssue.slug}` : '/issue/latest'} 
            className="bg-[#1A1A1A] text-[#FDFBF7] px-8 py-4 font-mono text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors w-full md:w-auto text-center"
          >
            Enter Issue {latestIssue.number}
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

// === CRITICAL: This is the default export required by Next.js ===
export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7]" />}>
      <WelcomeFlow />
    </Suspense>
  );
}