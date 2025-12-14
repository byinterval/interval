'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { client } from '@/lib/sanity';
import CalmEntry from '../components/CalmEntry';
import MoodFilter from '../components/MoodFilter';
import SignalCard from '../components/SignalCard';
import ArtifactVault from '../components/ArtifactVault';
import MasonryGrid from '../components/MasonryGrid';
import CalmGridItem from '../components/CalmGridItem';

// Updated Query: Handles missing images/moods gracefully
const query = `*[_type == "issue"] | order(issueNumber desc) {
  "id": _id,
  "studio": signalStudio,
  "title": signalContext, 
  "mood": moodTags[0]->title, 
  "image": signalImages[0].asset->url
}`;

export default function AtlasPage() {
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [availableMoods, setAvailableMoods] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.fetch(query),
      // Fetch ALL moods, not just those attached to issues, to populate the filter
      client.fetch(`*[_type == "mood"]{title}`)
    ]).then(([signalData, moodData]) => {
      console.log("Atlas Signal Data:", signalData); 
      console.log("Atlas Raw Mood Data:", moodData); // Debugging
      
      setSignals(signalData);
      
      // Ensure we map the array of objects [{title: "Rain"}] to an array of strings ["Rain"]
      const moodStrings = moodData.map((m: any) => m.title).filter(Boolean);
      console.log("Atlas Processed Mood Strings:", moodStrings); // Debugging
      
      setAvailableMoods(moodStrings);
      setIsLoading(false);
    }).catch(err => {
      console.error("Atlas Fetch Error", err);
      setIsLoading(false);
    });
  }, []);

  const filteredSignals = activeMood 
    ? signals.filter(s => s.mood === activeMood)
    : signals;

  const handleMoodSelect = (mood: string) => {
    setActiveMood(prev => (prev === mood ? null : mood));
  };

  return (
    <CalmEntry>
      <main className="min-h-screen bg-primary-bg">
        <header className="pt-32 pb-16 text-center px-6">
          <span className="font-sans-body text-xs text-accent-brown uppercase tracking-[0.2em] mb-6 block">
            The Digital Archive
          </span>
          <h1 className="font-serif-title text-6xl md:text-7xl lg:text-8xl text-brand-ink mb-8 tracking-tight">
            The Living Atlas
          </h1>
        </header>

        <div className="sticky top-0 z-40 bg-primary-bg/95 backdrop-blur-md border-b border-accent-brown/5 transition-all">
          <MoodFilter 
            moods={availableMoods} 
            activeMood={activeMood}
            onMoodSelect={handleMoodSelect}
          />
        </div>

        <section className="py-20 min-h-[60vh]">
           <MasonryGrid>
             <AnimatePresence mode='popLayout'>
               {filteredSignals.map((signal) => (
                 <CalmGridItem key={signal.id}>
                   <SignalCard 
                     studio={signal.studio || "Studio"}
                     title={signal.title || "No description"}
                     mood={signal.mood || "General"}
                     image={signal.image || ""} // Falls back to placeholder in component
                     heightClass="aspect-[3/4]"
                   />
                 </CalmGridItem>
               ))}
             </AnimatePresence>
             
             {!isLoading && filteredSignals.length === 0 && (
               <div className="col-span-full py-32 text-center">
                 <p className="font-serif-title text-2xl text-accent-brown/50 italic">
                   {signals.length === 0 ? "Archive is empty." : "No signals found for this mood."}
                 </p>
               </div>
             )}
           </MasonryGrid>
        </section>

        <div className="border-t border-accent-brown/10">
          <ArtifactVault />
        </div>
      </main>
    </CalmEntry>
  );
}