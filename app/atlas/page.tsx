'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { client } from '@/lib/sanity';
import CalmEntry from '@/app/components/CalmEntry';
import MoodFilter from '@/app/components/MoodFilter';
import SignalCard from '@/app/components/SignalCard';
import ArtifactVault from '@/app/components/ArtifactVault';
import MasonryGrid from '@/app/components/MasonryGrid';
import CalmGridItem from '@/app/components/CalmGridItem';

// FIXED QUERY: Simplified projection to avoid syntax errors
const query = `*[_type == "issue"] | order(issueNumber desc) {
  _id,
  signalStudio,
  signalContext,
  "mood": moodTags[0]->title,
  "imageUrl": signalImages[0].asset->url,
  signalMaterial
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

        // Map the raw Sanity data to the structure SignalCard expects
        const processedSignals = signalData.map((s: any) => ({
          id: s._id,
          studio: s.signalStudio,
          title: s.signalContext,
          mood: s.mood,
          image: s.imageUrl,
          material: s.signalMaterial
        }));

        setSignals(processedSignals);
        
        const moodStrings = moodData
          .map((m: any) => m.title)
          .filter((t: any) => typeof t === 'string' && t.length > 0);
          
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
    const isCorsError = error.includes("Request error") || error.includes("NetworkError");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-primary-bg">
        <div className="max-w-xl">
          <p className="font-serif-title text-2xl text-red-600 mb-4">Connection Failed</p>
          <p className="font-sans-body text-brand-ink mb-8">
            {isCorsError 
              ? "Your website is blocked from accessing the Sanity database. This is a security setting called CORS." 
              : `Error: ${error}`}
          </p>
          
          {isCorsError && (
            <div className="bg-white p-8 border border-accent-brown/20 rounded-sm text-left shadow-sm">
              <p className="font-bold text-accent-brown text-sm uppercase tracking-widest mb-4">How to Fix (Required):</p>
              <ol className="list-decimal list-inside space-y-3 text-sm text-brand-ink/80 font-sans-body">
                <li>Go to <a href="https://sanity.io/manage" target="_blank" rel="noreferrer" className="underline text-accent-brown">sanity.io/manage</a></li>
                <li>Select your project (<strong>nd9as5hh</strong>)</li>
                <li>Go to <strong>API</strong> &rarr; <strong>CORS Origins</strong></li>
                <li>Click <strong>Add CORS Origin</strong></li>
                <li>Paste your Vercel URL (e.g., https://your-project.vercel.app)</li>
                <li><strong>IMPORTANT:</strong> Check the box "Allow credentials"</li>
                <li>Click Save and refresh this page.</li>
              </ol>
            </div>
          )}
        </div>
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