'use client';
import Image from 'next/image';
import AudioPrompt from './AudioPrompt';
import CalmEntry from './CalmEntry';

interface HeroProps {
  issueNumber: string;
  title: string;
  imageSrc: string;
}

export default function IssueHero({ issueNumber, title, imageSrc }: HeroProps) {
  return (
    <section className="relative w-full h-[85vh] overflow-hidden">
      {/* 1. The Cinematic Image */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={`Cover image for ${title}`}
          fill
          className="object-cover"
          priority
        />
        {/* Cinematic Overlay (Darken slightly for text readability) */}
        <div className="absolute inset-0 bg-brand-ink/20 mix-blend-multiply" />
      </div>

      {/* 2. The Audio Interaction */}
      <AudioPrompt />

      {/* 3. The Title Overlay (Centered, Manifesto Style) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
        <CalmEntry>
          <span className="font-sans-body text-xs text-primary-bg uppercase tracking-[0.25em] mb-6 block drop-shadow-sm">
            Issue {issueNumber}
          </span>
          <h1 className="font-serif-title text-5xl md:text-7xl lg:text-8xl text-primary-bg tracking-tight leading-none drop-shadow-md max-w-4xl mx-auto">
            {title}
          </h1>
        </CalmEntry>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 text-primary-bg/70">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </section>
  );
}