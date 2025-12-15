'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { client } from '@/lib/sanity';
import { urlFor } from '@/lib/image'; 
import CalmEntry from '@/app/components/CalmEntry';
import MoodFilter from '@/app/components/MoodFilter';
import SignalCard from '@/app/components/SignalCard';
import ArtifactVault from '@/app/components/ArtifactVault';
import MasonryGrid from '@/app/components/MasonryGrid';
import CalmGridItem from '@/app/components/CalmGridItem';

// QUERY UPDATE: Fetch artifacts alongside signals
const query = `*[_type == "issue"] | order(issueNumber desc) {
  _id,
  signalStudio,
  signalContext,
  "mood": moodTags[0]->title,
  signalImages, 
  coverImage,
  signalMaterial,
  "artifact": linkedArtifact->{
    "id": _id,
    title,
    category,
    "link": link
  }
}`;

export default function AtlasPage() {
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [artifacts, setArtifacts] = useState<any[]>([]); // New State
  const [availableMoods, setAvailableMoods] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [issueData, moodData] = await Promise.all([
          client.fetch(query),
          client.fetch(`*[_type == "mood"] | order(title asc) {title}`)
        ]);

        const processedSignals = issueData.map((s: any) => {
          let rawImage = null;
          if (s.signalImages && Array.isArray(s.signalImages) && s.signalImages.length > 0) {
            rawImage = s.signalImages[0];
          } else if (s.coverImage) {
            rawImage = s.coverImage;
          }

          let imageUrl = null;
          if (rawImage) {
            try {
              imageUrl = urlFor(rawImage).width(800).url();
            } catch (e) {
              console.error("Error generating URL:", e);
            }
          }

          return {
            id: s._id,
            studio: s.signalStudio,
            title: s.signalContext,
            mood: s.mood,
            image: imageUrl,
            material: s.signalMaterial
          };
        });

        // Extract Artifacts from Issues
        const processedArtifacts = issueData
          .map((s: any) => s.artifact)
          .filter((a: any) => a !== null); // Filter out issues without artifacts

        setSignals(processedSignals);
        setArtifacts(processedArtifacts); // Set state
        
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

  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

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
               <div className="col-span-full py-32 text-center text-accent-brown/50">
                 No signals found.
               </div>
             )}
           </MasonryGrid>
        </section>

        <div className="border-t border-accent-brown/10">
          {/* Pass the live artifacts data */}
          <ArtifactVault artifacts={artifacts} />
        </div>
      </main>
    </CalmEntry>
  );
}