'use client';
import { useState } from 'react';
import ArtifactButton from './ArtifactButton';

const filters = ["All", "Read", "Listen", "View", "Acquire"];

// Define the shape of the incoming artifact data
interface Artifact {
  id: string;
  title: string;
  category: string;
  link: string;
}

interface VaultProps {
  artifacts: Artifact[];
}

export default function ArtifactVault({ artifacts }: VaultProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  // Filter Logic
  const filteredArtifacts = activeFilter === "All" 
    ? artifacts 
    : artifacts.filter(a => a.category === activeFilter.toLowerCase());

  return (
    <section className="mt-32 border-t border-secondary-bg pt-24 pb-32 px-6 md:px-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <span className="font-sans-body text-xs uppercase tracking-widest text-accent-brown block mb-3">
            The Collection
          </span>
          <h2 className="font-serif-title text-4xl text-brand-ink">
            Artifact Vault
          </h2>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-4 font-sans-body text-xs uppercase tracking-wider text-accent-brown/60">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`transition-all duration-300 ${
                activeFilter === filter 
                ? "text-accent-brown border-b border-accent-brown pb-1" 
                : "hover:text-accent-brown"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredArtifacts.length > 0 ? (
          filteredArtifacts.map((item) => (
            <div key={item.id} className="flex flex-col group">
               <ArtifactButton title={item.title} link={item.link} />
               <span className="mt-3 font-sans-body text-[10px] uppercase tracking-widest text-accent-brown/50 pl-1 group-hover:text-accent-brown transition-colors">
                 {item.category || "Uncategorized"}
               </span>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-accent-brown/40 italic">
            No artifacts found for this filter.
          </div>
        )}
      </div>
    </section>
  );
}