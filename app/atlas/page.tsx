'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { client } from '@/lib/sanity'; // Import Sanity Client
import CalmEntry from '../components/CalmEntry';
import MoodFilter from '../components/MoodFilter';
import SignalCard from '../components/SignalCard';
import ArtifactVault from '../components/ArtifactVault';
import MasonryGrid from '../components/MasonryGrid';
import CalmGridItem from '../components/CalmGridItem';

// 1. The Data Fetching Logic (Client-Side for dynamic filtering)
// In a real optimized app, you might fetch this server-side and pass it down, 
// but this is the simplest way to get "Live" data working now.
const query = `*[_type == "issue"] {
  "id": _id,
  "studio": signalStudio,
  "title": signalContext, 
  "mood": moodTags[0]->title, 
  "image": signalImages[0].asset->url
}`;

async function getSignals() {
  return await client.fetch(query);
}

// Get unique moods from the data
async function getMoods() {
    return await client.fetch(`*[_type == "mood"]{title}`);
}

export default function AtlasPage() {
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [availableMoods, setAvailableMoods] = useState<string[]>([]);

  // Fetch Data on Load
  useEffect(() => {
    getSignals().then(setSignals);
    getMoods().then(data => setAvailableMoods(data.map((m: any) => m.title)));
  }, []);

  // Filter Logic
  const filteredSignals = activeMood 
    ? signals.filter(s => s.mood === activeMood)
    : signals;

  const handleMoodSelect = (mood: string) => {
    setActiveMood(prev => (prev === mood ? null : mood));
  };

  return (
    <CalmEntry>
      <main className="min-h-screen bg-primary-bg">
        
        {/* 1. Header */}
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

        {/* 2. Atmospheric Search */}
        <div className="sticky top-0 z-40 bg-primary-bg/95 backdrop-blur-md border-b border-accent-brown/5 transition-all">
          <MoodFilter 
            moods={availableMoods} 
            activeMood={activeMood}
            onMoodSelect={handleMoodSelect}
          />
        </div>

        {/* 3. Masonry Grid (Live Data) */}
        <section className="py-20 min-h-[60vh]">
           <MasonryGrid>
             <AnimatePresence mode='popLayout'>
               {filteredSignals.map((signal) => (
                 <CalmGridItem key={signal.id}>
                   <SignalCard 
                     studio={signal.studio}
                     title={signal.title} // Using 'context' as the short description
                     mood={signal.mood}
                     image={signal.image}
                     heightClass="aspect-[3/4]" // Default height for simplicity
                   />
                 </CalmGridItem>
               ))}
             </AnimatePresence>
             
             {filteredSignals.length === 0 && (
               <div className="col-span-full py-32 text-center">
                 <p className="font-serif-title text-2xl text-accent-brown/50 italic">
                   {signals.length === 0 ? "Loading Archive..." : "No signals found for this mood."}
                 </p>
               </div>
             )}
           </MasonryGrid>
        </section>

        {/* 4. Artifact Vault */}
        <div className="border-t border-accent-brown/10">
          <ArtifactVault />
        </div>

      </main>
    </CalmEntry>
  );
}