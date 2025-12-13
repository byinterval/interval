'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchOverlay from './SearchOverlay'; // We will create this in Phase 2
import DotMenu from './DotMenu'; // We will create this in Phase 3

export default function GlobalNavigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Handle Scroll Effect (Transparent to Solid)
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine Active Mode based on URL
  const isAtlasMode = pathname.includes('/atlas');

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
          isScrolled 
            ? 'bg-primary-bg/95 backdrop-blur-md border-accent-brown/10 py-4' 
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="px-6 md:px-12 flex items-center justify-between">
          
          {/* ZONE 1: THE ANCHOR (Left) */}
          <div className="flex items-center space-x-6 w-1/3">
            <Link href="/" className="font-serif-title text-xl text-brand-ink tracking-tight hover:opacity-70 transition-opacity">
              The Interval
            </Link>
            
            {/* Issue Indicator (Hidden on Mobile) */}
            <div className="hidden md:flex items-center space-x-2 font-sans-body text-[10px] uppercase tracking-widest text-accent-brown">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> {/* Live Dot */}
              <span>No. 048</span>
              <span className="opacity-50">|</span>
              <span className="opacity-70">The Architecture of Silence</span>
            </div>
          </div>

          {/* ZONE 2: THE MODE SWITCH (Center) */}
          <div className="hidden md:flex justify-center w-1/3">
            <div className="flex bg-secondary-bg/50 rounded-full p-1 border border-accent-brown/5">
              <Link 
                href="/" 
                className={`px-5 py-1.5 rounded-full text-[10px] uppercase tracking-widest transition-all duration-300 ${
                  !isAtlasMode ? 'bg-primary-bg shadow-sm text-brand-ink' : 'text-accent-brown/60 hover:text-accent-brown'
                }`}
              >
                The Issue
              </Link>
              <Link 
                href="/atlas" 
                className={`px-5 py-1.5 rounded-full text-[10px] uppercase tracking-widest transition-all duration-300 ${
                  isAtlasMode ? 'bg-primary-bg shadow-sm text-brand-ink' : 'text-accent-brown/60 hover:text-accent-brown'
                }`}
              >
                The Atlas
              </Link>
            </div>
          </div>

          {/* ZONE 3: THE UTILITY (Right) */}
          <div className="flex items-center justify-end space-x-6 w-1/3">
            {/* Mood Search Trigger */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center space-x-2 text-accent-brown hover:text-brand-ink transition-colors group"
            >
              <span className="font-sans-body text-[10px] uppercase tracking-widest opacity-60 group-hover:opacity-100">
                Search by Atmosphere...
              </span>
            </button>

            {/* The Vault Icon (Saved Items) */}
            <button className="text-accent-brown hover:text-brand-ink transition-colors" aria-label="My Vault">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </button>
            
            {/* Secondary Nav Trigger (Dot Menu) */}
            <DotMenu />
          </div>
        </div>
      </header>

      {/* The Search Overlay Component */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}