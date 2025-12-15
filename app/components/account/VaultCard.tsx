'use client';
import Image from 'next/image';

interface VaultItem {
  id: string;
  type: 'signal' | 'artifact';
  title: string;
  subtitle: string; // Studio Name (Signal) or Category (Artifact)
  meta: string; // Location/Mood (Signal) or "Acquired" status (Artifact)
  image: string;
}

export default function VaultCard({ item, onClick }: { item: VaultItem; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer break-inside-avoid mb-8"
    >
      {/* Visual Container */}
      <div className={`relative w-full overflow-hidden bg-secondary-bg mb-4 ${
        item.type === 'signal' ? 'aspect-[3/4]' : 'aspect-square p-8' // Artifacts get padding (Totemic look)
      }`}>
        <div className={`relative w-full h-full transition-transform duration-700 group-hover:scale-105`}>
           <Image 
             src={item.image} 
             alt={item.title} 
             fill 
             className={item.type === 'signal' ? 'object-cover' : 'object-contain drop-shadow-md'}
           />
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-brand-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Meta-Data */}
      <div className="space-y-1">
        <h4 className="font-serif-title text-lg leading-tight text-brand-ink group-hover:text-accent-brown transition-colors">
          {item.title}
        </h4>
        <div className="flex justify-between items-center border-t border-accent-brown/10 pt-2 mt-2">
          <span className="font-sans-body text-[10px] uppercase tracking-widest text-brand-ink">
            {item.subtitle}
          </span>
          {item.type === 'artifact' ? (
             <div className="flex items-center space-x-1 text-accent-brown/50">
               <div className="w-3 h-3 border border-current rounded-full" />
               <span className="font-sans-body text-[9px] uppercase tracking-wider">Mark Acquired</span>
             </div>
          ) : (
             <span className="font-sans-body text-[9px] uppercase tracking-wider text-accent-brown/60">
               {item.meta}
             </span>
          )}
        </div>
      </div>
    </div>
  );
}