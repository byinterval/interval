'use client';
import SanityImage from './SanityImage'; 
import AudioPrompt from './AudioPrompt';
import CalmEntry from './CalmEntry';
import { useMember } from '@/app/hooks/useMember'; // Import Auth Hook

interface HeroProps {
  issueNumber: string;
  title: string;
  imageSrc: string | null;
}

export default function IssueHero({ issueNumber, title, imageSrc }: HeroProps) {
  const { isAuthenticated, login } = useMember();

  return (
    <section className="relative w-full h-[85vh] overflow-hidden group">
      {/* 1. The Cinematic Image */}
      <div className="absolute inset-0">
        <SanityImage 
          src={imageSrc} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-[2000ms] group-hover:scale-105" 
          priority 
        />
        {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-brand-ink/20 mix-blend-multiply" />
      </div>

      {/* Audio Prompt (Only for members? Or public too? Let's keep it public as a 'sample') */}
      <AudioPrompt />

      {/* 2. The Title Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
        <CalmEntry>
          <span className="font-sans-body text-xs text-primary-bg uppercase tracking-[0.25em] mb-6 block drop-shadow-sm">
            Issue {issueNumber}
          </span>
          <h1 className="font-serif-title text-5xl md:text-7xl lg:text-8xl text-primary-bg tracking-tight leading-none drop-shadow-md max-w-5xl mx-auto mb-8">
            {title}
          </h1>

          {/* THE LOCK BUTTON (Visible only to Non-Members) */}
          {!isAuthenticated && (
            <button 
              onClick={login}
              className="inline-flex items-center space-x-2 bg-primary-bg/10 backdrop-blur-md border border-primary-bg/30 text-primary-bg px-6 py-3 rounded-full hover:bg-primary-bg hover:text-brand-ink transition-all duration-500 group/btn"
            >
              <span className="font-sans-body text-[10px] uppercase tracking-widest">Read Thesis</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 opacity-70 group-hover/btn:opacity-100">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </CalmEntry>
      </div>
    </section>
  );
}