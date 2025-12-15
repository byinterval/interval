'use client';
import SanityImage from './SanityImage'; // Import the new robust component
import SaveButton from './SaveButton'; 

interface SignalProps {
  title: string;
  studio: string;
  mood: string;
  image: string;
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
      <div className={`relative w-full overflow-hidden bg-secondary-bg ${heightClass} cursor-pointer`}>
        
        {/* Visual Evidence - Using Robust SanityImage */}
        <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-[800ms] ease-out">
            <SanityImage 
              src={image} 
              alt={`Visual evidence for ${studio}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-brand-ink/10 mix-blend-multiply" />
        </div>

        <SaveButton />

        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-brand-ink/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-10">
            <div className="absolute bottom-0 left-0 w-full p-6 text-primary-bg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                <span className="inline-block font-sans-body text-[10px] uppercase tracking-[0.2em] mb-2 border-b border-primary-bg/30 pb-1">
                    {mood}
                </span>
                <h3 className="font-serif-title text-2xl leading-tight mb-1">
                    {studio}
                </h3>
                <p className="font-sans-body text-xs opacity-90 line-clamp-2">
                    {title}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}