'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMember } from '@/app/hooks/useMember';
import CalmEntry from '@/app/components/CalmEntry';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [mode, setMode] = useState<'magic' | 'code'>('magic');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const { login } = useMember(); 

  // Handle Magic Link Submission
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API delay for "Calm" feeling
    setTimeout(() => {
      setStatus('success'); 
      // In production: window.location.href = `https://YOUR_SUBDOMAIN.memberful.com/auth/sign_in?email=${email}`;
    }, 1500);
  };

  // Handle Hospitality Code
  const handleAccessCode = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Verify code against list (Mock for now)
    if (accessCode.toUpperCase() === 'ACE-KYOTO-2025') {
      setTimeout(() => {
        // Provision Guest Session (Set Cookie)
        document.cookie = "interval_guest_session=true; path=/; max-age=604800"; // 7 days
        window.location.href = "/atlas"; // Redirect to sanctuary
      }, 1500);
    } else {
      setTimeout(() => setStatus('error'), 1000);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-primary-bg">
      
      {/* ZONE A: THE KEY (Utility) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 relative z-10 bg-primary-bg">
        <Link href="/" className="absolute top-8 left-8 md:left-12 font-serif-title text-xl text-brand-ink">
          The Interval
        </Link>

        <CalmEntry>
          <div className="max-w-md w-full mx-auto">
            <span className="font-sans-body text-xs text-accent-brown uppercase tracking-widest mb-4 block">
              The Threshold
            </span>
            <h1 className="font-serif-title text-4xl md:text-5xl text-brand-ink mb-2">
              Enter the Interval
            </h1>
            <p className="font-sans-body text-brand-ink/50 text-sm mb-12">
              Issue 048 is currently live.
            </p>

            {status === 'success' ? (
              <div className="bg-secondary-bg p-8 border border-accent-brown/10 text-center animate-pulse">
                <p className="font-serif-title text-xl text-brand-ink mb-2">Check your inbox.</p>
                <p className="font-sans-body text-xs text-accent-brown">The key is on its way.</p>
              </div>
            ) : (
              <>
                {mode === 'magic' ? (
                  <form onSubmit={handleMagicLink} className="space-y-8">
                    <div className="space-y-2">
                      <label htmlFor="email" className="sr-only">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        required
                        className="w-full bg-transparent border-b border-accent-brown/30 py-4 text-lg font-serif-title text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-ink transition-colors"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={status === 'loading'}
                      className="w-full bg-brand-ink text-primary-bg py-4 font-sans-body text-xs uppercase tracking-widest hover:bg-accent-brown transition-colors disabled:opacity-50"
                    >
                      {status === 'loading' ? 'Sending...' : 'Send Entry Link'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleAccessCode} className="space-y-8">
                    <div className="space-y-2">
                      <label htmlFor="code" className="sr-only">Access Code</label>
                      <input
                        type="text"
                        id="code"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        placeholder="Enter Hospitality Code"
                        required
                        className="w-full bg-transparent border-b border-accent-brown/30 py-4 text-lg font-serif-title text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-ink transition-colors"
                      />
                      {status === 'error' && (
                        <p className="text-red-500 text-xs font-sans-body mt-2">Invalid Access Code.</p>
                      )}
                    </div>
                    <button 
                      type="submit" 
                      disabled={status === 'loading'}
                      className="w-full bg-brand-ink text-primary-bg py-4 font-sans-body text-xs uppercase tracking-widest hover:bg-accent-brown transition-colors disabled:opacity-50"
                    >
                      {status === 'loading' ? 'Verifying...' : 'Unlock Guest Access'}
                    </button>
                  </form>
                )}

                <div className="mt-12 text-center">
                  <button 
                    onClick={() => {
                      setMode(mode === 'magic' ? 'code' : 'magic');
                      setStatus('idle');
                    }}
                    className="font-sans-body text-[10px] uppercase tracking-widest text-accent-brown/60 hover:text-brand-ink border-b border-transparent hover:border-brand-ink pb-0.5 transition-all"
                  >
                    {mode === 'magic' ? "Staying with a partner hotel? Enter Code." : "Use Member Email instead."}
                  </button>
                </div>
              </>
            )}
          </div>
        </CalmEntry>
      </div>

      {/* ZONE B: THE MOOD (Atmosphere) */}
      <div className="hidden md:block w-1/2 relative bg-secondary-bg overflow-hidden h-screen sticky top-0">
        <div className="absolute inset-0">
           <Image 
             src="https://images.unsplash.com/photo-1493723843689-d205189326e5?q=80&w=2000" 
             alt="Atmosphere"
             fill
             className="object-cover opacity-80"
             unoptimized={true} // FIX: Bypass optimization to ensure external image loads
           />
           <div className="absolute inset-0 bg-brand-ink/20 mix-blend-multiply" />
        </div>
        
        {/* Pull Quote */}
        <div className="absolute bottom-24 left-12 right-12 max-w-lg">
          <p className="font-serif-title text-4xl text-primary-bg leading-tight drop-shadow-md">
            "Silence is not an absence. It is a material."
          </p>
        </div>
      </div>

    </div>
  );
}