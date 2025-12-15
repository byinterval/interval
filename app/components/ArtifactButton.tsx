'use client';
import { urlFor } from '@/lib/image';
import Image from 'next/image';

interface ArtifactProps {
  title: string;
  link: string;
  image?: any;
  category?: string;
}

export default function ArtifactButton({ link, title, image, category = "Ritual Object" }: ArtifactProps) {
  // Generate URL if image object exists
  const imageUrl = image ? urlFor(image).width(600).url() : null;

  return (
    <a 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full h-full"
    >
      <div className="flex flex-col h-full bg-white border border-secondary-bg transition-all duration-500 hover:shadow-xl hover:border-accent-brown/20">
        
        {/* 1. Visual: High-Fidelity Product Shot (Soft Gray Background) */}
        <div className="relative w-full aspect-square bg-secondary-bg overflow-hidden flex items-center justify-center p-8">
          {imageUrl ? (
            <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-105">
               <Image 
                 src={imageUrl} 
                 alt={title}
                 fill
                 className="object-contain drop-shadow-md" 
               />
            </div>
          ) : (
            <div className="text-accent-brown/30 font-serif-title italic text-center px-4">
              [Totemic Object]
            </div>
          )}
        </div>

        {/* 2. Text Content (Museum Placard Style) */}
        <div className="p-6 flex flex-col flex-grow text-center">
          
          <span className="block font-sans-body text-[10px] uppercase tracking-[0.2em] text-accent-brown mb-3">
            {category}
          </span>

          <h4 className="font-serif-title text-xl text-brand-ink mb-2 leading-tight group-hover:text-accent-brown transition-colors">
            {title}
          </h4>

          <p className="font-sans-body text-[10px] text-brand-ink/50 mb-6 uppercase tracking-widest">
            A souvenir of meaning
          </p>

          {/* 3. The Button (Discreet Action) */}
          <div className="mt-auto pt-4 border-t border-secondary-bg/50 flex justify-center">
            <div className="flex items-center space-x-2 text-xs font-sans-body uppercase tracking-wider text-brand-ink border-b border-transparent group-hover:border-accent-brown group-hover:text-accent-brown transition-all pb-0.5">
              <span>Acquire the Artifact</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}