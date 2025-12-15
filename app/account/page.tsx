'use client';
import { useState } from 'react';
import IdentitySidebar from '../components/account/IdentitySidebar';
import VaultFilter from '../components/account/VaultFilter';
import VaultCard from '../components/account/VaultCard';
import QuickLookDrawer from '../components/account/QuickLookDrawer';
import MasonryGrid from '../components/MasonryGrid'; // Reuse existing masonry

// Mock Data for the Vault
const savedItems = [
  { id: '1', type: 'signal', title: 'Studio O', subtitle: 'Lighting Design', meta: 'Tokyo • Silence', image: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?q=80&w=800' },
  { id: '2', type: 'artifact', title: 'In Praise of Shadows', subtitle: 'Book', meta: 'Acquired', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800' },
  { id: '3', type: 'signal', title: 'Ryokan Z', subtitle: 'Hospitality', meta: 'Kyoto • Texture', image: 'https://images.unsplash.com/photo-1598337633293-189f76f7f631?q=80&w=800' },
  { id: '4', type: 'artifact', title: 'Hiba Wood Incense', subtitle: 'Object', meta: 'Saved', image: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=800' },
];

export default function AccountPage() {
  const [activeFilter, setActiveFilter] = useState("All Saved");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Filter Logic
  const filteredItems = activeFilter === "All Saved" 
    ? savedItems 
    : savedItems.filter(item => {
        if (activeFilter === "Signals") return item.type === 'signal';
        if (activeFilter === "Artifacts") return item.type === 'artifact';
        return true;
      });

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col md:flex-row">
      {/* LEFT: Identity Sidebar (Sticky) */}
      <IdentitySidebar />

      {/* RIGHT: The Vault (Fluid) */}
      <main className="flex-1 w-full">
        <VaultFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        
        <div className="px-6 md:px-12 pb-32">
          {filteredItems.length > 0 ? (
            <MasonryGrid>
              {filteredItems.map((item) => (
                // @ts-ignore
                <VaultCard 
                  key={item.id} 
                  item={item as any} 
                  onClick={() => setSelectedItem(item)} 
                />
              ))}
            </MasonryGrid>
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-32 text-center opacity-60">
              <p className="font-serif-title text-2xl text-brand-ink mb-2">Your Vault is empty.</p>
              <p className="font-sans-body text-xs text-accent-brown uppercase tracking-widest">Start building your library in The Atlas.</p>
            </div>
          )}
        </div>
      </main>

      {/* Interaction: Quick Look Drawer */}
      <QuickLookDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}