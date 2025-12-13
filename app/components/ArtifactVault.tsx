'use client';
import { useState } from 'react';
import ArtifactButton from './ArtifactButton';

// The specific filters requested in Revision 3
const filters = ["All", "Read", "Listen", "View", "Acquire"];

export default function ArtifactVault() {
  const [activeFilter, setActiveFilter] = useState("All");

  // Mock Data mimicking your Sanity schema
  const artifacts = [
    { title: "In Praise of Shadows", category: "Read", link: "#" },
    { title: "ECM: Silence", category: "Listen", link: "#" },
    { title: "Hiba Wood Incense", category: "Acquire", link: "#" },
    { title: "The Eyes of the Skin", category: "Read", link: "#" },
  ];

  return (
    <section className="mt-32 border-t border-secondary-bg pt-24 pb-32">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <span className="font-sans-body text-xs uppercase tracking-widest text-accent-brown block mb-3">
            The Collection
          </span>
          <h2 className="font-serif-title text-4xl text-brand-ink">
            Artifact Vault
          </h2>
        </div>

        {/* The Filter Interface */}
        <div className="flex flex-wrap gap-x-8 gap-y-4 font-sans-body text-xs uppercase tracking-wider text-accent-brown/60">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`transition-all duration-300 ${
                activeFilter === filter 
                ? "text-accent-brown border-b border-accent-brown pb-1" // Active State
                : "hover:text-accent-brown" // Inactive State
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* The Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {artifacts.map((item, i) => (
          <div key={i} className="flex flex-col group">
             {/* Reuse your high-fidelity card component */}
             <ArtifactButton title={item.title} link={item.link} />
             {/* Category Label below card */}
             <span className="mt-3 font-sans-body text-[10px] uppercase tracking-widest text-accent-brown/50 pl-1 group-hover:text-accent-brown transition-colors">
               {item.category}
             </span>
          </div>
        ))}
      </div>
    </section>
  );
}