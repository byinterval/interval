'use client';
    import { useState } from 'react';
    import ArtifactButton from './ArtifactButton';

    const filters = ["All", "Read", "Listen", "View", "Acquire"];

    export default function ArtifactVault() {
      const [activeFilter, setActiveFilter] = useState("All");

      // Static Data for Vault
      const artifacts = [
        { title: "In Praise of Shadows", category: "Read", link: "#" },
        { title: "ECM: Silence", category: "Listen", link: "#" },
        { title: "Hiba Wood Incense", category: "Acquire", link: "#" },
        { title: "The Eyes of the Skin", category: "Read", link: "#" },
      ];

      return (
        <section className="mt-32 border-t border-secondary-bg pt-24 pb-32">
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
            {artifacts.map((item, i) => (
              <div key={i} className="flex flex-col group">
                 <ArtifactButton title={item.title} link={item.link} />
                 <span className="mt-3 font-sans-body text-[10px] uppercase tracking-widest text-accent-brown/50 pl-1 group-hover:text-accent-brown transition-colors">
                   {item.category}
                 </span>
              </div>
            ))}
          </div>
        </section>
      );
    }