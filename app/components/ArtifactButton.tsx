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
  description?: string; // New Prop
}

export default function ArtifactButton({ id, link, title, image, category = "Ritual Object", description }: ArtifactProps) {
  const imageUrl = image ? urlFor(image).width(600).url() : null;

  return (
    <div className="group block w-full h-full relative">
      {id && <SaveButton itemId={id} />}
      
      <a 
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col h-full bg-white border border-secondary-bg transition-all duration-500 hover:shadow-xl hover:border-accent-brown/20"
      >
        <div className="relative w-full aspect-[4/5] bg-secondary-bg overflow-hidden flex items-center justify-center p-8">
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
            <div className="text-accent-brown/30 font-serif-title italic text-center px-4">
              [Totemic Object]
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-grow text-center">
          <span className="block font-sans-body text-[10px] uppercase tracking-[0.2em] text-accent-brown mb-3">
            {category}
          </span>

          <h4 className="font-serif-title text-xl text-brand-ink mb-3 leading-tight group-hover:text-accent-brown transition-colors line-clamp-2">
            {title}
          </h4>

          {/* NEW: Description Text */}
          <p className="font-sans-body text-[11px] text-brand-ink/60 mb-6 leading-relaxed line-clamp-3 px-2">
            {description || "A souvenir of meaning."}
          </p>

          <div className="mt-auto pt-4 border-t border-secondary-bg/50 flex justify-center">
            <div className="flex items-center space-x-2 text-xs font-sans-body uppercase tracking-wider text-brand-ink border-b border-transparent group-hover:border-accent-brown group-hover:text-accent-brown transition-all pb-0.5">
              <span>Acquire the Artifact</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}