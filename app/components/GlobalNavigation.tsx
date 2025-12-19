'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMember } from '@/app/hooks/useMember';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated } = useMember();
  
  const isAtlas = pathname?.startsWith('/atlas');
  const isIssue = !isAtlas && pathname !== '/account';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-6 md:px-12 flex justify-between items-center mix-blend-difference text-white pointer-events-none">
      
      {/* LEFT: LOGO */}
      <div className="pointer-events-auto">
        <Link href="/" className="font-serif-title text-xl md:text-2xl tracking-tight hover:opacity-70 transition-opacity">
          The Interval
        </Link>
        <span className="hidden md:inline-block ml-4 font-sans-body text-[10px] uppercase tracking-[0.2em] opacity-60">
           • No. 01 | The Radical Interior
        </span>
      </div>

      {/* CENTER: TOGGLE (ALWAYS VISIBLE) */}
      <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/10 backdrop-blur-md rounded-full p-1 border border-white/10">
        <Link 
          href="/" 
          className={`px-6 py-2 rounded-full font-sans-body text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${isIssue ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
        >
          The Issue
        </Link>
        <Link 
          href="/atlas" 
          className={`px-6 py-2 rounded-full font-sans-body text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${isAtlas ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
        >
          The Atlas
        </Link>
      </div>

      {/* RIGHT: ACCOUNT */}
      <div className="pointer-events-auto flex items-center gap-6">
        <Link 
          href="/search"
          className="hidden md:block font-sans-body text-[10px] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
        >
          Search
        </Link>

        {isAuthenticated ? (
          <Link href="/account" className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-serif-title italic hover:scale-105 transition-transform">
            M
          </Link>
        ) : (
          <Link 
            href="/signup" 
            className="font-sans-body text-[10px] uppercase tracking-[0.2em] border border-white/30 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all"
          >
            Join
          </Link>
        )}
      </div>
    </nav>
  );
}