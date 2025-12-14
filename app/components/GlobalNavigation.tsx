'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchOverlay from './SearchOverlay';
import DotMenu from './DotMenu';
import { client } from '@/lib/sanity'; // Import Sanity Client

export default function GlobalNavigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // NEW: State to hold the live issue data
  const [latestIssue, setLatestIssue] = useState<{ issueNumber: string; title: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // NEW: Fetch latest issue title for the Nav Bar
    // Query explanation: Get all issues, sort by number descending, take the first one.
    const navQuery = `*[_type == "issue"] | order(issueNumber desc)[0]{
      issueNumber, 
      title
    }`;

    client.fetch(navQuery)
      .then(data => {
        if (data) {
          setLatestIssue(data);
        }
      })
      .catch(err => console.error("Nav Fetch Error", err));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAtlasMode = pathname?.includes('/atlas');

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
          
          {/* ZONE 1: THE ANCHOR */}
          <div className="flex items-center space-x-6 w-1/3">
            <Link href="/" className="font-serif-title text-xl text-brand-ink tracking-tight hover:opacity-70 transition-opacity">
              The Interval
            </Link>
            
            {/* Dynamic Issue Indicator */}
            <div className="hidden md:flex items-center space-x-2 font-sans-body text-[10px] uppercase tracking-widest text-accent-brown">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {/* Uses live data or falls back to '00' while loading */}
              <span>No. {latestIssue?.issueNumber || "00"}</span>
              <span className="opacity-50">|</span>
              <span className="opacity-70 truncate max-w-[200px]">
                {latestIssue?.title || "Loading..."}
              </span>
            </div>
          </div>

          {/* ZONE 2: MODE SWITCH */}
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

          {/* ZONE 3: UTILITY */}
          <div className="flex items-center justify-end space-x-6 w-1/3">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center space-x-2 text-accent-brown hover:text-brand-ink transition-colors group"
            >
              <span className="font-sans-body text-[10px] uppercase tracking-widest opacity-60 group-hover:opacity-100">
                Search by Atmosphere...
              </span>
            </button>
            <DotMenu />
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}