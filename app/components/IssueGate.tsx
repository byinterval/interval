'use client';
import { useMember } from '@/app/hooks/useMember';
import Link from 'next/link';
import Image from 'next/image';

interface IssueGateProps {
  isLocked: boolean;
  backgroundImage?: string | null;
  children: React.ReactNode;
}

export default function IssueGate({ isLocked, backgroundImage, children }: IssueGateProps) {
  const { isAuthenticated, isLoading } = useMember();

  if (isLoading) {
    return <div className="min-h-screen bg-primary-bg" />;
  }

  // If unlocked or member, show everything
  if (!isLocked || isAuthenticated) {
    return <>{children}</>;
  }

  // TEASER VIEW (Locked)
  return (
    <div className="relative min-h-screen bg-primary-bg overflow-hidden">
        
        {/* Render the content but cut it off */}
        <div className="h-[50vh] overflow-hidden opacity-100 pointer-events-none select-none filter grayscale-[0.2]">
            {children}
        </div>

        {/* The Gradient Fade Mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-bg/90 to-primary-bg z-20 pointer-events-none" style={{ top: '30vh' }} />

        {/* The Barrier Card */}
        <div className="absolute inset-0 z-30 flex items-center justify-center pt-32">
            <div className="max-w-lg w-full mx-6 bg-white/5 backdrop-blur-xl p-12 border border-accent-brown/20 shadow-2xl text-center">
                <span className="font-sans-body text-xs text-accent-brown uppercase tracking-widest mb-4 block">
                    Signal Reserved
                </span>
                <h2 className="font-serif-title text-3xl text-brand-ink mb-6">
                    This signal is reserved for Members.
                </h2>
                <p className="font-sans-body text-brand-ink/60 mb-8">
                    Join the 2025 Cohort to access the full Living Atlas and unlock this issue.
                </p>
                
                <div className="flex flex-col gap-4">
                    <Link 
                        href="/signup" 
                        className="w-full bg-brand-ink text-primary-bg py-4 font-sans-body text-xs uppercase tracking-widest hover:bg-accent-brown transition-colors"
                    >
                        Become a Founding Member £8
                    </Link>
                    <Link 
                        href="/login"
                        className="text-xs text-brand-ink/50 hover:text-brand-ink transition-colors uppercase tracking-widest border-b border-transparent hover:border-brand-ink pb-0.5 inline-block mx-auto"
                    >
                        Member Login
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
}