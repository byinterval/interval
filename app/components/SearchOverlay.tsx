'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchProps) {
  // Mock Taxonomy Data
  const moods = ["Silence", "Decay", "Light", "Humidity", "Solitude"];
  const cities = ["Tokyo", "Mexico City", "London", "Copenhagen"];
  const formats = ["Essays", "Studies", "Objects"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[60] bg-primary-bg/98 backdrop-blur-xl flex flex-col"
        >
          {/* Close Button */}
          <div className="absolute top-8 right-8 md:right-12">
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-secondary-bg transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-accent-brown group-hover:text-brand-ink">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
            <span className="font-sans-body text-xs text-accent-brown uppercase tracking-[0.2em] mb-12 block">
              Discovery Engine
            </span>

            {/* Tier 1: The Moods */}
            <div className="mb-16 max-w-3xl">
              <h3 className="font-serif-title text-2xl text-brand-ink mb-6 italic">Select an Atmosphere</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {moods.map(mood => (
                  <button key={mood} className="font-sans-body text-sm uppercase tracking-wide border border-accent-brown/30 px-6 py-3 rounded-full hover:bg-brand-ink hover:text-primary-bg hover:border-brand-ink transition-all duration-300">
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Tier 2: The Cities */}
            <div className="mb-16 max-w-3xl">
               <h3 className="font-serif-title text-2xl text-brand-ink mb-6 italic">Select a Location</h3>
               <div className="flex flex-wrap justify-center gap-6 font-sans-body text-sm text-accent-brown/80">
                 {cities.map(city => (
                   <button key={city} className="hover:text-brand-ink hover:underline decoration-1 underline-offset-4 transition-all">
                     {city}
                   </button>
                 ))}
               </div>
            </div>

            {/* Tier 3: The Formats */}
            <div className="max-w-3xl">
               <div className="flex flex-wrap justify-center gap-6 font-sans-body text-[10px] uppercase tracking-widest text-accent-brown/50">
                 {formats.map(format => (
                   <button key={format} className="hover:text-accent-brown transition-colors">
                     {format}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}