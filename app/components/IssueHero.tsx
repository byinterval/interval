'use client';
import SanityImage from './SanityImage'; // Import robust image
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
      <div className="absolute inset-0">
        <SanityImage 
          src={imageSrc} 
          alt={title} 
          fill 
          className="object-cover" 
          priority 
        />
        <div className="absolute inset-0 bg-brand-ink/20 mix-blend-multiply" />
      </div>
      <AudioPrompt />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
        <CalmEntry>
          <span className="font-sans-body text-xs text-primary-bg uppercase tracking-[0.25em] mb-6 block drop-shadow-sm">
            Issue {issueNumber}
          </span>
          <h1 className="font-serif-title text-5xl md:text-7xl lg:text-8xl text-primary-bg tracking-tight leading-none drop-shadow-md max-w-5xl mx-auto">
            {title}
          </h1>
        </CalmEntry>
      </div>
    </section>
  );
}