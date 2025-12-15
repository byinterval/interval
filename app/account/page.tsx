'use client';
import { useState, useEffect } from 'react';
import { client } from '@/lib/sanity'; 
import { urlFor } from '@/lib/image'; 
import IdentitySidebar from '@/app/components/account/IdentitySidebar';
import VaultFilter from '@/app/components/account/VaultFilter';
import VaultCard from '@/app/components/account/VaultCard';
import QuickLookDrawer from '@/app/components/account/QuickLookDrawer';
import MasonryGrid from '@/app/components/MasonryGrid'; 

// Interface
interface VaultItem {
  id: string;
  type: 'signal' | 'artifact';
  title: string;
  subtitle: string;
  meta: string;
  image: string;
}

export default function AccountPage() {
  const [activeFilter, setActiveFilter] = useState("All Saved");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH LIVE DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Query Signals (Issues) and Artifacts
        const query = `{
          "signals": *[_type == "issue"] | order(issueNumber desc) {
            _id,
            signalStudio,
            "city": cityTag->name,
            "mood": moodTags[0]->title,
            signalImages,
            coverImage
          },
          "artifacts": *[_type == "artifact"] {
            _id,
            title,
            category,
            image,
            subtitle
          }
        }`;

        const data = await client.fetch(query);

        // 1. Process Signals
        const processedSignals = data.signals.map((s: any) => {
          const rawImage = s.signalImages?.[0] || s.coverImage;
          const imageUrl = rawImage ? urlFor(rawImage).width(800).url() : "";

          return {
            id: s._id,
            type: 'signal',
            title: s.signalStudio || "Untitled Studio",
            subtitle: "Studio Profile", 
            meta: `${s.city || 'Global'} • ${s.mood || 'Atmosphere'}`,
            image: imageUrl
          };
        });

        // 2. Process Artifacts
        const processedArtifacts = data.artifacts.map((a: any) => {
          const imageUrl = a.image ? urlFor(a.image).width(800).url() : "";
          
          return {
            id: a._id,
            type: 'artifact',
            title: a.title,
            subtitle: a.category || "Object",
            meta: "Acquired",
            image: imageUrl
          };
        });

        setVaultItems([...processedSignals, ...processedArtifacts]);
        setIsLoading(false);

      } catch (error) {
        console.error("Vault Fetch Error", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredItems = activeFilter === "All Saved" 
    ? vaultItems 
    : vaultItems.filter(item => {
        if (activeFilter === "Signals") return item.type === 'signal';
        if (activeFilter === "Artifacts") return item.type === 'artifact';
        return true;
      });

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col md:flex-row">
      <IdentitySidebar />

      <main className="flex-1 w-full">
        <VaultFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        
        <div className="px-6 md:px-12 pb-32">
          {isLoading ? (
             <div className="text-center py-32 opacity-50 font-sans-body text-xs uppercase tracking-widest animate-pulse">
               Loading your collection...
             </div>
          ) : filteredItems.length > 0 ? (
            <MasonryGrid>
              {filteredItems.map((item) => (
                <VaultCard 
                  key={item.id} 
                  item={item} 
                  onClick={() => setSelectedItem(item)} 
                />
              ))}
            </MasonryGrid>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center opacity-60">
              <p className="font-serif-title text-2xl text-brand-ink mb-2">Your Vault is empty.</p>
              <p className="font-sans-body text-xs text-accent-brown uppercase tracking-widest">Start building your library in The Atlas.</p>
            </div>
          )}
        </div>
      </main>

      <QuickLookDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}