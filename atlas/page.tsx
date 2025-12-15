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

const query = `*[_type == "issue"] | order(issueNumber desc) {
  "id": _id,
  "studio": signalStudio,
  "title": signalContext, 
  "mood": moodTags[0]->title, 
  "image": signalImages[0].asset->url,
  "material": signalMaterial
}`;

export default function AtlasPage() {
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [availableMoods, setAvailableMoods] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Atlas: Starting Data Fetch...");
        
        // Fetch Signals and Moods in parallel
        const [signalData, moodData] = await Promise.all([
          client.fetch(query),
          client.fetch(`*[_type == "mood"] | order(title asc) {title}`)
        ]);

        console.log("Atlas: Raw Signal Data:", signalData);
        console.log("Atlas: Raw Mood Data:", moodData);

        // Process Moods: Ensure we get a flat array of strings
        // Sanity returns [{title: "Rain"}, {title: "Silence"}]
        // We want ["Rain", "Silence"]
        const moodStrings = moodData
          .map((m: any) => m.title)
          .filter((t: any) => typeof t === 'string' && t.trim() !== '');
          
        console.log("Atlas: Processed Mood Strings:", moodStrings);

        if (moodStrings.length === 0) {
          console.warn("Atlas: No valid mood strings found even after processing.");
        }

        setSignals(signalData);
        setAvailableMoods(moodStrings);
        setIsLoading(false);

      } catch (err) {
        console.error("Atlas Fetch Error:", err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSignals = activeMood 
    ? signals.filter(s => s.mood === activeMood)
    : signals;

  const handleMoodSelect = (mood: string) => {
    console.log("Atlas: Mood Selected:", mood);
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

        {/* Sticky Filter Container */}
        <div className="sticky top-0 z-40 bg-primary-bg/95 backdrop-blur-md border-b border-accent-brown/5 transition-all">
          {/* Render MoodFilter even if empty to show fallback message */}
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
                     image={signal.image || ""} 
                     heightClass="aspect-[3/4]"
                   />
                 </CalmGridItem>
               ))}
             </AnimatePresence>
             
             {!isLoading && filteredSignals.length === 0 && (
               <div className="col-span-full py-32 text-center">
                 <p className="font-serif-title text-2xl text-accent-brown/50 italic">
                   {signals.length === 0 ? "Archive is empty." : `No signals found for "${activeMood}".`}
                 </p>
               </div>
             )}
             
             {isLoading && (
               <div className="col-span-full py-32 text-center">
                  <span className="font-sans-body text-xs uppercase tracking-widest animate-pulse">
                    Loading Atlas...
                  </span>
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