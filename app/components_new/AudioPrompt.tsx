'use client';
import { useState } from 'react';

export default function AudioPrompt() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <button
      onClick={() => setIsPlaying(!isPlaying)}
      className="absolute bottom-8 right-8 z-20 flex items-center space-x-3 text-primary-bg hover:text-white transition-colors duration-300 group"
      aria-label="Play Audio Context"
    >
      <span className="font-sans-body text-[10px] uppercase tracking-[0.25em] opacity-80 group-hover:opacity-100">
        {isPlaying ? 'Pause Audio' : 'Play Audio'}
      </span>
      <div className={`w-8 h-8 rounded-full border border-primary-bg flex items-center justify-center transition-all ${isPlaying ? 'bg-primary-bg text-brand-ink' : 'bg-transparent'}`}>
        {isPlaying ? (
          // Pause Icon
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
          </svg>
        ) : (
          // Play Icon
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 ml-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
          </svg>
        )}
      </div>
    </button>
  );
}