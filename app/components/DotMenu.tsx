'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function DotMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger: 3 Vertical Dots */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 -mr-2 text-accent-brown hover:text-brand-ink transition-colors"
        aria-label="Menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Invisible Backdrop to close on click outside */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-4 w-56 bg-white border border-secondary-bg shadow-xl z-50 p-6 rounded-sm"
            >
              <nav className="flex flex-col space-y-4 font-sans-body text-xs uppercase tracking-widest text-brand-ink/70">
                <Link href="/manifesto" className="hover:text-brand-ink hover:translate-x-1 transition-all">
                  The Manifesto
                </Link>
                <Link href="/account" className="hover:text-brand-ink hover:translate-x-1 transition-all">
                  Member Account
                </Link>
                <div className="w-full h-px bg-secondary-bg" />
                <Link href="/help" className="hover:text-brand-ink hover:translate-x-1 transition-all text-accent-brown/50">
                  Support
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}