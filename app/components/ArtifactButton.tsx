'use client';
import { urlFor } from '@/lib/image';
import Image from 'next/image';
import SaveButton from './SaveButton'; 

interface ArtifactProps {
  id?: string;
  title: string;
  link: string;
  image?: any;
  category?: string;
  description?: string; 
}

export default function ArtifactButton({ id, link, title, image, category = "Ritual Object", description }: ArtifactProps) {
  // Generate URL if image object exists
  const imageUrl = image ? urlFor(image).width(600).url() : null;

  return (
    <div className="group block w-full h-full relative">
      {id && <SaveButton itemId={id} />}
      
      <a 
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        // FIX: Force white background and dark text to prevent Dark Mode inversion issues
        className="flex flex-col h-full bg-[#FFFFFF] border border-[#E5E5E5] transition-all duration-500 hover:shadow-xl hover:border-[#5D514C]/20"
      >
        
        {/* 1. Visual: High-Fidelity Product Shot (Soft Gray Background) */}
        {/* We use a specific light gray hex so it doesn't turn dark */}
        <div className="relative w-full aspect-[4/5] bg-[#F2F2F2] overflow-hidden flex items-center justify-center p-8">
          {imageUrl ? (
            <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-105">
               <Image 
                 src={imageUrl} 
                 alt={title}
                 fill
                 className="object-contain drop-shadow-lg" 
               />
            </div>
          ) : (
            <div className="text-[#5D514C]/30 font-serif-title italic text-center px-4">
              [Totemic Object]
            </div>
          )}
        </div>

        {/* 2. Text Content (Museum Placard Style) */}
        <div className="p-6 flex flex-col flex-grow text-center">
          
          {/* Label - Enforce Accent Brown */}
          <span className="block font-sans-body text-[10px] uppercase tracking-[0.2em] text-[#5D514C] mb-3">
            {category}
          </span>

          {/* Title - Enforce Dark Ink */}
          <h4 className="font-serif-title text-xl text-[#1A1A1A] mb-3 leading-tight group-hover:text-[#5D514C] transition-colors line-clamp-2">
            {title}
          </h4>

          {/* Description - Enforce Dark Ink with Opacity */}
          <p className="font-sans-body text-[11px] text-[#1A1A1A]/60 mb-6 leading-relaxed line-clamp-3 px-2">
            {description || "A souvenir of meaning."}
          </p>

          {/* 3. The Button (Discreet Action) */}
          <div className="mt-auto pt-4 border-t border-[#E5E5E5] flex justify-center">
            <div className="flex items-center space-x-2 text-xs font-sans-body uppercase tracking-wider text-[#1A1A1A] border-b border-transparent group-hover:border-[#5D514C] group-hover:text-[#5D514C] transition-all pb-0.5">
              <span>Acquire the Artifact</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}