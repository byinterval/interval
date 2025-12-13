'use client';
import Image from 'next/image';
import SaveButton from './SaveButton'; 

interface SignalProps {
  title: string;
  studio: string;
  mood: string;
  image: string; // FIX: Added this property to resolve the error
  heightClass?: string;
}

export default function SignalCard({ 
  title, 
  studio, 
  mood, 
  image, 
  heightClass = "aspect-[3/4]" 
}: SignalProps) {
  return (
    <div className="relative group w-full break-inside-avoid mb-6">
      {/* 1. The Container */}
      <div className={`relative w-full overflow-hidden bg-secondary-bg ${heightClass} cursor-pointer`}>
        
        {/* 2. The Visual Evidence (Now using Next.js Image) */}
        <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-[800ms] ease-out">
            <Image 
              src={image} 
              alt={`Visual evidence for ${studio}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Darkens image slightly to ensure text legibility if needed, though Scrim handles most of it */}
            <div className="absolute inset-0 bg-brand-ink/10 mix-blend-multiply" />
        </div>

        {/* 3. The "Save" Action (Always visible) */}
        <SaveButton />

        {/* 4. The Scrim Overlay (Reveals on Hover) */}
        <div className="absolute inset-0 bg-brand-ink/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-10">
            
            {/* The Text Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 text-primary-bg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                
                {/* Metadata */}
                <span className="inline-block font-sans-body text-[10px] uppercase tracking-[0.2em] mb-2 border-b border-primary-bg/30 pb-1">
                    {mood}
                </span>
                
                {/* Title */}
                <h3 className="font-serif-title text-2xl leading-tight mb-1">
                    {studio}
                </h3>
                
                {/* Description */}
                <p className="font-sans-body text-xs opacity-90 line-clamp-2">
                    {title}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}