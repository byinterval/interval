'use client';
import { useMember } from '@/app/hooks/useMember';
import Link from 'next/link';

interface ThesisLockProps {
  fullText: string;
}

export default function ThesisLock({ fullText }: ThesisLockProps) {
  const { isAuthenticated, isLoading } = useMember();

  if (isLoading) return <div className="animate-pulse h-24 bg-secondary-bg/20 rounded-sm" />;

  // 1. MEMBER VIEW: Full Text
  if (isAuthenticated) {
    return (
      <p className="font-serif-title text-xl leading-relaxed text-brand-ink/80 whitespace-pre-wrap">
        {fullText}
      </p>
    );
  }

  // 2. PUBLIC VIEW: Snippet + Lock
  // Get first ~30 words
  const snippet = fullText.split(' ').slice(0, 30).join(' ') + '...';

  return (
    <div className="relative">
      <p className="font-serif-title text-xl leading-relaxed text-brand-ink/80 blur-[0.5px]">
        {snippet}
      </p>
      
      <div className="mt-8 flex justify-center">
        <Link 
          href="/signup"
          className="inline-flex items-center space-x-2 bg-brand-ink text-primary-bg px-6 py-3 rounded-full hover:bg-accent-brown transition-colors group"
        >
          <span className="font-sans-body text-[10px] uppercase tracking-widest">Read Thesis</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 opacity-70 group-hover:opacity-100">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
}