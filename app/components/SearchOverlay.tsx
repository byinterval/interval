'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchProps) {
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
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[60] bg-primary-bg/98 backdrop-blur-xl flex flex-col"
        >
          <div className="absolute top-8 right-8 md:right-12">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary-bg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-accent-brown">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
            <span className="font-sans-body text-xs text-accent-brown uppercase tracking-[0.2em] mb-12 block">Discovery Engine</span>
            
            {/* Moods - Link to Atlas */}
            <div className="mb-16 max-w-3xl">
              <h3 className="font-serif-title text-2xl text-brand-ink mb-6 italic">Select an Atmosphere</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {moods.map(mood => (
                  <Link
                    key={mood}
                    href={`/atlas?mood=${mood}`}
                    onClick={onClose}
                    className="font-sans-body text-sm uppercase tracking-wide border border-accent-brown/30 px-6 py-3 rounded-full hover:bg-brand-ink hover:text-primary-bg transition-all"
                  >
                    {mood}
                  </Link>
                ))}
              </div>
            </div>

            {/* Cities - Placeholder Links for now */}
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}