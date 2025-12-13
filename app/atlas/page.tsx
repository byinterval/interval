'use client';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import CalmEntry from '../components/CalmEntry';
import MoodFilter from '../components/MoodFilter';
import SignalCard from '../components/SignalCard';
import ArtifactVault from '../components/ArtifactVault';
import MasonryGrid from '../components/MasonryGrid';
import CalmGridItem from '../components/CalmGridItem';

// Mock Data (The Brain)
const allSignals = [
  { id: 1, studio: "Studio O", title: "Light as Material", mood: "Low Light", height: "aspect-[3/4]", image: "https://images.unsplash.com/photo-1515266591878-5a1408089456?q=80&w=800" },
  { id: 2, studio: "Ryokan Z", title: "The Acoustics of Tatami", mood: "Silence", height: "aspect-square", image: "https://images.unsplash.com/photo-1598337633293-189f76f7f631?q=80&w=800" },
  { id: 3, studio: "Atelier V", title: "Concrete Patina", mood: "Texture", height: "aspect-[4/5]", image: "https://images.unsplash.com/photo-1516962080544-e1163c804e15?q=80&w=800" },
  { id: 4, studio: "Cafe K", title: "Rainy Day Architecture", mood: "Rain", height: "aspect-[3/4]", image: "https://images.unsplash.com/photo-1507646227500-4d389b0012be?q=80&w=800" },
  { id: 5, studio: "House N", title: "Morning Light Study", mood: "Morning", height: "aspect-square", image: "https://images.unsplash.com/photo-1595844730298-b96053705296?q=80&w=800" },
  { id: 6, studio: "Gallery X", title: "Void Space", mood: "Silence", height: "aspect-[4/5]", image: "https://images.unsplash.com/photo-1493723843689-d205189326e5?q=80&w=800" },
];

const availableMoods = ["Silence", "Texture", "Morning", "Rain", "Low Light", "Patina"];

export default function AtlasPage() {
  const [activeMood, setActiveMood] = useState<string | null>(null);

  // Filter Logic: If no mood selected, show all. Else, filter by mood.
  const filteredSignals = activeMood 
    ? allSignals.filter(s => s.mood === activeMood)
    : allSignals;

  const handleMoodSelect = (mood: string) => {
    // Toggle off if clicking the active mood again
    setActiveMood(prev => (prev === mood ? null : mood));
  };

  return (
    <CalmEntry>
      <main className="min-h-screen bg-primary-bg">
        
        {/* 1. The Header (Expansive Whitespace) */}
        <header className="pt-32 pb-16 text-center px-6">
          <span className="font-sans-body text-xs text-accent-brown uppercase tracking-[0.2em] mb-6 block">
            The Digital Archive
          </span>
          <h1 className="font-serif-title text-6xl md:text-7xl lg:text-8xl text-brand-ink mb-8 tracking-tight">
            The Living Atlas
          </h1>
          <p className="font-sans-body text-accent-brown/80 max-w-lg mx-auto leading-relaxed">
            A permanent library of taste. Filter the archive by atmospheric mood to unblock your creativity.
          </p>
        </header>

        {/* 2. The Atmospheric Search (Sticky) */}
        <div className="sticky top-0 z-40 bg-primary-bg/95 backdrop-blur-md border-b border-accent-brown/5 transition-all">
          {/* FIX: Passing the required props here resolves the error */}
          <MoodFilter 
            moods={availableMoods} 
            activeMood={activeMood}
            onMoodSelect={handleMoodSelect}
          />
        </div>

        {/* 3. The Masonry Grid (Dynamic) */}
        <section className="py-20 min-h-[60vh]">
           <MasonryGrid>
             <AnimatePresence mode='popLayout'>
               {filteredSignals.map((signal) => (
                 <CalmGridItem key={signal.id}>
                   <SignalCard 
                     studio={signal.studio}
                     title={signal.title}
                     mood={signal.mood}
                     image={signal.image}
                     heightClass={signal.height}
                   />
                 </CalmGridItem>
               ))}
             </AnimatePresence>
             
             {/* Empty State Message */}
             {filteredSignals.length === 0 && (
               <div className="col-span-full py-32 text-center">
                 <p className="font-serif-title text-2xl text-accent-brown/50 italic">
                   No signals found for this mood yet.
                 </p>
               </div>
             )}
           </MasonryGrid>
        </section>

        {/* 4. The Artifact Vault (Visualizing the Collection) */}
        <div className="border-t border-accent-brown/10">
          <ArtifactVault />
        </div>

      </main>
    </CalmEntry>
  );
}