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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Atlas: Starting Data Fetch...");
        
        const [signalData, moodData] = await Promise.all([
          client.fetch(query),
          client.fetch(`*[_type == "mood"] | order(title asc) {title}`)
        ]);

        console.log("Atlas: Signals Fetched:", signalData);
        console.log("Atlas: Moods Fetched:", moodData);

        if (!moodData || moodData.length === 0) {
          console.warn("Atlas: No moods returned from Sanity!");
        }

        setSignals(signalData);
        
        // Robust mapping: handle nulls/undefined safely
        const moodStrings = moodData
          .map((m: any) => m.title)
          .filter((t: any) => typeof t === 'string' && t.length > 0);
          
        console.log("Atlas: Final Mood Strings:", moodStrings);
        setAvailableMoods(moodStrings);
        setIsLoading(false);

      } catch (err: any) {
        console.error("Atlas Fetch Error:", err);
        setError(err.message || "Failed to load Atlas data.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSignals = activeMood 
    ? signals.filter(s => s.mood === activeMood)
    : signals;

  const handleMoodSelect = (mood: string) => {
    setActiveMood(prev => (prev === mood ? null : mood));
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-sans-body">
        Error loading Atlas: {error}
      </div>
    );
  }

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
                     image={signal.image || ""} 
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