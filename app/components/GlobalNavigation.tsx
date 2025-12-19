'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMember } from '@/app/hooks/useMember';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated } = useMember();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isAtlas = pathname?.startsWith('/atlas');
  const isIssue = !isAtlas && pathname !== '/account' && pathname !== '/search';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] py-6 px-6 md:px-12 flex justify-between items-center mix-blend-difference text-white pointer-events-none">
        
        {/* LEFT: LOGO */}
        <div className="pointer-events-auto flex items-center gap-4">
          <Link href="/" className="font-serif-title text-xl md:text-2xl tracking-tight hover:opacity-70 transition-opacity">
            The Interval
          </Link>
          <span className="hidden md:inline-block font-sans-body text-[10px] uppercase tracking-[0.2em] opacity-60">
             • No. 01 | The Radical Interior
          </span>
        </div>

        {/* CENTER: TOGGLE (Restored Original Style) */}
        <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/20 backdrop-blur-md rounded-full p-1 border border-white/10">
          <Link 
            href="/" 
            className={`px-5 py-1.5 rounded-full font-sans-body text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${isIssue ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
          >
            The Issue
          </Link>
          <Link 
            href="/atlas" 
            className={`px-5 py-1.5 rounded-full font-sans-body text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${isAtlas ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
          >
            The Atlas
          </Link>
        </div>

        {/* RIGHT: MENU (Restored 3-Dots) */}
        <div className="pointer-events-auto flex items-center gap-6">
          <Link 
            href="/search"
            className="hidden md:block font-sans-body text-[10px] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
          >
            Search
          </Link>

          {/* The Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="group flex flex-col items-end gap-[6px] p-2"
          >
            <div className="w-1 h-1 bg-current rounded-full" />
            <div className="w-1 h-1 bg-current rounded-full" />
            <div className="w-1 h-1 bg-current rounded-full" />
          </button>
        </div>
      </nav>

      {/* OVERLAY MENU (Hidden by default, slides in when clicked) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
           <button 
             onClick={() => setIsMenuOpen(false)}
             className="absolute top-8 right-8 text-white/50 hover:text-white font-sans-body text-xs uppercase tracking-widest"
           >
             Close
           </button>

           <div className="space-y-8">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="block font-serif-title text-4xl text-white hover:text-accent-brown transition-colors">The Issue</Link>
              <Link href="/atlas" onClick={() => setIsMenuOpen(false)} className="block font-serif-title text-4xl text-white hover:text-accent-brown transition-colors">The Atlas</Link>
              {isAuthenticated ? (
                 <Link href="/account" onClick={() => setIsMenuOpen(false)} className="block font-serif-title text-4xl text-white hover:text-accent-brown transition-colors">Account</Link>
              ) : (
                 <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="block font-serif-title text-4xl text-white hover:text-accent-brown transition-colors">Join</Link>
              )}
           </div>
        </div>
      )}
    </>
  );
}