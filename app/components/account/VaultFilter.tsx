'use client';

interface FilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = ["All Saved", "Signals", "Artifacts", "Thesis"];

export default function VaultFilter({ activeFilter, onFilterChange }: FilterProps) {
  return (
    <div className="sticky top-0 z-20 bg-primary-bg/95 backdrop-blur-sm border-b border-accent-brown/10 pt-8 pb-4 mb-8 flex justify-between items-end px-6 md:px-12">
      {/* Taxonomy Tabs */}
      <div className="flex space-x-8 overflow-x-auto no-scrollbar">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`font-sans-body text-xs uppercase tracking-widest pb-2 transition-all duration-300 whitespace-nowrap ${
              activeFilter === filter
                ? "text-accent-brown border-b border-accent-brown"
                : "text-accent-brown/40 hover:text-accent-brown"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Pro Feature: Export */}
      <button className="hidden md:flex items-center space-x-2 text-accent-brown/60 hover:text-brand-ink transition-colors pb-2">
        <span className="font-sans-body text-[10px] uppercase tracking-widest">Export List</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      </button>
    </div>
  );
}