'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { client } from '@/lib/sanity';
import { urlFor } from '@/lib/image'; 
import { useMember } from '@/app/hooks/useMember'; // Auth Hook
import CalmEntry from '@/app/components/CalmEntry';
import MoodFilter from '@/app/components/MoodFilter';
import SignalCard from '@/app/components/SignalCard';
import ArtifactVault from '@/app/components/ArtifactVault';
import MasonryGrid from '@/app/components/MasonryGrid';
import CalmGridItem from '@/app/components/CalmGridItem';
import Link from 'next/link';

// Query to fetch all necessary data
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
    "link": link,
    image 
  }
}`;

export default function AtlasPage() {
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [availableMoods, setAvailableMoods] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { isAuthenticated } = useMember(); // Check Auth

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

        const processedArtifacts = issueData
          .map((s: any) => s.artifact)
          .filter((a: any) => a !== null);

        setSignals(processedSignals);
        setArtifacts(processedArtifacts);
        
        const moodStrings = moodData
          .map((m: any) => m.title)
          .filter((t: any) => typeof t === 'string' && t.length > 0);
          
        setAvailableMoods(moodStrings);
        setIsLoading(false);

      } catch (err: any) {
        console.error("Atlas Fetch Error:", err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSignals = activeMood 
    ? signals.filter(s => s.mood === activeMood)
    : signals;

  // Filter artifacts based on issues that match the mood (approximate logic for demo)
  // In a real app, artifacts would be tagged with moods too.
  const artifactCount = activeMood ? Math.floor(filteredSignals.length / 2) : artifacts.length;

  const handleMoodSelect = (mood: string) => {
    // Allows selection even if not authenticated to trigger "Demo Mode" view
    setActiveMood(prev => (prev === mood ? null : mood));
  };

  return (
    <CalmEntry>
      <main className="min-h-screen bg-primary-bg relative">
        <header className="pt-32 pb-16 text-center px-6">
          <span className="font-sans-body text-xs text-accent-brown uppercase tracking-[0.2em] mb-6 block">
            The Digital Archive
          </span>
          <h1 className="font-serif-title text-6xl md:text-7xl lg:text-8xl text-brand-ink mb-8 tracking-tight">
            The Living Atlas
          </h1>
        </header>

        {/* SEARCH BAR (Always Visible) */}
        <div className="sticky top-0 z-40 bg-primary-bg/95 backdrop-blur-md border-b border-accent-brown/5 transition-all">
          <MoodFilter 
            moods={availableMoods} 
            activeMood={activeMood}
            onMoodSelect={handleMoodSelect}
          />
        </div>

        {/* THE DEMO BLOCKER - UPDATED LOGIC */}
        {/* If user selects a mood AND is not authenticated, show the grid underneath but block interaction */}
        {activeMood && !isAuthenticated && (
            <>
                {/* 1. The Overlay Barrier */}
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-auto">
                    {/* Backdrop Blur to obscure detail but show volume */}
                    <div className="absolute inset-0 bg-primary-bg/60 backdrop-blur-sm" onClick={() => setActiveMood(null)} />
                    
                    {/* The Lock Card */}
                    <div className="relative max-w-md w-full bg-white border border-accent-brown/20 p-12 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-500">
                        <span className="inline-block mb-6 p-3 rounded-full bg-accent-brown/5 text-accent-brown">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                            </svg>
                        </span>
                        
                        <p className="font-sans-body text-xs text-accent-brown uppercase tracking-widest mb-2">
                            Search Results Locked
                        </p>
                        
                        <h3 className="font-serif-title text-3xl text-brand-ink mb-4 leading-tight">
                            {filteredSignals.length} Signals and {artifactCount} Artifacts curated for <br/>
                            <span className="italic text-accent-brown">'{activeMood}'</span>
                        </h3>
                        
                        <p className="font-sans-body text-sm text-brand-ink/60 mb-8 leading-relaxed">
                            This taxonomy and the curated artifacts within it are reserved for Founding Members.
                        </p>
                        
                        <div className="space-y-4">
                            <Link 
                                href="/signup"
                                className="block w-full bg-brand-ink text-primary-bg py-4 font-sans-body text-xs uppercase tracking-widest hover:bg-accent-brown transition-colors"
                            >
                                Unlock the Archive
                            </Link>
                            <button 
                                onClick={() => setActiveMood(null)}
                                className="text-xs text-brand-ink/40 hover:text-brand-ink uppercase tracking-widest border-b border-transparent hover:border-brand-ink pb-0.5 transition-colors"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            </>
        )}

        {/* 2. The Grid (Rendered but unreachable if locked) */}
        <section className={`py-20 min-h-[60vh] transition-all duration-500 ${activeMood && !isAuthenticated ? 'opacity-40 pointer-events-none filter blur-[2px]' : ''}`}>
           <MasonryGrid>
             <AnimatePresence mode='popLayout'>
               {filteredSignals.map((signal) => (
                 <CalmGridItem key={signal.id}>
                   <SignalCard 
                     id={signal.id} 
                     studio={signal.studio || "Studio"}
                     title={signal.title || "No description"}
                     mood={signal.mood || "General"}
                     image={signal.image || ""} 
                     heightClass="aspect-[3/4]"
                   />
                 </CalmGridItem>
               ))}
             </AnimatePresence>
             {/* ... empty state logic ... */}
           </MasonryGrid>
        </section>

        <div className={`border-t border-accent-brown/10 transition-opacity duration-500 ${activeMood && !isAuthenticated ? 'opacity-20' : ''}`}>
          <ArtifactVault artifacts={artifacts} />
        </div>
      </main>
    </CalmEntry>
  );
}