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

  if (!isLocked || isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-bg text-center px-6 relative overflow-hidden">
        
        {backgroundImage && (
            <div className="absolute inset-0 z-0">
                <Image 
                    src={backgroundImage} 
                    alt="Locked" 
                    fill 
                    className="object-cover opacity-20 blur-xl scale-110" 
                />
            </div>
        )}

        <div className="max-w-lg z-10 bg-primary-bg/80 backdrop-blur-sm p-12 border border-accent-brown/10 shadow-2xl">
            <span className="font-sans-body text-xs text-red-600 uppercase tracking-widest mb-4 block">
                Archive Locked
            </span>
            <h1 className="font-serif-title text-4xl md:text-5xl text-brand-ink mb-6">
                This issue has moved to the Archive.
            </h1>
            <p className="font-sans-body text-brand-ink/60 mb-12 leading-relaxed">
                The live interval has closed. Join as a Member to access the full Living Atlas and our complete back catalogue.
            </p>
            
            <div className="flex flex-col gap-6">
                <Link 
                    href="/login"
                    className="w-full bg-brand-ink text-primary-bg py-4 font-sans-body text-xs uppercase tracking-widest hover:bg-accent-brown transition-colors"
                >
                    Member Login
                </Link>
                {/* LINK TO SIGNUP PAGE */}
                <Link 
                    href="/signup" 
                    className="text-accent-brown border-b border-accent-brown/30 pb-1 font-sans-body text-xs uppercase tracking-widest hover:text-brand-ink transition-colors"
                >
                    Become a Founding Member
                </Link>
            </div>
        </div>
    </div>
  );
}